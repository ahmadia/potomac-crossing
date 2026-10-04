#!/usr/bin/env node
/* Potomac Crossing: render a chapter's frames (the drawn scene only, no lettering) to PNG, for
 * checking the art without a browser. macOS only: it uses Quick Look (qlmanage) to rasterize.
 *
 *   node tools/frames.mjs ch02 OUTDIR                  every frame of chapter 2
 *   node tools/frames.mjs ch02 OUTDIR f010 f020 f031a  just these frames
 *   node tools/frames.mjs --scene '{"set":"bridge","cam":"wide","fx":["day"]}' OUTDIR
 *
 * Each PNG is named after its frame (f010.png). The player's look is a fixed calico tom unless
 * LOOK='{"fur":"ginger",...}' is set. Captions, balloons and the UI are not drawn: this is the art.
 *
 * Quick Look is not Safari. Its SVG renderer drops, without a word, any group with an SVG filter
 * (the papercut shadows: feGaussianBlur, feOffset, feMerge) whose filter region comes to more than
 * about 4,000 device pixels across: the group and everything in it vanish, and what is behind shows
 * through. A zoomed camera multiplies the region: the hollow's `tree` close-up (a 400-wide camera,
 * four times zoom) put the tree-and-canopy group's shadow at about 5,200 pixels, so the trunk, the
 * claw marks and the canopy all went and the panel came out solid green (ch02 f024, ch01 f063),
 * while Safari drew it fine. Two things keep it right: this tool hands Quick Look the panel at 100%
 * by 100% (Quick Look then rasterizes smaller), and the hollow leaves the canopy, which is far above
 * that camera, out of the tree close-up, so its shadowed group stays under the limit at any size
 * (scenes.js, drawHollow; the same picture in Safari). A new set that zooms close on a big shadowed
 * group can hit it again: if a frame here is missing a whole layer, check it in Safari
 * (tools/shots.mjs) before fixing the art.
 */
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import { mkdirSync, writeFileSync, renameSync, existsSync, rmSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { load } = require(join(ROOT, 'tests/_load.js'));
const PC = load();

const argv = process.argv.slice(2);
const look = process.env.LOOK ? JSON.parse(process.env.LOOK) : { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };

function png(svg, out) {
  // Quick Look thumbnails are square: the 16:10 panel, fitted ("meet") into the square, sits in its
  // middle, and sips crops the PNG back to 1600 x 1000. The panel SVG goes to Quick Look as it is,
  // sized 100% by 100%: given a fixed size, or nested in a canvas of our own, Quick Look renders it
  // bigger and drops any shadowed group past its filter limit (see the top of this file)
  const s = svg.replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"');
  const tmp = out.replace(/\.png$/, '.svg');
  writeFileSync(tmp, s);
  execFileSync('qlmanage', ['-t', '-s', '1600', '-o', dirname(out), tmp], { stdio: 'ignore' });
  if (existsSync(tmp + '.png')) {
    renameSync(tmp + '.png', out);
    execFileSync('sips', ['-c', '1000', '1600', out], { stdio: 'ignore' });
  }
  rmSync(tmp, { force: true });
  return existsSync(out);
}

if (argv[0] === '--scene') {
  const scene = JSON.parse(argv[1]);
  const outDir = resolve(argv[2] || '.');
  mkdirSync(outDir, { recursive: true });
  const name = argv[3] || [scene.set, scene.cam].join('-');
  const r = PC.art.render(scene, { look });
  console.log(png(r.svg, join(outDir, name + '.png')) ? join(outDir, name + '.png') : 'failed');
} else {
  const id = argv[0], outDir = resolve(argv[1] || '.'), only = argv.slice(2);
  const story = PC.story && PC.story[id];
  if (!story) { console.error('no story ' + id); process.exit(1); }
  mkdirSync(outDir, { recursive: true });
  const ids = only.length ? only : Object.keys(story.frames);
  let ok = 0;
  ids.forEach((fid) => {
    const f = story.frames[fid];
    if (!f || !f.scene) { console.error('no frame/scene ' + fid); return; }
    const r = PC.art.render(f.scene, { look });
    if (png(r.svg, join(outDir, fid + '.png'))) ok++;
    else console.error('render failed ' + fid);
  });
  console.log(ok + ' frames rendered to ' + outDir);
}
