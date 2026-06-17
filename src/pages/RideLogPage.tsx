import { useState, useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ArrowUpRight, Clock, MapPin, Flag, Bike, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CATEGORY_ACCENT, POSTS, type Post } from '../data/blog';

/*
  The Ride Log — SCOOTY's urban city journal.

  A premium "night-edition" broadsheet: an editorial masthead (Fraunces serif),
  a headline ticker, and an image-rich front page (a drop-cap lead story + a grid
  of thumbnailed headlines, with a yellow house-ad cell). Scroll past it and the
  same stories re-open as a SCOOTY route — articles "stop" along a scroll-drawn
  yellow transit rail. Yellow (#FEC001) is the only saturated ink; the brand
  accents appear as small per-category line dots. Works in light + dark, and
  degrades to a complete static layout under prefers-reduced-motion.

  Note on semantics: the App shell already renders the single <main> landmark, so
  this page is a <div> of <section>/<article> blocks (one <main> per document).
*/

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PILL_SPRING = { type: 'spring', stiffness: 420, damping: 34 } as const;

const ROUTE_STOPS = POSTS.filter((p) => !p.featured);

/* ─── Small shared pieces ──────────────────────────────────────────────── */

// Faint halftone print screen — laid over photos so they read like newsprint.
const Halftone = ({ className = '' }: { className?: string }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply ${className}`}
    style={{
      backgroundImage: 'radial-gradient(rgba(0,0,0,0.55) 0.5px, transparent 0.6px)',
      backgroundSize: '3px 3px',
    }}
  />
);

// Faint cartographic basemap — a grid that fades toward the edges. Unique ids
// per instance so multiple maps on one page don't collide.
const MapGrid = ({ idSuffix }: { idSuffix: string }) => {
  const grid = `rl-grid-${idSuffix}`;
  const fade = `rl-fade-${idSuffix}`;
  const mask = `rl-mask-${idSuffix}`;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-black/[0.045] dark:text-white/[0.05]"
    >
      <defs>
        <pattern id={grid} width="46" height="46" patternUnits="userSpaceOnUse">
          <path d="M46 0H0V46" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <radialGradient id={fade} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={mask}>
          <rect width="100%" height="100%" fill={`url(#${fade})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${grid})`} mask={`url(#${mask})`} />
    </svg>
  );
};

const LineBadge = ({ category }: { category: string }) => {
  const accent = CATEGORY_ACCENT[category] ?? '#FEC001';
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 py-0.5 pl-2 pr-2.5 font-news text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 dark:border-white/10 dark:text-white/80"
      style={{ borderLeftWidth: 2, borderLeftColor: accent, backgroundColor: `${accent}24` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
      {category}
    </span>
  );
};

const SectionKicker = ({
  label,
  title,
  id,
  sub,
}: {
  label: string;
  title: string;
  id?: string;
  sub?: string;
}) => (
  <div>
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-[#FEC001]" />
      <span className="font-news text-[11px] font-bold uppercase tracking-[0.3em] text-[#B88400] dark:text-[#FEC001]">
        {label}
      </span>
    </div>
    <h2
      id={id}
      className="mt-3 font-masthead text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl"
    >
      {title}
    </h2>
    {sub && <p className="mt-2 font-news text-sm text-gray-500 dark:text-white/50">{sub}</p>}
  </div>
);

/* ─── Masthead + ticker ────────────────────────────────────────────────── */

const Masthead = ({ reduce }: { reduce: boolean }) => (
  <header className="flex-shrink-0">
    {/* folio line */}
    <div className="flex items-center justify-between border-b border-gray-300 pb-1.5 font-news text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:border-white/15 dark:text-white/55 sm:text-[10px]">
      <span className="hidden sm:inline">Vol. I · No. 1</span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FEC001]" />
        SCOOTY Journal
      </span>
      <span>Ontario · 2026</span>
    </div>

    {/* wordmark */}
    <div className="py-5 text-center sm:py-7">
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-gray-300 dark:bg-white/20 sm:w-12" />
        <span className="font-news text-[9px] font-bold uppercase tracking-[0.32em] text-[#B88400] dark:text-[#FEC001] sm:text-[10px]">
          First &amp; last-mile dispatches
        </span>
        <span className="h-px w-8 bg-gray-300 dark:bg-white/20 sm:w-12" />
      </div>
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="font-masthead font-black leading-[0.82] tracking-[-0.02em] text-gray-900 dark:text-white"
        style={{ fontSize: 'clamp(2.75rem, 8vw, 6.75rem)' }}
      >
        The <span className="font-normal italic">Ride</span> Log
      </motion.h1>
      <p className="mx-auto mt-3 max-w-xl font-news text-sm italic text-gray-500 dark:text-white/60 sm:text-base">
        Stories, routes, rider tips &amp; city updates from the streets we ride every day.
      </p>
    </div>

    {/* newspaper double rule */}
    <div className="border-t-[3px] border-gray-900 dark:border-white/70" />
    <div className="mt-[3px] border-t border-gray-900 dark:border-white/70" />
  </header>
);

const HeadlineTicker = ({ reduce }: { reduce: boolean }) => {
  const Track = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden}>
      {POSTS.map((p) => (
        <span
          key={p.id}
          className="inline-flex items-center gap-2.5 whitespace-nowrap font-news text-[11px] uppercase tracking-[0.18em] text-gray-600 dark:text-white/55"
        >
          <span
            className="h-1 w-1 flex-shrink-0 rounded-full"
            style={{ backgroundColor: CATEGORY_ACCENT[p.category] ?? '#FEC001' }}
          />
          {p.title}
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex items-stretch border-y border-gray-200 dark:border-white/10">
      <span className="z-10 hidden flex-shrink-0 items-center gap-1.5 bg-[#FEC001] px-3 font-news text-[10px] font-bold uppercase tracking-[0.2em] text-black sm:flex">
        In this issue
      </span>
      <div className="relative flex-1 overflow-hidden py-2">
        <div className={`flex w-max ${reduce ? '' : 'animate-marquee'}`}>
          <Track />
          <Track hidden />
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent dark:from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent dark:from-black" />
      </div>
    </div>
  );
};

/* ─── Newspaper front page ─────────────────────────────────────────────── */

// Category "sections" filter — drives the whole page.
const SectionFilters = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (c: string) => void;
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
    <span className="font-news text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-white/50">
      Sections
    </span>
    <div
      role="group"
      aria-label="Filter articles by category"
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 scrollbar-hide sm:flex-wrap"
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        const accent = CATEGORY_ACCENT[cat] ?? '#FEC001';
        const count = cat === 'All' ? POSTS.length : POSTS.filter((p) => p.category === cat).length;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(cat)}
            className="relative flex flex-shrink-0 items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 font-news text-[10px] font-bold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:focus-visible:ring-offset-black sm:text-[11px]"
          >
            {isActive && (
              <motion.span
                layoutId="rl-filter-pill"
                className="absolute inset-0 rounded-full bg-[#FEC001]"
                transition={PILL_SPRING}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: isActive ? '#000' : accent }}
              />
              <span className={isActive ? 'text-black' : 'text-gray-600 dark:text-white/60'}>
                {cat}
              </span>
              <sup
                className={`text-[8px] ${isActive ? 'text-black/60' : 'text-[#B88400] dark:text-[#FEC001]'}`}
              >
                {count.toString().padStart(2, '0')}
              </sup>
            </span>
          </button>
        );
      })}
    </div>
    <span className="hidden font-news text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-white/40 sm:ml-auto sm:inline">
      Scroll for the full route ↓
    </span>
  </div>
);

const Byline = ({ post, light = false }: { post: Post; light?: boolean }) => (
  <div
    className={`mt-auto flex items-center gap-2 pt-3 font-news text-[10px] font-semibold uppercase tracking-[0.14em] ${
      light ? 'text-white/70' : 'text-gray-500 dark:text-white/55'
    }`}
  >
    <span className={light ? 'text-white/90' : 'text-gray-700 dark:text-white/80'}>{post.author}</span>
    <span className={`h-2.5 w-px ${light ? 'bg-white/30' : 'bg-gray-300 dark:bg-white/25'}`} />
    <span>{post.readTime}</span>
  </div>
);

// A newspaper "house ad" — fills the grid and doubles as a real CTA.
const HouseAd = () => (
  <div className="relative flex flex-col justify-between gap-4 border-b border-r border-gray-200 bg-[#FEC001] p-5 dark:border-white/10">
    <span className="font-news text-[9px] font-bold uppercase tracking-[0.24em] text-black/55">
      Advertisement
    </span>
    <div>
      <p className="font-masthead text-2xl font-black leading-[0.92] text-black sm:text-[1.7rem]">
        Your City,
        <br />
        Your Ride.
      </p>
      <p className="mt-2 font-news text-sm leading-snug text-black/75">
        Unlock a SCOOTY e-scooter or e-bike right from your phone.
      </p>
    </div>
    <Link
      to="/riders"
      className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black px-4 py-2 font-news text-[11px] font-bold uppercase tracking-wider text-[#FEC001] transition-transform hover:scale-[1.03]"
    >
      Get the app
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  </div>
);

const NewspaperFront = ({
  activeCategory,
  onChange,
  reduce,
}: {
  activeCategory: string;
  onChange: (c: string) => void;
  reduce: boolean;
}) => {
  const shown =
    activeCategory === 'All' ? POSTS : POSTS.filter((p) => p.category === activeCategory);
  const lead = shown.find((p) => p.featured) ?? shown[0];
  const others = shown.filter((p) => p !== lead);

  const cellLink = (post: Post) => (
    <Link
      to={`/blog/${post.id}`}
      className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FEC001]"
      aria-label={`Read: ${post.title}`}
    />
  );

  return (
    <section className="relative border-b border-gray-200 bg-white pt-28 dark:border-white/10 dark:bg-black">
      <div className="mx-auto w-full max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
        <Masthead reduce={reduce} />

        <div className="mt-4">
          <HeadlineTicker reduce={reduce} />
        </div>

        {/* ── Front-page grid ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 grid grid-cols-1 border-l border-t border-gray-200 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {shown.length === 0 && (
            <p className="col-span-full border-b border-r border-gray-200 p-10 text-center font-news text-sm italic text-gray-500 dark:border-white/10 dark:text-white/50">
              No stories in this section yet — try another.
            </p>
          )}

          {/* lead story */}
          {lead && (
            <article className="group relative flex flex-col border-b border-r border-gray-200 p-5 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/[0.03] sm:col-span-2 lg:row-span-2 lg:p-6">
              <div className="flex items-center gap-2 font-news text-[10px] font-bold uppercase tracking-[0.2em] text-[#B88400] dark:text-[#FEC001]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_ACCENT[lead.category] ?? '#FEC001' }}
                />
                Lead Story · {lead.category}
              </div>

              <div className="relative mt-4 aspect-[16/9] overflow-hidden lg:aspect-[16/10]">
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.15] transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="eager"
                  decoding="async"
                />
                <Halftone />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-news text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FEC001]" />
                  {lead.stop}
                </span>
              </div>

              <h2 className="mt-4 font-masthead text-[1.7rem] font-black leading-[0.98] text-gray-900 dark:text-white sm:text-4xl lg:text-[2.6rem]">
                {lead.title}
              </h2>
              <p className="mt-3 font-news text-[15px] leading-relaxed text-gray-600 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-masthead first-letter:text-5xl first-letter:font-black first-letter:leading-[0.65] first-letter:text-[#B88400] dark:text-white/70 dark:first-letter:text-[#FEC001] lg:line-clamp-none">
                {lead.excerpt}
              </p>

              <Byline post={lead} />
              {cellLink(lead)}
              <ArrowUpRight className="pointer-events-none absolute bottom-5 right-5 hidden h-5 w-5 text-[#FEC001] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:block" />
            </article>
          )}

          {/* secondary stories — now with thumbnails */}
          {others.map((p) => (
            <article
              key={p.id}
              className="group relative flex flex-col border-b border-r border-gray-200 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                />
                <Halftone />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2 font-news text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-white/55">
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: CATEGORY_ACCENT[p.category] ?? '#FEC001' }}
                  />
                  {p.category}
                </div>
                <h3 className="mt-1.5 font-news text-[15px] font-bold leading-[1.18] text-gray-900 dark:text-white">
                  {p.title}
                </h3>
                <Byline post={p} />
              </div>
              {cellLink(p)}
            </article>
          ))}

          {/* house ad fills out the broadsheet */}
          {shown.length > 0 && <HouseAd />}
        </motion.div>

        {/* ── Sections / filters ── */}
        <div className="mt-6">
          <div className="border-t-2 border-gray-900 dark:border-white/70" />
          <div className="pt-4">
            <SectionFilters active={activeCategory} onChange={onChange} />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Street Signals — the route ───────────────────────────────────────── */

const RouteStop = ({
  post,
  index,
  active,
  reduce,
}: {
  post: Post;
  index: number;
  active: boolean;
  reduce: boolean;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  return (
    <li data-idx={index} className="relative">
      {/* station node sitting on the route rail */}
      <span
        aria-hidden
        className="absolute left-4 top-8 z-10 -translate-x-1/2 -translate-y-1/2 sm:left-6"
      >
        {!reduce && inView && (
          <motion.span
            className="absolute inset-0 rounded-full border border-[#FEC001]"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        )}
        <motion.span
          initial={reduce ? false : { scale: 0 }}
          animate={inView ? { scale: active ? 1.3 : 1 } : reduce ? {} : { scale: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 18,
            delay: reduce ? 0 : index * 0.05 + 0.1,
          }}
          className={`block h-4 w-4 rounded-full bg-[#FEC001] ring-4 ring-white transition-shadow dark:ring-black ${
            active ? 'shadow-[0_0_16px_rgba(254,192,1,0.85)]' : ''
          }`}
        />
      </span>

      {/* connector: rail → card */}
      <span
        aria-hidden
        className="absolute left-4 top-8 z-0 w-8 -translate-y-1/2 border-t border-dashed border-gray-300 dark:border-white/15 sm:left-6 sm:w-14"
      />

      {/* blog card */}
      <div className="pl-12 sm:pl-20">
        <motion.article
          ref={ref}
          aria-current={active ? 'step' : undefined}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: EASE }}
          whileHover={reduce ? undefined : { y: -4 }}
          className="group relative grid overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors duration-300 hover:border-[#FEC001]/40 hover:shadow-xl focus-within:ring-2 focus-within:ring-[#FEC001]/50 dark:border-white/[0.07] dark:bg-[#0A0A0A] sm:grid-cols-[clamp(220px,34%,300px)_1fr]"
        >
          {/* thumbnail */}
          <div className="relative h-44 overflow-hidden sm:h-full sm:min-h-[212px]">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <Halftone className="opacity-[0.12]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/20" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-news text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FEC001]" />
              {post.stop}
            </span>
          </div>

          {/* content */}
          <div className="flex flex-col p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <LineBadge category={post.category} />
              {active && (
                <span className="ml-auto inline-flex items-center gap-1.5 font-news text-[10px] font-bold uppercase tracking-[0.18em] text-[#B88400] dark:text-[#FEC001]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FEC001] shadow-[0_0_8px_rgba(254,192,1,0.85)]" />
                  Now reading
                </span>
              )}
            </div>

            <h3 className="font-masthead text-xl font-black leading-snug text-gray-900 dark:text-white sm:text-2xl">
              <span className="bg-gradient-to-r from-[#FEC001] to-[#FEC001] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {post.title}
              </span>
            </h3>

            <p className="mt-2 line-clamp-2 font-news text-sm leading-relaxed text-gray-500 dark:text-white/55 sm:line-clamp-3">
              {post.excerpt}
            </p>

            {/* byline */}
            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-5 font-news text-[11px] font-semibold text-gray-500 dark:text-white/70">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 place-items-center rounded-full bg-[#FEC001] font-sans text-[9px] font-bold text-black"
                >
                  {(post.author.includes(' ')
                    ? post.author.split(' ').map((w) => w[0]).join('')
                    : post.author.slice(0, 2)
                  )
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span className="text-gray-700 dark:text-white/80">{post.author}</span>
              </span>
              <span className="hidden h-3 w-px bg-gray-200 dark:bg-white/25 sm:block" />
              <span>{post.date}</span>
              <span className="hidden h-3 w-px bg-gray-200 dark:bg-white/25 sm:block" />
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#FEC001]" />
                {post.readTime}
              </span>
              <span className="ml-auto hidden items-center gap-1 font-sans text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white sm:inline-flex">
                Read
                <ArrowUpRight className="h-3.5 w-3.5 text-[#FEC001] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>

          {/* stretched, keyboard-focusable link covering the card */}
          <Link
            to={`/blog/${post.id}`}
            className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
            aria-label={`Read ${post.stop}: ${post.title}`}
          />
        </motion.article>
      </div>
    </li>
  );
};

const Legend = () => (
  <div className="hidden items-center gap-4 rounded-full border border-gray-200 bg-white/70 px-4 py-2 font-news text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50 sm:flex">
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-[#FEC001] ring-2 ring-white dark:ring-black" />
      Station
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-[#FEC001] shadow-[0_0_8px_rgba(254,192,1,0.85)]" />
      Live
    </span>
    <span className="inline-flex items-center gap-1.5">
      <span className="h-[2px] w-4 bg-[#FEC001]" />
      Route
    </span>
  </div>
);

const StreetSignals = ({
  posts,
  activeCategory,
  reduce,
}: {
  posts: Post[];
  activeCategory: string;
  reduce: boolean;
}) => {
  const spineRef = useRef<HTMLDivElement>(null);
  const [activeStop, setActiveStop] = useState(0);

  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start 80%', 'end 55%'],
  });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const markerTop = useTransform(draw, (v) => `${v * 100}%`);

  // Reset the live station whenever the route is re-filtered.
  useEffect(() => {
    setActiveStop(0);
  }, [activeCategory]);

  // "Live current station": the stop crossing the viewport centre band.
  useEffect(() => {
    const root = spineRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-idx]'));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveStop(Number(e.target.getAttribute('data-idx')));
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [activeCategory, posts.length]);

  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-black sm:py-24">
      <MapGrid idSuffix="signals" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionKicker
            label="The Route"
            title="Street Signals"
            sub={`${posts.length} ${posts.length === 1 ? 'article' : 'articles'}${activeCategory === 'All' ? '' : ` · ${activeCategory}`}`}
          />
          <Legend />
        </div>

        <div ref={spineRef} className="relative mt-10">
          {/* Route spine — a left rail that draws itself as you read */}
          <div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-[2px] -translate-x-1/2 sm:left-6"
          >
            <div className="absolute inset-0 bg-gray-200 dark:bg-white/10" />
            {reduce ? (
              <div className="absolute inset-0 bg-[#FEC001]" />
            ) : (
              <motion.div
                style={{ scaleY: draw }}
                className="absolute inset-0 origin-top bg-[#FEC001] shadow-[0_0_10px_rgba(254,192,1,0.5)]"
              />
            )}
            {!reduce && posts.length > 0 && (
              <motion.div
                style={{ top: markerTop }}
                className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#FEC001] text-black shadow-[0_0_18px_rgba(254,192,1,0.6)] ring-4 ring-white dark:ring-black">
                  <Bike className="h-4 w-4" />
                </div>
              </motion.div>
            )}
          </div>

          {posts.length === 0 ? (
            <p className="py-16 pl-12 font-news text-gray-500 dark:text-white/50 sm:pl-20">
              No articles on this line yet — try another route.
            </p>
          ) : (
            <ul key={activeCategory} className="relative space-y-6 sm:space-y-8">
              {posts.map((post, i) => (
                <RouteStop
                  key={post.id}
                  post={post}
                  index={i}
                  active={activeStop === i}
                  reduce={reduce}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

/* ─── Bottom CTA — route terminus ──────────────────────────────────────── */

const RouteCTA = ({ reduce }: { reduce: boolean }) => (
  <section className="relative overflow-hidden bg-gray-50 py-24 dark:bg-black">
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(254,192,1,0.10), transparent 60%)',
      }}
    />
    <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <div className="relative mx-auto mb-8 h-6 w-6">
        <span className="absolute inset-0 rounded-full bg-[#FEC001] shadow-[0_0_30px_rgba(254,192,1,0.6)]" />
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#FEC001]"
            initial={{ scale: 1, opacity: 0.5 }}
            whileInView={{ scale: 1.9, opacity: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        )}
      </div>

      <span className="font-news text-[11px] font-bold uppercase tracking-[0.35em] text-[#B88400] dark:text-[#FEC001]">
        End of the line
      </span>
      <h2 className="mt-4 font-masthead text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        Got a route worth sharing?
      </h2>
      <p className="mt-5 font-news text-base leading-relaxed text-gray-600 dark:text-white/60 sm:text-lg">
        Share your favourite local route, food spot, campus shortcut, park path, or hidden city
        gem. We might feature it in the next Ride Log.
      </p>

      {/* trip-planner styled prompt (decorative) */}
      <div aria-hidden className="mx-auto mt-9 max-w-md space-y-3 text-left">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-black/40">
          <MapPin className="h-4 w-4 flex-shrink-0 text-[#FEC001]" />
          <span className="font-news text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/40">
            From
          </span>
          <span className="font-news text-sm text-gray-700 dark:text-white/70">Your favourite route</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-black/40">
          <Flag className="h-4 w-4 flex-shrink-0 text-[#FEC001]" />
          <span className="font-news text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/40">
            To
          </span>
          <span className="font-news text-sm text-gray-700 dark:text-white/70">The Ride Log</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#FEC001] px-7 py-3.5 text-base font-bold text-black transition-colors hover:bg-[#FFD00F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-black"
        >
          Submit a route
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href="#"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-900 transition-all hover:border-[#FEC001]/50 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:border-white/25 dark:bg-white/[0.12] dark:text-white dark:hover:bg-white/[0.15] dark:focus-visible:ring-offset-black"
        >
          Download SCOOTY
          <Download className="h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────── */

export const RideLogPage = () => {
  const reduce = !!useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? ROUTE_STOPS
      : ROUTE_STOPS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NewspaperFront
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        reduce={reduce}
      />

      <StreetSignals posts={filtered} activeCategory={activeCategory} reduce={reduce} />

      <RouteCTA reduce={reduce} />
    </div>
  );
};

export default RideLogPage;
