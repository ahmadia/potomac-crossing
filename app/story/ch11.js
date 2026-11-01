/* Chapter 11: The Warrior Ceremony.
 *
 * The story (docs/chapters/11-the-warrior-ceremony.md, Draft v0.4, final) cut into graphic-novel panels, per the
 * frame contract in docs/build.md; its spec (docs/chapters/11-the-warrior-ceremony.spec.md, v0.3) is the build's
 * contract for the flag, the Counts set, the two counts by taps, the warrior name, the art, the pages she taps and
 * the book. Each frame is one moment: a drawn scene, a written storyboard (`board`) for a future illustrator, short
 * captions, speech balloons and sound effects, and exactly one interaction. Frame ids run in reading order, the
 * order of the story's screens, f001 to f058 with no letters. There is no optional scene and no frame shown only
 * `when` a flag matches: every cat reads the same ceremony, and her name, her answers and her flags change lines.
 * One frame is a path of its own:
 *   the Type screen   f025, reached only by “I’ll name myself!” on the name choice (f024); every offered name goes
 *                     straight to “From tonight” (f026), where both meet. So 57 frames on a reading where she takes
 *                     an offered name, 58 where she names herself (the spec's 56 and 57, and the story's last screen
 *                     in two panels: its four boxes in one ran Back and Next under a 1080 x 720 iPad's screen, Aa on
 *                     and off, measured offscreen in WebKit; chapter 10's f082 and f083 are the precedent).
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that follows a
 * balloon on one screen of the story opens the next panel, or the panel is split in two (the spec's build notes
 * list the splits), and no panel holds five boxes. A line the story marks [if …] carries a `when`. A speaker's
 * lines on a panel are one balloon, but two balloons in a row where the story gives a speaker two paragraphs in a
 * row (the spec's list: Glintstar f012, f015, f016, f019, f020, f021; Riffle f034; Waffles f037; {Murmur}chime
 * f049). Speech tags' narration is not lettered (the picture carries “with a tiny smile”, “yawns”, “squeaks”).
 *
 * The warrior name (the spec's section 6, the chapter's one engine need):
 *   the offers      Glintstar's three names are computed (E.warriorOffers: her `ch10Best` row's, her `specialty`
 *                   row's, the moon's; a word passed over when her first part has it already, makes a book cat's
 *                   whole name with it, or makes three of one letter at the join). Each reason line on f020, f021
 *                   and f022 is a balloon with `when: { offer: word }` (the silver line also by `nameHas: 'moon'`),
 *                   so exactly one shows a row; the choice on f024 lists all thirty, each `when: { offer: word }`,
 *                   `ending: word` and `sets: { ch11Named: 'offer' }`, so exactly three show, never two alike,
 *                   with “I’ll name myself!” (which sets nothing) after them.
 *   the Type screen f025's `input: { kind: 'ending', refuse, sets: { ch11Named: 'self' } }`: what she types after
 *                   her first part, refused kindly (by a friend in the picture) and typed again on the same screen,
 *                   `ch11Named: 'self'` only once an ending is accepted.
 *   her name        `{name}paw` before the naming (and in “{Murmur}paw became {Murmur}… CHIME.”), `{name}{ending}`
 *                   from f026 on; our cat's balloons from the naming on carry `name: '{name}{ending}'` (the page's
 *                   default label stays `{name}paw`), and so does the paw thing's counter (f052's skip `name`).
 * Flags: `ch11Named` (`offer` or `self`), the chapter's one, set by the name choice or the Type screen. The two
 * light choices (the vow, the thanks) set nothing. Read from earlier chapters: `ch10Best` and `specialty` (through
 * the offers, and the watch's four thoughts), `worry` (f010), `ch2Stone` (f054, and the den's `stone: 'auto'`).
 *
 * The start frame always shows (E.checkStory): the story opens on a screen every path reads (“The moon comes up
 * over camp.”), so it is the start, and there is no title panel.
 *
 * Speakers: the Clan's calls are a Clan cat's balloon labelled “Every cat” (`name`, chapter 4's “Somebody”), with
 * a `clancat` in the picture. No chapter `names`.
 *
 * Staging (the spec's spots, each looked at in a render): the camp by moonlight is `moon: 15` on every night camp
 * frame (the camp's own moon, the tower lowered while it shows); the ring's front row left of the fountain
 * (RING_YOU, RING_TALLY), the old tom and the grey tom behind {Murmur}chime at `crowd-right` (OLD, GREY); from the
 * step-up on our cat at the Warrior Counts' FOOT, the mist stone at her paws, Tallyheart right beside her
 * (BESIDE); Thymeleaf at the ring's right edge by the ferns (THYME, a step smaller and nearer, clear of
 * {Murmur}chime); the old tom setting his pinecone down at her side (BY_FOOT). The staging calls the spec left
 * open: the purr and the call (f031) and every tail up (f032) on the camp's `purr` camera, the whole camp wide (the
 * moon drawn whole there too), and every cat looking at the old tom (f023) on the wide `reveal`, so the naming is not fifteen
 * panels of one camera; the bounce (f029) with our cat first in its cast, so the motion lines are hers; the bounce and the
 * bow a step forward of the foot (BOW), clear of Tallyheart; the two Clan cats padding in on
 * the first panel and the sleepers at their dens at the watch are Clan coats. The art draws a layer's cast in the
 * order it is listed, never by depth, so every cast is listed back to front (further up the panel first; the
 * fountain-top, raised, first of all; the bounce's first member, for its motion lines, excepted, and in the den our cat first
 * on f056 and f058, so the sparkle the art scatters round the first member is round her), and the story test
 * checks it on every frame. The mist stone: on the moss of her old nest till she takes it (the den's `miststone`, f002
 * to f006, so it never lies under Riffle's stone, whichever way `ch2Stone` puts that), in her mouth walking, under her
 * chin in the ring, at her paws at the fountain's foot (held, `holdAt`, never a camp option), flashing from the moon
 * finding it to the end of the watch, grey again by day, held up in both forepaws in her new nest (chapter 10's f152,
 * clear of Riffle's stone), on its moss once laid.
 * The book's entries are one sentence each, so every path reads seven sentences.
 *
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …) so nothing
 * needs escaping. Time of day comes from fx: `night` from the first panel to the end of the watch (the moon one
 * evening past full, never named), `morning` from first light to the end (she sleeps the day after her watch).
 * tests/story-ch11.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch11.md.
 */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};

  /* One cast member: who, pose, mood, anchor, facing, plus optional size/variant/extras. */
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
  // The camp by moonlight, the ring there or the camp asleep; the den at night (the moon one evening past full in
  // its doorway), by morning, and her warrior's nest (the `nest` close-up, {Murmur}chime in the next nest); the pile
  // whole by moonlight and in the first light; the tower's balcony by night
  var CAMP = { crowd: true, moon: 15 };
  var CAMP_NIGHT = { moon: 15 };
  var DEN15 = { weather: 'clear', moon: 15, stone: 'auto', bark: 'auto', hidden: true, glass: true };
  var DENM = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true };
  var DENW = merge(DENM, { nextNest: true });
  var DENW_STONE = merge(DENW, { miststone: true });
  var DENM_STONE = merge(DENM, { miststone: true });
  // her old nest by night with the mist stone on its moss, till she takes it (the den draws it clear of Riffle's stone)
  var DEN15_STONE = merge(DEN15, { miststone: true });
  var PILE_NIGHT = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 15 };
  var PILE_DAY = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' };
  var TOWER_NIGHT = { chime: true };

  // The spots (world units, the camp's main composition), each settled in a render:
  // the Warrior Counts' foot of the fountain (our cat, from the step-up on) and Tallyheart right beside her
  var FOOT = { x: 760, y: 860 };
  var BESIDE = { x: 950, y: 872 };
  // the ring's front row left of the fountain: our cat, and Tallyheart a step further left
  var RING_YOU = { x: 610, y: 905 };
  var RING_TALLY = { x: 380, y: 900 };
  // behind {Murmur}chime at `crowd-right`: the old tom and the grey tom, both inside `crowd`'s box
  var OLD = { x: 1130, y: 770 };
  var GREY = { x: 1290, y: 772 };
  // Thymeleaf at the ring's right edge by the ferns, a step smaller, his face and his whole body inside `crowd`'s
  // box (its right edge is x 1360) and below {Murmur}chime's paws, touching nobody
  var THYME = { x: 1300, y: 960, h: 180 };
  // a step forward of the foot, for her bounce and her bow (standing or crouched at FOOT, she would meet Tallyheart)
  var BOW = { x: 740, y: 860 };
  // the old tom crouched at her side, setting his pinecone down (left of FOOT, clear of her)
  var BY_FOOT = { x: 530, y: 872 };
  // the two cats walking into the ring (the front row's places, a step back)
  var WALK_YOU = { x: 650, y: 900 };
  var WALK_TALLY = { x: 380, y: 892 };
  // Tallyheart padding across the camp in the first light, toward our cat at the foot
  var PAD = { x: 1080, y: 890 };

  // Our cat at the foot of the fountain with the mist stone at her paws (grey; `flash` once the moon finds it)
  function you(pose, mood, extra) { return c('player', pose, mood, FOOT, 'right', merge({ holds: 'miststone', holdAt: 'paws' }, extra || {})); }
  function tally(pose, mood, extra) { return c('tallyheart', pose, mood, BESIDE, 'left', extra); }
  function glint(pose, mood) { return c('glintstar', pose, mood, 'fountain-top', 'left'); }
  function chime(pose, mood, extra) { return c('murmurchime', pose, mood, 'crowd-right', 'left', extra); }
  function old(pose, mood, extra) { return c('grizzled', pose, mood, OLD, 'left', merge({ holds: 'pinecone', holdAt: 'paws' }, extra || {})); }
  function grey(pose, mood, extra) { return c('snorer', pose, mood, GREY, 'left', extra); }
  function thyme(pose, mood, extra) { return c('thymeleaf', pose, mood, THYME, 'left', extra); }
  /* The ring at the fountain, back to front: Glintstar on top (raised), the old tom and the grey tom, the Clan cat
   * who calls for every cat, {Murmur}chime at the front, our cat at the foot, Tallyheart beside her; Thymeleaf at the ring's right edge where he is named.
   * `o` gives each one's pose and mood ([pose, mood, extra]), `null` leaves one out. */
  function ring(o) {
    o = o || {};
    var g = o.glint === undefined ? ['sit', 'solemn'] : o.glint, ol = o.old === undefined ? ['sit', 'neutral'] : o.old,
      gr = o.grey === undefined ? ['sit', 'neutral'] : o.grey, ch = o.chime === undefined ? ['sit', 'happy'] : o.chime,
      me = o.me === undefined ? ['sit', 'wonder'] : o.me, ta = o.tally === undefined ? ['sit', 'kind'] : o.tally;
    var out = [];
    if (g) out.push(glint(g[0], g[1]));
    if (ol) out.push(old(ol[0], ol[1], ol[2]));
    if (gr) out.push(grey(gr[0], gr[1], gr[2]));
    if (o.clancat) out.push(c('clancat', 'sit', o.clancat, 'crowd-left', 'right', { variant: 2 }));
    if (ch) out.push(chime(ch[0], ch[1], ch[2]));
    if (me) out.push(you(me[0], me[1], me[2]));
    if (ta) out.push(tally(ta[0], ta[1], ta[2]));
    if (o.thyme) out.push(thyme(o.thyme[0], o.thyme[1], o.thyme[2]));
    return out;
  }

  /* The ears' eight (the spec's section 2): five Clan coats, never six, so a player whose fur is a Clan coat always
   * has the sixth to swap to; {Murmur}chime fourth, the old tom seventh, chapter 1's cheeky apprentice eighth. */
  var EIGHT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }, { who: 'murmurchime' },
    { who: 'clancat', variant: 4 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }, { who: 'snorter' }];

  /* The three rows Glintstar sees names in (the story's For us, the engine's E.WARRIOR_ENDINGS): each offered word
   * and its reason, the reason a stand-in brings of its own where the first word's names its word. */
  function offer(word, reason) { return { who: 'glintstar', text: reason + ' {name}' + word + '.', when: { offer: word } }; }
  var FRIENDS = 'Your friends: an otter, a dragon or two, one very dramatic pillow cat, and this whole ring.';
  var TRUTH = 'Finding the truth. You found it, and you said it.';
  var CURTAINS = 'Up the curtains. Up the bramble arch.';
  var BRIGHT = 'Bright eyes, that see what everyone else misses.';
  var PADDLE = 'You taught a dragon to paddle. Back legs!';
  var SMILE = 'You even made Sloshbank smile. Almost.';
  var COUNTS = ['mark', 'count', 'tally'];
  var BEST_LINES = [
    offer('mist', 'Sprinkle, who flew home in the mist.'), offer('flash', 'Sprinkle, who says hello in a flash.'),
    offer('sky', 'Sprinkle, who flew home across the sky.'),
    offer('purr', FRIENDS + ' A purr for every one.'), offer('friend', FRIENDS + ' A friend to every one.'), offer('hug', FRIENDS + ' A hug for every one.'),
    offer('true', TRUTH), offer('clear', TRUTH), offer('brave', TRUTH),
    { who: 'glintstar', text: 'The Counts. Of COURSE.', when: { offer: COUNTS } },
    offer('mark', 'Ten claw marks on the leaning tree.'), offer('count', 'Every Count, up to ten times ten.'),
    offer('tally', 'You count EVERYTHING. Like Tallyheart.'),
    // Tallyheart's laugh after Glintstar's name for the cat, so Glintstar's two balloons chain with one tail (between
    // them, the third's tail ran up across the first two's words)
    { who: 'tallyheart', text: 'Ha!', when: { offer: COUNTS } }
  ];
  var BEST_LINE = [
    offer('bright', BRIGHT), offer('eye', BRIGHT), offer('sight', BRIGHT),
    offer('hush', 'Quiet as a shadow, all moon long.'), offer('sharp', 'Sharp ears, soft paws.'), offer('spark', 'Quick as a spark, and twice as quiet.'),
    offer('leap', CURTAINS + ' And a climber’s leap: crouch, look, JUMP!'), offer('climb', CURTAINS + ' Up ANYTHING.'),
    offer('reach', CURTAINS + ' Nothing is out of reach.'),
    offer('splash', PADDLE), offer('wave', PADDLE), offer('ripple', PADDLE),
    offer('cheer', 'The loudest cheer in any crowd. ' + SMILE), offer('smile', SMILE), offer('kind', SMILE)
  ];
  var MOON_LINES = [
    offer('moon', 'And one for this moon itself. On your first night, there was no moon at all. Now you’ve seen it round and full.'),
    { who: 'glintstar', text: 'And one for this moon itself. Your name has the moon in it already. So: {name}silver.', when: { offer: 'silver', nameHas: 'moon' } },
    { who: 'glintstar', text: 'And one for this moon itself, that turns everything silver. {name}silver.', when: { offer: 'silver', not: { nameHas: 'moon' } } },
    offer('river', 'And one for this moon itself, shining on the river.')
  ];
  // the thirty, in the rows' order (the twelve `ch10Best` words, the fifteen `specialty` words, the moon's three):
  // E.options keeps the definition order, so her three show as Glintstar named them
  var THIRTY = ['mist', 'flash', 'sky', 'purr', 'friend', 'hug', 'true', 'clear', 'brave', 'mark', 'count', 'tally',
    'bright', 'eye', 'sight', 'hush', 'sharp', 'spark', 'leap', 'climb', 'reach', 'splash', 'wave', 'ripple', 'cheer', 'smile', 'kind',
    'moon', 'silver', 'river'];
  var NAME_OPTIONS = THIRTY.map(function (w) {
    return { label: '{name}' + w, when: { offer: w }, ending: w, sets: { ch11Named: 'offer' }, next: 'f026' };
  }).concat([{ label: '“I’ll name myself!”', sets: {}, next: 'f025' }]);

  /* The Type screen's refusals (the story's five lines; the Clan cat's line is said by the cat whose name it is). */
  var REFUSE = {
    own: { who: 'tallyheart', text: 'That’s your name ALREADY! Give it a new ending.' },
    star: { who: 'glintstar', text: 'Star is for leaders. Try another ending.' },
    paw: { who: 'tallyheart', text: 'Paw? Not any more, you’re not! Try another.' },
    kit: { who: 'murmurchime', text: 'Kit? You’re a WARRIOR now, silly! Try another.' },
    clan: { text: 'That’s MY name! One of me is plenty. Find one all your own.' }
  };
  // our cat's balloons once she is named: her warrior name on the label
  var NAMED = '{name}{ending}';
  // the Clan's calls: a Clan cat's balloon, labelled for every cat
  var EVERY = 'Every cat';

  var frames = {

    /* ------------------------------------------------------------------ Tonight */

    f001: {
      scene: S('camp', 'reveal', CAMP_NIGHT,
        [c('clancat', 'walk', 'happy', 'crowd-left', 'right', { variant: 2 }), c('clancat', 'walk', 'happy', 'ferns', 'left', { variant: 4 })], ['night']),
      board: 'WIDE, THE CAMP BY MOONLIGHT. The moon has come up over the wild garden, one evening past full and lit on its left, and the dens, the ferns, the mossy paths and the old stone fountain all shine silver-blue; nobody is on the fountain yet. Two Clan cats pad in toward it from the edges. Three captions in a column, top left.',
      caption: ['The moon comes up over camp.', 'The dens, the ferns, the old stone fountain: everything is silver.',
        'This morning, you passed your Warrior Counts. Tonight, the Clan gathers. For your name.'],
      next: 'f002'
    },

    f002: {
      scene: S('den', 'inside', DEN15_STONE,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'sit', 'wonder', 'nest', 'right'),
         c('tallyheart', 'peer', 'happy', 'doorway', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. Moonlight falls through the rosebush doorway, where a big ginger head with a torn ear has poked in, eyes bright; the grey apprentice is curled in his nest across the den, and our cat sits up in its own, ears pricked. Caption top left; her balloon a whisper.',
      caption: ['Tallyheart’s head pokes into the den.'],
      say: [{ who: 'tallyheart', text: 'It’s time.', kind: 'whisper' }],
      next: 'f003'
    },

    f003: {
      scene: S('den', 'inside', DEN15_STONE,
        [c('snorer', 'sit', 'happy', 'sleeper-1', 'right'), c('player', 'sit', 'wonder', 'nest', 'left', { tap: 'ears' })], ['night']),
      board: 'WIDE, INSIDE THE DEN, THE TAP PICTURE. Across the den the grey apprentice has sat up in his nest, grinning at our cat, whose ears stand straight up with excitement. In play its ears glow softly; one tap flattens them and the page turns. Caption top left; his balloon a tease.',
      caption: ['Across the den, the grey tom sits up.'],
      say: [{ who: 'snorer', text: 'Your ears are sticking up.' }],
      scratch: { tap: 'ears', prompt: '**Tap** to flatten your ears.', label: 'Flatten your ears.', next: 'f004' }
    },

    f004: {
      scene: S('den', 'inside', DEN15_STONE,
        [c('snorer', 'sit', 'happy', 'sleeper-1', 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, COMEDY BEAT. Our cat’s ears have sprung right back up, both of them, as if on springs; across the den the grey apprentice tips his head and considers them. The boing lettered by its ears; caption top left; his balloon dry.',
      caption: ['They pop right back up.'],
      say: [{ who: 'snorer', text: 'Better. Sort of.' }],
      sfx: 'Boing.',
      next: 'f005'
    },

    f005: {
      scene: S('den', 'inside', DEN15_STONE,
        [c('snorer', 'sit', 'sad', 'sleeper-1', 'right'), c('player', 'sit', 'proud', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN. The grey apprentice sighs a long sigh with his ears drooping, and across the empty middle nest our cat sits up very straight and makes him a promise, chin high. Caption top left; his balloon glum, hers bold.',
      caption: ['Then he sighs.'],
      say: [
        { who: 'snorer', text: 'Warriors sleep with the warriors. So who’ll do the paw thing with me now?' },
        { who: 'player', text: 'I’ll do it from my new nest. LOUDLY.' }
      ],
      next: 'f006'
    },

    f006: {
      // our cat sits up holding the stone in both forepaws, lifted off the moss, as f049 and chapter 10's f152: the Tap on
      // the stone itself. Sitting by it, her paw's Tap ring lay on Riffle's stone for a `ch2Stone: 'chin'` cat (the fix
      // round's check, in WebKit with that flag set), so neither the paw nor the moss holds the Tap
      scene: S('den', 'nest', DEN15,
        [c('player', 'situp', 'kind', 'nest', 'left', { holds: 'miststone', tap: 'stone' })], ['night']),
      board: 'CLOSE-UP, THE NEST, THE TAP PICTURE. Out of the moonlight in our cat’s nest, our cat sits up holding the plain grey mist stone in both forepaws, just lifted off the moss, looking at it fondly; its Case File stands in rows along the mossy edge. In play the grey stone glows softly; one tap tucks it under its chin and the page turns. Two captions top left.',
      caption: ['On the moss of your nest, out of the moonlight, your mist stone is grey.', 'Sprinkle will want to hear your new name.'],
      scratch: { tap: 'stone', prompt: '**Tap** to take it with you, tucked close.', label: 'Take the mist stone.', next: 'f007' }
    },

    /* ------------------------------------------------------------------ The ring */

    f007: {
      scene: S('camp', 'reveal', CAMP,
        [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left'), c('thymeleaf', 'sit', 'kind', 'ferns', 'left')], ['night']),
      board: 'WIDE, THE CAMP BY MOONLIGHT. Every cat of the Clan sits in a ring round the old stone fountain, washed and fluffed and shining silver, and on top of the fountain Glintstar stands tall against the moon. At the ring’s edge by the ferns the old oatmeal medicine cat hushes his rustling leaves. Three captions top left; his balloon a hush.',
      caption: ['Every cat of CrystalClan sits in a ring in the clearing, washed and fluffed.', 'Glintstar stands tall on the fountain.',
        'At the edge of the ring, by his den, Thymeleaf hushes his leaves.'],
      say: [{ who: 'thymeleaf', text: 'Shh. This is the good part.' }],
      next: 'f008'
    },

    f008: {
      scene: S('camp', 'crowd', CAMP,
        [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left'), chime('sit', 'happy'), c('tallyheart', 'walk', 'kind', WALK_TALLY, 'right'),
         c('player', 'walk', 'wonder', WALK_YOU, 'right', { holds: 'miststone' })], ['night']),
      board: 'MEDIUM, THE RING. Our cat pads into the ring at Tallyheart’s side, the grey mist stone carried carefully in its mouth, and at the front of the crowd the young tortoiseshell warrior waves her tail at it, beaming. Glintstar waits on the fountain. Caption top left; her balloon a loud whisper.',
      caption: ['You pad into the ring with Tallyheart.'],
      say: [{ who: 'murmurchime', text: 'Front row. Like I promised. AGAIN. I’ve been sitting here ALL afternoon.', kind: 'whisper' }],
      next: 'f009'
    },

    f009: {
      // the old tom and the grey tom squeeze in behind {Murmur}chime (the story's split: the narration opens this panel)
      scene: S('camp', 'crowd', CAMP,
        [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left'), old('sit', 'happy'), grey('sit', 'happy'), chime('sit', 'happy'),
         c('tallyheart', 'sit', 'kind', RING_TALLY, 'right'), c('player', 'sit', 'wonder', RING_YOU, 'right', { holds: 'miststone', holdAt: 'chin' })], ['night']),
      board: 'MEDIUM, THE RING. The old grizzled tom squeezes into the crowd behind the tortoiseshell warrior with his pinecone at his paws, and the skinny grey apprentice squeezes in beside him; our cat and Tallyheart sit in the front row, the mist stone tucked under our cat’s chin. One caption at the top.',
      caption: ['The old tom squeezes in behind her with his pinecone, and the grey tom beside him.'],
      next: 'f010'
    },

    f010: {
      // her worry, one caption by `worry` (history now); then Tallyheart's tail and the whisper (four boxes)
      scene: S('camp', 'crowd', CAMP,
        [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left'), old('sit', 'neutral'), grey('sit', 'happy'), chime('sit', 'happy'),
         c('tallyheart', 'stand', 'proud', RING_TALLY, 'right'), c('player', 'sit', 'happy', RING_YOU, 'left', { holds: 'miststone', holdAt: 'chin' })], ['night']),
      board: 'MEDIUM, THE RING’S FRONT ROW, COMEDY BEAT. Tallyheart stands beside our cat with her chest out and her tail tip twitching, very much not nervous, and our cat turns to her with a knowing look, the mist stone under its chin. Caption top left; our cat’s balloon a whisper, hers airy.',
      caption: [
        { when: { worry: 'small' }, text: 'So many cats. You sit up very tall, like at the Gathering.' },
        { when: { worry: 'water' }, text: 'The river glints in the moonlight. Since the Moon Ferry, it doesn’t scare you one bit.' },
        { when: { worry: 'talk' }, text: 'Tonight, you only need two words. You held a whole case in till the Gathering. Two is EASY.' },
        { when: { worry: 'shiny' }, text: 'Everything is silver. You look all you like. Tonight, it’s ALLOWED.' },
        'Tallyheart’s tail is twitching.'
      ],
      say: [
        { who: 'player', text: 'Are you NERVOUS?', kind: 'whisper' },
        { who: 'tallyheart', text: 'Me? Never. Let’s count something.' }
      ],
      next: 'f011'
    },

    f011: {
      // the ears by taps: Tallyheart's paragraph lettered across two panels, the count in her balloon (`teacher`)
      scene: S('camp', 'crowd', CAMP,
        [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left'), old('sit', 'neutral'), grey('sit', 'happy'), chime('sit', 'happy'),
         c('tallyheart', 'sit', 'happy', RING_TALLY, 'right'), c('player', 'sit', 'happy', RING_YOU, 'right', { holds: 'miststone', holdAt: 'chin' })], ['night']),
      board: 'MEDIUM, THE RING, THE TAP PICTURE. Tallyheart leans to our cat and nods at the eight cats sitting in front of them, the tortoiseshell warrior among them. In play the counting picture takes the panel: eight cats in rows of five and three, the next glowing; each tap lights its two ears and Tallyheart counts it, 2, 4, 6, up to 16, and the eighth tap turns the page. Her balloon brisk.',
      say: [{ who: 'tallyheart', text: 'Eight cats, right in front of us. Ears, by twos.' }],
      skip: { table: 2, groups: 8, who: EIGHT, teacher: 'tallyheart', label: 'Count the next cat.', prompt: '**Tap** the cats.', carry: false, next: 'f012' }
    },

    f012: {
      // (the old tom and the grey tom still in the ring behind {Murmur}chime, as from f009 on: the final review)
      scene: S('camp', 'crowd', CAMP,
        [c('glintstar', 'stand', 'proud', 'fountain-top', 'left'), old('sit', 'neutral'), grey('sit', 'happy'), chime('sit', 'happy'),
         c('tallyheart', 'sit', 'happy', RING_TALLY, 'right'), c('player', 'walk', 'wonder', RING_YOU, 'right', { holds: 'miststone', tap: 'paw' })], ['night']),
      board: 'MEDIUM, THE RING, THE TAP PICTURE. Every ear in the ring points at our cat, and on the fountain Glintstar stands tall in the moonlight and calls it up; our cat steps out of the front row with the mist stone in its mouth and one paw lifted. In play its lifted paw glows softly; one tap steps it up to the fountain and the page turns. Caption top left; four boxes, Glintstar’s two ringing.',
      caption: ['Sixteen! And every ear is pointing at you.'],
      say: [
        { who: 'tallyheart', text: 'Phew. Nerves gone.' },
        { who: 'glintstar', text: 'CrystalClan! Tonight, one of us becomes a warrior.' },
        { who: 'glintstar', text: '{name}paw. Come up.' }
      ],
      scratch: { tap: 'paw', prompt: '**Tap** to step up, and set your mist stone down.', label: 'Step up.', next: 'f013' }
    },

    /* ------------------------------------------------------------------ The ceremony: our cat at the foot of the
     * fountain with the mist stone at her paws (in its shadow, grey), Tallyheart right beside her */

    f013: {
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], me: ['sit', 'wonder'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN. Glintstar sits on the fountain top in the moonlight and looks down at our cat at its foot, the grey stone set down at its paws, with Tallyheart right beside it; the whole ring listens, the old tom among them. Her balloon grave and warm.',
      say: [{ who: 'glintstar', text: 'When you came to us from behind the glass, not every cat was sure.' }],
      next: 'f014'
    },

    f014: {
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], old: ['sit', 'shy'], tally: ['sit', 'proud'], me: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN, COMEDY BEAT. In the crowd the old grizzled tom coughs into his paw and studies his pinecone, and beside our cat Tallyheart lifts her chin and says it to the whole ring, exactly as she said it the first night. Caption top left; her balloon firm.',
      caption: ['The old tom coughs.'],
      say: [{ who: 'tallyheart', text: 'I was sure. Judge {them} by what {they} does, not by where {they} sleeps.' }],
      next: 'f015'
    },

    f015: {
      // Glintstar's two paragraphs, two balloons (the spec's)
      scene: S('camp', 'fountain-close', CAMP_NIGHT, [c('glintstar', 'sit', 'kind', 'fountain-top', 'left')], ['night']),
      board: 'LOW ANGLE, CLOSE ON THE FOUNTAIN TOP. Glintstar sits silver against the moon and speaks warmly, and small insets float beside her like a list: an empty place in the pile, a fish for a hungry dragonet, a ring of every Clan. Two balloons, both hers.',
      say: [
        { who: 'glintstar', text: 'So we did. I said it at the Gathering. Tonight, I say it at home.' },
        { who: 'glintstar', text: 'You noticed what was missing. You fed a friend who was hungry. You found out the truth, and you said it, to every Clan.' }
      ],
      next: 'f016'
    },

    f016: {
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['stand', 'proud'], me: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN. Glintstar stands on the fountain top and turns to the whole Clan, and a small inset shows the leaning tree with ten claw marks on it; below her our cat sits very still at the foot. Two balloons, both hers, the second ringing out over the ring.',
      say: [
        { who: 'glintstar', text: 'And this morning, you answered every Count, up to ten times ten.' },
        { who: 'glintstar', text: 'CrystalClan. Will you stand by {name}paw, the way {they} stood by a friend in the dark?' }
      ],
      next: 'f017'
    },

    f017: {
      // the Clan's answer: a Clan cat's balloon labelled for every cat, the old tom's right after
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['stand', 'happy'], old: ['situp', 'shout'], chime: ['sit', 'shout'], clancat: 'shout', me: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, THE RING, COMEDY BEAT. Every cat in the ring answers at once, mouths open, the shout drawn big over the crowd, and in the middle of it the old grizzled tom bobs up very pleased with himself. Our cat looks round, glowing. Two balloons, the Clan’s a shout, his smug.',
      say: [
        { who: 'clancat', name: EVERY, text: 'WE WILL!', kind: 'shout' },
        { who: 'grizzled', text: 'I said it FIRST.' }
      ],
      next: 'f018'
    },

    f018: {
      // the vow, a light choice: both to the next screen, nothing set
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['peer', 'kind'], old: ['sit', 'neutral'], me: ['sit', 'wonder'], tally: ['sit', 'proud'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN, THE CHOICE. Glintstar leans down from the fountain top toward our cat, her pale eyes kind and serious, and the whole ring goes quiet; the old tom tries to look as if he never spoke. Caption top left; her balloon solemn; the choices sit below the panel.',
      caption: ['He didn’t.'],
      say: [{ who: 'glintstar', text: 'And you, {name}paw. Will you keep the Accord? Will you look after this Clan, and every friend who needs you?' }],
      choice: {
        options: [
          { label: '“I will.”', sets: {}, next: 'f019' },
          { label: '“I PROMISE!”', sets: {}, next: 'f019' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Your name: Glintstar, our cat and
     * Tallyheart on every panel, so any of their lines can show */

    f019: {
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], me: ['sit', 'wonder', { tap: 'ears' }], tally: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN, THE TAP PICTURE. Glintstar smiles down at our cat, and a small inset shows the tortoiseshell warrior’s name changing its ending, a paw print turning into a little chime; our cat’s ears are straight up. In play its ears glow softly; one tap and the page turns. Two balloons, both hers.',
      say: [
        { who: 'glintstar', text: 'I know you will. Your warrior name keeps {name}. Only the paw goes, for a new ending. {Murmur}paw became {Murmur}… CHIME.' },
        { who: 'glintstar', text: 'Tallyheart promised you a name with this moon in it. Tonight, I see three.' }
      ],
      scratch: { tap: 'ears', prompt: '**Tap** to hear them.', label: 'Listen.', next: 'f020' }
    },

    f020: {
      // the first name, by what she will remember most of this moon: one reason a reading, by `offer`
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'happy'], me: ['sit', 'wonder'], tally: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN. Glintstar names the first name she sees in our cat, and a small inset shows what it will remember most of its moon: a misty dragonet, a ring of friends, a fox’s case, or a claw-marked tree. Tallyheart grins beside our cat. Glintstar’s balloons warm; Tallyheart’s a laugh for the Counts.',
      say: [{ who: 'glintstar', text: 'Tallyheart told me what you’ll remember most.' }].concat(BEST_LINES),
      next: 'f021'
    },

    f021: {
      // the second, by what she does best
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'proud'], me: ['sit', 'happy'], tally: ['sit', 'proud'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN. Glintstar names the second name, and a small inset shows what our cat does best: bright eyes, a quiet shadow, a leap up the curtains, a paddling dragon, or a cheer in a crowd. Our cat sits up taller. Two balloons, both hers.',
      say: [{ who: 'glintstar', text: 'And what you do best.' }].concat(BEST_LINE),
      next: 'f022'
    },

    f022: {
      // the third, for this moon (the silver line by `nameHas`), then the old tom's shout
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], old: ['situp', 'shout'], me: ['sit', 'wonder'], tally: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN, COMEDY BEAT. Glintstar looks up at the moon behind the fountain for the third name, and a small inset shows a moonless night sky beside a round full moon; then from the crowd the old grizzled tom bobs up holding his pinecone high. Two balloons, hers soft, his a shout.',
      say: MOON_LINES.concat([{ who: 'grizzled', text: 'Or {name}PINECONE!', kind: 'shout' }]),
      next: 'f023'
    },

    f023: {
      // the whole ring turns to him: the camp wide (Glintstar and Tallyheart turned to him, as every cat is)
      scene: S('camp', 'reveal', CAMP, ring({ glint: ['sit', 'solemn'], old: ['situp', 'proud'], chime: ['sit', 'wonder'], me: ['sit', 'wonder'], tally: ['sit', 'solemn'] })
        .map(function (m) { return m.who === 'glintstar' || m.who === 'tallyheart' ? merge(m, { facing: 'right' }) : m; }), ['night']),
      board: 'WIDE, THE WHOLE RING, COMEDY BEAT. Every head in the ring turns to the old grizzled tom at once, Glintstar’s and Tallyheart’s too, and he holds his pinecone up to the moonlight with great dignity, not one bit sorry. Caption top left; his balloon wounded pride.',
      caption: ['Every cat looks at him.'],
      say: [{ who: 'grizzled', text: 'What? It’s a GOOD pinecone.' }],
      next: 'f024'
    },

    f024: {
      // the name choice: thirty offered names, three shown (her own three, never two alike), then her own
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['peer', 'kind'], me: ['sit', 'wonder'], tally: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN, THE CHOICE. Glintstar leans down from the fountain top with a smile, and three small insets float over our cat, one for each name she sees in it; Tallyheart leans close and whispers. Two balloons, Glintstar’s warm, Tallyheart’s a whisper; the choices sit below the panel.',
      say: [
        { who: 'glintstar', text: 'Pick one. Or name yourself. It’s YOUR name.' },
        { who: 'tallyheart', text: 'Take your time. There’s no wrong one.', kind: 'whisper' }
      ],
      choice: { options: NAME_OPTIONS }
    },

    f025: {
      // the Type screen: her own ending after her first part; refused, a friend in the picture says why
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['peer', 'happy'], me: ['sit', 'proud'], tally: ['sit', 'happy'], thyme: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN, ONLY FOR A CAT WHO NAMES HERSELF. Glintstar nods down at our cat with a twinkle, and the ring leans in to see what it will choose, Tallyheart, the tortoiseshell warrior and the old medicine cat among them. Her balloon warm; the box for its new ending sits below the panel, its first part in front of it.',
      say: [{ who: 'glintstar', text: 'Then you choose. {name}… what? A word you’re proud of.' }],
      input: { kind: 'ending', refuse: REFUSE, sets: { ch11Named: 'self' }, next: 'f026' }
    },

    /* ------------------------------------------------------------------ From tonight */

    f026: {
      // Glintstar's name for her, one balloon written twice by how she was named; Tallyheart's promise for an offered name
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['peer', 'kind'], me: ['sit', 'wonder'], tally: ['sit', 'kind'] }), ['night', 'glow']),
      board: 'MEDIUM, THE FOUNTAIN. Glintstar looks down from the fountain top with the moonlight shining all around her like a halo and says our cat’s new name to it alone; Tallyheart leans in close, her eyes bright. Caption top left; Glintstar’s balloon gentle, Tallyheart’s a whisper.',
      caption: ['Glintstar looks down at you, and the moonlight shines all around her.'],
      say: [
        { who: 'glintstar', text: '{name}{ending}. Your very own. I like it.', when: { ch11Named: 'self' } },
        { who: 'glintstar', text: '{name}{ending}.', when: { not: { ch11Named: 'self' } } },
        { who: 'tallyheart', text: 'A name with this moon in it. Like I promised.', kind: 'whisper', when: { ch11Named: 'offer' } }
      ],
      next: 'f027'
    },

    f027: {
      // a typed ending that is a friend's (heart, chime, leaf, pinecone, or its plural) gets that friend's line
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], old: ['situp', 'happy'], chime: ['sit', 'happy'], me: ['sit', 'happy'], tally: ['sit', 'happy'], thyme: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN. Glintstar asks our cat to say its new name, and round the ring its friends lean in, Tallyheart’s ears pricked, the tortoiseshell warrior, the old medicine cat and the old tom all listening. A friend whose name ends the same pipes up first. Her balloon kind.',
      caption: [{ when: { ending: ['heart', 'hearts'] }, text: 'Tallyheart’s ears go straight up.' }],
      say: [
        { who: 'tallyheart', text: 'Like MINE?', when: { ending: ['heart', 'hearts'] } },
        { who: 'murmurchime', text: 'Like MINE!', when: { ending: ['chime', 'chimes'] } },
        { who: 'thymeleaf', text: 'Leaf, like mine.', when: { ending: ['leaf', 'leafs', 'leaves'] } },
        { who: 'grizzled', text: 'I KNEW it!', when: { ending: ['pinecone', 'pinecones'] } },
        { who: 'glintstar', text: 'Your warrior name. Say it.' }
      ],
      next: 'f028'
    },

    f028: {
      // (the spec's “closer on our cat”: the camp has no camera close on the fountain's foot, so the crowd shot again)
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], me: ['sit', 'wonder'], tally: ['sit', 'kind'] }), ['night', 'glow']),
      board: 'MEDIUM, THE FOUNTAIN’S FOOT. Our cat sits very still in the moonlight with its eyes shining and whispers its new name for the very first time, trying it on; Glintstar and Tallyheart wait. Its balloon a whisper.',
      say: [{ who: 'player', name: NAMED, text: '{name}{ending}.', kind: 'whisper' }],
      next: 'f029'
    },

    f029: {
      // (our cat first in the cast, so the bounce's motion lines are hers, not Glintstar's: the art draws them round the
      // first cast member, trailing behind her, to the left and clear of Tallyheart; a step forward of the foot, clear of
      // Tallyheart; the rest of the ring as on f028 and f030, so nobody leaves the picture for the bounce: the old tom,
      // the grey tom and {Murmur}chime sit at x 1130 and on, nowhere near her, so her being drawn first hides nothing)
      scene: S('camp', 'crowd', CAMP, [you('stand', 'happy', { at: BOW }), glint('sit', 'happy'), old('sit', 'happy'), grey('sit', 'happy'), chime('sit', 'happy'),
        tally('sit', 'happy')], ['night', 'motion']),
      board: 'MEDIUM, THE FOUNTAIN, COMEDY BEAT. Our cat cannot help it: it springs up on all four paws at the foot of the fountain with bounce lines streaming round it; Tallyheart and Glintstar try not to laugh, and the ring grins. Two captions top left.',
      caption: ['It fits, like your own fur.', 'Then you can’t help it. You BOUNCE.'],
      next: 'f030'
    },

    f030: {
      // (her bow a step forward of the foot, to the Clan, facing left: crouched at the foot itself she would meet
      // Tallyheart beside her)
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['stand', 'shout'], me: ['crouch', 'proud', { tap: 'nose', facing: 'left', at: BOW }], tally: ['sit', 'proud'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN, THE TAP PICTURE. Glintstar lifts her head high on the fountain top and calls the new name to the whole Clan, and at the foot our cat lowers its head with its nose to the grass. In play its nose glows softly; one tap bows, with tremendous dignity, and the page turns. Caption top left; her balloon a ringing shout.',
      caption: ['Glintstar lifts her head high.'],
      say: [{ who: 'glintstar', text: 'Cats of CrystalClan! Our newest warrior: {name}{ending}!', kind: 'shout' }],
      scratch: { tap: 'nose', prompt: '**Tap** to bow, with tremendous dignity.', label: 'Bow.', next: 'f031' }
    },

    f031: {
      // the purr, then the call, on the camp's `purr` camera: the whole camp wide
      scene: S('camp', 'purr', CAMP, ring({ glint: ['stand', 'happy'], old: ['sit', 'happy'], grey: ['sit', 'happy'], clancat: 'happy', me: ['sit', 'happy', { tailUp: true, tap: 'tail' }],
        tally: ['sit', 'happy'] }), ['night', 'purr']),
      board: 'WIDE, THE WHOLE CAMP, THE TAP PICTURE. All round the ring every cat purrs, the purr drawn as warm rings rising over the moonlit camp, and then every mouth opens to call the new name; our cat sits at the foot of the fountain with its tail straight up. In play its raised tail glows softly; one tap lifts every tail with it and the page turns. Three captions top left; the Clan’s balloon a shout.',
      caption: ['One by one, the cats begin to purr, all round the ring,', 'until the whole camp is humming your new name.', 'Then every cat calls it out.'],
      say: [{ who: 'clancat', name: EVERY, text: '{name}{ending}! {name}{ending}!', kind: 'shout' }],
      scratch: { tap: 'tail', prompt: '**Tap** to lift your tail, high.', label: 'Lift your tail.', next: 'f032' }
    },

    f032: {
      // every tail in the cast up, as the Tap's answer; Thymeleaf full-sized by the ferns (the `purr` camera has room for
      // the set's own spot, where THYME, sized for `crowd`'s box, drew him a kitten in the foreground); no sparkle (the
      // art scatters it round the first cast member, and one landed on {Murmur}chime's yowling face)
      scene: S('camp', 'purr', CAMP,
        ring({ glint: ['stand', 'happy'], old: ['situp', 'happy', { tailUp: true }], grey: ['sit', 'happy', { tailUp: true }], chime: ['sit', 'shout', { tailUp: true }],
          me: ['sit', 'happy', { tailUp: true }], tally: ['sit', 'happy', { tailUp: true }], thyme: ['sit', 'happy', { tailUp: true, at: 'ferns' }] }), ['night']),
      board: 'WIDE, THE WHOLE CAMP. Every tail in the ring is straight up with our cat’s, and the young tortoiseshell warrior yowls with her head thrown back till her whiskers shake; at the ring’s edge by the ferns the old medicine cat leans to his rustling leaves. Caption top left; his balloon delighted.',
      caption: ['{Murmur}chime yowls till her whiskers shake.'],
      say: [{ who: 'thymeleaf', text: 'Did you hear that, leaves?' }],
      next: 'f033'
    },

    f033: {
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], me: ['sit', 'happy'], tally: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN’S FOOT, QUIET. In all the noise Tallyheart does not yowl at all: she sits beside our cat and just looks at it, her eyes shining with pride in the moonlight. One caption at the top.',
      caption: ['Tallyheart doesn’t yowl. She just looks at you, and her eyes shine.'],
      next: 'f034'
    },

    /* ------------------------------------------------------------------ All the way to the river */

    f034: {
      scene: S('camp', 'reveal', CAMP,
        [glint('stand', 'happy'), c('player', 'pawup', 'happy', FOOT, 'left', { holds: 'miststone', holdAt: 'paws', tap: 'paw' }), tally('sit', 'happy'),
         c('riffle', 'scramble', 'shout', 'entrance', 'right')], ['night']),
      board: 'WIDE, THE CAMP BY MOONLIGHT, THE TAP PICTURE. A dripping young otter scrambles up through the hedge at the camp’s edge, cheering louder than every cat put together, and at the foot of the fountain our cat turns to him with a paw raised. In play its raised paw glows softly; one tap waves to Riffle and the page turns. Two captions top left; his balloons a shout and a grin.',
      caption: ['The cheer rolls all the way down to the river.', 'A dripping otter scrambles up to the camp’s hedge, louder than every cat put together.'],
      say: [
        { who: 'riffle', text: '{name}{ending}! Best name EVER!', kind: 'shout' },
        { who: 'riffle', text: 'Otters don’t do ceremonies. But otters DO cheer!' }
      ],
      scratch: { tap: 'paw', prompt: '**Tap** to wave to Riffle.', label: 'Wave to Riffle.', next: 'f035' }
    },

    f035: {
      scene: S('camp', 'reveal', CAMP,
        [glint('stand', 'happy'), you('sit', 'happy', { facing: 'left' }), tally('sit', 'happy'), c('riffle', 'puff', 'happy', 'entrance', 'right')], ['night']),
      board: 'WIDE, THE CAMP BY MOONLIGHT, COMEDY BEAT. At the hedge the otter puffs out his cheeks and tries his very best to purr our cat’s name, and only bubbles come out, popping in the moonlight. Our cat and the Clan laugh. Caption top left; his balloon cheerful.',
      caption: ['He tries to purr your name. It sounds like bubbles.'],
      say: [{ who: 'riffle', text: 'See you tomorrow, {name}{ending}!' }],
      next: 'f036'
    },

    f036: {
      scene: S('camp', 'reveal', CAMP,
        [glint('stand', 'happy'), you('sit', 'happy', { facing: 'left' }), tally('sit', 'happy'), c('riffle', 'hop', 'happy', 'entrance', 'left')], ['night']),
      board: 'WIDE, THE CAMP BY MOONLIGHT. The otter hops back out through the hedge and away down the slope toward the river, still cheering, and far off a splash is lettered where he dives in. Our cat watches him go. Two captions top left; the splash lettered small.',
      caption: ['Off he scampers down to the river.', 'Cheering all the way home.'],
      sfx: 'Splash!',
      next: 'f037'
    },

    f037: {
      // Waffles' two paragraphs, two balloons (the spec's)
      scene: S('tower', 'balcony', TOWER_NIGHT, [c('waffles', 'peer', 'shout', 'railing', 'left')], ['night']),
      board: 'MEDIUM, CUTAWAY, NIGHT. Far above the camp the fluffy white cat leans over her balcony railing in the moonlight with her bow askew and one paw cupped to her ear, straining to hear, the little wind chime swaying beside her. Caption top left; her first balloon a shout, her second grand.',
      caption: ['Far above, Princess Waffles hears it too.'],
      say: [
        { who: 'waffles', text: 'WHAT did they call {them}? Speak UP, darlings! Is there a CROWN?', kind: 'shout' },
        { who: 'waffles', text: 'I shall still call {them} {petname}, of course.' }
      ],
      next: 'f038'
    },

    f038: {
      // the moon finds the stone at last: it flashes from here to the end of the watch
      // (no sparkle: the stone's own flash carries it; the art's scatter put one on the old tom's eye)
      scene: S('camp', 'crowd', CAMP, ring({ glint: ['sit', 'kind'], me: ['sit', 'wonder', { flash: true, tap: 'stone' }], tally: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM, THE FOUNTAIN’S FOOT, THE TAP PICTURE. The moon has climbed over the fountain, and its light finds the grey stone at our cat’s paws at last: a band of blue and green flashes across it, and our cat bends close to whisper to it. In play the stone glows softly; one tap holds it up to the moon and the page turns. Two captions top left; its balloon a whisper.',
      caption: ['The moon climbs over the fountain, and its light finds your mist stone at last.', 'It flashes. Blue! Green! Blue again!'],
      say: [{ who: 'player', name: NAMED, text: 'Hello, Sprinkle. It’s me. {name}{ending}.', kind: 'whisper' }],
      scratch: { tap: 'stone', prompt: '**Tap** to hold it up to the moon.', label: 'Hold the stone up.', next: 'f039' }
    },

    /* ------------------------------------------------------------------ The watch */

    f039: {
      // (`sit`, as f015: this camera shows no fountain top under her, and `peer` floated her across the sky)
      scene: S('camp', 'fountain-close', CAMP_NIGHT, [c('glintstar', 'sit', 'kind', 'fountain-top', 'left')], ['night']),
      board: 'LOW ANGLE, CLOSE ON THE FOUNTAIN TOP. Glintstar sits on the fountain top and looks down to speak to our cat alone, quietly, the moon high beside her head; a small inset shows the camp asleep with one small cat sitting up at the fountain. Her balloon low and warm.',
      say: [{ who: 'glintstar', text: 'Welcome, warrior. A warrior named by moonlight keeps watch over the camp till the first light. Tonight, that’s you.' }],
      next: 'f040'
    },

    f040: {
      scene: S('camp', 'crowd', CAMP,
        [glint('sit', 'kind'), chime('sit', 'happy'), you('sit', 'wonder', { flash: true, tap: 'paw' }),
         c('grizzled', 'crouch', 'kind', BY_FOOT, 'right', { holds: 'pinecone', holdAt: 'paws' }), tally('sit', 'kind')], ['night']),
      board: 'MEDIUM, THE FOUNTAIN’S FOOT, THE TAP PICTURE. The old grizzled tom crouches at our cat’s side and sets his precious pinecone down on the grass beside it, very solemn about it; the mist stone flashes at our cat’s paws. In play its front paw glows softly; one tap sits it up, tall and still, and the page turns. Caption top left; his balloon gruff and kind.',
      caption: ['The old tom leaves his pinecone beside you.'],
      say: [{ who: 'grizzled', text: 'For the watch. It never let ME down.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to sit up, tall and still.', label: 'Sit up tall.', next: 'f041' }
    },

    f041: {
      // the ring gone: the Clan asleep at the dens, Tallyheart padding off to hers
      scene: S('camp', 'reveal', CAMP_NIGHT,
        [c('clancat', 'curl', 'sleepy', 'crowd-left', 'right', { variant: 3, asleep: true }), c('clancat', 'curl', 'sleepy', 'crowd-right', 'left', { variant: 1, asleep: true }),
         you('sit', 'proud', { flash: true }), c('tallyheart', 'walk', 'sleepy', 'ferns', 'right')], ['night']),
      board: 'WIDE, THE CAMP BY MOONLIGHT. Den by den the Clan curls up to sleep, and Tallyheart pads off toward the ferns with a huge yawn, glancing back over her shoulder; small at the foot of the fountain our cat sits up very tall, the stone flashing at its paws. Caption top left; her balloon a yawn.',
      caption: ['Den by den, the camp falls asleep.'],
      say: [{ who: 'tallyheart', text: 'If a mouse even sneezes, wake me.' }],
      next: 'f042'
    },

    f042: {
      scene: S('pile', 'wide', PILE_NIGHT, [], ['night']),
      board: 'INSERT, THE PREY PILE BY MOONLIGHT. The prey pile lies whole and tidy in four neat rows under the moon, the dug earth behind it quiet and still, nobody near it at all. Silver light, calm and safe. One caption at the top.',
      caption: ['The prey pile lies whole in the moonlight.'],
      next: 'f043'
    },

    f043: {
      // the watch's thought, one caption by `ch10Best`
      scene: S('camp', 'reveal', CAMP_NIGHT,
        [c('clancat', 'curl', 'sleepy', 'crowd-left', 'right', { variant: 3, asleep: true }), c('clancat', 'curl', 'sleepy', 'crowd-right', 'left', { variant: 1, asleep: true }),
         you('sit', 'dreamy', { flash: true })], ['night', 'stars']),
      board: 'WIDE, THE SLEEPING CAMP. The moon has slid across the sky, and the whole camp sleeps silver and still; at the foot of the fountain one small cat keeps watch, the stone flashing softly at its paws, and a thought bubble holds a picture of the cat it was behind the glass. Three captions in a column.',
      caption: [
        'The moon slides across the sky. Far off, the river shines silver.',
        { when: { ch10Best: 'sprinkle' }, text: 'Somewhere upriver, Sprinkle is asleep in her Mama’s mist.' },
        { when: { ch10Best: 'friends' }, text: 'You think of Riffle, and Sprinkle, and Tallyheart, and {Murmur}chime. Your friends.' },
        { when: { ch10Best: 'truth' }, text: 'You think of the Gathering. Every Clan heard the truth, because you said it.' },
        { when: { ch10Best: 'counts' }, text: 'You count the stars. You lose count. You start again.' },
        'Not long ago, you watched this Clan through the glass. Now you’re keeping it safe.'
      ],
      next: 'f044'
    },

    /* ------------------------------------------------------------------ First light (no moon) */

    f044: {
      scene: S('camp', 'reveal', {},
        [c('clancat', 'curl', 'sleepy', 'crowd-left', 'right', { variant: 3, asleep: true }), c('clancat', 'curl', 'sleepy', 'crowd-right', 'left', { variant: 1, asleep: true }),
         you('sit', 'happy')], ['morning']),
      board: 'WIDE, THE CAMP AT FIRST LIGHT. The sky over the glass towers turns pink, then gold, and the first bird of the morning sings from the brambles; the Clan still sleeps, and at the foot of the fountain our cat is still sitting up, the stone grey again at its paws. Two captions top left; the tweet lettered small.',
      caption: ['The sky turns pink, then gold.', 'The first bird.'],
      sfx: 'Tweet!',
      next: 'f045'
    },

    f045: {
      // (the Clan cat still asleep at her den, as on f044; the one at `crowd-right` is left out: Tallyheart's walk covers it)
      scene: S('camp', 'crowd', {},
        [c('clancat', 'curl', 'sleepy', 'crowd-left', 'right', { variant: 3, asleep: true }), you('sit', 'happy'), c('tallyheart', 'walk', 'proud', PAD, 'left', { tailUp: true })], ['morning']),
      board: 'MEDIUM, THE FOUNTAIN’S FOOT, MORNING, COMEDY BEAT. Tallyheart pads across the still-sleeping camp in the first light with her tail held high, past a Clan cat curled at its den, and our cat answers her very seriously, the stone grey at its paws. Caption top left; three balloons, hers brisk, our cat’s a whisper, hers a proud grunt.',
      caption: ['Tallyheart pads across the camp, her tail high.'],
      say: [
        { who: 'tallyheart', text: 'Any sneezes?' },
        { who: 'player', name: NAMED, text: 'Not one. One moth. I let it go.', kind: 'whisper' },
        { who: 'tallyheart', text: 'Hmph.' }
      ],
      next: 'f046'
    },

    f046: {
      // her first morning count: the frame's “Good morning”, then the fact's own question (`intro: false`)
      scene: S('pile', 'rows', PILE_DAY,
        [c('tallyheart', 'sit', 'happy', 'crowd-3', 'left'), c('player', 'sit', 'happy', 'beside', 'left', { holds: 'miststone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE, THE PREY PILE AT FIRST LIGHT, THEN THE COUNTS. The whole pile lies in four rows of ten in the pink morning light, and Tallyheart sits by it and greets our cat by its new name, slowly, as if she likes the sound of it. In the Counts picture the pile’s four rows of ten mice and voles, unlit; after a miss she lights them a row at a time, ten, twenty, thirty, forty. Her balloon warm; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Good morning, {name}{ending}.' }],
      counts: { set: 'ch11-pile', intro: false, next: 'f047' }
    },

    f047: {
      // the thanks, a light choice: both to the next screen, nothing set
      scene: S('pile', 'rows', PILE_DAY,
        [c('tallyheart', 'sit', 'kind', 'crowd-3', 'left'), c('player', 'sit', 'kind', 'beside', 'left', { holds: 'miststone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE, THE PREY PILE AT FIRST LIGHT, THE CHOICE. Tallyheart looks at our cat for a long moment with her torn ear tipped toward it, and a small inset shows the fountain on the morning of the tortoiseshell warrior’s Counts, a little apprentice watching. Her balloon soft and proud; the choices sit below the panel.',
      say: [{ who: 'tallyheart', text: 'At {Murmur}chime’s Counts, I said, ‘One day, that’ll be you.’ I was right. I’m proud of you. And I’m still right here.' }],
      choice: {
        options: [
          { label: '“Thank you, Tallyheart.”', sets: {}, next: 'f048' },
          { label: '“You counted with me. Every time.”', sets: {}, next: 'f048' }
        ]
      }
    },

    f048: {
      // the pinecone in the stone's place: she holds one thing at a time
      scene: S('pile', 'rows', PILE_DAY,
        [c('tallyheart', 'sit', 'happy', 'crowd-3', 'left'), c('player', 'sit', 'happy', 'beside', 'left', { holds: 'pinecone', holdAt: 'paws', tap: 'pinecone' }),
         c('grizzled', 'sit', 'happy', 'pile-left', 'right')], ['morning']),
      board: 'WIDE, THE PREY PILE AT FIRST LIGHT, THE TAP PICTURE, COMEDY BEAT. Tallyheart purrs, and the old grizzled tom ambles up to the pile all smiles, very wise all of a sudden, eyeing the pinecone at our cat’s paws. In play the pinecone glows softly; one tap gives it back and the page turns. Caption top left; three balloons, his, our cat’s, his sheepish.',
      caption: ['Tallyheart purrs.'],
      say: [
        { who: 'grizzled', text: 'Morning, warrior. I always said you’d make a fine one.' },
        { who: 'player', name: NAMED, text: 'When?' },
        // (a word joiner after the ellipsis, so it never stands alone at a line's end)
        { who: 'grizzled', text: '…\u2060Just now. Can I have my pinecone back?' }
      ],
      scratch: { tap: 'pinecone', prompt: '**Tap** to give it back.', label: 'Give the pinecone back.', next: 'f049' }
    },

    f049: {
      // her warrior's nest: the den's nest close-up with the next nest at its left edge ({Murmur}chime's, the spot
      // `next-nest`); her two paragraphs, two balloons (the spec's)
      scene: S('den', 'nest', DENW,
        // our cat sits up holding the stone in both forepaws, chapter 10's f152 (at her paws it met Riffle's stone for a
        // `ch2Stone: 'chin'` cat)
        [c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right'), c('player', 'situp', 'happy', 'nest', 'left', { holds: 'miststone', tap: 'stone' })], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, MORNING, THE TAP PICTURE. Our cat sits up in its new nest, soft and deep, holding the grey stone in both forepaws; its bark, its glass and its stones lie round the moss, and in the next nest at the edge of the panel the tortoiseshell warrior lies with her chin on her paws, yawning. In play the grey stone glows softly; one tap lays it on the moss and the page turns. Caption top left; her two balloons sleepy.',
      caption: ['Your new nest is with the warriors now, soft and deep.'],
      say: [
        { who: 'murmurchime', text: 'I saved you the one next to MINE.' },
        { who: 'murmurchime', text: 'The grey tom carried your things. He only dropped Riffle’s stone TWICE.' }
      ],
      scratch: { tap: 'stone', prompt: '**Tap** to lay your mist stone down.', label: 'Lay the stone on the moss.', next: 'f050' }
    },

    f050: {
      scene: S('den', 'outside', { weather: 'clear' }, [c('snorer', 'peer', 'sleepy', 'doorway', 'left')], ['morning']),
      board: 'WIDE, OUTSIDE THE APPRENTICES’ ROSEBUSH, MORNING. Across the camp the grey apprentice pokes his head out of the rosebush doorway, one eye still shut and his fur standing up on one side, and calls across in a hopeful croak. Caption top left; his balloon sleepy.',
      caption: ['Across the camp, the grey tom pokes his head out of the apprentices’ den.'],
      say: [{ who: 'snorer', text: 'It’s too EARLY. Paw thing?' }],
      next: 'f051'
    },

    f051: {
      scene: S('den', 'nest', DENW_STONE,
        [c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right', { asleep: true }), c('player', 'sit', 'shout', 'nest', 'left')], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, MORNING, COMEDY BEAT. Our cat sits bolt upright in its new nest and shouts the first number across the camp at the top of its voice, and in the next nest the sleeping tortoiseshell warrior’s ear gives a twitch. Its balloon a big shout.',
      say: [{ who: 'player', name: NAMED, text: 'TEN!', kind: 'shout' }],
      next: 'f052'
    },

    f052: {
      // the paw thing by taps, whispered: chapter 4's bedtime tens; its counter tagged with her warrior name
      scene: S('den', 'nest', DENW_STONE,
        [c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right', { asleep: true }), c('player', 'loaf', 'kind', 'nest', 'left')], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, MORNING, THE TAP PICTURE. Our cat settles down in its nest with a guilty glance at the sleeping tortoiseshell warrior and starts again, very softly. In play the counting picture takes the panel: its own two forepaws on the moss, glowing softly together; each tap lights all ten claws and the next number in its whisper, 10, 20, 30, 40, 50, and the fifth tap turns the page. Caption top left.',
      caption: ['{Murmur}chime’s ear twitches. You start again, in a whisper.'],
      skip: { table: 10, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', name: '{name}{ending}', next: 'f053' }
    },

    f053: {
      // the 50 the paw thing reached, big over the panel (no `carry: false`: chapter 4's f119)
      scene: S('den', 'nest', DENW_STONE,
        [c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right', { asleep: true }), c('player', 'loaf', 'happy', 'nest', 'left')], ['morning', 'zzz']),
      board: 'CLOSE-UP, THE NEW NEST, MORNING. A big 50 floats over the moss, and in the next nest the tortoiseshell warrior has dozed right off again, chin on her paws, mumbling in her sleep, a little zzz rising from her; far off across the camp the grey apprentice snores too. Two captions top left; her balloon a sleepy mumble.',
      caption: ['By fifty, the grey tom’s snoring.', 'In the next nest, {Murmur}chime has dozed off again.'],
      say: [{ who: 'murmurchime', text: 'Mice…', kind: 'whisper' }],
      next: 'f054'
    },

    f054: {
      // her stone by her nose or under her chin (`ch2Stone`), as the den's `stone: 'auto'` draws it
      scene: S('den', 'nest', DENW_STONE,
        [c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right', { asleep: true }), c('player', 'curl', 'kind', 'nest', 'left')], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, MORNING. Our cat curls up tight in its new nest beside the tortoiseshell warrior’s, the grey mist stone on the moss, its bark and its glass tucked in, and Riffle’s nearly black stone where it always lies. Three captions in a column.',
      caption: [
        'Some things never change.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' },
        'You curl up tight in a warrior’s nest, for the very first time.'
      ],
      next: 'f055'
    },

    f055: {
      scene: S('den', 'nest', DENW_STONE,
        [c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right', { asleep: true }), c('player', 'curl', 'kind', 'nest', 'left', { asleep: true })], ['morning']),
      board: 'CLOSE-UP, THE NEW NEST, MORNING. Our cat’s eyes close, a small smile on its face, warm and safe in its warrior’s nest beside its friend’s, the morning light soft on the moss. Two captions, top left and at the bottom.',
      caption: ['You’re {name}{ending}, a warrior of CrystalClan. And you’re home.', 'You close your eyes, warm and safe, and sleep.'],
      next: 'f056'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f056: {
      scene: S('den', 'nest', DENW_STONE,
        [c('player', 'curl', 'sleepy', 'nest', 'left', { asleep: true }), c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right', { asleep: true })], ['morning', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in its new nest beside the sleeping tortoiseshell warrior, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled; little sparkles round our cat. Soft morning light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}{ending} dream, in a warrior’s nest?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A name… a moon… a pinecone…', next: 'f057' }
    },

    f057: {
      // the stone close-up: the stone grey by day, waiting for tonight's moon, her sleeping tail's tip at the bottom (the
      // story's last screen in two panels, so its four boxes never run Back and Next under a 1080 x 720 iPad's screen)
      scene: S('den', 'stone', DENM_STONE,
        [c('player', 'curl', 'sleepy', 'tail', 'left', { asleep: true })], ['morning']),
      board: 'EXTREME CLOSE-UP, THE MOSS AT THE NEST’S EDGE. The plain grey mist stone lies big on the soft moss of the new nest in the quiet morning light, waiting for tonight’s moon, the corner of a curl of bark beside it and the tip of a sleeping tail at the bottom. Two captions at the bottom.',
      caption: ['{name}{ending} sleeps.', 'Beside {them}, the mist stone waits for tonight’s moon, to say hello again.'],
      next: 'f058'
    },

    f058: {
      // the closing frame: the two warriors asleep in their nests, side by side
      scene: S('den', 'nest', DENW_STONE,
        [c('player', 'curl', 'sleepy', 'nest', 'left', { asleep: true }), c('murmurchime', 'lie', 'sleepy', 'next-nest', 'right', { asleep: true })], ['morning', 'sparkle']),
      board: 'CLOSE-UP, THE NEW NEST, CLOSING SHOT. The two warriors sleep in their nests side by side in the soft morning light, our cat curled up tight and its friend stretched out with her chin on her paws, the grey stone on the moss beside our cat, little sparkles drifting round the new warrior. Captions at the bottom, with END OF CHAPTER ELEVEN and THE END lettered like titles.',
      caption: ['End of Chapter Eleven. {name}{ending}, warrior of CrystalClan.', 'THE END.'],
      end: true
    }
  };

  /* The chapter's one question (the spec's section 2): her first morning count, Tallyheart teaching, the pile in
   * rows; the frame says “Good morning” and the fact's own prompt is her question, kept for the retry; no fillers. */
  function T(text) { return { who: 'tallyheart', text: text }; }
  var ROWS = 'Let’s count it, a row at a time.';

  PC.story.ch11 = {
    id: 'ch11',
    number: 11,
    title: 'The Warrior Ceremony',
    // the Warrior Counts open it once she has passed (E.isOpen)
    opensWhen: 'warrior',
    start: 'f001',

    // No card: her Case File stays as chapter 10 left it.
    cards: {},

    frames: frames,

    counts: {
      'ch11-pile': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart', ask: '{a} × {b}',
        picture: { kind: 'prey', layout: 'rows' }, help: 'picture',
        facts: [{ a: 4, b: 10,
          prompt: [T('Your first morning count as a warrior. How many pieces in the pile?')], retryPrompt: true,
          right: [{ kind: 'caption', text: 'Forty. Not one piece gone.' }], rightAgain: true }],
        praise: [], helpIntro: ROWS, helpIntroFar: ROWS, againIntro: 'The rows again.', miss: 'There.', missLast: 'Forty. All there.',
        done: null
      }
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'The Warrior Ceremony',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}{ending}’s dream: “{dream}”',
      noDream: '{name}{ending}’s first dream in a warrior’s nest stayed a secret.',
      // Seven entries on every reading, one sentence each, each true on every path (the forty with or without help)
      recap: [
        { text: 'On the evening {name}paw passed {their} Warrior Counts, all of CrystalClan gathered in camp under the moon.' },
        { text: 'Tallyheart sat right beside {them}, and {Murmur}chime sat in the front row, as she promised.' },
        { text: 'Glintstar told the Clan what {name}paw did this moon, and every cat promised to stand by {them}.' },
        { when: { ch11Named: 'offer' }, text: 'Glintstar saw three names in {name}paw, and {they} chose {name}{ending}.' },
        { when: { ch11Named: 'self' }, text: 'Glintstar saw three names in {name}paw, but {they} named {them}self {name}{ending}.' },
        { text: 'The whole Clan called the new name, Riffle cheered it from the hedge, and under the moon the mist stone flashed: hello from Sprinkle.' },
        { text: '{name}{ending} kept watch over the sleeping camp till the first light, then counted the pile: forty, not one piece gone.' },
        { text: 'Then {they} slept in a warrior’s nest for the very first time, right beside {Murmur}chime’s.' }
      ]
    },

    // module 2's hook, on the hub once the chapter is finished (“A new adventure is coming soon”)
    teaser: {
      title: 'A new adventure',
      lines: ['Out on Gathering Island, an old badger track lies in the mud. Who made it? Another day.']
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
