# SCOOTY Website — Pre-Launch UI/UX & Improvements Report
_Generated: 2026-06-05_

## Executive Summary

The SCOOTY site is visually confident and well-animated, with a cohesive dark "AI mobility" aesthetic, a data-driven city/rider content architecture, and genuinely strong interactive product demos on the Technology page. However, **it is not launch-ready.** Two themes dominate: (1) **the entire primary conversion path is broken** — nearly every "Contact / Get Started / Become a Partner / Download" CTA is either a dead `href="#"`, a bare `<button>` with no handler, or a scroll to a `#contact` section that does not exist in the live app; and (2) **severe asset weight and infrastructure gaps** — `public/` is ~146 MB with single images over 8 MB, there is no SPA host-rewrite (so every deep link 404s on direct load), and the viewport meta disables pinch-zoom. The user's #1 priority, responsiveness, is mostly solid at the macro level (consistent containers, a desktop-gated canvas, an `ls` landscape breakpoint) but breaks on small phones because there is **no `xs` breakpoint defined**, so the most-requested small-phone fixes literally cannot be expressed yet. There are also two invalid Tailwind width classes that silently render the "Made in Canada" section at broken sizes, a half-broken light mode, fabricated case-study stats/quotes, and a large volume of dead code (unused deps, starter-template data leaking a third party's name).

**Launch-readiness verdict: NOT READY.** Phase 1 must close dead CTAs, image weight, SPA routing, favicon/meta, the zoom block, and the invalid-class layout bugs before any public launch.

---

## Top Priorities

| # | Item | Category | Effort | Files |
|---|------|----------|--------|-------|
| P0 | Wire up every dead CTA (Contact/Get Started/Become a Partner/Download — buttons with no onClick/href or scroll to nonexistent `#contact`) | UX/IA | M | `Navbar.tsx:48-55`, `Footer.tsx:17`, `Services.tsx:192-194`, `ChatbotDemo.tsx:117`, `PartnersPage.tsx:474-481,1022-1029`, `CityPage.tsx:842-849`, `RidersPage.tsx:210-235`, `RiderDetailPage.tsx:82`, `AboutPage.tsx:137-178,393-400` |
| P0 | Compress/convert 146 MB of images to WebP/AVIF (single PNGs 8.5/8.2/8.0 MB) | Performance | L | `public/assets/`, `Services.tsx:11,27`, `RidersPage.tsx:55-170`, `Projects.tsx:69-123` |
| P0 | Add SPA host-rewrite — deep links (`/partners/brampton`) 404 on direct load/refresh/share | Pre-launch | S | repo root (`_redirects`/`vercel.json`/`netlify.toml`) |
| P0 | Remove `maximum-scale=1.0, user-scalable=no` from viewport (WCAG 1.4.4 zoom block) | Accessibility | S | `index.html:8` |
| P0 | Fix invalid Tailwind classes `w-100`/`w-150` collapsing the "Made in Canada" maple-leaf + flag | Visual/Responsive | S | `AboutPage.tsx:510,546` |
| P0 | Fix favicon (points to nonexistent `/vite.svg`) + add `og:image`/`twitter:image` | SEO/Meta | S | `index.html:7,17-29` |
| P0 | Fix/repair light mode (Hero, TechnologyPage, Footer, Navbar, NetworkCanvas hardcoded dark) — or commit to dark-only | Visual/Design-System | M | `Hero.tsx`, `TechnologyPage.tsx`, `Footer.tsx:28`, `Navbar.tsx:116` |
| P0 | Remove/replace fabricated case-study stats and invented official quotes | Content/Copy | S | `Projects.tsx:13-38,64-125` |
| P1 | Add `xs:400px` breakpoint (required before any small-phone fix; current `xs:` recommendations are inert) | Responsive | S | `tailwind.config.js:7-13` |
| P1 | Add `prefers-reduced-motion` handling for an extremely animation-heavy site | Accessibility | M | `src/index.css`, `NetworkCanvas.tsx`, framer-motion loops |
| P1 | Remove artificial 2000 ms loader gating every page load | Performance | S | `App.tsx:55-68` |
| P1 | Per-route `<title>`/meta + canonical + sitemap + robots (single static head today) | SEO/Meta | M | `index.html`, all routes in `App.tsx` |

---

## What to ADD / What to REMOVE / What to CHANGE

### ADD
- **`xs: '400px'`** to `theme.screens` in `tailwind.config.js` — without it, the small-phone band (0–640px) is untargetable and all `xs:` fixes silently no-op.
- **SPA host-rewrite** (`_redirects` / `vercel.json` / `netlify.toml`) so deep links don't 404.
- **`prefers-reduced-motion` global guard** in `src/index.css` + `useReducedMotion()` gating for canvas/marquee/infinite loops.
- **Per-route SEO** via `react-helmet-async`: unique `<title>`, meta description, canonical, `og:url` per page.
- **Favicon set, `apple-touch-icon`, `og:image`/`twitter:image` (1200×630), `theme-color`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, JSON-LD Organization schema.**
- **`width`/`height` (or `aspect-ratio`) on all 26 `<img>`** to eliminate CLS.
- **Real hero CTAs** in the empty `Hero.tsx:71-77` container (`/partners`, `/riders`).
- **Skip-to-content link + SPA route-change focus management** (`App.tsx` ScrollToTop only scrolls).
- **Scroll lock + Escape + focus trap + `role="dialog"`** on the Projects modal and CityPage lightbox.
- **`aria-label`s + `focus-visible` rings** across carousel arrows/dots/tabs on Riders, Partners, About.
- **Web analytics / conversion tracking** (none exists; PIPEDA-compliant for Canada).
- **Real legal pages** (Privacy / Terms / Cookie) and a phone/address + rider-support contact channel.
- **`<noscript>` fallback** with brand + value prop.

### REMOVE
- **Unused npm deps:** `three`, `@react-three/fiber`, `@types/three` (37 MB), `socket.io-client`, `react-hot-toast`, `lottie-react`.
- **The artificial 2000 ms `setTimeout` loader** in `App.tsx:55-68`.
- **Dead component clusters:** `sections/{Contact,Auth,Team,Chat}.tsx`, `chat/*`, `chatbot/*`, `hooks/{useAuth,useToast}.ts`, `data/lottieAnimations.ts`, `ui/{NetworkBackground,MobilityBackground,SectionNav,CustomCursor}.tsx`, `hooks/useSectionSnap.ts`.
- **Starter-template cruft:** `src/data/projects.ts` + `src/components/projects/*` (leak `hazrat-ali.com`/GitHub URLs); rename package from `hazrat-business-portfolio`.
- **Five generic placeholder testimonial quotes** (`Projects.tsx:64-125`) and **fabricated metrics** (`Projects.tsx:13-38`).
- **Unused design-system utilities** in `index.css:52-88` (`.btn-brand`, `.glass-card`, etc.) — or adopt them (preferred).
- **Orphaned `ArrowRight` import** in `Hero.tsx:2`; the empty CTA wrapper if not filled.
- **Obsolete `<meta name="keywords">`** (optional).

### CHANGE
- **Wire every dead CTA** to a real destination (mailto, store URL, Link, or rendered Contact/form).
- **Re-encode all images** to WebP/AVIF at display dimensions; self-host the Pexels hero video + the NYC About hero + Pexels Transit/Metrolinx images.
- **Make light mode real or go dark-only** (resolve hardcoded-dark Hero/Tech/Footer/Navbar/canvas).
- **Standardize brand yellow** on `primary-500`; replace off-brand amber `#EAB308`/`rgba(234,179,8)` and stray `#FEC001` hexes.
- **Fix copy inconsistencies:** city count (4+ vs 5+), Markham omitted from announcement, `scooty.ai` vs `scooty.ca`, SCOOTY vs Scooty casing, "worldwide" vs Ontario, "first-and-last-km" vs "-mile", Transit tab mislabeled as Academic.
- **Bump sub-44px touch targets** (hamburger 36px, footer socials 28px, announcement dismiss 14px, carousel dots 6px).
- **Replace `h-screen`/`100vh` heroes with `min-h-[100svh]`** for short landscape phones.
- **Switch build script to `tsc -b && vite build`** to surface the 18 unused-symbol diagnostics.

---

## Detailed Findings

### 1. Responsiveness & Multi-Screen (User's #1 Priority)

> **Foundational blocker first:** there is **no sub-640px breakpoint** — many fixes below depend on it.

| Sev | Finding | File:Line | Recommendation | Screens | Effort |
|-----|---------|-----------|----------------|---------|--------|
| **P0** | Invalid Tailwind classes `w-100`/`w-150` silently no-op; the "Made in Canada" maple leaf and flag image render with no width constraint (verified: 0 occurrences in built CSS) | `AboutPage.tsx:510,546` | `w-100`→`w-24 h-20` (leaf); `w-150`→`w-full max-w-2xl h-64 sm:h-80` (flag). Never use `w-100/w-150` — they don't exist | all | S |
| **P1** | **No `xs` breakpoint** — cannot differentiate ~360px from ~430–639px phones; reviewer-recommended `xs:` utilities are dropped at build | `tailwind.config.js:7-13` | Add `xs: '400px'` to `theme.screens` **before** applying any small-phone typography fix | mobile <640px | S |
| **P0** | Riders hero `whitespace-nowrap` + `clamp(1.75rem,7vw,5.5rem)` forces "Your City, Your Ride" edge-to-edge/overflow at 360–390px | `RidersPage.tsx:187-192` | Remove `whitespace-nowrap`, add `break-words`, lower clamp floor to `clamp(1.375rem,6vw,5.5rem)`; verify at 320/360px | mobile <400px | S |
| **P1** | Hero tagline fixed `text-2xl` at all breakpoints wraps 3–4 lines at 360px (plus a double space) | `Hero.tsx:78-80` | `text-lg sm:text-xl md:text-2xl`; remove double space | mobile <640px | S |
| **P1** | Fixed 420px image column (`lg:grid-cols-[1fr_420px]`) cramps text at 1024–1280px; non-fluid | `PartnersPage.tsx:550`; also `RidersPage.tsx:309`, `AboutPage` tab card | Use `lg:grid-cols-[1.2fr_1fr]` or `minmax(0,420px)` and split at `xl`; reduce `lg:p-12`→`lg:p-10` | laptop ~1024–1280px | S |
| **P1** | Carousel prev/next arrows at `-left-5/-right-5` protrude past the 16px `px-4` gutter, overlap rounded corners, and are 40px (<44px) targets | `RidersPage.tsx:282-295`, `PartnersPage.tsx:523-536`, `AboutPage.tsx:287-300` | `hidden sm:flex` on mobile (rely on dots + swipe) or move to `left-2/right-2`; bump to `w-11 h-11`; add swipe gesture | mobile <640px, tablet | S |
| **P1** | CityPage hero stats `grid-cols-2` + `text-2xl` with no wrap control — Markham's "E-Scooters + E-Bikes" wraps 2–3 lines and collides with adjacent cell at 360px | `CityPage.tsx:535-552` (data `:217`) | `text-lg sm:text-2xl`, `leading-tight`/`text-balance`, or shorten to "Scooters + Bikes"; verify all 5 cities at 360px | mobile <640px | S |
| **P2** | Hero headlines jump straight to `text-5xl`/`5xl→7xl` with no smaller small-phone step | `Hero.tsx:64`, `RidersPage.tsx`, `PartnersPage.tsx:453`, `CityPage.tsx:526`, `TechnologyPage.tsx:615` | Add `text-4xl xs:text-5xl …` (needs `xs` breakpoint) or a `clamp()` fluid size; verify 2-line max at 360px | small phones ~360px | S |
| **P2** | Quote scroller is a 2-row `min-260px` grid, horizontal-only, hidden scrollbar, no fade/arrows — shows ~1 card at 360px with no affordance | `Projects.tsx:242-249` | Single-row/vertical stack on mobile + visible scroll affordance | mobile <640px, tablet portrait | M |
| **P2** | Interactive product visuals lock `min-h-[460px] p-8` — wastes space / forces tall cards on mobile | `TechnologyPage.tsx:99,243,435` | `min-h-[380px] sm:min-h-[460px]`, `p-5 sm:p-8`; size to content on mobile | mobile <640px, tablet | S |
| **P2** | Hero `h-screen` clips/cramps content on short landscape phones; triggers iOS 100vh jump | `TechnologyPage.tsx:584`, `AboutPage.tsx:214-280` (no min-height) | Use `min-h-[100svh]` + vertical padding; give About hero `min-h-[60vh] sm:min-h-[70vh]`, `ls:pt-20`; hide scroll cue on short landscape | mobile landscape | S |
| **P2** | Fixed `w-20` color pills with `whitespace-nowrap` truncate "Designated"/"Mandatory" zone labels | `RidersPage.tsx:352-354` | `min-w-[5rem]` / `px-3 min-w-fit` so the pill grows to fit | all | S |
| **P2** | Right image column has no fixed aspect ratio; same image cropped to wildly different ratios across tabs (Safety 6 vs Vehicles 11 features) | `RidersPage.tsx:309,459-490` | Give image column `aspect-[3/4]` (lg) / `aspect-[4/3]` (mobile) or fixed lg min-height; `self-start` text column | desktop/tablet | S |
| **P3** | `min-w-[110px]` stat chips wrap to a lone orphan on narrow columns | `RidersPage.tsx:392-437`, `AboutPage.tsx:359-389` | Use `grid grid-cols-2 gap-3` on mobile so chips pack evenly | mobile <640px | S |
| **P3** | `html, body { max-width: 100vw }` includes scrollbar gutter → tiny right-edge clip on desktop | `index.css:6-12` | Drop `100vw`; rely on `overflow-x:hidden` or use `max-width:100%` | desktop | S |
| **P3** | 404/inner-page `pt-20` (80px) < full chrome height (announcement 32px + nav 72px = 104px) | `App.tsx:90` vs `Navbar.tsx:74,131` | Use `pt-28`/`pt-[7rem]` on non-hero first sections, or measure nav height | all | S |
| **P3** | (If revived) `ChatbotInterface` root `w-96` (384px) overflows 360px viewport | `ChatbotInterface.tsx:164` | Delete (dead), or `w-[min(384px,calc(100vw-2rem))] h-[min(600px,80vh)]` | mobile <400px | S |

---

### 2. Accessibility

| Sev | Finding | File:Line | Recommendation | Effort |
|-----|---------|-----------|----------------|--------|
| **P0** | Viewport blocks pinch-zoom (`maximum-scale=1.0, user-scalable=no`) — WCAG 1.4.4 failure | `index.html:8` | `content="width=device-width, initial-scale=1.0, viewport-fit=cover"` — drop max-scale/user-scalable | S |
| **P0** | Zero `prefers-reduced-motion` handling on a canvas/marquee/infinite-loop-heavy site (WCAG 2.3.3) | `src/index.css` (none); `NetworkCanvas`, `LoadingSpinner`, announcement auto-rotate, marquees | Add global `@media (prefers-reduced-motion: reduce)` guard; gate canvas + infinite framer loops behind `useReducedMotion()` | M |
| **P0** | Brand-yellow text on white/`gray-50` is ~1.6:1 (AA needs 4.5:1) — unreadable in light mode | `PartnersPage.tsx:330,334,456`, `AboutPage.tsx:237`, `Projects.tsx:518`, `RidersPage.tsx:415,433` | Use `text-primary-700` (~4.6:1) for light-mode text; scope `#FEC001` to dark via `dark:text-[#FEC001]` | M |
| **P1** | ThemeToggle icon-only button has no accessible name (WCAG 4.1.2) | `ThemeToggle.tsx:9-14` | `aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}` + `aria-pressed` | S |
| **P1** | Modal + lightbox lack `role="dialog"`, `aria-modal`, Escape, focus trap, scroll lock | `Projects.tsx:536-538`, `CityPage.tsx:909-924` | Add dialog semantics, Escape/arrow keydown, focus into/out, body `overflow:hidden` | M |
| **P1** | Carousel arrows/dots/tabs lack `aria-label`, `aria-selected/current`, and `focus-visible` rings | `RidersPage.tsx:255-295,504-513`, `PartnersPage.tsx:523-536,661-671`, `AboutPage.tsx:262-300,424-435` | Add labels + `role="tablist"/"tab"` + `focus-visible:ring-2 ring-primary-500 ring-offset-2` | M |
| **P1** | Broken heading hierarchy: `h2` before page `h1` (Partners), `h1`→`h3` skip (Riders) | `PartnersPage.tsx:333` vs `:449`; `RidersPage.tsx:183`→`:319` | One `h1` first per page; promote `RidersPage:319` to `h2`; reorder Partners | M |
| **P1** | Contact form labels not associated (no `htmlFor`/`id`) — WCAG 1.3.1/3.3.2 | `Contact.tsx:175-245` | Add matching `id`/`htmlFor` pairs (fix when re-wiring, or delete with dead code) | S |
| **P2** | Auto-rotating announcement is not an `aria-live` region; auto-advances with no pause | `Navbar.tsx:65-98` (`:42`) | Wrap in `aria-live="polite" aria-atomic="true"`; gate interval behind `useReducedMotion` | S |
| **P2** | Full-screen LoadingSpinner has no `role="status"`/`aria-busy`; wall of infinite motion | `LoadingSpinner.tsx:191-283` (`App.tsx:58-64`) | `role="status" aria-live="polite"`, `aria-busy`; honor reduced motion; drop fixed delay | M |
| **P1** | No skip-to-content link; no focus move/announce on SPA route change (WCAG 2.4.1/4.1.3) | `App.tsx:4-8,77-79` | Add visually-hidden skip link → `<main id="main">`; move focus to `main`/`h1` + `aria-live` on route change | M |
| **P2** | Footer legal links are dead `href="#"` | `Footer.tsx:75-83` | Point to real routes or remove until ready | S |
| **P2** | Stat highlight glyph `'↑'` read as "up arrow" with no meaning | `PartnersPage.tsx:146` | Replace with a word/number (e.g. "+30%") or pair `TrendingUp` icon with text | S |
| **P3** | Dead inaccessible components (Auth 10 unlabeled inputs, ChatbotInterface color-only status, CustomCursor) | `Auth.tsx`, `ChatbotInterface.tsx`, `CustomCursor.tsx`, `Team.tsx` | Delete pre-launch; if kept, fix labels and don't rely on color alone | M |

---

### 3. Performance

| Sev | Finding | File:Line | Recommendation | Effort |
|-----|---------|-----------|----------------|--------|
| **P0** | 146 MB of assets; 40 images >1 MB; single PNGs 8.5/8.2/8.0/7.6 MB downloaded as-is | `public/assets/`; `Services.tsx:11,27`, `RidersPage.tsx:55-170`, `PartnersPage.tsx:172`, `Projects.tsx:69-123` | Batch-convert to WebP/AVIF at display dims (`cwebp -q 80` / vite-imagetools); target `<400 KB`/image, `public/` <15 MB; use `<picture>` | L |
| **P1** | Hero LCP is a remote 1080p Pexels MP4 — no poster, third-party CDN on critical path | `Hero.tsx:11-21` | Self-host compressed 720p loop (<2–3 MB) + WebP poster + `preload="metadata"`; skip on reduced-motion | M |
| **P1** | No route-based code splitting — all 7 pages + 2200-line canvas in the initial chunk | `App.tsx:33-43,80-107` | `React.lazy` each route + `<Suspense>`; keep Navbar/Footer/Hero eager | M |
| **P1** | Artificial 2000 ms loader gates every visit/refresh (+2s LCP/TTI for nothing) | `App.tsx:55-68` | Delete timer; render immediately, or gate on `document.fonts.ready` capped ~600ms | S |
| **P1** | 0 of 26 `<img>` declare `width`/`height` → CLS as multi-MB images pop in | all `<img>` (e.g. `RidersPage.tsx:169,218`, `CityPage.tsx:659`) | Add intrinsic `width`/`height` or wrapper `aspect-ratio` | M |
| **P1** | `three`, `@react-three/fiber`, `@types/three` declared, imported nowhere (37 MB installed) | `package.json:13,14,24` | `npm uninstall three @react-three/fiber @types/three` | S |
| **P2** | `socket.io-client`, `react-hot-toast`, `lottie-react` unused / only in dead files | `package.json:23,…` | Uninstall after dead-code removal | S |
| **P2** | NetworkCanvas: full scene repaint every frame, uncapped RAF, no DPR cap, no reduced-motion guard | `NetworkCanvas.tsx:226-232,2091-2148` | Render one static frame on reduced-motion; optional 30fps cap; clamp DPR ≤1.5 | M |
| **P2** | 11 of 26 `<img>` lack `loading="lazy"`/`decoding="async"` (eager below-the-fold) | Riders/Partners/City/About/Services img tags | Add to all below-the-fold images; keep LCP image eager + `fetchpriority="high"` | S |
| **P2** | Hero/Tech background images always fetch full size, no `srcset` | `TechnologyPage.tsx:586-593` | Add `srcSet` (640/1024/1920) + `sizes="100vw"` | S |
| **P2** | No Vite `manualChunks` — framer-motion (33 files) etc. in one re-downloaded vendor chunk | `vite.config.ts:5-10` | Add `build.rollupOptions.output.manualChunks` for stable vendors | S |
| **P2** | Particle canvas blurry on HiDPI (no `devicePixelRatio` scaling) | `ParticleBackground.tsx:34-38` | Multiply backing store by `dpr`, `ctx.setTransform(dpr,…)` | S |
| **P3** | No build/asset budget guardrail (how 146 MB slipped through) | `package.json`, `vite.config.ts` | Run `npm run build`, set `chunkSizeWarningLimit`, add rollup-plugin-visualizer + budget | S |

---

### 4. Visual Design & Design System

| Sev | Finding | File:Line | Recommendation | Effort |
|-----|---------|-----------|----------------|--------|
| **P0** | Light mode broken: Hero, TechnologyPage, Footer, Navbar, NetworkCanvas hardcoded dark → half-dark page when toggled | `Hero.tsx:8-108`, `TechnologyPage.tsx:580,675,729,785`, `Footer.tsx:28`, `Navbar.tsx:116`, `App.tsx:75` | **Decide:** (A) dark-only — remove ThemeToggle + `useTheme`; or (B) add full light variants. (A) is lower-risk pre-launch | M |
| **P1** | Entire `.btn-brand/.glass-card/.premium-card/...` utility layer defined but used in ZERO files | `index.css:52-88`, `tailwind.config.js:120-124` | Either delete, or (better) adopt them to collapse CTA/card drift into one source | M |
| **P1** | No real display font: Avenir referenced first but never loaded; `font-display === font-sans` | `tailwind.config.js:63-66`, `index.html:34-36` | Self-host Avenir woff2, or drop it and load a distinct display webfont; ensure index.html loads what the config claims | M |
| **P1** | Brand yellow expressed 3 ways (`#FEC001` hex, `primary-500`, off-brand amber `#EAB308`) | 14 hex files + `TechnologyPage.tsx:260,679`, `PartnersPage.tsx:327,…` | Standardize on `primary-500` token; replace all `rgba(234,179,8)`/`#EAB308` | M |
| **P1** | Invalid classes silently no-op: `border-gray-150`, `bg-[#FEC001]/08`, `w-100` | `ChatbotDemo.tsx:141`, `Footer.tsx:56`, `AboutPage.tsx:510` | `border-gray-200`; `/[0.08]`; valid width. Add CI grep for invalid classes | S |
| **P2** | Inconsistent section vertical padding (`py-12/16/20/24/28`) — home cramped vs Tech spacious | `Services.tsx:75`, `ChatbotDemo.tsx:31`, `TechnologyPage.tsx:675` | Define `.section-y` (`py-16 sm:py-20 lg:py-24`); normalize `py-28` | M |
| **P2** | CTA styles drift (radius/padding); 404 uses `rounded-lg`+`primary-500` vs `rounded-full`+`#FEC001` everywhere | `TechnologyPage.tsx:638,706`, `App.tsx:100`, `Navbar.tsx:180` | Adopt `.btn-brand`/`.btn-ghost` sizes; standardize one secondary style | M |
| **P2** | `brand.red #FE0101` token defined but unused; components use raw `red-400/500/600` | `tailwind.config.js:53`, `AboutPage.tsx:510`, `Projects.tsx:525` | Wire Canadian accents to one red token or delete the unused one | M |
| **P2** | Dead background/chrome components ship (NetworkBackground, MobilityBackground, SectionNav, CustomCursor) | `ui/*.tsx` | Delete; keep NetworkCanvas + ParticleBackground | S |
| **P2** | `useTheme` holds independent state per call (no shared context) — JS theme branching desyncs | `useTheme.ts:3-26` | Lift to a single context/provider, or remove if dark-only | M |
| **P1** | Theme FOUC: `dark` class applied only in a post-mount effect inside ThemeToggle; no pre-paint script | `useTheme.ts:12-21`, `index.html` (none) | Add a blocking inline `<head>` script reading `localStorage`/`prefers-color-scheme` before paint (or hardcode `class="dark"`) | S |
| **P1** | ParticleBackground seeds only 40 particles over a ~3000px page — most of TechnologyPage has no background | `ParticleBackground.tsx:30-52,89-94` | Scale count to area for absolute mode, or keep canvas `fixed`; add `ResizeObserver` | M |
| **P3** | 5 border-radius sizes mixed without tiering | across `src` | Codify: pills `rounded-full`, cards `rounded-3xl`, sub-cards `rounded-2xl`, chips `rounded-xl` | S |
| **P3** | Card surfaces use one-off magic values (`#0A0A0A`, `white/[0.03..0.08]`) while a navy scale sits unused | `Services.tsx:167`, `TechnologyPage.tsx:720` | Define 2–3 surface tokens; replace scattered alphas | S |

---

### 5. UX & Information Architecture

| Sev | Finding | File:Line | Recommendation | Effort |
|-----|---------|-----------|----------------|--------|
| **P0** | Homepage Contact/Get Started/Learn More/Download CTAs scroll to a `#contact` that doesn't exist (Contact.tsx never imported) | `Navbar.tsx:48-55,179,255`, `Footer.tsx:17`, `Services.tsx:192-194`, `ChatbotDemo.tsx:117` | Render `<Contact/>` on HomePage, or repoint to `mailto:`/store URLs/`/riders` | M |
| **P0** | Partners/City primary CTAs are bare `<button>`s with no onClick/href | `PartnersPage.tsx:474-481,1022-1029`, `CityPage.tsx:842-849` | Wrap in `Link`/`<a href="mailto:partnerships@scooty.ca">`/lead form | S–M |
| **P0** | Riders/About download + social/"Learn More" CTAs dead (`href="#"`/inert) | `RidersPage.tsx:210-235`, `RiderDetailPage.tsx:82`, `AboutPage.tsx:137-178,393-400` | Real store URLs or "Coming soon"/waitlist; real social URLs or remove | S–M |
| **P1** | Metrolinx city page orphaned from Partners grid yet appears in city pager as a peer | `PartnersPage.tsx:188-242` vs `CityPage.tsx:318-369` | Add a distinct Metrolinx card to `locations`, or remove from `cityOrder`/`nextCity` | S |
| **P1** | Section content can stay permanently invisible if `useInView` never fires (opacity:0 start) | `TechnologyPage.tsx:574-857`, `PartnersPage.tsx:449-482`, `AboutPage.tsx:230-279` | Use `whileInView` with `viewport={{once:true,amount:0.15}}` or render visible-by-default | M |
| **P2** | Location card is fully `cursor-pointer` but only the 40px arrow is a `Link` | `PartnersPage.tsx:836` vs `:899-907` | Wrap whole card in `Link` or add a stretched-link overlay | S |
| **P2** | Hero entrance animations gated on `useInView` can momentarily render blank above-the-fold | `PartnersPage.tsx:421`, `CityPage.tsx:421` | Animate hero on mount, not on scroll-into-view | S |
| **P2** | 404 "Go Home" uses raw `<a href="/">` → full reload + replays loader | `App.tsx:98-103` | Use react-router `<Link to="/">`; extract a branded NotFound | S |
| **P3** | TiltCard tilt/glow mount + run on touch devices with no payoff | `TechnologyPage.tsx:60-81` | Gate behind `matchMedia('(pointer:fine)')` | S |
| **P3** | No skeleton/`onError` for multi-MB carousel images | `RidersPage.tsx:482-491` | Add background/shimmer placeholder + `onError` brand fallback | S |
| **P3** | Announcement dismissal not persisted (reappears every reload/cold deep-link) | `Navbar.tsx:27,102` | Persist in `localStorage` (versioned key) and read in the `useState` initializer | S |
| **P2** | ErrorBoundary uses full-page reload and renders raw `error.message` to users | `ErrorBoundary.tsx:23,26-32,51-57` | react-router nav for Go Home; hide `error.message` behind `import.meta.env.DEV`; wire Sentry; restyle to brand | S |

---

### 6. Content & Copy

| Sev | Finding | File:Line | Recommendation | Effort |
|-----|---------|-----------|----------------|--------|
| **P0** | Fabricated case-study stats (Brampton "2.1M rides", "4,200 tons CO₂", "18% commute") | `Projects.tsx:13-38` | Replace with verified figures or non-numeric claims; remove fabrications | S |
| **P0** | Invented official quotes — 5 named ministers/mayors + 5 generic placeholders | `Projects.tsx:64-125` | Verify/approve named quotes; delete the 5 placeholder rows | S |
| **P1** | Transit tab content is actually about universities/campuses (GraduationCap icon, "Academic Programs") | `PartnersPage.tsx:150-167` | Rename tab to "Campuses"/"Universities" or rewrite for transit agencies | S |
| **P1** | Meta says "cities worldwide"; site is Ontario-only | `index.html:12-14` | Rewrite to Canadian/Ontario positioning; add local keywords | S |
| **P1** | Partners CTA "Cities around the world…" contradicts local positioning | `PartnersPage.tsx:1015` | "Cities across Canada…" | S |
| **P1** | City count contradiction: "4+" vs "5+" | `PartnersPage.tsx:128` vs `AboutPage.tsx:40,63` | Pick one figure (e.g. "4 cities + Metrolinx") everywhere | S |
| **P1** | Announcement omits Markham (a live city) | `Navbar.tsx:10` | "Now live in Brampton, Barrie, Markham & Burlington" | S |
| **P1** | Social handles use 3 schemes; AboutPage cards link to `#` | `About.tsx:53-57`, `Footer.tsx:21-24`, `AboutPage.tsx:94-178` | Standardize one real handle set + real URLs; single source of truth | S |
| **P1** | Domain mismatch: `scooty.ai` (meta) vs `scooty.ca` (email) | `index.html:19,25` vs `Contact.tsx:99`, `Footer.tsx:24` | Decide real domain; use consistently | S |
| **P1** | About hero is an external Wikimedia NYC drone photo — off-brand + network dependency | `AboutPage.tsx:217` | Self-host an optimized Canadian launch photo from `/assets` | S |
| **P2** | Brand casing SCOOTY vs Scooty | `Services.tsx:112`, `Team.tsx:265`, `index.html:12-27` | Standardize on SCOOTY | S |
| **P2** | Legal entity "SCOOTY Technologies Inc." vs "SCOOTY Inc." | `Footer.tsx:72` vs `AboutPage.tsx:95,142` | Use the registered name in both | S |
| **P2** | Founding year 2023 == Brampton launch year; "decades-of-experience" framing overstates | `AboutPage.tsx:43` vs `PartnersPage.tsx:192` | Confirm founding date; align maturity messaging | S |
| **P2** | No phone/address; only a partnerships email; no rider-support contact | `Contact.tsx:90-110`, `Footer.tsx` | Add HQ address/phone + rider-support email | S |
| **P3** | "first-and-last-km" vs "first-and-last-mile" inconsistent | `Services.tsx:10`, `Navbar.tsx:12`, `Projects.tsx:35`, etc. | Standardize (recommend "first-and-last-kilometre") | S |
| **P3** | Burlington "17 designated parking zones" caption not reflected in stats | `CityPage.tsx:273` vs `:277-301` | Surface as a stat if true, or generalize the caption | S |
| **P3** | "24/7 multilingual support" claim with no support path | `ChatbotDemo.tsx:20` | Add a support channel or soften the claim | S |
| **P3** | Duplicated "Follow the Journey" socials block (home vs About), drifting handles | `About.tsx:40-49` vs `AboutPage.tsx:561-575` | Consolidate to one social source of truth | S |

---

### 7. SEO / Metadata / PWA

| Sev | Finding | File:Line | Recommendation | Effort |
|-----|---------|-----------|----------------|--------|
| **P0** | Favicon → nonexistent `/vite.svg` (broken tab icon) | `index.html:7` | Generate favicons from `public/icons/appstore-icon.png`; add `.ico`/16/32/`apple-touch-icon` | S |
| **P0** | No per-route `<title>`/meta — single static head for the whole SPA | `index.html:9-12`, all routes | Add `react-helmet-async` + `<Seo>` per page; dynamic title for CityPage | M |
| **P0** | `og:image`/`twitter:image` missing → blank social previews (card is `summary_large_image`) | `index.html:17-29` | Create 1200×630 `og-image.png`; add `og:image*` + `twitter:image`; switch `twitter:*` to `name=` | S |
| **P1** | No `robots.txt` | `public/` (absent) | Add (or `Disallow: /` if staging until launch) | S |
| **P1** | No `sitemap.xml` (SPA — crawlers can't discover deep routes) | `public/` (absent) | Generate from city/topic data arrays at build time | M |
| **P1** | No canonical tag | `index.html:4-37` | Default canonical + per-route via helmet | S |
| **P1** | No PWA manifest / installability | `public/` + head (absent) | Add `manifest.webmanifest` (name, icons 192/512, theme) + `<link rel="manifest">` | M |
| **P2** | `og:url`/`twitter:url` hardcoded to homepage on every route | `index.html:19,26` | Set dynamically per pathname via helmet | S |
| **P2** | No `theme-color` | head | Add light + dark `theme-color` via `media` | S |
| **P2** | No `apple-touch-icon` | head | Add 180×180 (bundle with favicon fix) | S |
| **P2** | No JSON-LD structured data | head | Add Organization schema (name, logo, sameAs, areaServed Ontario) | M |
| **P2** | Catch-all 404 returns HTTP 200 (soft-404) | `App.tsx:89-106` | Host-level real 404 + `<meta robots noindex>` on 404 view | M |
| **P3** | Obsolete `<meta name="keywords">` | `index.html:13-14` | Optional removal | S |

---

### 8. Pre-launch Readiness & Dead Code

| Sev | Finding | File:Line | Recommendation | Effort |
|-----|---------|-----------|----------------|--------|
| **P0** | **No SPA host-rewrite** — deep links 404 on direct load/refresh/share (invalidates SEO/sitemap work) | repo root (none) vs `App.tsx:82-87` | Add `_redirects` / `vercel.json` / `netlify.toml` per host; verify `/partners/brampton` in incognito | S |
| **P1** | Artificial 2000 ms loader on every load | `App.tsx:55-68` | Remove or cap ~600ms on real readiness | S |
| **P1** | Large dead component clusters (Contact, Auth, Team, Chat, chat/*, chatbot/*, useAuth, useToast, lottieAnimations) | listed paths | Delete (salvage Contact markup first if reusing) | M |
| **P1** | Starter-template `data/projects.ts` + `projects/*` leak `hazrat-ali.com`/GitHub URLs; package named `hazrat-business-portfolio` | `data/projects.ts`, `package.json:2` | Delete files; rename package to `scooty-website`; grep bundle to confirm | S |
| **P1** | Fake form submit handlers (`console.log` + `setTimeout`, no backend) | `Contact.tsx:33-42`, `Auth.tsx:26-35` | Wire to a real endpoint before reviving; remove console logs | M |
| **P1** | No web analytics / conversion tracking on a conversion-focused site | `index.html`, `src/` (none) | Add Plausible/GA4/PostHog (PIPEDA-compliant); instrument primary conversions | M |
| **P2** | Unused UI background/chrome components + `useSectionSnap` | `ui/{NetworkBackground,MobilityBackground,SectionNav,CustomCursor}.tsx`, `hooks/useSectionSnap.ts` | Delete | S |
| **P2** | Unused npm deps after cleanup | `package.json:13-24` | Uninstall `three`/`@react-three/fiber`/`@types/three`/`socket.io-client`/`react-hot-toast`/`lottie-react` | S |
| **P2** | Live hero video + several images hotlink Pexels (36 refs total) | `Hero.tsx:19-20`, `Services.tsx:19`, `Projects.tsx:17,25,33`, `PartnersPage.tsx:154` | Self-host optimized media; reserve stock only for non-critical decoration | M |
| **P3** | Redundant scroll-to-top (global ScrollToTop + per-page effect) | `App.tsx:4-8`, `CityPage.tsx:417-419` | Remove per-page effect; standardize on global | S |
| **P3** | Duplicate/unused assets shipped | `Partners/Marquee/markham-logo` (extensionless), `cities-markham.jpg`, `DSC02478.JPG` | Delete after confirming no refs | S |
| **P3** | `console.error` in production ErrorBoundary | `ErrorBoundary.tsx:23` | Gate behind `import.meta.env.DEV` or route to Sentry | S |
| **P3** | 18 TS "declared but never read" errors; build never runs `tsc` | `package.json:7` + listed files | Change build to `tsc -b && vite build`; remove unused imports | S |
| **P3** | No `<noscript>` fallback for a fully client-rendered SPA | `index.html:39-42` | Add brand + value prop + email; consider SSG later | S |
| **P3** | Sticky highlights sidebar engages inconsistently by city overview length | `CityPage.tsx:583` | Drop sticky for consistency | S |

---

## Strengths — Keep These

- **Solid responsive foundation:** consistent `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container system; `html/body overflow-x:hidden`; a thoughtful custom `ls` landscape breakpoint actually used in section min-heights.
- **NetworkCanvas is correctly desktop-gated** via conditional *mount* (not CSS hide) with a live `matchMedia` listener, pauses on `visibilitychange`, caps `dt`, and cleans up RAF/listeners — the heavy loop genuinely never runs on phones/tablets.
- **Real, well-built mobile nav** (hamburger, AnimatePresence slide-down, auto-close on route change, ~44px menu rows, full-width CTA).
- **Genuinely high-quality interactive demos** on TechnologyPage (journey diagram, tap-to-pay, AI chat) with stateful hover/typing/empty states and `tabular-nums`.
- **Data-driven city/rider content** (typed Records + arrays) — makes per-route SEO and sitemap generation cheap.
- **Good image-loading intent** where it exists: hero `fetchPriority="high"` + eager, below-fold `loading="lazy"` + `decoding="async"`; decorative images correctly `alt=""`.
- **Resilience scaffolding present:** ErrorBoundary, ScrollToTop, catch-all 404, CityPage "City Not Found" fallback.
- **Cohesive brand language** (yellow glow + blurred blobs + dot grids), shared easing curve, on-brand animated LoadingSpinner, and strong Canadian positioning/copy in the rider-education and city pages.

---

## Suggested Sequencing

### Phase 1 — Pre-Launch Must-Fix (P0/P1)
- [ ] Wire **every** dead CTA (Contact/Get Started/Become a Partner/Download/social) to real destinations.
- [ ] Add SPA host-rewrite; verify a deep link loads in incognito.
- [ ] Remove `maximum-scale`/`user-scalable=no` from viewport.
- [ ] Fix `w-100`/`w-150` invalid classes (Made in Canada section).
- [ ] Compress/convert all images to WebP/AVIF; self-host hero video + About NYC hero + Pexels images.
- [ ] Fix favicon; add `og:image`/`twitter:image`.
- [ ] Add `xs:400px` breakpoint, then apply small-phone hero/tagline/stat fixes (Hero, Riders, Partners, City, Tech).
- [ ] Resolve light mode (commit dark-only or finish light variants) + add pre-paint theme script (no FOUC).
- [ ] Remove/replace fabricated stats + invented quotes; fix domain, city count, Markham, "worldwide", Transit-tab label.
- [ ] Add `prefers-reduced-motion` global guard + gate canvas/loops.
- [ ] Fix brand-yellow contrast in light mode; add ThemeToggle `aria-label`; modal/lightbox dialog+Escape+scroll-lock.
- [ ] Remove 2000 ms loader; add route-based code splitting; remove unused deps.
- [ ] Per-route titles/meta + canonical + sitemap + robots; create real legal pages or remove links.
- [ ] Delete dead code clusters + starter-template `projects.ts`; rename package.
- [ ] Add analytics + conversion tracking; add skip-to-content + route-change focus management.

### Phase 2 — Polish (P2)
- [ ] Adopt the dead `.btn-brand/.glass-card` utilities; standardize CTA/section-spacing/radius/surface tokens.
- [ ] Standardize brand yellow on `primary-500`; remove off-brand amber; fix `border-gray-150`/`/08`.
- [ ] Fix heading hierarchy; carousel `aria-label`s/`focus-visible`; announcement `aria-live`; touch targets ≥44px.
- [ ] Add `width`/`height`/`aspect-ratio` to all images; lazy-load remaining; throttle/DPR-fix canvases; Vite `manualChunks`.
- [ ] `min-h-[100svh]` heroes; fluid 420px columns; consistent image aspect ratios; per-card hero animate-on-mount.
- [ ] Add manifest, `theme-color`, `apple-touch-icon`, JSON-LD; fix soft-404; 404 `<Link>`; harden ErrorBoundary.
- [ ] Fix copy polish (casing, entity name, founding year, terminology, contact info).

### Phase 3 — Post-Launch (P3)
- [ ] Switch build to `tsc -b && vite build`; clear 18 unused-symbol diagnostics.
- [ ] Persist announcement dismissal; consolidate duplicate socials/scroll-to-top.
- [ ] Delete unused/duplicate assets; rename URL-unsafe asset paths.
- [ ] `<noscript>` fallback; consider SSG/prerender for marketing routes.
- [ ] Refine particle background coverage/HiDPI; gate TiltCard to fine pointers; mobile skeletons/onError.
- [ ] Establish a CI bundle/asset budget to prevent regressions.
