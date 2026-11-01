# Chapter 11 spec: The Warrior Ceremony

*v0.3 · 2026-11-01 (v0.1 2026-10-31; v0.2 applies the spec critics' findings: `~/potomac-crossing-work/ch11/spec-editor-r1/notes.md`;
v0.3 records the build as made: the story builder's five departures and the review's round, section 7, items 16 and 17; the
final review's round, 2026-11-01, as built in section 5)*

*The build's contract for chapter 11, beside `docs/build.md`. The story, [`11-the-warrior-ceremony.md`](11-the-warrior-ceremony.md)
(Draft v0.4, final), is the source of every word she reads. This spec adds no line she reads except the instruction lines under a
panel (each Tap's `prompt` is the story's own **Tap** line; a `label` is the hidden button's words), the Type screen's prompt (the
story's **Type** line) and its button, the book page and the teaser's title, which it proposes. Where the story's italic notes and
this spec differ, the spec is the build's (section 7, item 2). Names in `code` are fixed: the engine, the art, the storyboard words
and the story builder use exactly these.*

*Run, not guessed. The Counts pieces were run on the live engine (main at `2dee6a4`, `E.VERSION` '0.10.0 (chapter 10,
2026-10-31)') on a mock chapter 11, `~/potomac-crossing-work/ch11/spec-writer/sets.js` (`E.checkStory` clean), by `sim1.js` (the
morning count to four misses, every pattern; both skips, tap by tap; output `sim1.txt`, whose `readFirst? false` came from a wrong
call: `E.readFirst({ set: 'ch11-pile', a: 4, b: 10, correct: true }, stories)` is true, rerun by the counts critic,
`spec-critic-counts-r1/sim.txt`). The warrior name's rules (section 6) were run on a scratch model, `wname.js` (output `wname.txt`):
it agrees with all 43 skips the names critic recorded (`critic-names-tone-r2/offers.txt`), and with every refusal the story names;
the warrior-name critic ran them again over the live engine (`critic-wname-r1/run.txt`, `triple.txt`: the triple-letter rule of
section 6). The art this spec reuses was rendered with
`tools/frames.mjs` and checked tap by tap (`looks/`). The stub of section 10 was run on a scratch copy of the tree: 1,687 tests, two
failures, both named there; with the two test edits it gives, 1,687 of 1,687 (`stub-suite.txt`, `stub-suite-fixed.txt`,
`stub-step.patch`). Detail: `~/potomac-crossing-work/ch11/spec-writer/notes.md`.*

*The tree it is built on* (the orchestrator's): **main at `2dee6a4`**, chapters 1 to 10 live with the Warrior Counts, `CACHE` v21
(the last entry of `tests/fixtures/sw-shipped.json`). The Ceremony is the chapter the Warrior Counts already expect:
`PC.story.ch11` with `opensWhen: 'warrior'`, which `E.isOpen` opens once she has passed (section 6, "Where chapter 11 meets the
Warrior Counts").

**In one line: the build is the warrior name (one new input, its data and where the name shows) and the camp by moonlight (one new
option on the `camp` set, and the kit's moon past full), with the warriors' next nest (one new option on the `den`). No new set, no
new cast, no new pose, no card, no new Count.**

---

## 1. Flags

**One new flag, `ch11Named`, and one new optional save field, `ending`** (her warrior ending; section 6). `ending` is not a flag:
it is her name's second half, beside `name` and `petname`.

| Flag | Values | Set where | Reread | Read by |
|---|---|---|---|---|
| `ch11Named` | `offer`, `self` | the name choice ("“Pick one,” says Glintstar."): each offered name's option `sets: { ch11Named: 'offer' }`; `self` by the Type screen when an ending she typed is **accepted** (`input: { kind: 'ending', sets: { ch11Named: 'self' }, … }`), never by “I’ll name myself!” itself (`sets: {}`), so backing out of the Type screen leaves the flag true to the name she has | replaced (Back to the choice and another pick, or a reread) | this chapter: "From tonight" (Glintstar's “Your very own. I like it.” with `self`; Tallyheart's “A name with this moon in it” with `offer`); the book's naming line; the grown-ups corner's "What the choices say" |

- **`ending`** (the field) is set by an offered name's option (`ending: 'mist'` on the option) or by the Type screen (`input.kind:
  'ending'`), and read by the token `{ending}`, by E.matches as her own field (`when: { ending: ['heart', 'hearts'] }`, the four
  "From tonight" lines for heart, chime, leaf and pinecone, each with its plural), and by every place that shows her name from then
  on (section 6).
- **Why a flag** (section 9, call 19): the brief allowed none but her name, and `ch11Named` is part of it. How she was named cannot
  be computed, since an ending she types may equal an offered word.
- **The light choices set nothing** (`sets: {}`, both options to the same next frame): the vow (“I will.” / “I PROMISE!”) and the
  thanks (“Thank you, Tallyheart.” / “You counted with me. Every time.”).
- **Read from earlier chapters**: `ch10Best` (through `offer`: Glintstar's first name and its reason; and directly, `when: {
  ch10Best }`, the watch's four thoughts), `specialty` (through `offer`: the second name and its reason), `worry` (four captions in
  the ring), `ch2Stone` (`nose`, `chin`: one caption at bedtime; and the den's `stone: 'auto'`). Nothing else: no pick flag (they
  are chapter 10's only), no found flag (every dragonet is history: the brief's call 10), no `ch3Told`.
- **Two computed conditions** (section 6): `offer` (one of the three names Glintstar offers this cat) and `nameHas` (her first
  part has that word in it). Like `lessonClean` and `firstTry`, they are E.matches keys; nothing stores them.
- **Grown-ups corner** (`PC.ui.flagWords`): `ch11Named: { offer: 'took one of the three names Glintstar saw in {them}', self:
  'named {them}self' }`. The corner gains no row of its own: its heading is E.displayName, her warrior name once she has one
  (section 6).

## 2. Counts sets

**One typed answer on every reading** (4 × 10, her first morning count) **and two counts by taps** (the ears, 8 × 2; the paw
thing, 5 × 10). No lesson, no warm-up, no new Count: the brief's lesson kit. Every key below is one the engine has.

### Every fact, in the order she meets it

| # | Where | Fact | How | Picture |
|---|---|---|---|---|
| – | The ring, “**Tap** the cats.” | 8 × 2 (16) | a skip, eight taps, nothing typed | chapter 2's ears picture: eight cats, {Murmur}chime the fourth |
| 1 | First light, the morning count | 4 × 10 (40) | typed (`ch11-pile`) | the pile in rows, four rows of ten (chapters 4 to 8's rows picture) |
| – | First light, the paw thing | 5 × 10 (50) | a skip, five taps, nothing typed | her two forepaws, ten claws a tap (chapter 4's bedtime tens) |

### `ch11-pile`, the morning count (one question; Counts frame `intro: false`)

```js
function T(text) { return { who: 'tallyheart', text: text }; }
var ROWS = 'Let’s count it, a row at a time.';
'ch11-pile': {
  table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart', ask: '{a} × {b}',
  picture: { kind: 'prey', layout: 'rows' }, help: 'picture',
  facts: [{ a: 4, b: 10,
    prompt: [T('Your first morning count as a warrior. How many pieces in the pile?')], retryPrompt: true,
    right: [{ kind: 'caption', text: 'Forty. Not one piece gone.' }], rightAgain: true }],
  praise: [], helpIntro: ROWS, helpIntroFar: ROWS, againIntro: 'The rows again.', miss: 'There.', missLast: 'Forty. All there.',
  done: null
}
```

- **The words** (run): the Counts frame says Tallyheart's “Good morning, {name}{ending}.” and is not said again over the question
  (`intro: false`); the question is her own sentence, the fact's `prompt` (“Your first morning count as a warrior. How many pieces
  in the pile?”), so the screen reads her two lines once each, as the story writes them, and `4 × 10 = ?`. Read under its own
  prompt, it is never timed (`E.readFirst({ set: 'ch11-pile', a: 4, b: 10, correct: true }, stories)` is true, run), so a right
  answer, quick or slow, never makes it hard; a miss does, as every story question's does (E.hardFacts: the Hollow's 10s and 4s; a
  re-sit's E.warriorHard; run, `spec-critic-counts-r1/sim.txt`).
- **Right** (run, quick or slow): the caption “Forty. Not one piece gone.”; no praise, no fast line (`praise: []`, no `fast`).
- **A miss** (run): the rows light a row at a time as Tallyheart counts, 10 · 20 · 30 · 40 (`help: 'picture'`: the plan's
  `picture` and `byRow`, counter Tallyheart), her “Let’s count it, a row at a time.”, then “There.”; the same question comes
  straight back (no fillers: one fact, nothing to lend), “The rows again.” and her question again (`againIntro`, `retryPrompt`).
  **Every pattern** (run, four): right; one miss then right; two misses then right (each right retry gets “Forty. Not one piece
  gone.”, `rightAgain`); three misses, and the third gets the help and “Forty. All there.” and the lesson ends (`E.MAX_REQUEUE`
  two retries). Never a wall; no clock.
- **Picture**: four rows of ten mice and voles, unlit (`kind: 'prey', layout: 'rows'`, `groups: 4`, `per: 10`, run); a right answer
  lights them all (the page's rule).
- **Not a Count**: `E.countSets` is unchanged (the 10s stay `ch04-tens`), and so are `E.hollowDef(…, 10)` and the Hollow (run, both
  compared with and without the set). Her answer is filed under table 10 (`E.tableOf`).

### The taps that count (skip)

- **The ears** (“Me? Never. Let’s count something.” … “Eight cats, right in front of us. Ears, by twos.”): `skip: { table: 2,
  groups: 8, who: EIGHT, teacher: 'tallyheart', label: 'Count the next cat.', prompt: '**Tap** the cats.', carry: false, next }`,
  where `EIGHT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }, { who:
  'murmurchime' }, { who: 'clancat', variant: 4 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }, { who: 'snorter' }]` (the
  old tom, in the ring tonight, and chapter 1's cheeky black-and-white apprentice: **five** Clan coats, never six, so a player whose
  fur is a Clan coat always has the sixth to swap to (cats.js `clanVariant` with `whoSpec`'s `taken`: with all six in the picture
  there is no free spare, and 6 of the 9 furs saw one coat twice). No coat twice for any fur; the story builder renders the picture
  with a brown-tabby look to confirm. Run (with six variants; the count is the same): eight cats in rows of five and three,
  {Murmur}chime fourth, the next glowing; each tap lights a cat's two ears, the totals 2 … 16 under them, the count in **Tallyheart's**
  balloon (`E.skipWords` teacher `tallyheart`: without it the screen's first speaker, our cat, would count; the leftover critic's
  finding), a plain balloon, not a whisper; the eighth tap turns the page; `carry: false` (the page it turns to says “Sixteen!”).
  The skip draws its counting picture in place of the scene, so no other ears are in the panel (the story's note).
- **The paw thing** (“{Murmur}chime’s ear twitches. You start again, in a whisper.”): `skip: { table: 10, groups: 5, thing: 'claw',
  things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', next }`, chapter 4's bedtime tens exactly. Run: her own two
  forepaws on the moss, the count hers and **whispered** (`E.skipWords`: teacher `player`, `whisper: true`), 10 … 50; the fifth tap
  turns the page; label “Tap your forepaws.” (the engine's for `paws: 'both'`). No `carry: false`, so the page it turns to (f053)
  shows the 50 she reached, big, as chapter 4's f119 does (`E.skipReached(E.skipInto(ch11, 'f053'))` is 50, run). Its counter's
  name tag is her warrior name (`name: '{name}{ending}'` on the skip, section 6: the frame has no balloon of hers to take it from).

## 3. The Case File

**No card**, given or shown. Her file stays as chapter 10 left it (20 to 30 cards). Not cards, on purpose: the ears, the names, the
vow, the watch, the pile's forty, the badger's track. The Case File's button stays on the bar and the hub; its title stays
“{name}paw’s Case File” (the apprentice's case; section 6).

## 4. Art needs

**New: one option on the `camp` set, `moon`, with the camp's moonlight; the kit's moon past full; the den's `moon` list gains 15;
one option on the `den`, `nextNest` (the warriors' next nest). Nothing else is new.** Every cast member, pose, mood, extra, hold, Tap target and Counts picture below is drawn already (each Tap
target rendered on main: `pc-tap-ears`, `-paw`, `-stone`, `-tail`, `-nose`, `-pinecone`, on our cat with the holds below). Every
new option is off by default, so chapters 1 to 10 and the Warrior Counts draw byte for byte (section 7, item 3). **Never dark**: the
camp by night is moonlit and silver (the brief's call 2). Times of day: `night` from the first panel to the watch's end; `morning`
from first light to the end (she sleeps the day after her watch).

### Places (all drawn already)

| Set | Cameras the chapter uses | Options | New |
|---|---|---|---|
| `camp` (`scenes.js`) | `reveal`, `crowd`, `purr`, `fountain-close` (night); `reveal`, `crowd` (morning) | `crowd: true` (the ring) or off (the camp asleep, first light); **`moon: 15`** on every night frame | **option `moon`** (below) |
| `den` (`scenes.js`) | `inside`, `nest` (night: the apprentices' den, the opening); `nest`, `outside`, `stone` (morning) | `{ weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true }`, with **`moon: 15`** at night, `miststone: true` where the stone lies on the moss, and **`nextNest: true`** on her warrior's nest (morning, `nest`) | **`moon` list gains 15; option `nextNest`** |
| `pile` (`sets/pile.js`) | `wide` (night), `rows` (morning) | `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }`, with `moon: 15` at night (the pile's `moon` is a number, its age clamped to 15: `moonAge`) | nothing (the kit draws 15) |
| `tower` (`scenes.js`) | `balcony` (night: drawn and checked, `looks/tower-balcony-night.png`) | `{ chime: true }` (`light` is drawn on `up` only) | nothing |

#### The camp by moonlight (`scenes.js`, the `camp` set)

- **Option `moon`** (`'number'`, the moon's age in evenings, as the pile's, the field's and the tower's; default off): **the moon is
  drawn when `moon` is set and the light is `night` or `dusk`**, by its age in the camp's sky (`kit.waxingMoon`), **whole and
  visible on `reveal`, `crowd`, `purr`, `fountain` and `fountain-close`**. Its box goes in `S.keep`, so no lettering sits on it.
  The story's moon “comes up”, “climbs over the fountain” and “slides across the sky”: the words carry the climb; the art draws
  one moon per camera by its age.
  - **The main composition has no room for it as drawn**: right of the fountain, `drawCampWide`'s towers stand at x 880–1030 (top
    250), 1050–1160 (top 320), 1170–1310 (top 180) and 1290–1440 (top 110), and `crowd`'s box is x 240–1360, y 280–980, so a moon
    whole inside it could be no bigger than r 18. **While the moon is drawn (and only then), the tower `{ x: 1050, w: 110, top: 320
    }` is drawn lower (top 420 or more, behind the tree ring) or left out, and the moon sits in that gap at about (1100, 345), r
    about 34**: whole inside `crowd`'s box, clear of the towers at 880–1030 and 1170–1310, of a cat on `fountain-top` and of the
    caption corner at the top left, and close to the light rays' apex, so they read as moonbeams. The scenes owner settles the spot
    with `tools/frames.mjs` on `reveal`, `crowd` and `purr`.
  - **The fountain composition**: high beside the fountain-top cat's head, never behind her face, and whole inside `fountain-close`.
- **The moonlight** (while the moon is drawn): the camp moonlit and **silver, never dark**, by **the moon, its glow, and at most one
  screen-blend silver wash from the moon's side**, all drawn inside `drawCampWide` and `drawCampFountain` under the moon's own
  condition. **No change to `fernClump`, `bramble`, `stonePath`, `denMound`, `crowdCats`, `castTint` or `CAST_TINT`**: they are
  shared painters (the camp's and the sets'), and the cast and the crowd keep `CAST_TINT.night`, which already tints every night
  cast. The light rays between the towers stay as they are. **Acceptance**: the camp at night with `moon: 15` is no darker than
  without it (its mean luminance, on `reveal`, `crowd` and `fountain-close`), and reads silver in the look (the camp at night today
  is readable but dark blue: `looks/camp-reveal.png`).
- **Off** (no `moon`): every camp frame of chapters 1 to 10 and of the Warrior Counts draws byte for byte, the tower included.
  `entrance` and `herbs` draw nothing new (no night frame uses them).

#### The moon past full (`scenes.js`, `kit.waxingMoon`)

- **Ages 15 to 27 draw the waning moon**: the shape of age 28 − age turned half a turn (its lit side on the left), the same glow;
  `data-prop="waxing-moon"` and `data-age` as now (so every finder still finds it). Age 15, the chapter's, is nearly round, lit on
  the left: the mirror of the thirteenth evening's. Every age up to 14, and 28 or more, draws byte for byte as today (no shipped
  frame and no gallery sample passes an age past 14; `tests/scenes.test.js`'s "never more than full" check at 30 stands), and the
  scenes owner's chapter-11 fingerprint pins the kit's output for ages 1 to 14 and 28 to 30 (section 7, item 3): every set's
  moon (the den, tower, pile, field, tracks, ferry, riverbank and island) goes through it. The placing functions (the den's, the
  pile's, the field's, the tracks') clamp the place at 14, so 15 sits where the full moon sat; **the pile's, the field's and the
  tracks' `moonAge` also clamp the age to 15**, so there 16 to 27 draw as 15 (section 8).
- **Why 15** (section 9, call 10): the brief's “the moon is up (not full: it waned since the Gathering)”; the Ceremony may be the
  next evening or weeks later, and the words never say its shape; one evening past full is true on the likeliest night and never
  wrong to the eye.

#### The den

- **`moon` gains 15** (`[false, true, 5, 8, 13, 14, 15]`): the waning moon from outside and in the doorway's patch of sky
  (`denMoonAged` takes any age from 8 already; render checked). Used by the opening's `inside` frames.
- **The new nest is the `nest` close-up**, never `inside`: her nest close, with everything from her old one (bark along the edge
  and the corners under the moss, `bark: 'auto'`, `hidden: true`; her glass, `glass: true`; Riffle's stone, `stone: 'auto'`; the mist
  stone once laid, `miststone: true`, grey by day), and {Murmur}chime lying in **the next nest**, at the picture's left edge. The
  den's `inside` is the apprentices' rosebush: {Murmur}chime in its middle nest would read as her back with the apprentices (section
  9, call 11).
- **Option `nextNest`** (`true` or off, default off; the `inside` composition, for the `nest` close-up), **new**: the `nest` camera
  is 400 wide, and our cat at `nest` with {Murmur}chime at a raw spot inside it cannot be apart (v0.1's `NEXT` put her tail on
  {Murmur}chime's cheek and {Murmur}chime on her moss: `critic-continuity-r1/looks/nest-f049.png`). With the option on: a second,
  plain moss ring (no bark, no stones) at the close-up's left edge, partly cropped, with its own front-rim cover and a spot of its
  own, **`next-nest`** (facing right, `{ x: 880, y: 905, h: 210 }` as built), for the cat lying in it; and her own nest, its `nest`
  spot and everything on it (bark, glass, both stones, the rim's cover) moved about 60 to the right, so the two cats never touch.
  It sets its spots in the drawing, as the den's own `stone` close-up (scenes.js 2593) and the hollow's `heap` (2046) do (`S.spots`,
  read spot by spot, then `S.anchorMap = anchorsFor(S)`), so her stone, bark and mist stone still find the cat at `nest` and the
  rims still cover their cats. The scenes owner settles the numbers with
  `tools/frames.mjs`: a cat at `nest` (`loaf`, `crouch`, `sit`, `curl`, `asleep`, facing either way) and one at `next-nest` (`lie`,
  `curl`, `asleep`) never meet. Off, every den frame draws byte for byte. Chapter 11 uses it only on the `nest` camera (on `inside`
  the second ring would sit against `sleeper-2`'s).
- `outside` by morning (the grey tom's head at `doorway`, `peer`), and `stone` by morning (the last frame: the stone grey, not
  `'flash'`; rendered, `looks/den-stone-morning.png`) are drawn as they are.

### Cast (no new cast, no new pose)

Every cat side-on, facing left or right. **No two cats touch** (continuity's rule): the builder checks the close ones (the ring's
front row, the two cats at `nest` and `next-nest`, the old tom setting his pinecone down, Thymeleaf at `THYME` beside the cats at
`crowd-right`). No grown cat in `laugh`.

- **Our cat**: `holds: 'miststone'` with `holdAt` (`'paws'` on the ground at her toes; `'chin'` sitting, “tucked under her chin”; in
  her mouth by default when she walks or stands) and `flash: true` once the moon finds it; `tap: 'ears'`, `'stone'` (on the held
  stone), `'paw'`, `'tail'` (with `tailUp`), `'nose'` (`crouch`), `'pinecone'` (holding the old tom's); poses `sit`, `walk`, `stand`,
  `crouch`, `situp`, `pawup`, `lookup`, `loaf`, `curl` (`asleep: true` at the end). All rendered on main.
- **Tallyheart**: `peer` at the den's doorway, `walk`, `sit`, `tailUp` (first light), moods `kind`, `happy`, `proud`, `sleepy`.
- **Glintstar**: `stand`, `sit`, `peer` (looking down) at `fountain-top`; `kind`, `solemn`, `proud`, `shout`.
- **{Murmur}chime** (`murmurchime`): `sit` at `crowd-right` (the front row), `shout` (her yowl), `tailUp`; `lie` in the next nest,
  awake on f049, `asleep` from f051 (as built in the final round: `curl` `asleep` made her a tortie player's twin).
- **The old tom** (`grizzled`): `holds: 'pinecone'` (`holdAt: 'paws'`; `crouch` to set it down beside her), `shout` (“Or
  {name}PINECONE!”, “I KNEW it!”).
- **The grey tom** (`snorer`): `sit` up in his nest (`sleeper-1`, the opening); `peer` at the apprentices' den's doorway (first light).
- **Thymeleaf**: `sit` by the ferns at the ring's edge (`ferns` on `reveal`; the raw spot `THYME` on `crowd`), `kind`.
- **Riffle**: `scramble` at the camp's hedge (`entrance` on `reveal`), `shout`; `puff` (purring bubbles); `hop` (off home). No `wet`
  (an extra Riffle lacks): the caption says “dripping”.
- **Princess Waffles**: `peer`, `shout`, at `railing` on `tower`/`balcony` by night (chapter 3's f026, by night).
- **Clan cats** (`clancat`): two or three padding to the clearing (`walk`) or asleep at their dens (`curl`, `asleep: true`); and one
  named in the cast on the two frames where every cat calls out (“WE WILL!”, the name), so the balloon's speaker is in the picture.

### Counts art (nothing new)

The ears picture with `who` (chapter 2's table-2 picture; `murmurchime`, `grizzled` and `snorter` draw as their presets: `looks/ears8.svg.png`
was drawn with v0.1's six Clan coats, section 2),
the pile's rows (`kind: 'prey', layout: 'rows'`, four rows of ten, lit a row at a time by the help: `looks/pile40.svg.png`), her
two forepaws (`paws: 'both'`).

### Heard, not seen

*Boing.* (her ears), *Splash!* (Riffle, off at the river), *Tweet!* (the first bird): each the frame's `sfx`, lettered, never read
(no `sfxRead`: each caption beside it ends a sentence). The frog is cut (v0.3). The purr is the `purr` effect.

## 5. Build notes

General rules for the story builder, then the chapter frame by frame. Chapter 10's file (`app/story/ch10.js`) is the model: its
helpers (`c`, `S`, `merge`), frame ids in reading order, a `board` on every frame. Chapter 11 opens on a screen every path reads,
the start (no title panel, no `when`).

- **The chapter**: `PC.story.ch11 = { id: 'ch11', number: 11, title: 'The Warrior Ceremony', opensWhen: 'warrior', start: 'f001',
  frames, counts: { 'ch11-pile': … }, cards: {}, book, teaser }`. Its script tag after `ch10.js` and before `warrior.js`
  (section 10).
- **Captions first, then balloons** (chapter 5's rule): where the story puts narration after a balloon on one screen, the screen is
  split into two frames, or the narration opens the next frame. The splits are in the frame list below; the words never change.
- **No panel holds five boxes**; **a speaker's lines on a panel are one balloon** where the story writes them so, and two balloons
  in a row where the story gives a speaker two paragraphs in a row (Glintstar f012, f015, f016, f019, f020, f021; Riffle f034;
  Waffles f037; {Murmur}chime f049). A speaker with a line only some cats read beside a line every cat reads is one balloon written
  twice by `when` (chapter 9's rule: Glintstar's name on f026).
- **Speech tags' narration is not lettered** (the picture carries it): “says Glintstar, with a tiny smile”, “says Tallyheart,
  slowly, as if she likes the sound of it”, “and his leaves rustle”, “just to you”, “yawns”, “squeaks”. A quote the story splits
  round its tag is one balloon, its comma a full stop where the quote resumes with a new sentence.
- **Long captions** (at most 95 characters a box; split at a sentence break, the words unchanged): “The moon comes up over camp.” /
  “The dens, the ferns, the old stone fountain: everything is silver.”; “{name}{ending} sleeps.” / “Beside {them}, the mist stone
  waits for tonight’s moon, to say hello again.”; and the one with no sentence break, split at its comma, the second box running on:
  “One by one, the cats begin to purr, all round the ring,” / “until the whole camp is humming your new name.”
- **Speakers**: every balloon's speaker is in the frame's cast. **Our cat's balloons after the naming carry `name:
  '{name}{ending}'`** (f028, f038, f045, f048, f051), **and so does the paw thing's whispered counter on f052** (the skip's `name`:
  the frame has no balloon of hers for `nameOn` to take it from, so without it the counter's tag would read {name}paw); before the
  naming they carry none and read “{name}paw” as everywhere (ui.js's default, unchanged). **The Clan's calls** (“WE WILL!”, “{name}{ending}! {name}{ending}!”) are `{ who: 'clancat', name: 'Every cat', kind:
  'shout' }` (chapter 4's “Somebody”, chapter 8's “The dogs”), with a `clancat` in the cast. No chapter `names`.
- **Balloon kinds**: `whisper` for “It’s time.”, “Are you NERVOUS?”, “Front row…”, “Take your time…”, “A name with this moon in
  it…”, “{name}{ending}.” (hers), “Hello, Sprinkle…”, “Not one…”, “Mice…”; `shout` for the Clan's calls, “Or {name}PINECONE!”,
  Glintstar's “Cats of CrystalClan!…”, Riffle's “{name}{ending}! Best name EVER!”, Waffles' “WHAT did they call {them}?…”, our cat's
  “TEN!”; every other balloon plain.
- **Tokens**: `{name}paw` exactly where the story writes it (before the naming, and “{Murmur}paw became {Murmur}… CHIME.”);
  `{name}{ending}` from the naming on (section 6); `{they}`, `{them}`, `{petname}`, `{Murmur}` as the story writes them. Every line
  reads with he and him (run the story test on a tom).
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; the target drawn only where the cast entry carries `tap`):

  | Frame | `tap` (who carries it) | `prompt` | `label` |
  |---|---|---|---|
  | f003 the grey tom's “Your ears are sticking up.” | `ears` (our cat, `sit`, at `nest`) | `**Tap** to flatten your ears.` | `Flatten your ears.` |
  | f006 the stone on the moss | `paw` (our cat, `sit`, as built; the stone on the moss, the den's `miststone: true`) | `**Tap** to take it with you, tucked close.` | `Take the mist stone.` |
  | f012 “{name}paw. Come up.” | `paw` (our cat, `walk`, the stone in her mouth) | `**Tap** to step up, and set your mist stone down.` | `Step up.` |
  | f019 “Tonight, I see three.” | `ears` (our cat, `sit`, stone at `paws`) | `**Tap** to hear them.` | `Listen.` |
  | f030 “Our newest warrior: {name}{ending}!” | `nose` (our cat, `crouch`, `proud`) | `**Tap** to bow, with tremendous dignity.` | `Bow.` |
  | f031 the Clan calls her name | `tail` (our cat, `sit`, `tailUp: true`) | `**Tap** to lift your tail, high.` | `Lift your tail.` |
  | f034 Riffle at the hedge | `paw` (our cat, `pawup`) | `**Tap** to wave to Riffle.` | `Wave to Riffle.` |
  | f038 the stone flashes | `stone` (our cat, `sit`, `holdAt: 'paws'`, `flash: true`) | `**Tap** to hold it up to the moon.` | `Hold the stone up.` |
  | f040 the old tom's pinecone | `paw` (our cat, `sit`) | `**Tap** to sit up, tall and still.` | `Sit up tall.` |
  | f048 “Can I have my pinecone back?” | `pinecone` (our cat, `sit`, `holds: 'pinecone'`, `holdAt: 'paws'`) | `**Tap** to give it back.` | `Give the pinecone back.` |
  | f049 the new nest | `stone` (our cat, `situp`, `holds: 'miststone'`, no `holdAt`: held up in both forepaws, chapter 10's f152) | `**Tap** to lay your mist stone down.` | `Lay the stone on the moss.` |

  Each Tap's response is drawn on the next frame, or not at all where the story says the page turns at once (section 7, item 4).
- **The mist stone, frame by frame** (no camp option: in camp she always holds it, and a held stone sits on the ground at her toes):
  on the moss in the apprentices' den till she takes it (`miststone: true` on f002 to f006: the den's `inside` and `nest` draw it, as
  chapter 10's `doorway` does, clear of Riffle's stone by her nose or under her chin; held at her paws on f006 it lay under Riffle's
  for a `ch2Stone: 'chin'` cat, the review's); in her mouth walking (f008, f012); under
  her chin sitting in the ring (f009, f010: `holdAt: 'chin'`); **at her paws at the fountain's foot from f013** (“in its shadow”:
  grey, no `flash`); `flash: true` from f038 (the moon finds it) to f043; grey again from first light (f044 to f047); the pinecone
  in its place on f048; held up in both forepaws, sitting up, on f049 (at her paws it met Riffle's stone for a chin cat); on the moss
  of her new nest from f051 (`miststone: true`, grey).
- **Spots** (world units, `camp` main composition; the builder settles each with `tools/frames.mjs` and lists crowded casts back to
  front, far cats first, as chapter 10's test checks): `FOOT = { x: 760, y: 860 }` and `BESIDE = { x: 950, y: 872 }` (the Warrior
  Counts', `warrior.js`: our cat at the fountain's foot, Tallyheart right beside her); `RING_YOU` and `RING_TALLY`, the front of the
  ring left of the fountain (as built `{ x: 610, y: 905 }` and `{ x: 380, y: 900 }`; at about 560 and 420 the two overlapped); `OLD` and `GREY`, behind {Murmur}chime at
  `crowd-right` (about `{ x: 1130, y: 770 }` and `{ x: 1290, y: 772 }`, both inside `crowd`'s box); `THYME`, the ring's right edge by
  the ferns (`ferns` on `reveal`), **his face and his whole body inside `crowd`'s box and touching nobody**: its right edge is x
  1360, and at v0.1's `{ x: 1290, y: 905 }` a sitting cat about 210 wide, facing left, runs past it; straight left, at x 1220, he
  would sit in front of {Murmur}chime at `crowd-right` (1215, 790). The builder settles him with `tools/frames.mjs` on f025 and
  f027's casts (smaller with `size`, or nearer the ferns, clear of `crowd-right`, `OLD`, `GREY` and `BESIDE`); `BY_FOOT`, the old
  tom setting his pinecone down at her side (as built `{ x: 530, y: 872 }`); `THYME` as built `{ x: 1300, y: 960, h: 180 }`; and,
  added by the build (section 7, item 16), `WALK_YOU` `{ x: 650, y: 900 }` and `WALK_TALLY` `{ x: 380, y: 892 }` (walking into the
  ring, f008), `BOW` `{ x: 740, y: 860 }` (the bounce and the bow, a step forward of `FOOT`) and `PAD` `{ x: 1080, y: 890 }`
  (Tallyheart padding across the camp at first light, f045). In the den, {Murmur}chime's next nest is the den's own
  spot `next-nest` (`nextNest: true`, section 4), never a raw spot.
- **Shared opts**: `CAMP = { crowd: true, moon: 15 }`, `CAMP_NIGHT = { moon: 15 }`, `DEN15 = { weather: 'clear', moon: 15, stone:
  'auto', bark: 'auto', hidden: true, glass: true }`, `DENM = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass:
  true }` (by morning; `miststone: true` added once the stone is laid), `DENW = { weather: 'clear', stone: 'auto', bark: 'auto',
  hidden: true, glass: true, nextNest: true }` (her warrior's nest, the `nest` camera with {Murmur}chime at `next-nest`: f049, f051
  to f056; `miststone: true` added once the stone is laid), `PILE_NIGHT = { rows: [10, 10, 10, 10], scale: 'behind', dug:
  'big', moon: 15 }`, `PILE_DAY = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }` (the pile whole, the “scale” and the dug
  earth behind it as chapter 9 left them, no `back` shadow: four rows in the first light), `TOWER_NIGHT = { chime: true }` (the
  tower's `light` is drawn on `up` only).

### The frames

Fifty-eight frames on a reading where she names herself, fifty-seven where she takes an offered name (f025 is the self path's; as
built, the story's last screen is two panels, f057 and f058, section 7, item 16). The words of each are the story's screen, named by
its first words.

**Tonight**
- **f001** `camp`/`reveal`, `CAMP_NIGHT`, `night`: two Clan cats padding toward the fountain, nobody on it yet. Captions: “The moon
  comes up over camp.” / “The dens, the ferns, the old stone fountain: everything is silver.” / “This morning, you passed your
  Warrior Counts. Tonight, the Clan gathers. For your name.” The start.
- **f002** `den`/`inside`, `DEN15` with `miststone: true` (f002 to f006): Tallyheart at `doorway` (`peer`, `happy`), the grey tom curled at `sleeper-1`, our cat sitting
  up at `nest`. Caption “Tallyheart’s head pokes into the den.”; her whisper “It’s time.”
- **f003** the same den: the grey tom sitting up (`sit`, `happy`). Caption “Across the den, the grey tom sits up.”; his “Your ears
  are sticking up.”; the ears Tap (the story's split: a caption after a balloon).
- **f004** the same: `sfx` *Boing.*; caption “They pop right back up.”; the grey tom's “Better. Sort of.”
- **f005** the same: caption “Then he sighs.”; his “Warriors sleep with the warriors. So who’ll do the paw thing with me now?”; our
  cat's “I’ll do it from my new nest. LOUDLY.”
- **f006** `den`/`nest`, `DEN15` with `miststone: true` (the stone on the moss; our cat `sit` beside it, the Tap on her paw; as
  built in the final round: crouched, her reaching forepaw rested on Riffle's stone, not the mist stone): captions “On the moss of your nest, out of the moonlight, your
  mist stone is grey.” / “Sprinkle will want to hear your new name.”; the stone Tap.

**The ring**
- **f007** `camp`/`reveal`, `CAMP`: Glintstar `stand` at `fountain-top`; Thymeleaf at `ferns` (`kind`, facing left). Captions
  “Every cat of CrystalClan sits in a ring in the clearing, washed and fluffed.” / “Glintstar stands tall on the fountain.” / “At the
  edge of the ring, by his den, Thymeleaf hushes his leaves.”; his “Shh. This is the good part.”
- **f008** `camp`/`crowd`, `CAMP`: our cat and Tallyheart walking in (the stone in her mouth), {Murmur}chime at `crowd-right`.
  Caption “You pad into the ring with Tallyheart.”; {Murmur}chime's whisper “Front row. Like I promised. AGAIN. I’ve been sitting
  here ALL afternoon.”
- **f009** the same: our cat at `RING_YOU`, Tallyheart at `RING_TALLY`, sitting (the stone under her chin); {Murmur}chime; the old
  tom at `OLD` with his pinecone, the grey tom at `GREY`. Caption “The old tom squeezes in behind her with his pinecone, and the grey
  tom beside him.” (the story's split).
- **f010** the same picture, Tallyheart's tail twitching (`stand`): one worry caption by `when` (`{ worry: 'small' }` … `{ worry:
  'shiny' }`, the story's four), then “Tallyheart’s tail is twitching.”; our cat's whisper “Are you NERVOUS?”; Tallyheart's “Me?
  Never. Let’s count something.” (four boxes).
- **f011** the ears skip (section 2), with Tallyheart's “Eight cats, right in front of us. Ears, by twos.” as its balloon: her one
  paragraph lettered across two panels, so the skip's screen says what to count and no panel holds five boxes with the count's. Its
  scene, as f010's (the skip draws its own picture in play; every skip frame of chapters 6 to 10 carries one, and the speaker is in
  its cast): `camp`/`crowd`, `CAMP`, `night`: our cat at `RING_YOU` (`sit`, the stone at `chin`), Tallyheart at `RING_TALLY` (`sit`),
  {Murmur}chime at `crowd-right`, the old tom at `OLD` and the grey tom at `GREY` (as built in the final round, f011 and f012: they
  squeeze in on f009 and stay to the end of the ring).
- **f012** `camp`/`crowd`, `CAMP`: our cat stepping out (`walk`), Tallyheart, Glintstar `stand`, {Murmur}chime, the old tom and
  the grey tom. Caption “Sixteen! And every ear is
  pointing at you.”; Tallyheart's “Phew. Nerves gone.”; Glintstar's “CrystalClan! Tonight, one of us becomes a warrior.” and
  “{name}paw. Come up.”; the step Tap.

**The ceremony** (our cat at `FOOT` with the stone at her paws, Tallyheart at `BESIDE`, from here to f040 unless named)
- **f013** `camp`/`crowd`, `CAMP`: Glintstar `sit`; {Murmur}chime, the old tom and the grey tom in the picture. Glintstar's “When you
  came to us from behind the glass, not every cat was sure.”
- **f014** the same, the old tom sheepish: caption “The old tom coughs.”; Tallyheart's “I was sure. Judge {them} by what {they}
  does, not by where {they} sleeps.” (chapter 1's words, exactly).
- **f015** `camp`/`fountain-close`, `CAMP_NIGHT`: Glintstar `sit`, `kind`. Her “So we did. I said it at the Gathering. Tonight, I say
  it at home.” and “You noticed what was missing. You fed a friend who was hungry. You found out the truth, and you said it, to every
  Clan.”
- **f016** `camp`/`crowd`, `CAMP`: Glintstar `stand`, to the Clan. Her “And this morning, you answered every Count, up to ten times
  ten.” and “CrystalClan. Will you stand by {name}paw, the way {they} stood by a friend in the dark?”
- **f017** the same, a `clancat` in the cast: “WE WILL!” (Every cat); the old tom's “I said it FIRST.”
- **f018** the same: caption “He didn’t.” (the story's split: the narration opens this frame); Glintstar's “And you, {name}paw. Will
  you keep the Accord? Will you look after this Clan, and every friend who needs you?”; **Choose** “I will.” / “I PROMISE!”
  (labels with the story's quotes, `sets: {}`, both to f019).

**Your name** (`camp`/`crowd`, `CAMP`; Glintstar, our cat and Tallyheart on every frame, so any of their lines can show)
- **f019** Glintstar's “I know you will. Your warrior name keeps {name}. Only the paw goes, for a new ending. {Murmur}paw became
  {Murmur}… CHIME.” and “Tallyheart promised you a name with this moon in it. Tonight, I see three.”; the ears Tap.
- **f020** Glintstar's “Tallyheart told me what you’ll remember most.”, then the first row's lines, **each balloon with `when: {
  offer: '<word>' }`** (section 6): `mist` “Sprinkle, who flew home in the mist. {name}mist.”; `flash` “Sprinkle, who says hello
  in a flash. {name}flash.”; `sky` “Sprinkle, who flew home across the sky. {name}sky.”; `purr` “Your friends: an otter, a dragon or
  two, one very dramatic pillow cat, and this whole ring. A purr for every one. {name}purr.”, and `friend` and `hug` the same with “A
  friend to every one.” and “A hug for every one.”; `true`, `clear`, `brave` “Finding the truth. You found it, and you said it.
  {name}true.” (… `{name}clear.`, `{name}brave.`); and for `mark`, `count` and `tally` three balloons, `when: { offer: ['mark',
  'count', 'tally'] }` for the first and the last: Glintstar's “The Counts. Of COURSE.”, then Glintstar's “Ten claw marks on the
  leaning tree. {name}mark.”, “Every Count, up to ten times ten. {name}count.” or “You count EVERYTHING. Like Tallyheart.
  {name}tally.” (each by its own `offer`), then Tallyheart's “Ha!” (as built: between Glintstar's two, her second had a tail of its
  own that ran up across her first's words; after them, her balloons chain with one tail; the story's order changed to match).
- **f021** Glintstar's “And what you do best.”, then the second row's, by `offer`: `bright`, `eye`, `sight` “Bright eyes, that see
  what everyone else misses. {name}bright.” (… `{name}eye.`, `{name}sight.`); `hush` “Quiet as a shadow, all moon long. {name}hush.”;
  `sharp` “Sharp ears, soft paws. {name}sharp.”; `spark` “Quick as a spark, and twice as quiet. {name}spark.”; `leap` “Up the
  curtains. Up the bramble arch. And a climber’s leap: crouch, look, JUMP! {name}leap.”; `climb` “Up the curtains. Up the bramble
  arch. Up ANYTHING. {name}climb.”; `reach` “Up the curtains. Up the bramble arch. Nothing is out of reach. {name}reach.” (section
  7, item 2); `splash`, `wave`, `ripple` “You taught a dragon to paddle. Back legs! {name}splash.” (…); `cheer` “The loudest cheer
  in any crowd. You even made Sloshbank smile. Almost. {name}cheer.”; `smile` and `kind` “You even made Sloshbank smile. Almost.
  {name}smile.” (… `{name}kind.`).
- **f022** the moon row, by `offer` (and `nameHas`): `moon` “And one for this moon itself. On your first night, there was no moon at
  all. Now you’ve seen it round and full. {name}moon.”; `{ offer: 'silver', nameHas: 'moon' }` “And one for this moon itself. Your
  name has the moon in it already. So: {name}silver.”; `{ offer: 'silver', not: { nameHas: 'moon' } }` “And one for this moon
  itself, that turns everything silver. {name}silver.”; `river` “And one for this moon itself, shining on the river. {name}river.”;
  then the old tom's shout “Or {name}PINECONE!”
- **f023** `camp`/`reveal`, `CAMP` (as built, section 7, item 16: the camp wide, every cat looking at the old tom, Glintstar and
  Tallyheart facing right): caption “Every cat looks at him.”; the old tom's “What? It’s a GOOD pinecone.” (the story's split).
- **f024** Glintstar's “Pick one. Or name yourself. It’s YOUR name.”; Tallyheart's whisper “Take your time. There’s no wrong one.”;
  **Choose**: thirty offered options, in row order (the twelve `ch10Best` words, the fifteen `specialty` words, then moon, silver,
  river), each `{ label: '{name}<word>', when: { offer: '<word>' }, ending: '<word>', sets: { ch11Named: 'offer' }, next: 'f026' }`
  (a name, so no quotes), then `{ label: '“I’ll name myself!”', sets: {}, next: 'f025' }` (`self` is set when her ending is
  accepted on f025, section 1). Exactly four show on
  every reading (three names, never two alike, and hers): E.options keeps the definition order.
- **f025** (self path) the same picture with {Murmur}chime at `crowd-right` and Thymeleaf at `THYME` (every refusal's speaker in the
  cast): Glintstar's “Then you choose. {name}… what? A word you’re proud of.”; **`input: { kind: 'ending', refuse: REFUSE, sets: {
  ch11Named: 'self' }, next: 'f026' }`** (section 6; `sets` applied only when an ending is accepted), where `REFUSE = { own: { who: 'tallyheart', text: 'That’s your name ALREADY! Give it a new ending.' }, star:
  { who: 'glintstar', text: 'Star is for leaders. Try another ending.' }, paw: { who: 'tallyheart', text: 'Paw? Not any more, you’re
  not! Try another.' }, kit: { who: 'murmurchime', text: 'Kit? You’re a WARRIOR now, silly! Try another.' }, clan: { text: 'That’s MY
  name! One of me is plenty. Find one all your own.' } }`.

**From tonight**
- **f026** `camp`/`crowd`, `CAMP`, `['night', 'glow']`: Glintstar `peer` (looking down), Tallyheart beside. Caption “Glintstar looks
  down at you, and the moonlight shines all around her.”; Glintstar's balloon written twice by `when`: `{ ch11Named: 'self' }`
  “{name}{ending}. Your very own. I like it.”, `{ not: { ch11Named: 'self' } }` “{name}{ending}.”; Tallyheart's whisper `{ ch11Named:
  'offer' }` “A name with this moon in it. Like I promised.”
- **f027** the same picture with {Murmur}chime, Thymeleaf and the old tom: `{ ending: ['heart', 'hearts'] }` caption “Tallyheart’s
  ears go straight up.” and her “Like MINE?”; `{ ending: ['chime', 'chimes'] }` {Murmur}chime's “Like MINE!”; `{ ending: ['leaf',
  'leafs', 'leaves'] }` Thymeleaf's “Leaf, like mine.”; `{ ending: ['pinecone', 'pinecones'] }` the old tom's “I KNEW it!” (a typed
  plural is the same word to her); then Glintstar's “Your warrior name. Say it.” (for every cat: the
  caption, when it shows, opens the frame).
- **f028** the same, closer on our cat (`sit`, `wonder`): her whisper “{name}{ending}.” (As built, the crowd shot again: the camp
  has no camera close on the fountain's foot.)
- **f029** the same, `['night', 'motion']`, our cat `stand`, `happy` at `BOW`, first in the cast (the art draws the motion lines round
  the first member), the ring as on f028 and f030: captions “It fits, like your own fur.” / “Then you can’t help
  it. You BOUNCE.” (the story's split).
- **f030** Glintstar `stand`, `shout`, our cat at `BOW` (`crouch`, `proud`, facing left): caption “Glintstar lifts her head high.”; her shout “Cats of CrystalClan! Our newest warrior:
  {name}{ending}!”; the bow Tap.
- **f031** `camp`/`purr`, `CAMP` (as built, item 16), `['night', 'purr']`, a `clancat` in the cast: captions “One by one, the cats begin to purr, all round the ring,” / “until
  the whole camp is humming your new name.” / “Then every cat calls it out.”; Every cat's shout “{name}{ending}! {name}{ending}!”;
  the tail Tap.
- **f032** `camp`/`purr`, `['night']` (as built: no `sparkle`, which the art scatters round the first cast member, one landing on {Murmur}chime's
  yowling face), every cast tail up (`tailUp: true` on our cat, Tallyheart, {Murmur}chime, Thymeleaf, the old tom and the grey tom),
  Thymeleaf full-sized at the set's `ferns` (the `purr` camera has room for it): caption “{Murmur}chime yowls till her whiskers shake.” ({Murmur}chime `shout`); Thymeleaf's “Did you hear that,
  leaves?”
- **f033** `camp`/`crowd`, `CAMP`, quiet: caption “Tallyheart doesn’t yowl. She just looks at you, and her eyes shine.” (Tallyheart `kind`, the
  story's split).

**All the way to the river**
- **f034** `camp`/`reveal`, `CAMP`: Riffle at `entrance` (`scramble`, `shout`), our cat at `FOOT` (`pawup`). Captions “The cheer
  rolls all the way down to the river.” / “A dripping otter scrambles up to the camp’s hedge, louder than every cat put together.”;
  Riffle's shout “{name}{ending}! Best name EVER!” and his “Otters don’t do ceremonies. But otters DO cheer!”; the wave Tap.
- **f035** the same, Riffle `puff`: caption “He tries to purr your name. It sounds like bubbles.”; his “See you tomorrow,
  {name}{ending}!”
- **f036** the same, Riffle `hop`, facing out of the hedge: caption “Off he scampers down to the river.”; `sfx` *Splash!*; caption
  “Cheering all the way home.” (the story's split).
- **f037** `tower`/`balcony`, `TOWER_NIGHT`, `night`: Waffles at `railing` (`peer`, `shout`). Caption “Far above, Princess Waffles
  hears it too.”; her shout “WHAT did they call {them}? Speak UP, darlings! Is there a CROWN?” and “I shall still call {them}
  {petname}, of course.”
- **f038** `camp`/`crowd`, `CAMP`, `['night']` (as built, no `sparkle`: the stone's own flash carries it): our cat at `FOOT` (`sit`,
  `wonder`), the stone flashing at her paws. Captions “The moon climbs
  over the fountain, and its light finds your mist stone at last.” / “It flashes. Blue! Green! Blue again!”; her whisper “Hello,
  Sprinkle. It’s me. {name}{ending}.”; the stone Tap.

**The watch**
- **f039** `camp`/`fountain-close`, `CAMP_NIGHT`: Glintstar `sit`, `kind` (as built: `peer` floated her across the night sky, this
  camera showing no fountain top under her; f015's picture). Her “Welcome, warrior. A warrior named by moonlight keeps
  watch over the camp till the first light. Tonight, that’s you.”
- **f040** `camp`/`crowd`, `CAMP`: the old tom at `BY_FOOT` (`crouch`, his pinecone at his paws, set down at her side), our cat at
  `FOOT`. Caption “The old tom leaves his pinecone beside you.”; his “For the watch. It never let ME down.”; the sit-up Tap.
- **f041** `camp`/`reveal`, `CAMP_NIGHT` (the ring gone): a few Clan cats curled asleep at their dens (coat 3 at `crowd-left`,
  coat 1, a brown tabby, at `crowd-right` on f041, f043 and f044: Tallyheart the only ginger cat by night and at first light, the
  final round), Tallyheart padding to hers
  (`walk`, `sleepy`), our cat small at `FOOT`, sitting tall. Caption “Den by den, the camp falls asleep.”; Tallyheart's “If a mouse
  even sneezes, wake me.”
- **f042** `pile`/`wide`, `PILE_NIGHT`, nobody: caption “The prey pile lies whole in the moonlight.” (the story's split).
- **f043** `camp`/`reveal`, `CAMP_NIGHT`, `['night', 'stars']`, the camp asleep, our cat at `FOOT`: captions “The moon slides across the sky. Far off, the
  river shines silver.”, one `ch10Best` thought by `when` (the story's four), and “Not long ago, you watched this Clan through the
  glass. Now you’re keeping it safe.”

**First light** (`morning`; no moon)
- **f044** `camp`/`reveal`: the camp asleep, our cat at `FOOT`. Captions “The sky turns pink, then gold.” / “The first bird.”; `sfx`
  *Tweet!*
- **f045** `camp`/`crowd` (no crowd): a Clan cat still asleep at `crowd-left` (coat 3, `curl`, `asleep`; item 17), Tallyheart
  padding across at `PAD` (`walk`, `tailUp`), our cat at `FOOT`. Caption “Tallyheart pads
  across the camp, her tail high.”; her “Any sneezes?”; our cat's whisper “Not one. One moth. I let it go.”; Tallyheart's “Hmph.”
  (`proud`).
- **f046** `pile`/`rows`, `PILE_DAY`: Tallyheart at `crowd-3`, our cat at `beside`. Tallyheart's “Good morning, {name}{ending}.”;
  `counts: { set: 'ch11-pile', intro: false, next: 'f047' }` (her question is the fact's prompt: section 2).
- **f047** the same: Tallyheart's “At {Murmur}chime’s Counts, I said, ‘One day, that’ll be you.’ I was right. I’m proud of you. And
  I’m still right here.”; **Choose** “Thank you, Tallyheart.” / “You counted with me. Every time.” (quotes, `sets: {}`, both f048).
- **f048** the same, the old tom at `pile-left` (`sit`, `happy`), our cat with his pinecone: caption “Tallyheart purrs.”; the old
  tom's “Morning, warrior. I always said you’d make a fine one.”; our cat's “When?”; his “…Just now. Can I have my pinecone back?”;
  the pinecone Tap.
- **f049** `den`/`nest`, `DENW`: our cat sitting up at `nest`, the stone in both forepaws, {Murmur}chime at `next-nest` (`lie`, `sleepy`). Caption “Your
  new nest is with the warriors now, soft and deep.”; {Murmur}chime's “I saved you the one next to MINE.” and “The grey tom carried
  your things. He only dropped Riffle’s stone TWICE.”; the lay-it-down Tap.
- **f050** `den`/`outside`, `{ weather: 'clear' }`: the grey tom's head at `doorway` (`peer`, `sleepy`). Caption “Across the camp, the
  grey tom pokes his head out of the apprentices’ den.”; his “It’s too EARLY. Paw thing?”
- **f051** `den`/`nest`, `DENW` with `miststone: true`: our cat sitting up in her nest, {Murmur}chime asleep at `next-nest`
  (`lie`, `asleep`, her f049 pose with her eyes shut, from here to f058: curled, she was a tortie player's twin; the final round). Our cat's
  shout “TEN!”
- **f052** the paw thing skip (section 2), with the caption “{Murmur}chime’s ear twitches. You start again, in a whisper.” (the
  story's split), and the skip's `name: '{name}{ending}'` (its whispered counter's tag; section 6). Its scene: `den`/`nest`, `DENW`
  with `miststone: true`, `morning`: our cat `loaf` at `nest`, {Murmur}chime at `next-nest` (`lie`, `asleep`).
- **f053** `den`/`nest`, `DENW` with `miststone: true`, `['morning', 'zzz']` (the zzz round the sleepy cat: {Murmur}chime): our
  cat `loaf`, {Murmur}chime `lie`, `asleep`.
  The page shows the 50 the paw thing reached, big (no `carry: false`; chapter 4's f119), and its board says so. Captions “By fifty,
  the grey tom’s snoring.” (the final round: “he” opened a panel he is not in) / “In the next nest, {Murmur}chime has dozed off again.”; her whisper “Mice…”
- **f054** the same, our cat `curl`: caption “Some things never change.” (the story's split), one `ch2Stone` caption by `when`
  (“Riffle’s stone is by your nose.” / “Riffle’s stone is under your chin.”), and “You curl up tight in a warrior’s nest, for the
  very first time.”
- **f055** the same, our cat `asleep`: captions “You’re {name}{ending}, a warrior of CrystalClan. And you’re home.” / “You close
  your eyes, warm and safe, and sleep.”

**Chapter end**
- **f056** `den`/`nest`, `DENW` with `miststone: true`, `['morning', 'zzz', 'sparkle']`, both cats asleep as on f055, our cat
  first in the cast (the art scatters `sparkle` round the first member: round the new warrior, not {Murmur}chime; the final round): caption “What did {name}{ending} dream, in a
  warrior’s nest?”; `input: { kind: 'dream', placeholder: 'A name… a moon… a pinecone…', next: 'f057' }`.
- **f057** `den`/`stone`, `DENM` with `miststone: true` (grey), `morning`, our cat at `tail` (`curl`, `asleep`): captions
  “{name}{ending} sleeps.” / “Beside {them}, the mist stone waits for tonight’s moon, to say hello again.”
- **f058** (as built: the story's last screen in two panels) `den`/`nest`, `DENW` with `miststone: true`, `['morning', 'sparkle']`,
  the two warriors asleep in their nests, our cat first in the cast (as f056): captions “End of Chapter Eleven. {name}{ending}, warrior of CrystalClan.” / “THE END.”;
  `end: true`.

### The book (the story builder's; proposed here)

```js
book: {
  title: '{name}paw’s First Moon', chapterTitle: 'The Warrior Ceremony',
  dream: '{name}{ending}’s dream: “{dream}”',
  noDream: '{name}{ending}’s first dream in a warrior’s nest stayed a secret.',
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
}
```

Seven lines on every reading, each true on every path (the forty is said with or without help). The full book's title stays chapter
1's, “{name}paw’s First Moon” (section 6).

### The teaser (proposed)

`teaser: { title: 'A new adventure', lines: ['Out on Gathering Island, an old badger track lies in the mud. Who made it? Another
day.'] }`: the story's own line, and a title that reads on the hub's button as “A new adventure is coming soon” (section 9, call
15). Chapter 10's teaser stays as it is: with chapter 11 built, E.teaser(ch10) is `built: true, next: 'ch11'` (section 10).

### Tests the story builder adds (`tests/story-ch11.test.js`)

As chapter 10's, and: every frame renders with the art's vocabulary (`camp`'s `moon: 15`, the den's 15 and `nextNest`) and every
Tap's target is in its picture; every speaker in the cast; on f049, f051 and f052 to f056 the rendered boxes of our cat (at `nest`)
and {Murmur}chime (at `next-nest`) do not meet; the chained balloons are exactly section 5's list; for every `ch10Best` (four and none) ×
`specialty` (five and none) × a list of first parts (chapter 1's eight, and Moon, Moonbeam, Misty, Mist, Amber, Honey, Bright, Dawn,
Fox, Wiggle, Otter, Ripple, Tally, Thyme, Murmur, Big Fern, Moss, Shell), **f020, f021 and f022 each show exactly one reason with its name, f024
shows exactly four options (three different names and “I’ll name myself!”), and each shown name is E.warriorOffers' word**; every
option's `ending` equals its `offer`; “I’ll name myself!” sets nothing and f025's input `sets: { ch11Named: 'self' }`; the silver
cat's line by `nameHas`; f027's four lines by `ending` (a typed “hearts” too), and none for an offered name; the Type screen's
refusals (each `REFUSE` speaker in f025's cast; a typed “heart” gets “Like MINE?”); `{name}paw` on every line before f026 that names
her, `{name}{ending}` from f026 on, our cat's balloons from f028 named `{name}{ending}`, and f052's skip `name: '{name}{ending}'`; a
tom reads every line with he and him; the morning count as section 2 runs it (four patterns), the two skips (eight groups with
{Murmur}chime fourth, five `clancat` variants, never six, and `teacher: 'tallyheart'`; `paws: 'both'`); **the Counts claims of
section 2, pinned**: `E.countSets(STORIES)` is chapter 10's ten exactly (story-ch10.test.js's list, `[1, 'ch01-tails']` …
`[7, 'ch10-sevens']`), `E.readFirst({ set: 'ch11-pile', a: 4, b: 10, correct: true }, STORIES)` is true, `E.tableOf` of a
`ch11-pile` entry is 10, `E.learnedCounts` of a cat with only `ch11-pile` finished is `[]`, `E.skipInto(ch11, 'f012')` is null and
`E.skipReached(E.skipInto(ch11, 'f053'))` is 50; and (optional) a cat who can re-sit with one answer in `warrior.sitting` sees
Tallyheart's waiting line over the morning count's first question (section 7, item 14); captions at most 95 characters and no panel with five boxes;
57 frames on an offered reading, 58 on a self-naming one (as built); the book's seven lines and the teaser; no “StarClan”, “warriors’ den”,
“vigil”, “Twoleg”, “kittypet”, “whisker-length”, “claw-length”; the words of chapter 10's teaser test as section 10 changes them.

## 6. Engine needs

**One: the warrior name** (decision 52; the brief's one expected engine need), designed below so that it changes nothing for a
cat who has not been named: no field is added to a blank cat, every token and line reads as today until she has an ending, every
hook is a branch only chapter 11's keys reach (or, for chapter 1's name read again and the Warrior Counts' page, only a cat with an
ending), and the save stays version 2. **Its one new interaction is an input kind, `input: { kind: 'ending' }`** (the Type screen,
with its `sets`); the offers ride on a `choice`, as the story's **Choose** writes them, with one option key, `ending`, and two
computed `when` keys, `offer` and `nameHas`; and a skip may carry its counter's `name`. Everything else is what chapters 1 to 10 built: choices
with `when` and `sets`, one-tap `scratch` frames, `skip` with `who` and `teacher`, `paws: 'both'`, a Counts set with `help:
'picture'`, the dream input, `end`.

### Where it is stored

- **`cat.ending`**: an optional field on a cat, **absent until she is named** (as the Warrior Counts' `warrior`; never in
  `E.blankCat`, so every unnamed cat is stored exactly as today), a string of 1 to `E.ENDING_MAX` (12) lower-case letters: the second
  half of her warrior name, “heart” in Fernheart. **Only the ending is stored**: her name is `{name}{ending}`, so a reread of chapter 1
  that changes her first part keeps the two halves together everywhere (section 9, call 1); **an offered ending is taken again from
  its row** when the new first part doubles, guards or triples it (`E.submitInput`'s `'clanname'` branch, below), and a typed one
  stays hers (section 7, item 15). `E.resetCat` drops it with everything.
- **`normCat`** copies it only when it is a string with a letter in it, kept as its letters only, lower-cased, at most 12 (no
  first-part rule: that is for what she types); anything else is dropped (a hand-edited save only: she is unnamed again).
  `E.migrate` stays idempotent.
- `E.VERSION` `'0.11.0 (chapter 11, <ship date>)'`, its pin in `tests/engine.test.js`; `E.SAVE_VERSION` stays 2 (the pin's message
  names `ending`, optional and not in `E.blankCat`).

### Data beside the engine (`app/engine.js`)

```js
E.ENDING_MAX = 12;
// the thirty endings (the story's For us): a row a value; the first offered, the next two standing by
E.WARRIOR_ENDINGS = {
  ch10Best: { sprinkle: ['mist', 'flash', 'sky'], friends: ['purr', 'friend', 'hug'], truth: ['true', 'clear', 'brave'],
    counts: ['mark', 'count', 'tally'] },
  specialty: { noticing: ['bright', 'eye', 'sight'], sneaking: ['hush', 'sharp', 'spark'], climbing: ['leap', 'climb', 'reach'],
    swimming: ['splash', 'wave', 'ripple'], friends: ['cheer', 'smile', 'kind'] },
  moon: ['moon', 'silver', 'river'],
  fallback: { ch10Best: 'truth', specialty: 'noticing' }
};
// a first part (letters only, lower case) that makes, with the word, a whole name on either wiki (the names critic's
// guard list, critic-names-tone-r2/guardlist.txt: every title ending in one of the thirty words; grey spelled both ways)
// or a word already (honey: Honeymoon)
E.WARRIOR_GUARD = {
  mist: ['alightinthe', 'cloud', 'dawn', 'echo', 'gray', 'grey', 'lightinthe', 'lightsinthe', 'morning'],
  sky: ['bright', 'clear', 'du', 'gray', 'grey', 'night', 'pale', 'shattered'],
  purr: ['ripple', 'stalk'],
  bright: ['dawn'],
  eye: ['arch', 'bright', 'lion', 'one', 'white'],
  sight: ['bookofclear', 'clear', 'far', 'shadow', 'spire', 'templeofclear', 'the'],
  leap: ['branch', 'deer', 'druids', 'fin', 'fish', 'fox', 'frog', 'hound', 'hunt', 'light', 'rabbit', 'rain', 'song', 'stag',
    'tumble', 'vixen', 'wiggle'],
  splash: ['clover', 'lark', 'mud', 'nettle', 'otter', 'rain', 'rapid'],
  wave: ['lapping'],
  ripple: ['brook', 'river', 'stream'],
  moon: ['amber', 'half', 'harvey', 'hidden', 'honey', 'rising', 'signofthe'],
  river: ['dark', 'dawn', 'diamondspray', 'greatfivetail', 'gullet', 'snarling', 'windingtail']
};
```

(Four of the guard list's titles are left out: `lightningscratchesthe`, `screebeneathwinter` and `wethedragonsofthe` under sky, and
`mossthatgrowsby` under river, 15 to 21 letters, can never be a first part, which is at most `E.CLAN_MAX`, 14.)

### The functions

- **`lettersOf(s)`** (internal): every letter (the engine's `LETTER`), lower-cased; spaces, hyphens, apostrophes and digits dropped,
  and × and ÷ too (U+00D7 and U+00F7 fall inside `LETTER`'s À–ɏ range; `lettersOf` only, so chapter 1's `E.cleanClanName` is
  unchanged).
- **`E.warriorOffers(cat)`** → three words, in order: her `ch10Best` row's, her `specialty` row's, the moon row's (a missing or unknown
  `ch10Best` reads `'truth'`, a `specialty` `'noticing'`). In each row, the first word that is **not doubled** (her first part, letters
  only, has the word in it anywhere: Moonbeam is offered silver, Mistle flash), **not guarded** (`E.WARRIOR_GUARD[word]` holds her
  first part: Amber is offered silver, Fox climb, Bright sight) **and not tripled** (three of one letter at the join, which reads as a
  typo: `/(.)\1\1/.test(f.slice(-2) + w.slice(0, 2))`, `f` her first part's letters: Moss is offered wave, not Mosssplash; Shell
  climb, not Shellleap); if all three are out, the row's third (none runs out over 509 first parts, the triple rule included:
  `critic-wname-r1/triple.txt`). Run (`wname.txt`): all 43 of the critic's recorded skips agree; chapter 1's eight first parts take
  every row's first word but Moon's moon (Moonsilver); the triple rule adds 23 skips over 509 first parts (9 of the names critic's
  458: Mosssplash, Shellleap, Hillleap, Grasssplash, Gullleap, Smallleap, Tallleap, Cypresssplash, Bluebellleap), each to a word
  whose reason line the story has.
- **`E.cleanEnding(raw, cat)`** → what she typed as an ending: letters only, lower case (“Big Heart” after Fern is `bigheart`; any
  capitals; every space dropped), **a leading copy of her first part dropped once** (Fernheart typed by Fern is `heart`), at most 12
  letters (clipped).
- **`E.checkEnding(raw, cat)`** (the same argument order as `E.cleanEnding` and `E.cleanClanName`) → `{ ending, refuse, who }`,
  `refuse` null or, the first that holds, in this order: `'own'` (no letter left: blank, spaces, digits, or only her name); `'star'`,
  `'paw'`, `'kit'` (the ending, with **every** trailing s dropped for the test, `e.replace(/s+$/, '')`, ends in star, paw, or kit,
  kitten, kitty or kittie: stars, starss, paws, pawss, kits, kittens, kitties all refused); `'clan'` (her first part and
  the ending, letters only, make a Clan cat's whole name: `tallyheart`, `thymeleaf`, or `E.tortieWord(cat) + 'chime'`, so a cat named
  Murmur may be Murmurchime, her tortie being Mutterchime; Glintstar is already a star), with `who` the cat whose name it is
  (`tallyheart`, `thymeleaf`, `murmurchime`). Run: every case the story names, and Tally+heart, Thyme+leaf, Glint+star, Fern+starlight
  (kept), Fern+kittycat (kept). **A typed ending is never checked against the guard list** (the story: “hers, canon or not, never
  swapped”; section 9, call 5).
- **`E.warriorName(cat)`** → `cat.name + cat.ending` when she has both, else `''`. **`E.displayName(cat)`** → her warrior name first,
  then `{name}paw`, then her pet name, then “New cat” (chapter 1's order otherwise). `E.clanName(cat)` is unchanged (`{name}paw`).
- **Tokens** (`E.tokens`): **`ending`**: her ending, or `'paw'` until she has one, so `{name}{ending}` is `{name}paw` for every
  unnamed cat. No other token.
- **E.matches** gains two computed keys, beside `lessonClean` and `firstTry`: **`offer`** (any of the words listed is one of
  `E.warriorOffers(cat)`) and **`nameHas`** (her first part, letters only, has the word in it). **`ending`** needs no code: E.matches
  reads a cat's own fields after her flags and her look, so `{ ending: 'heart' }` is `cat.ending === 'heart'` (false while unnamed).
- **`E.choose`**: an option's **`ending`** (a word) sets `cat.ending` to it as given (never through the first-part rule, which is for
  typing: a cat named Mi is offered mist and keeps it), after its `sets`, before the page turns. Options without it: unchanged.
- **`E.submitInput`**, kind `'ending'`, before the generic branch: `E.checkEnding`; a refused ending is not stored, no flag is set
  and the page does not turn (returns false); else `cat.ending` is set, **the input's `sets` are applied** (f025's `{ ch11Named: 'self'
  }`: only an accepted ending sets it), and the page turns to `input.next`. `sets` on an input is read for kind `'ending'` only.
- **`E.submitInput`**, kind `'clanname'` (chapter 1's, read again), after the new first part is stored: **for a cat with `ch11Named`
  `'offer'` and an ending**, if `E.warriorOffers(cat)` under the new name no longer holds her ending, her ending becomes that row's
  offer (the row whose three words hold the old ending): Fern with moon renamed Moon is Moonsilver, Fern with leap renamed Fox is
  Foxclimb. A typed ending (`ch11Named` `'self'`) stays hers. Every other cat: the branch as today.
- **A skip's `name`** (optional, a line with tokens): the name tag of the skip's counter, in place of the one `nameOn` takes from the
  frame's balloons (`renderSkip`: `var tname = sk.name != null ? sk.name : nameOn(intro, teacher);`). Chapter 11's f052 only; no skip
  of chapters 1 to 10 has one.
- **`E.checkStory`**: an option's `ending` is 1 to 12 lower-case letters; an `input` of kind `'ending'` has `next` and `refuse` with
  `own`, `star`, `paw`, `kit` (each `{ who, text }`, `who` in the frame's cast) and `clan` (`{ text }`; `tallyheart`, `thymeleaf` and
  `murmurchime` all in the frame's cast), and may have `sets` (flags, as an option's); `when` keys `offer` (each value one of the
  thirty words) and `nameHas` (lower-case letters); a skip's `name` is a line (its tokens checked as any balloon's); no `sets` of a
  flag named `offer`, `nameHas` or `ending`.

### The page (`app/ui.js`, `index.html`)

- **The Type screen** (`renderInput`, kind `'ending'`, a branch of its own before the dream's; for this kind `renderInput` is given
  the frame's `ctx`): the prompt “Type your new ending.” (the story's **Type** line), which Read to me says too (pushed to
  `ctx.reading`; chapter 1's inputs push nothing and stay so); **her first part stands before the box** (`<span class="ending-name">`
  + the field, one row, the field wrapping under her first part where the row does not fit; the field `maxlength="30"`, chapter 1's
  attributes `autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done"` with `autocapitalize="none"`, the input's
  `placeholder` if the frame gives one, else none; `aria-label` “Your new ending, after {name}”); the live preview “You will be:
  {name}” + `E.cleanEnding` (“You will be: Fern…” while it has no letter); the button “That’s my name!” **always enabled** (a tap
  with no letter gets the own-name line).
  - **The field's first value**: her ending **only when it is not one of her offers** (`E.warriorOffers(cat).indexOf(cat.ending) <
    0`): a name she typed comes back to be changed, and an offered one she picked before (then Back, then “I’ll name myself!”) is
    never handed back as if she had typed it. Submitted unchanged, that first value is sent as `cat.name + cat.ending`, so the
    first-part rule drops exactly her first part (Moon who typed “moonmoon” is stored `moon`; her unchanged `moon` would otherwise
    be refused as her own name).
  - **On a tap**: `E.checkEnding`; refused, **the line from `input.refuse` becomes a balloon by its speaker on this panel** (the clan
    line's speaker is `who`): it replaces any earlier refusal in `ctx.balloons`, after the frame's own balloons, as `{ who, text,
    kind: 'say' }`, and `layoutText(ctx)` lays it out (with `relayoutFn` set), the page's own path, as the skip and the Counts pages
    build their balloons (ui.js 2202, 3045); no new layout code, the art unchanged. If the balloon is off the screen (the keyboard
    up), it is scrolled into view (`block: 'nearest'`). It joins `currentSpeech`, so Read to me's button says it again, and Read
    to me says it at once when it is on. **What she typed stays in the field, selected** (`field.select()`), so her next keystroke
    replaces it and the field keeps the focus; a tap on the button within `UI.keys.GUARD_MS` (350 ms) of a refusal is ignored, so a
    double tap never swaps the real reason for the own-name line. Accepted, `E.submitInput`, and the page turns.
  - Back on the field (←) and the page's Back work as on chapter 1's name.
  - **Pure helpers, exposed for Node**: `UI.ending = { preview(cat, raw), refusal(input, cat, raw) → { who, text } | null,
    prefill(cat) }`, the screen's rules without a page (the preview's words, which line and speaker a refusal gets, the field's
    first value).
  - CSS for the row in `index.html`, a block of its own; any Aa rule for it (or for a long name) goes in a new `@media` block of its
    own, so `tests/aa-room.test.js`, which pins the existing Aa blocks rule by rule, stays untouched; no other rule moves.
- **Where her name shows** once she has an ending (nothing changes for an unnamed cat):
  - **`E.displayName`** carries it everywhere it is used: the bar (every page, chapters 1 to 10 read again included), the hub's name,
    “Who's playing?”, “Keep reading, …”/“Back to camp, …”, My nest's title and speech, her book's signature (“{name}{ending} of
    CrystalClan”), the grown-ups corner's heading and its two confirms. (The corner gains no “Warrior name” row: its heading is
    her warrior name already, and its “Clan name” row stays `{name}paw`.)
  - **My nest**: its panel's `aria-label` “Your nest with the warriors” once `E.warriorName(cat)` is set, else “Your nest in the
    apprentices’ den” as today (ui.js 4088).
  - **The hub**: “Warrior of CrystalClan” in place of “Apprentice of CrystalClan” (ui.js 3584), and Read to me's “{name}{ending},
    warrior of CrystalClan.” (3604, 3606).
  - **Her own balloons on the Warrior Counts' page**: labelled `{name}{ending}` for a cat with an ending (the page passes
    `speakerLabel` a story with `names: { player: '{name}{ending}' }` only then; the page's `story` is the last chapter read, not
    `PC.warrior`), so on a re-sit after the Ceremony her “A HUNDRED!” is tagged with the name Glintstar's “Halfway, …” says. Every
    other cat's label is untouched, and so is `warrior.js`'s balloon (`tests/warrior-engine.test.js:23` and `:503` deepEqual it).
  - **The paw thing's counter on f052**: tagged by the skip's `name` (section 5).
  - **Kept as {name}paw**, on purpose: her book's title (“{name}paw’s First Moon”, chapter 1's `book.title`: the first moon was the
    apprentice's), the Case File's title (“{name}paw’s Case File”, `E.caseFile`), every line of chapters 1 to 10 (their text says
    `{name}paw`), and **our cat's balloon label** (ui.js 421's default stays `{name}paw`: chapter 11's balloons after the naming carry
    their own `name`, f052's skip too, and the Warrior Counts' page names hers as above; a later chapter sets `names: { player:
    '{name}{ending}' }`). The book's and the Case File's `long` classes
    (ui.js 3634 and 2629) test `E.clanName(cat)` (the name their titles show) in place of `E.displayName`, so neither moves.
  - **The Warrior Counts' re-sit** (`app/story/warrior.js`, three lines): “Halfway, {name}paw.”, “{Right} right, {name}paw. Your
    pass is yours for good.” and “Your pass is yours for good, {name}paw.” become `{name}{ending}`: byte-identical for every cat
    before the Ceremony (the token is `paw` until then), her warrior name after. The pass and the not-yet lines keep `{name}paw` (she
    cannot be named before her pass). `tests/warrior-story.test.js` pins these texts (its lines 553, 554 and 862 to 867): changed
    with them, a chapter-11 comment each; its “Halfway, Murmurpaw.” and “Halfway, Stormpaw.” checks stand as they are.

### Where chapter 11 meets the Warrior Counts (the page's code, read on main)

- **Opening**: `opensWhen: 'warrior'`: `E.isOpen` opens it once she has passed (`warriorPassed`) or finished it; until then
  `E.upNext` is null and the hub's big button is the Counts'. After the pass is seen, the hub's big button is the chapter's own
  (“Chapter 11: The Warrior Ceremony · A new chapter”, or “Keep reading Chapter 11 · page n”), the quiet “The Warrior Counts again”
  under it; the pass page's “To your ceremony” reads it from its first page (`readChapter(ceremony, false)`). Nothing to change.
- **“Your ceremony is coming soon.”** goes the moment the chapter is in `PC.story`, finished or not (`ceremonyBuilt`, the pass page's
  `o.ceremony`), as the Warrior Counts built it; and chapter 10's teaser in her book reads “Next” (E.teaser's `built: true`). Nothing
  to change.
- **Two things to change, once the Ceremony is finished** (found reading ui.js on main; both would be wrong only after it):
  1. **The hub hides every chapter teaser while the Counts are open** (`wHub`'s `hideSoon: true`, ~line 697), so after the Ceremony
     the hub would never show “A new adventure is coming soon”. `hideSoon` is true only until the Ceremony is finished:
     `hideSoon: !(p.finished || []).some(function (s) { return s.opensWhen === 'warrior'; })`, read from E.progress's `finished`
     list, never from its `latest` (the last chapter finished in number order: once a chapter 12 is finished `latest` is chapter 12,
     and a test on `latest` would hide every teaser again for good). It is derived inside `wHub`, so the line `renderHub` calls `wHub`
     with (pinned at `tests/warrior-ui.test.js:193`) stays as it is, and it is true for a `p` with no `finished`, as the existing
     tests pass in; and the hub's Read to me line under
     the Counts' slot (3606) says the teaser too (`… : WH.soon ? [{ text: WH.soon }] : p.soon && !WH.hideSoon ? [{ text:
     p.soon.title + ' is coming soon.' }] : []`).
  2. **Her book swaps the last teaser's lines for “Your ceremony is coming soon.”** whenever that teaser is not built and she has
     passed (`renderBook`, 3629 and 3630): after the Ceremony her book would promise the ceremony she just had, under “A new
     adventure”. The swap happens only while the Ceremony is not built (`… && !E.chapters(stories()).some(function (s) { return
     s.opensWhen === 'warrior'; })`), which is the only time it was meant for.
  Both lines are pinned by `tests/warrior-ui.test.js` (206, 210, 658): changed with them, a chapter-11 comment each, every other
  pinned line byte-identical, and one new `U.hub` case: chapter 11 and a stand-in chapter 12 both finished, `hideSoon` false.
- **Data and words beside it**: `PC.ui.flagWords.ch11Named` (section 1); `tools/shots.mjs`'s test cat takes `ending` (its SETUP copies `['name', 'petname', 'ending']`), so a look can be taken of a named cat.

### The storyboard's words (`tools/storyboard.mjs`)

Kept small: the tool already prints every new key in its generic words (`whenWords`: `offer is "mist"`, `nameHas is "moon"`,
`ending is "heart"`; `optWords`: “the moon, 15 evenings old”; an option's `ending` and the input's kind as plain keys), so it gains
only what a reader of a board would miss:
- **The `{ending}` legend sentence**: “`{ending}` is her warrior ending, `paw` until the Ceremony (Fernpaw, then Fernheart).” In the
  Warrior Counts' legend (storyboard.mjs line 1874, which `warrior.md` prints) always, and in the chapter legend (line 1996, shared
  by every chapter) **only when the story has `{ending}`** (`/\{ending\}/.test(JSON.stringify(story))`, as `{Murmur}`'s sentence is
  added), so `ch01.md` to `ch10.md` stay byte for byte and `ch11.md` has it.
- **The input kind `'ending'`**: “**Then she types her own ending** after her name, with a live preview (“You will be: Fernheart”);
  refused, kindly, with another try on the same screen: own name or no letter, Tallyheart: “…”; star, Glintstar: “…”; …”, from the
  frame's `refuse`.

**Chapters 1 to 10's storyboards regenerate byte for byte; `docs/storyboard/warrior.md` changes in exactly its three re-sit lines
(its 179, 436 and 451: `{name}paw` to `{name}{ending}`) and its legend's `{ending}` sentence.** `warrior.md` is the engine owner's
(section 10), regenerated with `node tools/storyboard.mjs app/story/warrior.js`, never hand-edited; without it
`tests/storyboard.test.js` fails it as stale.

### Tests (the engine owner's)

In `tests/engine.test.js`: `E.warriorOffers` over chapter 1's eight first parts × every row (each the row's first word but Moon's
moon) and the guard's examples (Amber, Honey and Hidden silver; Moonbeam and Moonlight silver; Mist, Misty and Mistle flash;
Wiggle, Fox and Deer climb; Bright sight; Dawn eye and flash; Otter wave; Ripple friend; a missing `ch10Best` truth, a missing
`specialty` noticing) and the triple rule's (Moss with swimming wave; Shell with climbing climb); `E.cleanEnding` and
`E.checkEnding` (both `(raw, cat)`) for every case `wname.txt` lists, and pawss, starss and kittenss refused, `fern×` cleaned to
`fern`; `E.choose` with an option's `ending` (and Mi keeps mist); `E.submitInput` refusing without storing and without setting a
flag, and accepting with the input's `sets` applied; the `'clanname'` branch (Fern with moon, offered, renamed Moon is Moonsilver;
Fern with leap renamed Fox is Foxclimb; a typed ending kept; a cat with no ending exactly as today); a skip's `name` in
`E.checkStory`; the token (`{name}{ending}` is `{name}paw` unnamed); E.matches'
`offer`, `nameHas` and `ending`; **an unnamed cat saved and migrated exactly as before** (no `ending` key appears), a named one
round-tripped, a bad `ending` dropped; `E.displayName`; `E.checkStory`'s new errors; `E.VERSION`. **The page's pieces in Node**:
`UI.ending`'s `preview`, `refusal` (every refusal kind and its speaker; the clan line's `who` for Tally+heart, Thyme+leaf and
Murmur+chime against Mutter's) and `prefill` (an offered ending never prefilled; a typed one is); the Warrior Counts' page labelling
her “A HUNDRED!” `{name}{ending}` for a named cat and exactly as today for an unnamed one; `renderSkip`'s tag from a skip's `name`
where the page's helpers reach it; the pinned lines above for the rest.

## 7. Known issues the text critics left

Checked against Draft v0.4. The text took two critique rounds (v0.2, v0.3) and a verify round with the leftover-lows and heart
critics (v0.4). Every low in `critique-known.json` (29) was applied by v0.4 but those below, and every editor's skip is either
applied another way (its reason recorded there) or listed here; the verify, leftover and heart-again findings were all applied in
v0.4 (`editor-again-r1/notes.md`: “Skipped: none outright”). What is still true of v0.4, and how the build handles it:

1. **The story is final at Draft v0.4.** No word of it changes. Where its italic notes and this spec differ, the spec is the build's
   (item 2).
2. **The story's notes this spec supersedes or settles** (she reads none of them; no line she reads changes):
   - *“climb ends “Up ANYTHING.”, reach “Nothing is out of reach.””*: both stand-ins keep “Up the curtains. Up the bramble arch.”
     and replace the last sentence (“And a climber’s leap: crouch, look, JUMP!”) with their own (f021).
   - *“Everything in My nest moves with her, the Hollow’s treasures too (the spec)”*: My nest is a page, not a place; nothing moves.
     The den's `nest` close-up draws her new nest with every thing her old one had (section 4).
   - *“Tallyheart sits down right beside her”* (the step-up Tap's response) and every “One tap: …, and the page turns”: drawn on the
     next frame where there is one to draw (Tallyheart at `BESIDE` from f013; the stone at the fountain's foot; every tail up on
     f032), not drawn where the page turns at once (item 4).
   - *“Her question is the prompt”*: the frame says “Good morning” and the fact's prompt is the question (section 2), so each is read
     once.
   - The ears' *“Tallyheart counts it”*: `teacher: 'tallyheart'`, a plain balloon (section 2); Tallyheart's paragraph is lettered
     across f010 and f011.
3. **Chapters 1 to 10 and the Warrior Counts draw and read byte for byte** for every live save: the camp's `moon` and the den's
   `nextNest` are off by default (the camp's tower moves only while its moon is drawn); the kit's waning rule reaches only ages 15
   to 27, which no shipped frame and no gallery sample uses; the den's list only gains a value; the token `{ending}` is `paw` and
   `E.displayName` is `{name}paw` for every cat without an ending, and no live save has one; the book's and the Case File's classes
   test the same name as before. **The proof**: the existing fingerprints (to `<ch10-fingerprint>`: chapters 1 to 9 and the Warrior
   Counts) and goldens (`tests/golden-ch07.test.js` to `-ch09`), which stop before chapter 10's own frames, **and the scenes owner's
   new `<ch11-fingerprint>`**, recorded from a snapshot of main at `2dee6a4` before any edit (in a process of its own, as chapter
   10's was): every frame of chapter 10 and every Warrior Counts scene (hashed as `ch10Fingerprint` hashes them), `kit.waxingMoon`'s
   output for ages 1 to 14 and 28 to 30 at a fixed `S` and tilt (every set's moon goes through it, the den's, tower's, pile's,
   field's, tracks', ferry's, riverbank's and island's), every camp camera and composition with `moon` off in each light with the
   crowd on and off, and every den camera with `nextNest` off. For the reading, `tests/story-ch10.test.js` and the `warrior-*.test.js`
   files, unchanged but for the pins section 6 lists. No golden owner (section 9, call 17).
4. **Can't be built literally, built nearly**: “Tap to flatten your ears… they go flat” (the page turns at once: the flat ears are
   never drawn; f004 draws them up); “she tucks it under her chin” while she walks in (in her mouth walking, under her chin sitting);
   “every tail in the ring goes up with hers” (the cast's tails go up; the crowd's seats have no raised tail, as the Warrior Counts'
   pass: their “Later art: every crowd tail raised”); “Thymeleaf hushes his leaves” (by the ferns, `kind`); “A dripping otter” (no
   `wet` on Riffle: the caption says it); “The moon climbs over the fountain” and “slides across the sky” (one moon a camera, by its
   age); “Far off, the river shines silver” (the camp's picture has no river: the caption says it); “The old tom leaves his pinecone
   beside you” (drawn as he sets it down, f040, and not again until first light: she holds one thing at a time, and through the watch
   it is the stone); “he hugs it” (the page turns at once); “you BOUNCE” (`stand` and motion lines); the warriors' nest (the den's
   `nest` close-up, no new place); “The sky turns pink, then gold” (the camp's `morning` light).
5. **Reading time at 90 words a minute**: the plain path is 16.2 to 16.6 minutes there (the story's For us), past the brief's 15; at the
   project's rate (chapter 10's way, 123) it is 12.6 to 12.9, inside it. Kept (the editor's skip 6, the leftover critic's verdict:
   the brief's minutes are at the project's rate).
6. **First light is the chapter's longest section** (8 screens, about 254 words, twice the ceremony's 4). Every screen has an
   interaction and pays a setup; the verify critic observed it and proposed no cut. Kept.
7. **One sign from Sprinkle, the stone's flash** (the brief's call 5 offers it “or” a puff of mist): the optional puff upriver was
   skipped (skip 4), and so was the optional “while you watched the river” for when the grey tom carried her things (skip 5). Kept.
8. **Typed names that are canon are hers** (Stormheart, Pebbleheart, Fernleaf, Hollyleaf from chapter 1's own suggestions): the story's
   rule, “canon or not, never swapped”; the guard list is for the offers only (section 9, call 5).
9. **Offers that are everyday words, harmless or unlikely, are kept** (the names critic): Starbright (a Star cat who notices),
   Watermark, Bookmark, Bluemoon, Sailormoon, Optimist. Only Honeymoon is guarded (`honey` under moon).
10. **The Clan-cat refusal names CrystalClan's three** (Tallyheart, Thymeleaf, {Murmur}chime; Glintstar is a star): a cat named Slosh
    who types bank becomes Sloshbank, ReedClan's (vanishingly rare; the names critic considered it and did not report it).
11. **Halves on the canon suffix lists** (mist, sky, bright, eye, sight, leap, splash, ripple, moon, and heart): words, not names, the
    brief's carve-out. For the README's echo list at ship (section 10).
12. **The first-part rule cuts a short name's own word**: a cat named Mi who types “mist” is Mist (her “Mi” dropped, “st” kept),
    not Mimist; Sun typing “sunny” is Sunny, as she typed it whole. The story's rule, literal; never refused, and Back lets her type
    again. Offered names never go through it (section 6).
13. **Frames: 57 or 58 as built** (56 or 57 specified), against the story's estimate of 44 to 52: the captions-first and five-box
    splits of section 5 add the rest, and the last screen's split one more (item 16). Under the brief's 90.
14. **A re-sit left partway within two hours**: a cat who passed, started “The Warrior Counts again”, answered a few and left within
    `E.WARRIOR_PAUSE_MS` sees Tallyheart's waiting line (`E.WARRIOR_WAITING`: “Your Warrior Counts are waiting at the fountain…”)
    over the morning count's first question, “Your first morning count as a warrior.”, and answering sets the re-sit aside
    (`warriorStale` `'practice'`). It is the rule for every chapter lesson since the Warrior Counts, nothing changed; chapter 11 is
    only the first chapter such a cat reads for the first time. Kept (optionally pinned in `tests/story-ch11.test.js`).
15. **A chapter-1 reread that renames a cat with a typed ending** joins the new first part to her ending unchecked: rare, but it
    can make a doubled name (Fern's typed `moon` after renaming her Moon: Moonmoon) or a Clan cat's (a typed `heart` after renaming
    her Tally: Tallyheart), which the Type screen's refusals exist to prevent. An offered ending is taken again from its row (section
    6), but a typed one is hers. Reversible by reading chapter 11 again; chapter 1's name input stays as it is. Kept.
16. **The story builder's departures, as built** (2026-11-01, `~/potomac-crossing-work/ch11/frames.json`): 57 and 58 frames, the
    last screen in two (f057, f058: its four boxes in one ran Back and Next under a 1080 x 720 screen); f023 on `reveal` and f031,
    f032 on `purr`, so the naming is not fifteen panels of one camera; the spots settled where the spec said “about” (RING_YOU,
    RING_TALLY, BY_FOOT, THYME, and WALK_YOU, WALK_TALLY, PAD and BOW added); our cat first in f029's cast for the motion lines;
    `tests/engine.test.js`'s play-through takes the first option shown where the scripted one is hidden.
17. **The review's round, as built** (2026-11-01, `~/potomac-crossing-work/ch11/review.json`, `integrate-r1/notes.md`): the mist stone
    lies on the old nest's moss till she takes it (f002 to f006, the Tap on her paw) and is held up in both forepaws in the new nest
    (f049), so it never lies under Riffle's stone for a chin cat; Glintstar `sit` on f039; no `sparkle` on f032 or f038; Thymeleaf
    at `ferns` on f032; the ring stays in the picture for the bounce (f029); the old tom and the grey tom purr on f031; a sleeper
    still at her den on f045; our cat `shout` for “TEN!” (f051); Tallyheart's “Ha!” after Glintstar's Counts name (f020); a word
    joiner after the old tom's leading ellipsis (f048); f028 is the crowd shot (no camera is closer); the pile's moon whole under
    the panel's top at every age (f042, and, live, chapter 9's f112, 8 units lower: the one change to chapters 1 to 10's
    drawings, named in `tests/golden-ch09.test.js`, against item 3); and on the page, wherever her
    first part runs on into her ending, one of her three offered words or a shouted word, a long name may break at the join (ui.js
    `richN`: captions, the endcap, balloons, the stack, the choices, her book); with Aa, a Tap page's “Tap to…” line stays beside
    Back (index.html; f019 and f034 ran Back under a 1024 x 700 screen; chapters 1 to 10's Tap pages gain room, nothing worse);
    her book's “Next” before she reads the chapter is Glintstar's pass line; the Type screen hands back only an ending she typed;
    an offered name is kept in her choices as `{name}{ending}`. Left as specified: `glow` on f026 and f028, f021 on
    `crowd`, and the bar's rules (a phone's bar cuts a warrior name over about 10 letters with an ellipsis; an iPad held upright cuts
    the chapter line after a 26-letter name).

## 8. What chapter 12 inherits

Chapter 12 opens module 2; the badger's track is its hook. Module 1 ends with chapter 11.

- **When.** Chapter 11 is one night and the morning after: the evening of her pass, the ceremony under the moon (one evening past
  full in the art: never named), the watch till first light, the morning count, and sleep in a warrior's nest the day after. No day
  is counted from the Gathering.
- **Who she is.** **{name}{ending}, warrior of CrystalClan**: her ending in `cat.ending` (an offered word, one of thirty, or her own,
  1 to 12 letters), `{name}{ending}` in the text, `E.warriorName` and `E.displayName` on the page. Chapters 1 to 10, read again, keep
  {name}paw, and so do her book's title, “{name}paw’s First Moon”, and her Case File's. The hub says “Warrior of CrystalClan”, and
  shows every chapter teaser again once the Ceremony is finished (`hideSoon` read from E.progress's `finished`, so chapter 12's
  teaser shows too). Our cat's balloon label defaults to `{name}paw`: a module-2 chapter sets `names: { player: '{name}{ending}' }`
  (the Warrior Counts' page already labels a named cat's balloons so). `ch11Named` (`offer` or `self`): how she was named. A
  chapter-1 reread that renames her re-takes an offered ending from its row; a typed one stays (section 7, item 15). Glintstar's words: “Welcome, warrior.”; the old tom's: “Morning, warrior.”
- **What she keeps.** Her new nest is with the warriors, beside {Murmur}chime's; everything from her old nest moved with her (her
  bark, her glass, Riffle's stone, the mist stone, grey by day and flashing in moonlight). My nest is unchanged but for its panel's
  label (“Your nest with the warriors”). The pinecone is the
  old tom's again. Her Case File is final.
- **Where they are.** The grey tom alone in the apprentices' den (who does the paw thing with him now is open: she does it from her
  new nest, LOUDLY, then in a whisper); {Murmur}chime asleep in the next nest (“Mice…”); Tallyheart, proud (“I’m still right
  here.”); Riffle home at the river (“See you tomorrow”); Waffles on her balcony, still calling her {petname}; the pile whole, forty,
  “not one piece gone”; the stash and the tunnel unshown since chapter 9 (whether the prey came home and the tunnel was closed is
  still open); Sprinkle home with her clutch (the stone says hello in the moonlight); the badger's old track on Gathering Island
  (“Who made it? Another day.”).
- **Flags**: `ch11Named`; nothing else new. Every earlier flag stands.
- **The Counts**: ten Counts, ten marks; the Warrior Counts passed, kept for good; a re-sit says her warrior name. Chapter 11 asks
  one question: 4 × 10, the pile (`ch11-pile`, read first; a miss makes it hard, a slow right never does), and two skip counts by
  taps (the ears, 2 to 16; the paw thing, 10 to 50); no new Count, no new mark.
- **Drawn now** (copy into continuity's places table at ship): the camp by moonlight (`moon`, silver, on `reveal`, `crowd`, `purr`,
  `fountain`, `fountain-close`; in the main composition the moon in the gap of a tower drawn lower while it shows); the moon past
  full (the kit draws 15 to 27 waning; the pile, field and tracks draw at most 15, their `moonAge` clamps, so a later age there needs
  their clamp raised; the den, tower, ferry, riverbank and camp take any age); the den's `moon: 15`; her warrior's nest as the den's
  `nest` close-up with `nextNest` ({Murmur}chime at `next-nest`, her own nest moved right).
- **Words on screen now**: warrior, the watch, a warrior's nest, “with the warriors”, “Every cat” (a label), the thirty endings as
  names. Not used: StarClan, vigil, warriors' den, Twoleg, kittypet, whisker-length, claw-length.
- **Standing rules, still**: as chapter 10's, and: the camp by night is moonlit and silver, never dark; the moon's shape is never
  named in the words.

## 9. Calls made

1. **Only the ending is stored, in `cat.ending`, an optional field absent until she is named.** Reason: `{name}{ending}` reads the same
   everywhere and a chapter-1 reread that renames her first part keeps both halves together (an offered ending taken again from its
   row when the new first part doubles, guards or triples it, since Glintstar would never offer Moonmoon or Foxleap; a typed one
   stays hers); an unnamed cat is stored exactly as today and the save stays version 2 (the Warrior Counts' `warrior` precedent).
2. **One token, `{ending}`, `paw` until she has one.** Reason: `{name}{ending}` is then `{name}paw` for every unnamed cat, so
   `warrior.js`'s three re-sit lines change their text and nothing she reads before the Ceremony; no second name token to keep in step.
3. **The offers are a choice and her own name an input**, the input kind `'ending'` the one new interaction. Reason: the story's
   **Choose** then **Type** on the next screen; a choice brings Back, Read to me, the corner's list and `when` for free.
4. **The engine computes the offers** (`E.warriorOffers`, from data beside it) **and the lines vary by two computed `when` keys,
   `offer` and `nameHas`.** Reason: the offered word depends on her name, so it cannot be a flag set by a choice; E.matches already
   has computed keys (`lessonClean`, `firstTry`); every reason line stays a line in the story file, read in the storyboard. A word
   is passed over when doubled, guarded, or when it makes three of one letter at the join (Mosssplash, Shellleap read as typos: the
   warrior-name critic's 23 over 509 first parts), each time to a word whose reason line the story has.
5. **The guard list is the names critic's** (every title on either wiki ending in one of the thirty words) **plus Honeymoon, and it
   guards the offers only; a typed canon name is kept.** Reason: the story is final and says so (“hers, canon or not, never swapped
   (the guard is for the offers only)”), as chapter 1 keeps a typed Hollypaw; the orchestrator's note listed “a typed canon name”
   among the guards, and the story overrules it (section 10).
6. **Fallbacks**: a missing `ch10Best` reads `truth`, a missing `specialty` `noticing`, and a row with all three words out offers its
   third. Reason: three names on every reading, even from a hand-edited save; truth is Glintstar's own word for her moon, noticing the
   game's first gift (the thirteenth sparrow).
7. **A typed ending is letters only, lower case, a leading first part dropped once, at most 12, refused only for her own name or no
   letter, star, paw, kit (any trailing s, kitten, kitty), or a Clan cat's whole name, in that order.** Reason: the story's rules; 12
   keeps the longest warrior name at 26 letters for the hub and an iPad's bar (14 + 12; on a phone's bar a name over about 10
   letters is cut with an ellipsis, as a long {name}paw already was: section 7, item 17). A refusal keeps what she typed, selected, and a
   second tap within the double-tap guard is ignored, so she always sees the real reason.
8. **Her warrior name shows wherever `E.displayName` does, and the hub says “Warrior of CrystalClan”; her book's title, the Case File's
   title, chapters 1 to 10 and our cat's default balloon label keep {name}paw.** Reason: the brief's call 8; module 1's book and case
   are the apprentice's, signed by the warrior she became. The label's exceptions are the pages after her naming that would
   otherwise tag her {name}paw beside her warrior name: chapter 11's balloons and f052's counter (their own `name`), and her
   balloons on the Warrior Counts' page (the page, for a named cat only). The grown-ups corner gains no row: its heading is
   `E.displayName` already.
9. **Once the Ceremony is finished, the hub shows the next teaser again and her book stops saying “Your ceremony is coming soon.”**
   Reason: as built, both would be wrong only after the Ceremony (found reading ui.js); the fix keeps every line before it. The hub's
   test reads E.progress's `finished`, never `latest`, so it still holds once chapter 12 is finished.
10. **The camp by night is the `camp` set with one new option, `moon`, moonlit and silver; the moon one evening past full, waning, is the
    kit's (ages 15 to 27).** Reason: the brief's “the moon is up (not full: it waned)”; no new place; no shipped frame draws an age
    past 14. The main composition's skyline leaves no room for a whole moon inside `crowd`, so one tower is drawn lower while the moon
    shows; the moonlight is the moon, its glow and one silver wash, inside the camp's own painters, so no shared painter (ferns,
    brambles, stones, dens, crowd, cast tint) changes for any set.
11. **Her new nest is the den's `nest` close-up with a new option, `nextNest`, {Murmur}chime in the next nest at its edge; the
    opening's den is `inside`.** Reason: no new place; the den's `inside` is the apprentices' rosebush; and the `nest` camera is too
    narrow for two cats apart in one nest (v0.1's raw spot had them touching, in one nest, not “the one next to MINE”).
12. **The ears are chapter 2's picture with eight `who` (five Clan coats, {Murmur}chime fourth, the old tom seventh, chapter 1's
    cheeky apprentice eighth) and `teacher: 'tallyheart'`; her paragraph is lettered across two panels.** Reason: the story's note;
    the skip's picture replaces the scene, so no other ears show; the count in her balloon; five Clan coats, never six, so a player in
    a Clan coat never sees one coat twice.
13. **The morning count is one fact with `help: 'picture'`, no fillers, the frame's “Good morning” and the fact's question.** Reason:
    the story's note; run to four misses.
14. **The Clan's calls are a Clan cat's balloon labelled “Every cat”.** Reason: chapters 4 and 8's precedent; a speaker in the picture.
15. **The teaser's title is “A new adventure”.** Reason: the hub letters a teaser as “… is coming soon”; module 2's first chapter has
    no name yet.
16. **The book page's seven lines are proposed here.** Reason: each true on every path; the story builder owns them.
17. **Two owners, no golden owner.** Reason: no new set, no new cast, nothing in chapters 1 to 10's frames can move; the existing
    goldens and fingerprints prove it to chapter 9 and the Warrior Counts, and the scenes owner's `<ch11-fingerprint>` (section 7,
    item 3) adds chapter 10's frames, the kit's moon and the camp and den with the new options off.
18. **The mist stone is always held** (`holdAt`), never a camp option; **the pinecone is drawn when set down and at first light.**
    Reason: no new art; she holds one thing at a time.
19. **`ch11Named` (`offer` or `self`, replaced) is a new flag, part of the warrior name**, past the brief's “none new besides her
    warrior name”. Reason: the two lines (f026) and the book line that differ by how she was named cannot be computed, since an ending
    she types may equal an offered word. `self` is set only when a typed ending is accepted. For continuity's flags table at ship.

## 10. For the orchestrator

- **Step 1, before the build (on main at `2dee6a4`), the stub** (run on a scratch copy: `stub-step.patch`, `stub-ch11.js`):
  - `app/story/ch11.js`: `PC.story.ch11 = { id: 'ch11', number: 11, title: 'The Warrior Ceremony', opensWhen: 'warrior', start:
    'f001', frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.', end: true } }, counts: {}, cards: {}, teaser: {
    title: 'A new adventure', lines: ['Out on Gathering Island, an old badger track lies in the mud. Who made it? Another day.'] } }`
    (two frames, so opening it finishes nothing), in chapter 10's wrapper.
  - Its script tag after `ch10.js` and before `warrior.js` in `index.html` **and** `dev/gallery.html` (the gallery must load what the
    page loads); `sw.js`'s `ASSETS` after `ch10.js`, and **`CACHE` 'potomac-crossing-v22'** (one past the ledger's v21); `node
    tools/storyboard.mjs app/story/ch11.js` for `docs/storyboard/ch11.md`.
  - **Two tests fail with it, both the orchestrator's to change with the stub**: `tests/story-ch10.test.js:2178` (chapter 10's teaser
    is now `built: true, next: 'ch11'`) and `tests/warrior-engine.test.js:1164` (its `readyCat` marks every chapter in `STORIES`
    finished, the Ceremony too, so the stand-in Ceremony reads open before the pass: it finishes every chapter but one with
    `opensWhen: 'warrior'`). With both edits: 1,687 tests, 1,687 pass. **`main` is never pushed while the stub stands.**
- **Step 2, the build: two owners, disjoint** (section 9, call 17):
  - **scenes**: `app/art/scenes.js` (the camp's `moon`, its tower gap and its moonlight; the kit's moon past full; the den's `moon`
    15 and `nextNest`), its tests in `tests/scenes.test.js` (first the `<ch11-fingerprint>` of section 7, item 3, recorded before any
    edit; a pin of this spec's wording, chapter 10's precedent at `scenes.test.js:5057`, never of `build.md`'s chapter 11 section,
    which the engine owner writes in parallel), and `dev/gallery.html` (new `EXTRA` entries only, each labelled “chapter 11: ”).
  - **engine**: the warrior name (`app/engine.js`, `app/ui.js`, `index.html`, `app/story/warrior.js`'s three lines,
    **`docs/storyboard/warrior.md`** (regenerated, never hand-edited: its three re-sit lines and its legend's `{ending}` sentence),
    `tools/storyboard.mjs`'s two additions (section 6), `tools/shots.mjs`'s test cat, `docs/build.md`'s "Chapter 11" section) and its
    tests (`tests/engine.test.js`, the pinned lines in `tests/warrior-ui.test.js` and `tests/warrior-story.test.js`, and
    `tests/storyboard.test.js`/`tests/tools.test.js` only where its words need a pin). Its Aa rules go in a new `@media` block of
    their own: `tests/aa-room.test.js`, which neither owner holds, stays untouched.
  - Neither holds `app/story/ch11.js`, `tests/story-ch11.test.js` or `docs/storyboard/ch11.md` (the story builder's, later), nor
    `tests/sw.test.js`, `tests/warrior-engine.test.js` or `tests/story-ch10.test.js` (the orchestrator's).
- **Step 3, the story builder** writes `app/story/ch11.js` from section 5 on the built engine and art, with its test and storyboard,
  and checks chapter 10's teaser test still holds.
- **Engine need**: the warrior name, as section 6 designs it (the brief's one). Record it in the README under "Claude's calls under
  decision 46" with chapter 10's precedent (a data key read by one chapter, chapters 1 to 10 unchanged), and that the save gains one
  optional field, `ending`, and stays version 2.
- **The orchestrator's note and the story**: the note listed “a typed canon name from the names critic's guard list” among the guards.
  The story, final, keeps a typed canon name (“hers, canon or not, never swapped (the guard is for the offers only)”), so the guard
  list guards the offers only (section 9, call 5). Reversible by one line in `E.checkEnding` if Aron wants it otherwise; no word of
  the story would change, but the refusal would need a line the story does not have.
- **README** (end of the spec phase): section 9's calls in short under "Claude's calls under decision 46". At ship, the echo list
  takes: the warrior endings that are halves on the books' suffix lists (section 7, item 11), “Welcome, warrior” (two words of the
  books' ceremony), a night's watch after the naming (the books' vigil, “the watch” here), the Clan calling the new name (the books'
  shape, our words).
- **`docs/continuity.md`** (ship): section 8; `ch11Named` in the flags table (section 9, call 19); `ending` in the save; the places
  table (section 8, "Drawn now"); the warrior's nest; **the Counts table, row 11**: no new Count; skip-count Taps: eight cats' ears,
  2 to 16 (Tallyheart counting, `carry: false`), and the paw thing, both forepaws, 10 to 50; no warm-up, no lesson; story question:
  the morning count, 4 × 10 (`ch11-pile`, read first, help lights the rows 10 · 20 · 30 · 40); 1 typed answer on every reading;
  marks 10 (no new mark).
- **`docs/build.md`** gets a short "Chapter 11" section from the engine owner: the warrior name (pointing to section 6), the camp's
  `moon`, the den's `nextNest` and the moon past full in a line.
- **`E.VERSION`** '0.11.0 (chapter 11, <ship date>)'; `CACHE` v22 unless the ledger moves (checked again at the ship).
- **Frames**: 57 on an offered reading, 58 naming herself, f058 the end (as built; the brief's cap 90).
- **The ship's look** (at most 25 pictures, silent): the camp by moonlight (`reveal` with the ring, `fountain-close`); the ears
  picture; a name screen of each row and the choice of three; the Type screen with a refusal balloon; “From tonight”; the purr and the
  call with the tail Tap; Riffle at the hedge; Waffles by night; the stone flashing at the fountain's foot; the watch; the pile by
  moonlight; first light; the morning count and its help (the rows lit); the new nest with {Murmur}chime; the paw thing; the last
  frame; and after the Ceremony, with a long name (14 + 12 letters) at 390 x 844 and 1080 x 720, Aa off and on: the bar, the hub
  (“Warrior of CrystalClan”, “A new adventure is coming soon”, “The Warrior Counts again”), her book (title, signature, chapter 11's
  page, the teaser), My nest, the grown-ups corner, and a re-sit's halfway page.
- **The engine owner's own looks** (before the ship's; at most 12, silent): the longest name (14 + 12) on the bar, the hub, “Who's
  playing?”, the book's signature and My nest, **and the Type screen's row and preview with a 14-letter first part** (on a scratch
  frame of kind `'ending'`: the real f025 is the story builder's), at 390 x 844 and 1080 x 720, Aa off and on. Where the row does
  not fit, the field wraps under her first part (section 6).
