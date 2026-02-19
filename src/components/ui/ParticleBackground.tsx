import { useEffect, useRef } from 'react';

export const ParticleBackground = () => {
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
      pulseOffset: number;   // where in the pulse cycle this dot starts
      pulseSpeed: number;    // how fast it pulses
    }> = [];

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulseOffset: Math.random() * Math.PI * 2,
      pulseSpeed: 0.8 + Math.random() * 1.2,
    });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps tick
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Pulse factor: oscillates 0 → 1 → 0
        const pulse = (Math.sin(time * p.pulseSpeed + p.pulseOffset) + 1) / 2;

        // Core dot — warm yellow
        const coreAlpha = 0.3 + pulse * 0.5;
        const coreSize = p.size * (0.8 + pulse * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 50, ${coreAlpha * p.opacity})`;
        ctx.fill();

        // Outer glow ring — expands and fades
        const glowRadius = p.size * (1.5 + pulse * 2.5);
        const glowAlpha = (1 - pulse) * 0.25 * p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 30, ${glowAlpha})`;
        ctx.fill();

        // Connection lines — faint golden
        for (let i = index + 1; i < particles.length; i++) {
          const other = particles[i];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(255, 200, 50, ${0.08 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();

    for (let i = 0; i < 55; i++) {
      particles.push(createParticle());
    }

    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
