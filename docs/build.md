# Build: how the chapters are made

*v0.3 · 2026-10-04 · Aron said "do your thing": build, storyboard and deploy chapter 1. v0.2: the review fixes. v0.3: chapter 2 ("build and ship", Aron, 2026-10-04): more chapters, new sets, otters and dogs, the save carried forward. The chapter 2 additions are in the last section, "Chapter 2 (v0.3)"; where it and an earlier section differ, it wins. That section was brought in line with what is built after the final review (same day).*

## Choices (Claude's, following Potion Lab's conventions)

- **A static web app, no build step, no dependencies.** Plain HTML, CSS and JavaScript, served
  by GitHub Pages from `main` at the repo root, like `ahmadia/potion-lab`. Planned URL (live once
  main is pushed): `https://ahmadia.github.io/potomac-crossing/`.
- **Works offline and installs on an iPad** (Share → Add to Home Screen): a service worker with a
  versioned cache. **Bump `CACHE` in `sw.js` on every change to a cached file.**
- **Separate from Potion Lab.** Both live on `ahmadia.github.io`, so they share localStorage; this
  game only ever touches the key `potomac-crossing.v1`.
- **No accounts, no server, no tracking.** Everything a child types stays on that device.
- **Graphic novel, drawn in code.** Each frame is a comic panel: an SVG scene (flat, papercut
  style) with caption boxes, speech balloons and sound effects lettered on top. Every frame also
  carries a written **storyboard** (`board`) for a future illustrator; `tools/storyboard.mjs` turns
  them into `docs/storyboard/ch01.md`. When real art exists for a frame, set
  `image: 'art/ch01/f001.webp'` on that frame (the UI shows the image instead of the drawn scene,
  with the lettering on top as before), add the file to `ASSETS` in `sw.js`, and bump `CACHE`.

## Files

```
index.html               app shell: markup, CSS, script tags
app/engine.js            pure logic, no DOM (Node-testable): state, tokens, flow, Counts, saves
app/ui.js                DOM: panels, balloons, choices, inputs, keypad, book, nest, grown-ups
app/art/cats.js          PC.art.cat + character presets + counts pictures + sand tallies
app/art/scenes.js        PC.art.render (sets, cameras, cast placement, effects) + vocab + art.kit, art.defineSet
app/art/sets/*.js        one set per file (chapter 2 on): pile, bridge, field, crossing, riverbank
app/story/chNN.js        one chapter each: frames, Counts sets, book recap, teaser
sw.js, manifest.webmanifest, icons/icon-{180,192,512}.png, .nojekyll
tests/*.test.js          node --test (engine logic; story ↔ art vocabulary; graph checks)
tools/storyboard.mjs     writes docs/storyboard/chNN.md from app/story/chNN.js (no arguments: every chapter)
tools/frames.mjs         renders a chapter's frames (the art only) to PNG through Quick Look, macOS
tools/shots.mjs          screenshots of the real game screens in Safari (safaridriver), macOS
tests/_load.js           loads the app/ scripts into Node in index.html's order
dev/gallery.html         every set, camera, pose and mood on one page, for checking the art
```

Every `app/` file is a plain script that attaches to one global, `PC`, and also exports for Node:

```js
(function (root) {
  var PC = root.PC || (root.PC = {});
  // ... PC.engine = {...} / PC.art.x = ... / PC.story.ch01 = {...}
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

Load order: `art/cats.js`, `art/scenes.js`, `art/sets/*.js`, `story/ch01.js`, `story/ch02.js`, `engine.js`, `ui.js`
(index.html is the source of truth; `tests/_load.js` reads it). Modern Safari
JavaScript is fine (iPadOS 16+); no modules, no frameworks.

## The frame (contract between story, art and UI)

```js
PC.story.ch01 = {
  id: 'ch01', number: 1, title: 'Through the Glass',
  start: 'f001',
  frames: {
    f001: {
      scene: { set: 'room', cam: 'cushion', opts: { door: 'closed' },
               cast: [ { who: 'player', pose: 'sit', mood: 'dreamy', at: 'cushion', facing: 'right' } ],
               fx: ['sunset'] },
      board: 'MEDIUM SHOT. Our cat sits on a round cushion by a tall glass door...',  // the storyboard
      caption: ['Every evening you sit in the same spot...'],      // narration boxes, in order
      say: [ { who: 'waffles', text: 'PSSST!', kind: 'shout' } ],  // balloons; who = a cast id in this frame
      sfx: 'CRASH!',                                               // optional sound-effect lettering
      next: 'f002'                                                 // exactly one of: next | choice | input | look | counts | end
    }
  },
  counts: { 'ch01-tails': { /* see Counts */ } },
  book:   { /* see Book */ }
};
```

Interaction (exactly one per frame):
- `next: 'f002'`: tap to continue.
- `choice: { options: [ { label: '…', sets: { spokeUp: true }, next: 'f031' }, … ] }`
- `input: { kind: 'petname' | 'clanname' | 'dream', suggestions: [...], next }`. `petname`:
  choose a suggestion or type. `clanname`: type the first part; a trailing "paw" is stripped; ideas
  only on request. `dream`: optional, can be skipped.
- `look: { next }`: the reflection chooser (she-cat or tom, fur, marking, eyes), with the
  player's reflection redrawn live in the panel.
- `counts: { set: 'ch01-tails', next }`: runs a whole Counts lesson inside this frame.
- `end: true`: chapter complete; show the book page.

Text tokens, filled from the player's profile: `{name}` (Clan-name first part, e.g. Moon),
`{name}paw` reads naturally, `{petname}`, and pronouns written as **`{they}` `{them}` `{their}`**
(she/her/her or he/him/his) with capitalised `{They}` `{Them}` `{Their}` and shouted `{THEY}`;
`{shecat}` → she-cat / tom. The player is mostly "you", so pronouns are rare.

State flags set by choices (all optional): `stepOut: 'chase' | 'slow'`, `spokeUp: true|false`,
`joinReason: 'learn' | 'count' | 'brave'`, `specialty: 'noticing' | 'sneaking' | 'climbing' |
'swimming' | 'friends'`, `worry: 'small' | 'water' | 'talk' | 'shiny'`.

## Art vocabulary (art must implement all of it; the story may use only this)

Coordinate space: every set is drawn in a 1600 × 1000 world. A camera is a 16:10 window onto it.
`PC.art.render(scene, ctx)` returns `{ svg, heads }`: one `<svg viewBox>` string for the panel,
and for each cast member its head position as `{ x, y }` in percent of the panel (for balloon
tails). `ctx.look` is the player's look (`fur`, `marking`, `eyes`, `sex`). It may also return
`keep: [{ x, y, w, h }]` (percent of the panel): what the picture is about (the claw marks), which
captions, balloons and sound effects stay off.

| Set | Cameras | Anchors (`at`) | Options |
|---|---|---|---|
| `room`: ground-floor home at dusk; tall glass patio door, round cushion, lamp, rug, plants; through the glass: lawn, hedge, fence, lamp post, glowing glass towers, airplanes | `wide`, `cushion`, `glass` (close on the glass), `outside` (looking out through the glass at the garden; tiny wild cats far off) | `cushion`, `floor`, `glass`, `doorway` | `door: 'closed'\|'open'`, `reflection: true` (player's reflection in the glass), `clan: true` (tiny Clan silhouettes in the garden) |
| `tower`: outside, looking up a glass tower at dusk; balconies; one ground-floor window | `up` (the ground-floor window at the bottom, a tiny balcony nineteen floors up), `balcony` (close on the balcony railing, city and airplanes behind), `balcony-close` (close on Waffles at the railing) | `window` (behind the ground-floor glass), `railing` | — |
| `garden`: the lawn between the patio and the hedge, dusk; fence with sparrows, lamp post, hedge with a gap, patio step | `wide`, `paws` (extreme close-up of paws on grass), `step` (the patio step, open door, the Tall One's legs), `fence` (the row of sparrows, a cat below), `lamp` (top of the lamp post), `meet` (two cats, medium), `hedge` (the gap in the hedge), `hedge-close` (close at the gap, framed on the first cast member's head; chapter 3) | `step`, `lawn`, `fence-foot`, `lamp-top`, `hedge-gap`, `doorway` | `sparrows: 12` (on the fence; the 13th sits on the lamp when `lampSparrow: true`), `dish: true`, `moth: true` |
| `camp`: the wild garden behind the hedge, last golden light; brambles arching over dens, ferns, mossy stone paths, a dry stone fountain in the middle, glass towers all around | `reveal` (wide establishing), `crowd` (cats staring), `fountain` (low angle up at the fountain top), `fountain-close` (close on the fountain top; a cat there fills the panel, head and shoulders), `entrance` (high angle down at the newcomer), `ferns`, `purr` (wide, whole camp) | `entrance`, `fountain-top`, `fountain-foot`, `crowd-left`, `crowd-right`, `ferns`, `center` | — |
| `hollow`: sandy hollow at the edge of camp under an old leaning tree; a sun patch | `wide`, `lesson` (two cats, medium), `sand` (close on the sand), `tree` (close on the trunk) | `sand-left`, `sand-right`, `sunpatch`, `tree` | `marks: 0\|1` (claw marks on the trunk), `glow: true` |
| `den`: the apprentices' den under an enormous rosebush, night | `outside`, `inside`, `nest` (close on one nest), `doorway` (from inside, looking out at the entrance) | `entrance-left`, `entrance-right`, `doorway`, `nest`, `sleeper-1`, `sleeper-2` | `weather: 'clear'\|'cloudy'\|'storm'` (cloudy: cloud covers the stars and moon, no rain) |
| `sky`: night sky over camp, the Sky River (Milky Way) | `up` (mostly sky), `cats` (from behind two cats looking up) | `ground-left`, `ground-right` | — |
| `river`: from the camp's edge toward the river at night: the Old Bridge's dark shape, water | `crash` (wide: lightning, a huge splash plume far off) | — | `splash: true` |
| `title`: the river at dusk, glass towers, a bridge, one cat on a wall | `wide` | `wall` | — |

**Cast** (`who`): `player` (drawn from `ctx.look`), `tallyheart` (big ginger tabby she-cat, torn
left ear, cream chest, amber eyes), `glintstar` (sleek silver she-cat, pale ice-blue eyes),
`waffles` (fluffy white pillow cat, flat face, copper eyes, a pink bow), `tallone` (the Tall One,
seen only from cat height: legs, slippers, a hand, a green watering can; never a face), `grizzled`
(old dark-brown tom, grey muzzle, scarred), `snorer` (skinny grey apprentice tom), `mutterer`
(small tortoiseshell apprentice she-cat), `snorter` (young black-and-white apprentice tom),
`clancat` (generic; `variant: 1–6` for six coat colours), `sparrow`, `moth`.

**Poses** (cats): `sit`, `stand`, `walk`, `crouch`, `curl`, `loaf`, `lookup`, `flat`, `lie`,
`fall` (tumbling over laughing), `stretch` (reaching up a tree), `peer` (leaning over a railing or
nose to glass). Sparrow: `perch`, `fluffed`. Moth: `fly`. Tall One: `stand`, `water`, `set-dish`.

**Moods** (cats): `neutral`, `happy`, `dreamy`, `wonder`, `worried`, `scared`, `sleepy`, `laugh`,
`stern`, `kind`, `proud`, `sniff`, `shout`, `solemn` (deadpan: level brows, half-closed eyes, closed
mouth).

**Facing**: `left` | `right`. **Size**: optional multiplier (default 1).

**Effects** (`fx`): `sunset`, `dusk`, `night`, `stars`, `skyriver`, `rain`, `lightning`, `glow`,
`purr`, `sparkle`, `zzz`, `motion`; the UI adds `shake` and `flash` itself.

**Counts art**: `PC.art.countsPicture({ table, groups, highlight })` draws `groups` cats in rows
of at most five, each carrying `table` of the counted thing (tails for the 1s), with the first
`highlight` things glowing. `PC.art.sand({ groups, per, counted })` draws scratches in sand, one
per thing, in clusters, the first `counted` lit.

## Counts (the times tables)

```js
counts: { 'ch01-tails': {
  table: 1, thing: 'tail', things: 'tails', teacher: 'tallyheart',
  facts: [[3,1],[1,5],[6,1],[1,1],[9,1],[1,10],[4,1],[1,7],[8,1]],   // asked in this order
  ask:   '{a} × {b}',
  praise: ['Ha! Easy, yes?', '…'], fast: ['You didn't even have to count that time.'],
  miss:  'There. We\'ll come back to that one.',
  done:  'Tails are easy. That\'s why we start with them. Tomorrow: ears.'
} }
```

Optional keys, each with a sensible default when it is missing:

| Key | What it is |
|---|---|
| `helpIntro` | Tallyheart's first line after a miss when the answer was close (the engine's `near`): one hop of the count off, `\|answer − right\| ≤ step` (1 on the 1s, 2 on the 2s: the hop the sand counts in), or exactly one group off (`= per`: the check's 8 or 24 for its two rows of eight; 10 or 12 there is not close): "Close. Let's scratch it out together…". |
| `helpIntroFar` | The same for an answer further off. Without it, `helpIntro` minus a leading "Close." |
| `missLast` | The miss line when the fact will not come back (its retries are used up). Default: "There. Now you've seen it counted." `miss` is used only when it really comes back. |
| `fast` | Lines for a fast answer (under `FAST_MS`, 4 s), never two in a row. |
| `fastAfterMiss` | Fast lines that are only true once the sand has been shown in this lesson ("You didn't even look at the sand that time"). After the lesson's first miss they lead, taking turns with `fast`. |
| `firstPrompt` | The chapter lesson's first question, in place of the generic "Three cats. How many tails?" (chapter 1: "How many tails on those three?"). The Training Hollow never uses it. |
| `remembered` | A line, or lines, for a right answer to a fact that was hard last time (Training Hollow). Default: "Last time {a} × {b} made you stop and think. Not today!" |

The rules, from `docs/module-1.md`: she **types** the answer on a big on-screen keypad (no
system keyboard); both orders appear; **no clock on screen**; a fast answer (under ~4 s) earns a
"didn't even have to count" line; after a miss, the sand picture counts it out with her one scratch
at a time (a tap on the picture counts along, one scratch per tap; it never skips to the answer),
shows the answer, and the fact **comes back exactly two questions later** (at most twice; it never
blocks). Near the end of a lesson, where fewer than two questions are left, filler questions go in
first: facts she already got right in this lesson, most recent first (else any other fact from the
lesson), marked `filler: true` and never counted as first asks. Every answer is logged with
`a, b, answer, correct, ms, helped, retry, at` (plus `filler: true` on a filler). A lesson is
recorded on the cat the moment its last answer is in. In the Training Hollow, up to three facts that
were hard last time (the most recent first ask was wrong, or right but slow) come early in the
round, at positions 1–3, and a right answer to one earns the `remembered` line. The lesson ends with
the claw mark.

## Book

The end of the chapter shows her book page: *{name}paw's First Moon*, chapter 1, a short recap
in story prose built from her choices, and her dream line. `book.recap` is a list of
`{ when: { flag: value }, text }` (no `when` = always). `book.dream` is the dream line's template
(default `'{name}paw’s dream: “{dream}”'`); `book.noDream` is the line when she skipped it. The
dream is tidied for display only (first letter capitalised, "i" and "i'm" as "I" and "I'm", a full
stop unless it already ends a sentence); `cat.dream` keeps what she typed. Printable on one page,
Letter or A4.

## Around the chapter

- **Who's playing?** Up to four cats per device, so a visiting friend never overwrites a save.
- **Back**: a big labelled "◀ Back" button at the left of every frame's bottom row, the same size
  as Next (invisible on the first frame, so Next never moves; a narrow row wraps with Back staying
  bottom-left). It steps back one frame at a time; a choice or a typed name can be changed, and the
  new one replaces the old everywhere, the book included. It is left off the keypad screen of a
  lesson, where a stray tap would leave a question (the bar's ‹ still works there). The game saves
  on every frame and resumes where she left off.
- **Read to me** (off by default; she reads herself): speech synthesis reads captions and
  balloons. **Bigger text** toggle.
- **The Training Hollow**, once chapter 1 is done: practise the 1s again, any time. A full round
  earns a nest treasure (moss, a feather, a shell, a shiny pebble …) shown in **My nest**; the
  claw mark on the tree glows after three rounds without help.
- **Grown-ups corner**: press and hold the small leaf at the right end of the top bar for about
  1.5 seconds (a short tap does nothing).
  Per-fact Counts results (attempts, right first time, helped, typical time), each cat's choices,
  reset a cat, version.
- Respect `prefers-reduced-motion`. Large tap targets. Works in iPad portrait and landscape and
  on a phone.

## Fonts

Captions and balloons: `"Comic Neue", "Chalkboard SE", "Comic Sans MS", ui-rounded, sans-serif`
(Chalkboard SE is built into iPadOS). Sound effects and titles: `"Bangers", "Marker Felt", Impact,
sans-serif`. The times-table numbers (the question, the answer box, the keypad, the counting-along
numbers) use **Andika** bold, `"Andika", ui-rounded, system-ui, sans-serif`: its 1 has a flag and
a foot and its 0 is plain, so 1 and 7 can't be mixed up (Bangers' 1 and 7 nearly match). All three
are self-hosted in `fonts/` (SIL Open Font License, texts alongside) and
precached, so the game makes no third-party requests and the lettering works offline.

## Chapter 2 (v0.3)

Chapter 2, *After the Storm*, is drafted in [`chapters/02-after-the-storm.md`](chapters/02-after-the-storm.md)
and built in `app/story/ch02.js` on the contract below. Everything above still holds unless this
section says otherwise.

### Chapters

Each chapter is one story file, `app/story/chNN.js`, defining `PC.story.chNN` with `id`, `number`,
`title`, `start`, `frames`, `counts`, `book` and `teaser`: the "coming soon" for the next chapter,
shown at the end of this chapter's book page and in the hub while the next chapter isn't built
(`{ title: 'Chapter 3: Under the Old Bridge', lines: ['…', '…'] }`). Every chapter has one, the
last one too, with at least one line (`tests/engine.test.js` checks; a placeholder chapter whose
frames are all `board: 'STUB.'` is skipped). Chapter 1's is chapter 2's: "Tomorrow, Tallyheart has
a new Count for you: **ears**. Somebody should count the prey pile, too." and "And what made that
enormous splash down by the river?" (nothing about the pile looking smaller: her count is meant
to catch that). Chapters are ordered by
`number` (`E.chapters()` returns them in order). Chapter n+1 opens once chapter n is finished.
`PC.debug.goto(frameId, chapterId?)` opens any chapter's frame (tools/shots.mjs uses it).

### The save, version 2

The localStorage key stays `potomac-crossing.v1` (renaming it would strand every save); the stored
object gains `version: 2`. Per cat:

| Field | v2 meaning |
|---|---|
| `chapter`, `frame`, `history` | the chapter being read, its frame, and that chapter's back-history |
| `lesson` | a lesson in progress: a chapter's `{ mode: 'chapter', frame, chapter, state }` (it resumes only at that frame of that chapter), or a Training Hollow round's `{ mode: 'hollow', state }` |
| `hollowWaiting` | a Training Hollow round in progress that gave way to a chapter lesson, `{ mode: 'hollow', state }`, or null (below) |
| `places` | every other chapter she is partway through, by id: `{ ch02: { frame, history, lesson } }`, kept while she reads another chapter (below) |
| `finished` | `{ ch01: at, ch02: at }`: when each chapter's end frame was first reached |
| `dreams` | `{ ch01: '…', ch02: '…' }`: each chapter's dream, as typed |
| `flags`, `choices` | one object for all chapters (chapter 2's flags sit beside chapter 1's); a choice is remembered under `'ch02:f031'`, so chapters that reuse frame ids never collide |
| `lessons` | finished lessons by set id (`ch01-tails`, `ch02-tails`, `ch02-ears`, `ch02-pile`, `ch02-check`) |
| `hollow` | `{ rounds, byTable: { '1': { rounds, cleanRounds, glow }, '2': { … } } }`; `rounds` counts every round and picks the next treasure |
| `nest` | treasure and gift ids, in the order found |

**One place per chapter.** Going to another chapter parks the one she leaves in `places`
(`E.startChapter`, `E.openChapter`), so reading chapter 1 again never moves her place in chapter 2.
The hub's big button opens the furthest unfinished chapter with `E.openChapter`: where she left it
("Keep reading Chapter 2", with its page), or at its start. A finished chapter is never parked:
"Read chapter 1 again" starts it from its first page. Back stays inside the chapter being read.
The one `lesson` slot is shared with the Training Hollow: a chapter lesson that gives way to a
Hollow round (`E.holdLesson`) waits in its chapter's place with `frame: null`, and
`E.lessonAt(cat, story, frame)` hands it back at its counts frame. The other way round, a Hollow
round in progress that a chapter lesson takes the slot from (`E.lessonAt`, or `E.beginLesson`: Camp,
the Hollow, a few answers, Camp, "Keep reading") waits in `hollowWaiting`, and `E.hollowRound(cat)`
hands it back when she opens the Hollow again, the chapter lesson waiting in turn; a round whose last
answer is in is counted then instead. `E.place(cat, id)` is her place in any chapter, being read or
parked.

**Counts frames close together** (chapter 2's warm-up, ears and pile are a page or two apart). Back
past a lesson in progress leaves it in the slot. Next on a Count she finished before
(`E.finishCounts`) empties the slot only of that frame's own lesson, never a lesson going on further
in the chapter, nor a Hollow round. A lesson started on a Counts frame ("Let’s count!", or "Count
them again" on a finished Count) goes through `E.beginLesson(cat, story, frame, state)`: a chapter
lesson still going at another frame waits in the chapter's place, as for a Hollow round, and
`E.lessonAt` hands it back at its own frame, at the same question. A place holds one waiting
lesson: when two are going in one chapter, a first go at a Count is kept over a Count counted again
(that Count is finished already; its frame offers "Count them again" and "Next" as before), else
the newer. So a first go is never lost: `tests/engine.test.js` checks it on random walks through
the buttons, with reloads, the Hollow and chapter 1 read again; a Hollow round is never dropped either.

A saved lesson, in the slot or in a place, is kept only when the runner can take it up
(`E.okLesson`: a queue of facts with numeric `a` and `b`, a whole-number `pos` inside it, a `log`
list, a `requeues` object); anything else is dropped by `E.migrate` (the place stays), so a hand-edited
or half-written save never reaches `E.lessonAt`. `E.migrate` turns a version-1 cat into this, losslessly and idempotently: `done: true` →
`finished.ch01 = doneAt || 1`; `dream` → `dreams.ch01`; `hollow { rounds, cleanRounds, glow }` →
`hollow.rounds = rounds` and `hollow.byTable['1'] = { rounds, cleanRounds, glow }`; a choice
`f031` → `ch01:f031`; `places` starts empty (as it does for a version-2 save from before places). A cat that
finished chapter 1 opens on the hub, where chapter 2 waits; a cat partway through chapter 1
(mid-frame or mid-lesson) resumes exactly where it was. `tests/engine.test.js` runs real
version-1 saves (finished, partway, mid-lesson, mid-Hollow-round) through migrate, load and save,
and checks nothing is lost. `E.VERSION = '0.2.0 (chapter 2, 2026-10-04)'`.

### New in the frame contract

- **`skip: { table, groups, who?, teacher?, thing?, things?, next, done? }`**, an interaction like `next`: skip-counting. The
  panel shows `PC.art.countsPicture({ table, groups, highlight, totals: true, next: true, who })`,
  the next group glowing softly. A tap on the glowing group (a generous target: its whole column of
  the picture, a little wider than it) lights its things, adds its running total under it, and grows
  a big number over the picture (2, 4, 6…), while the teacher's balloon keeps the count ("2… 4…
  6…"); Read to me says each number. A tap anywhere else makes the glowing group wiggle, with no line
  and no penalty; Space, Enter and → count the next group too, and a hidden "Count the next cat"
  button does it for VoiceOver. Nothing can be got wrong, and nothing is logged as an answer. After
  the last group, a frame with a `done` line (the teacher's) shows it and Next; without one (chapter
  2's), the page turns to `next` on its own, and that frame shows the number reached, big, over its
  picture. Back works as on any frame. `who` (optional) lists who sits in each place, left to right:
  `[{ who: 'clancat', variant: 1 }, …, { who: 'grizzled' }]`. `teacher` keeps the count (default:
  whoever speaks first on the frame, else Tallyheart); `thing`/`things` name what is counted
  (default `ear`/`ears` for the 2s, else `thing`/`things`). In the storyboard the scene is the one
  the picture stands for (the five rim cats); in play the counting picture replaces it.
- **`gift: 'riffle-stone'`**: reaching this frame puts that gift in her nest, once (Back does not
  take it away). Gifts are `E.GIFTS` beside `E.TREASURES`, `{ id, name, from }`; My nest shows
  them first, under "From friends". Riffle's stone: "Riffle’s lucky stone: dark and smooth, with a
  white stripe all the way around", from Riffle. No Hollow treasure is striped (the pebble is "A shiny
  speckled pebble", id `pebble` as before), so the stone stays one of a kind.
- **`when` on lines and options**: a caption may be a string or `{ when, text }`; a balloon may
  carry `when`; a choice option may carry `when` (hidden when it doesn't match; a choice keeps at
  least one option). `when` matches as in the book recap (`E.matches`: flags, then look, then the
  cat's fields), plus two lesson keys: `lessonClean: 'ch02-tails'` (that lesson finished with no
  help) and `firstTry: '10x2'` (her most recent first ask of that fact, in either order, was right
  without help); and `not`, which matches when what it holds doesn't (`{ when: { not: { lessonClean:
  'ch02-tails' } } }`; it nests and sits beside other keys). The storyboard prints each condition
  beside its line.
- **Scene options from the cat**: on the `hollow` set, `marks: 'auto'` (one mark per Count she has
  finished a chapter lesson for, at most six) and `glow: 'auto'` (a list: each mark glows as its
  Count's Hollow glow), and on the `den`, `stone: 'auto'` (Riffle's stone where she put it: the flag
  `ch2Stone`, `'nose'` or `'chin'`; not chosen yet, between her paws), are filled in by
  `E.resolveScene(scene, cat)`, which the UI calls before drawing; the story's own scene is never
  changed, and values other than `'auto'` stay as written.
- **Cast extras** (a cast member may carry them; the storyboard prints them): `flatEars: true` (a
  cat's ears laid flat whatever the mood: the old tom on the rim, f020); `holds: 'stone'` (Riffle's
  stone, drawn by `cats.js` with the cat: at the front paws when sitting or lying, in the mouth on its
  feet; `holdAt: 'paws' | 'mouth' | 'chin' | 'nose'` to say; the `sparkle` effect then twinkles on the
  stone itself); `purr: true` (with the `purr` effect, only the cast members marked purr: rings, sound
  arcs and "purrr" are theirs, and an arc never crosses a neighbour beside them; nobody marked is
  chapter 1's whole-camp purr); `lift: true` (on the tower's `balcony` camera, a cat lifted onto a
  pouf so her face clears the rail, as Waffles flopped on her back; `balcony-close` lifts anyone whose
  chin would sink behind it). `scenes.js`'s `charOpts` passes `flatEars`, `holds` and `holdAt` to the
  drawing; `purr` and `lift` are the scene's.
- **A spot of its own**: `at` may be `{ x, y }` in the 1600 × 1000 world instead of an anchor's name;
  its height comes from the anchors' depth there. Use it for a one-off; a place used twice gets a
  named anchor (f097a's spot, our cat just out of the shadow beside Tallyheart, became the bridge's
  `sun-edge` once f100a and f101a needed it too).
- **For story writers, also**: a balloon's `kind` is `say` (default), `shout`, `whisper` or `think`,
  and `name` labels a speaker the story hasn't named yet (chapter 1's "The ginger cat"). The nth
  balloon from a `who` belongs to the nth of them in the cast (hidden ones still count), so two
  otters in one frame each speak from their own head. A sound effect in lower case ("sniff…
  sniff…") is lettered small and pale; lightning with a loud one shakes and flashes the panel. A
  choice may carry `prompt` (a line above the options); a dream input may carry `placeholder`.
- **Keys** turn pages as taps do: Enter, Space, → and ← are ignored for a moment after a screen is
  drawn (the double-tap guard), and a held-down Enter or Space never repeats (`PC.ui.keys`), so one
  press on the title never runs on through the hub into chapter 2.

### Counts sets, new keys

All optional; chapter 1's set needs none of them.

| Key | What it is |
|---|---|
| `unit`, `units` | what a group is in the generic question: `'cat'`/`'cats'` by default; the pile uses `'pair'`/`'pairs'` |
| `picture` | `{ kind: 'cats' \| 'prey', layout: 'stacks' \| 'rows', thought }` for every fact: `kind: 'prey'` draws prey, `layout: 'rows'` draws `groups` rows of `per`, `thought: true` frames it as a thought cloud (the old tom's boast) |
| facts as objects | `{ a, b, table?, groups?, per?, picture?, who?, lit?, light?, check?, prompt?, retryPrompt?, right?, rightAgain?, rightPicture? }`: `table` when the fact belongs to another Count (mixed lessons); `groups`/`per` override how it is pictured (2 × 8 as two rows of eight); `who` puts these characters in the picture's places (3 × 2: the first three rim cats); `lit: n` lights the first n things as it is asked (2 × 6: the first five cats' ten ears); `light: 'groups' \| 'rows'` lights the picture a group or a row at a time as it is asked, with no number (the pile's stacks as she noses them, the check's two rows); `check: true` goes on its log entry, and `E.hardFacts` skips a right one (its clock ran over a long prompt, or the answer was on screen); `prompt` replaces the generic question on its first ask (a string, said by the teacher, or a list of lines: balloons `[{ who, text, kind? }]`, and `{ kind: 'caption', text }` for narration, lettered as a caption box above the keypad, as 8 × 2's "You touch your nose to each little stack."); `retryPrompt` keeps a prompt on the retry (`true`: the same one, after "Here’s that one again."), which otherwise is asked plainly; `right` is a list of balloons shown after a right first answer, instead of praise; `rightAgain` the same for a right retry (`true`: its `right` lines; a fact with `rightPicture` keeps its `right` lines by default), instead of the `again` line; `rightPicture` redraws the picture after a right answer (`{ groups, per, picture }`: five pairs of ears sliding into two rows of five), in rows unless its `picture.layout` says otherwise |
| `fillFrom` | a set id, in this chapter or another: when this set has too few questions left for a retry to come back two questions later, the fillers are her right answers from that set (most recent first), else its facts. The warm-up fills from chapter 1's `ch01-tails`, the pile sets from `ch02-ears`, so a missed question gets the sand and still comes back two questions later. A borrowed question is asked as its lending set's (`E.questionDef`: its picture, words, praise and fast lines) and logged with `from`. While another is left, a filler is never the missed pair, a pair still ahead, a pair this lesson asked, nor one its sibling sets (the chapter's sets that borrow from the same set: the pile and the check) asked in this reading (`E.siblingAsked`) |
| `fillIntro` | said before a borrowed question, then that set's generic question: "One from last night." (the warm-up), "One from this morning." (the pile and the check) |
| `rememberedSlow` | the line for a right but slow answer to a hard fact (the Hollow's, or the warm-up's `warmHard` pick): "{a} × {b} again, and you got it. It’s getting easier." by default; `remembered` is said only to a quick one (under `FAST_MS`) |
| `warmHard` | `{ table, at, alt }`: the warm-up adapts. If `E.hardFacts(cat, table)` has a fact, it takes position `at` (0-based), marked hard (so a right answer earns the `remembered` line); if that fact is the same pair as another fact in the set, that one becomes `alt` |
| `done: ''` | no closing screen: after the last answer the frame goes straight on (its `next` frame answers). Otherwise `done` is the teacher's last line, over the scene |
| `praise: []` | nothing said after a right answer (no empty balloon); the next question follows |
| `prompt` | the question for every first ask that has none of its own (after `firstPrompt`); `again` lines answer a right retry (default "There it is. You remembered that one.") |

Prompts and `right` lines may use `{a}`, `{b}`, `{answer}`, `{groups}`, `{per}`, `{thing}`, `{things}`;
praise, `fast`, `miss` and `again` lines `{a}`, `{b}`, `{answer}`; all of them the cat's tokens. A chapter lesson remembers its chapter and frame (`lesson`, in
the save), so frame ids that repeat across chapters never resume the wrong one.

### Art vocabulary, chapter 2

Coordinates, cameras and anchors work as above (a 1600 × 1000 world; a camera is a 16:10 box; an
anchor's `h` is a sitting cat's height there). New sets live in `app/art/sets/<id>.js` and register
with `PC.art.defineSet`, drawing with the painters in `PC.art.kit`. The time of day comes from `fx`
as before, plus `morning` (the morning after the storm, washed clean) and `day`. One new effect,
`bonk`: a pebble bouncing off the first cast member's head, stars circling the bump (f063).

| Set | Cameras | Anchors (`at`) | Options |
|---|---|---|---|
| `pile`: the prey pile in camp, a shady corner under an arch of brambles; the fountain's edge at the right; morning by default | `wide` (the pile left of centre, Clan cats crowding round, the fountain edge at right), `close` (the pile fills the panel), `low` (medium two-shot beside the pile) | `pile-left`, `pile-right`, `beside` (lying beside the pile, the old tom), `crowd-1`, `crowd-2`, `crowd-3`, `fountain-edge` (elevated, Glintstar rising) | `pairs: 0–10` (stacks of two; default 8), `lit: 0–10` (the first n stacks glow), `dug: true` (soft, lumpy, dug-up earth behind the pile), `vole: true` (one plump vole on the ground by the cat at the pile's left, nudged off the top of a front stack, which keeps only its bottom piece: the pile still adds up) |
| `bridge`: the Old Bridge (the rail bridge), its near (Virginia) end, by day: stone legs, an iron truss on top, brown swirly water, squashed reeds | `bank` (wide from the riverbank, the dark space under the near end at left), `mouth` (close on the dark from outside in the sun, a rock at the shadow's edge), `under` (inside the dark, her view: mud with deep drag marks running into the dark, dry ground further back, drips), `back` (the very back of the dark) | `bank-left`, `bank-right`, `reeds` (bank); `rock` (elevated: Riffle's rock), `edge` (the shadow's edge), `sun` (in the sunshine outside), `sun-edge` (in the sun just out of the shadow, beside `sun`) (mouth); `mud`, `inside` (under); `near` (back: a cat from behind, looking in) | `train: true` (an Ironsnake crossing on top), `eyes: 'none' \| 'open' \| 'blink'` (two big round shining eyes at the back; default none), `drag: true` (default), `drips: true` (default) |
| `field`: the Barking Field from the path outside its tall wire fence, by day: a muddy square of grass, and far inside it, in every camera, a hollow log nobody remarks on (chapter 8) | `wide`, `fence` (close on the wire, a nose squashed through, cats on the path), `dogs` (the dogs bouncing at the fence, seen from the path) | `path-left`, `path-right` (outside), `dog-1`, `dog-2`, `dog-3` (inside, at the fence), `field` (far in the field) | — |
| `crossing`: the Crossing at Gravelly Point: a rocky point where the river opens wide and shining, the otters' log raft tied with vines, airplanes low overhead | `wide`, `low` (looking up from the rocks: an airplane's belly and its row of round windows, enormous and very low), `rocks` (medium on the rocks), `raft` (close on the raft) | `rock-left`, `rock-right`, `rock-high` (elevated), `shore`, `pebbles` (by a heap of pebbles), `raft-1`, `raft-2`, `raft-3`, `water` (swimming) | `plane: 'none' \| 'high' \| 'low'` (default high), `pebbles: true` |
| `riverbank`: the river path below a muddy bank, by day: the glass towers shining, and upside down in the water; the tallest tower has a little red light on its roof | `path` (wide along the water), `water` (close at the water's edge), `roof` (looking up the tallest tower to its roof, the red light, sky), `slide` (the muddy bank down to the water) | `path-left`, `path-right`, `water`, `bank-top` (a head popping up over the top of the bank), `slope` | `plane: 'none' \| 'low'` (low over the river, its shadow on the water), `roar: true` (jagged sound lines from the tower roof), `light: true` (the red light blinks; default) |

Changes to chapter 1's sets: `den` gains `moon: true | false` (default **false**: her first night
is moonless, the case's "no moon that night"; chapter 2's nights are moonless too) and
`drips: true` (sun spots and dripping leaves, for the morning). `camp` gains `puddles: true` and
`rainFountain: true` (the dry fountain full of rain). `garden` gains `towel: true` (a folded towel
beside the dish on the step). `den` also gains `stone: true | 'nose' | 'chin' | 'auto'` (Riffle's
stone in her nest: between her paws, by her nose, under her chin, or `'auto'`, where she put it;
small in the wide cameras, never seen from outside). `hollow`: `marks: 0–6` (one claw mark per
Count, left to right), `glow: true | [bool, …]` (per mark), `depth: 0 | 1 | 2 | [n, …]` (fresh,
deeper, deepest; left out, every mark but the newest is deeper, the oldest most: "your first mark is
a little deeper"), five anchors on the rim, `rim-1` … `rim-5`, two more at the sun patch,
`sunpatch-2` (its far left) and `sunpatch-3` (its right edge, by the sand), and `tree-far` (past the
old tree's trunk, nearer than the rim: a teacher clearly apart from the five she counts). The tree
close-up leaves the canopy (far above it) out. `title` gains a second anchor on the wall, `wall-2`,
left of `wall`. `river` has one anchor, `bank`.

**Cast, new**: `riffle` (an otter pup: sleek brown, cream throat and chin, small round ears, long
whiskers, a thick rudder tail, webbed paws; bouncy), `otter` (`variant: 1` the old ferry otter,
grey muzzle and long white whiskers that trail in the water, a bit deaf; `2`, `3` other ferry
otters), `dog` (`variant: 1` huge and shaggy, `2` spotty, `3` tiny and mostly bark). Otter poses:
`stand` (upright on hind legs), `sit`, `scramble`, `swim` (head and back above the water), `float`
(on the back, tummy up), `juggle` (standing, pebbles in the air), `slide` (belly slide), `hug`
(hugging his own tail), `sun` (lying on his back, sunning). Dog poses: `stand`, `jump` (paws up on
the fence), `sit`, `bounce`, `howl`. Otters and dogs take every mood in the vocabulary (the nearest
expression where a mood has no exact one). Speakers: Riffle, The old ferry otter, An otter, The
shaggy dog, The spotty dog, The tiny dog.

**Faces**: `PC.art.render`'s heads carry `r`, the face's radius in percent of the panel width, for
every cat (a fifth of its 200 box, chapter 1's measure), Riffle, the otters and the dogs (the same
share of their head boxes), so balloon tails and the lettering fit an otter's or a dog's face; the
UI keeps it between 1.8 and 16 and no longer estimates it from the markup. The sparrow, the moth
and the Tall One have small fixed sizes in the UI.

**No Clan cat wears her coat**: she must find herself at a glance, and a Clan cat in her fur beside
her reads as her twin (the rim's brown tabby beside a cat in the first default look, f020–f025). A
Clan cat whose coat is her fur (a brown tabby when her look names none) is drawn in a spare coat
that no other Clan cat in the same picture wears (`PC.art.clanVariant(variant, look, taken)`): in
the scenes, which know her look, and in the Counts pictures' `who`, which the UI gives her look, so
a rim cat keeps one coat from the panel to the counting picture. The named characters keep theirs.

**Counts art**: `PC.art.countsPicture({ table, groups, per, highlight, kind, layout, totals, next,
who, thought, look })`: `per` defaults to `table`; `kind: 'prey'` draws `groups` stacks (or rows, with
`layout: 'rows'`) of `per` prey: mice and voles as soft round shapes with their tails tucked in,
every eye shut, no blood (no fish); `highlight` lights things in order; `totals: true`
puts each lit group's running total under it (2, 4, 6…, Andika bold); `next: true` glows softly on
the next group to count; `who` places those characters, left to right, in place of the Clan
cats; `thought: true` frames the picture as a thought cloud under an evening sky. `PC.art.prey({
kind: 'mouse' | 'vole', lit, seed, facing?, part? })` returns `{ svg, w, h }`, one piece of prey in
its own box, feet at the bottom centre: the pile set and the prey pictures draw the same prey with
it, mice and voles only (CrystalClan doesn't fish; `fish` stays drawable, unused, in case Aron keeps
a few, traded from the otters, which the text would then have to say). `PC.art.sand({ groups, per,
counted, layout?, ground? })`: `layout: 'rows'` scratches `groups` rows of `per`, lit a column at a
time (the check's two rows of eight); `ground: 'earth'` scratches them in the earth beside the pile.

### The rest

- **Hub**, after any finished chapter: Read my book · The Training Hollow · My nest · Read a chapter
  again (the finished chapters, each from its first page) · the next chapter as the big button
  ("Chapter 2: After the Storm"; "Keep reading Chapter 2 · After the Storm · page 7" once she has a
  place there, even while she reads chapter 1 again), or the teaser's title "… is coming soon" when
  it isn't built.
- **Book**: one book, *{name}paw’s First Moon*: the title and portrait once, then a page per finished
  chapter (heading "Chapter N: Title", that chapter's recap, its dream line), then the latest
  chapter's teaser. Printing puts each chapter on its own page.
- **Title screen** names the chapter the last cat is on; **Who's playing** cards say
  "Chapter 2 · page 7" or "Chapter 2 finished" (the chapter being read, where her card opens).
- **Grown-ups corner**: each chapter's progress, all chapters' choices (with words for chapter 2's
  flags), per-fact Counts for every table, the Hollow per table.
- **The Training Hollow, per Count**: once a chapter's lesson is done, its Count can be practised.
  The Hollow offers each learned Count ("Tails · the 1s", "Ears · the 2s"), each a round of its ten
  facts as now, with its own "hard last time" picks and its own claw mark on the tree. Every full
  round earns the next treasure. Its scene shows `marks: 'auto'`, `glow: 'auto'`.
- **Flags chapter 2 sets**: `ch2SaidAloud: true | false`, `ch2Path: 'bridge' | 'river'`, and
  `ch2Stone: 'nose' | 'chin'` (where the stone went in her nest, f108; only the den's `stone: 'auto'`
  reads it, not the book).
- **Tools**: `node tools/storyboard.mjs --check-words` fails when the art's vocabulary has a set,
  camera, anchor, option value, pose, mood, effect or cast member the storyboard has no words for
  (a test runs it); a scene says the frame's own time of day. `tools/frames.mjs` renders through
  Quick Look, which drops a shadowed group too big for its filter buffer (its header). `tools/shots.mjs`
  reads the screen lock and, locked, takes each target in a fresh short session (its header).

## Chapter 3 (v0.4)

Chapter 3, *Under the Old Bridge*, is [`chapters/03-under-the-old-bridge.md`](chapters/03-under-the-old-bridge.md)
(v0.4), built in `app/story/ch03.js`. **Its "Build" notes are the engine spec for this chapter**
(the Counts sets and their keys, borrowed questions' voice and ground, `E.hardFacts` and reading
time, the tree, the tortie's labels, the book): build them as written, and record here, briefly,
each key as it is implemented. The names below are fixed so the art, the engine and the story agree.

**Engine, beyond the text's Build notes**: a frame may carry `when` (the same matching as lines):
a frame whose `when` doesn't match is skipped, forward and back, as if its `next` led straight on
(chapter 3's river-path screen for Sprinkle's littlest brother). Balloons may carry `digits: '7 × 8'`:
the numbers lettered small in Andika beside the balloon (the Warrior Counts she watches; never
typed, never logged). The book gains a page per dragonet found, `book.dragonet: { id, name, lines }`
on the chapter that finds it (Sprinkle in chapter 3), with the other six as silhouettes "still to
find". `skip` gains `paws: 'own'` (her own two forepaws on the moss, the glow taking turns) and
`keep: true` (the running totals stay under the groups after the last tap).

**Cast, new**: `sprinkle`, a Mistscale dragonet (the text's "Art needs" describe her): about a
heron's size (sitting, her head is well above Tallyheart's), long neck and tail, mist-grey matte
scales in soft ridges, a paler belly, big round shining eyes, two soft nubs for horns, never toothy,
five long pale claws on each forepaw, wings of fog-pale skin with the right one drooping and half
open (no wound). Poses: `eyes` (only her eyes in the dark), `unfold`, `hide` (face under her tail),
`sniff`, `sit`, `wings` (both open, the right drooping), `flat` (squeezed flat), `gulp` (head back,
gulping), `burp`, `pawsup` (both forepaws up, claws spread), `pawup` (one forepaw up), `draw` (one
claw drawing in the mud), `touch` (a forepaw laid gently forward), `peek`, `curl` (curled, her tail
wrapping round whoever is at the next anchor), `lie`.

**Moods, new for everyone**: `sad` (homesick, a wobbly mouth) and `shy` (eyes down, a small smile).

**Cast extras** (keys on a cast entry, passed through to the character): `holds: 'stone' | 'pebble'
| 'vole' | 'fish' | 'fish2'` (Riffle's stone; Sprinkle's egg-smooth grey pebble with a faint
green-blue cast, never banded; a vole in her mouth; one or two fish in Riffle's mouth); `tear: true`
(a misty tear); `mist: true` (a little cloud of breath, or a burp); `claws: true` (claws out on a
raised or forward paw); `puffed: true` (fur puffed double); `squeeze: true` (eyes squeezed shut);
`moss: true` (moss pulled over the ears); `flatEars: true` (as before); on a juggling otter,
`pebbles: 4 | 5` (four pebbles on the arc; five: four on the arc and the fifth, plain round brown,
in his paw; three by default, as in chapter 2). A vole in the mouth sits on the mouth (no mood mouth
drawn: a mouthful). New cat poses: `pawup` (sitting, one forepaw raised) and `tummy` (on her back,
paws in the air). New otter poses: `dive`, `hush` (a paw over his mouth). Sprinkle's `hide`: her tail
arches from behind her rump over her back and its broad end lies across both eyes, all the rest of
her in plain sight; her `sniff` pose draws the sniff lines whatever the mood.

**Sets**: `bridge` gains `pebble: 'in' | 'out' | 'paws'` (on `mouth` and `under`: Riffle's fifth
juggling pebble, plain round brown, in the dark, rolling out, at her paws; never grey, which is
Sprinkle's), `branch: true` (fallen branches heaped across the back, up to her chin, her face clear),
`eyes: 'sprinkle'` (on `back`: two eyes at her size, exactly where her face is at `dragon` in the
next panel; chapter 2's `open` and `blink` stay as they were), `hop: true` (on `paws` with `pawsIn`:
every paw's five claws lit gold, 5, 10 and 15 lettered beyond them in pile order),
`prints: true` (Sprinkle's big five-claw prints beside the drag marks in `under` and `back`; the
default wherever the drag marks are drawn), beams visible overhead in `under`; anchors in the
`back` composition `dragon` (Sprinkle's spot), `beside` (a cat pressed against her side),
`back-left`, `back-right` (besides `near`); and a camera `paws` with `pawsIn: true`: three forepaws
piled, fanned and offset so all fifteen claws show (her fur from the player's look, Sprinkle's grey,
Riffle's webbed brown). `pile` gains `dug: 'big'`. `tower` gains `chime: true` (a wind chime on
Waffles' balcony beside her geranium). `camp` gains `crowd: true` (the whole Clan crowded round
the fountain, rows of cats behind the named cast; in a close camera a crowd cat whose face the
panel's edge would cut is left out). `hollow` takes `marks: 0–10` and `depth`. The whole-camp purr
(nobody marked `purr`) draws its rings behind everyone (under the crowd in camp) and lifts a word
that would sit on a face to just above it.

**Counts art**: `countsPicture` learns the 5s with `who` (each forepaw in that cat's fur, the cat
small behind it; Sprinkle's paws bigger and grey), `kind: 'mud'` (little forepaws drawn in the mud,
five claw marks each), `paws: 'own'` with `look` (her own two forepaws, the glow taking turns).
`sand` learns `style: 'swipe'` (five short parallel lines a group) and `ground: 'sand' | 'earth' |
'mud'`.

### Engine and UI, as built (chapter 3)

`E.VERSION = '0.3.0 (chapter 3, 2026-10-06)'`; the save stays version 2 (nothing new is stored).
Each key below is checked by `E.checkStory` and tested on the fixture chapter 3 in
`tests/fixtures/chapters.js` (`tests/engine.test.js`, "chapter 3").

- **Frame `when`**: `E.shows(frame, cat)`; every page turn lands through `E.landing(cat, story, to)`
  (Next, a choice, an input, the look, a Counts frame's Next, a chapter's start), and Back passes
  over a page that no longer shows. A frame with `when` has exactly one way on (`next`); the start
  frame has none. `E.go` itself is exact (`PC.debug.goto` opens any frame).
- **Balloon `digits`**: a short line ("7 × 8", "56") lettered in Andika on a small tag hanging
  under the balloon's edge, on the side away from its tail (room is kept for it); in a stacked
  balloon, after the words. Never read as an answer, never logged.
- **Speakers**: `sprinkle` is "Sprinkle"; a balloon's `name` wins ("A small voice"). A named voice
  whose speaker isn't in the picture, or is there only as `pose: 'eyes'` or `pose: 'hide'` (her face
  under her tail), shows no face in a stacked balloon. A chapter may carry `names: { mutterer: '{Murmur}paw' }` (that chapter's label
  for a speaker with no `name` of its own); chapters 1 and 2 have none. Tokens `{Murmur}`,
  `{murmur}`, `{MURMUR}`: "Murmur", or "Mutter" when her own Clan name is Murmur (`{Murmur}paw`,
  `{Murmur}chime`, `{murmur}ing`, `{murmur}ed`). Read to me: Sprinkle at pitch 1.38, rate 0.86.
- **Counts keys**: `warmHard.alt` as an ordered list (a single pair keeps chapter 2's rule, so
  chapter 2 plays as it did) and `avoid` (both as the text's Build notes have them; when every
  hard fact is avoided, nothing is hard and the facts are asked as written); `ground: 'sand' |
  'earth' | 'mud'` (`E.helpGround`: the lesson set's, else earth for a prey picture, the borrowing
  set's picture for a borrowed question; the Hollow is sand); `helpCounter: 'you'`;
  `fillOrder: 'easiest'` (`E.fillPool(cat, set, stories, order)`); `fillVoice: 'borrower'`
  (`E.questionDef` keeps the borrower's voice and takes the lender's `table`, `thing(s)`,
  `unit(s)`, `picture`, `who`); `againIntro` (in such a set, a borrowed question coming back
  opens with its `fillIntro` instead: never "my dinner again" for 1 × 5); `helpIntroNotFive` (on
  the 5s, an answer ending in neither 0 nor 5: `res.notFive`); `done: null` as `done: ''`. The page's words come from the
  engine: `E.promptLines(def, D, q)`, `E.genericQuestion`, `E.helpPlan(def, D, q, res)` (first line,
  who counts, ground, `style: 'swipe'` on the 5s, the count). `PC.art.sand` gets `ground` and
  `style`.
- **`E.hardFacts(cat, table, stories)`** skips a right first ask read under a prompt
  (`E.readFirst(entry, stories, memo, opener)`: its own `prompt` in its set, or, asked as the
  first answer of its run of the set, the set's opener or a warm-up `alt` opener, when the set has a
  `firstPrompt` or its Counts frame has balloons); a miss still counts.
- **The skip-count on the 5s**: things default to claw/claws; VoiceOver's button "Count the next
  paw." `keep: true` (`E.keptSkip`): the page it turns to, the plain pages after it and the first
  Counts frame (until its lesson starts) draw the skip's picture, every group lit, `totals: true`,
  with their balloons beside it. `paws: 'own'`: `PC.art.countsPicture` gets `paws: 'own'`,
  `taps`, `lit` and `nextPaw` ('left' | 'right', from `E.skipView`) and no totals; the count is the
  player's (unless the frame names a `teacher`), in a whisper; VoiceOver: "Tap your next forepaw."
- **The tree and the Hollow**: `E.MAX_MARKS = 10`; the Hollow offers "Claws · the 5s"
  (`ch03-claws`, the 5s' own set), never the warm-up, the pile or Sprinkle's sets; its round
  definition drops `fillIntro`, `fillOrder`, `fillVoice`, `avoid` and `ground`.
- **The book**: `book.dragonet: { id, name, lines }` (`E.dragonets`, `E.DRAGONETS = 7`): once its
  chapter is finished, a "The dragonets" page after the chapters: the dragonet sitting
  (`PC.art.character`), its name and lines, a dashed box "Draw Sprinkle here", and the rest of the
  clutch as silhouettes, "Still to find". Printed on a page of its own.
- **Grown-ups**: `ch3Told`, and chapter 2's `ch2Stone`, in words (`PC.ui.flagWords`, filled with the
  cat's tokens). The light choices set nothing (`sets: {}`).
- **Borrowing, the bridge's way**: a `fillOrder: 'easiest'` set borrows only the five easiest
  (`E.EASIEST_POOL`: 1 × 5, 5 × 2, 5 × 3, 4 × 5, 5 × 5), never the lesson's hardest. Every borrowing
  set takes fresh pairs first; with none left, the next pair in the pool's order, as chapter 2 did;
  and an `avoid` pair only when nothing else is left (lesson state `avoid`, apart from the siblings'
  `asked`: the warm-up never borrows the pile's 9 × 2 while it has another). Chapter 2 has no
  `avoid`, so its fillers are as they were (the ninth golden script runs its pile and check out of
  fresh pairs).
- **Places**: a parked page that no longer shows (f081 after chapter 2 is read again on the other
  path) reopens where a page turn from it lands (`E.openChapter` uses `E.landing`). The bedtime hop
  (`paws: 'own'`) ends its murmur "…20…", trailing off.
- **The page**: a Counts frame that showed its balloons over a kept skip picture doesn't repeat them
  over the first question; the keypad scrolls into view when a long intro pushes it down; a kept
  picture sits on the lesson's sand. A crowded panel's fallback spot, and a chained pair placed as one
  block, still read after the balloon before them (`PC.ui.layout.readsAfter`). A sound effect shrinks
  to fit the panel (`PC.ui.layout.sfxFit`), and further, to half (never below 18px unless it started
  smaller), rather than cover a caption or a balloon; a face alone never shrinks it, so chapters 1
  and 2 letter as they did (f001's PLIP! at the nose), and once a balloon has made it shrink it
  shrinks on, if it can, to clear the faces too (`PC.ui.layout.sfxPlace`; f066's train along the
  top). The hub puts "… is coming soon" where the big button goes. A dream input's default
  placeholder is short enough for one line.
- **Chapter 2, changed by name** (`tests/fixtures/ch02-golden.json`, recorded with 0.2.0, proves
  the rest is unchanged): a borrowed ears question at the pile or the check is scratched in the
  earth; the Hollow's hard picks follow the reading-time rule (the old tom's quick 10 × 2 no longer
  clears a missed 2 × 10); so does the chapter 2 warm-up's hard pick (a slow but right 3 × 1, chapter
  1's opener read under "How many tails on those three?", is no longer its hard fact; a missed one
  still is); `ch02-ears`' `fastAfterMiss` says "scratches" (a line in `app/story/ch02.js`). The
  rule reads "opens the set" from where a fact was asked (the first answer of its run of the set in
  the log), not from its pair, so a warm-up's hard pick asked second is timed for itself even when
  its pair is the written opener or an `alt` (4 × 2, 2 × 2, 2 × 1; chapter 2's 1 × 4).
- **Tools**: `tools/storyboard.mjs` prints each of these where a chapter uses them (chapters 1
  and 2's storyboards are unchanged); `tools/shots.mjs` takes `STORY=fixture3` (the fixture
  chapter 3 in the page) and `DUMP=1` (each screen's markup, the art emptied, to diff the
  lettering before and after a change).
