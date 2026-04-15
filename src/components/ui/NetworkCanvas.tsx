/**
 * NetworkCanvas.tsx — Animated City Background
 *
 * Top-down city grid with e-scooters, bikes, skateboards and pedestrians
 * moving through the streets. Dark city aesthetic with Scooty yellow accents.
 * Pure Canvas 2D, 60 fps via requestAnimationFrame.
 */

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type VehicleType = 'scooter' | 'bike' | 'skate' | 'person';

interface Vehicle {
  axis:      'h' | 'v';
  fixedPos:  number;                        // y for h-roads, x for v-roads
  laneOff:   number;                        // lane offset from road centre-line
  pos:       number;                        // along-axis position
  vel:       number;                        // px / s, signed
  type:      VehicleType;
  r: number; g: number; b: number;
  len:       number;                        // body length along travel axis
  wid:       number;                        // body width
  trail:     { x: number; y: number }[];
  phase:     number;                        // personal animation phase
}

interface CityWindow {
  x: number; y: number;
  phase: number;
  wr: number; wg: number; wb: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROAD_W = 34;                          // road width in logical px
const LANE   = ROAD_W * 0.25;              // distance from centre to lane centre

// Road positions as fractions of screen dimension
const H_FRACS = [0.13, 0.27, 0.42, 0.56, 0.71, 0.85];
const V_FRACS = [0.09, 0.21, 0.34, 0.50, 0.64, 0.77, 0.90];

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// ─── Component ────────────────────────────────────────────────────────────────

export const NetworkCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    let rafId = 0;
    let lastT = 0;
    let time  = 0;
    let active = true;

    let hRoads:   number[]       = [];
    let vRoads:   number[]       = [];
    let vehicles: Vehicle[]      = [];
    let windows:  CityWindow[]   = [];

    // ── Resize / rebuild ──────────────────────────────────────────────────────

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width  = W;
      canvas!.height = H;
      buildCity();
    }

    function buildCity() {
      hRoads = H_FRACS.map(f => Math.round(f * H));
      vRoads = V_FRACS.map(f => Math.round(f * W));
      buildWindows();
      buildVehicles();
    }

    // ── Building windows ──────────────────────────────────────────────────────
    //
    // Scatter tiny lit-window pixels throughout the building blocks.
    // We reject positions that fall on a road.

    function buildWindows() {
      windows = [];
      const half = ROAD_W / 2 + 2;
      const density = Math.floor(W * H / 5500);

      for (let i = 0; i < density; i++) {
        const wx = rnd(0, W);
        const wy = rnd(0, H);

        const onH = hRoads.some(ry => Math.abs(wy - ry) < half);
        const onV = vRoads.some(rx => Math.abs(wx - rx) < half);
        if (onH || onV) continue;

        const roll = Math.random();
        const [wr, wg, wb] =
          roll < 0.05 ? [253, 192,   2] :  // Scooty yellow (rare)
          roll < 0.40 ? [255, 218, 120] :  // warm cream
          roll < 0.70 ? [180, 210, 255] :  // cool blue
                        [255, 185,  80];   // amber

        windows.push({ x: wx, y: wy, phase: rnd(0, Math.PI * 2), wr, wg, wb });
      }
    }

    // ── Vehicle pool ──────────────────────────────────────────────────────────

    function buildVehicles() {
      vehicles = [];

      const typePool: VehicleType[] = [
        'scooter', 'scooter', 'scooter', 'scooter',
        'bike',    'bike',    'bike',
        'skate',   'skate',
        'person',
      ];

      const colors: Record<VehicleType, [number, number, number]> = {
        scooter: [253, 192,   2],
        bike:    [  0, 205, 240],
        skate:   [175,  70, 255],
        person:  [175, 210, 255],
      };

      const sizes: Record<VehicleType, [number, number]> = {
        scooter: [15, 5],
        bike:    [14, 4],
        skate:   [10, 4],
        person:  [ 4, 4],
      };

      const addVehicles = (axis: 'h' | 'v', fixedPos: number, screenLen: number) => {
        const count = Math.floor(rnd(3, 6));
        for (let i = 0; i < count; i++) {
          const type  = typePool[Math.floor(Math.random() * typePool.length)];
          const [r, g, b] = colors[type];
          const [len, wid] = sizes[type];
          const dir   = Math.random() < 0.5 ? 1 : -1;
          const speed = type === 'person' ? rnd(16, 32) : rnd(55, 115);
          const laneOff = type === 'person'
            ? dir * ROAD_W * 0.38
            : dir * LANE;

          vehicles.push({
            axis, fixedPos, laneOff,
            pos:   rnd(0, screenLen),
            vel:   speed * dir,
            type, r, g, b, len, wid,
            trail: [],
            phase: rnd(0, Math.PI * 2),
          });
        }
      };

      for (const ry of hRoads) addVehicles('h', ry, W);
      for (const rx of vRoads) addVehicles('v', rx, H);
    }

    // ── Drawing: city layers ──────────────────────────────────────────────────

    function drawRoads() {
      // Buildings
      ctx!.fillStyle = '#08080e';
      ctx!.fillRect(0, 0, W, H);

      // Road surfaces
      ctx!.fillStyle = '#111119';
      for (const ry of hRoads) ctx!.fillRect(0, ry - ROAD_W / 2, W, ROAD_W);
      for (const rx of vRoads) ctx!.fillRect(rx - ROAD_W / 2, 0, ROAD_W, H);

      // Intersection fills (clean overlapping corners)
      for (const ry of hRoads)
        for (const rx of vRoads)
          ctx!.fillRect(rx - ROAD_W / 2, ry - ROAD_W / 2, ROAD_W, ROAD_W);
    }

    function drawMarkings() {
      const dashLen = 15, dashGap = 13;
      const offset  = (time * 22) % (dashLen + dashGap);

      ctx!.setLineDash([dashLen, dashGap]);
      ctx!.lineWidth = 0.8;

      // Centre dashes — Scooty yellow
      ctx!.strokeStyle = 'rgba(253,192,2,0.20)';
      for (const ry of hRoads) {
        ctx!.lineDashOffset = -offset;
        ctx!.beginPath();
        ctx!.moveTo(0, ry);
        ctx!.lineTo(W, ry);
        ctx!.stroke();
      }
      for (const rx of vRoads) {
        ctx!.lineDashOffset = -offset;
        ctx!.beginPath();
        ctx!.moveTo(rx, 0);
        ctx!.lineTo(rx, H);
        ctx!.stroke();
      }
      ctx!.setLineDash([]);

      // Kerb lines — faint white
      ctx!.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx!.lineWidth   = 0.5;
      for (const ry of hRoads) {
        for (const off of [-ROAD_W / 2, ROAD_W / 2]) {
          ctx!.beginPath();
          ctx!.moveTo(0, ry + off);
          ctx!.lineTo(W, ry + off);
          ctx!.stroke();
        }
      }
      for (const rx of vRoads) {
        for (const off of [-ROAD_W / 2, ROAD_W / 2]) {
          ctx!.beginPath();
          ctx!.moveTo(rx + off, 0);
          ctx!.lineTo(rx + off, H);
          ctx!.stroke();
        }
      }
    }

    function drawCrosswalks() {
      const sw = 3, sg = 4, sh = ROAD_W * 0.42;
      ctx!.fillStyle = 'rgba(255,255,255,0.065)';

      for (let hi = 0; hi < hRoads.length; hi++) {
        for (let vi = 0; vi < vRoads.length; vi++) {
          if ((hi + vi) % 2 !== 0) continue;
          const ry = hRoads[hi], rx = vRoads[vi];

          for (let s = 0; s < 4; s++) {
            // left of intersection
            const lx = rx - ROAD_W / 2 - (sw + sg) * (s + 1);
            if (lx > 0) ctx!.fillRect(lx, ry - sh / 2, sw, sh);
            // right
            const rx2 = rx + ROAD_W / 2 + (sw + sg) * s;
            if (rx2 + sw < W) ctx!.fillRect(rx2, ry - sh / 2, sw, sh);
            // above
            const ty = ry - ROAD_W / 2 - (sw + sg) * (s + 1);
            if (ty > 0) ctx!.fillRect(rx - sh / 2, ty, sh, sw);
            // below
            const by = ry + ROAD_W / 2 + (sw + sg) * s;
            if (by + sw < H) ctx!.fillRect(rx - sh / 2, by, sh, sw);
          }
        }
      }
    }

    function drawIntersectionGlow() {
      for (const ry of hRoads) {
        for (const rx of vRoads) {
          const g = ctx!.createRadialGradient(rx, ry, 0, rx, ry, 48);
          g.addColorStop(0, 'rgba(255,178,45,0.065)');
          g.addColorStop(1, 'rgba(255,178,45,0)');
          ctx!.beginPath();
          ctx!.arc(rx, ry, 48, 0, Math.PI * 2);
          ctx!.fillStyle = g;
          ctx!.fill();
        }
      }
    }

    function drawWindows() {
      for (const w of windows) {
        // Slow, independent flicker per window
        const flicker = 0.55 + 0.45 * Math.sin(w.phase + time * (0.25 + w.phase * 0.15));
        const alpha   = 0.10 + flicker * 0.22;
        ctx!.fillStyle = `rgba(${w.wr},${w.wg},${w.wb},${alpha})`;
        ctx!.fillRect(w.x - 1, w.y - 1, 2, 2);
      }
    }

    // ── Drawing: vehicle shapes ───────────────────────────────────────────────
    //
    // All shapes are drawn in local space with the vehicle facing +x (right).
    // The caller applies ctx.translate + ctx.rotate before calling these.

    function drawScooter(len: number, wid: number, r: number, g: number, b: number, pulse: number) {
      const a  = 0.78 + pulse * 0.22;
      const rc = `rgba(${r},${g},${b},${a})`;
      const rd = `rgba(${Math.round(r * 0.45)},${Math.round(g * 0.45)},${Math.round(b * 0.45)},${a})`;

      // Deck
      ctx!.fillStyle = rc;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.42, -wid * 0.28, len * 0.84, wid * 0.56, 2);
      ctx!.fill();

      // Stem (rear-to-handlebar, at front of scooter = +x side)
      ctx!.fillStyle = rc;
      ctx!.fillRect(len * 0.22, -wid * 0.9, wid * 0.38, wid * 0.9);

      // Handlebar cross-bar
      ctx!.fillRect(len * 0.04, -wid * 1.05, wid * 1.35, wid * 0.28);

      // Wheels
      ctx!.fillStyle = rd;
      ctx!.beginPath();
      ctx!.arc(-len * 0.33, 0, wid * 0.46, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc( len * 0.33, 0, wid * 0.46, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawBike(len: number, wid: number, r: number, g: number, b: number, pulse: number) {
      const a  = 0.68 + pulse * 0.28;
      const s  = `rgba(${r},${g},${b},${a})`;
      ctx!.lineCap = 'round';

      // Frame
      ctx!.strokeStyle = s;
      ctx!.lineWidth   = wid * 0.28;
      ctx!.beginPath();
      ctx!.moveTo(-len * 0.37, 0);
      ctx!.lineTo(0, -wid * 0.55);
      ctx!.lineTo( len * 0.37, 0);
      ctx!.stroke();

      // Wheels
      ctx!.lineWidth = wid * 0.28;
      ctx!.beginPath();
      ctx!.arc(-len * 0.37, 0, wid * 0.62, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc( len * 0.37, 0, wid * 0.62, 0, Math.PI * 2);
      ctx!.stroke();

      // Handlebar
      ctx!.lineWidth = wid * 0.22;
      ctx!.beginPath();
      ctx!.moveTo(len * 0.22, -wid * 0.52);
      ctx!.lineTo(len * 0.48, -wid * 0.20);
      ctx!.stroke();
    }

    function drawSkate(len: number, wid: number, r: number, g: number, b: number, pulse: number) {
      const a  = 0.68 + pulse * 0.28;
      const rd = `rgba(${Math.round(r * 0.55)},${Math.round(g * 0.55)},${Math.round(b * 0.55)},${a})`;

      // Board
      ctx!.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.46, -wid * 0.30, len * 0.92, wid * 0.60, 2.5);
      ctx!.fill();

      // Trucks (axles)
      ctx!.fillStyle = rd;
      ctx!.fillRect(-len * 0.30 - 0.4, -wid * 0.52, 0.8, wid * 1.04);
      ctx!.fillRect( len * 0.30 - 0.4, -wid * 0.52, 0.8, wid * 1.04);

      // Wheels (four corners)
      ctx!.fillStyle = `rgba(190,190,200,${a * 0.75})`;
      for (const [wx, wy] of [
        [-len * 0.30, -wid * 0.54],
        [-len * 0.30,  wid * 0.54],
        [ len * 0.30, -wid * 0.54],
        [ len * 0.30,  wid * 0.54],
      ]) {
        ctx!.beginPath();
        ctx!.arc(wx, wy, wid * 0.36, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawPerson(wid: number, r: number, g: number, b: number, pulse: number) {
      const a = 0.55 + pulse * 0.35;
      // Body
      ctx!.beginPath();
      ctx!.arc(0, wid * 0.22, wid * 0.52, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${r},${g},${b},${a * 0.65})`;
      ctx!.fill();
      // Head
      ctx!.beginPath();
      ctx!.arc(0, -wid * 0.42, wid * 0.38, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx!.fill();
    }

    // ── Drawing: vehicle composite (trail + glow + body) ─────────────────────

    function drawVehicle(v: Vehicle) {
      const cx = v.axis === 'h' ? v.pos               : v.fixedPos + v.laneOff;
      const cy = v.axis === 'h' ? v.fixedPos + v.laneOff : v.pos;

      // Trail recording
      const TRAIL_MAX = v.type === 'person' ? 5 : 15;
      v.trail.push({ x: cx, y: cy });
      if (v.trail.length > TRAIL_MAX) v.trail.shift();

      // Trail drawing
      if (v.trail.length > 1) {
        ctx!.lineCap = 'round';
        for (let i = 1; i < v.trail.length; i++) {
          const frac = i / v.trail.length;
          ctx!.beginPath();
          ctx!.moveTo(v.trail[i - 1].x, v.trail[i - 1].y);
          ctx!.lineTo(v.trail[i].x,     v.trail[i].y);
          ctx!.strokeStyle = `rgba(${v.r},${v.g},${v.b},${frac * 0.16})`;
          ctx!.lineWidth   = frac * v.wid * 0.38;
          ctx!.stroke();
        }
      }

      // Headlight glow (in front of vehicle)
      if (v.type !== 'person') {
        const sign = v.vel > 0 ? 1 : -1;
        const fx   = v.axis === 'h' ? cx + sign * v.len * 0.6 : cx;
        const fy   = v.axis === 'v' ? cy + sign * v.len * 0.6 : cy;
        const gr   = ctx!.createRadialGradient(fx, fy, 0, fx, fy, v.len);
        gr.addColorStop(0, `rgba(${v.r},${v.g},${v.b},0.24)`);
        gr.addColorStop(1, `rgba(${v.r},${v.g},${v.b},0)`);
        ctx!.beginPath();
        ctx!.arc(fx, fy, v.len, 0, Math.PI * 2);
        ctx!.fillStyle = gr;
        ctx!.fill();
      }

      // Body
      const angle =
        v.axis === 'h'
          ? (v.vel > 0 ? 0 : Math.PI)
          : (v.vel > 0 ? Math.PI / 2 : -Math.PI / 2);

      const pulse = (Math.sin(time * 2.2 + v.phase) + 1) / 2;

      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(angle);

      switch (v.type) {
        case 'scooter': drawScooter(v.len, v.wid, v.r, v.g, v.b, pulse); break;
        case 'bike':    drawBike(   v.len, v.wid, v.r, v.g, v.b, pulse); break;
        case 'skate':   drawSkate(  v.len, v.wid, v.r, v.g, v.b, pulse); break;
        case 'person':  drawPerson(        v.wid, v.r, v.g, v.b, pulse); break;
      }

      ctx!.restore();
    }

    // ── Main loop ─────────────────────────────────────────────────────────────

    function frame(ts: number) {
      rafId = requestAnimationFrame(frame);
      if (!active) return;

      const dt = Math.min((ts - lastT) / 1000, 0.05);
      lastT  = ts;
      time  += dt;

      ctx!.clearRect(0, 0, W, H);

      // Static city layers
      drawRoads();
      drawMarkings();
      drawCrosswalks();
      drawIntersectionGlow();
      drawWindows();

      // Vehicles
      for (const v of vehicles) {
        const limit = v.axis === 'h' ? W : H;
        v.pos += v.vel * dt;

        if (v.vel > 0 && v.pos >  limit + v.len) { v.pos = -v.len;        v.trail = []; }
        if (v.vel < 0 && v.pos < -v.len)          { v.pos =  limit + v.len; v.trail = []; }

        drawVehicle(v);
      }
    }

    // ── Bootstrap ─────────────────────────────────────────────────────────────

    resize();
    lastT  = performance.now();
    rafId  = requestAnimationFrame(frame);

    const onResize = () => resize();
    const onVis    = () => {
      active = !document.hidden;
      if (active) lastT = performance.now();
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, willChange: 'transform' }}
    />
  );
};
