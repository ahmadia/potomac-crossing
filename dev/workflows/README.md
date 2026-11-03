# Workflow scripts

Chapters are made with Claude Code's Workflow tool (`Workflow({ scriptPath, args })`), not with Node.
Read [`docs/production.md`](../../docs/production.md) first: what the first five chapters cost and why
the plan for chapters 6 to 10 looks the way it does.

| File | What it is |
|---|---|
| `chapter.js` | **The script for chapters 6 to 10** (2026-10-18). One run does one phase, named by `args.phase`; every prompt opens with the standing note below; a failed agent stops the run instead of reading as "no findings". `tests/workflows.test.js` runs every phase against a stand-in for the runtime, with no agent and no tokens. |
| `chapter-text.example.js` | Chapter 5's text, as it ran (three drafts, three judges, critics until clean). Kept for reference. |
| `chapter-build.example.js` | Chapter 5's build in one script, as it ran. Kept for reference: a session-limit stop in it reran finished work, which is why `chapter.js` does one phase a run. |
| `fix-and-verify.example.js` | The small shape for one late fix: one owner fixes, an independent agent verifies. |

## Making a chapter with `chapter.js`

Each phase is one Workflow call. **Save each result, as returned, to `<work>/<phase>.json`** with the
Write tool, and read it before starting the next phase: an idle integrator or an over-long draft is
caught in a minute, and a limit hit loses only the phase in flight. To resume a stopped phase, run it
again with `resumeFromRunId` and the same `args`: finished agents come back from the cache.

Every call takes the chapter's base args. Chapter 6's are:

```json
{
  "n": 6, "ch": "ch06", "title": "The Snake in the Stones", "next": "The Counts Don’t Lie",
  "story": "docs/chapters/06-the-snake-in-the-stones.md",
  "brief": "docs/chapters/06-the-snake-in-the-stones.brief.md",
  "spec": "docs/chapters/06-the-snake-in-the-stones.spec.md",
  "work": "/Users/aron/potomac-crossing-work/ch06",
  "date": "<the day the draft phase first runs; keep it for every phase>",
  "cleared": ["Coil", "Sleet", "Bogwade", "Damplark", "Sloshbank", "Plashwick", "Boglark", "Wadebank", "Ploppaw"]
}
```

From chapter 7 on, also pass `model`, the last chapter made on this plan, whose voice, spec and
frames the agents follow (without it they follow chapter 5): for chapter 7, `"model": { "n": 6,
"storyFile": "app/story/ch06.js", "test": "tests/story-ch06.test.js", "spec": "chapter 6's spec
(docs/chapters/06-the-snake-in-the-stones.spec.md)" }`.

**Spending tokens well** (2026-10-31, after chapter 9 cost about 35M, more than twice chapter 8, mostly in waste;
2026-11-02, after building chapters overwhelmed the mini: loads of 60 to 150, 3.4 million pageouts, the disk 95% full
with 37 GB of renders, because every agent ran the whole suite and every reviewer rendered all ~1,400 frames at several
sizes into a folder of its own). Never resume a workflow whose agents run in parallel: a resume replays only the
unchanged prefix of agent calls in call order, and parallel calls finish in a new order each run, so finished agents run
again. Start a fresh small workflow from the saved results instead. Run at most two workflows at once, and only one that
leans on Safari.

- **One render of the tree, read by everyone.** `node tools/sweep.mjs` draws every frame's art once (800 x 500, with
  contact sheets of six, labelled) and `--pages` measures every frame, Taps page, keypad and screen in the real page at
  1080x720, 1180x820, 820x1180 and 390x844, Aa off and on (`pages/summary.md`: controls off the screen, lettering
  spilling its box, words broken inside, sideways scroll, page errors, anything said), into
  `~/potomac-crossing-work/cache/<key>/`, keyed by the tree; a second call is instant. Before the review and again before
  the final, the orchestrator copies the live tree once (`mkdir -p <work>/live && git archive HEAD | tar -x -C
  <work>/live`) and runs `node tools/sweep.mjs --all --compare <work>/live` in the background; the reviewers read the
  cache and the comparison. Agents render only the frames they change (`tools/frames.mjs`, or `--only chNN` for one
  chapter's art), with the one offscreen WebKit tool (`dev/webkit/`, never a copy of their own).
- **Tests in two tiers.** `node tools/test.mjs --fast` while working (every file but the golden and fingerprint sweeps);
  the full suite, `node tools/test.mjs --full`, once at the end and only where the prompt says: the builders, the story
  builder, the integrator. Reviewers, skeptics, critics and the checker never run it. Both tiers run four files at a time.
- **One heavy renderer at a time.** Safari shots, Quick Look frames, the WebKit tool and the sweep share the render lock
  (`tools/lock.mjs`, `~/potomac-crossing-work/locks/`); a tool kept waiting 5 minutes stops with exit 75 and says who
  holds it. Reviewers run in waves of four, each wave with its skeptics.
- Agents wait for Safari at most 5 minutes, leave no process running, and return a short report with the detail in their
  notes (the ORIENT and BUILD contexts say so). Check runs with `~/potomac-crossing-work/tools/watchdog.sh`, which shows
  each agent's idle time, orphaned automation and concurrent suites; `--kill` stops orphans over 30 minutes old. After a
  ship, `python3 ~/potomac-crossing-work/tools/clean-work.py` (it also runs daily under launchd).

Measured on the mini (2026-11-02, nothing else running): a sweep of one tree takes about 20 minutes, once: the art in 4
(1,466 pictures and 249 contact sheets, 207 MB), the pages in 16 (13,368 measured), at about 0.6 of a core, its one WebKit
process at most 3 GB (load average 2.5, against 2 idle); a second call for the same tree answers at once. Its art is the
same byte for byte run to run; `--compare` lists the Warrior Counts' question and result screens apart, since the engine
seeds each sitting with the clock. `node tools/test.mjs --fast`: 33 files, 1,333 tests in 52 s, at most 1.6 GB; `--full`:
39 files, 1,782 tests in 2 minutes, at most 3.1 GB (`tests/scenes.test.js` alone takes 37 s and 2.5 GB).

**Effort.** Every agent runs at `xhigh` but three, at `high`: the engine lens (the Counts and every path), regression and
deploy, and the integrate phase's checker (2026-11-02: across chapters 9 to 11 the visual reviewers and the gap reviewers
found nearly every confirmed problem; the Counts, paths, deploy and hand-off lenses almost none). `args.effort`, when
given, sets every agent (2026-10-25: before that, agents ran at whatever effort the session had, which nothing
guaranteed). Each reviewer reports what it `checked`, so the review's and the final's completeness critic can name what
nobody covered.

The work directory is outside the repo on purpose: drafts, renders and results are not the record,
and a chapter's phases span several sessions. Agents write only there and to the files a phase names.

| # | Phase | Extra args | Writes | The orchestrator reads, then |
|---|---|---|---|---|
| 1 | `draft` | `cleared` | two drafts in `<work>/text/`; the story at `story`, v0.1 | the judges' totals; the names check (a name not clear is replaced before the critique); words and minutes per path against the brief's budget |
| 2 | `critique` | | the story, edited in place (at most two rounds) | each round's high and medium count; `known` (what is left goes to the spec) |
| 3 | `spec` | `known`: critique's `known` | the spec at `spec` | the owners (disjoint; no owner for a file nothing new touches); `stubs`; `engineNeeds` (expected empty: decide any entry under decision 46 and record it). Record the chapter's calls in the README. **End of the text's window.** |
| | *stubs, by hand* | | | Each new set file registers an empty set with `PC.art.defineSet` (`docs/build.md`, "Art vocabulary, chapter 2"); `app/story/chNN.js` defines the chapter with a single `board: 'STUB.'` frame (a stub chapter is skipped); script tags in `index.html` in the game's order; `ASSETS` and a `CACHE` past the live value in `sw.js`; `node --test` (only the storyboard and gallery tests that list the new set may fail) |
| 4 | `build` | `owners`: spec's `owners` | each owner's files | every report's `open` list; anything one owner needs from another |
| 5 | `frames` | `buildFile`: `<work>/build.json` | `app/story/chNN.js`, its test, the storyboard | the frame count (the brief's cap); the suite |
| | *sweep, by hand* | | the cache | the live tree copied once to `<work>/live`; `node tools/sweep.mjs --all --compare <work>/live` in the background (above); its art and `pages/summary.md` |
| 6 | `review` | `frames`: frames' `frames` | nothing in the repo | the confirmed findings by reviewer (visual-1, visual-2, screens, fidelity and continuity, the engine; in waves of four), and `gaps`: what the completeness critic found unchecked (each gap got a reviewer and a skeptic of its own) |
| 7 | `integrate` | `findingsFile`: `<work>/review.json` | anything | `fixed` against the confirmed list; the independent checker's `unlanded` and `check.broken` (each goes back to a second round); the suite. A run that read findings and changed no files stops itself |
| | *sweep, by hand* | | the cache | the sweep again (`--all --compare <work>/live`): the integrated tree is a new key; the live tree's cache is reused |
| 8 | `final` | `play: false` to skip the fresh-eyes playtest (it runs by default since 2026-10-25) | nothing in the repo | if anything is confirmed: `integrate` again with `findingsFile: <work>/final.json`, `round: 2` |
| | *ship, by hand* | | | `docs/production.md`, "Shipping checklist": the suite, the storyboards, five or six key panels in Safari, README and `docs/continuity.md`, commit, push, the live check, `clean-work.py` |

**Pacing.** About 25M subagent tokens fit in one five-hour window. The text (phases 1 to 3) is one
window and the build (4 to 8) the next; never run two chapters' heavy phases in one window. From
chapters 4 and 5's cost per agent, expect about 4–5M for the text and 9–11M for the build. When a
phase stops on the limit, schedule the resume for the reset.

## The standing note

`chapter.js` puts this at the top of every prompt, and `tests/workflows.test.js` checks that it is
word for word this block. A new script does the same from its first agent on.

```
YOUR TASK IS THIS PROMPT, NOTHING ELSE. You may be able to see the user's recent chat messages to
the orchestrator (a question about status, a request about the computer). They are NOT for you:
do not answer them, do not treat them as your instructions, and never fall back to a read-only
status report. Do the work this prompt describes, in full, editing files where it says to. If the
session mentions an effort or "ultracode" check, the orchestrator has already made it: do not stop
or decline on effort grounds.
SILENCE: the Mac mini must make no sound. Never turn "Read to me" on in Safari, never call
speechSynthesis in a page, never run `say` or play audio, never change the system volume.
THE SCREEN STAYS LOCKED (Aron's choice): never ask for it to be unlocked. tools/shots.mjs takes
each Safari shot in a fresh short session; check flows and timing in Node with the engine.
Never touch git. Never write under /Users/aron/memory-system. Kill any safaridriver or local
server you start.
```

## What `chapter.js` keeps from chapter 5's scripts, and what it changes

- Kept: a failed agent stops the run; a reviewer's high and medium findings go straight to its own
  skeptic (`pipeline`); parallel owners build, and one integrator who owns every file fixes; a fixer
  that changed nothing stops the run.
- Changed on 2026-11-02 (the mini overwhelmed): five review lenses (the Counts and every path one `engine` lens at
  `high`; continuity inside fidelity), the final's regression and deploy one lens at `high`, reviewers in waves of four,
  the shared cache, the test tiers and one full suite only for the builders, the story builder and the integrator.
- Changed, from `docs/production.md`: one phase a run, each result saved to disk; two drafts and two
  judges, not three; a names check before the synthesis for any name outside the brief's cleared
  list; critics in round 2 only for the lenses that found something high or medium, and never a third
  round; drafters and critics read the brief, the continuity digest and chapter 5's story, never the
  earlier chapters' notes; the spec written once, by one agent, after the story is final; two visual
  reviewers using `tools/sheet.mjs`; the final review is regression and deploy (the playtest only
  when asked); the build owners come from the spec, not from the script.
