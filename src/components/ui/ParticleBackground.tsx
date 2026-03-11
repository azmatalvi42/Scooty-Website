import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  absolute?: boolean;
}

export const ParticleBackground = ({ absolute = false }: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulseOffset: number;
      pulseSpeed: number;
    }> = [];

    let rafId: number;

    const getSize = () => absolute
      ? { w: canvas.parentElement?.offsetWidth ?? window.innerWidth, h: canvas.parentElement?.offsetHeight ?? window.innerHeight }
      : { w: window.innerWidth, h: window.innerHeight };

    const resizeCanvas = () => {
      const { w, h } = getSize();
      canvas.width  = w;
      canvas.height = h;
    };

    const createParticle = () => {
      const { w, h } = getSize();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.45 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.8 + Math.random() * 1.2,
      };
    };

    let time = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const pulse = (Math.sin(time * p.pulseSpeed + p.pulseOffset) + 1) / 2;

        // Core dot
        const coreAlpha = 0.3 + pulse * 0.5;
        const coreSize  = p.size * (0.8 + pulse * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 50, ${coreAlpha * p.opacity})`;
        ctx.fill();

        // Outer glow ring
        const glowRadius = p.size * (1.5 + pulse * 2.5);
        const glowAlpha  = (1 - pulse) * 0.3 * p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 30, ${glowAlpha})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    };

    resizeCanvas();

    const count = absolute ? 40 : 55;
    for (let i = 0; i < count; i++) particles.push(createParticle());

    animate();

    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [absolute]);

  return (
    <canvas
      ref={canvasRef}
      className={`${absolute ? 'absolute' : 'fixed'} inset-0 w-full h-full pointer-events-none`}
      style={{ zIndex: 0 }}
    />
  );
};
