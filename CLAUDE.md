# CLAUDE.md

Orientation for Claude Code in this repository.

Potomac Crossing is a story game Aron is designing for Lissa (8) and her friends. Read
`README.md` first (decisions and open proposals), then `docs/world.md` and `docs/module-1.md`.

- **Where it lives.** Development happens on the Mac mini, in `~/potomac-crossing` (since
  2026-10-04). GitHub `ahmadia/potomac-crossing` is the shared remote, and GitHub Pages serves
  `main` at https://ahmadia.github.io/potomac-crossing/. The Air's copy is frozen: it has a
  `MOVED-TO-MINI` note and is not edited. The mini pushes with a **deploy key** that reaches
  this repo only: SSH alias `github-potomac-crossing`, key `~/.ssh/potomac_crossing_deploy`,
  repo deploy key 165338954 (revoke under Settings > Deploy keys).
- **Phase: chapters 1 and 2 are live.** They deploy whenever `main` is pushed. The stack and file layout
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
  Safari automation session runs at a time. Quick Look is not Safari: it drops a shadowed group
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
