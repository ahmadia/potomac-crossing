#!/usr/bin/env node
/* Potomac Crossing: build the offscreen WebKit tool (dev/webkit/snap.swift) into ~/potomac-crossing-work/tools/webkit/snap,
 * only when the source is newer than the binary or differs from what it was built from (snap.sha256 beside it). swiftc
 * (Xcode's command line tools), no other dependency. dev/webkit/run.mjs and tools/sweep.mjs call it before every run,
 * so nobody needs to build by hand; nobody builds a copy of their own either.
 *
 *   node dev/webkit/build.mjs            build if stale; print the binary's path
 *   node dev/webkit/build.mjs --check    exit 1 if a build is needed (builds nothing)
 *   PC_WEBKIT_DIR=dir                    build somewhere else (tests)
 */
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync, rmSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SOURCE = join(HERE, 'snap.swift');
export const BIN_DIR = process.env.PC_WEBKIT_DIR || join(homedir(), 'potomac-crossing-work/tools/webkit');
export const BIN = join(BIN_DIR, 'snap');
const SUM = join(BIN_DIR, 'snap.sha256');

const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');

/* Why the binary needs building, or null when it is current. */
export function stale() {
  if (!existsSync(BIN)) return 'no binary';
  if (statSync(SOURCE).mtimeMs > statSync(BIN).mtimeMs) return 'the source is newer';
  if (!existsSync(SUM) || readFileSync(SUM, 'utf8').trim() !== sha(SOURCE)) return 'built from another source';
  return null;
}

/* Build if stale (into a temporary name, then renamed: a run that starts meanwhile never sees half a binary). */
export function ensureBuilt({ quiet = false } = {}) {
  const why = stale();
  if (!why) return BIN;
  mkdirSync(BIN_DIR, { recursive: true });
  const tmp = BIN + '.build-' + process.pid;
  if (!quiet) console.error('webkit: building ' + BIN + ' (' + why + ')');
  try {
    execFileSync('swiftc', ['-O', '-o', tmp, SOURCE], { stdio: ['ignore', 'ignore', 'inherit'] });
    renameSync(tmp, BIN);
    writeFileSync(SUM, sha(SOURCE) + '\n');
  } finally { rmSync(tmp, { force: true }); }
  return BIN;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--check')) { const why = stale(); console.log(why ? 'stale: ' + why : 'current: ' + BIN); process.exit(why ? 1 : 0); }
  console.log(ensureBuilt());
}
