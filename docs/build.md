# Build: how chapter 1 is made

*v0.2 · 2026-10-04 · Aron said "do your thing": build, storyboard and deploy chapter 1. v0.2: the review fixes.*

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
app/art/scenes.js        PC.art.render (sets, cameras, cast placement, effects) + vocab
app/story/ch01.js        chapter 1: frames, Counts set, book recap
sw.js, manifest.webmanifest, icons/icon-{180,192,512}.png, .nojekyll
tests/*.test.js          node --test (engine logic; story ↔ art vocabulary; graph checks)
tools/storyboard.mjs     writes docs/storyboard/ch01.md from app/story/ch01.js
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

Load order: `art/cats.js`, `art/scenes.js`, `story/ch01.js`, `engine.js`, `ui.js`. Modern Safari
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
| `garden`: the lawn between the patio and the hedge, dusk; fence with sparrows, lamp post, hedge with a gap, patio step | `wide`, `paws` (extreme close-up of paws on grass), `step` (the patio step, open door, the Tall One's legs), `fence` (the row of sparrows, a cat below), `lamp` (top of the lamp post), `meet` (two cats, medium), `hedge` (the gap in the hedge) | `step`, `lawn`, `fence-foot`, `lamp-top`, `hedge-gap`, `doorway` | `sparrows: 12` (on the fence; the 13th sits on the lamp when `lampSparrow: true`), `dish: true`, `moth: true` |
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
| `helpIntro` | Tallyheart's first line after a miss when the answer was within 1 of right ("Close. Let's scratch it out together…"). |
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
- **Back** rereads earlier frames; the game saves on every frame and resumes where she left off.
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
sans-serif`. Both are self-hosted in `fonts/` (SIL Open Font License, texts alongside) and
precached, so the game makes no third-party requests and the lettering works offline.
