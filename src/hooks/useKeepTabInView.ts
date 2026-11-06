import { useEffect, useRef } from 'react';

/**
 * For a tab strip that scrolls sideways on narrow screens: keeps the active tab in view when a swipe
 * on the carousel below changes it. Scrolls only the strip; scrollIntoView could also move the page.
 */
export function useKeepTabInView<T extends HTMLElement>(active: number) {
  const stripRef = useRef<T>(null);
  const previous = useRef(active);

  useEffect(() => {
    if (previous.current === active) return;
    previous.current = active;
    const strip = stripRef.current;
    const tab = strip?.querySelectorAll('button')[active];
    if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) return;
    const stripBox = strip.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    strip.scrollTo({
      left: strip.scrollLeft + tabBox.left - stripBox.left - (stripBox.width - tabBox.width) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [active]);

  return stripRef;
}
