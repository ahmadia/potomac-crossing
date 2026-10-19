# Production: how a chapter gets made, what it cost, and how to make the next five cheaper

*v0.2 · 2026-10-18 · written at the wrap of the session that built chapters 2 to 5 (v0.1,
2026-10-12); v0.2 adds decision 47's budget and `dev/workflows/chapter.js`. For whoever builds
chapter 6: read this before starting a workflow.*

## What the first five chapters cost

| | Ch 2 | Ch 3 | Ch 4 | Ch 5 |
|---|---|---|---|---|
| Built | Oct 4, one day | Oct 6, one day | Oct 10–11 | Oct 10–12 |
| Frames | 130 | 128 | 132 | 186 |
| Reading, plain path | ~1,900 words | ~1,900 | ~1,900 | ~2,000 (2,600 with every optional scene) |
| Chapter text file | 1,074 lines (386 of notes) | 1,600 (829) | 2,420 (1,516) | 3,510 (2,160) |
| Text workflow | 5.8M tokens, 32 agents | 5.5M, 22 | 8.8M, 22 | 10.3M, 33 |
| Build workflows | 13.4M, 44 agents | about 9M | 17.3M | about 16M |
| **Total** | **19M** | **about 14M** | **26M** | **about 26M** |
| Findings confirmed in review | 71 | 44 | 36 | 18–31 |
| Tests after | 321 | 428 | 643 | 902 |
| Interrupted by the session limit | no | no | once | twice |

**Chapter 6** (2026-10-18), the first made with `dev/workflows/chapter.js` on this plan: the text
about 5.9M subagent tokens (two drafts, two judges, two critic rounds, one extra check of round 2's
math, the spec), the build about 7.9M (four owners, the story builder, six reviewers with skeptics,
two integrations, the final review), and 0.4M to bring `docs/continuity.md` forward: **about 14.2M in
all**, with no session-limit stop, in one day. 136 frames (about 100 a reading, up to 114 with
Sleet), about 22 minutes plain and 25 with the optional scene, 13 confirmed review findings and 2 in
the final review, 1042 tests. Chapters 1 to 5 stayed byte-identical (674 frames compared).

Chapter 1 was 98 frames and a 387-line text. The engine has grown from 841 to 2,933 lines, the page
code from 1,635 to 3,109, the character art from 1,195 to 5,792, and `docs/build.md` to 1,254 lines.
The suite takes about 100 seconds.

**The trend to break:** each chapter cost more than the last while the reader got about the same
amount of story. Chapters 4 and 5 cost twice chapter 3, and both ran into the plan's session limit
(about 25M subagent tokens in a five-hour window).

## Where the cost went

1. **The chapter text became the spec, and the spec grew without limit.** By chapter 5 the notes
   (Counts tally, card table, art needs, Build notes, "For Aron") were 1.6 times the story, and
   every drafter, judge, critic and editor read all of them, plus the notes of earlier chapters,
   and every editing round rewrote them. The text workflow went from 5.5M to 10.3M tokens for the
   same 1,900 words of story.
2. **Every chapter invented engine features.** The critics kept asking for a better lesson
   (borrowed questions' voice, who counts in the help, a line for a slow right answer), each a new
   key in the engine, the page, the storyboard tool, the tests and `docs/build.md`. Chapter 5 has
   eight Counts sets. Most of the engine's growth, and many review findings, come from here.
3. **Optional content multiplies everything.** Chapter 5 has three optional scenes (Puddle, Wisp,
   the roof again): 186 frames, 2,880 flag combinations to check, and a 30-minute longest path
   against a 15–20 minute target.
4. **A stopped run reran finished work.** A workflow resumes from the first failed call, so one
   reviewer cut off by the limit meant rerunning the reviews that came after it. Twice a final
   review ran on work that was not ready.
5. **Agents doing the orchestrator's job.** Every visual reviewer wrote its own contact-sheet
   script (several with the same cropping bug); every chapter re-derived the workflow scripts.

## What went wrong, and the rule that prevents it

| What happened | Rule from now on |
|---|---|
| Subagents can see the user's chat. Editors refused to work ("fail out unless ultracode", ch 2), and an integrator answered "what's the current status?" instead of fixing 31 findings (ch 5). | Every prompt starts with the standing note in `dev/workflows/README.md`: the chat is for the orchestrator; do the work in this prompt. A report that says no files changed stops the run. |
| The session limit killed agents mid-run; a failed agent returned nothing and the script read that as "no findings" (ch 5's text came back "clean" with no review). | Every stage checks for a failed agent and stops. One phase per workflow, findings saved to files, so finished phases never rerun. |
| Parallel builders each owned files, so cross-file fixes landed on one side only: the art could draw the stone, the story never asked for it (ch 2). | Parallel owners for building; **one integrator who owns every file** for fixing. Kept since ch 3. |
| Review agents switched on Read to me in Safari and the mini talked. | `tools/shots.mjs` is silent by construction; the standing note forbids sound; the mini stays muted. |
| The mini's screen is locked, and Safari stops painting a few seconds into a session. | `tools/shots.mjs` detects the lock and takes each shot in a fresh short session. Never ask to unlock. |
| Names from the books kept surfacing late (Drizzle, Thunder, Russet, Fog, Rumble). | Check every new name against both wikis' APIs **before** drafting, in the orchestrator, not in round 3 of the critics. `README.md` lists what is still unchecked (Dew, Snip, "sunrises in a quarter-moon"). |
| A layout fix for one chapter moved lettering in live chapters (ch 2, ch 4). | The final regression review compares every live frame's render and lettering against `git HEAD`. Never skip it. |
| The open river shipped-ready in a colour that read as a lawn; only a human-style look at the whole panel caught it. | The orchestrator looks at five or six key panels in Safari before every push. |
| Orphaned `safaridriver` and local servers lingered for days. | Agents kill what they start; the orchestrator checks `ps` at wrap. |
| The outline drifted from the game: `module-1.md`'s chapter list kept Counts and a sum that decisions had replaced, and chapter notes kept retired names. | A decision that changes the plan is applied to `module-1.md` the day it is made; `docs/continuity.md` is the record of what shipped. |

## What worked, and stays

- **Text first, judged and criticised, then built.** The kids' favourite lines came from grafting
  three drafts. Critics caught real errors every round (a near-fail scene Aron had not asked for;
  a clue that settled an open question).
- **A skeptic for every finding.** Roughly a third of reported findings did not survive.
- **`tools/frames.mjs` and `tools/shots.mjs`**: art through Quick Look, real pages through Safari.
- **Stub files first** (set, story, script tags, service worker), so parallel builders always work
  in an app that loads.
- **Golden fixtures of the live engine** in the regression tests.
- **Decision 46, "I'll let you steer"**: calls recorded in the README, no blocking questions.

## The plan for chapters 6 to 10

**Target: 12–14M tokens a chapter (half of chapters 4 and 5), one session-limit window for the
text and one for the build, and a longest path under 22 minutes.**

### 1. A budget per chapter, enforced at the text stage

- Plain path at most 1,800 words; at most **one** optional scene of at most 150 words.
  **Decision 47** (2026-10-18) lets chapter 6 run to 22 minutes: the plain path at most about 2,000
  words and the one optional scene at most about 300, so at most 130 frames. Chapters 7 to 10 keep
  that budget unless Aron says otherwise (a call under decision 46).
- At most 120 frames (130 under decision 47). About 16 typed answers.
- At most one new place and two new characters, unless module-1 forces more (it does in chapters
  8 and 10: plan those as two build windows).
- **No new engine keys** unless the chapter cannot be told without one, and then at most one new
  interaction. The lesson is the kit below.

### 2. A lesson kit instead of a new lesson design each time

Every chapter's Count uses the same shape, already built and tested: an adaptive two-question
warm-up on the last Count (`warmHard`), a skip-count Tap, ten facts in both orders with the
standard lines, and two or three story questions that borrow from the lesson (`fillFrom`). A
chapter supplies only: the table, its picture words, its lines, and the story questions. The
drafters are told this, and the math critic checks arithmetic, order and clarity, not engine
design. Chapters 6–10 teach the 3s, 6s, 4s, 8s and 7s: the pictures exist for 3 and 4; the 6s
(whiskers on one cheek), 8s (a spider's legs) and 7s need one art pass each.

### 3. Split the story from the spec, and keep a continuity digest

- `docs/chapters/NN-title.md` is the story only (what Lissa reads, with its choices and Taps).
  Drafters, judges and prose critics read only stories.
- `docs/chapters/NN-title.spec.md` is written **once**, by one agent, after the story is final:
  flags, Counts sets, cards, art needs, anything the engine lacks, calls made. Critics of the spec
  are the math and continuity lenses only. Editors of prose never rewrite it.
- `docs/continuity.md`: one screen per shipped chapter (what happened, flags and their values,
  cards, dragonets found, names, what the next chapter inherits). The orchestrator updates it at
  ship. Drafters read it instead of five chapters of notes. Written 2026-10-12 through chapter 5,
  checked against the story files; where the notes and the code differed it follows the code
  (twelve differences were found in one pass, which is the argument for keeping it).

### 4. A leaner text workflow

Two drafts instead of three (the judges' totals were within five percent every time; the value
was in grafting, and two is enough to graft). One judge panel of two. Critics in round 2 and 3 run
only the lenses that found something high or medium in the round before. Hard stop at two rounds;
what is left goes to the notes as "known". Expected: 3–4M instead of 9–10M.

### 5. Build in phases, each its own workflow, each writing its results to disk

`build` (parallel owners) → `frames` (the story builder) → `review` → `integrate` → `final` → ship.
Each phase is a separate Workflow call; each writes its findings to
`<scratch>/chNN/<phase>.json`; the next phase reads the file. A limit hit loses at most the phase
in flight, nothing reruns, and the orchestrator reads each result before starting the next (an
idle integrator is caught in a minute, not after a wasted final review). Since 2026-10-18 this is
`dev/workflows/chapter.js`, one phase a call (`args.phase`), with its runbook and chapter 6's args
in `dev/workflows/README.md`; the work directory is `~/potomac-crossing-work/chNN/`, outside the
repo.

### 6. A smaller review that still catches what matters

- Visual: two reviewers, not four, using `tools/sheet.mjs` (six frames a sheet) instead of
  writing their own.
- Screens (Safari), Counts and every-path play, and text fidelity: keep, one agent each.
- Skeptics only for high and medium findings; lows go to the integrator as optional.
- Final: keep the **regression** and **deploy** lenses always. Drop the separate fresh-eyes
  playthrough when the visual review was clean; the orchestrator's own look replaces it.

### 7. Pace against the session limit

About 25M subagent tokens fit in one five-hour window. A chapter is the text (one window, with
room to spare) and the build (one window if the budget above holds). Never run two chapters'
heavy phases in the same window. When a run stops on the limit, schedule the resume for the reset
time instead of waiting to be asked.

### 8. What each remaining chapter needs (from module-1, as amended)

| Ch | Story | New Count | New art, at least | Watch for |
|---|---|---|---|---|
| 6 The Snake in the Stones | Coil trades a secret; the ReedClan patrol; the Sky River dream; Sleet (optional) | 3s (patrols) | Coil, ReedClan cats, Sleet, fox country's long grass | Coil funny-creepy, never frightening; the first ReedClan faces |
| 7 The Counts Don't Lie | Six nights: 24 gone against the 60 a dragon would eat; the tunnel | 6s (whiskers) | the tunnel mouth; the 6s picture | The sum is the case's turning point: the math must be crystal clear |
| 8 The Night Trail | The weasel holes, the stash, a funny chase; Hail (optional); her worry's brave moment | 4s (paws) | the tracks at night, the weasels, Reynard again, Hail | Two build windows; the weasels need names checked (Snip echoes Snipkit) |
| 9 Featherlight | The remedy from four territories; Sprinkle flies; the case laid out | 8s (spider's legs) | Thymeleaf, GroveClan's woods, the last dragonet (Dew needs a new name) | A fetch quest can sprawl: hold the budget |
| 10 The Gathering | The Moon Ferry, Reynard answered card by card, the Mistscales, the mist stone | 7s (only 7 × 7 is new) | Gathering Island, the full moon, grown Mistscales | Two build windows; the card-picking interaction is the one new mechanic |
| after 10 | **The Warrior Counts**, then the **Warrior Ceremony** chapter | all, to 10 × 10 | the ceremony | An engine project of its own (a test with a 90% pass mark and retries): build and test it **before** chapter 10's build, not inside it |

### 9. Aron's to decide before they block

- The Warrior Counts' format: 55 pairs or 100 questions; one sitting or rounds; how retries work.
- Dew's new name (before chapter 9); Snip's (before chapter 8); the 7s picture's words
  ("sunrises in a quarter-moon" echoes the books).
- ~~Whether chapters may run to 22 minutes or should come back to 15–20.~~ Answered for chapter 6:
  up to 22 minutes (decision 47, 2026-10-18).

Under decision 46 the orchestrator may make these calls and record them; the first is big enough
to ask.

## Shipping checklist

1. `node --test` green; storyboards current (`node tools/storyboard.mjs` changes nothing).
2. `CACHE` in `sw.js` past the live value; every script in `index.html` in `ASSETS`.
3. The orchestrator looks at five or six key panels in Safari (`tools/shots.mjs`).
4. README: status line, docs list, calls made under decision 46. `docs/continuity.md` updated.
5. `git add -A` (new files are untracked until then), commit, push with the deploy key.
6. Poll the live `sw.js` for the new cache name and fetch every `ASSETS` entry (all 200).
7. `ps` for stray `safaridriver` and local servers; note the ship in the memory system's journal.
