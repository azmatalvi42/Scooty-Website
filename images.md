# Image Dimension & Optimization Guide

A per-image guide to the optimal export dimensions, format, and file-size targets for every image on the Scooty website, for the best experience across all devices.

## Methodology

- **Target = 2× the largest size the image is ever displayed at** — covers Retina / HiDPI phones, tablets, and laptops. One well-chosen export then works on every device.
- **Match the aspect ratio of the box** it sits in. Almost everything uses `object-cover`, which crops, so the ratio matters as much as the pixel count.
- **Format:** photos → **WebP** (or JPEG) at ~80% quality, never PNG. Use PNG only for logos / flat graphics that need transparency.
- Several files are reused on multiple pages at different sizes — each is sized for its **largest** use.

---

## ⚠️ The headline: the problem is weight, not resolution

Almost every image is **3–80× heavier than it needs to be** because photos are saved as giant PNGs. What's actually happening:

| File | Now | Displayed at | The mismatch |
|---|---|---|---|
| `ai-ride-guide.png` | 2816×1536, **8.5 MB** | ~640px wide | 13× too wide, PNG photo |
| `partners-carousel-developer.png` | 2744×1568, **8.2 MB** | ~420px wide | PNG photo |
| `riders-carousel-map.png` | 1696×2460, **8.0 MB** | ≤1440px (blog hero) | PNG photo |
| `Gemini_…png` | 2412×1760, **7.6 MB** | ~640px wide | PNG photo |
| `DSC_1837.jpg` | 7780×5187, **4.4 MB** | ≤1200px | 6× too wide |
| `riders-page-hero.png` | 1920×1080, **3.9 MB** | full-bleed hero | PNG of a photo |

Converting photos to WebP at the right size cuts these by **~90–97%** with no visible quality loss. That is the single biggest win for load speed on mobile.

---

## Home `/`

Hero is a `<video>` (no image). Many project / case-study images are remote Pexels URLs (not your files — see note at the bottom). Your local files:

| File | Role | Displayed (max) | Export at | Format · weight |
|---|---|---|---|---|
| `our-solutions-carousel/Gemini_…png` | Solutions carousel slide | ~640×460 | **1200×900** | WebP · <150 KB |
| `our-solutions-carousel/ai-ride-guide.png` | Solutions carousel slide | ~640×460 | **1200×900** | WebP · <150 KB |
| `main-pg-riders.png` | Riders card photo | 448×420 | **1000×900** | WebP · <120 KB |
| `QuotesImages/DSC_4516.jpg` | Quote scroller + modal | up to 640×1070 (portrait) / 672×288 (modal) | **1200×1200** | WebP · <180 KB |
| `QuotesImages/DSC_4553 (1).jpg` | ″ | ″ | **1200×1200** | WebP · <180 KB |
| `QuotesImages/DSC_1837.jpg` | ″ (also About) | ″ | **1200×1200** | WebP · <180 KB |
| `QuotesImages/City Hall…(2).JPG` | ″ (also About) | ″ | **1200×1200** | WebP · <180 KB |
| `QuotesImages/2024Markham…048.jpg` | ″ (also About) | ″ | **1200×1200** | WebP · <180 KB |

> Quote photos are reused in 3 different crop shapes (tall card, wide modal, square tab), so **square 1200×1200** is the safe choice — keep the subject centered.

---

## Partners `/partners`

| File | Role | Displayed (max) | Export at | Format · weight |
|---|---|---|---|---|
| `partner-img.jpg` | Full-bleed hero | ~1440×600 | **2400×1350** (16:9) | WebP · <350 KB |
| `brampton-partnership.JPG` | Solutions carousel (also About tab) | 420×550 | **1080×1350** (4:5) | WebP · <150 KB |
| `partners-carousel-business.jpg` | Solutions carousel | 420×550 | **1080×1350** (4:5) | WebP · <150 KB |
| `partners-carousel-developer.png` | Solutions carousel | 420×550 | **1080×1350** (4:5) | WebP · <150 KB |
| `cities-brampton.png` | City card (2:1) | ~614×288 | **1200×600** | WebP · <120 KB |
| `cities-barrie.png` | City card | ~614×288 | **1200×600** | WebP · <120 KB |
| `cities-markham-2.jpg` | City card | ~614×288 | **1200×600** | WebP · <120 KB |
| `cities-burlington.png` | City card | ~614×288 | **1200×600** | WebP · <120 KB |

**Marquee logos** — all render in a tiny ~48px box (`object-contain`). They are hugely oversized (`otu-logo.webp` is **1920×1080, 936 KB** for a 48px slot):

| Files | Export at | Format · weight |
|---|---|---|
| `brampton.webp`, `markham-logo.jpg`, `metrolinx-logo.jpg`, `barrie-logo.jpg`, `burlington-logo.png`, `tmu-logo.jpg`, `otu-logo.webp` | **fit within 200×200** (keep each logo's own ratio) | PNG (transparent) or WebP · **<15 KB each** |

---

## City pages `/partners/:city`

| File(s) | Role | Displayed (max) | Export at | Format · weight |
|---|---|---|---|---|
| `{barrie,brampton,markham,burlington}-hero.png` | Full-bleed hero, **parallax + 1.12 zoom** | full width × 80vh, scaled | **2400×1600** (3:2) | WebP · <400 KB |
| Bento gallery: `brampton-cityhall.JPG`, `brampton-bbq.png`, `brampton-mascot.png`, `barrie-mayor.png`, `markham-mayor.jpg`, `markham-mayorspeech.png`, `markham-helmet.jpg`, `burlington-rider.png`, `burlington-scooters.png` | Gallery cards + lightbox | card ~600×750; lightbox ~1024×778 | **1400×1050** (4:3) | WebP · <180 KB |

> The heroes need extra height because of the parallax (`h-[120%]`) and hover zoom (`scale 1.12`) — keep important content away from the edges. Gallery images double as the lightbox view, so 1400px wide keeps the zoom crisp. Current heroes like `barrie-hero` are **square (1254×1254)** but get cropped to a wide letterbox — re-crop to landscape so you don't lose the top/bottom.

---

## Riders `/riders`

| File(s) | Role | Displayed (max) | Export at | Format · weight |
|---|---|---|---|---|
| `riders-page-hero.png` | Full-bleed hero | ~1440×600 | **2400×1350** (16:9) | WebP · <350 KB |
| `riders-carousel.gif` | Carousel slide (animated) | 420×500 | **840×1000** (keep as GIF, or convert to MP4/WebM) | <250 KB |
| `riders-carousel-{ride,parking,safety,vehicles}.png` | Carousel slide **+ reused as full-width blog hero** | **1440×748** (blog hero is the binding use) | **1600×900** (16:9) | WebP · <200 KB |
| `riders-carousel-map.png` | Not shown here; **blog hero only** | 1440×748 | **1600×900** (16:9) | WebP · <200 KB |
| `/icons/appstore-icon.png`, `/icons/playstore-icon.png` | Inline button badge | 28px tall | **~120px tall** | PNG · <10 KB |

> The carousel PNGs are **also** used as full-width hero images on blog posts, so size them for that (1600×900), not the small carousel.

---

## Technology `/technology`

No local images — the only image is a remote Pexels hero (`…?w=1920`). It is a full-screen (`h-screen`) hero shown in **both landscape and portrait**, so if you ever swap in your own file, export **2400×1350** with a center-weighted composition. Otherwise nothing to do here.

---

## About `/about`

Hero is a remote Wikipedia URL (consider replacing with your own — see note). Local files:

| File | Role | Displayed (max) | Export at | Format · weight |
|---|---|---|---|---|
| `canada-mask.png` | "Made in Canada" centerpiece (`object-contain`, 320px tall box) | ~320×320 visible | **800×800** | WebP/PNG · <150 KB |
| `maple-leafs.png` | Decorative strip, 80px tall | 80px tall | **~800 wide** (keep ratio) | PNG (transparent) · <20 KB |
| `DSC_1837.jpg`, `2024Markham…jpg`, `City Hall…JPG`, `brampton-partnership.JPG` | Tab panel photos | 420×420 | already covered above (**1200×1200 / 1080×1350**) | WebP |

> ⚠️ Two CSS bugs affect About sizing: `w-100` (on the maple leaf) and `w-150` (on the canada-mask wrapper) **aren't valid Tailwind classes** and do nothing — the widths fall back to auto / parent. Worth fixing if those elements look off.

---

## Blog `/blog` + `/blog/:slug`

All blog images are **reused from Riders / Cities** (covered above). The binding constraint is the **post hero** (`/blog/:slug`), which is full-width × ~52vh ≈ **1440×748**:

| File | Also used as | Export at |
|---|---|---|
| `our-solutions-carousel/toronto-skyline.png` | Featured lead card + post hero | **1600×900** (16:9) · WebP <200 KB |
| `riders-carousel-*.png`, `burlington-hero.png`, `markham-hero.png` | (sized above for their hero use) | 1600×900 / city heroes at 2400×1600 |

---

## Global — logo, badges, favicon & social

| Asset | Status | Export at | Notes |
|---|---|---|---|
| `scooty-logo-tm.png` (navbar) | OK (500×500, 60 KB) | **160×160** | Shrink slightly; keep transparency |
| Footer logo | Removed — none exists | — | Add one if desired (~160px) |
| Favicon | ❌ still `vite.svg` placeholder | **32×32 + SVG** | Replace with Scooty mark |
| `apple-touch-icon` | ❌ missing | **180×180** PNG | Add to `index.html` |
| `og:image` (social share) | ❌ missing | **1200×630** | Add — links unfurl blank right now |
| `twitter:image` | ❌ missing | **1200×600** | Card type is set but image is absent |

---

## 🗑️ Unused files to delete — 9 files, ~26 MB

Confirmed zero references in the codebase:

```
public/assets/Partners/DSC02478.JPG                                   13 MB
public/assets/mainPage/built-for-riders-hero.png                     3.1 MB
public/assets/mainPage/non-profit.png                                2.2 MB
public/assets/Partners/cities-markham.jpg                            2.0 MB   (cities-markham-2.jpg is the one in use)
public/assets/mainPage/partners-carousel/toronto-skyline.png         2.0 MB   (dup of our-solutions-carousel version)
public/assets/mainPage/our-solutions-hero.png                        1.8 MB
public/assets/Vertical Logo.png                                      1.2 MB   (footer logo was removed)
public/assets/mainPage/our-solutions-carousel/on-demand-mobility.png  156 KB
public/assets/mainPage/main-pg-transit.jpeg                           64 KB
```

---

## Rule of thumb for future images

- **Full-bleed hero** → 2400×1350 (16:9), <350 KB
- **Half-width panel / carousel** → 1200×900 or 1080×1350, <150 KB
- **Card / thumbnail** → 1200×600 (2:1) or 1200×900, <120 KB
- **Logo / icon** → ≤200px, <15 KB, PNG with transparency
- **Always WebP for photos. Never ship a PNG photo > 1 MB.**

---

## Note on remote (Pexels / Wikipedia) images

These pages pull some images from remote URLs rather than your `public/` folder:

- **Technology** hero — Pexels (`…?w=1920`)
- **About** hero — Wikipedia
- **Home** → Projects case studies, project cards/detail, and the "PAY" solutions slide — Pexels
- **Partners** → "Transit" solutions slide — Pexels

You can't re-export these, but for the Pexels ones you control the size via the `?w=` query param. For best results, replace them with your own optimized assets (sized per the rules above) so you control quality, licensing, and load time.
