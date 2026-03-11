/**
 * MobilityBackground
 * Canvas-based animated transit-flow visualization.
 * Drop behind any dark section — pointer-events: none, fully transparent bg.
 */
import { useEffect, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Node {
  x: number;
  y: number;
  size: number;
  pulse: number;       // current phase (radians)
  pulseSpeed: number;  // rad/s
}

interface Particle {
  t: number;           // 0-1 along the arc
  speed: number;       // t-units per ms
  size: number;
  opacity: number;
}

interface Arc {
  nodeA: number;
  nodeB: number;
  cpX: number;         // quadratic bezier control point
  cpY: number;
  r: number; g: number; b: number; // colour components
  lineOpacity: number;
  particles: Particle[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const rnd = (lo: number, hi: number) => Math.random() * (hi - lo) + lo;

/** Point on quadratic bezier at parameter t */
const qbez = (t: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
  const mt = 1 - t;
  return {
    x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
    y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

interface MobilityBackgroundProps {
  /** 0-1 overall canvas opacity (default 0.85) */
  opacity?: number;
}

export const MobilityBackground = ({ opacity = 0.85 }: MobilityBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ── Responsive sizing ───────────────────────────────────────────────── */
    const mobile = window.innerWidth < 768;
    const dpr    = Math.min(window.devicePixelRatio ?? 1, 2);

    let W = 0, H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* ── Scene parameters ────────────────────────────────────────────────── */
    const NODE_COUNT     = mobile ? 9 : 20;
    const ARC_COUNT      = mobile ? 14 : 36;
    const PARTICLES_PER  = mobile ? 1  : 2;
    const GRID_STEP      = mobile ? 90 : 70;

    /* ── Arc colour palette ─────────────────────────────────────────────── */
    // Blue family + pink/rose family — matches the "urban mobility data" brief
    const PALETTE: [number, number, number][] = [
      [56,  189, 248],  // sky-blue
      [99,  102, 241],  // indigo
      [59,  130, 246],  // blue
      [236,  72, 153],  // pink
      [251, 113, 133],  // rose
      [167,  139, 250], // violet
    ];

    /* ── Generate nodes ─────────────────────────────────────────────────── */
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x:          rnd(0.04 * W, 0.96 * W),
      y:          rnd(0.04 * H, 0.96 * H),
      size:       rnd(2.2, 4.8),
      pulse:      rnd(0, Math.PI * 2),
      pulseSpeed: rnd(0.15, 0.4),
    }));

    /* ── Generate arcs ──────────────────────────────────────────────────── */
    const arcs: Arc[] = Array.from({ length: ARC_COUNT }, (_, i) => {
      let a = Math.floor(rnd(0, NODE_COUNT));
      let b = Math.floor(rnd(0, NODE_COUNT));
      while (b === a) b = Math.floor(rnd(0, NODE_COUNT));

      const na = nodes[a], nb = nodes[b];

      // Midpoint + perpendicular offset → natural curved route
      const mx = (na.x + nb.x) / 2;
      const my = (na.y + nb.y) / 2;
      const dx = nb.x - na.x;
      const dy = nb.y - na.y;
      const len = Math.hypot(dx, dy) || 1;
      const bow = rnd(-0.45, 0.45) * len;
      const cpX = mx + (-dy / len) * bow;
      const cpY = my + ( dx / len) * bow;

      const [r, g, b_] = PALETTE[i % PALETTE.length];

      const particles: Particle[] = Array.from({ length: PARTICLES_PER }, () => ({
        t:       rnd(0, 1),
        speed:   rnd(0.00008, 0.00018),   // t-units per ms
        size:    rnd(1.8, 3.2),
        opacity: rnd(0.65, 1),
      }));

      return { nodeA: a, nodeB: b, cpX, cpY, r, g, b: b_, lineOpacity: rnd(0.08, 0.22), particles };
    });

    /* ── Draw grid ──────────────────────────────────────────────────────── */
    const drawGrid = () => {
      ctx.save();
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.18)';
      ctx.lineWidth   = 0.5;
      ctx.shadowBlur  = 0;
      for (let x = 0; x < W; x += GRID_STEP) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID_STEP) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();
    };

    /* ── Animation loop ─────────────────────────────────────────────────── */
    let prevTime = 0;

    const frame = (now: number) => {
      const dt = Math.min(now - prevTime, 50); // cap delta — avoids big jumps
      prevTime = now;

      ctx.clearRect(0, 0, W, H);

      drawGrid();

      /* Arc lines + particles */
      for (const arc of arcs) {
        const na = nodes[arc.nodeA];
        const nb = nodes[arc.nodeB];

        // Faint arc line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(arc.cpX, arc.cpY, nb.x, nb.y);
        ctx.strokeStyle = `rgba(${arc.r},${arc.g},${arc.b},${arc.lineOpacity})`;
        ctx.lineWidth   = 0.9;
        ctx.shadowBlur  = 0;
        ctx.stroke();
        ctx.restore();

        // Moving particles along arc
        for (const p of arc.particles) {
          p.t += p.speed * dt;
          if (p.t > 1) p.t -= 1;

          const pt = qbez(p.t, na.x, na.y, arc.cpX, arc.cpY, nb.x, nb.y);

          ctx.save();
          ctx.shadowBlur  = 10;
          ctx.shadowColor = `rgba(${arc.r},${arc.g},${arc.b},0.9)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${arc.r},${arc.g},${arc.b},${p.opacity})`;
          ctx.fill();
          ctx.restore();
        }
      }

      /* Pulsing nodes (yellow/amber — transit stops) */
      const t = now * 0.001;
      for (const node of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(t * node.pulseSpeed + node.pulse);
        const r     = node.size * (1 + 0.35 * pulse);

        // Soft outer halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234,179,8,${0.025 + 0.04 * pulse})`;
        ctx.fill();
        ctx.restore();

        // Core dot with glow
        ctx.save();
        ctx.shadowBlur  = 14;
        ctx.shadowColor = `rgba(234,179,8,0.9)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234,179,8,${0.55 + 0.45 * pulse})`;
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    /* ── Resize observer ────────────────────────────────────────────────── */
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ opacity, pointerEvents: 'none', zIndex: 0 }}
    />
  );
};
