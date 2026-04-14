# SCOOTY Website — Premium Upgrade Log

## What Was Improved

### Visual Design

- **Hero section**: Added eyebrow tag, rendered the existing stats row (was defined but never used), removed awkward overlapping "mission pinned text" that sat on top of the scroll indicator, improved heading size scaling across breakpoints (`text-5xl → text-[6.5rem]`), cleaner scroll nudge with a vertical line motif instead of just an icon.
- **Section rhythm**: Each section now has a consistent eyebrow label (`text-[10px] font-bold tracking-[0.2em] uppercase text-primary-500`) before headings. This creates a clear visual hierarchy and premium journalistic feel.
- **Core Values cards**: Changed highlight badge from `bg-primary-500/10` hover fill to a smooth `group-hover:bg-primary-500` swap with icon color inversion. Softer border (`border-white/[0.055]`) for dark mode refinement.
- **Government Quotes collage**: Tightened gap from `gap-4` to `gap-3.5`, refined card corner and ring behavior, subtler image scale on hover (`scale-[1.04]` vs `scale-105`).
- **Partners carousel**: Added tab-selector buttons (mirroring Services section). Placeholder gradient for missing image. More polished image overlay layers.
- **Case Studies**: Changed flat `bg-primary-500` highlight chip to a semi-transparent `bg-primary-500/10 border border-primary-500/20` badge with text in `text-primary-400`. Feels premium vs. a flat label.
- **ChatbotDemo**: Perks icons now have hover behavior (group fills with yellow, icon goes black). Status badge uses `backdrop-blur-xl` glass treatment. Download button updated to match site's border/ghost button pattern.
- **About section**: Added real content to the empty "Made in Canada" dark band — Ontario flag SVG, tagline, supporting text. Added a stats highlights row (100% Canadian, Ontario, 5+ Cities). Social icons now animate with `y: -2` lift on hover.
- **Contact section**: Filled the empty left column with a contact card, email link, and common-inquiry chips. Added success state message after form submission. Cleaner label styling (`uppercase tracking-wide text-xs`).
- **Footer**: Replaced `Zap` icon placeholder with actual SCOOTY logo (inverted for dark). Added TikTok/Mail social icons. Fixed contact details (Canadian email). Used `Link` components instead of hash anchor tags. Dynamic year in copyright.
- **Navbar**: Active state now uses a `layoutId` animated dot indicator (spring physics) instead of a color change only. Mobile menu uses `AnimatePresence` with `staggered` item reveals. Scroll listener is now `{ passive: true }`.

### Typography

- All section headings use `tracking-tight` for a more premium, modern feel.
- Eyebrow labels use `tracking-[0.2em]` (wider than standard `tracking-widest`) for precise control.
- Subtitle copy uses `text-gray-500 dark:text-gray-400` consistently — not `text-gray-600` which was heavier.
- Body text in dark mode is `text-white/85–90` (soft off-white) rather than pure white — reduces harshness.

### Colors & Surfaces

- Dark section backgrounds now use layered values: `bg-black`, `bg-[#040404]`, `bg-[#060606]`, `bg-[#080808]`, `bg-[#0A0A0A]` for depth hierarchy rather than a flat black everywhere.
- Borders in dark mode refined from `dark:border-white/10` → `dark:border-white/[0.055–0.06]` — more subtle, more premium.
- Form inputs: `focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500` — clear focus state with subtle ring.

---

## Animation Improvements

### Easing

All `duration: 0.8` reveals replaced with `duration: 0.55–0.65` using `[0.16, 1, 0.3, 1]` (expo-out). This feels dramatically snappier and more deliberate than the old `ease-out`.

| Before | After |
|--------|-------|
| `transition={{ duration: 0.8 }}` | `transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}` |
| `y: 50` entrance offset | `y: 24` (subtler = more premium) |
| `x: 50` slide-in | `x: 32` |
| Carousel ease `[0.25, 0.46, 0.45, 0.94]` | Same (already good) |

### Hero orbs

Added `willChange: 'transform'` explicitly and added slight X-axis drift for more natural motion. Duration bumped to 12–16s (slower = more ambient, not distracting).

### Navbar active dot

Uses Framer Motion `layoutId="nav-active-dot"` — the dot slides between nav items on route change with spring physics. Zero extra code overhead.

### Social icons

Upgraded from `whileHover={{ scale: 1.1 }}` to `whileHover={{ scale: 1.08, y: -2 }}` — the lift adds a premium tactile feel.

### Scroll event

Navbar scroll listener added `{ passive: true }` flag — eliminates jank warning in Chrome and improves scroll performance on mobile.

---

## Responsiveness Improvements

- **Hero heading**: `text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]` — fluid scaling without jumps.
- **Hero stats row**: Uses `gap-x-6 gap-y-5 sm:gap-x-10` — wraps cleanly on small phones, spreads on desktop.
- **Contact form**: Changed from `lg:grid-cols-2` to `lg:grid-cols-5` with `col-span-2` / `col-span-3` split — left panel is narrower and more balanced.
- **Partners carousel image panel**: Added `overflow-hidden` to prevent image bleed on Safari/mobile.
- **Mobile menu**: Items stagger-animate in individually (`delay: i * 0.04`), making the open feel crisp not laggy.
- **Footer**: `sm:col-span-2 lg:col-span-1` on brand column prevents single-column stacking from looking sparse on tablets.
- **All section padding**: Standardized to `py-16 sm:py-24 ls:py-8` — phones get 64px, desktop 96px, landscape gets 32px.

---

## Performance Optimizations

### GPU acceleration

- Video background: `style={{ willChange: 'transform' }}` ensures the video layer is composited on GPU.
- Animated glow orbs: `willChange: 'transform'` prevents the browser from re-painting on every frame.
- All Framer Motion animations use `transform` + `opacity` only — no `width`, `height`, or `top/left` that cause layout reflow.

### Event listeners

- Navbar scroll: `{ passive: true }` flag prevents main-thread blocking on scroll, critical for mobile 60fps.

### Bundle size

- Removed unused `ArrowRight` import from `Hero.tsx`.
- Removed unused `TrendingUp`, `Leaf`, `MapPin`, `Users` icon imports from `Projects.tsx`.
- `AnimatedCounter` component retained but scoped — only runs once via `hasAnimated` flag.

### Image handling

- All non-hero images use `loading="lazy" decoding="async"` consistently.
- Footer logo uses `loading="lazy" decoding="async"` (previously used `fetchPriority="high"` unnecessarily on a below-fold element).

### CSS

- Custom scrollbar width reduced `8px → 5px` — less paint surface.
- Added `-webkit-font-smoothing: antialiased` globally — sharper text rendering on macOS/iOS, zero runtime cost.
- Added `text-rendering: optimizeLegibility` — better kerning on headings.
- `::selection` color — uses `rgba(234,179,8,0.18)` tint, reinforces brand on text select.

---

## New Utility Classes

Added to `index.css`:

```css
.premium-card   /* bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/[0.06] */
.glass-card     /* backdrop-blur-xl bg-white/[0.06] border border-white/[0.08] */
.section-divider /* border-t border-gray-100 dark:border-white/[0.05] */
```

Added to `tailwind.config.js`:

```js
animation: {
  'float': '...',        // 6s ambient float for decorative elements
  'shimmer': '...',      // loading skeleton shimmer
  'pulse-subtle': '...'  // gentler pulse than default
}
transitionTimingFunction: {
  'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}
```

---

## Going Forward — Developer Guidelines

### Keep animations fast and GPU-only

Only animate `transform` (translate, scale, rotate) and `opacity`. Never animate `width`, `height`, `padding`, `margin`, `top`, `left` — these force layout recalculation on every frame.

```tsx
// ✅ Good
whileHover={{ scale: 1.03, y: -2 }}

// ❌ Avoid
whileHover={{ width: '120%', paddingLeft: 24 }}
```

### Use consistent easing

```ts
const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1]; // expo-out — for reveals
const SPRING = { type: 'spring', stiffness: 400, damping: 30 };      // for interactive snaps
```

### Entrance animation offsets

Keep `y` offsets at 20–28px max for section reveals. Larger offsets (50px+) feel dated and slow. Pair with `duration: 0.55–0.65s`.

### Section structure template

```tsx
<section id="..." className="py-16 sm:py-24 ls:py-8 bg-white dark:bg-black">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Eyebrow */}
    <p className="text-xs font-bold tracking-[0.2em] text-primary-500 uppercase mb-3">Section Label</p>
    {/* Heading */}
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight">...</h2>
  </div>
</section>
```

### Dark mode surfaces

Use layered blacks for depth, not flat `#000`:

| Depth level | Value |
|-------------|-------|
| Page background | `bg-black` |
| Section alt bg | `bg-[#040404]` |
| Card surface | `bg-[#0A0A0A]` |
| Elevated surface | `bg-[#111]` |
| Borders | `border-white/[0.055]` |

### Button patterns

```tsx
// Primary CTA
className="px-6 py-3 bg-primary-500 text-black rounded-full font-semibold text-sm
           hover:bg-primary-400 transition-all duration-200 shadow-sm shadow-primary-500/20"
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}

// Ghost/outline
className="px-6 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/[0.1]
           text-gray-700 dark:text-gray-300 rounded-full font-semibold text-sm
           hover:border-primary-500/50 hover:text-primary-500 transition-all duration-200"
```

### Image treatment

Every `img` below the fold:
```tsx
loading="lazy"
decoding="async"
```

Hero/LCP image only:
```tsx
fetchPriority="high"
decoding="async"
```

### Maintaining the premium feel

1. **Less is more** — resist adding more UI elements. Edit down, not up.
2. **Whitespace is structure** — generous padding communicates quality.
3. **Consistent scale** — use the same border radius family (`rounded-xl`, `rounded-2xl`, `rounded-3xl`) and don't mix.
4. **One accent color** — keep yellow (`primary-500`) as the sole accent. Don't introduce new colors.
5. **Type hierarchy matters** — every screen should have exactly one visual focal point. If everything is bold, nothing is.
