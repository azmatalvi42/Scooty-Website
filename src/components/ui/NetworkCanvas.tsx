/**
 * NetworkCanvas.tsx — Animated Smart-City Background
 *
 * A calm top-down smart city: crisp road grid, dim building
 * silhouettes topped with solar arrays and pulsing data beacons,
 * smart LED streetlights lining the sidewalks, EV charging points
 * in the parking lots, and e-scooter share corrals. Cars, buses,
 * trucks, e-scooters and bikes drift between intersections while
 * pedestrians walk the sidewalks. Each vehicle emits a soft
 * data-point pulse. Vehicles 4-way-stop at every intersection —
 * H-axis has priority on simultaneous arrivals so no deadlocks or
 * perpendicular hits.
 */

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type VehicleType = 'car' | 'scooter' | 'bike' | 'bus' | 'truck';

interface Vehicle {
  axis:      'h' | 'v';
  fixedPos:  number;
  laneOff:   number;
  pos:       number;
  vel:       number;
  targetVel: number;
  type:      VehicleType;
  r: number; g: number; b: number;
  len:       number;
  wid:       number;
  phase:     number;
  stopWaitT: number;
  clearedAt: number;
}

type LotType = 'building' | 'park' | 'basketball' | 'tennis' | 'plaza' | 'pool' | 'stores' | 'parking' | 'scootyzone';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface Storefront {
  dx: number; dw: number;
  awningCol: [number, number, number];
  signCol:   [number, number, number];
}

interface ParkedCar {
  dx: number; dy: number;
  axis: 'h' | 'v';
  col: [number, number, number];
}

interface ParkedTruck {
  dx: number; dy: number;
  axis: 'h' | 'v';
}

interface Cart {
  dx: number; dy: number;
}

interface Lot {
  type: LotType;
  x: number; y: number;
  w: number; h: number;
  // building
  shade?:    [number, number, number];
  windows?:  { dx: number; dy: number; size: number; col: [number, number, number] }[];
  solar?:    { dx: number; dy: number; w: number; h: number; cols: number; rows: number };
  commNode?: { dx: number; dy: number; phase: number };
  // park
  trees?:   { dx: number; dy: number; r: number }[];
  // plaza
  fountain?: { cx: number; cy: number; r: number };
  benches?:  { x: number; y: number; w: number; h: number }[];
  carts?:    Cart[];
  // stores
  storefronts?: Storefront[];
  awningSide?:  Side;
  // parking
  parkedCars?:   ParkedCar[];
  parkedTrucks?: ParkedTruck[];
  chargers?:     { dx: number; dy: number }[];
  // e-scooter share corral
  zoneScooters?: { dx: number; dy: number; angle: number }[];
}

interface StopSign { cx: number; cy: number; }

interface BusStop {
  x: number; y: number;
  axis: 'h' | 'v';
  side: 1 | -1;
  people: { dx: number; dy: number; col: [number, number, number] }[];
}

interface Pedestrian {
  axis:      'h' | 'v';
  fixedPos:  number;
  laneOff:   number;
  pos:       number;
  vel:       number;
  walkPhase: number;
  bodyCol:   [number, number, number];
}

interface StreetLight { x: number; y: number; }

// ─── Constants ────────────────────────────────────────────────────────────────

const ROAD_W      = 54;
const LANE        = ROAD_W * 0.24;
const SETBACK     = ROAD_W / 2 + 7;

const H_FRACS = [0.26, 0.58, 0.84];
const V_FRACS = [0.18, 0.44, 0.70, 0.92];

const SAFE_GAP      = 16;
const REACT_GAP     = 80;
const STOP_REACT    = 90;
const STOP_LINE_PAD = 4;
const MIN_STOP_WAIT = 0.35;
const PED_REACT     = 84;            // start braking for a pedestrian this far ahead
const PED_STOP      = 11;            // keep at least this gap from a crossing pedestrian

const rnd  = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const CAR_PALETTE: [number, number, number][] = [
  [220, 225, 235],   // pearl white
  [165, 170, 185],   // silver
  [ 95, 105, 125],   // graphite
  [200,  70,  60],   // bright red
  [220, 130,  40],   // orange
  [ 70, 160, 200],   // sky blue
  [ 60, 110, 165],   // royal blue
  [ 65, 165, 120],   // emerald
  [200, 165,  55],   // mustard
  [180,  90, 145],   // magenta
  [ 50,  60,  80],   // midnight
];

const TRUCK_PALETTE: [number, number, number][] = [
  [225, 225, 232],   // white
  [ 60, 110, 165],   // blue
  [ 70,  80,  95],   // charcoal
  [180,  60,  55],   // red
];

const BUILDING_PALETTE: [number, number, number][] = [
  [26, 28, 38],
  [30, 26, 34],
  [24, 30, 40],
  [34, 28, 26],
  [28, 32, 30],
];

const PERSON_PALETTE: [number, number, number][] = [
  [70, 110, 165],    // blue jacket
  [180, 60, 55],     // red jacket
  [60, 80, 95],      // dark grey
  [180, 130, 70],    // tan
  [70, 130, 100],    // green
  [120, 100, 140],   // purple
];

const PULSE_YELLOW:  [number, number, number] = [253, 192,   2];
const PULSE_CYAN:    [number, number, number] = [  0, 195, 230];
const PULSE_MAGENTA: [number, number, number] = [230, 100, 180];

const AWNING_PALETTE: [number, number, number][] = [
  [200,  70,  60],   // red
  [220, 130,  40],   // orange
  [ 60, 130, 180],   // blue
  [ 60, 160, 110],   // green
  [200, 165,  55],   // mustard
  [180,  90, 145],   // magenta
  [ 70, 100, 165],   // royal blue
];

const SIGN_PALETTE: [number, number, number][] = [
  [253, 192,   2],
  [220, 220, 230],
  [120, 230, 220],
  [255, 218, 130],
];

const WINDOW_PALETTE: [number, number, number][] = [
  [255, 218, 130],   // warm amber
  [255, 240, 200],   // pale warm
  [180, 210, 255],   // cool fluorescent
  [253, 192,   2],   // SCOOTY yellow
  [120, 230, 220],   // teal
  [240, 170, 100],   // soft orange
  [200, 130, 220],   // violet
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

    let hRoads:       number[]      = [];
    let vRoads:       number[]      = [];
    let vehicles:     Vehicle[]     = [];
    let lots:         Lot[]         = [];
    let stopSigns:    StopSign[]    = [];
    let busStops:     BusStop[]     = [];
    let streetLights: StreetLight[] = [];
    let pedestrians:  Pedestrian[]  = [];

    // ── Build / resize ──────────────────────────────────────────────────────

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
      buildLots();
      placeScootyZones();
      buildStopSigns();
      buildBusStops();
      buildStreetLights();
      buildPedestrians();
      buildVehicles();
    }

    function buildLots() {
      lots = [];
      const hEdges = [0, ...hRoads, H];
      const vEdges = [0, ...vRoads, W];

      for (let i = 0; i < hEdges.length - 1; i++) {
        for (let j = 0; j < vEdges.length - 1; j++) {
          const top   = i === 0                       ? 0 : hEdges[i]     + SETBACK;
          const bot   = i + 1 === hEdges.length - 1   ? H : hEdges[i + 1] - SETBACK;
          const left  = j === 0                       ? 0 : vEdges[j]     + SETBACK;
          const right = j + 1 === vEdges.length - 1   ? W : vEdges[j + 1] - SETBACK;

          const blockW = right - left;
          const blockH = bot - top;
          if (blockW < 28 || blockH < 28) continue;

          const cols = Math.max(1, Math.min(3, Math.round(blockW / 110)));
          const rows = Math.max(1, Math.min(2, Math.round(blockH / 110)));
          const cellW = blockW / cols;
          const cellH = blockH / rows;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const padX = rnd(5, 11);
              const padY = rnd(5, 11);
              const x = left + c * cellW + padX;
              const y = top  + r * cellH + padY;
              const w = Math.max(0, cellW - padX * 2);
              const h = Math.max(0, cellH - padY * 2);
              if (w < 18 || h < 18) continue;

              lots.push(makeLot(x, y, w, h));
            }
          }
        }
      }
    }

    function placeScootyZones() {
      // Convert a couple of small/medium plots into branded scooter corrals.
      const eligible: number[] = [];
      for (let i = 0; i < lots.length; i++) {
        const L = lots[i];
        const md = Math.min(L.w, L.h);
        if (md >= 30 && md <= 80 &&
            (L.type === 'building' || L.type === 'parking' ||
             L.type === 'plaza'    || L.type === 'stores')) {
          eligible.push(i);
        }
      }
      const target = 2 + (Math.random() < 0.45 ? 1 : 0);
      for (let placed = 0; placed < target && eligible.length > 0; placed++) {
        const k   = Math.floor(Math.random() * eligible.length);
        const idx = eligible.splice(k, 1)[0];
        const L   = lots[idx];
        lots[idx] = makeScootyZone(L.x, L.y, L.w, L.h);
      }
    }

    function makeScootyZone(x: number, y: number, w: number, h: number): Lot {
      const horiz = w >= h;
      const m = Math.max(3, Math.min(5.5, Math.min(w, h) * 0.15));
      const slot = 4.8;
      const scooters: NonNullable<Lot['zoneScooters']> = [];

      if (horiz) {
        // A neat row of scooters hugging the top edge, nose pointing in.
        const lane  = w - 2 * m - 6;
        const count = Math.max(2, Math.min(6, Math.floor(lane / slot)));
        const x0    = m + 3 + (lane - count * slot) / 2;
        for (let i = 0; i < count; i++) {
          scooters.push({ dx: x0 + slot * (i + 0.5), dy: m + 5, angle: Math.PI / 2 });
        }
      } else {
        const lane  = h - 2 * m - 6;
        const count = Math.max(2, Math.min(6, Math.floor(lane / slot)));
        const y0    = m + 3 + (lane - count * slot) / 2;
        for (let i = 0; i < count; i++) {
          scooters.push({ dx: m + 5, dy: y0 + slot * (i + 0.5), angle: 0 });
        }
      }

      return { type: 'scootyzone', x, y, w, h, zoneScooters: scooters };
    }

    function makeLot(x: number, y: number, w: number, h: number): Lot {
      const minDim = Math.min(w, h);
      const roll = Math.random();

      // Cumulative-probability picker.
      let type: LotType = 'building';
      if      (minDim >= 30 && roll < 0.10) type = 'park';
      else if (minDim >= 28 && roll < 0.19) type = 'basketball';
      else if (minDim >= 28 && roll < 0.27) type = 'tennis';
      else if (minDim >= 24 && roll < 0.31) type = 'plaza';
      else if (minDim >= 30 && roll < 0.34) type = 'pool';
      else if (minDim >= 30 && roll < 0.40) type = 'stores';
      else if (minDim >= 34 && roll < 0.46) type = 'parking';

      switch (type) {
        case 'park': {
          const trees: Lot['trees'] = [];
          const count = Math.max(3, Math.floor((w * h) / 220));
          for (let k = 0; k < count; k++) {
            trees.push({ dx: rnd(4, w - 4), dy: rnd(4, h - 4), r: rnd(3, 5.5) });
          }
          return { type, x, y, w, h, trees };
        }
        case 'plaza': {
          const fountain = { cx: w / 2, cy: h / 2, r: Math.min(w, h) * 0.13 };
          const benches: NonNullable<Lot['benches']> = [];
          const benchCount = 2 + Math.floor(Math.random() * 3);
          for (let k = 0; k < benchCount; k++) {
            const a = (k / benchCount) * Math.PI * 2 + rnd(-0.3, 0.3);
            const rr = Math.min(w, h) * 0.34;
            const cx = w / 2 + Math.cos(a) * rr;
            const cy = h / 2 + Math.sin(a) * rr;
            const horiz = Math.abs(Math.cos(a)) > Math.abs(Math.sin(a));
            benches.push({
              x: cx - (horiz ? 3 : 0.8),
              y: cy - (horiz ? 0.8 : 3),
              w: horiz ? 6 : 1.6,
              h: horiz ? 1.6 : 6,
            });
          }
          // 1–2 hot dog carts dotted around the edge
          const carts: Cart[] = [];
          const cartCount = 1 + Math.floor(Math.random() * 2);
          for (let k = 0; k < cartCount; k++) {
            carts.push({
              dx: rnd(6, w - 6),
              dy: rnd(6, h - 6),
            });
          }
          return { type, x, y, w, h, fountain, benches, carts };
        }
        case 'stores': {
          const horiz = w >= h;
          const longLen = horiz ? w : h;
          const storeCount = Math.max(2, Math.min(4, Math.floor(longLen / 22)));
          const storefronts: Storefront[] = [];
          const step = longLen / storeCount;
          for (let k = 0; k < storeCount; k++) {
            storefronts.push({
              dx: k * step + 1.5,
              dw: step - 3,
              awningCol: pick(AWNING_PALETTE),
              signCol:   pick(SIGN_PALETTE),
            });
          }
          // The awning side is whichever edge faces a road — pick the longer-running edge,
          // randomly choosing which side of that edge.
          const awningSide: Side = horiz
            ? (Math.random() < 0.5 ? 'top' : 'bottom')
            : (Math.random() < 0.5 ? 'left' : 'right');
          return { type, x, y, w, h, storefronts, awningSide };
        }
        case 'parking': {
          // Orient parking rows along the long axis
          const horiz = w >= h;
          const spotL = 9;                          // depth (toward the row's perp axis)
          const spotW = 5.5;                        // width along the row
          const rowGap = 2;                         // gap between two facing rows (the lane)
          const edge = 3;                           // margin at lot boundary

          // For a horizontal lot we run two rows along x (top + bottom of the lot).
          // For a vertical lot we run two rows along y (left + right).
          const parkedCars: ParkedCar[] = [];
          const parkedTrucks: ParkedTruck[] = [];
          const chargers: NonNullable<Lot['chargers']> = [];

          if (horiz) {
            const rowCount = Math.floor((w - edge * 2) / spotW);
            const topRowY    = edge + spotL / 2;
            const botRowY    = h - edge - spotL / 2;
            const haveTwoRows = (botRowY - topRowY) > spotL + rowGap;
            const truckSpotsTop = haveTwoRows && Math.random() < 0.5;
            const truckSpotsBot = haveTwoRows && !truckSpotsTop && Math.random() < 0.4;
            for (let k = 0; k < rowCount; k++) {
              const dx = edge + (k + 0.5) * spotW;
              if (Math.random() < 0.55) {
                parkedCars.push({ dx, dy: topRowY, axis: 'h', col: pick(CAR_PALETTE) });
                if (Math.random() < 0.3) chargers.push({ dx, dy: edge - 0.5 });
              }
              if (haveTwoRows && Math.random() < 0.55) {
                parkedCars.push({ dx, dy: botRowY, axis: 'h', col: pick(CAR_PALETTE) });
                if (Math.random() < 0.3) chargers.push({ dx, dy: h - edge + 0.5 });
              }
            }
            if (truckSpotsTop)   parkedTrucks.push({ dx: edge + spotW * 1.3, dy: topRowY, axis: 'h' });
            if (truckSpotsBot)   parkedTrucks.push({ dx: w - edge - spotW * 1.3, dy: botRowY, axis: 'h' });
          } else {
            const rowCount = Math.floor((h - edge * 2) / spotW);
            const leftRowX   = edge + spotL / 2;
            const rightRowX  = w - edge - spotL / 2;
            const haveTwoRows = (rightRowX - leftRowX) > spotL + rowGap;
            const truckSpotsL = haveTwoRows && Math.random() < 0.5;
            const truckSpotsR = haveTwoRows && !truckSpotsL && Math.random() < 0.4;
            for (let k = 0; k < rowCount; k++) {
              const dy = edge + (k + 0.5) * spotW;
              if (Math.random() < 0.55) {
                parkedCars.push({ dx: leftRowX, dy, axis: 'v', col: pick(CAR_PALETTE) });
                if (Math.random() < 0.3) chargers.push({ dx: edge - 0.5, dy });
              }
              if (haveTwoRows && Math.random() < 0.55) {
                parkedCars.push({ dx: rightRowX, dy, axis: 'v', col: pick(CAR_PALETTE) });
                if (Math.random() < 0.3) chargers.push({ dx: w - edge + 0.5, dy });
              }
            }
            if (truckSpotsL) parkedTrucks.push({ dx: leftRowX,  dy: edge + spotW * 1.3, axis: 'v' });
            if (truckSpotsR) parkedTrucks.push({ dx: rightRowX, dy: h - edge - spotW * 1.3, axis: 'v' });
          }
          return { type, x, y, w, h, parkedCars, parkedTrucks, chargers };
        }
        case 'basketball':
        case 'tennis':
        case 'pool': {
          return { type, x, y, w, h };
        }
        default: {
          const windows: Lot['windows'] = [];
          const winCount = Math.max(3, Math.floor((w * h) / 90));
          for (let k = 0; k < winCount; k++) {
            windows.push({
              dx:   rnd(2, w - 3),
              dy:   rnd(2, h - 3),
              size: rnd(0.9, 1.7),
              col:  pick(WINDOW_PALETTE),
            });
          }
          // Smart-city rooftops: solar arrays, or the occasional data beacon.
          let solar: Lot['solar'];
          if (minDim >= 30 && Math.random() < 0.42) {
            const pw = Math.min(w * 0.6, 24);
            const ph = Math.min(h * 0.6, 18);
            solar = {
              dx:   rnd(3, w - pw - 3),
              dy:   rnd(3, h - ph - 3),
              w:    pw,
              h:    ph,
              cols: Math.max(2, Math.round(pw / 5)),
              rows: Math.max(2, Math.round(ph / 5)),
            };
          }
          const commNode = (!solar && minDim >= 24 && Math.random() < 0.24)
            ? {
                dx:    rnd(w * 0.3, w * 0.7),
                dy:    rnd(h * 0.4, h * 0.7),
                phase: Math.random(),
              }
            : undefined;
          return { type: 'building', x, y, w, h, shade: pick(BUILDING_PALETTE), windows, solar, commNode };
        }
      }
    }

    function buildStopSigns() {
      stopSigns = [];
      const CHANCE = 0.10;                              // sparse
      for (const ry of hRoads) {
        for (const rx of vRoads) {
          for (const dx of [-1, 1]) {
            for (const dy of [-1, 1]) {
              if (Math.random() > CHANCE) continue;
              const ox = (ROAD_W / 2 + 5) * dx;
              const oy = (ROAD_W / 2 + 5) * dy;
              stopSigns.push({ cx: rx + ox, cy: ry + oy });
            }
          }
        }
      }
    }

    function buildBusStops() {
      busStops = [];

      const placeStop = (axis: 'h' | 'v', roadPos: number, segStart: number, segEnd: number) => {
        const SEG_MIN = 90;
        if (segEnd - segStart < SEG_MIN) return;
        if (Math.random() < 0.22) return;               // most segments get a stop
        const a = segStart + 40;
        const b = segEnd - 40;
        if (b <= a) return;
        const pos = rnd(a, b);
        const side: 1 | -1 = Math.random() < 0.5 ? -1 : 1;

        const people: BusStop['people'] = [];
        const n = 1 + Math.floor(Math.random() * 3);     // 1–3 people
        for (let i = 0; i < n; i++) {
          if (axis === 'h') {
            people.push({
              dx: rnd(2, 16),
              dy: side === -1 ? rnd(-3, -1) : rnd(8, 10),
              col: pick(PERSON_PALETTE),
            });
          } else {
            people.push({
              dx: side === -1 ? rnd(-3, -1) : rnd(8, 10),
              dy: rnd(2, 16),
              col: pick(PERSON_PALETTE),
            });
          }
        }

        if (axis === 'h') {
          const stopY = side === -1 ? roadPos - ROAD_W / 2 - 7 : roadPos + ROAD_W / 2;
          busStops.push({ x: pos - 9, y: stopY, axis, side, people });
        } else {
          const stopX = side === -1 ? roadPos - ROAD_W / 2 - 7 : roadPos + ROAD_W / 2;
          busStops.push({ x: stopX, y: pos - 9, axis, side, people });
        }
      };

      // Place along H roads, in each gap between adjacent intersections / screen edges
      for (const ry of hRoads) {
        let prev = 0;
        for (const rx of vRoads) {
          placeStop('h', ry, prev + ROAD_W / 2, rx - ROAD_W / 2);
          prev = rx;
        }
        placeStop('h', ry, prev + ROAD_W / 2, W);
      }
      // V roads
      for (const rx of vRoads) {
        let prev = 0;
        for (const ry of hRoads) {
          placeStop('v', rx, prev + ROAD_W / 2, ry - ROAD_W / 2);
          prev = ry;
        }
        placeStop('v', rx, prev + ROAD_W / 2, H);
      }
    }

    function buildStreetLights() {
      streetLights = [];
      const off     = ROAD_W / 2 + (SETBACK - ROAD_W / 2) / 2;   // sidewalk centre line
      const SPACING = 230;
      const onVRoad = (x: number) => vRoads.some(rx => Math.abs(x - rx) < ROAD_W / 2 + 6);
      const onHRoad = (y: number) => hRoads.some(ry => Math.abs(y - ry) < ROAD_W / 2 + 6);

      for (const ry of hRoads) {
        for (let x = SPACING / 2; x < W; x += SPACING) {
          if (onVRoad(x)) continue;
          streetLights.push({ x, y: ry - off });
          streetLights.push({ x, y: ry + off });
        }
      }
      for (const rx of vRoads) {
        for (let y = SPACING / 2; y < H; y += SPACING) {
          if (onHRoad(y)) continue;
          streetLights.push({ x: rx - off, y });
          streetLights.push({ x: rx + off, y });
        }
      }
    }

    function buildPedestrians() {
      pedestrians = [];
      const sw  = SETBACK - ROAD_W / 2;           // sidewalk width
      const off = ROAD_W / 2 + sw / 2;            // sidewalk strip centre

      const addStrip = (axis: 'h' | 'v', fixedPos: number, screenLen: number) => {
        const n = Math.max(2, Math.min(4, Math.round(screenLen / 320)));
        for (let i = 0; i < n; i++) {
          const dir = Math.random() < 0.5 ? 1 : -1;
          pedestrians.push({
            axis, fixedPos,
            laneOff:   rnd(-sw / 2 + 1.4, sw / 2 - 1.4),
            pos:       rnd(0, screenLen),
            vel:       rnd(13, 26) * dir,
            walkPhase: rnd(0, Math.PI * 2),
            bodyCol:   pick(PERSON_PALETTE),
          });
        }
      };

      for (const ry of hRoads) {
        addStrip('h', ry - off, W);
        addStrip('h', ry + off, W);
      }
      for (const rx of vRoads) {
        addStrip('v', rx - off, H);
        addStrip('v', rx + off, H);
      }
    }

    function buildVehicles() {
      vehicles = [];

      // Base type mix — keep cars + small-mobility dominant
      const typePool: VehicleType[] = [
        'car', 'car', 'car',
        'scooter', 'scooter', 'scooter', 'scooter',
        'bike',    'bike',
      ];

      const sizes: Record<VehicleType, [number, number]> = {
        car:     [28, 12],
        scooter: [18,  6],
        bike:    [17, 5.5],
        bus:     [48, 16],
        truck:   [42, 14],
      };

      const speed: Record<VehicleType, [number, number]> = {
        car:     [60, 110],
        scooter: [45,  85],
        bike:    [35,  65],
        bus:     [50,  85],
        truck:   [55,  90],
      };

      const colorFor = (t: VehicleType): [number, number, number] => {
        if (t === 'car')     return pick(CAR_PALETTE);
        if (t === 'scooter') return PULSE_YELLOW;
        if (t === 'bus')     return PULSE_YELLOW;
        if (t === 'truck')   return pick(TRUCK_PALETTE);
        return PULSE_CYAN;
      };

      const tryAdd = (axis: 'h' | 'v', fixedPos: number, screenLen: number, type: VehicleType) => {
        const [r, g, b] = colorFor(type);
        const [len, wid] = sizes[type];
        const dir    = Math.random() < 0.5 ? 1 : -1;
        const [s0, s1] = speed[type];
        const vel    = rnd(s0, s1) * dir;
        const laneOff = dir * LANE;

        let pos = rnd(0, screenLen);
        let placed = false;
        for (let attempt = 0; attempt < 20; attempt++) {
          const conflict = vehicles.some(u =>
            u.axis === axis &&
            u.fixedPos === fixedPos &&
            Math.sign(u.vel) === dir &&
            Math.abs(u.pos - pos) < (u.len + len) / 2 + 28
          );
          if (!conflict) { placed = true; break; }
          pos = rnd(0, screenLen);
        }
        if (!placed) return;                              // skip if no clean slot

        vehicles.push({
          axis, fixedPos, laneOff,
          pos, vel, targetVel: vel,
          type, r, g, b, len, wid,
          phase:     rnd(0, Math.PI * 2),
          stopWaitT: 0,
          clearedAt: NaN,
        });
      };

      const addPoolVehicles = (axis: 'h' | 'v', fixedPos: number, screenLen: number) => {
        const count = Math.floor(rnd(2, 4));
        for (let i = 0; i < count; i++) tryAdd(axis, fixedPos, screenLen, pick(typePool));
      };

      for (const ry of hRoads) addPoolVehicles('h', ry, W);
      for (const rx of vRoads) addPoolVehicles('v', rx, H);

      // Guarantee a bus on a couple of roads
      for (const ry of hRoads) if (Math.random() < 0.55) tryAdd('h', ry, W, 'bus');
      for (const rx of vRoads) if (Math.random() < 0.55) tryAdd('v', rx, H, 'bus');

      // And a couple of trucks
      for (const ry of hRoads) if (Math.random() < 0.40) tryAdd('h', ry, W, 'truck');
      for (const rx of vRoads) if (Math.random() < 0.40) tryAdd('v', rx, H, 'truck');
    }

    // ── Drawing: base / blocks / roads ──────────────────────────────────────

    function drawBase() {
      ctx!.fillStyle = '#070710';
      ctx!.fillRect(0, 0, W, H);
    }

    function drawBuildingLot(b: Lot) {
      if (!b.shade) return;
      ctx!.fillStyle = `rgb(${b.shade[0]},${b.shade[1]},${b.shade[2]})`;
      ctx!.fillRect(b.x, b.y, b.w, b.h);
      if (b.windows) {
        for (const w of b.windows) {
          ctx!.fillStyle = `rgba(${w.col[0]},${w.col[1]},${w.col[2]},0.62)`;
          ctx!.fillRect(b.x + w.dx, b.y + w.dy, w.size, w.size);
        }
      }
      if (b.solar)    drawSolar(b.x + b.solar.dx, b.y + b.solar.dy,
                                b.solar.w, b.solar.h, b.solar.cols, b.solar.rows);
      if (b.commNode) drawCommNode(b.x + b.commNode.dx, b.y + b.commNode.dy, b.commNode.phase);
    }

    function drawParkLot(p: Lot) {
      ctx!.fillStyle = '#1d3a22';
      ctx!.fillRect(p.x, p.y, p.w, p.h);
      // Faint grass speckle
      ctx!.fillStyle = 'rgba(80,140,80,0.18)';
      const speckles = Math.floor((p.w * p.h) / 35);
      for (let s = 0; s < speckles; s++) {
        const sx = p.x + ((s * 37) % p.w);
        const sy = p.y + ((s * 73) % p.h);
        ctx!.fillRect(sx, sy, 1, 1);
      }
      if (p.trees) {
        for (const t of p.trees) {
          const tx = p.x + t.dx;
          const ty = p.y + t.dy;
          ctx!.fillStyle = 'rgba(0,0,0,0.35)';
          ctx!.beginPath();
          ctx!.arc(tx + 0.8, ty + 1, t.r, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = '#2a6a32';
          ctx!.beginPath();
          ctx!.arc(tx, ty, t.r, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = 'rgba(150,210,140,0.34)';
          ctx!.beginPath();
          ctx!.arc(tx - t.r * 0.32, ty - t.r * 0.32, t.r * 0.45, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function drawBasketballLot(p: Lot) {
      // Court surface (terracotta)
      ctx!.fillStyle = '#8e5430';
      ctx!.fillRect(p.x, p.y, p.w, p.h);

      // Darker rim
      ctx!.fillStyle = '#3a2520';
      ctx!.fillRect(p.x, p.y, p.w, 1.2);
      ctx!.fillRect(p.x, p.y + p.h - 1.2, p.w, 1.2);
      ctx!.fillRect(p.x, p.y, 1.2, p.h);
      ctx!.fillRect(p.x + p.w - 1.2, p.y, 1.2, p.h);

      const horiz = p.w >= p.h;
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h / 2;

      ctx!.strokeStyle = 'rgba(255,255,255,0.80)';
      ctx!.lineWidth   = 0.8;

      // Half-court line + centre circle
      ctx!.beginPath();
      if (horiz) { ctx!.moveTo(cx, p.y + 2); ctx!.lineTo(cx, p.y + p.h - 2); }
      else       { ctx!.moveTo(p.x + 2, cy); ctx!.lineTo(p.x + p.w - 2, cy); }
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(cx, cy, Math.min(p.w, p.h) * 0.13, 0, Math.PI * 2);
      ctx!.stroke();

      // Keys at each end + hoop dots
      const longLen  = horiz ? p.w : p.h;
      const shortLen = horiz ? p.h : p.w;
      const keyDepth = Math.max(6, longLen * 0.20);
      const keyWidth = shortLen * 0.55;
      if (horiz) {
        ctx!.strokeRect(p.x + 2, cy - keyWidth / 2, keyDepth, keyWidth);
        ctx!.strokeRect(p.x + p.w - 2 - keyDepth, cy - keyWidth / 2, keyDepth, keyWidth);
        ctx!.fillStyle = 'rgba(255,255,255,0.92)';
        ctx!.fillRect(p.x + 2,         cy - 1, 1, 2);
        ctx!.fillRect(p.x + p.w - 3,   cy - 1, 1, 2);
      } else {
        ctx!.strokeRect(cx - keyWidth / 2, p.y + 2, keyWidth, keyDepth);
        ctx!.strokeRect(cx - keyWidth / 2, p.y + p.h - 2 - keyDepth, keyWidth, keyDepth);
        ctx!.fillStyle = 'rgba(255,255,255,0.92)';
        ctx!.fillRect(cx - 1, p.y + 2,         2, 1);
        ctx!.fillRect(cx - 1, p.y + p.h - 3,   2, 1);
      }
    }

    function drawTennisLot(p: Lot) {
      ctx!.fillStyle = '#2a5a3a';
      ctx!.fillRect(p.x, p.y, p.w, p.h);

      ctx!.strokeStyle = 'rgba(255,255,255,0.78)';
      ctx!.lineWidth   = 0.8;

      // Outer rectangle (singles/doubles boundary)
      ctx!.strokeRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);

      const horiz = p.w >= p.h;
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h / 2;

      // Net line
      ctx!.beginPath();
      if (horiz) { ctx!.moveTo(cx, p.y + 2); ctx!.lineTo(cx, p.y + p.h - 2); }
      else       { ctx!.moveTo(p.x + 2, cy); ctx!.lineTo(p.x + p.w - 2, cy); }
      ctx!.stroke();

      // Service lines
      if (horiz) {
        const off = (p.w - 4) * 0.22;
        ctx!.beginPath();
        ctx!.moveTo(cx - off, p.y + p.h * 0.30);
        ctx!.lineTo(cx + off, p.y + p.h * 0.30);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(cx - off, p.y + p.h * 0.70);
        ctx!.lineTo(cx + off, p.y + p.h * 0.70);
        ctx!.stroke();
        // Centre service line
        ctx!.beginPath();
        ctx!.moveTo(cx - off, cy);
        ctx!.lineTo(cx + off, cy);
        ctx!.stroke();
      } else {
        const off = (p.h - 4) * 0.22;
        ctx!.beginPath();
        ctx!.moveTo(p.x + p.w * 0.30, cy - off);
        ctx!.lineTo(p.x + p.w * 0.30, cy + off);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(p.x + p.w * 0.70, cy - off);
        ctx!.lineTo(p.x + p.w * 0.70, cy + off);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(cx, cy - off);
        ctx!.lineTo(cx, cy + off);
        ctx!.stroke();
      }
    }

    function drawPlazaLot(p: Lot) {
      // Cobblestone pavement
      ctx!.fillStyle = '#3a3a44';
      ctx!.fillRect(p.x, p.y, p.w, p.h);
      ctx!.fillStyle = 'rgba(85,85,95,0.25)';
      const tiles = Math.floor((p.w * p.h) / 45);
      for (let s = 0; s < tiles; s++) {
        const sx = p.x + ((s * 31) % p.w);
        const sy = p.y + ((s * 67) % p.h);
        ctx!.fillRect(sx, sy, 1.5, 1.5);
      }

      // Fountain
      if (p.fountain) {
        const fx = p.x + p.fountain.cx;
        const fy = p.y + p.fountain.cy;
        ctx!.fillStyle = '#54545e';
        ctx!.beginPath();
        ctx!.arc(fx, fy, p.fountain.r + 1.2, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = '#3a7898';
        ctx!.beginPath();
        ctx!.arc(fx, fy, p.fountain.r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = 'rgba(180,220,240,0.35)';
        ctx!.beginPath();
        ctx!.arc(fx - p.fountain.r * 0.3, fy - p.fountain.r * 0.3, p.fountain.r * 0.4, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Benches
      if (p.benches) {
        for (const b of p.benches) {
          ctx!.fillStyle = '#3a2820';
          ctx!.fillRect(p.x + b.x, p.y + b.y, b.w, b.h);
          ctx!.fillStyle = 'rgba(180,140,90,0.45)';
          ctx!.fillRect(p.x + b.x, p.y + b.y, b.w, 0.5);
        }
      }

      // Hot dog carts
      if (p.carts) {
        for (const c of p.carts) {
          drawHotdogCart(p.x + c.dx, p.y + c.dy);
        }
      }
    }

    function drawHotdogCart(cx: number, cy: number) {
      // Umbrella (sits behind/above the cart)
      ctx!.fillStyle = 'rgba(0,0,0,0.30)';
      ctx!.beginPath();
      ctx!.arc(cx + 0.5, cy + 0.4, 2.8, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = 'rgba(220,180,40,0.92)';
      ctx!.beginPath();
      ctx!.arc(cx, cy - 0.6, 2.6, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = 'rgba(140,55,55,0.85)';
      ctx!.lineWidth   = 0.5;
      ctx!.beginPath();
      ctx!.moveTo(cx - 2.6, cy - 0.6);
      ctx!.lineTo(cx + 2.6, cy - 0.6);
      ctx!.stroke();

      // Cart body (red)
      ctx!.fillStyle = 'rgba(190,55,55,0.96)';
      ctx!.fillRect(cx - 2, cy - 0.4, 4, 2.0);
      // White stripe
      ctx!.fillStyle = 'rgba(245,245,250,0.92)';
      ctx!.fillRect(cx - 2, cy + 0.5, 4, 0.45);
      // Counter outline
      ctx!.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx!.lineWidth   = 0.4;
      ctx!.strokeRect(cx - 2, cy - 0.4, 4, 2.0);

      // Vendor (small figure beside)
      ctx!.fillStyle = 'rgba(70,80,95,0.95)';
      ctx!.beginPath();
      ctx!.arc(cx + 0.4, cy + 2.6, 0.9, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = 'rgba(225,210,185,0.92)';
      ctx!.beginPath();
      ctx!.arc(cx + 0.4, cy + 2.6, 0.5, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawStoresLot(p: Lot) {
      // Base building (a bit warmer than the standard building shade)
      ctx!.fillStyle = '#3a3038';
      ctx!.fillRect(p.x, p.y, p.w, p.h);
      // Top-edge highlight
      ctx!.fillStyle = 'rgba(80,72,70,0.65)';
      ctx!.fillRect(p.x, p.y, p.w, 1);
      ctx!.fillRect(p.x, p.y, 1, p.h);

      if (!p.storefronts || !p.awningSide) return;

      const side = p.awningSide;
      const horizSide = side === 'top' || side === 'bottom';
      const awningD = 2.6;     // depth of awning strip
      const signD   = 1.8;     // depth of sign strip behind awning

      for (const s of p.storefronts) {
        const ax = s.awningCol;

        // Awning + sign + door, placed relative to the chosen side.
        if (side === 'bottom') {
          ctx!.fillStyle = `rgba(${ax[0]},${ax[1]},${ax[2]},0.96)`;
          ctx!.fillRect(p.x + s.dx, p.y + p.h - awningD, s.dw, awningD);
          // Awning stripes
          ctx!.fillStyle = 'rgba(0,0,0,0.18)';
          for (let v = 0; v < s.dw; v += 3) {
            ctx!.fillRect(p.x + s.dx + v, p.y + p.h - awningD, 1, awningD);
          }
          // Sign strip just above awning
          ctx!.fillStyle = `rgba(${s.signCol[0]},${s.signCol[1]},${s.signCol[2]},0.85)`;
          ctx!.fillRect(p.x + s.dx + 1, p.y + p.h - awningD - signD, s.dw - 2, signD);
          // Door
          ctx!.fillStyle = 'rgba(15,15,20,0.95)';
          ctx!.fillRect(p.x + s.dx + s.dw * 0.5 - 1.1, p.y + p.h - awningD - 0.5, 2.2, 0.7);
        } else if (side === 'top') {
          ctx!.fillStyle = `rgba(${ax[0]},${ax[1]},${ax[2]},0.96)`;
          ctx!.fillRect(p.x + s.dx, p.y, s.dw, awningD);
          ctx!.fillStyle = 'rgba(0,0,0,0.18)';
          for (let v = 0; v < s.dw; v += 3) {
            ctx!.fillRect(p.x + s.dx + v, p.y, 1, awningD);
          }
          ctx!.fillStyle = `rgba(${s.signCol[0]},${s.signCol[1]},${s.signCol[2]},0.85)`;
          ctx!.fillRect(p.x + s.dx + 1, p.y + awningD, s.dw - 2, signD);
          ctx!.fillStyle = 'rgba(15,15,20,0.95)';
          ctx!.fillRect(p.x + s.dx + s.dw * 0.5 - 1.1, p.y + awningD - 0.2, 2.2, 0.7);
        } else if (side === 'right') {
          ctx!.fillStyle = `rgba(${ax[0]},${ax[1]},${ax[2]},0.96)`;
          ctx!.fillRect(p.x + p.w - awningD, p.y + s.dx, awningD, s.dw);
          ctx!.fillStyle = 'rgba(0,0,0,0.18)';
          for (let v = 0; v < s.dw; v += 3) {
            ctx!.fillRect(p.x + p.w - awningD, p.y + s.dx + v, awningD, 1);
          }
          ctx!.fillStyle = `rgba(${s.signCol[0]},${s.signCol[1]},${s.signCol[2]},0.85)`;
          ctx!.fillRect(p.x + p.w - awningD - signD, p.y + s.dx + 1, signD, s.dw - 2);
          ctx!.fillStyle = 'rgba(15,15,20,0.95)';
          ctx!.fillRect(p.x + p.w - awningD - 0.5, p.y + s.dx + s.dw * 0.5 - 1.1, 0.7, 2.2);
        } else {
          ctx!.fillStyle = `rgba(${ax[0]},${ax[1]},${ax[2]},0.96)`;
          ctx!.fillRect(p.x, p.y + s.dx, awningD, s.dw);
          ctx!.fillStyle = 'rgba(0,0,0,0.18)';
          for (let v = 0; v < s.dw; v += 3) {
            ctx!.fillRect(p.x, p.y + s.dx + v, awningD, 1);
          }
          ctx!.fillStyle = `rgba(${s.signCol[0]},${s.signCol[1]},${s.signCol[2]},0.85)`;
          ctx!.fillRect(p.x + awningD, p.y + s.dx + 1, signD, s.dw - 2);
          ctx!.fillStyle = 'rgba(15,15,20,0.95)';
          ctx!.fillRect(p.x + awningD - 0.2, p.y + s.dx + s.dw * 0.5 - 1.1, 0.7, 2.2);
        }

        // Store divider line between stores (on the awning long axis)
        ctx!.fillStyle = 'rgba(0,0,0,0.55)';
        if (horizSide) {
          ctx!.fillRect(p.x + s.dx + s.dw, p.y + 1, 1, p.h - 2);
        } else {
          ctx!.fillRect(p.x + 1, p.y + s.dx + s.dw, p.w - 2, 1);
        }
      }
    }

    function drawParkedCar(cx: number, cy: number, axis: 'h' | 'v', col: [number, number, number]) {
      const len = 8.4, wid = 4;
      ctx!.save();
      ctx!.translate(cx, cy);
      if (axis === 'v') ctx!.rotate(Math.PI / 2);

      // Drop shadow
      ctx!.fillStyle = 'rgba(0,0,0,0.35)';
      ctx!.fillRect(-len / 2 + 0.6, -wid / 2 + 0.7, len, wid);

      // Body
      ctx!.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},0.95)`;
      ctx!.beginPath();
      ctx!.roundRect(-len / 2, -wid / 2, len, wid, 1.3);
      ctx!.fill();

      // Front + rear windshields
      ctx!.fillStyle = 'rgba(20,30,50,0.78)';
      ctx!.fillRect( len * 0.10, -wid * 0.35, len * 0.18, wid * 0.70);
      ctx!.fillRect(-len * 0.28, -wid * 0.35, len * 0.16, wid * 0.70);

      ctx!.restore();
    }

    function drawParkedFoodTruck(cx: number, cy: number, axis: 'h' | 'v') {
      const len = 14, wid = 5.5;
      ctx!.save();
      ctx!.translate(cx, cy);
      if (axis === 'v') ctx!.rotate(Math.PI / 2);

      // Shadow
      ctx!.fillStyle = 'rgba(0,0,0,0.40)';
      ctx!.fillRect(-len / 2 + 0.6, -wid / 2 + 0.8, len, wid);

      // Body (white)
      ctx!.fillStyle = 'rgba(232,232,238,0.96)';
      ctx!.beginPath();
      ctx!.roundRect(-len / 2, -wid / 2, len, wid, 1.6);
      ctx!.fill();
      ctx!.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.roundRect(-len / 2, -wid / 2, len, wid, 1.6);
      ctx!.stroke();

      // SCOOTY-yellow side stripe
      ctx!.fillStyle = 'rgba(253,192,2,0.95)';
      ctx!.fillRect(-len * 0.42, -wid * 0.06, len * 0.84, wid * 0.12);

      // Service window opening (long darker rectangle on one side)
      ctx!.fillStyle = 'rgba(20,28,40,0.85)';
      ctx!.fillRect(-len * 0.28, -wid * 0.42, len * 0.50, wid * 0.18);

      // Cab windshield
      ctx!.fillStyle = 'rgba(20,28,40,0.85)';
      ctx!.fillRect(len * 0.30, -wid * 0.34, len * 0.12, wid * 0.68);

      // Door divider
      ctx!.fillStyle = 'rgba(0,0,0,0.45)';
      ctx!.fillRect(len * 0.26, -wid * 0.45, 0.6, wid * 0.90);

      // Tiny "FOOD" sign
      ctx!.fillStyle = 'rgba(195,38,38,0.92)';
      ctx!.fillRect(-len * 0.10, -wid * 0.06, 2.8, 1.6);
      ctx!.fillStyle = 'rgba(255,255,255,0.92)';
      ctx!.font         = 'bold 1.6px "Helvetica Neue", Arial, sans-serif';
      ctx!.textAlign    = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillText('FOOD', -len * 0.10 + 1.4, -wid * 0.06 + 0.85);

      ctx!.restore();
    }

    function drawCharger(cx: number, cy: number) {
      // Soft EV-green glow
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 4);
      glow.addColorStop(0, 'rgba(60,220,140,0.34)');
      glow.addColorStop(1, 'rgba(60,220,140,0)');
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx!.fill();

      // Pedestal
      ctx!.fillStyle = 'rgba(44,48,58,0.96)';
      ctx!.fillRect(cx - 0.9, cy - 1.1, 1.8, 2.4);
      // Status LED
      ctx!.fillStyle = 'rgba(90,235,160,0.97)';
      ctx!.beginPath();
      ctx!.arc(cx, cy - 0.4, 0.55, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawParkingLot(p: Lot) {
      // Asphalt
      ctx!.fillStyle = '#15151c';
      ctx!.fillRect(p.x, p.y, p.w, p.h);

      // Faint asphalt grain
      ctx!.fillStyle = 'rgba(255,255,255,0.02)';
      const grains = Math.floor((p.w * p.h) / 80);
      for (let s = 0; s < grains; s++) {
        const sx = p.x + ((s * 41) % p.w);
        const sy = p.y + ((s * 79) % p.h);
        ctx!.fillRect(sx, sy, 1, 1);
      }

      // Painted spot lines
      ctx!.fillStyle = 'rgba(245,245,250,0.45)';
      const spotL = 9, spotW = 5.5, edge = 3;
      if (p.w >= p.h) {
        const rowCount = Math.floor((p.w - edge * 2) / spotW);
        const topY = edge;
        const botY = p.h - edge;
        const topRowY = edge + spotL;
        const botRowY = p.h - edge - spotL;
        const haveTwoRows = (botY - topY) > (spotL * 2 + 2);
        for (let k = 0; k <= rowCount; k++) {
          const dx = edge + k * spotW;
          ctx!.fillRect(p.x + dx, p.y + topY, 0.6, spotL);
          if (haveTwoRows) ctx!.fillRect(p.x + dx, p.y + botRowY, 0.6, spotL);
        }
        // Row caps
        ctx!.fillRect(p.x + edge, p.y + topRowY, rowCount * spotW, 0.6);
        if (haveTwoRows) ctx!.fillRect(p.x + edge, p.y + botRowY, rowCount * spotW, 0.6);
      } else {
        const rowCount = Math.floor((p.h - edge * 2) / spotW);
        const leftX = edge;
        const rightX = p.w - edge;
        const leftRowX = edge + spotL;
        const rightRowX = p.w - edge - spotL;
        const haveTwoRows = (rightX - leftX) > (spotL * 2 + 2);
        for (let k = 0; k <= rowCount; k++) {
          const dy = edge + k * spotW;
          ctx!.fillRect(p.x + leftX, p.y + dy, spotL, 0.6);
          if (haveTwoRows) ctx!.fillRect(p.x + rightRowX, p.y + dy, spotL, 0.6);
        }
        ctx!.fillRect(p.x + leftRowX, p.y + edge, 0.6, rowCount * spotW);
        if (haveTwoRows) ctx!.fillRect(p.x + rightRowX, p.y + edge, 0.6, rowCount * spotW);
      }

      // Parked cars
      if (p.parkedCars) {
        for (const c of p.parkedCars) {
          drawParkedCar(p.x + c.dx, p.y + c.dy, c.axis, c.col);
        }
      }
      // Parked food trucks
      if (p.parkedTrucks) {
        for (const t of p.parkedTrucks) {
          drawParkedFoodTruck(p.x + t.dx, p.y + t.dy, t.axis);
        }
      }
      // EV charging units at the spot heads
      if (p.chargers) {
        for (const c of p.chargers) {
          drawCharger(p.x + c.dx, p.y + c.dy);
        }
      }
    }

    function drawPoolLot(p: Lot) {
      // Deck
      ctx!.fillStyle = '#7c7770';
      ctx!.fillRect(p.x, p.y, p.w, p.h);

      const pad = Math.max(3, Math.min(p.w, p.h) * 0.10);
      const px = p.x + pad;
      const py = p.y + pad;
      const pw = p.w - pad * 2;
      const ph = p.h - pad * 2;

      // Pool water
      ctx!.fillStyle = '#2c7da0';
      ctx!.fillRect(px, py, pw, ph);
      // Water shimmer
      ctx!.fillStyle = 'rgba(140,210,235,0.32)';
      ctx!.fillRect(px + 1, py + 1, pw - 2, 1.2);

      // Lane lines
      ctx!.fillStyle = 'rgba(255,255,255,0.42)';
      const horiz = pw >= ph;
      const lanes = 3;
      for (let k = 1; k < lanes; k++) {
        if (horiz) {
          const ly = py + (ph * k / lanes);
          ctx!.fillRect(px + 1, ly, pw - 2, 0.6);
        } else {
          const lx = px + (pw * k / lanes);
          ctx!.fillRect(lx, py + 1, 0.6, ph - 2);
        }
      }
    }

    function drawSolar(x: number, y: number, w: number, h: number, cols: number, rows: number) {
      // Mount frame
      ctx!.fillStyle = 'rgba(16,20,30,0.96)';
      ctx!.fillRect(x - 0.7, y - 0.7, w + 1.4, h + 1.4);

      const cw = w / cols;
      const ch = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = x + c * cw;
          const py = y + r * ch;
          // Photovoltaic cell
          ctx!.fillStyle = 'rgba(38,62,108,0.96)';
          ctx!.fillRect(px + 0.35, py + 0.35, cw - 0.7, ch - 0.7);
          // Glass sheen
          ctx!.fillStyle = 'rgba(120,168,235,0.28)';
          ctx!.fillRect(px + 0.35, py + 0.35, (cw - 0.7) * 0.55, (ch - 0.7) * 0.45);
        }
      }
    }

    function drawCommNode(cx: number, cy: number, phase: number) {
      // Expanding connectivity rings
      const period = 2.4;
      for (let k = 0; k < 2; k++) {
        const t  = (((time / period) + phase + k * 0.5) % 1 + 1) % 1;
        const rr = 1 + t * 9;
        ctx!.strokeStyle = `rgba(0,205,232,${(1 - t) * 0.42})`;
        ctx!.lineWidth   = 0.8;
        ctx!.beginPath();
        ctx!.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx!.stroke();
      }
      // Node core + glow
      const core = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 4);
      core.addColorStop(0, 'rgba(0,205,232,0.5)');
      core.addColorStop(1, 'rgba(0,205,232,0)');
      ctx!.fillStyle = core;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = 'rgba(156,242,255,0.97)';
      ctx!.beginPath();
      ctx!.arc(cx, cy, 1.1, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawZoneScooter(cx: number, cy: number, angle: number) {
      const len = 8, wid = 3;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(angle);

      // Shadow
      ctx!.fillStyle = 'rgba(0,0,0,0.32)';
      ctx!.fillRect(-len / 2 + 0.5, -wid / 2 + 0.6, len, wid);

      // Deck (SCOOTY yellow)
      ctx!.fillStyle = 'rgba(253,192,2,0.95)';
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.34, -wid * 0.4, len * 0.68, wid * 0.8, 1);
      ctx!.fill();

      // Grip strip
      ctx!.fillStyle = 'rgba(24,24,30,0.92)';
      ctx!.fillRect(-len * 0.28, -wid * 0.12, len * 0.52, wid * 0.24);

      // Stem + handlebar
      ctx!.fillStyle = 'rgba(36,36,44,0.95)';
      ctx!.fillRect(len * 0.30, -wid * 0.09, len * 0.12, wid * 0.18);
      ctx!.fillRect(len * 0.40, -wid * 0.72, len * 0.09, wid * 1.44);

      // Wheels
      ctx!.fillStyle = 'rgba(18,18,24,0.95)';
      ctx!.beginPath();
      ctx!.arc(len * 0.34, 0, wid * 0.34, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(-len * 0.34, 0, wid * 0.34, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();
    }

    function drawScootyZone(p: Lot) {
      // Corral surface
      ctx!.fillStyle = '#16161e';
      ctx!.fillRect(p.x, p.y, p.w, p.h);

      const m = Math.max(3, Math.min(5.5, Math.min(p.w, p.h) * 0.15));

      // Painted yellow pad
      ctx!.fillStyle = 'rgba(253,192,2,0.09)';
      ctx!.fillRect(p.x + m, p.y + m, p.w - m * 2, p.h - m * 2);

      // Dashed corral border
      ctx!.setLineDash([5, 3.5]);
      ctx!.lineDashOffset = 0;
      ctx!.lineWidth = 1.1;
      ctx!.strokeStyle = 'rgba(253,192,2,0.62)';
      ctx!.strokeRect(p.x + m, p.y + m, p.w - m * 2, p.h - m * 2);
      ctx!.setLineDash([]);

      // Parked e-scooters
      if (p.zoneScooters) {
        for (const s of p.zoneScooters) {
          drawZoneScooter(p.x + s.dx, p.y + s.dy, s.angle);
        }
      }
    }

    function drawLots() {
      for (const lot of lots) {
        switch (lot.type) {
          case 'building':    drawBuildingLot(lot);    break;
          case 'park':        drawParkLot(lot);        break;
          case 'basketball':  drawBasketballLot(lot);  break;
          case 'tennis':      drawTennisLot(lot);      break;
          case 'plaza':       drawPlazaLot(lot);       break;
          case 'pool':        drawPoolLot(lot);        break;
          case 'stores':      drawStoresLot(lot);      break;
          case 'parking':     drawParkingLot(lot);     break;
          case 'scootyzone':  drawScootyZone(lot);     break;
        }
      }
    }

    function drawSidewalks() {
      const sw   = SETBACK - ROAD_W / 2;        // sidewalk width
      const edge = ROAD_W / 2;

      // Sidewalks lining the H roads (a strip on each side)
      for (const ry of hRoads) {
        for (const sy of [ry - edge - sw, ry + edge]) {
          ctx!.fillStyle = '#2a2a33';
          ctx!.fillRect(0, sy, W, sw);
          ctx!.fillStyle = 'rgba(0,0,0,0.28)';            // panel joints
          for (let jx = 16; jx < W; jx += 16) ctx!.fillRect(jx, sy, 0.6, sw);
        }
        ctx!.fillStyle = 'rgba(120,123,138,0.5)';          // curb
        ctx!.fillRect(0, ry - edge - 0.9, W, 0.9);
        ctx!.fillRect(0, ry + edge,       W, 0.9);
      }
      // Sidewalks lining the V roads
      for (const rx of vRoads) {
        for (const sx of [rx - edge - sw, rx + edge]) {
          ctx!.fillStyle = '#2a2a33';
          ctx!.fillRect(sx, 0, sw, H);
          ctx!.fillStyle = 'rgba(0,0,0,0.28)';
          for (let jy = 16; jy < H; jy += 16) ctx!.fillRect(sx, jy, sw, 0.6);
        }
        ctx!.fillStyle = 'rgba(120,123,138,0.5)';
        ctx!.fillRect(rx - edge - 0.9, 0, 0.9, H);
        ctx!.fillRect(rx + edge,       0, 0.9, H);
      }
    }

    function drawCrosswalks() {
      const edge = ROAD_W / 2;
      const band = 5, gap = 2;
      const step = 4.8, stripe = 2.4;
      ctx!.fillStyle = 'rgba(236,237,243,0.32)';

      for (const ry of hRoads) {
        for (const rx of vRoads) {
          // Top + bottom approaches — stripes run with the V road
          for (const dir of [-1, 1] as const) {
            const y0 = dir < 0 ? ry - edge - gap - band : ry + edge + gap;
            for (let sx = rx - edge + 2.5; sx < rx + edge - 2.5; sx += step) {
              ctx!.fillRect(sx, y0, stripe, band);
            }
          }
          // Left + right approaches — stripes run with the H road
          for (const dir of [-1, 1] as const) {
            const x0 = dir < 0 ? rx - edge - gap - band : rx + edge + gap;
            for (let sy = ry - edge + 2.5; sy < ry + edge - 2.5; sy += step) {
              ctx!.fillRect(x0, sy, band, stripe);
            }
          }
        }
      }
    }

    function drawRoads() {
      ctx!.fillStyle = '#16161f';
      for (const ry of hRoads) ctx!.fillRect(0, ry - ROAD_W / 2, W, ROAD_W);
      for (const rx of vRoads) ctx!.fillRect(rx - ROAD_W / 2, 0, ROAD_W, H);

      ctx!.fillStyle = '#1c1c26';
      for (const ry of hRoads) {
        for (const rx of vRoads) {
          ctx!.fillRect(rx - ROAD_W / 2, ry - ROAD_W / 2, ROAD_W, ROAD_W);
        }
      }
    }

    function drawHSegment(y: number) {
      let lastX = 0;
      for (const rx of vRoads) {
        ctx!.beginPath();
        ctx!.moveTo(lastX, y);
        ctx!.lineTo(rx - ROAD_W / 2, y);
        ctx!.stroke();
        lastX = rx + ROAD_W / 2;
      }
      ctx!.beginPath();
      ctx!.moveTo(lastX, y);
      ctx!.lineTo(W, y);
      ctx!.stroke();
    }

    function drawVSegment(x: number) {
      let lastY = 0;
      for (const ry of hRoads) {
        ctx!.beginPath();
        ctx!.moveTo(x, lastY);
        ctx!.lineTo(x, ry - ROAD_W / 2);
        ctx!.stroke();
        lastY = ry + ROAD_W / 2;
      }
      ctx!.beginPath();
      ctx!.moveTo(x, lastY);
      ctx!.lineTo(x, H);
      ctx!.stroke();
    }

    function drawMarkings() {
      ctx!.setLineDash([]);
      ctx!.lineWidth   = 1;
      ctx!.strokeStyle = 'rgba(245,245,250,0.22)';
      for (const ry of hRoads) {
        drawHSegment(ry - ROAD_W / 2 + 2);
        drawHSegment(ry + ROAD_W / 2 - 2);
      }
      for (const rx of vRoads) {
        drawVSegment(rx - ROAD_W / 2 + 2);
        drawVSegment(rx + ROAD_W / 2 - 2);
      }

      ctx!.setLineDash([14, 12]);
      ctx!.lineDashOffset = 0;
      ctx!.lineWidth      = 1.2;
      ctx!.strokeStyle    = 'rgba(255,220,120,0.34)';
      for (const ry of hRoads) drawHSegment(ry);
      for (const rx of vRoads) drawVSegment(rx);
      ctx!.setLineDash([]);
    }

    // ── Stop signs ──────────────────────────────────────────────────────────

    function drawStopSign(cx: number, cy: number, r: number) {
      ctx!.fillStyle = 'rgba(195, 38, 38, 0.95)';
      ctx!.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx!.moveTo(x, y);
        else         ctx!.lineTo(x, y);
      }
      ctx!.closePath();
      ctx!.fill();
      ctx!.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx!.lineWidth   = 0.7;
      ctx!.stroke();
      ctx!.fillStyle    = 'rgba(255,255,255,0.95)';
      ctx!.font         = 'bold 3px "Helvetica Neue", Arial, sans-serif';
      ctx!.textAlign    = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillText('STOP', cx, cy + 0.2);
    }

    function drawStopSigns() {
      for (const s of stopSigns) drawStopSign(s.cx, s.cy, 5);
    }

    // ── Bus stops + people ──────────────────────────────────────────────────

    function drawBusStops() {
      for (const bs of busStops) {
        const isH = bs.axis === 'h';
        const w = isH ? 18 : 7;
        const h = isH ? 7  : 18;

        // Shelter
        ctx!.fillStyle = 'rgba(36,36,46,0.95)';
        ctx!.fillRect(bs.x, bs.y, w, h);

        // Yellow accent on the road-facing edge
        ctx!.fillStyle = 'rgba(253,192,2,0.95)';
        if (isH) {
          if (bs.side === -1) ctx!.fillRect(bs.x, bs.y + h - 1.5, w, 1.5);
          else                ctx!.fillRect(bs.x, bs.y,           w, 1.5);
        } else {
          if (bs.side === -1) ctx!.fillRect(bs.x + w - 1.5, bs.y, 1.5, h);
          else                ctx!.fillRect(bs.x,           bs.y, 1.5, h);
        }

        // People dots (body + tiny head)
        for (const p of bs.people) {
          const px = bs.x + p.dx;
          const py = bs.y + p.dy;
          ctx!.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},0.95)`;
          ctx!.beginPath();
          ctx!.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = 'rgba(225,210,185,0.92)';
          ctx!.beginPath();
          ctx!.arc(px, py, 0.75, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Tiny pole + B sign
        let polX: number, polY: number;
        if (isH) { polX = bs.x + w + 1; polY = bs.y - 0.5; }
        else     { polX = bs.x + (bs.side === -1 ? -2 : w + 1); polY = bs.y + h + 1; }
        ctx!.fillStyle = 'rgba(180,180,190,0.85)';
        ctx!.fillRect(polX, polY, 0.8, isH ? h + 1 : 3);
        ctx!.fillStyle = 'rgba(253,192,2,0.95)';
        ctx!.fillRect(polX - 0.5, polY - 4, 3.5, 3);
        ctx!.fillStyle = 'rgba(28,28,36,0.95)';
        ctx!.font         = 'bold 3px "Helvetica Neue", Arial, sans-serif';
        ctx!.textAlign    = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText('B', polX + 1.2, polY - 2.5);
      }
    }

    // ── Smart streetlights ──────────────────────────────────────────────────

    function drawStreetLights() {
      for (const s of streetLights) {
        const glow = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, 11);
        glow.addColorStop(0, 'rgba(206,224,255,0.26)');
        glow.addColorStop(1, 'rgba(206,224,255,0)');
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 11, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = 'rgba(70,74,86,0.9)';        // pole base
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = 'rgba(234,243,255,0.96)';    // LED head
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 0.95, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // ── Pedestrians ─────────────────────────────────────────────────────────

    function updatePedestrians(dt: number) {
      for (const p of pedestrians) {
        p.pos       += p.vel * dt;
        p.walkPhase += dt * (5 + Math.abs(p.vel) * 0.22);
        const limit = p.axis === 'h' ? W : H;
        if (p.pos > limit + 8) p.pos = -8;
        if (p.pos < -8)        p.pos = limit + 8;
      }
    }

    function drawPedestrian(p: Pedestrian) {
      const x = p.axis === 'h' ? p.pos : p.fixedPos + p.laneOff;
      const y = p.axis === 'h' ? p.fixedPos + p.laneOff : p.pos;
      const dir   = Math.sign(p.vel) || 1;
      const angle = p.axis === 'h'
        ? (dir > 0 ? 0 : Math.PI)
        : (dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      const swing = Math.sin(p.walkPhase);

      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(angle);

      // Shadow
      ctx!.fillStyle = 'rgba(0,0,0,0.30)';
      ctx!.beginPath();
      ctx!.ellipse(0.5, 0.6, 1.9, 1.35, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Feet — alternating fore/aft for the walk cycle
      ctx!.fillStyle = 'rgba(26,28,36,0.92)';
      ctx!.beginPath();
      ctx!.arc( swing * 1.15, -0.6, 0.55, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(-swing * 1.15,  0.6, 0.55, 0, Math.PI * 2);
      ctx!.fill();

      // Body (jacket)
      ctx!.fillStyle = `rgba(${p.bodyCol[0]},${p.bodyCol[1]},${p.bodyCol[2]},0.96)`;
      ctx!.beginPath();
      ctx!.ellipse(0, 0, 1.7, 1.3, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Head
      ctx!.fillStyle = 'rgba(226,210,186,0.97)';
      ctx!.beginPath();
      ctx!.arc(0.3, 0, 0.92, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();
    }

    function drawPedestrians() {
      for (const p of pedestrians) drawPedestrian(p);
    }

    // ── Vehicle shapes ──────────────────────────────────────────────────────

    function drawCar(len: number, wid: number, r: number, g: number, b: number) {
      const tint = `rgba(${Math.round(r * 0.40)},${Math.round(g * 0.40)},${Math.round(b * 0.45)},0.75)`;
      const glass = 'rgba(15,22,35,0.85)';

      ctx!.fillStyle = `rgba(${r},${g},${b},0.95)`;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len, wid, 2.6);
      ctx!.fill();

      ctx!.strokeStyle = tint;
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len, wid, 2.6);
      ctx!.stroke();

      ctx!.fillStyle = glass;
      ctx!.beginPath();
      ctx!.roundRect(len * 0.08, -wid * 0.38, len * 0.22, wid * 0.76, 1.3);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.30, -wid * 0.38, len * 0.18, wid * 0.76, 1.1);
      ctx!.fill();

      ctx!.fillStyle = tint;
      ctx!.fillRect(-len * 0.10, -wid * 0.40, len * 0.16, wid * 0.80);

      ctx!.fillStyle = 'rgba(255,240,200,0.96)';
      ctx!.fillRect(len * 0.45, -wid * 0.36, len * 0.04, wid * 0.20);
      ctx!.fillRect(len * 0.45,  wid * 0.16, len * 0.04, wid * 0.20);

      ctx!.fillStyle = 'rgba(200,55,38,0.85)';
      ctx!.fillRect(-len * 0.49, -wid * 0.36, len * 0.03, wid * 0.20);
      ctx!.fillRect(-len * 0.49,  wid * 0.16, len * 0.03, wid * 0.20);
    }

    function drawBus(len: number, wid: number, r: number, g: number, b: number) {
      const tint = `rgba(${Math.round(r * 0.40)},${Math.round(g * 0.40)},${Math.round(b * 0.45)},0.75)`;

      // Body
      ctx!.fillStyle = `rgba(${r},${g},${b},0.96)`;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len, wid, 3);
      ctx!.fill();
      ctx!.strokeStyle = tint;
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len, wid, 3);
      ctx!.stroke();

      // Window strip along both sides
      ctx!.fillStyle = 'rgba(35,55,80,0.85)';
      ctx!.fillRect(-len * 0.42, -wid * 0.34, len * 0.76, wid * 0.14);
      ctx!.fillRect(-len * 0.42,  wid * 0.20, len * 0.76, wid * 0.14);
      // Window mullions
      ctx!.fillStyle = `rgba(${r},${g},${b},0.96)`;
      for (let k = 1; k < 6; k++) {
        const wx = -len * 0.42 + (len * 0.76) * (k / 6);
        ctx!.fillRect(wx, -wid * 0.34, 0.6, wid * 0.14);
        ctx!.fillRect(wx,  wid * 0.20, 0.6, wid * 0.14);
      }
      // Front windshield
      ctx!.fillStyle = 'rgba(35,55,80,0.9)';
      ctx!.beginPath();
      ctx!.roundRect(len * 0.34, -wid * 0.34, len * 0.11, wid * 0.68, 1.5);
      ctx!.fill();
      // Centre stripe
      ctx!.fillStyle = 'rgba(0,0,0,0.18)';
      ctx!.fillRect(-len * 0.42, -wid * 0.04, len * 0.84, wid * 0.08);
      // Headlights
      ctx!.fillStyle = 'rgba(255,240,200,0.97)';
      ctx!.fillRect(len * 0.46, -wid * 0.36, len * 0.035, wid * 0.18);
      ctx!.fillRect(len * 0.46,  wid * 0.18, len * 0.035, wid * 0.18);
      // Taillights
      ctx!.fillStyle = 'rgba(200,55,38,0.85)';
      ctx!.fillRect(-len * 0.50, -wid * 0.36, len * 0.03, wid * 0.18);
      ctx!.fillRect(-len * 0.50,  wid * 0.18, len * 0.03, wid * 0.18);
    }

    function drawTruck(len: number, wid: number, r: number, g: number, b: number) {
      const tint  = `rgba(${Math.round(r * 0.35)},${Math.round(g * 0.35)},${Math.round(b * 0.4)},0.78)`;
      const cabR  = Math.round(r * 0.70);
      const cabG  = Math.round(g * 0.70);
      const cabB  = Math.round(b * 0.78);

      // Cargo box (rear, longer)
      ctx!.fillStyle = `rgba(${r},${g},${b},0.95)`;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len * 0.68, wid, 2.4);
      ctx!.fill();
      ctx!.strokeStyle = tint;
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.5, -wid * 0.5, len * 0.68, wid, 2.4);
      ctx!.stroke();
      // Box door lines (back)
      ctx!.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx!.lineWidth   = 0.5;
      ctx!.beginPath();
      ctx!.moveTo(-len * 0.30, -wid * 0.40);
      ctx!.lineTo(-len * 0.30,  wid * 0.40);
      ctx!.stroke();

      // Divider between cab and box
      ctx!.fillStyle = 'rgba(0,0,0,0.45)';
      ctx!.fillRect(len * 0.17, -wid * 0.46, 0.8, wid * 0.92);

      // Cab
      ctx!.fillStyle = `rgba(${cabR},${cabG},${cabB},0.95)`;
      ctx!.beginPath();
      ctx!.roundRect(len * 0.18, -wid * 0.48, len * 0.32, wid * 0.96, 2.2);
      ctx!.fill();
      ctx!.strokeStyle = tint;
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.roundRect(len * 0.18, -wid * 0.48, len * 0.32, wid * 0.96, 2.2);
      ctx!.stroke();

      // Windshield
      ctx!.fillStyle = 'rgba(15,22,35,0.85)';
      ctx!.beginPath();
      ctx!.roundRect(len * 0.32, -wid * 0.38, len * 0.14, wid * 0.76, 1.2);
      ctx!.fill();

      // Headlights
      ctx!.fillStyle = 'rgba(255,240,200,0.97)';
      ctx!.fillRect(len * 0.47, -wid * 0.40, len * 0.03, wid * 0.20);
      ctx!.fillRect(len * 0.47,  wid * 0.20, len * 0.03, wid * 0.20);
      // Taillights
      ctx!.fillStyle = 'rgba(200,55,38,0.85)';
      ctx!.fillRect(-len * 0.50, -wid * 0.40, len * 0.03, wid * 0.20);
      ctx!.fillRect(-len * 0.50,  wid * 0.20, len * 0.03, wid * 0.20);
    }

    function drawScooter(len: number, wid: number, r: number, g: number, b: number) {
      ctx!.fillStyle = 'rgba(20,22,28,0.92)';
      ctx!.fillRect(-len * 0.50, -wid * 0.48, len * 0.10, wid * 0.96);
      ctx!.fillRect( len * 0.40, -wid * 0.48, len * 0.10, wid * 0.96);

      ctx!.fillStyle = `rgba(${r},${g},${b},0.96)`;
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.40, -wid * 0.34, len * 0.80, wid * 0.68, 1.6);
      ctx!.fill();

      ctx!.fillStyle = `rgba(${Math.round(r * 0.55)},${Math.round(g * 0.55)},${Math.round(b * 0.55)},0.85)`;
      ctx!.fillRect(-len * 0.36, -wid * 0.06, len * 0.72, wid * 0.12);

      ctx!.fillStyle = 'rgba(28,28,36,0.95)';
      ctx!.fillRect(len * 0.26, -wid * 0.20, len * 0.10, wid * 0.40);
      ctx!.fillRect(len * 0.30, -wid * 0.85, len * 0.04, wid * 1.70);

      ctx!.fillStyle = 'rgba(45,52,68,0.92)';
      ctx!.beginPath();
      ctx!.arc(0, 0, wid * 0.40, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = 'rgba(220,205,180,0.95)';
      ctx!.beginPath();
      ctx!.arc(0, 0, wid * 0.22, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawBike(len: number, wid: number, r: number, g: number, b: number) {
      ctx!.fillStyle = 'rgba(20,22,28,0.92)';
      ctx!.fillRect(-len * 0.50, -wid * 0.48, len * 0.10, wid * 0.96);
      ctx!.fillRect( len * 0.40, -wid * 0.48, len * 0.10, wid * 0.96);

      ctx!.strokeStyle = `rgba(${r},${g},${b},0.95)`;
      ctx!.lineWidth   = wid * 0.22;
      ctx!.lineCap     = 'round';
      ctx!.beginPath();
      ctx!.moveTo(-len * 0.40, 0);
      ctx!.lineTo( len * 0.40, 0);
      ctx!.stroke();

      ctx!.lineWidth = wid * 0.18;
      ctx!.beginPath();
      ctx!.moveTo(len * 0.30, -wid * 0.70);
      ctx!.lineTo(len * 0.30,  wid * 0.70);
      ctx!.stroke();

      ctx!.fillStyle = 'rgba(30,30,38,0.95)';
      ctx!.beginPath();
      ctx!.roundRect(-len * 0.10, -wid * 0.20, len * 0.18, wid * 0.40, 1);
      ctx!.fill();

      ctx!.fillStyle = 'rgba(45,52,68,0.92)';
      ctx!.beginPath();
      ctx!.arc(-len * 0.04, 0, wid * 0.40, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = 'rgba(220,205,180,0.95)';
      ctx!.beginPath();
      ctx!.arc(-len * 0.04, 0, wid * 0.20, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawVehicle(v: Vehicle) {
      const cx = v.axis === 'h' ? v.pos                  : v.fixedPos + v.laneOff;
      const cy = v.axis === 'h' ? v.fixedPos + v.laneOff : v.pos;
      const sign = Math.sign(v.targetVel) || 1;
      const angle =
        v.axis === 'h'
          ? (sign > 0 ? 0 : Math.PI)
          : (sign > 0 ? Math.PI / 2 : -Math.PI / 2);

      const [pr, pg, pb] =
        v.type === 'bike'  ? PULSE_CYAN    :
        v.type === 'truck' ? PULSE_MAGENTA :
                             PULSE_YELLOW;

      // Soft ambient halo
      const haloR = Math.max(v.len, v.wid) * 1.5;
      const haloPulse = 0.55 + 0.45 * Math.sin(time * 1.6 + v.phase);
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, haloR);
      halo.addColorStop(0, `rgba(${pr},${pg},${pb},${0.13 * haloPulse})`);
      halo.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx!.fill();

      // Data-point ping
      const pingPeriod = 3.0;
      const pingT = ((time + (v.phase / (Math.PI * 2)) * pingPeriod) % pingPeriod) / pingPeriod;
      const pingR = haloR * (0.45 + pingT * 1.9);
      const pingAlpha = (1 - pingT) * 0.26;
      ctx!.strokeStyle = `rgba(${pr},${pg},${pb},${pingAlpha})`;
      ctx!.lineWidth   = 1;
      ctx!.beginPath();
      ctx!.arc(cx, cy, pingR, 0, Math.PI * 2);
      ctx!.stroke();

      // Headlight glow
      const fx = v.axis === 'h' ? cx + sign * v.len * 0.7 : cx;
      const fy = v.axis === 'v' ? cy + sign * v.len * 0.7 : cy;
      const [hr, hg, hb] = (v.type === 'scooter' || v.type === 'bike') ? [v.r, v.g, v.b] : [255, 240, 200];
      const glow = ctx!.createRadialGradient(fx, fy, 0, fx, fy, v.len * 0.9);
      glow.addColorStop(0, `rgba(${hr},${hg},${hb},0.14)`);
      glow.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(fx, fy, v.len * 0.9, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(angle);

      // Drop shadow
      ctx!.fillStyle = 'rgba(0,0,0,0.32)';
      ctx!.beginPath();
      ctx!.roundRect(-v.len * 0.5 + 0.8, -v.wid * 0.5 + 1.0, v.len, v.wid, 2.4);
      ctx!.fill();

      switch (v.type) {
        case 'car':     drawCar(    v.len, v.wid, v.r, v.g, v.b); break;
        case 'bus':     drawBus(    v.len, v.wid, v.r, v.g, v.b); break;
        case 'truck':   drawTruck(  v.len, v.wid, v.r, v.g, v.b); break;
        case 'scooter': drawScooter(v.len, v.wid, v.r, v.g, v.b); break;
        case 'bike':    drawBike(   v.len, v.wid, v.r, v.g, v.b); break;
      }

      ctx!.restore();
    }

    // ── Intersection helpers ────────────────────────────────────────────────

    function nextIntersection(v: Vehicle, dir: number) {
      const crossings = v.axis === 'h' ? vRoads : hRoads;
      let bestGap = Infinity;
      let bestCross: number | null = null;
      for (const c of crossings) {
        const gap = (c - v.pos) * dir;
        if (gap > -ROAD_W * 0.3 && gap < bestGap) {
          bestGap   = gap;
          bestCross = c;
        }
      }
      return bestCross !== null ? { cross: bestCross, gap: bestGap } : null;
    }

    // True when a perpendicular vehicle is anywhere near this intersection —
    // used on approach to decide whether to brake to a full stop or roll through.
    function intersectionContested(crossPerp: number, perpRoad: number,
                                   selfAxis: 'h' | 'v', self: Vehicle): boolean {
      const perpAxis: 'h' | 'v' = selfAxis === 'h' ? 'v' : 'h';
      const NEAR = STOP_REACT + ROAD_W;          // approach distance + the box
      for (const u of vehicles) {
        if (u === self) continue;
        if (u.axis !== perpAxis) continue;
        if (u.fixedPos !== crossPerp) continue;
        if (Math.abs(u.pos - perpRoad) < NEAR) return true;
      }
      return false;
    }

    // True when self must yield: a perpendicular vehicle is inside the
    // intersection box, has already reserved it, or is queued at the stop line
    // with right-of-way. Right-of-way rule: H-axis goes before V-axis.
    function intersectionBusy(crossPerp: number, perpRoad: number, selfAxis: 'h' | 'v', self: Vehicle): boolean {
      const perpAxis: 'h' | 'v' = selfAxis === 'h' ? 'v' : 'h';

      for (const u of vehicles) {
        if (u === self) continue;
        if (u.axis !== perpAxis) continue;
        if (u.fixedPos !== crossPerp) continue;
        const d = Math.abs(u.pos - perpRoad);

        // u's body overlaps the intersection box right now — always wait.
        // Uses the vehicle length so a long bus or truck is caught end to end.
        if (d - u.len / 2 < ROAD_W / 2 + 2) return true;

        // Has already reserved this same crossing — wait until it is through
        if (!Number.isNaN(u.clearedAt) && u.clearedAt === self.fixedPos) return true;

        // Queued at its (length-aware) stop line — wait if it has right-of-way
        const uStopDist = ROAD_W / 2 + u.len / 2 + STOP_LINE_PAD;
        if (d < uStopDist + 8 && Math.abs(u.vel) < 8) {
          if (perpAxis === 'h' && selfAxis === 'v') return true;     // H beats V
        }
      }
      return false;
    }

    // Distance from v's front bumper to the nearest pedestrian crossing its
    // roadway ahead — Infinity when the way is clear. Vehicles yield to this.
    function pedestrianGap(v: Vehicle, dir: number): number {
      let best = Infinity;
      for (const p of pedestrians) {
        if (p.axis === v.axis) continue;                 // parallel — never crosses in front
        // p.pos is the pedestrian's coordinate on v's fixed (cross) axis.
        if (Math.abs(p.pos - v.fixedPos) > ROAD_W / 2 + 6) continue;   // not on v's roadway
        // Pedestrian's coordinate along v's direction of travel.
        const pAlong = p.fixedPos + p.laneOff;
        const gap = (pAlong - v.pos) * dir - v.len / 2;
        if (gap > -v.len * 0.5 && gap < best) best = gap;
      }
      return best;
    }

    // ── Velocity / stop logic ───────────────────────────────────────────────

    function updateVelocities(dt: number) {
      for (const v of vehicles) {
        const dir = Math.sign(v.targetVel) || 1;
        const cruise = Math.abs(v.targetVel);
        let targetSpeed = cruise;

        // Car-following — track only the closest vehicle *ahead* in this lane.
        // A vehicle behind must never be mistaken for the leader, otherwise the
        // overlap branch below would brake/reverse into it and the lane piles up.
        let leader: Vehicle | null = null;
        let leaderGap = Infinity;
        for (const u of vehicles) {
          if (u === v) continue;
          if (u.axis !== v.axis) continue;
          if (u.fixedPos !== v.fixedPos) continue;
          if (Math.sign(u.targetVel) !== dir) continue;
          const ahead = (u.pos - v.pos) * dir;          // >0 ⇒ u is in front of v
          if (ahead <= 0) continue;                     // skip vehicles behind / alongside
          const gap = ahead - (v.len + u.len) / 2;
          if (gap < leaderGap) {
            leaderGap = gap;
            leader = u;
          }
        }
        if (leader) {
          const leaderSpeed = Math.abs(leader.vel);
          if (leaderGap < 0) {
            // Overlap — emergency stop and slide the vehicle back to the gap
            targetSpeed = 0;
            v.vel = 0;
            v.pos -= dir * Math.min(2, -leaderGap);
          } else if (leaderGap < SAFE_GAP) {
            targetSpeed = Math.min(targetSpeed, leaderSpeed * 0.30);
          } else if (leaderGap < REACT_GAP) {
            const f = leaderGap / REACT_GAP;
            targetSpeed = Math.min(targetSpeed, Math.max(leaderSpeed, cruise * f));
          }
        }

        // Pedestrians always cross first — find the nearest one ahead.
        const pGap = pedestrianGap(v, dir);

        // Intersection 4-way stop
        const next = nextIntersection(v, dir);
        if (next) {
          // Length-aware stop line — a long bus/truck stops far enough back
          // that its nose never pokes into the intersection box.
          const distToLine = next.gap - (ROAD_W / 2 + v.len / 2 + STOP_LINE_PAD);
          const alreadyCleared = !Number.isNaN(v.clearedAt) && v.clearedAt === next.cross;

          if (!alreadyCleared && distToLine < STOP_REACT && distToLine > -ROAD_W / 2) {
            const busy      = intersectionBusy(next.cross, v.fixedPos, v.axis, v);
            const contested = busy ||
              intersectionContested(next.cross, v.fixedPos, v.axis, v);
            const speed  = Math.abs(v.vel);
            const atLine = distToLine < 4;

            if (contested && atLine) {
              // Hold at the stop line until the crossing is clear, then
              // reserve it and pull away.
              let cleared = false;
              if (speed < 6) {
                v.stopWaitT += dt;
                // Pull away only when the box is clear AND no pedestrian is crossing.
                if (!busy && pGap > PED_STOP && v.stopWaitT >= MIN_STOP_WAIT) {
                  v.clearedAt = next.cross;          // reserve the crossing
                  v.stopWaitT = 0;
                  cleared = true;
                }
              }
              if (!cleared) targetSpeed = 0;         // brake / hold
            } else if (contested && distToLine > 0) {
              // Cross traffic ahead — brake smoothly all the way to the line.
              const f = Math.max(0, Math.min(1, distToLine / STOP_REACT));
              targetSpeed = Math.min(targetSpeed, cruise * f * f);
            } else if (distToLine > 0) {
              // No cross traffic — roll through without fully stopping.
              const f = Math.max(0, Math.min(1, distToLine / STOP_REACT));
              targetSpeed = Math.min(targetSpeed, Math.max(8, cruise * f * f));
            }
          }
        }

        // Release the intersection reservation once fully past the crossing.
        if (!Number.isNaN(v.clearedAt)) {
          const passed = (v.pos - v.clearedAt) * dir;
          if (passed > ROAD_W / 2 + v.len / 2 + 4) {
            v.clearedAt = NaN;
            v.stopWaitT = 0;
          }
        }

        // Yield to pedestrians on the roadway — buses, trucks and cars all
        // brake to a stop and let them finish crossing first.
        if (pGap < PED_REACT) {
          if (pGap < PED_STOP) {
            targetSpeed = 0;
            if (pGap < 3) v.vel = 0;               // never roll onto a pedestrian
          } else {
            const f = (pGap - PED_STOP) / (PED_REACT - PED_STOP);
            targetSpeed = Math.min(targetSpeed, cruise * f * f);
          }
        }

        v.vel = v.vel + (dir * targetSpeed - v.vel) * 0.14;
      }
    }

    // ── Main loop ───────────────────────────────────────────────────────────

    function frame(ts: number) {
      rafId = requestAnimationFrame(frame);
      if (!active) return;

      const dt = Math.min((ts - lastT) / 1000, 0.05);
      lastT = ts;
      time += dt;

      ctx!.clearRect(0, 0, W, H);
      drawBase();
      drawSidewalks();
      drawLots();
      drawRoads();
      drawCrosswalks();
      drawMarkings();
      drawStopSigns();
      drawBusStops();
      drawStreetLights();

      updatePedestrians(dt);
      drawPedestrians();

      updateVelocities(dt);

      for (const v of vehicles) {
        const limit = v.axis === 'h' ? W : H;
        v.pos += v.vel * dt;

        const dir = Math.sign(v.targetVel) || 1;
        if (dir > 0 && v.pos > limit + v.len) {
          let newPos = -v.len;
          for (const u of vehicles) {
            if (u === v) continue;
            if (u.axis !== v.axis || u.fixedPos !== v.fixedPos) continue;
            if (Math.sign(u.targetVel) !== 1) continue;
            const minSpawn = u.pos - (u.len + v.len) / 2 - SAFE_GAP * 2;
            if (minSpawn < newPos) newPos = minSpawn;
          }
          v.pos = newPos;
          v.clearedAt = NaN;
          v.stopWaitT = 0;
        }
        if (dir < 0 && v.pos < -v.len) {
          let newPos = limit + v.len;
          for (const u of vehicles) {
            if (u === v) continue;
            if (u.axis !== v.axis || u.fixedPos !== v.fixedPos) continue;
            if (Math.sign(u.targetVel) !== -1) continue;
            const maxSpawn = u.pos + (u.len + v.len) / 2 + SAFE_GAP * 2;
            if (maxSpawn > newPos) newPos = maxSpawn;
          }
          v.pos = newPos;
          v.clearedAt = NaN;
          v.stopWaitT = 0;
        }

        drawVehicle(v);
      }
    }

    // ── Bootstrap ───────────────────────────────────────────────────────────

    resize();
    lastT = performance.now();
    rafId = requestAnimationFrame(frame);

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
