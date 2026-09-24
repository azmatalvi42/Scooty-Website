import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { SiteImage } from '../ui/SiteImage';
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from 'framer-motion';
import type { PanInfo, Transition } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const solutions = products;
type Solution = (typeof solutions)[number];

// Illustrations are shown whole, letterboxed on their own backdrop colour.
const ILLUSTRATION_BACKDROP: Record<string, string> = {
  'ai-rideguide': '#101b22',
  patchforce: '#172720',
};

const SPRING = { type: 'spring', stiffness: 170, damping: 22 } as const;
const INSTANT = { duration: 0 } as const;
const COPY_IN: Transition = { delay: 0.14, duration: 0.4, ease: [0.22, 1, 0.36, 1] };
const COPY_OUT: Transition = { duration: 0.16 };

const SPLIT_MIN = 1024; // copy sits beside the media
const PHONE_MAX = 640; // one card, with the next one peeking in

type Layout = {
  split: boolean;
  anchor: number; // left edge of the active card
  gap: number;
  activeW: number;
  sideW: number;
  activeH: number;
  sideH: number;
  copyW: number;
  copyH: number;
  radius: number;
};

type Box = { x: number; y: number; width: number; height: number };
type ExitContext = { pos: number; layout: Layout; transition: Transition };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrap = (index: number, total: number) => ((index % total) + total) % total;

/** Signed number of steps from `from` to `to`, going the short way round the loop. */
const shortestStep = (from: number, to: number, total: number) => {
  const step = wrap(to - from, total);
  return step > total / 2 ? step - total : step;
};

// React 18 has no typed `inert` prop: '' sets the attribute, undefined removes it.
const inertWhen = (on: boolean) => ({ inert: on ? '' : undefined }) as object;

function computeLayout(width: number, copyH: number): Layout {
  if (width >= SPLIT_MIN) {
    const gap = 24;
    const activeW = Math.min(1120, width - 2 * (gap + clamp(width * 0.11, 96, 240)));
    const anchor = (width - activeW) / 2;
    const activeH = Math.max(clamp(width * 0.34, 440, 540), copyH);
    return {
      split: true,
      anchor,
      gap,
      activeW,
      // Always wider than the space beside the active card, so neighbours read as cropped.
      sideW: Math.max(activeW * 0.36, anchor - gap + 64),
      activeH,
      sideH: Math.round(activeH * 0.86),
      copyW: clamp(activeW * 0.42, 360, 470),
      copyH,
      radius: 40,
    };
  }

  const phone = width < PHONE_MAX;
  const gap = 16;
  const peek = phone ? 32 : clamp(width * 0.08, 44, 72);
  // Phones pin the active card to the gutter, so only the next card peeks in.
  const activeW = phone ? width - gap * 2 - peek : width - 2 * (gap + peek);
  const anchor = phone ? gap : (width - activeW) / 2;
  const activeH = Math.round(clamp(activeW * (phone ? 0.68 : 0.56), 200, 400)) + copyH;
  return {
    split: false,
    anchor,
    gap,
    activeW,
    sideW: Math.max(activeW * 0.5, anchor - gap + 48),
    activeH,
    sideH: Math.round(activeH * 0.9),
    copyW: activeW,
    copyH,
    radius: phone ? 28 : 32,
  };
}

/** Where the card `offset` places away from the active one sits on the track. */
function place(layout: Layout, offset: number): Box {
  const { anchor, gap, activeW, sideW, activeH, sideH } = layout;
  if (offset === 0) return { x: anchor, y: 0, width: activeW, height: activeH };
  const x =
    offset > 0
      ? anchor + activeW + gap + (offset - 1) * (sideW + gap)
      : anchor + offset * (sideW + gap);
  return { x, y: (activeH - sideH) / 2, width: sideW, height: sideH };
}

const SolutionCopy = ({ solution, split, measure = false }: { solution: Solution; split: boolean; measure?: boolean }) => {
  const cta = 'group/cta self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-black';
  const ctaContent = (
    <>
      <span>Learn More</span>
      <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-150" />
    </>
  );

  return (
    <div className={`flex flex-col justify-between gap-8 ${measure ? '' : 'h-full'} ${split ? 'p-10 xl:p-12' : 'p-6 sm:p-8'}`}>
      <div>
        <span
          className="inline-block px-3.5 py-1.5 text-black text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase"
          style={{ backgroundColor: solution.accent }}
        >
          {solution.tag}
        </span>
        <h3
          className={`font-extrabold font-display text-gray-900 dark:text-white mb-4 leading-[1.05] tracking-tight ${
            split ? 'text-[2rem] xl:text-[2.6rem]' : 'text-2xl sm:text-3xl'
          }`}
        >
          {solution.title}
        </h3>
        <p className={`text-gray-500 dark:text-gray-400 leading-relaxed ${split ? 'text-base xl:text-lg' : 'text-[15px] sm:text-base'}`}>
          {solution.description}
        </p>
      </div>
      {measure ? (
        <span className={cta}>{ctaContent}</span>
      ) : (
        <Link
          to={`/products/${solution.slug}`}
          draggable={false}
          className={cta}
          style={{ backgroundColor: solution.accent }}
        >
          {ctaContent}
        </Link>
      )}
    </div>
  );
};

type SlideProps = {
  solution: Solution;
  index: number;
  total: number;
  virtualIndex: number;
  offset: number;
  enterOffset: number;
  context: ExitContext;
  reduceMotion: boolean;
  onSelect: () => void;
};

const SolutionSlide = ({
  solution,
  index,
  total,
  virtualIndex,
  offset,
  enterOffset,
  context,
  reduceMotion,
  onSelect,
}: SlideProps) => {
  const { layout, transition } = context;
  const active = offset === 0;
  const illustration = solution.image.endsWith('.svg');
  // A leaving card glides to wherever its offset now lands, then unmounts. AnimatePresence
  // hands the exit the latest context; the card's own `custom` covers framer's first pass.
  const variants = {
    exit: ({ pos, layout: next, transition: exitTransition }: ExitContext) => ({
      ...place(next, virtualIndex - pos),
      transition: exitTransition,
    }),
  };
  const mediaInset = !active
    ? { left: 0, bottom: 0 }
    : layout.split
      ? { left: layout.copyW, bottom: 0 }
      : { left: 0, bottom: layout.copyH };

  return (
    <motion.div
      initial={place(layout, enterOffset)}
      animate={place(layout, offset)}
      exit="exit"
      variants={variants}
      custom={context}
      transition={transition}
      onClick={active ? undefined : onSelect}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      aria-hidden={active ? undefined : true}
      className={`group/card absolute left-0 top-0 overflow-hidden isolate will-change-transform bg-[var(--editorial-paper)] ring-1 ring-black/[0.06] dark:ring-white/[0.08] ${
        active ? '' : 'cursor-pointer'
      }`}
      style={{ borderRadius: layout.radius }}
    >
      {/* Media fills an inactive card and makes room for the copy once active. */}
      <motion.div
        initial={false}
        animate={mediaInset}
        transition={transition}
        className={`absolute right-0 top-0 overflow-hidden transition-[filter] duration-500 ${
          active ? '' : 'brightness-[.7] saturate-[.55] group-hover/card:brightness-[.88] group-hover/card:saturate-[.85]'
        }`}
        style={{ backgroundColor: illustration ? ILLUSTRATION_BACKDROP[solution.slug] ?? '#101b22' : undefined }}
      >
        <SiteImage
          src={solution.image}
          alt={solution.alt}
          draggable={false}
          className={`w-full h-full ${illustration ? 'object-contain' : 'object-cover'}`}
          style={{ objectPosition: solution.position }}
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={
          active
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: layout.split ? -16 : 0, y: layout.split ? 0 : 16 }
        }
        transition={reduceMotion ? INSTANT : active ? COPY_IN : COPY_OUT}
        className={`absolute left-0 ${layout.split ? 'top-0 h-full' : 'bottom-0'}`}
        style={{ width: layout.copyW, height: layout.split ? undefined : layout.copyH }}
        {...inertWhen(!active)}
      >
        <SolutionCopy solution={solution} split={layout.split} />
      </motion.div>

      {/* Neighbour label, pinned to the edge that stays on screen. */}
      {layout.split && (
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-5 ${offset < 0 ? 'right-5' : 'left-5'} inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 dark:bg-black/65 backdrop-blur-sm text-xs font-bold text-[#181916] dark:text-white transition-opacity duration-300 ${
            Math.abs(offset) === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: solution.accent }} />
          {solution.tag}
        </span>
      )}
    </motion.div>
  );
};

const ARROW =
  'flex items-center justify-center w-12 h-12 rounded-full border border-black/15 dark:border-white/20 text-gray-900 dark:text-white transition-[color,background-color,border-color,transform] duration-200 hover:bg-[#FEC001] hover:border-[#FEC001] hover:text-black dark:hover:border-[#FEC001] dark:hover:text-black active:scale-95';

export const Services = () => {
  const total = solutions.length;
  // Unbounded position on the loop; `active` is the solution it lands on.
  const [pos, setPos] = useState(0);
  const [announce, setAnnounce] = useState(false);
  const active = wrap(pos, total);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const reduceMotion = useReducedMotion() ?? false;

  const stageRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);
  const [copyH, setCopyH] = useState(0);
  const layout = stageWidth ? computeLayout(stageWidth, copyH) : null;

  // Only a change of slide animates; resizes and font swaps snap into place.
  const lastPos = useRef(pos);
  const moved = lastPos.current !== pos;
  useEffect(() => {
    lastPos.current = pos;
  }, [pos]);
  const transition: Transition = reduceMotion || !moved ? INSTANT : SPRING;

  const go = useCallback((step: number) => {
    if (!step) return;
    setPos((p) => p + step);
    setAnnounce(true);
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setStageWidth(stage.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Every card shares the height of the longest copy, measured off-screen.
  const hasLayout = layout !== null;
  useLayoutEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;
    const measure = () => setCopyH(Math.ceil(sizer.offsetHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sizer);
    return () => observer.disconnect();
  }, [hasLayout]);

  // Trackpad swipes: one slide per gesture, ignoring its trailing momentum.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || total < 2) return;
    let travel = 0;
    let locked = false;
    let settle = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        travel = 0;
        locked = false;
      }, 200);
      if (locked) return;
      travel += event.deltaX;
      if (Math.abs(travel) > 60) {
        locked = true;
        go(Math.sign(travel));
      }
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      stage.removeEventListener('wheel', onWheel);
      window.clearTimeout(settle);
    };
  }, [go, total]);

  const dragX = useMotionValue(0);
  // Set once a press turns into a drag, so releasing it doesn't also count as a click.
  const dragged = useRef(false);

  const onPan = (_: PointerEvent, info: PanInfo) => dragX.set(info.offset.x);

  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const flick = Math.abs(info.velocity.x) > 500 ? Math.sign(info.velocity.x) : 0;
    const threshold = Math.min(140, (layout?.activeW ?? 0) * 0.2);
    const pulled = Math.abs(info.offset.x) > threshold ? Math.sign(info.offset.x) : 0;
    go(-(flick || pulled));
    animate(dragX, 0, reduceMotion ? INSTANT : SPRING);
  };

  const reach = total > 1 ? Math.floor(total / 2) + 1 : 0;
  const slots = Array.from({ length: reach * 2 + 1 }, (_, i) => pos - reach + i);
  const context: ExitContext | null = layout && { pos, layout, transition };

  return (
    <section id="services" ref={ref} className="relative isolate py-12 sm:py-16 ls:py-8 overflow-hidden">

      {/* Soft round glow — same colour as the city animation so it blends seamlessly */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 22%, rgba(254,192,1,0.09), rgba(254,192,1,0.04) 32%, rgba(254,192,1,0) 60%), radial-gradient(circle at 50% 22%, rgba(7,7,16,0.82), rgba(7,7,16,0.6) 20%, rgba(7,7,16,0.34) 40%, rgba(7,7,16,0.15) 60%, rgba(7,7,16,0.05) 76%, rgba(7,7,16,0) 90%)',
        }}
      />

      {/* Decorative background blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#FEC001]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#01BDFE]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#01FEC0]/[0.03] rounded-full blur-2xl pointer-events-none" />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #FEC001 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="relative inline-block">
            <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
              Scooty Transit Platform
            </p>
            <h2 id="solutions-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 tracking-tight">
              Our <span className="text-[#FEC001]">Solutions</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              End-to-end technology platform powering the next generation of urban mobility.
            </p>
          </div>
        </motion.div>

        {/* Tab selector — scrollable on mobile, no wrapping */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-start sm:justify-center gap-2 mb-8 sm:mb-10 overflow-x-auto pb-1 scrollbar-hide"
        >
          {solutions.map((s, i) => (
            <button
              key={i}
              onClick={() => go(shortestStep(active, i, total))}
              aria-pressed={i === active}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 ${
                i === active
                  ? 'text-black'
                  : 'bg-white dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/[0.07]'
              }`}
              style={
                i === active
                  ? { backgroundColor: s.accent, boxShadow: `0 0 20px ${s.accent}55` }
                  : {}
              }
            >
              {s.tag}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Carousel — full bleed, so neighbouring cards are cropped by the viewport edge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby="solutions-heading"
      >
        <div
          ref={stageRef}
          className="relative mx-auto max-w-[1920px] overflow-x-clip min-[1921px]:[mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
          style={{ height: layout && copyH ? layout.activeH : undefined }}
        >
          {layout && (
            <div
              ref={sizerRef}
              aria-hidden
              className="invisible pointer-events-none absolute left-0 top-0 grid"
              style={{ width: layout.copyW }}
            >
              {solutions.map((s) => (
                <div key={s.slug} className="[grid-area:1/1]">
                  <SolutionCopy solution={s} split={layout.split} measure />
                </div>
              ))}
            </div>
          )}

          {context && copyH > 0 && (
            <motion.div
              id="solutions-track"
              className="absolute inset-0 select-none cursor-grab active:cursor-grabbing"
              style={{ x: dragX, touchAction: 'pan-y' }}
              onPointerDownCapture={() => {
                dragged.current = false;
              }}
              onPanStart={() => {
                dragged.current = true;
              }}
              onPan={onPan}
              onPanEnd={onPanEnd}
              onClickCapture={(event) => {
                if (!dragged.current) return;
                event.preventDefault();
                event.stopPropagation();
                dragged.current = false;
              }}
            >
              <AnimatePresence initial={false} custom={context}>
                {slots.map((virtualIndex) => {
                  const index = wrap(virtualIndex, total);
                  return (
                    <SolutionSlide
                      key={virtualIndex}
                      solution={solutions[index]}
                      index={index}
                      total={total}
                      virtualIndex={virtualIndex}
                      offset={virtualIndex - pos}
                      enterOffset={virtualIndex - lastPos.current}
                      context={context}
                      reduceMotion={reduceMotion}
                      onSelect={() => go(virtualIndex - pos)}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-7 sm:mt-9">
            <button type="button" onClick={() => go(-1)} aria-label="Previous solution" aria-controls="solutions-track" className={ARROW}>
              <ArrowLeft className="w-[18px] h-[18px]" />
            </button>

            <div className="flex items-center">
              {solutions.map((s, index) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => go(shortestStep(active, index, total))}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === active ? true : undefined}
                  className="flex items-center h-8 px-1"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${index === active ? '' : 'bg-black/20 dark:bg-white/25'}`}
                    style={{ width: index === active ? 28 : 6, backgroundColor: index === active ? s.accent : undefined }}
                  />
                </button>
              ))}
            </div>

            <button type="button" onClick={() => go(1)} aria-label="Next solution" aria-controls="solutions-track" className={ARROW}>
              <ArrowRight className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announce ? `${solutions[active].tag}, ${active + 1} of ${total}` : ''}
        </p>
      </motion.div>
    </section>
  );
};
