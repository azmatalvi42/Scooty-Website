/**
 * NetworkCanvas.tsx — Animated City Background
 *
 * Top-down city grid with cars, e-scooters and bikes moving through wide
 * realistic roads. Pure Canvas 2D, 60 fps via requestAnimationFrame.
 */

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type VehicleType = 'car' | 'scooter' | 'bike';

interface Vehicle {
  axis:      'h' | 'v';
  fixedPos:  number;
  laneOff:   number;
  pos:       number;
  vel:       number;
  type:      VehicleType;
  r: number; g: number; b: number;
  len:       number;
  wid:       number;
  trail:     { x: number; y: number }[];
  phase:     number;
}

interface CityWindow {
  x: number; y: number;
  phase: number;
  wr: number; wg: number; wb: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROAD_W = 64;                          // wider, more realistic roads
const LANE   = ROAD_W * 0.24;               // lane centre offset from road centre

// Sparser grid — fewer roads, more breathing room
const H_FRACS = [0.22, 0.50, 0.78];
const V_FRACS = [0.14, 0.38, 0.62, 0.86];

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// Muted, realistic car colours
const CAR_PALETTE: [number, number, number][] = [
  [220, 222, 230],  // pale silver
  [180, 184, 196],  // soft grey
  [120, 128, 144],  // slate
  [ 60,  72,  92],  // dark blue-grey
  [ 90,  60,  70],  // muted maroon
  [200, 180, 130],  // sand
];

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

    // ── Building windows — sparse, calm ──────────────────────────────────────

    function buildWindows() {
      windows = [];
      const half = ROAD_W / 2 + 3;
      const density = Math.floor(W * H / 16000);

      for (let i = 0; i < density; i++) {
        const wx = rnd(0, W);
        const wy = rnd(0, H);

        const onH = hRoads.some(ry => Math.abs(wy - ry) < half);
        const onV = vRoads.some(rx => Math.abs(wx - rx) < half);
        if (onH || onV) continue;

        const roll = Math.random();
        const [wr, wg, wb] =
          roll < 0.06 ? [253, 192,   2] :
          roll < 0.45 ? [255, 218, 130] :
          roll < 0.75 ? [180, 210, 255] :
                        [255, 190,  95];

        windows.push({ x: wx, y: wy, phase: rnd(0, Math.PI * 2), wr, wg, wb });
      }
    }

    // ── Vehicle pool ──────────────────────────────────────────────────────────

    function buildVehicles() {
      vehicles = [];

      const typePool: VehicleType[] = [
        'car', 'car', 'car', 'car', 'car',
        'scooter', 'scooter', 'scooter',
        'bike',    'bike',
      ];

      const sizes: Record<VehicleType, [number, number]> = {
        car:     [30, 13],
        scooter: [20,  6],
        bike:    [18,  5],
      };

      const speed: Record<VehicleType, [number, number]> = {
        car:     [70, 130],
        scooter: [55, 100],
        bike:    [40,  75],
      };

      const colorFor = (t: VehicleType): [number, number, number] => {
        if (t === 'car')     return pick(CAR_PALETTE);
        if (t === 'scooter') return [253, 192, 2];
        return [0, 205, 240];
      };

      const addVehicles = (axis: 'h' | 'v', fixedPos: number, screenLen: number) => {
        const count = Math.floor(rnd(2, 4));
        for (let i = 0; i < count; i++) {
          const type   = pick(typePool);
          const [r, g, b] = colorFor(type);
          const [len, wid] = sizes[type];
          const dir    = Math.random() < 0.5 ? 1 : -1;
          const [s0, s1] = speed[type];
          const vel    = rnd(s0, s1) * dir;
          const laneOff = dir * LANE;

          vehicles.push({
            axis, fixedPos, laneOff,
            pos:   rnd(0, screenLen),
            vel,
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
      // Buildings / base
      ctx!.fillStyle = '#08080e';
      ctx!.fillRect(0, 0, W, H);

      // Asphalt
      ctx!.fillStyle = '#1a1a22';
      for (const ry of hRoads) ctx!.fillRect(0, ry - ROAD_W / 2, W, ROAD_W);
      for (const rx of vRoads) ctx!.fillRect(rx - ROAD_W / 2, 0, ROAD_W, H);

      // Intersection fills
      for (const ry of hRoads)
        for (const rx of vRoads)
          ctx!.fillRect(rx - ROAD_W / 2, ry - ROAD_W / 2, ROAD_W, ROAD_W);
    }

    function drawMarkings() {
      // Solid kerb edges
      ctx!.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx!.lineWidth   = 1;
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

      // Dashed centre line — slow drift for life
      const dashLen = 22, dashGap = 18;
      const offset  = (time * 18) % (dashLen + dashGap);
      ctx!.setLineDash([dashLen, dashGap]);
      ctx!.lineWidth   = 1.4;
      ctx!.strokeStyle = 'rgba(255,225,140,0.32)';

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
    }

    function drawWindows() {
      for (const w of windows) {
        const flicker = 0.55 + 0.45 * Math.sin(w.phase + time * (0.25 + w.phase * 0.15));
        const alpha   = 0.08 + flicker * 0.18;
        ctx!.fillStyle = `rgba(${w.wr},${w.wg},${w.wb},${alpha})`;
        ctx!.fillRect(w.x - 1, w.y - 1, 2, 2);
      }
    }

    // ── Drawing: vehicle shapes (face +x) ────────────────────────────────────

    function drawCar(len: number, wid: number, r: number, g: number, b: number) {
      const a    = 0.92;
      const body = `rgba(${r},${g},${b},${a})`;
      const tint = `rgba(${Math.round(r * 0.35)},${Math.round(g * 0.35)},${Math.round(b * 0.4)},${a})`;
      const glass = `rgba(20,28,40,0.78)`;

      // Body shell
      ctx!.fillStyle = body;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len, wid, 3.2);
      ctx!.fill();

      // Side trim (subtle darker outline along the long edges)
      ctx!.strokeStyle = tint;
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len, wid, 3.2);
      ctx!.stroke();

      // Windshield (front, large rake)
      ctx!.fillStyle = glass;
      ctx!.beginPath();
      ctx!.roundRect(len * 0.06, -wid * 0.40, len * 0.22, wid * 0.80, 1.4);
      ctx!.fill();

      // Rear window
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.30, -wid * 0.40, len * 0.18, wid * 0.80, 1.2);
      ctx!.fill();

      // Roof seam between the two
      ctx!.fillStyle = tint;
      ctx!.fillRect(-len * 0.10, -wid * 0.42, len * 0.16, wid * 0.84);

      // Headlights
      ctx!.fillStyle = 'rgba(255,240,200,0.95)';
      ctx!.fillRect(len * 0.46, -wid * 0.40, len * 0.04, wid * 0.20);
      ctx!.fillRect(len * 0.46,  wid * 0.20, len * 0.04, wid * 0.20);

      // Taillights
      ctx!.fillStyle = 'rgba(220,60,40,0.85)';
      ctx!.fillRect(-len * 0.50, -wid * 0.40, len * 0.03, wid * 0.20);
      ctx!.fillRect(-len * 0.50,  wid * 0.20, len * 0.03, wid * 0.20);
    }

    function drawScooter(len: number, wid: number, r: number, g: number, b: number, pulse: number) {
      const a    = 0.88 + pulse * 0.12;
      const body = `rgba(${r},${g},${b},${a})`;
      const dark = `rgba(28,28,34,${a})`;

      // Deck
      ctx!.fillStyle = body;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.42, -wid * 0.32, len * 0.84, wid * 0.64, 2);
      ctx!.fill();

      // Wheels (small black bars at each end seen from above)
      ctx!.fillStyle = dark;
      ctx!.fillRect(-len * 0.50, -wid * 0.45, len * 0.10, wid * 0.90);
      ctx!.fillRect( len * 0.40, -wid * 0.45, len * 0.10, wid * 0.90);

      // T-stem (rises from front of deck)
      ctx!.fillStyle = body;
      ctx!.fillRect(len * 0.30, -wid * 0.18, wid * 0.55, wid * 0.36);

      // Handlebar
      ctx!.fillRect(len * 0.30, -wid * 0.85, wid * 0.32, wid * 1.70);

      // Rider torso (top-down — slight darker disk)
      ctx!.fillStyle = `rgba(40,46,60,${a * 0.9})`;
      ctx!.beginPath();
      ctx!.arc(0, 0, wid * 0.42, 0, Math.PI * 2);
      ctx!.fill();

      // Rider head
      ctx!.fillStyle = `rgba(220,200,170,${a})`;
      ctx!.beginPath();
      ctx!.arc(0, 0, wid * 0.22, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawBike(len: number, wid: number, r: number, g: number, b: number, pulse: number) {
      const a    = 0.82 + pulse * 0.18;
      const body = `rgba(${r},${g},${b},${a})`;
      const dark = `rgba(28,28,34,${a})`;

      // Front + rear wheels (thin top-down strips)
      ctx!.fillStyle = dark;
      ctx!.fillRect(-len * 0.50, -wid * 0.45, len * 0.10, wid * 0.90);
      ctx!.fillRect( len * 0.40, -wid * 0.45, len * 0.10, wid * 0.90);

      // Frame top tube
      ctx!.strokeStyle = body;
      ctx!.lineWidth   = wid * 0.20;
      ctx!.lineCap     = 'round';
      ctx!.beginPath();
      ctx!.moveTo(-len * 0.42, 0);
      ctx!.lineTo( len * 0.42, 0);
      ctx!.stroke();

      // Handlebar
      ctx!.lineWidth = wid * 0.18;
      ctx!.beginPath();
      ctx!.moveTo(len * 0.32, -wid * 0.65);
      ctx!.lineTo(len * 0.32,  wid * 0.65);
      ctx!.stroke();

      // Saddle
      ctx!.fillStyle = `rgba(30,30,38,${a})`;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.08, -wid * 0.18, len * 0.18, wid * 0.36, 1);
      ctx!.fill();

      // Rider
      ctx!.fillStyle = `rgba(40,46,60,${a * 0.9})`;
      ctx!.beginPath();
      ctx!.arc(-len * 0.04, 0, wid * 0.40, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = `rgba(220,200,170,${a})`;
      ctx!.beginPath();
      ctx!.arc(-len * 0.04, 0, wid * 0.20, 0, Math.PI * 2);
      ctx!.fill();
    }

    // ── Vehicle composite (data-point glow + trail + headlight + body) ───────

    function drawVehicle(v: Vehicle) {
      const cx = v.axis === 'h' ? v.pos               : v.fixedPos + v.laneOff;
      const cy = v.axis === 'h' ? v.fixedPos + v.laneOff : v.pos;

      // Data colour — cars use Scooty yellow so their pings stay visible
      const [dr, dg, db] = v.type === 'car' ? [253, 192, 2] : [v.r, v.g, v.b];

      // Ambient data-point halo (always-on soft node light)
      const haloR = Math.max(v.len, v.wid) * 1.6;
      const haloPulse = 0.65 + 0.35 * Math.sin(time * 1.8 + v.phase);
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, haloR);
      halo.addColorStop(0, `rgba(${dr},${dg},${db},${0.22 * haloPulse})`);
      halo.addColorStop(1, `rgba(${dr},${dg},${db},0)`);
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx!.fill();

      // Periodic ping ring — expands outward and fades, like a data pulse
      const pingPeriod = 2.6;
      const pingT = ((time + v.phase * pingPeriod / (Math.PI * 2)) % pingPeriod) / pingPeriod;
      const pingR = haloR * (0.4 + pingT * 2.4);
      const pingAlpha = (1 - pingT) * 0.32;
      ctx!.strokeStyle = `rgba(${dr},${dg},${db},${pingAlpha})`;
      ctx!.lineWidth   = 1.2;
      ctx!.beginPath();
      ctx!.arc(cx, cy, pingR, 0, Math.PI * 2);
      ctx!.stroke();

      // Trail
      const TRAIL_MAX = v.type === 'car' ? 8 : 12;
      v.trail.push({ x: cx, y: cy });
      if (v.trail.length > TRAIL_MAX) v.trail.shift();

      if (v.trail.length > 1) {
        ctx!.lineCap = 'round';
        for (let i = 1; i < v.trail.length; i++) {
          const frac = i / v.trail.length;
          ctx!.beginPath();
          ctx!.moveTo(v.trail[i - 1].x, v.trail[i - 1].y);
          ctx!.lineTo(v.trail[i].x,     v.trail[i].y);
          ctx!.strokeStyle = `rgba(${v.r},${v.g},${v.b},${frac * 0.10})`;
          ctx!.lineWidth   = frac * v.wid * 0.30;
          ctx!.stroke();
        }
      }

      // Headlight glow
      const sign = v.vel > 0 ? 1 : -1;
      const fx   = v.axis === 'h' ? cx + sign * v.len * 0.7 : cx;
      const fy   = v.axis === 'v' ? cy + sign * v.len * 0.7 : cy;
      const glowR = v.len * 1.1;
      const gr   = ctx!.createRadialGradient(fx, fy, 0, fx, fy, glowR);
      const [gr_r, gr_g, gr_b] = v.type === 'car' ? [255, 240, 200] : [v.r, v.g, v.b];
      gr.addColorStop(0, `rgba(${gr_r},${gr_g},${gr_b},0.20)`);
      gr.addColorStop(1, `rgba(${gr_r},${gr_g},${gr_b},0)`);
      ctx!.beginPath();
      ctx!.arc(fx, fy, glowR, 0, Math.PI * 2);
      ctx!.fillStyle = gr;
      ctx!.fill();

      // Orientation
      const angle =
        v.axis === 'h'
          ? (v.vel > 0 ? 0 : Math.PI)
          : (v.vel > 0 ? Math.PI / 2 : -Math.PI / 2);

      const pulse = (Math.sin(time * 2.2 + v.phase) + 1) / 2;

      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(angle);

      switch (v.type) {
        case 'car':     drawCar(    v.len, v.wid, v.r, v.g, v.b);        break;
        case 'scooter': drawScooter(v.len, v.wid, v.r, v.g, v.b, pulse); break;
        case 'bike':    drawBike(   v.len, v.wid, v.r, v.g, v.b, pulse); break;
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

      drawRoads();
      drawMarkings();
      drawWindows();

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
