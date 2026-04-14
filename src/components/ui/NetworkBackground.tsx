/**
 * NetworkBackground.tsx
 *
 * Premium animated network of nodes connected by lines, flowing along
 * parabolic / sine-wave arcs. Nodes drift slowly (Lissajous path), lines
 * fade with distance, and occasional data-flow particles travel along edges.
 *
 * Renders on <canvas> using requestAnimationFrame at 60 fps.
 * Pauses automatically when the browser tab is hidden (Visibility API).
 * Handles device pixel ratio and window resize cleanly.
 * Mouse position gently repels nearby nodes for a subtle interactive feel.
 *
 * No external dependencies — plain Canvas 2D API only.
 */

import { useEffect, useRef } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse a CSS hex colour into an "r, g, b" string for rgba() calls. */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// ─── Internal types ────────────────────────────────────────────────────────────

interface NetworkNode {
  /** Anchor position (on the sine-arc). Nodes drift around this. */
  homeX: number;
  homeY: number;
  /** Current rendered position (updated each frame). */
  x: number;
  y: number;
  /** Unique phase offset so every node drifts independently. */
  phase: number;
  /** How far (px) the node can drift from its home. */
  driftAmp: number;
  /** How quickly the node completes a drift cycle (Hz-ish). */
  driftFreq: number;
  /** Visual radius of the core dot. */
  radius: number;
}

interface DataParticle {
  fromIdx: number;
  toIdx: number;
  /** Progress along the from→to segment, 0 → 1. */
  t: number;
  /** Speed in progress-units per second. */
  speed: number;
  /** Recent positions for the comet-trail effect. */
  trail: { x: number; y: number }[];
}

// ─── Public props ──────────────────────────────────────────────────────────────

export interface NetworkBackgroundProps {
  /**
   * Override the auto-calculated node count.
   * Auto-mode scales with screen area and caps at 58 for performance.
   */
  nodeCount?: number;
  /**
   * Maximum pixel distance at which two nodes will be connected by a line.
   * @default 155
   */
  lineDistance?: number;
  /**
   * Global speed multiplier.  0.5 = half speed, 2 = double speed.
   * @default 1
   */
  animationSpeed?: number;
  /**
   * Brand accent colour (hex).  Nodes, lines, and particles all share it.
   * @default '#EAB308'
   */
  color?: string;
  /**
   * Canvas element opacity (0–1).
   * Keep this low to avoid distracting from page content.
   * @default 1
   */
  opacity?: number;
  /** Extra Tailwind / CSS classes applied to the <canvas> element. */
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const NetworkBackground = ({
  nodeCount,
  lineDistance = 155,
  animationSpeed = 1,
  color = '#EAB308',
  opacity = 1,
  className = '',
}: NetworkBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pre-compute the "r, g, b" string once — used in every rgba() call.
    const rgb = hexToRgb(color);

    // ── All animation state lives in plain JS variables ────────────────────
    // We deliberately avoid React state/refs for animation data so that
    // the component never triggers a React re-render during the loop.
    let W = 0;
    let H = 0;
    let nodes: NetworkNode[] = [];
    let particles: DataParticle[] = [];
    let mouse = { x: -99999, y: -99999 };
    let rafId = 0;
    let lastTimestamp = 0;
    let elapsed = 0;       // total seconds elapsed (scaled by animationSpeed)
    let active = true;     // false while the browser tab is hidden
    let resizeTimer = 0;

    // ── Canvas initialisation ──────────────────────────────────────────────

    function setup(): void {
      // Honour device pixel ratio (retina / high-DPI screens) up to ×2.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;

      // Resize the canvas backing store, then scale the context so all
      // draw-coordinates stay in logical (CSS) pixels.
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildNodes();
      particles = [];
    }

    // ── Node generation ────────────────────────────────────────────────────
    //
    // Nodes are distributed along multiple sine-wave "arcs" that cross the
    // canvas horizontally.  When the nearby-nodes are connected by lines the
    // resulting web traces the underlying curves, giving the "structured data
    // flow" look instead of random scatter.

    function buildNodes(): void {
      nodes = [];

      // Auto-scale count with screen area; cap to keep the O(n²) line pass fast.
      const count = nodeCount ?? Math.max(18, Math.min(58, Math.floor((W * H) / 17000)));

      // Distribute nodes across several arcs.
      const arcCount = Math.max(3, Math.min(7, Math.round(count / 7)));
      const perArc   = Math.ceil(count / arcCount);

      for (let a = 0; a < arcCount; a++) {
        // Vertical distribution: arcs occupy 10 %–90 % of canvas height.
        const arcT    = arcCount === 1 ? 0.5 : a / (arcCount - 1);
        const centerY = H * (0.1 + arcT * 0.8);

        // Each arc has its own amplitude, frequency, and phase so the arcs
        // cross and interweave rather than just sitting in parallel bands.
        const amp      = H * (0.04 + 0.07 * Math.abs(Math.sin(a * 1.85 + 0.5)));
        const freq     = 0.65 + a * 0.22;         // waves per screen width
        const arcPhase = a * (Math.PI / 2.1);     // horizontal shift

        for (let n = 0; n < perArc; n++) {
          const t  = perArc === 1 ? 0.5 : n / (perArc - 1);
          const hx = W * (0.03 + t * 0.94);
          const hy = centerY + amp * Math.sin(freq * Math.PI * 2 * t + arcPhase);

          nodes.push({
            homeX:     hx,
            homeY:     hy,
            x:         hx,
            y:         hy,
            phase:     Math.random() * Math.PI * 2,
            driftAmp:  6 + Math.random() * 12,
            driftFreq: 0.16 + Math.random() * 0.26,
            radius:    1.3 + Math.random() * 1.1,
          });
        }
      }
    }

    // ── Particle helpers ───────────────────────────────────────────────────

    function spawnParticle(): void {
      // Hard limit on simultaneous particles to keep the look subtle.
      if (particles.length >= 7 || nodes.length < 2) return;

      // Pick a random source node.
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const src     = nodes[fromIdx];
      const lineDSq = lineDistance * lineDistance;

      // Collect all nodes within connection distance as candidate targets.
      const candidates: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIdx) continue;
        const dx = nodes[i].x - src.x;
        const dy = nodes[i].y - src.y;
        if (dx * dx + dy * dy < lineDSq) candidates.push(i);
      }
      if (candidates.length === 0) return;

      const toIdx = candidates[Math.floor(Math.random() * candidates.length)];
      particles.push({
        fromIdx,
        toIdx,
        t:     0,
        speed: (0.28 + Math.random() * 0.36) * animationSpeed,
        trail: [],
      });
    }

    // ── Node drawing ───────────────────────────────────────────────────────
    //
    // Three concentric circles per node:
    //   1. Large, very faint halo   → soft ambient glow
    //   2. Medium semi-transparent  → visible aura
    //   3. Crisp small core dot     → the actual "node"
    //
    // The glow intensity pulses smoothly via a sine driven by elapsed time.

    function drawNode(node: NetworkNode, pulse: number): void {
      const { x, y, radius } = node;
      const g = 0.5 + pulse * 0.5;   // 0.5 → 1.0 intensity

      // Outer halo
      ctx!.beginPath();
      ctx!.arc(x, y, radius * 5.5, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${rgb}, ${0.035 * g})`;
      ctx!.fill();

      // Mid aura
      ctx!.beginPath();
      ctx!.arc(x, y, radius * 2.8, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${rgb}, ${0.11 * g})`;
      ctx!.fill();

      // Core dot
      ctx!.beginPath();
      ctx!.arc(x, y, radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${rgb}, ${0.68 + pulse * 0.32})`;
      ctx!.fill();
    }

    // ── Main animation frame ───────────────────────────────────────────────

    function frame(ts: number): void {
      rafId = requestAnimationFrame(frame);

      // Skip rendering while the tab is hidden (saves CPU/GPU).
      if (!active) return;

      // Delta time in seconds, capped to avoid large jumps after tab-switch.
      const dt = Math.min((ts - lastTimestamp) / 1000, 0.05);
      lastTimestamp = ts;
      elapsed += dt * animationSpeed;

      ctx!.clearRect(0, 0, W, H);

      // ── 1. Update node positions ─────────────────────────────────────────
      //
      // Each node drifts along a Lissajous-like figure-eight around its home
      // position.  The X and Y frequencies are incommensurate (ratio ≈ 1:0.71)
      // so the path never exactly repeats, giving organic motion.

      for (const node of nodes) {
        const t   = elapsed * node.driftFreq;
        node.x = node.homeX + Math.sin(t + node.phase)                 * node.driftAmp;
        node.y = node.homeY + Math.cos(t * 0.71 + node.phase * 1.27)  * node.driftAmp * 0.55;

        // Subtle mouse repulsion — only within 115 px of the cursor.
        const mdx    = node.x - mouse.x;
        const mdy    = node.y - mouse.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        const MOUSE_R = 115;
        if (mDistSq < MOUSE_R * MOUSE_R && mDistSq > 0.01) {
          const mDist = Math.sqrt(mDistSq);
          const force = (1 - mDist / MOUSE_R) * 20;
          node.x += (mdx / mDist) * force;
          node.y += (mdy / mDist) * force;
        }
      }

      // ── 2. Draw connections ──────────────────────────────────────────────
      //
      // Three batched passes with different opacity/weight tiers give a
      // natural depth effect — close connections look stronger than far ones.
      // Batching all lines at the same alpha into a single path means we only
      // call stroke() three times total, no matter how many connections exist.

      const lineDSq = lineDistance * lineDistance;

      const LINE_TIERS: [minSq: number, maxSq: number, alpha: number, width: number][] = [
        [0,              lineDSq * 0.18, 0.34, 0.9],   // very close — crisp
        [lineDSq * 0.18, lineDSq * 0.55, 0.18, 0.65],  // mid range  — medium
        [lineDSq * 0.55, lineDSq,        0.07, 0.45],  // far        — ghost
      ];

      for (const [minSq, maxSq, alpha, width] of LINE_TIERS) {
        ctx!.lineWidth  = width;
        ctx!.strokeStyle = `rgba(${rgb}, ${alpha})`;
        ctx!.beginPath();
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const sq = dx * dx + dy * dy;
            if (sq < minSq || sq >= maxSq) continue;
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
          }
        }
        ctx!.stroke();
      }

      // ── 3. Draw nodes ────────────────────────────────────────────────────
      //
      // Pulse is a smooth 0→1 sine, unique per node so they pulse at different
      // times.  The frequency is a small multiple of driftFreq for coherence.

      for (const node of nodes) {
        const pulse = (Math.sin(elapsed * node.driftFreq * 3.8 + node.phase) + 1) / 2;
        drawNode(node, pulse);
      }

      // ── 4. Update and draw data-flow particles ───────────────────────────
      //
      // Each particle is a bright dot that slides from one node to a connected
      // neighbour.  It leaves a fading comet-trail of recent positions.

      for (let p = particles.length - 1; p >= 0; p--) {
        const particle = particles[p];
        const src = nodes[particle.fromIdx];
        const dst = nodes[particle.toIdx];

        // Advance progress
        particle.t = Math.min(1, particle.t + dt * particle.speed);

        // Current world position (linear lerp — the arc comes from node drift)
        const px = src.x + (dst.x - src.x) * particle.t;
        const py = src.y + (dst.y - src.y) * particle.t;

        // Record position for trail (cap length to avoid unbounded growth)
        particle.trail.push({ x: px, y: py });
        if (particle.trail.length > 16) particle.trail.shift();

        // Draw comet trail — opacity and width grow toward the head
        for (let i = 1; i < particle.trail.length; i++) {
          const frac = i / particle.trail.length;
          ctx!.beginPath();
          ctx!.moveTo(particle.trail[i - 1].x, particle.trail[i - 1].y);
          ctx!.lineTo(particle.trail[i].x, particle.trail[i].y);
          ctx!.strokeStyle = `rgba(${rgb}, ${frac * 0.75})`;
          ctx!.lineWidth   = frac * 2;
          ctx!.stroke();
        }

        // Bright head dot with a small glow halo
        ctx!.beginPath();
        ctx!.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb}, 0.18)`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(px, py, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb}, 1)`;
        ctx!.fill();

        // Remove when the particle reaches its destination
        if (particle.t >= 1) particles.splice(p, 1);
      }

      // ── 5. Occasionally spawn a new particle ────────────────────────────
      // Probability per frame is low (≈ 1.2 % × speed multiplier).
      if (Math.random() < 0.012 * animationSpeed) spawnParticle();
    }

    // ── Event listeners ────────────────────────────────────────────────────

    // Track mouse in canvas-local coordinates.
    // Listening on window ensures we capture movement even when the cursor
    // passes quickly over child elements stacked on top of the canvas.
    const onMouseMove = (e: MouseEvent): void => {
      const rect = canvas!.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      // Only activate repulsion when the cursor is actually over the canvas.
      if (lx >= 0 && lx <= W && ly >= 0 && ly <= H) {
        mouse.x = lx;
        mouse.y = ly;
      } else {
        mouse.x = -99999;
        mouse.y = -99999;
      }
    };

    // Pause animation loop body when the tab is not visible.
    const onVisibilityChange = (): void => {
      active = !document.hidden;
      // Prevent a large dt spike when the tab becomes visible again.
      if (active) lastTimestamp = performance.now();
    };

    // ── ResizeObserver ─────────────────────────────────────────────────────
    // Debounced so rapid resize events (window drag) don't spam setup().

    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 120);
    });

    // ── Bootstrap ─────────────────────────────────────────────────────────

    ro.observe(canvas!);
    setup();

    lastTimestamp = performance.now();
    rafId = requestAnimationFrame(frame);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // ── Cleanup ────────────────────────────────────────────────────────────

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };

    // Re-run effect only when props change — never on render cycles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, nodeCount, lineDistance, animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity, pointerEvents: 'none' }}
    />
  );
};
