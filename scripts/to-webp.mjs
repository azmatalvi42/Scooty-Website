#!/usr/bin/env node
/**
 * SCOOTY WebP converter
 * ---------------------
 * Generates a `.webp` next to every raster photo in `public/` using `sharp`.
 * Originals are kept untouched (they remain as a fallback / source of truth).
 *
 *   - Re-encodes to WebP q80 and caps width at 2000px (never upscales).
 *   - Respects EXIF orientation (phone photos).
 *   - Skips favicon / apple-touch / og-image / store badges (kept as-is).
 *
 * Writes `scripts/webp-manifest.json` ( [{ from, to }] public-root paths )
 * which `scripts/refs-to-webp.mjs` uses to update code references.
 *
 * Run:  node scripts/to-webp.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUB = join(ROOT, 'public');
const MAX_W = 2000;
const Q = 80;

// Individual files (public-root path) to leave alone.
const SKIP_FILES = new Set(['/favicon-32.png', '/apple-touch-icon.png', '/assets/og-image.jpg']);
// Directories (public-root prefix) to leave alone — official store badges, etc.
const SKIP_DIRS = ['/icons'];

const EXTS = new Set(['.jpg', '.jpeg', '.png']);

const walk = (dir, acc = []) => {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs, acc);
    else acc.push(abs);
  }
  return acc;
};

const toPosix = (p) => p.split(sep).join('/');
const human = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + 'M' : Math.round(b / 1024) + 'K');

const manifest = [];
const report = [];
let totalBefore = 0;
let totalAfter = 0;

const run = async () => {
  for (const abs of walk(PUB)) {
    const ext = extname(abs).toLowerCase();
    if (!EXTS.has(ext)) continue;

    const rel = '/' + toPosix(relative(PUB, abs));
    if (SKIP_FILES.has(rel)) continue;
    if (SKIP_DIRS.some((d) => rel.startsWith(d + '/'))) continue;

    const outAbs = abs.replace(/\.[^.]+$/, '.webp');
    const outRel = rel.replace(/\.[^.]+$/, '.webp');

    const before = statSync(abs).size;
    await sharp(abs)
      .rotate()
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: Q })
      .toFile(outAbs);
    const after = statSync(outAbs).size;

    totalBefore += before;
    totalAfter += after;
    manifest.push({ from: rel, to: outRel });
    report.push({ rel, before, after, saved: before - after });
  }

  report.sort((a, b) => b.saved - a.saved);
  const pad = (s, n) => String(s).padEnd(n);
  console.log(pad('file', 56) + pad('before', 9) + pad('after', 9) + 'saved');
  console.log('-'.repeat(82));
  for (const { rel, before, after, saved } of report) {
    const f = rel.length > 54 ? '…' + rel.slice(-53) : rel;
    console.log(pad(f, 56) + pad(human(before), 9) + pad(human(after), 9) + human(saved));
  }
  console.log('-'.repeat(82));
  console.log(
    `TOTAL  ${human(totalBefore)} -> ${human(totalAfter)}  (saved ${human(totalBefore - totalAfter)}, ` +
      `${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller across ${report.length} images)\n`
  );

  writeFileSync(join(ROOT, 'scripts/webp-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Wrote scripts/webp-manifest.json (${manifest.length} entries).`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
