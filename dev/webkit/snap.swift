// Potomac Crossing: the offscreen WebKit tool (the canonical copy, 2026-11-02; README.md beside this file).
// The real page rendered in WebKit itself (WKWebView, the engine Safari uses), in a borderless window far off the
// screen, so it works with the mini's screen locked and never touches Safari's automation. Built from the aa-layout
// judge's snap.swift (itself the screens-r3 and hotfix-ch08 checkers' tool) with the checker-aa-on poll and two
// additions: a step may take a snapshot of its own (one page, many pictures), and a stalled load or a crashed page
// is named and skipped instead of hanging the run.
//
// SILENT: a non-persistent data store (no save of any real player's is ever read or written), media never plays
// without a user action and all playback is suspended, and the driver's SILENT (tools/shots.mjs's, verbatim) is
// added at document start in every frame; the driver also puts it first in every served page's <head>.
//
// Usage: snap JOBS.json, from dev/webkit/run.mjs (or tools/sweep.mjs), which hold the render lock: run alone, it
// refuses (exit 3). JOBS: { width, height, silent, jobs: [{ url, out, steps: [{ js, wait, out?, rect? }] }] }.
//   - each job loads its url, waits 0.6 s after the load, then runs its steps in order: `js` is evaluated, then
//     `wait` seconds pass (0.3 by default); a step whose result is the string "pending" is run again after its wait
//     (up to 4,000 times), so an in-page task can be polled; a step with `out` then takes a PNG to that path
//     (`rect` [x, y, w, h] in CSS px: that part of the view, else all of it; a path ending .jpg is a JPEG);
//   - a job with an `out` takes a PNG when its steps are done; `out: ""` takes none;
//   - stdout: `RESULT job step value` for a step whose value is not true/1/null, `STEPERR job step message`,
//     the path of every PNG written, `path: no snapshot …` when one never came, `done` at the end.
// Exit 0 when every job ran; 2 when SNAP_TIMEOUT seconds (600 by default) pass first; 3 without the lock.
import AppKit
import WebKit

struct Step: Decodable { let js: String; let wait: Double?; let out: String?; let rect: [Double]? }
struct Job: Decodable { let url: String; let out: String; let steps: [Step] }
struct Jobs: Decodable { let width: Double; let height: Double; let silent: String; let jobs: [Job] }

func err(_ s: String) { FileHandle.standardError.write((s + "\n").data(using: .utf8)!) }
func say(_ s: String) { print(s); fflush(stdout) }

// one heavy renderer at a time (tools/lock.mjs): the driver holds the lock and says so in PC_RENDER_LOCK
if (ProcessInfo.processInfo.environment["PC_RENDER_LOCK"] ?? "").isEmpty {
  err("snap: run me through dev/webkit/run.mjs or tools/sweep.mjs, which hold the render lock (or: node tools/lock.mjs -- COMMAND)")
  exit(3)
}
guard CommandLine.arguments.count > 1, let data = try? Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1])) else { err("usage: snap JOBS.json"); exit(1) }
let spec: Jobs
do { spec = try JSONDecoder().decode(Jobs.self, from: data) } catch { err("snap: bad jobs file: \(error)"); exit(1) }

class Runner: NSObject, WKNavigationDelegate {
  var web: WKWebView!
  var window: NSWindow!
  var i = 0
  var gen = 0          // the job in flight: a callback from an earlier job (a crashed page, a stalled load) is ignored
  var polls = 0
  var loaded: (() -> Void)?
  func start() {
    let cfg = WKWebViewConfiguration()
    cfg.websiteDataStore = WKWebsiteDataStore.nonPersistent()
    cfg.mediaTypesRequiringUserActionForPlayback = .all
    cfg.allowsAirPlayForMediaPlayback = false
    let silent = spec.silent.replacingOccurrences(of: "<script>", with: "").replacingOccurrences(of: "</script>", with: "")
    cfg.userContentController.addUserScript(WKUserScript(source: silent, injectionTime: .atDocumentStart, forMainFrameOnly: false))
    // never throttled or suspended for being out of sight (the window is offscreen, the screen locked)
    for k in ["hiddenPageDOMTimerThrottlingEnabled", "hiddenPageDOMTimerThrottlingAutoIncreases", "pageVisibilityBasedProcessSuppressionEnabled"] {
      let sel = Selector("_set" + k.prefix(1).uppercased() + k.dropFirst() + ":")
      if cfg.preferences.responds(to: sel) { cfg.preferences.setValue(false, forKey: k) } else { err("no \(k)") }
    }
    web = WKWebView(frame: NSRect(x: 0, y: 0, width: spec.width, height: spec.height), configuration: cfg)
    if web.responds(to: Selector(("_setWindowOcclusionDetectionEnabled:"))) { web.setValue(false, forKey: "windowOcclusionDetectionEnabled") } else { err("no occlusion switch") }
    web.navigationDelegate = self
    web.setAllMediaPlaybackSuspended(true, completionHandler: nil)
    window = NSWindow(contentRect: NSRect(x: -20000, y: -20000, width: spec.width, height: spec.height), styleMask: [.borderless], backing: .buffered, defer: false)
    window.contentView = web
    window.orderFrontRegardless()
    next()
  }
  func next() {
    gen += 1; polls = 0
    if i >= spec.jobs.count { say("done"); exit(0) }
    let job = spec.jobs[i]; i += 1
    let mine = gen
    err("job \(i - 1)")
    loaded = { self.runSteps(job, 0, mine) }
    guard let url = URL(string: job.url) else { say("STEPERR \(i - 1) -1 bad url"); return next() }
    web.load(URLRequest(url: url))
    // a load that never finishes: named, and the next job runs
    DispatchQueue.main.asyncAfter(deadline: .now() + 45) {
      if mine == self.gen && self.loaded != nil { self.loaded = nil; say("STEPERR \(self.i - 1) -1 the page never finished loading"); self.next() }
    }
  }
  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { err("didFail \(error)") }
  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { err("didFailProv \(error)") }
  func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
    err("terminated")
    say("STEPERR \(i - 1) -1 the page's web content process ended")
    loaded = nil
    next()
  }
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    let f = loaded; loaded = nil
    web.setAllMediaPlaybackSuspended(true, completionHandler: nil)
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) { f?() }
  }
  func runSteps(_ job: Job, _ k: Int, _ mine: Int) {
    if mine != gen { return }
    if k >= job.steps.count {
      if job.out.isEmpty { say("JOBDONE"); return next() }
      return snap(job.out, nil) { self.next() }
    }
    let s = job.steps[k]
    web.evaluateJavaScript(s.js) { res, e in
      if mine != self.gen { return }
      if let e = e { say("STEPERR " + String(self.i - 1) + " " + String(k) + " " + String(describing: e).replacingOccurrences(of: "\n", with: " ")) }
      else if let r = res, !(r is NSNull) {
        if "\(r)" == "pending" && self.polls < 4000 { self.polls += 1; DispatchQueue.main.asyncAfter(deadline: .now() + (s.wait ?? 0.3)) { self.runSteps(job, k, mine) }; return }
        if "\(r)" != "1" && "\(r)" != "true" { say("RESULT " + String(self.i - 1) + " " + String(k) + " \(r)") }
      }
      self.polls = 0
      DispatchQueue.main.asyncAfter(deadline: .now() + (s.wait ?? 0.3)) {
        if mine != self.gen { return }
        if let out = s.out, !out.isEmpty { self.snap(out, s.rect) { self.runSteps(job, k + 1, mine) } }
        else { self.runSteps(job, k + 1, mine) }
      }
    }
  }
  var token = 0
  func snap(_ out: String, _ rect: [Double]?, _ then: @escaping () -> Void, _ tries: Int = 0) {
    token += 1
    let mine = token
    var settled = false
    let c = WKSnapshotConfiguration()
    if let r = rect, r.count == 4 { c.rect = CGRect(x: r[0], y: r[1], width: r[2], height: r[3]); c.snapshotWidth = NSNumber(value: r[2]) }
    else { c.snapshotWidth = NSNumber(value: spec.width) }
    // a snapshot that never calls back: tried again, then given up (the path named, never a blank file)
    DispatchQueue.main.asyncAfter(deadline: .now() + 6) {
      if settled || mine != self.token { return }
      settled = true
      if tries < 3 { err("snap stalled, again"); self.web.setNeedsDisplay(self.web.bounds); self.snap(out, rect, then, tries + 1) }
      else { say(out + ": no snapshot (stalled)"); then() }
    }
    web.takeSnapshot(with: c) { img, e in
      if settled || mine != self.token { return }
      settled = true
      // a path ending .jpg is written as JPEG at 0.85 (a quarter of the PNG's size, for the sweep's thousands), else PNG
      let jpg = out.lowercased().hasSuffix(".jpg") || out.lowercased().hasSuffix(".jpeg")
      if let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
         let bytes = jpg ? rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85]) : rep.representation(using: .png, properties: [:]) {
        do { try bytes.write(to: URL(fileURLWithPath: out)); say(out) } catch { say(out + ": not written: \(error)") }
        then()
      } else if tries < 4 {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) { self.snap(out, rect, then, tries + 1) }
      } else { say(out + ": no snapshot " + String(describing: e)); then() }
    }
  }
}
let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let r = Runner()
DispatchQueue.main.async { r.start() }
DispatchQueue.main.asyncAfter(deadline: .now() + (Double(ProcessInfo.processInfo.environment["SNAP_TIMEOUT"] ?? "600") ?? 600)) { say("timeout"); exit(2) }
app.run()
