import { useEffect, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  glowR: number;
  r: number; g: number; b: number;
  pulsePhase: number;
  baseAlpha: number;
}

type ArcState = 'drawing' | 'holding' | 'fading';

interface Arc {
  p0x: number; p0y: number;   // start
  p1x: number; p1y: number;   // bezier control
  p2x: number; p2y: number;   // end
  drawProgress: number;        // 0 → 1
  alpha: number;               // overall fade
  state: ArcState;
  drawSpeed: number;
  holdTimer: number;
  holdDuration: number;
  fadeSpeed: number;
  r: number; g: number; b: number;
  lineWidth: number;
  dotT: number;                // traveling dot position along curve
  dotSpeed: number;
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const PALETTE = {
  white:   [255, 255, 255] as const,
  yellow:  [254, 192,   1] as const,   // Scooty brand — used sparingly
  sky:     [  1, 189, 254] as const,   // sky blue
  indigo:  [ 99, 102, 241] as const,   // indigo
  magenta: [200,   0, 220] as const,   // very rare
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

const bez = (t: number, a: number, m: number, z: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * m + t * t * z;

// ─── Component ───────────────────────────────────────────────────────────────

export const NetworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let nodes: Node[] = [];
    let arcs: Arc[] = [];
    let W = 0, H = 0, mobile = false;

    // ── Resize ────────────────────────────────────────────────────────────────
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      mobile = W < 768;
    };

    // ── Node factory ──────────────────────────────────────────────────────────
    const makeNode = (): Node => {
      const angle = Math.random() * Math.PI * 2;
      const speed = rnd(0.08, 0.20);
      const roll  = Math.random();
      const [r, g, b] =
        roll < 0.14 ? PALETTE.yellow :
        roll < 0.34 ? PALETTE.sky    :
        roll < 0.44 ? PALETTE.indigo :
        PALETTE.white;
      return {
        x: rnd(0, W), y: rnd(0, H),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius:    rnd(2, 4),
        glowR:     rnd(20, 42),
        r, g, b,
        pulsePhase: Math.random() * Math.PI * 2,
        baseAlpha:  rnd(0.55, 0.90),
      };
    };

    // ── Arc factory ───────────────────────────────────────────────────────────
    const makeArc = (stagger = 0): Arc => {
      // Start and end: favour spread-out positions (avoid corners)
      const p0x = rnd(0.08, 0.92) * W;
      const p0y = rnd(0.08, 0.92) * H;
      const p2x = rnd(0.08, 0.92) * W;
      const p2y = rnd(0.08, 0.92) * H;

      // Control point: offset perpendicular to chord — creates the arc curve
      const mx  = (p0x + p2x) / 2;
      const my  = (p0y + p2y) / 2;
      const cdx = p2x - p0x;
      const cdy = p2y - p0y;
      const len = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
      const curve = rnd(0.10, 0.30) * (Math.random() < 0.5 ? 1 : -1);
      const p1x = mx + (-cdy / len) * curve * Math.min(W, H);
      const p1y = my + ( cdx / len) * curve * Math.min(W, H) * 0.4;

      // Color distribution — cool tones dominate, yellow extremely rare
      const roll = Math.random();
      const [r, g, b] =
        roll < 0.06 ? PALETTE.yellow  :
        roll < 0.10 ? PALETTE.magenta :
        roll < 0.38 ? PALETTE.indigo  :
        roll < 0.65 ? PALETTE.sky     :
        PALETTE.white;

      const drawDuration = rnd(4.0, 7.0);   // seconds to draw the full arc
      const drawSpeed    = 1 / (drawDuration * 60);

      return {
        p0x, p0y, p1x, p1y, p2x, p2y,
        drawProgress: stagger,
        alpha:        stagger,
        state:        'drawing',
        drawSpeed,
        holdTimer:    0,
        holdDuration: rnd(80, 220),           // frames
        fadeSpeed:    1 / (rnd(2.0, 3.5) * 60),
        r, g, b,
        lineWidth:    rnd(0.3, 0.75),
        dotT:         stagger * 0.4,
        dotSpeed:     rnd(0.0012, 0.0045),
      };
    };

    // ── Draw a bezier up to `progress` ────────────────────────────────────────
    const drawBezierPath = (arc: Arc, progress: number) => {
      const steps = Math.max(2, Math.ceil(progress * 90));
      ctx.beginPath();
      ctx.moveTo(arc.p0x, arc.p0y);
      for (let k = 1; k <= steps; k++) {
        const t = (k / steps) * progress;
        ctx.lineTo(
          bez(t, arc.p0x, arc.p1x, arc.p2x),
          bez(t, arc.p0y, arc.p1y, arc.p2y),
        );
      }
      ctx.stroke();
    };

    // ── Init pools ────────────────────────────────────────────────────────────
    const init = () => {
      const nodeCount = mobile ? 12 : 22;
      const arcCount  = mobile ? 4  : 7;
      nodes = Array.from({ length: nodeCount }, makeNode);
      // Stagger arcs so the canvas isn't empty on first paint
      arcs  = Array.from({ length: arcCount }, (_, i) =>
        makeArc(i / arcCount * 0.65)
      );
    };

    // ── Main loop ─────────────────────────────────────────────────────────────
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // 1 ── Move nodes
      for (const n of nodes) {
        n.x += n.vx;  n.y += n.vy;
        if (n.x < -40)    { n.x = -40;    n.vx *= -1; }
        if (n.x > W + 40) { n.x = W + 40; n.vx *= -1; }
        if (n.y < -40)    { n.y = -40;    n.vy *= -1; }
        if (n.y > H + 40) { n.y = H + 40; n.vy *= -1; }
      }

      // 2 ── Static node-to-node connections (desktop only, very faint)
      if (!mobile) {
        ctx.lineWidth = 0.3;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], nb = nodes[j];
            const dist = Math.hypot(a.x - nb.x, a.y - nb.y);
            if (dist > 300) continue;
            const t = 1 - dist / 300;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle = `rgba(255,255,255,${t * t * 0.12})`;
            ctx.stroke();
          }
        }
      }

      // 3 ── Animated arcs
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < arcs.length; i++) {
        const arc = arcs[i];
        const isYellow = arc.r > 200 && arc.g > 150 && arc.b < 10;

        // State machine
        if (arc.state === 'drawing') {
          arc.drawProgress += arc.drawSpeed;
          arc.alpha = Math.min(1, arc.alpha + arc.drawSpeed * 3.5);
          if (arc.drawProgress >= 1) {
            arc.drawProgress = 1;
            arc.state = 'holding';
          }
        } else if (arc.state === 'holding') {
          if (++arc.holdTimer >= arc.holdDuration) arc.state = 'fading';
        } else {
          arc.alpha -= arc.fadeSpeed;
          if (arc.alpha <= 0) {
            arcs[i] = makeArc();
            continue;
          }
        }

        // Arc line — low opacity, slightly brighter for yellow
        const maxLineOpacity = isYellow ? 0.20 : 0.11;
        ctx.strokeStyle = `rgba(${arc.r},${arc.g},${arc.b},${arc.alpha * maxLineOpacity})`;
        ctx.lineWidth = arc.lineWidth;
        drawBezierPath(arc, arc.drawProgress);

        // Traveling pulse dot
        if (arc.state !== 'fading' && arc.drawProgress > 0.04) {
          arc.dotT += arc.dotSpeed;
          if (arc.dotT >= arc.drawProgress) arc.dotT = 0;

          if (arc.dotT > 0) {
            const dotX = bez(arc.dotT, arc.p0x, arc.p1x, arc.p2x);
            const dotY = bez(arc.dotT, arc.p0y, arc.p1y, arc.p2y);
            const dotA = arc.alpha * 0.88;

            // Soft outer glow
            const grd = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 10);
            grd.addColorStop(0, `rgba(${arc.r},${arc.g},${arc.b},${dotA * 0.4})`);
            grd.addColorStop(1, `rgba(${arc.r},${arc.g},${arc.b},0)`);
            ctx.beginPath();
            ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            // Inner bright core
            ctx.beginPath();
            ctx.arc(dotX, dotY, isYellow ? 2.2 : 1.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${arc.r},${arc.g},${arc.b},${dotA})`;
            ctx.fill();
          }
        }
      }

      // 4 ── Node glows and cores (drawn last, on top)
      for (const n of nodes) {
        const pulse    = 0.80 + 0.20 * Math.sin(n.pulsePhase + frame * 0.013);
        const alpha    = n.baseAlpha * pulse;
        const isYellow = n.r > 200 && n.g > 150 && n.b < 10;

        // Glow halo
        const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.glowR * pulse);
        gr.addColorStop(0,   `rgba(${n.r},${n.g},${n.b},${alpha * 0.22})`);
        gr.addColorStop(0.45,`rgba(${n.r},${n.g},${n.b},${alpha * 0.06})`);
        gr.addColorStop(1,   `rgba(${n.r},${n.g},${n.b},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.glowR * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.r},${n.g},${n.b},${alpha * (isYellow ? 0.92 : 0.52)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    resize();
    init();
    draw();

    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, willChange: 'transform' }}
    />
  );
};
