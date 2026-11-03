#!/usr/bin/env node
/* Potomac Crossing: the render lock. One heavy renderer at a time on the mini, across tools/shots.mjs (Safari),
 * tools/frames.mjs (Quick Look), the offscreen WebKit tool (dev/webkit/run.mjs) and tools/sweep.mjs: four workflows'
 * agents rendering at once took the load to 60–150 and the disk to 95% (2026-11-02).
 *
 * The lock is a directory, ~/potomac-crossing-work/locks/render.lock/, made atomically (mkdir), with holder.json in it:
 * the holder's pid, what it is, since when, and the process's own start time (so a pid the system has reused is not
 * taken for the holder). A lock whose holder is gone (a dead pid: a killed agent, a crash) is taken over. Anyone else
 * waits, at most 5 minutes (LOCK_WAIT seconds), then stops with a clear message and exit 75. The holder's children
 * inherit it (PC_RENDER_LOCK=<holder pid>), so the WebKit binary under its driver, or a command run by `--`, never
 * waits on its own parent.
 *
 *   node tools/lock.mjs                  who holds it (or "free")
 *   node tools/lock.mjs -- CMD ARGS…     run a command holding the lock (exit: the command's, or 75 after the wait)
 *   PC_LOCK_DIR=dir LOCK_WAIT=s          another lock directory, another wait (tests)
 */
import { spawn, execFileSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync, statSync, existsSync, renameSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { pathToFileURL } from 'url';

export const LOCK_DIR = process.env.PC_LOCK_DIR || join(homedir(), 'potomac-crossing-work/locks');
const LOCK = join(LOCK_DIR, 'render.lock');
const TAKEOVER = join(LOCK_DIR, 'render.takeover');
export const EXIT_LOCKED = 75;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitSec = () => { const s = +process.env.LOCK_WAIT; return Number.isFinite(s) && s >= 0 ? s : 300; };

function startOf(pid) {
  try { return execFileSync('ps', ['-o', 'lstart=', '-p', String(pid)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { return null; }
}
function alive(pid) {
  if (!(pid > 0)) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}
/* The holder as holder.json says, or null when the lock is free. */
export function holder() {
  if (!existsSync(LOCK)) return null;
  try { return JSON.parse(readFileSync(join(LOCK, 'holder.json'), 'utf8')); } catch { return { pid: 0, what: '(being taken)', since: null, made: statMs(LOCK) }; }
}
function statMs(p) { try { return statSync(p).mtimeMs; } catch { return 0; } }
/* Gone: its pid is dead, or the pid now names another process (its start time differs). A lock with no holder.json
 * yet is someone's mkdir a moment old; after 10 s it is a crash between the two. */
function isStale(h) {
  if (!h) return false;
  if (!h.pid) return Date.now() - (h.made || 0) > 10000;
  if (!alive(h.pid)) return true;
  if (h.start) { const now = startOf(h.pid); if (now && now !== h.start) return true; }
  return false;
}
const describe = (h) => h ? 'pid ' + h.pid + ' (' + (h.what || '?') + (h.since ? ', since ' + h.since : '') + ')' : 'nobody';

let held = 0;   // this process's own holds (nested calls in one process never wait on themselves)
function inherited() {
  const p = +process.env.PC_RENDER_LOCK;
  if (!(p > 0) || p === process.pid) return false;
  const h = holder();
  return !!(h && h.pid === p && alive(p));
}
function release() {
  if (held <= 0) return;
  if (--held > 0) return;
  const h = holder();
  if (h && h.pid === process.pid) rmSync(LOCK, { recursive: true, force: true });
  if (+process.env.PC_RENDER_LOCK === process.pid) delete process.env.PC_RENDER_LOCK;
}
let hooked = false;
function hook() {
  if (hooked) return;
  hooked = true;
  process.on('exit', () => { if (held > 0) { held = 1; release(); } });
  for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) process.on(sig, () => { if (held > 0) { held = 1; release(); } process.exit(code); });
}
function tryTake(what) {
  try { mkdirSync(LOCK_DIR, { recursive: true }); mkdirSync(LOCK); } catch (e) { if (e.code === 'EEXIST') return false; throw e; }
  writeFileSync(join(LOCK, 'holder.json'), JSON.stringify({ pid: process.pid, what, since: new Date().toLocaleString('sv-SE').slice(0, 16), start: startOf(process.pid) }) + '\n');
  return true;
}
/* A stale lock is removed by one waiter at a time (the takeover directory), re-checked while it holds that. */
function takeOver() {
  try { mkdirSync(TAKEOVER); } catch (e) {
    if (e.code === 'EEXIST' && Date.now() - statMs(TAKEOVER) > 30000) rmSync(TAKEOVER, { recursive: true, force: true });
    return;
  }
  try {
    const h = holder();
    if (h && isStale(h)) {
      const gone = LOCK + '.stale-' + process.pid;
      try { renameSync(LOCK, gone); } catch { return; }
      rmSync(gone, { recursive: true, force: true });
      console.error('render lock: took over from ' + describe(h) + ', which is gone');
    }
  } finally { rmSync(TAKEOVER, { recursive: true, force: true }); }
}

export class LockedError extends Error {
  constructor(h, secs) {
    super('the render lock is busy: ' + describe(h) + ' still holds it after ' + Math.round(secs / 60 * 10) / 10 + ' min of waiting. ' +
      'Only one heavy renderer runs at a time on this Mac (Safari shots, Quick Look frames, the WebKit tool, the sweep). ' +
      'If a sweep holds it, read its cache when it is done (node tools/sweep.mjs --path); otherwise try again later. Nothing was rendered.');
    this.code = 'ELOCKED';
  }
}

/* Take the lock for `what` (wait at most LOCK_WAIT s, 300 by default); resolves to a release function. Throws
 * LockedError after the wait. Inside a holder's child (PC_RENDER_LOCK), or nested in this process, it does not wait. */
export async function acquire(what, { wait = waitSec(), quiet = false } = {}) {
  if (held > 0 || inherited()) { if (held > 0) held++; return held > 0 ? release : () => {}; }
  hook();
  const t0 = Date.now();
  let told = 0;
  for (;;) {
    if (tryTake(what)) { held = 1; process.env.PC_RENDER_LOCK = String(process.pid); return release; }
    const h = holder();
    if (isStale(h)) { takeOver(); continue; }
    const waited = (Date.now() - t0) / 1000;
    if (waited >= wait) throw new LockedError(h, waited);
    if (!quiet && (told === 0 || waited - told >= 60)) { console.error('render lock: held by ' + describe(h) + '; waiting (at most ' + Math.round(wait / 60 * 10) / 10 + ' min in all)'); told = Math.max(1, waited); }
    await sleep(500);
  }
}

/* Run fn holding the lock; a LockedError ends the process with its message and exit 75. */
export async function withLock(what, fn, opts) {
  let rel;
  try { rel = await acquire(what, opts); } catch (e) { if (e.code !== 'ELOCKED') throw e; console.error(e.message); process.exit(EXIT_LOCKED); }
  try { return await fn(); } finally { rel(); }
}
/* For a tool that holds the lock until it exits: take it, or say why not and exit 75. */
export async function holdOrExit(what, opts) {
  try { return await acquire(what, opts); } catch (e) { if (e.code !== 'ELOCKED') throw e; console.error(e.message); process.exit(EXIT_LOCKED); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const dash = argv.indexOf('--');
  if (dash < 0) {
    const h = holder();
    console.log(!h ? 'free' : (isStale(h) ? 'stale (taken over by the next renderer): ' : 'held by ') + describe(h));
  } else {
    const cmd = argv.slice(dash + 1);
    if (!cmd.length) { console.error('usage: node tools/lock.mjs -- COMMAND ARGS…'); process.exit(2); }
    await holdOrExit(cmd.join(' ').slice(0, 120));
    const child = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit', env: process.env });
    for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.removeAllListeners(sig), process.on(sig, () => { child.kill(sig); });
    child.on('exit', (code, sig) => { release(); process.exit(code == null ? (sig ? 128 : 1) : code); });
    child.on('error', (e) => { console.error(e.message); release(); process.exit(127); });
  }
}
