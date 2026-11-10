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
app/story/warrior.js     the Warrior Counts (PC.warrior, not a chapter): its frames and lines
app/story/words.js       PC.words: module 2's table of words (the kit's English, the Spanish, sayAs); never a chapter
sw.js, manifest.webmanifest, icons/icon-{180,192,512}.png, .nojekyll
tests/*.test.js          node --test (engine logic; story ↔ art vocabulary; graph checks)
tools/storyboard.mjs     writes docs/storyboard/chNN.md from app/story/chNN.js, and warrior.md from app/story/warrior.js (no arguments: all of them)
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
  balloons. **Bigger text** toggle. Where the screen has little room (an iPad held sideways 1132px
  wide or narrower, or 800px tall or shorter, and taller than a phone's 500px; any screen held upright)
  the words beside or under the picture are 1.14 times plain instead of 1.2, on tighter lines (1.25;
  1.2 under 720px tall, Safari's tab bar showing) and in snugger boxes, so Back and Next share one row
  (a longer row, as on a chapter's last two pages or a Counts page, still wraps upward, Back keeping
  the bottom left; on a Counts page already counted, sideways, "Count them again" goes over Next, so
  Back and Next keep the bottom row) and
  every button, option and keypad stays on the screen without scrolling; upright, the options keep
  Bigger text's 54px, the stacked parts are a little closer, and so are the balloons under the
  picture, in snugger balloons. On a skip-count, on any screen, its "Tap to…"
  line sits beside Back while she counts. Nothing is sticky (a page of choices keeps Back under its
  options), and the panel and its words, and every page without Bigger text, are unchanged (index.html,
  "Bigger text where the screen has little room"; tests/aa-room.test.js). Her Case File's words are set
  the same way where room is little, and where a row of three or more cards is linked its middle column
  is at least 14em wide, so no word on a card breaks inside (Aa off too, for the one file that broke one).
  The Training Hollow's Counts (nine after chapter 9) are 56px tall and 8px apart on an iPad held
  sideways up to 860px tall (6px under 720px; with Bigger text, upright too, 54px and 6px), so the last
  Count and My nest are on the screen (the polish release, 2026-10-31).
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

## Chapter 4 (v0.4)

Chapter 4, *The Glittering Scale*, is [`chapters/04-the-glittering-scale.md`](chapters/04-the-glittering-scale.md)
(v0.4), built in `app/story/ch04.js`. **Its "Art needs" and "Build" notes are the spec** (the Case
File's data and screen, the `file` and `scratch` frames, sticky `sets`, the Counts sets, the sets'
options): build them as written and record each key here, briefly, as it lands. The names below are
the ones the notes leave open, fixed so the art, the engine and the story agree.

**Cast, new**: `reynard` (the fox; the text's Art needs describe him: lean, red-orange, cream chin
and chest, four black socks, an enormous white-tipped brush, half-closed amber eyes, a closed-mouth
smile that is always on; no teeth, ever). Poses: `sit`, `comb` (combing his tail), `chest` (a paw
on his chest), `think` (eyes up), `lean` (leaning in to whisper), `flap` (both forepaws flapping),
`slip` (one panel: the smile gone flat, eyes fully open, ears back), `dash` (dashing off, tail
last). He takes every mood, drawn his way (the smile stays, except in `slip`); extra `flick: true`
(one ear flicks). Never bigger in a panel than Tallyheart, never full-face. `squall` (the littlest
dragonet: built like Sprinkle at a third her size, no bigger than a cat, a big head, stubby wings,
slate with yellow flecks like sparks, fierce little brows). Poses: `hug` (sitting at the foot of
the pole, forelegs and tail wrapped round it), `sit`, `roar` (head back, mouth a round O), `hiccup`
(bounced, eyes crossed, one ring of mist), `halt` (one claw out), `tall` (standing as tall as he
can), `point`, `snap` (at a moth), `pawup` (one forepaw raised, five claws out). Sprinkle gains
`check` (looking herself over, nose to tail), `tailout` (holding out her tail) and `tailup` (her
tail lifting from her face). Cats gain the pose `situp` (on the haunches, both forepaws raised,
claws out) and the extras `wink: true` and `holds: 'bark'`.

**Sets**: one new set, `roof` (`app/art/sets/roof.js`): cameras `wide`, `pole`, `two`, `over`,
`sky`, `paw`; anchors `pole`, `beside`, `door` (none at the wall); options `plane: true` (an
airplane passing well above the roof), `moth: true`, `grit: 'none' | 'paws'` (seven little forepaws
scratched in the grit). `field` gains the **border** composition: cameras `border` (wide, both
sides of the last fence post), `border-two` (cat height, Tallyheart's shoulder between the fox and
our cat), `border-fox` (the fox chest-up in three-quarter view, a corner of Tallyheart in the near
edge); anchors `fox` (in the long grass past the post), `lead` (Glintstar), `left`, `right` (at her
shoulders), `back-1` … `back-4`; and `foxTail: true` on the `dogs` camera (a white-tipped tail
going into the long grass). `pile` gains the cameras `rows` (from the front, the rows running
back), `gap` (the back row's gap and the dug earth), `scale` (close on the "scale" where it
leans), `through` (the camp seen through it, wavy and a little green) and `mirror` (her own small
face in it, from the player's look), with the options in the text's Build notes (`rows`, `back:
'shadow'`, `scale`, `glint`, `dug`). `tower`, `den`, `hollow`, `bridge`: the options in the Build
notes (`light`, `roar`, `corner`, `ding`; `bark`, `hidden`, `moon`; `marks: 4`, `bark`, `heap`;
`pawsIn: 'both'`). The hollow's `bark: 'row'` (her first card and three blank pieces) takes `cards`
(a list of card pictures, oldest first: the row as she has scratched it by that panel) and `blank`
(0 to 3 blank pieces after them); the vocabulary lists `cards` as `'cards'`, a third kind beside a
list of values and `'number'`.

**Cards art** (`app/art/cards.js`, new): `PC.art.card({ picture, mark, big, look }) -> svg string`
draws one Case File card: a curl of pale papery bark flattened to a paw's size, one picture
scratched in thin dark lines (as simple as a cave drawing), and its mark in a corner (`'eye'`: an
almond with a slit; `'ear'`: a triangle with a notch). `picture` is a card definition's own key; the
drawings live in `PC.art.cardPictures`. `PC.art.card({ blank: true })` is a blank curl;
`PC.art.fileIcon()` the curl for the Case File button.

**Counts art**: the 10s (each group two big forepaws side by side, five long claws each, the cat
small behind them; `who`; lit by tens), `kind: 'grit'` (little forepaws scratched in the roof's
grit), sand as pairs of swipes with `ground: 'grit'` too, and `skip` pictures `paws: 'own'` at
table 10 (both forepaws together), `paws: 'promise'` (six piled forepaws, one friend's pair at a
time) and Squall's one raised forepaw (`who: [{ who: 'squall' }]`, table 5, one group).

### Engine and UI, as built (chapter 4)

`E.VERSION = '0.4.0 (chapter 4, 2026-10-10)'`; the save stays version 2 and gains one optional
field, `cards` (`E.migrate` adds an empty list). Each key below is checked by `E.checkStory` and
tested on the fixture chapter 4 in `tests/fixtures/chapters.js` (`tests/engine.test.js`, "chapter
4"). Chapters 1 to 3 play as they did: `tests/fixtures/ch03-golden.json` (recorded with 0.3.0 by
`tests/fixtures/make-ch03-golden.js`) is every frame, picture, question, line and help of nine
readings, compared whole.

**For the story (`app/story/ch04.js`)**

- **Sticky flags, `sets`**: a frame key, `sets: { foundSquall: true }`. Reaching the frame sets the
  flags; nothing unsets them (Back replaces what a choice set, never these). A frame with a `when`
  that doesn't show is never reached, so the noticing frame's `sets: { ch4CaughtFly: true }` is a
  noticing cat's only. A choice option must not `sets` a key a frame sets (`E.checkStory` says so).
- **The Case File, data**: the chapter carries `cards: { id: { mark: 'eye' | 'ear', line, picture?,
  answers?, when?, link? } }` (`picture` is the art's key, the card's id unless it says), and a frame
  gives cards with `card: 'id'` or a list of ids and `{ id, when }` entries. Reaching the frame gives
  each once, like `gift` (`E.giveCard`; `cat.cards` is `[{ id, chapter, at }]`, in the order found)
  and shows it under the panel: its picture, its mark and its line, no other words. A line one of
  the frame's own balloons or captions already says is not lettered again (her first card: the
  line is her balloon); an entry may also say `line: false`, or `mark: false` (the card without its
  mark, before Tallyheart gives the rule). An entry with **`held: true`** is a card she already
  holds, laid beside the new one for that one panel (the wing at bedtime: `card: ['cant-fly', { id:
  'fox-flew', when: { specialty: 'noticing' }, held: true }]`, for the cat who reads "You hold it
  beside the fox's FLEW"): it is shown under the panel when she holds it and never given there
  (`E.frameCards` is what a frame shows, `E.frameGives` what it gives; a frame must still give
  one, and a row of bark takes no `held`). A definition's `when` (`squall-shapes`: `{ foundSquall:
  true }`) hides the card from her file while it doesn't match, except on the frame that gives it
  and the pages she reads on from it (while that frame is behind her in this reading: the roof has
  one page between the card and the flag, "Come down with me?"; Back past the frame hides it again).
  `answers` (on an ear card: the ids of the cards that answer it) is stored for chapter 10.
  **`link: { when: { ch4CaughtFly: true }, line: 'They can’t both be true.' }`** on the claim
  (`fox-flew`, with `answers: ['cant-fly']`) is what draws the two touching once it matches; without
  it they are never neighbours (`E.fileNeighbours`). Her first card sets the flag `caseFile: true`.
- **`file: { next, prompt? }`**, the "Skritch" frame: reaching it sets `caseFileOpen` (the engine's
  own flag: from here on her Case File's curl of bark is in the top bar on every frame of every
  chapter, off the keypad screen of a lesson, and in the hub beside My nest, and in My nest). On
  this frame the button glows, the instruction under the panel is "**Tap** your Case File. You can
  open it any time." (`prompt` replaces it), a tap on the button (or on the curl shown in the
  instruction; Space, Enter, →; the hidden "Open your Case File" button) opens the real screen, and
  closing it goes on to `next`. After it, a frame that gives a card makes the button wiggle and glow
  once (`E.fileWiggles`).
- **`scratch`**, three forms, each `{ …, next, prompt?, label? }` (`prompt`: the instruction under
  the panel, with a default; `label`: the hidden button's words):
  `scratch: { cards: ['tidy', { id: 'dug-earth', when: { specialty: 'noticing' } }, 'scale'],
  head: ['four-a-night'], next }` is the row of bark: the pieces of bark take the panel (on sand;
  `ground: 'moss' | 'earth' | 'grit' | 'mud'` for another), `head` cards lie scratched at the head of
  the row, the next blank curl glows, a tap scratches its picture in ("skritch"), letters its line
  under it and gives the card (`E.scratchTap`), a tap anywhere else wiggles it, and the last tap
  turns the page (`E.next` gives any card not yet scratched, so none is ever left behind). A piece
  is scratched when she holds its card, so the row picks up where she left it. `scratch: { draws:
  'four-a-night', next }` is her first tap: one curl, the tap scratches that card's picture (no
  mark, no line, no card) and turns the page; the frame it turns to gives the card (`card: { id:
  'four-a-night', mark: false }`, its line her balloon). In both, the bark takes the panel in play,
  as a skip-count's picture does; the frame's `scene` is the storyboard's. `scratch: { tap: 'glint',
  next }` is the glitter Tap, on the frame's own scene: a soft star pulses on the glint, a tap on it
  makes it flare and turns the page, a tap anywhere else makes it twinkle (hidden button "Look at
  the glitter."). The spot is where the art drew the glint: the pile's `<g data-art="glint">` (its
  box is the target; the art's own star pulses, and the page makes it twinkle and flare), or any
  element of class `pc-glint` or `pc-tap`; else the frame's `at: { x, y }` (percent of the panel);
  else the scene's first `keep` area; else the middle of the ground, with a star of the page's own
  there. The lettering keeps off it.
- **An option's label for a cat it matches**: `labelWhen: [{ when: { foundSquall: true }, label: 'Go
  up and see Squall again.' }]` beside the plain `label` (`E.optionLabel`; the first variant that
  matches wins, and her choice is remembered with the label she read).
- **Speakers**: the chapter's `names: { reynard: 'The fox', squall: 'The little dragon' }` label every
  balloon of theirs without a `name` of its own, a lesson's lines included (the riddle, its help, its
  fillers, its retry); balloons from "I'm Squall" and "You are at our border, Reynard" on carry
  `name: 'Squall'` / `name: 'Reynard'`, and a balloon the page adds itself (a skip-count's counter,
  "5!") takes the name its speaker's balloons carry on that frame (`PC.ui.speakers.nameOn`). A chapter without `names` calls them Reynard and Squall.
  Read to me: Reynard slow and smooth (pitch 0.8, rate 0.82), Squall high and loud (1.7, 1.02).
- **`book.dragonet`** takes `when` (`{ foundSquall: true }`): his page is there once it matches,
  whichever chapter she finds him in; without `when`, once the chapter is finished, as Sprinkle's. It
  may be a list.
- **Skip-counts**: `paws: 'both'` (the bedtime tens: both forepaws together, the count trailing off
  in her murmur, "10… 20… 30… 40… 50…"; hidden button "Tap your forepaws."); `paws: 'pile'` (the
  promise: the count in her own balloon, 10, 20, 30!; "Count the next friend."); one group
  (Squall's forepaw: `{ table: 5, groups: 1, who: [{ who: 'squall' }], label: 'Tap his forepaw.',
  carry: false, next }`: one tap lights its five claws, a big 5 grows, the page turns); `prompt`
  (an instruction under the panel: "**Tap** the cats, left to right."); `label` (the hidden
  button's words; table 10 says "Count the next cat."); `carry: false` (the page it turns to
  doesn't show the number reached: the roof's 5 stays on the roof). Things default to claw/claws on
  the 10s.
- **Counts sets**: `label: 'Both forepaws'` (the Hollow's button and the grown-ups' heading: "Both
  forepaws · the 10s"), `hollowThings: 'tens'` (Tallyheart's word in the Hollow's five lines,
  `E.hollowLines`, so the 5s and the 10s never read the same), `helpIntroNotTen` (on the 10s, an
  answer that doesn't end in a zero: `res.notTen`), `ground: 'grit'`, and a picture `{ kind:
  'grit' }` (`{ kind: 'mud', ground: 'grit' }` is read as the same). "Close" on the 10s is within
  ten. The warm-up, the pile, tonight's rows and the riddle need no other key: `warmHard`, `avoid`,
  `fillFrom`, `fillOrder`, `fillVoice`, `againIntro`, `helpCounter` are chapter 3's.
- **Scene options from the cat**: `bark: 'auto'` (any set; the den) becomes her cards, in order: the
  ones her Case File shows, each `{ picture, mark }` (`E.resolveScene`; never a count, which the art
  could only fill from a standard order: the wing a page early, a dug-earth card she never
  scratched). `hidden: true` is the art's (two of them under the moss, taken out of the row by their
  pictures). A `cards` list (the hollow's row of bark on the sand, with `bark: 'row'`) is written as
  a row of bark is, ids and `{ id, when }` entries: the entries that are hers become `{ picture,
  mark }`, whether or not she holds the card yet (the picture is the story's: the row as she has
  scratched it by that panel, so a second reading shows the same row). The story's own scene is
  never changed.
- **Finding him later**: `E.checkStory(story, stories)` accepts a Counts frame's set and a card that
  another chapter defines (chapter 5 running the roof's frames), `E.cardDef` and `E.countsSet` find
  them at play time, and a card remembers the chapter that gave it. Chapter 5 carries the same
  `names` and the same `sets` on its last roof frame. The offer is a choice only some cats see, so a
  frame with `when` may name an **`else`**: `{ when: { foundSquall: false }, else: 'f020', choice: {
  … } }` shows the roar and the choice to a cat who has not found him, and turns straight to `f020`
  for everyone else (without `else`, a frame that doesn't show still leads to its one `next`).
- **Borrowing, the easiest first**: a set with `fillOrder: 'easiest'` and an `avoid` list never
  lends one of its own questions back the other way round while another pair is left (lesson state
  `own`: missed twice, the pile's 2 × 10 borrows 1 × 10 and 5 × 10 again, never 10 × 3). Chapter
  3's two such sets have no `avoid`, so they borrow exactly as they did (Sprinkle's dinner, four
  misses deep, still lends 5 × 2: `tests/engine.test.js`).

**What the art is handed** (the page adds `look`)

- `PC.art.countsPicture` for a lesson (`E.lessonPicture`): `{ table, groups, per, highlight, kind,
  layout, thought, who, thing, things }`, and `ground` when the picture has one. On the 10s, `table:
  10, per: 10` and `who` when the fact has it (4 × 10: the first four rim cats); 6 × 10 opens with
  `highlight: 50`. The riddle: `kind: 'grit', ground: 'grit'`, table 5, seven groups, no `who`.
- `PC.art.countsPicture` for a skip-count (`E.skipPicture`): `{ table, groups, per, highlight,
  totals: true, next, who, thing, things }`. The rim: table 10, five groups, `who`. Squall's
  forepaw: table 5, one group, `who: [{ who: 'squall' }]`. The bedtime tens (`paws: 'both'` in the
  story): `paws: 'own', both: true, table: 10, taps, lit: 'both' | null, nextPaw: 'both' | null,
  totals: false`. The promise (`paws: 'pile'` in the story): `paws: 'promise', table: 10, groups: 3,
  taps, highlight` (10 a tap). The glow to tap is whatever carries class `pc-next` (several are
  fine: a tap on any of them, or between them, counts).
- `PC.art.sand` (`E.sandOpts`): `{ groups, per, counted, layout, ground, style }` as before, plus
  `pair: true` with `style: 'swipe'` on the 10s (two swipes a group, `counted` going up by ten) and
  `step` (= `per`) when a picture in rows is hopped a whole row at a time (the pile: after the
  first hop, `counted: 10`, exactly the first row is lit). `ground` may be `'grit'`. Chapters 1 to
  3's calls are the same objects as before.
- `PC.art.card({ picture, mark, big, look })`, `{ blank: true }` and `PC.art.fileIcon()`, as above
  (`mark: null` for a card shown without its mark).

**The rest**

- **The Case File's screen** (`E.caseFile`): "{name}paw’s Case File" over the page; her cards on
  moss in two groups, "What I saw myself" and "What I was told (to check)", each in the order found,
  three cards across; side by side from 960px wide, else one above the other with the claims first
  (two across on a phone). A tap on a card shows it large with its line and what its mark means ("I
  saw this myself." / "Somebody told me. A thing to check."); Read to me reads them. Linked cards
  leave their groups and lie touching, over the link's line, between the two groups (one from each
  side on a wide screen; between the claims and what she saw on a narrow one). Closing it returns
  to the same frame; it changes nothing and logs nothing. Empty places are never shown.
- **Grown-ups corner**: `foundSquall`, `ch4CaughtFly` and `caseFile` in words; her cards listed in
  order, each with its mark in words, one her file doesn't show yet marked so.
- **The Training Hollow** offers "Both forepaws · the 10s" (`ch04-tens`, the table's set with the
  most facts), never the warm-up, the pile, tonight's rows or the riddle.
- **The keypad** takes three digits (`PC.ui.keypad.press`: 10 × 10 is 100). The question line is
  sized `14cqi`, as it is in chapters 1 to 3, and its answer slot never shrinks (`flex: none`).
  Safari sizes a `cqi` font by the page zoom too: at 115% (the mini's Safari) the line came out 15%
  wider than its column allowed and the last zero of "100" was cut off. So the page measures the
  line each time it draws it, with the answer's digits in the slot (it does not change as she
  types), and sets it smaller when, and only when, it is wider than its column (`fitQ` in the
  lesson; again when a font loads late or the screen turns). At 100% zoom, which is what an iPad's
  home-screen app has, "10 × 10 = 100" fits with 4px to spare each side and nothing is touched: the
  questions of chapters 1 to 3 are the size they were. (A first fix made the line `12cqi` for
  everyone, which shrank every live question by a seventh on a sideways iPad to cure a cut-off
  that only a zoomed page has.)
- **Lettering** (`PC.ui.layout`, all pure and tested in Node):
  - a `keep` area more than four times as long as it is wide on the screen (a row of the pile) is
    kept clear along its length, a row of small circles, not one circle as wide as the row
    (`keepCircles`; chapters 1 to 3 have no such area, so nothing of theirs moves);
  - a balloon's tail is charged for running across anybody else's face, and so is the neck that
    joins a chained balloon to the one before it (`tailOverFaces`): the two lines the page draws. A
    chained balloon (its speaker's second) draws no tail of its own, only the neck, and is not
    charged for one: charged, the undrawn tail threw chapter 2's "Flat ears still count." across the
    panel onto a rim cat, on a 220px tail, at every iPad size but one;
  - a voice from outside the panel is placed as before, but the panel's last balloon, once it is
    in the lower part (its tail leaves by the bottom edge), takes the lowest clear spot there, not
    the highest (`last`): chapter 4's "GLINTSTAR!", and chapter 3's f045, which had a 235px tail.
  - **Live frames these two rules move** (every frame of chapters 1 to 3, for two cats, dumped from
    the real page in Safari, the live tree against this one, at 1180 × 820, 820 × 1180, 1024 × 768,
    768 × 1024 and 390 × 844, and with Bigger text at 1180 × 820 and 820 × 1180; the frames that
    moved, again at 1080 × 810 and 810 × 1080. Everything not named here is laid out exactly as it
    is live, the lessons and their question line included). By the tail rule: chapter 2 **f099a** at
    every iPad size (Tallyheart's "That'll be Coil. Nosy old thing." leaves the far left, where its
    tail ran across our cat's face, for her own chest, under her chin); chapter 3 **f074** at every
    size (Riffle's "I'm going to need a bigger mouth." comes back from the far right, its tail
    across two faces, to his own side; at 820 × 1180 only for some cats); chapter 3 **f005** at 1024
    × 768 and 1080 × 810 only (Murmurpaw's "In front of EVERYONE." leaves the top right, its tail
    across our cat's face, for a place across our cat's chest); chapter 1 f038 at 1180 × 820 and
    1080 × 810 (12px); chapter 3 f043, "Or eyelids.", only for a cat who took the bridge path (about
    24px; not at 820 × 1180); chapter 3 f089b (6px: at 1024 × 768 for a tom, and with Bigger text at
    1180 × 820); with Bigger text on an upright iPad, chapter 3 f008 (12px) and f093a (30px). By the
    `last` rule: chapter 3 f045 at every iPad size, and the Training Hollow's reward page (its line
    24px lower, on a shorter tail). On a phone (390 × 844): chapter 2 f025, chapter 3 f006a, f006b,
    f009 and f093a (and f090c for some cats), the whisper on the page a chapter 3 lesson is picked
    up from, and, for a tom, chapter 2 f020, whose two balloons leave the panel and stack under it.
    Two of these put a balloon across a body to keep a tail off a face, and want Aron's eye: chapter
    2 f099a, and chapter 3 f005 at 1024 × 768. On an iPad, chapter 2 f020, f098a and f025 are laid
    out exactly as they are live again.
- **A Counts frame with three balloons or more** (the riddle's "HALT!", "Friend!", "PROVE it!") does
  not say them again over its first question (`PC.ui.speakers.lessonIntro`): she has just read
  them, and the page ran taller than the screen. One or two are said again, as in chapters 1 to 3.
- **One group's skip-count** (Squall's forepaw) grows its number beside the lit claws (`.skipnum.one`),
  not at the top centre, where his face is. **The glitter Tap and the bark Taps** turn the page as a
  skip-count's last tap does: the next page waits 1.1 s before a tap turns it. **A page of choices**
  keeps Back under its options (not sticky). **The Case File's headings** and a large card's line
  show the art's own marks (`PC.art.cardMark`).
- **Tools**: `tools/storyboard.mjs` has words for the `roof` set and everything new, and prints the
  cards, `card`, `sets`, `scratch`, `file`, `labelWhen` and the new skip and Counts keys where a
  chapter uses them (chapters 1 to 3's storyboards are unchanged). `tools/shots.mjs` takes
  `STORY=fixture4` (the fixture chapter 4 in the page), the targets `file` and `file#card-id` (the
  Case File open, or a card shown large), `@tap` (one tap on the page's tap picture), and `cards`
  in `CAT`. It reads every screenshot before keeping it (`blankPng`: the pixels, not the file's
  size): a busy Mac sometimes hands back one flat colour (the mini's black sheets are 99.97% black),
  and such a picture is taken again in a fresh session (`TRIES`, 3), a sheet that stays blank is
  taken as its single pages, and a target that never paints is named `blank:` on stderr with exit
  1, never printed as a picture. `--blank a.png …` checks PNGs already taken. `EXTRA` (more cats
  for "Who's playing?") no longer reads the save back from `localStorage`, which the mini's
  automation session loses between script calls: it takes the page's own save (`PC.debug.state()`)
  and, for the reload, serves the page with `localStorage` stood in for by `sessionStorage` (the
  page as the tool serves it only).

**Staging, as built** (after the picture and real-screen reviews of 2026-10-10 and 2026-10-11)

- **"A DRAGON."** (f040), the one panel where the fox leans in, is the two-shot (`border-two`) with
  Glintstar, our cat and Tallyheart, never his close-up: `border-fox` with him leaning puts his
  muzzle over Tallyheart's corner, and without her it left our cat alone with him. Every picture
  with the fox and our cat has Tallyheart at `right`; our cat's face is `scared` twice, both times
  beside her.
- **Raised tails.** Tallyheart's `proud` lifts her tail, so she is `kind` beside our standing cat
  (f054b), `stern` when she stands in the wide shot (f047), and turns left with Glintstar, `kind` or
  `dreamy`, when the leader looks at our cat (f052, f053, f054a). The border's `back-4`
  (Murmurchime) is at x 740, clear of Glintstar's tail; `dog-1` is clear of the corner post; the
  `border-two` field has no puddle (it lay under Glintstar's chin).
- **The row of bark on the sand** after the bark Tap is `bark: 'row'` with `cards`: the Tap's own
  list and one blank piece (f064 to f065b), plus `fox-flew` (f066), plus `fox-moon` (f067, f068).
- **The told path's branch** is in the first panel under the bridge only (f090): the frames after
  it are shared by both paths, and a scene cannot vary by flag. (If the heap should stay: a
  `branch: 'auto'` option filled from `ch3Told`, as `stone: 'auto'` is.)
- **One speaker a panel under the bridge.** "The TRACKS? At NIGHT?" has a panel of its own (f109),
  between our cat's "Squall saw two skinny shapes…" (f108) and "Raft first." (f110), all three for a
  cat who found Squall. In our cat's panel Riffle's balloon had to read after hers, so it sat to her
  right, across the picture from him and against Sprinkle's face, on a 429px tail under her chin:
  his squeak read as Sprinkle's. Alone, it sits over his own head. The frames after it moved up one
  (f110 to f123); chapter 4 was not live, so no saved place moved.
- **The one who speaks twice sits on the right.** A speaker's second balloon follows her first,
  below it or to its right. At the den (f113) Tallyheart sat on our cat's left, her head under her
  first balloon, so her second ("If you ever have one for me, I'm right here.") landed 10 to 15px
  from our cat's face and read as our cat's. She now sits at the doorway's far side
  (`entrance-right`) and our cat at its near side (`entrance-left`), the dark opening between
  them, and the two balloons stack over her at every screen size. The moon panel before it (f112)
  has our cat stopped short of the doorway and Tallyheart a few steps behind (`{ x: 250, y: 884 }`),
  so nobody changes sides between the two.
- **Half the Clan** walks to the border (f033): the four who stand behind Glintstar there (the old
  tom, the two apprentices, Murmurchime) come along the fence behind Tallyheart, our cat and
  Glintstar, listed first in the cast so they are drawn behind.
- **"With these very eyes."** (f045a) is `wonder`, the fox's eyes as open as they go with the smile
  still on; `proud` all but shut them. The one panel with his eyes fully open is still the slip.
- **The wing beside the fox's FLEW** (f115): for a noticing cat the fox's card lies beside the new
  one under the panel (`held`, above), as her caption says.
- **Bedtime.** She lies down in "skritch, skritch" (f114), so the stone is under her chin or by her
  nose as the caption says, and sits up holding the last piece of bark in both forepaws (f115). On
  the kept path's "You sniff your paws" the den draws a chin stone past her nose. Tonight's pile
  (`PILE_NIGHT`) has this morning's dug earth behind the "scale".
- **`situp`** stands the dewclaw up beside the toes (five claws a paw show; chapter 3's `pawup`
  is unchanged). Sprinkle's `tailout` slopes the tail down to a cat's raised paw and gives the
  held-out part plates that show. The promise picture's far otter paw is at `[572, 410, -50]`.
- **The book's recap** departs from the text's proposed sentences in two places. A cat who both
  caught the fox's "flew" and found Squall reads the text's two Squall sentences as one ("…found
  Squall, the littlest dragonet, who told {them} about two skinny shapes…"), which keeps her page at
  ten sentences and drops "who roars at airplanes and hiccups" and "A thing to check." for her. And
  the catch reads "**Reynard** said the dragon flew" (the text had "he said": for a tom, two
  different he's in one sentence); the text's notes carry the same wording now.
- **Not changed, Aron's call:** f008's `Shhnk! Shhnk!` is the loud kind (big and gold, at our
  cat's feet, across the panel from the claws that make it), as chapter 3's `Shhnk!` is. Lower
  case would letter it small and pale, as the board asks, but in the same place: a sound effect
  takes the freest of nine spots, the bottom right before the bottom left, so at 1180 × 820 it would
  still lie at our cat's feet (296px wide, where it is 494px now), not by Tallyheart's paws. Putting
  it by its maker needs a spot the frame can name, or the art's own small lettering by each paw.

## Chapter 5 (v0.4)

Chapter 5, *Riffle’s River*, is [`chapters/05-riffles-river.md`](chapters/05-riffles-river.md)
(v0.4), built in `app/story/ch05.js`. **Its "Art needs" and "Build" notes are the spec, names
included**: the two new sets `openriver` (`app/art/sets/openriver.js`) and `marsh`
(`app/art/sets/marsh.js`) with the cameras, anchors and options the notes list; the new cast
`patience`, `puddle` and `wisp` with their poses; the Counts art for the 9s (one claw tucked), the
fish, the logs and the herons; the new Case File cards (their pictures go in `app/art/cards.js`);
and every engine key the Build notes add. Build them as written and record each key here, briefly,
as it lands.

### Engine and UI, as built (chapter 5)

`E.VERSION = '0.5.0 (chapter 5, 2026-10-11)'`; the save stays version 2 and nothing new is stored
(the new flags are sticky flags like `foundSquall`). Each key below is checked by `E.checkStory`
and tested on the fixture chapter 5 in `tests/fixtures/chapters.js` (`tests/engine.test.js`,
"chapter 5": it plays beside the real chapters 1 to 4; **its frames are the formats to copy**).
Chapters 1 to 4 play as they did: `tests/fixtures/ch04-golden.json` (recorded with 0.4.0 by
`tests/fixtures/make-ch04-golden.js`) is every frame, picture, question, line, help, card and book
page of ten readings, compared whole; chapter 2's and chapter 3's recordings still pass.
`E.checkStory(story)` alone cannot see another chapter's cards, sets or flags: check chapter 5
with the others, `E.checkStory(story, stories)`.

**For the story (`app/story/ch05.js`)**

- **A thing she taps, `scratch: { tap: NAME, prompt, label, miss?, next }`**: chapter 4's glint Tap
  with any name (`'nose'`, `'earth'`, `'fur'`, `'mud'`, `'pole'`). The target is the art's mark in
  the scene (below); the page puts a soft glow on it. A tap on it flares and turns the page; a tap
  anywhere else wobbles the glow and letters **`miss`** small beside it for a moment (`'snnnrrk…'`):
  nothing is logged, nothing can be got wrong. `E.tapWords(f).miss`.
- **`ask: { who, to, pairs: [[question, answer], …], next, prompt?, label?, opt? }`**, a new frame
  kind (`E.KINDS` gains `'ask'`): Riffle's seven questions. The frame's own scene stays up; a tap on
  the asker letters his next question in his balloon and the answer in `to`'s, and the scene is
  drawn again with its option `owed` (or the one `opt` names) one higher. The pairs before stay
  under the panel, small. A tap elsewhere makes him hop; after the last pair, Next. Before the
  first tap the frame's own `say` shows. `E.askView`, `E.askScene`, `E.askWords`.
- **The skip-count's new forms** (`skip`; each is tapped through, logs nothing):
  - **`tuck: true`** (`table: 9, groups: 5, who: […]`): the cats sit with all ten claws lit and a
    big 50; each tap curls one claw in on the glowing cat and steps the number back by one (49, 48
    … 45). No number is ever under a cat. `keep: true` keeps the picture (nine out, one tucked, 45)
    on the pages after it, as chapter 4's `keep` does.
  - **`paws: 'board'`** (`table: 1, groups: 4, teacher`): her four paws onto the raft, counted in
    words in the teacher's balloon ("One.", "Two."), no big number over the picture. Give it
    `carry: false`.
  - **`paws: 'log'`** (`table: 1, groups: 9, teacher: 'player'`, on a frame with a `scene`): no
    counting picture. The scene stays up and is drawn again at every tap with **`claws: taps`** in
    its options; the count is her own thought; a tap anywhere counts. **`steps: [{ from: 1, opts: {
    plane: 'far' }, sfx: 'rrr…' }, { from: 4, opts: { plane: 'near' }, sfx: 'RRRrrr…' }, { from: 7,
    opts: { plane: 'over' }, sfx: 'RRRRRR…' }]`**: from tap `from` on, those options are laid over
    the scene's and `sfx` is lettered along the top, a size larger at each step (`E.skipScene`).
  - **`paws: 'mud'`** (`table: 5`, **no `groups`**, `who: [{ who: 'sprinkle' }, { who: 'squall',
    when: { foundSquall: true } }, …]`): a forepaw for everyone she has found. `who` entries may
    carry a **`when`**; with no `groups` the count is as long as the entries that match her
    (`E.skipFor(skip, cat)`; at least one entry must be unconditional). Each lit forepaw has its
    number under it and the count is in the teacher's balloon; no big number. The page it turns to
    shows the number she reached, big over its picture (10, 15 or 20: `E.skipReached`).
  - **`paws: 'both'` at `table: 9`**: the bedtime nines, chapter 4's bedtime tens with one claw
    tucked: 9, 18, 27, 36, 45 in her own murmur.
  - One group with `who: [{ who: 'puddle' }]` or `'wisp'`: chapter 4's raised forepaw, theirs.
- **Counts frames**: `counts: { set, next, intro: false }` says none of the frame's lines is said
  again over the first question (the 10s warm-up straight after a Tap). A frame may run another
  chapter's set (`set: 'ch04-riddle'`, the roof offered again).
- **Counts sets, new keys**:
  - **`light: 'tuck'` on the set** (the nines): every question it asks first and every retry opens
    with all ten claws lit on every cat, curls one in on each, then goes unlit (nine out, one
    tucked) and she types, without a word (`E.lightSteps`, `E.LIGHT_MS.hop`/`.tuck`). A set-level
    `light` may also be `'groups'` or `'rows'`; a fact's own `light` wins; a filler shows the still
    picture.
  - **The nines' help**: a set at `table: 9` gets the lesson done slowly: the sand swiped twice for
    every cat and hopped by tens, then one line rubbed out for every cat, stepping back by ones (10
    · 20 · 30 · 40 · 39 · 38 · 37 · 36). Three more openings, set-level lines like `helpIntro`:
    `helpIntroTens` (she typed the tens), `helpIntroOneTuck` (the tens less one, for two cats or
    more), `helpIntroNotNine` (her two numbers don't make nine; only once the lesson has shown her
    that they should, or in the Hollow), checked in that order after `helpIntroNotFive`/`NotTen`.
  - **A fact's own `miss` and `missLast`** lines (beside `right`/`rightAgain`), and **`shows: {
    kind: 'answers', of: [[2, 9]], also: 'One and eight make nine. ' }`**: with that fact's right
    line and its miss line the page draws her answers scratched in the sand: this fact's, and each
    of `of` she has answered right with no ask of it still ahead. **`{also}`** in those lines is the
    `also` words when every one of `of` is there, else nothing.
  - **`fillOrder: 'easiest'` with no `fillFrom`**: the lesson's own gaps are filled with the easiest
    of her right answers in it, not the latest.
  - **`fillPicture: 'borrower'`** (beside `fillVoice: 'borrower'`): a borrowed pair is drawn and
    worded as the borrowing set's own question (the otter's fish, not chapter 2's ears).
  - **`ground: 'log'`**: the help is scratched on a log of the raft. **`help: 'picture'`**: no
    scratching, the set's own picture lit a group at a time (Puddle's bumps, Wisp's herons).
    **`helpCounter: 'you'`** as before.
  - **`teacher: 'caption'`**: a silent set (Wisp's): every line the engine words is lettered as a
    caption; **`helpSays: 'patience'`** is who says the help's opening line.
  - **`warmHard.avoid`**: the hard pick's own avoid list, read in place of the set's.
  - Pictures: `kind: 'fish'` with `layout: 'pairs', thought: true` or `layout: 'strings'`; `kind:
    'bumps'`; `kind: 'herons'`. `thing`/`things` default to `life`/`lives` at table 9.
  - The Training Hollow has five Counts now: the first set a chapter gives a table is that table's
    Count, so `ch05-nines` (`table: 9`, `label: 'Nine lives'` for its button, `hollowThings:
    'nines'` for Tallyheart's word) is the 9s', and the pile, the warm-up, the fish and the riddles
    (tables 10, 2, 5 and 1, taught in earlier chapters) change nothing there. A round is the still
    picture and her sand: no hop and tuck, no log, no captions.
- **Case File**: **`link: { with: ['fox-moon'], line, when? }`** on a card: it and each partner she
  holds are drawn touching from the moment she holds both (any cards, an ear beside an ear;
  `answers` stays chapter 10's). A card two links name lies between its partners: three in a row,
  a line under each join (`E.caseFile(…).links`: `{ cards, line }`, or `{ cards: [a, b, c], line,
  lines }`). A frame may give another chapter's card (`card: 'squall-shapes'` on the roof).
- **The book**: `book.dragonet` may be a list, each with its own `when` and **`pose`** (how the art
  draws it on its page: `'head'`, `'blink'`; `'sit'` when it names none).
- **Flags the Grown-ups corner has words for**: `ch5First` (`'otters'`, `'heron'`), `ch5Roof`,
  `foundPuddle`, `foundWisp`. **Speakers**: `patience`, `puddle`, `wisp` have names and voices
  (Wisp never speaks; the chapter's `names: { puddle: 'The big-footed dragon' }` labels him until a
  line carries `name: 'Puddle'`, as chapter 4 did for Squall).
- **Chapter 4's recap for a cat who climbs today**: `app/story/ch04.js`'s book lines keyed on
  `foundSquall` must not say she met him in chapter 4 when `ch5Roof` is true (the fixture chapter 4
  has the three `when`s: `{ foundSquall: true, ch5Roof: false }`, `{ foundSquall: false }`, `{
  ch5Roof: true }`).

**For the art: what it is handed** (the page adds `look` to every `countsPicture` call, as before)

- **The 9s**: `countsPicture({ table: 9, per: 9, groups, highlight, who?, thing, things })` is the
  still picture (nine out, one tucked on every cat). A question with `light: 'tuck'` is three
  calls: `{ highlight: groups × 10, tuck: 0, tucked: 0 }` (the hop), `{ highlight: groups × 9, tuck:
  groups, tucked: groups }` (the tuck), then `{ highlight: 0 }`. `tuck` is the art's key (how many
  cats, from the first, have curled a claw in); `tucked` says the same.
- **The tuck Tap**: `{ table: 9, per: 9, groups: 5, who, tuck: true, taps, tucked: taps, highlight:
  50 − taps, totals: false, next: taps < 5, thing: 'claw', things: 'claws' }`; kept pages: `taps: 5,
  highlight: 45, next: false`.
- **The bedtime nines**: `{ paws: 'own', both: true, table: 9, per: 9, groups: 5, taps, highlight:
  taps × 9, lit, nextPaw, totals: false }`.
- **The nines' help**: `PC.art.sand({ groups, per: 10, counted, style: 'swipe', pair: true })` for
  the hops (`counted` 10, 20 …), then the same with `counted: groups × 10` and **`rubbed`** 1 …
  `groups`.
- **Her answers in the sand**: `PC.art.sand({ answers: [18, 36] })`; when that picture's
  `aria-label` does not name each number the page tries `countsPicture({ kind: 'answers', answers
  })`, and draws the numbers itself if neither does.
- **Fish, bumps, herons**: `countsPicture({ kind: 'fish', layout: 'pairs', thought: true, table: 2,
  per: 2, groups, highlight })`, `{ kind: 'fish', layout: 'strings', table: 5, per: 5, … }`, `{ kind:
  'bumps', table: 10, per: 10, … }`, `{ kind: 'herons', table: 1, per: 1, … }`. A help on the log:
  `PC.art.sand({ groups, per, counted, ground: 'log' })` (`style: 'swipe'` on the fives).
- **Paws aboard**: `countsPicture({ paws: 'board', table: 1, per: 1, groups: 4, taps, highlight:
  taps, totals: false, next })`. **The mud count**: `{ paws: 'mud', kind: 'mud', table: 5, per: 5,
  groups: (hers, 2 to 4), of: 7, who, highlight: taps × 5, totals: true, next }`.
- **Claws in the log**: no counting picture; the frame's scene with `claws: taps` (0 to 9) and the
  step's options (`plane`).
- **The questions she taps out**: the frame's scene with `owed` = its own + taps. The page puts its
  own soft glow on the asker's head unless the scene carries an element of class `pc-next` (a cast
  entry with `glow: true`) or `pc-tap`; then that is the target, and it wiggles on a miss.
- **One-tap frames**: the target is the scene's element named for the tap (`data-tap="NAME"`, class
  `pc-tap-NAME` or `data-art="NAME"`), else its first glint or `pc-tap` (`PC.ui.taps.pick`). An
  element that is also `data-art="glint"` pulses, twinkles and flares itself as chapter 4's glint
  does; any other gets the page's soft glow, as big as the thing. The page adds class `tap-hit` or
  `tap-miss` to `.art` at a tap, for an art that wants to answer.
- **The book**: `PC.art.character(id, { pose, mood: 'happy', facing })` with the dragonet's `pose`.

**The page and the tools**

- `index.html`: CSS only (the soft glow `.tapspot.soft`, the small answer `.tapmiss`, the roar
  `.skipsfx.s1`–`.s3`, the asked list `.asked`, the Case File's `.cf-links` and three in a row
  `.cf-pair.n3`, the count in words `.counter.words`; still under reduced motion). One print rule
  changes for every chapter: the book's dragonets page may break between two dragonets (it never
  did with two, which fit a sheet; with three or four it must).
- `tools/storyboard.mjs` prints every key above in words, has words for `openriver` and `marsh`
  and everything new, and `--check-words` now also checks the cast extras the art names
  (`PC.art.vocab.extras`). Chapters 1 to 3's storyboards regenerate byte for byte; chapter 4's
  changes only where its book recap gained the `ch5Roof` conditions (a cat who climbs the roof in
  chapter 5 found Squall there, so chapter 4's page still says he is roaring up there).
- `tools/shots.mjs`: `STORY=fixture5` stands the fixture chapter 5 in.
  **It is silent by construction** (the mini makes no sound): every HTML page it serves has speech
  and audio switched off before the game's first script (`window.speechSynthesis` a stand-in that
  says nothing and notes what would have been read; the real synthesizer's methods emptied; no
  media element plays, no audio context is made), "Read to me" stays off (checked in the page after
  the test cat is set up), a `@readBtn` tap is refused before Safari starts, and `READ=1` is the one
  opt-in: the setting on, in a page that still says nothing. `--page` prints the page as served.
  `DRY=1` prints, for each target, the lines Read to me would say there, in order, with Read to me
  off: the page's own list (`PC.debug.speech()`, which says nothing).
  `tests/tools.test.js` holds it to this.

### As built, after review (chapter 5, 2026-10-12)

What the review of the built chapter changed. Each is tested where it lives.

**The engine and the page**

- **A count she never reads hands no number on.** `E.skipInto` and `E.keptSkip` pass over a skip
  frame whose `when` does not match the cat: the page turn past chapter 5's mud count (f148, f149:
  only for a cat who met a dragonet today) lands on f150, and a cat who found nobody used to read
  f150 under a big 5 or 10. With no cat they answer for the story as written, as the storyboard asks.
- **`sfxAt: [x, y]`** on a frame with an `sfx`: where its sound effect is lettered, the middle of
  the lettering in hundredths of the panel (`PC.ui.layout.sfxPlace(text, W, H, faces, placed, at)`:
  there at its fitted size, inside the panel; smaller, by the usual steps, only while a caption or a
  balloon would hide it; placed as any other sound when it cannot be clear). Faces and kept areas do
  not move it: the frame chose the spot. Chapter 5's Roar (f050, in the sky under the airplane) and
  the small "blub…" on the way home (f131a, on the water above the bubbles). `E.checkStory` checks
  its shape; the storyboard says where.
- **`sfxRead: 'words'`** on a frame with an `sfx`: the sound in words, for Read to me only. Read to
  me reads captions, then balloons; a sound effect is lettering and is never read (nobody can say
  "SNNNRRRK."), so a caption that runs on into its sound was heard as a sentence nobody finished.
  `E.captionsRead(frame, cat)` is the captions as they are heard: `E.captions`, with the words said
  right after the first caption she sees that does not end a sentence (`E.endsSentence`: no full
  stop, question mark, exclamation mark or trailing dots at its end), or after the last caption when
  every one does, and before the balloons. The page reads that list and gives the panel its label
  from it; what is lettered is `E.captions`, unchanged, and a frame without the key is heard exactly
  as before (every frame of chapters 1 to 4). Chapter 5 has three: the tower (f021, "From the
  tallest tower:" "a roar, and a tiny hiccup."), the otters' applause (f053, "On the rocks, otter
  tails go" "Slap! Slap! Slap!", then Riffle's shout) and the pinecone (f163, "Then, a little
  later:" "a long, long snore."). `E.checkStory` checks its shape (a non-empty string, on a frame
  with an `sfx`, never on a skip, an ask or a scratch frame, whose pages read their captions
  themselves); the storyboard prints it beside the sound effect; `tests/story-ch05.test.js` fails
  when a chapter 5 caption runs on into a sound with no words for the listener.
- **Every retry in a set with a `light` plays it**, the retry of a missed filler of the set's own
  included (the nines' hop and tuck); a filler itself still shows the still picture, a borrowed
  pair is another set's picture, and the Hollow plays neither.
- **`E.openChapter` arrives.** When a parked page no longer shows and she lands on the next that
  does, that page gives its card and sets its flags, as a page turn to it would.
- **Counts frames**: `intro: false` on the bill too (`ch05-bill`, f095): Patience asks it in two
  balloons and a caption of her own, and with the frame's line said again a phone hid the top row of
  the nine pairs.
- The Grown-ups corner's words for `ch5Roof` are filled for a tom ("his book").

**The art**

- **Cats, `reach: true` on `crouch`** (an extra, not a pose: the cats still have fifteen):
  crouched at an edge, the near forepaw held out and down over it, touching nothing. That paw hangs
  below the line of her other feet, so the fit rests it on the bottom of her box and lifts the rest
  of her; the result carries `reach: { x, y, r, edge }` (the paw, and the line of the edge), and the
  set that places her puts that line on the edge.
- **The marsh**: anchor **`raft-edge`** (the `mud` camera only; `air` and `elev`): the front lip of
  the raft's near log, where our cat crouches to hold a paw over a print. The line of tiny prints is
  laid so that one lies right under the paw (`prints.under`; `PC.art.marshInfo().mud.printUnder`,
  `.lip`), half the paw's size, and the set draws her shadow on the log and the paw's small one on
  the mud. **The pale reed** while she is still a reed has a sheaf of plumes across her face and long
  leaves across her body, and is thinner still (`marshInfo.reedThin`); knees, flinch and blink are
  as solid as she ever is. **The frogs** are drawn before the cast (never on a diving otter's head
  or our cat's ear), and three frog pads moved off the heads and the dive spot. **The pole**, when
  it is neither planted, held nor climbed, lies along the raft's near log at their feet, in the
  colours of the one Riffle holds (it used to vanish while his paws were busy).
- **`fish: 'spare'` on `openriver` and `crossing`**: the reed string with its two spare fish lying
  on the raft's logs, for the way home (the open views, `edge` and `beside`; the Crossing's main
  composition and `board`, at `raft-3`). The string is `PC.art.prey.string({ count, len })`
  (app/art/sets/pile.js), the pile set's fish on a reed loop. Chapters 2 to 4 never ask for it: their
  pictures are as they were.
- **The open river**: looking straight up (`sky`), the airliner's lowest point is above both heads
  with sky between; over the raft it crosses to the right of the tallest tower, whose roof and red
  light stay clear; in `beside` the lying pole is on the near log, at their feet; in `edge` Riffle's
  seat is clear of the lashing.
- **The open river's water is the Crossing's blue** (2026-10-12; README, "Claude's calls under
  decision 46"). It was drawn green-brown, as the text's note then asked, and read as a lawn the
  raft sat on, one page after the same river was blue at the Crossing. The set's own table,
  `PC.art.openriverInfo.water` (`day`, `morning`, `golden`; each `hi`, `far`, `mid`, `near`, `low`,
  `sheen`, `line`, `glint`, `under`), now holds: by day `#E6F4F7` at the far waterline, `#B4D9EC`
  (the sky's colour), `#74B2D4` (the Crossing's blue, brighter), `#58A2BE` and `#4E97B1` at our feet
  (a touch greener and deeper); `morning` is a paler day; `late` (the `golden` light) puts the sky's
  gold on the far water (`#FFEFC6`, `#EBD6C6`) and an evening blue under the raft (`#A9A9CC`,
  `#7E97C4`, `#6F8ABC`), the hue of the Crossing's own late water. The brown `silt` streaks are
  `sheen` now: long pale streaks of sky. Two things were redrawn so they still read on blue: by day
  the far end of each tower's reflection is a shade deeper than the glass (blue glass on blue water
  was lost), and the river laid back over the raft's near log is the river's own drawing again,
  clipped to a level patch (`or-lap`), where it was a patch of the bare fill (which showed as a box
  wherever the sun's path or a streak ran under it). The rule the tests hold (`tests/set-openriver.test.js`): by
  day the blue leads the red in every colour of the river and in every stop a camera draws; the late
  water is warmer, stop by stop, and from the middle to our feet the blue still leads; and nothing
  on it is ever dark in any light (the old note's intent, measured as before: no colour under 110 of
  255). The small pictures on the raft keep a copy of the day water in `app/art/cats.js` (`RIVER`:
  Puddle's forepaw Tap and the claws-in-the-log picture; `UNDER_WATER`: the raft from underneath),
  and a test holds the two files together. The Crossing, the marsh (still green water: it is a
  marsh, and never shows the river) and every panel of chapters 1 to 4 are as they were.
- **Wisp's `flinch`** has its eyes squeezed shut (her open gold eyes are `blink`'s). **The herons'
  picture** draws seven as four above three, as her claw draws them in the mud. **The paws-aboard
  picture's** water is the Crossing's deep strip, the colour of the pages before and after it.

**The story (`app/story/ch05.js`, 186 frames)**

- **The gulp is two frames with opposite `when`s** (f116, f117), as the gap's and the prints' are: a
  cat who found Wisp sees her swallow her half (Wisp's `gulp`); everyone else's panel has nothing in
  the reeds. Every frame after it moved up by one (the slip is f121, the Old Bridge f140, the end
  f171).
- **The roof is in this chapter's own hour**: `roof()` gives chapter 4's roof frames `fx: ['day']`
  (she climbs between the lesson and the Crossing) and the two boards that named the afternoon say
  "day"; chapter 4's own frames are untouched.
- **The prints stay** in the marsh mud from the frame where Patience points at them to the end of
  the marsh, on every camera that shows the mud. **On the way home** every river and Crossing scene
  has `fish: 'spare'`.
- **One panel that is not in the text**: f131a, the raft gliding home after "Under the raft" with
  two nostrils and a "blub…" between its logs (the Build note wants `bubbles: true` on the frame
  after each copy of that scene, and the text's next screen on this path has no raft).
- **Riffle asks "What did I miss?" wide-eyed** (f115, `wonder`): the `laugh` face has its eyes
  screwed shut and tears flying, and at panel size he looked upset before anything funny was said.
- Staging: the first two panels are mirrored (the sleeper alone at the left, so the snore is
  lettered over him); Riffle is in every panel that shows his seat (her whisper at the raft, the
  otters' thought and sniff panels); in "Under the raft" the order is Riffle, our cat, Puddle in all
  eight panels; the water worry's cat sits in the middle of the raft; Riffle yells SKYMONSTER with
  both paws up (pointing down is for his slip); she is in every marsh picture, at `raft-edge` for
  the prints; the telling at the den is in the wide view.
- The book's recap names the cat, or Puddle, where a tom's "he" or "him" would have meant two
  animals. A cat who knows Puddle and picks "Not now. He's being a log." does not read "Only blue
  sky." No board puts the fox in an inset outside the old otter's telling and Wisp's drawing.
- **A caption that can be lettered on the panel is 95 characters at most.** Longer, it goes beside
  the panel and the picture shrinks, so the shining river (f046) and the windows (f051b) are two
  boxes each, the words unchanged, and their boards say "Two captions". Two stay long: the end
  page's (an end page letters beside the panel by design) and the fox in the mud (f111a: the
  drawing is kept clear and two heads have the top, so no second box fits on the panel however
  the words are cut; one box, in the column, with its card).

## Chapter 6 (v0.1)

Chapter 6, *The Snake in the Stones*, is [`chapters/06-the-snake-in-the-stones.md`](chapters/06-the-snake-in-the-stones.md)
(Draft v0.4, final), built in `app/story/ch06.js`. **Its spec,
[`chapters/06-the-snake-in-the-stones.spec.md`](chapters/06-the-snake-in-the-stones.spec.md) (v0.2),
is the build's contract**: the flag, the Counts sets, the cards, the art needs, the build notes and
the names, which the art, the engine, the storyboard and the story all use as written there. No new
engine key and no new set (the spec's "Engine needs": no new key, and one behaviour, below). This
section records the names and the words as built; the spec has the rest.

**The art's new names** (every option off by default and every anchor and camera additional, so
chapters 2 to 5 draw as they did):

- `title`: anchor `wall-3` on `wide` (the front of a patrol walking right). A second composition,
  the old wall's far end where the reeds begin: cameras `end` and `meet` (no `reeds`: cut in spec
  v0.2), anchors `end-1` to `end-3` and `reed-1` to `reed-3`, option `rustle`.
- `sky`: a second composition, the dream: cameras `walk` and `below`, anchors `star-1`, `star-2`.
- `bridge`: option `stones` on `back` (Coil's wall beside Sprinkle's nook) and anchor `gap`; camera
  **`wall`, a composition of its own** (as the field's border cameras are), with `gap`, `back-left`,
  `back-right` and `dragon` of its own. `wall`'s `gap` is 370 high (after review; it was 205): Coil's
  size in that close shot, not a depth, so his head is about two fifths of our cat's beside him and
  his eyes read; in `back` the chapter gives him `size: 1.45` for the same share. His `stone` pose is
  the old stones' blue-grey, with no bands, until the tap shows his face.
- `field`: anchor `grass` (Sleet's spot past the last post) in the three border cameras. Sleet's
  `tail` pose (after the final review) is a dragonet's tail, not a thin hook: thick at the grass and
  tapering to a point, his plates along its back, three scale arcs, a curl and the flick's lines, its
  tip standing clear above the grass (the set gives it a sitting dragonet's grass).
- `pile`: **`moon`, a number** in `opts` (default off): the evening's age, `moon: 6` tonight.
- `den`: `hidden: true` also takes `coil-diggers` under the moss.
- Cast: `coil` (poses `stone`, `head`, `long`, `longer`, `still`, `listen`, `think`, `slide`),
  `sloshbank`, `reedclan` (variants 1 to 4, marsh coats of their own), `sleet` (poses `hidden`,
  `tail`, `flat`, `point`, `call`, `puff`, `droop`, `sit`, `pawup`); Riffle's pose `puff`. Extras:
  `holds: 'pinecone' | 'pebbles' | 'string'` (with `holdAt`), `tap: 'pinecone' | 'paw' | 'stone' |
  'eyes' | 'pebbles' | 'cheeks' | 'ears'`, `starry: true` (the starry cat, a `clancat`), `grass: true`.
- Counts art: `kind: 'roll'` (Sleet's roll call), Sleet's forepaw on the 5s, `reedclan` in the
  patrol picture's `who`. The patrol picture (table 3, which no chapter before 6 draws) has a wider
  tile (236), so each patrol's three walkers end on their own green card (after review; the counts
  fingerprints of chapters 1 to 5 leave table 3 out, and are otherwise unchanged).

**Engine, UI and tools, as built (chapter 6)**

- `E.VERSION = '0.6.0 (chapter 6, 2026-10-18)'`; the save stays version 2 and nothing new is stored
  (`foundSleet` is a sticky flag like `foundWisp`).
- **A Count is learned when its own set is finished** (`E.learnedCounts`, after review): the set
  `E.countSets` names for its table, not any finished set on that table. Chapter 6 asks four patrols
  of three (`ch06-four`) before the threes' lesson, and the Hollow's "Patrols · the 3s" and the
  tree's sixth mark (`marks: 'auto'`) wait for the lesson. Chapters 1 to 5 are unchanged: each
  Count's own set is the first of its table finished there.
- `PC.ui.speakers`: `coil` "Coil", `sloshbank` "Sloshbank", `sleet` "Sleet", and `reedclan` by
  variant: 1 "ReedClan she-cat", 2 "Young ReedClan tom", 3 and 4 "A ReedClan cat" (no variant reads
  as 1, as an otter's does). The chapter's `names` (`coil: 'The snake'`, `sleet: 'The silver-white
  dragon'`) and a balloon's own `name` ("A voice", "The long grass", "The starry cat") win, as
  before. Read to me (pitch, rate): Coil 0.72, 0.7, the slowest voice in the game; Sloshbank 0.62,
  0.88; Sleet 1.45, 1.04; the young tom pitch 1.12, the other ReedClan cats 1.0. Nobody else's voice
  changes.
- **`faceHidden`**: a named balloon whose speaker is in pose `stone`, `hidden` or `tail` keeps its
  face to itself, as `eyes` and `hide` do. No cast of chapters 1 to 5 uses those three poses, so no
  earlier balloon changes.
- `PC.ui.flagWords.foundSleet`: "found Sleet at the last post of the Barking Field (later chapters
  remember)".
- `tools/storyboard.mjs` has words for every name above, and each character's own where the shared
  pose word would be wrong (`COIL_POSE`: the global `head` is Puddle's and `slide` Riffle's;
  `SLEET_POSE`; `OTTER_POSE.puff`, Riffle's cheeks; Coil's `sniff` mood), on the dragonet page too.
  It also prints, only where a chapter uses them: the wall's end, the dream and Coil's wall in place
  words of their own; a Counts set's own `who`; `kind: 'roll'`; an `ask` whose asker is a she and
  whose answer is the reader's, on a scene with nothing owed; a 3s skip-count as patrols; `asleep`
  lying down.
  `--check-words more.json` adds a chapter's names to the art's vocabulary before it checks (the
  tests run it with the spec's), and it now checks each variant of a cast member that has words by
  variant. Chapters 1 to 5's storyboards regenerate byte for byte. Two words stay chapter 4's on
  purpose (spec section 7, item 12): the den's `hidden` and the field's border cameras.

## Chapter 7 (v0.1)

Chapter 7, *The Counts Don’t Lie*, is [`chapters/07-the-counts-dont-lie.md`](chapters/07-the-counts-dont-lie.md)
(Draft v0.4, final), built in `app/story/ch07.js`. **Its spec,
[`chapters/07-the-counts-dont-lie.spec.md`](chapters/07-the-counts-dont-lie.spec.md) (v0.3), is the
build's contract**: the flag, the Counts sets, the cards, the art needs and the names. No new engine key
and no new behaviour (the spec's "Engine needs"); no new place and no new cast. This section records the
names and the words as built; the spec has the rest.

**The flag, and the one edit to shipped story code**

- `ch7Flew: true`, sticky, set by the FLEW screen at the Old Bridge on every path (the frame's `sets`).
  Chapter 7 never sets `ch4CaughtFly`, which still means one thing: a noticing cat caught the fox's
  FLEW at the border (chapter 4's f043 is still the only frame that sets it).
- `app/story/ch04.js`, `cards['fox-flew'].link.when`: `{ ch4CaughtFly: true }` became
  `{ not: { ch4CaughtFly: false, ch7Flew: false } }` (`E.matches`' own `not`: either flag `true`), so her
  Case File draws FLEW and can't-fly touching for every cat from the FLEW screen on. Its answers and
  line are unchanged, and so is every other reader of `ch4CaughtFly` (the spec's section 1 lists them).
- `PC.ui.flagWords.ch7Flew`: "saw Sprinkle try to fly at the Old Bridge: the fox’s “flew” can’t be
  true (later chapters remember)". No new speaker, voice or `faceHidden` pose.
- `E.VERSION = '0.7.0 (chapter 7, <ship date>)'`; the save stays version 2 and nothing new is stored.

**The art's new names** (every option off by default, every camera and anchor additional): the pile's
cameras `rear` (round the back) and `hole` (the tunnel's mouth), anchors `rear-1`, `rear-2`, `guard-1`
to `guard-3`, `brink` and `arch`, options `tunnel`, `tracks` and `tap: 'none' | 'back' | 'roots'`; the
bridge's camera `print`, anchor `over`, options `tap: 'none' | 'print'` and `compare`; the hollow's
`compare` (both declared `[false, [24, 60]]`, one painter); the den's `hidden` taking three more cards;
the cast extras `tap: 'fish'` (Riffle's string) and `tap: 'mist'` (Sprinkle's burp); the Counts
pictures `kind: 'cheeks'`, `'cheeks-top'` and `'marks'` (with `ground`), the skip-counts on
`thing: 'gap'` and `thing: 'whisker'` (one cheek at table 3; cheeks at table 6, a `who` pair one face),
and the sand at per 6.

**Words (`tools/storyboard.mjs`)**: words for every name above (the pile's two cameras round the back
with place words of their own, `PILE_REAR` and `PILE_HOLE`; her `reach` over a print under the Old
Bridge reads as the marsh's turned round; `compare` from its two numbers, in the mud or the sand; a `tap`
value nobody gave prints as its bare id, so `--check-words` finds it); the new skip-counts and Counts
pictures (the empty places one at a time, one cheek's two rows of whiskers and the cheek kept after it,
cheeks with a `who` pair worded as one face, nights of marks lit a night at a time as their teacher hops
them, the 6s' sand three and three, a set's own question words, `prompt`). A frame that draws a picture
of its own (a skip-count, the questions she taps out, a row of bark) no longer says a kept picture stays
on it, as the page never drew one there. **A card link's condition** reads a `not` whose every value is
false as the or it is ("once ch4CaughtFly or ch7Flew is true"); every other `when` reads as before, so
chapter 5's "found today" (`not` over three flags, all false) prints as it always has. The den's
`hidden` words are count-free: "her secret cards under the moss, a corner showing for each".
Chapters 1 to 3's storyboards regenerate byte for byte; chapters 4 to 6's differ only in chapter 4's
`fox-flew` card row and the den rows' `hidden` words (with both put back, each is the shipped file), and
in chapter 5's `ch05-bill` row: a Counts frame with `intro: false` is now worded from its set's first
fact (asked in the engine's words and timed on itself; in its own words, read first, so only a miss
counts as hard; or a check, never timed), and the bill's 9 × 2 has its own question. A doc correction,
not play.

**Integration round 1** (the build review): Sprinkle's print on the bridge's `print` camera is drawn as
big as the wide shots draw her prints (`PR.paw` 4.6, about four-tenths of the cat's height there), its
toes toward us, our cat's paw over its heel pad (`over` raised to y 799 with it), its lit rim
(`data-art="print-rim"`, 0.9) drawn after her shadows; the bridge's `compare` on `under` sits higher and
bigger (`U_COMPARE` y 856, digits 42); the pile's `hole` draws its heap without the two soft dips and their
root arcs (`dugEarth`'s `noDips`, passed by `drawHole` only, so every other camera draws as it did). All
three are chapter 7's cameras or options; nothing of chapters 1 to 6 draws differently.

**Final review** (the last fixes before the ship): chapter 5's cast extra `asleep` takes a second value,
`'half'` (half asleep: heavy upper lids down to the middle of the eyes, sagging a little, `LID.lidDrowsy`,
whatever the mood, which keeps its own mouth and blush; `vocab.extras.asleep` is `[true, 'half']`, and
the storyboard words it "eyes half shut, heavy-lidded: half asleep"), for our cat curling up to sleep
(f103, `kind`: `kind` alone looks out wide awake). The pile's `tracks` read on an iPad page: a dark bed,
sleepers across it (one filled shape), two rails 5 wide over a soft glow, from x 880 off behind the
tallest tower; its `arch` anchor is as big as a cat by the back row (`h` 172, was 108). Both draw only
with chapter 7's option and anchor, and `asleep: true` draws as it did, so nothing of chapters 1 to 6
draws differently. In the story: the told FLY panel's Tallyheart stands by the wall behind our cat
(`{ x: 300, y: 960, h: 330 }`, facing right, before our cat in the cast), clear of the hurt wing, and the
twenty-four's Tallyheart crouches with `claws: true` as she scratches the sand. The bridge's `back` takes
`wing: true` (declared `[false, true]`, off by default; the FLY pair only): Sprinkle's drooping wing at
`dragon` (`WING_KEEP`, x 1040 to 1440, y 630 to 780) goes in `keep`, so the told panel's second balloon
(“I KNEW it!”) no longer lands on it; nothing is drawn.

**The proof that chapters 1 to 6 are unchanged** (the spec's section 7, item 2):

- `tests/fixtures/ch06-golden.json`, recorded by `tests/fixtures/make-ch06-golden.js` from the shipped
  chapter-6 tree (`GOLDEN_ROOT`, in a process of its own): ten readings of chapters 1 to 6 and a reread
  (a noticing cat who catches FLEW, rereads chapter 1 as a climber, then chapters 4 and 5), every frame
  and what it shows, with the art's drawings hashed (scenes, Counts pictures, sand, cards: the
  per-render ids taken out, `strip`, and every drawing made a second time before recording to prove its
  hash does not move), the speakers' labels and voices, Read to me's captions, every lesson hop by hop,
  the Hollow, the book, the grown-ups corner and the cat. Every card's `link` is digested as
  `{ with, line, drawn }`, never its raw `when`. `tests/engine.test.js` compares today's tree with it.
- The same ten readings again with every loaded story handed to the engine, as the page does (ui.js's
  `stories()` is `PC.story`): `run6` reads the chapters in `ctx.read` (chapters 1 to 6) and hands the
  engine `ctx.list` (here `PC.story`) everywhere else. Every reading, lesson and Hollow round, the corner,
  her cards and file and the cat match the golden exactly; only the list's own deltas are allowed, by
  name: chapter 6's teaser in her book is `built: true, next: 'ch07'` (its words as they were), and the
  hub's `E.upNext`/`E.progress` offer chapter 7 instead of "coming soon". Chapters 8 to 10 leave those as
  they are, so any other difference there is a later chapter changing an earlier one (final review).
- `ch04-golden.json` is never re-recorded: its test sets `fox-flew`'s condition back to
  `{ ch4CaughtFly: true }` while it reads (restored in a `finally`, the records digested inside it) and
  checks at every frame that the two conditions agree.
- After chapter 7: every golden reading's cat, with `ch7Flew` and without, reads chapters 4 and 5 again;
  everything she sees is the same but her Case File, which gains FLEW and can't-fly touching, and only
  for a cat without `ch4CaughtFly`. A truth table checks the link over every combination of the two flags.

## Chapter 8 (v0.1)

Chapter 8, *The Night Trail*, is [`chapters/08-the-night-trail.md`](chapters/08-the-night-trail.md) (Draft v0.4,
final), built in `app/story/ch08.js`. **Its spec, [`chapters/08-the-night-trail.spec.md`](chapters/08-the-night-trail.spec.md)
(v0.2), is the build's contract**: the flag, the Counts sets, the cards, the art needs, the build notes and the
names. One engine change, a card link's own line for each partner (the spec's "Engine needs", approved under
decision 46 and recorded in the README); every Counts key is chapters 2 to 7's. One new place, `tracks`, and three
new characters, Hail, Snip and Snatch. This section records the names and the words as built; the spec has the rest.

**The flag**

- `foundHail: true`, sticky, set on Hail's last screen in the Barking Field (a told and a kept twin, each with
  `sets: { foundHail: true }` on the frame, never on an option; saying no to the log sets nothing). No route flag:
  nothing after the weasel holes reads which way she went (the spec's section 1).
- `PC.ui.flagWords.foundHail`: "found Hail in the hollow log in the Barking Field (later chapters remember)".

**The engine's one change: a partner's own line (`link.lines`)**

- In `E.caseFile`'s `link.with` branch, `link.lines: { <partner id>: line }` gives that partner its own line;
  every other partner joins over `link.line` (or “They can’t both be true.”), and an empty or non-string entry
  is no line. The joins are made in the order of `with`, and a row only grows at its ends (`touch` never merges
  two rows), so the order matters: the brag's `with: ['fox-flew', 'sleet-den']` joins the FLEW row first and then
  lays Sleet's den card at its end, a row of four for a cat who found Sleet (`cant-fly` — “They can’t both be
  true.” — `fox-flew` — “He said FLEW. Now he calls it a story.” — `fox-brag` — “The same fine, dry den.” —
  `sleet-den`); the other order leaves two rows apart. A link drawn by its `answers` reads no `lines`.
- `E.checkStory` checks `lines` as it checks `line`: when present, an object whose every key is one of the
  link's `with` and whose every value is a line ("card fox-brag: link lines is { <a card it touches>: its own
  line }", "…link lines names a card its with does not: scale", "…link lines for sleet-den needs its one line").
  Every chapter 1 to 7 story stays clean.
- `E.cards` copies the link as it stands, `lines` included. No card of chapters 1 to 7 has `lines`, so every file
  of every live save lies exactly as it did.
- The page (`ui.js`) letters a row from its `lines`, as since chapter 5. A row of four (`cf-pair n4`) has three
  joins: the first kept left (`j0`), the last kept right (`j1`), and the one between them centred (`jm`, the
  line's own `text-align:center`; index.html styles no `jm`), so each line reads under its own join, in landscape
  and portrait. A pair and a row of three are lettered as they were (`j0`, `j1`).
- `E.VERSION = '0.8.0 (chapter 8, 2026-10-21)'`; the save stays version 2 and nothing new is stored.

**Speakers and voices**

- `PC.ui.speakers` names `hail` "Hail", `snip` "Snip" and `snatch` "Snatch", after chapter 6's. The chapter's
  `names` (`snip` and `snatch` "A weasel", `hail` "The speckled dragonet") and a balloon's own `name` ("A white
  head", "Snip", "Snatch", "Hail", "Good Boy", "Drop It", "The dogs") win, as before; the tiny dog keeps "The tiny
  dog". Read to me (pitch, rate): Hail 1.5, 1.08 (bright and quick); Snip 1.65, 1.12 (squeaky); Snatch 1.35, 1.0
  (a little lower, his mouth full). Nobody else's voice changes. No new `faceHidden` pose: every new pose shows a
  face.

**The art's new names** (the spec's section 4; every option off by default, every camera and anchor additional)

- `tracks` (new, `sets/tracks.js`, always at night): cameras `wide`, `hide`, `holes` and `brag` on the bank,
  `stash` and `stash-close` inside the biggest hole, `crawl` and `fork` inside the tunnel; anchors `tunnel-end`,
  `foot-1`, `foot-2`, `hole-1`, `hole-2`, `rails`, `weeds-1`, `weeds-2`, `stash-mouth`, `watch`, `slope-1`,
  `slope-2`, `stash-in`, `near`, `crawl-1`, `crawl-2`, `fork-1`, `fork-2`; options `moon` (a number),
  `tap: 'none' | 'weeds' | 'stash' | 'glass'`, `tight` and `worm`.
- `field`: the night (`fx: ['night']`), options `moon` (a number) and `tap: 'none' | 'path'`; anchors `heap-1` to
  `heap-3`, `log`, `wire`, `ring-1` to `ring-4`, `fence-top` (`wide` only), `trail-1`, `trail-2`. At night a cat
  lying `flat` on the path lies in the grass at its edge (the path's near edge grass to just past her nose,
  `data-part="grassy-edge"`, and Sleet's grass over her lower body in the night's colours, `data-part="path-grass"`);
  no option, and nothing by day. `tracks`' `crawl` and `fork`: solid dark earth over the roof, a lip along it.
- `pile`: anchor `poke` (`rear`), `tap: 'mouth'` (`rear` with `tunnel`, and `hole`); `night` on `rear` and `hole`.
- `den`: `moon: 8` (the half moon, at night or dusk) and `glass: true`; the nest's corners in layers of six past six
  secrets and a third course of bark past eighteen along the edge (`BARK_MAX` 27; the spec's section 4).
- Cast: `hail` (`sit`, `stand`, `bounce`, `run`, `peek`, `pawup`, `tilt`), `snip` and `snatch` (`stand`, `up`,
  `run`, `skid`, `peek`, `point`, `curl`); the cats' `run`, the dogs' `lie` (and `asleep`), Reynard's `trot`.
  Extras `tailUp: true`, `tap: 'tail' | 'leaf'` (Riffle's `tap: 'ears' | 'paw'` are chapter 6's names, on him
  now), `holds: 'leaf' | 'glass' | 'mouse'`.
- Counts art: one cat's paws a pair at a time (`thing: 'paw'` at per 2; she faces left, so her front pair, counted
  first, is on the left and 2, 4 read left to right), `kind: 'dogs'` (the field's four, a set's own `who`; Hail
  stands on four feet stepped apart, forepaws resting), marks with `layout: 'pairs'` (two and two), the sand at per 4 two and two.

**Words (`tools/storyboard.mjs`)**: words for every name above, each printed only where a chapter uses it.
The bank (`SETS.tracks`), the tunnel's inside (`TRACKS_TUNNEL`, for `crawl` and `fork`) and the stash
(`TRACKS_STASH`, for `stash` and `stash-close`) are place words of their own, and every `tracks` camera has words
in `SET_CAMS.tracks` (no global camera word is borrowed); the set is always at night (`TOD_FIXED`). The field at
night reads "silver in the moonlight". An anchor may read differently through one camera (`CAM_ANCH`: the weasels'
holes close up and from the weeds, the fox on the rails beside the weasels, the dogs' own stretch of the path).
Hail's, the weasels' and the dogs' poses have words of their own (`HAIL_POSE`, `WEASEL_POSE`, `DOG_POSE`; Reynard's
`trot` in `REYNARD_POSE`), and the weasels' moods are drawn their way (`WEASEL_MOOD`: a shout a squeak, a laugh
cheeky, stern a pout). `moon: 8` is "a bright half moon, eight evenings old" (a number under eight reads as
before). A one-tap frame's mark carried by somebody else is theirs (`TAP_WHO`: Riffle's small round ears, his near
forepaw, the friend's raised tail) and her paw mid-run is her front paw (`TAP_SELF`); the tunnel's mouth, the path,
the weeds, the biggest hole, the piece of glass and the leaf have words in `TAPS`. The skip-counts on paws: one
cat's two pairs (the cat kept on the plain pages after it, both pairs lit, 2 and 4 under them) and cats by fours,
a cat a tap; the 4s' lesson is the table-4 cats (no `kind`, `thing: 'paw'`), its `lit` counted in cats, its sand
two and two; `kind: 'dogs'` is lit an animal at a time as its teacher hops it; nights of marks two and two. A card
link's `lines` print on the card row, each partner with the line it joins over, in the order of `with`.
`--check-words` passes with the spec's names and declarations added (`tests/tools.test.js`, with names the spec
never gave failing). Chapters 1 to 7's storyboards regenerate byte for byte, and `ch08.md` was regenerated from
the stub.

## Chapter 9 (v0.1)

Chapter 9, *Featherlight*, is [`chapters/09-featherlight.md`](chapters/09-featherlight.md) (Draft v0.4, final),
built in `app/story/ch09.js`. **Its spec, [`chapters/09-featherlight.spec.md`](chapters/09-featherlight.spec.md)
(v0.2), is the build's contract**: the flags, the Counts sets, the card, the art needs, the build notes and the
names. **No engine change** (the spec's "Engine needs": none; chapter 8's inherited filler need is met by the
sets' data, decided under decision 46 and recorded in the README): every key is chapters 1 to 8's. One new place,
`grove`, and new cast: Thymeleaf, Mizzle, GroveClan's two cats (by variant, unnamed) and the spider. This section
records the names and the words as built; the spec has the rest.

**The flags**

- `foundMizzle: true`, sticky, on Mizzle's last screen in the oak's hollow (on the frame, never on an option;
  saying no to the hollow sets nothing). `ch9Roof: true`, sticky, with `foundSquall: true` on the last frame of
  chapter 4's roof scene run again for a cat who never met Squall (as chapter 5's `ch5Roof`; the two are never
  both true). No choice flag.
- `PC.ui.flagWords`: `foundMizzle` "found Mizzle in the old oak in GroveClan’s woods (later chapters remember)";
  `ch9Roof` "met Squall in chapter 9: the roof, offered again ({their} book says so on chapter 9’s page)"; both
  last in the corner. **`ch3Told` false keeps its words** ("kept Sprinkle’s secret: only Riffle knows too"),
  though they no longer hold after chapter 9's kept path tells Tallyheart: they describe the chapter 3 choice,
  and the goldens pin them (the spec's section 7, item 16). `tests/engine.test.js` pins the string, with a note
  saying why; do not "fix" it.
- **Chapter 4's page** (`app/story/ch04.js`, `book.recap`, the one edit to shipped story code): its three
  "found Squall" lines take `ch9Roof: false` beside their `ch5Roof: false`, and a new line after chapter 5's
  reads `{ when: { ch9Roof: true } }`: "On the roof of {their} old tower, Sprinkle’s littlest brother is still
  roaring, and hiccuping." No live save holds `ch9Roof`, so the page reads as it did for every one of them
  (`tests/story-ch04.test.js` runs the truth table of `foundSquall`, `ch5Roof`, `ch9Roof` and `ch4CaughtFly`).
  Chapter 5's page needs nothing.

**Engine and UI**

- `E.VERSION = '0.9.0 (chapter 9, 2026-10-26)'`; the save stays version 2 and nothing new is stored.
- `PC.ui.speakers` names `thymeleaf` "Thymeleaf", `mizzle` "Mizzle" and `groveclan` "A GroveClan cat", after
  chapter 8's, with `VARIANT_NAMES.groveclan` `{ 1: 'A GroveClan elder', 2: 'A GroveClan apprentice' }` (no
  variant reads as 1). The chapter's `names` (`mizzle` "The sleepy dragonet", until "I’m Mizzle.") and a
  balloon's own `name` (Squall's "A voice" from behind the pole) win, as before. Read to me (pitch, rate):
  Thymeleaf 0.82, 0.85 (low, warm and slow); Mizzle 1.35, 0.82 (sweet and sleepy, slow); the elder 0.78
  (`VARIANT_PITCH.groveclan[1]`), 0.86 (`RATE.groveclan`: the rate takes no variant, so it is every GroveClan
  cat's; the apprentice never speaks). Nobody else's voice changes. No new `faceHidden` pose: Squall's `hidden`
  is a name `NO_FACE_POSES` has had since chapter 6.

**The art's new names** (the spec's section 4; every option off by default, every camera and anchor additional)

- `grove` (new, `sets/grove.js`, always by day, "the bright afternoon"): cameras `bridge`, `wide`, `meet`, `oak`
  and `hollow`; anchors `near-1`, `near-2`, `span-1`, `span-2`, `far` (`bridge`), `edge-1` to `edge-3`, `elder`,
  `fern` (`wide`, and `elder` and `fern` on `meet` and `oak` too), `meet-1` to `meet-3` (`meet`), `root-1` to
  `root-3`, `trunk`, `moss` (`oak`), `nook`, `lip` (`hollow`); no options.
- `camp`: camera `herbs` (Thymeleaf's den, a composition of its own), anchors `herbs-1` to `herbs-3` and `web`,
  option `remedy: 'none' | 'four' | 'mixed'`.
- `den`: camera `case` (the case laid out on the floor), anchors `case-1` to `case-3`, option `read` (a number,
  0 to 7: the rows lit, the next one glowing, the seventh row at 7), and `moon: 13` (nearly round).
- `title`: options `root` and `tap: 'none' | 'root'`. `roof`: option `dew`, anchor `puddle`. `bridge`: option
  `shallows` (`bank`), anchors `run`, `run-2`, `skim`, `air`, `paddle`, `watch-1` to `watch-4`.
- Cast: `thymeleaf` (a cat's poses), `mizzle` (`curl`, `yawn`, `sit`, `wake`, `pawup`), `groveclan` (variants 1
  and 2, a cat's poses), `spider` (`spin`, `wave`); Sprinkle's `hop`, `flap`, `glide`, `fly`, `splash` and `tap:
  'wing'`; Squall's `hidden`; Riffle's `holds: 'mint'`.
- Counts art: spiders (`thing: 'leg'`, no `kind`: the 8s, eight legs each, four a side), one spider's two sides
  (`thing: 'leg'` at table 4 with a `who` of one spider), `kind: 'dose'` (rows of eight, four and four, the mark
  by the set's `thing`: `drop`, `rub`, `flap`), `kind: 'acorns'` (twigs, eight acorns each), the plain sand at per
  8 four and four.

**Words (`tools/storyboard.mjs`)**: words for every name above, each printed only where a chapter uses it.
GroveClan's woods (`SETS.grove`), the old oak (`GROVE_OAK`), the hollow (`GROVE_HOLLOW`) and Thymeleaf's den
(`HERBS`, the camp's `herbs`) are place words of their own, and every `grove` camera has words in
`SET_CAMS.grove`; the elder's spot reads differently on `wide` and `oak` (`CAM_ANCH.grove`). The roof by morning
is "at first light" (`SET_TOD_WORDS`; no shipped roof frame is drawn by morning). `optWords` takes the camera
too, so on the den's `case` her bark is laid out on the floor in six rows by card (the rest stacked face down)
and her glass lies beside them; every other den camera keeps its words. `read` names the rows lit and the one
glowing (`CASE_ROWS`); `moon: 12` is "more than half and growing", `moon: 13` "nearly round, thirteen evenings
old" (no shipped frame has a moon past 8). Mizzle's and the spider's poses have words of their own
(`MIZZLE_POSE`, `SPIDER_POSE`), Sprinkle's flight is in `SPRINKLE_POSE` and Squall's tail tip behind the pole in
`SQUALL_POSE`; Thymeleaf's leaf holds the remedy; Riffle's mint is a cast extra. The taps: the root and the wing
(`TAPS`), her own nose and raised tail in any pose (`TAP_MINE`), her front paw mid-step (`TAP_SELF`), and a cat's
ears are a cat's (`TAP_WHO`: only Riffle's are small and round). The skip-counts on legs: one spider's two sides
by 4s, spiders by 8s, four and four; the 8s' lesson is spiders (`thing: 'leg'`), its sand four and four, hopped by
eights; the doses are rows of eight drops, paw marks or strokes lit a row at a time (in her own count when nobody
speaks, else in the teacher's); the acorns light a twig at a time as Mizzle hops them. An `ask` whose asker
answers himself (Thymeleaf's four things) letters two balloons of his a tap; an `ask` with `opt: 'read'` (the
case) is tapped on the glowing row, each tap lighting it. A recap line that reads `ch9Roof` prints its condition
as any other. `--check-words` passes with the spec's names and declarations added (`tests/tools.test.js`, with
names the spec never gave failing). Chapters 1 to 8's storyboards regenerate byte for byte but for `ch04.md`'s
book rows (the recap edit), and `ch09.md` was regenerated from the stub.

## The Warrior Counts (v0.1)

The Warrior Counts (decisions 48 and 49) are [`warrior-counts.md`](warrior-counts.md) (Design v0.4), built in
`app/story/warrior.js`, `app/engine.js` and `app/ui.js` on the `warrior-counts` branch from chapter 8's tree,
reviewed twice, and merged onto chapter 9 on 2026-10-31. **That design is the build's contract**: section 6 the
save, section 7 every piece with what it does and the guard that keeps the chapters as they are, section 8 the
tests; the calls are in the README, under decision 46. They are not a chapter: `PC.warrior`, never `PC.story.*`,
so `E.chapters`, `E.progress`, `E.countSets`, the chapters' storyboards and the goldens never see them. They open
once chapter 10 is finished (`PC.warrior.after`), so in a tree without chapter 10 no player sees them; they ship
with it. This section records the names as built; the design has the rest.

**The story file** (`app/story/warrior.js`, `PC.warrior`; its header has the shape in full)

- `after: 'ch10'`; `scene`, the question panel (chapter 3's fountain, written with the crowd and drawn with the
  sitting's `st.crowd`); `open: { first, again, quiet, resume }` (four panels, one, one, and the runner's intro
  "Where were we? Ah, yes."); `aside: { late, practice }`, put at the start of Tallyheart's balloon; `halfway`, one
  frame; `beats: { 14, 42 }`, Tallyheart's lines at those pauses (28 is `halfway`).
- `pass`, `notYet`, `afterPass`: each `{ frames, <variant key>: frame }`, an entry of `frames` a frame or a slot
  `{ by: [keys], else? }` played by `E.warriorResult`'s variant (`pass.clean`, `pass.quiet`; `notYet.first`,
  `second`, `later`; `notYet.better`, `close`, `plain`; `afterPass.clean`, `afterPass.number`), never by `when`.
  A balloon with `chips: true` has her missed pairs under it, `one` its words over a single chip.
- `counts`: `praise`, `fast` (one right answer in five gets a word, the lines among blanks), `remembered`,
  `rememberedSlow` (four each, a blank between), `missLast` (four, in turn), and `last`, 10 × 10's `prompt`,
  `right` ("A HUNDRED!") and `missLast`. No `fastAfterMiss`, no help openings: each anchor Count's own.
- Tokens: the result's `{right}`, `{Right}`, `{last}`, `{Last}`, `{short}`, `{tricky}` and `{Tricky}`, number words
  through `E.countWords`, filled before the cat's own (`{name}`, `{petname}`, `{Murmur}`). No new art, no new
  speaker: Glintstar, Tallyheart, {Murmur}chime, the old tom and the crowd are chapter 3's.
- Its script tag comes after the chapters (after `ch09.js`) and before `engine.js`, in `index.html` and
  `dev/gallery.html`; its path is in `sw.js`'s `ASSETS` after `ch09.js`.

**Engine** (a section "the Warrior Counts" after the Training Hollow's)

- Numbers: `E.WARRIOR_PASS` 50, `E.WARRIOR_BEATS` [14, 28, 42], `E.WARRIOR_PAUSE_MS` 7,200,000 (two hours),
  `E.WARRIOR_TRICKY` 12, `E.WARRIOR_NEW` [[7, 7], [7, 8], [8, 8]], `E.WARRIOR_KEEP` 100, `E.WARRIOR_STARTS`
  [100, 200], and `E.WARRIOR_WAITING`, the Hollow's waiting line.
- New: `E.warriorPairs`, `E.warriorAnchor` (the pair's Count taught first by `E.countSets`' order; a table with
  no set yet after every taught one, two such the smaller: with chapter 9 the 8s are taught and 7 × 8 is seven
  spiders, while the 7s wait for chapter 10), `E.warriorHard`, `E.warriorFacts`, `E.warriorDef`, `E.warriorAsk`,
  `E.warriorBegin` (a new sitting's `at` never earlier than her latest answer when that is less than two hours
  ahead, so a device clock set back a little cannot make it stale as practice at once), `E.warriorOpen`, `E.warriorKeep` (never moving the same sitting's `at`
  back), `E.warriorFinish`, `E.warriorResult`, `E.warriorSeen`,
  `E.warriorBeat`, `E.warriorPaws`, `E.warriorState`, `E.countWords` (number words to 100).
- Changed, each only with `warrior` data, `mode: 'warrior'` or a story with `opensWhen: 'warrior'`:
  `E.recordLesson` (a sitting goes to `E.warriorFinish`, never to `lessons` or `lesson`), `E.isOpen` (the
  Ceremony opens once she has passed), `E.hollowLines` (`waiting`, the tricky greeting, `tricky` and `tricky:
  true` on a marked Count; it reads `opts.now` and `opts.tricky`), `normCat` (`normWarrior` for her own `warrior`
  key only; a saved lesson whose state is a sitting's dropped from `lesson`, `hollowWaiting` and a place), and
  `E.hardFacts`, whose rule moved into a private helper (`hardRule`) it shares with `E.warriorHard`, its output
  unchanged.
- The save stays version 2. One optional field on a cat, `warrior: { sitting: { at, state } | null, attempts,
  passedAt }`, absent until her first sitting (not in `E.blankCat`); the sitting is a lesson state with `mode:
  'warrior'` run by the Counts runner untouched. Each answer goes into `counts` with `set: 'warrior'` and `table`
  its anchor Count.
- `E.VERSION = '0.9.1 (the Warrior Counts, 2026-10-31)'`.

**The page** (`app/ui.js`, `index.html`)

- Pure, for Node: `PC.ui.warrior` (`hub`, `opening`, `openKind`, `result`, `variant`, `tokens`, `tricky`,
  `chips`, `pause`, `beatMs`, `readMs`, `speechMs`, `scene`, `paws`, `pawOn`, `pawFills`, `PAW_WORDS`, `QUARTERS`,
  `corner`, `slip`, `sittingOf`, `lastFinished`, `unseen`, `passed`, `open`, `afterPassUnseen`, `passShown`).
- The view `warrior` (`renderWarrior`; steps `open`, `q`, `halfway`, `result`), its frames with the big Back
  within their own list; `runLesson`'s mode `warrior` (the fountain under the questions, `#wpaws`, the pauses,
  `E.warriorAsk`, `E.warriorKeep` after every answer but the last, `E.recordLesson` at the last;
  `.frame[data-mode="warrior"]`; on the help's last page `#wpaws` is hidden, `drawPaws()` shows it again, and
  "Got it!" sits at the top of the keypad's place, so bringing it in keeps the anchor's reminder on the screen);
  the halfway page's `#keepGoing`; the result's `#resultCamp`, `#resultHollow`
  ("The Training Hollow", or "Back to the Training Hollow" over a round to pick up) and `#resultCeremony` ("To
  your ceremony"). Every timing and guard change (the reading waits, the pauses, the clock, the tap-time guard)
  is warrior-only.
- The hub: `#warriorBtn` (`hub-warrior`, the paw, `ICON.paw`) in the next chapter's big slot, and `#warriorAgain`
  (`hub-again`) quiet under the Ceremony's; read again on a tap and on `visibilitychange`. The book's and the
  hub's "Your ceremony is coming soon." once her pass is seen and the Ceremony is unbuilt. The bar: "The Warrior
  Counts" under the title, Camp shown, the Case File's button off; ‹ goes to the hub, the sitting kept.
- The Hollow: the waiting line in the greeting's place (a round picked up says it over its next question, and its
  keypad is brought into view, only for a cat with `warrior` data); a small paw (`.trickypaw`) on a marked
  Count's button, placed in the button's left padding (`position: absolute`; with Bigger text 1em, the button's
  left padding 1.3em), so a marked Count's name keeps its line; the tricky greeting kept, once, for the page after the not-yet's "Back to the Training Hollow"
  (`wTrickyDue`).
- The grown-ups corner: a Warrior Counts line and each attempt (a missed answer that starts the right one is "a
  slip?"); the Ceremony "opens once the Warrior Counts are passed".
- `PC.debug.warrior(what, i)`, for the Safari tool: `open`, `q`, `sand`, `halfway` or `result`.
- CSS: `.hub .btn.hub-warrior` (gold with an ember edge), `.wpaws`, `.wpaw` (`.wpaw-e`, `.wpaw-f`, `.full`), `.wchips`
  and `.wchip` (Andika, two a row at any text size, `.85em` with Bigger text), `.trickypaw` (and `.counts-pick
  .btn .trickypaw`), and `.frame[data-mode="warrior"] .gotit` (top-aligned).

**Tools**

- `tools/storyboard.mjs` also writes `docs/storyboard/warrior.md` from `PC.warrior` (`warriorStory`: every frame
  under an id of its own, under headings of its own); the chapters' storyboards regenerate byte for byte.
- `tools/shots.mjs`: targets `warrior:open`, `warrior:q`, `warrior:sand`, `warrior:halfway`, `warrior:pass`,
  `warrior:notyet` and `warrior:afterpass` (`#n` a page), each with its own test cat unless CAT has a `warrior`
  recipe (`sittings`, `seen`, `answers`, `stale`, `round`), run through the engine as the page runs a sitting.
  Its `--page` exits only once the page is written (with this CSS the page is past a macOS pipe's 64 KiB; the
  polish release v20 makes the same fix in the same words).

**Tests**: `tests/warrior-engine.test.js`, `tests/warrior-story.test.js` and `tests/warrior-ui.test.js` (the page's
wiring pinned as text), on the real chapters 1 to 9 and stand-ins for chapter 10 (the 7s) and the Ceremony;
`tests/storyboard.test.js` compares `warrior.md`; the version pin is in `tests/engine.test.js`. The depth rule
holds on every scene of the Counts (`tests/warrior-story.test.js`, "staging, depth"), as on chapter 9's.

## Chapter 10 (v0.1)

Chapter 10, *The Gathering*, is [`chapters/10-the-gathering.md`](chapters/10-the-gathering.md) (Draft v0.5, final),
built in `app/story/ch10.js`. **Its spec, [`chapters/10-the-gathering.spec.md`](chapters/10-the-gathering.spec.md)
(v0.4), is the build's contract**: the flags, the Counts sets, the Case File, the art needs, the build notes, the engine
need and the names. Finishing it opens the Warrior Counts (their section above: `PC.warrior`, its `after`, its storyboard
and its test cat). This section records the names and the words as built; the spec has the rest.

**The card pick**, the one engine need (`pick` on a frame, `E.KINDS` after `'file'`; the spec's section 6 has it whole: the
key, the five picks, `E.pickJudge`, `E.pick`, `E.pickOpen`, `E.pickView`, `E.pickWords`, `PC.ui.pickPage` and the pick
screen): Reynard's claim over her whole Case File; a right card sets the pick's `flag` to that card and turns the page; a
wrong one gets Tallyheart's whispered nudge; after three the right cards she holds glow, so it can never fail. Each claim's
screen opens at its top (`openFile`/`closeFile` set `#file`'s `scrollTop` to 0 for a pick only); the strip is `position:
sticky; top: -12px`, below an installed iPad's status bar; when a nudge makes it taller, `pickTapCard` moves the tapped card
down by what it would cover; a right card's pop grows toward the free side; with reduced motion the glowing cards brighten
for a dimmed card's tap; and when no glowing card shows half its picture (after the third wrong pick, once her card has
wiggled; on a dimmed tap; reopened after the glow), `pickShowGlow` slides her file till the first glowing card sits just
under the strip (at once with reduced motion). Nothing is logged, nothing new is stored. **The Training Hollow** offers ten
Counts once `ch10-sevens` is done (“Clutches of seven · the 7s”, last), its list re-laid for ten in `index.html` under
`.frame[data-kind="hollow"]` only (the spec's section 6): held sideways (700px wide or more, 501 to 860px tall) the column is
`minmax(410px, .7fr)` (the picture about 12% narrower for every cat), one column of 50px Counts (54 with Aa) padded for the
paw (1.45em, 1.3em with Aa); three rules at the sheet's end give a list of nine or fewer
(`:not(:has(.counts-pick > .btn:nth-child(10)))`) a 370px column at 1060px wide or less with Aa off, live's own
`minmax(300px, 0.5fr)` at 1134px wide or more with Aa off, and, upright with Aa, the polish release's `.6em` padding;
`tests/aa-room.test.js` pins them. **A lesson's page** (every chapter's, since chapter 10's final review) sets what Read to
me's button says (`saying`: its lines and the question), and one drawn as its page opens (picked up) brings the keypad back
on the screen after `go()`'s scroll to the top, as the Warrior Counts do; the Counts' waiting line over a chapter's first
question (`waitLine`) restarts its clock once read, with Read to me off.

**The art's new names** (the spec's section 4; every option off by default, every camera and anchor additional)

- `ferry` (new, `sets/ferry.js`, the otters' Moon Ferry at dusk and by night, never dark): cameras `shore`, `deck`, `back`,
  `low`, `under`, `river` and the spec's anchors; options `moon` (a number), `clan`, `luggage`, `puff`, `low`, `home`.
- `island` (new, `sets/island.js`, Gathering Island, always under the full moon): cameras `shore`, `wide`, `roots`, `case`,
  `fox`, `mist`, `sky`, `paws` and the spec's anchors (the leaders' `root-1` to `root-3` behind every Clan spot on `wide`);
  options `crowd` (`true`, `'standing'`), `luggage` (`'heap'`, `'open'`), `ferry`, `print`, `mist` (`'rolling'`, `'thick'`),
  `tail`, `grown`, `small` (`'one'`, `'some'`, `'coming'`), `rising`, `zip`, `drawing: 'cat'`, `bubbles`, `tap` (`'reeds'`,
  `'mist'`, `'print'`); no `moon`.
- `den`: `moon: 14`, option `miststone` (`true`, `'flash'`), camera `stone` with its one spot `tail`. `tower`: `night` and option
  `moon`. `riverbank`: options `moon` (the river silver under it) and `flyer`. `hollow`: `marks: 10`. The kit's
  `PC.art.kit.crowd(S, seats, k0)`.
- Cast: `mistscale` (1 Mama, 2 the eldest; `lean`, `nuzzle`, `lift`, `bow`), `reedclan` 5 and `groveclan` 3 (the leaders),
  `groveclan` 4 and 5 (the crowd's coats), Granny as chapter 5's `otter` 3 named by the chapter's `names`; Puddle's `eyes`,
  Reynard's `bow` and `swim`, the weasels' `swim` and `hidepaws`, `wet: true`; `holds: 'miststone'` (with `flash: true`) and
  `tap: 'stone'` on it; `tap: 'nose'` on every dragonet. Counts art: the clutches (`thing: 'dragonet'` at per 7), the sand at
  per 7 four and three, the marks at per 7 on `ground: 'log'`, the roll call's forepaws (`who` entries with `shape: true`).

**Words (`tools/storyboard.mjs`)**: words for every name above, each printed only where a chapter uses it: the Moon Ferry and
Gathering Island as places of their own (`SETS`, `SET_COMP`, `SET_CAMS`, `SET_ANCH`, `CAM_ANCH`), their options set by set
(`ferryIslandWords`), their times of day, the moon at 14 (“full and round, fourteen evenings old”; the riverbank's and the
tower's in `MOON14`), the Mistscales by variant (`MISTSCALE_POSE`), the leaders and the crowd's coats by variant, Granny by
the chapter's name, the new poses and extras, the island's own taps (`SET_TAPS`, `CAM_TAPS`) and a dragonet's snout. The
Counts: the clutches (`CLUTCHES`), the sand at the 7s, a lesson of every Count mixed (`mixedSet`: each fact drawn as its own
Count and helped on the log in its steps), an empty `prompt`, the skip-counts on the clutches and on the clutch's forepaws (the
ones she never found soft grey shapes, in Mama's count), the two weasels' `ask` (two balloons a tap). **The card pick** prints
the claim and its lit word, each right card by its line (one outside the twenty every cat holds, `EVERY_CAT_HOLDS`, “a card only
some cats hold”), the nudges, the glow, the flag and the page a right pick turns to; a `when` on a pick's flag reads the card's
whole line (“if she answered with “Sprinkle can’t fly.””; a `not` of one, “unless …”). **The tool's own graph** follows a pick
(`exits`), so the order, the counts and the read-through run through it; the picks have a row of their own at a glance (“Other
things she taps” is as it was); a frame only an `else` reaches (a twin, a chain of counted conditions) is boarded right after
the frame whose `else` names it; and a flag the frames read only as true or false is walked as one reader for false and unset,
which E.matches reads alike (the same numbers, far faster). `--check-words` passes with the spec's names (`tests/tools.test.js`;
chapters 6's and 9's never-given coats move on to 6). Chapters 1 to 9's storyboards and `warrior.md` regenerate byte for byte
but for `ch05.md`'s book rows.

**Chapter 5's page** (`app/story/ch05.js`, `book.recap`, the one edit to shipped story code): the "found Puddle" line reads
`{ foundPuddle: true, ch10Puddle: false }`, the forepaw line `{ not: { ch5Roof: false, foundWisp: false, not: { foundPuddle:
true, ch10Puddle: false } } }` (the book only; the frames keep `ANY`), so a cat whose only Puddle is chapter 10's gets neither.
No live save holds `ch10Puddle` (`tests/story-ch05.test.js`'s truth table).

## Chapter 11 (v0.2)

Chapter 11, *The Warrior Ceremony*, is [`chapters/11-the-warrior-ceremony.md`](chapters/11-the-warrior-ceremony.md) (Draft
v0.4, final), built in `app/story/ch11.js`. **Its spec, [`chapters/11-the-warrior-ceremony.spec.md`](chapters/11-the-warrior-ceremony.spec.md)
(v0.3), is the build's contract**; this section records the names as built. It opens once she has passed her Warrior Counts
(`opensWhen: 'warrior'`), and it ends module 1.

**The warrior name**, the one engine need (the spec's section 6 has it whole). Only the ending is stored: `cat.ending`, optional,
absent until she is named (never in `E.blankCat`; `normCat` keeps its letters, lower case, at most `E.ENDING_MAX`, 12; the save
stays version 2). Her name is `{name}{ending}`: the token `{ending}` is `paw` until she has one, so `{name}{ending}` reads
`{name}paw` for every cat before the Ceremony (the Warrior Counts' three re-sit lines use it). `E.WARRIOR_ENDINGS` (thirty words, a
row for each `ch10Best` and `specialty`, and the moon's) and `E.WARRIOR_GUARD` (whole names on either wiki) are data beside the
engine; `E.warriorOffers(cat)` gives Glintstar's three, each row's first word that is not in her first part already, not
guarded and not three of one letter at the join. `E.cleanEnding(raw, cat)` and `E.checkEnding(raw, cat)` read what she types
(letters only, her first part dropped once from the front, 12 at most; refused for her own name or no letter, star, paw, kit, or a
Clan cat's whole name, in that order; a typed ending is never guarded). `E.warriorName(cat)`; `E.displayName` shows it first, so
the bar, the hub, “Who's playing?”, My nest, her book's signature and the grown-ups corner's heading say it; her book's and her
Case File's titles keep `{name}paw` (their long classes test that name). The story's keys: an option's `ending` (an offered name,
stored as given), an input of kind `'ending'` (the Type screen: `refuse` with `own`, `star`, `paw`, `kit` as `{ who, text }` and
`clan` as `{ text }`, said by the Clan cat whose name it is; `sets`, applied only when an ending is accepted), two computed `when`
keys (`offer`, `nameHas`; `ending` is read as her own field), and a skip's `name` (its counter's name tag). Chapter 1 read again,
renamed: an offered ending she would no longer be offered is taken again from its row; a typed one stays. The flag `ch11Named`
(`offer`, `self`) says how she was named. `E.VERSION` 0.11.0.

**The page**: the Type screen (`renderEnding`: her first part, then the field, one row, the field wrapping under her first part
where the row does not fit, CSS `.ending-row` in a block of its own; the live preview; “That’s my name!” always enabled; a refusal
a balloon by its speaker on the panel, laid out as every balloon, what she typed kept and selected, a second tap within
`UI.keys.GUARD_MS` ignored; `UI.ending` holds its rules for Node). Once she is named: the hub says “Warrior of CrystalClan”, My
nest is “Your nest with the warriors”, and on the Warrior Counts' page her balloons are labelled `{name}{ending}`
(`UI.speakers.warriorStory`); our cat's balloon label elsewhere stays `{name}paw` (chapter 11's balloons after the naming carry
their own `name`). Once the Ceremony is finished, the hub shows the chapters' teasers again (`hideSoon` read from E.progress's
`finished`) and her book no longer swaps the last teaser for “Your ceremony is coming soon.” `tools/shots.mjs`'s test cat takes
`ending`.

**Her name in the lettering** (the review's round): `nameHtml(cat)` letters a warrior name `{name}<wbr>{ending}`
wherever `E.displayName` shows (the bar, the hub's "Keep reading," button, "Who's playing?", her book's heading and
signature, My nest, the grown-ups corner), so a 26-letter name breaks only between its halves. `richN(s)` letters
every caption, endcap, balloon (panel and stacked, the Warrior Counts' too), Tap and skip page caption, choice and
book line: where her first part runs straight on into her ending, one of her three offered words or a shouted word
of two or more capitals ({name}PINECONE), the joined word and its trailing punctuation are one `.wn` box (index.html:
`display: inline-block; max-width: 100%`) with a `<wbr>` at the join, so a name that fits moves to the next line
whole and only a longer one breaks at the join; no `overflow-wrap`. `{name}paw`, a word that only starts with her
name, and a one-letter first part's capitals (`n.length > 1`, the final round: a cat named A boxed A|LIVE!) are
lettered as before; Read to me keeps the plain text. With Aa, an endcap holding a `.wn` (only chapter 11's) is set at
1.9em, not 2em (`html.big .endcap:has(.wn)`), so the first half of a 26-letter name fits a 1024 x 700 column; its lines
break where they did. On the Warrior Counts' page, after the Ceremony, a warrior name over 12 letters labelling her own
balloon is `.who.long` (`display: table`, a line of its own), so a re-sit's “A HUNDRED!” keeps its line.

**Bigger text on a page she taps once** (index.html, Aa only, inside `@media (max-height: 760px), (max-width:
700px)`: a sideways iPad 760px tall or less, and a phone): the Tap page's "Tap to…" line stays beside Back in the
bottom row (`.next-row:has(> .btn.back + .tapline)` does not wrap; the line takes the rest, line-height 1.15), as
the skip-count's does, instead of a row of its own over Back (ch11 f019 and f034 ran Back 6 and 3px under a 1024 x
700 screen). Taller sideways iPads and upright ones are as before (at 1180 x 820 the rule re-laid fourteen live Tap
pages that had room: the final round scoped it); `tests/aa-room.test.js` reads the block with `rulesAt`.

**The art** (the spec's section 4): the camp's `moon` (the camp by moonlight), the den's `nextNest` (the warriors' next nest, its
spot `next-nest`) and the kit's moon past full (ages 15 to 27).
The camp's moon sits at (1100, 345), r 34, on the main composition (the tower at x 1050 drawn with its top at 440
while it shows) and at (1010, 182), r 38, on the fountain composition (`CAMP_MOON`). The den's `moon` list
gains 15. `nextNest` as built (`NEXT_NEST`): the second ring at (850, 899), scale 0.9; `next-nest` `{ x: 880, y:
905, h: 210 }`, facing right; her nest and its `nest` spot 60 to the right (`{ x: 1120, y: 892, h: 250 }`), set as
`S.spots` then `S.anchorMap = anchorsFor(S)`, so her stone, bark, glass and mist stone follow her. **The pile's
moon** (`sets/pile.js` `pileMoon`): its top limit is its own radius plus 12 (was the base radius plus 8), so a moon
of age 12 or more is never cut by the panel's top: chapter 11's f042 and, live, chapter 9's f112 (8 units lower,
named in `tests/golden-ch09.test.js`); ages 11 and under do not move. `tools/storyboard.mjs` adds words for `nextNest` and `next-nest`,
the `{ending}` legend sentence (the Warrior Counts' always, a chapter's where it has the token) and the Type screen's line.

## The take-aways kit

The take-aways kit (decisions 53 to 55) is [`take-aways.md`](take-aways.md) (Design v0.3, with the review's fixes
written in), built in `app/engine.js`, `app/art/cats.js` (one entry in `app/art/scenes.js`), `app/ui.js` and
`index.html` on the `take-aways` branch, reviewed in six lenses (25 findings, all taken) and integrated on 2026-11-07:
`E.VERSION = '0.11.1 (the take-aways kit, 2026-11-07)'`, CACHE v24. **That design is the build's contract** (section 3
the sets and the guards, section 4 the record, section 8 every piece with its guard, section 9 the tests); the calls
are in the README, under decision 46. No chapter 1 to 11 has a take set, so no player reaches any of it until chapter
12: every changed function takes its old path for every live save. This section is what a chapter codes against.
Decision 57's v0.4 (the borrow made as moves she touches and types, in the marks she chooses), built 2026-11-09 to ship
with chapter 13, is its last paragraph: where it and v0.3's text below differ, a state under its gate follows v0.4.

**A take set** sits in a chapter's `counts` beside its Counts sets, on a plain Counts frame (`counts: { set, next }`).
- Set keys: `op: '-'` (required; any other `op` is an error), `teach` (one of `E.TAKE_STEPS`), `picture` (`{ kind:
  'store' }`, the default, or `{ kind: 'marks' }`), `regroup` (the problems' default: `'hers'` unless `'show'` or
  `'tap'`), `warm: true` (a made two-digit spread first, `E.takeWarm`, logged `warm`), `twins: false` (a helped
  problem does not come back), `teacher`, `praise` (blanks allowed between lines), `done` (`''` goes straight on),
  `lines` (any of `E.TAKE_LINES`' keys). Never `table`, `fillFrom`, `fillOrder`, `warmHard`, `light` or `help`.
- A fact: `[a, b]` or `{ a, b, regroup?, prompt?, right?, picture? }`, whole numbers, 10 ≤ a ≤ 999, 1 ≤ b < a, b with
  no more digits than a, the answer at most one digit shorter than the top, no `table`. `prompt` is a line or balloons
  and captions, each balloon at most 12 words (captions apart): the first column's line joins the last balloon when it
  is the teacher's. `right`: balloons in place of praise when every column is right first time (they wait for Next).
- The kinds (`E.TAKE_KINDS`, `E.takeKind(plan)`, by which turns spread): `none`, `ones`, `tens`, `both`, `zero`
  (across one zero), `zeros` (a top of x00). The flags (`E.takeFlags`): `leavesZero`, `toZero`, `idleZero`,
  `noHundreds`, `noLoose`. The steps (`E.TAKE_STEPS`, in the order the chapters teach them): `none`, `ones2`, `ones`,
  `tens`, `both`, `mixed`, `zero`, `zeros`; `E.takeStepOf(plan)` is `ones2` for a two-digit spread, `mixed` only for a
  problem with no hundreds left of kind `none`, `ones`, `tens` or `both`, else its kind.
- What the kit does for every chapter, so none carries an override: a take state knows the steps taught (`taught`: in
  a lesson those of every take set with `teach` in this chapter and the earlier ones, by `number`; in a store round
  those she has learned), and `E.takeSlip` names `extra` only once its spread is taught (the tens from `ones2`, the
  hundreds from `tens`), else `fact`, so no line says "no row went" before chapter 13 or "no square went" before
  chapter 15; and no twin, nor the made warm-up, takes one of the chapter's answers (`avoid`: every take set's in the
  chapter, lessons and stories). The full column line ("Ones first. Five take away nine.") comes on a set's first two
  problems of her own (`'hers'`, not a twin; the made warm-up is one), on every `'show'` and `'tap'` problem, on a
  twin and after a help; otherwise the column's name. The ones-first pointer is on while she has fewer than five
  logged, and always in a `teach: 'none'` set.

**The words** (decision 53: a class word changes in one line). `E.TAKE_WORDS` is a getter, read at call time: each of
`PC.words`' top-level keys `loose`, `row`, `rows`, `Row`, `square`, `squares`, `ones`, `tens`, `hundreds`, `takeAway`,
`TakeAway`, `spread`, `Spread` and `OnesFirst` (a non-empty string) wins over the English, and a lower-case form given
alone brings its capital (`row`, `takeAway`, `spread`); any other key of `PC.words` (the Spanish beside them) is the
chapters' own. `PC.words` does not exist until chapter 12 brings it. The regrouping word is used in its base form
only, before what it acts on or after it, never before a pronoun ("Spread a row: tap it."; "no rows to spread"), so
"trade", "regroup" or "break apart" fits every slot; a chapter line that says it keeps the same rule. `E.TAKE_LINES`,
the heads' and boxes' `aria-label`s, the `'tap'` page's hidden button, the panel's label and the page's `plain()`
(U+2212 read as `takeAway`) all read it.

**`E.TAKE_LINES`**, every line the kit says. A value is a line, a list (taken in turn: `praise`, `again`), or an
object of forms: by the column whose turn it is (`ones`, `tens`, `hundreds`, with `Zero` after it where the top there
is 0), by the step (`rememberedStep`), or `some` and `none` (`takeSweep`). Tokens: the numbers as number words
(`{top}`, `{bottom}`, `{first}`, `{rest}`, `{left}`, `{digit}`, `{A}`, `{B}`; a capital starts a sentence, and a count
before `rows` or `squares` agrees with it), the words as `E.TAKE_WORDS`' keys (`{row}`, `{Spread}`, `{OnesFirst}` …);
the cat's tokens are left for the page. Its keys: `colName`, `colFirst`, `colHers`, `colShown`, `nothingHers`,
`nothingShown`, `ask`, `schoolWords`, `blank`, `onesFirst`, `tap`, `tapSquare`, `tapRow`, `tapHere`, `showOpen`,
`showSpread`, `chainSquare`, `chainRow`, `spread`, the slips' `zero`, `flip`, `nospread`, `kept`, `extra` and `fact`,
`factSpread`, `factChain`, `factZero`, `takeTeen`, `takeFirst`, `takeRest`, `takeSmall`, `takeBack`, `takeSweep`,
`takeNothing`, `digit`, `twinIntro`, `warmIntro`, `again`, `rememberedStep`, `miss`, `missLast`, `praise`. A set's
`lines` replaces a whole key (a form it leaves out falls back to the first form it gives). `schoolWords` ("A row is a
ten. A square is a hundred.") is defined but never said: chapter 12 wires it into `E.takeLine` (its spec's engine
need: a `'show'` problem's tens, in a `teach: 'none'` or `'ones2'` set).

**The frame's take mode.** `E.chapterLesson` sends a set with `op: '-'` to `E.takeLesson(cat, story, setId, now,
stories)` (its warm-up, a fresh take state with `taught` and `avoid`); `startChapterLesson` runs `runTakes` with the
same `intro`, `waitLine` (`wWait`) and `onDone`, and the frame takes `data-mode="take"` (index.html's take block; on a
phone held sideways, `TAKE_PHONE`, `(orientation: landscape) and (max-height: 500px)`, the stack stands over the
panel). The runner is `E.takes` (`T.start`, `T.question`, `T.digit`, `T.tap`, `T.done`, `T.summary`); its state is a
lesson in the slot (`okLesson` checks it), saved after every column; `E.recordLesson` files a chapter's under
`lessons[set]` (`T.summary` has `noHelp` and `finished`, so `when: { lessonClean }` reads a take set). `runTakes`'
`o.echo`, absent (the no-op) until chapter 12, is called with each right column (`{ col, top, written, bottom, digit,
a, b }`) and each problem right in every column (`{ problem: true, a, b, answer }`) and returns a balloon (`{ who,
text, lang?, variant? }`, Chispapaw's by default) or nothing; when it is given, the stack's held height keeps an
echo's room. `startChapterLesson` passes none: chapter 12 wires it.

**The Hollow's shelf and Count the store** (section 5). `E.takeSteps(cat, stories)`: the steps her finished `teach`
sets taught; `E.storeOpen` once there is one (chapter 12's lesson). Then `renderHollow` opens on the shelf,
`E.hollowShelf(cat, stories, opts)` (`{ greet, line, steps, buttons, waiting? }`, null while the store is closed):
`#storeBtn` (Count the store, the quick marks as its icon), `#countsBtn` (One Count at a time: `go('hollow', { counts:
true })`, the Counts page word for word, its ‹ back to the shelf), `#shelfNest`; chapter 14 puts Tricky Counts between
the two big buttons. A round, `E.takeRoundStart(cat, stories, now, opts)`: `E.TAKE_ROUND` (5) twins of
`E.TAKE_TEMPLATES` (an easy `none`, her hardest step, her next hardest or an older step that spreads, the newest, an
older one), all `'hers'`, no flip landing, set `E.takeRoundDef()` (id `store`, `E.STORE_LINES`' `intro` and `done`),
in the slot as a Hollow round is (`{ mode: 'hollow', state }`). `E.recordLesson` sends it to `E.takeRoundFinish`
(once: `takes.rounds`, `takes.cleanRounds`, the next of `E.FROST_TREASURES` into `cat.nest`; module 1's `hollow`
untouched) and returns `{ mode: 'store', summary, hollow: null, store }`; `storeReward` (`data-mode="store-reward"`)
has "Another round" back to the shelf. `opts.stories` stands in for the stories in `E.hollowShelf`, `E.takeRoundStart`
and `renderHollow` (`PC.debug.takes`' stub). Chispapaw's shelf line and echo are chapter 12's.

**The record and the corner** (section 4). `cat.takes: { log, rounds, cleanRounds }`, optional, absent until her first
take-away is logged (not in `E.blankCat`; `normTakes` in `normCat`; the save stays version 2); never `counts`. One
entry a problem, when its last column is in: `{ set, a, b, answer, given, correct, helped, slips, ms, cols, at, kind,
digits, regroup, twin?, warm?, worked?, round? }`; the last `E.TAKE_LOG_CAP` (500) kept. `E.hardTakes(cat)`: the steps
whose latest own first ask (not a twin, not worked, not `'tap'`) was helped. `warriorStale` and `lastAnswerAt` read
the log's `at` beside `counts`. The grown-ups corner, for a cat with `takes` only: `takeCorner(c.takes,
E.takeTable(c), fmtMs)` puts a Take-aways table by kind after the Counts' tables (Problems; Right first time, "N of M"
of her own first asks, "–" with none; Helped; Typical time, the median of her right `'hers'` answers; Commonest slip),
a note on what the columns count, "(her last 500)" in its heading when `E.takeTable`'s `capped`, and a "Teen facts
missed" line under it; the Training Hollow's line reads "One Count at a time N rounds: …; Count the store N (M without help)".

**The Counts warm-up across the tables** (section 4), behind `warmHard.table === 'all'` only: `E.lessonFacts` puts her
hardest facts over the 54 pairs at `at` (a list allowed, `[0, 1]`), each with its anchor Count as `table`, and
`E.questionDef` gives such a question that Count's picture, things and help (`W_ASK_KEYS`), the set's own lines kept.

**Book two** (section 7). A chapter's keys: `module: 2` (absent is 1; `E.moduleOf`), and on a module 2 chapter only
`book.store` (a whole number 0 to 999, drawn under the recap by `PC.art.placeValue`), `book.sleeper: { id, name,
lines, when?, pose? }` (`E.SLEEPERS`, 7, across the chapters), `book.badger: [{ row, say: { text, who } } | { row,
saw: { text } }]` and `book.keepsake: { id, name, lines }`; a volume's title is its first chapter's `book.title`
(chapter 12's "{name}{ending}’s First Frost-Time"). `E.books(cat, stories)`, `E.buildFullBook(cat, stories, vol)` (no
`vol`: module 1's, today's object key for key), `E.sleepers`, `E.badgerPage`. `renderBook` takes `opts.vol` (else her
latest finished chapter's volume), with `.vols` buttons (`data-vol`, 44 px) once there are two; `.storepic`, the
sleepers' pages (the dragonets' classes), `.badger`, and a chapter a printed page. The Hollow's `#countsBtn` and
`onBack` carry `vol`, so Back from the shelf lands on the volume she came from. The guards, in `E.checkStory`:
`module` 1 or 2, module 2's chapters after module 1's; the four `book` keys only on a module 2 chapter, each of its
shape and no other keys; a sleeper's id distinct across the chapters, at most `E.SLEEPERS`; each badger line exactly
one of `say` or `saw`.

**`E.checkTakes(story, stories)`**, added to `E.checkStory`'s errors (none for a chapter with no take set), as section
3 spells out: each fact in range as above, its `regroup` and `picture` valid, no `table`, each prompt balloon at most
12 words; each set without the multiplication keys, `teach` one of `E.TAKE_STEPS`, `twins` and `warm` booleans,
`regroup` and `picture` valid, `lines` only `E.TAKE_LINES`' keys, `facts` not empty, and no Counts set in any chapter
filling from it; a set's step: `teach: 'none'`, every problem of kind `none`; `teach: 'mixed'`, four kinds or more,
one `none`, one `noHundreds`, one `leavesZero`; any other `teach`, exactly three problems of that step, every other
one an earlier step, and from chapter 13 one of kind `none`; no `teach`, every problem's step taught by a take set of
this chapter or an earlier one; the chapter: no answer twice across its take sets, and no `noHundreds` problem before
the chapter that teaches `mixed`.

**Art**: `PC.art.placeValue(o)` (the store picture), `PC.art.sand`'s `kind: 'quick'` (the help's sand),
`PC.art.quickMarks(x, y, scale, o)` and `PC.art.kit.quick`; their option objects are pinned in section 8 and come from
`E.takePicture(def, q, stage)` and `E.takeSandOpts(step)`. The frost treasures are drawn in `treasureSvg`.

**Tools**: `PC.debug.takes(what, opts)` (`first`, `q`, `show`, `tap`, `spread`, `echo`, `sand`, `done`, `shelf`,
`store`, on definitions of its own); `tools/shots.mjs`' `take:*`, `hollow:shelf` and `store:q`; `dev/webkit/run.mjs`'s
`takes` job (in `--pages`' screens group) and `node tools/sweep.mjs --takes` at the page review's four more sizes
(`TAKE_SIZES`), with `col-off` and `keypad-moved`; `tools/storyboard.mjs` writes a take set's lesson in a Counts
frame's place ("**Then the take-aways**").

**Tests**: `tests/takes-engine.test.js`, `takes-art`, `takes-ui`, `takes-tools`, `book2` and `book2-ui`, on the stubs
in `tests/fixtures/takes-stub.js` (never served); `takes-exhaustive.test.js` is in `SLOW`. The chapter-7, -8 and -9
goldens, the fingerprints and the Warrior Counts' three files pass untouched; the version pin is in
`tests/engine.test.js`.

**v0.4: the borrow as a step she does** (decision 57; [`take-aways.md`](take-aways.md) Design v0.4, its section 1a the
moves and the marks, section 8 the names as built; designed and planned in `~/potomac-crossing-work/regroup/`, built on
chapter 13's branch on `e000777` as `5b974cb` plus the review's round, 2026-11-09; it ships with chapter 13 as v26, so
`E.VERSION` moves to 0.13.0 with chapter 13 at the ship and `CACHE` stays v26, already bumped by chapter 13's stub).
Every piece is behind one gate, and a chapter codes nothing for it but a take set's `marks`:
- **The gate.** `E.takeMovesOn(st)`: a take state whose `taught` is a list holding a step from `ones2` on. Chapter 12's
  lesson (`['none']`), a chapter-12-only player's store rounds, `T.start` with no `taught` (`take:first`,
  `PC.debug.spanish`) and every v25 save play v0.3 exactly (`tests/fixtures/takes-v25-entries.json`, v25's entries,
  states and lines for 27 cases, recorded before any change, deep-equal); `T.start` writes the new keys only under it,
  and the page sets `.tmoves` on the frame only under it, so chapter 12's columns, corner and shelf are byte for byte.
  From chapter 13's lesson on (`taught` `['none', 'ones2']`), and in a round once `ones2` is learned, it is on.
- **The moves** (section 1a.1). A column that needs a spread is moves, ones first: tap the lender (it is struck), type
  its new number, type the receiving column's new number in her style, then the answer; across a zero each link the same
  (seven moves at the ones). `E.takeMoves(plan, style)` lists them (`{ move: 'touch' | 'lend' | 'get' | 'answer', col,
  link, value, reads, before, to | from, zero }`); `E.takeTargets(plan, col, moveIdx, taught)` the columns she can tap,
  only at a decide (move 0, or a chain's second touch, 3) and only once a spread out of them is taught (the tens from
  `ones2`, the hundreds from `tens`); `E.takeMoveMarks(plan, style, col, moveIdx)` the marks the column draws (`{ struck,
  front, frontStruck, m1, m2 }`; `E.takeMarks` stays v0.3's). The runner gains `T.touch(st, def, col, now, ms?)` (a tap:
  `{ accepted, box }`, a pointer, a slip with its help, `{ undone }` only for a strike she made herself, or `{ ignored }`)
  and `T.digit` takes a move's number (`'13'` allowed; in `'one'` 1 or the column's new number); `T.tap(st, off, def?,
  now?)` stays, a thin wrapper calling `T.touch` on the glowing column. `T.question` adds `move`, `moves`, `box`,
  `targets`, `style`, `pale` and `glow`. A right answer typed before the moves is `ahead`: kept pale, the lender lit,
  never `correct`, no twin (`E.takeAheadLine(def, q)` gives its line back to a page picking the column up). `'show'` has
  Tallyheart tap and say each number while she types it (`E.takeShow`'s steps carry `ask` and `touch`); `'tap'` prompts
  each move and asks the numbers only of a link of a kind no earlier chapter taught (by the set's `teach`: chapter 13's
  70 − 34 asks, chapter 14's 640 − 218 does not); `'hers'` prompts nothing. The store's picture rests the lent piece
  unopened between a lend and its get (`E.takePicture`'s `half`, drawn by `PC.art.placeValue` as `spread.stage: 'out'`,
  static).
- **The slips and lines** (section 1a.4). `E.TAKE_SLIPS` is `zero`, `flip`, `nospread`, `kept`, `lend`, `get`, `extra`,
  `fact` (`lend` and `get` new: a wrong new number; a keying slip twins only on its second problem in the lesson or
  round). `E.takeMoveSlip(plan, col, moveIdx, given, style, taught, ctx)` judges a move (a slip, or a pointer `ahead`,
  `zeroFirst`, `where`, `gave`, `nine`, `order`); `E.takeMoveHelp(def, plan, col, moveIdx, slip, style, mode)` helps it
  in one move, no sand; the answer keeps v0.3's sand help, her marks kept (`E.takeHelp`'s `opts.style`). `E.TAKE_LINES`
  gains `showLend`, `showGet`, `chainLend`, `chainGet`, `chainLend2`, `chainFirst`, `askLend`, `askGet`, `extraTouch`
  (with `onesFar`, a struck hundreds at a ones turn), `zeroTouch`, `zeroStop`, `zeroLend`, `nine`, `keptMove`, `keptGot`,
  `lendMove`, `getMove`, `ahead`, `where`, `gave`, `order`, `marksAsk`, `marksAfter` and `marksLabel`, tokens as v0.3's
  plus `{old}`, `{left}`, `{new}`; `tap` gains `onesZero` and `tensZero` ("No loose. Spread a row: tap it."), and
  `tapHere` becomes "The rows: the glowing ones." (no live chapter says it); every other v0.3 value is v25's. A set's
  `lines` may replace any of them, as before. Every value is written out in section 8.
- **Her marks: the marks page and My marks** (section 1a.2). `E.TAKE_STYLES` `['above', 'one']`: the new number on top
  of the struck digit (13 over a struck 3, the default and v0.3's look) or a little 1 in front of it (¹3); in `'above'`
  a column marked twice uses a second marks row in the heads row's place. `E.takeStyle(cat)` reads `cat.takes.style`
  (`'above'` while unset), `E.setTakeStyle(cat, style)` writes it, never a flag; `E.takeLesson` and `E.takeRoundStart`
  pass it, and a problem keeps the style of its first move (`moveStyle` on its queue item). The take page opens **the
  marks page** before a problem's prompt when that problem will ask a spread move and she has no style yet (every
  player: chapter 13's worked example, 43 − 16): `E.takeMarksPage(def, cat)` (`{ lines, options, after, current }`, from
  the set's `marks` or the kit's lines), drawn by `marksPage(host, o)`, two done pictures of 43 − 16, one balloon at a
  time, the buttons live only after the last line, a pick saved and switchable through its answer line, which takes the
  question's place; the page waits for a pick and goes on after the answer line or a tap on the stack or the panel.
  **My marks**, on the Hollow's shelf beside My nest once `ones2` is learned or a style is set (`#marksBtn`, its icon her
  receiver's mark), opens the same page with the kit's lines (`go('hollow', { marks: true })`, `renderMarks`); a change
  reaches the next problem. The grown-ups corner names her marks on one line and, once a row has moves, counts "Marks
  right" and "In her head first".
- **A chapter's key: `marks`.** A take set may carry `marks: { lines, one, above }`, each a list of balloons `{ who,
  text }`, 12 words or fewer, no `lang` (`E.checkTakes`): the marks page's lines and its two answer lines. Chapter 13's
  `ch13-take` carries Chispapaw's and Tallyheart's four (its spec, section 2); a set without it gets the kit's
  ("When you spread a row, how do you write it?" / "Both are right. Tap the marks you like." / "Then that’s how we’ll
  write it."). The take page shows the marks page only while she has no style, so after chapter 13 a set's `marks`
  would never be seen: only `ch13-take` carries it.
- **The save and the log** (section 4). Still version 2: one new optional field, `cat.takes.style`, absent until she
  picks (`normTakes` keeps it when it is one of the two). A log entry of a problem with a spread (or a move she made)
  gains `style` and `moves` (`[col, code, given, ms]`: `'t'` a touch, `'u'` a touch undone, `'l'` a lend's number,
  `'g'` a get's), `ahead` and `nudges` when they happened, and each slip its `move`; `correct` is no slip and no counted
  pointer, `helped` a slip; `cols` sums her move and answer times, the figures decision 56's re-measure will read. A take
  state in the slot gains `style`, `move`, `moveMs`, `moveLog`, `ahead`, `nudges`, `seen`, `keyed` (and per column
  `pale`, `lit`, `litTyped`, `touched`, `shut`), each optional; a v25 `'tap'` state with `tapped` k resumes at move 3k.
- **The page** (`app/ui.js`, `index.html`). `runTakes` under the gate (its `…M` functions beside v0.3's), the column's
  small boxes (`.tmini`), the `'one'` front box, the second marks row, the tap targets (`.ttarget`, `role="button"`, at
  least 44 × 44, live only at a decide, Space or Enter taps), the one slot under the prompts (`.tslot`: a move-help or a
  pointer takes the column line's place, and the page's intro and a twin's introduction with it, so the keypad stays
  put at every size), the move-help's dimmed keypad, the 400 ms after a phase change, every move timed from when its box
  opens or its target goes live. The CSS hangs on `.frame[data-mode="take"].tmoves`, `.tpick` and `.tpickicon`.
  Chapter 13's review (2026-11-10) added, all under the gate: on an iPad held sideways, when bringing the keypad in
  would squeeze or hide the stack's first balloon under the bar (its 8px margin counted), `fit()` stands the stack over
  the panel (`.tover`, the marks page's own arrangement there: the column and the keypad alone on the left, the heads
  row and the keys as they were, the stack's held height measured again where it now stands), set as a problem begins
  and kept for the page at that size and Aa; `drawColM` keeps the page's scroll across the column's redraw (WebKit moved
  it 4 to 10px); a column whose flip lands (52 − 27's ones) holds no `flip` line in its reserve (that digit is `ahead`);
  the marks page on a phone held upright brings its pictures in as soon as its panel is shortened, and again once go() has
  scrolled to the top.
- **The tools.** `PC.debug.takes` gains `touch`, `lend`, `get`, `get:one`, `chain`, `help:move`, `ahead`, `marks` and
  `hollow:marks` (and `q`, `show`, `tap`, `spread`, `echo`, `sand`, `done` now show v0.4; `first`, `shelf`, `store` as
  before), so `tools/shots.mjs`' `TAKE_TARGETS` and `dev/webkit/run.mjs`' `TAKE_SCREENS` gain the same `take:` and
  `hollow:marks` screens, with `@next` on `take:lend` and `take:get` (`TAKE_NEXT`, a map: the keypad must not move
  from one move to the next). `dev/webkit/measure.js` records the small boxes (`tmini`), the targets' hit boxes
  (`ttgt`), the slot (`tslot`), the marks page (`tpick`, its little 1 `tone`) and the markup's hash (`hx`); `node
  tools/sweep.mjs --takes` widens `col-off` (a small box out of the column, meeting the stack, or nearer the neighbour's
  mark than its own digit) and adds `hit-small` (a live target under 44 × 44) and `marks-small` (the marks page's little 1
  under 16 px); `--takes --compare` checks `TAKE_COMPARED` (`take:first`, `hollow:shelf`, `store:q` and chapter 12's
  eight Spanish screens) byte for byte against the live tree, and `prune(...keep)` keeps the tree it compares from.
  `tools/storyboard.mjs` prints a set's marks page as "**Then the marks page**" before its first spread. Since chapter
  13's review the sweep's `lessons` job, on a Counts frame that opens on the marks page (its cat has no marks), measures
  it (`@lesson`), then gives the cat `'above'` and measures the take page as it then opens (`@lesson:column`), each after
  the page's own zero-delay call (its pictures or keypad brought into view once go() has scrolled to the top; every other
  row's left to run later, so chapters 1 to 12's rows are as they were); the marks stay on the cat for the chapter's later
  take frames (the pile is measured on its column, as she meets it) and come off when the chapter changes and at the end.
- **Tests.** `takes-engine` (v0.3's tests 4, 6, 7, 9 and 12 run both paths; the proofs E1 to E11 and E9b, L2 to L4),
  `takes-exhaustive` (the moves of all 498,465 problems, both styles), `takes-art` (the resting stage, every other
  picture pinned), `takes-ui` (U1 to U5, L5), `takes-tools` and `render-tools`, on `tests/fixtures/takes-stub.js`
  (chapter 13's lesson set with `MARKS13`; `stub.sets()`: `ch13`, `ch14`, `zero`, `both` with their `taught`).
  `tests/fixtures/v1.js`'s take branch plays the moves when `T.question(st).moves` is present.

## Chapter 12 (v0.3)

Chapter 12, "A Spark at the Hedge", is told with the engine as it is, plus **one engine feature, Spanish**
([its spec](chapters/12-a-spark-at-the-hedge.spec.md), section 6; decisions 53, 54 and 55; Claude's calls under
decision 46). No new interaction, no new flag, and the save is untouched (version 2). Every piece is reached only by a
`lang`, a `{es:…}` token, a set's `echo`, a skip's `lang`, the engine's own « » marks or the new cast id: no line of
chapters 1 to 11, `PC.warrior`, `E.TAKE_LINES` or `E.STORE_LINES` has one, and the tests hold every old line's fill,
lettering, speech and check to what it was.

**The words** (`app/story/words.js`, after `ch11.js` and before `ch12.js`; never taken for a chapter: every tool that
globs `app/story/` filters on `ch\d+\.js`). `PC.words`: the kit's fourteen English words (`E.TAKE_WORDS`, unchanged), `es`
(each word `{ es, en, say? }`: `gatos`, `por`, `aContar` "¡A contar!", `galleta` with `say: 'gah-YEH-tah'`) and `sayAs`
(English speech only: `[['Chispapaw', 'Cheespa-paw'], ['Chispa', 'Cheespa']]`). A new Spanish word is one line in `es`.

**Writing Spanish in a story.** A Spanish word inside an English line or caption is a token: `{es:key}` (a whole number 0
to 1,000, or a key of `PC.words.es`), `{Es:key}` with its first letter capitalised. A whole Spanish line is a balloon with
`lang: 'es'` whose text is tokens and punctuation only ("¡{Es:133}!", '…⁠{es:11}, {es:12}. {Es:12} {es:gatos}.'); its
English is made by the engine and lettered under it. Never « or » in a story file (the engine's marks). A set's echo
lines may also name the answer's numbers: `{es:fact}` (a Counts set: "siete por ocho, cincuenta y seis"), `{es:a}`,
`{es:b}`, `{es:answer}`.

**The engine** (`app/engine.js`, its section "chapter 12: Spanish", after the kit's):
- `E.esNumber(n)` (0 to 1,000, Latin American: "cien", "ciento uno", never "ciento y"; the digits outside), `E.esFact(a,
  b)`, `E.esWords()` (`PC.words.es`, read at call time).
- `E.fill` fills both kinds of token in **one pass** (`/\{(?:([A-Za-z]+)|([Ee]s):([^}]+))\}/g`, the first group exactly
  the old token, filled as before), so a value it inserts (a typed dream, a name) is never scanned again. A Spanish
  token is lettered between the marks, «…»; a ¡ or ¿ just before it with its ! or ? just after go inside with it. An
  unknown key stays as written. `E.esMarks(text, extra)` fills the Spanish tokens alone (the cat's left for the page).
- `E.esGloss(text, cat, extra)` (each token's English; `{Es:}` capitalised; ¡ ¿ dropped), `E.esLine(text, cat, extra)`
  ("«…once, doce. Doce gatos.»\n(…eleven, twelve. Twelve cats.)": every whole Spanish line on a balloon, an echo, a prompt
  and the shelf is made by it; the Spanish count's counter by `E.skipView`, below),
  `E.esEnglish(s)` (a word's `say`, else its `en`; a number's words; else ''), `E.sayAs(text, cat)` (whole words, in
  order; never the cat's own name, Clan name, warrior name or pet name, so a cat named Chispa sounds as she always did),
  `E.speechParts(text, lang, cat)` (`[{ text, lang, en?, line?, gloss? }]`: a Spanish part is a `line` only when a new
  line and its gloss in parentheses close the text).
- **The echoes**, a set's `echo: { on: 'first' | [[a, b], …], lines: [{ who, text, lang?, kind? }] }`: `E.countsEcho(def,
  st, res, teacher)` (a Counts set: its first right answer, a retry or a filler counting, or a listed pair either way; the
  line the answer earned first, then each echo line; waits for Next) and `E.takeEcho(def, info, st)` (a take set: a listed
  problem right or helped, a twin never, a column never; `'first'`: the first problem right in every column; one balloon).
- **The Spanish count**, a skip with `lang: 'es'`: `E.skipView` gives `count` in Spanish words between the marks ("«Diez,
  veinte…»", done "«Diez, …, ¡cincuenta!»\n(Ten, …, fifty!)"), `say` ("«veinte»"), `gloss` when done and `wait: true` (the
  page waits for Next); `E.skipWords` gives it `whisper: false` and `words: true` (Comic Neue: Spanish is never in Andika).
- **Count the store's friend**: `E.hollowShelf` gains `friend: { who: 'chispapaw', text: E.esLine('{es:aContar}') }`
  (absent while a Warrior Counts sitting waits); `E.takeRoundDef()` gains `echo: { on: 'first', lines: [{ who:
  'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] }` (one echo a round).
- **The kit's school words**: `E.takeLine` says `E.TAKE_LINES.schoolWords` ("A row is a ten. A square is a hundred.")
  before the tens line of a `'show'` problem in a set with `teach: 'none'` or `'ones2'` (chapters 12 and 13's worked
  examples); never on the first column, never on its `'tap'` twin.
- **The typed dream**: `E.dreamOf` and `E.tidyDream` read a typed « as “ and » as ” (on read; nothing stored changes).
- **A Counts prompt asked in Spanish** (designed here for chapter 21's ferry, the Spanish-asked warm-up picks and the
  Hollow's Tricky Counts once Chispapaw asks them; chapter 12 does not use it): a fact's `prompt` or `retryPrompt`
  balloon, or a set's `prompt` given as balloons, with `lang: 'es'`, is lettered by `E.promptLines` through `E.esLine`
  with the question's own `{ a, b }` (so '¿{Es:a} {es:por} {es:b}?' asks any pair) and keeps its `lang`; the page's
  `promptLines` keeps it too. No answer in it.
- **The guards**, `E.checkSpanish(story)`, added to `E.checkStory`'s errors (chapters 1 to 11 and `PC.warrior` raise
  none): `lang` is `'es'`, only on a frame's `say` balloon, a set's `echo.lines` or a Counts set's prompt balloon (never a
  caption, an option, a take set's prompt or a `right` line); a Spanish line has a token, no letter outside its tokens,
  no cat token, and at most `E.ES_MAX_WORDS` (8) words with its largest numbers; every `{es:key}` resolves where it stands
  (`fact`, `a`, `b`, `answer` only in an echo line, `fact` only on a Counts set, `a` and `b` in a Counts prompt's Spanish
  line); no words-table key is a number or one of those four, and each is `{ es, en }`; no « or » in a story; a skip's
  `lang` is `'es'` with groups × table at most 1,000; a set's `echo` is `{ on, lines }`, `on` `'first'` or the set's own
  facts, one to three lines on a Counts set and exactly one on a take set. For the chapters after this one: a lowercase
  `{es:…}` lettered in lower case that opens a line or follows . ! ? (after any ¡ ¿, never after "…"), and a number ending
  in "uno" straight before a word token ("veintiuno gatos": write it otherwise).
- `E.VERSION = '0.12.0 (chapter 12, 2026-11-08)'`, CACHE v25; the save stays version 2 and nothing new is stored.
- **A store round's twins** (the review's round): `E.takeRoundStart` gives the round's state an `avoid`, the answers of
  every chapter with a take set that the cat has begun and not finished, so a round played between chapter 12's lesson
  and its store never queues a twin on 133; with no such chapter there is no `avoid` and the state is as before.

**The page** (`app/ui.js`, `index.html`):
- `rich()` letters «…» as `<i class="es" lang="es">…</i>` and a parenthesised line straight after it as `<br><span
  class="gloss">(…)</span>`, a word joiner after a hyphen between letters inside it, so "(One hundred thirty-three!)"
  never breaks at its hyphen (the review's round); `plain()` drops « and ». `balloonsOf` letters a `lang: 'es'` balloon through `E.esLine`.
  Every other path passes text and the marks travel in it (the Counts page's balloons, the take page's echo, the skip's
  counter, the shelf, `currentSpeech`). `UI.letter` is `{ rich, plain }`, for the tests.
- **index.html**, the block "chapter 12: Spanish" before the take-aways block: `.es{font-style:italic}`,
  `.gloss{font-style:normal}`, `.sb.whisper:has(.es),.ov .btext.whisper:has(.es){font-style:normal}` (a whispered balloon
  with Spanish keeps its English upright; the dashed border still says it is whispered). No Aa rule.
- **The voice**: `UI.voices.pick(list, lang)` (Spanish by locale, es-US, es-MX, other Latin American, plain es, es-ES last,
  in each a she-voice by NFC name first; never a novelty voice, Eddy … Shelley by exact first word; null with none;
  English exactly as `pickVoice()` always picked), `pickVoice('es')` (kept once found; `onvoiceschanged` clears both), and
  `UI.voices.plan(items, voices, { cat })`, what Read to me says row by row (`[{ text, lang, voice, rate, pitch }]`): an
  item with Spanish in it is said in parts, a Spanish part in the Spanish voice (the speaker's pitch, 0.9 of the speaker's
  rate), with none a whole line not said (its gloss follows) and a word said as its English, an item's English parts in a
  row joined into one row, its punctuation closed up (the review's round: three utterances in one voice paused between
  them, the third starting at a full stop); no row of punctuation alone;
  never Spanish in an English voice; every other item exactly as before, respelled by `E.sayAs`. `speakItems` keeps its
  line word for word and turns the plan's rows into utterances; `PC.debug.speech` keeps its shape and prints a Spanish
  item's rows with "[es] " before what the Spanish voice says; `PC.debug.plan(list)` gives this screen's rows with a
  made-up voice list (`DRY=1` with `VOICES=es` and `VOICES=none`). `UI.voices` also exports `saysSpanish(item)` and the
  lists `NOVELTY` and `SHE`.
- **The echoes on the page**: `runLesson`'s one guarded statement after `E.counts.answer` (`res.balloons` becomes the
  echo's balloons, waiting for Next; on that page Next sits at the top of the keypad's place, `#lessonNext`'s
  `align-items: flex-start` set while the echo shows and cleared by the next `ask()`, as the Warrior Counts' help and the
  take page do, so the three balloons stay on the screen, and a scroll brings Next in only if it is still under the
  screen: the review's round, where it ran 29px under 1080 × 720 with Aa off and wholly under with Aa on); `runTakes`'
  problem end reads the set's `echo` through `setEcho` for every finished
  problem, right or helped. **This supersedes the kit's design row for `o.echo`** ("each right problem"): a set's `echo`
  is read at the problem's end and never made into the `o.echo` hook, so `reserve()` holds no echo room above any column
  (a hook would hold Chispapaw's two lines empty above every later column of the lesson and of every Count the store
  round); `o.echo` stays the column hook, for a later chapter that echoes columns (it would bring the echo room with it).
- **The Spanish count** (`renderSkip`, four guarded branches): the counter lettered by `rich()` in `counter words`; at the
  end Next shown, brought into view if it is under the screen (a phone held sideways: the review's round) and focused
  (the page never turns itself); Read to me says each number (its English with no Spanish
  voice) and at the end its gloss after it, or the gloss alone; Enter, Space and → turn the page at the end.
- **The shelf**: with `SH.friend`, Chispapaw sits at `sand-right` facing left (measured: x 861–1019 against our cat's
  540–716 on `wide`) and her balloon follows Tallyheart's (`.concat`). **The speaker**: `NAMES.chispapaw`,
  `PITCH.chispapaw` 1.42, `RATE.chispapaw` 1.02. **The grown-ups corner**: once a cat has chapter 12 open, one line names
  the Spanish voice or says how to add one, built by concatenation, the voices read afresh when the corner opens.
- `PC.debug.spanish(what)` (`echo`, `take`, `skip`, `worked`, `worked:tens`, `try`, `try:pointer`, `store`), beside
  `PC.debug.takes`: the screens on the cat on screen from inline copies of the spec's section 2 sets (or `PC.story.ch12`'s
  own), nothing saved.
- **A take page while a re-sit waits** (the review's round): `runTakes`, whenever its intro holds the Warrior Counts'
  waiting line (a chapter's lesson, a store round picked up), says that line on a page of its own, with Next, the store
  drawn as the first column will show it and no answer taken, then asks the first problem (over the column, with the
  keypad brought in, it lay under the bar at 1080 × 720). `PC.debug.takes('first')` presses that Next, so `take:first` is
  the worked example's first column with its prompt joined, the worst case a lesson shows. `PC.debug.spanish('echo')` and
  `('skip')` keep the scroll the page made after the answer or the last tap, from a question page at the top.

**The tools**: `tools/storyboard.mjs` requires `app/story/words.js`; it prints a `lang: 'es'` balloon "*[es]*" with its
Spanish and its English, a `{es:key}` as «its Spanish», the paw thing "in Chispapaw's Spanish", a set's echo under its
set, and words for every new art name (chapters 1 to 11 and `warrior.md` byte for byte). `tools/shots.mjs`: `es:echo`,
`es:take`, `es:skip`, `es:worked`, `es:worked:tens`, `es:try`, `es:try:pointer`, `es:store` in `ES_TARGETS` (TAKE_TARGETS
untouched), in single shots and sheets; the silent stand-in notes each utterance's text, lang and voice
(`window.__shotsHeard`) and takes a made-up list with `VOICES=es` (Paulina, Samantha and the eight novelty voices;
`VOICES=none` the default); `DRY=1` prints `UI.voices.plan`'s rows for both lists wherever a screen has Spanish.
`dev/webkit/run.mjs`: a `spanish` job (`ES_SCREENS`: the eight and `hollow:shelf`). **The shared sweep runs it** (the
review's round: the warm-up's echo page had Next under the screen at 1080 × 720 and `pages/summary.md` did not see it, its
f042 row being the keypad before any answer): `node tools/sweep.mjs --pages` in its `screens` group at the four sizes,
`--takes` at the review's four more, Aa off and on. The take pages' `col-off` checks the stack's first balloon as well as
its last (`tsf`, measure.js; 58 − 23 opened with its first under the bar, its last on the screen). The `screens` job
focuses the leaf before its Enter, so `screen:corner` measures the grown-ups corner (with the body focused, the hub's own
handler took the Enter and pressed the big button). A `SHEET=1` pane of `book#ch12` opens the book at that page.

**The art, a line each** (the cats and sets owners'; their tests): Chispapaw (`chispapaw`, a pointed cream coat, dark brown
points, big ears, blue eyes, a red collar with a gold bell; `collar: false` for chapter 13; cats may carry a mouse,
`holds: 'mouse'`); the bridge's `store` camera (the dry den's floor, `store: n` the kit's picture `small` at one fixed
scale and top, `tap: 'store'`, spots `store-left`, `store-right`, `store-back-1` to `-3`, `way-in`); the hollow's options on `lesson`
and `sand` only (never both on one frame: `store` wins): `store` (a number, the store's
plan, every piece an empty pressed place; at a whole number of hundreds, 500, its squares alone, clipped to them, in a
taller box of its own, `HOLLOW_PLAN`, x 800 to 955, y 790 to 905, a glowing square keeping its dark pressed edge: the
review's round, where the whole picture in the 196 × 56 box made a square 6 CSS px on a phone), `storeGlow` (`'hundreds'`
or `'tens'`), `tap: 'squares'` (the whole plan, and at least `HOLLOW_STORE`'s width round it) and `quick` (1 to 3 sets of
the quick marks in `HOLLOW_STORE`, x 770, y 820, 196 × 56, in keep, right to left, her square `round`: `PC.art.quickMarks`'
`round: true`, a wobbly ring, passed through `PC.art.kit.quick`); the den's `moon: 16`; the garden's spot `hedge-right`.
The store camera is lit `day`, `sunset` or `dusk` (night is chapter 14's: `storeLight` has no night look), and at its scale,
0.54, every store of module 2's story fits the panel (500's foot at y 897; 999 would be cropped). A marked purrer's 'purrr'
beside her back is left out where it would cover another cast member's head (the whole-camp purr's test), and the word
over her head leans the other way where leaning back would (the review's round: f037a, f031; no frame of chapters 1 to 11
moved; two of the scenes test's synthetic fingerprints did).

**Tests**: `tests/spanish.test.js` (the engine, the guards and the page in Node, inline fixtures), the kit's pins moved as
the spec names them (`tests/takes-ui.test.js`: runLesson's hash, `plain()`'s line, the Spanish block cut beside the take
block and its selectors listed, the reserve with and without a set's echo; `tests/takes-engine.test.js`: the shelf's and
a round def's deep-equals, and the school words' case), `tests/storyboard.test.js` (a fixture chapter's Spanish and art
words), `tests/tools.test.js` (chapter 12's `--check-words` list; shots' and the WebKit tool's Spanish), and the chapter's
own: `tests/story-ch12.test.js` (the graph, 540 readings, the Spanish, the echoes, the take lesson, the book, the teaser,
staging, the purr words), `tests/cats.test.js` (Chispapaw, `holds: 'mouse'`, `round`), `tests/scenes.test.js` (the
`<ch12-fingerprint>`, the hollow's plan and marks, den and garden) and `tests/set-bridge.test.js` (the store camera).

## Chapter 13 (v0.1)

Chapter 13, "The Hunter's Crouch", needs **one engine piece, the take-aways kit v0.4** (decision 57: the borrow as
moves she touches and types, her marks chosen on the kit's marks page; "The take-aways kit", its v0.4 paragraph above),
built on chapter 13's branch before its frames and shipped with it as v26 ([its spec](chapters/13-the-hunters-crouch.spec.md)
v0.3, section 6; decisions 53 to 55 and 57; Claude's calls under decision 46). Beyond the kit the chapter is **data and
art only**: no interaction of its own, no new engine key, no save change (version 2; the kit's `cat.takes.style` is
optional). Its one new set key is the kit's: `ch13-take` carries `marks` (Chispapaw's and Tallyheart's four lines and
the two answer lines), and its first problem, 43 − 16, is where every player meets the marks page. Two flags (`teach`,
replaced; `foundGroundhog`, sticky), six Counts sets, three words-table lines, the groundhog, and the places' new
options; every new option off by default and every new camera, composition and spot additional, so chapters 1 to 12, the
Warrior Counts and the kit's pages draw byte for byte.

**The kit v0.4, the spec's fourth check** (decision 57; `~/potomac-crossing-work/regroup/plan.md`): `E.takeMoves`,
`T.touch` and `E.takeMarksPage` exist; on the stub chapter 13 of `tests/fixtures/takes-stub.js` (its lesson set with
`MARKS13`, chapter 13's lines exactly), `E.takeLesson` gives `taught` `['none', 'ones2']` and the moves, `'show'` 43 − 16
asks 3 and then 13, the marks page has the four lines and the two answer lines with no style chosen, and `E.checkTakes`
is clean (2026-11-09). Chapter 13's frames builder runs it again on `ch13-take` as coded in `app/story/ch13.js`.

**The engine's three checks** (the spec's section 6), run on main after chapter 12 (v25, `E.VERSION` 0.12.0) with the
spec's `ch13-take` in memory, all passed, so beyond the kit `app/engine.js` is unchanged and `ch13-take` carries no `lines`:
1. Rule (a) is in: typing 1 at 486 − 253's hundreds in `E.takeLesson` is the slip `'fact'` and the help opens "Let’s
   scratch it out."; `E.takeSlip(E.takePlan(486, 253), 2, 1, false, ['none', 'ones2']) === 'fact'`; a cat that has finished
   chapter 13 gets `E.takeRoundStart(cat).state.taught` equal to `E.takeSteps(cat)`, `['none', 'ones2']`. Rule (b) is in:
   85 − 39 hears "Ones first. Five take away nine." and "Now the tens. Take away three.". The lesson's `state.avoid` is the
   chapter's take answers (27, 36, 46, 45, 233, 25).
2. Chapter 12's Spanish on the three new words: `E.fill('{Es:resta} THAT’S …')` letters "«¡La resta!» THAT’S …";
   `E.esEnglish` gives "Take-aways!", "Not enough!" and "Breaking it into groups!"; `E.esLine('{Es:desagrupo}')` is
   "«¡Desagrupo!»\n(Breaking it into groups!)". With no Spanish voice f030 is said "Take-aways! THAT’S …".
3. The school words: `E.takeLine` for 43 − 16's tens in `'show'` on a `teach: 'ones2'` set begins "A row is a ten. A
   square is a hundred.".

**The words** (`app/story/words.js`, `PC.words.es`), each stored as lettered (chapter 12's `E.esEnglish` matches an entry's
`es` with case kept; `{Es:…}` on a value that opens "¡L", "¡N" or "¡D" changes nothing): `resta` ('¡La resta!',
'Take-aways!'), `noAlcanza` ('¡No alcanza!', 'Not enough!'), `desagrupo` ('¡Desagrupo!', 'Breaking it into groups!':
decision 55, Lissa's word for a spread). A later chapter that letters «la resta» mid-sentence adds its own entry.

**The page** (`app/ui.js`): `NAMES.groundhog` 'The groundhog' (appended last; its balloons on f060 to f062 carry `name:
'The round brown thing'`), `PITCH.groundhog` 0.66 and `RATE.groundhog` 0.78 (low, grumpy and slow: lower and slower than the GroveClan elder, who speaks in the same woods), and the grown-ups
corner's `FLAG_WORDS.teach` (`show`, `try`, `words`: "… (chapter 21 remembers)") and `FLAG_WORDS.foundGroundhog`
(`'true'`: "found the groundhog asleep beside the big dig in GroveClan’s woods (later chapters remember)").

**The art, the cats owner's** (`app/art/cats.js`; `tests/cats.test.js`; `dev/gallery-cats.html`, its `groundhog` section):
- **The groundhog** (`groundhog`, in `CAST_IDS` after `chispapaw` and in `PC.art.vocab.otherPoses`; not a cat, and not
  scenes.js's `CAT_IDS`): round and brown, a grizzled warm brown coat (darker on the back, a paler gingery belly, a paler
  muzzle), a short furry tail, small round ears, a blunt dark nose with whiskers, small dark eyes under heavy lids, little
  dark paws; never a tooth (a yawn or a shout is a dark round mouth with a tongue), never a claw, no stripe and no
  black-and-white face. Its box is 240 × 200 in the cats' units, its lowest point at y 197, the middle of its body on the
  box's centre line. Poses: `doze` (in a doorway seen from behind: its round back and bottom, the tail and the soles of its
  hind feet at the bottom, only the back of its head and its ears over its shoulder; no face, so every mood dozes alike),
  `wake` (the same body, its head up and turned to us, both eyes open), `sit` (on its haunches, forepaws folded on its
  belly), `yawn` (eyes squeezed shut, a big round O), `sleep` (curled round side on, eyes shut, a little smile: what an
  unknown pose draws, and the book's sleeper page). Every mood its own face (`neutral` heavy-lidded and a little grumpy,
  `stern` brows down hard and a frown, `shout` a round open mouth, `sniff` its nose up and twitching, `happy` a squint and a
  smile; the rest as everyone's); `asleep: true` and `'half'` as for every creature. Its parts carry classes for the tests
  and the tools: `pc-groundhog` (with `data-pose`), `pc-gh-body`, `pc-gh-head`, `pc-gh-tail`, `pc-eye` (with `data-eye`),
  `pc-mouth` (with `data-mouth`), `pc-sniff`, `pc-yawn`.
- **Its size**: sitting, the top of its head box to the bottom of its box is 1.068 times our cat's sitting (scenes.js's
  `SIZE_BAND.groundhog = { ref: 'player', pose: 'sit', by: 'tall', min: 1.0, max: 1.15 }`, so the scenes leave it as
  drawn); its body (no tail) 124 wide, about twice our cat's sitting body; curled (`sleep`, `doze`) about as long as our cat
  lying. Its shadow is scenes.js's (`OWN_SHADOW.groundhog`, none in `doze`, `wake` or `sleep`: `NO_SHADOW` is read by
  pose).
- **The quick marks' `crossed` and `fresh`** (`PC.art.quickMarks(x, y, k, o)`, the help's sand's meaning): `crossed: {
  lines }` draws `tens` + `lines` lines, the last `lines` struck through and dim (`<g class="pc-quick-crossed">`, a slash
  from lower left to upper right, never a level line); `fresh: { dots }` (at most ten, at most `ones`) puts that many of
  the `ones` in a scratched frame under the old dots, five and five (`<rect class="pc-quick-frame">`, the ground's groove
  colour, a rounded rectangle always the ten places; each fresh dot in `<g class="pc-quick-fresh">`), the old dots above it
  in its columns. `PC.art.quickMarks.size(o)` counts the struck lines and the frame (the spread forty-three, `{ tens: 3,
  ones: 13, crossed: { lines: 1 }, fresh: { dots: 10 } }`, is 264.3 × 115.4 at scale 1). Absent, naught or not an object,
  every mark, group and size exactly as before (a sweep pinned against the tree before). `PC.art.kit.quick` passes `o`
  whole, unchanged.
- **`tailUp: true` with `curl`** for cats (`TAIL_UP.curl`): the tail rising straight up out of the curl from behind the
  haunch, its tip soft (a gentle lean, never curled over); placed as with the tail down, so her head and body never move;
  `tap: 'tail'` marks its tip. Off unless asked. No frame of chapters 1 to 12 gives `curl` a `tailUp`, so every frame's
  fingerprint stands; four of `tests/cats.test.js`' synthetic sweeps (chapters 8's, 9's and 12's two) drew `curl` with
  `tailUp: true`, which drew nothing before, and were retaken (48, 4, 32 and 6 records changed, every one a cat in `curl`
  with `tailUp: true`; with `tailUp` taken out of those calls each gives its old hash, a test).

**The art, the sets owner's** (`app/art/scenes.js`, `app/art/sets/grove.js`; the spec's section 4 and the sets owner's
notes for the final spots and boxes): the camp's `frost` (`true`, `'prints'`: the dawn patrol's three trails) and the
spots `ferns-1`, `ferns-2`; the hollow's `spreadMarks` (`'standing'`, `'spread'`, `'two'`, drawn by `kit.quick` with the
two keys above, in a keep box of its own); the den's `collar`; the grove's `dig` on `oak` (and `oak-near` only if needed),
the `dig` composition with cameras `dig` and `marks`, its spots (`door-1`, `door-2`, `doorway`, `dig-front`, `marks-1`,
`marks-2`, `dig-elder`, `dig-fern`), covers keyed `doorway` (`cover-leaves`) and `dig-fern` (`cover-fern`), options `marks`
(`'leaves'`, `'bare'`: one long line and eight little pokes, the kit's quick picture on earth) and `tap` (`'leaves'`,
`'marks'`); `PC.art.groveInfo()`'s dig, doorway and marks boxes; the groundhog's `SIZE_BAND`, `OWN_SHADOW` and `NO_SHADOW`.

**The book**: `sleeperArt` (`app/ui.js`, book two) draws an id in `PC.art.vocab.cast` with `PC.art.character`, so the
groundhog's found page (`book.sleeper` id `groundhog`, its default pose `sleep`) draws the groundhog asleep from chapter 13
on; a silhouette is always called with `null` and stays the plain curled shape, so none gives away who is still to find.

**The tools**: `tools/storyboard.mjs` has words for every new name (section 8, "Drawn now"): the groundhog (its look, its
five poses, its speaker), the camp's `frost` and its trails, `ferns-1` and `ferns-2`, the hollow's `spreadMarks` (never
"rows" of five: "ten new dots in a scratched frame, five and five"), the den's `collar`, the grove's `dig`, `oak-near`, the
`dig` and `marks` cameras and their spots, `marks` and `tap`, and a curled cat's tail straight up. The grove's `dig`,
`marks` and `tap` are worded before everything else in `optWords` (which keys on the option's name: the grove's `marks:
'leaves'` would otherwise print the Hollow's claw marks on the trunk), and the marks are always "one long line and eight
little pokes", never a dot, a count, a number or a claw mark. Chapters 1 to 12 and `warrior.md` regenerate byte for byte.

**Tests**: `tests/cats.test.js` (the groundhog's poses, moods, look, size and box; the quick marks' new keys, their counts,
frame and size, and every existing call against the tree before; `curl` with `tailUp`; the four retaken sweeps with their
old hashes; chapter 13's own fingerprint; the gallery's section), `tests/spanish.test.js` (the three words: `E.esLine`,
`E.fill`, `E.esEnglish`, the voices with and without Spanish), `tests/storyboard.test.js` (a fixture chapter's new words;
the grove's marks never a claw mark or a number; chapter 13's `--check-words` list), `tests/book2-ui.test.js` (the found
page draws the groundhog, asleep; the silhouettes stay plain), `tests/engine.test.js` (the NAMES pin: `groundhog` last).

**As built, after the review** (2026-11-10; the README's "Chapter 13 as built"): the grove's `dig-elder` is on the dig's far
side between its heaps, facing right (950, 650); on `marks: 'bare'` the two brushed-aside drifts are drawn before the
marks and lie wholly beyond their box (`bareDrifts`), so the long line and all eight pokes read; the groundhog's voice is
`PITCH` 0.66 and `RATE` 0.78; the kit's page fixes are in "The take-aways kit", its v0.4 paragraph. Chapters 1 to 12 draw
and play as they did: no live frame changed.
