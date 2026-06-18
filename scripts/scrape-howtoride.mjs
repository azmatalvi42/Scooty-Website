import { chromium } from 'playwright';

const URL = process.argv[2] || 'https://www.ridescooty.com/pages/how-to-ride';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  viewport: { width: 1440, height: 2200 },
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => console.log('goto:', e.message));
// trigger lazy loading
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
}).catch(() => {});
await page.waitForTimeout(4000);

const data = await page.evaluate(() => {
  const norm = (s) => (s || '').split('?')[0];
  const imgs = [...document.querySelectorAll('img')]
    .map((el) => ({
      src: el.currentSrc || el.src || el.getAttribute('data-src') || el.getAttribute('data-srcset') || '',
      alt: el.alt || '',
      w: el.naturalWidth,
      h: el.naturalHeight,
    }))
    .filter((i) => i.src && !/^data:/.test(i.src))
    .filter((i) => !/logo|sprite|payment|paypal|visa|mastercard|amex|cart|icon-/i.test(i.src));
  const seen = new Set();
  const uniqImgs = imgs.filter((i) => {
    const k = norm(i.src);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((e) => e.textContent.trim()).filter(Boolean);
  const text = [...document.querySelectorAll('li,p')]
    .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 6 && t.length < 260);
  const media = [...document.querySelectorAll('video source, video, iframe')].map((e) => e.src || e.getAttribute('src') || '');
  return { url: location.href, imgCount: uniqImgs.length, imgs: uniqImgs, headings, text: [...new Set(text)], media: [...new Set(media)] };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
