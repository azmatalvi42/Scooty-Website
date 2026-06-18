#!/usr/bin/env node
/**
 * SCOOTY image optimizer
 * -----------------------
 * Uses the native macOS `sips` tool (no npm dependency) to resize + recompress
 * every image in `public/` to the targets defined in `images.md`.
 *
 *   - Photos        -> JPEG q80, capped to a sensible max dimension.
 *                      PNG photos are converted to `.jpg` (smaller name printed
 *                      in the report so code references can be updated).
 *   - Logos/flat    -> resized in place, format preserved (keeps transparency).
 *   - Icons         -> resized in place.
 *   - Also (re)generates favicon-32.png, apple-touch-icon.png and a stopgap
 *     og-image.jpg for social sharing.
 *
 * Run:  npm run optimize:images
 *
 * The script never deletes originals. After it runs it prints:
 *   1. a before/after size report
 *   2. the list of PNG->JPG renames you need to reflect in code
 *   3. the list of now-superseded original files that are safe to delete
 */
import { execFileSync } from 'node:child_process';
import { statSync, existsSync, renameSync, mkdtempSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUB = join(ROOT, 'public');
const TMP = mkdtempSync(join(tmpdir(), 'scooty-imgopt-'));
const JPEG_Q = 80;

/* ---------------------------------------------------------------- manifest */

// PNG photos -> converted to .jpg (reference in code must change to .jpg).
// [relativePathFromPublic, maxLongestSidePx]
const PNG_PHOTOS = [
  ['assets/mainPage/our-solutions-carousel/Gemini_Generated_Image_tnpy9stnpy9stnpy.png', 1200],
  ['assets/mainPage/our-solutions-carousel/ai-ride-guide.png', 1200],
  ['assets/mainPage/our-solutions-carousel/toronto-skyline.png', 1600],
  ['assets/mainPage/main-pg-riders.png', 1000],
  ['assets/Partners/partners-carousel-developer.png', 1350],
  ['assets/Partners/cities-brampton.png', 1200],
  ['assets/Partners/cities-barrie.png', 1200],
  ['assets/Partners/cities-burlington.png', 1200],
  ['assets/Cities/Brampton/brampton-hero.png', 2400],
  ['assets/Cities/Brampton/brampton-bbq.png', 1400],
  ['assets/Cities/Brampton/brampton-mascot.png', 1400],
  ['assets/Cities/Barrie/barrie-hero.png', 2400],
  ['assets/Cities/Barrie/barrie-mayor.png', 1400],
  ['assets/Cities/Markham/markham-hero.png', 2400],
  ['assets/Cities/Markham/markham-mayorspeech.png', 1400],
  ['assets/Cities/Burlington/burlington-hero.png', 2400],
  ['assets/Cities/Burlington/burlington-rider.png', 1400],
  ['assets/Cities/Burlington/burlington-scooters.png', 1400],
  ['assets/Riders/riders-page-hero.png', 2400],
  ['assets/Riders/Carousel/riders-carousel-ride.png', 1600],
  ['assets/Riders/Carousel/riders-carousel-parking.png', 1600],
  ['assets/Riders/Carousel/riders-carousel-safety.png', 1600],
  ['assets/Riders/Carousel/riders-carousel-vehicles.png', 1600],
  ['assets/Riders/Carousel/riders-carousel-map.png', 1600],
];

// JPEG/JPG photos -> recompressed + resized IN PLACE (name + reference unchanged).
const JPG_PHOTOS = [
  ['assets/mainPage/QuotesImages/DSC_4516.jpg', 1200],
  ['assets/mainPage/QuotesImages/DSC_4553 (1).jpg', 1200],
  ['assets/mainPage/QuotesImages/DSC_1837.jpg', 1200],
  ['assets/mainPage/QuotesImages/2024MarkhamOVINScootyDemo-048.jpg', 1200],
  ['assets/mainPage/QuotesImages/City Hall Group Shot - Brampton Launch Photo (2).JPG', 1200],
  ['assets/Partners/partner-img.jpg', 2400],
  ['assets/Partners/brampton-partnership.JPG', 1350],
  ['assets/Partners/partners-carousel-business.jpg', 1350],
  ['assets/Partners/cities-markham-2.jpg', 1200],
  ['assets/Cities/Brampton/brampton-cityhall.JPG', 1400],
  ['assets/Cities/Markham/markham-mayor.jpg', 1400],
  ['assets/Cities/Markham/markham-helmet.jpg', 1400],
];

// Logos / flat graphics / icons -> resized in place, format preserved.
const KEEP_RESIZE = [
  ['assets/scooty-logo-tm.png', 160],
  ['assets/About/maple-leafs.png', 800],
  ['assets/About/canada-mask.png', 800],
  ['icons/appstore-icon.png', 220],
  ['icons/playstore-icon.png', 220],
  ['assets/Partners/Marquee/markham-logo.jpg', 220],
  ['assets/Partners/Marquee/metrolinx-logo.jpg', 220],
  ['assets/Partners/Marquee/barrie-logo.jpg', 220],
  ['assets/Partners/Marquee/tmu-logo.jpg', 220],
  ['assets/Partners/Marquee/burlington-logo.png', 220],
];

// .webp logo sips cannot re-encode -> convert to PNG (reference must change).
const WEBP_TO_PNG = [
  ['assets/Partners/Marquee/otu-logo.webp', 220],
];

/* ----------------------------------------------------------------- helpers */

const sips = (args) => execFileSync('sips', args.map(String), { stdio: 'pipe' });

// Largest pixel dimension of an image — used so we never UPSCALE (sips -Z
// otherwise enlarges smaller sources, which bloats the file and blurs it).
const longestSide = (abs) => {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', abs], { encoding: 'utf8' });
  const w = Number(out.match(/pixelWidth:\s*(\d+)/)?.[1] || 0);
  const h = Number(out.match(/pixelHeight:\s*(\d+)/)?.[1] || 0);
  return Math.max(w, h);
};

// Cap the requested max dimension at the source's real size (no upscaling).
const cap = (abs, max) => Math.min(max, longestSide(abs) || max);

const human = (bytes) => {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + 'M';
  if (bytes >= 1024) return Math.round(bytes / 1024) + 'K';
  return bytes + 'B';
};

const sizeOf = (p) => (existsSync(p) ? statSync(p).size : 0);

const report = [];
const renames = []; // { from, to } relative-to-public paths whose ext changed
const toDelete = []; // absolute paths of superseded originals safe to delete
let totalBefore = 0;
let totalAfter = 0;

const toJpg = (rel, max, { inPlace }) => {
  const srcAbs = join(PUB, rel);
  if (!existsSync(srcAbs)) {
    report.push([rel, '—', 'MISSING', '']);
    return;
  }
  const before = sizeOf(srcAbs);
  const outRel = rel.replace(/\.[^.]+$/, '.jpg');
  const outAbs = join(PUB, outRel);
  const tmp = join(TMP, basename(outRel) + '.' + Math.random().toString(36).slice(2));
  sips(['-Z', cap(srcAbs, max), '-s', 'format', 'jpeg', '-s', 'formatOptions', JPEG_Q, srcAbs, '--out', tmp]);
  renameSync(tmp, outAbs);
  const after = sizeOf(outAbs);
  totalBefore += before;
  totalAfter += after;
  report.push([rel, human(before), human(after), inPlace ? '' : '-> ' + basename(outRel)]);
  if (!inPlace && srcAbs.toLowerCase() !== outAbs.toLowerCase()) {
    renames.push({ from: '/' + rel, to: '/' + outRel });
    toDelete.push(srcAbs);
  }
};

const resizeKeep = (rel, max) => {
  const abs = join(PUB, rel);
  if (!existsSync(abs)) {
    report.push([rel, '—', 'MISSING', '']);
    return;
  }
  const before = sizeOf(abs);
  const ext = extname(rel).slice(1).toLowerCase();
  const fmt = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext;
  const tmp = join(TMP, basename(rel) + '.' + Math.random().toString(36).slice(2));
  const args = ['-Z', cap(abs, max)];
  if (fmt === 'jpeg') args.push('-s', 'format', 'jpeg', '-s', 'formatOptions', JPEG_Q);
  args.push(abs, '--out', tmp);
  sips(args);
  renameSync(tmp, abs);
  const after = sizeOf(abs);
  totalBefore += before;
  totalAfter += after;
  report.push([rel, human(before), human(after), '']);
};

const webpToPng = (rel, max) => {
  const srcAbs = join(PUB, rel);
  if (!existsSync(srcAbs)) {
    report.push([rel, '—', 'MISSING', '']);
    return;
  }
  const before = sizeOf(srcAbs);
  const outRel = rel.replace(/\.[^.]+$/, '.png');
  const outAbs = join(PUB, outRel);
  const tmp = join(TMP, basename(outRel) + '.' + Math.random().toString(36).slice(2));
  try {
    sips(['-Z', cap(srcAbs, max), '-s', 'format', 'png', srcAbs, '--out', tmp]);
  } catch {
    report.push([rel, human(before), 'SKIP (sips cannot read webp)', '']);
    return;
  }
  renameSync(tmp, outAbs);
  const after = sizeOf(outAbs);
  totalBefore += before;
  totalAfter += after;
  report.push([rel, human(before), human(after), '-> ' + basename(outRel)]);
  renames.push({ from: '/' + rel, to: '/' + outRel });
  toDelete.push(srcAbs);
};

/* ------------------------------------------------------- meta image assets */

const generateMetaAssets = () => {
  const logo = join(PUB, 'assets/scooty-logo-tm.png');
  if (existsSync(logo)) {
    sips(['-Z', 32, '-s', 'format', 'png', logo, '--out', join(PUB, 'favicon-32.png')]);
    sips(['-Z', 180, '-s', 'format', 'png', logo, '--out', join(PUB, 'apple-touch-icon.png')]);
    report.push(['favicon-32.png + apple-touch-icon.png', '—', 'generated from logo', '']);
  }
  // Stopgap social card from a hero (replace with a branded 1200x630 later).
  const heroJpg = join(PUB, 'assets/Riders/riders-page-hero.jpg');
  const heroPng = join(PUB, 'assets/Riders/riders-page-hero.png');
  const heroSrc = existsSync(heroJpg) ? heroJpg : existsSync(heroPng) ? heroPng : null;
  if (heroSrc) {
    sips(['-Z', 1200, '-s', 'format', 'jpeg', '-s', 'formatOptions', 82, heroSrc, '--out', join(PUB, 'assets/og-image.jpg')]);
    report.push(['assets/og-image.jpg', '—', 'generated (stopgap)', '']);
  }
};

/* ---------------------------------------------------------------- run */

console.log('Optimizing images with sips...\n');

for (const [rel, max] of PNG_PHOTOS) toJpg(rel, max, { inPlace: false });
for (const [rel, max] of JPG_PHOTOS) toJpg(rel, max, { inPlace: true });
for (const [rel, max] of KEEP_RESIZE) resizeKeep(rel, max);
for (const [rel, max] of WEBP_TO_PNG) webpToPng(rel, max);
generateMetaAssets();

/* ---------------------------------------------------------------- report */

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('file', 64) + pad('before', 9) + pad('after', 9) + 'note');
console.log('-'.repeat(96));
for (const [file, b, a, note] of report) {
  console.log(pad(file.length > 62 ? '…' + file.slice(-61) : file, 64) + pad(b, 9) + pad(a, 9) + note);
}
console.log('-'.repeat(96));
console.log(`TOTAL  ${human(totalBefore)}  ->  ${human(totalAfter)}  (saved ${human(totalBefore - totalAfter)})\n`);

if (renames.length) {
  console.log('CODE REFERENCE CHANGES NEEDED (old -> new):');
  for (const { from, to } of renames) console.log(`  ${from}  ->  ${to}`);
  console.log('');
}
if (toDelete.length) {
  console.log('SUPERSEDED ORIGINALS SAFE TO DELETE:');
  for (const p of toDelete) console.log('  ' + p.replace(ROOT, ''));
  console.log('');
}
