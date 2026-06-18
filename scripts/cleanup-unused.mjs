#!/usr/bin/env node
/**
 * Deletes images that are superseded (originals replaced by optimized .jpg/.png)
 * or entirely unused. SAFETY: before deleting, each file's exact name is searched
 * across src/ — if anything still references it, the file is SKIPPED, not deleted.
 *
 * Run:  npm run cleanup:unused
 */
import { readdirSync, readFileSync, existsSync, statSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');

const CANDIDATES = [
  // ── Superseded PNG originals (now served as optimized .jpg) ──
  'public/assets/mainPage/our-solutions-carousel/Gemini_Generated_Image_tnpy9stnpy9stnpy.png',
  'public/assets/mainPage/our-solutions-carousel/ai-ride-guide.png',
  'public/assets/mainPage/our-solutions-carousel/toronto-skyline.png',
  'public/assets/mainPage/main-pg-riders.png',
  'public/assets/Partners/partners-carousel-developer.png',
  'public/assets/Partners/cities-brampton.png',
  'public/assets/Partners/cities-barrie.png',
  'public/assets/Partners/cities-burlington.png',
  'public/assets/Cities/Brampton/brampton-hero.png',
  'public/assets/Cities/Brampton/brampton-bbq.png',
  'public/assets/Cities/Brampton/brampton-mascot.png',
  'public/assets/Cities/Barrie/barrie-hero.png',
  'public/assets/Cities/Barrie/barrie-mayor.png',
  'public/assets/Cities/Markham/markham-hero.png',
  'public/assets/Cities/Markham/markham-mayorspeech.png',
  'public/assets/Cities/Burlington/burlington-hero.png',
  'public/assets/Cities/Burlington/burlington-rider.png',
  'public/assets/Cities/Burlington/burlington-scooters.png',
  'public/assets/Riders/riders-page-hero.png',
  'public/assets/Riders/Carousel/riders-carousel-ride.png',
  'public/assets/Riders/Carousel/riders-carousel-parking.png',
  'public/assets/Riders/Carousel/riders-carousel-safety.png',
  'public/assets/Riders/Carousel/riders-carousel-vehicles.png',
  'public/assets/Riders/Carousel/riders-carousel-map.png',
  // ── Superseded .webp logo (now a .png) ──
  'public/assets/Partners/Marquee/otu-logo.webp',
  // ── Entirely unused assets ──
  'public/assets/Partners/DSC02478.JPG',
  'public/assets/mainPage/built-for-riders-hero.png',
  'public/assets/mainPage/non-profit.png',
  'public/assets/Partners/cities-markham.jpg',
  'public/assets/mainPage/partners-carousel/toronto-skyline.png',
  'public/assets/mainPage/our-solutions-hero.png',
  'public/assets/Vertical Logo.png',
  'public/assets/mainPage/our-solutions-carousel/on-demand-mobility.png',
  'public/assets/mainPage/main-pg-transit.jpeg',
];

// Build one big blob of all source text so we can check for stray references.
const walk = (dir) => {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|jsx?|html|css)$/.test(e.name)) out.push(p);
  }
  return out;
};
const blob = [...walk(SRC), join(ROOT, 'index.html')]
  .filter(existsSync)
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

let freed = 0;
let deleted = 0;
const skipped = [];
const missing = [];

for (const rel of CANDIDATES) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) { missing.push(rel); continue; }
  // Safety: if the exact filename is referenced anywhere, do NOT delete it.
  if (blob.includes(basename(rel))) {
    skipped.push(rel);
    continue;
  }
  freed += statSync(abs).size;
  rmSync(abs);
  deleted++;
  console.log('deleted: ' + rel);
}

console.log(`\nDeleted ${deleted} file(s), freed ${(freed / 1024 / 1024).toFixed(1)} MB.`);
if (missing.length) console.log(`Already gone: ${missing.length}`);
if (skipped.length) {
  console.log(`\n⚠️  SKIPPED (still referenced — left untouched):`);
  for (const s of skipped) console.log('  ' + s);
}
