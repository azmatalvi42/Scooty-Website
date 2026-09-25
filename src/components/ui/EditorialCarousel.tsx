import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from 'framer-motion';
import type { PanInfo, Transition } from 'framer-motion';
import { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * The home page's "Our Solutions" carousel, shared so every carousel on the site moves and reads
 * the same: one large card in focus, dimmed neighbours peeking in from the sides, the active
 * card's copy set underneath, and pagination bars. Drag, trackpad swipe, arrow keys, clicking a
 * neighbour and the bars all change slide.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE: Transition = { duration: 0.7, ease: EASE };
const INSTANT = { duration: 0 } as const;
const REVEAL = [0.16, 1, 0.3, 1] as const;

const PHONE_MAX = 768; // one dominant card, with the next one peeking in

type Layout = {
  anchor: number; // left edge of the active card
  gap: number;
  activeW: number;
  activeH: number;
  sideW: number;
  sideH: number;
  radius: number;
  phone: boolean;
};

type Box = { x: number; y: number; width: number; height: number; opacity: number; filter: string };
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

/**
 * Desktop: the active card takes ~62% of the stage, centred, leaving ~18% of each neighbour in view.
 * `fitChrome` (the height of everything else in the section) caps the card so the whole section fits
 * one screen; without it the card keeps `aspect` (height / width). Phones: one dominant card pinned
 * to the gutter, with the next card peeking in on the right.
 */
function computeLayout(width: number, viewportH: number, aspect: number, phoneAspect: number, fitChrome?: number, minHeight = 0, phoneMinHeight = 0): Layout {
  if (width >= PHONE_MAX) {
    const gap = clamp(width * 0.016, 16, 28);
    const activeW = clamp(width * 0.62, 560, 1120);
    const natural = activeW * aspect;
    const activeH = Math.max(minHeight, Math.round(clamp(fitChrome ? Math.min(natural, viewportH - fitChrome) : natural, 230, fitChrome ? 500 : 620)));
    return {
      anchor: (width - activeW) / 2,
      gap,
      activeW,
      activeH,
      sideW: activeW * 0.8,
      sideH: Math.round(activeH * 0.8),
      radius: 28,
      phone: false,
    };
  }
  const gap = 12;
  const activeW = width - 16 - gap - 44;
  const activeH = Math.max(phoneMinHeight, Math.round(activeW * phoneAspect));
  return { anchor: 16, gap, activeW, activeH, sideW: activeW * 0.86, sideH: Math.round(activeH * 0.86), radius: 22, phone: true };
}

/**
 * Where the card `offset` places away from the active one sits on the track, and how it reads: neighbours
 * are darkened (not faded, so the page never shows through). Phones preview only the next card.
 */
function place(layout: Layout, offset: number): Box {
  const { anchor, gap, activeW, sideW, activeH, sideH } = layout;
  if (offset === 0) return { x: anchor, y: 0, width: activeW, height: activeH, opacity: 1, filter: 'brightness(1)' };
  const x =
    offset > 0
      ? anchor + activeW + gap + (offset - 1) * (sideW + gap)
      : anchor + offset * (sideW + gap);
  const shown = Math.abs(offset) === 1 && !(layout.phone && offset < 0);
  return { x, y: (activeH - sideH) / 2, width: sideW, height: sideH, opacity: shown ? 1 : 0, filter: 'brightness(0.55)' };
}

type SlideProps = {
  label: string;
  backdrop: string;
  index: number;
  total: number;
  virtualIndex: number;
  offset: number;
  enterOffset: number;
  context: ExitContext;
  onSelect: () => void;
  children: ReactNode;
};

/** One card: large imagery in a rounded rectangle. Neighbours are smaller and dimmed. */
const Slide = ({ label, backdrop, index, total, virtualIndex, offset, enterOffset, context, onSelect, children }: SlideProps) => {
  const { layout, transition } = context;
  const active = offset === 0;
  // A leaving card glides to wherever its offset now lands, then unmounts. AnimatePresence
  // hands the exit the latest context; the card's own `custom` covers framer's first pass.
  const variants = {
    exit: ({ pos, layout: next, transition: exitTransition }: ExitContext) => ({
      ...place(next, virtualIndex - pos),
      transition: exitTransition,
    }),
  };

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
      aria-label={`${index + 1} of ${total}: ${label}`}
      aria-hidden={active ? undefined : true}
      className={`group/card absolute left-0 top-0 overflow-hidden isolate will-change-transform ${active ? '' : 'cursor-pointer'}`}
      style={{ borderRadius: layout.radius, backgroundColor: backdrop }}
    >
      {children}
    </motion.div>
  );
};

type EditorialCarouselProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  /** Short name, read out for each slide and on slide changes. */
  getLabel: (item: T) => string;
  /** Colour of the active pagination bar. */
  getAccent?: (item: T) => string;
  getBackdrop?: (item: T) => string;
  /** Card contents; `active` is false for the dimmed neighbours. */
  renderSlide: (item: T, active: boolean) => ReactNode;
  /** Copy set under the active card; leave out when the cards carry their own text. */
  renderCaption?: (item: T) => ReactNode;
  /** Controlled slide index, for pages whose own menu picks the slide. */
  active?: number;
  onActiveChange?: (index: number) => void;
  /** Card height / width on desktop, and on phones. */
  aspect?: number;
  phoneAspect?: number;
  /** Floors for the card height, for cards whose text must fit inside them. */
  minHeight?: number;
  phoneMinHeight?: number;
  /** Height of the rest of the section; caps the card so everything fits one screen. */
  fitChrome?: number;
  /** Plays the entrance once the section scrolls into view. */
  revealed?: boolean;
  labelledBy?: string;
  label?: string;
  trackId: string;
};

export function EditorialCarousel<T>({
  items,
  getKey,
  getLabel,
  getAccent = () => '#FEC001',
  getBackdrop = () => '#181916',
  renderSlide,
  renderCaption,
  active: activeProp,
  onActiveChange,
  aspect = 0.46,
  phoneAspect = 0.66,
  minHeight,
  phoneMinHeight,
  fitChrome,
  revealed = true,
  labelledBy,
  label,
  trackId,
}: EditorialCarouselProps<T>) {
  const total = items.length;
  // Unbounded position on the loop; `active` is the slide it lands on.
  const [pos, setPos] = useState(() => activeProp ?? 0);
  const [announce, setAnnounce] = useState(false);
  const active = wrap(pos, total);
  const reduceMotion = useReducedMotion() ?? false;

  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);
  const [viewportH, setViewportH] = useState(() => (typeof window === 'undefined' ? 900 : window.innerHeight));
  const layout = stageWidth ? computeLayout(stageWidth, viewportH, aspect, phoneAspect, fitChrome, minHeight, phoneMinHeight) : null;

  // Only a change of slide animates; resizes snap into place.
  const lastPos = useRef(pos);
  const moved = lastPos.current !== pos;
  useEffect(() => {
    lastPos.current = pos;
  }, [pos]);
  const transition: Transition = reduceMotion || !moved ? INSTANT : SLIDE;

  const go = useCallback((step: number) => {
    if (!step) return;
    setPos((p) => p + step);
    setAnnounce(true);
  }, []);

  // Controlled use: follow the page's menu, and report slides changed from inside the carousel.
  useEffect(() => {
    if (activeProp === undefined) return;
    setPos((p) => p + shortestStep(wrap(p, total), activeProp, total));
  }, [activeProp, total]);
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;
  useEffect(() => {
    onActiveChangeRef.current?.(active);
  }, [active]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      setStageWidth(stage.clientWidth);
      setViewportH(window.innerHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

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
    animate(dragX, 0, { duration: reduceMotion ? 0 : 0.7, ease: [...EASE] });
  };

  const reach = total > 1 ? Math.floor(total / 2) + 1 : 0;
  const slots = Array.from({ length: reach * 2 + 1 }, (_, i) => pos - reach + i);
  const context: ExitContext | null = layout && { pos, layout, transition };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={revealed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15, ease: REVEAL }}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') go(-1);
        else if (event.key === 'ArrowRight') go(1);
      }}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001]/60 rounded-3xl"
    >
      {/* Full bleed, so neighbouring cards are cropped by the viewport edge */}
      <div
        ref={stageRef}
        className="relative mx-auto max-w-[1920px] overflow-x-clip min-[1921px]:[mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
        style={{ height: layout ? layout.activeH : undefined }}
      >
        {context && (
          <motion.div
            id={trackId}
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
                const item = items[index];
                return (
                  <Slide
                    key={virtualIndex}
                    label={getLabel(item)}
                    backdrop={getBackdrop(item)}
                    index={index}
                    total={total}
                    virtualIndex={virtualIndex}
                    offset={virtualIndex - pos}
                    enterOffset={virtualIndex - lastPos.current}
                    context={context}
                    onSelect={() => go(virtualIndex - pos)}
                  >
                    {renderSlide(item, virtualIndex === pos)}
                  </Slide>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Copy for the active card, aligned to its edges; every caption shares one grid cell so the
          block keeps the height of the longest and nothing below jumps when the slide changes. */}
      {layout && renderCaption && (
        <div className="mx-auto mt-5 grid" style={{ width: layout.phone ? stageWidth - 32 : layout.activeW }}>
          {items.map((item, i) => (
            <motion.div
              key={getKey(item)}
              className="[grid-area:1/1]"
              initial={false}
              animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={reduceMotion ? INSTANT : i === active ? { duration: 0.45, delay: 0.2, ease: EASE } : { duration: 0.2 }}
              aria-hidden={i === active ? undefined : true}
              {...inertWhen(i !== active)}
            >
              {renderCaption(item)}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination: the active slide is the longer bar. */}
      {total > 1 && (
        <div className={`flex items-center justify-center ${renderCaption ? 'mt-2' : 'mt-4'}`}>
          {items.map((item, index) => (
            <button
              key={getKey(item)}
              type="button"
              onClick={() => go(shortestStep(active, index, total))}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === active ? true : undefined}
              aria-controls={trackId}
              className="flex items-center h-8 px-1"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-500 ${index === active ? '' : 'bg-black/15 dark:bg-white/20'}`}
                style={{ width: index === active ? 32 : 12, backgroundColor: index === active ? getAccent(item) : undefined }}
              />
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce ? `${getLabel(items[active])}, ${active + 1} of ${total}` : ''}
      </p>
    </motion.div>
  );
}
