# The offscreen WebKit tool

The real game page rendered in WebKit itself (WKWebView, the engine Safari uses), in a borderless window far off the
screen: it works with the mini's screen locked, never touches Safari's automation, and makes no sound. It is the
aa-layout judge's tool (2026-10-26), made the one canonical copy on 2026-11-02, after dozens of agents had each
built one of their own. **Never build your own; never copy these files.** For whole-tree renders and measurements,
use `node tools/sweep.mjs`, which runs this tool once per state of the tree and caches the result.

| File | What it is |
|---|---|
| `snap.swift` | The WebKit runner: loads each job's page, runs its steps, takes PNG or JPEG snapshots. Refuses to start without the render lock (exit 3). |
| `build.mjs` | Builds `snap.swift` into `~/potomac-crossing-work/tools/webkit/snap` with `swiftc`, only when the source is newer than the binary or differs from what it was built from (`snap.sha256`). The driver and the sweep call it first; nobody builds by hand. |
| `run.mjs` | The driver: serves a tree on localhost, takes the render lock, runs the binary at a low priority, reads its results. A command of its own and a module (`tools/sweep.mjs` uses it). |
| `measure.js` | The in-page measure: `window.__JM` (the screen as it is: controls off the screen, lettering spilling its box, words broken inside, sideways scroll, page errors, the silence, fingerprints of every box) and `window.__JSWEEP` (every frame, every Taps page tapped through, every Counts keypad). |

## Use

```
node dev/webkit/run.mjs OUT.json shot:ch05:f010:0:/abs/f010.png          one frame as it opens (Aa off), measured and pictured
node dev/webkit/run.mjs OUT.json shott:ch05:f049:1:12:/abs/f049.png     the frame after 12 taps, Aa on
node dev/webkit/run.mjs OUT.json only:ch05:f010,ch05:f011               these frames measured (Aa off and on)
SIZE=820x1180 AA=1 node dev/webkit/run.mjs OUT.json plain taps lessons   every frame, Taps page and keypad at one size
SIZE=844x390 node dev/webkit/run.mjs OUT.json takes                      the take screens at one of the page review's sizes (tools/sweep.mjs --takes caches all four)
SIZE=1080x700 node dev/webkit/run.mjs OUT.json spanish                   chapter 12's Spanish screens (ES_SCREENS and the shelf); tools/sweep.mjs runs them in --pages and --takes
ROOT_DIR=/path/to/tree node dev/webkit/run.mjs …                        another tree (its own tools/shots.mjs scripts)
node dev/webkit/build.mjs --check                                       is the binary current? (builds nothing)
```

The top of `run.mjs` lists every target (`screens`, `warrior`, `takes`, `spanish`, `settle:`, `probe:`), the environment (`SIZE`, `AA`,
`CAT`, `CSS`) and the output's shape.

## Safety, kept from every earlier copy

- **Silent.** Every page it serves has `SILENT` (from the tree's own `tools/shots.mjs`, verbatim) first in its
  `<head>`, and the binary adds it again at document start in every frame: speech is a stand-in that says nothing,
  media never plays, there is no audio context. The web view's data store is non-persistent, media needs a user
  action and all playback is suspended. `STILL` stops animations; `SETUP` sets up a fresh test cat with `QUIET`, so
  Read to me is off and checked (a page where it is on is reported). Nothing here runs `say`, plays audio or touches
  the volume.
- **No real save.** A non-persistent store on a localhost origin: no player's save is read or written.
- **One heavy renderer at a time.** The driver takes the render lock (`tools/lock.mjs`), shared with
  `tools/shots.mjs`, `tools/frames.mjs` and `tools/sweep.mjs`; it waits at most 5 minutes, then stops with exit 75
  and says who holds it. The binary itself refuses to start without the lock (`PC_RENDER_LOCK`).
- **Gentle.** One WebKit process at a time, at taskpolicy's utility clamp; a page that never loads or a content
  process that dies is named and skipped, never a hang; nothing is left running when the driver exits.
