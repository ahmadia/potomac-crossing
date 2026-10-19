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
| 6 | `review` | `frames`: frames' `frames` | nothing in the repo | the confirmed findings by reviewer |
| 7 | `integrate` | `findingsFile`: `<work>/review.json` | anything | `fixed` against the confirmed list; the suite. A run that read findings and changed no files stops itself |
| 8 | `final` | `play: true` only if the visual review was not clean | nothing in the repo | if anything is confirmed: `integrate` again with `findingsFile: <work>/final.json`, `round: 2` |
| | *ship, by hand* | | | `docs/production.md`, "Shipping checklist": the suite, the storyboards, five or six key panels in Safari, README and `docs/continuity.md`, commit, push, the live check |

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
- Changed, from `docs/production.md`: one phase a run, each result saved to disk; two drafts and two
  judges, not three; a names check before the synthesis for any name outside the brief's cleared
  list; critics in round 2 only for the lenses that found something high or medium, and never a third
  round; drafters and critics read the brief, the continuity digest and chapter 5's story, never the
  earlier chapters' notes; the spec written once, by one agent, after the story is final; two visual
  reviewers using `tools/sheet.mjs`; the final review is regression and deploy (the playtest only
  when asked); the build owners come from the spec, not from the script.
