import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:5174';
const OUT = 'playwright-audit';
mkdirSync(OUT, { recursive: true });

const routes = [
  '/',
  '/riders',
  '/partners',
  '/technology',
  '/blog',
  '/about',
  '/partners/brampton',
  '/partners/markham',
  '/partners/barrie',
  '/partners/burlington',
  '/partners/metrolinx',
  '/riders/getting-started',
  '/riders/where-to-ride',
  '/riders/parking',
  '/riders/safety',
  '/riders/vehicles',
];

const ASSET_RE = /\.(png|jpe?g|webp|gif|svg|mp4|webm|mov|avif)(\?|$)/i;

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight + 1000) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 120);
    });
  });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

let totalBroken = 0;
let totalFailed = 0;

for (const route of routes) {
  const page = await ctx.newPage();
  const failed = [];
  page.on('response', (r) => {
    const url = r.url();
    if (r.status() >= 400 && ASSET_RE.test(url)) failed.push(`HTTP ${r.status()}  ${url}`);
  });
  page.on('requestfailed', (r) => {
    const url = r.url();
    if (ASSET_RE.test(url)) failed.push(`NETFAIL ${r.failure()?.errorText || ''}  ${url}`);
  });

  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
  } catch (e) {
    console.log(`\n=== ${route} ===\n  navigation issue: ${e.message}`);
  }
  await autoScroll(page);
  await page.waitForTimeout(1500);

  const imgs = await page.$$eval('img', (els) =>
    els.map((el) => {
      const cs = getComputedStyle(el);
      return {
        src: el.currentSrc || el.src,
        nw: el.naturalWidth,
        nh: el.naturalHeight,
        dw: Math.round(el.getBoundingClientRect().width),
        dh: Math.round(el.getBoundingClientRect().height),
        complete: el.complete,
        objectFit: cs.objectFit,
        alt: el.alt,
      };
    })
  );

  const broken = imgs.filter((i) => i.complete && i.nw === 0 && i.src && !i.src.startsWith('data:'));
  // Distortion: visible img, object-fit fill (default) whose displayed AR deviates > 12% from natural AR
  const distorted = imgs.filter((i) => {
    if (i.nw === 0 || i.nh === 0 || i.dw === 0 || i.dh === 0) return false;
    if (i.objectFit !== 'fill') return false;
    const natAR = i.nw / i.nh;
    const dispAR = i.dw / i.dh;
    return Math.abs(dispAR - natAR) / natAR > 0.12;
  });

  console.log(`\n=== ${route} ===`);
  console.log(`  images: ${imgs.length} | broken: ${broken.length} | distorted(fill): ${distorted.length} | failed requests: ${failed.length}`);
  for (const b of broken) console.log(`  BROKEN  natural=0x0  ${b.src}  (alt="${b.alt}")`);
  for (const d of distorted)
    console.log(`  DISTORT natural=${d.nw}x${d.nh} shown=${d.dw}x${d.dh} fit=${d.objectFit}  ${d.src}`);
  for (const f of failed) console.log(`  ${f}`);

  totalBroken += broken.length;
  totalFailed += failed.length;

  const name = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await page.close();
}

await browser.close();

console.log(`\n──────────── SUMMARY ────────────`);
console.log(`broken images: ${totalBroken}`);
console.log(`failed asset requests: ${totalFailed}`);
console.log(`full-page screenshots saved to ./${OUT}/`);
process.exit(totalBroken > 0 ? 1 : 0);
