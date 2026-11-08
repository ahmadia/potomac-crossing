/* Chapter 12: A Spark at the Hedge.
 *
 * The story (docs/chapters/12-a-spark-at-the-hedge.md, Draft v0.4, final) cut into graphic-novel panels, per the
 * frame contract in docs/build.md; its spec (docs/chapters/12-a-spark-at-the-hedge.spec.md, v0.2) is the build's
 * contract for the Counts sets, the art, the pages she taps, the Spanish and the book. Module 2's first chapter: the
 * day after her ceremony, her first day as a warrior. Each frame is one moment: a drawn scene, a written storyboard
 * (`board`) for a future illustrator, short captions, speech balloons and sound effects, and exactly one interaction.
 * Frame ids run in reading order, the order of the story's screens, f001 to f080. No optional scene, no flag set, no
 * frame shown only `when` a flag matches. Where a choice gives each option its own reply on the next screen, each
 * option goes to a frame of its own, lettered, and they meet again (the spec's section 5):
 *   the vouching   f024 → f025a (Tallyheart's words: her ears up, then the thanks, → f027), f025b and f025c (the old
 *                  tom's two answers, → f026, the thanks);
 *   her first words f036 → f037a (“Welcome, Chispapaw.”: the purr and the tail, → f039), f037b (“Ready to work?”,
 *                  → f038) and f037c (“Let’s count something.”, → f038c, “She looks very proud.” first);
 *   the questions  f039 → f040a, f040b (→ f041);
 *   the walk       f050 → f051a, f051b (→ f052) and f052c (Tallyheart's ear, “She heard.”, → f053).
 * So 77 to 80 frames on a reading (the spec's count): 77 for a cat who chooses each first option, 80 for one who
 * takes another at the vouching and at her first words and the first or second on the walk. The light choices (her
 * answer to {Murmur}chime, her question at the hedge, Riffle's news) set nothing and go to the next screen.
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that follows a
 * balloon on one screen of the story opens the next panel, or the panel is split in two (the spec's list), and no
 * panel holds five boxes. A line the story marks [if …] carries a `when`: `specialty` at the hedge (f013: three
 * captions and the friends' balloon) and Riffle's swimmer's line (f062), `ch10Best` in the dry den (f057), `ch2Stone`
 * at bedtime (f071). A speaker's paragraphs in a row are balloons in a row (Glintstar f006, Waffles f012, the little
 * cat f017, Tallyheart f044 and f048; Riffle's two for a swimmer, f062). Speech tags' narration is not lettered (the
 * picture carries “back from patrol”, “she whispers”, “squeaks”, “in her deepest, grumpiest old-tom voice”, “In the
 * next nest”).
 *
 * The Spanish (the spec's section 6, the chapter's one engine feature): a whole Spanish line is a balloon with
 * `lang: 'es'` written in tokens and punctuation only, its English made by the engine and lettered under it (f014's
 * “…once, doce. Doce gatos.”, f061's “¡Ciento treinta y tres!”, f074's “¡A contar!”); a Spanish word in an English line
 * is a token, `{es:galleta}` (f018, f027) and `{es:50}` (f075, f076). Never the engine's own marks (the guillemets) here.
 * The warm-up's echo and the lesson's are the sets' own `echo` (section 2); the paw thing is a skip with `lang: 'es'`.
 *
 * Speakers: the newcomer's balloons are labelled “The little cat” (`name`) from the hedge until Glintstar names her
 * (f014 to f028), “A small voice” for the friends' “Hello.” on f013 (she is not drawn yet), and “Chispapaw” (the page's
 * own label) from the bounce on; her goodnight from across the camp (f072) is off the panel, so it carries `name` and
 * shows no face. Never her home name on a label. Our cat's balloons are labelled with her warrior name by the chapter's
 * `names.player`. The grey tom stays unnamed (“Snoring apprentice”).
 *
 * Staging (the spec's spots, each looked at in a render; the sets owner's notes for the Hollow, the hedge and the
 * store): the midday run is drawn at `day` (the sets owner found every day look right, so no `morning` fallback), her
 * warrior's nest at noon at `morning`, the Old Bridge at `sunset`, the camp and the dens by night under the moon at 16
 * (one evening past chapter 11's, never named). The camp by day carries the Clan (`crowd: true`). At the hedge our cat
 * at `hedge-side`, the little cat at `hedge-gap` and Tallyheart at `hedge-right` (new), three in a row. In the Hollow
 * Tallyheart at `tree` facing left, our cat at HOL_YOU and Chispapaw behind her at `sunpatch-3`, the store's plan and
 * the quick marks in the hollow's fixed box between them. At the store the six at its spots, listed back to front as
 * the sets owner reports their depth. The art draws a layer's cast in the order it is listed, never by depth, so every
 * cast is listed back to front (the fountain top, raised, anywhere; the bounce's first member, for its motion lines,
 * excepted), and the story test checks it on every frame. No two cats touch (the mentor's moment is
 * a dip of the head); no grown cat laughs; Chispapaw's collar and bell are on throughout (`collar: false` is chapter
 * 13's). No Clan cat in coat 3 stands beside her (her cream body is near it: the spec's cast note).
 *
 * The book's entries are one sentence each but the third (two), so every path reads eight sentences in seven entries.
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …) so nothing
 * needs escaping; a word joiner after a leading ellipsis, so it never stands alone at a line's end.
 * tests/story-ch12.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch12.md.
 */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};

  /* One cast member: who, pose, mood, anchor, facing, plus optional extras. */
  function c(who, pose, mood, at, facing, extra) {
    var o = { who: who, pose: pose };
    if (mood) o.mood = mood;
    o.at = at;
    o.facing = facing;
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k];
    return o;
  }
  /* One scene: set, camera, options, cast, effects. */
  function S(set, cam, opts, cast, fx) {
    return { set: set, cam: cam, opts: opts || {}, cast: cast || [], fx: fx || [] };
  }
  function merge(a, b) {
    var o = {}, k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) o[k] = a[k];
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) o[k] = b[k];
    return o;
  }

  // Scene options that stay the same through a place (the spec's shared opts)
  // her warrior's nest (the den's `nest` close-up with {Murmur}chime's next nest, her old nest's things in it, the mist
  // stone on its moss), by noon and by night; the apprentices' den by night (her old nest plain moss)
  var DENW_DAY = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true, miststone: true };
  var DENW_NIGHT = merge(DENW_DAY, { moon: 16 });
  var DEN_APP = { weather: 'clear', moon: 16 };
  // the camp by day with the Clan in it; the camp asleep under the moon
  var CAMP_DAY = { crowd: true };
  var CAMP_NIGHT = { moon: 16 };
  var TOWER = { chime: true };
  // the Training Hollow: her ten claw marks on the leaning tree, glowing as chapters 2 to 11 carry them
  var H12 = { marks: 10, glow: 'auto' };
  // the Old Bridge: the bank (no drag marks, as every chapter after the second), under it, and the back of the dark;
  // the store on the dry den's floor at the story's two numbers
  var BANK = { drag: false };
  var UNDER = { prints: true };
  var BACK = { stones: true, prints: true };
  var STORE175 = { store: 175 };
  var STORE133 = { store: 133 };
  // the memory: her old view through the glass, the Clan tiny in the garden
  var ROOM_MEMORY = { door: 'closed', clan: true };

  // The spots (world units, each set's main composition), each settled in a render:
  // the camp, the front row left of the fountain (chapter 11's RING_YOU and RING_TALLY)
  var RING_YOU = { x: 610, y: 905 };
  var RING_TALLY = { x: 380, y: 900 };
  // the midday count: Glintstar at the fountain's foot, the front row on her right facing her (our cat, Tallyheart,
  // {Murmur}chime), the old tom and two Clan cats behind and beside, every face clear
  var NOON_CLAN = { x: 330, y: 784 };
  var NOON_OLD = { x: 1140, y: 770 };
  var NOON_CLAN2 = { x: 1300, y: 778 };
  var NOON_YOU = { x: 750, y: 904 };
  var NOON_TALLY = { x: 985, y: 906 };
  var NOON_CHIME = { x: 1200, y: 908 };
  // the newcomer in camp: through the hedge beside our cat at the entrance; the vouching (our cat beside her, the old
  // tom in front of the crowd, facing them); the naming (the little cat at the camp's middle, our cat and Tallyheart on
  // her right, Glintstar come down to the fountain's foot); the walk to the Hollow
  var NEW_BESIDE = { x: 470, y: 936 };
  var VOUCH_YOU = { x: 630, y: 905 };
  var VOUCH_OLD = { x: 1140, y: 905 };
  var VOUCH_CLAN = { x: 1000, y: 772 };
  var VOUCH_CLAN2 = { x: 1335, y: 786 };
  var NAME_YOU = { x: 1040, y: 906 };
  var NAME_TALLY = { x: 1270, y: 902 };
  // the purr: the old tom at the camp's left, by the fountain, facing the middle
  var PURR_OLD = { x: 290, y: 792 };
  var WALK_CHISPA = { x: 640, y: 930 };
  var WALK_YOU = { x: 880, y: 930 };
  var WALK_TALLY = { x: 1180, y: 930 };
  // the tower: Tallyheart beside our cat at its foot
  var TOWER_TALLY = { x: 1230, y: 1000 };
  // the Hollow: our cat on the sand facing Tallyheart, the store's plan between them (the sets owner's HOL_YOU)
  var HOL_YOU = { x: 690, y: 892 };
  // the riverbank path: Chispapaw at our cat's heels, copying; Tallyheart up ahead the whole way (f050 to f053: the
  // story's “Up ahead, Tallyheart's ear twitches”; only on f052c, she popped in and out, the review's round)
  var PATH_CHISPA = { x: 560, y: 762 };
  var PATH_TALLY = { x: 1260, y: 764 };
  // the Old Bridge: on the bank, Chispapaw and Tallyheart; under it, Riffle at chapter 6's three-shot spot and the
  // others round him
  var BANK_CHISPA = { x: 560, y: 900 };
  var RIFFLE_UNDER = { x: 400, y: 940 };
  var UNDER_CHISPA = { x: 880, y: 900 };
  var UNDER_TALLY = { x: 1160, y: 896 };
  // her warrior's nest at night: Tallyheart padding past at the close-up's right edge, her face in the panel, a step
  // nearer than the nests and clear of our cat's raised tail (behind them, her head ran out of the close-up's top, or the
  // tail crossed her face: each looked at in a render)
  var PAST = { x: 1280, y: 965, h: 200 };

  /* The cast members who come back, by place. */
  function tally(pose, mood, at, facing, extra) { return c('tallyheart', pose, mood, at, facing, extra); }
  function chispa(pose, mood, at, facing, extra) { return c('chispapaw', pose, mood, at, facing, extra); }
  function you(pose, mood, at, facing, extra) { return c('player', pose, mood, at, facing, extra); }
  // her warrior's nest: {Murmur}chime in the next nest, our cat in her own (listed so: the next nest at the back)
  function nestChime(pose, mood, extra) { return c('murmurchime', pose, mood, 'next-nest', 'right', extra); }
  function nestYou(pose, mood, extra) { return c('player', pose, mood, 'nest', 'left', extra); }
  // the hedge: the little cat at the gap, Tallyheart at the right edge, our cat (listed so: back to front)
  function hedgeYou(pose, mood, extra) { return c('player', pose, mood, 'hedge-side', 'right', extra); }
  function hedgeTally(mood) { return c('tallyheart', 'sit', mood, 'hedge-right', 'left'); }
  // the Hollow: Chispapaw behind our cat, Tallyheart at the tree, our cat on the sand (back to front)
  function hollow(chispaMood, tallyMood, youMood, extra) {
    return [chispa('sit', chispaMood, 'sunpatch-3', 'right'), tally('sit', tallyMood, 'tree', 'left'), you('sit', youMood, HOL_YOU, 'right', extra)];
  }
  // the store, back to front (the sets owner's depth order): {Murmur}chime, Tallyheart, Glintstar, the old tom at the way
  // in, then our cat and Chispapaw at the store's front corners; every cat in the back faces our cat at store-left, who
  // Glintstar speaks to (the review's round: facing right, the spot's way, she turned her back on her)
  function store(o) {
    o = o || {};
    return [c('murmurchime', 'sit', o.chime || 'happy', 'store-back-3', 'left'), tally('sit', o.tally || 'kind', 'store-back-2', 'left'),
      c('glintstar', 'sit', o.glint || 'kind', 'store-back-1', 'left'), c('grizzled', 'sit', o.old || 'neutral', 'way-in', 'left'),
      you('sit', o.you || 'wonder', 'store-left', 'right', o.youExtra), chispa('sit', o.chispa || 'wonder', 'store-right', 'left')];
  }
  // the naming in camp, back to front: Glintstar at the fountain's foot, Tallyheart, our cat, the little cat (the old tom
  // at the camp's left for the purr); the little cat faces Glintstar, or (her fourth entry, 'right') our cat, her mentor,
  // from the moment she is given to her (f036 on: the review's round)
  function naming(o) {
    o = o || {};
    var g = o.glint || ['sit', 'kind'], ch = o.chispa || ['sit', 'wonder'], me = o.me || ['sit', 'happy'], ta = o.tally || ['sit', 'kind'];
    var out = [];
    if (o.old) out.push(c('grizzled', o.old[0], o.old[1], PURR_OLD, 'right', o.old[2]));
    out.push(c('glintstar', g[0], g[1], 'fountain-foot', 'right', g[2]));
    out.push(tally(ta[0], ta[1], NAME_TALLY, 'left', ta[2]));
    out.push(you(me[0], me[1], NAME_YOU, 'left', me[2]));
    out.push(chispa(ch[0], ch[1], 'center', ch[3] || 'left', ch[2]));
    return out;
  }
  // the vouching, back to front: Glintstar on the fountain top (where f022 has her, till f027 brings her down; raised, so
  // anywhere in the order), two Clan cats behind, Tallyheart, our cat beside the little cat, the old tom in front of the
  // crowd, facing them, and the little cat, facing the old tom, or (`chispaFacing: 'left'`) our cat, to thank her
  function vouch(o) {
    o = o || {};
    var clan = o.clan || 'neutral';
    return [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left'),
      c('clancat', 'sit', clan, VOUCH_CLAN, 'left', { variant: 4 }), c('clancat', 'sit', clan, VOUCH_CLAN2, 'left', { variant: 1 }),
      tally('sit', o.tally || 'kind', RING_TALLY, 'right'), you('sit', o.you || 'proud', VOUCH_YOU, 'right'), c('grizzled', 'sit', o.old || 'stern', VOUCH_OLD, 'left'),
      chispa('sit', o.chispa || 'sad', 'center', o.chispaFacing || 'right', o.chispaExtra)];
  }
  // under the Old Bridge with Riffle: Tallyheart further in, Chispapaw, our cat on the mud, Riffle at the front
  function underRiffle(rPose, rMood, o) {
    o = o || {};
    return [tally('sit', o.tally || 'kind', UNDER_TALLY, 'left'), chispa('sit', o.chispa || 'wonder', UNDER_CHISPA, 'left'),
      you('sit', o.you || 'happy', 'mud', 'left'), c('riffle', rPose, rMood, RIFFLE_UNDER, 'right', { holds: 'pebbles' })];
  }

  // the newcomer's name tag until Glintstar names her, and the off-panel voices
  var LITTLE = 'The little cat';
  var WJ = '⁠';

  var frames = {

    /* ------------------------------------------------------------------ Noon */

    f001: {
      // the start frame shows to everyone: the chapter's title over her nest (chapter 8's title panel); the next nest
      // empty, {Murmur}chime out on patrol
      scene: S('den', 'nest', DENW_DAY, [nestYou('curl', 'sleepy', { asleep: true })], ['morning', 'zzz']),
      board: 'CLOSE-UP, THE TITLE PANEL, NOON. Our cat sleeps curled tight in its new warrior’s nest, bright noon light falling across the moss, its bark, its glass and the grey mist stone tucked round it; the next nest at the edge of the panel is empty. One small zzz rises. The chapter’s title is lettered across the top of the panel like a title page.',
      caption: ['Chapter 12: A Spark at the Hedge'],
      next: 'f002'
    },

    f002: {
      scene: S('den', 'nest', DENW_DAY, [nestYou('loaf', 'sleepy', { tap: 'paw' })], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, NOON, THE TAP PICTURE. Our cat lies loafed in its nest with its eyes half open, blinking at the bright light, a cold breeze lifting the fur on its back; the mist stone lies grey on the moss beside it. In play its front paw glows softly; one tap stretches it out, front paws forward and tail up, and the page turns. Three captions in a column, top left.',
      caption: ['You wake up in your warrior’s nest. The sun is high, and the air smells cold.', 'You kept watch all night, and slept all morning.',
        'Your first day as a warrior is half over already!'],
      scratch: { tap: 'paw', prompt: '**Tap** to stretch.', label: 'Stretch.', next: 'f003' }
    },

    f003: {
      // the stretch's answer: front paws out, tail up; {Murmur}chime back from patrol in the next nest
      scene: S('den', 'nest', DENW_DAY, [nestChime('sit', 'happy'), nestYou('crouch', 'sleepy', { tailUp: true })], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, NOON, THE CHOICE. Our cat stretches long in its nest, front paws pushed out and tail straight up, and in the next nest the young tortoiseshell warrior, back from patrol with burrs in her fur, sits watching it with a teasing grin. Her balloon teasing; the choices sit below the panel.',
      say: [{ who: 'murmurchime', text: 'Warriors don’t sleep till NOON. Usually.' }],
      choice: {
        options: [
          { label: '“I kept watch ALL night!”', sets: {}, next: 'f004' },
          { label: '“I’m a VERY good sleeper.”', sets: {}, next: 'f004' }
        ]
      }
    },

    f004: {
      scene: S('den', 'nest', DENW_DAY, [nestChime('lie', 'kind'), nestYou('sit', 'happy')], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, NOON, COMEDY BEAT. The tortoiseshell warrior flops her chin onto her paws on the edge of her nest and admits it with a sigh and a smile, and our cat sits up in its own nest, fully awake now and pleased with itself. Her balloon a confession.',
      say: [{ who: 'murmurchime', text: 'I know. I’m just jealous.' }],
      next: 'f005'
    },

    /* ------------------------------------------------------------------ The midday count: the camp by day */

    f005: {
      // module 1's last thread paid in one screen: four captions (Sloshbank is not drawn; no tunnel, no stash)
      scene: S('camp', 'crowd', CAMP_DAY,
        [c('grizzled', 'sit', 'neutral', NOON_OLD, 'left'), c('clancat', 'sit', 'happy', NOON_CLAN2, 'left', { variant: 5 }), c('clancat', 'sit', 'happy', NOON_CLAN, 'right', { variant: 2 }),
         c('glintstar', 'stand', 'solemn', 'fountain-foot', 'right'), you('sit', 'wonder', NOON_YOU, 'left'), tally('sit', 'kind', NOON_TALLY, 'left'),
         c('murmurchime', 'sit', 'happy', NOON_CHIME, 'left')], ['day']),
      board: 'MEDIUM, THE CAMP AT MIDDAY. The whole Clan sits round the old stone fountain in bright cold sunshine under a clear blue sky, and Glintstar stands at the fountain’s foot with news; our cat, Tallyheart, the tortoiseshell warrior and the old grizzled tom listen among them. Four captions in a column, top left.',
      caption: ['At the midday count, there’s news.', 'Yesterday, after your Counts, both Clans carried their prey home from the stash.',
        'Sloshbank sent word: “OURS came home. *Drip.*”', 'And this morning, while you slept, the weasels’ tunnel was filled with stones.'],
      next: 'f006'
    },

    f006: {
      // Glintstar's two paragraphs, two balloons
      scene: S('camp', 'fountain', {}, [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left')], ['day']),
      board: 'LOW ANGLE, UP AT THE FOUNTAIN, MIDDAY. Glintstar has leapt up onto the top of the old stone fountain and stands tall against the blue sky, and a small inset shows a sky heavy with snowflakes. Caption top left; two balloons, both hers, grave.',
      caption: ['Glintstar leaps up onto the fountain.'],
      say: [
        { who: 'glintstar', text: 'Thymeleaf’s whiskers say snow by the full moon.' },
        { who: 'glintstar', text: 'So this frost-time, we’ll keep a store, in the dry den under the Old Bridge. It kept a dragon dry. It can keep our prey dry.' }
      ],
      next: 'f007'
    },

    f007: {
      scene: S('camp', 'crowd', CAMP_DAY,
        [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left'), tally('sit', 'kind', RING_TALLY, 'right'), you('sit', 'wonder', RING_YOU, 'right')], ['day']),
      board: 'MEDIUM, THE FOUNTAIN, MIDDAY. Glintstar stands on the fountain top and looks out over the whole Clan, and a small inset shows a neat pile of prey on a dry stone floor; in the front row our cat and Tallyheart look up at her. Her balloon grave.',
      say: [{ who: 'glintstar', text: 'Five hundred pieces, by the full moon. And one cat to count them.' }],
      next: 'f008'
    },

    f008: {
      scene: S('camp', 'crowd', CAMP_DAY,
        [c('glintstar', 'stand', 'kind', 'fountain-top', 'left'), tally('sit', 'proud', RING_TALLY, 'right'), you('sit', 'proud', RING_YOU, 'right', { tap: 'nose' })], ['day']),
      board: 'MEDIUM, THE FOUNTAIN, MIDDAY, THE TAP PICTURE. Glintstar looks straight down from the fountain top at our cat in the front row and names it, and every head in the Clan turns; beside it Tallyheart lifts her chin, proud. In play its nose glows softly; one tap dips its head and the page turns. Caption top left; her balloon warm.',
      caption: ['She looks straight at you.'],
      say: [{ who: 'glintstar', text: '{name}{ending}. The cat who counts what’s missing.' }],
      scratch: { tap: 'nose', prompt: '**Tap** to dip your head.', label: 'Dip your head.', next: 'f009' }
    },

    f009: {
      // “And that,” says Tallyheart, “is why…”: one balloon
      scene: S('camp', 'crowd', CAMP_DAY,
        [c('glintstar', 'stand', 'kind', 'fountain-top', 'left'), tally('sit', 'kind', RING_TALLY, 'right'), you('sit', 'happy', RING_YOU, 'right'),
         c('grizzled', 'sit', 'stern', 'center', 'left')], ['day']),
      board: 'MEDIUM, THE FOUNTAIN, COMEDY BEAT. The old grizzled tom grumbles in the front of the crowd with his whiskers bristling, and Tallyheart answers him without even turning her head, very dry; our cat hides a grin. Two balloons, his grumpy, hers dry.',
      say: [
        { who: 'grizzled', text: 'Five HUNDRED? In my day, we didn’t count our prey. We just ATE it.' },
        { who: 'tallyheart', text: 'And that is why you were hungry every frost-time.' }
      ],
      next: 'f010'
    },

    /* ------------------------------------------------------------------ Princess Waffles: the tower from the hedge's side */

    f010: {
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left'), you('lookup', 'wonder', 'foot', 'right'), tally('sit', 'kind', TOWER_TALLY, 'left')], ['day']),
      board: 'WIDE, LOOKING UP THE GLASS TOWER, MIDDAY. Our cat and Tallyheart stand small at the foot of the tall glass tower beyond the hedge, and far above, on a balcony nineteen floors up, a fluffy white cat leans over the railing with her pink bow askew, waving a paw. Two captions top left; her first balloon a shout, her second nosy.',
      caption: ['You and Tallyheart pad out to the hedge.', 'Far above, Princess Waffles leans over the railing.'],
      say: [
        { who: 'waffles', text: 'Yoo-hoo! Down there!', kind: 'shout' },
        { who: 'waffles', text: 'I told the whole tower about your ceremony. But what IS your name?' }
      ],
      next: 'f011'
    },

    f011: {
      // her warrior name, called up and tried on; the brief's first cut if the words ever run over (they don't)
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'happy', 'railing', 'left'), you('lookup', 'proud', 'foot', 'right'), tally('sit', 'happy', TOWER_TALLY, 'left')], ['day']),
      board: 'WIDE, LOOKING UP THE GLASS TOWER, COMEDY BEAT. Our cat calls its new name up the tower at the top of its voice, and on her balcony the white cat clasps her paws to her chest at how grand it sounds, then waves the idea away. Tallyheart rolls her eyes. Two balloons, our cat’s a shout, hers grand.',
      say: [
        { who: 'player', text: '{name}{ending}!', kind: 'shout' },
        { who: 'waffles', text: '{name}{ending}! How REGAL. I’ll need a WEEK to practice it, darling. Until then: {petname}.' }
      ],
      next: 'f012'
    },

    f012: {
      // Waffles' two paragraphs, two balloons
      scene: S('tower', 'balcony', TOWER, [c('waffles', 'peer', 'shout', 'railing', 'left')], ['day']),
      board: 'MEDIUM, ON THE BALCONY, MIDDAY. The white cat leans right over her railing with the city and its glass towers bright behind her and points a paw down at the far side of her tower’s ground floor, bursting with news; her little wind chime swings. Two balloons, both hers, breathless.',
      say: [
        { who: 'waffles', text: 'And NEWS! A new pillow cat, on the ground floor, far side.' },
        { who: 'waffles', text: 'She’s counting EVERYTHING, darling. In SPANISH. I understand NOTHING.' }
      ],
      next: 'f013'
    },

    /* ------------------------------------------------------------------ The hedge: the garden's side, by day */

    f013: {
      // one line by `specialty` (a swimmer's is Riffle's, at sunset); the friends' “Hello.” off the panel: the little
      // cat is not drawn yet
      scene: S('garden', 'hedge', {}, [hedgeTally('wonder'), hedgeYou('crouch', 'wonder', { tap: 'nose' })], ['day']),
      board: 'MEDIUM, THE GAP IN THE HEDGE, MIDDAY, THE TAP PICTURE. On the lawn by the hedge our cat crouches low with its ears pricked toward the leafy gap at the foot of the hedge, where the leaves are rustling, and Tallyheart sits at the right edge of the panel, watching too. In play its nose glows softly; one tap looks into the gap and the page turns. Captions top left.',
      caption: ['Something rustles at the foot of the hedge.',
        { when: { specialty: 'noticing' }, text: 'You spot her first: two blue eyes, right in a gap.' },
        { when: { specialty: 'climbing' }, text: 'You hop up onto the hedge-top for a better look.' },
        { when: { specialty: 'sneaking' }, text: 'You creep closer without a sound, the way you used to sneak up on socks.' }],
      say: [{ who: 'chispapaw', name: 'A small voice', text: 'Hello.', kind: 'whisper', when: { specialty: 'friends' } }],
      scratch: { tap: 'nose', prompt: '**Tap** to look.', label: 'Look.', next: 'f014' }
    },

    f014: {
      // the close-up framed on her head (she is first in the cast); no crowd to count from the garden's side: the hedge
      // is a wall, so none of the twelve can be counted here (the verify critic's rule)
      scene: S('garden', 'hedge-close', {}, [chispa('crouch', 'shy', 'hedge-gap', 'right'), hedgeYou('crouch', 'wonder')], ['day']),
      board: 'CLOSE-UP, AT THE GAP. A small cream cat crouches with her nose pushed into the gap in the hedge, her face, big ears, paws and tail a deep chocolate brown, a narrow red collar with a tiny gold bell at her throat; her blue eyes dart as she counts under her breath. Behind her our cat peers in. Three captions top left; her balloon a whisper, its English under it.',
      caption: ['A small cream cat has her nose in the gap: a dark brown face, dark paws, big ears, blue eyes.', 'A tiny bell on her collar goes *ting*.',
        'She’s counting the Clan, under her breath.'],
      say: [{ who: 'chispapaw', name: LITTLE, kind: 'whisper', lang: 'es', text: '…' + WJ + '{es:11}, {es:12}. {Es:12} {es:gatos}.' }],
      next: 'f015'
    },

    f015: {
      scene: S('garden', 'hedge', {}, [chispa('crouch', 'shy', 'hedge-gap', 'right'), hedgeTally('kind'), hedgeYou('sit', 'wonder')], ['day']),
      board: 'MEDIUM, THE GAP IN THE HEDGE. The little cream cat crouches at the gap with her nose in it, still counting, and from the right edge of the panel Tallyheart leans toward our cat with a soft look and whispers; our cat sits very still. Her balloon a whisper.',
      say: [{ who: 'tallyheart', text: 'Remember when that was you?', kind: 'whisper' }],
      next: 'f016'
    },

    f016: {
      // the memory: chapter 1's own view from the glass, the Clan tiny in the garden at dusk
      scene: S('room', 'outside', ROOM_MEMORY, [], ['dusk']),
      board: 'WIDE, A MEMORY, LOOKING OUT THROUGH THE GLASS. The garden at dusk seen from inside a ground-floor home, through the tall glass door: the lawn, the hedge and, far off past it, tiny wild cats moving in the long golden light. The edge of the panel is soft, like remembering. One caption at the top.',
      caption: ['You do. You watched this Clan through the glass, wishing and wishing.'],
      next: 'f017'
    },

    f017: {
      // her two paragraphs, two balloons; the bell lettered by her
      scene: S('garden', 'hedge', {}, [chispa('lookup', 'wonder', 'hedge-gap', 'left'), hedgeTally('kind'), hedgeYou('sit', 'kind')], ['day']),
      board: 'MEDIUM, THE GAP IN THE HEDGE, THE CHOICE. The little cream cat turns from the gap and peeks up at our cat with huge blue eyes, her bell swinging, half shy and half thrilled; Tallyheart watches from the right edge. The ting lettered by her bell; her first balloon a confession, her second a whisper; the choices sit below the panel.',
      caption: ['The little cat peeks up at you.'],
      say: [
        { who: 'chispapaw', name: LITTLE, text: 'I wasn’t counting you. Well. I WAS. You were number twelve.' },
        { who: 'chispapaw', name: LITTLE, text: 'I watched your ceremony from my window. I want to be a warrior. Like YOU.', kind: 'whisper' }
      ],
      sfx: 'Ting!',
      choice: {
        options: [
          { label: '“What’s your name?”', sets: {}, next: 'f018' },
          { label: '“Hello! Who are you?”', sets: {}, next: 'f018' }
        ]
      }
    },

    f018: {
      scene: S('garden', 'hedge', {}, [chispa('sit', 'happy', 'hedge-gap', 'left'), hedgeTally('kind'), hedgeYou('sit', 'happy')], ['day']),
      board: 'MEDIUM, THE GAP IN THE HEDGE. The little cream cat sits up and says her home name a little proudly, and a small inset shows a round biscuit with chocolate chips; our cat listens with its head tipped. Her balloon shy and bright.',
      say: [{ who: 'chispapaw', name: LITTLE, text: 'My Tall Ones call me {es:galleta}. It means cookie.' }],
      next: 'f019'
    },

    f019: {
      scene: S('tower', 'balcony-close', TOWER, [c('waffles', 'peer', 'shout', 'railing', 'left')], ['day']),
      board: 'CLOSE-UP, ON THE BALCONY, COMEDY BEAT. High on her balcony the fluffy white cat throws her head back with her paws in the air and shrieks with delight, her pink bow bouncing and her wind chime jangling. Caption top left; her balloon a shriek.',
      caption: ['High above, Waffles shrieks.'],
      say: [{ who: 'waffles', text: 'A COOKIE! Darling, we’re BOTH snacks.', kind: 'shout' }],
      next: 'f020'
    },

    f020: {
      scene: S('garden', 'hedge', {}, [chispa('sit', 'happy', 'hedge-gap', 'left'), hedgeTally('kind'), hedgeYou('sit', 'kind')], ['day']),
      board: 'MEDIUM, THE GAP IN THE HEDGE. The little cream cat explains herself in a rush, and a small inset shows a ground-floor door standing open onto the garden and a child at a table doing homework; our cat nods, remembering its own open door. Her balloon eager.',
      say: [{ who: 'chispapaw', name: LITTLE, text: 'My Tall Ones leave the door open. Like yours did. I’ll visit my little Tall One at homework time.' }],
      next: 'f021'
    },

    f021: {
      scene: S('garden', 'hedge', {}, [chispa('sit', 'wonder', 'hedge-gap', 'left'), hedgeTally('kind'), hedgeYou('walk', 'happy', { tap: 'paw' })], ['day']),
      board: 'MEDIUM, THE GAP IN THE HEDGE, THE TAP PICTURE. Tallyheart tips her head at the gap with a warm look, and our cat steps forward toward the little cat, ready to lead the way through the hedge. In play its lifted paw glows softly; one tap leads her through, big ears first, and the page turns. Caption top left; Tallyheart’s balloon brisk.',
      caption: ['Tallyheart tips her head at the gap.'],
      say: [{ who: 'tallyheart', text: 'Well, warrior? Bring her in.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to lead her through the hedge.', label: 'Lead her through the hedge.', next: 'f022' }
    },

    /* ------------------------------------------------------------------ Another pillow cat */

    f022: {
      // just through the hedge, chapter 1's own arrival (f035), the little cat beside our cat
      scene: S('camp', 'reveal', CAMP_DAY,
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left'), c('grizzled', 'sit', 'stern', 'crowd-right', 'left'), tally('sit', 'kind', 'center', 'left'),
         you('sit', 'kind', 'entrance', 'right'), chispa('sit', 'wonder', NEW_BESIDE, 'right')], ['day']),
      board: 'WIDE, THE CAMP BY DAY. Just inside the hedge our cat stands beside the little cream cat, whose eyes have gone perfectly round at the dens, the ferns and the old stone fountain with Glintstar on top; across the camp the old grizzled tom glares and grumbles. Caption top left; his balloon grumpy.',
      caption: ['The little cat’s eyes go round. Dens! Ferns! A FOUNTAIN!'],
      say: [{ who: 'grizzled', text: 'ANOTHER pillow cat? Can she even catch a mouse?' }],
      next: 'f023'
    },

    f023: {
      // the mutter is chapter 1's own shot: from above, the watching shadows round every edge
      scene: S('camp', 'entrance', CAMP_DAY, [chispa('sit', 'sad', 'entrance', 'right', { flatEars: true })], ['day']),
      board: 'HIGH ANGLE, DOWN AT THE NEWCOMER. From above, the little cream cat sits alone on the mossy ground with her big ears drooping flat, and round every edge of the panel the shapes of watching cats lean in, muttering. Her bell hangs still. Caption top left; her balloon a small whisper.',
      caption: ['The Clan mutters, the way it once muttered about you. Her ears droop.'],
      say: [{ who: 'chispapaw', name: LITTLE, text: 'I’ve never MET a mouse. I caught a sock once. It was a very BIG sock.', kind: 'whisper' }],
      next: 'f024'
    },

    f024: {
      // the vouching: three lines, nothing set, each its own reply
      scene: S('camp', 'crowd', CAMP_DAY, vouch({ you: 'proud' }), ['day']),
      board: 'MEDIUM, THE CROWD, THE CHOICE. Our cat steps up right beside the little cream cat, shoulders square, and faces the old grizzled tom and the muttering crowd; Tallyheart watches from the front row, two Clan cats lean in behind the old tom, and Glintstar watches from the fountain top. One caption at the top; the choices sit below the panel.',
      caption: ['You step up beside her.'],
      choice: {
        options: [
          { label: '“Judge her by what she does, not by where she sleeps.”', sets: {}, next: 'f025a' },
          { label: '“I was a pillow cat too.”', sets: {}, next: 'f025b' },
          { label: 'To the old tom: “She can count in TWO languages. Can you?”', sets: {}, next: 'f025c' }
        ]
      }
    },

    f025a: {
      // Tallyheart's own words: her ears up (proud, never laughing), the muttering stops, the thanks
      scene: S('camp', 'crowd', CAMP_DAY, vouch({ tally: 'proud', chispa: 'shy', old: 'neutral', chispaFacing: 'left' }), ['day']),
      board: 'MEDIUM, THE CROWD, ONLY FOR A CAT WHO SAYS TALLYHEART’S OWN WORDS. In the front row Tallyheart’s ears shoot straight up, proud, and a small inset shows her on the first night saying the very same words for a little pillow cat; the crowd falls silent and the little cat looks up at our cat. Three captions top left; her balloon a whisper.',
      caption: ['Tallyheart’s ears go up, proud.', 'You said it just the way she once said it for you.', 'The muttering stops.'],
      say: [{ who: 'chispapaw', name: LITTLE, text: 'Thank you.', kind: 'whisper' }],
      next: 'f027'
    },

    f025b: {
      scene: S('camp', 'crowd', CAMP_DAY, vouch({ old: 'sniff', chispa: 'wonder' }), ['day']),
      board: 'MEDIUM, THE CROWD, ONLY FOR A CAT WHO SAYS IT WAS A PILLOW CAT TOO. The old grizzled tom looks our cat up and down with a sniff, considering, and admits it grudgingly, one ear twitching; the little cream cat looks from one to the other. His balloon gruff.',
      say: [{ who: 'grizzled', text: 'Well. YOU turned out all right.' }],
      next: 'f026'
    },

    f025c: {
      scene: S('camp', 'crowd', CAMP_DAY, vouch({ old: 'solemn', chispa: 'wonder', clan: 'happy' }), ['day']),
      board: 'MEDIUM, THE CROWD, ONLY FOR A CAT WHO ASKS THE OLD TOM, COMEDY BEAT. The old grizzled tom opens his mouth, shuts it again, and answers with enormous dignity and no smile at all; behind him the two Clan cats hide grins. The little cream cat looks from one to the other. His balloon stiff.',
      say: [{ who: 'grizzled', text: '…' + WJ + 'I can count in ONE very well.' }],
      next: 'f026'
    },

    f026: {
      scene: S('camp', 'crowd', CAMP_DAY, vouch({ chispa: 'shy', old: 'neutral', chispaFacing: 'left' }), ['day']),
      board: 'MEDIUM, THE CROWD, AFTER THE OLD TOM’S ANSWER. The muttering dies away all round the crowd, and the little cream cat turns to our cat with her ears coming slowly back up and whispers her thanks. One caption at the top; her balloon a whisper.',
      caption: ['The muttering stops.'],
      say: [{ who: 'chispapaw', name: LITTLE, text: 'Thank you.', kind: 'whisper' }],
      next: 'f027'
    },

    /* ------------------------------------------------------------------ Chispapaw: Glintstar come down to the fountain's foot */

    f027: {
      // her home name, whispered: one balloon, the word in Spanish (a token)
      scene: S('camp', 'reveal', CAMP_DAY, naming({ glint: ['walk', 'kind'], chispa: ['sit', 'shy'], me: ['sit', 'kind'] }), ['day']),
      board: 'WIDE, THE CAMP BY DAY. Glintstar pads down from the fountain to its foot, silver in the sunshine, and asks the little cream cat her name, who answers in the smallest voice; our cat and Tallyheart sit close by. Caption top left; four boxes, Glintstar’s calm, the little cat’s a whisper.',
      caption: ['Glintstar comes down from the fountain.'],
      say: [
        { who: 'glintstar', text: 'What do they call you, little one?' },
        { who: 'chispapaw', name: LITTLE, text: '{es:galleta}.', kind: 'whisper' },
        { who: 'glintstar', text: 'Pillow names don’t hunt. Choose a Clan name.' }
      ],
      next: 'f028'
    },

    f028: {
      // she names herself: still “The little cat” on the label (Glintstar has not named her yet)
      scene: S('camp', 'crowd', CAMP_DAY, naming({ chispa: ['sit', 'proud'], me: ['sit', 'wonder'] }), ['day']),
      board: 'MEDIUM, THE CAMP, BEFORE THE FOUNTAIN. The little cream cat sits up very straight in front of Glintstar, chin high and eyes bright, and a small inset shows a single spark jumping from a fire; our cat and Tallyheart watch. Caption top left; her balloon brave.',
      caption: ['The little cat sits up very straight.'],
      say: [{ who: 'chispapaw', name: LITTLE, text: 'Chispa. It means spark.' }],
      next: 'f029'
    },

    f029: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'kind'], chispa: ['sit', 'proud'], me: ['sit', 'happy'] }), ['day']),
      board: 'MEDIUM, THE CAMP, BEFORE THE FOUNTAIN. Glintstar’s whiskers twitch with the start of a smile as she looks down at the little cream cat, and a small inset shows a tiny spark in a frosty sky. Caption top left; her balloon warm.',
      caption: ['Glintstar’s whiskers twitch.'],
      say: [{ who: 'glintstar', text: 'A spark. Frost-time could use one.' }],
      next: 'f030'
    },

    f030: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['stand', 'solemn'], chispa: ['sit', 'wonder'], me: ['sit', 'happy', { tap: 'nose' }] }), ['day']),
      board: 'MEDIUM, THE CAMP, BEFORE THE FOUNTAIN, THE TAP PICTURE. Glintstar stands tall and says the new name with tremendous dignity, and the little cream cat holds her breath; our cat sits right beside them, beaming. In play its nose glows softly; one tap purrs the new name and the page turns. Her balloon grand.',
      say: [{ who: 'glintstar', text: 'Chispapaw.' }],
      scratch: { tap: 'nose', prompt: '**Tap** to purr her new name.', label: 'Purr her name.', next: 'f031' }
    },

    f031: {
      // the whole camp wide on the `purr` camera; our cat purrs first, the old tom joins in
      scene: S('camp', 'purr', CAMP_DAY, naming({ old: ['sit', 'stern', { purr: true }], glint: ['sit', 'happy'], chispa: ['sit', 'wonder'], me: ['sit', 'happy', { purr: true }], tally: ['sit', 'happy'] }), ['day', 'purr']),
      board: 'WIDE, THE WHOLE CAMP BY DAY. Our cat purrs first, the purr drawn as warm rings, and then one by one every cat round the fountain joins in, till the whole camp hums; the little cream cat stands in the middle of it, astonished, and the old grizzled tom purrs too, frowning at the new word. Two captions top left; his balloon puzzled.',
      caption: ['You purr it first.', 'Then, one by one, the cats join in, till the whole camp is humming her new name.'],
      say: [{ who: 'grizzled', text: 'Chips-paw?' }],
      next: 'f032'
    },

    f032: {
      // (Chispapaw first in the cast, so the bounce's motion lines are hers; facing our cat, so they trail behind her into
      // the open ground, not across our cat as they did facing Glintstar, looked at in a render)
      scene: S('camp', 'crowd', CAMP_DAY, [chispa('stand', 'happy', 'center', 'right')].concat(naming({ glint: ['sit', 'happy'], me: ['sit', 'happy'], tally: ['sit', 'happy'] })
        .filter(function (m) { return m.who !== 'chispapaw'; })), ['day', 'motion']),
      board: 'MEDIUM, THE CAMP, COMEDY BEAT. The newly named Chispapaw cannot help it: she springs up on all four paws with bounce lines all round her, her tiny bell flying, while Glintstar, Tallyheart and our cat smile at her. The tings lettered by her bell; one caption at the top.',
      caption: ['Chispapaw can’t help it. She BOUNCES.'],
      sfx: 'Ting! Ting!',
      next: 'f033'
    },

    /* ------------------------------------------------------------------ She's yours */

    f033: {
      scene: S('camp', 'reveal', CAMP_DAY, naming({ glint: ['sit', 'solemn'], chispa: ['sit', 'happy'], me: ['sit', 'wonder'], tally: ['sit', 'kind'] }), ['day']),
      board: 'WIDE, THE CAMP BY DAY. Glintstar sits at the fountain’s foot and speaks to the whole Clan, and Tallyheart answers her with a nod toward our cat; Chispapaw looks from one to the other with her ears up. Two balloons, Glintstar’s grave, Tallyheart’s matter-of-fact.',
      say: [
        { who: 'glintstar', text: 'Every apprentice needs a mentor.' },
        { who: 'tallyheart', text: 'I’ll teach her the Counts, same as always. She needs a warrior for everything else.' }
      ],
      next: 'f034'
    },

    f034: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'kind'], chispa: ['sit', 'wonder'], me: ['sit', 'wonder'], tally: ['sit', 'proud'] }), ['day']),
      board: 'MEDIUM, THE CAMP, BEFORE THE FOUNTAIN. Glintstar turns and looks right at our cat, steady and kind, and gives it the little cream cat with one small nod; Tallyheart watches our cat’s face. Caption top left; her balloon simple and warm.',
      caption: ['Glintstar looks right at you.'],
      say: [{ who: 'glintstar', text: '{name}{ending}. She’s yours.' }],
      next: 'f035'
    },

    f035: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'kind'], chispa: ['sit', 'wonder'], me: ['sit', 'happy', { tailUp: true, tap: 'nose' }], tally: ['sit', 'happy'] }), ['day']),
      board: 'MEDIUM, THE CAMP, THE TAP PICTURE. Our cat’s tail has shot straight up before it can stop it, and it sits very tall, trying to look grown up and grinning anyway; the little cream cat gazes at it. In play its nose glows softly; one tap dips its head to her and the page turns. One caption at the top.',
      caption: ['Your very own apprentice! Your tail shoots up before you can stop it.'],
      scratch: { tap: 'nose', prompt: '**Tap** to dip your head to her.', label: 'Dip your head to her.', next: 'f036' }
    },

    f036: {
      // the dip's answer: she dipped hers back (not drawn), and looks up at our cat (facing her mentor from here to f038c)
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'kind'], chispa: ['lookup', 'wonder', null, 'right'], me: ['sit', 'kind'], tally: ['sit', 'happy'] }), ['day']),
      board: 'MEDIUM, THE CAMP, THE CHOICE. Chispapaw looks up at her new mentor with her eyes shining like two blue stones, her bell still swinging from the dip of her head; Glintstar and Tallyheart wait to hear what our cat will say first. One caption at the top; the choices sit below the panel.',
      caption: ['Chispapaw looks up at you, eyes shining.'],
      choice: {
        options: [
          { label: '“Welcome, Chispapaw.”', sets: {}, next: 'f037a' },
          { label: '“Ready to work?”', sets: {}, next: 'f037b' },
          { label: '“Let’s count something.”', sets: {}, next: 'f037c' }
        ]
      }
    },

    f037a: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'happy'], chispa: ['sit', 'happy', { purr: true, tailUp: true }, 'right'], me: ['sit', 'happy', { tailUp: true }], tally: ['sit', 'kind'] }), ['day', 'purr']),
      board: 'MEDIUM, THE CAMP, ONLY FOR A CAT WHO SAYS WELCOME. Chispapaw purrs so hard her whiskers shake, the purr drawn round her, and her tail goes straight up just like our cat’s; Tallyheart leans close to our cat and whispers. Two captions top left; her balloon a whisper.',
      caption: ['Chispapaw purrs so hard her whiskers shake.', 'Chispapaw’s tail goes up too, just like yours.'],
      say: [{ who: 'tallyheart', text: 'Now you know how I felt, the day you came.', kind: 'whisper' }],
      next: 'f039'
    },

    f037b: {
      // (a word joiner after the ellipsis, so it never stands alone at a line's end)
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'kind'], chispa: ['stand', 'wonder', null, 'right'], me: ['sit', 'happy'], tally: ['sit', 'kind'] }), ['day']),
      board: 'MEDIUM, THE CAMP, ONLY FOR A CAT WHO ASKS IF SHE IS READY, COMEDY BEAT. Chispapaw jumps to her feet, ready for anything, then stops with one paw in the air and tips her head, puzzled; our cat tries not to laugh. Her balloon a squeak, then a question.',
      say: [{ who: 'chispapaw', text: 'Ready! …' + WJ + 'What’s work?' }],
      next: 'f038'
    },

    f037c: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'kind'], chispa: ['sit', 'wonder', null, 'right'], me: ['sit', 'happy'], tally: ['sit', 'proud'] }), ['day']),
      board: 'MEDIUM, THE CAMP, ONLY FOR A CAT WHO SAYS LET’S COUNT SOMETHING, COMEDY BEAT. Tallyheart’s head comes round at her own favourite words coming out of our cat, and she huffs, pretending to be cross, her chest puffed out with pride. Her balloon a mock grumble.',
      say: [{ who: 'tallyheart', text: 'That’s MY line. Hmph.' }],
      next: 'f038c'
    },

    f038: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'happy'], chispa: ['sit', 'happy', { tailUp: true }, 'right'], me: ['sit', 'happy', { tailUp: true }], tally: ['sit', 'kind'] }), ['day']),
      board: 'MEDIUM, THE CAMP, AFTER HER QUESTION. Chispapaw’s tail goes straight up just like our cat’s, the two tails side by side, and Tallyheart leans close to our cat and whispers, her torn ear soft. One caption at the top; her balloon a whisper.',
      caption: ['Chispapaw’s tail goes up too, just like yours.'],
      say: [{ who: 'tallyheart', text: 'Now you know how I felt, the day you came.', kind: 'whisper' }],
      next: 'f039'
    },

    f038c: {
      scene: S('camp', 'crowd', CAMP_DAY, naming({ glint: ['sit', 'happy'], chispa: ['sit', 'happy', { tailUp: true }, 'right'], me: ['sit', 'happy', { tailUp: true }], tally: ['sit', 'proud'] }), ['day']),
      board: 'MEDIUM, THE CAMP, AFTER TALLYHEART’S HMPH. Tallyheart looks enormously proud of her own line, and Chispapaw’s tail goes straight up just like our cat’s; Tallyheart leans close to our cat and whispers. Two captions top left; her balloon a whisper.',
      caption: ['She looks very proud.', 'Chispapaw’s tail goes up too, just like yours.'],
      say: [{ who: 'tallyheart', text: 'Now you know how I felt, the day you came.', kind: 'whisper' }],
      next: 'f039'
    },

    f039: {
      // on the way to the Training Hollow, Tallyheart ahead (she answers on the next panel)
      scene: S('camp', 'reveal', CAMP_DAY,
        [chispa('walk', 'happy', WALK_CHISPA, 'right'), you('walk', 'happy', WALK_YOU, 'right'), tally('walk', 'kind', WALK_TALLY, 'right')], ['day']),
      board: 'WIDE, ACROSS THE CAMP, THE CHOICE. Chispapaw trots right at our cat’s heels across the sunny camp toward the Training Hollow, chattering up at it with her ears bouncing, while Tallyheart pads on ahead. Two captions top left; her balloon a stream of questions; the choices sit below the panel.',
      caption: ['On the way to the Training Hollow, Chispapaw trots right at your heels.', 'She has questions. Lots of questions.'],
      say: [{ who: 'chispapaw', text: 'Do warriors sleep in trees? Do you eat bugs? Have you ever met a DRAGON?' }],
      choice: {
        options: [
          { label: '“No, no, and YES!”', sets: {}, next: 'f040a' },
          { label: '“One at a time!”', sets: {}, next: 'f040b' }
        ]
      }
    },

    f040a: {
      scene: S('camp', 'reveal', CAMP_DAY,
        [chispa('stand', 'wonder', WALK_CHISPA, 'right'), you('walk', 'happy', WALK_YOU, 'right'), tally('stand', 'kind', WALK_TALLY, 'left')], ['day']),
      board: 'WIDE, ACROSS THE CAMP, ONLY FOR A CAT WHO SAYS YES, COMEDY BEAT. Chispapaw stops dead with her eyes huge and her mouth wide open, and up ahead Tallyheart has stopped and turned back to them, brisk. Caption top left; the little cat’s balloon a squeal, Tallyheart’s brisk.',
      caption: ['Chispapaw’s eyes go huge.'],
      say: [
        { who: 'chispapaw', text: 'A DRAGON?!', kind: 'shout' },
        { who: 'tallyheart', text: 'The dragon story at the store. Lessons now.' }
      ],
      next: 'f041'
    },

    f040b: {
      scene: S('camp', 'reveal', CAMP_DAY,
        [chispa('walk', 'happy', WALK_CHISPA, 'right'), you('walk', 'happy', WALK_YOU, 'right'), tally('stand', 'kind', WALK_TALLY, 'left')], ['day']),
      board: 'WIDE, ACROSS THE CAMP, ONLY FOR A CAT WHO SAYS ONE AT A TIME, COMEDY BEAT. Chispapaw nods very seriously as she trots and asks for the most important question first, and up ahead Tallyheart has stopped and turned back to them, brisk. Two balloons, the little cat’s firm, Tallyheart’s brisk.',
      say: [
        { who: 'chispapaw', text: 'Okay. DRAGON first.' },
        { who: 'tallyheart', text: 'The dragon story at the store. Lessons now.' }
      ],
      next: 'f041'
    },

    /* ------------------------------------------------------------------ The Training Hollow (`H12` under every frame) */

    f041: {
      // the screen's last two balloons (Chispapaw's socks and Tallyheart's “Yes!”, the pair the story joins with “/”)
      // open f042: four balloons here ran Back and Next under a sideways iPad's screen with Aa on (the review's round)
      scene: S('hollow', 'lesson', H12, hollow('wonder', 'kind', 'wonder'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW, MIDDAY. In the sandy hollow under the old leaning tree, its ten claw marks glowing, Tallyheart sits facing her two pupils, our cat in front and Chispapaw just behind it; our cat looks surprised to be having a lesson at all. Two balloons, our cat’s surprised, Tallyheart’s brisk.',
      say: [
        { who: 'player', text: 'Warriors have LESSONS?' },
        { who: 'tallyheart', text: 'Even warriors learn new tricks. You know every Count a warrior needs. Now, what to DO with them: take-' + WJ + 'aways.' }
      ],
      next: 'f042'
    },

    f042: {
      // Chispapaw's socks and Tallyheart's “Yes!” (the last of f041's screen), then the warm-up: her two hardest Counts of
      // all 54 pairs, then one more; Chispapaw's echo on her first right answer (`intro: false`: none of these balloons
      // follows into the Counts)
      scene: S('hollow', 'lesson', H12, hollow('happy', 'happy', 'happy'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW, THEN THE COUNTS. Chispapaw pipes up about taking away her Tall One’s socks, and Tallyheart, delighted, settles in the sand with her tail curled round her paws and announces three Counts; our cat stretches its claws, ready, and Chispapaw leans in to watch. In the Counts picture each question’s own picture lies on the sand; Chispapaw says the first right answer in Spanish. Three balloons: the little cat’s a question, then Tallyheart’s two, brisk; the keypad sits below the panel.',
      say: [
        { who: 'chispapaw', text: 'Take-' + WJ + 'aways? Like when I take away my Tall One’s socks?' },
        { who: 'tallyheart', text: 'Yes! Then we count what’s left.' },
        { who: 'tallyheart', text: 'First, three Counts, to wake up your whiskers.' }
      ],
      counts: { set: 'ch12-warm', intro: false, next: 'f043' }
    },

    f043: {
      scene: S('hollow', 'lesson', H12, hollow('wonder', 'kind', 'wonder'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW. Tallyheart leans toward her two pupils and explains, and a small inset shows a row of mice with one gap in it, a question mark floating over the gap. Our cat and Chispapaw listen hard. Her balloon earnest.',
      say: [{ who: 'tallyheart', text: 'Here’s what the Counts are FOR. A cat who knows them can always tell when something’s missing. Take-aways tell you HOW MANY.' }],
      next: 'f044'
    },

    f044: {
      // the store's plan on the sand: five empty pressed squares, the whole plan the Tap's target
      scene: S('hollow', 'lesson', merge(H12, { store: 500, tap: 'squares' }), hollow('wonder', 'kind', 'wonder'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW, THE TAP PICTURE. Between our cat and Tallyheart the store’s plan lies pressed flat into the sand, five empty squares in a neat block, each square ten rows of ten little pressed places, nothing in them yet. In play the whole plan glows softly; one tap lights the five squares and the page turns. Two balloons, both Tallyheart’s.',
      say: [
        { who: 'tallyheart', text: 'We’ll lay the store out like the pile. Ten loose ones make a row. Then a gap shows in a heartbeat.' },
        { who: 'tallyheart', text: 'And ten rows make a square. That’s a hundred.' }
      ],
      scratch: { tap: 'squares', prompt: '**Tap** the squares.', label: 'Tap the squares.', next: 'f045' }
    },

    f045: {
      // the Tap's answer: the five squares glowing
      scene: S('hollow', 'lesson', merge(H12, { store: 500, storeGlow: 'hundreds' }), hollow('wonder', 'happy', 'happy'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW, COMEDY BEAT. The five squares of the plan glow gold in the sand, and Chispapaw peers at them, unimpressed that there are only five, until Tallyheart spreads her paws wide to show how big each one is. Three balloons in turn.',
      say: [
        { who: 'tallyheart', text: 'Five hundred is five squares.' },
        { who: 'chispapaw', text: 'Only FIVE?' },
        { who: 'tallyheart', text: 'Five BIG ones.' }
      ],
      next: 'f046'
    },

    f046: {
      // the quick marks, right to left: Tallyheart's first, at her paws
      scene: S('hollow', 'lesson', merge(H12, { quick: 1 }), hollow('wonder', 'kind', 'wonder'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW. Tallyheart scratches a quick count in the sand at her paws: one square, one line and one dot, neat and small, where the plan lay a moment ago. Our cat and Chispapaw watch closely. Her balloon a lesson.',
      say: [{ who: 'tallyheart', text: 'In the sand, there’s a quick way to scratch a count. A square for a square. A line for a row. A dot for a loose one.' }],
      next: 'f047'
    },

    f047: {
      // Chispapaw's set beside Tallyheart's, her square round like a cookie; our cat `sit` (a crouch reaches the marks)
      scene: S('hollow', 'lesson', merge(H12, { quick: 2 }), hollow('happy', 'kind', 'happy', { tap: 'paw' }), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW, THE TAP PICTURE. Beside Tallyheart’s marks Chispapaw has scratched her own: a line, a dot, and a square that came out round and wobbly, exactly like a cookie. Our cat sits ready with a paw up. In play its paw glows softly; one tap scratches its own square, line and dot beside hers and the page turns. One caption at the top.',
      caption: ['Chispapaw scratches one too. Her square looks like a cookie.'],
      scratch: { tap: 'paw', prompt: '**Tap** to scratch yours.', label: 'Scratch yours.', next: 'f048' }
    },

    f048: {
      // the lesson: the take page carries the story's next screen, the worked example's prompt and its column
      scene: S('hollow', 'lesson', merge(H12, { quick: 3 }), hollow('wonder', 'kind', 'wonder'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW, THEN THE COUNTS. Three quick counts lie in a row in the sand, Tallyheart’s, Chispapaw’s round one and our cat’s, and Tallyheart taps the ones end of them with a claw. In the take-aways picture the store laid out in squares, rows and loose, and a column she types one digit at a time, ones first. Two balloons, both Tallyheart’s; the keypad sits below the panel.',
      say: [
        { who: 'tallyheart', text: 'Here’s the trick. Take loose from loose, rows from rows, squares from squares. Ones first: the loose ones.' },
        { who: 'tallyheart', text: 'The store’s empty till sunset, so let’s pretend. I’ll say each step. You type it.' }
      ],
      counts: { set: 'ch12-take', intro: false, next: 'f049' }
    },

    f049: {
      // the set's “Done” lines, this frame's (`done: ''` on the set)
      scene: S('hollow', 'lesson', merge(H12, { quick: 3 }), hollow('happy', 'proud', 'happy'), ['day']),
      board: 'MEDIUM, THE TRAINING HOLLOW. Tallyheart sits back, satisfied, with the three quick counts in the sand before her, and Chispapaw bounces on her toes beside our cat, thrilled for it. Two balloons, Tallyheart’s firm, the little cat’s a squeak.',
      say: [
        { who: 'tallyheart', text: 'Ones first, every time. That’s take-' + WJ + 'aways.' },
        { who: 'chispapaw', text: 'You didn’t sigh ONCE!' }
      ],
      next: 'f050'
    },

    /* ------------------------------------------------------------------ The walk: the riverbank path, by day */

    f050: {
      scene: S('riverbank', 'path', {}, [chispa('walk', 'wonder', PATH_CHISPA, 'right'), you('walk', 'kind', 'path-left', 'right'), tally('walk', 'kind', PATH_TALLY, 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH, AFTERNOON, THE CHOICE. Our cat walks down the path toward the Old Bridge, and right behind it Chispapaw copies its every step, putting her small brown paws exactly where its paws went, while Tallyheart pads on far ahead; she looks up and asks quietly. Caption top left; her balloon shy; the choices sit below the panel.',
      caption: ['Down to the Old Bridge, Chispapaw copies your every step.'],
      say: [{ who: 'chispapaw', text: 'Were the cats grumpy at you, too? At first?' }],
      choice: {
        options: [
          { label: '“Some of them. Not for long.”', sets: {}, next: 'f051a' },
          { label: '“The old tom STILL is.”', sets: {}, next: 'f051b' },
          { label: '“Tallyheart wasn’t. Not once.”', sets: {}, next: 'f052c' }
        ]
      }
    },

    f051a: {
      scene: S('riverbank', 'path', {}, [chispa('walk', 'shy', PATH_CHISPA, 'right'), you('walk', 'kind', 'path-left', 'right'), tally('walk', 'kind', PATH_TALLY, 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH, ONLY FOR A CAT WHO SAYS NOT FOR LONG. Chispapaw thinks about it as she walks behind our cat, her big ears turning this way and that, and decides she can manage not-for-long, very quietly to herself; Tallyheart pads on far ahead. Her balloon a whisper.',
      say: [{ who: 'chispapaw', text: 'Not for long. I can do not-for-long.', kind: 'whisper' }],
      next: 'f052'
    },

    f051b: {
      // her old-tom voice: `stern`
      scene: S('riverbank', 'path', {}, [chispa('walk', 'stern', PATH_CHISPA, 'right'), you('walk', 'happy', 'path-left', 'right'), tally('walk', 'kind', PATH_TALLY, 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH, ONLY FOR A CAT WHO SAYS THE OLD TOM STILL IS, COMEDY BEAT. Chispapaw scrunches her face into the old grizzled tom’s frown, puffs out her chest and does his voice as deep and grumpy as she can; our cat grins, and Tallyheart pads on far ahead. Her balloon gruff.',
      say: [{ who: 'chispapaw', text: 'Chips-paw?' }],
      next: 'f052'
    },

    f052: {
      scene: S('riverbank', 'path', {}, [chispa('walk', 'proud', PATH_CHISPA, 'right'), you('walk', 'happy', 'path-left', 'right'), tally('walk', 'kind', PATH_TALLY, 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH. Chispapaw’s whiskers lift and her chin comes up, and she walks a little taller behind our cat on the sunny path down to the river, very determined; Tallyheart pads on far ahead. One caption at the top; her balloon brave.',
      caption: ['Chispapaw’s whiskers lift.'],
      say: [{ who: 'chispapaw', text: 'I’ll show them. Like you did.' }],
      next: 'f053'
    },

    f052c: {
      // Tallyheart up ahead, as on every frame of the walk: she heard
      scene: S('riverbank', 'path', {}, [chispa('walk', 'proud', PATH_CHISPA, 'right'), you('walk', 'happy', 'path-left', 'right'), tally('walk', 'kind', PATH_TALLY, 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH, ONLY FOR A CAT WHO SAYS TALLYHEART WASN’T. Up ahead on the path Tallyheart walks on without turning round, but one torn ear has swivelled back to listen; behind our cat Chispapaw’s whiskers lift. Two captions top left; her balloon brave.',
      caption: ['Up ahead, Tallyheart’s ear twitches. She heard.', 'Chispapaw’s whiskers lift.'],
      say: [{ who: 'chispapaw', text: 'I’ll show them. Like you did.' }],
      next: 'f053'
    },

    f053: {
      scene: S('riverbank', 'path', {}, [chispa('walk', 'proud', PATH_CHISPA, 'right'), you('walk', 'proud', 'path-left', 'right'), tally('walk', 'kind', PATH_TALLY, 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH. Our cat walks the rest of the way down the path with its head held high and its tail up, and behind it Chispapaw does exactly the same, the river glinting below them and Tallyheart far ahead. One caption at the top.',
      caption: ['You walk the rest of the way with your head held high.'],
      next: 'f054'
    },

    /* ------------------------------------------------------------------ Sunset at the store: the Old Bridge */

    f054: {
      // the catch carried in, mouse by mouse (no store drawn while it is carried: the store only at the story's numbers)
      scene: S('bridge', 'bank', BANK,
        [c('clancat', 'walk', 'happy', 'run-2', 'left', { variant: 2, holds: 'mouse' }), c('clancat', 'walk', 'happy', 'reeds', 'left', { variant: 5, holds: 'mouse' }),
         you('walk', 'happy', 'bank-right', 'left', { holds: 'mouse', tap: 'paw' })], ['sunset']),
      board: 'WIDE, THE OLD BRIDGE AT SUNSET, THE TAP PICTURE. The sun sinks behind the old bridge and turns the river gold, and Clan cats carry mice one by one along the bank toward the shadowy space under its near end; our cat follows with a mouse of its own. In play its paw glows softly; one tap carries it in and the page turns. Two captions top left.',
      caption: ['The sun sinks behind the Old Bridge. The air nips your nose. Frost is coming.', 'The Clan carries its first frost-time catch into the dry den, mouse by mouse.'],
      scratch: { tap: 'paw', prompt: '**Tap** to help carry.', label: 'Help carry.', next: 'f055' }
    },

    f055: {
      // one mouse drawn in her mouth: the caption says four
      scene: S('bridge', 'under', UNDER,
        [c('grizzled', 'walk', 'proud', 'inside', 'right', { holds: 'mouse' }), c('murmurchime', 'walk', 'happy', 'mud', 'right', { holds: 'mouse' })], ['sunset']),
      board: 'WIDE, UNDER THE OLD BRIDGE, SUNSET. Long gold light slants in between the old stone legs, and the tortoiseshell warrior marches in with a mouth full of mice, while further in the old grizzled tom carries one single mouse with enormous pride. Caption top left; his balloon smug.',
      caption: ['{Murmur}chime carries in four mice at once. The old tom carries in ONE.'],
      say: [{ who: 'grizzled', text: 'It’s a BIG one.' }],
      next: 'f056'
    },

    f056: {
      scene: S('bridge', 'under', UNDER,
        [c('grizzled', 'walk', 'neutral', 'inside', 'right', { holds: 'mouse' }), c('murmurchime', 'sit', 'kind', 'mud', 'left'),
         chispa('walk', 'proud', RIFFLE_UNDER, 'right', { holds: 'leaf' })], ['sunset']),
      board: 'WIDE, UNDER THE OLD BRIDGE, SUNSET, COMEDY BEAT. Chispapaw trots in proudly carrying one crunchy autumn leaf in her mouth, and the tortoiseshell warrior turns and admires it with a perfectly straight face. Caption top left; two balloons, the little cat’s proud, the warrior’s kind.',
      caption: ['Chispapaw carries in a leaf.'],
      say: [
        { who: 'chispapaw', text: 'To HELP.' },
        { who: 'murmurchime', text: 'Best leaf in the store.' }
      ],
      next: 'f057'
    },

    f057: {
      // the dry den where Sprinkle slept; one caption by `ch10Best`
      scene: S('bridge', 'back', BACK, [chispa('crouch', 'sniff', 'back-right', 'left'), you('sit', 'kind', 'back-left', 'right')], ['sunset']),
      board: 'WIDE, THE BACK OF THE OLD BRIDGE, SUNSET. At the very back under the bridge, by the old heap of stones and the dry nook where a little dragon once slept, our cat tells the story in a whisper while Chispapaw sniffs every corner with her nose to the ground; a small inset shows a misty grey dragonet curled up asleep. Captions top left.',
      caption: [
        'You tell Chispapaw the dragon story, in a whisper. She sniffs every corner, twice.',
        { when: { ch10Best: 'sprinkle' }, text: 'Sprinkle slept here once. It still smells a little of mist.' },
        { when: { ch10Best: 'friends' }, text: 'You met a friend with wings in this den. Now friends with whiskers are filling it.' },
        { when: { ch10Best: 'truth' }, text: 'You found a dragon here, and the truth: she was no thief.' },
        { when: { ch10Best: 'counts' }, text: 'A dry den, and a whole store to count. PERFECT.' }
      ],
      next: 'f058'
    },

    f058: {
      // the store at 175, the six at its spots (back to front, the sets owner's depth order), the same on f059 to f061
      scene: S('bridge', 'store', STORE175, store({ tally: 'kind', you: 'wonder' }), ['sunset']),
      board: 'WIDE, THE DRY DEN, SUNSET. The day’s catch lies laid out on the dry floor of the den in a pool of gold light from the way in: one big square of prey, seven rows of ten and five loose ones; the Clan sits round it, Glintstar, Tallyheart and the tortoiseshell warrior behind, the old tom by the way in, our cat and Chispapaw at the front corners. Caption top left; Tallyheart’s balloon pleased.',
      caption: ['The catch lies on the dry den’s floor.'],
      say: [{ who: 'tallyheart', text: 'Squares, rows and loose. Just like the Hollow.' }],
      next: 'f059'
    },

    f059: {
      // her question is the take page's prompt (the set's)
      scene: S('bridge', 'store', STORE175, store({ glint: 'solemn', you: 'wonder' }), ['sunset']),
      board: 'WIDE, THE DRY DEN, SUNSET, THEN THE COUNTS. Glintstar looks over the catch on the floor and says what goes where, and every cat turns to our cat. In the take-aways picture the store laid out in squares, rows and loose, and the column she types one digit at a time, ones first. Glintstar’s balloon grave; the keypad sits below the panel.',
      say: [{ who: 'glintstar', text: 'One hundred seventy-five pieces today. Forty-two go to tonight’s pile. The rest stay here.' }],
      counts: { set: 'ch12-store', intro: false, next: 'f060' }
    },

    f060: {
      // the store at 133, lying where 175 lay; the whole placed picture the Tap's target
      scene: S('bridge', 'store', merge(STORE133, { tap: 'store' }), store({ glint: 'kind', you: 'proud' }), ['sunset']),
      board: 'WIDE, THE DRY DEN, SUNSET, THE TAP PICTURE. Forty-two pieces have gone to the pile and the store lies smaller on the floor, one square, three rows and three loose, in the same place; Glintstar nods at our cat to read it out. In play the whole store glows softly; one tap reads it and the page turns. Her balloon expectant.',
      say: [{ who: 'glintstar', text: 'Now read me the store.' }],
      scratch: { tap: 'store', prompt: '**Tap** to read the store.', label: 'Read the store.', next: 'f061' }
    },

    f061: {
      scene: S('bridge', 'store', STORE133, store({ glint: 'proud', tally: 'proud', you: 'proud', chispa: 'happy' }), ['sunset']),
      board: 'WIDE, THE DRY DEN, SUNSET. Our cat reads the store aloud, one square, three rows and three loose, and beside it Chispapaw whispers the number in her own language, eyes shining; Glintstar looks at our cat with quiet pride. Three balloons: our cat’s sure, the little cat’s a whisper with its English under it, Glintstar’s warm.',
      say: [
        { who: 'player', text: 'One square, three rows, three loose.' },
        { who: 'chispapaw', kind: 'whisper', lang: 'es', text: '¡{Es:133}!' },
        { who: 'glintstar', text: 'A good count. The cat who counts what’s missing. And what’s THERE.' }
      ],
      next: 'f062'
    },

    /* ------------------------------------------------------------------ Riffle: the Old Bridge at sunset */

    f062: {
      // a swimmer's line is his (her `specialty`)
      scene: S('bridge', 'bank', BANK,
        [c('riffle', 'swim', 'shout', 'water', 'left'), chispa('sit', 'wonder', BANK_CHISPA, 'right'), you('pawup', 'happy', 'bank-left', 'right', { tap: 'paw' }),
         tally('sit', 'kind', 'bank-right', 'left')], ['sunset']),
      board: 'WIDE, THE OLD BRIDGE AT SUNSET, THE TAP PICTURE. A wet brown otter head pops up out of the golden river by the bank, grinning from ear to ear, and on the bank our cat lifts a paw while Chispapaw stares at him and Tallyheart sits by. In play its raised paw glows softly; one tap waves to Riffle and the page turns. Caption top left; his balloon a shout.',
      caption: ['A wet head pops up over the bank.'],
      say: [
        { who: 'riffle', text: 'I SAID see you tomorrow! It’s TOMORROW!', kind: 'shout' },
        { who: 'riffle', text: 'Too cold for a swim today. Even for you.', when: { specialty: 'swimming' } }
      ],
      scratch: { tap: 'paw', prompt: '**Tap** to wave to Riffle.', label: 'Wave to Riffle.', next: 'f063' }
    },

    f063: {
      // never juggling under the Old Bridge: Otter's honor
      scene: S('bridge', 'under', UNDER, underRiffle('stand', 'proud'), ['sunset']),
      board: 'WIDE, UNDER THE OLD BRIDGE, SUNSET. The young otter stands on the mud under the bridge holding his juggling pebbles very carefully in both paws, chest out, not juggling them at all; our cat, Chispapaw and Tallyheart sit round him. Caption top left; his balloon solemn.',
      caption: ['Under the bridge, he has his pebbles in his paws.'],
      say: [{ who: 'riffle', text: 'Not juggling. HOLDING. Otter’s honor.' }],
      next: 'f064'
    },

    f064: {
      // no `motion`: it draws speed streaks behind the first cast member (a run, a bounce), so Riffle read as rushing off;
      // no effect draws a twitch, so the rigid stand and the caption carry it (the review's round)
      scene: S('bridge', 'under', UNDER, underRiffle('stand', 'solemn'), ['sunset']),
      board: 'WIDE, UNDER THE OLD BRIDGE, SUNSET, COMEDY BEAT. The otter stands rigidly still with his pebbles clutched to his chest, every whisker straining, desperate to toss them; the cats watch him try. One caption at the top.',
      caption: ['His paws twitch. They really want to juggle. He holds very, very still.'],
      next: 'f065'
    },

    f065: {
      scene: S('bridge', 'under', UNDER, underRiffle('stand', 'happy', { chispa: 'shy' }), ['sunset']),
      board: 'WIDE, UNDER THE OLD BRIDGE, SUNSET. The otter spots the little cream cat and leans toward her with a huge friendly grin, and Chispapaw answers shyly, not sure what juggling is; he decides that is near enough. Caption top left; three balloons in turn.',
      caption: ['He spots Chispapaw.'],
      say: [
        { who: 'riffle', text: 'A NEW one! Do you juggle?' },
        { who: 'chispapaw', text: 'I… count?' },
        { who: 'riffle', text: 'Close enough!' }
      ],
      next: 'f066'
    },

    f066: {
      // the hook: Riffle's news; the track's place unsaid, no badger anywhere
      scene: S('bridge', 'under', UNDER, underRiffle('stand', 'shout', { tally: 'wonder', chispa: 'wonder', you: 'wonder' }), ['sunset']),
      board: 'WIDE, UNDER THE OLD BRIDGE, SUNSET, THE CHOICE. The otter bursts with news, pebbles clutched tight and eyes huge, and the cats all lean in. Caption top left; his balloon a shout; the choices sit below the panel.',
      caption: ['Riffle can’t hold still a heartbeat longer.'],
      say: [{ who: 'riffle', text: 'NEWS! Granny’s found ANOTHER badger track. A FRESH one! Come to the Crossing at first light!', kind: 'shout' }],
      choice: {
        options: [
          { label: '“We’ll be there!”', sets: {}, next: 'f067' },
          { label: '“First light? I just WOKE UP!”', sets: {}, next: 'f067' }
        ]
      }
    },

    f067: {
      scene: S('bridge', 'bank', BANK,
        [c('riffle', 'dive', 'happy', 'water', 'left'), chispa('sit', 'happy', BANK_CHISPA, 'right'), you('sit', 'happy', 'bank-left', 'right'), tally('sit', 'kind', 'bank-right', 'left')], ['sunset']),
      board: 'WIDE, THE OLD BRIDGE AT SUNSET. The otter dives off into the golden river, pebbles and all, his tail flipping up out of a big splash, and on the bank the cats watch him go. The splash lettered big; his balloon a shout from the water.',
      say: [{ who: 'riffle', text: 'See you at first light!', kind: 'shout' }],
      sfx: 'Splash!',
      next: 'f068'
    },

    f068: {
      // “Another one,” says Tallyheart. Her ears are up. “First light, then.”: one balloon, her ears drawn
      scene: S('bridge', 'bank', BANK,
        [chispa('sit', 'wonder', BANK_CHISPA, 'right'), you('sit', 'wonder', 'bank-left', 'right'), tally('sit', 'happy', 'bank-right', 'left')], ['sunset']),
      board: 'WIDE, THE OLD BRIDGE AT SUNSET. Ripples spread on the empty golden river where the otter went down, and Tallyheart sits on the bank with her ears pricked straight up, interested; our cat and Chispapaw look at her. Caption top left; her balloon thoughtful.',
      caption: ['Off he goes, pebbles and all.'],
      say: [{ who: 'tallyheart', text: 'Another one. First light, then.' }],
      next: 'f069'
    },

    f069: {
      // looking upriver: no badger, no track drawn
      scene: S('bridge', 'bank', BANK,
        [chispa('sit', 'wonder', BANK_CHISPA, 'right'), you('sit', 'wonder', 'bank-left', 'right'), tally('sit', 'kind', 'bank-right', 'left')], ['sunset']),
      board: 'WIDE, THE OLD BRIDGE AT SUNSET. Our cat and Chispapaw sit side by side on the bank looking out upriver, where the sunset glows behind the far trees, wondering; Tallyheart sits beside them. The water is calm and gold. One caption at the top.',
      caption: ['The track on Gathering Island was old. This one is FRESH.'],
      next: 'f070'
    },

    /* ------------------------------------------------------------------ Bedtime: the moon at 16 */

    f070: {
      scene: S('camp', 'reveal', CAMP_NIGHT,
        [c('clancat', 'curl', 'sleepy', 'crowd-left', 'right', { variant: 3, asleep: true }), c('clancat', 'curl', 'sleepy', 'crowd-right', 'left', { variant: 1, asleep: true })], ['night']),
      board: 'WIDE, THE CAMP BY MOONLIGHT. The moon has come up over the wild garden, a little past full and lit on its left, and the dens, the ferns and the old stone fountain all shine silver; two Clan cats are curled asleep by their dens. Quiet and calm. One caption at the top.',
      caption: ['The moon comes up over camp, and everything turns silver.'],
      next: 'f071'
    },

    f071: {
      // her stone by her nose or under her chin (`ch2Stone`), as the den's `stone: 'auto'` draws it; captions first
      scene: S('den', 'nest', DENW_NIGHT, [nestChime('lie', 'sleepy'), nestYou('loaf', 'kind')], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT. Our cat lies in its soft deep nest out of the moonlight, the plain grey mist stone on the moss by its paws and Riffle’s nearly black stone where it always lies; it whispers goodnight to the stone. In the next nest the tortoiseshell warrior lies with her chin on her paws. Captions top left; its balloon a whisper.',
      caption: [
        'Your warrior’s nest is soft and deep.',
        'Out of the moonlight, your mist stone is grey on the moss.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      say: [{ who: 'player', text: 'Goodnight, Sprinkle.', kind: 'whisper' }],
      next: 'f072'
    },

    f072: {
      // Chispapaw's goodnight from across the camp: off the panel, named, so it shows no face
      scene: S('den', 'nest', DENW_NIGHT, [nestChime('lie', 'sleepy'), nestYou('sit', 'happy', { tailUp: true, tap: 'tail' })], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT, THE TAP PICTURE. In the next nest the tortoiseshell warrior yawns hugely, teasing, and our cat sits up in its nest with its tail raised, calling back toward a small voice from across the camp. In play its raised tail glows softly; one tap waves it goodnight and the page turns. Three balloons: the warrior’s a yawn, the far voice a call, our cat’s an answer.',
      say: [
        { who: 'murmurchime', text: 'Your first day. A store to count and an apprentice. Show-off.' },
        { who: 'chispapaw', name: 'Chispapaw', text: 'Goodnight, {name}{ending}! Will you teach me to catch a mouse?', kind: 'shout' },
        { who: 'player', text: 'Tomorrow.' }
      ],
      scratch: { tap: 'tail', prompt: '**Tap** to wave goodnight.', label: 'Wave goodnight.', next: 'f073' }
    },

    f073: {
      // the apprentices' den: the grey tom has a denmate at last, in our cat's old nest (the picture only)
      scene: S('den', 'inside', DEN_APP, [c('snorer', 'sit', 'proud', 'sleeper-1', 'right'), chispa('loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, NIGHT. Moonlight falls through the rosebush doorway, and the skinny grey apprentice sits up in his nest looking very pleased with himself, while across the den Chispapaw lies loafed in a soft moss nest, her bell glinting. Caption top left; three balloons, his proud, hers bright, his baffled.',
      caption: ['In the apprentices’ den, the grey tom has a denmate at last.'],
      say: [
        { who: 'snorer', text: 'She counts in Spanish. Paw thing?' },
        { who: 'chispapaw', text: 'My little Tall One does a paw thing too. With FINGERS.' },
        { who: 'snorer', text: 'Weird.' }
      ],
      next: 'f074'
    },

    f074: {
      // the paw thing by taps, in Chispapaw's Spanish, out loud: chapter 4's bedtime tens, her two forepaws; the page
      // waits for Next once the English is lettered under the fifth tap
      scene: S('den', 'inside', DEN_APP, [c('snorer', 'sit', 'happy', 'sleeper-1', 'right'), chispa('loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, NIGHT, THE TAP PICTURE. Chispapaw lifts her head in her nest and calls out the start of the count in her own language, and the grey apprentice settles down to listen. In play the counting picture takes the panel: our cat’s two forepaws on the moss; each tap lights ten claws and Chispapaw says the next ten in Spanish, up to fifty, its English under it at the end. Caption top left; her balloon a cheer with its English under it.',
      caption: ['You do the paws. She does the words.'],
      say: [{ who: 'chispapaw', lang: 'es', text: '{es:aContar}' }],
      skip: { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es', carry: false, prompt: '**Tap** your forepaws.', next: 'f075' }
    },

    f075: {
      scene: S('den', 'inside', DEN_APP, [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right', { asleep: true }), chispa('loaf', 'happy', 'nest', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, NIGHT. The grey apprentice has curled up fast asleep in his nest, a little zzz rising from him, and mumbles in his sleep with a smile; across the den Chispapaw grins at him. Caption top left; his balloon a sleepy mumble.',
      caption: ['By {es:50}, the grey tom is snoring.'],
      say: [{ who: 'snorer', text: 'Same paw thing. Better words.', kind: 'whisper' }],
      next: 'f076'
    },

    f076: {
      scene: S('den', 'nest', DENW_NIGHT, [nestChime('lie', 'sleepy', { asleep: true }), nestYou('loaf', 'happy')], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT, COMEDY BEAT. In the next nest the tortoiseshell warrior has dozed off with her chin on her paws and mutters in her sleep, and a small inset shows a dream of mice in neat rows; our cat lies in its nest, listening and smiling. Her balloon a sleepy mumble.',
      say: [{ who: 'murmurchime', text: 'Mice… {es:50} mice…', kind: 'whisper' }],
      next: 'f077'
    },

    f077: {
      // Tallyheart padding past behind the two nests, touching nobody
      scene: S('den', 'nest', DENW_NIGHT, [nestChime('lie', 'sleepy', { asleep: true }), nestYou('loaf', 'happy'), tally('walk', 'kind', PAST, 'left')], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT. Tallyheart pads quietly past the nest on her way to her own, coming in at the edge of the panel, and looks down at our cat with a warm, proud look without stopping; the tortoiseshell warrior sleeps on. Her balloon soft.',
      say: [{ who: 'tallyheart', text: 'A good day’s work, warrior.' }],
      next: 'f078'
    },

    f078: {
      scene: S('den', 'nest', DENW_NIGHT, [nestChime('lie', 'sleepy', { asleep: true }), nestYou('curl', 'sleepy', { asleep: true })], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT. Our cat curls up tight in its warrior’s nest beside the sleeping tortoiseshell warrior’s, warm and safe, the grey mist stone on the moss beside it and the moonlight soft at the edge of the panel. Three captions in a column.',
      caption: ['Today, you woke up a brand-new warrior.', 'Tonight, someone across the camp wants to be just like you.', 'You curl up tight, warm and safe, and sleep.'],
      next: 'f079'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f079: {
      scene: S('den', 'nest', DENW_NIGHT, [nestYou('curl', 'sleepy', { asleep: true }), nestChime('lie', 'sleepy', { asleep: true })], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in its warrior’s nest beside the sleeping tortoiseshell warrior, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled; little sparkles round our cat. Soft silver moonlight. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}{ending} dream, with a fresh track waiting at first light?'],
      input: { kind: 'dream', placeholder: 'A spark… a store… a fresh track…', next: 'f080' }
    },

    f080: {
      // the closing frame: across the camp, Chispapaw asleep in the apprentices' den, in our cat's old nest (the
      // picture only), the grey tom asleep in his
      // (Chispapaw first, so the sparkle the art scatters round the first cast member is round her)
      scene: S('den', 'inside', DEN_APP, [chispa('curl', 'sleepy', 'nest', 'left', { asleep: true }), c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right', { asleep: true })], ['night', 'sparkle']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, CLOSING SHOT. Moonlight falls through the rosebush doorway across the sleeping den: the grey apprentice snores in his nest, and in the soft moss nest our cat once slept in, Chispapaw rolls over and curls up tight, her tiny bell catching the light. Captions at the bottom, with END OF CHAPTER TWELVE lettered like a title.',
      caption: ['{name}{ending} sleeps.', 'Across the camp, Chispapaw rolls over, and her tiny bell goes *ting*. Then she sleeps too.', 'End of Chapter Twelve.'],
      end: true
    }
  };

  /* The chapter's Counts sets (the spec's section 2, exactly): the warm-up (her two hardest Counts of all 54 pairs, then
   * one more, Chispapaw's echo on her first right answer), the lesson (take-aways, step 1: the worked example, then
   * four), and the store's catch (one take-away, no twin). */
  function T(text) { return { who: 'tallyheart', text: text }; }

  PC.story.ch12 = {
    id: 'ch12',
    number: 12,
    title: 'A Spark at the Hedge',
    // module 2's first chapter: it opens once chapter 11 is finished (number order), and its page lands in book two
    module: 2,
    start: 'f001',
    // our cat's balloons labelled with her warrior name on every page of the chapter
    names: { player: '{name}{ending}' },

    // No card: module 2 has no Case File (module 1's is final).
    cards: {},

    frames: frames,

    counts: {
      'ch12-warm': {
        teacher: 'tallyheart',
        // the kit's cross-table warm-up: her hardest at 0, her next at 1; the third the set's own. Each alt carries its
        // anchor Count's table, so it is asked in that Count's own words and picture
        warmHard: { table: 'all', at: [0, 1], alt: [{ a: 3, b: 8, table: 3 }, { a: 4, b: 7, table: 4 }, { a: 9, b: 6, table: 9 }] },
        facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }],
        praise: [], fast: [], done: '',
        // the Spanish feature: her first right answer (a retry's counts), said in Spanish in the order asked
        echo: { on: 'first', lines: [
          { who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' },
          { who: 'chispapaw', text: 'My little Tall One says these every night! I never knew what they MEANT.' }
        ] }
      },
      'ch12-take': {
        op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
        facts: [
          { a: 254, b: 131, regroup: 'show',
            prompt: 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.',
            right: [T('One square, two rows, three loose left.')] },
          // (Chispapaw's whisper is 76 − 42's prompt, not 58 − 23's second balloon: three balloons over her first column of her
          // own put Tallyheart's “Now you try” under the bar on a sideways iPad, the review's round)
          { a: 58, b: 23, prompt: [T('Now you try, all by yourself. Little take-aways first, then big.')] },
          { a: 76, b: 42, prompt: [{ who: 'chispapaw', kind: 'whisper', text: 'My little Tall One always sighs at homework.' }] },
          [475, 132], [368, 145]
        ],
        echo: { on: [[475, 132]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] }
      },
      'ch12-store': {
        op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, twins: false, done: '',
        facts: [{ a: 175, b: 42,
          prompt: [{ who: 'glintstar', text: 'How many stay in the store, {name}{ending}?' }],
          right: [{ who: 'glintstar', text: 'One hundred thirty-three in the store.' }] }]
      }
    },

    book: {
      title: '{name}{ending}’s First Frost-Time',
      chapterTitle: 'A Spark at the Hedge',
      // book two: the store drawn under the recap, one square, three rows, three loose
      store: 133,
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}{ending}’s dream: “{dream}”',
      noDream: '{name}{ending}’s first frost-time dream stayed a secret.',
      // Seven entries on every reading, each true on every path (the store at 133 whether 175 − 42 was helped or not;
      // “spoke up for her” on all three vouching lines); in English only (the book letters no Spanish)
      recap: [
        { text: 'On {name}{ending}’s first day as a warrior, {they} slept till noon, and Glintstar gave {them} a frost-time job: counting a new store under the Old Bridge, five hundred pieces by the full moon.' },
        { text: 'At the hedge, a little pillow cat from {their} old tower was counting the Clan in Spanish, the way {name}{ending} once watched through the glass.' },
        { text: '{name}{ending} spoke up for her, and she chose her own Clan name: Chispa, which means spark. Glintstar named her Chispapaw, and gave her to {name}{ending} as {their} very first apprentice.' },
        { text: 'In the Training Hollow, Tallyheart taught them both something new: take-aways, with loose ones, rows and squares, ones first.' },
        { text: 'At sunset the Clan’s first frost-time catch went into the store, and {name}{ending} counted what stayed: one hundred thirty-three, one square, three rows and three loose.' },
        { text: 'Riffle brought news: Granny has found another badger track, a fresh one.' },
        { text: 'At bedtime, Chispapaw did the paw thing in Spanish, all the way to fifty, and the grey tom snored.' }
      ]
    },

    // chapter 13's hook, on the hub once the chapter is finished
    teaser: {
      title: 'Chapter 13: The Hunter’s Crouch',
      lines: ['Granny has news: a fresh badger track. Who made this one?']
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
