import { useEffect, useRef } from 'react';

type LoopVideoProps = {
  /** Path without extension: `<base>.webm`, `<base>.mp4` and `<base>-poster.webp` must all exist. */
  base: string;
  label: string;
  width: number;
  height: number;
  className?: string;
};

/**
 * A silent looping clip used in place of a GIF: a fraction of the download and decode memory. It
 * shows its poster frame until it scrolls into view, plays only while visible, and stays on the
 * poster for people who prefer reduced motion.
 */
export const LoopVideo = ({ base, label, width, height, className = '' }: LoopVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { rootMargin: '200px 0px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      width={width}
      height={height}
      poster={`${base}-poster.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      role="img"
    >
      <source src={`${base}.webm`} type="video/webm" />
      <source src={`${base}.mp4`} type="video/mp4" />
    </video>
  );
};
