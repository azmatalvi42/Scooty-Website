import { useEffect, useState } from 'react';

const SECTION_IDS = ['home', 'services', 'riders', 'impact', 'about'];
const LOCK_MS         = 950;   // wait after a snap before the next one fires
const WHEEL_THRESHOLD = 15;    // ignore micro-movements (trackpad settle)
const TOUCH_THRESHOLD = 55;    // minimum swipe distance on touch screens

export const useSectionSnap = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout>;
    let touchStartY = 0;

    // ── Helpers ───────────────────────────────────────────────────────────────

    const getSections = (): HTMLElement[] =>
      SECTION_IDS
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

    /** Index of whichever section top is closest to the viewport top edge. */
    const getNearestIndex = (sections: HTMLElement[]): number => {
      let best = 0, bestDist = Infinity;
      sections.forEach((el, i) => {
        const dist = Math.abs(el.getBoundingClientRect().top);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    };

    const snapTo = (el: HTMLElement, idx: number) => {
      locked = true;
      setCurrentIndex(idx);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { locked = false; }, LOCK_MS);
    };

    const trySnap = (direction: 1 | -1) => {
      const sections = getSections();
      const idx = getNearestIndex(sections);
      const nextIdx = idx + direction;
      if (nextIdx >= 0 && nextIdx < sections.length) {
        snapTo(sections[nextIdx], nextIdx);
        return true; // snapped — caller should preventDefault
      }
      return false;
    };

    // ── Scroll position tracker (keeps pills in sync on free scroll) ──────────

    const onScroll = () => {
      const sections = getSections();
      setCurrentIndex(getNearestIndex(sections));
    };

    // ── Wheel ─────────────────────────────────────────────────────────────────

    const onWheel = (e: WheelEvent) => {
      if (locked) { e.preventDefault(); return; }
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      const snapped = trySnap(e.deltaY > 0 ? 1 : -1);
      if (snapped) e.preventDefault();
      // If we're past the last section, don't preventDefault so the
      // footer remains reachable via natural scroll.
    };

    // ── Touch ─────────────────────────────────────────────────────────────────

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (locked) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return; // too short a swipe
      trySnap(deltaY > 0 ? 1 : -1);
    };

    // ── Keyboard ──────────────────────────────────────────────────────────────

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const isDown = e.key === 'ArrowDown' || e.key === 'PageDown';
      const isUp   = e.key === 'ArrowUp'   || e.key === 'PageUp';
      if (!isDown && !isUp) return;
      e.preventDefault();
      if (!locked) trySnap(isDown ? 1 : -1);
    };

    // ── Mount ─────────────────────────────────────────────────────────────────

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    window.addEventListener('keydown',    onKey);
    window.addEventListener('scroll',     onScroll,     { passive: true  });

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('keydown',    onKey);
      window.removeEventListener('scroll',     onScroll);
      clearTimeout(lockTimer);
    };
  }, []);

  return { currentIndex };
};

export const SNAP_SECTIONS = SECTION_IDS;
