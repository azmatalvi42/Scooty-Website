import { useEffect, useRef } from 'react';
import { advanceTraffic } from './traffic';
import { createMobilityScene, drawMobilityFlow, drawMobilityMap, prepareMobilitySprites, setSceneLogo, MAP_HEIGHT, MAP_WIDTH } from './scene';

const PLAYBACK_RATE = 3.2;

/** Decorative, locally rendered illustration. No map tiles, location access, or network requests. */
export function MobilityNetwork() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const context = canvas.getContext('2d', { alpha: false });
    const base = document.createElement('canvas');
    const baseContext = base.getContext('2d', { alpha: false });
    if (!context || !baseContext) return;
    const ctx = context;
    const background = baseContext;
    const surface = canvas;
    const container = host;
    const scene = createMobilityScene();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = false;
    let disposed = false;
    let width = 0;
    let height = 0;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let dpr = 1;
    let compact = false;
    let lastFrame = 0;
    let time = 0;

    function draw() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offsetX, dpr * offsetY);
      drawMobilityFlow(ctx, scene, reducedMotion.matches ? 0 : time, compact);
    }

    function tick(now: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || reducedMotion.matches) return;
      const interval = 1000 / (compact ? 30 : 60);
      if (now - lastFrame >= interval) {
        const elapsed = Math.min((now - lastFrame) / 1000, .1) * PLAYBACK_RATE;
        time += elapsed;
        advanceTraffic(scene.traffic, elapsed);
        lastFrame = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (disposed || !width || !height) return;
      if (reducedMotion.matches) draw();
      if (visible && !document.hidden && !reducedMotion.matches) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function resize() {
      if (disposed) return;
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const nextCompact = window.innerWidth < 768;
      // Bound both resolution and total backing-store area on large/retina displays.
      const nextDpr = Math.min(window.devicePixelRatio || 1, nextCompact ? 1.5 : 2, Math.sqrt(1_800_000 / (rect.width * rect.height)));
      if (width === rect.width && height === rect.height && dpr === nextDpr && compact === nextCompact) return;
      width = rect.width;
      height = rect.height;
      compact = nextCompact;
      dpr = nextDpr;
      surface.width = base.width = Math.round(width * dpr);
      surface.height = base.height = Math.round(height * dpr);
      // Cover the full hero while keeping the city and river in view.
      scale = Math.max(width / MAP_WIDTH, height / MAP_HEIGHT) * 1.08;
      offsetX = (width - MAP_WIDTH * scale) / 2;
      offsetY = (height - MAP_HEIGHT * scale) / 2;
      render();
      syncAnimation();
    }

    function render() {
      background.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offsetX, dpr * offsetY);
      drawMobilityMap(background, scene);
      prepareMobilitySprites(scene, dpr * scale);
      draw();
    }

    // GO signage and the SCOOTY blimp use the real logos; re-cache sprites as each one loads.
    const logoImages = ([['go', '/assets/Cities/go-transit-logo.svg'], ['scooty', '/assets/partners-transparent/scooty-horizontal-logo.png']] as const).map(([kind, src]) => {
      const image = new Image();
      image.onload = () => {
        if (disposed) return;
        setSceneLogo(kind, image);
        if (width && height) render();
      };
      image.src = src;
      return image;
    });

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    }, { threshold: 0 });
    resize();
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', syncAnimation);
    reducedMotion.addEventListener('change', syncAnimation);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      disposed = true;
      logoImages.forEach(image => { image.onload = null; });
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncAnimation);
      reducedMotion.removeEventListener('change', syncAnimation);
      window.removeEventListener('resize', resize);
      // Release cached backing-store memory on route changes.
      base.width = base.height = 0;
      scene.sprites.forEach(sprite => { sprite.image.width = sprite.image.height = 0; });
      scene.sprites.clear();
    };
  }, []);

  return (
    <div ref={hostRef} className="editorial-hero-media mobility-network" aria-hidden="true">
      <canvas ref={canvasRef} className="mobility-network-canvas" />
    </div>
  );
}
