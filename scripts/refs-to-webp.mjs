#!/usr/bin/env node
/**
 * Rewrites image references in `src/` to the `.webp` versions produced by
 * `scripts/to-webp.mjs` (using `scripts/webp-manifest.json`).
 *
 *   - Exact path swaps for every converted asset (handles spaces / parens / case).
 *   - One dynamic template literal (`how-to-ride-${n}.jpg`) handled explicitly.
 *
 * Idempotent: re-running after a conversion is a no-op (refs are already .webp).
 *
 * Run:  node scripts/refs-to-webp.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts/webp-manifest.json'), 'utf8'));

// Replacement pairs: exact manifest swaps + the dynamic how-to-ride template.
const pairs = manifest.map(({ from, to }) => [from, to]);
pairs.push(['how-to-ride-${n}.jpg', 'how-to-ride-${n}.webp']);

const EXTS = new Set(['.ts', '.tsx', '.css']);
const walk = (dir, acc = []) => {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs, acc);
    else if (EXTS.has(extname(abs))) acc.push(abs);
  }
  return acc;
};

let filesChanged = 0;
let totalReplacements = 0;
const changedFiles = [];

for (const abs of walk(SRC)) {
  let content = readFileSync(abs, 'utf8');
  let fileCount = 0;
  for (const [from, to] of pairs) {
    if (content.includes(from)) {
      const count = content.split(from).length - 1;
      content = content.split(from).join(to);
      fileCount += count;
    }
  }
  if (fileCount > 0) {
    writeFileSync(abs, content);
    filesChanged++;
    totalReplacements += fileCount;
    changedFiles.push([fileCount, abs.replace(ROOT, '')]);
  }
}

console.log(`Updated ${totalReplacements} references across ${filesChanged} files:\n`);
for (const [c, f] of changedFiles.sort((a, b) => b[0] - a[0])) {
  console.log(`  ${String(c).padStart(3)}  ${f}`);
}
