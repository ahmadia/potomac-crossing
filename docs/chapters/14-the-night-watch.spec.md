# Chapter 14 spec: The Night Watch

*v0.3 · 2026-11-09 (decision 57: the kit v0.4's moves; the take lines redone on its design,
`~/potomac-crossing-work/regroup/design.md`; item 15 with v0.4's figures)*

*v0.2 · 2026-11-08 · v0.1 with the round-1 spec critics' findings applied (the spec editor: `~/potomac-crossing-work/ch14/spec-editor/notes.md`)*

*The build's contract for chapter 14, beside `docs/build.md`, the take-aways kit (`docs/take-aways.md` and build.md's "The
take-aways kit"), chapter 12's spec and build (the Spanish feature, Chispapaw, book two) and chapter 13's spec v0.2 (what
chapter 13 adds: the groundhog, the camp's frost, the Hollow's `spreadMarks`, the den's `collar`, the grove's dig,
`PC.words`' `resta`, `noAlcanza` and `desagrupo`, `foundGroundhog`, the first sleeper). The story,
[`14-the-night-watch.md`](14-the-night-watch.md) (Draft v0.4, final), is the source of every word she reads. This spec adds
no line she reads except the instruction lines under a panel (each Tap's `prompt` is the story's own **Tap** line; a
`label` is the hidden button's words), the dream's placeholder, the book page (recap, the badger page's line, the
salamander's sleeper page), the teaser's title, the Counts sets' engine lines (3 × 7's and the lullaby's help openings,
the wall's `missLast`), one words-table entry (`salud`), the grown-ups corner's words for the flag, and **the Hollow's
Tricky Counts' words** (the chapter's `tricky` key, section 6: the shelf's greeting and the grey tom's lines). Where the
story's italic notes and this spec differ, the spec is the build's (section 7, item 2). Names in `code` are fixed: the art,
the storyboard words and the story builder use exactly these.*

*Decisions 53 to 56 bind it: 53 (Aron's: multiplication kept fresh, long subtraction with regrouping, a Spanish-speaking
friend, the words easy to change) is why the chapter has a Counts warm-up, three-digit spreads, a Tricky Counts run and
Chispapaw's Spanish; 54 (her own apprentice) is why the first night watch is hers to lead, with Chispapaw; 55 (her word for
a spread is *desagrupo*) is why Chispapaw says «¡Desagrupo!» first, out loud, at the three-digit spread; 56 (the maths about a
quarter of a chapter, never past a third; a chapter's Tricky Counts run is five) is why the run is five, 586 − 231 and the
made warm-up are cut, and the Hollow's round of eight is the Hollow's, not the chapter's. Every other call is Claude's
under decision 46 (section 9), each Aron's to reverse.*

*Run, not guessed. Section 2's sets were run on main as it stands (chapter 12 built, read-only), with a stub chapter 13
(its lesson `teach: 'ones2'`) and the sets in a stub chapter 14 held in memory: `E.checkStory`, `E.checkTakes` and
`E.checkSpanish` clean; every kind, step, slip and line as section 2 says; the warm-up over all 2,917 cases of none, one
and two picks and the run over all 151,741 cases of none to three picks; the run played through its pick, echo, miss and
filler paths; section 6's Tricky round prototyped over 17,220 made-up rounds. Scripts and output:
`~/potomac-crossing-work/ch14/spec-writer/` (`sets14.js`, `probe.js`, `probe.txt`, `probe2.js`, `probe2.txt`), detail in
its `notes.md`. The spec editor's round reran the warm-up with its widened `avoid` over the 2,917 cases and the revised
Tricky fill over 21,780 made-up rounds, and the lullaby's prompt with the pair written out:
`~/potomac-crossing-work/ch14/spec-editor/` (`probe3.js`, `probe3.txt`, `probe4.js`, `probe4.txt`).*

*The tree it is built on* (the orchestrator's): **main, after chapter 13 is built** (chapter 13 on chapter 12, which is
built and under review). Chapter 14 codes against `app/engine.js`, `app/ui.js`, `app/story/words.js` and `app/story/ch12.js`
as they are, the kit as merged (rules (a) and (b) and the twins' `avoid` are in: `E.takeSlip`'s `taught`, the full lines
on a set's first two `'hers'` problems, `avoid: chapterAnswers(story)`), chapter 12's Spanish as built (`PC.words`,
`{es:key}`, `{Es:key}`, `lang: 'es'` balloons on a frame's `say`, a set's `echo` and **a Counts prompt balloon**,
`E.esLine`, the voices), and chapter 13's spec for what chapter 13 adds. Section 6 names the checks the build makes first.

**In one line: one engine feature, the Hollow's Tricky Counts (section 6); everything else is data and art. One flag
(`foundSalamander`); six Counts sets (the warm-up, the lesson, the wall's take, 3 × 7, the run, the lullaby); one
words-table line (`salud`); the salamander (the one new cast member, the second sleeper); the young ReedClan tom's pebble on
a string; on the `title` set the holes, the little water and the marks at the wall's end, a close camera on them and a
composition for the salamander's stone; on the Hollow the spread in three digits; on the `bridge` set the store by night
(the moon at 19) and at first light, a close camera on the store, the bank's frost and the badger's trail, and the
badger's print close, out on the frosted bank. No new place, no card, no new interaction.**

---

## 1. Flags

**One new**, as the brief planned.

| Flag | Values | Set where | Sticky or replaced | Read by |
|---|---|---|---|---|
| `foundSalamander` | `true` | f037, the salamander's last screen (`sets: { foundSalamander: true }` on the frame, never on an option) | **sticky**: never unset | the book's recap line and its sleeper page (`book.sleeper`'s `when`); the grown-ups corner; chapter 20 (module-2's Rules: a sleeper she missed is offered once more there) |

- Every choice sets nothing (`sets: {}`): f032 ("Look under the stone." / "Home to Glintstar."), f041 (the first watch:
  each option to its own frame, f042a and f042b, which meet at f043), f048 ("All quiet." / "Except HIM.": f049a, f049b,
  meeting at f050), f064 ("We stay right here." / "Keep counting, quietly.": f065a, and f065b then f065c, meeting at
  f066). Saying no to the salamander sets nothing; the plain path loses nothing.
- **Read here, from earlier chapters**: `teach` (f004: one balloon each, chapter 13's), `specialty` (f031: one line or a
  pair each, all five; f032: the friends' last caption), `foundGroundhog` (f033: Chispapaw's "Another sleeper!"),
  `ch2Stone` (f079: one caption each, none before chapter 2's choice). `{name}{ending}` and `{Murmur}chime` as tokens; `{their}`,
  `{they}` in the book. No `ch10Best`, `ch11Named` or `{petname}` line, and no frame pairs by flag.
- **The grown-ups corner** (`FLAG_WORDS`, `app/ui.js`): `foundSalamander: { 'true': 'found the salamander asleep under the
  last stone at the wall’s end (later chapters remember)' }`.

## 2. Counts sets

**Fourteen typed answers on the plain path** (nine Counts, five take-aways), **fifteen with the salamander**. Every key below
is one the engine has (chapters 2 to 11), the kit has, or chapter 12 adds (`echo`, `{Es:…}`, `lang: 'es'` on a Counts
prompt balloon); none is new. The Tricky Counts round (section 6) is the Hollow's, not a set of this chapter's.

### Every fact, in the order she meets it

| # | Where | Fact | How | Picture |
|---|---|---|---|---|
| 1, 2 | The Hollow, the warm-up (f006) | her two hardest of the 54 pairs (`E.warriorHard`), passing over 3 × 7, 5 × 7 and 10 × 8 (asked later on every path); with none, 8 × 9 and 7 × 7; with one, it and 7 × 7 (4 × 4 when her one pick is 7 × 7) | typed (`ch14-warm`) | each in its anchor Count's picture, on the sand (`E.questionDef`) |
| 3 | the same | 3 × 8, or the first `alt` not already asked (4 × 4, then 3 × 6) when a pick is 3 × 8 | typed | the 3s' patrols |
| 4 | The Hollow, worked (f012) | 352 − 127 = 225 | take, `'show'` (`ch14-take`) | the kit's store picture |
| 5 | the same | 640 − 218 = 422 | take, `'tap'` | the same |
| 6, 7 | the same | 462 − 135 = 327, 768 − 315 = 453 | take, `'hers'` | the same |
| 8 | The wall's end (f028) | 473 − 245 = 228 | take (`ch14-wall`, `twins: false`) | the same |
| (9) | The salamander, optional (f035) | 6 × 9 = 54 | typed (`ch14-lullaby`) | the 9s' (six cats, nine lives) |
| 9 (10 with the salamander) | Sunset at the fountain (f040) | 3 × 7 = 21 | typed (`ch14-watches`) | the 3s' (seven patrols of three: watches) |
| 10 to 14 (11 to 15) | The watch, the run (f054) | her three hardest of the 54 pairs, passing over 3 × 7, 5 × 7 and 10 × 8; then the set's own (6 × 6, 3 × 9, 4 × 8 in the places she has no pick for), then 5 × 7 and 10 × 8 | typed (`ch14-run`) | each in its anchor Count's picture, on the earth by the store |

Kinds and steps (run): 352 − 127, 640 − 218 (`noLoose`), 462 − 135 and 473 − 245 are `ones`, step `ones`; 768 − 315 is
`none`. Three of the new step, one older with no spread; every written answer different (225, 422, 327, 453, 228; the Counts'
21, 54, the warm-up's and the run's are the times tables' own). The flip lands only at 352 − 127's ones (`'show'`: she is
told each step). No take-away is called a Count. `E.checkTakes` without 768 − 315 fails (a `teach: 'ones'` set needs one
problem of kind `none` from chapter 13): it can never be cut, as the brief says.

Anchors (`E.warriorAnchor`, run): 8 × 9 → 9, 7 × 7 → 7, 3 × 8 → 3, 4 × 4 → 4, 3 × 6 → 3, 3 × 7 → 3, 6 × 9 → 9, 6 × 6 → 6,
3 × 9 → 9, 4 × 8 → 4, 5 × 7 → 5, 10 × 8 → 10, 9 × 9 → 9.

```js
function T(text) { return { who: 'tallyheart', text: text }; }
function G(text) { return { who: 'glintstar', text: text }; }
function M(text) { return { who: 'murmurchime', text: text }; }
var LAST = 'There. Now you’ve seen it counted.';   // chapter 10's
```

### `ch14-warm`, the Counts warm-up (Counts frame f006, `intro: false`)

```js
'ch14-warm': {
  teacher: 'tallyheart',
  // the kit's cross-table warm-up: her hardest at 0, her next at 1, passing over 3 × 7 (sunset's) and the run's two
  // echoed pairs, 5 × 7 and 10 × 8 (its places 3 and 4), each asked on every path at night, never over the optional
  // lullaby's 6 × 9 (chapter 13's call 4); each alt with its E.warriorAnchor table
  warmHard: { table: 'all', at: [0, 1], avoid: [[3, 7], [5, 7], [10, 8]],
    alt: [{ a: 4, b: 4, table: 4 }, { a: 3, b: 6, table: 3 }] },
  facts: [{ a: 8, b: 9, table: 9 }, { a: 7, b: 7, table: 7 }, { a: 3, b: 8, table: 3 }],
  praise: [], fast: [], done: '',
  // chapter 12's Spanish: her first right answer of the lesson (a retry's counts), out loud, nothing after it
  echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }] }
}
```

- **The set's own three** are the brief's (`check.txt` section 4): no pair of chapter 13's own or story Counts, this chapter's or chapter 15's; no
  answer the chapter has elsewhere. **`avoid`** keeps her picks off 3 × 7 (sunset's) and the run's two echoed pairs, 5 × 7 and 10 × 8, each asked on
  every path at night (chapter 13's rule: the warm-up passes over every pair the chapter asks on every path, so no pair is asked twice in one reading,
  and the run's "two she knows" ending never lands on her morning's hardest fact). The run's stand-ins (6 × 6, 3 × 9, 4 × 8) are asked only for a cat
  with too few picks, so they stay, spaced practice. **6 × 9 is not passed over** (chapter 13's call 4: a plain-path cat whose hardest is 6 × 9 would
  meet it nowhere today; a salamander reader meets it twice, hours apart, spaced practice).
- **`alt`, 4 × 4 then 3 × 6** (the story's call 13, the verify round's order): a pick equal to the set's own 7 × 7 or 3 × 8 gives that place to 4 × 4
  (16, new to the chapter), or to 3 × 6 (18) when 4 × 4 is a pick. Run: one pick 7 × 7 asks 7 × 7, 4 × 4, 3 × 8; picks 4 × 4 then 3 × 8 ask 4 × 4,
  3 × 8, 3 × 6 (two 3s in a row: 1 of 2,917 cases, picks 4 × 4 then 3 × 8 in that order; picks 3 × 8 then 4 × 4 ask 3 × 8, 4 × 4, 3 × 6; accepted,
  section 7 item 9). 2,917 cases (rerun with the widened `avoid`, `probe3.txt`; with the kit's third cut too): no pair twice, never 3 × 7, 5 × 7 or
  10 × 8, every question a numeric `table`. A pick of hers with a 3 can stand next to 3 × 8 (her picks are hers); the set's own and its alts never
  make two 3s in a row but in that corner.
- **The words**: the frame (f006) letters the caption and Tallyheart's "First, wake up your whiskers." (no number named, so
  the kit's third cut needs no story edit); each question in its anchor Count's words and picture, on the sand. Right:
  nothing (`praise: []`, `fast: []`), but a pick's `remembered` or `rememberedSlow` line and a retry's `again`: the
  engine's default lines (`E.counts.answer`'s, as chapter 12's warm-up: `E.questionDef` copies only the ask keys from the
  anchor set, so the anchor's own lines are never used): "Last time 8 × 7 made you stop and think. Not today!" and "8 × 7
  again, and you got it. It’s getting easier." (run).
- **The echo**: on her first right answer of the lesson, the line it earned (if any), then Chispapaw's balloon, out loud
  (the Hollow): "«¡Ocho por nueve, setenta y dos!»" over "(Eight times nine, seventy-two!)" for 8 × 9 asked first, in the
  order asked. Once a lesson; a cat who misses every ask and retry hears none (chapter 12's item 7).
- **The cut**: the kit's third, the warm-up's third Count, is the only maths cut left (586 − 231 and the made warm-up are
  cut by decision 56): `facts` without 3 × 8, the `alt` unchanged (2,917 cases clean). f006's words need no change.
- `done: ''`: f007 answers.

### `ch14-take`, the lesson (Counts frame f012, `intro: false`)

```js
'ch14-take': {
  op: '-', teach: 'ones', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
  facts: [
    { a: 352, b: 127, regroup: 'show',
      prompt: [T('Pretend the store holds three hundred fifty-two.'), T('The Clan eats one hundred twenty-seven.')],  // 7 and 6 words
      right: [T('Two squares, two rows, five loose left.')] },
    { a: 640, b: 218, regroup: 'tap', prompt: [T('Your turn.')] },
    [462, 135], [768, 315]
    // 586 − 231 is cut by decision 56; 768 − 315 can never be cut (E.checkTakes: the set's one `none`)
  ],
  echo: { on: [[462, 135]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] }
}
```

- **The worked example, 352 − 127** (`'show'`, run): the prompt's two balloons, the column's line joining the second (both Tallyheart's): "Pretend the
  store holds three hundred fifty-two." / "The Clan eats one hundred twenty-seven. Ones first." (With each show step lettered under them, its first
  column holds three balloons, and `takeReserve` keeps that height for the whole problem: one more than chapter 12's and 13's worked examples.
  Measured at the page review, section 10, with its fallback named there: balloon A to f012, the take prompt B alone, the words unchanged.) Then
  Tallyheart works the spread and she types its numbers, in her marks (decision 57): "Two take away seven? Only two loose. Not enough." / "So I
  spread a row. Five rows, one goes: four." (a paw-tap on the 5; she types 4) / "Ten more loose: twelve. Write it on top." (the ten opens; she types
  12; in `'one'`, "Ten more loose: write a little 1 in front.", 1) / "Twelve take away seven." She types 5. "Now the tens. Four take away two." She
  types 2. "Now the hundreds. Three take away one." She types 2. Right in every column: "Two squares, two rows, five loose left." (Tallyheart),
  waiting for Next. **No school words** (`teach: 'ones'`: chapter 12's `E.takeLine` says them only on `none` and `ones2` sets). Its flip lands at the
  ones, harmless in `'show'` (she types the answer after the moves). Helped: the kit's "And you finished it. We'll do one like it soon."; its twin is
  `'tap'` (the kit's rule), with no asks (the row's link is chapter 13's), introduced "One like it.", **no prompt and no right line**.
- **640 − 218** (`'tap'`): "Your turn. Ones first. Zero take away eight." (the prompt joined), "No loose. Spread a row: tap it." (the kit
  v0.4's `tap.onesZero`: item 10 closed; the 4 and the rows zone glow, the keypad dim; a tap off them: "The rows: the glowing ones."); she taps:
  the row slides out and the box over the struck 4 is ringed, **with no ask** (the kit drops `askLend` and `askGet` for a link she has made on
  her own, and the row's is chapter 13's); she types 3; the ten opens and the box over the struck 0 (or in front of it) is ringed: 10 (or 1);
  then "Ten take away eight.", "Now the tens. Three take away one.", "Now the hundreds. Six take away two." A wrong number at a box gets its
  move-help (a `lend` or `get` slip brings no twin unless it repeats). Its twin, if helped, `'hers'`, asked with "One like it." only.
- **462 − 135, 768 − 315** (`'hers'`, the set's first two of her own, so full lines by rule (b)): with moves (462 − 135: she taps the 6,
  types 5, types 12 or 1, then 7); "Ones first. Two take away five." (seeing she can't is the lesson), "Now the tens. Take away
  three.", "Now the hundreds. Take away one."; "Ones first. Eight take away five.", "Now the tens. Take away one.", "Now the
  hundreds. Take away three." **No line says which need a spread** (chapter 17's question). Run: a helped 462 − 135 queues the
  twin 243 − 114 two problems on.
- **The `extra` slip**: 768 − 315's 6 tapped at the ones and its 5 typed is `extra` at the tap, "Careful: eight take away five? The
  loose have enough. No row goes." (logged `move: 'touch'`); its tens typed 4 (6 − 1 − 1) is still the in-head `extra`, "Careful.
  The loose had enough, so no row went. Six rows still." (`ones2` taught); its hundreds typed 3 (7 − 1 − 3) is `fact` by rule (a)
  (`tens` not taught: the lesson's `taught` is `none`, `ones2`, `ones`), "Let’s scratch it out.", **logged `fact`**. No `lines`
  override (the brief).
- **The echo** (chapter 12's `E.takeEcho`): after 462 − 135, **right or helped**, never its twin, Chispapaw's balloon, out
  loud, "«¡Trescientos veintisiete!»" over "(Three hundred twenty-seven!)", after the kit's end line. No column is ever
  echoed, never «menos».
- The lesson's `state.avoid` is the chapter's take answers, 225, 422, 327, 453, 228 (run), so no twin lands on one.
- **Never** "borrow", "carry" or "regroup"; no spreading a square (the kit's lines and the facts keep all three).
- `done: ''`: f013 carries the story's two *Done* balloons. Finishing this set adds `ones` to `E.takeSteps`: Count the store's
  rounds take it from then on (the brief's "Count the store needs nothing new").

### `ch14-wall`, ReedClan's store against CrystalClan's (Counts frame f028, `intro: false`)

```js
'ch14-wall': {
  op: '-', teacher: 'murmurchime', picture: { kind: 'store' }, twins: false, done: '',
  // helped, the problem shows no right line: the number kept in the miss line (the maths-2 critic's low)
  lines: { missLast: 'Two hundred twenty-eight. And you finished it.' },
  facts: [{ a: 473, b: 245,
    prompt: [{ who: 'sloshbank', text: 'So how many MORE has ReedClan? Go on. Count it.' }],   // ten words
    right: [{ who: 'sloshbank', text: 'Two hundred twenty-eight MORE.' }, { kind: 'caption', text: '*Drip.*' },
            { who: 'murmurchime', kind: 'whisper', text: 'Show-off.' }] }]
}
```

- No `teach`: a story set whose step (`ones`) this chapter's lesson teaches (the kit's guard; run clean). **{Murmur}chime is
  the set's `teacher`** (the story's call 10: Tallyheart is not at the wall), so the column lines and any help are hers:
  "Ones first. Three take away five." / "Now the tens. Take away four." / "Now the hundreds. Take away two." (full lines:
  the set's first `'hers'` problem).
- The frame (f028) letters "Sloshbank looks very pleased."; the take page opens on Sloshbank's question (his prompt). Right
  in every column: his "Two hundred twenty-eight MORE.", the caption *Drip.* and {Murmur}chime's whispered "Show-off.",
  waiting for Next. With moves, its move-helps in {Murmur}chime's balloon (the set's teacher). Helped: "Two hundred twenty-eight.
  And you finished it." (run: a flip at the decide, "Careful: it’s three take away five, the top take away the bottom. Only three
  loose. Not enough.", the 7 then tapped for her; the 7 typed at its lend, "Careful. One row goes to the loose. Six rows now.").
  No flip lands; no Spanish in front of ReedClan; no twin.
- The page shows the kit's store picture at 473: the only picture of ReedClan's number in the chapter.

### `ch14-watches`, Glintstar's watches (Counts frame f040, `intro: false`)

```js
'ch14-watches': {
  table: 3, thing: 'guard', things: 'guards', unit: 'watch', units: 'watches', teacher: 'glintstar', ask: '{a} × {b}',
  ground: 'earth',
  facts: [{ a: 3, b: 7,
    prompt: [G('A watch of three guards, every night, for seven nights. How many guards in all?')],
    right: [G('Twenty-one guards. All of them wide awake.')], rightAgain: true }],
  praise: [], helpIntro: 'Close. Three guards a watch. Let’s hop it together.',
  helpIntroFar: 'Three guards a watch. Let’s hop it together.',
  miss: 'There.', missLast: LAST, done: null
}
```

- The 3s' own picture (chapter 6's patrols of three; no `picture` key): seven watches of three guards. `unit`/`units` are
  read only by `E.genericQuestion`, so a retry asks "Here’s that one again. Seven watches. How many guards?" (run; the story's
  note). **The help names the watches through `helpIntro`** (the story's note: "a set's `helpIntro` could name the
  watches"), counts in threes on the camp's earth (`ground: 'earth'`, chapters 3 to 6's camp Counts), in Glintstar's voice:
  Tallyheart is not at the fountain. A one-fact set with no fillers: a miss is "There." and the fact again at once, up to
  three asks, the last "There. Now you’ve seen it counted." (chapter 13's dawn).
- Right: one balloon, Glintstar's "Twenty-one guards. All of them wide awake." (the story's quote split round its tag is one
  balloon), on a retry too (`rightAgain`). `done: null`: f041 answers.

### `ch14-run`, the Tricky Counts run (Counts frame f054, `intro: false`)

```js
'ch14-run': {
  teacher: 'tallyheart', ground: 'earth',
  // the kit's cross-table keys on a story set of five (decision 56): her three hardest at 0, 1, 2, passing over 3 × 7
  // (sunset's) and the run's two echoed pairs, so they always end her first asks; the alts stand in when a pick is the
  // same pair as the set's 3 × 9 or 4 × 8 (6 × 6, the set's own first, is free whenever an alt is wanted)
  warmHard: { table: 'all', at: [0, 1, 2], avoid: [[3, 7], [5, 7], [10, 8]],
    alt: [{ a: 6, b: 6, table: 6 }, { a: 9, b: 9, table: 9 }] },
  facts: [{ a: 6, b: 6, table: 6 }, { a: 3, b: 9, table: 9 }, { a: 4, b: 8, table: 4 },
          { a: 5, b: 7, table: 5 }, { a: 10, b: 8, table: 10 }],
  praise: [], fast: [], done: '',
  remembered: 'Not so tricky now.', rememberedSlow: 'Getting easier.',
  echo: { on: [[5, 7], [10, 8]], lines: [{ who: 'chispapaw', lang: 'es', kind: 'whisper', text: '¡{Es:fact}!' }] }
}
```

- **Data only** (decision 56; the brief): the kit's `warmAcross` with `at: [0, 1, 2]`. Each question in its anchor Count's
  words and picture (`E.questionDef`: "Seven spiders. How many legs?", "Seven paws. How many claws?", "Eight cats. How many
  front claws?"), **the help scratched on the earth by the store** (`ground: 'earth'`: `E.questionDef` keeps a set's
  `ground`, else sand), Tallyheart's. Can't fail: a miss gets the earth and comes back two questions on; the lesson always
  finishes. `intro: false`, so her hardest is timed on itself.
- **The set's own five**: 6 × 6, 3 × 9, 4 × 8 stand in for hard facts she lacks; 5 × 7 and 10 × 8, two Counts' pictures she
  knows, end her first asks (the Moon Ferry's cheer). No neighbours sharing a number, every answer new to the chapter
  (36, 27, 32, 35, 80; alts 36 and 81).
- **The alts** (the story's note asked for them): her one pick 3 × 9 asks 3 × 9, 6 × 6, 4 × 8, 5 × 7, 10 × 8; her one pick
  4 × 8 asks 4 × 8, 3 × 9, 6 × 6, 5 × 7, 10 × 8; picks 6 × 6 and 4 × 8 ask 6 × 6, 4 × 8, 9 × 9, 5 × 7, 10 × 8 (20 cases). Run
  over all 151,741 cases of none to three picks: no pair twice, no pick on 3 × 7, 5 × 7 or 10 × 8, every question a numeric
  `table`, places 3 and 4 always 5 × 7 then 10 × 8 in the first asks, and no two of the set's own or its alts side by side
  sharing a number.
- **Her picks' lines**: right and quick (under `E.FAST_MS`), Tallyheart's `remembered`, "Not so tricky now."; right but slow,
  `rememberedSlow`, "Getting easier." (run). **Lettered plain**: the page letters a set line in a plain balloon (`res.line`
  carries no `kind`), so the story's "whispers Tallyheart" is a speech tag, not drawn (section 7, item 7).
- **The echo**: after 5 × 7 and after 10 × 8 (either order, a retry or a filler too), Chispapaw's whispered balloon,
  "«¡Cinco por siete, treinta y cinco!»" over "(Five times seven, thirty-five!)" and "«¡Diez por ocho, ochenta!»" over "(Ten
  times eight, eighty!)", never one of her picks (they are passed over). **A missed pick's comeback can follow them**: a
  missed third pick returns after 10 × 8; a miss at 10 × 8 brings two fillers from her right answers, 5 × 7 among them
  (whispered again), then 10 × 8's retry and its echo (run; accepted, section 7 item 8).
- **The cut**: none. The run is never cut (the brief).
- `done: ''`: f055 answers.

### `ch14-lullaby`, the salamander's lullaby (Counts frame f035, `intro: false`; optional)

```js
'ch14-lullaby': {
  table: 9, thing: 'life', things: 'lives', unit: 'cat', units: 'cats', teacher: 'murmurchime', ask: '{a} × {b}',
  ground: 'earth',
  facts: [{ a: 6, b: 9,
    // the Spanish ask on the Counts page itself (chapter 12's built `lang: 'es'` prompt balloon; section 6, "The Spanish
    // question"), then the caption: no English question follows. The pair written out, as f035's balloon (a one-fact set):
    // tools/storyboard.mjs letters a prompt with no { a, b }, so `{Es:a}` would print raw in docs/storyboard/ch14.md
    prompt: [{ who: 'chispapaw', lang: 'es', kind: 'whisper', text: '¿{Es:6} {es:por} {es:9}?' },
             { kind: 'caption', text: 'The salamander blinks.' }],
    retryPrompt: true,
    right: [{ who: 'player', kind: 'whisper', text: 'Fifty-four.' }], rightAgain: true }],
  praise: [],
  // the 9s' own help openings (chapter 5's), in {Murmur}chime's voice, so Chispapaw never corrects her
  helpIntro: 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.',
  helpIntroFar: 'Let’s scratch it out together: hop by tens, then tuck one in for every cat.',
  helpIntroTens: 'That’s the hop! Now the tuck: one claw in for every cat.',
  helpIntroOneTuck: 'So close! You tucked ONE claw. Tuck one in for every cat.',
  helpIntroNotNine: 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.',
  miss: 'There.', missLast: LAST, done: null,
  // the set's echo, never a second balloon of the right line (the verify round's low): on the right answer, a retry's too
  echo: { on: [[6, 9]], lines: [{ who: 'chispapaw', lang: 'es', kind: 'whisper', text: '¡{Es:answer}!' }] }
}
```

- **The ask** (call 12, section 6): the frame (f035) letters the caption and Chispapaw's whispered `lang: 'es'` balloon `'¿{Es:6} {es:por} {es:9}?'`
  (the story's screen); with `intro: false` the Counts page does not repeat the frame's balloons, and opens instead on the fact's own prompt, the same
  Spanish line (the same string, `'¿{Es:6} {es:por} {es:9}?'`) through chapter 12's prompt route, then the caption. Run (`E.checkSpanish` and
  `E.checkStory` clean; `E.promptLines` letters it with no `{ a, b }`, `probe4.js`): "«¿Seis por nueve?»" over "(Six times nine?)", whispered, then
  "The salamander blinks.", over 6 × 9 = ?. A retry: "Here’s that one again." ({Murmur}chime) then the Spanish ask and the blink again (`retryPrompt:
  true`). A lesson picked up asks it again too (the frame route would not). Read to me: the Spanish in the Spanish voice, then the gloss (with no
  Spanish voice, the gloss alone), then the caption, then the question line; never Spanish in an English voice.
- The 9s' picture (six cats, nine lives each) and help (hop by tens, then tuck: `E.helpPlan`'s `tuck`), on the earth by the
  stone, {Murmur}chime's. A one-fact set: a miss is "There." and the fact again at once (run).
- **Right**: her whispered "Fifty-four.", then the echo, Chispapaw's whispered "«¡Cincuenta y cuatro!»" over "(Fifty-four!)", waiting for Next, on a
  retry too (`rightAgain`; the echo fires on any right answer to its pair). `E.MAX_REQUEUE` is 2, so the one fact is asked up to three times: missed
  twice and right on the third ask, she still hears both (run); a cat who misses all three asks hears no "Fifty-four." and no echo; f036 shows the
  salamander asleep regardless (section 7, item 11).
- The fact's own prompt makes it "read first" (`E.readFirst`): a right answer here never marks 6 × 9 easy, a miss marks it
  hard, as every prompted story Count.

## 3. The Case File

**No card**, given or shown (`cards: {}`). Module 2 has no Case File; the badger page does its work.

## 4. Art needs

**New: one cast member, the salamander (`salamander`, `cats.js`, four poses); two cat extras, `necklace` (a pebble on a
string) with its tap target `tap: 'pebble'`, and `fluff` (on `sit`) (`cats.js`); on the `title` set, the options `holes`
and `spot`, `tap: 'holes'`, a close camera `holes` and a new composition `stone` with one camera and four spots
(`scenes.js`); on the hollow, the option `spread3` (`scenes.js`); on the `bridge` set, the store camera by night with
`moon: n` and `frost`, a close camera `store-close` on the store composition, the bank's `frost` and `trail`, and the print
camera's `badger` (`sets/bridge.js`); the salamander's `SIZE_BAND` and shadow lines (`scenes.js`). Nothing else is new.**
Every new option is off by default and every new camera, composition and spot additional, so chapters 1 to 13, the Warrior
Counts and the kit's pages draw byte for byte (section 7, item 3).

**Times of day**: `morning` at the store (f001 to f005: "Two frosty days later"), in the Hollow (f006 to f013), and from
first light to the end (the store, the bank, the print, the camp's report, her nest, the apprentices' den); `day` at the
wall (f014 to f037: "At midday"); `sunset` at the fountain (f038 to f042b); `night` at the watch (f043 to f067). **The moon at
19** (module-2's clock: day 1's dusk was 16, the night of day 4 is 19, waning, rising late), drawn on the store camera at
night and, pale, at first light; nowhere else. **Never dark**: the dusk is a caption over the moonlit store, never a black
panel.

### Places

| Set | Cameras the chapter uses | Options | New |
|---|---|---|---|
| `bridge` (`sets/bridge.js`) | `store` (morning: f001 to f005; night: f043 to f067 but the close frames; first light: f068, f069, f074 to f076); **`store-close`** (night: f047, f058, f059, f062, f064 to f066); `bank` (first light: f070, f072, f073); `print` (first light: f071) | store by morning `{ store: 245, frost: true }` (f002 with `tap: 'store'`); by night `{ store: 245, moon: 19 }` (on both cameras); at first light `{ store: 245, moon: 19, frost: true }`; the bank `{ drag: false, frost: true, trail: true }`; the print `{ badger: true, drag: false, drips: false }` | **`store` at `night` and the option `moon` on `store`; the camera `store-close`; `frost` on `store` and `bank`; `trail` on `bank`; `badger` on `print`** |
| `hollow` (`scenes.js`) | `lesson` (morning) | `H14 = { marks: 10, glow: 'auto' }` on every frame, with **`spread3`**: `'standing'` f008 to f010, `'spread'` f011, `'two'` f012, f013 | **`spread3`** |
| `title` (`scenes.js`) | `wide` (f014); `end` (f015, f017, f030 to f032); `meet` (f016, f019 to f029); **`holes`** (f018); **`stone`** (f033 to f037), all by `day` | `HOLES = { holes: true }` on every `end` and `meet` frame; `tap: 'holes'` on f017; `rustle: true` on f030; `spot: true` on f031, f032; `stone`: `{}` | **`holes`, `spot`, `tap: 'holes'`; the camera `holes`; the composition `stone` (camera `stone`, spots `stone-1`, `stone-2`, `stone-3`, `nook`)** |
| `camp` (`scenes.js`) | `fountain`, `reveal` (sunset: f038 to f042b); `reveal` (morning: f077) | `{}` at sunset; `{ frost: true }` (chapter 13's camp frost) at f077, the same dawn as the bank's hoar frost | nothing |
| `den` (`scenes.js`) | `nest` (her warrior's nest, morning: f078 to f083); `inside` (the apprentices' den, morning: f084, f085) | `DENW14 = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true, miststone: true }` (no `moon`); `DEN_APP14 = { weather: 'clear', collar: true }` (chapter 13's `collar`) | nothing |

#### The store by night, at first light and by morning (`sets/bridge.js`, the `store` camera)

Module 1 never drew the bridge by night; module-2 plans night on `store` for chapters 14, 19 and 20.
- **`night`** (the frame's `fx: ['night']`), on `store`: **moonlit and silver, never dark.** The way in at the right opens on
  the night: a deep blue sky with stars, the far bank and its reeds silver-edged, the river glinting; the moonlight comes in
  through the way in as one soft screen-blend silver wash across the floor, the store and the heap of old stones (camp's
  `campSilver` is the model: never darker than the store at dusk, the dark of the back lifted to a blue-grey you can see
  into, the stones' edges silver), the store's squares, rows and loose plain to count at 390 × 844. The cast keeps
  `CAST_TINT.night` (everyone silver: "Even the grey tom!"). Nothing is drawn behind the store: no shape, no shadow, no eyes,
  nothing in the nook (the badger is heard only, the brief's call 9). Drips, if drawn, glint.
- **`moon: n`** (a number, off by default; `'number'` in the vocabulary as the camp's and the riverbank's), on `store`: the
  moon n evenings old (`K.waxingMoon` with age n: at 19, the evening as far before full as this one is after it, turned so
  its lit side is on the left), **in the way in's patch of sky**, whole, above the far bank's reeds and clear of the beam and
  of anyone at `way-in`, in keep; drawn at `night` and `dusk` bright, and at `morning` pale (first light: "the moon is still up,
  pale, over the river": the same moon at low opacity in the dawn sky). The brief's "moonAge clamps raised only there": the
  set's own placement, ages 15 to 27 allowed, nothing shared with the den's or the camp's moon.
- **`frost`** (`[false, true]`, off by default), on `store`: the first frosts' white, seen through the way in (the bank
  outside, its grass and reeds rimed white, sparkling: "the Old Bridge sparkles white") and a pale rim of rime on the floor
  just inside the way in; never on the store itself, never on the dry floor under the bridge. Drawn whatever the light (the
  story builder sets it only by `morning`).
- **By `morning`**, on `store` (chapter 12 drew it only at sunset and dusk): the way in's sky a pale clear morning (the
  set's existing day sky). The sets owner looks once at `store` by `morning`, with and without `frost` and `moon: 19`.
- **The camera `store-close`** (new, `{ box: [x, y, w], comp: 'store' }`, a crop of the same composition, by night): **the two at the store, close**:
  `store-left` and `store-back-1` whole, with room above them for two balloons, the store's near part (its squares, rows and loose) between them; the
  way in, the moon and `store-right` out of the frame. Why: the watch is 27 panels on one place, and the store's four spots span the panel
  (`store-left` at x 222, `store-back-1` 560, `store-right` 1390, `way-in` 1512 of 1600: measured on main), so no crop can hold the whole cast closer;
  the frames that are our cat's and Chispapaw's alone take this one (section 5, "The watch": f047, f058, f059, f062, f064 to f066, the grey tom and
  Tallyheart off the panel; f053 stays wide for its "The moon climbs."), and the longest run on one camera falls to ten (f048 to f057), under chapter
  12's 13. The silver wash, the lifted back and `CAST_TINT.night` as on `store`; nothing behind the store. If the crop does not read (the sets owner's
  look at f058 and f066 with stand-ins), those frames stay on `store` and section 7 item 18 records the run.
- **Acceptance** (the sets owner, `tools/frames.mjs`, chapter 12's six spots): f043's, f048's and f054's casts (our cat
  `store-left`, Chispapaw `store-back-1`, the grey tom `store-right`, Tallyheart `way-in`) by night, every face readable, the
  store countable, the moon whole in the way in, at 1080 × 720 and 390 × 844; the night panel's mean brightness no lower than
  chapter 12's dusk store panel (a number in the sets owner's notes); on `store-close` by night, our cat at `store-left` and
  Chispapaw at `store-back-1` (f058's and f064's casts), both faces readable, the store's part countable, its mean
  brightness no lower than the same dusk panel's; f068 at first light with the pale moon and the frost. Off (no `moon`, no
  `frost`, not at night), every store frame of chapter 12 draws byte for byte.

#### The bank at first light: the frost and the trail (`sets/bridge.js`, the `bank` camera)

- **`frost`** (`[false, true]`), on `bank`: the bank white with hoar frost at first light: the flattened grass and the mud's
  crust silver-white, every reed rimed along its blades, the puddles skinned with pale ice, the old stones at the back and the
  abutment's top edged white; the river dark and bright under a pale dawn sky (the bank's `morning`). Cold and bright, never
  grey or dark.
- **`trail`** (`[false, true]`), on `bank` (with `frost`): **the badger's prints, BIG**, pressed dark green-brown through the white, a line of them
  from the foot of the old stones under the near end at the left (behind the store), along the bank near the water's edge to the right, away downriver
  and out of the panel; each print a broad kidney-shaped pad with **five oval toes in a row** in front of it and five short claw marks beyond the
  toes, each print about twice her paw's width (a little less than her head: the print camera's measure, the same prints); many prints (never a number
  she would count); the four-print rhythm of a walking animal. Nothing with them: no animal, no shadow. In keep (one box over the trail), clear of
  every spot the chapter uses. **Never Sprinkle's** (her five-claw dragon prints are not on any panel of this chapter, the story's call 9), never the
  drag marks (`drag: false`).
- **Acceptance**: f070's cast (our cat at `bank-left`, Chispapaw at a raw spot beside her, both clear of the trail); every
  print's five toes plain at 1080 × 720, the trail plainly big prints with toes in a row at 390 × 844. Off, every bank frame of
  chapters 2 to 12 draws byte for byte.

#### The badger's print, close (`sets/bridge.js`, the `print` camera)

- **`badger`** (`[false, true]`), on `print`: **the whole picture redrawn outside**, never under the bridge: the frosted bank behind the store at cat
  height in the dawn light (chapter 7's `print` composition is under the deck, with its beams overhead, the dark, the drips and the drag marks' edge,
  and frost is never on the floor under the bridge), the river and the pale dawn sky at the back; **no deck, no dark, no drips, no drag marks**,
  whatever those options say. Close in the foreground, in place of Sprinkle's print in the mud, **one of the badger's prints in the frost**: dark
  earth under a crust of white rime, the print pressed through it, a broad pad and **five toes in a row**, the claw marks beyond, about twice her
  paw's width (a little less than her head: the bank's `trail` measure, the same prints); and beside it, small, **our cat's own print**, a pad and
  **four toes**, pressed in the frost just under her reaching paw. Our cat at `over` (`crouch`, `reach: true`), **her paw held beside the big print,
  never over it** (the story: "your paw beside the print, small"). No spot for Chispapaw (her "Four." comes from off the panel). In keep: both prints.
  `PRINT_BADGER` also sets `drag: false, drips: false` (section 5), so nothing of the under-bridge picture can show whichever way `badger` is built.
- **Acceptance**: f071's cast; the badger's five toes and her print's four countable at 1080 × 720 and 390 × 844; the big print plainly bigger than
  her paw; with `badger`, no deck beam, dark, drip or drag mark anywhere in the picture, the light the bank's dawn (f070's and f072's). Off, chapter
  7's print frames draw byte for byte.

#### The spread in three digits (`scenes.js`, the `hollow` set)

- **`spread3`** (`[false, 'standing', 'spread', 'two']`, off by default), on `lesson` and `sand`: chapter 13's `spreadMarks`
  for **three hundred fifty-two**, `'standing'` and `'spread'` in the same keep box chapter 13's sets owner sized for
  `spreadMarks` (or one of their own), `'two'` in a box of its own (below), drawn by the kit's quick marks (`PC.art.kit.quick`,
  ground `'sand'`), each set scaled by `PC.art.quickMarks.size(o)`, which counts the struck line and the frame of ten (chapter
  13's cats owner's keys `crossed` and `fresh`; chapter 14 is the first call to combine them with `hundreds`, so the cats owner
  adds a `tests/cats.test.js` case for the three-digit spread, section 10):
  - `'standing'`: **Tallyheart's three hundred fifty-two**, at her paws: three squares, five lines, two dots,
    `kit.quick(x, y, k, { hundreds: 3, tens: 5, ones: 2, ground: 'sand' })` (f008 to f010).
  - `'spread'`: **the same, spread**: one line crossed out and ten new dots in a scratched frame under the two old ones, five
    and five, the three squares untouched: `kit.quick(x, y, k, { hundreds: 3, tens: 4, ones: 12, crossed: { lines: 1 }, fresh:
    { dots: 10 }, ground: 'sand' })` (f011).
  - `'two'`: **Tallyheart's spread three hundred fifty-two and yours beside it** (yours nearer our cat), the same marks
    twice, **one above the other**, in **a box of its own** (f012, f013: "your own three squares, five lines and two dots
    beside hers"). Chispapaw scratches none. **The sizes** (measured with `PC.art.quickMarks.size` on main): a spread 43 is
    250 × 84, a standing 352 418 × 56, a spread 352 502 × 84 before chapter 13's frame of ten is added; so two spread 352s side
    by side in chapter 13's `spreadMarks` box come out at about half chapter 13's scale (about 0.18 against 0.35: dot cells
    about 2.5 px at 390 × 844). Hence the box: about 155 × 70 on `lesson`, the two sets stacked, each at a scale of 0.3 or more
    (502 × 0.3 ≈ 151 wide, about 25 to 30 tall with the frame), moved wider or higher to stay clear of the cats; the sets owner
    reports the scale reached for each state.
  Never with `spreadMarks`, `store` or `quick` on one frame. **Acceptance** (as chapter 13's): the standing and spread 352
  countable at 1080 × 720 and 390 × 844 (the crossed line plainly struck, the frame of ten plainly five and five, the two old
  dots apart from it, the three squares whole); the two spreads countable at 1080 × 720, and at 390 × 844 plainly two spread
  three hundred fifty-twos, **each struck line and each frame of ten plain** (chapter 13's clause); nobody over the box.
  **If the single spread does not read on `lesson`, f011 alone moves to `sand`** (its two captions and the spread; f012 and
  f013 stay on `lesson` with `'two'`: both speak there). Never "rows" of five in any word about it (a row means ten).
- Off, every hollow frame of chapters 1 to 13 and the kit's pages draws byte for byte.

#### The wall's end: the little water, the holes and the marks (`scenes.js`, the `title` set)

- **`holes`** (`[false, true]`, off by default), on `end`, `meet` and the new `holes` camera:
  - **The little water**: **a narrow rill**, about a paw or two across (a hop, never a swim), shallow, bright and clear
    (blue-green, glinting, a few pebbles in its bed), running across the ground at the line where the stones stop, from the
    river at the back down to the panel's foot, bending round the line stone's far side, between CrystalClan's dry ground
    (`end-1` to `end-3`) and ReedClan's side (`reed-1` to `reed-3`). **Every spot unchanged**: measured on main, the two sides'
    boxes are 20 units apart on `end` (our cat at `end-1` 529..791, Sloshbank at `reed-1` 811..1109; the line at x 806, the line
    stone 780..840) and 47 on `meet` (435..765, 812..1188), where a cat is 260 to 330 long, so a channel a cat's length across
    cannot fit; the rill threads that gap at the cats' feet (narrower there if it must) and touches nobody (the sets owner
    settles its course with `tools/frames.mjs`). The mud is only a strip at the rill's far edge and at the reed bed's foot:
    **ReedClan's spots stay on dry ground** (continuity's title rule: nobody stands in mud or water). **Nobody stands in it**;
    no CrystalClan paw on ReedClan's mud.
  - **The holes** in ReedClan's bank, at the reed bed's muddy foot across the little water, **behind and right of the ReedClan
    spots, never under or behind their bodies**: right of `reed-2`'s box (x past about 1360 on `end`, past about 1450 on
    `meet`), or in a gap that no ReedClan body or head covers; never under `reed-1` or `reed-2` (Sloshbank's box is 811..1109 on
    `end` and 812..1188 on `meet`, the young tom's 1115..1355 and 1153..1448: the spec named only their heads before). Two or
    three big round holes (a cat could put its head in), their mouths soft dark-brown, never black, wet mud thrown out in heaps
    beside each, a few reeds bent and broken over them. **Few, never a riddled bank** (the secret allows one test hole a
    night; the round-1 fidelity low). `PC.art.titleInfo()` gives their boxes, and a set test checks them against the cast boxes
    at f015's, f017's, f021's and f030's spots as section 5 stages them (built in the test from the spots).
  - **The marks** on flat mud just beside the holes: **two long lines and three little pokes**, the kit's quick picture on mud
    (module-2's amendment 2: one picture for the help, the lessons and the clue), `PC.art.kit.quick(x, y, k, { tens: 2, ones: 3,
    ground: 'mud' })`, the lines about a cat's paw-height long, three small neat pokes beside them; apart from the holes' heaps.
    On `end` and `meet` small (seen, not counted); on `holes` big and countable. Never lettered over (keep).
- **`spot`** (`[false, true]`), on `end` and `meet`: **a yellow spot** on black peeking out from under the near edge of the line
  stone (the existing `line-stone`, "the wall's last stone"): a bit of the salamander's spotted back, small but plainly yellow at
  390 × 844. In keep.
- **`tap: 'holes'`** (the set's `tap` gains `'holes'`): an unpainted `pc-tap` rect (`data-tap="holes"`) over the holes and the
  marks on `end` and `meet`, generous at 390 × 844, first in keep (chapter 9's `root` box is the model); on f017 it never
  overlaps Sloshbank's box at `reed-1` (the set test above).
- **The camera `holes`** (new, `{ box: [x, y, w], comp: 'end' }`, the same composition): **the holes, close up**, a crop where they lie (right of the
  ReedClan spots, far from the rill at the line): **the bank's muddy foot along the bottom**, two or three holes at the left and middle, **the marks
  at the right, the two long lines and three little pokes filling about a third of the panel**, reeds at the top; **no water** (the rill runs at the
  line, about 550 units to the left: at most its edge at the left, if the crop reaches it). No spots: no face is ever in it; its balloons come from
  off the panel. **Acceptance**: the marks read as two lines and three pokes at 390 × 844, never as more lines (the holes' edges and the reed stems
  must not read as lines: a child who knows the quick picture must not read 25 or 35).
- **Acceptance** for `end` and `meet` with `holes` (the sets owner, `tools/frames.mjs`): f015's cast (our cat `end-1`, Chispapaw `end-2`,
  {Murmur}chime `end-3`, Sloshbank `reed-1`), f021's (with the young tom at `reed-2`) and f030's, none touching, nobody in the water or on the mud,
  every hole and the marks clear of every ReedClan body and head, at 1080 × 720 and 390 × 844. If five cats cannot stand on `meet` without touching,
  {Murmur}chime leaves the `meet` frames where she does not speak (the story builder follows the sets owner's note). Off, every `title` frame of
  chapters 1 to 13 draws byte for byte.

#### The salamander's stone (`scenes.js`, the `title` set: a new composition `stone`)

- **The `stone` composition** (`comp: 'stone'`), **the wall's last stone nosed over, close, at cat height**, by day: in the
  middle foreground the line stone lying on its side where she rolled it, and beside it **the little hollow it covered**, a
  shallow cup of cold dark-brown earth (soft, damp, a few pale roots and a fallen leaf; never black), where the salamander lies;
  **left to right**: the wall's end and its old stones at the left edge, the cats on the left, the hollow and the salamander
  in the middle, and **to the right and behind** (up the panel, smaller), **the little water** and, across it, **ReedClan's
  muddy bank with its holes and the two long lines and three little pokes, small** (the salamander's tail points at them on
  f036: seen, not counted), the reeds behind; the midday sky. Everyone side-on faces left or right, so "behind" is the right
  and the distance, never straight into the picture. Nothing frightening.
  - **Camera**: `stone` (`{ box: [0, 0, 1600], comp: 'stone' }`).
  - **Spots**: **`nook`** (in the hollow, in the middle: the salamander, lying, no ground shadow); **`stone-1`** (our cat,
    crouched before the hollow at its left, facing right, toward it); **`stone-2`** (Chispapaw, beside her, a step back, facing
    right); **`stone-3`** ({Murmur}chime, behind them, facing right). The cats on the left, away from the far bank, so the
    salamander's pointing tail and the marks behind it, at the right, are never covered.
  - **Acceptance** (with a stand-in for the salamander until the cats owner's lands: a small `mizzle` in `curl` at `nook`): f033
    to f037's casts, none touching, nobody over the hollow; the salamander's eye and smile readable at 390 × 844 at `nook`; the
    far bank's marks visible behind (two lines, three pokes, small), at the right, not covered by the salamander's body on
    f036 (`point`, its tail toward them). `PC.art.titleInfo()` (new, for the tests) gives the boxes of the holes, the marks
    and the little water on `end` and `meet`, and the hollow on `stone`.

### Cast

Every cat side-on, facing left or right. **No two cats touch.** No grown cat in `laugh`. Casts listed back to front, **except
where an order is needed** (section 5): the first cast member of a `motion` frame is the one the story moves.

**New: the salamander** (`salamander`, `cats.js`; not a cat: poses of its own, as `mizzle`'s and chapter 13's `groundhog`'s).
**The second of module 2's seven sleepers** (module-2's table).
- **Its look**: a little salamander, **black with yellow spots** (round bright yellow spots in two loose rows down its back and
  tail, one on each side of the head above the eyes), a pale grey belly, a round blunt head, **a wide curving smile** (the
  salamander's natural mouth line, always drawn: "It's smiling."), two small round dark eyes with soft lids, four short legs with
  little splayed toes, a long rounded tail. Soft and sweet, never slimy-looking. **Never a tooth**, never a tongue out, nothing
  fierce. Nothing like a badger or a snake.
- **Its size**: lying, about as long as our cat's head and forelegs (a small animal under a stone): its head between two
  fifths and three fifths of our cat's head. Held in a band by the sets owner: **`SIZE_BAND.salamander = { ref: 'player', pose:
  'curl', by: 'head', min: 0.4, max: 0.6 }`** (`scenes.js`; the cats owner draws it inside the band and reports its measured
  ratio). Its own shadow (`OWN_SHADOW.salamander`), none in any pose (it lies in the hollow: `NO_SHADOW.salamander = { curl: 1,
  blink: 1, sleep: 1, point: 1 }`).
- **Poses**: **`curl`** (curled in a loose S in the hollow, head resting on its forefeet, eyes shut, smiling; with the `motion`
  effect for "It's also shivering": f033); **`blink`** (the same, one eye open, looking up at the viewer: "It opens one eye. It
  blinks at you.": f034, f035); **`sleep`** (curled, both eyes shut, the smile bigger: asleep again, f037, and **the book's
  sleeper page**, whose default pose is `sleep`); **`point`** (asleep as `sleep`, but its tail curled out straight and pointing
  away from its head, its tip lifted: f036, `facing: 'left'`, away from the far bank and toward the cats, so its tail points
  right, across the water at the marks). **`facing` is the head's direction in every pose**; in `point` the tail points
  opposite `facing`. An unknown pose draws `sleep`.
- **Moods**: `neutral`, `happy` (the smile wider), `sleepy` (heavy lids); the smile is drawn in every mood.
- **In `cats.js`'s `CAST_IDS`** and **`PC.art.vocab.otherPoses.salamander`** (the four poses): the book's `sleeperArt` draws
  `PC.art.character('salamander', { pose: 'sleep' })` only for an id in `PC.art.vocab.cast`. **Not scenes.js's cat** (no
  `CAT_IDS` entry). It never speaks: no `NAMES`, `PITCH` or `RATE` entry.

**New for cats: `necklace: true`** (`cats.js`): **a pebble on a string** round the neck: a thin pale string (a reed fibre) and,
hanging at the chest, a small plain grey pebble (round, unremarkable: "a very ordinary pebble"), drawn over the chest fur and
under the chin, in every pose; with **`tap: 'pebble'`** (the cast `tap` gains `'pebble'`) the pebble's box is the Tap's target.
Worn by the young ReedClan tom (`reedclan` 2) on every frame he is in (f021 to f030). Off unless asked: every fingerprint stands.

**New for cats: `fluff: true`** on `sit` (`cats.js`, the cats owner's last item): **fur puffed up against the cold**, the body's
outline a soft scalloped puff a little bigger all round, the tail bushed (Chispapaw's whole cream coat a dandelion puff), the
face as drawn. f048 only (the fluff Tap's answer). **If it does not read as puffed fur at the store's scale at 390 × 844, it is
dropped** and f048 draws them plain (the cats owner says so in its notes; the story builder follows). Off unless asked.

**Everyone else is drawn already:**
- **Our cat**: `sit`, `stand`, `walk` (the wall), `crouch` (the stone, the print with `reach: true`; the stretch as `crouch`
  with `tailUp: true`, chapter 12's f003), `loaf` (`sleepy`, `dreamy`), `curl` (`asleep`); `tap: 'paw'`, `'tail'`, `'ears'`,
  `'nose'`.
- **Chispapaw** (`chispapaw`, **`collar: false` on every frame**, chapter 13's): `crouch` (her crouch, f004; with `tailUp: true`
  and the `motion` effect, f005), `sit` (`proud`, `happy`, `wonder`, `sleepy`, `solemn` (f020); with `asleep: 'half'` at first light, f068:
  "asleep, sitting bolt upright"), `stand` with `motion` (hopping on the wall, f014; the bounce, f042b), `crouch` leaning close to
  the hollow (f035), `curl` asleep in her nest (f084, f085, with the den's `collar: true`).
- **Tallyheart**: `sit`, `walk` (padding along the bank, f048; past her nest, f080), `stand` (getting up, f055; she is gone on
  f056), `crouch` (smoothing the earth, f054); `kind`, `proud`, `solemn`, `happy`, `sad` (the ear's story, a soft look, never
  tears).
- **{Murmur}chime** (`murmurchime`): `walk` (the wall), `sit` (the wall's end; the stone, f033 to f037), `walk` past her nest
  (f078).
- **Glintstar**: `stand` on `fountain-top` (sunset), `sit` (the morning report); `solemn`, `kind`, `proud`.
- **The grey tom** (`snorer`, still unnamed, "Snoring apprentice"): `sit` (`sleepy`, `wonder`), `loaf` (`sleepy`, "Just resting my
  EYES."), `curl` with `asleep: true` (through the watch, with `zzz`), `crouch` with `tailUp: true` (his stretch, f075).
- **Sloshbank** (`sloshbank`): `stand` (`stern`, `proud`, `happy` (f028), `sniff`); facing right as he goes (f030).
- **The young ReedClan tom** (`reedclan` 2, "Young ReedClan tom"): `stand` with `necklace: true` (`happy`, `proud` (f022), `shout`, `worried`),
  `pawup` clutching his pebble (f030).
- **Nobody else**: no Riffle, Granny, Waffles, Thymeleaf, the old tom or GroveClan; the ReedClan she-cat not needed (the wall's
  end has room for none: the brief allows her only if a panel needs her). **No badger in any cast, ever.**

### Counts art

Nothing new: the anchors' pictures for the warm-up and the run (`E.questionDef`), the kit's store picture and sand for the take
pages, the 3s' patrols for 3 × 7, the 9s' lives for 6 × 9, their helps as drawn (the sand, the camp's earth, the earth by the store
and by the stone).

### Heard, not seen

*Drip.* (f015, f016, f017, f026), *Snore.* (f045, f052), *SNORE.* (f049a, f049b), *Snuffle. Ah… ah… AH…* (f059),
*AH-CHOOOOO!* (f060, with `sfxRead: 'Ah-choo!'`), *Sniff.* (f063): each the frame's `sfx`, lettered (a scratch frame's never
read). *snuffle, snuffle.* (f058) is the caption's own italics; *Drip.* after Sloshbank's right line is a caption on the take page.
**The stones' hum is said, not drawn** (the panel's shake is not in the story's vocabulary: section 7, item 4). No frame letters a
sound the story does not.

## 5. Build notes

General rules, then the chapter frame by frame. Chapter 12's file (`app/story/ch12.js`) and chapter 13's are the model: their
helpers (`c`, `S`, `merge`, `T`), frame ids in reading order, a `board` on every frame, named raw spots.

- **The chapter**: `PC.story.ch14 = { id: 'ch14', number: 14, title: 'The Night Watch', module: 2, start: 'f001', names: { player:
  '{name}{ending}' }, frames, counts: { 'ch14-warm': …, 'ch14-take': …, 'ch14-wall': …, 'ch14-watches': …, 'ch14-run': …,
  'ch14-lullaby': … }, cards: {}, book, teaser, tricky }` (section 2's sets, `T`, `G`, `M`, `LAST`; section 6's `tricky` key,
  word for word). It opens when chapter 13 is finished (number order: no `opensWhen`).
- **Captions first, then balloons** (chapter 5's rule): where the story puts narration after a balloon on one screen, the screen
  is split (the splits are in the frame list; the words never change). **No panel holds five boxes.** A speaker's paragraphs in a
  row are balloons in a row; a quote the story splits round its tag is one balloon, its comma a full stop where the quote resumes
  with a new sentence ("Twenty-one guards. All of them wide awake."; "The kits slept through the whole thing. Some cats do.").
- **Speech tags' narration is not lettered** (the picture carries it): "says", "whispers", "calls", "squeaks", "mumbles",
  "breathes", "mutters", "yawns", "out loud this time", "in his sleep", "fast asleep", "very quietly", "His ears go up." (f076:
  `wonder`, ears up), "She looks at the grey tom." (f051: Tallyheart facing him), "passing your nest" (f078). **Lettered as
  captions**, being narration the picture cannot carry: every other line of narration, "Tallyheart pads past your nest." (f080) and
  "Chispapaw whispers it with you." (f065c) among them.
- **Long captions** (at most 95 characters a box; split at a sentence break, the words unchanged): f031's sneaking line (97: "You
  creep home along the stones." / "The last one rocks…"), f036's (four boxes), f037's ceremony line (120), f050's (96), f056's
  (105), f064's (106), f068's (137), f071's (157), f084's (100). The story test pins every box at 95 or under.
- **Speakers**: every balloon's speaker is in the frame's cast, but three off-panel voices, each with `name` (no face, the tail out
  of the panel): the young ReedClan tom's "Something’s under your rock!" (f031, friends only, `name: 'Young ReedClan tom'`),
  **the grumpy voice** (f063, two balloons, `who: 'harrumph'`, `name: 'A grumpy voice'`: module-2's label till chapter 17; the
  page's `NAMES.harrumph` is the same label, section 6's page lines), and Chispapaw's "Four." on the print close (f071, `name:
  'Chispapaw'`). A balloon comes from the nth cast member of its speaker: the young tom is the only `reedclan` (Sloshbank is
  `sloshbank`), so his balloons always find his face.
- **Balloon kinds**: `whisper` for Chispapaw's "Which word?" (f015), our cat's "Like the ones by the oak." (f019), Chispapaw's
  "Hearing isn’t seeing." (f024), her muttered `teach: 'words'` line (f004), her "Another sleeper!" (f033), "My little Tall One
  chants the Counts every night. It makes ME sleepy." (f034), the Spanish ask (f035), the lullaby's right line and echo, "He snores
  in the den, TOO." and "He always has." (f046), "He won’t." (f052), the grey tom's "Not the SEVENS…" (f057), «¡Salud!» (f061), our
  cat's whispered count (f065b), "Badgers say THANK YOU?" and "Somebody polite does." (f066), "Not ONE gone." (f069), "Who walks on
  FIVE toes?" (f072), our cat's "Except after a night watch." (f078), the grey tom's "Bless you." in the den (f084), the run's echoes,
  {Murmur}chime's "Show-off." (the wall's right line). `shout` for the young tom's "That badger’s as big as a DOG! Everybody says
  so." (f023, "he calls"). Every other balloon plain (capitals carry the stress).
- **Spanish** (chapter 12's feature, as built): a whole Spanish line is a balloon with `lang: 'es'`, its text tokens and punctuation
  only, its English made by the engine and lettered under it: **f009 `'{Es:desagrupo}'`** (out loud: "«¡Desagrupo!»" over "(Breaking
  it into groups!)"), **f035 `'¿{Es:6} {es:por} {es:9}?'`** (whispered), **f061 `'{Es:salud}'`** (whispered: "«¡Salud!»" over "(Bless
  you!)"). The bare capital token for a words-table line (`{Es:salud}`, never `'¡{es:salud}!'`, which letters «¡¡Salud!!»: the
  Spanish critic's round-1 note). The echoes are the sets' own (`'¡{Es:fact}!'` on the warm-up and the run, `'¡{Es:answer}!'` on
  462 − 135 and the lullaby). Out loud in the Hollow, none in front of ReedClan, whispered at night and at the stone. Never «» in the
  story file.
- **The words table** (`app/story/words.js`, `PC.words.es`, one line, the cats owner's): `salud: { es: '¡Salud!', en: 'Bless you!' }`
  (the form as lettered, chapter 13's pattern: `E.esEnglish('¡Salud!')` is 'Bless you!', run).
- **"Spread" is fixed English in one frame line and one book line**: f010's "Exactly. Spread a row. The squares can wait." (a
  frame balloon: `E.fill` fills no `E.TAKE_WORDS` token) and the book's recap line 2, "spread a row, and the squares can wait".
  **The story test asserts `PC.words.Spread === 'Spread'`**, its message naming f010, **and `PC.words.spread === 'spread'`**, its
  message naming f010 and the book's recap line 2 (chapter 13 pinned both forms for its f034 and f037), so a change of the class
  word (decision 53) fails a test until both lines are looked at.
- **The choices**: labels with the story's quotes, `sets: {}`. Where each option has its own reply, each goes to its own frame
  (f042a, f042b; f049a, f049b; f065a, f065b), which meet again.
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; a cast target drawn only where the cast entry carries `tap`, a scene
  target by the set's `tap` option). Each Tap's response is drawn on the next frame, or not at all where the page turns at once
  (section 7, item 4):

  | Frame | `tap` (who carries it) | `prompt` | `label` |
  |---|---|---|---|
  | f002 the store | `store` (the bridge's `tap: 'store'`) | `**Tap** to count the store.` | `Count the store.` |
  | f005 the flag | `tail` (our cat, `sit`) | `**Tap** to show her a FLAT tail.` | `Show her a flat tail.` |
  | f011 the spread | `paw` (our cat, `sit`) | `**Tap** to scratch yours.` | `Scratch yours.` |
  | f017 the holes | `holes` (the title's `tap: 'holes'`) | `**Tap** to look closer.` | `Look closer.` |
  | f021 the pebble | `pebble` (the young tom, `necklace: true`) | `**Tap** to look at the pebble.` | `Look at the pebble.` |
  | f037 the stone | `paw` (our cat, `crouch`, at `stone-1`) | `**Tap** to tuck the stone back.` | `Tuck the stone back.` |
  | f045 asleep | `paw` (our cat, `sit`) | `**Tap** to wave a paw in front of his nose.` | `Wave a paw in front of his nose.` |
  | f047 alert | `tail` (our cat, `sit`) | `**Tap** to fluff up your fur.` | `Fluff up your fur.` |
  | f053 the moon climbs | `paw` (our cat, `sit`) | `**Tap** to stretch first.` | `Stretch first.` |
  | f059 *Ah… ah…* | `ears` (our cat, `sit`) | `**Tap** to prick up your ears.` | `Prick up your ears.` |
  | f070 the trail | `paw` (our cat, `crouch`, at `bank-left`) | `**Tap** to put your paw beside one.` | `Put your paw beside one.` |
  | f074 still asleep | `nose` (our cat, `sit`) | `**Tap** to whisper, “Morning!”` | `Whisper, “Morning!”` |
  | f078 noon | `nose` (our cat, `loaf`, `sleepy`) | `**Tap** to yawn.` | `Yawn.` |
  | f082 the hook | `nose` (our cat, `loaf`, `dreamy`) | `**Tap** to curl up tight.` | `Curl up tight.` |

- **Shared opts**: `STORE_AM = { store: 245, frost: true }` (morning), `STORE_NIGHT = { store: 245, moon: 19 }` (night),
  `STORE_DAWN = { store: 245, moon: 19, frost: true }` (first light); `H14 = { marks: 10, glow: 'auto' }` (merged with `spread3`);
  `HOLES = { holes: true }`; `BANK_DAWN = { drag: false, frost: true, trail: true }`; `PRINT_BADGER = { badger: true, drag: false,
  drips: false }` (the print redrawn outside, section 4); `CAMP_DAWN = { frost: true }` (chapter 13's camp frost, f077); `DENW14`,
  `DEN_APP14` (section 4).
- **Spots**: the store's `store-left` (our cat), `store-back-1` (Chispapaw), `store-right` (the grey tom), `way-in` (Tallyheart),
  listed back to front as chapter 12's sets owner reported (`store-back-1`, `way-in`, `store-left`, `store-right`); the Hollow's
  `tree`, `sunpatch-3` and chapter 12's `HOL_YOU`; the title's `wall`, `wall-2`, `wall-3` (the leader at `wall-3`), `end-1` to
  `end-3` (our cat, Chispapaw, {Murmur}chime), `reed-1` (Sloshbank), `reed-2` (the young tom), and the `stone` spots (new); the
  camp's `fountain-top` (Glintstar) and raw spots at its foot (chapter 12's `RING_YOU` and `RING_TALLY` are the model); the bank's
  `bank-left` and a raw spot beside it for Chispapaw; the print's `over`; the den's `nest`, `next-nest`, `sleeper-1` and chapter
  12's raw spot `PAST` for Tallyheart passing. **The story builder settles each raw spot with `tools/frames.mjs`**, touching nobody,
  and names it in the file.

### The frames

**80 frames on a plain reading** ("We stay right here.") **or 81** ("Keep counting, quietly."), **85 or 86 with the salamander** (cap
125): f001 to f085 with f042a/b, f049a/b, f065a/b/c, the salamander's f033 to f037 read only after "Look under the stone.". The words
of each are the story's screen, named by its first words; every line below is the story's.

**The store** (`bridge`/`store`, `morning`)
- **f001** `STORE_AM`: our cat `sit` (`wonder`) at `store-left`, facing right. Caption "Chapter 14: The Night Watch". The start,
  every path (the brief's title panel).
- **f002** `merge(STORE_AM, { tap: 'store' })`, our cat `sit` (`proud`): captions "Two frosty days later, the Old Bridge sparkles
  white, and the store under it is fuller." / "Every morning now, you count it. It’s YOUR job."; the store Tap.
- **f003** `STORE_AM`, our cat `sit` (`happy`): her balloon "Two squares, four rows, five loose. Two hundred forty-five." (split:
  narration follows).
- **f004** the same, Chispapaw `crouch` (`proud`) at `store-back-1` facing right (her tail out, not up): captions "Not five hundred
  yet. But growing." / "Beside the store, Chispapaw is practicing her crouch."; by `when`: (`teach: 'show'`) "Belly low. Tail out.
  Like you SHOWED me."; (`try`) "I tried it a HUNDRED times last night. Watch!"; (`words`, whisper) "The crouch feeds you. The Counts
  feed your whole Clan." Exactly one shows (a cat who never chose shows none: not possible after chapter 13).
- **f005** the same, Chispapaw `crouch` with `tailUp: true` and the `motion` effect (listed first), our cat `sit` with `tap: 'tail'`:
  caption "Her tail sticks straight up, like a flag. Her bottom wiggles. Her eyes go to the store."; our cat's "Don’t pounce on THAT.
  It’s already caught."; the tail Tap (its answer, her tail flat and Chispapaw's popping up, is not drawn: the page turns).

**The Training Hollow** (`hollow`/`lesson`, `morning`, `H14`; Chispapaw `sit` at `sunpatch-3`, Tallyheart `sit` at `tree` facing
left, our cat `sit` at `HOL_YOU`: chapter 12's staging)
- **f006**: caption "In the Training Hollow, Tallyheart is waiting."; her "First, wake up your whiskers."; `counts: { set:
  'ch14-warm', intro: false, next: 'f007' }`.
- **f007**: Tallyheart's "Last time, two digits. Today, three. Same trick." (split: narration follows).
- **f008** `spread3: 'standing'`: caption "She scratches three hundred fifty-two in the sand: three squares, five lines, two dots.";
  her "Two loose. Take away seven?"
- **f009** the same, Chispapaw `sit` (`happy`): her `lang: 'es'` balloon `'{Es:desagrupo}'`, out loud (split: narration follows).
- **f010** the same, Chispapaw `sit` (`proud`): caption "Chispapaw looks VERY proud."; Tallyheart's "Exactly. Spread a row. The
  squares can wait."
- **f011** `spread3: 'spread'`, our cat `sit` with `tap: 'paw'`: captions "She crosses out one line and scratches ten new dots: ten
  more loose." / "The three squares stay right where they are."; the scratch Tap.
- **f012** `spread3: 'two'`: Chispapaw's "The squares get to WAIT? Lucky squares."; Tallyheart's "Three squares, four rows, twelve
  loose. Still three hundred fifty-two. One day soon, the store will hold this many. I’ll say each step. You type it." (one balloon:
  the editor's join, so it is plainly hers); `counts: { set: 'ch14-take', intro: false, next: 'f013' }`.
- **f013** the same: Tallyheart's "Three digits. Same trick."; Chispapaw's "My little Tall One sighs at these every night. Not ME."

**The wall's end** (`title`, `day`)
- **f014** `title`/`wide`: Chispapaw `stand` with the `motion` effect at `wall-2` (listed first), {Murmur}chime `walk` at `wall`, our
  cat `walk` at `wall-3`, all facing right: captions "At midday, you lead a patrol of three along the old wall: you, {Murmur}chime and
  Chispapaw." / "Chispapaw hops from stone to stone."; her "Wet paws are the WORST."; {Murmur}chime's "Then you’ll love ReedClan."
- **f015** `title`/`end`, `HOLES`: our cat `end-1`, Chispapaw `end-2`, {Murmur}chime `end-3` (`sit`, facing right), Sloshbank `stand`
  (`stern`) at `reed-1` facing left; `sfx: 'Drip.'`: captions "At the wall’s end, the stones stop and the reeds begin." / "Sloshbank
  is waiting there, on his own side of the little water. Big, brown, and dripping."; his "CrystalClan. A word."; Chispapaw's whisper
  "Which word?"
- **f016** `title`/`meet`, `HOLES`, the same cast; `sfx: 'Drip.'`: Sloshbank's "HOLES." (split: narration follows).
- **f017** `title`/`end`, `merge(HOLES, { tap: 'holes' })`; `sfx: 'Drip.'`: caption "Behind him, in ReedClan’s bank: holes. Big,
  muddy holes."; his "ReedClan does not LIKE holes."; the holes Tap.
- **f018** `title`/`holes`, `HOLES` (no cast): captions "Beside the holes, scratched in the mud: two long lines." / "And three little
  pokes, small and neat." (the Tap's answer: the holes close up).
- **f019** `title`/`meet`, `HOLES`, f016's cast: our cat's whisper "Like the ones by the oak." (split: narration follows).
- **f020** the same, Chispapaw `sit` (`solemn`): caption "She nods. Neither of you says any more."
- **f021** `title`/`meet`, `HOLES`: the young tom `stand` (`happy`) at `reed-2` with `necklace: true, tap: 'pebble'`, Sloshbank at
  `reed-1`, our three: captions "Out of the reeds bounds the young ReedClan tom, all ears and legs." / "Round his neck swings a pebble
  on a string."; his "Badger-proof! Two weasels sold it to me. One mouse."; the pebble Tap.
- **f022** the same (the young tom `proud`): caption "It’s a pebble. A very ordinary pebble."; Chispapaw's "Does it WORK?"; his "No
  badger’s sat on me YET!" (the Tap's answer, "the pebble close up", is the pebble plain on his chest at `meet`: section 7, item 4).
- **f023** the same: his shout "That badger’s as big as a DOG! Everybody says so."; {Murmur}chime's "Did you SEE it?"; his "…Well. No.
  But my pebble is VERY sure." (a word joiner after the leading ellipsis; the young tom `worried`).
- **f024** the same: Chispapaw's whisper "Hearing isn’t seeing." (split: narration follows).
- **f025** the same, our cat `sit` (`proud`) facing Chispapaw: caption "Your words! You give her a pleased look."
- **f026** the same, Sloshbank `stand` (`proud`); `sfx: 'Drip.'`: caption "Sloshbank puffs up his chest."; his "ReedClan’s store holds
  four hundred seventy-three." and "How many in yours?"; our cat's "Two hundred forty-five."
- **f027** the same: caption "You counted it this morning."
- **f028** the same (Sloshbank `happy`): caption "Sloshbank looks very pleased."; `counts: { set: 'ch14-wall', intro: false, next:
  'f029' }` (his question is the take page's prompt).
- **f029** the same, Sloshbank `stand` (`sniff`): caption "Sloshbank sniffs the air, toward the Old Bridge."; his "A store by the river
  smells like supper. If I were a badger…"
- **f030** `title`/`end`, `merge(HOLES, { rustle: true })`: Sloshbank `stand` facing right (going), the young tom `pawup` (`worried`)
  at `reed-2` clutching his pebble, our three: captions "He doesn’t finish. The young tom clutches his pebble." / "Then the reeds
  close behind them."
- **f031** `title`/`end`, `merge(HOLES, { spot: true })`, our three facing left (homeward), no ReedClan: caption "You turn for home.
  ReedClan has gone."; by `specialty`: (`noticing`) "Then you notice it: a yellow spot, under the wall’s last stone."; (`sneaking`)
  "You creep home along the stones." / "The last one rocks under your paw. Something yellow is under it."; (`climbing`) "From the top
  of the wall, you see it: a yellow spot, under the last stone." (our cat stays on the ground: chapter 12's hedge-top precedent);
  (`friends`) "The young ReedClan tom pops back out of the reeds and points." and his off-panel balloon (`name: 'Young ReedClan tom'`)
  "Something’s under your rock!"; (`swimming`) "Chispapaw looks back." and her "That stone has a yellow SPOT. Stones don’t have
  spots." At most three boxes on any path.
- **f032** the same: by `specialty: 'friends'` the caption "Then he’s gone." (split: it follows his balloon); **Choose** "“Look under
  the stone.”" (→ f033) / "“Home to Glintstar.”" (→ f038). Every other path shows the choice alone over the wall's end and the spot.

**The salamander** (`title`/`stone`, `day`; optional; our cat at `stone-1`, Chispapaw at `stone-2`, {Murmur}chime at `stone-3`, the
salamander at `nook`)
- **f033**: the salamander `curl` (`happy`) with the `motion` effect (listed first), our cat `crouch` (`wonder`): captions "You nose
  the stone over, very gently." / "Underneath, curled in the cold earth, lies a little black salamander with yellow spots." / "It’s
  smiling. It’s also shivering."; by `when: { foundGroundhog: true }` Chispapaw's whisper "Another sleeper!"
- **f034** the salamander `blink`: caption "It opens one eye. It blinks at you. At Chispapaw. At {Murmur}chime. It says nothing at
  all."; {Murmur}chime's "It’s COLD. Something woke it up."; Chispapaw's whisper "My little Tall One chants the Counts every night. It
  makes ME sleepy."
- **f035** the same, Chispapaw `crouch` (leaning close): caption "Chispapaw leans close to the salamander, and whispers."; her whispered
  `lang: 'es'` balloon `'¿{Es:6} {es:por} {es:9}?'`; `counts: { set: 'ch14-lullaby', intro: false, next: 'f036' }`.
- **f036** the salamander `point` (`happy`, `facing: 'left'`, its head toward the cats, its tail toward the far bank at the
  right), our three facing right, toward the far bank: captions "The salamander’s
  eye closes. Its smile gets bigger. It’s asleep." / "Its tail curls out and points. Across the water." / "At the two long lines and
  the three little pokes." / "You look. Chispapaw looks. {Murmur}chime looks. Nobody says a word."
- **f037** the salamander `sleep`, Chispapaw `sit` (`sleepy`), our cat `crouch` with `tap: 'paw'`: captions "At your ceremony, you
  promised to look after every friend who needs you." / "That means the very small, very quiet ones too."; Chispapaw's "Sweet dreams.
  See you at blossom-time."; the tuck Tap; **`sets: { foundSalamander: true }`**; → f038.

**Sunset at the fountain** (`camp`, `sunset`; Glintstar `stand` on `fountain-top`, our cat, Chispapaw and the grey tom at its foot,
raw spots; no Tallyheart)
- **f038** `camp`/`fountain`: caption "At sunset, you tell Glintstar everything. The holes. The scratches. The pebble. The bragging."
  (93); Chispapaw's "The pebble was VERY ordinary."
- **f039** the same: caption "And then you tell her the last thing:"; our cat's "If I were a badger…"
- **f040** the same, Glintstar `solemn`: caption "Glintstar’s whiskers go very still."; her "Then the store needs a watch."; `counts:
  { set: 'ch14-watches', intro: false, next: 'f041' }` (her question is the Count's prompt).
- **f041** the same, Glintstar `kind`, the grey tom `sit` (`worried`): her "{name}{ending}, the first watch is yours. Take your
  apprentice. And the grey tom."; his "ME? At NIGHT? Nights are for SLEEPING!"; **Choose** "“We’ll keep watch, Glintstar.”" (→ f042a) /
  "“Chispapaw! The first watch is OURS!”" (→ f042b).
- **f042a** the same: Glintstar's "I know you will."; Chispapaw's "What do you DO on a watch?"; Glintstar's "One rule. A watch watches.
  Nobody goes looking." → f043.
- **f042b** `camp`/`reveal`: Chispapaw `stand` with the `motion` effect (listed first): caption "Chispapaw bounces so high, she nearly
  lands in the fountain."; her "What do you DO on a watch?"; Glintstar's "One rule. A watch watches. Nobody goes looking." → f043.

**The watch** (`bridge`/`store`, `night`, `STORE_NIGHT`; our cat `store-left`, Chispapaw `store-back-1`, the grey tom `store-right`,
Tallyheart `way-in` when she is there; listed back to front). **The close frames**, f047, f058, f059, f062, f064, f065a,
f065b, f065c and f066, are on **`bridge`/`store-close`** (section 4) with `STORE_NIGHT`: our cat at `store-left` and Chispapaw at
`store-back-1` only, the grey tom and Tallyheart off the panel and out of the cast (no line of theirs on those frames; his snores
are on the frames around them). If the sets owner keeps those frames on `store` (section 4's fallback), they take the full cast.
- **f043**: all `sit` (`wonder`; the grey tom `sleepy`): captions "At dusk, the three of you settle in by the store. At last the moon
  comes up, late and big." (90; the store's first panel by night, moonlit: the brief's call 1); Chispapaw's "Everything’s SILVER. Even
  the grey tom!"
- **f044** the grey tom `loaf` (`sleepy`): caption "The grey tom yawns."; his "Just resting my EYES." (split: narration follows).
- **f045** the grey tom `curl` with `asleep: true`, `zzz`, `sfx: 'Snore.'`, our cat with `tap: 'paw'`: caption "Asleep. In a
  heartbeat."; the wave Tap (he doesn't stir: the next frame shows him still asleep).
- **f046** the same: Chispapaw's whisper "He snores in the den, TOO."; our cat's whisper "He always has." (split: narration follows).
- **f047** the same, Chispapaw `sit` (`proud`), our cat with `tap: 'tail'`: caption "She sits up very straight, whiskers shivering.";
  her "I’m not cold. I’m ALERT. My FIRST night watch. I’m staying awake FOREVER."; the fluff Tap.
- **f048** the same, our cat and Chispapaw `sit` with **`fluff: true`** (the Tap's answer; plain if the cats owner dropped it),
  Tallyheart `walk` (`kind`) at `way-in` facing left: caption "Along the bank pads Tallyheart."; her "All quiet?"; **Choose** "“All
  quiet.”" (→ f049a) / "“Except HIM.”" (→ f049b).
- **f049a** the same, Tallyheart `sit`; `sfx: 'SNORE.'`: her "Nearly." → f050. **f049b** the same; `sfx: 'SNORE.'`: her "So I HEAR."
  → f050.
- **f050** the same, Chispapaw `sit` (`wonder`): captions "Chispapaw stares at Tallyheart’s torn ear, silver in the moonlight." / "Then
  she asks, straight out:"; her "Tallyheart? What happened to your EAR?"
- **f051** the same, Tallyheart `sit` (`solemn`, facing the grey tom): caption "Tallyheart is quiet. Then:"; her "One night, long ago,
  a fox came sniffing round the kits’ den. I was young. I chased him off." and "The kits slept through the whole thing. Some cats do."
- **f052** the same, Tallyheart `kind`; `sfx: 'Snore.'`: her "The fox got away without a scratch. I didn’t. I was counting his
  pawsteps. I got to forty-three. A bramble got my ear." and "Don’t tell anyone."; Chispapaw's whisper "He won’t."
- **f053** the same, Chispapaw `sit` (`sleepy`), our cat with `tap: 'paw'`: caption "The moon climbs. Chispapaw yawns an enormous yawn.
  Uh-oh. You yawn too."; our cat's "Ask me the tricky ones. To keep awake."; the stretch Tap.
- **f054** the same, our cat `crouch` with `tailUp: true` (the stretch's answer: chapter 12's f003), Tallyheart `crouch` (smoothing the
  earth): caption "Tallyheart smooths a patch of earth with her paw."; her "The tricky ones it is." (the frame's 14 words); `counts: {
  set: 'ch14-run', intro: false, next: 'f055' }`.
- **f055** the same, Tallyheart `stand`: caption "Tallyheart gets up."; her "Keep counting. It keeps a warrior awake." (split:
  narration follows).
- **f056** the same, no Tallyheart: captions "She pads off along the silver bank." / "Now it’s just you, your apprentice, a snoring grey
  tom, and the moon."

**The sneeze** (the store, `night`, the three; nothing drawn behind the store on any frame)
- **f057** the grey tom `curl` `asleep`, `zzz`: caption "The river whispers."; his whisper "Not the SEVENS…" (split: narration
  follows).
- **f058** Chispapaw `sit` (`wonder`), our cat `sit` (`wonder`): captions "Chispapaw opens her eyes wide, then wider, to keep them
  open." / "Then, from behind the store: *snuffle, snuffle.*"
- **f059** the same, our cat with `tap: 'ears'`; `sfx: 'Snuffle. Ah… ah… AH…'`: the ears Tap (its answer, four ears swivelling, is not
  drawn: cats face left or right).
- **f060** the same; `sfx: 'AH-CHOOOOO!'`, `sfxRead: 'Ah-choo!'`: caption "A sneeze so big, the stones of the Old Bridge hum."
- **f061** the same: the grey tom's "Bless you."; Chispapaw's whispered `lang: 'es'` balloon `'{Es:salud}'` (split: narration follows).
- **f062** the same: caption "It’s what her Tall Ones always say."
- **f063** the same; `sfx: 'Sniff.'`: caption "Silence. Then, from behind the store, a grumpy voice."; two off-panel balloons, `who:
  'harrumph'`, `name: 'A grumpy voice'`: "Thank you." and "And thank YOU." (the sniff lettered between them in the picture; a
  sound's place is not in the reading order). **No shape, shadow or eyes anywhere.**
- **f064** the same, Chispapaw `sit` (`wonder`) looking at our cat, our cat `sit` (`proud`, sitting up tall): captions "Then nothing.
  Only the river, the silver light, and your friends beside you." / "Chispapaw looks at you. So you sit up tall, the way Tallyheart
  does." / "A watch watches. Nobody goes looking."; **Choose** "“We stay right here.”" (→ f065a) / "“Keep counting, quietly.”" (→
  f065b).
- **f065a** the same, Chispapaw `sit` (`proud`): caption "You stay by the store, steady as a stone. Chispapaw sits up tall too, just like
  you." → f066.
- **f065b** the same: our cat's whisper "Two squares. Four rows. Five loose." → f065c. **f065c** the same: caption "Chispapaw whispers
  it with you." (narration: no balloon of hers, no Spanish) → f066.
- **f066** the same, Chispapaw `sit` (`wonder`, eyes huge, never `scared`): caption "Her eyes are huge. Not scared. AMAZED."; her
  whisper "Badgers say THANK YOU?"; our cat's whisper "Somebody polite does."
- **f067** the same, the grey tom `curl` `asleep`, `zzz`: caption "The grey tom snores on."

**First light** (`morning`)
- **f068** `bridge`/`store`, `STORE_DAWN`: Chispapaw `sit` with `asleep: 'half'` (bolt upright, waking), our cat `sit`, the grey tom
  `curl` `asleep`: captions "At first light, the moon is still up, pale, over the river." / "You kept your eyes open all night.
  Chispapaw is asleep, sitting bolt upright."; her "I’m AWAKE."
- **f069** the same, Chispapaw `sit` (`happy`, awake): caption "You count the store."; our cat's "Two squares, four rows, five loose.
  Every piece."; Chispapaw's whisper "Not ONE gone."
- **f070** `bridge`/`bank`, `BANK_DAWN`: our cat `crouch` (`wonder`) at `bank-left` with `tap: 'paw'`, Chispapaw `sit` (`wonder`) at
  a raw spot beside her, the trail before them: caption "Behind the store, in the frost: prints. BIG ones. They go along the bank, away
  downriver." (89); the paw Tap.
- **f071** `bridge`/`print`, `PRINT_BADGER`: our cat `crouch` with `reach: true` at `over`: captions "Five toes in a row, on every print.
  Yours shows four." / "A cat’s fifth claw sits up high, off the ground." / "Chispapaw presses a paw in the frost, just to be sure.";
  her off-panel balloon (`name: 'Chispapaw'`) "Four."
- **f072** `bridge`/`bank`, `BANK_DAWN`, f070's cast (our cat `sit`): Chispapaw's whisper "Who walks on FIVE toes?" (split: narration
  follows).
- **f073** the same, our cat looking downriver (`dreamy`): captions "Sprinkle did. But her prints were far bigger, and she’s home with
  her Mama." / "You don’t know who. Not yet."
- **f074** `bridge`/`store`, `STORE_DAWN`, the grey tom `curl` `asleep`, `zzz`, our cat `sit` with `tap: 'nose'`: caption "The grey
  tom is still asleep. Of course he is."; the whisper Tap.
- **f075** the same, the grey tom `crouch` with `tailUp: true` (`sleepy`, the stretch): caption "The grey tom stretches."; his "Did I
  miss anything?"; Chispapaw's "A SNEEZE! You said bless you, in your SLEEP. It said thank you! Then it said thank you to ME!"; his
  "…I’m very polite. Even asleep."
- **f076** the same, the grey tom `sit` (`wonder`, ears up): Chispapaw's "And Tricky Counts!"; his "Tricky Counts? My Warrior Counts
  are coming. Next time, I’ll ask YOUR tricky ones. For PRACTICE."; hers "If you’re awake."; his "Only resting my EYES." (the plant of
  the Hollow's button: section 6).

**Her nest** (`morning`)
- **f077** `camp`/`reveal`, `CAMP_DAWN` (the camp white with the same first frost as the bank): Glintstar `sit` (`kind`) at
  `fountain-top`, our cat and Chispapaw before her: caption "You tell Glintstar
  everything."; her "A watch that watched. Well kept, warrior." (the story's screen drawn as two frames: two places, chapter 13's
  verify-round precedent).
- **f078** `den`/`nest`, `DENW14`: our cat `loaf` (`sleepy`) at `nest` with `tap: 'nose'`, {Murmur}chime `walk` past at the nest's edge
  (chapter 12's raw spot `PAST`): her "Warriors don’t sleep till NOON. Usually."; our cat's whisper "Except after a night watch."; the
  yawn Tap.
- **f079** the same, our cat `curl` (`sleepy`), no {Murmur}chime: caption "Your warrior’s nest is warm in the daylight. Your mist stone
  is grey on the moss."; by `ch2Stone`: (`nose`) "Riffle’s stone is by your nose."; (`chin`) "Riffle’s stone is under your chin."
- **f080** the same, Tallyheart `walk` (`kind`) at `PAST`: caption "Tallyheart pads past your nest."; her "Any sneezes?"; our cat's
  "ONE."
- **f081** the same, our cat `loaf` (`dreamy`): captions "In your book, the badger page has a new line under *They say*: “As big as a
  DOG!”" / "Under *I saw*: nothing new. You didn’t see a thing. You only heard it say thank you."
- **f082** the same, our cat `loaf` (`dreamy`) with `tap: 'nose'`: captions "You close your eyes, and there they are. Five toes in a row,
  going downriver." / "Toward the Holt. Riffle’s home."; the curl Tap. Never answered.

**Chapter end**
- **f083** `den`/`nest`, `DENW14`, `morning`, `zzz`, `sparkle`: our cat `curl` `asleep`. Caption "What did {name}{ending} dream, after
  the night watch?"; `input: { kind: 'dream', placeholder: 'A sneeze… five toes… the moon…', next: 'f084' }`.
- **f084** `den`/`inside`, `DEN_APP14`, `morning`: Chispapaw `curl` `asleep` at `nest` (the collar beside her), the grey tom `curl`
  (`sleepy`) at `sleeper-1`: captions "{name}{ending} sleeps in the warm daylight." / "In the apprentices’ den, Chispapaw sneezes in her
  sleep."; his whisper "Bless you." (split: the end line follows).
- **f085** the same, both asleep, `zzz`: caption "End of Chapter Fourteen."; `end: true`.

### The book (the story builder's; proposed here)

```js
book: {
  title: '{name}{ending}’s First Frost-Time', chapterTitle: 'The Night Watch',
  store: 245,   // book two: the store drawn under the recap (two squares, four rows, five loose)
  dream: '{name}{ending}’s dream: “{dream}”',
  noDream: '{name}{ending}’s dream, after the night watch, stayed a secret.',
  recap: [
    { text: 'Two frosty days later, the store under the Old Bridge held two hundred forty-five, and {name}{ending} counted it every morning.' },
    { text: 'In the Training Hollow, Tallyheart taught the same trick with three digits: spread a row, and the squares can wait.' },
    { text: 'At the wall’s end there were holes in ReedClan’s bank, and beside them two long lines and three little pokes.' },
    { text: 'The young ReedClan tom wore a badger-proof pebble, and Sloshbank said ReedClan’s store held two hundred twenty-eight more than CrystalClan’s.' },
    { when: { foundSalamander: true }, text: 'Under the wall’s last stone, {name}{ending} found a little salamander, answered its sleepy six times nine, and tucked the stone back over it.' },
    { text: 'Glintstar set a watch on the store, three guards a night for seven nights, and the first watch was {name}{ending}’s, with Chispapaw and the grey tom.' },
    { text: 'In the night something sneezed behind the store, the grey tom said bless you in his sleep, and a grumpy voice said thank you.' },
    { text: 'At first light every piece of the store was there, and big prints with five toes in a row went downriver, toward the Holt.' }
  ],
  // the badger page: its `size` row (chapter 13's names) gains the young tom's rumour; nothing under I saw
  badger: [{ row: 'size', say: { text: 'As big as a DOG!', who: 'the young ReedClan tom' } }],
  // the second of the seven sleepers' pages (E.sleepers): its `sleep` pose, by PC.art.vocab.cast
  sleeper: { id: 'salamander', name: 'The salamander', when: { foundSalamander: true },
    lines: ['Asleep under the last stone at the wall’s end, curled in the cold earth, smiling.',
            'It never said a word. But its tail pointed across the water, at the two long lines and the three little pokes.'] }
}
```

- Seven recap lines on every reading, eight with the salamander, each true on every path (the two hundred twenty-eight whether
  473 − 245 was helped or not; "the first watch was" whichever answer she gave Glintstar); English only (chapter 12's call 22: no
  «¡Desagrupo!» in the book); no line names the badger as what sneezed, calls the marks a count, or reads them. **Tallyheart's ear is
  not in the book** ("Don't tell anyone.": call 22). The volume's title is chapter 12's.
- The badger page as the engine draws it: `size` shows chapter 13's "As big as a FOX!" (the ferry otters) and this "As big as a DOG!"
  (the young ReedClan tom), nothing struck; no `saw` line (nothing was seen: the brief's call 14).
- The sleepers page: with `foundGroundhog` and `foundSalamander`, both found and five silhouettes; with only one of them, that one and
  six; with neither, null (no page). A missed sleeper's silhouette is an engine need, not this chapter's (chapter 13's note).

### The teaser (proposed)

`teaser: { title: 'Chapter 15: The Holt', lines: ['Riffle’s home, at last. And you’re invited!'] }`: the story's own line, module-2's
title for chapter 15, no badger. With chapter 14 built, chapter 13's teaser is `built: true, next: 'ch14'` (section 10).

### Tests the story builder adds (`tests/story-ch14.test.js`)

As chapter 13's, and: every frame renders with the art's vocabulary (`salamander` and its four poses; `necklace`, `tap: 'pebble'`,
`fluff` (if kept); the title's `holes`, `spot`, `tap: 'holes'`, the `holes` camera, the `stone` composition and its spots; the hollow's
`spread3`; the bridge's `store` at night with `moon`, `frost`, the `store-close` camera, the bank's `frost` and `trail`, the print's
`badger`; the camp's `frost`) and every Tap's target is in its picture; every speaker in the cast but f031's, f063's and f071's named voices; the
balloons' faces (the young tom's
from `reedclan` 2 on f021 to f030; the first cast member of every `motion` frame the one the story moves: f005 and f042b Chispapaw,
f014 Chispapaw, f033 the salamander); `necklace: true` on the young tom on every frame he is in; Chispapaw `collar: false` on every
frame, the den's `collar: true` on f084 and f085; **no cast member is a badger, and nothing is drawn behind the store** (no cast at
`store-back-2` or `store-back-3` on any night frame, no cast at any spot but `store-left`, `store-back-1`, `store-right` and `way-in`,
and nothing drawn in the nook or the heap of old stones: Chispapaw's `store-back-1` is chapter 12's spot a step behind the store, the
staging's own); the close frames on `store-close` with our cat and Chispapaw alone (if kept); **the grown-ups corner**: `UI.flagWords.foundSalamander`
exactly as section 1; **the flags**:
for every `teach` (three), f004 shows exactly one balloon; for every `specialty` (five) × `ch2Stone` (two): f031 shows exactly one
specialty line or pair, at most three boxes, f032 the friends' caption only for friends, f079 exactly one stone caption; for
`foundGroundhog` true and false, f033 shows "Another sleeper!" or not; f037 sets `foundSalamander` and no choice sets it; "Home to
Glintstar." reaches f038 without f033 to f037; the option frames meet (f042a, f042b → f043; f049a, f049b → f050; f065a → f066, f065b →
f065c → f066); **the Spanish**, by structure, not literal Spanish (the literal Spanish lives only in `tests/spanish.test.js`): every
`lang: 'es'` balloon is f009's, f035's or f061's, its text tokens and punctuation only: f009 `'{Es:desagrupo}'` (no `kind`), f035
`'¿{Es:6} {es:por} {es:9}?'` (`kind: 'whisper'`), f061 `'{Es:salud}'` (`kind: 'whisper'`); for a words key, `E.esLine(text)` is `'«'
+ PC.words.es[key].es + '»\n(' + PC.words.es[key].en + ')'`; `E.esEnglish(PC.words.es.salud.es)` is `PC.words.es.salud.en`; the
lullaby's prompt text equals f035's balloon text (`'¿{Es:6} {es:por} {es:9}?'`), lettered by `E.promptLines` as `E.esLine` of it
then the caption, and its retry "Here’s that one again." then the same; `docs/storyboard/ch14.md` holds no `{Es:` and no `{es:`; no «»
in the file; **the words**: `PC.words.Spread === 'Spread'`, its message naming f010, and `PC.words.spread === 'spread'`, its message
naming f010 and the book's recap line 2; **the Counts claims of section 2, pinned**: `E.countSets(STORIES)` is chapter 10's ten; `E.checkStory` and
`E.checkTakes` clean;
the lesson as section 2 plays it (the worked example's show steps, no school words, its right line; 640 − 218's tap lines (`tap.onesZero`,
no asks) and its two boxes (3, then 10 or 1); 352 − 127's show asking 4, then 12 (or 1); 768 − 315's ones tap `extra` (`move: 'touch'`); a helped
352 − 127's twin `'tap'` with no prompt and no right line; 462 − 135's and 768 − 315's full lines; the echo after 462 − 135 right and
helped, never after its twin; `state.avoid` 225, 422, 327, 453, 228; 768 − 315's hundreds typed 3 opens "Let’s scratch it out." and is
logged slip `fact`; its tens typed 4 the kit's tens `extra` line); 473 − 245's right lines, its helped `missLast` line, no twin; the
warm-up over every one-pick and two-pick case (no pair twice, never 3 × 7, 5 × 7 or 10 × 8, every question a numeric `table` whose first line is
`E.genericQuestion` of `E.hollowDef(STORIES, q.table)`), its echo on the first right answer only; the run over every case of none to
three picks (no pair twice, no pick on 3 × 7, 5 × 7 or 10 × 8, places 3 and 4 always 5 × 7 then 10 × 8, every question a numeric
`table`, the help's ground `'earth'`), a quick pick's line "Not so tricky now.", a slow one's "Getting easier.", the echo after 5 × 7
and 10 × 8 only; 3 × 7's retry "Here’s that one again. Seven watches. How many guards?" and its right line on a retry; captions at
most 95 characters and no panel with five boxes; the shots (chapter 12's test): no more than 13 panels running on one camera with
one shot, each board's shot label true to its picture (never relabelled to pass; section 7 item 18's fallback names its one exception); 80 or 81
frames on a plain reading, 85 or 86 with the salamander; the book's lines
(seven, eight with `foundSalamander`), `store: 245`, the badger line, the sleeper, `module: 2`; **the `tricky` key** deep-equal to
section 6's; the teaser; a tom reads every line with he and him; no "borrow", "carry", "regroup", "moonrise", "nursery", "StarClan",
"Twoleg", "kittypet", "fresh-kill", "Thunderpath", "vigil", "warriors’ den", "whisker-length", "claw-length", "Reynard", "Snip",
"Snatch", "Harrumph" or "Spotted" in any line she reads; no line calls the marks a dot, a number or a count.

## 6. Engine needs

**One, the brief's: the Hollow's Tricky Counts.** No other engine line: the run is data on a story set (the kit's cross-table keys,
decision 56), the Spanish ask uses chapter 12's built prompt route, the sneeze's grumpy voice is a page speaker (two data lines), and
everything else is sets, lines, art and book keys. The save stays version 2. Chapters 1 to 13, the Warrior Counts and Count the store
play and draw byte-identical (fingerprints and goldens).

### The Hollow's Tricky Counts

**What it is.** A third kind of Hollow round, built by the engine from her log and run by the Counts page exactly as it is. Once a
finished chapter carries a `tricky` key (chapter 14's), the Hollow's shelf shows **Tricky Counts** between Count the store and One Count
at a time. A round is **eight Counts**: her hardest first (at most six, `E.warriorHard` as the round starts), then pairs she knows from
the 21 pairs of 3, 4, 6, 7, 8 and 9 (from the rest of the 54 if those run short); each asked in its anchor Count's words and picture (the kit's
cross-table branch of
`E.questionDef`), helped on the sand, can't fail, about a minute and a half; Chispapaw echoes the first right answer in Spanish; a full
round earns the next frost treasure. The grey tom asks (the chapter's data); chapter 20 hands it to Chispapaw with its own key and no
engine line (asking it in Spanish would be one, chapter 20's: below). It is the Hollow's round of eight, chosen by her; the chapter's story run is
five, as data (decision 56).

**The chapter's key** (data on the chapter object; chapter 14's, word for word, in the grey tom's voice: eager, a little sleepy,
dreading his own sitting, never a teacher's manner):

```js
tricky: {
  who: 'snorer',
  // the shelf's greeting once the button shows: Tallyheart's line (the shelf's speaker), naming the three
  greet: 'Count the store, Tricky Counts, or one Count at a time? A full round earns a treasure for your nest.',
  lines: {
    intro: 'Your tricky ones! I ask, you answer. It’s PRACTICE for my Warrior Counts.',
    praise: ['Yes!', '', 'You KNOW that one.', ''],
    fast: ['Fast! I’d still be counting.'],
    remembered: '{a} × {b}! That was a tricky one. Not now!',
    rememberedSlow: '{a} × {b}. Got it! Tricky ones get easier. I hope MINE do.',
    again: 'It came back, and you knew it!',
    miss: 'There. It’ll come back.',
    missLast: 'There. Now we both know it.',
    done: 'All eight! You’re ready. I’m… nearly ready.'
  }
}
```

**The engine** (`app/engine.js`, a section "chapter 14: the Hollow's Tricky Counts" after chapter 12's; about 60 lines):
- **Constants**: `E.TRICKY_ROUND = 8`; `E.TRICKY_MINE = 6` (her hard facts at most); `E.TRICKY_PAIRS` (the 21 pairs `[a, b]`, a ≤ b,
  of 3, 4, 6, 7, 8, 9); `E.TRICKY_LABEL = 'Tricky Counts'`; `E.TRICKY_LINE_KEYS = ['intro', 'praise', 'fast', 'remembered',
  'rememberedSlow', 'again', 'miss', 'missLast', 'done']`.
- **`E.trickyKey(cat, stories)`**: the `tricky` key of the latest finished chapter (by `number`) that has one, else null. Chapter 20's key,
  once she finishes it, replaces chapter 14's (the swap as data).
- **`E.trickyFacts(hard, round, stories)`** (pure, for the tests): the round's eight. `mine` = the first `E.TRICKY_MINE` of `hard` (as
  `E.warriorHard` gives them: misses first, then the slowest; each as last asked), each `{ a, b, hard: true, table:
  E.warriorAnchor(a, b, stories) }`, in that order (her hardest first). **The fill**, `need = 8 − mine.length` pairs, none on her
  hard list if it can be, in this exact draw order on one stream, `rnd = mulberry32(((round | 0) + 1) * 2654435761 ^ (21 * 40503))`
  (as `E.hollowFacts` seeds, 21 in the table's place):
  1. **the 21 known**: `E.TRICKY_PAIRS` (each `[a, b]` with a ≤ b, in order of a, then b: 3 × 3, 3 × 4, 3 × 6, … 9 × 9) not on her
     hard list at all, shuffled from the end as `E.hollowFacts` shuffles (`j = Math.floor(rnd() * (i + 1))`); the first `need` taken;
  2. **only if those run short, the other 33 known**: the rest of the 54 (`E.warriorPairs()` without 10 × 10 and without the 21,
     each `[a, b]` with a ≤ b, in `E.warriorPairs`' order) not on her hard list, shuffled the same way on the same stream (after
     step 1's shuffle), as many taken as still needed, after step 1's; each is still asked by `E.questionDef` in its anchor Count
     (the 1s, 2s, 5s or 10s);
  3. **only if still short**, her other hard pairs from the 21 (past the first six, in her order, each as `[smaller, larger]`)
     **before** steps 1 and 2's;
  4. then **each fill pair's order**, one draw each in fill order: `rnd() < 0.5` keeps `[a, b]`, else `[b, a]`.
  Each `{ a, b, table: anchor }`. No pair twice. So **the round as built ends on two pairs she knows whenever two of the 54 are off
  her hard list** (the brief's "every round ends on at least two she knows", made true whenever it can be). As built: a miss on
  the 6th Count puts its retry after them, and a miss on the 7th or 8th adds fillers and then the retry, so the tests check the
  ending on `E.trickyFacts`' output, never on a played round. (Run, prototyped: `probe3.txt`, 21,780 rounds over hard lists of 0 to
  54 pairs, three round numbers each: always eight, no pair twice, at most six of hers, every `table` a number; the last two off
  her list in every round where two of the 54 are; step 2 used in 2,346, step 3 only where fewer than two of the 54 are off her
  list. Hard 0, round 1, the seeded round the tests fix: 9 × 6, 8 × 3, 4 × 7, 6 × 6, 8 × 7, 7 × 9, 3 × 7, 3 × 3, each `table` by
  `E.warriorAnchor`. `probe2.js`, the first prototype, seeded with `^ 0x3c6ef372` and had no step 2: this text is the reference,
  not it.)
- **`E.trickyDef(cat, stories, opts)`** (`opts = opts || {}`: `renderHollow` calls it with two arguments): the round's set, from
  `E.trickyKey(cat, opts.stories || stories)` (or, with none, the fallback below, so a round picked up without its chapter still
  runs): `{ id: 'tricky', teacher: key.who, ask: '{a} ×
  {b}', ground: 'sand', warmHard: { table: 'all' } /* the marker E.questionDef reads: each question in its anchor's words, picture and
  help openings */, helpSays: 'tallyheart', helpCounter: 'you', intro, praise, fast, remembered, rememberedSlow, again, miss, missLast,
  done /* the key's lines */, echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }] } }`. **`helpSays:
  'tallyheart'`** (chapter 5's key): the help's first line, the anchor Count's own opening, is Tallyheart's (it is her sand, and her
  words since each Count's chapter); **`helpCounter: 'you'`**: she counts the sand herself. So the grey tom never teaches: he asks, cheers
  and says the miss line. (Run: "Four cats. How many lives?" asked by the grey tom; a miss of 9 × 4 with 39 opens "So close! You tucked ONE
  claw. Tuck one in for every cat." in Tallyheart's balloon, her own count, on the sand, then his "There. It’ll come back.")
  **The fallback, with no key** (no new words: every line is one the engine already says): `teacher: 'tallyheart'`; `praise:
  ['Yes!']`, `fast: []`, `miss: 'There. We’ll come back to that one.'` and `done: 'A full round! That deserves a treasure for your
  nest.'` (`E.hollowDef`'s own fallback lines, word for word); `remembered`, `rememberedSlow`, `again` and `missLast` unset (the
  engine's `E.counts.answer` defaults); `intro: ''` (never read: the button shows only with a key, and a round picked up says only
  the waiting line or nothing, so `trickyLesson` letters no empty balloon).
- **`E.trickyStart(cat, stories, now, opts)`** → `{ def, state }` (`opts = opts || {}`): `n` = `(isObj(cat.tricky) ?
  wholeNum(cat.tricky.rounds) : 0) + 1` (`takeRoundStart`'s form: never NaN for a `tricky` with no `rounds`); facts
  `E.trickyFacts(E.warriorHard(cat, S), n, S)`; `state = E.counts.start(def, { facts, set: 'tricky', mode: 'hollow', now })`, then
  `state.tricky = true` and `state.round = n`. The runner as it is: a miss gets the sand and comes back two questions on (fillers near the
  end); a round always finishes.
- **What it writes**: each answer goes into `counts` (the page's `E.logAnswer`, as every Hollow answer), `set: 'tricky'`, its anchor as
  `table` (run: the entry carries `table` because the question's differs from the state's null), so `E.warriorHard`, `E.hardFacts`, the
  One-Count page's tricky paws, the next chapter's warm-up and the grown-ups corner's per-Count tables read it (`E.tableOf` by `table`).
  `E.readFirst` is false for set `tricky` (no chapter has that set: run), so every answer is timed on itself: right and fast, a fact
  leaves her hard list; missed, it stays at the top. It sets a waiting Warrior Counts re-sit aside as any Hollow answer does
  (`warriorStale` reads `counts`). Nothing in `takes`.
- **`E.trickyFinish(cat, st)`**: once (`st.recorded`), and only for a finished round: `cat.tricky = { rounds, cleanRounds }` created if
  absent, `rounds` + 1, `cleanRounds` + 1 with no help, and `E.FROST_TREASURES[(rounds + 1) % E.FROST_TREASURES.length]` into `cat.nest`
  (in turn by its own rounds, as the store's are by `takes.rounds`, but two along: the store's round n gives `(n − 1) % 4`, so a first
  store round and a first Tricky round never give the same treasure, and the first two of each give all four). Returns `{ awarded, summary, rounds,
  clean }` (awarded null for a
  round not finished or recorded already). **Never** module 1's `E.TREASURES`, `hollow.rounds`, `byTable` or glow, never `takes.rounds`.
- **`E.recordLesson`**: **routes a Tricky state first** (after the Warrior Counts' branch, before the kit's): `if (st.tricky === true) {
  var tk = E.trickyFinish(cat, st); if (isObj(cat.lesson) && cat.lesson.state === st) cat.lesson = null; return { mode: 'tricky',
  summary: C.summary(st), hollow: null, tricky: tk }; }`. **Required**: unrouted, today's `E.recordLesson` sends a `mode: 'hollow'` state
  to `E.hollowFinish`, which awards module 1's moss and counts `byTable['1']` (run: `probe2.txt`). `E.settleLesson` reaches it the same
  way.
- **`E.hollowShelf`**: with `E.trickyKey(cat, S)`, `buttons` become `[{ id: 'store', label: 'Count the store' }, { id: 'tricky', label:
  E.TRICKY_LABEL }, { id: 'counts', label: 'One Count at a time' }, { id: 'nest', label: 'My nest' }]` and `greet` the key's `greet`
  (after a round, `opts.reward`, still `E.STORE_LINES.again`; while a sitting waits, its waiting line, as now); `friend` unchanged.
  Without a key, the kit's shelf word for word (chapters 12 and 13).
- **The save**: one new optional field on a cat, `tricky: { rounds, cleanRounds }`, absent until her first finished round (not in
  `E.blankCat`); `normCat` keeps her own key only, `{ rounds: wholeNum(…), cleanRounds: wholeNum(…) }`, idempotent, as `takes`; the save
  stays version 2. The round in the lesson slot is `{ mode: 'hollow', state }` (`okLesson` passes it: a Counts state with two extra keys);
  it gives way to a chapter lesson and comes back through `hollowWaiting` (`E.beginLesson`, `E.holdLesson`, `E.hollowRound`: untouched).
- **The guard** (`E.checkStory`): a `tricky` key only on a module 2 chapter; exactly `{ who, greet, lines }`; `who` a non-empty string;
  `greet` a line; `lines` only `E.TRICKY_LINE_KEYS`, `intro` and `done` required, each a line or a list of lines (`praise` and `fast` may
  hold `''` between lines), no `lang` and no `{es:…}` token (a Spanish asker's lines are chapter 20's to design: not a second feature
  here); and **no chapter's Counts set may be named `tricky`** (`E.readFirst` and `E.countsSet` would take such a set for the source
  of these entries). (Run: today an unguarded `tricky` key passes `E.checkStory`.)
- **Chapter 20's swap, and what it does not cover.** Handing the round to Chispapaw is data (`who: 'chispapaw'` in chapter 20's key),
  no engine line. With the round's echo fixed to Chispapaw and the guard keeping `lang` off the key, she then asks in English and
  echoes herself in Spanish (the chapter-20 fixture test pins exactly that, so chapter 20 sees it). **Asking the round in Spanish**
  (build.md's prompt route, "the Hollow's Tricky Counts once Chispapaw asks them") is **one engine line, chapter 20's to design**;
  docs/build.md's Chapter 14 section says so.

**The page** (`app/ui.js`; about 50 lines; `runLesson`, `go`, `onBack` and `startChapterLesson` untouched: `runLesson`'s and `go`'s
hashes are pinned in `tests/takes-ui.test.js`):
- **`renderShelf`**: with `SH.buttons` holding `tricky`, a third big button `#trickyBtn` between `#storeBtn` and `#countsBtn`, its icon
  the Warrior Counts' tricky paw (`<i class="trickypaw" aria-hidden="true">` + `ICON.paw`), its label `E.TRICKY_LABEL`. Its click: `var r =
  E.trickyStart(cat, stories(), now(), { stories: opts.stories }); E.holdLesson(cat); cat.lesson = { mode: 'hollow', state: r.state };
  persist(); trickyLesson(r.def, r.state, false, null);`. `currentSpeech` names the three buttons. **The paw's CSS**: index.html's
  `.counts-pick .btn .trickypaw{position:absolute;left:.3em;…}` (and its Aa rules, `html.big .counts-pick .btn .trickypaw` and
  `html.big .frame[data-kind="hollow"] .counts-pick .btn.big:has(.trickypaw){padding-left:1.3em}`) already reach the shelf, which is a
  `.counts-pick.tshelf` in the hollow frame; `.tshelf .btn.big` cuts the left padding to .6em (.3em on a phone held sideways), so the
  absolute 1.1em paw would sit over "Tricky Counts" when the button is narrow, where the store button's icon is inline. So the take
  block gains `.tshelf .btn .trickypaw{position:static;transform:none;width:1.2em;height:1.2em;margin:0 .15em 0 0}` (takes-ui's `own`
  pattern through `.tshelf`), and an `html.big .tshelf` twin if the Aa rules misplace it; each selector listed where
  `tests/takes-ui.test.js` lists the block's own. The three buttons fit at the page review's sizes (390 × 844, phone landscape under
  `TAKE_PHONE`, iPad both ways, Aa off and on); `repeat(auto-fit, minmax(210px, 1fr))` may wrap them two plus one, checked there.
- **`trickyLesson(def, st, resume, waiting)`**: `runLesson({ def, state: st, mode: 'hollow', intro: resume ? (waiting ? [{ who:
  'tallyheart', text: waiting }] : []) : (def.intro ? [{ who: def.teacher, text: def.intro }] : []), waitLine: resume ? (waiting ||
  null) : (def.intro || null), onDone: function (sum, rec) { trickyReward(def, rec && rec.tricky ? rec.tricky : { awarded: null });
  } })`: `hollowLesson`'s shape, **plus `waitLine`**. Why: question 1 is her hardest fact, asked under the grey tom's intro (13
  words, about 5.5 s by `wReadMs`, past `E.FAST_MS`' 4 s); with Read to me off the clock would start as the question is drawn, so
  question 1 would never be fast, stay hard, and (once her misses are cleared, `hardRule` sorting slow right answers longest first)
  come first again every round. `runLesson` already restarts the clock once the line would have been read and before she types
  (line 3889 on main: chapter lessons pass the Warrior Counts' waiting line, `storeLesson` its `waitLine`); `runLesson`'s hash is
  unchanged. (Module 1's Hollow needs none: it asks an easy fact first.)
- **`trickyReward(def, res)`**: `storeReward`'s shape (the tree insert, no mark and no glow; `data-mode="store-reward"`'s layout): the
  key's `done` in the asker's balloon (`who: def.teacher`, off the panel), the frost treasure, My nest (`#trickyNest`), "Another
  round" (`#againBtn`) → `go('hollow', { from: 'hub', reward: true })`, as `storeReward`'s `#storeNest` and `#againBtn`: never a
  fourth `id="nestBtn"` (`tests/aa-room.test.js` line 260 counts three).
- **`renderHollow`**: a branch for a Tricky round **before** the module 1 branch (after the store's): `else if (HL && HL.state.tricky ===
  true) { if (!E.counts.done(HL.state)) return trickyLesson(E.trickyDef(cat, stories()), HL.state, true, cat.warrior ?
  E.hollowLines(cat, stories(), { now: now() }).waiting : null); var trec = E.settleLesson(cat); persist(); if (trec && trec.tricky &&
  trec.tricky.awarded) return trickyReward(E.trickyDef(cat, stories()), trec.tricky); }` (the Hollow page rebuilds its def from the key).
- **Data lines**: `FLAG_WORDS.foundSalamander` (section 1); **`NAMES.harrumph = 'A grumpy voice'`** (module-2's label till chapter 17; the
  sneeze's speaker, never drawn), **`PITCH.harrumph` 0.5, `RATE.harrumph` 0.76** (low, slow, grumpy, an old she-badger's: Read to me
  only, never on the mini). **Never Sloshbank's 0.62 / 0.88**, nor near the old tom's 0.6 or Coil's 0.72 / 0.7: with Read to me,
  a voice behind the store that sounds like Sloshbank, the suspect who has just said "If I were a badger…" (f029), would plant a clue
  the story does not intend, and call 14 keeps this voice to chapter 17.
- **The grown-ups corner** (`openGrownups`, after the Count the store clause): `if (isObj(c.tricky)) hollowTxt += '; Tricky Counts '
  + n(c.tricky.rounds) + ' (' + n(c.tricky.cleanRounds) + ' without help)'` (the Count the store clause's form, "Count the store 3 (2
  without help)"), so Aron can see whether she uses the round while its frost treasures fill her nest; the only reader of
  `cleanRounds`. No cat of chapters 1 to 13 has `tricky`, so every corner of theirs reads as it does (call 30).
- **`PC.debug.tricky(what)`** (`'shelf'`, `'q'`, `'help'`, `'reward'`), beside `PC.debug.takes`: the screens on the cat on screen, by
  `PC.debug.spanish('echo')`'s method: `runLesson` in mode `'debug'`, the cat cloned before and put back after, then `persist()`, so
  nothing is kept (`'help'` submits a wrong answer and shows the sand at once, as `PC.debug.warrior('sand')`'s `quickHelp`). The key is
  `PC.story.ch14.tricky` when it exists, and only before then an inline copy of this section's key on a stub chapter (never
  registered), as `spanishDebug`'s `setOf` reads `PC.story.ch12`'s sets first. **`tools/shots.mjs`**' `tricky:shelf`, `tricky:q`,
  `tricky:help`, `tricky:reward` and **`dev/webkit/run.mjs`**' screens list (the `spanish` job's shape), so the page review measures
  them: the tricky targets in an object of their own, `TAKE_TARGETS` and the existing dispatch prefixes unchanged, and no existing
  job in `measureJobs` changed (`tests/takes-tools.test.js` pins regexes on shots.mjs' dispatch lines and `TAKE_TARGETS`' keys,
  `tests/render-tools.test.js` pins run.mjs).

**Bounds.** No new interaction, picture, help, log or slip; no Spanish ask (call 12); on the grown-ups corner one clause, only for a
cat with `tricky` (above; call 30): its answers land in each Count's table as before. Chapters 1 to 13, the Warrior Counts and Count the
store play and draw byte-identical. **The kit's and chapter 12's pins it may move, each with a chapter-14 comment, and only these**:
`tests/takes-engine.test.js` test 12's shelf deep-equal and `E.STORE_LINES.greet` pin, **only if** its stories carry a `tricky` key (its
`ALL` is chapters 1 to 11 and the stub list: they do not, so it stands); `tests/takes-ui.test.js`' `renderHollow` and `renderShelf`
substrings (lines 684 to 697 on main: kept as they are by writing around them) and its take block's selector list (the `.tshelf` paw
rule above); `tests/book2-ui.test.js`' `#countsBtn` line (line 131: kept). **Files it never edits, writing around their pins**:
`tests/spanish.test.js` (the cats owner's; its `renderShelf` friend substrings, line 556, kept as they are), `tests/takes-tools.test.js`
and `tests/render-tools.test.js` (nobody's: the tricky targets go in an object of their own, `TAKE_TARGETS` and the existing dispatch
prefixes stay as they are, and no existing job in `measureJobs` changes). **About 60 engine lines, 50 page lines and 90 tests**, in a
new `tests/tricky.test.js` (inline fixtures, as `tests/spanish.test.js`): the picks on made-up logs with none, one, six and twelve hard
facts, and **the short fill** on three more: six misses outside the 21 then 20 of the 21 slow but right, then all 21 slow but right,
then every one of the 54 hard (eight Counts, no pair twice, the order: hers, the other hard ones, the known ones last; the last two off
her list whenever two of the 54 are; step 2's pairs asked in their anchor Count); the fill seeded and distinct, **one seeded round
fixed** (hard 0, round 1: 9 × 6, 8 × 3, 4 × 7, 6 × 6, 8 × 7, 7 × 9, 3 × 7, 3 × 3), the ending checked on `E.trickyFacts`' output; every
question a numeric `table` asked by `E.questionDef` in its anchor's words; the help opened by Tallyheart and counted by her; answers
read back by `E.warriorHard` (a pick right and fast leaves the list); **question 1 timed from when the intro would have been read**
(`trickyLesson` passes `waitLine`; a picked-up round the waiting line or none); `E.trickyFinish` once, the frost treasure by its own
rounds and two along from the store's (a first store round and a first Tricky round give different treasures), module 1's treasures,
`hollow`, `byTable` and the store's `takes.rounds` untouched; `E.trickyStart` on a `tricky` with no `rounds` (round 1, never NaN);
`E.recordLesson` and `E.settleLesson` routed; pick-up and give-way through the slot; the fallback def with no key (its words as above);
the shelf with and without the key (buttons, greeting, the reward line, a waiting sitting); chapter 20's swap as data (a fixture
chapter 20 with `who: 'chispapaw'`: its asker, and the echo still Chispapaw's, in Spanish, after an English ask); `normCat` and
`E.migrate` idempotent with and without `tricky`; the guard's errors (a Counts set named `tricky` among them); the corner's clause with
and without `tricky`; the page's wiring in Node (the button, `trickyLesson` and its `waitLine`, `trickyReward`'s ids, `renderHollow`'s
branch).

### The Spanish question (call 12)

The salamander's ask **uses chapter 12's Counts prompt balloon** (`lang: 'es'` on a fact's `prompt`, built and guarded on main: build.md's
"A Counts prompt asked in Spanish"), with **the frame keeping its own balloon** and **`intro: false`**. Why: the first ask is identical to the
frame route the story was written on (the frame's whisper, then on the Counts page «¿Seis por nueve?» with its gloss, the blink, 6 × 9 = ?),
but **a retry asks in Spanish again** ("Here’s that one again." then the ask and the blink: `retryPrompt: true`) and **a lesson picked up
asks it again**, where the frame route would give a retry the blink alone and a picked-up lesson no question at all (`lessonIntro` skips the
frame's balloons on a resume). The story's words do not change (the brief: "the spec may move the salamander's ask into its prompt with no
story change"); its italic note "(no `intro: false`)" is superseded (section 7, item 2). The prompt writes the pair out,
`'¿{Es:6} {es:por} {es:9}?'`, the same string as f035's balloon (a one-fact set needs no `{Es:a}`): `tools/storyboard.mjs` passes no
`{ a, b }` for a fact's prompt (chapter 12 never used the prompt route), so `{Es:a}` would ship raw in `docs/storyboard/ch14.md`
(confirmed on a stub); `E.checkSpanish` and `E.promptLines` take the literal form the same (`probe4.txt`). A pick unknown when the
chapter is written (chapter 21's ferry, a Spanish-asked warm-up pick) needs `{Es:a}`, and storyboard.mjs then needs the fact's
`{ a, b }`: that chapter's. **Chapter 12's frame route is still used**, for the chapter's other whole Spanish lines (f009's
«¡Desagrupo!», f061's «¡Salud!», and f035's own balloon). No new key, no engine line.

### Checks before the build (the orchestrator's, on main once chapters 12 and 13 are in)

1. **The Spanish ask on the prompt route**, once the story builder has landed: each target with `DRY=1`, run once with `VOICES=none`
   and once with `VOICES=es`, the test cat's `finished` through `ch13` (`ch14:f035` alone opens the frame, its own whispered balloon and
   "Let's count!", never the Counts page, so it would pass without using the prompt route). **First ask**: `ch14:f035@nextBtn`: the
   lullaby's Counts page opens on «¿Seis por nueve?» with "(Six times nine?)" under it, then "The salamander blinks.". **Pick-up**:
   `CAT='{…,"lesson":{"chapter":"ch14","frame":"f035","answers":[]}}' … ch14:f035`: the same ask again. **Retry**: the same `CAT` with
   `"answers":[55]`: "Here’s that one again.", the ask, then the blink. **The run's echo**: `CAT='{…,"lesson":{"chapter":"ch14",
   "frame":"f054","answers":[36,27,32]}}' … ch14:f054@keys=3,5,ok`: «¡Cinco por siete, treinta y cinco!» whispered (a test cat with an
   empty Counts log, so the set's own five). **The warm-up's echo**: `CAT` with its lesson at `f006`, `"answers":[]`, then
   `ch14:f006@keys=7,2,ok`: «¡Ocho por nueve, setenta y dos!» out loud. In every list: no row pairs Spanish text with an English voice;
   with no Spanish voice the gloss is said. The 462 − 135 echo stays in Node (shots' `lesson` recipe answers Counts sets only). Before
   that, in Node: `E.promptLines` on the set (section 5's test). If it fails, chapter 12's build departed from its build.md section, and
   the fix is chapter 12's.
2. **The kit's cross-table keys on the run** (the brief's check (2), with v1.1's data): `node
   ~/potomac-crossing-work/ch14/spec-writer/probe.js` on main after chapter 13: section 4 of `probe.txt` clean (151,741 cases, no pair twice,
   no pick on 3 × 7, 5 × 7 or 10 × 8, every question a numeric `table`, places 3 and 4 always 5 × 7 and 10 × 8). The brief's own `check.txt`
   still describes v1's eight-place run (section 10). The warm-up with its widened `avoid`: `node
   ~/potomac-crossing-work/ch14/spec-editor/probe3.js` (2,917 cases clean, with and without the kit's third cut).
3. **The moon at 19 on the bridge by night**: the sets owner's acceptance (section 4), looked at by the orchestrator before the story
   builder starts.
4. **Chapter 13's words and art are in** (`PC.words.es.desagrupo`, the den's `collar`, `curl` with `tailUp`, the quick marks' `crossed` and
   `fresh`, the Hollow's `spreadMarks` box, the camp's `frost`): chapter 14 uses each as chapter 13's spec defines it.
5. **The kit v0.4 merged** (chapter 13's spec, section 6, check 4).

`E.VERSION` `'0.14.0 (chapter 14, <ship date>)'` and its pin are the orchestrator's, at the ship.

## 7. Known issues the text critics left

Checked against Draft v0.4. The text took two critique rounds (v0.2, v0.3) and a verify round (v0.4). Every low in `critique-known.json`
(rounds 1 and 2) and `critique-verify.json` ('known', the verify round's) is applied in v0.4 or is an item here; the editors' notes
(`editor-r1/`, `editor-r2/`, `editor-v0.4/`: there is no `editor-r3`; `editor-v0.4` is the third round's) are carried. What is still true
of v0.4, and how the build handles it:

1. **The story is final at Draft v0.4.** No word of it changes for the build.
2. **The story's notes this spec supersedes or settles** (she reads none of them):
   - *the salamander's frame "(no `intro: false`)"*: f035 takes `intro: false` and the ask is the fact's own prompt too (section 6, "The
     Spanish question"); the first ask reads the same.
   - *"the set echoes its answer"* and *"After her right answer, the set's echo"*: the lullaby's `echo` key, never a second balloon of its
     `right` line (the verify round's low 7; chapter 12's guard keeps `lang` off a `right` line).
   - *"its set's words `unit: 'watch', units: 'watches', thing: 'guard', things: 'guards'`; … a set's `helpIntro` could name the
     watches"*: section 2's `ch14-watches`, with `helpIntro` "Close. Three guards a watch. Let’s hop it together." (the maths-2 low 9: the
     help itself names no unit; the retry's generic question does).
   - *"the spec picks `ground`"*: the run's `ground: 'earth'` (the earth by the store: "Tallyheart smooths a patch of earth").
   - *"the spec's `alt`s for 3 × 9 and 4 × 8"*: 6 × 6, then 9 × 9 (section 2).
   - *"the made warm-up is cut by decision 56"* and *"586 − 231 is cut"*: neither is in the sets. `docs/take-aways.md` section 3's table and
     `tests/fixtures/takes-stub.js`' chapter 14 still list both (editor-r1's note): take the brief; the stub fixture is the kit's tests', not
     served.
   - *"Spanish … the frame balloons"*: the bare capital token (`{Es:desagrupo}`, `{Es:salud}`), the echoes `'¡{Es:fact}!'` and
     `'¡{Es:answer}!'` (editor-r1's Spanish note).
3. **Chapters 1 to 13, the Warrior Counts and the kit's pages draw and read byte for byte** for every live save: every new option is off by
   default (`holes`, `spot`, `tap: 'holes'`, `spread3`, `moon` and `frost` on `store`, `frost` and `trail` on `bank`, `badger` on `print`), the
   `holes` and `store-close` cameras and the `stone` composition are new names, `store` at `night` was drawn by no frame before, `salamander` is a new id,
   `necklace`, `tap: 'pebble'` and `fluff` were drawn by no frame before. **The proof**: the existing fingerprints and goldens; the sets
   owner's **`<ch14-fingerprint>`**, recorded from a snapshot of main before any edit, in a process of its own: every frame of chapter 13,
   every `title` camera with the new options off, every `hollow` camera with `spread3` off, every `bridge` camera with the new options off and
   `store` at every time of day chapter 12 drew; the cats owner's fingerprints of every existing cast member and pose untouched.
4. **Can't be built literally, built nearly**: "your tail goes flat as a stick. Hers goes flat… then pops back up" (f005: the page turns;
   not drawn); "the pebble close up, grey and plain" (f022: the pebble plain on his chest at `meet`, no close camera); "four ears swivel to
   the back of the store" (f059: cats face left or right; not drawn); "the stones of the Old Bridge hum" (f060: said; the panel does not
   shake: `shake` is not in the story's vocabulary, build.md's art table); "you fluff up … she looks like a dandelion" (f048 with `fluff`, or
   plain if dropped); "the big stretch from your Warrior Counts" (f054: `crouch` with `tailUp`, chapter 12's stretch); "front paws out, tail
   up" for the grey tom (f075: the same); "the BIGGEST yawn of your life" (f078: the page turns); "one eye opens" (the grey tom's whispered
   Morning: f075 shows him stretching); "nose to tail, warm and safe" (f082: the page turns; f083 draws her curled); "From the top of the
   wall" (a climber's caption; our cat stays on the ground, chapter 12's hedge-top precedent); "pops back out of the reeds and points" (the
   young tom's balloon from off the panel: no cast entry can show by flag); "Tallyheart pads by" and "She pads off" (`walk` at `way-in`; gone
   on f056); *Sniff.* between the two thank-yous (an `sfx` has no place in the reading order).
5. **The salamander's lullaby is drawn in the 9s' picture** (six cats, nine lives each), not salamanders: no new Counts art (the brief). Kept.
6. **"Tallyheart pads past your nest." is lettered** (f080) though the picture shows her passing: the story's words kept (chapter 13 left its
   tag "on her way past your nest" unlettered; this one is a sentence of its own).
7. **The run's `remembered` lines are plain balloons**, not whispers (the page letters a set's line with no `kind`): "whispers Tallyheart" is
   a tag. Kept; a `kind` there would be an engine line, never a second feature.
8. **A missed pick's comeback can follow the run's echoed pairs** (the maths-2 low 10): a missed third pick returns after 10 × 8; a miss at
   10 × 8 brings 5 × 7 back as a filler (whispered again), then 10 × 8's retry. **Accepted**: the story's note says so, no line depends on the
   order, and Chispapaw whispering 5 × 7 twice is spaced practice.
9. **The warm-up's two 3s in a row**: picks 4 × 4 then 3 × 8 ask 4 × 4, 3 × 8, 3 × 6 (1 of 2,917 cases, picks 4 × 4 then 3 × 8 in that
   order: picks 3 × 8 then 4 × 4 ask 3 × 8, 4 × 4, 3 × 6; editor-v0.4's corner, rerun in `probe3.txt`); and a pick of hers with a 3 can
   stand next to 3 × 8. Accepted (her picks are hers; the alt order keeps the set's own clear otherwise).
10. **640 − 218's tap line over an empty loose zone** says "Not enough loose. Spread a row: tap it." (the kit's `E.TAKE_LINES.tap` has no Zero
    form: chapter 13's item 16). If the integrator adds `tap.onesZero` ("No loose. Spread a row: tap it."), it applies here with no change;
    otherwise accepted ("not enough loose" is true of none). **Closed by the kit v0.4**: 640 − 218 says "No loose. Spread a row: tap it."
11. **The lullaby's right lines need a right answer** (`rightAgain` covers a retry; `E.MAX_REQUEUE` 2, so up to three asks): a cat who
    misses all three asks hears no "Fifty-four." and no echo (missed twice and right on the third, she hears both); f036 draws it asleep
    and the scene ends as written.
12. **The warm-up's echo needs a right answer** (chapter 12's item 7); **the lesson's echo** comes right or helped. Kept.
13. **"What Read to me says for 'c-cold'"** (the verify round's low 8): v0.4 reads "I’m not cold." (editor-v0.4's item 7), no stutter
    anywhere; checked in Node: `E.fill` and `E.sayAs` leave it as written. Closed.
14. **The first take prompt** (the maths low 8): v0.4 frames 352 against the morning's 245 with **"Pretend the store holds three hundred
    fifty-two."** (seven words; chapter 13's call 10's word), so a lesson picked up or "Count them again" never says the store holds 352. The
    spec uses v0.4's line, not the critic's "Say the store holds…". Closed.
15. **The maths' share at the top**, with decision 57's moves (the kit v0.4's design, section 6, at its deliberately long rates; the maths 5.87 /
    7.08 / 8.30 minutes): 26.7 / 30.6 / 34.0%; 33.3% after the kit's last cut (the warm-up's third Count), a third exactly (32.9% at the parts'
    rate); with a warm-up miss at place 1, 36.0%, and 35.3% after the cut. No cut is left that keeps the kit's rules and decision 57's mechanics
    (768 − 315 is the set's one `none`). **The orchestrator's call** on the design's question 2 (2026-11-09, under decision 46): decision 56's
    third binds the plain path at the middle-to-slow rates (30.6% at the middle; 33.3% at the top, the kit's last cut played as decision 56's
    method plays its cuts, if play drags); a reading with a miss and its help may run a little over (the warm-up miss's 35.3%). The move times
    are measured again from her log (each move's ms, `moves`) after she plays chapter 13, and these figures are redone from them before
    chapter 14 ships. The build makes no cut.
16. **The brief's leftovers** (the verify round's lows 4 and 12; editor-v0.4's list): steering call 12 still says "six of nineteen" (it is
    four of fourteen, five of fifteen); its line 141's "so they always end the run" holds for her first asks only (item 8); check (2) and
    `check.txt` describe v1's eight-place run; the brief gives no warm-up `alt` (this spec's: 4 × 4, then 3 × 6) and its warm-up passes over
    3 × 7 only (this spec's also over 5 × 7 and 10 × 8, call 5); its Tricky fill takes "the rest from the 21" only (this spec's adds the
    other 33 when the 21 run short, call 11) and puts "nothing new on the grown-ups corner" (this spec's one clause, call 30). The
    orchestrator's (section 10); nothing in the build depends on them.
17. **If decision 54 is reversed** (Tallyheart leads the watch), the screens that change are f041 ("Take your apprentice."), f064 and f065a
    ("Chispapaw looks at you. So you sit up tall, the way Tallyheart does."), and the recap's sixth line.
18. **The watch on one place** (the continuity critic's medium): f043 to f069 are 27 panels at the store. The store's four spots span the panel, so no
    crop holds the whole cast closer; `store-close` (section 4) takes the nine frames that are our cat's and Chispapaw's alone (f053, "The moon
    climbs.", stays wide), and the longest run on one camera is then ten (f048 to f057). **If the sets owner drops `store-close`** (it does not read),
    the run stays on `store` and is accepted: the cast changes carry it (Tallyheart arriving and going, the grey tom's `loaf`, `curl`, `crouch` and
    `sit`, the fluff, the night turning to first light), the two choices and the run's Counts page break it, and the story test's shots check (chapter
    12's 13) names f043 to f069 as its one exception rather than relabelling boards over the same picture.
19. **The storyboard's warm-up echo sample**: `tools/storyboard.mjs` prints an `on: 'first'` echo with its fixed sample pair (7 × 8), a
    pair chapter 14 never asks; chapter 12's storyboard prints the same and is pinned byte for byte, so the sample stays. The run's echo
    line is fixed (section 10: each listed pair's line, and "whispering"). Accepted.

## 8. What chapter 15 inherits

- **When.** Chapter 14 is days 4 and 5: day 3 off screen ("Two frosty days later"); day 4 the store at 245 in the morning, the Hollow, the
  wall's end at midday, sunset at the fountain, the first night watch under the moon at 19 (waning, rising late; drawn on the store by night
  and pale at first light); day 5's first light, the report, and **she slept the morning** in her warrior's nest. Chapter 15 starts on day 5 or
  later; the moon by module-2's clock (day 13 the new moon).
- **The store.** **245** (said on day 4, at the morning count and at first light: "Every piece."); her book draws 245. Glintstar's watches: three
  guards a night for seven nights; **the first was hers**, with Chispapaw and the grey tom (the grey tom slept through it); six to come
  (chapter 6's and 11's watches stand).
- **The badger, heard only.** From behind the store: a snuffle, a sneeze so big the stones of the Old Bridge hum, the grey tom's sleeping "Bless
  you.", Chispapaw's «¡Salud!», and a grumpy voice: "Thank you." *Sniff.* "And thank YOU." (one for each; never "BOTH", chapter 17's).
  **Nothing seen**: no shape, shadow or eyes. At first light, in the frost behind the store, **big prints, five toes in a row, going along the
  bank, away downriver, toward the Holt**; a cat's print shows four (the fifth claw sits high); not Sprinkle's (far bigger, and she is home). The
  badger page: `size` gains "As big as a DOG!" (the young ReedClan tom); nothing new under *I saw*. Told to Glintstar ("A watch that watched.
  Well kept, warrior."), "ONE" sneeze to Tallyheart.
- **ReedClan.** Holes in ReedClan's bank, across the little water at the wall's end, and beside them **two long lines and three little pokes**:
  seen by her, Chispapaw and {Murmur}chime, told to Glintstar as "scratches" (the grey tom heard), **never read, never told to Tallyheart**,
  never called a dot, a number or a count. The young ReedClan tom's badger-proof pebble on a string (two weasels, unnamed and unseen, sold it for
  one mouse; it is very ordinary), his rumour "As big as a DOG!" (he never saw it). Sloshbank's boast (ReedClan's store 473, two hundred
  twenty-eight more) and his suspicion: "A store by the river smells like supper. If I were a badger…" (module-2's red herring). ReedClan does not
  like holes.
- **Tallyheart's ear**, told to her and Chispapaw (the grey tom snored): long ago a fox came sniffing round the kits' den; young Tallyheart chased
  him off; the fox got away without a scratch; she was counting his pawsteps, got to forty-three, and a bramble got her ear. "Don't tell anyone."
  Not in her book. The fox is never named.
- **Chispapaw.** Her word at a spread now, «¡Desagrupo!», said out loud in the Hollow; «¡Salud!» is what her Tall Ones say at a sneeze; her little
  Tall One sighs at take-aways every night ("Not ME."; chapter 18 pays it) and chants the Counts. Amazed, never scared; she stayed up "FOREVER" and
  fell asleep sitting bolt upright. `collar: false`. Sneezes in her sleep; the grey tom says bless you.
- **The grey tom** (unnamed, "Snoring apprentice"): slept through the whole watch, said bless you in his sleep, "I’m very polite. Even asleep.";
  his Warrior Counts are coming; **he will ask her tricky ones, for practice** (the Hollow's Tricky Counts, his until chapter 20).
- **The maths.** `ones` learned (`E.takeSteps`: `none`, `ones2`, `ones`): spread a row, three digits; the squares can wait; Count the store's rounds
  take it. Till chapter 15 no hundreds line speaks of spreading a square (rule (a)): a slip at a hundreds column that would spread one is logged
  `fact`. **The Hollow's Tricky Counts** are open once chapter 14 is finished (her hardest first, the grey tom asking, a frost treasure a round:
  `cat.tricky`; on the grown-ups corner's Training Hollow line). Counts: none new; the warm-up across the 54 pairs (third time, passing over
  3 × 7, 5 × 7 and 10 × 8) and the first Tricky Counts run (five, Tallyheart asking at the
  store, its picks passing over 3 × 7, 5 × 7 and 10 × 8, Chispapaw whispering the last two); 3 × 7 (watches); 6 × 9 optional. The take answers of
  the chapter are its lesson twins' `avoid`.
- **The moves** (decision 57): a square's link is new in chapter 15, so 418 − 162's `'tap'` asks every number; her marks are `cat.takes.style`.
- **Spanish.** `PC.words.es` gains `salud` ('¡Salud!', Bless you!). Out loud in the Hollow, none in front of ReedClan, whispered at night and at the
  stone. **A Count asked in Spanish** for the first time (the salamander's, on chapter 12's prompt route, its pair written out,
  `'¿{Es:6} {es:por} {es:9}?'`): later chapters (chapter 21's ferry, module-2's Spanish-asked warm-up picks) ask the same way, with
  `'¿{Es:a} {es:por} {es:b}?'` for a pair unknown when written (and `tools/storyboard.mjs` then passing the fact's `{ a, b }`); chapter
  20's Tricky Counts asked in Spanish is one engine line, chapter 20's (section 6).
- **The salamander** (`foundSalamander`): asleep under the last stone at the wall's end, smiling, its stone tucked back; "See you at blossom-time."
  The second of the seven sleepers' pages (`book.sleeper` id `salamander`). Chapter 20 may offer a missed sleeper once more.
- **Who is where.** She asleep in her warrior's nest (the mist stone grey on the moss, Riffle's stone where she put it); Chispapaw and the grey tom
  in the apprentices' den, by day. Riffle not seen since chapter 13. The teaser: Chapter 15, The Holt: Riffle's home, an invitation.
- **Drawn now** (copy into continuity's places table at ship): the `bridge` set's `store` by `night` (moonlit, silver) and by `morning`, `moon: n` and
  `frost` on `store`, the `store-close` camera (the two at the store; if kept), `frost` and `trail` on `bank`, `badger` on `print` (the print
  redrawn outside on the frosted bank); the `title` set's `holes` (the little water, the holes, the marks), `spot`,
  `tap: 'holes'`, the `holes` camera, the `stone` composition with its spots `stone-1` to `stone-3` and `nook`; the hollow's `spread3`; the salamander
  (`curl`, `blink`, `sleep`, `point`; `SIZE_BAND` against our cat's head); `necklace` and `tap: 'pebble'`; `fluff` (if kept).
- **Words on screen now**: the night watch, a watch of three, the first watch, "A watch watches. Nobody goes looking.", the wall's end, the little
  water, holes, "two long lines and three little pokes", badger-proof, a pebble on a string, as big as a dog, the kits' den, a bramble, a sneeze,
  "Bless you", "a grumpy voice", the tricky ones, Tricky Counts, five toes in a row, first light, blossom-time; «¡Salud!». Not used: borrow, carry,
  regroup, moonrise, nursery, vigil, StarClan, Twoleg, kittypet, fresh-kill, Thunderpath, warriors' den, whisker-length, claw-length.
- **Standing rules, still**: chapter 13's, and: the badger is heard only until chapter 17 (no shape, no silhouette); nothing at night is dark; the
  marks are never read before chapter 16; no CrystalClan paw on ReedClan's mud.
- **Flags**: `foundSalamander` (sticky). Every earlier flag stands.

## 9. Calls made

1. **One engine feature, the Hollow's Tricky Counts, designed whole in section 6; nothing else.** Reason: the brief and module-2's engine table; the
   run is the kit's data, the Spanish ask chapter 12's built route, the grumpy voice two page data lines.
2. **The run is a story set on the kit's `warmHard: { table: 'all', at: [0, 1, 2] }`, with `avoid: [[3, 7], [5, 7], [10, 8]]`.** Reason: decision 56
   (five, data on a story set); the widened avoid keeps the echoed pairs off her picks, so Chispapaw never whispers a pick (the round-1 critics, now
   the brief's v1.1).
3. **The run's alts are 6 × 6, then 9 × 9.** Reason: the story asked for alts; 6 × 6 (the set's own first, replaced whenever an alt is wanted) shares
   no number with 3 × 9, 4 × 8 or 5 × 7, so the set's own and its alts never sit beside a shared number; 9 × 9 (new answer 81) only when 6 × 6 is a
   pick. Run over every case.
4. **The run's help is on the earth** (`ground: 'earth'`). Reason: "Tallyheart smooths a patch of earth with her paw" and the brief's "the spec picks
   `ground`"; the kit's cross-table branch keeps a set's `ground`.
5. **The warm-up's `alt` is 4 × 4, then 3 × 6** (the story's call 13), **its `avoid` 3 × 7, 5 × 7 and 10 × 8**. Reason: no two 3s in a row but in
   one corner (1 of 2,917); 16 and 18 new to the chapter; the avoid is chapter 13's rule (the warm-up passes over every pair asked on every path, so
   no pair twice in a reading and the run's "two she knows" never her morning's hardest). Rerun: `probe3.txt`.
6. **The salamander's ask is the fact's prompt (chapter 12's prompt route), the frame keeping its balloon, `intro: false`.** Reason: a retry and a
   pick-up ask in Spanish again; the first ask is the same; the brief allows it with no story change (section 6).
7. **The lullaby is drawn in the 9s' picture with the 9s' help openings in {Murmur}chime's voice, on the earth.** Reason: no new Counts art; 6 × 9's
   anchor is the 9s; Chispapaw never corrects her (the brief).
8. **3 × 7's help names the watches through `helpIntro`, in Glintstar's voice, on the camp's earth.** Reason: the story's note offered it; Tallyheart
   is not at the fountain.
9. **The wall's take is {Murmur}chime's (`teacher`), with `lines: { missLast }` keeping the number when helped, and Sloshbank's *Drip.* a caption in
   its right lines.** Reason: the story's call 10; the maths-2 low 14; the take page letters captions.
10. **The Tricky round: the grey tom asks and cheers, Tallyheart opens the help (`helpSays`) and she counts it herself (`helpCounter: 'you'`).**
    Reason: the brief's "never a teacher's manner (the help is the sand's, in the kit's words)"; the Hollow is Tallyheart's sand.
11. **The round's fill is the 21 pairs off her hard list first, then (only if those run short) the other 33 of the 54 off it, then (only if still
    short) her other hard pairs from the 21, before them; the draw order fixed in section 6.** Reason: the brief's "every round ends on at least two
    she knows", made true whenever two of the 54 are off her list (an 8-year-old can be slow on 20 or 21 of the 21: "hard" includes a right answer
    past 4 s); prototyped over 21,780 rounds (`probe3.txt`). The 21 come first, as the brief has it.
12. **The frost treasure goes in turn by the Tricky round's own count** (`cat.tricky.rounds`), **two along from the store's** (`(rounds + 1) % 4`).
    Reason: the brief ("in turn by its own rounds"); the store's count stays the store's; a first store round and a first Tricky round no longer
    both give "A frosted leaf".
13. **The shelf's greeting with the button is Tallyheart's, from the chapter's key; the button's icon is the Warrior Counts' tricky paw, inline on
    the shelf (one `.tshelf` rule).** Reason: the shelf's speaker is pinned as Tallyheart; chapter 20 can rewrite the greeting with no engine line; no
    new icon art; the paw's absolute rule would sit over the label on a narrow button.
14. **The grumpy voice is speaker id `harrumph`, labelled "A grumpy voice"** (page `NAMES` and every balloon's `name`), **pitch 0.5, rate 0.76**.
    Reason: module-2's label till chapter 17; one id from now on keeps her voice the same when chapter 17 draws her; "Harrumph" is never on screen
    before then; the voice clearly apart from Sloshbank's (0.62 / 0.88), so Read to me plants no clue against the suspect.
15. **The prints are on the `bridge` set's `bank` camera by first light (`frost`, `trail`) and close on its `print` camera (`badger`); no new "back"
    composition; `badger` redraws the print camera's picture outside, on the frosted bank at dawn.** Reason: the brief's "if the sets owner draws it
    now" left it open; the bank behind the bridge is where a trail "goes along the bank, away downriver", and a print in the frost needs the existing
    close camera only (its under-bridge picture, deck, dark, drips and drag marks, would put frost under the bridge between two open-bank frames);
    chapters 19 and 20 draw the back when someone is seen there.
16. **The store camera takes `night` and `moon: n` and `frost`.** Reason: the brief's one budgeted night (moonlit and silver, never dark, the moon at 19,
    its clamps raised only there); the morning frost says "sparkles white" with no new place.
17. **The little water is drawn with the holes, one option `holes`, plus `spot` for the yellow spot under the line stone; the water a narrow rill a
    hop across, every spot unchanged; the holes right of the ReedClan spots.** Reason: the story's "on his own side of the little water" and "Across
    the water"; chapter 6's and 9's wall's end has no water, and every chapter 14 frame there needs it; the two sides' boxes are 20 and 47 units apart
    (measured), so a channel a cat's length across would move the spots (and push the young tom off `meet`); holes behind the ReedClan bodies would be
    hidden.
18. **A close camera `holes` and a composition `stone`.** Reason: the marks must be countable at 390 × 844 and the salamander's eye and smile readable,
    which `end` and `meet` cannot give (chapter 13's `dig` and `marks` precedent: a composition is not a place).
19. **The marks are the kit's quick picture on mud, `{ tens: 2, ones: 3, ground: 'mud' }`.** Reason: module-2's amendment 2 and the brief; mud is a ground
    the kit draws.
20. **`spread3` beside chapter 13's `spreadMarks`**, the same three states for 352. Reason: chapter 13's option is fixed to forty-three; a new name keeps
    its frames byte for byte.
21. **`necklace` and `tap: 'pebble'` for the young tom; `fluff` for the puffed-up Tap, dropped if it does not read.** Reason: the brief's pebble on a
    string; the fluff Tap's answer is the chapter's one picture joke at night, cheap on `sit` only.
22. **Tallyheart's ear is kept out of her book.** Reason: "Don't tell anyone." Her book keeps what a warrior may write down.
23. **The book page in eight lines (seven plain), English only, the store at 245, the badger line on `size`, the salamander's sleeper page.** Reason:
    chapters 12 and 13's shape; the brief's call 14.
24. **f001 is the title panel alone; captions first throughout, with the splits named in section 5.** Reason: chapters 12 and 13's rule; the words never
    change.
25. **"Tallyheart pads past your nest." is lettered (f080), on a frame of its own after the nest's captions.** Reason: no panel of five boxes, and every
    word of the story kept.
26. **The morning report and her nest are two frames (f077 at the camp, f078 in her nest).** Reason: two places on one screen (chapter 13's verify-round
    precedent).
27. **The sneeze is not drawn as a shake.** Reason: `shake` is not in the story's vocabulary (build.md: the UI adds it itself for a thunderclap); the
    `sfx` and its `sfxRead` carry it.
28. **Three owners: engine (with the page and tools), cats (with the words and the storyboard), sets (scenes.js and bridge.js).** Reason: section 10;
    fewer owners, disjoint files.
29. **Decisions 53 to 56 bind it** (the maths and the Spanish friend; her own apprentice; her word for a spread; the maths about a quarter, the run
    five). Recorded in the README with these calls.
30. **The grown-ups corner gains one clause for a cat with `tricky`: "Tricky Counts n (m without help)" on the Training Hollow line.** This reverses
    the brief's "nothing new on the grown-ups corner" (a Claude call). Reason: the save keeps `cleanRounds` and nothing else read it; with the round's
    frost treasures filling her nest and its answers spread over the Counts' tables, Aron could not see whether she uses the round. No cat of
    chapters 1 to 13 has `tricky`, so their corners are unchanged. To undo: drop the clause (and `cleanRounds` with it).
31. **A close camera `store-close` for the watch's two-handers.** Reason: 27 panels at one place on one fixed camera, past chapter 12's 13; the four
    spots span the panel, so the close frames are the ones that are our cat's and Chispapaw's alone (section 7 item 18 if it does not read).
32. **The lullaby's prompt writes its pair out (`'¿{Es:6} {es:por} {es:9}?'`).** Reason: the storyboard tool letters a prompt with no `{ a, b }`, so
    the token form would ship raw in `docs/storyboard/ch14.md`; a one-fact set needs no token; the same string as f035's balloon.

## 10. For the orchestrator

- **Before the build: the checks of section 6.** Nothing waits on Aron. **For Aron, with the first plays** (not blocking): the maths share at the top
  under the two caveats (section 7, item 15) and the kit's one cut left (the warm-up's third Count).
- **The brief's leftovers** (section 7, item 16): steering call 12's "six of nineteen" → "four of fourteen, five of fifteen"; line 141's "always end
  the run" → "end her first asks"; check (2) and `check.txt` to v1.1's five-place run (or cite this spec's `probe.txt`, section 4); the warm-up `alt`
  (4 × 4, then 3 × 6), its `avoid` (3 × 7, 5 × 7, 10 × 8) and the run's `alt` (6 × 6, then 9 × 9) into the lesson kit; the Tricky fill's other 33 and
  the corner's clause (calls 11 and 30) into the brief's engine need.
- **Doc fixes at ship, beside the brief's**: `docs/take-aways.md` section 3, row 14 becomes "352 − 127 (show), 640 − 218 (tap), 462 − 135; 768 − 315
  (586 − 231 cut by decision 56)" with Warm "– (cut, decision 56)", and its section 4's "from chapter 14, one made two-digit take" names chapter 14's
  cut (build.md calls take-aways.md the build's contract, so it must not keep contradicting decision 56 for later builders and critics);
  `tests/fixtures/takes-stub.js` may stay as it is (the kit's tests', not served).
- **Step 1, the stub** (on main, after chapter 13 is built):
  - `app/story/ch14.js`: `PC.story.ch14 = { id: 'ch14', number: 14, title: 'The Night Watch', module: 2, start: 'f001', names: { player:
    '{name}{ending}' }, frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.', end: true } }, counts: {}, cards: {}, teaser: {
    title: 'Chapter 15: The Holt', lines: ['Riffle’s home, at last. And you’re invited!'] } }`, in chapter 12's wrapper. **No `tricky` key in the
    stub**: the shelf of every live save stays the kit's until the story builder adds it; the engine owner tests on inline fixtures.
  - Its script tag after `ch13.js` in **`index.html` and `dev/gallery.html`**; in `sw.js`'s `ASSETS` after `ch13.js`; **`CACHE` one past the ledger's
    latest**; `node tools/storyboard.mjs app/story/ch14.js` for `docs/storyboard/ch14.md`.
  - **No new set file**: the `title` and the hollow are in `app/art/scenes.js`, the bridge in `app/art/sets/bridge.js`, the salamander in `cats.js`.
  - **The tests that fail with the stub, each the orchestrator's to change with it** (chapter 13's step 1 named the shape): `tests/story-ch13.test.js`'
    teaser case (chapter 13's teaser is now `built: true, next: 'ch14'`) and its hub case; `tests/warrior-ui.test.js` and
    `tests/warrior-engine.test.js` where a cat finishes every chapter and reads the last one's teaser (now "Chapter 15: The Holt");
    `tests/takes-ui.test.js`' `index.html` hash (cut the new script tag too); `tests/sw.test.js`' CACHE; **`tests/book2.test.js` and
    `tests/book2-ui.test.js`** (`fixtures/takes-stub.js` puts a stand-in ch14 beside the real stub in `E.chapters(PC.story).concat(s.list)`: two
    `ch14` ids). Run the full suite on the stub and name each. **`main` is never pushed while the stub stands.**
- **Step 2, the build: three owners, disjoint** (call 28). Each brief is in the returned plan; in short:
  - **engine**: `app/engine.js` (section 6's engine), `app/ui.js` (section 6's page, data lines and the corner's clause), `index.html` (the
    `.tshelf` paw rule in the take block, and an Aa twin only if needed), `tools/shots.mjs` and `dev/webkit/run.mjs` (the tricky targets, in an
    object of their own), new `tests/tricky.test.js`, `tests/tools.test.js` (the targets), and only the pins section 6 names in
    `tests/takes-engine.test.js`, `tests/takes-ui.test.js`, `tests/book2-ui.test.js`, plus `tests/engine.test.js`' one "new names, the last" `NAMES`
    pin extended with `'harrumph'`; never `tests/spanish.test.js`, `tests/takes-tools.test.js` or `tests/render-tools.test.js` (written around);
    `docs/build.md`'s "Chapter 14" section (the feature in full, with chapter 20's Spanish asker as one engine line of chapter 20's; the art a line
    each from section 4 and the other owners' notes).
  - **cats**: `app/art/cats.js` (the salamander, `facing` its head in every pose, `point`'s tail opposite it; `necklace` and `tap: 'pebble'`;
    `fluff`), `tests/cats.test.js` (with **the three-digit spread**: `PC.art.quickMarks({ hundreds: 3, tens: 4, ones: 12, crossed: { lines: 1 },
    fresh: { dots: 10 } })` draws three squares untouched, five lines with the last struck, two old dots and ten in a frame, five and five, and
    `quickMarks.size` counts the struck line and the frame; chapter 13 tested these keys on tens and ones alone, and any fix is in cats.js),
    `dev/gallery-cats.html`; `app/story/words.js` (`salud`), `tests/spanish.test.js` (its cases, and **the pin move**: line 63's deep-equal of
    `PC.words.es` gains `salud: { es: '¡Salud!', en: 'Bless you!' }` after chapter 13's `resta`, `noAlcanza` and `desagrupo`, with a chapter-14
    comment); `tools/storyboard.mjs` (**words first, before its other items**, for every new name: `salamander` and its poses, `necklace`, `tap:
    'pebble'`, `fluff`, `holes`, `spot`, `tap: 'holes'`, the `holes` camera, the `stone` composition and its spots, `spread3`, the store at night
    with `moon`, the `store-close` camera, `frost` on `store` and `bank`, `trail`, `badger`, the speaker `harrumph` as "a grumpy voice, never
    seen"; the title's `holes` and the bridge's `frost` branched by set where an option name is shared; a chapter's `tricky` key printed after its
    book; **`echoWords`** printing each listed pair's line, and "whispering" for a `kind: 'whisper'` echo line (chapter 12's echoes list one pair
    and carry no kind, so its storyboard is unchanged; the `on: 'first'` sample stays, section 7 item 19); chapters 1 to 13 byte for byte; a
    `--check-words` list for chapter 14's names), `tests/storyboard.test.js` (only where a pin needs it, plus a case for the new words).
  - **sets**: `app/art/scenes.js` (the `title` set's `holes`, `spot`, `tap: 'holes'`, the `holes` camera, the `stone` composition and its spots,
    `PC.art.titleInfo()`; the hollow's `spread3`; `SIZE_BAND.salamander`, `OWN_SHADOW.salamander`, `NO_SHADOW.salamander`),
    `app/art/sets/bridge.js` (the store at night, `moon`, `frost`, the `store-close` camera; the bank's `frost` and `trail`; the print's `badger`,
    drawn outside), `tests/scenes.test.js` (the `<ch14-fingerprint>` first, before any edit), `tests/set-bridge.test.js`, `dev/gallery.html`
    (`EXTRA` entries only, each labelled "chapter 14: ").
  - **The storyboard words between them**: `tests/storyboard.test.js`' "its words cover the art's whole vocabulary" (fast tier) walks the live
    `PC.art.vocab`, so every option, camera and spot the sets owner adds fails it until the cats owner's words land in `tools/storyboard.mjs`. The
    sets owner expects that case to fail for its own new names only, and never touches storyboard.mjs; the cats owner writes the words for every
    section 4 name first; the orchestrator runs the final `--full` after both have landed.
  - Nobody holds `app/story/ch14.js`, `tests/story-ch14.test.js` or `docs/storyboard/ch14.md` (the story builder's, later), nor `sw.js`,
    `tests/sw.test.js`, `tests/story-ch13.test.js`, `tests/warrior-*.test.js`, `tests/book2.test.js` (the orchestrator's, at the stub),
    `tests/engine.test.js` but its one `NAMES` pin, `app/art/cards.js`, any set file but `bridge.js`, or any `takes-*` test but the pins section 6 names.
  - **Between owners**: the sets owner places the salamander with a stand-in (`mizzle` in `curl`) and the young tom with no necklace; the cats owner
    reports the salamander's measured head ratio and whether `fluff` was kept; the sets owner reports the scale `spread3` reached and whether
    `store-close` was kept; the orchestrator looks at the holes and marks (f017, f018), the stone (f033, f036), the store by night (f043, f048,
    f054) and close (f058, f066), first light (f068, f070, f071) and the Hollow's spread (f011, f012) once both have landed.
- **Step 3, the story builder** writes `app/story/ch14.js` from section 5 (with section 6's `tricky` key), its test and its storyboard, on the built art
  and engine. **Then** the shelf with the real key: the tests where a cat finishes every chapter and opens the Hollow (the story builder names each and
  the orchestrator moves them, each with a chapter-14 comment).
- **README** (end of the spec phase): section 9's calls in short, under "Claude's calls under decision 46", and that decisions 53 to 56 bind the
  chapter. At ship, the echo list takes: a watch kept by staying put; a voice in the dark that says thank you; a sleeper's tail that points.
- **`docs/continuity.md`** (ship): section 8 as "What chapter 15 inherits"; the store's count (245, days 4 and 5, said); the places table (section 8,
  "Drawn now"); the cast (the salamander; the young ReedClan tom's pebble; the grumpy voice, `harrumph`); the flags table (`foundSalamander`); the Counts
  table, row 14: 3 × 7, 6 × 9 (optional), the warm-up, the first Tricky Counts run (five), four lesson take-aways (three of step `ones`,
  768 − 315 `none`) and the wall's 473 − 245 (step `ones`), five in all; the Hollow's Tricky Counts open.
- **The page review** (Node, the WebKit tool, and both voice lists, `VOICES=none DRY=1` and `VOICES=es DRY=1 node tools/shots.mjs OUT ch14:f009
  ch14:f061` plus section 6's check 1 targets for the Counts pages; nothing aloud): f009 (a plain balloon, not dashed: «¡Desagrupo!» in italics,
  "(Breaking it into groups!)" upright under it, over the spread marks), the lullaby's Counts page (`ch14:f035@nextBtn`, the pick-up and the retry of
  check 1: the whispered Spanish ask with its gloss, the blink, on the prompt route), f061 (the whispered «¡Salud!»), f063 (two off-panel balloons, "A
  grumpy voice"), the run's page (check 1's `ch14:f054@keys=…` target: a pick's line, an echo) and the warm-up's echo (`ch14:f006@keys=…`), **the
  worked example's page, ch14:f012's take page** (a chapter target, `ch14:f012@…`, or a `PC.debug.takes` target fed the real set: the kit's inline
  targets are 254 − 131, 43 − 16 and 503 − 278, never this page) **at each of its three show steps and at the next column**, at 844 × 390 and 390 × 844,
  Aa off and on: its first column holds three balloons (the prompt's two and the step), about 189 px of 330 at 844 × 390 (221 with Aa on) by the kit's
  own figure, leaving the store picture about 135 px (103), so the acceptance is that **the store's three squares, five rows and the opening ten-frame
  can be counted**; if not, **the fallback**: balloon A ("Pretend the store holds three hundred fifty-two.") moves to f012 as Tallyheart's closing
  balloon, and the take prompt keeps B alone (two balloons during the show, chapter 13's shape; the words and their order unchanged; never one
  13-word balloon, which `E.checkTakes`' 12-word cap fails); the `'tap'` page; **the wall's ten-word prompt** (Sloshbank's) with {Murmur}chime's column
  line in its own balloon, reached by a chapter target (`ch14:f028@…`), not the kit's inline targets: no `col-off`; **the shelf with Tricky Counts** (the
  three buttons, the paw inline, a two-plus-one wrap acceptable) and a Tricky round's page, help and reward (`tricky:*`), at the four sizes, Aa off and
  on; no row pairs Spanish text with an English voice.
- **The ship's look** (at most 25 pictures, silent, the screen locked: `tools/shots.mjs`): the title panel (f001); the crouch's flag (f005); the spread
  and «¡Desagrupo!» (f009); the spread, hers and yours (f012); the wall's end with the little water (f015); the holes close (f018); the pebble (f021); the
  boast (f026); the spot (f031); the salamander curled, blinking, pointing (f033, f034, f036); sunset (f040); the store by night (f043); the puffs (f048);
  the ear (f051); the run (f054); the sneeze (f060); the thank-yous (f063); first light (f068); the trail (f070); the print (f071); her nest (f082); the last
  frame (f085); after the chapter, her book's chapter 14 page (the store at 245), the badger page, the salamander's sleeper page and **the Hollow's shelf
  with Tricky Counts**.
- **Frames**: 80 or 81 a plain reading, 85 or 86 with the salamander, f085 the end (cap 125).
