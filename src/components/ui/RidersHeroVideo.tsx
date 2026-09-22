import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { SiteImage } from './SiteImage';

const footage = ['/rider-video.mp4'];

export function RidersHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  const canPlay = footage.length > 0 && !reducedMotion && !failed;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canPlay) return;
    let visible = true;
    const sync = () => {
      if (paused || !visible || document.hidden) video.pause();
      else void video.play().catch(() => setPlaying(false));
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [canPlay, paused, index]);

  return (
    <>
      <SiteImage src="/assets/Riders/riders-page-hero.png" alt="" className="absolute inset-0 w-full h-full object-cover" sizes="100vw" fetchPriority="high" loading="eager" />
      {canPlay && <video
        key={footage[index]}
        ref={videoRef}
        src={footage[index]}
        poster="/assets/Riders/riders-page-hero.png"
        className="absolute inset-0 w-full h-full object-cover"
        muted playsInline loop={footage.length === 1} preload="metadata" aria-hidden="true"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        onEnded={() => setIndex(current => (current + 1) % footage.length)}
      />}
      {canPlay && <button
        type="button"
        className="absolute top-5 right-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/80"
        onClick={() => {
          if (playing) setPaused(true);
          else {
            setPaused(false);
            void videoRef.current?.play().catch(() => setPlaying(false));
          }
        }}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
        {playing ? 'Pause video' : 'Play video'}
      </button>}
    </>
  );
}
