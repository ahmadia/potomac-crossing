# Workflow scripts

The scripts that built chapter 5, kept as examples to adapt for the next chapter. They are run
with Claude Code's Workflow tool (`Workflow({ script })` or `{ scriptPath, args }`), not with Node.
Read [`docs/production.md`](../../docs/production.md) first: it says what to change about them.

| File | What it is |
|---|---|
| `chapter-text.example.js` | Chapter 5's text: three drafts, three judges, a synthesis, then critics and an editor until clean. It stops if a critic fails. |
| `chapter-build.example.js` | Chapter 5's build in one script: parallel owners, the story builder, eight reviews each with a skeptic, one integrator, a final review, a fix pass, a final run. It stops at the first failed agent. |
| `fix-and-verify.example.js` | The small shape for one late fix: one owner fixes, an independent agent verifies (the open river's colour). |

Each takes `args: { scratch: '<a scratch directory>' }`. The prompts name chapter 5: copy the file,
change the chapter's name, text path, steering calls and owners.

## What to change before reusing them (from `docs/production.md`)

1. **One phase per script** (build, frames, review, integrate, final), each writing its result to
   `<scratch>/<phase>.json`, the next reading it. As one script, a session-limit stop reran
   finished reviews, and an integrator that did nothing was followed by a wasted final review.
2. **The standing note below goes at the top of every prompt**, from the first agent on (in
   chapter 5 it was added only after two agents had gone wrong).
3. Two drafts, not three; two visual reviewers using `tools/sheet.mjs`; skeptics only for high and
   medium findings.
4. Tell the text agents the budget and the lesson kit: no new engine keys.

## The standing note

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

## Things the scripts already get right

- `if (!result) return { stopped: … }` after every stage: a failed agent stops the run instead of
  reading as "no findings".
- A reviewer's findings go straight to its own skeptic (`pipeline`), not through a barrier.
- One integrator owns every file; the parallel builders each own a disjoint set.
- A report matching "no fixes were applied / changed no files" stops the run.
