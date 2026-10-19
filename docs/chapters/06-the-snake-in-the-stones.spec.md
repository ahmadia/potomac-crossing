# Chapter 6 spec: The Snake in the Stones

*v0.2 · 2026-10-18 · v0.2 applies the spec critics' findings (the Counts and continuity): 8 × 3 a
check, the warm-up's hard pick kept to chapter 5's nines, the bridge's `wall` its own composition,
ReedClan's coats their own, title's `reeds` camera cut, and what later chapters keep.*

*The build's contract for chapter 6, beside `docs/build.md`. The story,
[`06-the-snake-in-the-stones.md`](06-the-snake-in-the-stones.md) (Draft v0.4, final), is the source
of every word she reads; this spec adds no line she reads except the engine's own wording of a
question, a filler's opening, a retry's opening, a right retry's line and a last miss, each named here
and kept to chapter 5's lines or the story's own words. Every Counts set below was run on the live
engine (0.5.0) with scripted answers, exactly as written here
(`~/potomac-crossing-work/ch06/spec-editor/sim.js` and `check.js`: `E.checkStory` clean;
`editor.js` and `editor2.js` for the runs this version cites). The editors' build notes
(`editor-r2/spec-notes.txt`, `editor-last-r1/spec-notes.txt`, the latter winning) are folded in.
Names in `code` are fixed: the art, the engine, the storyboard words and the story builder use exactly
these.*

---

## 1. Flags

**One new flag, no new choice flag** (brief: "Flags"). No choice in this chapter sets anything.

| Flag | Values | Set where | Reread | Read by |
|---|---|---|---|---|
| `foundSleet` | `true` | the last frame of "The last post": the forepaw Tap (a `skip` frame), `sets: { foundSleet: true }` | sticky (never unset; Back does not unset it) | the fox trail's two option labels (`labelWhen`); the bridge's Sleet screen (two frames, opposite `when`s); card `sleet-den` (`when`); the book's recap line and Sleet's dragonet page; the Grown-ups corner's words |

- Saying no ("Not today") sets nothing. A cat who reads part of the scene and goes Back has not found
  him: no flag, no card in her file, no page.
- **The five light choices set nothing** (`sets: {}`): the marching order on the wall, the fair
  question to Sloshbank, "Would you tell the FOX / ANYBODY?", the dream's question, and the fox
  trail's choice itself (the scene sets the flag, never the option).
- `foundSleet` is read from any reading, as chapter 5 reads `foundPuddle` at "Mama's count": a cat who
  met him on an earlier reading and says "Not today" this time still carries his "five" to Sprinkle.
  Precedent; no chapter-local flag (the brief allows one new flag). Sleet is chapter 6's only offer
  of him so far, so `foundSleet` is also "found in this chapter" for the book (see 8).
- **Flags read from earlier chapters:**
  - `ch3Told`: who is there. Told: Tallyheart walks to the Barking Field, the last post and under the
    bridge with her (her wink; "Old"; "Not one paw past the post"; "The eldest… And the bossiest.";
    her branch; her tail round our cat; Coil's "the ginger one" screen, a screen only she reads; the
    rule screen's told form; "A snake's secret," murmurs Tallyheart; the first watch's told line).
    Kept: Tallyheart pads off after the border; Riffle says "Not one paw past the post"; the bank
    checked first; the rule screen's kept form; the snake's secret as narration; "You don't tell her
    what Coil said" at sunset; the first watch's kept line.
  - `specialty: 'noticing'`: one caption at Sloshbank's paws.
  - `worry`: one caption each at Sloshbank (`small`, `water`, `talk`, `shiny`).
  - `ch2Stone`: one bedtime caption (and the den's `stone: 'auto'`).
  - `foundSquall`, `foundPuddle`, `foundWisp`: her news to Sleet (one balloon, see 5).
  - `lessonClean: 'ch06-threes'` and `not` it: the sixth mark's two pairs of lines.
- Grown-ups corner: `foundSleet: { 'true': 'found Sleet at the last post of the Barking Field (later
  chapters remember)' }`.

## 2. Counts sets

**16 typed answers on the plain path, 17 with Sleet.** Every key below is one the engine has (chapters
2 to 5); no set needs a new one. Two shared pieces: `PATROLS = { table: 3, thing: 'cat', things:
'cats', unit: 'patrol', units: 'patrols', teacher: 'tallyheart', ask: '{a} × {b}' }` (the generic
question: "Five patrols. How many cats?") and, for the story questions that borrow from the lesson,
`BORROW = { fillFrom: 'ch06-threes', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture:
'borrower' }` (a borrowed pair is asked and drawn as the borrowing question's own). `T(x)` below is
`{ who: 'tallyheart', text: x }`. Lines use the story's typographic quotes and apostrophes.

Two engine lines reach her that no set below words. **Retries** open with the engine's “Here’s that
one again.” (Sleet's own retry: his `againIntro`; a lent question's retry in the pile, the warm-up and
Sleet's set opens with that set's `fillIntro` instead). **A right retry** of a fact with no `right`
kept for it (`rightAgain`) gets the engine's `again` lines, “There it is. You remembered that one.”
then “Yes! That one came back, and you knew it.”: the lesson's 6 × 3, 7 × 3 and 3 × 8, the warm-up's
first question, and any missed borrowed filler in four, the watchers and the guards (the pile and
Sleet set their own `again`). Chapter 5 used the same defaults; the build needs nothing.

### Every fact, in the order she meets it

| # | Set | Fact (answer) | Where | Picture |
|---|---|---|---|---|
| 1 | `ch06-pile` | 3 × 10 (30) | the morning count | prey in rows, lit a row at a time |
| 2 | `ch06-nines` | 7 × 9 (63), or her hardest 9s fact from chapter 5 | the warm-up | the 9s, hop and tuck |
| 3 | `ch06-nines` | 3 × 9 (27) | the warm-up | three rim cats, hop and tuck |
| 4 | `ch06-four` | 4 × 3 (12) | four patrols on the path | four patrols of three, unlit |
| 5–14 | `ch06-threes` | 1 × 3, 3 × 2, 3 × 3, 3 × 5, 6 × 3, 7 × 3, 3 × 8, 3 × 4, 3 × 7, 8 × 3 (3, 6, 9, 15, 18, 21, 24, 12, 21, 24) | the lesson | that many patrols, the made ones lit |
| 15 | `ch06-watchers` | 3 × 3 (9) | at the border | three patrols, ReedClan coats |
| +1 | `ch06-sleet` | 7 × 3 (21), optional, between 15 and 16 | the last post | seven little dragonets, three HEREs each |
| 16 | `ch06-guards` | 3 × 6 (18) | sunset at the pile | six patrols of three |

The lesson kit holds: seven of the ten are new facts (3 × 3, 6 × 3, 7 × 3, 3 × 8, 3 × 4, 3 × 7, 8 × 3),
three are known stepping stones (1 × 3, 3 × 2, 3 × 5); both orders; each new fact typed twice on the
plain path (3 × 3 in the lesson and at the border; 4 × 3 / 3 × 4; 6 × 3 / 3 × 6; 7 × 3 / 3 × 7;
3 × 8 / 8 × 3), Sleet's 7 × 3 a third. No 7 × 2, 9 × 2 or 4 × 5; Sleet's fact is none of the
dragonets' (2 × 5, 6 × 5, 7 × 5, 4 × 10, 7 × 1). Not typed (taps, never logged): the five patrols'
skip-count (3 to 15), Tallyheart's five Counts at the tree (`ask`), the bedtime skip-count (3 to 18),
Sleet's forepaw (5), and eight one-tap frames (section 5).

### `ch06-pile`, the morning count (one question)

```js
'ch06-pile': {
  table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
  picture: { kind: 'prey', layout: 'rows' },
  facts: [{ a: 3, b: 10, light: 'rows', check: true,
    prompt: [{ kind: 'caption', text: 'Three full rows of ten. How many pieces?' }], retryPrompt: true }],
  ask: '{a} × {b}', praise: [], ground: 'earth',
  helpIntro: 'Let’s scratch it out: ten marks for every row.',
  helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
  fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower',
  avoid: [[4, 10], [5, 10]], fillIntro: 'An easy one.',
  miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
  again: ['There it is. You remembered that one.'], done: null
}
```

Chapter 5's pile, in its own words. Run: a miss scratches ten marks a row in the earth (10 · 20 · 30),
then "An easy one. One row of ten. How many pieces?" (1 × 10) and "An easy one. Two rows of ten. How
many pieces?" (10 × 2), on the pile's own rows, then the retry. A second miss lends the same two again
(`avoid` keeps four and five full rows out: the pile has three). No praise line: the gap answers. The
frame's three balloons (the old tom twice, Tallyheart) are not said again over the question.

### `ch06-nines`, the warm-up (two questions; Counts frame `intro: false`)

```js
'ch06-nines': {
  table: 9, thing: 'life', things: 'lives', unit: 'cat', units: 'cats', teacher: 'tallyheart', light: 'tuck',
  facts: [[7, 9], { a: 3, b: 9, who: RIM.slice(0, 3), prompt: 'Three cats, nine lives each. How many lives?',
    retryPrompt: true, right: [T('Twenty-seven! Hop, then tuck.')], rightAgain: true }],
  warmHard: { table: 9, at: 0, avoid: [[3, 9], [2, 9], [9, 10]] }, avoid: [[3, 9]],
  fillFrom: 'ch05-nines', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
  ask: '{a} × {b}', praise: ['Yes! Nine lives on every cat.', 'Tens, with a claw tucked in. That’s all a nine is.'],
  fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
  helpIntro: NINES_HELP, helpIntroFar: NINES_HELP.replace(/^Close\.\s*/, ''),
  helpIntroTens: 'That’s the hop! Now the tuck: one claw in for every cat.',
  helpIntroOneTuck: 'So close! You tucked ONE claw. Tuck one in for every cat.',
  helpIntroNotNine: 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.',
  miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
  remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
  rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
}
```

`RIM` is chapter 5's (`clancat` 1, `murmurchime`, `clancat` 3, `clancat` 5, `grizzled`), `NINES_HELP`
chapter 5's ("Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat."),
`QUICK2` the story's two quick lines (`'Quick as a pounce!'`, `'You knew that one before I finished
asking.'`). The first question is her hardest 9s fact as `E.hardFacts(cat, 9)` has it, in the order
chapter 5 asked it; 7 × 9 when nothing was hard; never 3 × 9, 2 × 9 or 9 × 10 (`warmHard.avoid`).
3 × 9 is asked second anyway. 2 × 9 and 9 × 10 are avoided because `E.hardFacts` reads every 9s pair
in the whole log: chapter 5 asked them only under something to read (2 × 9 the lesson's opener, 9 × 10
under its prompt), so a right answer there never replaces an older timed one, chapter 2's 9 × 2 (the
ears lesson's last) or chapter 4's 10 × 9 (the tens), or a Hollow round of the 2s or 10s. Picked, that
older fact would earn "Yesterday, … made you stop and think", which would be false. So the pick is
always one of chapter 5's timed nines (9 × 1, 9 × 8, 5 × 9, 7 × 9, 9 × 9; 3 × 9 is avoided), or a chapter-5 miss of
4 × 9 or 9 × 6: those two had prompts, but no older timed answer competes for them, so a miss there
is still yesterday's. A chapter-5 miss of 2 × 9 or 9 × 10 is passed over. Run (`editor.js`, B):
9 × 8 slow in chapter 5, quick now, earns "Yesterday, 9 × 8 made you stop and think. Not today!"; a
cat whose only hard facts are 3 × 9, chapter 2's 9 × 2 or chapter 4's 10 × 9 gets plain 7 × 9; a
chapter-5 miss of 4 × 9 opens on 4 × 9. `intro: false` on the Counts
frame (chapter 5's): the caption and "Nines first… to wake up your whiskers." are read on the frame
before she starts, and the first question is timed on itself. Fillers are borrowed in chapter 5's
words and picture ("One from yesterday. One cat. How many lives?"): one after a miss on the first, two
(9 × 1, 2 × 9) after a miss on 3 × 9. The bridge line on the next frame names its number ("Twenty-seven
lives. Hold on to that"), so it reads true after any retry order.

### `ch06-four`, four patrols (one question)

```js
'ch06-four': Object.assign({}, PATROLS, BORROW, {
  facts: [{ a: 4, b: 3, prompt: 'How many cats in four patrols?', retryPrompt: true,
    right: [T('Twelve! Now let’s hop. It’s quicker.')], rightAgain: true }],
  praise: [], helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.',
  miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', done: null
})
```

The question is the fact's prompt, Tallyheart's balloon; the frame carries only the caption "More
patrols stop on the path to watch." (so the question is never said twice). `table: 3`: the sand hops 3,
6, 9, 12 (the story's help). Fillers: "One patrol. How many cats?" (1 × 3), then "Two patrols. How many
cats?" (3 × 2), on the same patrols, before the Tap; a second miss lends 3 × 3 and 3 × 5. This set
borrows before the lesson has run, so its fillers are the lesson's facts, easiest first (run).

### `ch06-threes`, the lesson (ten facts)

```js
'ch06-threes': Object.assign({}, PATROLS, {
  label: 'Patrols', hollowThings: 'threes', fillOrder: 'easiest',
  facts: [
    { a: 1, b: 3, right: [T('Three! One patrol, one hop.')], rightAgain: true },
    { a: 3, b: 2, lit: 3, prompt: 'Two patrols. One patrol made three. Hop three more.', retryPrompt: true,
      right: [T('Six! You’ve known that one since your second day.')], rightAgain: true,
      miss: 'One patrol made three. One more hop: six. We’ll come back to that one.', missLast: 'One patrol made three. One more hop: six.' },
    { a: 3, b: 3, lit: 6, prompt: 'Three patrols. Two patrols made six. Hop three more.', retryPrompt: true,
      right: [T('Nine! That’s a new one.')], rightAgain: true,
      miss: 'Two patrols made six. One more hop: nine. We’ll come back to that one.', missLast: 'Two patrols made six. One more hop: nine.' },
    { a: 3, b: 5, right: [T('Fifteen! Like the claws.')], rightAgain: true },
    { a: 6, b: 3, lit: 15, prompt: 'Six patrols. Five patrols made fifteen. Hop three more.', retryPrompt: true,
      miss: 'Five patrols made fifteen. One more hop: eighteen. We’ll come back to that one.', missLast: 'Five patrols made fifteen. One more hop: eighteen.' },
    { a: 7, b: 3, lit: 18, prompt: 'Seven patrols. Six patrols made eighteen. Hop three more.', retryPrompt: true,
      miss: 'Six patrols made eighteen. One more hop: twenty-one. We’ll come back to that one.', missLast: 'Six patrols made eighteen. One more hop: twenty-one.' },
    { a: 3, b: 8, lit: 21, prompt: 'Eight patrols. Seven patrols made twenty-one. Hop three more.', retryPrompt: true,
      miss: 'Seven patrols made twenty-one. One more hop: twenty-four. We’ll come back to that one.', missLast: 'Seven patrols made twenty-one. One more hop: twenty-four.' },
    { a: 3, b: 4, prompt: 'Four patrols? You did that one already.', retryPrompt: true,
      right: [T('Twelve! Same fact, turned round.')], rightAgain: true },
    { a: 3, b: 7, prompt: 'Seven patrols? You did that one the other way round.', retryPrompt: true,
      right: [T('Twenty-one! Same fact.')], rightAgain: true },
    { a: 8, b: 3, check: true, right: [T('Twenty-four! Same fact.')], rightAgain: true }
  ],
  ask: '{a} × {b}',
  praise: ['Hop, hop, hop!', 'Three more, every time!', 'You hopped it!'],
  fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
  helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.',
  miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
  done: 'That’s the threes.'
})
```

- **The Count**: the first set chapter 6 gives table 3 with the most facts, so it is the 3s' own
  (`E.countSets`): the Hollow's button reads "Patrols · the 3s", Tallyheart says "threes" there
  ("A round of threes. Ready? Here we go."), and the tree gets its sixth mark. Run.
- **Run, every single miss** (`sim.js lesson`): the help hops from the first patrol (3 · 6 · 9 …);
  "Close. Let’s hop it together." within one hop, else "Let’s hop it together."; a step-off fact ends
  on its own line; the fact comes back two questions later; a missed 7 × 3 comes back before 3 × 7, a
  missed 3 × 8 before 8 × 3; a step-off asked after a retry still opens with its made patrols lit
  (`lit`, kept on the retry), so "Six patrols made eighteen" is on screen. Fillers near the end are
  her easiest right answers in the lesson (`fillOrder` alone).
- **Lines**: the seven facts with an arrow in the story have `right` (and keep it on a retry); 6 × 3,
  7 × 3 and 3 × 8 get the praise in order, or a quick line when she is quick (both checked: quick
  answers get "Quick as a pounce!" and "You knew that one before I finished asking."). A right answer
  lights all the question's patrols (the page's rule). Three facts have no words of their own and are
  asked by the engine: "One patrol. How many cats?", "Five patrols. How many cats?", "Eight patrols. How
  many cats?" (8 × 3 is a check, `check: true`: a right one there never clears a missed 3 × 8).
- **Why 8 × 3 is a check.** A missed 3 × 8 comes back as question 10, just before 8 × 3: the same eight
  patrols and the same 24 she has just been shown twice. A quick right 8 × 3 would then be the pair's
  latest timed ask, and `E.hardFacts` would forget the miss (the critic's run: miss 3 × 8, everything
  else quick, `E.hardFacts(cat, 3)` is `[]`). As a check, a right 8 × 3 means nothing to `E.hardFacts`
  and a missed one still counts, so every miss in the lesson reaches chapter 7 (`editor.js`, A: a missed
  3 × 8 stays `[[3, 8]]`). The cost: a slow right 8 × 3 is no longer found. No line changes.
- The Counts frame's one balloon ("Five threes, and you knew every one… start from one you know, and
  hop.") is said again over 1 × 3, so 1 × 3 is not timed; 3 × 5 is (`E.readFirst`). It is the lesson's
  only fact whose speed `E.hardFacts` reads: the others have prompts or are read first, and 8 × 3 is a check.

### `ch06-watchers`, at the border (one question)

```js
'ch06-watchers': Object.assign({}, PATROLS, BORROW, {
  who: REED9,
  facts: [{ a: 3, b: 3, prompt: [{ kind: 'caption', text: 'How many ReedClan cats watched you?' }], retryPrompt: true,
    right: [{ who: 'player', text: 'NINE? I only saw three!' }, { who: 'sloshbank', text: 'That is the point of reeds.' }],
    rightAgain: true }],
  ground: 'earth', praise: [], helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.',
  miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', done: null
})
```

`REED9` (set-level `who`, so the borrowed fillers wear it too): nine ReedClan cats in the patrol
picture's places, three patrols, never two of one coat side by side: `[r3, r1, r4, r2, r3, r1, r4, r2,
r3]` with `rN = { who: 'reedclan', variant: N }`. Sloshbank's balloons ("Three of our patrols
watched," / "Three cats in every one.") are the frame's and are said again over the question. A miss:
Tallyheart scratches three lines a patrol in the earth at the end of the wall, hops by threes (3 · 6 ·
9), then lends the two easiest the lesson can that this reading hasn't used. **The borrowing rule,
as `E.siblingAsked` has it** (the siblings are the four sets that borrow from `ch06-threes`: four, the
watchers, Sleet and the guards; their run of asked pairs ends at the last answer from another set of the
chapter, so the lesson ends it): the watchers lend 1 × 3, then 3 × 2, even after the four patrols
borrowed them (the lesson in between ends the siblings' run); after its own second miss, 3 × 4 and
3 × 5. Sleet after a missed watchers question: 3 × 4 and 3 × 5 (after the watchers missed twice, all
five easiest are used, and he lends 1 × 3 and 3 × 2 again). The guards: whatever the watchers and Sleet
have not lent, else 1 × 3 and 3 × 2 again (run: `editor.js`, D, and `editor2.js`). The story's notes
say "unless an earlier question borrowed them"; this sentence is the rule the build and its tests
follow. The right balloons need `player` and `sloshbank` in the Counts frame's cast.

### `ch06-sleet`, Sleet's riddle (one question, optional)

```js
'ch06-sleet': Object.assign({}, BORROW, {
  table: 3, thing: 'HERE', things: 'HEREs', unit: 'dragonet', units: 'dragonets', teacher: 'sleet', ask: '{a} × {b}',
  picture: { kind: 'roll' },
  facts: [{ a: 7, b: 3, prompt: [{ kind: 'caption', text: 'How many times does Mama hear HERE?' }],
    retryPrompt: 'Seven of us, three HEREs each. How many HEREs?',
    right: [{ who: 'sleet', text: 'TWENTY-ONE! You pass. Not past the post!' }], rightAgain: true }],
  help: 'picture', helpCounter: 'you', helpIntro: 'Count every HERE! Hop by threes.',
  avoid: [[7, 3]], againIntro: 'My roll call AGAIN!', fillIntro: 'A smaller roll call!',
  praise: [], again: ['You pass!'],
  miss: 'There! I’ll ask you AGAIN in a minute.', missLast: 'There!', done: null
})
```

His riddle balloon ("There are seven of us. … HERE! HERE! HERE!") is the Counts frame's, said again
over the question with the caption. Run: a miss lights the HEREs a dragonet at a time as she hops (3 ·
6 … 21, her count, no scratching), he ends it "There! I’ll ask you AGAIN in a minute.", lends "A
smaller roll call! One dragonet. How many HEREs?" and "… Two dragonets …" (or the next easiest, four and
five, after a missed watchers question), and the retry reads exactly the story's "My roll call AGAIN!
Seven of us, three HEREs each. How many HEREs?" (`againIntro` and `retryPrompt`, split as Puddle's
were). Never more dragonets than the clutch (the easiest pool is 1, 2, 3, 4, 5 patrols). A borrowed
filler answered right gets no line (`praise: []`); a missed one's right retry opens "A smaller roll
call!" and gets "You pass!" (`again`). Labelled "The silver-white dragon" (the chapter's `names`),
help and fillers included.

### `ch06-guards`, sunset at the pile (one question)

```js
'ch06-guards': Object.assign({}, PATROLS, BORROW, {
  facts: [{ a: 3, b: 6, prompt: [{ kind: 'caption', text: 'How many guards?' }], retryPrompt: true,
    right: [{ who: 'grizzled', text: 'Eighteen!' }], rightAgain: true }],
  ground: 'earth', praise: [], helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.',
  miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', done: null
})
```

Six patrols of three, CrystalClan coats (no `who`), unlit. Tallyheart's balloon ("Tonight, our guards
do the same. …") is the frame's. Help in the earth beside the pile; fillers by the borrowing rule under
`ch06-watchers` (siblings' pairs passed over: once the watchers and Sleet have lent all five easiest,
the pool comes round again to 1 × 3 and 3 × 2). `grizzled` in the Counts frame's cast for the right line.
The right line is his "Eighteen!" alone, and his "Then I can SLEEP." opens the next panel, before
Tallyheart's "You can. In your NEST." (build review): a cat who misses 3 × 6 three times never reads the
right line, and Tallyheart's answer must still have its question. No word is added or lost on any path.

### The taps that count (skip and ask)

- **Five patrols** (after "Hop by threes… Touch each patrol."): `skip: { table: 3, groups: 5, teacher:
  'tallyheart', thing: 'cat', things: 'cats', label: 'Count the next patrol.', prompt: '**Tap** the
  patrols.', next }`. All five patrols drawn from the first tap, the next one glowing; each tap lights
  its three cats, its running total under it and a big number over the picture, her count in
  Tallyheart's balloon ("3… 6… 9… 12… 15!"); a tap elsewhere wiggles the glowing patrol; no `done`, so
  the fifth tap turns the page and "Fifteen! Five patrols of three" is read under a big 15. No `keep`.
- **The tree** ("Now here's a secret." / "I DO?"): `ask: { who: 'tallyheart', to: 'player', prompt:
  '**Tap** Tallyheart to find out.', label: 'Ask the next Count.', pairs: [['Tails?', 'Three cats, three
  tails!'], ['Ears?', 'Three cats, six ears!'], ['Claws?', 'Three forepaws, fifteen claws!'], ['Both
  forepaws?', 'Three cats, thirty claws. Like this morning’s three rows!'], ['Nine lives?', 'Three cats,
  twenty-seven. Just now!']], next }` on `hollow`/`lesson` with `{ marks: 5, glow: 'auto' }` (before
  SKRITCH!; from the `tree` frame on, every `hollow` frame is `{ marks: 6, glow: 'auto' }`). No `opt`:
  the engine adds `owed` to the scene, which the hollow ignores; nothing on the tree lights (a lit mark
  means three clean Hollow rounds). Tallyheart glows as the asker; the pairs before stay small under
  the panel; Next after the fifth.
- **Bedtime** ("It's threes tonight… Six guard patrols."): `skip: { table: 3, groups: 6, teacher:
  'player', thing: 'cat', things: 'cats', label: 'Count the next patrol.', prompt: '**Tap** the
  patrols.', next }`: the count in her balloon, 3 to 18; the sixth tap turns the page to "That's not a
  paw thing," under a big 18. Patrols, not stars (no skip form draws stars).
- **Sleet's forepaw**: `skip: { table: 5, groups: 1, who: [{ who: 'sleet' }], thing: 'claw', things:
  'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next }`, on the frame
  that `sets: { foundSleet: true }`; Sleet speaks first on it, so the "5!" is his.

## 3. The Case File

Three new cards, all ears; one new link. Nobody says weasel, tunnel, glass or what the "scale" is.

| id | Mark | Line as lettered | Given | To whom | Links |
|---|---|---|---|---|---|
| `reed-pile` | ear | Sloshbank says ReedClan’s pile is robbed too, and left tidy. | "Three and three": the screen where Sloshbank admits it ("…And leaving our pile TIDY.") | everyone | `link: { with: ['tidy'], line: 'Two piles. Both left tidy.' }` (chapter 4's `tidy`: drawn touching from the moment she holds both, which is at once) |
| `coil-diggers` | ear | Coil says small diggers come and go under our pile. | "Under the Old Bridge": Coil's secret ("Every night, small diggers come and go…") | everyone | none |
| `sleet-den` | ear | Sleet says the fox talks about ‘a fine, dry den’. | "The last post": "I spy on the fox…" | `when: { foundSleet: true }` (shown on the frame that gives it and the pages read on from it, as `squall-shapes`) | none |

- Pictures (`app/art/cards.js`, keys = the ids), scratched as chapter 4's are, the shared motifs drawn
  one way: **`reed-pile`**: a stern cat's head with three drips under its chin, beside a tidy row of
  prey with one gap in it, the row drawn exactly as `tidy` draws the pile, since the two lie touching;
  **`coil-diggers`**: a snake's head, one round unblinking eye, at the left, a ground line with the
  pile's prey on it, and under the line a few short scrape marks (nothing of an animal, no hole, no
  tunnel); **`sleet-den`**: the shared fox head (`fox`), eyes half shut, a small speech curl, and
  beside it a round den mouth with three short dry straight lines over it (no rain).
- She holds 14 to 20 cards by bedtime (12 to 17 before, plus two, plus Sleet's).
- **In her nest**: today's bark goes along the mossy edge (`bark: 'auto'`). Coil's card goes **under
  the moss** with Sprinkle's two (`hidden: true`), on every path: on the kept path it is the one thing
  in her nest that shows she was under the Old Bridge ("You can't, without telling her where you heard
  it."), and hiding it on every path reads no flag. ReedClan's and Sleet's lie in the row.
- Not cards, on purpose: the dream (a dream is not evidence, brief call 8); "They always come in
  threes"; the young tom's "Except at night"; Coil's "I feel feet. Not faces."; "Foxes never leave
  anyone alone"; twenty in five nights; the guards; the first watch's nothing.

## 4. Art needs

One new place: none. Every place is an existing set; three sets gain a composition or a camera.
**New** marks what the art must add. Times of day: `morning` at the pile and in the Hollow; `day`
from the patrol to the bridge; `sunset` at the pile; `night` for the watch, the den and the dream.

### Places

| Set (file) | What the chapter uses | New |
|---|---|---|
| `pile` (`sets/pile.js`) | sunrise: `rows` with `{ rows: [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }], back: 'shadow', scale: 'behind' }` (the old tom asleep on his pinecone at `pile-left`); `gap` with the gap and `dug: 'big'`; `wide` (Glintstar at `fountain-edge`, the apprentice, {Murmur}chime). Sunset: `wide`/`low` with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }`, the whole Clan at the `crowd-*` spots. Night: the same rows, Tallyheart at `behind` ("Tonight, I AM the back"), our cat at the front, {Murmur}chime walking round; "The moon comes out, a little fatter." on `wide` or `low` (the two cameras with sky) | **`moon: 6`**: the sixth evening's moon (the den's `waxingMoon` from the kit, age 6, a crescent a little fatter than chapter 5's) in `wide`'s sky and in `low`'s patch of sky through the arch, at night (and at dusk or sunset if asked). Declared in `opts` as `'number'` (default `false`, off), as `pairs` is, so chapter 7's `moon: 7` needs no art change and the storyboard's number words already cover it; chapters 2 to 5 are unchanged |
| `hollow` (`scenes.js`) | `wide` with chapter 5's five rim cats sitting up (`situp`) at `rim-1`…`rim-5`, `{ marks: 5, glow: 'auto' }`; the patrol of three `clancat`s trotting by, tails up, at three custom spots `{ x, y, h, z: 'behind' }` along the top of the Hollow, above and behind the five sitters and drawn behind them (never on top of a sitter, never among their heads; a second patrol from "More patrols": section 5); `lesson` for the ask and the lesson; `tree` for SKRITCH!; from the `tree` frame on, every `hollow` frame `{ marks: 6, glow: 'auto' }` (chapter 5's H5, one more: older marks that glow keep glowing; 'auto' gives six entries by then, the 3s' false) | nothing (`marks: 6` exists; check that the sixth sits beside the fifth, in the second row, and reads at `tree` and `lesson`) |
| `title` (`scenes.js`) | `wide` for the three on the wall (`day`), the cast facing right (`facing: 'right'`: walking away from the wall's near end at the left, toward its far end and the reeds, off the panel at the right) | **anchor `wall-3`** on `wide` (a third cat on the wall, right of `wall`: the front of a patrol walking right). **A second composition, the wall's end**, by day: the old stone wall's far end above the river, where its stones stop and tall reeds begin (the border), the river behind and below. Cameras **`end`** (wide: the end of the wall at the left, the reeds at the right) and **`meet`** (cat height: three cats each side, face to face across the line where the stones stop). Anchors **`end-1`**, **`end-2`**, **`end-3`** (CrystalClan, on the ground at the wall's end, facing right; `end-1` nearest the line) and **`reed-1`**, **`reed-2`**, **`reed-3`** (ReedClan, stepping out of the reeds, facing left; `reed-1` nearest the line, Sloshbank's), all seen by both cameras. Option **`rustle: true`** (rustle lines in the reeds, nobody seen). No cat ever stands in mud or water; the reeds never hide a face that speaks. (No `reeds` close-up: no screen needs one; the rustle and the wave are on `end`) |
| `field` (`sets/field.js`) | `wide`, `fence`, `dogs` (the dogs galloping, Riffle and our cat on the path); the border composition's `border`, `border-two`, `border-fox` for the fox trail and the last post | **anchor `grass`** in the three border cameras: Sleet's spot in the long grass just past the last post, nearer than `fox` (close enough to talk across the post), low; the long grass is drawn over his lower body (flat on his belly the grass reaches his chin; sitting up, his chest and head clear it). Never on the Clan's side of the post. The fox is never drawn |
| `bridge` (`sets/bridge.js`) | `bank` (the kept path's bank checked first; Riffle bursting on the way out), `back` with `{ prints: true, stones: true }` (the told path's first panel with `branch: true` and Sprinkle peeking, the kept path's with `eyes: 'sprinkle'`), `wall` for Coil's close beats, `under` with `{ prints: true }` (as chapters 3 to 5) for the three-shot with the fish, custom spots `{ x, y }` for the third cast member there (as chapter 5's f143), `train: true` once (on `wall`) | **`stones: true`** on `back`: the bridge's stone leg drawn beside Sprinkle's nook as a wall of big old fitted stones, its foot on the dry floor, with one dark gap low in it, Coil's (off by default, so chapters 3 to 5's `back` is unchanged). **Anchor `gap`** in `back`: the mouth of that gap, where Coil's head is, placed so his body runs along the wall's foot behind the cats and toward the panel's edge or the dark, never toward a cat or over a spot; `dragon`, `beside`, `back-left`, `back-right` and `near` all still read with Coil there. **Camera `wall`, its own composition** (`cams.wall = { box: [0, 0, 1600], comp: 'wall' }`, as field.js's border cameras each are, sharing anchor names): at cat height, the stone leg across the middle distance, its gap low at about a quarter to a third of the width, the dry floor in front. Its anchors: **`gap`** (default facing right: Coil's head toward the cats, his body trailing left along the wall's foot and off the panel's left edge, away from them), **`back-left`** (our cat, near, between the gap and the centre, facing left toward it), **`back-right`** (Riffle, near, on the right, facing left), **`dragon`** (at the right edge, only Sprinkle's head and neck in the panel, facing left). No cat's box covers the gap or Coil's head. No `near` or `beside`, so none of Tallyheart's told-path spots is in view. `train: true` works here (the grit falls in front of the wall) |
| `den` (`scenes.js`) | `inside` and `nest` at night, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true }`; the grey tom at `sleeper-1` | **`hidden: true` also takes `coil-diggers` under the moss** (`BARK_SECRET` gains it: every secret picture she holds is out of the row, a corner showing for each; chapters 4 and 5, whose files hold no such card, draw exactly as they do) |
| `sky` (`scenes.js`) | the dream | **A second composition, the dream**, at night: the Sky River underfoot as a broad soft path of stars across the panel, dark blue all round, the city's lights tiny far below. Cameras **`walk`** (our cat walking on the stars, the starry cat sitting further along) and **`below`** (looking down past the river's edge: the glass towers far below, the tallest with its red light, and one balcony nineteen floors up with a wind chime catching the starlight; nobody on it; no anchors). Anchors **`star-1`** (our cat) and **`star-2`** (the starry cat) on `walk` |

Nothing else from before needs new art: the tower is not visited, and the camp is seen only from the
pile.

### New cast

- **`coil`**, a northern water snake (the real Potomac kind, not venomous): brown with darker
  cross-bands, a cream belly, a rounded head (never a viper's arrow), two round eyes **shiny as wet
  pebbles**, round pupils, a shine dot in each, **never shut** (no eyelids: no mood, extra or pose ever
  closes them). Mouth always shut; no tongue, no fangs, ever. Very polite, very slow: the head tilted
  as if listening. Funny-creepy, never frightening: he never strikes, squeezes, rears up, or comes
  toward her; his body runs **sideways along the wall's foot**, away from the cats. Drawn in one box for
  every pose with **his head at the box's bottom centre** (where a cat's feet are), facing right, his
  body trailing back from it along the bottom line, as much of it as the pose shows (mirrored facing
  left), so at the bridge's `gap` his head is in his gap at any scale. His head is **no bigger than a
  stone of the wall**: smaller than a cat's head. Poses: **`stone`** (only his head, turned into the
  gap so its top reads as one more rounded stone of the wall, eyes not showing; the stones Tap's
  target), **`head`** (the head out of the gap, tilted politely, two round eyes, mouth shut: the first
  sight of him), **`long`** (the head and a first loop of body along the wall's foot), **`longer`**
  ("Then MORE of him": loops and loops along the wall's foot, in and out of the stones' shadow),
  **`still`** (lying along the wall, head raised a little: his talking pose), **`listen`** (chin flat
  on the floor: feeling footsteps), **`think`** (head tilted up), **`slide`** (sliding back into the
  gap, the tail end last). Every mood, drawn his way (eyes always open; a small closed smile at most;
  `sniff` an offended lift of the chin). Extras: `tap: 'stone'` (on `stone`) and `tap: 'eyes'` (his
  two eyes). Speaker "Coil"; Read to me low and very slow.
- **`sloshbank`**, the ReedClan speaker: a big, heavy, stern brown tom (solid brown, no tabby
  stripes, darker legs), bigger than Tallyheart, his belly fur clumped wet with **water always dripping
  off it** (a few drops falling, one on the ground), big muddy paws. A cat: every cat pose and mood
  (stern, proud, solemn, worried, sad for the admission). Speaker "Sloshbank"; Read to me low and slow.
- **`reedclan`**, the other ReedClan cats, by `variant`: **1** the ReedClan she-cat (sleek, dark
  grey-brown, a pale belly, calm amber eyes; never speaks), **2** the young ReedClan tom (lanky, sandy,
  big ears, eager), **3** and **4** two more marsh coats for the watchers' picture (say a smoky dark
  grey and a fawn), all with mud to the elbows and a sleek, wet-looking coat, so ReedClan reads apart
  from CrystalClan at a glance. Cats: every pose and mood. **No ReedClan cat wears her coat, by
  construction**: the four are marsh coats of their own, none of `LOOKS.fur`'s nine and none of the
  Clan cats' (`CLAN`), each visibly apart from all of them (the smoky grey darker and browner than
  `grey` and lighter than `black`, the fawn darker and warmer than `cream`, the sandy tom no `ginger`), with the wet sheen and
  the mud to the elbows that no player's coat has. So no `look` is needed and the `clanVariant` rule is
  not used for them: the scenes pass `look` and `taken` to `clancat` only (scenes.js `charOpts`), and
  that stays as it is. The cast owner tests it in cats.js and in the Counts picture's `whoSpec`.
  Speakers: "ReedClan she-cat" (1), "Young ReedClan tom" (2), "A ReedClan cat" (3, 4).
- **`sleet`**, the eldest dragonet (a **he**): a Mistscale on Sprinkle's model and about her size
  (sitting, his head well above a cat's), **silver-white** scales with a cool blue-grey shade in the
  ridges, a paler belly, round bold eyes under bossy brows, two soft horn nubs, never toothy, five
  **frost-white** claws a forepaw, wings folded. Bold and bossy, sure he is in charge. Poses:
  **`hidden`** (in the long grass, nothing of him showing but the grass bent where he is: the "PSST!"
  panel), **`tail`** (only the tip of a scaly silver-white tail flicking up out of the grass), **`flat`**
  (flat on his belly in the grass, chin down, spying), **`point`** (one claw pointing: "You, otter: stop
  wiggling."), **`call`** (head up, mouth a round O: the roll call), **`puff`** (chest puffed out, a
  grass seed falling off it), **`droop`** (head low, tail drooping), **`sit`** (all of him: what an
  unknown pose draws, for his book page), **`pawup`** (one forepaw raised, five claws; reports `paw`,
  `lit: n` lights the claws frost-white). Every mood. Extra **`grass: true`** (a tuft of long grass on
  his head, between his horn nubs). Speaker "Sleet"; Read to me high, quick and loud.
- **The starry cat** is not new cast (brief: nobody else new): a `clancat` with the extra **`starry:
  true`**, drawn in starlight whatever her coat: pale blue-white, a little see-through, small stars
  inside her outline, a soft glow at her edge, a kind face; nobody she knows (not Tallyheart's torn ear,
  not Glintstar's silver). Her balloon carries `name: 'The starry cat'`.

### The cast from before, new poses and extras

- **The old tom** (`grizzled`): `holds: 'pinecone'` (a big pinecone; `holdAt: 'chin'` under his chin,
  lying asleep on it; `'paws'` at his front paws; `'mouth'`, carried as he shuffles out on the watch)
  and `tap: 'pinecone'` (the held pinecone marked for the first Tap). "Holds" a pinecone is a cat
  extra, so any cat could.
- **Riffle**: the new pose **`puff`** (cheeks puffed round, holding his breath, eyes wide);
  `holds: 'string'` (a reed string of three fish hanging from one forepaw, the pile set's
  `PC.art.prey.string`, eyes shut, nothing through a fish); `holds: 'pebbles'` (three plain round brown
  pebbles held in his forepaws), with `holdAt: 'paws'` the three set down neatly on the ground in front
  of his feet; `tap: 'pebbles'` (the pebbles he holds) and `tap: 'cheeks'` (his puffed cheeks, in
  `puff`). `juggle` keeps its three. Never the frightened tail-hug in a frame that names Coil.
- **Our cat**: `tap: 'paw'` (her raised forepaw in `pawup`: the wave back, the pat on the sand) and
  `tap: 'ears'` (her ears: "Tap your ears to listen"). Tail up by mood `proud` (as Tallyheart's).
- **{Murmur}chime**: bounding down from the rim (no cat pose leaps: `walk` or `stretch` at a custom
  spot on the slope, section 10); `puffed: true` at "What is ReedClan after?"; walking round and
  round, then sleepy.
- **Tallyheart**: no new art. The told path's "Tallyheart's tail curls round you." and the watch's
  "Tallyheart's tail tickles her nose." are captions only: no art draws a tail round or across another
  cat (cats.js's tails are the cat's own, `MOOD_TAIL`). Where she is in the panel, she sits pressed
  close beside our cat in mood `kind`, and on the watch beside {Murmur}chime.
- Sprinkle, the grey tom, Glintstar, the black-and-white apprentice, the dogs: poses they have.

### Counts art (`app/art/cats.js`)

- **New, `kind: 'roll'`**, Sleet's roll call (the chapter's one new counts picture, as chapter 5's
  bumps and herons were): `groups` little dragonets in one row (seven for the riddle, one to five for a
  borrowed question), each plain and pale, all the same (no clutch colours: nobody unmet is spoiled),
  with three **HERE!**s lettered over every head; `highlight` lights the HEREs in order, a dragonet's
  three at a time under the help; label "N dragonets, three HEREs each". Help is the picture
  (`help: 'picture'`): nothing is scratched.
- **New, Sleet's forepaw**: a `who` of one `sleet` on the 5s (as Puddle's and Wisp's): his one raised
  silver forepaw in the long grass, five claws lit frost-white.
- **New, ReedClan coats in the patrol picture**: the table-3 picture (three walking cats a patrol,
  rows of five patrols) already takes `who` per cat; it must draw `reedclan` entries (variants 1 to 4)
  in their coats (`whoSpec`, which today draws any cast id but `player` and `clancat` as its one
  preset: it must read `variant` for `reedclan`). No Counts set puts `sloshbank` in a `who` (`REED9` is
  `reedclan` only), so the picture needs no Sloshbank.
- From before, unchanged: the patrol picture for every 3s question and both skip-counts (totals,
  next glow); the 9s with hop and tuck and `who`; the prey rows; the sand at `per: 3` (three marks a
  patrol, on sand or earth).

### Heard, not seen

The fox (only his old smell and Sleet's telling); the small diggers (only Coil's "Scrape, scrape");
the wind chime's ring (no sound effect: the story has none).

## 5. Build notes

General rules for the story builder, then screen by screen where a screen needs one.

- **Speakers.** The chapter's `names: { coil: 'The snake', sleet: 'The silver-white dragon' }`.
  Coil's "Hello… And THEN?" carries `name: 'A voice'` (Coil in the cast as `stone`); his first sight
  ("How… do… you… do.") is "The snake"; from Riffle's "Coil," on, his balloons carry `name: 'Coil'`.
  The long grass's "PSST!" and "HMPH!" carry `name: 'The long grass'` (Sleet in the cast as `hidden`, or
  `tail` on the fox trail's outcome); from "I'm Sleet. The eldest." on, `name: 'Sleet'`. Every speaker
  is in the frame's cast (chapter 5's test); `stone`, `hidden` and `tail` show no face in a stacked
  balloon (section 6).
- **Captions first, then balloons** (chapter 5's rule). Where the story puts narration after a balloon
  on one screen, the panel is split in two, or the narration opens the next panel (a `when` caption
  there if it is one path's), whichever keeps the frames under the cap. The screens where the order
  matters: "Twenty-seven lives… / Along the top of the Hollow…"; "I need a warrior! / {Murmur}chime
  bounds down"; "a warrior's work… / Your tail goes straight up"; "Looking VERY hard… / That was you.";
  "Except at night… / The ReedClan she-cat sits on his tail. “OW.”"; "PSST! / A silver-white snout pokes
  out"; Sleet's "Riddle first…" to "He puffs out his chest… Then his tail droops."; "It isn't a stone…
  How… do… you… do. / Then more of him. Then MORE of him." (`head`, then `longer`); "Light paws… /
  Riffle stops hopping."; the kept rule screen's "Your ears go hot."; "Who? / Everybody looks at
  Riffle."; "No juggling under my bridge. / Riffle still has three pebbles in his paws."; "Otter's
  honor / Sprinkle sniffs."; "Quiet, please. / Slowly, slowly, he slides back"; "Just checking / And
  off he shuffles."; "a GUARD thing / Soon he's snoring."; and, for a cat who has met Sleet,
  "He ALWAYS says that. / Her eyes shine." (the first caption of the next panel, before "So you tell
  her about the border", with `when: { foundSleet: true }`). "Snakes feel footsteps" is the Tap's own
  panel, its one balloon (her question on the panel before), so no lettering lies over her raised paw.
- **Paths in the picture.** A scene cannot vary by flag. On the told path Tallyheart is at the Barking
  Field, the last post and under the bridge; on the kept path she is not. Frame the shared beats so her
  spot is out of the panel (close shots: `border-fox`, and the bridge's `wall`, its own composition,
  which has none of her spots), and give a frame whose
  picture would include her spot in two, with opposite `when: { ch3Told }`s, as chapter 5's gulp. The
  frame cap (130 with Sleet) counts the frames one reading sees. Under the bridge, in every told `back`
  frame where Coil speaks, she sits across the nook from his gap, at a spot of her own (`{ x: 1250, y:
  900, h: 330 }`: in front of Sprinkle's tail, left of Riffle, listed after Sprinkle), never at `near`
  (after review: at `near` she sat between his gap and his balloons, and their tails crossed her face,
  so his lines read as hers). The arrival, where he says nothing, keeps her at `near`.
- **Sound effects** as the story letters them: *SNNNRRRK.*, *SKRITCH!*, *Drip. Drip.* (with `sfxAt` by
  Sloshbank's belly, so the drips are his), *Drip.*, *Gulp. Gulp. Gulp.*, *skritch, skritch* (lower
  case: small and pale). A caption that runs on into its sound gets `sfxRead`.
- **One-tap frames** (`scratch: { tap, prompt, label, miss?, next }`; the target is the cast extra
  `tap` of the same name). The story's response is shown by the next panel (as chapter 5's nose Tap):

  | Screen | `tap` (who carries it) | `prompt` | `label` | `miss` | Next panel shows |
  |---|---|---|---|---|---|
  | Asleep on guard | `pinecone` (grizzled, `holds: 'pinecone', holdAt: 'chin'`, `asleep`) | `**Tap** the pinecone.` | `Roll the pinecone.` | `SNNNRRRK!` | him awake, the pinecone at his paws |
  | The reeds close | `paw` (our cat in `pawup`, already waving; {Murmur}chime `proud`, tail up) | `**Tap** to wave back.` | `Wave back.` | — | the fox trail (the wave is the tap) |
  | Only stones | `stone` (coil, `stone`) | `**Tap** the stones to find the voice.` | `Find the voice.` | `drip…` | his head out of the gap |
  | Snakes feel footsteps | `paw` (our cat, `pawup`) | `**Tap** the ground, softly.` | `Pat the ground.` | `pat…` | her paw down on the sand; Riffle frozen mid-hop |
  | He watches me SLEEP | `eyes` (coil) | `**Tap** to wave at his eyes.` | `Wave at his eyes.` | — | her paw up before his open eyes |
  | No juggling | `pebbles` (riffle, `holds: 'pebbles'`) | `**Tap** to put the pebbles down.` | `Put the pebbles down.` | — | the three pebbles on the ground at his feet (`holdAt: 'paws'`) |
  | All the way out | `cheeks` (riffle, `puff`) | `**Tap** his puffed-up cheeks.` | `Tap his cheeks.` | — | "On the bank, he bursts." |
  | A rustle! | `ears` (our cat) | `**Tap** your ears to listen.` | `Listen.` | — | the old tom shuffling out, her ears toward him |

- **Asleep on guard.** The pinecone Tap on `pile`/`rows` (`PILE_SHADE`), the old tom lying at
  `pile-left`. The count's Counts frame: caption "He blinks." first, the old tom's two balloons and
  Tallyheart's (three: not said again over the question). Then `gap` with the dug earth (`dug:
  'big'`, the "scale" behind), then `wide` for Glintstar's "Twenty pieces in five nights."
- **Patrols.** The warm-up frame `intro: false`, the rim from chapter 5 (`rim()`), Tallyheart at
  `tree-far`. The patrol trotting by: three `clancat`s in `walk`, tails up, at three custom spots
  `{ x, y, h, z: 'behind' }` along the top of the Hollow, behind chapter 5's five sitters (who stay at
  `rim-1`…`rim-5`): after the final review on a line of their own, their feet above the sitters' heads
  (`y: 580, h: 170`, each walker in a gap between two sitters), since on the rim's far edge at the
  sitters' height the eight read as one clump. The four patrols' frame ("More patrols stop on the path
  to watch.") and the skip-count's show a second patrol of three stopped on the path at the left, a
  clear gap from the first, the same three coats in another order (none a rim cat's). The four
  patrols' frame: caption only, the question is the fact's. The skip-count on its own frame. The ask frame on
  `lesson`, `{ marks: 5, glow: 'auto' }`, its own `say` the two balloons before it. The lesson's Counts
  frame on `lesson`. SKRITCH! on `tree` with `{ marks: 6, glow: 'auto' }` (captions and sound), then the
  two-shot on `lesson` with `{ marks: 6, glow: 'auto' }` for "Patrols. That's your sixth Count." and the
  two `lessonClean` pairs (balloons with `when`); every `hollow` frame after them the same.
- **Your first patrol.** {Murmur}chime calls from the rim and bounds down (`wide`; `walk` or `stretch`
  at a custom spot on the slope). The walk on `title`/`wide` (`day`) at `wall-2`, `wall`, `wall-3`, the
  cast facing right (`facing: 'right'` on each): they walk away from the wall's near end, toward the
  far end and the reeds, so the leader is the rightmost, at `wall-3`. Tallyheart's count a whisper. The
  marching order is two outcome panels, `a` and `b`, the cats in that order on the wall: "Lead the way!"
  puts our cat at `wall-3`, Tallyheart ("right behind you") at `wall`, {Murmur}chime at `wall-2`;
  "Walk in the middle" puts Tallyheart at `wall-3`, our cat at `wall`, {Murmur}chime ("behind you") at
  `wall-2`. The panels after it show no order.
- **Three and three.** The end of the wall: `end` with `rustle: true`, then the three stepping out at
  `reed-1`…`reed-3`; Sloshbank's close beats on `meet` (our three at `end-1`…`end-3`; Sloshbank at
  `reed-1`, the young tom `reed-2`, the she-cat `reed-3`). The worry lines and the noticing line are
  captions with `when`. The watchers' Counts frame on `meet` with `player` and `sloshbank` in it. The
  card `reed-pile` on the admission's frame. The wave: `end` with `rustle: true`, the reeds already
  closed behind Sloshbank and the she-cat (nobody seen, the stems swaying where they went in), the young
  tom (`reedclan` 2) at `reed-1` looking back in `pawup`. (The rustle and the wave are both `end`'s, with
  our cat in the panel for the wave's Tap: the set has no close-up of the reeds.) At "The ReedClan
  she-cat sits on his tail" she sits pressed against the young tom's rear, at a spot of her own between
  `reed-2` and `reed-3`, whole in the panel, calm; his eyes round (`wonder`). (Build review.)
- **The fox trail.** Told and kept openings as two frames (`when`); Murmurchime runs off. Riffle with
  `holds: 'string'` from the Barking Field to the bridge. The dogs on `dogs`. The fox smell and the
  tail: `border`, Sleet in `tail` at `grass`. The choice: option 1 `{ label: 'Follow the fox trail to
  the last post.', labelWhen: [{ when: { foundSleet: true }, label: 'Go and see Sleet again.' }], sets:
  {} }`, option 2 `{ label: 'Not today. Sprinkle’s fish are waiting.', labelWhen: [{ when: { foundSleet:
  true }, label: 'Not today. He’s spying.' }], sets: {} }`; option 2's outcome panel has Riffle's line
  and the long grass's "HMPH!" and goes on to the bridge.
- **The last post.** `border-two` and `border-fox`, our cat never past the post. Her news to Sleet is
  **one balloon** in eight forms, each with the full `when` of `foundSquall`, `foundPuddle`, `foundWisp`
  (true or false): "Sprinkle’s safe. Under the Old Bridge." and, in that order, "Squall’s on the
  tallest tower.", "Puddle’s under the otters’ raft.", "Wisp’s in the heron’s reeds." for each she has
  found (`false` matches a flag never set). The card on "I spy on the fox…". The last frame: Sleet in
  `pawup`, the forepaw skip, `sets: { foundSleet: true }`.
- **Under the Old Bridge.** The arrival and the wide beats on `back` with `{ prints: true, stones: true }`
  (`branch: true` on the told path's first panel only; `eyes: 'sprinkle'` on the kept path's; a `back`
  frame that shows one of Tallyheart's spots is two frames by `ch3Told`). The Sleet screen is two
  frames, `when: { foundSleet: true }` and `false`, one after the other (the gap's pattern). Coil's
  beats shared by both paths, from "You look round. Only stones." to "Quiet, please.", on `wall` (its
  own composition: our cat at `back-left`, Riffle at `back-right`, Sprinkle's head at `dragon`, Coil at
  `gap`; no spot of Tallyheart's in it), so they need no told/kept pair. The told-only frames ("And the
  ginger one…", the rule screen's told form, and the frame whose told form has "A snake's secret,"
  murmurs Tallyheart) are on `back` with `{ prints: true, stones: true }`, Tallyheart at her spot and
  Coil at `back`'s `gap` (every speaker in the frame's cast). Coil at `gap` from "Hello" on: `stone` until the Tap, then `head`,
  `longer`, `still`/`listen`/`think`, and `slide` at "Quiet, please."; never toward her. **Coil's first
  picture** (`head`, on `wall`): a head no bigger than the stone it was, mouth shut, no tongue, no
  fangs, tilted politely, with our cat, Riffle and Sprinkle in the panel; "more of him" goes sideways
  along the wall, away from them. The told path's "Tallyheart's tail curls round you." is a `when`
  caption on the stones Tap frame, and the picture is the same on both paths (no art draws the tail;
  section 4). Riffle hops, squeaks, juggles, never hugs his tail. `train: true` on "A whole train
  rumbles over." (`wall`). Coil's card on his secret's frame. Out: Riffle `puff` (the Tap), then `bank`
  for "THAT was the longest I've EVER been quiet!"
- **Eighteen guards.** `pile` at `sunset` (`rows: [10, 10, 10, 10]`), the whole Clan round it; the
  guards' Counts frame with Tallyheart and `grizzled`. The kept line ("You don't tell her what Coil
  said…") a caption with `when`. The watch at `night` with `moon: 6` on the frame "The moon comes out,
  a little fatter." (on `wide` or `low`, the cameras with sky) and after; Tallyheart at `behind`. "Tallyheart's
  tail tickles her nose" is the caption's: Tallyheart and {Murmur}chime side by side, no tail drawn
  across ({Murmur}chime at a spot of her own on `behind`'s line, on the side Tallyheart's tail is, both
  facing right, clear of the dug earth; and still there when the old tom shuffles out, so the first watch
  stays three). The old tom with `holds: 'pinecone', holdAt: 'mouth'` on the watch. At the den, the
  guards are three small walkers through the doorway ("three by three").
- **The threes thing.** The den at night, `{ bark: 'auto', hidden: true, stone: 'auto' }`, the
  `ch2Stone` captions; the bedtime skip; the grey tom asleep after it (`zzz`).
- **The starry cat.** `sky`/`walk` with `night`, `stars`: our cat at `star-1` walking, the starry
  cat (`clancat`, `starry: true`) at `star-2`. The choice's two outcomes: she purrs (`purr: true` and
  the `purr` effect), she looks down (`peer`). Then `sky`/`below`. Then the den `nest` at night, our
  cat curled. Chapter end: the dream input, `placeholder` free.
- **The book.** The story builder writes it; proposed (6 to 10 sentences on every path; the cat named,
  never two different he's in one sentence):
  1. On {name}paw’s fifth morning, the old tom was asleep on his pinecone, and twenty pieces were gone in five nights.
  2. Tallyheart taught {name}paw {their} sixth Count, patrols: the threes.
  3. On {their} first border patrol, {name}paw met Sloshbank of ReedClan, whose pile is robbed too, and left tidy.
  4. *(when `foundSleet`)* At the last post of the Barking Field, {name}paw found Sleet, the eldest dragonet, spying on the fox. Sleet heard the fox talk about a fine, dry den.
  5. Under the Old Bridge, Coil the snake traded a secret for some quiet: small diggers come and go under the pile every night.
  6. At sunset, Tallyheart counted out eighteen guards, six patrols of three. On the first watch, nothing happened at all.
  7. That night {name}paw dreamed of a starry cat on the Sky River, who told {them} to count what’s missing, and then ask who was there to see it.

  `book.dragonet: [{ id: 'sleet', name: 'Sleet', when: { foundSleet: true }, pose: 'puff', lines:
  ['Silver-white, the eldest, and in charge of EVERYBODY. He does the roll call.', '{name}paw found him
  at the last post of the Barking Field, spying on the fox from the long grass.', 'He says five, and that
  he’s in charge. Five more claws, counted.'] }]`. `dream: '{name}paw’s dream: “{dream}”'`; `noDream`
  e.g. `'{name}paw’s dream that night was as quiet as the first watch.'`.
- **Teaser** (chapter 7, not built): `{ title: 'Chapter 7: The Counts Don’t Lie', lines: ['Tomorrow, your
  sixth morning count, after a night of guards.', 'Will the pile still add up?'] }` (curious, never
  scary; no number). Chapter 5's teaser stands as it is (its title is this chapter's, and both its
  promises are kept).
- **Tests the story builder adds** (`tests/story-ch06.test.js`, beside chapter 5's): every set above
  exactly, and the fillers by the borrowing rule under `ch06-watchers` (that sentence, not the story's
  notes); 16 typed answers on the plain path and 17 with Sleet; the warm-up's hard pick (7 × 9 when
  nothing was hard; never 3 × 9, 2 × 9 or 9 × 10, even when chapter 2's 9 × 2 or chapter 4's 10 × 9 was
  slow); a missed 3 × 8 is still in `E.hardFacts(cat, 3)` after a quick 8 × 3; each lesson miss comes
  back two questions later and before its twin;
  `foundSleet` set only on the forepaw frame and read where section 1 says; `sleet-den` hidden without
  it; the link `reed-pile`–`tidy`; Coil's card hidden in the den; the eight forms of her news; every
  `ch3Told` frame pair; no frame that names Coil has Riffle in `hug`; Coil never in a pose that closes
  his eyes or shows a tongue; Sleet never on the Clan's side of the post; the fox in no frame; each
  one-tap target present in the art; nobody says weasel, tunnel or glass.

## 6. Engine needs

**No new key.** One engine behaviour changes, found by the review of the built chapter: **a Count
is learned when its own set is finished** (`E.learnedCounts`: the set `E.countSets` names, the
chapter lesson that teaches the table). It used to be learned once any finished chapter set used its
table, and chapter 6 is the first chapter to ask a story question on a new table before that table's
lesson: four patrols of three (`ch06-four`, f008) come before Tallyheart teaches the threes (f012), so
from f009 the Training Hollow offered "Patrols · the 3s" and the tree had six marks before f013's
"A sixth claw mark. SKRITCH!". Now the 3s are learned at the lesson. In chapters 1 to 5 each Count's
own set is the first of its table she finishes, so they read exactly as before (checked page by page,
told and kept, right and with misses). `tests/story-ch06.test.js` holds it.

Otherwise every interaction is one chapters 1 to 5 built: choices with `labelWhen`, typed answers,
`skip` (five and six groups, a dragonet's forepaw), `ask`, one-tap `scratch` frames with `miss`, frame
`when`, sticky `sets`, cards with `when` and `link`, `book.dragonet` with `when` and `pose`, the dream
input. Not engine, but code beside it (the words owner): `E.VERSION` to `'0.6.0 (chapter 6, <ship
date>)'` and its test; `PC.ui.speakers` gains the new speakers' names and voices (`coil` "Coil",
`sloshbank` "Sloshbank", `sleet` "Sleet", `reedclan` by variant), and `faceHidden` counts Coil's
`stone` and Sleet's `hidden` and `tail` poses as a face not shown (as Sprinkle's `eyes` and `hide`);
`PC.ui.flagWords` gains `foundSleet`. `tools/storyboard.mjs` gains words for every new name in
section 4, and the character's own where a shared word would be wrong: pose words are one global map
with a few per-character overrides, so `COIL_POSE` (all eight of his poses; the global `head` is
Puddle's and `slide` Riffle's) and `SLEET_POSE` (all nine), wired into the pose lookup and the dragonet
page's, and `OTTER_POSE.puff` (Riffle's cheeks, not Sleet's chest); every new pose also gets a plain
entry in `POSES`, which `--check-words` reads. Camera words `SET_CAMS.title` (`end`; `meet`, three
cats each side, not the global "two cats, medium"), `SET_CAMS.sky` (`walk`, `below`) and
`SET_CAMS.bridge.wall`; `TAPS` for `pinecone`, `paw`, `stone`, `eyes`, `pebbles`, `cheeks` and `ears`
(no earlier chapter taps those names, so chapters 1 to 5's storyboards do not move). The den's
`hidden` words and the field's border camera words stay as they are (section 7, item 12).

## 7. Known issues the text critics left

Checked against v0.4. Every other low of both rounds is fixed in the story as it stands.

1. **Puddle's alternative names** (README, "Puddle's name") still offer "Slosh", a half of Sloshbank.
   Build: nothing. Ship step: strike "Slosh" there, or note it is taken.
2. **The bedtime count stops at 18**, so 21 and 24 are never tapped (they are typed: 7 × 3, 3 × 7,
   3 × 8, 8 × 3 and Sleet's 21, and hopped in every 3s help). The editors' call (24 is chapter 7's
   sum). Build: six groups, as section 2.
3. **The plain path runs to 2,031 words** at its top (told), over "about 2,000" by 31, under chapter
   5's 2,044 by the same count. Accepted by the editors. Build: no line added beyond section 2's engine
   wording.
4. **The story keeps italic notes** on the help and retries (the brief's "the story only"). This spec is
   the build's contract for them; they agree, checked in Node, except where item 10 says.
5. **The ReedClan border needs a place** that no table had: the `title` wall's far end with reeds, a
   composition of an existing set (section 4), not a new place.
6. **Coil's first close-up is the one jump-scare shape** in the chapter. Build: section 4's drawing
   rules and section 5's first picture (small head, mouth shut, no tongue or fangs, polite tilt, friends
   in the panel, the body going sideways).
7. **Coil's card would give the kept path away** in plain view in her nest. Build: under the moss on
   every path (section 3).
8. **`foundSleet` is sticky on a reread**: a cat who met Sleet before and says "Not today" still
   carries his "five" to Sprinkle. Chapter 5's precedent; recorded in section 1.
9. **The watchers' picture** could be read as CrystalClan cats. Build: ReedClan coats (`REED9`).
10. **Two of the story's italic notes are superseded by this spec** (v0.2; she reads neither, and no
    line she reads changes). The lesson's "8 × 3 has no words of its own, so one new fact is timed on
    the question alone, for chapter 7's warm-up": 8 × 3 is a check (section 2), so a missed 3 × 8
    reaches chapter 7. The story questions' "unless an earlier question borrowed them": the borrowing
    rule under `ch06-watchers` is the one the build follows (the lesson between them ends the siblings'
    run). And one note now holds that v0.1 broke: the warm-up's "the 9s fact she found hardest in
    chapter 5" (the pick passes over 2 × 9 and 9 × 10, so it is always chapter 5's; section 2). The
    story builder follows the spec.
11. **Chapter 5's ReedClan watchers wore CrystalClan coats** (ch05 f076: `clancat` variants 2, 5 and 6,
    black, calico, and ginger with white), and chapter 5's art does not change. Sloshbank says those
    watchers were his patrols, but none of chapter 6's four ReedClan coats matches them. Build:
    nothing. They were far off, misty and faceless, and she never saw six of the nine.
12. **Two storyboard words stay chapter 4's.** The den's `hidden: true` prints "two of the pieces of
    bark under the moss, two corners showing", though chapter 6 hides three (Sprinkle's two and Coil's);
    and the field's `border-two` and `border-fox` camera words name Tallyheart and the fox, though on
    the kept path Tallyheart is not at the last post and the fox is never drawn. Changing either word
    would change chapters 4 and 5's storyboards, which must regenerate byte-for-byte. Build: nothing;
    chapter 6's storyboard is read with this note (the frames' casts say who is there).

## 8. What chapter 7 inherits

- **Where the story stands.** Bedtime on her sixth evening, after her fifth morning count: twenty
  gone in five nights, four a night, the back row's middle. Glintstar's guards are on: six patrols of
  three, sunset to sunrise; the first watch (Tallyheart at the back, {Murmur}chime, her) saw nothing
  but the old tom. Chapter 7 opens on the sixth count, robbed anyway: twenty-four in six nights against
  a dragon's sixty.
- **ReedClan** has been robbed too, "night after night", its pile left tidy, and gave no number (so
  nothing touches chapter 7's sum). Somebody is robbing both Clans; Glintstar knows ("ReedClan has
  been robbed too"). Sloshbank "will think about" telling CrystalClan when ReedClan finds the thief.
  The young tom waved. The Accord held.
- **Coil** told her (and, told path, Tallyheart) that small diggers come and go under the pile every
  night; he feels feet, not faces. He has always known about Sprinkle, has told nobody, never trades
  with foxes, and wants quiet: no juggling under his bridge ("Otter's honor"). Kept path: Tallyheart
  does not know what Coil said, and it "sits in your tummy like a hairball". Coil has said small
  diggers come and go under the pile (card `coil-diggers`, every path; on the told path Tallyheart heard
  it and called it "a thing to check"). Nobody has said tunnel or weasel, and no cat has guessed that
  the thief comes up from underneath: Tallyheart guards "the back". Sprinkle's big prints still lie
  beside the drag marks (`prints: true`) for chapter 7's comparison.
- **The dream** sent her toward a witness who was awake when the rain stopped, by Waffles' wind chime.
  No card: chapter 7 (or whichever chapter brings the third witness) gives Waffles' card and sets
  `fox-moon`'s `answers`. A noticing cat thought of Waffles in chapter 5.
- **Sleet** (if found): `foundSleet`, card `sleet-den` ("a fine, dry den": Reynard's words at the
  border), his page, his "five" told to Sprinkle. Not found: she saw a silver-white tail and heard
  "HMPH!", and Sprinkle said "My eldest brother LOVES long grass." A later chapter that offers him again
  (the Barking Field again, chapter 8's Hail) sets its own found-here flag, and chapter 6's recap line
  and page then need `{ foundSleet: true, chNSleet: false }`, as chapter 4's did for `ch5Roof`.
  **Who has met him**: Riffle, on every path that found him; Tallyheart too on the told path ("The
  eldest… And the bossiest."). **What he knows**: Sprinkle is safe under the Old Bridge, and where each
  sibling she has found is (her news: Squall on the tallest tower, Puddle under the otters' raft, Wisp
  in the heron's reeds, as her flags say).
- **A standing rule**: Riffle promised Coil "Otter's honor": from now on he is never in `juggle` under
  the Old Bridge (`under`, `back`, `wall`).
- **Flags**: `foundSleet` only. **Cards**: `reed-pile` (linked to `tidy`), `coil-diggers` (under the
  moss), `sleet-den`.
- **The Counts.** The 3s are her sixth Count ("Patrols · the 3s"; six marks on the tree). Chapter 7's
  warm-up is the 3s. `E.hardFacts(cat, 3)` reads every 3s pair in the whole log (any chapter, any
  Hollow round), and finds: any miss of a 3s pair in chapter 6 (8 × 3 is a check, so a missed 3 × 8
  survives a quick 8 × 3); a slow right 3 × 5, the only chapter-6 fact timed on itself (the step-offs
  from 3 × 2 to 3 × 8, 3 × 4, 3 × 7, the warm-up's 3 × 9 and the story questions have prompts; 1 × 3 is
  read under the frame's balloon; the pile's 3 × 10 and 8 × 3 are checks); and four older timed
  answers that chapter 6 asked only under a prompt, read first or as a check, so it never replaced
  them: chapter 5's 3 × 9 (the nines lesson, or a Hollow round of the 9s), chapter 4's 10 × 3 (the
  tens, or a round of the 10s), and 1 × 3 and 3 × 2 from any Hollow round of the 1s or the 2s
  (chapters 1 and 2 asked them only as read-first openers). Run: `editor.js`, C. Those are other days'
  facts, so a warm-up that says "Yesterday" needs `warmHard: { table: 3, at: 0, avoid: [[1, 3], [2, 3],
  [3, 9], [3, 10]] }` (or a `remembered` line with no "Yesterday" in it). Chapter 7 teaches the 6s
  (whiskers), each one twice a 3s fact, and 3 × 6 = 18 is already hers (the guards).
- **Drawn now**: Coil, ReedClan's speaker and patrol, Sleet, the starry cat; the wall's end, the last
  post's `grass`, Coil's wall in the bridge (`stones: true` on `back`, and `wall`), the dream sky, the
  pile's moon (`moon: 7` next).
- **A later chapter keeps** (copy into `docs/continuity.md`'s places table, "A later chapter keeps", at
  ship): every bridge `back` panel has `stones: true` (and `prints: true`, as before), and `wall` is
  always the stone leg; Coil sits at `gap` whenever he is there, never in a pose that closes his eyes;
  the pile's `moon` is the evening's age (7 in chapter 7) on any night, dusk or sunset panel with sky
  (`wide`, `low`); the den's `hidden: true` keeps Coil's card under the moss with Sprinkle's two; the
  `title` wall is walked facing right, toward the reeds.
- **Words on screen now**: fox country, the long grass, the fox trail, the last post, small diggers,
  first watch, second watch, roll call. **Names**: Sloshbank, Sleet; Coil seen. The starry cat is a
  description and stays one.

## 9. Calls made

1. **No new place**: the ReedClan border is a second composition of `title` (the old stone wall's far
   end, where reeds begin) and the dream a second composition of `sky`. Reason: the brief's budget
   (at most one new place, better none), and both are the places the story names.
2. **Coil's wall is an option** (`stones: true`) on the bridge's `back`, with a `gap` anchor, and
   **`wall` is its own composition** (v0.2), with `gap`, `back-left`, `back-right` and `dragon` of its
   own. Reason: chapters 3 to 5's `back` panels stay byte-identical, and Coil can be seen with Sprinkle
   in one picture; `back`'s fixed spots put Sprinkle between the two cats and span most of the width, so
   a `wall` camera inside `back` could not be closer, keep Tallyheart's spots out, or let Coil's body
   run away from the cats. As field.js's border cameras do, the close shot is its own picture.
3. **Sleet has his own anchor** (`grass`), not the fox's. Reason: he is close enough to talk across the
   post, and the fox's spot keeps its rule (never bigger than the cats beside the post) for the fox.
4. **The starry cat is a Clan cat in starlight** (`starry: true`), not new cast. Reason: the brief's
   "nobody else" new, and a description, never a name, labels her.
5. **ReedClan is new cast**: `sloshbank` and `reedclan` (four coats). Reason: the first ReedClan faces
   must read apart from CrystalClan, and the watchers' nine need coats of their own.
6. **Coil's card under the moss on every path.** Reason: it keeps the kept path's line true and reads
   no flag.
7. **The pile gets the moon** (`moon: 6`). Reason: "The moon comes out, a little fatter" is a caption
   over the pile; since chapter 5 the moon is in the picture.
8. **Four patrols at `table: 3`** (the sand hops), as the story says (the 3s are learned at the
   lesson: section 6). Reason: the story's help hops 3, 6, 9, 12.
9. **Sleet's lines the story does not word** come from his own: `againIntro` + `retryPrompt` split the
   story's retry as Puddle's were; `missLast: 'There!'` is his miss line without its last sentence (the
   story's own rule for a last miss); `again: ['You pass!']` (a missed filler's retry) from his right
   line; no praise. Reason: no default line in a dragonet's balloon.
10. **The warm-up's filler opens "One from yesterday."** and its help and praise are chapter 5's nines'.
    Reason: the story asks for chapter 5's help, and chapter 5's warm-up opened its fillers so.
11. **The story questions say no praise** on a borrowed filler (`praise: []`), as chapter 5's fish
    did. Reason: two quick easy ones, then the question again.
12. **Her news to Sleet is one balloon in eight forms**, each with the full `when`. Reason: the story
    asks for one balloon; a balloon cannot join parts by flag.
13. **One-tap responses are drawn on the next panel**; the wave back is drawn already waving.
    Reason: chapter 5's nose Tap did so, and no art answers `tap-hit` yet (a new art mechanism for six
    taps is not worth its risk).
14. **Speaker labels**: "A voice", then "The snake" until Riffle names Coil; "The long grass", then
    "The silver-white dragon" until "I'm Sleet"; "Young ReedClan tom". Reason: chapters 3 to 5's rule,
    a stand-in label until the story names a speaker.
15. **The watchers in ReedClan coats**, on the set (`who`), so the fillers keep them. Reason: they are
    ReedClan's patrols.
16. **The pile's fillers never show four or five full rows** (`avoid`). Reason: the morning pile has
    three full rows.
17. **The book's recap and Sleet's page are proposed here** (the story builder owns them). Reason: the
    recap's sentences must say what every path did, in the chapter 5 rule's terms.
18. **8 × 3 is a check** (v0.2). Reason: asked right after a missed 3 × 8's retry, a quick right answer
    is an echo, not a fact learned, and would hide the miss from chapter 7. The cost (a slow 8 × 3 goes
    unseen) is smaller: the 3s' Hollow rounds time all ten.
19. **The warm-up's hard pick passes over 2 × 9 and 9 × 10** (v0.2). Reason: its line says
    "Yesterday", and those two pairs' timed answers can be chapter 2's or chapter 4's.
20. **ReedClan's coats are their own** (v0.2), not the `clanVariant` rule. Reason: the scenes give
    `look` to `clancat` only, so the rule could never fire for `reedclan`; four marsh coats that no
    player's fur can be keep the promise with no plumbing, in the scenes and the Counts pictures alike.
21. **No `reeds` camera** (v0.2). Reason: no screen needs a close-up of the reeds (the rustle and the
    wave are `end`'s, and the wave's Tap needs our cat in the panel); one camera less to build.
22. **Tallyheart's tail is in the captions only** (v0.2): no art draws a tail round another cat.
    Reason: the budget; a caption carries it, and the pictures stay the same on both paths.
23. **The patrol walks the `title` wall facing right** (v0.2), the leader at `wall-3`. Reason: the
    wall's only visible end in `wide` is at the left, with no reeds, and `end` puts the far end at the
    left of the reeds with CrystalClan facing right: walking right keeps the journey one way.

## 10. For the orchestrator

- **Stubs before the build**: `app/story/ch06.js` only (a chapter with one `board: 'STUB.'` frame), its
  script tag in `index.html` after `ch05.js`, its `sw.js` `ASSETS` entry and a `CACHE` past the live
  value, and `docs/storyboard/ch06.md` generated from the stub (`node tools/storyboard.mjs
  app/story/ch06.js`): `tests/storyboard.test.js` requires a current storyboard for every
  `app/story/chNN.js`, so without it `node --test` fails for every owner from the moment the stub
  lands. The story builder regenerates it later. **No new set file**: every place is an existing set.
- **Can't be built literally, built nearly**: "it rolls out from under his chin" (the next panel shows
  it rolled), "her forepaw waves… {Murmur}chime's tail waves too" (drawn waving: the tap is the wave),
  "they go even rounder" (the cheeks: only the tap's flare), "a tap anywhere else pats the sand too"
  (`miss: 'pat…'`, the page turns only on her paw), "One stone in the wall wiggles, glowing softly"
  (the stone glows: the page gives a `pc-tap` mark its soft glow, and nothing wiggles a mark),
  "{Murmur}chime bounds down" (no cat pose leaps: `walk` or `stretch` at a custom spot on the slope),
  "Tallyheart's tail curls round you" and "Tallyheart's tail tickles her nose" (captions only; no art
  draws a tail round or across another cat: section 4).
- **Frames**: the story's For us estimates 111 told and 125 with Sleet; the told/kept pairs (section 5)
  and the captions-first splits are where frames grow. Keep a reading under 130.
- **README** (ship step): record section 9's calls under "Claude's calls under decision 46"; strike
  "Slosh" from Puddle's alternatives. **`docs/continuity.md`** (ship): section 8, the new words and names,
  the three cards, `foundSleet`, the 3s row of the Counts table, the six marks, section 8's "A later
  chapter keeps" in the places table, who has met Sleet and what he knows, and Riffle's standing rule.
- **`docs/build.md`** gets a short "Chapter 6" section from the words owner: the new art keys as built,
  pointing here for the rest.
- **Tests that count Counts** (the Hollow now offers six; the tree's `MAX_MARKS` holds) and chapter 5's
  teaser test (chapter 6 now exists) are the story builder's to update.
- Chapter 2 to 5's frames must render byte-identical: every new option is off by default, every new
  anchor and camera is additional, and no existing pose, extra or coat changes.
