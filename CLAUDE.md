# CLAUDE.md

Orientation for Claude Code in this repository.

Potomac Crossing is a story game Aron is designing for Lissa (8) and her friends. Read
`README.md` first (decisions and open proposals), then `docs/world.md` and `docs/module-1.md`.
**Before building a chapter, read `docs/production.md`**: what chapters 2 to 5 cost, what went
wrong, and the leaner plan for chapters 6 to 10 (a budget per chapter, a lesson kit instead of new
engine keys, the story split from its spec, `docs/continuity.md` instead of five chapters of notes,
one workflow per phase). `dev/workflows/chapter.js` makes a chapter one phase a call; its runbook
(the order, each phase's args, what to read between phases) and the standing note every subagent
prompt needs are in `dev/workflows/README.md`. A chapter starts from its brief
(`docs/chapters/NN-title.brief.md`: the steering calls, the budget, the names checked before
drafting); chapter 8's is the latest (2026-10-20).

- **Where it lives.** Development happens on the Mac mini, in `~/potomac-crossing` (since
  2026-10-04). GitHub `ahmadia/potomac-crossing` is the shared remote, and GitHub Pages serves
  `main` at https://ahmadia.github.io/potomac-crossing/. The Air's copy is frozen: it has a
  `MOVED-TO-MINI` note and is not edited. The mini pushes with a **deploy key** that reaches
  this repo only: SSH alias `github-potomac-crossing`, key `~/.ssh/potomac_crossing_deploy`,
  repo deploy key 165338954 (revoke under Settings > Deploy keys).
- **Phase: chapters 1 to 9 are live.** They deploy whenever `main` is pushed. The stack and file layout
  are in `docs/build.md`; follow it. Static site, no build step, no dependencies.
  **Bump `CACHE` in `sw.js` whenever a cached file changes**, or installed iPads keep the old
  version.
- Run the tests with `node --test` from the repo root (it finds `tests/*.test.js`; on Node 22+
  `node --test tests/` fails, because a directory argument is read as a file). On the mini, Node
  is the official LTS build installed in user space at `~/.local/node` (not Homebrew), put on
  PATH by `~/.zprofile`. Regenerate the storyboards with `node tools/storyboard.mjs` (every
  chapter) whenever `app/story/` or the tool changes; never hand-edit `docs/storyboard/`
  (`tests/storyboard.test.js` fails when one is stale).
- **A new chapter** is a new `app/story/chNN.js` (and its script tag and `sw.js` entry); a new
  place is a new `app/art/sets/<id>.js` registered with `PC.art.defineSet`, drawn with
  `PC.art.kit`. The contract for both is `docs/build.md`.
- Local check: `python3 -m http.server 8790` in the repo root, then `http://localhost:8790/`;
  `dev/gallery.html` shows all the art.
- **Decisions are Aron's.** Add new ones to the README's list with a date. A proposal moves
  to Decisions only when Aron confirms it.
  Since 2026-10-10 (decision 46, "I'll let you steer") the open questions are Claude's to call:
  decide, record the call and its reason under "Claude's calls under decision 46" in the README,
  and keep building. Ask only for what cannot be undone once the kids have seen it and is too big
  to guess (the Warrior Counts' format is the next such).
- **Our own world.** Never use names from Wings of Fire or Warriors: tribes, Clans,
  characters, places, or their coined words (Twoleg, kittypet, StarClan, fresh-kill,
  Thunderpath). Shared conventions are fine: -paw apprentice names, -star leaders,
  full-moon Gatherings.
- **Separate from Potion Lab** (`~/potion-lab`): no shared saves, characters, or code.
- **Tone** (`docs/world.md`): nobody dies, no gore; bad guys are outwitted, exposed, and
  chased off.
- **The math is Aron's first priority.** The Counts section of `docs/module-1.md` is the
  spec: 1, 2, 5, 10, then 3 and 4; about 10–20% of play time; never a wall.
- Lissa reads it herself, so keep screens short.

## Working notes (learned building chapter 1)

- **Subagents can see the user's chat.** Twice a workflow agent took a chat message for its task
  (it refused to work; it answered a status question instead of fixing). Every subagent prompt
  starts with the standing note in `dev/workflows/README.md`.
- **The mini is silent and its screen stays locked** (Aron, 2026-10-12 and 2026-10-04). Output is
  muted; never unmute it, never play sound, never ask for the screen to be unlocked.
  `tools/shots.mjs` is silent by construction and handles the lock.
- **Contact sheets**: `node tools/sheet.mjs OUT-%.png a.png b.png …` (six frames a sheet).
- **Visual checks from a session on the mini.** `node tools/frames.mjs ch02 OUTDIR [frames]`
  renders frames' art (no lettering) to PNG through Quick Look; `--scene '<json>'` renders one
  scene. `node tools/shots.mjs OUTDIR f077 ch02:f010 hub book` screenshots the real game in Safari
  (Safari's Develop > Allow Remote Automation is on since 2026-10-04): with a test cat on a
  localhost origin, never a real save. **The mini's screen stays locked (Aron's choice: never ask
  to unlock it).** Locked, Safari paints only for the first few seconds of a WebDriver session, so
  `shots.mjs` reads the lock (`ioreg -n Root -d1`, `"CGSSessionScreenIsLocked"=Yes`) and takes each
  target in a fresh short session of its own, a few seconds each (`LOCKED=1`/`0` overrides).
  `SHEET=1` puts four targets on a contact sheet, one screenshot each, its panes fitted to the page
  as measured. Check flows and timing in Node with the engine, not by tapping in Safari. Only one
  Safari automation session runs at a time: to wait for it, ask `pgrep -x safaridriver` (never
  `pgrep -f`, which matches the waiting shell too, and other agents' waiting shells). A busy Mac can
  hand back a blank screenshot (one flat colour): `shots.mjs` reads each one before keeping it, takes
  a blank one again in a fresh session, takes a blank sheet as its single pages, and says `blank:` on
  stderr (exit 1) for a target that never paints; `node tools/shots.mjs --blank a.png` checks a PNG
  you already have, so no look is spent on a black picture. **The mini makes no sound** (Aron's
  rule): `shots.mjs` is silent by construction (every page it serves has speech and audio switched
  off before the game boots; "Read to me" stays off, a `@readBtn` tap is refused, and `READ=1`
  switches it on in a page that still says nothing). Never run `say`, play audio, or touch the
  system volume; check what Read to me would say in Node, with the engine (`E.captionsRead`,
  `E.balloons`), or on the real page with `DRY=1 node tools/shots.mjs OUTDIR ch05:f053`, which
  prints the page's own list with Read to me off. Quick Look is not Safari: it drops a shadowed group
  too big for its filter buffer (the header of `tools/frames.mjs`), so check a missing layer in
  Safari before fixing the art.
- **Visual checks in the desktop app.** Use the browser pane. Never launch Homebrew's `chromium`:
  the cask has been disabled since 2026-09-01 for failing Gatekeeper, and launching it once
  removed Chromium.app.
- **Cap screenshot sweeps.** Any agent sweeping frames visually takes at most about 30
  screenshots and keeps notes in a file as it goes. An uncapped art review looped after
  compacting its context and read its own screenshots 2,334 times.
- **Clicks after a resize.** In the browser pane, after `resize_window`, coordinate clicks can
  land far off-screen. Before chasing a "button doesn't work" bug, confirm with
  `elementFromPoint` and a `pointerdown` listener.
- **`gh` on the mini** is logged in through the macOS keychain, which SSH sessions can't
  read, so `gh auth status` over SSH reports the token as invalid. Git pushes don't need
  `gh`; they use the deploy key.
- **Potion Lab's cache.** Potion Lab shares the `ahmadia.github.io` origin, and its `sw.js`
  deletes every cache but its own when it updates. That empties this game's offline copy until
  the next online visit. The fix belongs in Potion Lab and has not been made.
