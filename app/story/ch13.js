/* Chapter 13: The Hunter's Crouch.
 *
 * The story (docs/chapters/13-the-hunters-crouch.md, Draft v0.6, final) cut into graphic-novel panels, per the frame
 * contract in docs/build.md; its spec (docs/chapters/13-the-hunters-crouch.spec.md, v0.3) is the build's contract for
 * the flags, the Counts sets, the art, the pages she taps, the Spanish and the book. Day 2 of module 2, the first frost:
 * her first dawn patrol as a warrior, the hunter's crouch taught to her own apprentice, the first spreads in the
 * Training Hollow, a courtesy patrol to GroveClan's big dig, and the marks beside it. Each frame is one moment: a drawn
 * scene, a written storyboard (`board`) for a future illustrator, short captions, speech balloons and sound effects,
 * and exactly one interaction. Frame ids run in reading order, the order of the story's screens, f001 to f084:
 *   the polite ask f051 → f052a (“Please, may we see your hole?”) and f052b (“…POLITELY.”, “The elder blinks.”), both
 *                  → f053;
 *   the groundhog  f058 → f059 to f064 (“Look closer.”: the optional scene, its last screen setting `foundGroundhog`
 *                  for good) → f065; “Home before sunset.” → f065 at once.
 * So 78 frames on a plain reading and 84 with the groundhog (the spec's count; the brief's cap 125). The light choices
 * (waking, Chispapaw's “Is it tomorrow NOW?”) set nothing and go to the next screen.
 *
 * Two flags (the spec's section 1): `teach` ('show', 'try', 'words'), set by the crouch's choice (f018) and replaced on
 * a reread, colours two of Chispapaw's moments, each one picture with a caption and a balloon by `when` (f019, f078);
 * `foundGroundhog`, sticky, is set by reaching f064. Read from earlier chapters: `specialty` (f010, the swimmer's
 * steam; f058, one caption each of the five) and `ch2Stone` (f076). No `ch10Best`, `ch11Named` or `{petname}` line.
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that follows a
 * balloon on one screen of the story opens the next panel, or the panel is split (the spec's list), and no panel
 * holds five boxes. A speaker's paragraphs in a row are balloons in a row (the elder f056, the old tom f071,
 * Tallyheart f036 and f081). Speech tags' narration is not lettered (the picture carries it); the spec's list of tags
 * lettered as captions is (“{Murmur}chime is up already.”, “One bonks his nose.”, “The elder blinks.”, …).
 *
 * The Spanish (chapter 12's feature, data only): a whole Spanish line is a balloon with `lang: 'es'` written in tokens
 * and punctuation only, its English made by the engine and lettered under it (f033's “¡No alcanza!”, f035's whispered
 * “¡Desagrupo!”, decision 55's word, f040's whispered “¡Veinticinco!”); a Spanish word in an English line is a token,
 * `{Es:resta}` (f030, the table holding it as lettered). Never the engine's own marks (the guillemets) here. The
 * warm-up's echo and the lesson's (after 85 − 39) are the sets' own `echo`; no Count is asked in Spanish and no column
 * is echoed.
 *
 * Speakers: our cat's balloons are labelled with her warrior name (`names.player`); Granny's carry `name: 'Granny'`
 * (an otter, variant 3); the ferry otters are labelled by their variants, listed otter 2 then otter 1 on f012 and f013
 * (a balloon comes from the nth cast member of its speaker); the groundhog's balloons are “The round brown thing” until
 * it says GROUNDHOG (f060 to f062), the page's “The groundhog” after; Tallyheart's call from the bridge (f068) and
 * Chispapaw's goodnight from across the camp (f079) are off the panel, so they carry `name` and show no face. The
 * GroveClan elder is listed before the apprentice wherever both are drawn; the apprentice never speaks. The grey tom
 * stays unnamed.
 *
 * Staging (the spec's spots, each looked at in a render; the sets owner's notes): first light to the Hollow at
 * `morning` (the Crossing and the riverbank too: the sets owner looked once and both read right by morning), noon and
 * the path to GroveClan at `day` (chapter 12's midday run is `day`), GroveClan's woods at their own bright afternoon
 * (`day`, `todFixed`), home at `sunset`, bedtime at `night` under the stars: no moon is drawn anywhere (it has not risen
 * yet). The camp's first frost (`frost: true`; its three trails, `'prints'`, on f007 only). The crouch (f017 to f026)
 * on the camp's `crowd` camera, the sets owner's fallback from `ferns` (three cats could not stand there apart): our
 * cat at `ferns-1`, Chispapaw at `ferns-2`, Tallyheart at `crowd-right`, watching. In the Hollow Tallyheart at `tree`,
 * our cat at HOL_YOU and Chispapaw behind her at `sunpatch-3`, the spread marks in their own box between them. At the
 * old oak our three at `root-1`, `oak-near` and `root-2`, the elder at `elder`, clear of the dig. Every cast is listed
 * back to front (the fountain top, raised, anywhere; the first member of a `motion` or `bonk` frame, the one it moves,
 * excepted; the den as its close-ups lay it; the GroveClan apprentice behind her fern after the elder). No two cats
 * touch; no grown cat laughs; Chispapaw wears her collar till she leaves it in her nest (f027), `collar: false` from
 * then on, and the den draws it beside her nest (`collar: true`). No badger anywhere, not even a shadow.
 *
 * The book's entries are one sentence each: seven on every reading, eight with the groundhog. Text conventions: second
 * person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …) so nothing needs escaping; a word joiner
 * after a leading ellipsis, so it never stands alone at a line's end, and inside “take-aways”, so it never breaks.
 * tests/story-ch13.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch13.md.
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
  // stone on its moss), by first light and by night: no moon (it has not risen yet); the apprentices' den, and from the
  // collar's Tap on her collar curled in its hollow beside Chispapaw's nest
  var DENW13 = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true, miststone: true };
  var DEN_APP = { weather: 'clear' };
  var DEN_COLLAR = { weather: 'clear', collar: true };
  // the camp's first frost, and the dawn patrol's three trails across it (f007 only); the camp by day with the Clan in
  // it; the camp at sunset and asleep under the stars, as it is
  var FROST = { frost: true };
  var PRINTS = { frost: 'prints' };
  var CAMP_DAY = { crowd: true };
  // the Crossing: never the set's default airplane, which the story never mentions (chapter 5's CROSS)
  var CROSS13 = { plane: 'none' };
  // the Training Hollow: her ten claw marks on the leaning tree, glowing as chapters 2 to 12 carry them
  var H13 = { marks: 10, glow: 'auto' };
  // GroveClan's woods: the big dig at the old oak's roots; the marks beside it, half under the leaves, then bare
  var DIG = { dig: true };
  var LEAVES = { marks: 'leaves' };
  var BARE = { marks: 'bare' };

  // The spots (world units, each set's main composition), each settled in a render:
  // her warrior's nest: Tallyheart's head over its edge at first light, and padding past it at night (chapter 12's
  // PAST), a step nearer than the nests at the close-up's right edge, touching nobody
  var PEER = { x: 1270, y: 960, h: 200 };
  var PAST = { x: 1280, y: 965, h: 200 };
  // the camp at first light: the patrol stepping out of the dens, then heading for the entrance; the trails behind them
  var DAWN_CHIME = { x: 1020, y: 800 };
  var OUT_TALLY = { x: 430, y: 900 };
  var OUT_YOU = { x: 700, y: 905 };
  var OUT_CHIME = { x: 960, y: 912 };
  var DAWN_YOU = { x: 480, y: 925 };
  var DAWN_BACK = { x: 720, y: 905 };
  // the camp, the front row left of the fountain (chapters 11 and 12's RING_YOU), and Tallyheart coming in beside it
  var RING_YOU = { x: 610, y: 905 };
  var IN_TALLY = { x: 350, y: 900 };
  // noon: the Clan round the fountain (chapter 12's midday count), Chispapaw close beside our cat; the old tom come to
  // the front
  var NOON_CLAN = { x: 330, y: 784 };
  var NOON_OLD = { x: 1140, y: 770 };
  var NOON_CLAN2 = { x: 1300, y: 778 };
  var NOON_YOU = { x: 750, y: 904 };
  var NOON_TALLY = { x: 985, y: 906 };
  var NOON_CHISPA = { x: 560, y: 912 };
  var OLD_FRONT = { x: 1230, y: 912 };
  // the courtesy patrol sent off, and home at sunset: Glintstar at the fountain's foot, our cat and Tallyheart on her
  // right (chapter 12's naming)
  var NAME_YOU = { x: 1040, y: 906 };
  var NAME_TALLY = { x: 1270, y: 902 };
  // the old tom's tale by the pile: the old tom at the right, telling it to the grey tom, who faces him; our cat and
  // Chispapaw come up on the left (room for both to flop flat)
  var TALE_OLD = { x: 1260, y: 902 };
  var TALE_GREY = { x: 1010, y: 906 };
  var TALE_YOU = { x: 760, y: 906 };
  var TALE_CHISPA = { x: 520, y: 912 };
  // the Crossing: Granny at the rocks' edge by the raft; the patrol walking off home along the shore; one cat on the
  // shore at the raft, the otters' audience
  var CROSS_GRANNY = { x: 960, y: 858 };
  var CROSS_YOU = { x: 495, y: 925 };
  var CROSS_THIRD = { x: 725, y: 900 };
  var RAFT_SHORE = { x: 880, y: 870 };
  // the riverbank path: the patrol home with its mice; Chispapaw at our cat's heels (chapter 12's PATH_CHISPA),
  // Tallyheart behind them on the way to GroveClan
  var PATH_CHISPA = { x: 560, y: 762 };
  var PATH_BACK = { x: 330, y: 760 };
  // GroveClan's bridge end: the three standing (a step wider than the woods' edge spots, which hold three sitting)
  var BRIDGE_CHISPA = { x: 520, y: 894 };
  var BRIDGE_YOU = { x: 700, y: 888 };
  // the dig close: Chispapaw crouched a step further back on the shiver (clear of our cat's crouch)
  var DOOR_BACK = { x: 672, y: 930 };
  // the Hollow: our cat on the sand facing Tallyheart (the sets owner's HOL_YOU, chapter 12's)
  var HOL_YOU = { x: 690, y: 892 };

  /* The cast members who come back, by place. */
  function tally(pose, mood, at, facing, extra) { return c('tallyheart', pose, mood, at, facing, extra); }
  function chispa(pose, mood, at, facing, extra) { return c('chispapaw', pose, mood, at, facing, extra); }
  function you(pose, mood, at, facing, extra) { return c('player', pose, mood, at, facing, extra); }
  function chime(pose, mood, at, facing, extra) { return c('murmurchime', pose, mood, at, facing, extra); }
  // Chispapaw without her collar, from f027 on (she left it in her nest)
  function bare(extra) { return merge({ collar: false }, extra || {}); }
  function chispa0(pose, mood, at, facing, extra) { return chispa(pose, mood, at, facing, bare(extra)); }
  // her warrior's nest: {Murmur}chime in the next nest, our cat in her own (listed so: the next nest at the back)
  function nestChime(pose, mood, extra) { return chime(pose, mood, 'next-nest', 'right', extra); }
  function nestYou(pose, mood, extra) { return you(pose, mood, 'nest', 'left', extra); }
  // the crouch, on the camp's crowd camera, back to front: Tallyheart watching from the side, Chispapaw, our cat teaching
  function crouch(ch, me, ta) {
    var t = tally('sit', ta || 'proud', 'crowd-right', 'left'), y = you(me[0], me[1], 'ferns-1', 'right', me[2]);
    return [t, chispa(ch[0], ch[1], 'ferns-2', ch[3] || 'right', ch[2]), y];
  }
  // the Hollow: Chispapaw behind our cat, Tallyheart at the tree, our cat on the sand (back to front)
  function hollow(chispaMood, tallyMood, youMood, extra) {
    return [chispa0('sit', chispaMood, 'sunpatch-3', 'right'), tally('sit', tallyMood, 'tree', 'left'), you('sit', youMood, HOL_YOU, 'right', extra)];
  }
  // noon round the fountain, back to front: the old tom, two Clan cats, Glintstar on the fountain top (raised, anywhere),
  // our cat and Tallyheart in the front row, Chispapaw close beside our cat (and the old tom come to the front, f041)
  function noon(o) {
    o = o || {};
    var out = [];
    if (!o.oldFront) out.push(c('grizzled', 'sit', o.old || 'neutral', NOON_OLD, 'left'));
    // (the second Clan cat steps aside for the old tom at the front, whose shoulder would cover her face)
    if (!o.oldFront) out.push(c('clancat', 'sit', 'happy', NOON_CLAN2, 'left', { variant: 5 }));
    out.push(c('clancat', 'sit', 'happy', NOON_CLAN, 'right', { variant: 2 }), c('glintstar', 'stand', o.glint || 'solemn', 'fountain-top', 'left'));
    out.push(you('sit', o.you || 'wonder', NOON_YOU, 'left'), tally('sit', o.tally || 'kind', NOON_TALLY, 'left'),
      chispa0('sit', o.chispa || 'wonder', NOON_CHISPA, 'right'));
    if (o.oldFront) out.push(c('grizzled', 'sit', o.old, OLD_FRONT, 'left'));
    return out;
  }
  // the courtesy patrol sent off, and home at sunset: Glintstar at the fountain's foot, Tallyheart, our cat, Chispapaw
  // in the middle facing our cat (back to front)
  function sendoff(o) {
    o = o || {};
    var g = o.glint || ['sit', 'kind'];
    return [c('glintstar', g[0], g[1], 'fountain-foot', 'right'), tally('sit', o.tally || 'kind', NAME_TALLY, 'left'),
      you('sit', o.you || 'wonder', NAME_YOU, 'left'), chispa0(o.chispaPose || 'sit', o.chispa || 'wonder', 'center', 'right')];
  }
  // the old tom's tale by the pile, back to front: our cat and Chispapaw come up on the left, the grey tom facing the old
  // tom at the right
  function tale(o) {
    o = o || {};
    return [c('grizzled', 'sit', o.old || 'shout', TALE_OLD, 'left'), you(o.youPose || 'sit', o.you || 'happy', TALE_YOU, 'right', o.youExtra),
      c('snorer', 'sit', o.grey || 'wonder', TALE_GREY, 'right'), chispa0(o.chispaPose || 'sit', o.chispa || 'happy', TALE_CHISPA, 'right')];
  }
  // GroveClan: the elder (and the apprentice behind his fern, listed after her: her balloons are the first groveclan's)
  function elder(mood, at, facing) { return c('groveclan', 'sit', mood, at || 'elder', facing || 'left', { variant: 1 }); }
  function apprentice(at, facing) { return c('groveclan', 'sit', 'shy', at || 'fern', facing || 'left', { variant: 2 }); }
  // the dig close: the groundhog in its doorway (first, where the shiver's motion lines are its), Chispapaw a step back,
  // our cat at the doorway (back to front)
  function door(gh, ch, me) {
    return [c('groundhog', gh[0], gh[1], 'doorway', 'right', gh[2]), chispa0(ch[0], ch[1], ch[2] || 'door-2', 'left'), you(me[0], me[1], 'door-1', 'left', me[2])];
  }

  // the off-panel voices' tags, and the groundhog's until it names itself
  var ROUND = 'The round brown thing';
  var WJ = '⁠';
  var TAKEAWAYS = 'take-' + WJ + 'aways';

  var frames = {

    /* ------------------------------------------------------------------ First light: her warrior's nest */

    f001: {
      // the start frame shows to everyone: the chapter's title over her nest (chapter 8's title panel); {Murmur}chime awake
      scene: S('den', 'nest', DENW13, [nestChime('sit', 'happy'), nestYou('curl', 'sleepy', { asleep: true })], ['morning', 'zzz']),
      board: 'CLOSE-UP, THE TITLE PANEL, FIRST LIGHT. Our cat sleeps curled tight in its warrior’s nest in the first pale light of morning, its bark, its glass and the grey mist stone tucked round it, while in the next nest the tortoiseshell warrior already sits up, wide awake. One small zzz rises. The chapter’s title is lettered across the top of the panel like a title page.',
      caption: ['Chapter 13: The Hunter’s Crouch'],
      next: 'f002'
    },

    f002: {
      // Tallyheart's head over the edge of the nest, at the close-up's right edge, touching nobody
      scene: S('den', 'nest', DENW13, [nestChime('sit', 'happy'), nestYou('loaf', 'sleepy'), tally('peer', 'kind', PEER, 'left')], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, FIRST LIGHT. Tallyheart’s big ginger head pokes over the edge of the nest from the right with her torn ear cocked, and our cat blinks up at her from the moss, half asleep; the tortoiseshell warrior grins from the next nest. Her balloon brisk and fond.',
      say: [{ who: 'tallyheart', text: 'First light, warrior. Riffle’s waiting.' }],
      next: 'f003'
    },

    f003: {
      scene: S('den', 'nest', DENW13, [nestChime('sit', 'happy'), nestYou('sit', 'sleepy'), tally('peer', 'kind', PEER, 'left')], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, FIRST LIGHT, THE CHOICE. Our cat sits up in its nest with its fur still rumpled, and the tortoiseshell warrior, already up and bright-eyed, leans across from the next nest bursting with the news; Tallyheart waits at the edge. Caption top left; her balloon thrilled; the choices sit below the panel.',
      caption: ['{Murmur}chime is up already.'],
      say: [{ who: 'murmurchime', text: 'Your first dawn patrol! Just the three of us.' }],
      choice: {
        options: [
          { label: '“I’m UP!”', sets: {}, next: 'f004' },
          { label: '“First light ALREADY?”', sets: {}, next: 'f004' }
        ]
      }
    },

    f004: {
      // the first frost: every fern white; our cat's paw the Tap (the crunch)
      scene: S('camp', 'reveal', FROST,
        [tally('walk', 'kind', 'crowd-right', 'left'), chime('walk', 'happy', DAWN_CHIME, 'left'), you('walk', 'wonder', 'center', 'left', { tap: 'paw' })], ['morning']),
      board: 'WIDE, THE CAMP AT FIRST LIGHT, THE TAP PICTURE. The whole wild garden is white with the first frost: every fern edged and tipped with silver rime, the moss and the path stones pale, the fountain’s rim white, and our cat steps out in front, staring, one paw lifted off the crunchy ground, with Tallyheart and the tortoiseshell warrior behind. In play its lifted paw glows softly; one tap crunches it down again and the page turns. Three captions in a column, top left.',
      caption: ['Outside, every fern is WHITE. The first frost!', 'All your pillow life, frost was a picture through the glass. Now it CRUNCHES under your paws.',
        'It’s like your very first step on grass. Only CRUNCHIER.'],
      scratch: { tap: 'paw', prompt: '**Tap** to crunch it again.', label: 'Crunch it again.', next: 'f005' }
    },

    /* ------------------------------------------------------------------ The dawn patrol */

    f005: {
      // the apprentices' den: Chispapaw asleep in our cat's old nest, collar and bell on (her bell's ting in the caption)
      scene: S('den', 'inside', DEN_APP,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right', { asleep: true }), chispa('curl', 'sleepy', 'nest', 'left', { asleep: true })], ['morning', 'zzz']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, FIRST LIGHT. Pale morning light falls through the rosebush doorway onto two sleeping apprentices: the skinny grey tom curled up in his nest, and in the soft moss nest our cat once slept in, the little cream cat curled tight, the tiny gold bell on her collar catching the light. Little zzzs rise. Three captions in a column, top left.',
      caption: ['The three of you pad out of camp, past the apprentices’ den.', 'The grey tom is still asleep, and so is Chispapaw.',
        'Her bell goes *ting* with every snore. *Ting.* *Ting.*'],
      next: 'f006'
    },

    f006: {
      // heading for the entrance, no trails yet (they are being made); {Murmur}chime behind our cat, facing her; the
      // breath not drawn (said, the spec's section 7, item 4); our cat's nose the Tap
      scene: S('camp', 'crowd', FROST,
        [tally('walk', 'kind', OUT_TALLY, 'left'), you('walk', 'happy', OUT_YOU, 'left', { tap: 'nose' }), chime('walk', 'happy', OUT_CHIME, 'left')], ['morning']),
      board: 'MEDIUM, ACROSS THE FROSTY CAMP, THE TAP PICTURE, COMEDY BEAT. The three cats pad across the white camp toward the entrance in the cold morning air, Tallyheart in front, and just behind our cat the tortoiseshell warrior puffs out her cheeks and blows, pretending to be a dragon. In play our cat’s nose glows softly; one tap puffs a little cloud back and the page turns. Caption top left; her balloon a gleeful roar.',
      caption: ['Your breath makes little clouds in the cold air. {Murmur}chime puffs one at you.'],
      say: [{ who: 'murmurchime', text: 'Look! I’m a DRAGON!' }],
      scratch: { tap: 'nose', prompt: '**Tap** to puff one back.', label: 'Puff one back.', next: 'f007' }
    },

    f007: {
      // the three trails across the white (many prints a trail, never twelve), behind the three at the entrance;
      // Tallyheart turned back over them: her prompt is the Count's page
      scene: S('camp', 'reveal', PRINTS,
        [tally('sit', 'kind', DAWN_BACK, 'right'), you('sit', 'wonder', DAWN_YOU, 'left'), chime('sit', 'happy', 'entrance', 'left')], ['morning']),
      board: 'WIDE, THE CAMP AT FIRST LIGHT, THEN THE COUNTS. Behind the three cats at the camp’s entrance, three trails of small green pawprints run side by side across the frosty white from the dens, and Tallyheart has turned round to look back at them with her ears up. In the Counts picture three cats stand side-on, four paws each. Caption top left; the keypad sits below the panel.',
      caption: ['Behind you, three cats’ pawprints march across the white. Tallyheart looks back at them.'],
      counts: { set: 'ch13-dawn', intro: false, next: 'f008' }
    },

    /* ------------------------------------------------------------------ The Crossing, by first light (`CROSS13`) */

    f008: {
      // Riffle juggling on land by the pebble heap (Otter's honor holds only under the Old Bridge)
      scene: S('crossing', 'wide', merge(CROSS13, { pebbles: true }),
        [tally('sit', 'kind', 'rock-high', 'right'), c('riffle', 'juggle', 'shout', 'rock-right', 'left', { holds: 'pebbles' }), chime('sit', 'happy', 'rock-left', 'right'),
         you('sit', 'wonder', 'pebbles', 'right')], ['morning']),
      board: 'WIDE, THE CROSSING AT FIRST LIGHT. Pale morning light lies on the wide river and the ferry raft, and on the rocks by his heap of pebbles the young otter juggles three of them high in the air, showing off to the three cats arriving along the shore. Caption top left; his balloon a proud shout.',
      caption: ['Down at the Crossing, Riffle is juggling. One pebble, two, THREE!'],
      say: [{ who: 'riffle', text: 'We’re not under the Old Bridge. So juggling’s ALLOWED!', kind: 'shout' }],
      next: 'f009'
    },

    f009: {
      // the pebble bounces off the first cast member's head (`bonk`): Riffle listed first
      scene: S('crossing', 'wide', merge(CROSS13, { pebbles: true }),
        [c('riffle', 'juggle', 'shy', 'rock-right', 'left', { holds: 'pebbles' }), tally('sit', 'kind', 'rock-high', 'right'), chime('sit', 'happy', 'rock-left', 'right'),
         you('sit', 'happy', 'pebbles', 'right')], ['morning', 'bonk']),
      board: 'WIDE, THE CROSSING AT FIRST LIGHT, COMEDY BEAT. One of the juggled pebbles bounces right off the young otter’s nose, and he catches the other two and goes on with tremendous dignity as if nothing happened; the three cats watch with straight faces. Caption top left; his balloon airy.',
      caption: ['One bonks his nose.'],
      say: [{ who: 'riffle', text: 'That one was a spare.' }],
      next: 'f010'
    },

    f010: {
      // the swimmer's line (her `specialty`); the steam not drawn (said); our cat's raised paw the Tap
      scene: S('crossing', 'low', CROSS13,
        [c('riffle', 'juggle', 'shout', 'rock-right', 'left', { holds: 'pebbles' }), you('pawup', 'happy', 'rock-left', 'right', { tap: 'paw' })], ['morning']),
      board: 'LOW ANGLE, ON THE ROCKS AT FIRST LIGHT, THE TAP PICTURE. The young otter flicks a pebble high toward our cat, grinning, and our cat rears up on its back paws with one front paw raised to catch it, the bright cold river behind them. In play its raised paw glows softly; one tap catches the pebble and the page turns. Caption top left for a swimmer; his balloon a shout.',
      caption: [{ when: { specialty: 'swimming' }, text: 'Steam curls off the river. Even the water is breathing little clouds.' }],
      say: [{ who: 'riffle', text: '{name}{ending}! CATCH!', kind: 'shout' }],
      scratch: { tap: 'paw', prompt: '**Tap** to catch it.', label: 'Catch it.', next: 'f011' }
    },

    f011: {
      // Granny (an otter, variant 3, with her pole), named on her balloon; the print seen from the ferry, never drawn
      scene: S('crossing', 'rocks', CROSS13,
        [tally('sit', 'kind', 'rock-high', 'right'), c('otter', 'stand', 'solemn', CROSS_GRANNY, 'left', { variant: 3, holds: 'pole' }), c('riffle', 'stand', 'happy', 'rock-right', 'left'),
         chime('sit', 'wonder', 'rock-left', 'right'), you('sit', 'wonder', 'pebbles', 'right')], ['morning']),
      board: 'MEDIUM, ON THE ROCKS AT FIRST LIGHT. The young otter waves the cats in with both paws, and beside him the old grey grandmother otter leans on her ferry pole and gives her news in short, grave words; Tallyheart, on the high rock, and the two warriors listen hard. Two balloons, his excited, hers gruff.',
      say: [
        { who: 'riffle', text: 'You’re a NATURAL! Granny! They came! Tell them!' },
        { who: 'otter', name: 'Granny', text: 'Badger. A FRESH one. GroveClan’s side of the little channel. Saw it from the ferry. Like the island’s print. But NEW.' }
      ],
      next: 'f012'
    },

    f012: {
      // the ferry otters on the raft, otter 2 first, then otter 1 (each balloon from the nth otter); Granny not in the
      // cast, so no third otter lends her face to the third balloon
      scene: S('crossing', 'raft', CROSS13,
        [c('otter', 'stand', 'happy', 'raft-2', 'left', { variant: 2 }), c('otter', 'stand', 'shout', 'raft-3', 'left', { variant: 1 }), c('riffle', 'stand', 'happy', 'raft-1', 'left'),
         you('sit', 'wonder', RAFT_SHORE, 'right')], ['morning']),
      board: 'MEDIUM, AT THE RAFT AT FIRST LIGHT, COMEDY BEAT. Two ferry otters crowd to the front of their raft, one holding her paws wide apart to show how big, and the old whiskery one throwing his paws even wider; the young otter grins, and our cat and Tallyheart listen from the shore. Caption top left; three balloons, the gossip’s, the old otter’s shout, the gossip’s again.',
      caption: ['The ferry otters crowd in.'],
      say: [
        { who: 'otter', text: 'As big as a FOX, we heard!' },
        { who: 'otter', text: 'BIGGER!', kind: 'shout' },
        { who: 'otter', text: 'Well. As big as a fox.' }
      ],
      next: 'f013'
    },

    f013: {
      scene: S('crossing', 'raft', CROSS13,
        [c('otter', 'stand', 'wonder', 'raft-2', 'left', { variant: 2 }), c('otter', 'stand', 'happy', 'raft-3', 'left', { variant: 1 }), c('riffle', 'stand', 'wonder', 'raft-1', 'left'),
         tally('sit', 'solemn', RAFT_SHORE, 'right')], ['morning']),
      board: 'MEDIUM, AT THE RAFT AT FIRST LIGHT. The gossiping ferry otter leans over the edge of the raft and adds the juiciest bit, and a small inset shows a big hole dug in the earth under tall trees; on the shore Tallyheart narrows her eyes and thinks. Two balloons, the otter’s gossip, Tallyheart’s level.',
      say: [
        { who: 'otter', text: 'And it dug a big HOLE in GroveClan’s woods!' },
        { who: 'tallyheart', text: 'A thing to check.' }
      ],
      next: 'f014'
    },

    f014: {
      // his goodbye: chapter 11's cheer (he has no `pawup`); the three walking off home along the shore
      scene: S('crossing', 'wide', CROSS13,
        [c('riffle', 'hop', 'happy', 'shore', 'left'), chime('walk', 'happy', CROSS_THIRD, 'left'), tally('walk', 'kind', 'rock-left', 'left'), you('walk', 'happy', CROSS_YOU, 'left')], ['morning']),
      board: 'WIDE, THE CROSSING AT FIRST LIGHT, COMEDY BEAT. The three cats pad away along the shore toward home, and behind them by his heap of pebbles the young otter hops up and down with both paws in the air, calling after them at the top of his voice. His balloon a cheerful shout.',
      say: [{ who: 'riffle', text: 'Say HI to the badger for me!', kind: 'shout' }],
      next: 'f015'
    },

    f015: {
      // home along the riverbank, the morning's mice carried (one drawn in {Murmur}chime's mouth: the caption says three)
      scene: S('riverbank', 'path', {},
        [tally('walk', 'kind', PATH_CHISPA, 'left'), you('walk', 'happy', 'path-left', 'left', { holds: 'mouse' }), chime('walk', 'proud', 'path-right', 'left', { holds: 'mouse' })], ['morning']),
      board: 'WIDE, THE RIVERBANK PATH, MORNING. The patrol walks home along the path above the bright river, Tallyheart in front, our cat carrying one mouse, and the tortoiseshell warrior strutting behind with her head held high and a mouse of her own. Caption top left; our cat’s balloon dry, Tallyheart’s pleased.',
      caption: ['On the way home, the patrol hunts. You catch one mouse. {Murmur}chime catches three.'],
      say: [
        { who: 'player', text: 'Show-off.' },
        { who: 'tallyheart', text: 'Four for the pile.' }
      ],
      next: 'f016'
    },

    /* ------------------------------------------------------------------ The hunter's crouch: the frosty camp */

    f016: {
      // Chispapaw first in the cast, so the bounce's motion lines are hers; her bell's tings lettered by her
      scene: S('camp', 'crowd', FROST,
        [chispa('stand', 'happy', 'ferns-2', 'left'), tally('walk', 'kind', IN_TALLY, 'right'), you('walk', 'happy', RING_YOU, 'right')], ['morning', 'motion']),
      board: 'MEDIUM, THE FROSTY CAMP, THE CHOICE. As our cat and Tallyheart come back into the white camp, the little cream cat springs up and down on all four paws in the frost with bounce lines all round her, her tiny bell flying, wild with excitement. The tings lettered by her bell; caption top left; her balloon a squeak; the choices sit below the panel.',
      caption: ['At the edge of camp, something small is bouncing.'],
      say: [{ who: 'chispapaw', text: 'Is it tomorrow NOW? And everything CRUNCHES! Like SUGAR!' }],
      sfx: 'Ting! Ting! Ting!',
      choice: {
        options: [
          { label: '“It’s tomorrow.”', sets: {}, next: 'f017' },
          { label: '“My first frost too! Mouse lesson?”', sets: {}, next: 'f017' }
        ]
      }
    },

    f017: {
      // from here to f026 the crouch: our cat at ferns-1, Chispapaw at ferns-2, Tallyheart off to the side at crowd-right
      // Chispapaw facing our cat, her bounce the caption's: no `motion` (its speed lines trail behind her, across our cat
      // facing the ferns and across Tallyheart facing us: looked at in a render)
      scene: S('camp', 'crowd', FROST, crouch(['stand', 'happy', null, 'left'], ['sit', 'happy'], 'kind'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS. The little cream cat bounces so high her bell swings out, facing our cat, who sits ready in the white frost in front of the ferns, a proper mentor; Tallyheart settles at the side of the panel to watch. Two captions top left; our cat’s balloon a mentor’s.',
      caption: ['Chispapaw bounces so high, her bell rings twice on the way up.', 'In the frosty ferns, you find the perfect spot. Tallyheart sits off to the side.'],
      say: [{ who: 'player', text: 'The hunter’s crouch. Every warrior starts here.' }],
      next: 'f018'
    },

    f018: {
      // the chapter's one flag choice: how she teaches (each option's `sets`); a reread replaces it
      scene: S('camp', 'crowd', FROST, crouch(['sit', 'wonder', null, 'left'], ['sit', 'kind'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS, THE CHOICE. The little cream cat sits in the frost looking up at our cat with enormous blue eyes, waiting to be taught, and our cat thinks hard about how; at the side Tallyheart watches, remembering. One caption at the top; the choices sit below the panel.',
      caption: ['Tallyheart taught you on your first evening. How will you teach her?'],
      choice: {
        options: [
          { label: 'Show her: “Belly low. Tail straight out. Like this.”', sets: { teach: 'show' }, next: 'f019' },
          { label: 'Let her try: “You try. I’ll watch.”', sets: { teach: 'try' }, next: 'f019' },
          { label: 'Tallyheart’s words: “The crouch feeds you. The Counts feed your whole Clan.”', sets: { teach: 'words' }, next: 'f019' }
        ]
      }
    },

    f019: {
      // one picture for all three ways of teaching; exactly one caption-and-balloon pair shows, by `teach`
      scene: S('camp', 'crowd', FROST, crouch(['crouch', 'proud'], ['sit', 'happy'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS. The little cream cat drops into her very first hunter’s crouch in the frost, belly low and whiskers forward, very pleased with herself, while our cat sits beside her and Tallyheart watches from the side with her chest puffed out. One caption at the top; her balloon proud.',
      caption: [
        { when: { teach: 'show' }, text: 'You show her. Chispapaw copies every bit.' },
        { when: { teach: 'try' }, text: 'Chispapaw tries it all by herself.' },
        { when: { teach: 'words' }, text: 'Tallyheart’s ears go up: her own words. Chispapaw’s eyes go big.' }
      ],
      say: [
        { who: 'chispapaw', text: 'Like THIS?', when: { teach: 'show' } },
        { who: 'chispapaw', text: 'Am I doing it? I’m DOING it!', when: { teach: 'try' } },
        { who: 'chispapaw', text: 'My WHOLE Clan? Then I’d better get it right.', when: { teach: 'words' } }
      ],
      next: 'f020'
    },

    f020: {
      // her tail up like a flag: chapter 1's own tail, mirrored
      scene: S('camp', 'crowd', FROST, crouch(['crouch', 'proud', { tailUp: true }], ['sit', 'happy'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS, COMEDY BEAT. The little cream cat holds her crouch beautifully except for her tail, which sticks straight up in the air like a flag; at the side Tallyheart looks over at our cat with one eyebrow raised and the start of a smile. Two captions top left; her balloon dry.',
      caption: ['But her tail sticks straight UP, like a flag.', 'Tallyheart looks at you.'],
      say: [{ who: 'tallyheart', text: 'Hmph. I remember another tail like that.' }],
      next: 'f021'
    },

    f021: {
      // the wiggle in the caption: no `motion` (its speed lines trail behind the first cast member, and facing the ferns
      // they ran across our cat: looked at in a render); the leaf not drawn until it is caught; our cat's nose the Tap
      scene: S('camp', 'crowd', FROST, crouch(['crouch', 'happy', { tailUp: true }], ['sit', 'kind', { tap: 'nose' }], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS, THE TAP PICTURE. Something skitters across the white ground toward the ferns, and the little cream cat’s bottom wiggles in her crouch, tail still up; our cat leans toward her to whisper. In play our cat’s nose glows softly; one tap whispers wait for it, and the page turns. Caption top left.',
      caption: ['A frosty leaf skitters past. Chispapaw’s bottom starts to wiggle.'],
      scratch: { tap: 'nose', prompt: '**Tap** to whisper, “Wait for it…”', label: 'Whisper, “Wait for it…”', next: 'f022' }
    },

    f022: {
      // the pounce: the frosty leaf caught at her paws (a word joiner after the ellipsis, chapter 11's)
      scene: S('camp', 'crowd', FROST, crouch(['crouch', 'wonder', { holds: 'leaf', holdAt: 'paws' }], ['sit', 'happy'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS, COMEDY BEAT. The little cream cat has pounced and pinned something under both front paws with a crunch, and now she peers down at her catch: one crumpled, frosty brown leaf. Our cat holds back a grin. The crunch lettered big; caption top left; her balloon triumphant, then flat.',
      caption: ['Too late! Chispapaw POUNCES.'],
      say: [{ who: 'chispapaw', text: 'Got it! …' + WJ + 'It’s a leaf.' }],
      sfx: 'Crunch!',
      next: 'f023'
    },

    f023: {
      scene: S('camp', 'crowd', FROST, crouch(['sit', 'shy'], ['sit', 'happy'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS, COMEDY BEAT. The little cream cat lifts her paws off the leaf and lets it go with tremendous politeness, dipping her head to it as it blows away; our cat and Tallyheart keep perfectly straight faces. Caption top left; her balloon a small apology.',
      caption: ['She lets it go, very politely.'],
      say: [{ who: 'chispapaw', text: 'Sorry, leaf.' }],
      next: 'f024'
    },

    f024: {
      // the mouse never drawn (not even its tail): only the ferns; her bell lettered
      scene: S('camp', 'crowd', FROST, crouch(['crouch', 'wonder', { tailUp: true }], ['sit', 'wonder'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS. The little cream cat inches toward the white ferns in her crouch, slow and careful, one paw at a time, her tail up and her eyes fixed on the fronds; our cat holds its breath. The ting of her bell lettered small; two captions top left.',
      caption: ['Then, deep in the ferns: *nibble, nibble.* A mouse!', 'Chispapaw creeps closer. Closer. Closer…'],
      sfx: 'Ting.',
      next: 'f025'
    },

    f025: {
      scene: S('camp', 'crowd', FROST, crouch(['sit', 'worried'], ['sit', 'kind'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS. The ferns sway where something small has gone, and the little cream cat sits back and looks from the ferns to the bell at her throat and back again, working it out; our cat answers her gently. Two captions top left; her balloon slow, our cat’s warm.',
      caption: ['The ferns twitch. A tail tip flicks. Gone.', 'Chispapaw looks at the ferns. At her bell. At the ferns again.'],
      say: [
        { who: 'chispapaw', text: '…' + WJ + 'Mice have ears.' },
        { who: 'player', text: 'You worked that out all by yourself.' }
      ],
      next: 'f026'
    },

    f026: {
      scene: S('camp', 'crowd', FROST, crouch(['sit', 'proud', null, 'left'], ['sit', 'happy'], 'proud'), ['morning']),
      board: 'MEDIUM, THE FROSTY FERNS. The little cream cat sits up as straight and tall as she can in the frost, chin high and chest out, glowing at our cat’s words, and Tallyheart looks on from the side. One caption at the top.',
      caption: ['Chispapaw sits up very straight.'],
      next: 'f027'
    },

    f027: {
      // the collar left by her nest, curled in its hollow in the moss (the den's `collar`): from here she is
      // `collar: false`; our cat's paw the Tap
      scene: S('den', 'inside', DEN_COLLAR, [you('sit', 'kind', 'sleeper-2', 'right', { tap: 'paw' }), chispa0('sit', 'proud', 'nest', 'left')], ['morning']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, MORNING, THE TAP PICTURE. The little cream cat sits in her moss nest with her neck bare for the first time, and beside the nest her narrow red collar with its tiny gold bell lies curled in a little hollow pressed in the moss; our cat sits close by. In play our cat’s paw glows softly; one tap helps tuck it in and the page turns. Caption top left; her balloon careful.',
      caption: ['Back in camp, she wriggles out of her collar.'],
      say: [{ who: 'chispapaw', text: 'My Tall Ones gave me this. It can stay safe, by my nest.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to help her tuck it in.', label: 'Help her tuck it in.', next: 'f028' }
    },

    /* ------------------------------------------------------------------ The Training Hollow (`H13` under every frame) */

    f028: {
      scene: S('hollow', 'lesson', H13, hollow('wonder', 'kind', 'wonder'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW, LATE MORNING. In the sandy hollow under the old leaning tree, its ten claw marks glowing, Tallyheart sits facing her two pupils, our cat in front and the little cream cat just behind it, whose ears shoot up at the word lessons. Caption top left; two balloons, Tallyheart’s dry, the little cat’s a squeak.',
      caption: ['Late in the morning, Tallyheart calls you both to the Training Hollow.'],
      say: [
        { who: 'tallyheart', text: 'Even mentors have lessons.' },
        { who: 'chispapaw', text: 'Mentors have HOMEWORK?' }
      ],
      next: 'f029'
    },

    f029: {
      // the warm-up: her two hardest Counts of all 54 pairs, then one more; Chispapaw's echo on her first right answer
      // (`intro: false`: the balloon does not follow into the Counts)
      scene: S('hollow', 'lesson', H13, hollow('happy', 'kind', 'happy'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW, THEN THE COUNTS. Tallyheart settles in the sand with her tail curled round her paws and announces three quick Counts, and our cat stretches its claws, ready, while the little cream cat leans in to watch. In the Counts picture each question’s own picture lies on the sand; the little cat says the first right answer in Spanish. Her balloon brisk; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'First, three Counts, to wake up your whiskers.' }],
      counts: { set: 'ch13-warm', intro: false, next: 'f030' }
    },

    f030: {
      // her class word in her English line, a token (the table holds it as lettered); out loud, in the Hollow
      scene: S('hollow', 'lesson', H13, hollow('wonder', 'kind', 'happy'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW. The little cream cat’s big ears shoot straight up and she bounces where she sits, because she knows this one, and a small inset shows a child at a kitchen table doing homework, a cream cat watching. Two balloons, Tallyheart’s plain, the little cat’s a happy squeak with a Spanish word in it.',
      say: [
        { who: 'tallyheart', text: 'Now, ' + TAKEAWAYS + '.' },
        { who: 'chispapaw', text: '{Es:resta} THAT’S what ' + TAKEAWAYS + ' are! My little Tall One’s homework this frost-time!' }
      ],
      next: 'f031'
    },

    f031: {
      scene: S('hollow', 'lesson', H13, hollow('wonder', 'kind', 'wonder'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW. Tallyheart leans toward her two pupils with a look that means something new is coming, and a small inset shows yesterday’s columns of loose dots, each with plenty. Our cat and the little cat listen hard. Her balloon earnest.',
      say: [{ who: 'tallyheart', text: 'Yesterday, every column had enough loose. Today, one won’t.' }],
      next: 'f032'
    },

    f032: {
      // Tallyheart's forty-three at her paws, in the spread marks' own box: four lines, three dots
      scene: S('hollow', 'lesson', merge(H13, { spreadMarks: 'standing' }), hollow('wonder', 'kind', 'wonder'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW. Between our cat and Tallyheart the sand shows a quick count freshly scratched, four neat lines and three dots, forty-three, and Tallyheart taps the three dots with a claw and looks at our cat. Caption top left; her balloon a question.',
      caption: ['She scratches forty-three in the sand: four lines, three dots.'],
      say: [{ who: 'tallyheart', text: 'Three loose. Take away six?' }],
      next: 'f033'
    },

    f033: {
      // her Tall One's words, out loud in the Hollow: a whole Spanish line, its English under it
      scene: S('hollow', 'lesson', merge(H13, { spreadMarks: 'standing' }), hollow('happy', 'kind', 'wonder'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW. The little cream cat pops up behind our cat and calls out the answer in her own language, delighted to know it, and a small inset shows a child frowning over homework with her chin in her hands. Two balloons, both the little cat’s: the first with its English under it, the second a confiding chirp.',
      say: [
        { who: 'chispapaw', lang: 'es', text: '{Es:noAlcanza}' },
        { who: 'chispapaw', text: 'My little Tall One says that every night.' }
      ],
      next: 'f034'
    },

    f034: {
      scene: S('hollow', 'lesson', merge(H13, { spreadMarks: 'standing' }), hollow('wonder', 'proud', 'wonder'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW. Tallyheart lifts one claw over the four scratched lines in the sand like a warrior about to show a trick, and our cat and the little cream cat lean in to see. Her balloon a promise.',
      say: [{ who: 'tallyheart', text: 'Then we spread a row. Ten more loose.' }],
      next: 'f035'
    },

    f035: {
      // the spread: one line crossed out and ten new dots in a scratched frame, five and five, under the three; her word
      // for it whispered (decision 55); our cat's paw the Tap (sitting: a crouch reaches into the marks)
      scene: S('hollow', 'lesson', merge(H13, { spreadMarks: 'spread' }), hollow('wonder', 'kind', 'wonder', { tap: 'paw' }), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW, THE TAP PICTURE. In the sand one of the four lines is now crossed out, and under the three old dots ten new ones sit in a scratched frame, five and five; behind our cat the little cream cat whispers her own word for it, eyes wide. In play our cat’s paw glows softly; one tap scratches its own forty-three, spread, beside Tallyheart’s, and the page turns. Caption top left; her balloon a whisper with its English under it.',
      caption: ['She crosses out one line and scratches ten new dots.'],
      say: [{ who: 'chispapaw', kind: 'whisper', lang: 'es', text: '{Es:desagrupo}' }],
      scratch: { tap: 'paw', prompt: '**Tap** to scratch yours.', label: 'Scratch yours.', next: 'f036' }
    },

    f036: {
      // the Tap's answer: two spread forty-threes, hers and Tallyheart's; then the lesson (the take page carries the
      // story's next screens: the kit's marks page, once, the worked example, “Your turn” and Tallyheart's four, the echo)
      scene: S('hollow', 'lesson', merge(H13, { spreadMarks: 'two' }), hollow('wonder', 'kind', 'happy'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW, THEN THE COUNTS. Two spread forty-threes lie side by side in the sand now, Tallyheart’s and our cat’s, each with one line crossed out and ten new dots in a frame, and the little cream cat stares at them as if they were a treat. In the take-aways picture the store laid out in rows and loose, and the column she works one step at a time, ones first. Caption top left; four boxes; the keypad sits below the panel.',
      caption: ['Chispapaw stares.'],
      say: [
        { who: 'chispapaw', text: 'Three, and ten more… It’s like opening a pack of cookies!' },
        { who: 'tallyheart', text: 'Exactly. Three rows, thirteen loose. Still forty-three.' },
        { who: 'tallyheart', text: 'I’ll say each step. You type it.' }
      ],
      counts: { set: 'ch13-take', intro: false, next: 'f037' }
    },

    f037: {
      // the set's “Done” lines, this frame's (`done: ''` on the set); “Spread a row” fixed English, as f034's
      scene: S('hollow', 'lesson', merge(H13, { spreadMarks: 'two' }), hollow('happy', 'proud', 'happy'), ['morning']),
      board: 'MEDIUM, THE TRAINING HOLLOW. Tallyheart sits back, satisfied, with the two spread forty-threes in the sand before her, and the little cream cat announces her plan for the evening with enormous seriousness, chest puffed out. Two balloons, Tallyheart’s firm, the little cat’s determined.',
      say: [
        { who: 'tallyheart', text: 'Not enough? Spread a row. That’s a warrior’s trick.' },
        { who: 'chispapaw', text: 'Tonight, I’ll sit on my little Tall One’s homework. To HELP.' }
      ],
      next: 'f038'
    },

    /* ------------------------------------------------------------------ Noon at the pile: the camp by day (the pile off the picture) */

    f038: {
      // her prompt is the Count's page (Glintstar's six hunters)
      scene: S('camp', 'crowd', CAMP_DAY, noon({ glint: 'solemn' }), ['day']),
      board: 'MEDIUM, THE CAMP AT NOON, THEN THE COUNTS. The whole Clan crowds round the old stone fountain in bright cold sunshine, and Glintstar has leapt onto its top; our cat sits in the front row with the little cream cat pressed close beside it, and Tallyheart and the old tom among the rest. In the Counts picture six piles of prey, eight pieces each. Two captions top left; the keypad sits below the panel.',
      caption: ['At noon, the whole Clan crowds round the pile. Chispapaw stays close beside you.', 'Glintstar leaps onto the fountain.'],
      counts: { set: 'ch13-noon', intro: false, next: 'f039' }
    },

    f039: {
      // the fifty-two said here, a frame balloon, so a retried 6 × 8 still hears where it comes from; her question is
      // the take page's prompt (the set's)
      scene: S('camp', 'fountain', {}, [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left')], ['day']),
      board: 'LOW ANGLE, UP AT THE FOUNTAIN, NOON, THEN THE COUNTS. Glintstar stands tall on top of the old stone fountain against the clear blue sky and adds up the day’s catch, and a small inset shows the dawn patrol’s four mice laid by the pile. In the take-aways picture the store laid out in rows and loose. Her balloon grave; the keypad sits below the panel.',
      say: [{ who: 'glintstar', text: 'With the dawn patrol’s four, that’s fifty-two on the pile.' }],
      counts: { set: 'ch13-pile', intro: false, next: 'f040' }
    },

    f040: {
      // her whisper, just to our cat (shy of Spanish before the Clan by day)
      scene: S('camp', 'crowd', CAMP_DAY, noon({ glint: 'kind', you: 'happy', chispa: 'happy', tally: 'proud' }), ['day']),
      board: 'MEDIUM, THE CAMP AT NOON. In the front row the little cream cat leans close to our cat and whispers the answer in her own language, just for it, her eyes shining, while the Clan round the fountain murmurs. Her balloon a whisper with its English under it.',
      say: [{ who: 'chispapaw', kind: 'whisper', lang: 'es', text: '¡{Es:25}!' }],
      next: 'f041'
    },

    f041: {
      // the old tom in front, eyeing the pile
      scene: S('camp', 'crowd', CAMP_DAY, noon({ glint: 'kind', you: 'happy', chispa: 'happy', old: 'sniff', oldFront: true }), ['day']),
      board: 'MEDIUM, THE CAMP AT NOON, COMEDY BEAT. The old grizzled tom has shouldered his way to the front, licking his lips with his eyes on the pile just out of the panel, already choosing. Our cat and the little cat glance at each other. Caption top left; his balloon greedy.',
      caption: ['The old tom licks his lips.'],
      say: [{ who: 'grizzled', text: 'Dibs on the BIG one.' }],
      next: 'f042'
    },

    f042: {
      scene: S('camp', 'fountain', {}, [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left')], ['day']),
      board: 'LOW ANGLE, UP AT THE FOUNTAIN, NOON. Glintstar looks down from the fountain top with her ice-blue eyes narrowed, thinking, and a small inset shows a big hole dug under tall trees across a little bridge. Caption top left; her balloon grave.',
      caption: ['Glintstar has heard Tallyheart’s news.'],
      say: [{ who: 'glintstar', text: 'A fresh print, and a hole in GroveClan’s woods.' }],
      next: 'f043'
    },

    f043: {
      // come down to the fountain's foot; Chispapaw between them, facing our cat, for the whispers
      scene: S('camp', 'reveal', CAMP_DAY, sendoff({ glint: ['sit', 'solemn'] }), ['day']),
      board: 'WIDE, THE CAMP AT NOON. Glintstar sits at the fountain’s foot and gives our cat its first job as a mentor, and the little cream cat turns to our cat to whisper a question, which our cat whispers back; Tallyheart listens with her ears up. Four balloons: Glintstar’s grave, two whispers, Glintstar’s again.',
      say: [
        { who: 'glintstar', text: '{name}{ending}, take your apprentice and Tallyheart. A courtesy patrol, to GroveClan.' },
        { who: 'chispapaw', text: 'What’s a courtesy patrol?', kind: 'whisper' },
        { who: 'player', text: 'A polite one.', kind: 'whisper' },
        { who: 'glintstar', text: 'Ask about their hole.' }
      ],
      next: 'f044'
    },

    f044: {
      scene: S('camp', 'reveal', CAMP_DAY, sendoff({ glint: ['sit', 'kind'], you: 'happy' }), ['day']),
      board: 'WIDE, THE CAMP AT NOON, COMEDY BEAT. Glintstar’s whiskers twitch with the start of a smile as she adds one word, looking straight at the little cream cat; our cat and Tallyheart hide grins. Caption top left; her balloon a single dry word.',
      caption: ['Glintstar’s whiskers twitch.'],
      say: [{ who: 'glintstar', text: 'Politely.' }],
      next: 'f045'
    },

    f045: {
      // Chispapaw first, for the bounce's motion lines; no collar, no bell, no sound effect; Glintstar gone back up (the
      // lines trail behind Chispapaw, and at the fountain's foot they crossed her: looked at in a render)
      scene: S('camp', 'crowd', CAMP_DAY,
        [chispa0('stand', 'happy', 'center', 'right')].concat(sendoff({ you: 'happy', tally: 'happy' }).filter(function (m) { return m.who !== 'chispapaw' && m.who !== 'glintstar'; })), ['day', 'motion']),
      board: 'MEDIUM, THE CAMP AT NOON, COMEDY BEAT. The little cream cat bounces straight up on all four paws with bounce lines round her, but her neck is bare and not a single ting comes out of her; our cat and Tallyheart smile at her. One caption at the top.',
      caption: ['Chispapaw bounces. Silently, for once.'],
      next: 'f046'
    },

    /* ------------------------------------------------------------------ GroveClan: the path by day, then the woods (their own afternoon) */

    f046: {
      // on the path to GroveClan: Chispapaw at our cat's heels, Tallyheart behind them
      scene: S('riverbank', 'path', {}, [tally('walk', 'kind', PATH_BACK, 'right'), chispa0('walk', 'wonder', PATH_CHISPA, 'right'), you('walk', 'kind', 'path-left', 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH, AFTERNOON. Our cat walks along the sunny path with the little cream cat trotting right at its heels, looking up at it with a big question, and Tallyheart pads along behind them both, listening. Caption top left; her balloon a question, our cat’s wise.',
      caption: ['On the path, Chispapaw trots at your heels.'],
      say: [
        { who: 'chispapaw', text: 'What does a badger look like?' },
        { who: 'player', text: 'The otters HEARD it’s as big as a FOX. Hearing isn’t seeing.' }
      ],
      next: 'f047'
    },

    f047: {
      scene: S('riverbank', 'path', {}, [tally('walk', 'proud', PATH_BACK, 'right'), chispa0('walk', 'wonder', PATH_CHISPA, 'right'), you('walk', 'happy', 'path-left', 'right')], ['day']),
      board: 'WIDE, THE RIVERBANK PATH, AFTERNOON. Behind the two cats Tallyheart gives our cat a long sideways look with her chin up and her eyes warm, pleased with what she heard, and our cat walks on a little taller. One caption at the top.',
      caption: ['Tallyheart gives you a look. A pleased one.'],
      next: 'f048'
    },

    f048: {
      // at the bridge's end: nobody in the woods yet
      scene: S('grove', 'wide', {}, [tally('stand', 'kind', 'edge-1', 'right'), you('stand', 'kind', BRIDGE_YOU, 'left'), chispa0('stand', 'wonder', BRIDGE_CHISPA, 'right')], ['day']),
      board: 'WIDE, GROVECLAN’S WOODS AT THE BRIDGE’S END, AFTERNOON. At the end of the little bridge the three cats stop at the edge of the bright, sunny woods, where the frost has melted away, and our cat turns to the little cream cat to explain; Tallyheart stands behind. Caption top left; our cat’s balloon a mentor’s.',
      caption: ['At the end of GroveClan’s little bridge, you stop. The frost has melted.'],
      say: [{ who: 'player', text: 'We wait here to be asked in. Best manners.' }],
      next: 'f049'
    },

    f049: {
      // Tallyheart's ear: her own words, passed on; our cat's paw the Tap
      scene: S('grove', 'wide', {}, [tally('stand', 'proud', 'edge-1', 'right'), you('stand', 'kind', BRIDGE_YOU, 'right', { tap: 'paw' }), chispa0('stand', 'wonder', BRIDGE_CHISPA, 'right')], ['day']),
      board: 'WIDE, GROVECLAN’S WOODS AT THE BRIDGE’S END, THE TAP PICTURE. Behind the two younger cats one of Tallyheart’s ears gives a little twitch, and a small inset shows her saying the very same words to a small apprentice at this same spot; our cat stands ready to sit. In play our cat’s paw glows softly; one tap sits all three down to wait and the page turns. Caption top left.',
      caption: ['Tallyheart’s ear twitches. She once said that to you.'],
      scratch: { tap: 'paw', prompt: '**Tap** to sit and wait.', label: 'Sit and wait.', next: 'f050' }
    },

    f050: {
      // the Tap's answer: three tails round three sets of paws; the elder listed before the apprentice
      scene: S('grove', 'wide', {},
        [tally('sit', 'kind', 'edge-1', 'right'), you('sit', 'happy', BRIDGE_YOU, 'right'), elder('kind'), apprentice(), chispa0('sit', 'wonder', BRIDGE_CHISPA, 'right')], ['day']),
      board: 'WIDE, GROVECLAN’S WOODS AT THE BRIDGE’S END. Three cats sit neatly in a row at the woods’ edge with their tails curled round their paws, and out of the trees pads the old GroveClan elder, who knows our cat at once; a shy apprentice peeks out of the ferns behind her. Caption top left; her balloon warm.',
      caption: ['Out pads the GroveClan elder.'],
      say: [{ who: 'groveclan', text: 'The polite one. I said I’d remember you.' }],
      next: 'f051'
    },

    f051: {
      // her turn to ask: two ways, each its own reply (f052a, f052b), nothing set
      scene: S('grove', 'meet', {}, [you('sit', 'wonder', 'meet-1', 'right'), chispa0('sit', 'wonder', 'meet-3', 'right'), elder('kind'), apprentice(), tally('sit', 'kind', 'meet-2', 'right')], ['day']),
      board: 'WIDE, AMONG GROVECLAN’S TREES, THE CHOICE. Tallyheart dips her head respectfully to the old elder, then turns and looks at our cat, waiting, and the elder waits too; the little cream cat looks from one to the other. One caption at the top; the choices sit below the panel.',
      caption: ['Tallyheart dips her head to her. Then she looks at you: your turn to ask.'],
      choice: {
        options: [
          { label: '“Please, may we see your hole?”', sets: {}, next: 'f052a' },
          { label: '“We’ve come about your hole. POLITELY.”', sets: {}, next: 'f052b' }
        ]
      }
    },

    f052a: {
      scene: S('grove', 'meet', {}, [you('sit', 'happy', 'meet-1', 'right'), chispa0('sit', 'happy', 'meet-3', 'right'), elder('kind'), apprentice(), tally('sit', 'proud', 'meet-2', 'right')], ['day']),
      board: 'WIDE, AMONG GROVECLAN’S TREES, ONLY FOR A CAT WHO ASKS PLEASE. The old elder dips her grey muzzle, pleased with such good manners, and waves the three cats in with her tail; Tallyheart looks quietly proud. Her balloon gracious.',
      say: [{ who: 'groveclan', text: 'Very nicely asked. Come in.' }],
      next: 'f053'
    },

    f052b: {
      scene: S('grove', 'meet', {}, [you('sit', 'proud', 'meet-1', 'right'), chispa0('sit', 'wonder', 'meet-3', 'right'), elder('wonder'), apprentice(), tally('sit', 'kind', 'meet-2', 'right')], ['day']),
      board: 'WIDE, AMONG GROVECLAN’S TREES, ONLY FOR A CAT WHO SAYS POLITELY OUT LOUD, COMEDY BEAT. The old elder blinks slowly at our cat, ears back from the volume, then decides to be amused and waves the three cats in; the little cream cat tries not to giggle. Caption top left; her balloon dry.',
      caption: ['The elder blinks.'],
      say: [{ who: 'groveclan', text: 'Very polite. And very LOUD. Come in.' }],
      next: 'f053'
    },

    f053: {
      // the old oak with the big dig at its roots; our three at root-1, oak-near and root-2, the elder at `elder`, clear
      // of the dig (the sets owner's four)
      scene: S('grove', 'oak', DIG, [elder('kind'), tally('sit', 'kind', 'root-1', 'right'), chispa0('sit', 'wonder', 'oak-near', 'right'), you('sit', 'wonder', 'root-2', 'right')], ['day']),
      board: 'WIDE, THE OLD OAK IN GROVECLAN’S WOODS, AFTERNOON. Under the huge old oak the elder has led the three cats to the roots, where a big shallow dig opens in the earth, its soil thrown back in two heaps, and the little cream cat gazes at it with her mouth open. Caption top left; her balloon an awed whisper.',
      caption: ['She leads you under the trees to the old oak. At its roots, there’s a dig. A BIG one.'],
      say: [{ who: 'chispapaw', text: 'It’s bigger than my WHOLE nest.', kind: 'whisper' }],
      next: 'f054'
    },

    f054: {
      // the dig close: its heaps, its five long scratches; the smaller doorway half under leaves, the marks half under
      // leaves on the far side (not yet seen); our cat's nose the Tap
      scene: S('grove', 'dig', LEAVES,
        [elder('kind', 'dig-elder'), chispa0('sit', 'wonder', 'marks-2', 'left'), you('crouch', 'sniff', 'dig-front', 'left', { tap: 'nose' })], ['day']),
      board: 'MEDIUM, THE BIG DIG, AFTERNOON, THE TAP PICTURE. Close by the oak’s roots the dig is a wide shallow hole of soft brown earth, its soil thrown back in heaps on either side and five long curved scratches raking down its wall; there is no fur and no feather anywhere, and our cat crouches at its edge, nose out. In play our cat’s nose glows softly; one tap sniffs the dig and the page turns. Two captions top left.',
      caption: ['Earth is thrown back in heaps. Five long scratches run down the dig’s sides.', 'No fur. No feathers. Just dirt.'],
      scratch: { tap: 'nose', prompt: '**Tap** to sniff the dig.', label: 'Sniff the dig.', next: 'f055' }
    },

    f055: {
      scene: S('grove', 'dig', LEAVES, [elder('kind', 'dig-elder'), chispa0('sit', 'worried', 'marks-2', 'left'), you('sit', 'sniff', 'dig-front', 'left')], ['day']),
      board: 'MEDIUM, THE BIG DIG, AFTERNOON, COMEDY BEAT. Our cat sits back from the dig with its nose wrinkled at a smell it remembers, and the old elder gives her verdict calmly from the far side, while the little cream cat looks horrified at the idea of worms for supper. Caption top left; two balloons, the elder’s calm, the little cat’s a whisper.',
      caption: ['*Sniff.* Earth, roots, worms… and a smell you’ve smelled once before, on the island. Only FRESH.'],
      say: [
        { who: 'groveclan', text: 'Badger. Digging for worms, I’d say.' },
        { who: 'chispapaw', text: 'WORMS? For SUPPER?', kind: 'whisper' }
      ],
      next: 'f056'
    },

    f056: {
      // her two paragraphs, two balloons; then she goes to her den, before the marks are found
      scene: S('grove', 'oak', DIG, [elder('kind'), tally('sit', 'kind', 'root-1', 'right'), chispa0('sit', 'wonder', 'oak-near', 'right'), you('sit', 'wonder', 'root-2', 'right')], ['day']),
      board: 'WIDE, THE OLD OAK, AFTERNOON. The old elder sits by the oak and remembers out loud, and a small inset shows a big grumpy shape in a winter wood, seen only as a lump of grey fur from behind; then she stretches and yawns. The three cats listen. Two balloons, both the elder’s, the second a yawn.',
      say: [
        { who: 'groveclan', text: 'When I was a kit, a badger wintered in these woods. Grumpy. Never bothered a cat that didn’t bother her.' },
        { who: 'groveclan', text: 'Look all you like. Now, if you’ll excuse me, my den is calling. It says, ‘NAP.’' }
      ],
      next: 'f057'
    },

    f057: {
      // the elder gone (she never sees the marks); Tallyheart off to wait at the bridge
      scene: S('grove', 'oak', DIG, [tally('walk', 'kind', 'root-1', 'left'), chispa0('sit', 'wonder', 'oak-near', 'right'), you('sit', 'proud', 'root-2', 'right')], ['day']),
      board: 'WIDE, THE OLD OAK, AFTERNOON. The elder has gone home to her nap, and Tallyheart turns and pads away toward the bridge, leaving the dig to our cat and its apprentice with a nod over her shoulder. Caption top left; her balloon brief and trusting.',
      caption: ['Tallyheart heads back to wait at the bridge.'],
      say: [{ who: 'tallyheart', text: 'Your patrol, warrior.' }],
      next: 'f058'
    },

    f058: {
      // one caption by her `specialty` (the friends' split at its colon); the apprentice peeks from his fern for every
      // cat; “Look closer.” opens the groundhog's scene, “Home before sunset.” goes on to the marks
      scene: S('grove', 'dig', LEAVES, [apprentice('dig-fern', 'right'), chispa0('sit', 'wonder', 'door-2', 'left'), you('sit', 'wonder', 'door-1', 'left')], ['day']),
      board: 'MEDIUM, THE BIG DIG, AFTERNOON, THE CHOICE. At the foot of the oak, beside the big dig and under an arm of root, a smaller round doorway lies half buried in fallen leaves, and our cat and the little cream cat sit looking at it; a shy apprentice peeks out of a fern behind them. One caption at the top; the choices sit below the panel.',
      caption: [
        { when: { specialty: 'noticing' }, text: 'You take one last look, and spot it: a smaller doorway, right beside the big dig.' },
        { when: { specialty: 'friends' }, text: 'The shy GroveClan apprentice peeks out of a fern, and points:' },
        { when: { specialty: 'friends' }, text: 'a smaller doorway, right beside the dig.' },
        { when: { specialty: 'climbing' }, text: 'From the oak’s low branch, you see it: a smaller doorway, right beside the big dig.' },
        { when: { specialty: 'sneaking' }, text: 'You creep up to the dig without a sound. From a smaller doorway beside it comes a tiny snore.' },
        { when: { specialty: 'swimming' }, text: 'Then you hear it. Something is snoring, in a little doorway under the leaves beside the dig.' }
      ],
      choice: {
        options: [
          { label: '“Look closer.”', sets: {}, next: 'f059' },
          { label: '“Home before sunset.”', sets: {}, next: 'f065' }
        ]
      }
    },

    /* ------------------------------------------------------------------ The groundhog (optional): the dig close */

    f059: {
      // the groundhog first, for the shiver's motion lines; its bottom out of the leaves' cover
      scene: S('grove', 'dig', LEAVES,
        door(['doze', 'sleepy'], ['crouch', 'worried', DOOR_BACK], ['crouch', 'wonder', { tap: 'nose' }]), ['day', 'motion']),
      board: 'MEDIUM, THE LITTLE DOORWAY, AFTERNOON, THE TAP PICTURE. In the round doorway half under the leaves lies something big, round and brown, seen from behind: a furry back and a round bottom sticking out into the cold, shivering; the little cream cat crouches behind our cat and whispers. In play our cat’s nose glows softly; one tap whispers hello and the page turns. Two captions top left; her balloon a whisper.',
      caption: ['You pad closer. In the little doorway, half under the leaves, lies something round and brown.', 'Something BIG. It shivers. Its bottom is sticking out in the cold.'],
      say: [{ who: 'chispapaw', text: 'Was THAT the badger?', kind: 'whisper' }],
      scratch: { tap: 'nose', prompt: '**Tap** to whisper, “Hello?”', label: 'Whisper, “Hello?”', next: 'f060' }
    },

    f060: {
      // it never names itself early: “The round brown thing” on its balloons till it says GROUNDHOG
      scene: S('grove', 'dig', LEAVES, door(['wake', 'stern'], ['crouch', 'wonder'], ['crouch', 'wonder']), ['day']),
      board: 'MEDIUM, THE LITTLE DOORWAY, AFTERNOON, COMEDY BEAT. The round brown shape lifts its head and turns it to glare at the two cats: a plump, furry, grumpy face with small round ears, a blunt nose and heavy sleepy eyelids, very annoyed at being woken. Caption top left; its balloon a grumble.',
      caption: ['The round brown thing opens one eye. Then the other. Then its whole grumpy face.'],
      say: [{ who: 'groundhog', name: ROUND, text: 'I was ASLEEP. I sleep ALL frost-time. It’s my JOB.' }],
      next: 'f061'
    },

    f061: {
      scene: S('grove', 'dig', LEAVES, door(['sit', 'shout'], ['sit', 'wonder'], ['crouch', 'wonder']), ['day']),
      board: 'MEDIUM, THE LITTLE DOORWAY, AFTERNOON, COMEDY BEAT. The plump brown creature sits up in its doorway on its haunches with its little paws folded on its belly, offended, and the little cream cat sits up too and asks the obvious question; neither of them has ever seen what they are talking about. Four balloons in turn.',
      say: [
        { who: 'chispapaw', text: 'What ARE you?' },
        { who: 'groundhog', name: ROUND, text: 'What do I LOOK like? A BADGER?', kind: 'shout' },
        { who: 'chispapaw', text: '…' + WJ + 'I don’t know what a badger looks like.' },
        { who: 'groundhog', name: ROUND, text: 'Neither do I.' }
      ],
      next: 'f062'
    },

    f062: {
      scene: S('grove', 'dig', LEAVES, door(['sit', 'sniff'], ['sit', 'wonder'], ['crouch', 'wonder']), ['day']),
      board: 'MEDIUM, THE LITTLE DOORWAY, AFTERNOON. The plump brown creature puts its nose up and sniffs toward the big dig with deep disapproval, and a small inset shows something large and shadowless padding past its bedroom wall in the night, seen only as a pair of big paws. Its balloon grumpy and slow.',
      say: [{ who: 'groundhog', name: ROUND, text: 'Not a badger. GROUNDHOG. Something BIGGER dug past my bedroom. Sniffing. All. Night.' }],
      next: 'f063'
    },

    f063: {
      // its tag the page's own from here; its whispered lullaby is the Count's prompt
      scene: S('grove', 'dig', LEAVES, door(['yawn', 'sleepy'], ['sit', 'happy'], ['crouch', 'kind']), ['day']),
      board: 'MEDIUM, THE LITTLE DOORWAY, AFTERNOON, THEN THE COUNTS. The groundhog opens its mouth in an enormous round yawn, its eyes squeezed shut, and sways sleepily in its doorway; the two cats lean in. In the Counts picture seven twigs with eight acorns each. Caption top left; its balloon a drowsy mumble; the keypad sits below the panel.',
      caption: ['It yawns an enormous yawn.'],
      say: [{ who: 'groundhog', text: 'Now I’ll NEVER get back to sleep. Unless…' }],
      counts: { set: 'ch13-lullaby', intro: false, next: 'f064' }
    },

    f064: {
      // asleep again, smiling; her ceremony's promise; `foundGroundhog` set for good by reaching this frame; our cat's
      // paw the Tap
      scene: S('grove', 'dig', LEAVES, door(['sleep', 'happy'], ['sit', 'kind'], ['crouch', 'kind', { tap: 'paw' }]), ['day']),
      board: 'MEDIUM, THE LITTLE DOORWAY, AFTERNOON, THE TAP PICTURE. The groundhog has curled up round in its doorway fast asleep with a little smile on its face, and the two cats bend over it, the little cream cat whispering goodnight. In play our cat’s paw glows softly; one tap tucks the leaves back over the doorway and the page turns. Caption top left; her balloon a whisper.',
      caption: ['At your ceremony, you promised to look after every friend who needs you. Even the grumpy ones.'],
      say: [{ who: 'chispapaw', text: 'Sleep tight. All frost-time.', kind: 'whisper' }],
      sets: { foundGroundhog: true },
      scratch: { tap: 'paw', prompt: '**Tap** to tuck the leaves back over it.', label: 'Tuck the leaves back over it.', next: 'f065' }
    },

    /* ------------------------------------------------------------------ The marks: every path (only she and Chispapaw see them) */

    f065: {
      // the leaves over the marks the Tap (the grove's `tap: 'leaves'`); the doorway half under leaves on both paths
      scene: S('grove', 'dig', merge(LEAVES, { tap: 'leaves' }), [chispa0('sit', 'wonder', 'marks-2', 'right'), you('sit', 'wonder', 'marks-1', 'right')], ['day']),
      board: 'MEDIUM, THE BIG DIG, AFTERNOON, THE TAP PICTURE. On the far side of the dig, on a patch of flat bare earth among the fallen leaves, something scratched in the ground peeps out from under a few leaves, and our cat and the little cream cat sit and stare at it. In play the leaves over it glow softly; one tap brushes them away and the page turns. Caption top left.',
      caption: ['On the way out, something catches your eye, on the far side of the dig, half under the leaves.'],
      scratch: { tap: 'leaves', prompt: '**Tap** to brush the leaves away.', label: 'Brush the leaves away.', next: 'f066' }
    },

    f066: {
      // the marks bare: one long line and eight little pokes, the kit's quick picture on earth, apart from the dig
      scene: S('grove', 'dig', BARE, [chispa0('crouch', 'wonder', 'marks-2', 'right'), you('crouch', 'wonder', 'marks-1', 'right')], ['day']),
      board: 'MEDIUM, THE BIG DIG, AFTERNOON. With the leaves brushed aside, the flat earth shows one long straight line scratched in it and, beside it, eight small neat pokes, five and three, all by themselves and nothing like the dig’s big curved scratches; the two cats crouch and stare. Two captions top left.',
      caption: ['Scratched in the earth: one long line. And eight little pokes, small and neat.', 'They’re not like the dig’s big scratches. These lie all by themselves, on the flat earth.'],
      next: 'f067'
    },

    f067: {
      scene: S('grove', 'dig', BARE, [chispa0('sit', 'worried', 'marks-2', 'right'), you('crouch', 'wonder', 'marks-1', 'right')], ['day']),
      board: 'MEDIUM, THE BIG DIG, AFTERNOON. The little cream cat sits back and whispers her guess, not sure of it at all, her big ears turning; our cat keeps staring at the line and the pokes in the earth. Her balloon a doubtful whisper.',
      say: [{ who: 'chispapaw', text: 'Claw marks?', kind: 'whisper' }],
      next: 'f068'
    },

    f068: {
      // the close-up: the marks fill the panel, two of the dig's curved rakes at its left edge; nobody in it; Tallyheart's
      // call from the bridge off the panel (named, no face); the marks the Tap
      scene: S('grove', 'marks', merge(BARE, { tap: 'marks' }), [], ['day']),
      board: 'EXTREME CLOSE-UP, THE MARKS, AFTERNOON, THE TAP PICTURE. The flat earth fills the panel: one long straight line scratched in it and eight small neat pokes beside it, and at the panel’s left edge two of the dig’s wide curved rakes, plainly something else. In play the marks glow softly; one tap looks one more time and the page turns. Caption top left; a call from off the panel.',
      caption: ['She isn’t sure. You aren’t sure either.'],
      say: [{ who: 'tallyheart', name: 'Tallyheart', text: 'Home, you two! Before sunset!', kind: 'shout' }],
      scratch: { tap: 'marks', prompt: '**Tap** to look one more time.', label: 'Look one more time.', next: 'f069' }
    },

    /* ------------------------------------------------------------------ Home at sunset: the camp (the pile off the picture) */

    f069: {
      scene: S('camp', 'reveal', {}, sendoff({ glint: ['sit', 'solemn'], tally: 'kind', you: 'wonder' }), ['sunset']),
      board: 'WIDE, THE CAMP AT SUNSET. The sun hangs low and orange over the glass towers and the camp glows gold, and our cat sits before Glintstar at the fountain’s foot telling her the elder’s guess, the little cream cat beside it and Tallyheart close by. Two captions top left.',
      caption: ['The sun is low when you get home.', 'You tell Glintstar the elder’s guess: a badger, digging for worms.'],
      next: 'f070'
    },

    f070: {
      // the old tom and the grey tom at the right, our cat and Chispapaw coming up; his tale's first line here (with all
      // four of the tale's balloons and the Tap on f071, Back ran under the screen's foot at 1080 x 720 and at 1180 x 820
      // with Aa on: the page sweep)
      scene: S('camp', 'crowd', {}, tale({ old: 'shout', grey: 'wonder', you: 'wonder', chispa: 'wonder' }), ['sunset']),
      board: 'MEDIUM, THE CAMP AT SUNSET. The afternoon’s hunters have come and gone with their prey, and in the golden light the old grizzled tom sits at the right of the panel holding forth to the skinny grey apprentice, who listens open-mouthed; our cat and the little cat come up to listen. Two captions top left; his balloon a boastful shout.',
      caption: ['The afternoon’s hunters bring more down to the store.', 'By the pile, the old tom tells the grey tom a story.'],
      say: [{ who: 'grizzled', text: 'A badger SAT on my whole patrol once! Flat as leaves!', kind: 'shout' }],
      next: 'f071'
    },

    f071: {
      // his tale, for laughs; our cat's paw the Tap (the flop)
      scene: S('camp', 'crowd', {}, tale({ old: 'shout', grey: 'wonder', you: 'happy', chispa: 'happy', youExtra: { tap: 'paw' } }), ['sunset']),
      board: 'MEDIUM, THE CAMP AT SUNSET, THE TAP PICTURE, COMEDY BEAT. The old grizzled tom tells his tale with huge gestures, his paws spread flat to show how flat, and a small inset shows a row of very surprised cats squashed flat as leaves under a big grey shape seen only as a furry rump; the grey apprentice gapes. In play our cat’s paw glows softly; one tap flops it flat too and the page turns. Three balloons, his shout, the apprentice’s question, his answer.',
      say: [
        { who: 'grizzled', text: 'There we were, minding our own business. Then… *WHUMP!*', kind: 'shout' },
        { who: 'snorer', text: 'Were you scared?' },
        { who: 'grizzled', text: 'I was FLAT.' }
      ],
      scratch: { tap: 'paw', prompt: '**Tap** to flop flat too.', label: 'Flop flat too.', next: 'f072' }
    },

    f072: {
      // the Tap's answer: our cat and Chispapaw flat as leaves
      scene: S('camp', 'crowd', {}, tale({ old: 'stern', grey: 'happy', you: 'happy', youPose: 'flat', chispa: 'happy', chispaPose: 'flat' }), ['sunset']),
      board: 'MEDIUM, THE CAMP AT SUNSET, COMEDY BEAT. Our cat and the little cream cat lie flopped flat on their tummies on the ground, as flat as they can get, and the little cat peers up at the old tom to check, who shakes his head with great seriousness. Two balloons, hers hopeful, his a verdict.',
      say: [
        { who: 'chispapaw', text: 'THIS flat?' },
        { who: 'grizzled', text: 'FLATTER.' }
      ],
      next: 'f073'
    },

    f073: {
      scene: S('camp', 'crowd', {}, tale({ old: 'stern', grey: 'wonder', you: 'wonder', chispa: 'wonder' }), ['sunset']),
      board: 'MEDIUM, THE CAMP AT SUNSET. Sitting up again, our cat tells the old tom about the line and the pokes, drawing them in the air with a claw, and the old tom narrows his eyes and pronounces on it as if he had known all along. Caption top left; his balloon certain.',
      caption: ['You tell him about the marks: one long line, eight little pokes.'],
      say: [{ who: 'grizzled', text: 'Claw marks. Mark my words.' }],
      next: 'f074'
    },

    f074: {
      // her book's new page (chapter 10's hook), a caption only
      scene: S('camp', 'crowd', {}, tale({ old: 'sniff', grey: 'wonder', you: 'wonder', chispa: 'wonder' }), ['sunset']),
      board: 'MEDIUM, THE CAMP AT SUNSET. Our cat sits very still in the golden light with a faraway look, and a small inset shows an open book with a fresh page and a big question written across the top of it; beside the pile the old tom sniffs, still muttering. One caption at the top.',
      caption: ['In your book, a new page opens: “What is a badger LIKE?”'],
      next: 'f075'
    },

    /* ------------------------------------------------------------------ Bedtime: the stars, no moon */

    f075: {
      scene: S('camp', 'reveal', {},
        [c('clancat', 'curl', 'sleepy', 'crowd-left', 'right', { variant: 3, asleep: true }), c('clancat', 'curl', 'sleepy', 'crowd-right', 'left', { variant: 1, asleep: true })], ['night', 'stars']),
      board: 'WIDE, THE CAMP UNDER THE STARS. The sky over the wild garden is full of sharp, bright stars on a cold clear night with no moon yet, and the dens, the ferns and the old stone fountain lie quiet and silver; two Clan cats are curled asleep by their dens. One caption at the top.',
      caption: ['The stars come out over camp, sharp and bright with cold.'],
      next: 'f076'
    },

    f076: {
      // her stone by her nose or under her chin (`ch2Stone`), as the den's `stone: 'auto'` draws it; captions first
      scene: S('den', 'nest', DENW13, [nestChime('lie', 'sleepy'), nestYou('loaf', 'kind')], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT. Our cat lies in its soft deep warrior’s nest beside the tortoiseshell warrior’s, the plain grey mist stone on the moss by its paws and Riffle’s nearly black stone where it always lies; in the next nest the tortoiseshell warrior lies with her chin on her paws. Captions top left.',
      caption: [
        'Your warrior’s nest is soft and deep, beside {Murmur}chime’s.',
        'Your mist stone is grey on the moss.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      next: 'f077'
    },

    f077: {
      // the dawn patrol's four, paid (chapter 12's slot)
      scene: S('den', 'nest', DENW13, [nestChime('lie', 'sleepy'), nestYou('loaf', 'happy')], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT, COMEDY BEAT. In the next nest the tortoiseshell warrior yawns an enormous yawn and says something very smug with her eyes closed, and our cat rolls its eyes at her from its own nest, smiling. Her balloon a smug yawn.',
      say: [{ who: 'murmurchime', text: 'Three mice this morning. Not that I’m counting.' }],
      next: 'f078'
    },

    f078: {
      // across camp: the collar by her nest, not one ting; her crouch by `teach` (exactly one caption-and-balloon pair)
      scene: S('den', 'inside', DEN_COLLAR,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right', { asleep: true }), chispa0('crouch', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, NIGHT. The grey apprentice sleeps curled in his nest, and in hers the little cream cat practises her hunter’s crouch one more time, very seriously, while beside her nest her red collar lies still and quiet in its hollow in the moss. Two captions top left; her balloon practising.',
      caption: [
        'Across camp, Chispapaw’s collar lies beside her nest. Not one *ting*.',
        { when: { teach: 'show' }, text: 'In her nest, she crouches one more time.' },
        { when: { teach: 'try' }, text: 'In her nest, she tries the crouch one more time.' },
        { when: { teach: 'words' }, text: 'In her nest, she crouches one more time.' }
      ],
      say: [
        { who: 'chispapaw', text: 'Belly low. Tail out. Like THIS.', when: { teach: 'show' } },
        { who: 'chispapaw', text: 'Lower… lower… GOT it.', when: { teach: 'try' } },
        { who: 'chispapaw', text: 'The crouch… feeds… you…', kind: 'whisper', when: { teach: 'words' } }
      ],
      next: 'f079'
    },

    f079: {
      // Chispapaw's goodnight from across the camp: off the panel, named, so it shows no face; our cat's raised tail the Tap
      scene: S('den', 'nest', DENW13, [nestChime('lie', 'sleepy'), nestYou('sit', 'happy', { tailUp: true, tap: 'tail' })], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT, THE TAP PICTURE. Our cat sits up in its nest with its tail raised high, smiling toward a small voice calling from across the camp, and in the next nest the tortoiseshell warrior opens one sleepy eye. In play the raised tail glows softly; one tap waves it goodnight and the page turns. A far voice’s balloon from off the panel.',
      say: [{ who: 'chispapaw', name: 'Chispapaw', text: 'Goodnight, MENTOR!', kind: 'shout' }],
      scratch: { tap: 'tail', prompt: '**Tap** to wave goodnight.', label: 'Wave goodnight.', next: 'f080' }
    },

    f080: {
      scene: S('den', 'inside', DEN_COLLAR, [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), chispa0('curl', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, NIGHT, COMEDY BEAT. The little cream cat lies curled in her nest, beaming, telling the grey apprentice about her leaf, and he answers from his own nest without opening his eyes; her collar lies quiet in its hollow. Two balloons, hers proud, his a mumble.',
      say: [
        { who: 'chispapaw', text: 'I caught a leaf today. A BIG one.' },
        { who: 'snorer', text: 'If a badger sits on me, wake me up.', kind: 'whisper' }
      ],
      next: 'f081'
    },

    f081: {
      // Tallyheart padding past a step nearer than the two nests, at the close-up's edge (chapter 12's PAST), touching
      // nobody; “Then, softly”: two balloons
      scene: S('den', 'nest', DENW13, [nestChime('lie', 'sleepy', { asleep: true }), nestYou('loaf', 'happy'), tally('walk', 'kind', PAST, 'left')], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT. Tallyheart pads quietly past the nest on her way to her own, coming in at the edge of the panel, and looks down at our cat with a soft, proud look; the tortoiseshell warrior sleeps on. Two balloons, her goodnight and a softer word.',
      say: [
        { who: 'tallyheart', text: 'Goodnight.' },
        { who: 'tallyheart', text: 'Mentor.', kind: 'whisper' }
      ],
      next: 'f082'
    },

    f082: {
      // the hook: the line and the pokes, never answered; our cat's nose the Tap
      scene: S('den', 'nest', DENW13, [nestChime('lie', 'sleepy', { asleep: true }), nestYou('loaf', 'dreamy', { tap: 'nose' })], ['night']),
      board: 'CLOSE-UP, HER WARRIOR’S NEST, NIGHT, THE TAP PICTURE. Our cat lies in its nest with a faraway, dreamy look, and a small inset floats above its head like a thought: one long line and eight small pokes scratched in earth. In play its nose glows softly; one tap curls it up tight and the page turns. Two captions top left.',
      caption: ['You close your eyes, and there they are again. One long line. Eight little pokes.', 'Where have you seen that before? You KNOW you have.'],
      scratch: { tap: 'nose', prompt: '**Tap** to curl up tight.', label: 'Curl up tight.', next: 'f083' }
    },

    /* ------------------------------------------------------------------ Chapter end */

    f083: {
      // (our cat first, so the sparkle the art scatters round the first cast member is round her: chapter 12's f079)
      scene: S('den', 'nest', DENW13, [nestYou('curl', 'sleepy', { asleep: true }), nestChime('lie', 'sleepy', { asleep: true })], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep, curled tight in its warrior’s nest beside the sleeping tortoiseshell warrior, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled; little sparkles round it. Soft starlight. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}{ending} dream, on the night of the first frost?'],
      input: { kind: 'dream', placeholder: 'Frost… a crouch… a long line…', next: 'f084' }
    },

    f084: {
      // the closing frame: across the camp, Chispapaw asleep, her tail straight up out of her curl (the caption carries
      // the twitch: `motion`'s speed lines ran out of the doorway behind her like a dash, looked at in a render); her collar
      // beside her nest
      scene: S('den', 'inside', DEN_COLLAR,
        [chispa0('curl', 'sleepy', 'nest', 'left', { asleep: true, tailUp: true }), c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right', { asleep: true })], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE APPRENTICES’ DEN, CLOSING SHOT. Starlight falls through the rosebush doorway across the sleeping den: the grey apprentice snores in his nest, and in hers the little cream cat sleeps curled tight, her tail rising straight up out of the curl, her collar quiet beside her; little zzzs rise. Captions at the bottom, with END OF CHAPTER THIRTEEN lettered like a title.',
      caption: ['{name}{ending} sleeps.', 'Across the camp, Chispapaw’s tail twitches in her sleep. Straight up.', 'End of Chapter Thirteen.'],
      end: true
    }
  };

  /* The chapter's Counts sets (the spec's section 2, exactly): the dawn patrol's prints, the warm-up (her two hardest
   * Counts of all 54 pairs, then one more, Chispapaw's echo on her first right answer), the lesson (take-aways, step 2:
   * the kit's marks page once, the worked example, then four), the morning's hunt, the noon pile (one take-away, no
   * twin), and the groundhog's lullaby (optional, chapter 9's sleeper's set again). */
  function T(text) { return { who: 'tallyheart', text: text }; }
  function C(text) { return { who: 'chispapaw', text: text }; }
  function G(text) { return { who: 'glintstar', text: text }; }
  var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';                 // chapter 10's
  var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';  // chapter 10's

  PC.story.ch13 = {
    id: 'ch13',
    number: 13,
    title: 'The Hunter’s Crouch',
    // module 2: it opens once chapter 12 is finished (number order), and its page lands in book two
    module: 2,
    start: 'f001',
    // our cat's balloons labelled with her warrior name on every page of the chapter
    names: { player: '{name}{ending}' },

    // No card: module 2 has no Case File (the badger page does its work).
    cards: {},

    frames: frames,

    counts: {
      'ch13-dawn': {
        table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}',
        // the 4s' help scratched in the earth (the frosty camp), as the camp's Counts of chapters 3 to 6
        ground: 'earth',
        facts: [{ a: 3, b: 4,
          prompt: [T('Let’s count something. Three cats, four paws each. How many paws?')], retryPrompt: true,
          right: [T('Twelve paws.'), { who: 'murmurchime', text: 'And not ONE of them warm.' }], rightAgain: true }],
        // a one-fact set's fact comes straight back, so its miss is “There.” (chapter 11's pile)
        praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: 'There.', missLast: LAST, done: null
      },
      'ch13-warm': {
        teacher: 'tallyheart',
        // the kit's cross-table warm-up: her hardest at 0, her next at 1, passing over 3 × 4 (dawn) and 6 × 8 (noon), never
        // over the optional lullaby's 7 × 8; each alt with its anchor Count's table (E.warriorAnchor), as chapter 12's
        warmHard: { table: 'all', at: [0, 1], avoid: [[3, 4], [6, 8]],
          alt: [{ a: 7, b: 4, table: 4 }, { a: 9, b: 9, table: 9 }] },
        facts: [{ a: 9, b: 7, table: 9 }, { a: 4, b: 6, table: 6 }, { a: 8, b: 8, table: 8 }],
        praise: [], fast: [], done: '',
        // chapter 12's Spanish: her first right answer of the lesson, a retry's counted; the fact alone, nothing after it
        echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }] }
      },
      'ch13-take': {
        op: '-', teach: 'ones2', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
        facts: [
          { a: 43, b: 16, regroup: 'show',
            prompt: 'Pretend the pile holds forty-three, and the Clan eats sixteen.',
            right: [T('Two rows, seven loose left.')] },
          { a: 70, b: 34, regroup: 'tap', prompt: 'Your turn.' },
          // (if play drags: 486 − 253 is cut, the chapter's only maths cut without a story edit; E.checkTakes still clean)
          [85, 39], [97, 52], [486, 253]
        ],
        echo: { on: [[85, 39]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] },
        // the kit's marks page (decision 57): once, before 43 − 16's prompt, while she has no marks; her style, never a flag
        marks: {
          lines: [C('My little Tall One writes it like THIS.'), C('A little 1 in front!'),
            T('Some write the new number on top instead.'), T('Both are right. Which marks do YOU like?')],
          one: [C('Just like my little Tall One!')],
          above: [T('On top it is. That’s how I write it too!')]
        }
      },
      'ch13-noon': {
        table: 8, thing: 'piece', things: 'pieces', unit: 'hunter', units: 'hunters', teacher: 'tallyheart', ask: '{a} × {b}',
        // six piles of eight (stacks, never rows: a row means ten)
        picture: { kind: 'prey' }, help: 'picture',
        facts: [{ a: 6, b: 8, prompt: [G('Six hunters went out this morning. Eight pieces each.')], retryPrompt: true,
          right: [G('Forty-eight.')], rightAgain: true }],
        praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: 'There.', missLast: LAST, done: null
      },
      'ch13-pile': {
        op: '-', teacher: 'tallyheart', picture: { kind: 'store' }, twins: false, done: '',
        facts: [{ a: 52, b: 27,
          prompt: [G('Twenty-seven go down to the store. How many stay for the Clan?')],
          right: [G('Twenty-five for the Clan.')] }]
      },
      'ch13-lullaby': {
        table: 8, thing: 'acorn', things: 'acorns', unit: 'twig', units: 'twigs', teacher: 'groundhog', ask: '{a} × {b}',
        // chapter 9's sleeper's set: seven twigs of eight acorns, lit a twig at a time; chapter 9's easiest eights borrowed
        picture: { kind: 'acorns' }, help: 'picture',
        facts: [{ a: 7, b: 8, prompt: [{ who: 'groundhog', kind: 'whisper', text: 'Seven… times… eight…' }], retryPrompt: true,
          right: [{ who: 'player', kind: 'whisper', text: 'Fifty-six.' },
            { who: 'groundhog', kind: 'whisper', text: 'Fifty… six… thank you…' },
            { kind: 'caption', text: '*Snore.*' }],
          rightAgain: true }],
        helpIntro: 'Hop by eights! Eight, sixteen…', helpIntroFar: 'Hop by eights! Eight, sixteen…',
        fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one…',
        avoid: [[6, 8], [7, 8], [8, 8]], praise: [], miss: MISS, missLast: LAST, done: null
      }
    },

    book: {
      title: '{name}{ending}’s First Frost-Time',
      chapterTitle: 'The Hunter’s Crouch',
      // book two: the store drawn under the recap (one square, seven rows, eight loose); never said on screen
      store: 178,
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}{ending}’s dream: “{dream}”',
      noDream: '{name}{ending}’s dream, the night of the first frost, stayed a secret.',
      // Seven entries on every reading, eight with the groundhog, each true on every path (the twenty-five whether
      // 52 − 27 was helped or not; “taught Chispapaw the hunter's crouch” for every `teach`); in English only
      recap: [
        { text: 'On the morning of the first frost, {name}{ending} walked {their} first dawn patrol as a warrior, with Tallyheart and {Murmur}chime.' },
        { text: 'At the Crossing, Granny had news of a fresh badger print on GroveClan’s side, and the ferry otters had heard it was as big as a FOX.' },
        { text: 'In the frosty ferns, {name}{ending} taught Chispapaw the hunter’s crouch: she caught a leaf, a mouse heard her bell, and she left her collar safe by her nest.' },
        { text: 'In the Training Hollow, Tallyheart taught them both what to do when there aren’t enough loose ones: spread a row, ten more loose.' },
        { text: 'At noon, twenty-seven pieces went down to the store, and twenty-five stayed for the Clan.' },
        { text: 'On a courtesy patrol to GroveClan, the elder showed them a big dig by the old oak: a badger, digging for worms, she said.' },
        { when: { foundGroundhog: true }, text: 'Beside the dig, {name}{ending} woke a grumpy groundhog, finished its sleepy seven times eight, and tucked the leaves back over it.' },
        { text: 'And half under the leaves, scratched in the earth, {name}{ending} found one long line and eight little pokes.' }
      ],
      // the badger page opens (module 2's table; rows in the order first heard or seen; row names fixed for chapters 14 to 21)
      badger: [
        { row: 'size', say: { text: 'As big as a FOX!', who: 'the ferry otters' } },
        { row: 'mice', saw: { text: 'A big dig, turned earth, no fur or feathers: it digs for worms.' } },
        { row: 'sat', say: { text: 'A badger SAT on my whole patrol!', who: 'the old tom' } },
        { row: 'marks', say: { text: 'Those scratches are claw marks.', who: 'the old tom' } }
      ],
      // the first of the seven sleepers' pages: without foundGroundhog no sleepers page at all; with it, the groundhog's
      // page (its `sleep` pose) and six plain silhouettes
      sleeper: { id: 'groundhog', name: 'The groundhog', when: { foundGroundhog: true },
        lines: ['Asleep in a little doorway beside the big dig in GroveClan’s woods. It sleeps ALL frost-time. It’s its JOB.',
          '“Not a badger. GROUNDHOG. Something BIGGER dug past my bedroom. Sniffing. All. Night.”'] }
    },

    // chapter 14's hook, on the hub once the chapter is finished
    teaser: {
      title: 'Chapter 14: The Night Watch',
      lines: ['More holes, and a watch to keep. Who will stay awake?']
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
