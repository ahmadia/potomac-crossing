#!/usr/bin/env node
/* Potomac Crossing: a contact sheet. Several PNGs (frames from tools/frames.mjs, screenshots from
 * tools/shots.mjs) laid out in a grid on one PNG, each labelled with its file name, so a reviewer
 * can look at six frames in one look instead of six. macOS only: Quick Look (qlmanage) rasterizes.
 *
 *   node tools/sheet.mjs OUT.png a.png b.png c.png …        two columns (six 16:10 frames a sheet)
 *   COLS=3 node tools/sheet.mjs OUT.png …                   three columns (twelve a sheet)
 *   node tools/sheet.mjs OUTDIR/sheet-%.png *.png           as many sheets as it takes (% = 1, 2, …)
 *
 * The sheet is at most 1600 x 1600: Quick Look draws a larger canvas blank. Every picture takes the
 * first one's proportions (frames are 16:10); a picture of another shape is fitted inside its cell.
 */
import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync, renameSync, rmSync, existsSync, mkdirSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const SIDE = 1600;

/* Where each of n pictures goes: cols across, cells in the first picture's proportions (aspect =
 * height / width), rows as needed. Returns null when they do not fit on one sheet. */
export function layout(n, cols, aspect) {
  cols = Math.max(1, Math.min(cols | 0 || 2, n));
  const cellW = Math.floor(SIDE / cols), cellH = Math.round(cellW * aspect);
  const rows = Math.ceil(n / cols), height = rows * cellH;
  if (n < 1 || height > SIDE) return null;
  const cells = [];
  for (let i = 0; i < n; i++) cells.push({ x: (i % cols) * cellW, y: Math.floor(i / cols) * cellH });
  return { cols, rows, cellW, cellH, width: cols * cellW, height, cells };
}
/* How many pictures one sheet holds at these columns and proportions. */
export function perSheet(cols, aspect) {
  const cellH = Math.round(Math.floor(SIDE / cols) * aspect);
  return Math.max(1, Math.floor(SIDE / cellH)) * cols;
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
/* The sheet as SVG: a square canvas (Quick Look thumbnails are square) with the grid centred on it,
 * so a centre crop to width x height gives the sheet. `pictures` is [{ name, data (base64 PNG) }]. */
export function sheetSvg(pictures, L) {
  const top = Math.round((SIDE - L.height) / 2), left = Math.round((SIDE - L.width) / 2);
  let s = '';
  pictures.forEach((p, i) => {
    const c = L.cells[i], x = left + c.x, y = top + c.y;
    s += '<image x="' + x + '" y="' + y + '" width="' + L.cellW + '" height="' + L.cellH + '" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,' + p.data + '"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + L.cellW + '" height="' + L.cellH + '" fill="none" stroke="#1b1622" stroke-width="2"/>' +
      '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="' + (esc(p.name).length * 11 + 14) + '" height="26" rx="6" fill="#1b1622" opacity=".82"/>' +
      '<text x="' + (x + 11) + '" y="' + (y + 23) + '" font-family="Menlo, monospace" font-size="18" fill="#ffe8a3">' + esc(p.name) + '</text>';
  });
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + SIDE + '" height="' + SIDE + '" viewBox="0 0 ' + SIDE + ' ' + SIDE + '">' +
    '<rect width="' + SIDE + '" height="' + SIDE + '" fill="#ffffff"/>' + s + '</svg>';
}

function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  return { w: +/pixelWidth: (\d+)/.exec(out)[1], h: +/pixelHeight: (\d+)/.exec(out)[1] };
}
function write(out, files, cols, aspect) {
  const L = layout(files.length, cols, aspect);
  if (!L) throw new Error(files.length + ' pictures do not fit on one sheet at ' + cols + ' columns');
  const svg = sheetSvg(files.map((f) => ({ name: basename(f).replace(/\.png$/i, ''), data: readFileSync(f).toString('base64') })), L);
  mkdirSync(dirname(out), { recursive: true });
  const tmp = out.replace(/\.png$/i, '') + '.sheet.svg';
  writeFileSync(tmp, svg);
  execFileSync('qlmanage', ['-t', '-s', String(SIDE), '-o', dirname(out), tmp], { stdio: 'ignore' });
  rmSync(tmp, { force: true });
  if (!existsSync(tmp + '.png')) throw new Error('Quick Look did not draw ' + out);
  renameSync(tmp + '.png', out);
  // the grid is centred on the square, and sips crops about the centre
  execFileSync('sips', ['-c', String(L.height), String(L.width), out], { stdio: 'ignore' });
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [outArg, ...files] = process.argv.slice(2);
  if (!outArg || !files.length) { console.error('usage: node tools/sheet.mjs OUT.png a.png b.png …   (OUT with % for several sheets)'); process.exit(1); }
  const cols = +process.env.COLS || 2;
  const first = size(files[0]), aspect = first.h / first.w, per = perSheet(cols, aspect);
  const out = resolve(outArg);
  if (files.length > per && !out.includes('%')) { console.error(files.length + ' pictures need ' + Math.ceil(files.length / per) + ' sheets: put a % in the output name (sheet-%.png), or raise COLS'); process.exit(1); }
  for (let i = 0, k = 1; i < files.length; i += per, k++) console.log(write(out.replace('%', String(k)), files.slice(i, i + per), cols, aspect));
}
