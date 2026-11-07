# Chapter 12 spec: A Spark at the Hedge

*v0.2 · 2026-11-07 · v0.2 applies the spec critics' findings (continuity, Counts, kit, Spanish; their runs in
`~/potomac-crossing-work/ch12/critic-*/`, the editor's list in `ch12/spec-editor/notes.md`). No word of the story changes.*

*The build's contract for chapter 12, beside `docs/build.md` and the take-aways kit's design (`docs/take-aways.md` v0.3).
The story, [`12-a-spark-at-the-hedge.md`](12-a-spark-at-the-hedge.md) (Draft v0.4, final), is the source of every word she
reads. This spec adds no line she reads except the instruction lines under a panel (each Tap's `prompt` is the story's own
**Tap** line; a `label` is the hidden button's words), the dream's placeholder, the book page, the teaser's title, the
three Counts sets' `alt`, and Chispapaw's lines for Count the store (which the kit's section 5 leaves to this chapter). Where
the story's italic notes and this spec differ, the spec is the build's (section 7, item 2). Names in `code` are fixed: the
engine, the art, the storyboard words and the story builder use exactly these.*

*Decisions 53 and 54 bind it: 53 (Aron's: multiplication kept fresh, three-digit take-aways, a Spanish-speaking friend, the
words easy to change) is why the chapter has a Counts warm-up, a take-aways lesson, PC.words and Spanish; 54 (her own
apprentice) is why the mentor screens give Chispapaw to her. Every other call is Claude's under decision 46 (section 9),
each Aron's to reverse.*

*Run, not guessed. The three Counts sets of section 2 were run on a scratch copy of the take-aways tree
(`~/potomac-crossing-ta`, branch `take-aways`, as it stood at 15:10 on 2026-11-07) with a stub chapter 12:
`E.checkStory` and `E.checkTakes` clean (with and without the `echo` keys); every problem of kind `none`; the take lesson
played through `E.takes` (the worked example's column lines, the right line waiting for Next, a helped 475 − 132 queuing
its twin 565 − 411 with no prompt and no right line); the warm-up played through `E.counts` on a cat with two hard facts
(9 × 6 and 7 × 8 asked first in their anchors' words, the remembered line on 7 × 8, 3 × 9 the set's own); `E.countSets`
still chapter 10's ten; `E.TAKE_WORDS` with this chapter's PC.words the kit's English, key for key. The stub of section 10
was run there too: twelve chapter-sensitive test files and four engine files, five failures, each named in section 10.
Scripts and output: `~/potomac-crossing-work/ch12/spec-writer/` (`sets.js`, `base-run1.txt`, `stub-run1.txt`,
`stub-run2.txt`); detail in its `notes.md`.*

*The tree it is built on* (the orchestrator's): **main, after the take-aways kit (phases 1 to 3) and book two are merged**.
Chapter 12 codes against the kit's API as `docs/take-aways.md` v0.3 names it and the take-aways tree builds it: take sets
(`op: '-'`) on Counts frames, `E.takes`, `runTakes` and its problem end (its `o.echo` hook left for column echoes),
`E.storeOpen`, the shelf and Count the store,
`warmHard: { table: 'all' }`, `PC.art.placeValue`, `PC.art.kit.quick`, `E.numberWords`, `E.TAKE_WORDS` reading `PC.words`,
and book two's `module`, `book.title` and `book.store`.

**In one line: the build is Spanish (the chapter's one engine feature: PC.words, `{es:key}` tokens, the lettering, the Spanish
voice, the friend's echo on the take page and the Counts page, a Spanish count by taps), Chispapaw (the one new cast
member, and cats that carry a mouse), the store (a new camera on the `bridge` set), the kit's store picture and quick
marks placed in the Training Hollow (hollow options), and the den's moon at 16. No new flag, no card, no new Count, no new
place.**

---

## 1. Flags

**None new.** Every choice sets nothing (`sets: {}`). Four of the seven choices give each option its own reply on the next
screen: those options go to frames of their own (section 5), which meet again, so no flag is needed. The grown-ups corner
gains no flag words.

| Read here | Values | Where | Lines |
|---|---|---|---|
| `specialty` | `noticing`, `climbing`, `sneaking`, `friends`, `swimming` | f013 (the hedge: three captions and one balloon by `when`); f062 (Riffle: `swimming`) | one line each; a missing `specialty` shows none |
| `ch10Best` | `sprinkle`, `friends`, `truth`, `counts` | f057 (the dry den) | one caption each; none if missing |
| `ch2Stone` | `nose`, `chin` | f071 (bedtime) | one caption each; none before chapter 2's choice |
| `{petname}` | a token, not a flag | f011 (Waffles) | once |

Read by tokens as always: `{name}{ending}` (her warrior name), `{Murmur}chime`, `{they}`/`{them}`/`{their}` (the book).
`ch11Named` is not read. No route flag, no pick flag, no found flag.

## 2. Counts sets

**Nine typed answers on every reading** (three Counts, six take-aways) **and one count by taps** (the paw thing, 5 × 10,
in Spanish). Every key below is one the engine has, or the kit has, except `echo` (on two sets) and the skip's `lang`,
which are the Spanish feature's (section 6).

### Every fact, in the order she meets it

| # | Where | Fact | How | Picture |
|---|---|---|---|---|
| 1, 2 | The Hollow, the warm-up | her two hardest of the 54 pairs (`E.warriorHard`); with none, 6 × 7 and 8 × 4; with one, it and 8 × 4 (3 × 8 if her one is 8 × 4) | typed (`ch12-warm`) | each in its anchor Count's picture, on the sand (`E.questionDef`) |
| 3 | the same | 3 × 9, or the first `alt` that is no pick | typed | the 3s' picture, or the alt's anchor's (each alt carries its `table`) |
| 4 | The Hollow, worked | 254 − 131 = 123 | take, `'show'` (`ch12-take`) | the kit's store picture |
| 5 to 8 | the same | 58 − 23 = 35, 76 − 42 = 34, 475 − 132 = 343, 368 − 145 = 223 | take, `'hers'` | the same |
| 9 | Sunset at the store | 175 − 42 = 133 | take (`ch12-store`, `twins: false`) | the same |
| – | Bedtime, the paw thing | 5 × 10 (50) | a skip, five taps, nothing typed, the count in Chispapaw's Spanish | her two forepaws (chapter 4's bedtime tens) |

The written problems' answers are all different (123, 35, 34, 343, 223, 133; 322 for the spare; a helped problem's twin
may rarely land on the store's 133: section 7, item 15), every take-away is of kind `none` (no spread), and nothing in the
chapter is a Count (`E.countSets` is chapter 10's ten, run).

### `ch12-warm`, the Counts warm-up (Counts frame f042, `intro: false`)

```js
'ch12-warm': {
  teacher: 'tallyheart',
  // the kit's cross-table warm-up (docs/take-aways.md, section 4): her hardest at 0, her next at 1; the third the set's own
  // each alt with its E.warriorAnchor table (3, 4, 9): warmAcross copies an alt as written, and one with no table would be
  // asked through this set itself ("Three cats. How many tails?" for 3 × 8: critic-counts' warm.js, 108 of 8,748 questions)
  warmHard: { table: 'all', at: [0, 1], alt: [{ a: 3, b: 8, table: 3 }, { a: 4, b: 7, table: 4 }, { a: 9, b: 6, table: 9 }] },
  facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }],   // each one of the 21 pairs of 3, 4, 6, 7, 8, 9
  praise: [], fast: [], done: '',
  // the Spanish feature (section 6): her first right answer, a retry's counted
  echo: { on: 'first', lines: [
    { who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' },
    { who: 'chispapaw', text: 'My little Tall One says these every night! I never knew what they MEANT.' }
  ] }
}
```

- **The words** (run): the frame shows Tallyheart's "First, three Counts, to wake up your whiskers." and "Let's count!";
  `intro: false`, so the first question appears with the engine's own words alone and is timed on itself (the kit's rule).
  Each question in its anchor's words ("Seven spiders. How many legs?" for 7 × 8; "Six cats. How many lives?" for 9 × 6:
  the Hollow is on land). No set has `table`, and every fact, pick and alt carries one, so all three are asked through
  `E.questionDef`'s anchor branch, on the sand (an alt 3 × 8: "Eight patrols. How many cats?", run).
- **Right** (run): nothing (`praise: []`, `fast: []`), and the next question follows, except a hard pick right and quick,
  which gets the engine's `remembered` line ("Last time 7 × 8 made you stop and think. Not today!"), a slow one
  `rememberedSlow`, and a retry the `again` line.
- **The echo** (section 6): on her first right answer in the lesson, whichever it is (a pick, the set's own, a retry), the
  line that answer earned (if any) is Tallyheart's balloon, then Chispapaw's Spanish fact, in the order it was asked
  ("¡Siete por ocho, cincuenta y seis!" with "(Seven times eight, fifty-six!)" under it), then her English line; the three
  wait for Next, as a fact's `right` lines do, and the next question's clock starts after them. Once a lesson.
- **A miss**: the anchor Count's help on the sand (the kit's), the fact back two questions later; never a wall.
- **`alt`**: a set fact that is a pick's pair gives way to the first of 3 × 8, 4 × 7, 9 × 6 that is no pick's pair (the
  kit's rule; three so one is always free), each written with its anchor's `table` (3, 4, 9), so it is asked in its own
  Count's words and picture. It happens whenever a pick is 3 × 9, or her one pick is 8 × 4 (fact 2 is then 3 × 8).
  `done: ''`: f043 answers.

### `ch12-take`, the lesson (Counts frame f048, `intro: false`)

```js
function T(text) { return { who: 'tallyheart', text: text }; }
var NO_SPREAD = { extra: { tens: 'Let’s scratch it out.', hundreds: 'Let’s scratch it out.' } };   // see "The `extra` slip" below
'ch12-take': {
  op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '', lines: NO_SPREAD,
  facts: [
    { a: 254, b: 131, regroup: 'show',
      prompt: 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.',   // the kit's twelve words
      right: [T('One square, two rows, three loose left.')] },
    { a: 58, b: 23, prompt: [T('Now you try, all by yourself. Little take-aways first, then big.'),
      { who: 'chispapaw', kind: 'whisper', text: 'My little Tall One always sighs at homework.' }] },
    [76, 42], [475, 132], [368, 145]
    // (if play shows the lesson is fast: [589, 267] after [368, 145]; if it drags: [368, 145] goes, the kit's first cut)
  ],
  echo: { on: [[475, 132]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] }
}
```

- **The worked example** (run): `'show'`, so every column's line is full and says its top: "Ones first. Four take away
  one." "Now the tens. Five take away three." "Now the hundreds. Two take away one." She types each digit as Tallyheart
  says it. On the first column the prompt's balloon and "Ones first. Four take away one." are one balloon (the kit's join:
  both Tallyheart's); Read to me says the prompt, "Two hundred fifty-four take away one hundred thirty-one.", then the
  column's line. The kit's "A row is a ten. A square is a hundred." is said once, before the tens column's line (section 6,
  "The kit's school words"). Right in every column: "One square, two rows, three loose left." (Tallyheart), waiting for
  Next. Helped: the kit's "And you finished it. We'll do one like it soon." and its twin comes back as `'tap'`.
- **58 − 23**: the prompt is two balloons, Tallyheart's (eleven words) and Chispapaw's whispered sigh; the column's line
  follows in a balloon of its own (the last prompt balloon is not the teacher's), full, the set's second problem. Its twin,
  if helped, is asked plainly: no prompt, no sigh, only the kit's "One like it." **No twin in chapter 12 carries a prompt or
  a right line** (the kit's queue copies neither, run; pinned by the story test).
- **The rest**: the kit's lines, praise and help (no `praise` key: the kit's own). 76 − 42 on has the column's name alone.
- **The echo** (section 6): after 475 − 132, right or helped, its twin never (a twin never has its top), Chispapaw's
  "¡Trescientos cuarenta y tres!" with "(Three hundred forty-three!)" under it, after the kit's end line. No column is ever
  echoed, and never «menos» (call 6 of the story).
- **The ones-first pointer** is on (`teach: 'none'`): a first digit equal to the answer's leading digit is not checked.
- **The `extra` slip** (`lines: NO_SPREAD`, on this set and `ch12-store`): on a problem with no spread the kit names a
  later column's top − 1 − bottom digit `extra` (12 of the 171 wrong digits on the chapter's seven problems: critic-counts'
  `extra.js`), and its line, "Careful. The loose had enough, so no row went. …", talks about spreading the day before
  spreading is taught (the brief: "no spreading yet"). The set overrides that one line (a kit key, the same kind:
  `E.checkTakes` clean, run), so the help is word for word a `fact` help: "Let’s scratch it out." / "Seven rows take away
  three rows." … The slip is still logged `extra` (section 7, item 16).
- `done: ''`: f049 carries the story's two "Done" balloons. Finishing this set opens Count the store (`E.storeOpen`).

### `ch12-store`, the store's catch (Counts frame f059, `intro: false`)

```js
'ch12-store': {
  op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, twins: false, done: '', lines: NO_SPREAD,
  facts: [{ a: 175, b: 42,
    prompt: [{ who: 'glintstar', text: 'How many stay in the store, {name}{ending}?' }],
    right: [{ who: 'glintstar', text: 'One hundred thirty-three in the store.' }] }]
}
```

- The frame (f059) letters Glintstar's "One hundred seventy-five pieces today. Forty-two go to tonight's pile. The rest stay
  here." and "Let's count!"; the take page opens on her question (her prompt, seven words), then Tallyheart's column line
  in her own balloon. Its first problem, so the lines are full: "Ones first. Five take away two." "Now the tens. Take away
  four." "Now the hundreds. Nothing to take." (her first two-digit number under a three-digit one; the kit's line carries
  it, section 7, item 5). Right: Glintstar's line, waiting for Next. Helped: "And you finished it." (no twin). At the
  hundreds, a 0 typed, or OK on the empty box (read as 0), is an `extra` slip: with `NO_SPREAD` its help opens "Let’s scratch it out."
  / "Nothing to take." / "One square.", never "no square went".
- **`teach: 'none'`, for the pointer only**: her sixth take-away, so without it the ones-first pointer is off (the kit's
  `pointerOn`: `teach: 'none'` or fewer than five logged), and a leading 1 typed first would be checked as a miss and
  the sand's help would take Glintstar's right line from her (critic-counts' `takes.js`). The step is the lesson's own
  (`E.checkTakes` clean: every take-away needs no spread; `E.takeSteps` already has `none`). `done: ''`.

### The paw thing (skip, f074)

```js
skip: { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es', carry: false, prompt: '**Tap** your forepaws.', next: 'f075' }
```

Chapter 4's bedtime tens: her own two forepaws on the moss, ten claws a tap, the big digits 10 … 50 over them as it grows.
The count is in **Chispapaw's** balloon, out loud (not murmured), in Spanish words (section 6, "The Spanish count"):
"Diez…", "Diez, veinte…", … "Diez, veinte, treinta, cuarenta, ¡cincuenta!", and with the fifth tap its English under it,
"(Ten, twenty, thirty, forty, fifty!)"; then the page waits for Next (a Spanish count never turns its own page). Read to
me says each number in the Spanish voice. `carry: false`: the page it turns to shows no big 50 (the skip page itself
showed it, and waited). The hidden button: "Tap your forepaws." (the engine's, for `paws: 'both'`).

## 3. The Case File

**No card**, given or shown (`cards: {}`). Module 2 has no Case File (module-2's "Between chapters"); module 1's is final.
The Case File's button stays where it is; its title stays "{name}paw's Case File".

## 4. Art needs

**New: one cast member, `chispapaw` (and her entry in `scenes.js`' `CAT_IDS`); `holds: 'mouse'` for cats (drawn until now
only for the weasels); a `round` key on the kit's quick marks (Chispapaw's cookie square); one camera on the `bridge` set,
`store`, with its spots and two options; four options on the `hollow`; one value in the den's `moon` list (16); one spot
on the `garden`, `hedge-right`. Nothing else is new.**
Every new option is off by default and every new camera and spot additional, so chapters 1 to 11, the Warrior Counts and
the kit's pages draw byte for byte (section 7, item 3). **Never dark**: the camp by night is moonlit and silver (the moon
16, waning, never named by its shape). Times of day: `morning` in her warrior's nest at noon (the den's brightest drawn
light); `day` from the midday count to the walk; `sunset` at the Old Bridge; `night` from bedtime to the end.

### Places

| Set | Cameras the chapter uses | Options | New |
|---|---|---|---|
| `den` (`scenes.js`) | `nest` (her warrior's nest: noon, bedtime, the dream); `inside` (the apprentices' den: Chispapaw and the grey tom) | her nest: `{ weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true, miststone: true }`, with `moon: 16` at night; the apprentices' den: `{ weather: 'clear', moon: 16 }` (her old nest plain moss) | **`moon` gains 16** |
| `camp` (`scenes.js`) | `crowd`, `reveal`, `fountain`, `purr`, `entrance` (by `day`); `reveal` (night) | `crowd: true` by day; `moon: 16` at night (the camp asleep) | nothing (the camp's `moon` takes any age; `day` is drawn by no camp frame before: checked, section 4's camp note) |
| `tower` (`scenes.js`) | `up`, `balcony`, `balcony-close` (by `day`) | `{ chime: true }` | nothing |
| `garden` (`scenes.js`) | `hedge`, `hedge-close` (by `day`) | `{}` (no sparrows on these cameras) | **spot `hedge-right`** |
| `room` (`scenes.js`) | `outside` (dusk: the memory, f016) | `{ door: 'closed', clan: true }` | nothing |
| `hollow` (`scenes.js`) | `lesson` (by `day`) | `H12 = { marks: 10, glow: 'auto' }` on every frame (her ten claw marks on the leaning tree, as chapters 2 to 10 carry them), with **`store`, `storeGlow`, `quick`, `tap`** on top | **four options** |
| `riverbank` (`sets/riverbank.js`) | `path` (by `day`: the walk) | `{}` | nothing |
| `bridge` (`sets/bridge.js`) | `bank`, `under`, `back` (sunset), **`store`** (sunset) | `back`: `{ stones: true, prints: true }`; `under`: `{ prints: true }`; `store`: **`store: 175`** or **`133`**, **`tap: 'store'`** | **camera `store`, its spots, option `store`, `tap: 'store'`** |

#### The store (`sets/bridge.js`, camera `store`)

- **`store`**, a composition of its own (as `wall`, `print` and `paws` are): **the dry den**, the very back of the dark
  under the Old Bridge where Sprinkle slept, at cat height: the old stone leg's big fitted stones at the left (Coil is not on
  screen), the nook's heap of old stones at the back, and in front **the dry floor**, wide
  and flat, taking the lower half of the picture; the way in at the right, where at `sunset` long gold shafts reach in (as
  `under` and `back` take the low sun) and at `dusk` a soft rose light. By day (the set's default) the floor is lit softly
  from the way in. Night on this camera is chapter 14's (module-2: "built and costed in chapter 14's window").
- **Option `store`** (a number 0 to 999, off by default; 0 or off draws the bare floor): the store laid out on the floor,
  **the kit's own picture**: `PC.art.placeValue({ hundreds, tens, ones, kind: 'store', small: true })` for the number
  (`taken`, `fresh`, `spread` and `glow` empty; `small`, since no spread ever happens in a scene: without it the picture is
  1600 × 806.8 at every number, its lower half the spread trays' empty mats). Drawn flat on the floor, low in the picture,
  **at one fixed scale with its top edge fixed** (never centred: `small` crops by number, 175 to 335.4 high, 133 to 206,
  so a centred box would move the pieces between f058 and f060; fixed, 133 lies where 175 lay, 42 fewer). Its keep box is
  sized for the store at 999 (1600 × 710 at that scale), in `S.keep` (no lettering on it). Chapter 12 draws 175 (one
  square, seven rows, five loose) and 133 (one square, three rows, three loose). Never a number the story does not say: no
  frame draws the store while it is being carried in (section 5).
- **`tap: 'store'`** (with `store`): the placed picture is the Tap target, an unpainted `<g class="pc-tap pc-tap-store">`
  over its box (the bridge's `tap` gains `'store'` beside `'none'` and `'print'`).
- **Spots** (the camera's own; depth by its floor): **`store-left`** (front left of the store, facing right),
  **`store-right`** (front right, facing left), **`store-back-1`**, **`store-back-2`**, **`store-back-3`** (behind the
  store, a step back each, side-on, facing either way) and **`way-in`** (at the right by the way in, walking in, facing
  left). **Chapter 12's places** (f058 to f061): our cat at `store-left` (she reads the store and carries f060's Tap),
  Chispapaw at `store-right`, Glintstar at `store-back-1`, Tallyheart at `store-back-2`, {Murmur}chime at `store-back-3`,
  the old tom at `way-in`. **Acceptance** (the sets owner, with `tools/frames.mjs`, a `clancat` stand-in at 0.78 until
  `chispapaw` lands): those six at once, listed back to front by their spots' depth (the sets owner reports the order for
  the story builder), with no two touching and no cat's box over the store's; the store whole at 175 and at 133, its
  squares, rows and loose each countable at 1080 × 720 and 390 × 844, and 133's pieces where 175's were.

#### The Training Hollow (`scenes.js`, the `hollow` set)

All on `lesson` and `sand`, in **one fixed box** of the sand, a constant as `HOLLOW_COMPARE` is (chapter 7's `compare`
is the precedent: a fixed place, not a rule), its box in `keep`: about **x 770 to 955, y 850 to 900** on `lesson`, the
sand between our cat's nose and Tallyheart's paws, clear of the claw marks' keep (x 93–100%, y 11–47% of the camera); the
sets owner settles it with `tools/frames.mjs`. **Chapter 12's staging** (f041 to f049): Tallyheart at `tree` (facing
left); our cat at a raw spot about **`{ x: 690, y: 892 }`** (facing right: at `sand-left` her tail would meet Chispapaw's
nose, 19 units of overlap sitting, 58 crouching; at 690 she sits at x 590–766, 31 clear: critic-continuity's
`measure.js`), named `HOL_YOU` in the story file as chapter 11's `RING_YOU` is; Chispapaw at `sunpatch-3` (facing right,
behind our cat). The sets owner settles the point and writes it in its notes for the story builder.
- **`store`** (a number 0 to 999, off by default): the kit's store picture laid flat on the sand, **as the plan of the
  store, never prey** (at noon the store is empty: "The store’s empty till sunset, so let’s pretend", and 500 is the
  full-moon target): `PC.art.placeValue({ hundreds, tens, ones, taken: { hundreds, tens, ones }, kind: 'store', small:
  true, glow })`, every piece `taken`, so each is the kit's pale, dashed pressed place (a ghost, never eaten): five empty
  squares to fill. Chapter 12: 500, five squares.
- **`storeGlow`** (`'hundreds'` or `'tens'`; off by default): passed to it as `glow`, the kit's glowing zone. Chapter 12:
  `'hundreds'`, the five squares glowing ("Tap the squares": the glow is the Tap's answer, on the next frame).
- **`tap: 'squares'`** (with `store`; the hollow's first `tap`, `['none', 'squares']`): **the whole placed picture** as
  the Tap target, an unpainted `<g class="pc-tap pc-tap-squares">` over its box, as the bridge's `tap: 'store'` is (the
  squares zone alone is 313 of the picture's 1600, under 44 px at 390 × 844; the response, f045, glows only the squares).
- **`quick`** (`0`, `1`, `2` or `3`; off by default): the quick way to scratch a count, scratched in the sand, one set of
  marks each, **right to left**, a little apart, so Tallyheart's set lies at her paws and yours at yours: 1, Tallyheart's
  (nearest `tree`); 2, and Chispapaw's beside it; 3, and yours beside hers (nearest our cat). Each set is a square, a line
  and a dot (one hundred, one ten, one loose), drawn by the kit's marks (`PC.art.kit.quick(x, y, scale, { hundreds: 1,
  tens: 1, ones: 1, ground: 'sand' })`), except **Chispapaw's square, which is drawn round, like a cookie** ("Her square
  looks like a cookie."): `round: true` on her set, a new key of `PC.art.quickMarks` (the cats owner's, since the kit's
  strokes, `GROUNDS` and `qkMark`, are private to `cats.js`; `kit.quick` passes it through): the square's stroke drawn as
  a soft wobbly ring, no crumbs, nothing beside it that could be read as another dot. Never with `store` on one frame
  (chapter 12 never asks).
- **Acceptance** (the sets owner, `tools/frames.mjs`, a `clancat` stand-in at 0.78 until `chispapaw` lands): on f041 to
  f049's opts, the three cats with none touching (our cat `sit` everywhere, f047 included: its Tap is `paw` on `sit`, since
  a crouch reaches x 805, into the marks), nobody over the box; the five glowing squares read as five; the three sets of
  marks read apart and her ring reads round, at 1080 × 720 and 390 × 844 (until `round` lands, the stand-in square marks
  its place; the orchestrator looks again after both owners).
- Off, every hollow frame of chapters 1 to 11 and of the Hollow's pages draws byte for byte.

#### The den, the garden, the camp

- **The den's `moon` gains 16** (`[false, true, 5, 8, 13, 14, 15, 16]`): day 1's dusk, one evening past chapter 11's 15, in
  the doorway's patch of sky on `inside` (`denMoonAged` takes any age from 8; the kit draws 15 to 27 waning). Used on
  `inside` (f073 to f075, f080) and set on `nest` beside it (the close-up shows no sky).
- **The garden's spot `hedge-right`** (`main`): a third cat at the hedge, on the lawn just right of the gap, facing left,
  inside `hedge`'s box (`[1100, 420, 500]`, only 500 wide: x 1100 to 1600), so our cat at `hedge-side`, Chispapaw at
  `hedge-gap` and Tallyheart at `hedge-right` stand three in a row with the little cat between, none touching. About
  `A(1548, 724, 222, 'left')`, Tallyheart's tail cropped by the frame's right edge (at the first guess, `A(1530, …)`, she
  spans x 1452–1607: she touches the little cat and runs past the edge; at 1548, 13 to 32 units clear: critic-continuity's
  `measure.js`); the sets owner settles the point. **Acceptance** (`tools/frames.mjs`, a `clancat` stand-in at 0.78 until
  `chispapaw` lands): f015, f017, f020 and f021's casts, our cat `sit` and `walk`, Chispapaw facing right and facing left,
  none touching.
- **The camp by `day`** (no new art): no camp frame has been drawn at `day` (only morning, sunset, dusk, night). The sets
  owner renders `reveal`, `crowd`, `fountain`, `purr` and `entrance` with `crowd: true` at `day` and looks at them.
- **The garden's `hedge` and `hedge-close` by `day`**, the tower's `balcony` by `day`: drawn by no frame before at that
  light, drawn by the set's own palette (the garden's `wide` and `step` and the tower's `up` and `balcony-close` are at
  `day` already); the sets owner looks at each once.
- **One rule for the day looks** (section 9, call 19): if any of them reads wrong (too pale, the towers' glow off) and
  cannot be fixed in `scenes.js` without changing a frame chapters 1 to 11 draw, the whole midday run, **f005 to f053**,
  is drawn at `morning` instead, so the light never flips between camp, garden, tower, Hollow and path. The sets owner
  says which in its notes; the story builder follows it.

### Cast

Every cat side-on, facing left or right. **No two cats touch** (no nose-touch: the mentor's moment is a dip of the head).
No grown cat in `laugh`. Crowded casts listed back to front.

**New: Chispapaw** (`chispapaw`, `cats.js`; a cat: every cat pose and mood).
- **Her look** (module-2's "Who is new", the brief's call 5): a small, sleek she-cat in **a pointed coat**: a cream body
  (warm pale cream, lighter on the chest and belly) with **dark brown points**: the face (a soft mask, darkest at the nose
  and muzzle, fading toward the cheeks), the ears, all four paws to the wrist, and the tail; **big ears** (`earS` about
  1.3); **blue eyes** (bright sapphire, plainly blue at panel size); a little smaller and slimmer than {Murmur}chime (her
  `scale` 0.8; Chispapaw's about 0.78, `bulk` about 0.85, slim legs and tail: the slimness and the big ears make her look
  young, not the size alone). Her preset is her size: no frame adds `size` to her (f022's 0.8 is struck). **A pillow cat's collar**: narrow, red, with a tiny round gold bell at the
  throat, drawn whenever she is (the bell's *ting* is lettered, never drawn as lines).
- **New preset keys, hers alone** (`coat: 'chispa'`): `points` (the points' colour), `collar` (true on her preset),
  `bell`; no other cat draws differently.
- **One new extra, `collar: false`** (on `chispapaw` only; absent is the collar on): no collar, no bell, for the morning
  she leaves the bell in her nest (chapter 13's, module-2). Chapter 12 never sets it.
- **Not like anyone**: no look among the chooser's nine is pointed; her cream body is near the `cream` look and CLAN
  variant 3, so **the points are what set her apart**, and must read at panel size: face, ears, paws and tail clearly dark
  against the body in `sit`, `walk`, `crouch` and `curl`. Nothing like {Murmur}chime's dark tortie (she sits beside her at
  the store), Thymeleaf's oatmeal, Waffles' white. **The coat test's pass conditions** (`tests/cats.test.js`, measured
  with the tests' own `lum`): her points at least 80 darker than her body in `sit`, `walk`, `crouch` and `curl`; her body
  apart from every look's fur and every CLAN coat by a threshold the cats owner states in the test (in `lum`, or plainly
  another hue), **except `cream` and CLAN 3**, named in the test as the two the points carry. (The story builder never
  puts a CLAN 3 cat beside her.)
- **The contact sheet comes first** (the brief): before any other pose is finished, the cats owner draws her coat in
  `sit` and `walk` and makes contact sheets (`node tools/sheet.mjs`) of Chispapaw beside {Murmur}chime, Thymeleaf, Waffles
  and the nine looks (the player in each fur, `sit`, the cream, white and tortie above all), into its work folder, with
  `tests/cats.test.js`' coat measures (her body against every look's fur and CLAN's coats; her points against her body).
  The orchestrator looks at the sheet before the build goes on (section 10, step 1b).
- **Poses and moods used**: `sit`, `stand` (the bounce, with the `motion` effect), `walk` (at heels, through the hedge,
  carrying), `crouch` (nose in the gap; the dip of the head; sniffing every corner), `lookup`, `lie`, `loaf` (f073, in the
  apprentices' den), `curl` with `asleep: true`; moods `shy`, `wonder`, `happy`, `worried`, `sad` (ears down for the mutter, with `flatEars: true`), `sniff`,
  `proud`, `stern` (her old-tom voice), `sleepy`. Extras: `tailUp: true` ("Chispapaw's tail goes up too"), `holds: 'leaf'`
  (the leaf "To HELP"), `purr: true`, `flatEars: true`.
- **Her name tag**: "The little cat" until Glintstar names her (each balloon of hers from f014 to f028 carries `name: 'The
  little cat'`; the friends' "Hello." on f013 is "A small voice"), then **Chispapaw** (the page's default label for
  `chispapaw`, section 6). Never «Galleta».
- **Her voice** (Read to me): high and quick, `PITCH.chispapaw` 1.42, `RATE.chispapaw` 1.02 (ui.js).
- **`scenes.js` knows her as a cat**: `chispapaw: 1` in its hard-coded `CAT_IDS` (the sets owner's line). Without it the
  `head`-framed close-up ignores her (f014's `garden`/`hedge-close`, "framed on the first cast member's head: Chispapaw
  first", would fall back to its fixed box), and her face radius, `liftPlan`, spot poses and `denStone` skip her.

**New for cats: `holds: 'mouse'`** (the cats owner's, `cats.js`). Today `HOLD_RX` draws only stone, pebble, vole, bark,
leaf, glass, miststone and pinecone in a cat's mouth, and `holds: 'mouse'` is drawn only for the weasels: on our cat,
{Murmur}chime, the old tom or a Clan cat it draws exactly what no hold draws (critic-continuity, checked), while the
storyboard prints "a mouse in the mouth". So `HOLD_RX.mouse`, drawing `PC.art.prey`'s mouse as `preyHeld` does, in the
mouth, in `walk`, `sit`, `stand` and `crouch`, reporting `held`; off unless asked (no frame of chapters 1 to 11 gives a
cat `holds: 'mouse'`: checked), so every existing fingerprint stands; a `tests/cats.test.js` case. Used on f054 to f056.

**Everyone else is drawn already:**
- **Our cat**: poses `curl` (`asleep`), `loaf`, `sit`, `crouch` (with `tailUp`: the stretch's front paws out, tail up),
  `walk` (`holds: 'mouse'` carrying, new above), `pawup`, `stand`; `tap: 'paw'`, `'nose'`, `'tail'` (with `tailUp`); `purr:
  true`.
- **{Murmur}chime** (`murmurchime`): `sit` and `lie` at `next-nest` (`asleep` at the end), `walk` with `holds: 'mouse'`
  (one mouse drawn: section 7, item 4).
- **Tallyheart**: `sit`, `walk`, `stand`; `kind`, `happy`, `proud`, `wonder` (her ears up).
- **Glintstar**: `stand` on `fountain-top`, `walk` (coming down), `sit`; `solemn`, `kind`, `proud`.
- **The old tom** (`grizzled`): `sit`, `walk` with `holds: 'mouse'`; `stern`, `shout`, `sniff`.
- **The grey tom** (`snorer`, still unnamed, labelled "Snoring apprentice" as always): `sit` at `sleeper-1`, `curl`
  asleep; `happy`, `proud`, `sleepy`.
- **Princess Waffles**: `peer` and `shout` at `railing` (`up`, `balcony`, `balcony-close`).
- **Riffle**: `swim` at `water` (`bank`, a wet head over the bank), `stand` with `holds: 'pebbles'` under the bridge (never
  `juggle` under the Old Bridge: Otter's honor; never `hug` there), `dive` (off home), `shout`. The `motion` effect for
  "His paws twitch."
- **Clan cats** (`clancat`): the midday count and the mutter (`crowd: true` and two or three in the cast), carrying mice
  at sunset.

### Counts art

Nothing new from the art for the Counts: the warm-up's pictures are the anchors' (the kit's `E.questionDef`); the take
pages draw the kit's store picture (`picture: { kind: 'store' }`) and help on the kit's sand; the paw thing is chapter 4's
`paws: 'both'`. The two placed pictures (the hollow's 500, as empty pressed places; the store's 175 and 133, as prey) are
the kit's `PC.art.placeValue`, `small`.

### Heard, not seen

*Ting!* and *Ting! Ting!* (her bell: f017, f032), *Splash!* (Riffle, f067): each the frame's `sfx`, lettered, never read
(no `sfxRead`). The bell's *ting* inside a caption (f014, f080) is the caption's own italics. The purr is the `purr` effect.

## 5. Build notes

General rules, then the chapter frame by frame. Chapter 11's file (`app/story/ch11.js`) is the model: its helpers (`c`,
`S`, `merge`), frame ids in reading order, a `board` on every frame.

- **The chapter**: `PC.story.ch12 = { id: 'ch12', number: 12, title: 'A Spark at the Hedge', module: 2, start: 'f001',
  names: { player: '{name}{ending}' }, frames, counts: { 'ch12-warm': …, 'ch12-take': …, 'ch12-store': … }, cards: {},
  book, teaser }`. It opens when chapter 11 is finished (number order: no `opensWhen`). `names.player` labels our cat's
  balloons `{name}{ending}` on every page of the chapter (the brief's call 15).
- **Captions first, then balloons** (chapter 5's rule): where the story puts narration after a balloon on one screen, the
  screen is split, or the narration opens the next frame. The splits are in the frame list; the words never change.
- **No panel holds five boxes.** A speaker's paragraphs in a row are balloons in a row; a quote the story splits round its
  tag is one balloon, its comma a full stop where the quote resumes with a new sentence.
- **Speech tags' narration is not lettered** (the picture carries it): "says {Murmur}chime, back from patrol", "she
  whispers", "squeaks", "chirps", "he calls, proudly", "in her deepest, grumpiest old-tom voice", "Her ears are up." between
  Tallyheart's two halves on f068, "In the next nest, {Murmur}chime mutters" (f076).
- **Long captions** (at most 95 characters a box; split at a sentence break, the words unchanged): f002, f031, f039, f080
  (named below).
- **Speakers**: every balloon's speaker is in the frame's cast, but two off-panel voices, each with `name` so the stack
  shows no face and the tail points out of the panel (`faceHidden`): the friends' "Hello." on f013 (`name: 'A small
  voice'`, Chispapaw not yet seen) and Chispapaw's goodnight from across the camp on f072 (`name: 'Chispapaw'`).
- **Balloon kinds**: `whisper` for Chispapaw's counting (f014), "I watched your ceremony…" (f017), the sock line (f023),
  "Galleta." (f027), "Thank you." (f025a, f026), the sigh (58 − 23's prompt), "Not for long…" (f051a), "¡Ciento treinta y
  tres!" (f061); Tallyheart's "Remember when that was you?" (f015) and "Now you know how I felt…" (f037a, f038, f038c);
  {Murmur}chime's "Mice… «cincuenta» mice…" (f076) and the grey tom's sleep-talk (f075); our cat's "Goodnight, Sprinkle."
  (f071). `shout` for Waffles' "Yoo-hoo! Down there!", "A COOKIE!…", our cat's "{name}{ending}!" (f011), Riffle's "I SAID
  see you tomorrow!…", "NEWS!…" and "See you at first light!", Chispapaw's "A DRAGON?!" and her goodnight call. Every other
  balloon plain.
- **Spanish** (section 6): a whole Spanish line is a balloon with **`lang: 'es'`** whose text is tokens and punctuation
  only, its English made by the engine and lettered under it; a Spanish word inside an English line or caption is a token,
  **`{es:key}`** (`{Es:key}` capitalised). Never «» in the story file (they are the engine's marks). After a leading
  ellipsis a word joiner (U+2060), as chapter 11's f048: `'…⁠{es:11}, …'` and "Ready! …⁠What's work?".
- **Tokens**: `{name}{ending}` everywhere the story writes it; `{petname}`, `{Murmur}`; `{they}`, `{them}`, `{their}` in
  the book. Every line reads with he and him (the story test on a tom).
- **The choices**: labels with the story's quotes ("“I kept watch ALL night!”"), `sets: {}`. Where each option has its own
  reply, each goes to its own frame (f025a/b/c, f037a/b/c, f040a/b, f051a/b and f052c); those meet again (lists below).
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; a cast target drawn only where the cast entry carries `tap`,
  a scene target by the set's `tap` option). Each Tap's response is drawn on the next frame, or not at all where the page
  turns at once (section 7, item 4):

  | Frame | `tap` (who carries it) | `prompt` | `label` |
  |---|---|---|---|
  | f002 waking | `paw` (our cat, `loaf`, `sleepy`) | `**Tap** to stretch.` | `Stretch.` |
  | f008 "The cat who counts what's missing." | `nose` (our cat, `sit`, `proud`) | `**Tap** to dip your head.` | `Dip your head.` |
  | f013 something rustles | `nose` (our cat, `crouch`, `wonder`, facing the hedge) | `**Tap** to look.` | `Look.` |
  | f021 "Bring her in." | `paw` (our cat, `walk`, facing the gap) | `**Tap** to lead her through the hedge.` | `Lead her through the hedge.` |
  | f030 "Chispapaw." | `nose` (our cat, `sit`, `happy`) | `**Tap** to purr her new name.` | `Purr her name.` |
  | f035 your very own apprentice | `nose` (our cat, `sit`, `happy`, `tailUp: true`) | `**Tap** to dip your head to her.` | `Dip your head to her.` |
  | f044 the store laid out | `squares` (the hollow's `store: 500`, `tap: 'squares'`: the whole placed picture) | `**Tap** the squares.` | `Tap the squares.` |
  | f047 the quick way | `paw` (our cat, `sit`: a crouch reaches into the marks) | `**Tap** to scratch yours.` | `Scratch yours.` |
  | f054 the catch carried in | `paw` (our cat, `walk`, `holds: 'mouse'`) | `**Tap** to help carry.` | `Help carry.` |
  | f060 "Now read me the store." | `store` (the bridge's `store: 133`, `tap: 'store'`) | `**Tap** to read the store.` | `Read the store.` |
  | f062 Riffle over the bank | `paw` (our cat, `pawup`) | `**Tap** to wave to Riffle.` | `Wave to Riffle.` |
  | f072 goodnight | `tail` (our cat, `sit`, `tailUp: true`) | `**Tap** to wave goodnight.` | `Wave goodnight.` |

- **Shared opts**: `DENW_DAY = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true,
  miststone: true }` (her warrior's nest, `morning`); `DENW_NIGHT = merge(DENW_DAY, { moon: 16 })` (night); `DEN_APP = {
  weather: 'clear', moon: 16 }` (the apprentices' den, night); `CAMP_DAY = { crowd: true }` (`day`); `CAMP_NIGHT = { moon:
  16 }` (night); `H12 = { marks: 10, glow: 'auto' }` (the Hollow, `day`: merged into every opts set of f041 to f049, with
  `store`, `storeGlow`, `quick` and `tap` on top); `BACK = { stones: true, prints: true }`; `UNDER = { prints: true }`;
  `STORE175 = { store: 175 }`, `STORE133 = { store: 133 }` (sunset).
- **Spots**: the den's `nest` and `next-nest` (chapter 11's), `sleeper-1`; the garden's `hedge-side`, `hedge-gap`,
  `hedge-right` (new); the tower's `foot`, `railing`; the camp's `entrance`, `fountain-top`, `fountain-foot`, `crowd-left`,
  `crowd-right`, `center`, with chapter 11's raw spots where they serve (RING_YOU, RING_TALLY, OLD, BESIDE); the hollow's
  `tree` and `sunpatch-3` (and `sand-right` for Chispapaw on the shelf's `wide`); the bridge's `bank-left`, `bank-right`, `reeds`, `water`, `mud`, `inside`, chapter 6's
  three-shot spot under the bridge (`{ x: 400, y: 940 }`), `back-left`, `back-right`, and the store's six (section 4, each
  cat's place named there); the Hollow's raw spot `HOL_YOU` (about `{ x: 690, y: 892 }`, as the sets owner settles it). A
  place used twice gets a named spot (or, as chapter 11's raw spots, a named constant); the story builder settles raw spots
  with `tools/frames.mjs`. **Vary the camp's cameras** through the vouching and the naming (`crowd`, `reveal`, `purr`), as chapter 11 did, so they are not fifteen
  panels of one.

### The frames

77 to 80 frames on a reading (cap 125), f001 to f080 with lettered option frames. The words of each are the story's
screen, named by its first words; every line below is the story's.

**Noon**
- **f001** `den`/`nest`, `DENW_DAY`, `morning`: our cat `curl` `asleep` at `nest`, the next nest empty ({Murmur}chime is on
  patrol). Caption "Chapter 12: A Spark at the Hedge". The start, every path (chapter 8's title panel).
- **f002** the same: our cat `loaf`, `sleepy`, awake. Captions "You wake up in your warrior’s nest. The sun is high, and the
  air smells cold." / "You kept watch all night, and slept all morning." / "Your first day as a warrior is half over
  already!" (split at its sentence: 98 characters); the stretch Tap.
- **f003** the same: our cat `crouch` with `tailUp` (front paws out, tail up), {Murmur}chime `sit` at `next-nest` (`happy`).
  Her "Warriors don’t sleep till NOON. Usually."; **Choose** "“I kept watch ALL night!”" / "“I’m a VERY good sleeper.”",
  both to f004.
- **f004** the same, our cat `sit`: {Murmur}chime's "I know. I’m just jealous."

**The midday count**
- **f005** `camp`/`crowd`, `CAMP_DAY`, `day`: our cat, Tallyheart, {Murmur}chime, the old tom, Glintstar at `fountain-foot`,
  two Clan cats. Captions "At the midday count, there’s news." / "Yesterday, after your Counts, both Clans carried their
  prey home from the stash." / "Sloshbank sent word: “OURS came home. *Drip.*”" / "And this morning, while you slept, the
  weasels’ tunnel was filled with stones." (four boxes; Sloshbank is not drawn; no tunnel or stash is drawn).
- **f006** `camp`/`fountain`, `day`: Glintstar `stand` at `fountain-top`. Caption "Glintstar leaps up onto the fountain.";
  her "Thymeleaf’s whiskers say snow by the full moon." and "So this frost-time, we’ll keep a store, in the dry den under
  the Old Bridge. It kept a dragon dry. It can keep our prey dry."
- **f007** `camp`/`crowd`, `CAMP_DAY`: Glintstar on `fountain-top`, our cat and Tallyheart in front. Glintstar's "Five
  hundred pieces, by the full moon. And one cat to count them."
- **f008** the same: caption "She looks straight at you." (the story's split); Glintstar's "{name}{ending}. The cat who
  counts what’s missing."; the dip Tap.
- **f009** the same, the old tom in front (`stern`): his "Five HUNDRED? In my day, we didn’t count our prey. We just ATE
  it."; Tallyheart's "And that is why you were hungry every frost-time." (“And that,” says Tallyheart, “is why…”: one
  balloon).

**Princess Waffles** (the tower from the hedge's side: our cat at `foot`, Tallyheart beside her, Waffles at `railing`)
- **f010** `tower`/`up`, `{ chime: true }`, `day`: captions "You and Tallyheart pad out to the hedge." (the old tom's
  screen's last line, opening this frame) / "Far above, Princess Waffles leans over the railing."; Waffles' "Yoo-hoo! Down
  there!" (shout) and "I told the whole tower about your ceremony. But what IS your name?"
- **f011** the same: our cat's "{name}{ending}!" (shout); Waffles' "{name}{ending}! How REGAL. I’ll need a WEEK to practice
  it, darling. Until then: {petname}."
- **f012** `tower`/`balcony`, `{ chime: true }`, `day`: Waffles (`peer`, `shout`): "And NEWS! A new pillow cat, on the ground
  floor, far side." and "She’s counting EVERYTHING, darling. In SPANISH. I understand NOTHING."
- *If the plain path ever passes 2,000 words, f011 goes first: f010 ends on Waffles' first balloon and f012 opens
  "{petname}! NEWS, darling!" (the brief's cut; she learns the name in chapter 19). At v0.4 it is 1,739 to 1,767: kept.*

**The hedge** (the garden's side of the hedge, by `day`: the little cat at the gap with her nose into it, toward the camp)
- **f013** `garden`/`hedge`: our cat at `hedge-side` (`crouch`, facing the gap), Tallyheart at `hedge-right`; no little
  cat drawn yet. Caption "Something rustles at the foot of the hedge."; then one line by `specialty`: captions (`noticing`)
  "You spot her first: two blue eyes, right in a gap.", (`climbing`) "You hop up onto the hedge-top for a better look.",
  (`sneaking`) "You creep closer without a sound, the way you used to sneak up on socks."; (`friends`) the balloon "Hello."
  (`who: 'chispapaw'`, `name: 'A small voice'`, whisper, off the panel); the look Tap.
- **f014** `garden`/`hedge-close` (framed on the first cast member's head): Chispapaw first, at `hedge-gap`, `crouch`, facing
  right (her nose into the gap), `shy`; our cat at `hedge-side`. Captions "A small cream cat has her nose in the gap: a dark
  brown face, dark paws, big ears, blue eyes." / "A tiny bell on her collar goes *ting*." / "She’s counting the Clan, under
  her breath."; her balloon `{ who: 'chispapaw', name: 'The little cat', kind: 'whisper', lang: 'es', text:
  '…⁠{es:11}, {es:12}. {Es:12} {es:gatos}.' }` (lettered "…once, doce. Doce gatos.", under it "(…eleven, twelve. Twelve
  cats.)"). **No crowd in the picture**: from the garden's side the hedge is a wall, so no cat she counts can be counted on
  this frame (the verify critic's rule: twelve cats or none countable).
- **f015** `garden`/`hedge`: Chispapaw at `hedge-gap` (facing right), our cat, Tallyheart (`kind`). Tallyheart's whisper
  "Remember when that was you?"
- **f016** `room`/`outside`, `{ door: 'closed', clan: true }`, `dusk`: no cast: her old view through the glass, the garden
  with tiny Clan cats far off (chapter 1's own picture, as a memory). Caption "You do. You watched this Clan through the
  glass, wishing and wishing." (the story's split: a caption after a balloon).
- **f017** `garden`/`hedge`: Chispapaw at `hedge-gap` now facing left (`wonder`), our cat at `hedge-side`, Tallyheart at
  `hedge-right`; `sfx: 'Ting!'`. Caption "The little cat peeks up at you."; her "I wasn’t counting you. Well. I WAS. You were
  number twelve." and her whisper "I watched your ceremony from my window. I want to be a warrior. Like YOU."; **Choose**
  "“What’s your name?”" / "“Hello! Who are you?”", both to f018.
- **f018** the same (`happy`): her "My Tall Ones call me {es:galleta}. It means cookie." (`name: 'The little cat'`).
- **f019** `tower`/`balcony-close`, `{ chime: true }`, `day`: Waffles (`shout`). Caption "High above, Waffles shrieks."; her "A
  COOKIE! Darling, we’re BOTH snacks." (the story's split).
- **f020** `garden`/`hedge`: her "My Tall Ones leave the door open. Like yours did. I’ll visit my little Tall One at homework
  time."
- **f021** the same, Tallyheart `kind`, our cat `walk` toward the gap: caption "Tallyheart tips her head at the gap."; her
  "Well, warrior? Bring her in."; the lead Tap (its response, through the hedge, is f022).

**Another pillow cat**
- **f022** `camp`/`reveal`, `CAMP_DAY`: our cat at `entrance` (just through the hedge, chapter 1's f035), Chispapaw beside her
  (`wonder`; no `size`: her preset is her size), Tallyheart at `center`, the old tom at `crowd-right`, Glintstar on `fountain-top`. Caption "The
  little cat’s eyes go round. Dens! Ferns! A FOUNTAIN!"; the old tom's "ANOTHER pillow cat? Can she even catch a mouse?"
- **f023** `camp`/`entrance`, `CAMP_DAY` (high, from above, the watching shadows round every edge: chapter 1's f042, where the
  Clan once stared at her): Chispapaw alone at `entrance`, `sit`, `sad`, `flatEars: true`. Caption "The Clan mutters, the way
  it once muttered about you. Her ears droop."; her whisper "I’ve never MET a mouse. I caught a sock once. It was a very BIG
  sock."
- **f024** `camp`/`crowd`: our cat beside Chispapaw, Tallyheart, the old tom, two Clan cats. Caption "You step up beside
  her."; **Choose** "“Judge her by what she does, not by where she sleeps.”" (f025a) / "“I was a pillow cat too.”" (f025b) /
  "To the old tom: “She can count in TWO languages. Can you?”" (f025c).
- **f025a** the same, Tallyheart `proud`, ears up: captions "Tallyheart’s ears go up, proud." / "You said it just the way she
  once said it for you." / "The muttering stops."; Chispapaw's whisper "Thank you." → f027.
- **f025b** the old tom (`sniff`): "Well. YOU turned out all right." → f026. **f025c** the old tom: "…⁠I can count in ONE
  very well." → f026.
- **f026** (after b and c) the same: caption "The muttering stops."; her whisper "Thank you."

**Chispapaw**
- **f027** `camp`/`reveal`, `CAMP_DAY`: Glintstar `walk` down at `fountain-foot`, our cat, Chispapaw, Tallyheart. Caption
  "Glintstar comes down from the fountain."; Glintstar's "What do they call you, little one?"; Chispapaw's whisper
  "{es:galleta}." (“«Galleta»,” she whispers: one balloon, her name in Spanish); Glintstar's "Pillow names don’t hunt.
  Choose a Clan name."
- **f028** `camp`/`crowd`: Chispapaw `sit`, `proud`. Caption "The little cat sits up very straight."; her "Chispa. It means
  spark." (`name: 'The little cat'`: she names herself; Glintstar has not named her yet).
- **f029** the same, Glintstar `kind`: caption "Glintstar’s whiskers twitch."; her "A spark. Frost-time could use one." (the
  story's split).
- **f030** the same, Glintstar `solemn`: her "Chispapaw." (with tremendous dignity); the purr Tap.
- **f031** `camp`/`purr`, `CAMP_DAY`, `purr`: our cat (`purr: true`), Chispapaw, Glintstar, Tallyheart, the old tom (`purr:
  true`). Captions "You purr it first." / "Then, one by one, the cats join in, till the whole camp is humming her new name."
  (split at its sentence); the old tom's "Chips-paw?"
- **f032** `camp`/`crowd`: Chispapaw `stand`, `happy`, the `motion` effect; `sfx: 'Ting! Ting!'`. Caption "Chispapaw can’t help
  it. She BOUNCES." (the story's split). From here her balloons carry no `name` (the label "Chispapaw").

**She's yours**
- **f033** `camp`/`reveal`: Glintstar's "Every apprentice needs a mentor."; Tallyheart's "I’ll teach her the Counts, same as
  always. She needs a warrior for everything else."
- **f034** `camp`/`crowd`: caption "Glintstar looks right at you."; her "{name}{ending}. She’s yours."
- **f035** the same, our cat `sit`, `happy`, `tailUp: true`: caption "Your very own apprentice! Your tail shoots up before you
  can stop it." (the story's split); the dip Tap.
- **f036** the same: Chispapaw `lookup` (`wonder`), having dipped her head back (the Tap's response is the next picture: the
  story's "she dips hers back, so low her bell goes ting" is not drawn). Caption "Chispapaw looks up at you, eyes
  shining."; **Choose** "“Welcome, Chispapaw.”" (f037a) / "“Ready to work?”" (f037b) / "“Let’s count something.”" (f037c).
- **f037a** the same, Chispapaw `purr: true`, `tailUp: true`: captions "Chispapaw purrs so hard her whiskers shake." /
  "Chispapaw’s tail goes up too, just like yours."; Tallyheart's whisper "Now you know how I felt, the day you came." →
  f039.
- **f037b** Chispapaw's "Ready! …⁠What’s work?" → f038. **f037c** Tallyheart (`proud`): "That’s MY line. Hmph." → f038c.
- **f038** (after b) Chispapaw `tailUp: true`: caption "Chispapaw’s tail goes up too, just like yours."; Tallyheart's whisper
  "Now you know how I felt, the day you came." **f038c** (after c) the same with the caption "She looks very proud." first
  (the story's split). Both → f039.
- **f039** `camp`/`reveal`, `CAMP_DAY`: our cat `walk`, Chispapaw `walk` at her heels. Captions "On the way to the Training
  Hollow, Chispapaw trots right at your heels." / "She has questions. Lots of questions."; her "Do warriors sleep in trees?
  Do you eat bugs? Have you ever met a DRAGON?"; **Choose** "“No, no, and YES!”" (f040a) / "“One at a time!”" (f040b).
- **f040a** caption "Chispapaw’s eyes go huge."; her "A DRAGON?!" (shout); Tallyheart's "The dragon story at the store.
  Lessons now." **f040b** her "Okay. DRAGON first."; Tallyheart's "The dragon story at the store. Lessons now." Both → f041.

**The Training Hollow** (`hollow`/`lesson`, `day`, `H12` under every frame's opts: Tallyheart at `tree` facing left, our cat
at `HOL_YOU` and Chispapaw at `sunpatch-3`, both facing right, our cat `sit`; the picture and the marks in the hollow's
fixed box between our cat and Tallyheart: section 4)
- **f041**: our cat's "Warriors have LESSONS?"; Tallyheart's "Even warriors learn new tricks. You know every Count a warrior
  needs. Now, what to DO with them: take-aways."; Chispapaw's "Take-aways? Like when I take away my Tall One’s socks?";
  Tallyheart's "Yes! Then we count what’s left."
- **f042**: Tallyheart's "First, three Counts, to wake up your whiskers."; `counts: { set: 'ch12-warm', intro: false, next:
  'f043' }` (the warm-up and its echo: section 2).
- **f043**: Tallyheart's "Here’s what the Counts are FOR. A cat who knows them can always tell when something’s missing.
  Take-aways tell you HOW MANY."
- **f044** `merge(H12, { store: 500, tap: 'squares' })` (the store's plan: five empty pressed squares, section 4): Tallyheart's "We’ll lay the store out like the pile. Ten loose ones make a row.
  Then a gap shows in a heartbeat." and "And ten rows make a square. That’s a hundred."; the squares Tap.
- **f045** `merge(H12, { store: 500, storeGlow: 'hundreds' })`: Tallyheart's "Five hundred is five squares."; Chispapaw's "Only FIVE?";
  Tallyheart's "Five BIG ones."
- **f046** `merge(H12, { quick: 1 })`: Tallyheart's "In the sand, there’s a quick way to scratch a count. A square for a square. A line for
  a row. A dot for a loose one."
- **f047** `merge(H12, { quick: 2 })`: our cat `sit` (the Tap's `paw`); caption "Chispapaw scratches one too. Her square
  looks like a cookie." (the story's split); the scratch Tap.
- **f048** `merge(H12, { quick: 3 })`: Tallyheart's "Here’s the trick. Take loose from loose, rows from rows, squares from squares. Ones
  first: the loose ones." and "The store’s empty till sunset, so let’s pretend. I’ll say each step. You type it.";
  `counts: { set: 'ch12-take', intro: false, next: 'f049' }` (the lesson: section 2; the take page carries the story's next
  screen, the worked example's prompt and column).
- **f049** `merge(H12, { quick: 3 })`: Tallyheart's "Ones first, every time. That’s take-aways."; Chispapaw's "You didn’t sigh ONCE!" (the
  story's *Done* lines: `done: ''` on the set, so they are this frame's).

**The walk** (`riverbank`/`path`, `day`: our cat `walk`, Chispapaw `walk` behind her, copying)
- **f050**: caption "Down to the Old Bridge, Chispapaw copies your every step."; her "Were the cats grumpy at you, too? At
  first?"; **Choose** "“Some of them. Not for long.”" (f051a) / "“The old tom STILL is.”" (f051b) / "“Tallyheart wasn’t. Not
  once.”" (f052c).
- **f051a** her whisper "Not for long. I can do not-for-long." → f052. **f051b** her "Chips-paw?" (`stern`: her old-tom
  voice) → f052.
- **f052** (after a and b): caption "Chispapaw’s whiskers lift."; her "I’ll show them. Like you did." **f052c** (option c)
  Tallyheart ahead of them in the picture: captions "Up ahead, Tallyheart’s ear twitches. She heard." / "Chispapaw’s
  whiskers lift."; her "I’ll show them. Like you did." Both → f053.
- **f053**: our cat `walk`, `proud`. Caption "You walk the rest of the way with your head held high." (the story's split).

**Sunset at the store** (the Old Bridge at `sunset`)
- **f054** `bridge`/`bank`: Clan cats walking toward the dark with mice (`holds: 'mouse'`), our cat `walk`. Captions "The sun
  sinks behind the Old Bridge. The air nips your nose. Frost is coming." / "The Clan carries its first frost-time catch into
  the dry den, mouse by mouse."; the carry Tap.
- **f055** `bridge`/`under`, `UNDER`: {Murmur}chime `walk` with `holds: 'mouse'`, the old tom `walk` with `holds: 'mouse'`.
  Caption "{Murmur}chime carries in four mice at once. The old tom carries in ONE."; his "It’s a BIG one."
- **f056** the same, Chispapaw `walk` with `holds: 'leaf'`: caption "Chispapaw carries in a leaf." (the story's split); her
  "To HELP."; {Murmur}chime's "Best leaf in the store."
- **f057** `bridge`/`back`, `BACK`: our cat at `back-left`, Chispapaw `crouch` `sniff` at `back-right`. Caption "You tell
  Chispapaw the dragon story, in a whisper. She sniffs every corner, twice."; one caption by `ch10Best`: (`sprinkle`)
  "Sprinkle slept here once. It still smells a little of mist."; (`friends`) "You met a friend with wings in this den. Now
  friends with whiskers are filling it."; (`truth`) "You found a dragon here, and the truth: she was no thief."; (`counts`)
  "A dry den, and a whole store to count. PERFECT."
- **f058** `bridge`/`store`, `STORE175`: the six at the store's spots as section 4 places them (our cat `store-left`,
  Chispapaw `store-right`, Glintstar `store-back-1`, Tallyheart `store-back-2`, {Murmur}chime `store-back-3`, the old tom
  `way-in`), listed back to front as the sets owner reports their depth; the same places on f059 to f061. Caption "The catch lies on the dry den’s floor."; Tallyheart's "Squares, rows and loose. Just like the Hollow."
- **f059** the same: Glintstar's "One hundred seventy-five pieces today. Forty-two go to tonight’s pile. The rest stay
  here."; `counts: { set: 'ch12-store', intro: false, next: 'f060' }` (her question is the take page's prompt).
- **f060** `bridge`/`store`, `merge(STORE133, { tap: 'store' })`: Glintstar's "Now read me the store."; the read Tap.
- **f061** `bridge`/`store`, `STORE133`: our cat's "One square, three rows, three loose."; Chispapaw's balloon `{ who:
  'chispapaw', kind: 'whisper', lang: 'es', text: '¡{Es:133}!' }` ("¡Ciento treinta y tres!", under it "(One hundred
  thirty-three!)"); Glintstar's "A good count. The cat who counts what’s missing. And what’s THERE."

**Riffle** (the Old Bridge at `sunset`)
- **f062** `bridge`/`bank`: Riffle `swim` at `water`, our cat `pawup` at `bank-left`, Chispapaw and Tallyheart on the bank.
  Caption "A wet head pops up over the bank."; Riffle's "I SAID see you tomorrow! It’s TOMORROW!" (shout); for `specialty:
  'swimming'`, his "Too cold for a swim today. Even for you."; the wave Tap.
- **f063** `bridge`/`under`, `UNDER`: Riffle `stand` with `holds: 'pebbles'` at chapter 6's spot, our cat, Chispapaw,
  Tallyheart. Caption "Under the bridge, he has his pebbles in his paws."; his "Not juggling. HOLDING. Otter’s honor."
- **f064** the same, the `motion` effect at Riffle: caption "His paws twitch. They really want to juggle. He holds very, very
  still." (the story's split).
- **f065** the same: caption "He spots Chispapaw."; Riffle's "A NEW one! Do you juggle?"; Chispapaw's "I… count?"; Riffle's
  "Close enough!"
- **f066** the same, Riffle `shout`: caption "Riffle can’t hold still a heartbeat longer."; his "NEWS! Granny’s found ANOTHER
  badger track. A FRESH one! Come to the Crossing at first light!"; **Choose** "“We’ll be there!”" / "“First light? I just
  WOKE UP!”", both to f067.
- **f067** `bridge`/`bank`: Riffle `dive` at `water`; `sfx: 'Splash!'`. His "See you at first light!" (shout).
- **f068** the same, no Riffle, Tallyheart `happy`, ears up: caption "Off he goes, pebbles and all." (the story's split);
  Tallyheart's "Another one. First light, then."
- **f069** the same: our cat and Chispapaw looking upriver. Caption "The track on Gathering Island was old. This one is
  FRESH." (the story's split). No badger, no track drawn.

**Bedtime** (night, the moon at 16)
- **f070** `camp`/`reveal`, `CAMP_NIGHT`, `night`: the camp asleep, two Clan cats curled at their dens. Caption "The moon comes
  up over camp, and everything turns silver."
- **f071** `den`/`nest`, `DENW_NIGHT`: our cat `loaf` at `nest`, {Murmur}chime `lie` at `next-nest`. Captions "Your warrior’s
  nest is soft and deep." / "Out of the moonlight, your mist stone is grey on the moss." / one by `ch2Stone`: (`nose`)
  "Riffle’s stone is by your nose."; (`chin`) "Riffle’s stone is under your chin." (moved before the balloon: captions
  first); our cat's whisper "Goodnight, Sprinkle."
- **f072** the same, {Murmur}chime `sleepy`: her "Your first day. A store to count and an apprentice. Show-off."; Chispapaw's
  call from across the camp, off the panel (`name: 'Chispapaw'`, shout) "Goodnight, {name}{ending}! Will you teach me to
  catch a mouse?"; our cat's "Tomorrow."; the goodnight Tap.
- **f073** `den`/`inside`, `DEN_APP`: the grey tom `sit` at `sleeper-1` (`proud`), Chispapaw `loaf` at `nest` (her denmate's
  nest is the player's old one: a picture only, no line says so). Caption "In the apprentices’ den, the grey tom has a
  denmate at last."; the grey tom's "She counts in Spanish. Paw thing?"; Chispapaw's "My little Tall One does a paw thing
  too. With FINGERS."; the grey tom's "Weird."
- **f074** the same (the skip's picture replaces it in play): caption "You do the paws. She does the words."; Chispapaw's
  balloon `{ who: 'chispapaw', lang: 'es', text: '{es:aContar}' }` ("¡A contar!", under it "(Let’s count!)"); the paw thing
  (section 2). The page letters the caption above the balloon (captions first).
- **f075** the same, the grey tom `curl` `asleep`, `zzz`: caption "By {es:50}, the grey tom is snoring."; his whispered "Same
  paw thing. Better words."
- **f076** `den`/`nest`, `DENW_NIGHT`: our cat `loaf` at `nest` (as on f071: she is in her nest), {Murmur}chime `lie`
  `asleep`: her whisper "Mice… {es:50} mice…" (the place says "in the next nest").
- **f077** the same, our cat `loaf` at `nest`, Tallyheart `walk` past at the close-up's edge (a raw spot, touching nobody):
  her "A good day’s work, warrior." (said to the nest she is in).
- **f078** the same, our cat `curl` `asleep`: captions "Today, you woke up a brand-new warrior." / "Tonight, someone across the
  camp wants to be just like you." / "You curl up tight, warm and safe, and sleep." (the story's split).

**Chapter end**
- **f079** `den`/`nest`, `DENW_NIGHT`, `night`, `zzz`, `sparkle`: both asleep. Caption "What did {name}{ending} dream, with a
  fresh track waiting at first light?"; `input: { kind: 'dream', placeholder: 'A spark… a store… a fresh track…', next:
  'f080' }`.
- **f080** `den`/`inside`, `DEN_APP`: Chispapaw `curl` `asleep` at `nest`, the grey tom asleep at `sleeper-1`. Captions
  "{name}{ending} sleeps." / "Across the camp, Chispapaw rolls over, and her tiny bell goes *ting*. Then she sleeps too."
  / "End of Chapter Twelve."; `end: true`.

### The book (the story builder's; proposed here)

```js
book: {
  title: '{name}{ending}’s First Frost-Time', chapterTitle: 'A Spark at the Hedge',
  store: 133,   // book two: the store drawn under the recap, one square, three rows, three loose
  dream: '{name}{ending}’s dream: “{dream}”',
  noDream: '{name}{ending}’s first frost-time dream stayed a secret.',
  recap: [
    { text: 'On {name}{ending}’s first day as a warrior, {they} slept till noon, and Glintstar gave {them} a frost-time job: counting a new store under the Old Bridge, five hundred pieces by the full moon.' },
    { text: 'At the hedge, a little pillow cat from {their} old tower was counting the Clan in Spanish, the way {name}{ending} once watched through the glass.' },
    { text: '{name}{ending} spoke up for her, and she chose her own Clan name: Chispa, which means spark. Glintstar named her Chispapaw, and gave her to {name}{ending} as {their} very first apprentice.' },
    { text: 'In the Training Hollow, Tallyheart taught them both something new: take-aways, with loose ones, rows and squares, ones first.' },
    { text: 'At sunset the Clan’s first frost-time catch went into the store, and {name}{ending} counted what stayed: one hundred thirty-three, one square, three rows and three loose.' },
    { text: 'Riffle brought news: Granny has found another badger track, a fresh one.' },
    { text: 'At bedtime, Chispapaw did the paw thing in Spanish, all the way to fifty, and the grey tom snored.' }
  ]
}
```

Seven lines on every reading, each true on every path (the store at 133 whether 175 − 42 was helped or not; "spoke up for
her" on all three vouching lines). In English only: the book letters no Spanish (section 9, call 22). Book two's volume
title comes from this chapter's `book.title` ("{name}{ending}'s First Frost-Time"); `module: 2` puts the page there.

### The teaser (proposed)

`teaser: { title: 'Chapter 13: The Hunter’s Crouch', lines: ['Granny has news: a fresh badger track. Who made this one?'] }`:
the story's own line, and module-2's title for chapter 13 (chapters 6 to 9's teasers named the next chapter; chapter 11's
did not, because module 2 had none). Chapter 11's teaser stays as it is; with chapter 12 built, `E.teaser(ch11)` is
`built: true, next: 'ch12'` (section 10).

### Tests the story builder adds (`tests/story-ch12.test.js`)

As chapter 11's, and: every frame renders with the art's vocabulary (`chispapaw`; the bridge's `store` camera, its spots,
`store` and `tap: 'store'`; the hollow's `store`, `storeGlow`, `quick`, `tap: 'squares'`; the den's 16; `hedge-right`) and
every Tap's target is in its picture; every speaker in the cast but f013's "Hello." and f072's call (both named, so no
face); for every `specialty` (five and none) × `ch10Best` (four and none) × `ch2Stone` (two and none): f013 shows at most
one specialty line, f057 at most one `ch10Best` caption, f071 at most one stone caption, f062 Riffle's swim line only for
a swimmer; the option frames meet (f025a → f027; f025b, f025c → f026 → f027; f037a → f039; f037b → f038, f037c → f038c →
f039; f040a, f040b → f041; f051a, f051b → f052, f052c → f053); **her name tag**: each of her balloons on f014 to f028 is
named "The little cat" (f013's "A small voice"), none after f031 is named but f072's, and no balloon or label anywhere is
"Galleta"; **the Spanish**: every `lang: 'es'` balloon is f014, f061, f074's, its text tokens and punctuation only, filled
(`E.esLine`) as "«…once, doce. Doce gatos.»\n(…eleven, twelve. Twelve cats.)", "«¡Ciento treinta y tres!»\n(One hundred
thirty-three!)", "«¡A contar!»\n(Let’s count!)"; f018, f027 letter «Galleta», f075 and f076 «cincuenta»; no «» in the file;
**the Counts claims of section 2, pinned**: `E.countSets(STORIES)` is chapter 10's ten; `E.checkStory` and `E.checkTakes`
clean; the take lesson as section 2 plays it (the worked example's three full lines, its right line; a helped 475 − 132's
twin with no `prompt` and no `right`, its echo after the helped original and never after the twin; no twin anywhere with a
`prompt` or a `right`); the warm-up's echo on the first right answer only (a miss then a right retry; a hard pick
remembered, then the echo after the remembered line), "¡Siete por ocho, cincuenta y seis!" for 7 × 8 asked as 7 × 8 and
"¡Ocho por siete, cincuenta y seis!" asked as 8 × 7; **the warm-up over every pick case**: for every one-pick and
two-pick case over the 54 pairs, every warm-up question has a numeric `table` and its first line equals
`E.genericQuestion` of `E.hollowDef(STORIES, q.table)` (so no alt is ever asked as "Three cats. How many tails?");
**no spreading talk**: no help line of `ch12-take` or `ch12-store`, over every wrong digit, contains "went" or "spread",
with the cases pinned (475 − 132's tens typed 3; 175 − 42's hundreds typed 0, and OK on its empty box: each opens "Let’s
scratch it out."); **the store's pointer**: a 1 typed first at 175 − 42 gets the ones-first pointer, not the sand; the
store's 175 − 42 right and helped (no twin); every Hollow frame (f041 to f049) carries `marks: 10, glow: 'auto'`; our cat
in the cast of f071 and f076 to f078; finishing
`ch12-take` opens the store (`E.storeOpen`) and nothing before it does; the paw thing's counter at each tap and its gloss;
`E.skipInto(ch12, 'f075')` null; captions at most 95 characters and no panel with five boxes; 77 to 80 frames a reading;
the book's seven lines and `store: 133`, `module: 2`; the teaser; a tom reads every line with he and him; no "borrow",
"StarClan", "Twoleg", "kittypet", "fresh-kill", "Thunderpath", "vigil", "warriors’ den", "whisker-length", "claw-length";
and the reversal list's lines exist where section 8 names them.

## 6. Engine needs

**One: Spanish** (module-2's engine table: chapter 12's one feature), designed below so that it changes nothing for
chapters 1 to 11, the Warrior Counts or the kit's pages: every piece is reached only by a `lang`, a `{es:…}` token, a set's
`echo`, a skip's `lang`, the « and » marks the engine itself makes (no line of chapters 1 to 11, `PC.warrior`,
`E.TAKE_LINES` or `E.STORE_LINES` has one: a test; a « or » she types in a dream is read as “ or ”, below), or the new
cast id. **No new interaction**: a Spanish count is a skip,
the echoes are balloons on pages that exist. The save is untouched (version 2; nothing new on a cat).

Plus **one kit line the kit's design gives chapter 12 and the take-aways tree had not wired** (2026-11-07 15:10): the school
words on the worked example (below). If the merged kit says it already, this item is dropped.

### Where the words live (`app/story/words.js`, new; the orchestrator stubs it)

```js
/* Potomac Crossing · app/story/words.js: PC.words, module 2's one table of words (decision 53). */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.words = {
    // the take-aways kit's English words: E.TAKE_WORDS reads exactly these fourteen keys (it ignores every other one);
    // each is the kit's own default, so nothing the kit says changes; a class word changes here, in one line
    loose: 'loose', row: 'row', rows: 'rows', Row: 'Row', square: 'square', squares: 'squares',
    ones: 'ones', tens: 'tens', hundreds: 'hundreds',
    takeAway: 'take away', TakeAway: 'Take away', spread: 'spread', Spread: 'Spread', OnesFirst: 'Ones first',
    // Spanish: what a {es:key} token letters (es) and its English (en: the gloss, and what Read to me says in its place with
    // no Spanish voice); a name's `say` is said instead (never its gloss). Numbers are the engine's (E.esNumber), not here.
    es: {
      gatos: { es: 'gatos', en: 'cats' },
      por: { es: 'por', en: 'times' },
      aContar: { es: '¡A contar!', en: 'Let’s count!' },
      galleta: { es: 'Galleta', en: 'cookie', say: 'gah-YEH-tah' }
    },
    // English speech only, never lettered: whole words, the longer first
    sayAs: [['Chispapaw', 'Cheespa-paw'], ['Chispa', 'Cheespa']]
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

Its script tag after `ch11.js` and before `ch12.js` in `index.html` and `dev/gallery.html`; in `sw.js`'s `ASSETS`. Every
tool that globs `app/story/` filters on `ch\d+\.js` (storyboard, its test, `warrior-story`), so the file is never taken
for a chapter (read). `tools/storyboard.mjs` requires it beside `app/engine.js`. The kit's tests that stub `PC.words`
restore the loaded table, never delete it (`takes-ui.test.js`' `withWords`, `takes-engine.test.js` 13: read).

### The engine (`app/engine.js`, a section "chapter 12: Spanish" after the kit's)

- **`E.esNumber(n)`**: the bare Spanish number, 0 to 1,000, Latin American (the same digits' words as anywhere): cero, uno …
  quince, dieciséis, diecisiete, dieciocho, diecinueve, veinte, veintiuno, veintidós, veintitrés, veinticuatro … veintiséis …
  veintinueve, treinta, treinta y uno … noventa y nueve, cien, ciento uno … ciento noventa y nueve, doscientos,
  trescientos, cuatrocientos, quinientos, seiscientos, setecientos, ochocientos, novecientos, mil. Never "ciento y uno";
  100 is "cien", 101 to 199 "ciento …". Outside 0 to 1,000: the digits as a string.
- **`E.esFact(a, b)`**: "siete por ocho, cincuenta y seis" (`PC.words.es.por`, then the comma, Aron's form, decision 53).
- **`E.esWords()`**: `PC.words.es`, read at call time (as `E.TAKE_WORDS` reads `PC.words`), `{}` when absent.
- **The token, in `E.fill`**: **one pass for both kinds of token**, `/\{(?:([A-Za-z]+)|([Ee]s):([^}]+))\}/g`, so a value
  the fill inserted (a typed dream, a name) is never scanned again (a second replace would fill a typed "{es:12}"); the
  first group is exactly today's `\{([A-Za-z]+)\}`, filled exactly as today, so every existing line fills as before.
  **`{es:key}`** and **`{Es:key}`** (the first letter capitalised, after any leading ¡ ¿ … or word joiner). The key is, in
  order: a whole number (`{es:12}`: `E.esNumber`); `fact`, `a`, `b`, `answer` when `extra` has them (a Counts page or a
  take page: `E.esFact(a, b)`, or `E.esNumber` of the number); else a key of `E.esWords()`, its `es`. **Filled, a token is
  lettered between the engine's marks, «…»** ("My Tall Ones call me «Galleta». It means cookie."); a ¡ or ¿ just before
  the token, with its matching ! or ? just after it, goes inside the marks with it (a later chapter's "¡{Es:500}! Five
  hundred." letters «¡Quinientos!» whole, in the italics and the Spanish voice; chapter 12 has no such line); an unknown
  key stays as written, as any token does.
- **`E.esGloss(text, cat, extra)`**: the English of a Spanish line: each token by its English (a number by
  `E.numberWords`, the kit's; `fact` as "seven times eight, fifty-six"; a word by its `en`), `{Es:…}` capitalised, ¡ and ¿
  dropped, every other character kept: '…{es:11}, {es:12}. {Es:12} {es:gatos}.' is "…eleven, twelve. Twelve cats.";
  '¡{Es:fact}!' for 7 × 8 "Seven times eight, fifty-six!"; '{es:aContar}' "Let's count!".
- **`E.esLine(text, cat, extra)`**: a whole Spanish line as the page letters it: its tokens filled with no inner marks, the
  whole between «», then a new line and its gloss in parentheses: "«…once, doce. Doce gatos.»\n(…eleven, twelve. Twelve
  cats.)". Every whole Spanish line on every page is made by it (frames, the Counts echo, the take echo, the shelf).
- **`E.esEnglish(s)`**: what a Spanish word or phrase is in English, for speech with no Spanish voice: a words-table entry's
  `say`, else its `en` (matched on its `es`, case kept); a number's words (`E.numberWords`), matched against
  `E.esNumber(0 … 1000)` case-insensitively after stripping ¡ ! ¿ ? … , . and U+2060 (the English capitalised as the
  Spanish was); else ''.
- **`E.sayAs(text, cat)`**: `PC.words.sayAs` applied to English speech, whole words, in its order ("Chispapaw" before
  "Chispa", so "Chispapaw" is never "Cheespapaw"); "Chips-paw?" is untouched; **a sayAs word equal (ignoring case) to the
  cat's own name or pet name is skipped**, so a cat a player named Chispa is said as she always was (the name is one
  `keepNameChars` allows, and a common Spanish pet name: section 7, item 17). A no-op for every line of chapters 1 to 11,
  for every cat.
- **`E.speechParts(text, lang, cat)`**: a filled line split for the voices: `[{ text, lang: 'en' | 'es', en?, line?,
  gloss? }]`. The parts outside «» are English (`E.sayAs(part, cat)` applied); inside, Spanish, with `en` from `E.esEnglish`. **A Spanish part is
  `line: true` only when the text after its closing » is exactly "\n(" + its gloss + ")"**, that parenthesised part being
  `gloss: true`; every other Spanish part is a word part (the paw thing's per-tap "«veinte»" is a word part: with no
  Spanish voice it is said as its `en`, "twenty"). A line with no « and `lang: 'es'` is one Spanish part with `en: ''`
  (the kit's stub echo); any other line one English part. (The page cleans each part as it cleans a whole item, and drops
  a part with no letter or digit: "The voice", below.)
- **The echoes** (a set's `echo`: `{ on: 'first' | [[a, b], …], lines: [{ who, text, lang?, kind? }] }`):
  - **`E.countsEcho(def, st, res, teacher)`**, for a Counts set: null unless `def.echo` and `res.correct`; with `on:
    'first'`, only when this is the lesson's first right answer (`st.log`'s right entries are one: a retry or a filler
    counts, a reload after it never echoes again); with a list, when `res.entry`'s pair is one of it. Returns the balloons
    the page shows: the line this answer earned (`res.line`, Tallyheart's, if not empty; or the fact's own `res.balloons`),
    then each echo line, a `lang: 'es'` one through `E.esLine` with `{ a, b, answer, fact }` from `res.entry` (the order it
    was asked), the rest as written.
  - **`E.takeEcho(def, info, st)`**, for a take set, **called by the take page's problem end, never made into the kit's
    `o.echo` hook** (section 6, "The take page's echo"): null unless `def.echo` and `info.problem` (a column is never
    echoed); with a list, when `info`'s pair is one of it, **right or helped** (a twin never has the original's top, so it
    never matches); with `on: 'first'`, only for a problem right in every column that is the first such in `st.log`.
    Returns one balloon `{ who, text }`, its text `E.esLine` of the first echo line with `{ a, b, answer }` (the kit's echo
    is one balloon). A set's `echo` never echoes a column; a later chapter whose set should (`echo.cols: true`, not built
    now) would be the one to make a hook, and with it the kit's echo room.
- **The Spanish count** (a skip with `lang: 'es'`): `E.skipView` gains a branch, only for such a skip: `count` is the
  numbers so far in Spanish words between the marks, the first capitalised, joined by commas, "…" after them while it
  grows and the last "¡…!" when done ("«Diez…»" … "«Diez, veinte, treinta, cuarenta, ¡cincuenta!»"; a capital is made
  before the ¡…! is put round a word, so a one-group count is "¡Diez!"), and when done, a new line and its English in
  parentheses ("(Ten, twenty, thirty, forty, fifty!)"); `say` the newest number between the marks ("«veinte»"); `gloss`
  the English line when done; `wait: true` (the page waits for Next). `E.skipWords` gives such a skip `whisper: false`
  (the counter's balloon is said out loud; its teacher is the skip's own `teacher`, 'chispapaw') and **`words: true`**, as
  `paws: 'board'` does, so the counter is `counter words`, lettered in Comic Neue: the plain counter is Andika bold, which
  has no italic face, and Spanish is never lettered in Andika (the kit's design). Every other skip exactly as before.
- **Count the store's friend** (the kit's section 5 leaves Chispapaw's lines to this chapter): **`E.takeRoundDef()`** gains
  `echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] }` (the round's first problem right
  in every column: one echo a round); **`E.hollowShelf(...)`** gains `friend: { who: 'chispapaw', text: E.esLine('{es:aContar}') }`
  after Tallyheart's greeting (and after "Another round? I've got all evening."), absent while a Warrior Counts sitting
  waits (its waiting line takes the place, and the room). The store opens only when chapter 12's lesson is finished, so
  she is always met by then. **`E.takeRoundStart`**, while `E.takeSteps(cat)` is only `['none']` (between chapters 12 and
  13), gives the round's def chapter 12's `lines: { extra: { tens: 'Let’s scratch it out.', hundreds: 'Let’s scratch it
  out.' } }`, so no Count the store round talks about spreading before chapter 13 teaches it (section 2, "The `extra`
  slip"); with any other step learned, the kit's lines.
- **The kit's school words** (the kit's section 1 and call 28: "chapter 12's and chapter 13's worked examples say
  `E.TAKE_LINES.schoolWords` once"): **`E.takeLine`**, for a `'show'` problem in a set whose `teach` is `'none'` or
  `'ones2'`, puts the school words before **the tens column's** line: "A row is a ten. A square is a hundred. Now the tens.
  Five take away three." (filled from `E.TAKE_WORDS`). Not on the first column, which already joins the twelve-word prompt
  (the kit's UI owner's warning about `take:first` at 1080 × 720); a `'show'` problem's twin is `'tap'`, so it is said
  once. `takeReserve` measures the tens' line in its full form already, so the keypad stays put. `PC.debug.takes`' inline
  254 − 131 has no `teach`, so the kit's measured `take:first` is unchanged.
- **`E.checkStory`** (new guards, none raised by chapters 1 to 11): a balloon's `lang` is `'es'`, only on a frame's `say`
  balloon or a set's `echo.lines`, never a caption, option or prompt; a `lang: 'es'` line has a token and, its tokens
  removed, no letter (spaces, ¡ ! ¿ ? … , . ; : and U+2060 only), and filled with its largest numbers (a fact 9 × 9, an
  answer 999) has at most eight words; every `{es:key}` resolves (a whole number 0 to 1,000; `fact`, `a`, `b`, `answer`
  only in an `echo` line, `fact` only on a set without `op: '-'`; else a key of `PC.words.es`, an object with string `es`
  and `en`), and no words-table key is a number or `fact`, `a`, `b`, `answer`; no « or » anywhere in a story file; a skip's
  `lang` is `'es'`, its groups × table at most 1,000; a set's `echo` is `{ on, lines }`, `on` `'first'` or pairs among the
  set's facts, `lines` one to three on a Counts set and exactly one on a take set, each `{ who, text, lang?, kind? }`.
  And, for the chapters after this one (none raised by chapter 12): a lowercase `{es:…}` that opens a line, or follows
  . ! or ? (after any ¡ or ¿; not after "…"), is an error (the story test's "starts lowercase" sees the "¡" and passes
  '¡{es:133}!'); so is a number token whose number ends in 1 (uno) straight before a word token ("veintiuno gatos" for
  veintiún); a `lang: 'es'` line holds only `{es:}`/`{Es:}` tokens (no cat token: {name} is never Spanish).
- **The typed dream's marks**: `E.cleanDream` keeps « and », and the book letters a dream through `richN` and Read to me
  says it, so a typed «…» would turn into Spanish italics. **`E.dreamOf` and `E.tidyDream` read a typed « as “ and » as
  ”** (on read, so saves made before this change are covered; nothing stored changes). Only a dream typed with
  guillemets letters differently, in curly quotes; section 7, item 3.
- **`E.VERSION`** `'0.12.0 (chapter 12, <ship date>)'` and its pin in `tests/engine.test.js` are **the orchestrator's, at
  the ship** (the date is the ship's; no build owner touches either); `E.SAVE_VERSION` stays 2.

### The page (`app/ui.js`, `index.html`)

- **The lettering, one place**: **`rich()`** turns «…» into `<i class="es" lang="es">…</i>`, the marks dropped, and a
  parenthesised line straight after one into `<span class="gloss">(…)</span>` on a line of its own: "«…once, doce. Doce
  gatos.»\n(…eleven, twelve. Twelve cats.)" is `<i class="es" lang="es">…once, doce. Doce gatos.</i><br><span
  class="gloss">(…eleven, twelve. Twelve cats.)</span>`. `richN` calls it, so captions, balloons (the panel's and the
  stack's), the take page's and the skip's counter all letter Spanish the same way. **`plain()`** drops « and ».
  Chapters 1 to 11 have no «, so `rich()` and `plain()` give them exactly what they gave (a test over every line).
- **`balloonsOf(frame)`**: a balloon with `lang: 'es'` takes `E.esLine(s.text, cat)` in place of `fill(s.text)`. Nothing
  else needs `lang` to letter: every other path (the Counts page's `res.balloons`, the take page's echo through `setEcho`,
  the skip's counter, `currentSpeech`) passes text, and the marks travel in it.
- **The CSS** (`index.html`, a block of its own, "chapter 12: Spanish", before the take-aways block): `.es { font-style:
  italic }`; `.gloss { font-style: normal }`; `.sb.whisper:has(.es), .ov .btext.whisper:has(.es) { font-style: normal }`
  (in a whispered balloon with Spanish the English, the gloss included, is upright and the Spanish stays italic; the
  dashed border still marks the whisper). Comic Neue's four files have ¡ ¿ á é í ó ú ñ ü (the kit's `fonts.txt`); no new
  font, and no Spanish in Andika (the Spanish count's counter is `counter words`, above). Any Aa rule goes in a new
  `@media` block, so `tests/aa-room.test.js` stays untouched.
- **The voice** (Read to me): **`pickVoice(lang)`**: `pickVoice()` and `pickVoice('en')` exactly as today; `pickVoice('es')`
  from `speechSynthesis.getVoices()`: each voice's `lang` normalised first (`.replace('_', '-').toLowerCase()`, so
  `es_MX` is es-mx), the locales in order **es-US, es-MX, every other Latin American es-* (es-419, es-AR, es-CL, es-CO,
  …), es-ES last**, and in each, **a she-voice by name first** (names NFC-normalised before matching: `Google español de
  Estados Unidos`, `Paulina`, `Mónica`, `Angélica`, `Isabela`, `Francisca`, `Soledad`, `Marisol`), then any other voice
  of that locale, **never a novelty voice**: a voice whose name's first word (NFC-normalised, before any " (") is exactly
  one of `Eddy`, `Flo`, `Grandma`, `Grandpa`, `Reed`, `Rocko`, `Sandy` or `Shelley` (a real voice whose name merely
  begins with those letters is kept); null when there is none. Each language cached; `onvoiceschanged` clears both. The
  rule is a pure helper, **`UI.voices.pick(list, lang)`**, tested in Node on made-up lists (the novelty voices first in
  it, a male es-MX voice, an `es_MX` voice, a decomposed "Mónica", an es-ES Mónica, an es-419 voice, and lists with none).
- **The plan of what is said, a pure helper**: **`UI.voices.plan(items, voices)`** returns the utterances, `[{ text,
  lang: 'es' | 'en', voice: name | null, rate, pitch }]`, and `speakItems` only turns its rows into utterances (so both
  paths, with a Spanish voice and without, are tested in Node, not first heard by Lissa). The rows: an item whose text has
  « (or `lang: 'es'`) is said in parts (`E.speechParts`), one row each: a Spanish part in the Spanish voice (`lang` its
  own, the speaker's pitch, 0.9 of the speaker's rate); with no Spanish voice, a `line: true` part is not said (its gloss
  follows) and any other Spanish part is said as its `en` in the English voice (a name its respelling: "gah-YEH-tah"; a
  number its words), or not at all when it has none; English parts as now. Every part's text goes through
  `plain(text.replace(/<[^>]+>/g, ' ')).trim()`, as a whole item's does, and a part with no letter or digit (f027's "."
  after «Galleta») makes no row, so no utterance is punctuation alone (iOS may never fire its `onend`); `onDone` hangs on
  the last row actually said. **Spanish is never handed to an English voice** (a test: no row pairs Spanish text with an
  English voice). Every other item exactly as today: its line `var txt = plain(String(it.text || '').replace(/<[^>]+>/g,
  ' ')).trim();` stays word for word in `speakItems` (pinned, `tests/tools.test.js`), followed by `E.sayAs(txt, cat)`.
  Chispapaw's English and Spanish: `PITCH.chispapaw` 1.42, `RATE.chispapaw` 1.02.
- **What Read to me says for a whole Spanish line**: the Spanish, in the Spanish voice, then its gloss in the speaker's
  English voice (what is lettered is read); with no Spanish voice, the gloss alone. A word in a line: its Spanish in place,
  or its English. **`PC.debug.speech`** keeps its shape (`(currentSpeech || []).map(` … and its `plain(…)` call, pinned) and
  prints the parts as `speakItems` hands them over, after `E.sayAs` ("Cheespa-paw"), with "[es] " before a Spanish part, so
  `DRY=1` shows which voice says what (`tests/tools.test.js` pins it as the words `speakItems` would hand the synthesizer),
  never aloud.
- **The Counts page's echo** (`runLesson`, one guarded statement right after `var res = E.counts.answer(…)`): `var echoed =
  res.correct ? E.countsEcho(def, st, res, teacher) : null; if (echoed) res.balloons = echoed;` (`def` the lesson's set,
  never `D`). The existing `res.balloons` path letters them, says them and waits for Next with the keypad away, as a fact's
  `right` lines do; the next question's clock starts after them. Null for every set but `ch12-warm`.
- **The take page's echo** (`runTakes`, **one line and a small helper; `o.echo` is never set from a set**): the problem's
  end, `problemEnd`, reads the set's `echo` itself, for every finished problem, right or helped:
  `var e = res.entry ? (def.echo ? setEcho({ problem: true, a: res.entry.a, b: res.entry.b, answer: res.entry.answer,
  correct: res.entry.correct, helped: res.entry.helped }) : (res.entry.correct ? echoOf({ problem: true, a: res.entry.a, b:
  res.entry.b, answer: res.entry.answer }) : null)) : null;`, with `function setEcho(info) { var x = E.takeEcho(def, info,
  st); return x ? { who: x.who || 'chispapaw', text: fill(x.text), lang: 'es' } : null; }`. So 475 − 132 helped still
  echoes, Count the store's round (its def from `E.takeRoundDef`, with `echo`) the same way, and every set without `echo`
  takes exactly today's path (the kit's stub hook, `PC.debug.takes('echo')`, unchanged). **Why not a hook**: any `o.echo`
  makes `reserve()` hand `takeReserve` an echo room, Chispapaw's two lines held empty above every later column of every
  problem (about 116 px of the store picture, 136 with Aa on: `docs/take-aways.md`), on the lesson and on every Count the
  store round from now on, though chapter 12 never echoes a column. With `o.echo` absent no room is held and no pinned line
  moves (`takeReserve(…)`, `var e = echoOf(echoInfo(res.col))`, the release, `startChapterLesson`'s two lines). A test:
  `takeReserve`'s candidates (`PC.ui.takes.reserve`) for each of `ch12-take`'s problems and for a store round are the same
  as for the same set with no `echo`.
- **The Spanish count** (`renderSkip`, four branches, each guarded by the skip's `lang`): (1) the counter's balloon letters
  `rich(v.count)` in place of `esc(v.count)`, in its `counter words` class (`E.skipWords`' `words: true`); (2) at the last
  tap, with `v.wait`, the page shows Next and does not turn itself (as a skip with a `done` line), and focuses Next as the
  done-line case does; (3) Read to me says `v.say` at each tap (through `UI.voices.plan`: in the Spanish voice, or with
  none its English, "ten", "twenty" …), and at the last its gloss after it when there is a Spanish voice, or with none the
  gloss alone in place of "fifty" ("Ten, twenty, thirty, forty, fifty!"); (4) the key handler: `if (sk.done ||
  E.skipView(sk, taps).wait) advance();` in place of `if (sk.done) advance();`, so Enter, Space and ArrowRight turn the
  page at the end (today the handler's `preventDefault` would also swallow Enter on the focused Next).
- **The shelf** (`renderShelf`, the kit's phase-3 shelf, whose scene is `hollowScene('wide', [Tallyheart at sunpatch, the
  player at sand-left])` with no third place): with `SH.friend`, Chispapaw joins the cast at **`sand-right`, facing left**
  (`sit`, `happy`; checked with `tools/frames.mjs --scene` to touch nobody), and the balloons are written `say: [{ who:
  'tallyheart', text: SH.line }].concat(SH.friend ? [SH.friend] : [])`, so the pinned text (`takes-ui.test.js` 542) still
  matches.
- **The speaker**: `NAMES.chispapaw` `'Chispapaw'` (a chapter's balloons before her naming carry `name`).
- **The grown-ups corner**: one line under its settings, once chapter 12 is open, **built by concatenation, never through
  `E.fill`** (whose {name} is the cat's): `'Chispapaw’s Spanish is read by this iPad’s Spanish voice: ' + esc(v.name) +
  ' (' + esc(v.lang) + ').'` or, with none, "No Spanish voice on this iPad, so Read to me says her Spanish in English. To
  add one: Settings › Accessibility › Spoken Content › Voices › Spanish." `pickVoice('es')` is read when the corner opens,
  after a `speechSynthesis.getVoices()` call (the voices may load late).
- **For the tools** (`PC.debug.spanish(what)`, beside `PC.debug.takes`, on the cat on screen, never saved): **built from
  inline copies of section 2's `ch12-warm`, `ch12-take`, `ch12-store` and the paw thing's skip** (as `PC.debug.takes`
  builds its own), using `PC.story.ch12`'s own sets when they are there: in step 2 the chapter is the stub. `'echo'` (the
  warm-up's echo page after 7 × 8 right), `'take'` (the end of 475 − 132 with its echo), `'skip'` (the paw thing after its
  fifth tap), and the chapter's own take pages, each with its set's `echo`: `'worked'` (254 − 131 at its first column, and
  `'worked:tens'` at its tens column, the school words in), `'try'` (58 − 23 at its first column, three balloons, and
  `'try:pointer'` with the ones-first pointer), `'store'` (175 − 42 at its first column); returns true or an error
  string, as `PC.debug.takes` does.

### The storyboard and the tools

- **`tools/storyboard.mjs`** (requires `app/story/words.js`): a `lang: 'es'` balloon printed "*[es]*" with its Spanish and
  its gloss ("*[es]* “…once, doce. Doce gatos.” (…eleven, twelve. Twelve cats.)"); a `{es:key}` token printed as «its
  Spanish»; a skip with `lang` "**Then the paw thing in Chispapaw’s Spanish**: Diez … ¡cincuenta! (Ten … fifty!)"; a
  set's `echo` in a line under its set ("Chispapaw echoes her first right answer in Spanish: “¡Siete por ocho, cincuenta y
  seis!” for 7 × 8, then …" / "after 475 − 132, right or helped: “¡Trescientos cuarenta y tres!”"); words for every new art
  name: `chispapaw` (SPEAKER and the cast words: "Chispapaw, a small cream pillow cat with a dark brown face, ears, paws and
  tail, big ears, blue eyes and a collar with a tiny bell"), the `collar` extra, the bridge's `store` camera and its six
  spots, `store: n` ("the store laid out on the floor: one square, three rows and three loose, 133"), `tap: 'store'`, the
  hollow's `store` ("the store's plan in the sand: five empty squares"), `storeGlow`, `quick` (1 to 3, whose marks, her
  square round like a cookie), `tap: 'squares'`, `hedge-right`, the den's moon at 16 (the existing "a mouse in the mouth"
  for `holds: 'mouse'` is now true of a cat too); and
  a `--check-words` list for chapter 12's names, as chapters 6 to 11 have. Chapters 1 to 11 and `warrior.md` regenerate byte
  for byte.
- **`tools/shots.mjs`**: targets `es:echo`, `es:take`, `es:skip`, `es:worked`, `es:worked:tens`, `es:try`,
  `es:try:pointer`, `es:store` (through `PC.debug.spanish`, on a test cat, silent), **in an object of their own,
  `ES_TARGETS`**: `TAKE_TARGETS` and the `takes` job stay exactly as they are (`tests/takes-tools.test.js` 131 deep-equals
  `TAKE_TARGETS`' keys, and holds no owner). **The SILENT stub takes a made-up voice list**: `VOICES=es` (an es-MX
  Paulina, an en-US voice and the eight novelty voices) or `VOICES=none` (the default, today's `getVoices: []`); with
  either, the stub notes each utterance's text, lang and voice and never speaks. `DRY=1` prints `UI.voices.plan`'s rows
  for both lists on the `es:` targets and on f014, f018, f027, f061, f074, f075, f076. Silent by construction, never aloud
  on the mini. **`dev/webkit/run.mjs`**: a `spanish` job with those eight screens and `hollow:shelf` with Chispapaw, for
  the page review's sizes.

### The kit pins it moves (each named, a chapter-12 comment each)

1. **`tests/takes-ui.test.js`**, "nothing a player can reach changes": `sha(fnSrc(UI_SRC, 'runLesson'))` takes runLesson's
   new hash (the one guarded statement); the v23 `index.html` hash ('ed069d…') stays, with the test cutting, beside the
   take block, the stub's two script tags (the orchestrator's, at the stub) and the Spanish block, whose selectors it checks
   against their own list (`.es`, `.gloss`, `.sb.whisper:has(.es)`, `.ov .btext.whisper:has(.es)`).
2. **`runTakes`**: `problemEnd`'s echo line and its `setEcho` helper (unpinned); no hook is made and `reserve()` is
   untouched, so no pinned line moves (the pins read `takeReserve(…)`, `var e = echoOf(echoInfo(res.col))`, the release,
   `startChapterLesson`'s two lines: all unchanged). The kit's design row for `o.echo` ("each right problem") is superseded
   by `docs/build.md`'s chapter-12 section: a set's `echo` is read at the problem's end, right or helped; `o.echo` stays the
   column hook, for a later chapter that echoes columns.
3. **`E.takeLine`** (the school words): the kit's test 13 fills every line at every turn with `PC.words` stubs, on sets
   without `teach: 'none'`, so it stands; a case for the worked example is added.
4. **`E.takeRoundDef`, `E.takeRoundStart`, `E.hollowShelf`**: the phase-3 tests that deep-equal their return gain `echo`,
   chapter 12's `lines` (a round's def while only `none` is learned) and `friend`: **`tests/takes-engine.test.js`** 854 (the
   shelf: `{ greet, line, steps, buttons }` gains `friend`) and any deep-equal of a round's def there; only those lines,
   each with a chapter-12 comment (the spanish owner's).
5. **`renderShelf`** (`tests/takes-ui.test.js` 542 pins `say: [{ who: 'tallyheart', text: SH.line }]` as text): the
   `.concat(SH.friend ? [SH.friend] : [])` after it and Chispapaw in the cast when `SH.friend` is set; the pinned text
   still matches.
6. **`E.skipWords`, `renderSkip`**: `words: true` for a Spanish count, and renderSkip's four branches (the lettering, Next,
   the speech, the key handler); every other skip as before.
7. **Kept word for word**: `speakItems`' pinned line, `PC.debug.speech`'s shape, `startChapterLesson`, `keypadPress`,
   `go`, `takeReserve`, `reserve()`, every `PINNED` engine function of `takes-engine.test.js` 15 (`E.counts` untouched: the
   echo is computed outside it), `E.TAKE_WORDS` (its values, with this `PC.words`, the kit's English), `TAKE_TARGETS` and
   the `takes` job in `tools/shots.mjs` (`tests/takes-tools.test.js` untouched). `E.fill` is not pinned; its one-pass
   regex fills every existing token exactly as before (a test over every line).

### Tests (the engine owner's, `tests/spanish.test.js`, new)

`E.esNumber` on a hand list (0, 1, 11, 12, 15, 16 "dieciséis", 21 "veintiuno", 22 "veintidós", 23 "veintitrés", 26
"veintiséis", 31, 56, 100 "cien", 101 "ciento uno", 110, 115, 121 "ciento veintiuno", 133 "ciento treinta y tres", 200, 343
"trescientos cuarenta y tres", 500 "quinientos", 700 "setecientos", 900 "novecientos", 999, 1,000 "mil"), none with "ciento
y"; `E.esFact` for every pair to 10 × 10 (and 7 × 8 "siete por ocho, cincuenta y seis"); **the capitals**: "¡Ciento…",
"¡Trescientos…", "¡Siete por…", "Doce gatos." capitalised, and "¡cincuenta!" in mid-line and "…once" after an opening
ellipsis kept small, their glosses the same way from `E.numberWords`; `E.fill` with every kind of key (a number, `fact`,
`answer`, a word) and an unknown one left as written, and every line of chapters 1 to 11, `PC.warrior`, `E.TAKE_LINES` and
`E.STORE_LINES` filled as before; `E.fill` in one pass (a typed dream "{es:12}" inserted by `{dream}` stays as typed; a
¡/¿ before an es token and its !/? after go inside the marks); **the typed dream**: a cat whose dream is '«hola» {es:12}'
gets no Spanish lettering and no Spanish speech in her book (“hola” {es:12}, said in English); `E.esGloss`, `E.esLine`,
`E.esEnglish` ("Galleta" → "gah-YEH-tah", "cincuenta" → "fifty", "¡Cincuenta!" → "Fifty", "gatos" → "cats"); `E.sayAs`
("Chispapaw’s" → "Cheespa-paw’s", "Chispa" → "Cheespa", "Chips-paw?" kept; **a cat named Chispa, and a cat whose pet name
is Chispa: every line of chapters 1 to 11 said exactly as before**); `E.speechParts` for a whole line, a word in a line, a
whispered line, the kit's stub echo, "«veinte»" alone (a word part, not a line part), f027's "«Galleta»." and f075;
`E.countsEcho` (first right only; a retry counts; a list; the remembered line kept before it; null for every existing set)
and `E.takeEcho` (475 − 132 right and helped, its twin never, a column never, `on: 'first'`); the Spanish count
(`E.skipView` at taps 0 to 5, its `say`, `gloss`, `wait`, a one-group count "¡Diez!"; `E.skipWords`' `whisper: false` and
`words: true`; every existing skip's view and words unchanged); `E.takeLine`'s school words on a `'show'` problem of a
`teach: 'none'` set's tens, not on its twin, not on any other set; `E.takeRoundDef`'s echo, `E.takeRoundStart`'s
`lines.extra` while only `none` is learned (and the kit's lines once another step is), and `E.hollowShelf`'s `friend`
(absent while a sitting waits); each `E.checkStory` guard, the later chapters' ones included (and no new error for
chapters 1 to 11); **the page in Node**: `rich()` on every line of chapters 1 to 11 unchanged and on the Spanish forms as
above; `plain()`; `UI.voices.pick` on the made-up lists (es-US Google first, then Paulina, an `es_MX` voice and a decomposed
"Mónica" found, never Eddy … Shelley, a real voice whose name only begins so kept, es-ES last, null with none);
**`UI.voices.plan`** on three lists (with an es-MX Paulina; novelty-only Spanish, which must give no Spanish voice; none at
all) over a whole Spanish line, a word in a line, f027, f075 and the paw thing's taps: which part goes to which voice, its
lang, rate and pitch, the gloss after the Spanish, line parts skipped with no voice, a name's respelling, no row of
punctuation alone, and no row pairing Spanish text with an English voice; the take page's echo holding no room
(`takeReserve`'s candidates the same with and without the set's `echo`); the CSS block pinned as text; runLesson's echo
statement, `problemEnd`'s echo line, renderSkip's four branches and renderShelf's balloons pinned as text.

## 7. Known issues the text critics left

Checked against Draft v0.4. The text took two critique rounds (v0.2, v0.3) and a verify round with the leftover-lows and
Spanish critics (v0.4). Every low in `critique-known.json` was applied by v0.4 but those below; every low and skip in
`critique-verify.json` is applied in v0.4 or is a spec item here. What is still true of v0.4, and how the build handles it:

1. **The story is final at Draft v0.4.** No word of it changes.
2. **The story's notes this spec supersedes or settles** (she reads none of them; no line she reads changes):
   - *"the fifth tap shows the English line as the count's `done` line, and Next turns the page"*: a Spanish count needs no
     `done` line; the fifth tap letters the gloss under the Spanish in the counter's own balloon and the page waits for Next
     (section 6, "The Spanish count").
   - *"the kit's “A row is a ten. A square is a hundred.” comes here, once"*: said before the worked example's tens line
     (section 6), not with the prompt, which is already the kit's longest first column.
   - *"Chispapaw says the first right answer … wherever it comes"* and *"Her echo and her line hold the page"*: the line
     the answer earned (her hardest remembered, a retry's "There it is…") stays, before the echo (section 9, call 8).
   - *"its twin, if any, is asked plainly"* (both the worked example's and 58 − 23's): the kit's queue copies no `prompt` and
     no `right` into any twin (run); pinned for every twin in the chapter.
   - The Waffles cut (the brief's): if the plain path passes 2,000, f011 goes and f012 opens "{petname}! NEWS, darling!"
     (editor-r1's item 1). At 1,739 to 1,767 it stays.
3. **Chapters 1 to 11, the Warrior Counts and the kit's pages draw and read byte for byte** for every live save: the
   hollow's four options, the bridge's `store` camera and option, the den's 16 and `hedge-right` are off or unused before;
   `chispapaw` is a new id; `holds: 'mouse'` on a cat and the quick marks' `round` were drawn by no frame before; every
   Spanish branch is reached only by chapter 12's keys or the engine's own marks (section 6). Two guards keep typed text
   out of it: `E.sayAs` skips the cat's own name and pet name (a cat named Chispa is said as before), and `E.fill` fills in
   one pass (a typed "{es:12}" stays as typed). **The one deliberate change**: a dream typed with « or » now letters them
   as “ and ” (read so, never stored so), since the engine's marks would otherwise turn it into Spanish italics.
   **The proof**: the existing fingerprints and goldens; the sets owner's **`<ch12-fingerprint>`**, recorded from a snapshot
   of main before any edit, in a process of its own: every frame of chapter 11, every `hollow` camera with the new options
   off, every `bridge` camera of chapters 2 to 9, every `den` camera with each moon of the list, every `garden` camera;
   the cats owner's fingerprints of every existing cast member untouched; `tests/takes-ui.test.js`' and
   `takes-engine.test.js`' pins as section 6 lists; a test that `rich()`, `plain()`, `E.fill`, `E.skipView` and `E.checkStory`
   give every line, skip and chapter of 1 to 11 what they gave.
4. **Can't be built literally, built nearly**: "{Murmur}chime carries in four mice at once" (one mouse drawn: the caption
   says four); "You hop up onto the hedge-top" (a climber's caption; our cat stays on the lawn); "two blue eyes, right in a
   gap" and the friends' "Hello." (the little cat is not drawn on f013; the next frame shows her); "Something rustles"
   (said, not drawn); "she dips hers back, so low her bell goes ting" and "front paws out, tail up" (the Tap turns the page;
   the next picture shows the result where it can: our cat crouched with her tail up on f003, Chispapaw looking up on
   f036); "you wave your tail, she waves hers" (she is across the camp: our cat's tail up on f072 only); "The Clan carries
   its first frost-time catch … mouse by mouse" (cats with a mouse each on the bank and under the bridge; the store first
   drawn when the catch lies on the floor, at 175); "Glintstar leaps up onto the fountain" (`stand` on its top); "She
   BOUNCES" (`stand` and motion lines); "His paws twitch" (motion lines); "Off he goes" (`dive` and *Splash!*); "Sloshbank
   sent word" and "the weasels' tunnel was filled with stones" (captions only: neither is drawn); "You watched this Clan
   through the glass" (chapter 1's view from the room, as a memory panel, f016); "In the next nest" (said by the picture,
   not lettered: a speech tag); "Across the camp, Chispapaw rolls over" (asleep, curled).
5. **175 − 42's hundreds** (maths low, optional, skipped by the editor): her first two-digit number under a three-digit one;
   the kit's full line "Now the hundreds. Nothing to take." carries it (the store's one problem is its first, so its lines
   are full). Kept.
6. **"Pretend it holds two hundred fifty-four…"** (reader, optional, skipped): the kit pins the worked prompt's twelve words;
   the screen before says "so let's pretend". Kept.
7. **The warm-up's echo needs a right answer**: a cat who misses all three Counts and every retry hears no echo and no "My
   little Tall One…" (vanishingly rare: each retry comes after the sand's help). Kept; the lesson still never stops.
8. **The take echo holds no room** (section 6): a set's `echo` is read at the problem's end, never made into the kit's
   `o.echo` hook, so the kit reserves no echo room above any column (a hook would hold Chispapaw's two lines empty above
   every later column of the lesson and of every Count the store round, about 116 px of the picture). A takes-ui test
   pins it; the page review looks at a later column of 76 − 42 at 1080 × 720 and 390 × 844 to see no band.
9. **A gloss makes a Spanish balloon two lines taller**: at the end of 475 − 132 the stack is released (the kit's), so the
   keypad may sit lower for that end screen only; on the Counts page the keypad is away. The page review measures `es:take`
   and `es:echo` at the four sizes, Aa off and on (section 10).
10. **A re-sit waiting over the take lesson**: the warm-up's first answer sets a waiting Warrior Counts sitting aside, so the
    take lesson opens without the waiting line, except for a cat who starts a re-sit between the warm-up and f048 and comes
    back within two hours (the kit's UI owner's warning: `take:first` with the waiting line does not fit at 1080 × 720).
    Every take frame has `intro: false`, so nothing of the frame's is added; the rest is the kit's.
11. **Decision 54's alternative** (Tallyheart takes Chispapaw; Glintstar asks her to show her the ropes): the screens that
    change are f033 to f038c (the mentor, "She's yours", the dip, her first words and their replies, "Now you know how I
    felt"), **bedtime's "A store to count and an apprentice. Show-off."** (f072, the fidelity critic's low), **"Will you teach
    me to catch a mouse?" / "Tomorrow."** (f072: checked against chapter 13's `teach`), the book's third line, and module-2's
    open question 1 list (`teach`, the last line, the back cover). Nothing else in chapter 12.
12. **Module-2's chapter 12 entry still says "while she sat her Counts"** (the verify skips 0 and 13): the brief now reads
    "after your Counts", the story's v0.4 wording (decision 49). For the orchestrator (section 10).
13. **"practice"** (US, the game's spelling) where the brief and module-2 quote "practise" (editor-r1's item 11). As the
    story letters it.
14. **Frames: 77 to 80** a reading, against the story's estimate of 73 to 83: the captions-first splits, the option
    frames and the title panel. Under the brief's 125.
15. **A twin may land on 133** (the kit's and the Counts critics' low): a helped lesson problem's twin avoids only its own
    lesson queue's answers (`T.digit`), not the store's, so about 0.8% of the twins of a helped 254 − 131, 475 − 132 or
    368 − 145 come out at 133, which the store then asks at sunset. Accepted: a kit change for a rare repeat, and the
    written problems' answers are all different (section 2). If play shows it, `E.takeLesson` can pass
    `chapterAnswers(story)` into the twins' avoid list (the engine's, with a test).
16. **The `extra` slip is still logged `extra`**: `NO_SPREAD` changes only the line she hears; the take log keeps the
    kit's name, so the grown-ups' table labels such a slip "regrouped when not needed", though nothing was. Only a kit
    change (naming `fact` where no spread step has been learned) would fix the label; for a grown-up, not her. Kept.
17. **A cat named Chispa** (`keepNameChars` allows it, a common Spanish pet name): she was Chispapaw through chapters 2
    to 10, and chapter 12 gives the newcomer that very name, a collision like Murmur's (`E.tortieWord`). Her speech is
    guarded (`E.sayAs` never respells her own name or pet name), and the collision on the page is accepted for chapter 12
    (section 9, call 29): a token like `{Murmur}` would change the story's words for her, which is the text phase's, not
    the build's.

## 8. What chapter 13 inherits

- **When.** Chapter 12 is day 1 of module 2, the day after the ceremony: she wakes at noon, the midday count, the afternoon
  at the hedge and in the Hollow, sunset at the store under the Old Bridge, bedtime under the moon (16 in the art, waning,
  never named). Frost is coming; the first frost is chapter 13's morning. Riffle's "Come to the Crossing at first light!" and
  Tallyheart's "First light, then." are chapter 13's opening.
- **The store.** In the dry den under the Old Bridge: **133** (one square, three rows, three loose), five hundred by the full
  moon (day 27), its count hers ("The cat who counts what's missing. And what's THERE."). Drawn by the bridge's `store`
  camera with `store: n` (lights: day, sunset and dusk; night is chapter 14's); her book's chapter 12 page draws 133
  (`book.store`). The Clan's catch today was 175, 42 to tonight's pile.
- **Chispapaw** (`chispapaw`, drawn: the pointed coat, big ears, blue eyes, a red collar with a tiny gold bell; `collar:
  false` ready for the morning she leaves the bell in her nest). "Galleta" to her Tall Ones (lettered in Spanish, never her
  label); Chispa means spark. Her own apprentice ({name}{ending}'s, decision 54), Tallyheart her Counts teacher. In the
  apprentices' den with the grey tom, in the player's old nest (the picture's; no line says so); visits her little Tall
  One at homework time, and her little Tall One "always sighs at homework" (58 − 23's whisper: chapter 13's «la resta»
  starts there); never met a mouse ("I caught a sock once"), promised a mouse lesson "Tomorrow"; shy of Spanish
  before the Clan by day (she whispered at the hedge and before the Clan), out loud at night; new to take-aways too, never
  corrects her. Her label is "Chispapaw"; her voice pitch 1.42, rate 1.02.
- **Count the store is open** in the Training Hollow (`E.storeOpen`: chapter 12's lesson finished): the shelf with
  Tallyheart's greeting and Chispapaw's "¡A contar!" (Let's count!), her in the shelf's scene at `sand-right`; a round's
  first problem right in every column echoed in her Spanish, with no echo room held; while `none` is the only step
  learned, a round's help never talks about spreading (`lines.extra`). Steps learned: `none`.
- **The maths.** Take-aways, step 1: loose, a row, a square, ones first; the quick way to scratch a count (a square, a line,
  a dot), not credited to any Clan (where it comes from is chapter 21's); no spread yet (chapter 13's), never "borrow". Her
  take log has her first six take-aways (the ones-first pointer's first five are spent). Counts: none new; the warm-up
  across all 54 pairs has run once. The school words ("A row is a ten. A square is a hundred.") said once, on the worked
  example; chapter 13's worked example says them again (the kit's `'ones2'`).
- **Spanish, the feature** (section 6): `PC.words` (`app/story/words.js`: the kit's fourteen English words, `es` with
  `gatos`, `por`, `aContar`, `galleta`, and `sayAs`), `{es:key}`, `lang: 'es'` balloons with their gloss, `E.esNumber`,
  `E.esFact`, the echoes (a set's `echo`), the Spanish count (a skip's `lang`), the voice by locale and name. A new word is
  one line in `es` (chapter 13's «la resta» and "¡No alcanza!"). Spanish so far: counting, a fact, "¡A contar!", «Galleta»;
  no class word yet.
- **Where they are.** She is asleep in her warrior's nest beside {Murmur}chime's (the mist stone grey on the moss, Riffle's
  stone where she put it); Chispapaw and the grey tom asleep in the apprentices' den (the grey tom still unnamed: chapter
  20's; the paw thing now in Chispa's Spanish, "Same paw thing. Better words."); Tallyheart passing ("A good day's work,
  warrior."); Waffles on her balcony, knows the name, keeps {petname} ("I'll need a WEEK to practice it"), has met the new
  pillow cat's name ("A COOKIE! Darling, we're BOTH snacks."); Riffle home, pebbles held still under the bridge (Otter's
  honor); Granny has found another badger track, a fresh one (its place unsaid: the Crossing is where they meet); the stash
  emptied (both Clans' prey home), the weasels' tunnel filled with stones (module 1's last thread, paid); tonight's pile got
  the catch's 42 (no total for the pile is said).
- **Who knows what.** The whole Clan saw Chispapaw named and purred her name; {name}{ending} spoke up for her (one of
  three ways, no flag: no later line may say which); the old tom grumbled ("ANOTHER pillow cat?", "Chips-paw?") and was
  answered. Riffle has met Chispapaw ("A NEW one! Do you juggle?" "I… count?").
- **Flags**: none new. Every earlier flag stands.
- **Drawn now** (copy into continuity's places table at ship): the bridge's `store` camera (the dry den's floor, the store
  laid out by the kit's picture, `store: n`, `tap: 'store'`, six spots); the hollow's `store` (the store's plan, empty
  pressed places), `storeGlow`, `quick` (her square round: the quick marks' `round`) and `tap: 'squares'`; the den's
  `moon: 16`; the garden's `hedge-right`; the camp, the garden's hedge and the tower's balcony by `day` (or the midday run
  at `morning`, as the sets owner found); Chispapaw; a cat carrying a mouse (`holds: 'mouse'`).
- **Words on screen now**: take-aways, loose, a row, a square, ones first, the store, frost-time, a warrior's nest, the
  apprentices' den, the paw thing, "the quick way to scratch a count"; Spanish as above. Not used: borrow, StarClan,
  Twoleg, kittypet, fresh-kill, Thunderpath, vigil, warriors' den, whisker-length, claw-length.
- **Standing rules, still**: as chapter 11's, and: no badger on screen, not even a shadow; a Spanish line at most eight
  words, its English on the same screen, Latin American spelling, never in an English voice, never aloud on the mini; no
  story information in Spanish only; a take-away is never called a Count; the store is drawn only at the story's numbers.

## 9. Calls made

1. **Spanish travels as marks in the text**: a token fills as «…», a whole Spanish line as «…» with its gloss on the next
   line, and `rich()` and `speakItems` read the marks. Reason: every page passes text (frames, the Counts page's
   `res.balloons`, the take page's echo, the skip's counter, captions, `currentSpeech`), so one change each in the
   lettering and the speech reaches them all without touching the dozen places balloons are built, or the pinned runners;
   no live line has «».
2. **A whole Spanish line is written in tokens only, its English made by the engine** (`E.esGloss`). Reason: no story
   information in Spanish only, by construction; a word and its English change together, in one line (decision 53).
3. **`PC.words` is its own file, `app/story/words.js`**, with the kit's fourteen English words, `es` (each word beside its
   English) and `sayAs`. Reason: one table for module 2, read by the kit and by every chapter's tokens; a story file holding
   another file's table would tie later chapters to chapter 12's.
4. **Read to me says the Spanish in the Spanish voice, then its English; with no Spanish voice, the English alone** (a word:
   its English; a name: its respelling). Reason: Read to me reads what is lettered, and the gloss is lettered; Spanish is
   never in an English voice (module-2's rule).
5. **The voice by locale (es-US, es-MX, other Latin American, es-ES last) and by name, never a novelty voice**, tested on a
   made-up list. Reason: the Spanish critics' finding; iPads carry eight novelty voices in every Spanish locale.
6. **Chispa and Chispapaw in the English voice, respelled for speech only, whole words, the longer first.** Reason: the
   brief's call 5 and the story's For us; a plain replace would make "Cheespapaw".
7. **The gloss is lettered upright in parentheses under the Spanish; in a whispered balloon with Spanish, the English is
   upright.** Reason: How to read's promise (Spanish in italics, English in roman), on the shy lines too (the verify
   critic's).
8. **The warm-up's echo follows whatever line the answer earned**, and with it waits for Next. Reason: module 1's specific
   praise ("Not today!") is kept when the echo lands on her hardest fact, which is likely (her hardest come first).
9. **The take echo is a set key, `echo`, read by the take page's problem end for every finished problem, never made into
   the kit's `o.echo` hook.** Reason: the story's "right or helped (never its twin)"; reading the set leaves
   `startChapterLesson`'s pinned lines alone and serves Count the store the same way, and a hook would hold an empty echo
   room above every later column (the spec critics' finding, v0.2).
10. **The paw thing is a skip with `lang: 'es'`**: the count in Chispapaw's words, out loud, the gloss with the last tap, then
    Next; `carry: false`. Reason: a count that turns its own page shows its English for under a second (the editor's
    finding); her count is "out loud at night".
11. **Count the store: Chispapaw's "¡A contar!" on the shelf and one echo a round** (its first problem right in every
    column); she is drawn in the shelf's scene. Reason: the kit's section 5 gives these to chapter 12; "¡A contar!" is the
    chapter's own Spanish; one echo in five problems is module-2's "about one in three", kept small for a page played often.
12. **The store is a new camera, `store`, on the bridge, the kit's own picture laid on the floor (`store: n`, `tap: 'store'`),
    `small`, at one fixed scale with its top edge fixed.** Reason: the brief's "a new camera on the bridge set"; one picture
    for the store, the take page and her book; fixed, 133 lies where 175 lay, so it reads as 42 taken away.
13. **The Hollow's store picture, its glow and the quick marks are hollow options in one fixed box; the store drawn as its
    plan (empty pressed places), the marks right to left, Chispapaw's square round like a cookie (the quick marks'
    `round`).** Reason: the story's three beats (Tallyheart's, "Chispapaw scratches one too", "yours beside hers"); chapter
    7's `compare` is the precedent (a fixed box); the store is empty till sunset ("so let's pretend"), so no prey is drawn
    in the Hollow; each set lies at its scratcher's paws; no crumbs, so no extra dot.
14. **The hedge is the garden's side** (`hedge`, `hedge-close`), the little cat's nose into the gap, a third spot
    `hedge-right` near the camera's right edge (Tallyheart's tail cropped). Reason: the only cameras with a gap; the doce
    frame then shows no crowd to count (the verify critic's rule), and she is outside looking in, as the player once was;
    the hedge camera is 500 wide, so three cats fit only with the third at its edge.
15. **A memory panel for "You watched this Clan through the glass"** (`room`/`outside`, `clan: true`, dusk). Reason: the story
    splits there anyway (a caption after a balloon), and chapter 1's own picture says it best.
16. **The mutter is chapter 1's own shot** (`camp`/`entrance` from above, the watching shadows). Reason: "the way it once
    muttered about you".
17. **The four choices with their own replies go to option frames that meet again; no flag.** Reason: the brief's "setting
    no flag"; Back works as on any choice.
18. **Chispapaw's look**: a preset of her own (cream, dark brown points, big ears, blue eyes, a red collar and a gold bell),
    `collar: false` ready; the contact sheet before the rest of her art. Reason: module-2 and the brief; chapter 13 takes the
    collar off.
19. **The camp, the hedge and the balcony by `day`, checked; if any reads wrong and cannot be fixed without changing a drawn
    frame, the whole midday run (f005 to f053) at `morning`. Her warrior's nest at noon is `morning`.** Reason: no camp
    frame was ever drawn by day; one rule for the run keeps the light from flipping between places; the den's brightest
    drawn light is morning.
20. **Speakers**: Chispapaw labelled "The little cat" by `name` until named, "Chispapaw" by default after; the off-panel
    "Hello." and goodnight call named so they show no face; the grey tom stays "Snoring apprentice". Reason: the verify
    critic's name-tag rule; chapters 2 to 11's off-panel precedent.
21. **The teaser's title is "Chapter 13: The Hunter's Crouch".** Reason: module-2 names chapter 13; chapters 6 to 9's teasers
    named the next chapter.
22. **The book page is English only.** Reason: `renderBook` stays as book two builds it; the Spanish lives on the pages.
23. **The kit's school words are said before the worked example's tens line.** Reason: the kit's design gives them to
    chapters 12 and 13 and the tree had not wired them; on the first column they would crowd the kit's longest stack.
24. **Three owners: cats, sets, Spanish.** Reason: Chispapaw is a whole new cast member with a contact-sheet gate; the hollow,
    den and garden (scenes.js) and the store (bridge.js) are one owner's set art; Spanish is engine, page and tools together.
25. **No frame draws the store while it is being carried in.** Reason: the store is drawn only at the story's numbers (175,
    133): the carrying is on the bank and under the bridge.
26. **Every take frame and the warm-up take `counts: { intro: false }`.** Reason: the kit's UI owner's warning about room at
    1080 × 720, and each frame's balloons are read on the frame already.
27. **The grown-ups corner names the Spanish voice, or how to add one.** Reason: a parent can only fix a missing voice in
    Settings; the maths study proposed it.
28. **Chispapaw sleeps in the player's old apprentice nest** (the picture only). Reason: the den's `inside` has the spot; no
    line claims it, so nothing has to be kept.
29. **A cat named Chispa: the collision accepted for chapter 12, her speech guarded** (section 7, item 17). Reason: a token
    would change the story's words for her (the text phase's, not the build's), and the name check cleared Chispa; her own
    name is never respelled, so chapters 1 to 11 sound as they did.
30. **No spreading talk before chapter 13** (`lines: NO_SPREAD` on both take sets, and on Count the store's rounds while only
    `none` is learned). Reason: the brief's "no spreading yet"; the kit's `extra` line names a spread on what is, this
    chapter, an ordinary fact slip; the override is a kit key, no kit change.
31. **The store's one problem takes `teach: 'none'`, for the ones-first pointer only.** Reason: it is her sixth take-away, so
    the pointer would be off, and a leading digit typed first would cost her Glintstar's right line.
32. **Cats carry mice: `holds: 'mouse'` drawn for cats** (the cats owner's), not voles in their place. Reason: the story says
    mice ("mouse by mouse", "It's a BIG one"), and the storyboard already says "a mouse in the mouth".
33. **E.VERSION is the orchestrator's, at the ship.** Reason: its date is the ship's, and its pin was in no owner's list.

## 10. For the orchestrator

- **Step 1, before the build (on main, after the kit and book two are merged), the stub** (run on a scratch copy of the
  take-aways tree: `~/potomac-crossing-work/ch12/spec-writer/stub/`):
  - `app/story/words.js`: the file of section 6 with `es: {}` and no `sayAs` (the engine owner fills them).
  - `app/story/ch12.js`: `PC.story.ch12 = { id: 'ch12', number: 12, title: 'A Spark at the Hedge', module: 2, start: 'f001',
    names: { player: '{name}{ending}' }, frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.', end: true }
    }, counts: {}, cards: {}, teaser: { title: 'Chapter 13: The Hunter’s Crouch', lines: ['Granny has news: a fresh badger
    track. Who made this one?'] } }`, in chapter 11's wrapper.
  - Script tags `app/story/words.js` then `app/story/ch12.js` after `ch11.js` in **`index.html` and `dev/gallery.html`**;
    both in `sw.js`'s `ASSETS` after `ch11.js`; **`CACHE` one past the ledger's latest** (the kit and book two take their
    own); `node tools/storyboard.mjs app/story/ch12.js` for `docs/storyboard/ch12.md`.
  - **Five tests fail with it, each the orchestrator's to change with the stub** (run): `tests/story-ch11.test.js:1579`
    (chapter 11's teaser is now `built: true, next: 'ch12'`); `tests/story-ch11.test.js:1590` (after the Ceremony the hub's
    next is chapter 12 itself, not "A new adventure"); `tests/warrior-ui.test.js:199` (its "chapter 12 finished too" case
    now reads chapter 12's teaser, "Chapter 13: The Hunter’s Crouch"); `tests/warrior-engine.test.js:1154` (`readyCat`
    finishes every chapter, so the real chapter 12's teaser shows: finish every chapter but the last, or expect it);
    `tests/takes-ui.test.js:362` (the v23 `index.html` hash: cut the two new script tags before hashing). Plus
    `tests/sw.test.js`' CACHE check, which wants the bump. **`main` is never pushed while the stub stands.**
- **Step 1b, the contact sheet** (the brief's gate): the cats owner draws Chispapaw's coat in `sit` and `walk` and the sheets
  of section 4 first, in its work folder; the orchestrator looks at them (one sheet read) before the owners go on. If the
  workflow cannot pause a phase, run the cats owner's coat-and-sheet as a short step of its own before step 2.
- **Step 2, the build: three owners, disjoint** (section 9, call 24):
  - **cats**: `app/art/cats.js` (Chispapaw; `holds: 'mouse'` for cats; the quick marks' `round`), `tests/cats.test.js`
    (her coat's measures and fingerprints; a cat holding a mouse; `round`; every existing cast member's fingerprints and
    every existing quick-marks output untouched), `dev/gallery-cats.html` (her section).
  - **sets**: `app/art/scenes.js` (`chispapaw` in `CAT_IDS`; the hollow's fixed box, `store` as the plan, `storeGlow`,
    `quick` right to left with `round` on Chispapaw's set, `tap: 'squares'` over the whole picture; the den's 16; the
    garden's `hedge-right`; the day looks), `app/art/sets/bridge.js` (the `store` camera, its spots, `store` `small` at a
    fixed scale and top, `tap: 'store'`), `tests/scenes.test.js` (the `<ch12-fingerprint>` first, before any edit; `hedge-close`
    framed on her head), `tests/set-bridge.test.js`, `dev/gallery.html` (`EXTRA` entries only, each labelled "chapter 12: ").
    It settles and reports `HOL_YOU`, the store's depth order and the day-look rule.
  - **spanish**: `app/engine.js`, `app/ui.js`, `index.html` (the Spanish block), `app/story/words.js` (filled),
    `tools/storyboard.mjs`, `tools/shots.mjs`, `dev/webkit/run.mjs`, `tests/spanish.test.js` (new), the moved pins in
    `tests/takes-ui.test.js`, **`tests/takes-engine.test.js` (only the deep-equals of `E.hollowShelf`, `E.takeRoundDef` and a
    round's def: section 6's kit pins, item 4)**, `tests/tools.test.js` and `tests/storyboard.test.js` only where its words
    need a pin, `docs/build.md`'s "Chapter 12" section. Not `E.VERSION` or its pin (the orchestrator's, at the ship), not
    `TAKE_TARGETS` (`tests/takes-tools.test.js` stays untouched).
  - Nobody holds `app/story/ch12.js`, `tests/story-ch12.test.js` or `docs/storyboard/ch12.md` (the story builder's, later),
    nor `sw.js`, `tests/sw.test.js`, `tests/story-ch11.test.js`, `tests/warrior-ui.test.js`, `tests/warrior-engine.test.js`
    (the orchestrator's, at the stub), `tests/engine.test.js` (the orchestrator's, at the ship: `E.VERSION`),
    `tests/takes-tools.test.js` or `tests/aa-room.test.js` (untouched).
  - **Between owners**: the sets owner places Chispapaw with a `clancat` stand-in at 0.78 and passes `round: true` before
    the cats owner's key lands (a square until then); the orchestrator looks at f014, the Hollow's marks and the store's six
    again once both have landed.
- **Step 3, the story builder** writes `app/story/ch12.js` from section 5 on the built engine and art, with its test and
  storyboard, and checks chapter 11's teaser tests as the stub changed them. **Then the orchestrator re-runs** the `es:`
  targets (now from `PC.story.ch12`'s own sets) and `DRY=1` on them and on the Spanish frames, and the sets owner's three
  acceptances (the Hollow, the hedge, the store) on the real casts with `chispapaw`.
- **Engine need**: Spanish, as section 6 designs it (the brief's one), plus the kit's school words if the merged kit lacks
  them (check `E.takeLine` for `schoolWords` after the merge: in the take-aways tree on 2026-11-07 it is defined and never
  said). Record in the README, under "Claude's calls under decision 46": Spanish as chapter 12's one feature (no new
  interaction; the save unchanged), and that decisions 53 and 54 bind it.
- **Module-2's chapter 12 entry**: "yesterday, while she sat her Counts" → "yesterday, after her Counts" (the story's v0.4 and
  the brief's wording, decision 49), with the README call under decision 46 (the verify skips 0 and 13).
- **README** (end of the spec phase): section 9's calls in short. At ship, the echo list takes: a newcomer at the camp's edge
  watched by the Clan and vouched for (the books' shape, our words: chapter 1's own scene mirrored); a mentor given an
  apprentice at her naming.
- **`docs/continuity.md`** (ship): section 8; the store's running count's first entry (133, day 1); the places table
  (section 8, "Drawn now"); the cast (Chispapaw); the Counts table, row 12: three Counts (the cross-table warm-up), six
  take-aways (step 1, no spread), the store's 175 − 42, the paw thing in Spanish; no new Count, marks 10.
- **`docs/build.md`** gets a "Chapter 12" section from the spanish owner (section 6 as built; the store camera, the hollow's
  options, the den's 16 and Chispapaw in a line each).
- **`E.VERSION`** '0.12.0 (chapter 12, <ship date>)' and its pin in `tests/engine.test.js`: the orchestrator's, at the
  ship; `CACHE` as at the stub, checked again at the ship.
- **The page review** (Node, `DRY=1`, the WebKit tool): `es:echo`, `es:take`, `es:skip` (the gloss in, the counter in Comic
  Neue), **the chapter's own take pages, `es:worked` and `es:worked:tens` (the school words), `es:try` and
  `es:try:pointer` (58 − 23's three balloons, about 7.8 line-units, the lesson's tallest) and `es:store`**, and
  **`hollow:shelf` with Chispapaw** (her two-line balloon), at the four sizes and the four extra ones, Aa off and on.
  Acceptance for the take pages: no `col-off`, and the heads row (the quick marks this lesson has just taught) kept at
  1080 × 720 and 1180 × 820; if 58 − 23 still overflows, the review names which of `fit()`'s fallbacks is accepted. A later
  column of 76 − 42 (no echo band, item 8). `DRY=1` with `VOICES=es` and `VOICES=none` on f014, f018, f027, f061, f074,
  f075, f076 and the `es:` targets (the plan's rows: each part, its voice, its lang; never aloud on the mini).
- **The ship's look** (at most 25 pictures, silent, the screen locked: `tools/shots.mjs`): her warrior's nest at noon (f002);
  the midday count by day (f005); Waffles from the foot of the tower (f010); the hedge with three cats (f017); the doce frame
  (f014: the Spanish italic, the gloss upright, the whisper's English upright); the mutter from above
  (f023); the naming (f030) and the purr (f031); the mentor's dip (f035); the Hollow's five squares glowing (f045: empty
  pressed places, her ten claw marks on the tree); the three sets of quick marks (f048: her cookie square); the catch
  carried in, a mouse in each mouth (f055); the warm-up's echo (`es:echo`); a take page of the lesson (`take:q` on 475 − 132) and its echo
  (`es:take`); the store at 175 (f058) and at 133 with the Tap (f060, f061); Riffle under the bridge with his pebbles (f063);
  the camp by moonlight (f070); the apprentices' den (f073); the paw thing's last tap (`es:skip`); the last frame (f080);
  after the chapter, the Hollow's shelf with Chispapaw (`hollow:shelf`) and her book's chapter 12 page with the store at 133.
- **Frames**: 77 to 80 a reading, f080 the end (cap 125).
