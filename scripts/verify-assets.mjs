#!/usr/bin/env node
/**
 * Verifies that every local image path referenced in `src/` exists in `public/`.
 * Catches broken references (which would be silent 404s at runtime).
 *
 * Run:  npm run check:images
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const PUB = join(ROOT, 'public');

const walk = (dir) => {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p);
  }
  return out;
};

// Match quote/backtick-delimited paths so spaces & parens in filenames are kept.
const RE = /["'`](\/(?:assets|icons)\/[^"'`]+?\.(?:png|jpe?g|webp|gif|svg))["'`]/gi;

const refs = new Map(); // ref -> Set(files)
for (const file of walk(SRC)) {
  const txt = readFileSync(file, 'utf8');
  let m;
  while ((m = RE.exec(txt))) {
    const ref = m[1];
    if (!refs.has(ref)) refs.set(ref, new Set());
    refs.get(ref).add(file.replace(ROOT, ''));
  }
}

const missing = [];
for (const [ref, files] of [...refs].sort()) {
  const abs = join(PUB, ref);
  if (!existsSync(abs)) missing.push([ref, [...files]]);
}

console.log(`Checked ${refs.size} unique local image references in src/.\n`);
if (missing.length === 0) {
  console.log('✅ All referenced images exist in public/.');
} else {
  console.log(`❌ ${missing.length} MISSING reference(s):\n`);
  for (const [ref, files] of missing) {
    console.log(`  ${ref}`);
    for (const f of files) console.log(`      used in ${f}`);
  }
  process.exitCode = 1;
}

// Also flag any referenced image still over 1 MB (likely needs optimizing).
const heavy = [];
for (const ref of refs.keys()) {
  const abs = join(PUB, ref);
  if (existsSync(abs) && statSync(abs).size > 1024 * 1024) {
    heavy.push([ref, (statSync(abs).size / 1024 / 1024).toFixed(1) + 'M']);
  }
}
if (heavy.length) {
  console.log(`\n⚠️  ${heavy.length} referenced image(s) still > 1 MB:`);
  for (const [ref, size] of heavy.sort()) console.log(`  ${size}\t${ref}`);
}
