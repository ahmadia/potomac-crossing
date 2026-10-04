# CLAUDE.md

Orientation for Claude Code in this repository.

Potomac Crossing is a story game Aron is designing for Lissa (8) and her friends. Read
`README.md` first (decisions and open proposals), then `docs/world.md` and `docs/module-1.md`.

- **Where it lives.** Development happens on the Mac mini, in `~/potomac-crossing` (since
  2026-10-04). GitHub `ahmadia/potomac-crossing` is the shared remote, and GitHub Pages serves
  `main` at https://ahmadia.github.io/potomac-crossing/. The Air's copy is frozen: it has a
  `MOVED-TO-MINI` note and is not edited.
- **Phase: chapter 1 is live.** It deploys whenever `main` is pushed. The stack and file layout
  are in `docs/build.md`; follow it. Static site, no build step, no dependencies.
  **Bump `CACHE` in `sw.js` whenever a cached file changes**, or installed iPads keep the old
  version.
- Run the tests with `node --test` from the repo root (it finds `tests/*.test.js`; on Node 22+
  `node --test tests/` fails, because a directory argument is read as a file). On the mini, Node
  is the official LTS build installed in user space at `~/.local/node` (not Homebrew), put on
  PATH by `~/.zprofile`. Regenerate the storyboard with `node tools/storyboard.mjs` whenever
  `app/story/` or the tool changes; never hand-edit `docs/storyboard/`
  (`tests/storyboard.test.js` fails when it is stale).
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

- **Visual checks.** Use the desktop app's browser pane. Never launch Homebrew's `chromium`:
  the cask has been disabled since 2026-09-01 for failing Gatekeeper, and launching it once
  removed Chromium.app.
- **Cap screenshot sweeps.** Any agent sweeping frames visually takes at most about 30
  screenshots and keeps notes in a file as it goes. An uncapped art review looped after
  compacting its context and read its own screenshots 2,334 times.
- **Clicks after a resize.** In the browser pane, after `resize_window`, coordinate clicks can
  land far off-screen. Before chasing a "button doesn't work" bug, confirm with
  `elementFromPoint` and a `pointerdown` listener.
- **Potion Lab's cache.** Potion Lab shares the `ahmadia.github.io` origin, and its `sw.js`
  deletes every cache but its own when it updates. That empties this game's offline copy until
  the next online visit. The fix belongs in Potion Lab and has not been made.
