import { createTraffic, signalPhase, type Traffic } from './traffic';
import { CROSSINGS, LEAF, RAIL_COLUMNS, RIVER, YACHT, crossingLift, yachtX, type Crossing } from './river';

export { RAIL_COLUMNS };

/** An illustrative city, not live coverage or rider-location data. All positions are local. */
export type Point = { x: number; y: number };
type Cell = readonly [number, number];
export type Route = { points: Point[]; lengths: number[]; length: number; color: string; transit: boolean; phase: number };
type Scenery = { kind: 'building' | 'tree' | 'shelter' | 'dock' | 'lamp' | 'bench' | 'goal' | 'hoop' | 'station' | 'canopy'; x: number; y: number; width: number; depth: number; height: number; variant: number };
type Sprite = { image: HTMLCanvasElement; x: number; y: number; width: number; height: number };
export type MobilityScene = {
  streets: Point[][];
  routes: Route[];
  hubs: Point[];
  docks: Point[];
  connections: { points: Point[] }[];
  facilities: { kind: 'soccer' | 'basketball' | 'rink' | 'park' | 'fair'; x: number; y: number; width: number; depth: number }[];
  traffic: Traffic;
  scenery: Scenery[];
  sprites: Map<Scenery, Sprite>;
};
export const MAP_WIDTH = 1400;
export const MAP_HEIGHT = 1000;
const STEP = 112;
/**
 * Street cross-section, measured from a road's centre line: asphalt to 14 (one 14-wide lane each way),
 * then pavement to 26 carrying a kerbside bike lane (14.5–21.5) and a footway (21.5–28.5).
 * Lots start beyond 26, so nothing is built on the pavement.
 */
const ROAD_HALF = 14;
const PAVEMENT = 12;
const BIKE_LANE = { from: 14.5, to: 21.5 };
const GOLD = '#e9b616';
const GO_GREEN = ['#5a8a37', '#4a7729', '#3b5f21'] as const;
/** River water spans world y 716–800; boats keep to lanes inside it. */

/** The yacht is drawn 1.45× the size of its base model (~26 m long). */
const YACHT_SCALE = 1.45;
/**
 * Canadian flag on a small plaza at the drawbridge's south (camera-facing) end. It stands at the
 * plaza's front on a pole short enough that, on screen, the flag always sits below the river's far
 * edge, so it never overlaps the water, the boats or the raised bridge.
 */
const FLAG = { x: 612, y: 868, pole: 36, width: 30, height: 15 };

/**
 * Moving figures are enlarged so they read at hero size: people, scooters and bikes 2.5× real scale,
 * cars, buses and trains 1.5× (the most that still fits the lanes). Buildings stay at ~0.26 m/unit.
 */
const PERSON_SCALE = 2.5;
const VEHICLE_SCALE = 1.5;

/** Brand artwork painted into the scene; signs fall back to lettering until each image has loaded. */
const logos: { go: HTMLImageElement | null; scooty: HTMLImageElement | null } = { go: null, scooty: null };
export function setSceneLogo(kind: keyof typeof logos, image: HTMLImageElement) { logos[kind] = image; }
/** GO stations, by the block they occupy beside a railway: one top-left, one right of centre in the hero. */
export const GO_STATIONS = [{ col: 0, row: 2 }, { col: 6, row: 3 }];
/** Station platforms span these offsets within their block; trains stop centred on the platform. */
export const PLATFORM = { x: 61, top: 16, bottom: 96 };
const COLS = 8;
const ROWS = 8;

export function project(p: Point, z = 0): Point {
  return { x: 700 + (p.x - p.y) * .9, y: 88 + (p.x + p.y) * .48 - z };
}
function mix(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
export function makeRoute(points: Point[], transit: boolean, phase: number, color = GOLD): Route {
  let length = 0;
  const lengths = points.map((p, i) => {
    if (i) length += Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y);
    return length;
  });
  return { points, lengths, length, color, transit, phase };
}
export function routePoint(route: Route, distance: number): Point & { angle: number } {
  const d = Math.max(0, Math.min(route.length, distance));
  let i = 1;
  while (i < route.lengths.length - 1 && route.lengths[i] < d) i++;
  const a = route.points[i - 1], b = route.points[i];
  const length = route.lengths[i] - route.lengths[i - 1];
  return { ...mix(a, b, length ? (d - route.lengths[i - 1]) / length : 0), angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

export function createMobilityScene(): MobilityScene {
  const grid = Array.from({ length: ROWS }, (_, y) => Array.from({ length: COLS }, (_, x) => ({ x: x * STEP, y: y * STEP })));
  const at = ([x, y]: Cell) => grid[y][x];
  const streets = [...grid, ...Array.from({ length: COLS }, (_, x) => grid.map(row => row[x]))];
  const hubCells: Cell[] = [[2, 2], [4, 2], [5, 4], [2, 5], [4, 5]];
  const hubs = hubCells.map(at);
  const walk = (start: Cell, end: Cell, horizontalFirst: boolean) => {
    let [x, y] = start;
    const points = [at(start)];
    const across = () => { while (x !== end[0]) { x += Math.sign(end[0] - x); points.push(at([x, y])); } };
    const down = () => { while (y !== end[1]) { y += Math.sign(end[1] - y); points.push(at([x, y])); } };
    if (horizontalFirst) { across(); down(); } else { down(); across(); }
    return points;
  };
  const routes = [
    makeRoute([...walk([0, 2], [5, 2], true), ...walk([5, 2], [5, 7], false).slice(1)], true, .16),
    makeRoute([...walk([2, 0], [2, 5], false), ...walk([2, 5], [7, 5], true).slice(1)], true, .62),
    makeRoute(walk([4, 0], [4, 6], false), true, .84),
  ];
  const docks: Point[] = [];
  hubCells.forEach((hub, h) => {
    for (let i = 0; i < 3; i++) {
      const dock: Cell = [Math.max(1, Math.min(6, hub[0] + (i % 2 ? -1 : 1))), Math.max(1, Math.min(5, hub[1] + (i === 2 ? -1 : 1)))];
      docks.push(at(dock));
      const points = walk(dock, hub, i % 2 === 0);
      if (i % 2) points.reverse();
      routes.push(makeRoute(points, false, (h * .193 + i * .317) % 1));
    }
  });
  const scenery: Scenery[] = [];
  const facilities: MobilityScene['facilities'] = [
    { kind: 'soccer', x: 3 * STEP + 23, y: 2 * STEP + 28, width: 64, depth: 55 },
    { kind: 'soccer', x: 5 * STEP + 23, y: 4 * STEP + 28, width: 64, depth: 55 },
    { kind: 'basketball', x: STEP + 27, y: 4 * STEP + 28, width: 60, depth: 54 },
    { kind: 'basketball', x: 4 * STEP + 27, y: 3 * STEP + 28, width: 60, depth: 54 },
    { kind: 'rink', x: 4 * STEP + 25, y: 25, width: 64, depth: 62 },
    { kind: 'fair', x: 5 * STEP + 25, y: STEP + 25, width: 64, depth: 62 },
    { kind: 'fair', x: 2 * STEP + 25, y: 5 * STEP + 25, width: 64, depth: 62 },
    { kind: 'park', x: 2 * STEP + 25, y: STEP + 25, width: 64, depth: 62 },
    { kind: 'park', x: 3 * STEP + 25, y: 5 * STEP + 25, width: 64, depth: 62 },
  ];
  const add = (kind: Scenery['kind'], x: number, y: number, width: number, depth: number, height: number, variant = 0) => scenery.push({ kind, x, y, width, depth, height, variant });
  for (let y = 0; y < 6; y++) {
    for (let x = 1; x < 7; x++) {
      const u = x * STEP, v = y * STEP;
      const facility = facilities.find(field => Math.floor(field.x / STEP) === x && Math.floor(field.y / STEP) === y);
      const park = Boolean(facility);
      if (RAIL_COLUMNS.includes(x)) {
        // Lots beside the GO line are filled by the railway narrow-lot loop below.
      } else if (!park) {
        const variant = [0, 1, 2, 3, 4, 7, 8, 9, 10][(x * 7 + y * 3) % 9];
        const tower = (x === 3 && y === 3) || (x === 4 && y === 1) || (x === 1 && y === 2);
        add('building', u + 30, v + 30, variant === 7 ? 52 : 37, variant === 8 ? 43 : 36, tower ? 110 + x * 7 : variant === 7 ? 15 : variant === 8 ? 23 : variant === 9 ? 34 : variant === 10 ? 28 : 24 + variant * 7, tower ? 5 : variant);
        if (!tower && variant < 7 && (x + y) % 2 === 0) add('building', u + 72, v + 49, 13, 25, 24, 1);
        add('tree', u + 83, v + 24, 18, 18, 27, x % 3);
        if (!hubCells.some(([hx, hy]) => hx === x && hy === y + 1)) add('tree', u + 29, v + 83, 19, 19, 28, y % 3); // Else the stop's shelter stands here.
      } else {
        // Kept inside the kerbside bike lane that rings the block.
        add('tree', u + 26, v + 85, 15, 15, 20, 1);
        add('tree', u + 86, v + 85, 15, 15, 20, 2);
        add('bench', u + 46, v + 84, 18, 4, 5);
        if (facility?.kind === 'park') {
          add('tree', u + 35, v + 35, 19, 19, 29, 0);
          add('tree', u + 82, v + 39, 19, 19, 26, 2);
          add('bench', u + 70, v + 71, 16, 4, 5);
        }
      }
      if ((x + y) % 2 === 0) add('lamp', u + 15, v + 15, 2, 2, 36);
      if (y === 5) {
        add('tree', u + 25, 700, 19, 19, 28, 1);
        add('bench', u + 60, 699, 18, 4, 5);
      }
    }
  }
  // Fill every outlying block the camera can reach at any aspect ratio, so the city never ends in bare lots.
  const onCamera = (u: number, v: number) => {
    const p = project({ x: u + STEP / 2, y: v + STEP / 2 });
    return p.x > -90 && p.x < MAP_WIDTH + 90 && p.y > -60 && p.y < MAP_HEIGHT + 110;
  };
  for (let y = -5; y <= 12; y++) {
    if (y === 6) continue; // River and embankment remain clear.
    for (let x = -5; x <= 12; x++) {
      if (RAIL_COLUMNS.includes(x)) continue; // Railway corridors.
      if (x >= 1 && x <= 6 && y >= 0 && y < 6) continue;
      const u = x * STEP, v = y * STEP;
      if (!onCamera(u, v)) continue;
      if (u <= FLAG.x && FLAG.x < u + STEP && v <= FLAG.y && FLAG.y < v + STEP) {
        // Flag plaza: open paving (drawn with the ground) with benches and a couple of trees.
        add('bench', FLAG.x - 30, FLAG.y - 24, 18, 4, 5);
        add('bench', FLAG.x + 10, FLAG.y - 24, 18, 4, 5);
        add('tree', u + 84, RIVER.bottom + 20, 20, 20, 28, 0);
        add('tree', u + 84, v + 64, 20, 20, 26, 2);
        continue;
      }
      const hash = Math.abs((x * 73856093) ^ (y * 19349663)) % 997;
      if (hash % 7 === 0) {
        // Pocket park: a small grove with a bench.
        // South-bank parks squeeze between the embankment and the next street's pavement.
        const place = (b: number) => y === 7 ? RIVER.bottom + 14 + (b - 30) * .5 : v + b;
        [[30, 34], [72, 30], [40, 74], [80, 70]].forEach(([a, b], i) => add('tree', u + a, place(b), 20, 20, 26 + i * 2, (hash + i) % 3));
        add('bench', u + 50, v + 55, 18, 4, 5);
        continue;
      }
      const variant = [0, 1, 2, 3, 7, 8, 9, 10, 0, 3][hash % 10];
      const height = variant === 7 ? 15 : variant === 8 ? 23 : variant === 9 ? 34 : variant === 10 ? 28 : 24 + (hash % 3) * 6;
      // South-bank homes fit between the embankment and the next street's pavement.
      const southBank = y === 7;
      const depth = southBank ? 34 : variant === 8 ? 43 : 35;
      add('building', u + 31, southBank ? RIVER.bottom + 12 : v + 31, variant === 7 ? 52 : 37, depth, height, variant);
      if (southBank && variant !== 7) add('tree', u + 76, RIVER.bottom + 12, 18, 18, 27, hash % 3); // Riverside tree beside the house.
      if (variant < 4 && hash % 2 === 0 && !southBank) add('building', u + 72, v + 36, 13, 25, 22, (variant + 1) % 4);
      if (!southBank) add('tree', u + 82, v + 72, 20, 20, 28, hash % 3);
      if (hash % 3 === 0 && !southBank) add('tree', u + 30, v + 80, 18, 18, 25, (hash + 1) % 3);
    }
  }
  // Narrow lots between each railway and the street to its west.
  for (const col of RAIL_COLUMNS) for (let y = -5; y <= 12; y++) {
    const u = col * STEP, v = y * STEP;
    if (y === 6 || (col === 0 && y >= 0 && y <= 4) || GO_STATIONS.some(st => st.col === col && st.row === y) || !onCamera(u, v)) continue;
    add('building', u + 28, y === 7 ? RIVER.bottom + 12 : v + 31, 30, y === 7 ? 34 : 36, 24 + (Math.abs(y + col) % 3) * 6, [9, 0, 10, 2][Math.abs(y + col) % 4]);
    add('tree', u + 60, v + 84, 18, 18, 26, Math.abs(y) % 3);
  }
  // Every river crossing is a drawbridge, drawn live in drawMobilityFlow.
  // GO station districts beside the railways, each with a SCOOTY dock for first/last-mile trips.
  for (const { col, row } of GO_STATIONS) {
    const u = col * STEP, v = row * STEP;
    add('station', u + 28, v + 28, 32, 42, 22);
    for (let y = v + PLATFORM.top + 4; y < v + PLATFORM.bottom - 4; y += 12) add('canopy', u + PLATFORM.x + 1, y, 15, 12, 15);
    add('dock', u + 30, v + 84, 25, 8, 12, 0);
  }
  for (let n = 0; n < 12; n++) {
    const y = 34 + n * 47;
    if ((y > 200 && y < 335) || Math.abs(y - Math.round(y / STEP) * STEP) < 24) continue; // Station block and cross streets.
    add('tree', 18 + n % 2 * 46, y, 19, 19, 29, n % 3);
  }
  hubs.forEach((p, i) => {
    add('shelter', p.x + 30, p.y - 40, 22, 7, 10, i); // ~2.6 m tall bus-stop shelter.
    add('dock', p.x - 58, p.y - 38, 25, 8, 12, i);
  });
  facilities.forEach(field => {
    if (field.kind !== 'soccer' && field.kind !== 'basketball') return;
    const kind = field.kind === 'soccer' ? 'goal' : 'hoop';
    const h = kind === 'goal' ? 10 : 17;
    add(kind, field.x + 1, field.y + field.depth / 2 - 8, 4, 16, h, 0);
    add(kind, field.x + field.width - 1, field.y + field.depth / 2 - 8, 4, 16, h, 1);
  });
  scenery.sort((a, b) => a.x + a.y + (a.width + a.depth) / 2 - b.x - b.y - (b.width + b.depth) / 2);
  return { streets, routes, hubs, docks, connections: [], facilities, traffic: createTraffic(), scenery, sprites: new Map() };
}

function polygon(ctx: CanvasRenderingContext2D, points: Point[], fill: string, stroke?: string) {
  ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = .6; ctx.stroke(); }
}
function plane(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, depth: number, color: string, z = 0) {
  polygon(ctx, [project({ x, y }, z), project({ x: x + width, y }, z), project({ x: x + width, y: y + depth }, z), project({ x, y: y + depth }, z)], color);
}
function line(ctx: CanvasRenderingContext2D, a: Point, b: Point, color: string, width = 1) {
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, d: number, h: number, colors: readonly string[], z = 0) {
  const a = { x, y }, b = { x: x + w, y }, c = { x: x + w, y: y + d }, e = { x, y: y + d };
  polygon(ctx, [project(e, z), project(c, z), project(c, z + h), project(e, z + h)], colors[1]);
  polygon(ctx, [project(b, z), project(c, z), project(c, z + h), project(b, z + h)], colors[2]);
  polygon(ctx, [project(a, z + h), project(b, z + h), project(c, z + h), project(e, z + h)], colors[0]);
}
function ellipse(ctx: CanvasRenderingContext2D, p: Point, rx: number, ry: number, color: string) {
  ctx.beginPath(); ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
}
function roof(ctx: CanvasRenderingContext2D, o: Scenery) {
  const { x, y, width: w, depth: d, height: h } = o;
  const colors = [['#d28b63', '#ab5f48'], ['#559eaf', '#316979'], ['#8e87b9', '#665b8b'], ['#e4b752', '#bf893e']][o.variant % 4];
  const ridgeA = project({ x: x + w / 2, y: y - 2 }, h + 17);
  const ridgeB = project({ x: x + w / 2, y: y + d + 2 }, h + 17);
  polygon(ctx, [project({ x: x - 3, y: y - 2 }, h), ridgeA, ridgeB, project({ x: x - 3, y: y + d + 2 }, h)], colors[0]);
  polygon(ctx, [ridgeA, project({ x: x + w + 3, y: y - 2 }, h), project({ x: x + w + 3, y: y + d + 2 }, h), ridgeB], colors[1]);
  polygon(ctx, [project({ x, y: y + d }, h), project({ x: x + w, y: y + d }, h), ridgeB], '#d8cfb0');
}

/**
 * Paints a logo flat on a horizontal surface (a roof) at height `z`, reading along `heading`; it is
 * flipped when needed so it never reads upside down. `pad` adds a white backing panel.
 */
function flatLogo(ctx: CanvasRenderingContext2D, kind: keyof typeof logos, centre: Point, z: number, width: number, heading: number, pad = 0) {
  const aspect = kind === 'go' ? 22 / 46 : 484 / 1800, height = width * aspect;
  let cos = Math.cos(heading), sin = Math.sin(heading);
  if (cos - sin < 0) { cos = -cos; sin = -sin; }
  const at = project(centre, z);
  ctx.save();
  ctx.translate(at.x, at.y);
  ctx.transform(.9 * (cos - sin), .48 * (cos + sin), .9 * (-sin - cos), .48 * (cos - sin), 0, 0);
  if (pad) { ctx.fillStyle = '#fbfcf7'; ctx.fillRect(-width / 2 - pad, -height / 2 - pad, width + pad * 2, height + pad * 2); }
  const image = logos[kind];
  if (image) ctx.drawImage(image, -width / 2, -height / 2, width, height);
  else {
    ctx.fillStyle = kind === 'go' ? GO_GREEN[1] : '#181916';
    ctx.font = `800 ${height * .8}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(kind === 'go' ? 'GO' : 'SCOOTY', 0, 0);
  }
  ctx.restore();
}

/**
 * Paints a logo flat onto a street-facing (+y) wall.
 * Text falls back to lettering while the image is still loading.
 */
function wallLogo(ctx: CanvasRenderingContext2D, kind: keyof typeof logos, at: Point, width: number) {
  const image = logos[kind];
  const aspect = kind === 'go' ? 22 / 46 : 484 / 1800;
  ctx.save();
  ctx.translate(at.x, at.y);
  ctx.transform(.9, .48, 0, 1, 0, 0);
  if (image) {
    ctx.drawImage(image, -width / 2, -width * aspect / 2, width, width * aspect);
  } else {
    ctx.fillStyle = kind === 'go' ? GO_GREEN[1] : '#181916';
    ctx.font = `800 ${width * (kind === 'go' ? .55 : .2)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(kind === 'go' ? 'GO' : 'SCOOTY', 0, 0);
  }
  ctx.restore();
}

function groundArc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, start: number, end: number, color: string, width = 1, z = .3) {
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const angle = start + (end - start) * i / 40;
    const p = project({ x: x + Math.cos(angle) * r, y: y + Math.sin(angle) * r }, z);
    if (!i) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function groundOutline(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, d: number, color: string) {
  const points = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + d }, { x, y: y + d }, { x, y }];
  for (let i = 1; i < points.length; i++) line(ctx, project(points[i - 1], .3), project(points[i], .3), color, .85);
}
function drawFacility(ctx: CanvasRenderingContext2D, field: MobilityScene['facilities'][number]) {
  const { x, y, width: w, depth: d } = field;
  const white = '#fff6d8';
  plane(ctx, x - 1, y - 1, w + 2, d + 2, field.kind === 'soccer' ? '#6aad7b' : '#638ca8');
  if (field.kind === 'rink') {
    plane(ctx, x - 1, y - 1, w + 2, d + 2, '#f5edcf');
    plane(ctx, x, y, w, d, '#d4f0f2');
    groundOutline(ctx, x + 2, y + 2, w - 4, d - 4, '#79b4c6');
    for (const u of [.28, .72]) line(ctx, project({ x: x + w * u, y }), project({ x: x + w * u, y: y + d }), '#80aec6', 1.2);
    line(ctx, project({ x: x + w / 2, y }), project({ x: x + w / 2, y: y + d }), '#d78088', 1);
    groundArc(ctx, x + w / 2, y + d / 2, 9, 0, Math.PI * 2, '#d78088');
    for (const v of [y - 3, y + d]) box(ctx, x - 3, v, w + 6, 2, 3, ['#fff9e7', '#b9dce1', '#8db7c5']);
    return;
  }
  if (field.kind === 'park' || field.kind === 'fair') {
    plane(ctx, x - 1, y - 1, w + 2, d + 2, '#83b77e');
    plane(ctx, x + w / 2 - 4, y - 1, 8, d + 2, '#e7d7ac');
    plane(ctx, x - 1, y + d / 2 - 4, w + 2, 8, '#e7d7ac');
    if (field.kind === 'park') {
      groundArc(ctx, x + w / 2, y + d / 2, 15, 0, Math.PI * 2, '#e7d7ac', 5);
      groundArc(ctx, x + w / 2, y + d / 2, 9, 0, Math.PI * 2, '#92c7c6', 8);
      for (let i = 0; i < 12; i++) ellipse(ctx, project({ x: x + 8 + i % 4 * 4, y: y + d - 17 + Math.floor(i / 4) * 4 }), 2, 1.3, ['#f0cd60', '#e899a0', '#c1a1cf'][i % 3]);
    } else {
      plane(ctx, x + 10, y + 12, w - 20, d - 24, '#ebd5b0');
      box(ctx, x + 4, y + d - 16, 14, 9, 8, ['#f2c948', '#d78968', '#ae6658']);
    }
    return;
  }
  if (field.kind === 'soccer') {
    for (let i = 0; i < 8; i++) plane(ctx, x + w * i / 8, y, w / 8, d, i % 2 ? '#419c71' : '#52ac77');
    groundOutline(ctx, x, y, w, d, white);
    line(ctx, project({ x: x + w / 2, y }, .3), project({ x: x + w / 2, y: y + d }, .3), white, .85);
    groundArc(ctx, x + w / 2, y + d / 2, 8, 0, Math.PI * 2, white, .8);
    for (const end of [x, x + w - 12]) groundOutline(ctx, end, y + d / 2 - 15, 12, 30, white);
    for (const end of [x, x + w - 5]) groundOutline(ctx, end, y + d / 2 - 8, 5, 16, white);
    ellipse(ctx, project({ x: x + w / 2, y: y + d / 2 }, .3), 1, .5, white);
  } else {
    plane(ctx, x, y, w, d, '#df986e');
    for (const end of [x, x + w - 13]) plane(ctx, end, y + d / 2 - 10, 13, 20, '#708bb6');
    groundOutline(ctx, x, y, w, d, white);
    line(ctx, project({ x: x + w / 2, y }, .3), project({ x: x + w / 2, y: y + d }, .3), white, .85);
    groundArc(ctx, x + w / 2, y + d / 2, 7, 0, Math.PI * 2, white, .8);
    for (const end of [x, x + w - 13]) groundOutline(ctx, end, y + d / 2 - 10, 13, 20, white);
    groundArc(ctx, x + 13, y + d / 2, 7, -Math.PI / 2, Math.PI / 2, white, .8);
    groundArc(ctx, x + w - 13, y + d / 2, 7, Math.PI / 2, Math.PI * 1.5, white, .8);
    groundArc(ctx, x + 3, y + d / 2, 22, -Math.PI / 2, Math.PI / 2, white, .8);
    groundArc(ctx, x + w - 3, y + d / 2, 22, Math.PI / 2, Math.PI * 1.5, white, .8);
  }
}

function drawScenery(ctx: CanvasRenderingContext2D, o: Scenery) {
  const { x, y, width: w, depth: d, height: h } = o;
  if (o.kind === 'building') {
    const warm = o.variant !== 5;
    box(ctx, x - 2, y - 2, w + 4, d + 4, 2, ['#d4d1bf', '#aaa998', '#969e91']);
    const palettes = [['#ffe2bb', '#efbb91', '#c89075'], ['#d3eaf1', '#9dcbd8', '#75a9bd'], ['#eddef6', '#cab2dc', '#a890bf'], ['#ffe8a0', '#efcb71', '#c49e57'], ['#d5edcf', '#a7d1af', '#7aac98'], ['#d4f0ef', '#a7d3d7', '#73acbb'], ['#ffeac1', '#e7ca8e', '#b4b789']];
    box(ctx, x, y, w, d, h, palettes[o.variant % palettes.length]);
    for (let level = 8; level < h - 3; level += 12) {
      for (let i = 6; i < w - 4; i += 10) {
        polygon(ctx, [project({ x: x + i, y: y + d + .1 }, level), project({ x: x + i + 4, y: y + d + .1 }, level), project({ x: x + i + 4, y: y + d + .1 }, level + 6), project({ x: x + i, y: y + d + .1 }, level + 6)], warm ? '#8a9c91' : '#668792');
      }
      for (let i = 6; i < d - 4; i += 11) {
        polygon(ctx, [project({ x: x + w + .1, y: y + i }, level), project({ x: x + w + .1, y: y + i + 4 }, level), project({ x: x + w + .1, y: y + i + 4 }, level + 6), project({ x: x + w + .1, y: y + i }, level + 6)], '#607f81');
      }
      if (!warm) {
        line(ctx, project({ x, y: y + d }, level + 8), project({ x: x + w, y: y + d }, level + 8), '#e0e3d5', 1.8);
        line(ctx, project({ x: x + w, y }, level + 8), project({ x: x + w, y: y + d }, level + 8), '#bccdc7', 1.8);
      }
    }
    if (o.variant < 4 || o.variant === 7 || o.variant === 9) {
      roof(ctx, { ...o, height: h, variant: o.variant === 7 ? 0 : o.variant });
      if (o.variant === 7) {
        // Broad single-storey bungalow, porch and chimney.
        box(ctx, x + 7, y + d, w - 14, 9, 2, ['#eee1bf', '#c6b28d', '#ad9779']);
        for (const u of [x + 9, x + w - 9]) line(ctx, project({ x: u, y: y + d + 7 }, 2), project({ x: u, y: y + d + 7 }, 12), '#f3e5c9', 1.6);
        plane(ctx, x + 5, y + d - 1, w - 10, 12, '#b57857', 13);
        box(ctx, x + 7, y + 8, 6, 6, 18, ['#b98971', '#9f6e5d', '#825248'], h + 6);
      }
      if (o.variant === 9) {
        // Townhouse: projecting bay and a smaller cross-gable.
        box(ctx, x + 6, y + d - 3, 14, 10, h - 8, ['#f3e4c4', '#d8bba1', '#b49481']);
        roof(ctx, { ...o, x: x + 5, y: y + d - 4, width: 16, depth: 12, height: h - 8, variant: 2 });
      }
    }
    else {
      box(ctx, x + 4, y + 4, w - 8, d - 8, 3, ['#b9c4b6', '#b3b59f', '#9ea994'], h);
      box(ctx, x + 8, y + 8, 11, 10, 5, ['#c9d0c7', '#a8b3af', '#889c9b'], h + 3);
      plane(ctx, x + 8, y + d - 15, w - 16, 9, '#527980', h + 4);
    }
    if (o.variant === 8) {
      // Modern split-level home with an offset upper volume and roof terrace.
      box(ctx, x + 3, y + 2, w * .6, d * .55, 13, ['#f3eee0', '#ddd5c1', '#a9b8aa'], h);
      plane(ctx, x + 5, y + 5, w * .45, d * .35, '#547e8c', h + 13.3);
      box(ctx, x + w - 10, y + d - 10, 7, 7, 4, ['#87ab73', '#73955f', '#537951'], h + 3);
    }
    if (o.variant === 10) {
      // Brick duplex, two entrances and a striped storefront awning.
      for (const u of [x + 5, x + w - 12]) box(ctx, u, y + d, 7, 2, 11, ['#6f8279', '#526b67', '#415850']);
      for (let i = 0; i < 7; i++) plane(ctx, x + 1 + i * 5, y + d, 5, 7, i % 2 ? '#f2ddab' : '#c97561', 14);
    }
    // Recessed ground-floor entrance and shop canopy.
    polygon(ctx, [project({ x: x + w / 2 - 3, y: y + d + .2 }, 0), project({ x: x + w / 2 + 3, y: y + d + .2 }, 0), project({ x: x + w / 2 + 3, y: y + d + .2 }, 9), project({ x: x + w / 2 - 3, y: y + d + .2 }, 9)], '#506966');
    if (o.variant === 4 || o.variant === 6) plane(ctx, x + 4, y + d, w - 8, 7, '#497f78', 12);
  } else if (o.kind === 'tree') {
    const p = project({ x, y }, h);
    line(ctx, project({ x, y }), project({ x, y }, h), '#8b8d65', 3);
    const greens = [['#acd877', '#569867', '#81ba6d'], ['#d1df7a', '#87b35c', '#b1cf6b'], ['#78c19d', '#428f7d', '#62aa88']][o.variant % 3];
    polygon(ctx, [{ x: p.x - 11, y: p.y - 3 }, { x: p.x - 5, y: p.y - 13 }, { x: p.x + 6, y: p.y - 12 }, { x: p.x + 12, y: p.y - 3 }, { x: p.x + 10, y: p.y + 10 }, { x: p.x, y: p.y + 16 }, { x: p.x - 11, y: p.y + 8 }], greens[0]);
    polygon(ctx, [{ x: p.x + 3, y: p.y - 10 }, { x: p.x + 12, y: p.y - 3 }, { x: p.x + 10, y: p.y + 10 }, { x: p.x, y: p.y + 16 }, { x: p.x + 2, y: p.y + 3 }], greens[1]);
    polygon(ctx, [{ x: p.x - 11, y: p.y - 3 }, { x: p.x + 2, y: p.y + 3 }, { x: p.x, y: p.y + 16 }, { x: p.x - 11, y: p.y + 8 }], greens[2]);
  } else if (o.kind === 'shelter') {
    box(ctx, x, y, w, d, 1.5, ['#e0e2d6', '#c1c5b6', '#b5bdb4']);
    for (const u of [x + 2, x + w - 2]) line(ctx, project({ x: u, y: y + d }), project({ x: u, y: y + d }, h), '#548079', 1.4);
    polygon(ctx, [project({ x, y: y + d }, 3), project({ x: x + w, y: y + d }, 3), project({ x: x + w, y: y + d }, h - 2), project({ x, y: y + d }, h - 2)], '#74a69d66');
    box(ctx, x - 2, y - 2, w + 4, d + 4, 3, ['#66978b', '#477b73', '#376864'], h);
    box(ctx, x + 4, y + 3, w - 8, 2, 2, ['#c4c29e', '#9d9e84', '#878f7d']);
    box(ctx, x + w + 4, y, 1.5, 1.5, 12, ['#687e73', '#687e73', '#687e73']);
    box(ctx, x + w + 2.5, y - .5, 4.5, 2, 3.5, ['#f1c338', '#e9b616', '#ac922e'], 10);
  } else if (o.kind === 'dock') {
    plane(ctx, x - 3, y - 5, 33, 18, '#d5d7c6');
    for (let i = 0; i < 3; i++) drawScooter(ctx, { x: x + 3 + i * 10, y: y + 4 }, Math.PI / 2, false, i);
    line(ctx, project({ x: x - 3, y: y - 5 }), project({ x: x + 30, y: y - 5 }), GOLD, 2);
  } else if (o.kind === 'lamp') {
    line(ctx, project({ x, y }), project({ x, y }, h), '#788b80', 1.3);
    line(ctx, project({ x, y }, h), project({ x: x + 8, y }, h + 1), '#788b80', 1.5);
    plane(ctx, x + 5, y - 2, 7, 3, '#b3bf9d', h + 1);
  } else if (o.kind === 'goal') {
    const rear = x + (o.variant ? 4 : -4);
    for (const v of [y, y + d]) {
      line(ctx, project({ x, y: v }), project({ x, y: v }, h), '#faf8e8', 1.4);
      line(ctx, project({ x, y: v }, h), project({ x: rear, y: v }, h - 3), '#e4e8d3', .9);
      line(ctx, project({ x: rear, y: v }), project({ x: rear, y: v }, h - 3), '#dce5cf', .9);
    }
    line(ctx, project({ x, y }, h), project({ x, y: y + d }, h), '#faf8e8', 1.4);
    for (let v = y; v <= y + d; v += 3) line(ctx, project({ x: rear, y: v }), project({ x: rear, y: v }, h - 3), '#f2f4dfaa', .5);
    for (let z = 2; z < h; z += 2) line(ctx, project({ x: rear, y }, z), project({ x: rear, y: y + d }, z), '#f2f4dfaa', .5);
  } else if (o.kind === 'hoop') {
    const direction = o.variant ? -1 : 1;
    const p = { x, y: y + d / 2 };
    line(ctx, project(p), project(p, h), '#506a7f', 1.6);
    polygon(ctx, [project({ x, y: p.y - 5 }, h - 1), project({ x, y: p.y + 5 }, h - 1), project({ x, y: p.y + 5 }, h + 6), project({ x, y: p.y - 5 }, h + 6)], '#f8f4e6');
    groundArc(ctx, x + direction * 3, p.y, 2.6, 0, Math.PI * 2, '#ed754d', 1.1, h - 1);
    for (const v of [-2, 2]) line(ctx, project({ x: x + direction * 3, y: p.y + v }, h - 1), project({ x: x + direction * 3, y: p.y + v * .6 }, h - 5), '#faf4df', .65);
  } else if (o.kind === 'station') {
    box(ctx, x - 2, y - 2, w + 4, d + 4, 2, ['#d4d1bf', '#aaa998', '#969e91']);
    box(ctx, x, y, w, d, h, ['#eef0e8', '#dfe2d8', '#bec7bd']);
    const band = (z0: number, z1: number, color: string) => {
      polygon(ctx, [project({ x, y: y + d + .1 }, z0), project({ x: x + w, y: y + d + .1 }, z0), project({ x: x + w, y: y + d + .1 }, z1), project({ x, y: y + d + .1 }, z1)], color);
      polygon(ctx, [project({ x: x + w + .1, y }, z0), project({ x: x + w + .1, y: y + d }, z0), project({ x: x + w + .1, y: y + d }, z1), project({ x: x + w + .1, y }, z1)], color);
    };
    band(4, 13, '#7fa6ad');
    band(h - 6, h - 2, GO_GREEN[1]);
    polygon(ctx, [project({ x: x + w / 2 - 5, y: y + d + .2 }), project({ x: x + w / 2 + 5, y: y + d + .2 }), project({ x: x + w / 2 + 5, y: y + d + .2 }, 12), project({ x: x + w / 2 - 5, y: y + d + .2 }, 12)], '#3f5a57');
    // Extended roof: overhangs the entrance on two posts and reaches across to the platform canopy,
    // with a large GO mark painted on top where it reads from the city's high viewpoint.
    for (const u of [x - 3, x + w]) line(ctx, project({ x: u, y: y + d + 6 }), project({ x: u, y: y + d + 6 }, h), '#6d7f78', 1.4);
    const lot = x - Math.floor(x / STEP) * STEP; // Building's offset within its block.
    const roof = { x: x - 6, y: y - 4, w: PLATFORM.x - lot + 6, d: d + 12 }; // Reaches the platform edge.
    box(ctx, roof.x, roof.y, roof.w, roof.d, 4, GO_GREEN, h);
    flatLogo(ctx, 'go', { x: roof.x + roof.w / 2, y: roof.y + roof.d / 2 }, h + 4, 34, 0, 3);
  } else if (o.kind === 'canopy') {
    for (const v of [y + 2]) for (const u of [x + 2, x + w - 2]) line(ctx, project({ x: u, y: v }, 3), project({ x: u, y: v }, h), '#6d7f78', 1.3);
    box(ctx, x - 1, y, w + 2, d, 2, GO_GREEN, h);
  } else {
    box(ctx, x, y, w, d, h, ['#b69b76', '#977f60', '#6f7560']);
    box(ctx, x, y + d, w, 1.5, 4, ['#b69b76', '#977f60', '#6f7560'], h);
  }
}

export function prepareMobilitySprites(scene: MobilityScene, pixelScale: number) {
  scene.sprites.clear();
  const resolution = Math.max(.75, Math.min(pixelScale, 1.5));
  for (const object of scene.scenery) {
    const origin = project(object);
    const x = Math.floor(origin.x - object.depth * .9 - 30);
    const y = Math.floor(origin.y - object.height - 38);
    const width = Math.ceil((object.width + object.depth) * .9 + 65);
    const height = Math.ceil((object.width + object.depth) * .48 + object.height + 60);
    const image = document.createElement('canvas');
    image.width = Math.ceil(width * resolution); image.height = Math.ceil(height * resolution);
    const ctx = image.getContext('2d');
    if (!ctx) continue;
    ctx.setTransform(resolution, 0, 0, resolution, -x * resolution, -y * resolution);
    drawScenery(ctx, object);
    scene.sprites.set(object, { image, x, y, width, height });
  }
}

/** Ground and shadows are cached once; buildings are cached separately for correct occlusion. */
export function drawMobilityMap(ctx: CanvasRenderingContext2D, scene: MobilityScene) {
  ctx.fillStyle = '#c4df9e'; ctx.fillRect(-1000, -1000, 4000, 4000);
  plane(ctx, -700, -700, 2400, 2400, '#c0dca0');
  // River, embankments, and a continuous waterfront walking route.
  plane(ctx, -700, RIVER.top, 2400, RIVER.bottom - RIVER.top, '#58afb8');
  plane(ctx, -700, RIVER.top - 8, 2400, 8, '#dce0cb', 2);
  plane(ctx, -700, RIVER.bottom, 2400, 8, '#dce0cb', 2);
  for (let n = 0; n < 104; n++) {
    const x = -600 + n * 21, y = RIVER.top + 10 + n % 5 * 15;
    line(ctx, project({ x, y }), project({ x: x + 13, y }), '#a1c2bc', .7);
  }
  // Pavements are painted before any asphalt, so no pavement strip ever lies across a road.
  const roads: [number, number, number, number][] = [];
  for (let i = -5; i <= 13; i++) {
    if (i !== 7) roads.push([-600, i * STEP - ROAD_HALF, 2100, ROAD_HALF * 2]); // Row 7 would run through the river.
    roads.push([i * STEP - ROAD_HALF, -600, ROAD_HALF * 2, RIVER.top - 8 + 600]);
    roads.push([i * STEP - ROAD_HALF, RIVER.bottom + 8, ROAD_HALF * 2, 800]);
  }
  for (const [x, y, w, d] of roads) {
    if (w > d) plane(ctx, x, y - PAVEMENT, w, d + PAVEMENT * 2, '#e8e7d9');
    else plane(ctx, x - PAVEMENT, y, w + PAVEMENT * 2, d, '#e8e7d9');
  }
  for (const [x, y, w, d] of roads) plane(ctx, x, y, w, d, '#adaeaa');
  // Kerbside bike lanes ring each block (scooters and bikes circulate on them, never on the road).
  const lane = BIKE_LANE.to - BIKE_LANE.from;
  for (let by = -5; by <= 12; by++) for (let bx = -5; bx <= 13; bx++) {
    if (by === 6 || RAIL_COLUMNS.includes(bx)) continue;
    const u = bx * STEP, v = by * STEP, p = project({ x: u + STEP / 2, y: v + STEP / 2 });
    if (p.x < -150 || p.x > MAP_WIDTH + 150 || p.y < -150 || p.y > MAP_HEIGHT + 150) continue;
    const near = BIKE_LANE.from, far = STEP - BIKE_LANE.to, span = STEP - 2 * BIKE_LANE.from;
    const top = by === 7 ? null : v + near; // The south bank's top edge is the embankment.
    if (top !== null) plane(ctx, u + near, top, span, lane, '#bcd8ab');
    plane(ctx, u + near, v + far, span, lane, '#bcd8ab');
    plane(ctx, u + near, by === 7 ? RIVER.bottom + 8 : v + near, lane, by === 7 ? v + STEP - BIKE_LANE.from - RIVER.bottom - 8 : span, '#bcd8ab');
    plane(ctx, u + far, by === 7 ? RIVER.bottom + 8 : v + near, lane, by === 7 ? v + STEP - BIKE_LANE.from - RIVER.bottom - 8 : span, '#bcd8ab');
  }
  // Dashed lane markings and zebra crossings give the street plan human scale.
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
    const x = col * STEP, y = row * STEP;
    if (row < 7) {
      for (let n = 29; n < STEP - 20; n += 20) {
        plane(ctx, x + n, y - .7, 11, 1.4, '#eeeee3');
        if (row < 6) plane(ctx, x - .7, y + n, 1.4, 11, '#eeeee3');
      }
    }
    if (row === 7) continue; // No junctions in the river.
    for (const side of [-1, 1]) for (let n = -10; n < 11; n += 4) {
      plane(ctx, x + n, y + side * 19, 2, 7, '#f5f3e9');
      plane(ctx, x + side * 19, y + n, 7, 2, '#f5f3e9');
    }
  }
  // The outskirts get the same lane dashes and crossings as the core grid.
  for (let row = -5; row <= 13; row++) for (let col = -5; col <= 13; col++) {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) continue;
    if (row === 7) continue; // River edge.
    const x = col * STEP, y = row * STEP;
    const p = project({ x, y });
    if (p.x < -150 || p.x > MAP_WIDTH + 150 || p.y < -150 || p.y > MAP_HEIGHT + 150) continue;
    for (let n = 29; n < STEP - 20; n += 20) {
      plane(ctx, x + n, y - .7, 11, 1.4, '#eeeee3');
      if (row !== 6) plane(ctx, x - .7, y + n, 1.4, 11, '#eeeee3');
    }
    for (const side of [-1, 1]) for (let n = -10; n < 11; n += 4) {
      plane(ctx, x + n, y + side * 19, 2, 7, '#f5f3e9');
      plane(ctx, x + side * 19, y + n, 7, 2, '#f5f3e9');
    }
  }
  // Green bike crossings wherever a scooter/bike route crosses a street.
  const onAsphalt = (p: Point) => Math.abs(p.x - Math.round(p.x / STEP) * STEP) < ROAD_HALF || Math.abs(p.y - Math.round(p.y / STEP) * STEP) < ROAD_HALF;
  const painted = new Set<Traffic['actors'][number]['path']>();
  for (const actor of scene.traffic.actors) {
    if ((actor.kind !== 'bike' && actor.kind !== 'scooter') || painted.has(actor.path)) continue;
    painted.add(actor.path);
    const { points } = actor.path;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i], steps = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2);
      for (let k = 0; k <= steps; k++) {
        const q = { x: a.x + (b.x - a.x) * k / steps, y: a.y + (b.y - a.y) * k / steps };
        if (onAsphalt(q)) plane(ctx, q.x - 3.5, q.y - 3.5, 7, 7, '#9fcf8c');
      }
    }
  }
  // Railways with sleepers and twin rails.
  for (const col of RAIL_COLUMNS) {
    const u = col * STEP;
    for (const [from, to] of [[-600, RIVER.top - 8], [RIVER.bottom + 8, 1600]]) {
      plane(ctx, u + 79, from, 17, to - from, '#b8b8a4');
      for (let y = from + 2; y < to - 2; y += 9) plane(ctx, u + 80, y, 15, 2, '#8f9789');
      for (const x of [u + 83, u + 92]) line(ctx, project({ x, y: from }), project({ x, y: to }), '#dde0ce', 1.7);
    }
  }
  // Flag plaza paving and the drawbridge's fixed abutments (the lifting leaves are drawn live).
  plane(ctx, FLAG.x - 30, RIVER.bottom + 12, 72, 8 * STEP - ROAD_HALF - PAVEMENT - RIVER.bottom - 12, '#e4dfc9'); // Ends at the next street's pavement.
  groundArc(ctx, FLAG.x, FLAG.y, 7, 0, Math.PI * 2, '#d4c9a6', 2);
  for (const c of CROSSINGS) {
    const deck = c.kind === 'rail' ? 2 : 6, top = c.kind === 'rail' ? '#b8b8a4' : '#adaeaa';
    for (const y of [RIVER.top - 14, RIVER.bottom + 6]) box(ctx, c.x - c.halfWidth, y, c.halfWidth * 2, 8, deck, [top, '#aeb3a4', '#98a298']);
  }
  // GO station forecourts and platforms with their yellow safety edges.
  for (const { col, row } of GO_STATIONS) {
    const u = col * STEP, v = row * STEP;
    plane(ctx, u + 4, v + 18, 58, 76, '#e4dfc9');
    box(ctx, u + PLATFORM.x, v + PLATFORM.top, 17, PLATFORM.bottom - PLATFORM.top, 3, ['#e4dfc9', '#c9c3aa', '#b3ad95']);
    line(ctx, project({ x: u + 76, y: v + PLATFORM.top }, 3), project({ x: u + 76, y: v + PLATFORM.bottom }, 3), '#d4b75d', 2);
  }
  for (const field of scene.facilities) drawFacility(ctx, field);
  // Directional afternoon shadows are part of the static layer.
  for (const o of scene.scenery) {
    const p = project(o);
    if (o.kind === 'building') {
      const corners = [{ x: o.x, y: o.y + o.depth }, { x: o.x + o.width, y: o.y + o.depth }, { x: o.x + o.width, y: o.y }].map(v => project(v));
      const shifted = [...corners].reverse().map(v => ({ x: v.x + o.height * .56, y: v.y + o.height * .22 }));
      polygon(ctx, [...corners, ...shifted], '#526f6630');
    } else if (o.kind === 'tree') ellipse(ctx, { x: p.x + 10, y: p.y + 3 }, 16, 7, '#536f632b');
  }
}

function drawScooter(ctx: CanvasRenderingContext2D, p: Point, angle: number, rider: boolean, variant: number) {
  // E-scooter ~1.2 m long with a ~1.1 m stem and a ~1.75 m standing rider, drawn at PERSON_SCALE.
  const k = PERSON_SCALE;
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const at = (along: number, z = 0) => project({ x: p.x + direction.x * along * k, y: p.y + direction.y * along * k }, z * k);
  ellipse(ctx, project(p), (rider ? 3.2 : 2.6) * k, 1.2 * k, '#43585328');
  for (const offset of [-2.2, 2.2]) ellipse(ctx, at(offset, .8), .9 * k, 1 * k, '#314543');
  line(ctx, at(-2.2, 1), at(2.2, 1), '#e9b616', 1.2 * k);
  line(ctx, at(2, 1), at(2.3, 4.6), '#dba914', .9 * k);
  const bar = at(2.3, 4.6);
  line(ctx, { x: bar.x - 1.2 * k, y: bar.y }, { x: bar.x + 1.2 * k, y: bar.y }, '#354b46', .8 * k);
  if (!rider) return;
  const hip = at(-.3, 4), shoulder = at(.2, 6), head = at(.3, 6.9);
  line(ctx, at(-1.3, 1.2), hip, '#3e535c', 1 * k);
  line(ctx, at(.4, 1.2), hip, '#34454b', 1 * k);
  line(ctx, hip, shoulder, ['#345e60', '#ddbd5c', '#8e7770'][variant % 3], 2 * k);
  line(ctx, shoulder, at(2.2, 4.5), '#b38f72', .7 * k);
  ellipse(ctx, head, 1 * k, 1.15 * k, '#c5a082');
  ellipse(ctx, { x: head.x, y: head.y - .5 * k }, 1.1 * k, .8 * k, '#f0c331');
}
function drawBike(ctx: CanvasRenderingContext2D, p: Point, angle: number, variant: number, travelled: number) {
  // Bicycle ~1.8 m long with 0.7 m wheels and a seated rider, drawn at PERSON_SCALE.
  const k = PERSON_SCALE;
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const at = (along: number, z = 0, side = 0) => project({ x: p.x + (direction.x * along - direction.y * side) * k, y: p.y + (direction.y * along + direction.x * side) * k }, z * k);
  ellipse(ctx, project(p), 3.6 * k, 1.3 * k, '#43585328');
  for (const offset of [-2.5, 2.5]) {
    ctx.beginPath(); const c = at(offset, 1.35); ctx.ellipse(c.x, c.y, 1.3 * k, 1.4 * k, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#2d403d'; ctx.lineWidth = .6 * k; ctx.stroke();
  }
  const frame = ['#e46f5b', '#4f88b5', GOLD][variant % 3];
  line(ctx, at(-2.5, 1.35), at(0, 1.5), frame, .7 * k);
  line(ctx, at(0, 1.5), at(-.6, 3.6), frame, .7 * k);
  line(ctx, at(-.6, 3.5), at(1.8, 3.5), frame, .7 * k);
  line(ctx, at(1.8, 3.9), at(2.5, 1.35), frame, .7 * k);
  line(ctx, at(1.8, 4.3, -.8), at(1.8, 4.3, .8), '#354b46', .6 * k);
  const pedal = travelled * 1.6 / k;
  const hip = at(-.6, 4.4), shoulder = at(.8, 6.3), head = at(1, 7.1);
  for (const side of [0, Math.PI]) line(ctx, hip, at(Math.cos(pedal + side) * .8, 1.5 + Math.sin(pedal + side) * .8), '#3e535c', .9 * k);
  line(ctx, hip, shoulder, ['#d56c66', '#597dac', '#6aa36f', '#8d73ae'][variant % 4], 1.9 * k);
  line(ctx, shoulder, at(1.8, 4.3), '#b38f72', .7 * k);
  ellipse(ctx, head, 1 * k, 1.15 * k, '#c5a082');
  ellipse(ctx, { x: head.x, y: head.y - .5 * k }, 1.1 * k, .8 * k, '#f0c331');
}

/** Extruded plan polygon; only faces turned toward the viewer are painted. */
function prism(ctx: CanvasRenderingContext2D, plan: Point[], z: number, h: number, colors: readonly string[], top = true) {
  const cx = plan.reduce((t, q) => t + q.x, 0) / plan.length, cy = plan.reduce((t, q) => t + q.y, 0) / plan.length;
  plan.forEach((a, i) => {
    const b = plan[(i + 1) % plan.length];
    let nx = b.y - a.y, ny = a.x - b.x;
    if (nx * ((a.x + b.x) / 2 - cx) + ny * ((a.y + b.y) / 2 - cy) < 0) { nx = -nx; ny = -ny; }
    if (nx + ny <= 0) return;
    polygon(ctx, [project(a, z), project(b, z), project(b, z + h), project(a, z + h)], nx > ny ? colors[2] : colors[1]);
  });
  if (top) polygon(ctx, plan.map(q => project(q, z + h)), colors[0]);
}

/**
 * Small boats can't fit under a lowered deck (~1.5 m clearance), so each one circulates in its own
 * stretch of river between two crossings: out along one lane, a tight U-turn, back along the other.
 * Only the yacht passes the crossings, which lift for it. The loops keep to bands either side of the
 * yacht's centre lane, and boats sharing a loop share a speed, so nothing ever overlaps.
 */
type Boat = { from: number; to: number; band: 'north' | 'south'; speed: number; offset: number; kind: number };
const BOAT_BANDS = { north: [RIVER.top + 10, RIVER.top + 26], south: [RIVER.bottom - 26, RIVER.bottom - 10] } as const;
/** Straight-run limits between crossings, leaving room for the longest boat and its turn. */
const reach = (west: number, east: number) => {
  const [a, b] = [CROSSINGS[west], CROSSINGS[east]];
  return { from: a.x + a.halfWidth + 34, to: b.x - b.halfWidth - 34 };
};
const BOATS: Boat[] = [
  { ...reach(1, 2), band: 'north', speed: 7, offset: 0, kind: 0 },
  { ...reach(1, 2), band: 'north', speed: 7, offset: .5, kind: 1 },
  { ...reach(1, 2), band: 'south', speed: 4.5, offset: .15, kind: 3 },
  { ...reach(1, 2), band: 'south', speed: 4.5, offset: .65, kind: 2 },
  { ...reach(2, 3), band: 'north', speed: 5, offset: .3, kind: 1 },
  { ...reach(2, 3), band: 'south', speed: 6, offset: .8, kind: 0 },
  { ...reach(0, 1), band: 'north', speed: 3, offset: .4, kind: 2 },
  { ...reach(3, 4), band: 'south', speed: 5, offset: .1, kind: 3 },
];
function boatPosition(boat: Boat, seconds: number): Point & { angle: number } {
  const [a, b] = BOAT_BANDS[boat.band], r = (b - a) / 2, mid = (a + b) / 2, run = boat.to - boat.from;
  const lap = 2 * run + 2 * Math.PI * r;
  let d = ((boat.offset * lap + seconds * boat.speed) % lap + lap) % lap;
  if (d < run) return { x: boat.from + d, y: a, angle: 0 };
  d -= run;
  if (d < Math.PI * r) { const t = d / r; return { x: boat.to + r * Math.sin(t), y: mid - r * Math.cos(t), angle: t }; }
  d -= Math.PI * r;
  if (d < run) return { x: boat.to - d, y: b, angle: Math.PI };
  const t = (d - run) / r;
  return { x: boat.from - r * Math.sin(t), y: mid + r * Math.cos(t), angle: Math.PI + t };
}
function drawBoat(ctx: CanvasRenderingContext2D, boat: Boat, p: Point & { angle: number }, seconds: number) {
  const length = [26, 20, 11, 34][boat.kind], beam = [9, 7, 3.5, 11][boat.kind];
  const bob = Math.sin(seconds * 2 + boat.offset * 9) * .5;
  const cos = Math.cos(p.angle), sin = Math.sin(p.angle);
  const hull = (along: number, side: number) => ({ x: p.x + along * cos - side * sin, y: p.y + along * sin + side * cos });
  const rect = (a0: number, a1: number, c: number) => [hull(a0, -c), hull(a1, -c), hull(a1, c), hull(a0, c)];
  // Wake
  for (const side of [-1, 1]) line(ctx, project(hull(-length / 2, side * beam * .3)), project(hull(-length / 2 - 12, side * (beam * .5 + 2))), '#d7eeee', 1);
  const plan = [hull(-length / 2, -beam / 2), hull(length / 2 - beam * .7, -beam / 2), hull(length / 2, 0), hull(length / 2 - beam * .7, beam / 2), hull(-length / 2, beam / 2)];
  const hullColors = [['#f4f1e6', '#d8d3c3', '#bfb9a7'], ['#fbfaf2', '#d9d9cf', '#bdbdb2'], ['#f28f3b', '#d7702a', '#b35a22'], ['#f4f1e6', '#4f88b5', '#3b6f97']][boat.kind];
  prism(ctx, plan, bob, boat.kind === 2 ? 1.5 : 3.5, hullColors);
  const deck = bob + (boat.kind === 2 ? 1.5 : 3.5);
  if (boat.kind === 0) {
    // Water taxi (~6.8 m): yellow cabin with windows.
    prism(ctx, rect(-10, 2, 3.5), deck, 5, ['#f1c338', '#e9b616', '#ac922e']);
    prism(ctx, rect(-9, 1, 3.6), deck + 2.2, 1.6, ['#f1c338', '#4f6f78', '#44606a'], false);
  } else if (boat.kind === 1) {
    // Sailboat (~5 m): mast, mainsail and jib.
    const mast = hull(1, 0);
    line(ctx, project(mast, deck), project(mast, deck + 26), '#6d7466', .8);
    polygon(ctx, [project(mast, deck + 25), project(mast, deck + 3), project(hull(-8, 0), deck + 3)], '#fbf7ea', '#d4cfbe');
    polygon(ctx, [project(mast, deck + 22), project(mast, deck + 4), project(hull(8, 0), deck + 3)], '#f3d98a');
  } else if (boat.kind === 2) {
    // Kayaker with a paddle.
    const seat = hull(0, 0), paddle = Math.sin(seconds * 4 + boat.offset * 9) * 5;
    line(ctx, project(seat, deck), project(seat, deck + 2.8), '#d56c66', 1.8);
    ellipse(ctx, project(seat, deck + 3.7), 1, 1.15, '#c5a082');
    line(ctx, project(hull(paddle * .2, -4), deck + 2.2), project(hull(-paddle * .2, 4), deck + 2.2), '#5a4a38', .6);
  } else {
    // Tour boat (~8.8 m): open upper deck under a canopy, with passengers.
    prism(ctx, rect(-13, 9, 4.5), deck, 4, ['#f4f1e6', '#e4e0d2', '#c9c4b3']);
    for (let i = 0; i < 4; i++) ellipse(ctx, project(hull(-10 + i * 5, 0), deck + 5.3), 1, 1.15, ['#c5a082', '#8f6b52', '#e0b894'][i % 3]);
    for (const u of [-12, 8]) line(ctx, project(hull(u, 4), deck + 4), project(hull(u, 4), deck + 9), '#8b8a7a', .8);
    prism(ctx, rect(-13, 9, 4.5), deck + 9, 1, ['#e46f5b', '#c85a48', '#a84a3b']);
  }
}

/* ─── SCOOTY yacht & drawbridges ────────────────────────────────────────── */

/** The yacht sails east along the river's centre lane; see river.ts for its timetable. */
function drawYacht(ctx: CanvasRenderingContext2D, x: number, seconds: number) {
  const y = YACHT.lane, k = YACHT_SCALE;
  const at = (a: number, c: number) => ({ x: x + a * k, y: y + c * k });
  const rect = (a0: number, a1: number, c: number) => [at(a0, -c), at(a1, -c), at(a1, c), at(a0, c)];
  const bob = Math.sin(seconds * 1.6) * .4;
  const z = (value: number) => bob + value * k;
  // Wake, kept inside the yacht's own lane band, and waterline shadow.
  for (const side of [-1, 1]) line(ctx, project(at(-34, side * 6)), project(at(-64, side * 11)), '#d7eeee', 1.3);
  line(ctx, project(at(-34, 0)), project(at(-56, 0)), '#e7f5f3', 2);
  const hullPlan = [at(-34, -9), at(16, -9), at(34, 0), at(16, 9), at(-34, 9)];
  polygon(ctx, hullPlan.map(q => project(q)), '#2d6f7640');
  // Hull: dark lower hull, white topsides, SCOOTY-yellow rub rail, teak deck.
  prism(ctx, hullPlan, z(0), 3 * k, ['#243a34', '#243a34', '#1b2d28'], false);
  prism(ctx, hullPlan, z(3), 4 * k, ['#c9a26b', '#f7f5ee', '#dcd7c9']);
  prism(ctx, hullPlan, z(6.2), .8 * k, [GOLD, GOLD, '#c99a10'], false);
  // Superstructure: white main salon, tinted bridge deck, hard top, radar mast.
  prism(ctx, rect(-24, 12, 6.5), z(7), 7 * k, ['#fbfaf5', '#f1ede3', '#d7d2c4']);
  prism(ctx, rect(-16, 5, 5), z(14), 5 * k, ['#fbfaf5', '#2d3b40', '#243238']);
  prism(ctx, rect(-19, 7, 5.6), z(19), 1.2 * k, ['#fbfaf5', '#e8e4d8', '#cfc9b8']);
  const mast = at(-6, 0);
  line(ctx, project(mast, z(20)), project(mast, z(31)), '#6d7466', 1.2);
  const sweep = seconds * 3;
  line(ctx, project({ x: mast.x + Math.cos(sweep) * 5, y: mast.y + Math.sin(sweep) * 5 }, z(29)), project({ x: mast.x - Math.cos(sweep) * 5, y: mast.y - Math.sin(sweep) * 5 }, z(29)), '#243a34', 1.3);
  // Stern ensign.
  const stern = at(-33, 0);
  line(ctx, project(stern, z(7)), project(stern, z(15)), '#6d7466', .8);
  polygon(ctx, [project(stern, z(15)), project({ x: stern.x - 6, y: stern.y }, z(14)), project(stern, z(12))], '#d52b1e');
  // Large wordmark on the camera-facing flank of the main salon.
  wallLogo(ctx, 'scooty', project({ x: x - 6 * k, y: y + 6.6 * k + .2 }, z(10.5)), 36 * k);
}

/** One leaf of a drawbridge, lifted `angle` about its bank hinge; road leaves carry a half-arch on the arch bridge. */
function drawBridgeLeaf(ctx: CanvasRenderingContext2D, crossing: Crossing, dir: 1 | -1, angle: number) {
  const { x: cx, halfWidth, kind, arch: hasArch } = crossing;
  const rail = kind === 'rail';
  const hinge = dir > 0 ? LEAF.north : LEAF.south, length = (LEAF.south - LEAF.north) / 2, deckTop = rail ? 2 : 6;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  // Leaf-local (u across, s from the hinge toward mid-river, h above the deck) to screen.
  const at = (u: number, s: number, h: number) => project({ x: cx + u, y: hinge + dir * (s * cos - h * sin) }, deckTop + s * sin + h * cos);
  const facing = (ny: number, nz: number, nx = 0) => nx + ny + .96 * nz > 0;
  const x0 = -halfWidth, x1 = halfWidth;
  const topVisible = facing(-dir * sin, cos);
  // Slab faces, culled against the view direction (1, 1, 0.96).
  const faces: [boolean, Point[], string][] = [
    [topVisible, [at(x0, 0, 0), at(x1, 0, 0), at(x1, length, 0), at(x0, length, 0)], rail ? '#b8b8a4' : '#adaeaa'],
    [facing(dir * sin, -cos), [at(x0, 0, -2), at(x1, 0, -2), at(x1, length, -2), at(x0, length, -2)], '#8d938a'],
    [facing(dir * cos, sin), [at(x0, length, -2), at(x1, length, -2), at(x1, length, 0), at(x0, length, 0)], '#c5cbbd'],
    [true, [at(x1, 0, -2), at(x1, length, -2), at(x1, length, 0), at(x1, 0, 0)], '#aab7ad'],
  ];
  const archLine = (u: number, color: string) => {
    const height = (s: number) => 1 + Math.sin(Math.PI * (s + 8) / (length * 2 + 16)) * 30;
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) { const s = length * i / 12, q = at(u, s, height(s)); if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
    for (let i = 1; i < 6; i++) { const s = length * i / 6; line(ctx, at(u, s, 0), at(u, s, height(s)), '#8f8a70', .6); }
  };
  if (hasArch) archLine(x0, '#d6a514');
  for (const [visible, points, color] of faces) if (visible) polygon(ctx, points, color);
  if (topVisible && rail) {
    for (let s = 1; s < length - 1; s += 9) polygon(ctx, [at(-7, s, .05), at(7, s, .05), at(7, s + 2, .05), at(-7, s + 2, .05)], '#8f9789');
    for (const u of [-4.5, 4.5]) line(ctx, at(u, 0, .2), at(u, length, .2), '#dde0ce', 1.7);
  } else if (topVisible) {
    for (let s = 6; s < length - 4; s += 20) polygon(ctx, [at(-.7, s, .05), at(.7, s, .05), at(.7, s + 11, .05), at(-.7, s + 11, .05)], '#eeeee3');
  }
  if (!rail) for (const u of [x0 + 1, x1 - 1]) line(ctx, at(u, 0, 3), at(u, length, 3), '#e3e5d5', 1.4);
  if (hasArch) archLine(x1, GOLD);
}

/* ─── Canadian flag ─────────────────────────────────────────────────────── */

const MAPLE_LEAF: [number, number][] = [[0, 1], [.12, .72], [.3, .8], [.25, .35], [.55, .62], [.62, .48], [.85, .52], [.75, .25], [.9, .18], [.5, -.18], [.58, -.35], [.05, -.28], [.05, -.8],
  [-.05, -.8], [-.05, -.28], [-.58, -.35], [-.5, -.18], [-.9, .18], [-.75, .25], [-.85, .52], [-.62, .48], [-.55, .62], [-.25, .35], [-.3, .8], [-.12, .72]];
function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16), f = (c: number) => Math.round(Math.max(0, Math.min(255, c * amount)));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
}
function drawFlag(ctx: CanvasRenderingContext2D, seconds: number) {
  const { x, y, pole, width: W, height: H } = FLAG;
  box(ctx, x - 3, y - 3, 6, 6, 2, ['#d4d1bf', '#aaa998', '#969e91']);
  line(ctx, project({ x, y }, 2), project({ x, y }, pole + 2), '#d8dcd6', 1.6);
  ellipse(ctx, project({ x, y }, pole + 3), 1.6, 1.6, GOLD);
  // The cloth ripples in a travelling wave that grows toward the fly end.
  const wave = (u: number) => Math.sin(seconds * 3.4 - u * .28) * (u / W) * 3.2;
  const slope = (u: number) => wave(u + .5) - wave(u - .5);
  const at = (u: number, v: number) => project({ x: x + u, y: y + wave(u) }, pole - v);
  const strips = 16;
  for (let i = 0; i < strips; i++) {
    const u0 = W * i / strips, u1 = W * (i + 1) / strips, mid = (u0 + u1) / 2;
    const base = mid < W / 4 || mid > W * 3 / 4 ? '#d52b1e' : '#ffffff';
    polygon(ctx, [at(u0, 0), at(u1, 0), at(u1, H), at(u0, H)], shade(base, .9 + slope(mid) * .9));
  }
  polygon(ctx, MAPLE_LEAF.map(([lx, ly]) => at(W / 2 + lx * W * .19, H / 2 - ly * H * .36)), '#d52b1e');
}

/* ─── GO Transit coach ──────────────────────────────────────────────────── */

function drawGoBus(ctx: CanvasRenderingContext2D, p: Point, angle: number, detailed: boolean) {
  // MCI-style GO coach, ~13 × 2.6 × 3.5 m, at VEHICLE_SCALE (capped to its lane and the road between junctions).
  const length = 58, width = 14, cos = Math.cos(angle), sin = Math.sin(angle), zs = VEHICLE_SCALE;
  const at = (a: number, c: number) => ({ x: p.x + a * cos - c * sin, y: p.y + a * sin + c * cos });
  const slab = (a0: number, a1: number) => [at(a0, -width / 2), at(a1, -width / 2), at(a1, width / 2), at(a0, width / 2)];
  polygon(ctx, slab(-length / 2 + 2, length / 2 + 2).map(q => project({ x: q.x + 2, y: q.y + 2 })), '#43585335');
  // Livery from the GO coach: green body with a lime stripe, tinted windows, white nose and roof.
  const nose = 17;
  const rear = () => {
    const plan = slab(-length / 2, length / 2 - nose);
    prism(ctx, plan, 1.2 * zs, 4.8 * zs, ['#3f7d2a', '#3f7d2a', '#346a22']);
    prism(ctx, plan, 6 * zs, 4.2 * zs, ['#1f2b2a', '#223230', '#1b2826']);
    prism(ctx, plan, 10.2 * zs, 1 * zs, ['#9ccc3c', '#9ccc3c', '#86b52f']);
    prism(ctx, plan, 11.2 * zs, 1.3 * zs, ['#f1f3ee', '#e4e7df', '#cfd4ca']);
  };
  const front = () => {
    const plan = slab(length / 2 - nose, length / 2);
    prism(ctx, plan, 1.2 * zs, 4.8 * zs, ['#f4f5f0', '#f4f5f0', '#dfe2da']);
    prism(ctx, plan, 6 * zs, 4.2 * zs, ['#1f2b2a', '#2a3a3b', '#223230']);
    prism(ctx, plan, 10.2 * zs, 2.3 * zs, ['#f1f3ee', '#eef0ea', '#d5d8cf']);
  };
  // Paint the far segment first so the near one overlaps it.
  if (cos + sin > 0) { rear(); front(); } else { front(); rear(); }
  if (detailed) for (const a of [-length / 2 + 9, -length / 2 + 15, length / 2 - 12]) for (const c of [-width / 2, width / 2]) ellipse(ctx, project(at(a, c), 1.8), 1.8, 2.1, '#344844');
  // Big GO mark on the white roof (clear of the nose joint), plus one on the white nose's flank.
  flatLogo(ctx, 'go', at(-8, 0), 12.5 * zs, 25, angle);
  if (detailed && Math.abs(sin) < .2) wallLogo(ctx, 'go', project({ x: p.x + (length / 2 - nose / 2) * cos, y: p.y + width / 2 + .2 }, 3.6 * zs), 15);
}

function drawVehicle(ctx: CanvasRenderingContext2D, p: Point, angle: number, kind: 'car' | 'bus' | 'train', variant: number, detailed = true) {
  // Car 4.4 × 2.1 × 1.6 m; SCOOTY city bus 11.5 × 2.6 × 3 m; GO bi-level carriage 10.4 × 2.9 × 4.2 m
  // (shortened to suit the blocks). All at VEHICLE_SCALE; the bus is capped to its lane and the road between junctions.
  const [length, width] = { car: [26, 12], bus: [56, 14], train: [60, 16] }[kind];
  const zs = VEHICLE_SCALE;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const world = (x: number, y: number) => ({ x: p.x + x * cos - y * sin, y: p.y + x * sin + y * cos });
  const local = (x: number, y: number, z = 0) => project(world(x, y), z);
  const body = (x: number, y: number, w: number, d: number, baseZ: number, baseH: number, colors: readonly string[]) => {
    const z0 = baseZ * zs, h = baseH * zs;
    const corners = [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];
    const sides = corners.map((a, i) => ({ a, b: corners[(i + 1) % 4] })).filter(({ a, b }) => {
      const u = world(a[0], a[1]), v = world(b[0], b[1]);
      return (v.y - u.y) - (v.x - u.x) > 0;
    });
    for (const { a, b } of sides) polygon(ctx, [local(a[0], a[1], z0), local(b[0], b[1], z0), local(b[0], b[1], z0 + h), local(a[0], a[1], z0 + h)], (b[0] - a[0]) * cos > 0 ? colors[1] : colors[2]);
    polygon(ctx, corners.map(([u, v]) => local(u, v, z0 + h)), colors[0]);
  };
  const glass = ['#658e95', '#31575e', '#294e55'] as const;
  const x = -length / 2, y = -width / 2;
  polygon(ctx, [local(x + 1, y + 1), local(x + length + 1, y + 1), local(x + length + 1, y + width + 1), local(x + 1, y + width + 1)], '#43585335');
  if (kind === 'car') {
    const paint = [['#f4d49c', '#dfa66f', '#b47a5e'], ['#8bd1d7', '#58a7bb', '#397f9b'], ['#e89594', '#c9717d', '#a75068'], ['#bba9e0', '#927bbd', '#715b97']][variant % 4];
    body(x, y, length, width, 1, 2.6, paint);
    if (detailed) {
      body(x + 5, y + .9, length - 12, width - 1.8, 3.6, 1.8, glass);
      body(x + 6, y + 1.2, length - 13.5, width - 2.4, 5.4, .5, paint);
    }
  } else if (kind === 'bus') {
    const paint = ['#ffce47', '#e8b323', '#bd8d26'] as const;
    body(x, y, length, width, 1, 4.5, paint);
    if (detailed) body(x, y, length, width, 5.5, 3.8, glass);
    body(x, y, length, width, detailed ? 9.3 : 5.5, detailed ? 1.9 : 5.7, paint);
  } else {
    // GO bi-level coach: green skirt, white body, two decks of tinted windows.
    body(x, y, length, width, 2, 3, ['#eef0e8', GO_GREEN[1], GO_GREEN[2]]);
    if (detailed) {
      body(x, y, length, width, 5, 3, glass);
      body(x, y, length, width, 8, 2, ['#eef0e8', '#eef0e8', '#d5daca']);
      body(x, y, length, width, 10, 3, glass);
      body(x, y, length, width, 13, 3, ['#d5daca', '#eef0e8', '#d5daca']);
    } else body(x, y, length, width, 5, 11, ['#d5daca', '#eef0e8', '#d5daca']);
  }
  if (detailed) for (const u of [x + 4, x + length - 4]) for (const v of [y, y + width]) ellipse(ctx, local(u, v, 1.5), 1.6, 1.9, '#344844');
}

function drawPerson(ctx: CanvasRenderingContext2D, p: Point, phase: number, color: string, skating = false) {
  // ~1.75 m tall (hips ~0.9 m, shoulders ~1.45 m, head ~1.65 m), drawn at PERSON_SCALE.
  const k = PERSON_SCALE;
  const stride = Math.sin(phase) * (skating ? 1.3 : .8) * k;
  const lean = skating ? .6 * k : 0;
  const hip = project(p, 3.4 * k), shoulder = project({ x: p.x + lean, y: p.y }, 5.6 * k);
  ellipse(ctx, project(p), 1.6 * k, .8 * k, '#425b5826');
  for (const side of [-1, 1]) {
    const foot = project({ x: p.x + side * stride, y: p.y + side * .6 * k }, .2 * k);
    line(ctx, hip, foot, '#40556b', .8 * k);
    if (skating) line(ctx, { x: foot.x - .8 * k, y: foot.y + .4 * k }, { x: foot.x + .8 * k, y: foot.y + .4 * k }, '#697b83', .4 * k);
    line(ctx, shoulder, project({ x: p.x + side * 1.6 * k, y: p.y - side * stride }, 3.6 * k), color, .7 * k);
  }
  line(ctx, hip, shoulder, color, 1.8 * k);
  ellipse(ctx, project({ x: p.x + lean, y: p.y }, 6.5 * k), 1 * k, 1.15 * k, '#c89b78');
  if (skating) ellipse(ctx, project({ x: p.x + lean, y: p.y }, 7.2 * k), 1.1 * k, .7 * k, color);
}

function drawFerrisWheel(ctx: CanvasRenderingContext2D, field: MobilityScene['facilities'][number], seconds: number, compact: boolean) {
  const p = { x: field.x + field.width / 2, y: field.y + field.depth / 2 };
  const center = project(p, 47), radius = 33;
  const colors = ['#efc43c', '#dd856c', '#65aeb6', '#a598cc'];
  // Screen-space wheel plane; hanging cabins remain upright as the rim turns.
  for (const offset of [-18, 18]) line(ctx, project({ x: p.x + offset, y: p.y + 9 }), center, '#e9dfc2', 3.5);
  ctx.beginPath(); ctx.ellipse(center.x, center.y, radius, radius, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#f5eacb'; ctx.lineWidth = 2.5; ctx.stroke();
  const count = compact ? 8 : 12;
  for (let i = 0; i < count; i++) {
    const angle = seconds * .16 + i * Math.PI * 2 / count;
    const cabin = { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
    line(ctx, center, cabin, '#b4a88e', 1);
    line(ctx, cabin, { x: cabin.x, y: cabin.y + 5 }, '#746f64', 1);
    polygon(ctx, [{ x: cabin.x - 4, y: cabin.y + 3 }, { x: cabin.x + 4, y: cabin.y + 3 }, { x: cabin.x + 3, y: cabin.y + 10 }, { x: cabin.x - 3, y: cabin.y + 10 }], colors[i % colors.length]);
    if (!compact) {
      line(ctx, { x: cabin.x - 3, y: cabin.y + 4 }, { x: cabin.x + 3, y: cabin.y + 4 }, '#f9efd2', 1);
      ellipse(ctx, { x: cabin.x, y: cabin.y + 2 }, 1.4, 1.6, '#a67960');
    }
  }
  ellipse(ctx, center, 4, 4, '#e9b616');
}

/** Cached scenery and moving vehicles share a painter's order, so riders pass behind buildings. */
export function drawMobilityFlow(ctx: CanvasRenderingContext2D, scene: MobilityScene, seconds: number, compact: boolean) {
  const entities: { depth: number; draw: () => void }[] = scene.scenery.map(o => ({
    depth: o.x + o.y + (o.width + o.depth) / 2,
    draw: () => {
      const sprite = scene.sprites.get(o);
      if (sprite) ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
      else drawScenery(ctx, o);
    },
  }));
  for (const field of scene.facilities) {
    const cx = field.x + field.width / 2, cy = field.y + field.depth / 2;
    if (field.kind === 'fair') {
      entities.push({ depth: cx + cy + 6, draw: () => drawFerrisWheel(ctx, field, seconds, compact) });
      continue;
    }
    const skating = field.kind === 'rink', park = field.kind === 'park';
    const count = compact ? (park ? 2 : 4) : (park ? 3 : 6);
    for (let i = 0; i < count; i++) {
      const phase = seconds * (skating ? .48 : park ? .13 : .65) + i * Math.PI * 2 / count;
      const p = skating || park
        ? { x: cx + Math.cos(phase) * field.width * (park ? .23 : .32), y: cy + Math.sin(phase) * field.depth * (park ? .23 : .32) }
        : { x: field.x + 10 + i % 3 * 20 + Math.sin(phase) * 5, y: field.y + 13 + Math.floor(i / 3) * 26 + Math.cos(phase * 1.3) * 6 };
      const color = skating || park ? ['#d56c66', '#597dac', '#d2a62c', '#8d73ae'][i % 4] : i % 2 ? '#f1d058' : '#4c81b6';
      entities.push({ depth: p.x + p.y, draw: () => drawPerson(ctx, p, seconds * 5 + i, color, skating) });
    }
    if (!skating && !park) {
      const p = { x: cx + Math.sin(seconds * .9) * 17, y: cy + Math.cos(seconds * 1.1) * 12 };
      const basketball = field.kind === 'basketball';
      entities.push({ depth: p.x + p.y + 1, draw: () => {
        ellipse(ctx, project(p), 2.4, 1, '#3d5b4b35');
        ellipse(ctx, project(p, basketball ? 2 + Math.abs(Math.sin(seconds * 5)) * 8 : 1.5), 1.9, 1.9, basketball ? '#d47b36' : '#fff6de');
      } });
    }
  }
  // Every crossing is a drawbridge. Each north leaf sorts behind the river's centre and each south
  // leaf in front of it: boats pass under a lowered deck (drawn before both leaves) and between
  // raised leaves (drawn between them). The yacht and the lifts follow the traffic clock, which the
  // GO trains' rail signals also use, so a train is never on a bridge while it lifts.
  const time = scene.traffic.time;
  const spans = CROSSINGS.map(c => ({ c, lift: crossingLift(c.x, time) * LEAF.maxAngle, north: c.x + YACHT.lane - 30, south: c.x + YACHT.lane + 30 }));
  for (const span of spans) {
    entities.push({ depth: span.north, draw: () => drawBridgeLeaf(ctx, span.c, 1, span.lift) });
    entities.push({ depth: span.south, draw: () => drawBridgeLeaf(ctx, span.c, -1, span.lift) });
  }
  const spanAt = (x: number, reach: number) => spans.find(({ c }) => Math.abs(x - c.x) < c.halfWidth + reach);
  const yachtPosition = yachtX(time);
  const yachtSpan = spanAt(yachtPosition, YACHT.halfLength + 20);
  entities.push({ depth: yachtSpan ? (yachtSpan.north + yachtSpan.south) / 2 : yachtPosition + YACHT.lane, draw: () => drawYacht(ctx, yachtPosition, seconds) });
  entities.push({ depth: FLAG.x + FLAG.y + 5, draw: () => drawFlag(ctx, seconds) });
  for (const boat of BOATS) {
    const p = boatPosition(boat, seconds);
    entities.push({ depth: p.x + p.y, draw: () => drawBoat(ctx, boat, p, seconds) });
  }
  for (const actor of scene.traffic.actors) {
    const p = actor.position;
    if (actor.kind === 'train') {
      for (let carriage = -1; carriage <= 1; carriage++) {
        const car = { x: p.x + Math.cos(p.angle) * carriage * 61, y: p.y + Math.sin(p.angle) * carriage * 61 };
        const onBridge = car.y > LEAF.north - 30 && car.y < LEAF.south + 30 ? spanAt(car.x, 0) : undefined;
        entities.push({ depth: onBridge ? Math.max(onBridge.south + .5, car.x + car.y) : car.x + car.y, draw: () => drawVehicle(ctx, car, p.angle, 'train', actor.id, !compact) });
      }
    } else if (actor.kind === 'walker') {
      entities.push({ depth: p.x + p.y, draw: () => {
        // Pedestrian ~1.75 m tall, drawn at PERSON_SCALE.
        const k = PERSON_SCALE, stride = Math.sin(actor.travelled * 1.8 / k) * .7 * k;
        line(ctx, project({ x: p.x - stride, y: p.y }), project(p, 3.4 * k), '#425873', .8 * k);
        line(ctx, project({ x: p.x + stride, y: p.y }), project(p, 3.4 * k), '#425873', .8 * k);
        line(ctx, project(p, 3.2 * k), project(p, 5.6 * k), ['#de8263', '#558bab', '#bc87ba'][actor.id % 3], 1.8 * k);
        ellipse(ctx, project(p, 6.5 * k), 1 * k, 1.15 * k, '#b99776');
      } });
    } else {
      entities.push({ depth: p.x + p.y, draw: () => actor.kind === 'gobus'
        ? drawGoBus(ctx, p, p.angle, !compact)
        : actor.kind === 'bike'
        ? drawBike(ctx, p, p.angle, actor.id, actor.travelled)
        : actor.kind === 'scooter'
        ? drawScooter(ctx, p, p.angle, true, actor.id)
        : drawVehicle(ctx, p, p.angle, actor.kind === 'bus' ? 'bus' : 'car', actor.id, !compact) });
    }
  }
  for (let row = 1; row <= 5; row++) for (let col = 1; col <= 6; col++) {
    const p = { x: col * STEP - 17, y: row * STEP - 17 };
    const phase = signalPhase(seconds, col, row);
    entities.push({ depth: p.x + p.y, draw: () => {
      line(ctx, project(p), project(p, 24), '#466775', 1.2);
      box(ctx, p.x - 2, p.y - 2, 4, 4, 8, ['#456070', '#344b5b', '#253e4c'], 21);
      ellipse(ctx, project({ x: p.x + 2, y: p.y + 2 }, 26), 1.4, 1.5, phase === 'horizontal' ? '#77dba3' : '#ec7964');
    } });
  }
  entities.sort((a, b) => a.depth - b.depth);
  // The blimp flies above the whole city, so it is always drawn last; its shadow lands on the
  // ground along the buildings' sun direction.
  const blimp = blimpPosition(seconds);
  drawBlimpShadow(ctx, blimp);
  entities.forEach(entity => entity.draw());
  drawBlimp(ctx, blimp, seconds);
}

/** Screen-space ellipse (radii and rotation) for a 2×2 covariance-style shape matrix. */
function shapeEllipse(s11: number, s12: number, s22: number) {
  const mean = (s11 + s22) / 2, spread = Math.hypot((s11 - s22) / 2, s12);
  return { rx: Math.sqrt(mean + spread), ry: Math.sqrt(Math.max(mean - spread, 0)), angle: .5 * Math.atan2(2 * s12, s11 - s22) };
}

/**
 * The blimp flies east along a street-parallel line, well above the tallest tower (~150) so nothing
 * can overlap it. Its line sits further south to keep the same on-screen path at the higher altitude.
 */
const BLIMP = { speed: 16, from: -560, span: 2300, y: 486, altitude: 200, length: 64, radius: 21 };
type BlimpState = Point & { z: number };
function blimpPosition(seconds: number): BlimpState {
  return { x: BLIMP.from + (seconds * BLIMP.speed) % BLIMP.span, y: BLIMP.y, z: BLIMP.altitude + Math.sin(seconds * .6) * 3 };
}
function drawBlimpShadow(ctx: CanvasRenderingContext2D, p: BlimpState) {
  const { length: a, radius: b } = BLIMP;
  // Ground footprint of the envelope, cast along the same sun vector as building shadows.
  const e = shapeEllipse(.81 * (a * a + b * b), .432 * (a * a - b * b), .2304 * (a * a + b * b));
  const ground = project(p);
  ctx.beginPath(); ctx.ellipse(ground.x + p.z * .56, ground.y + p.z * .22, e.rx, e.ry, e.angle, 0, Math.PI * 2);
  ctx.fillStyle = '#2f4a401f'; ctx.fill();
}
/** SCOOTY blimp: a shaded ellipsoid envelope with fins and a side-painted wordmark. */
function drawBlimp(ctx: CanvasRenderingContext2D, p: BlimpState, seconds: number) {
  const { length: a, radius: b } = BLIMP;
  const at = (dx: number, dy: number, dz: number) => project({ x: p.x + dx, y: p.y + dy }, p.z + dz);
  const centre = at(0, 0, 0);
  const body = shapeEllipse(.81 * (a * a + b * b), .432 * (a * a - b * b), .2304 * (a * a + b * b) + b * b);
  const fin = (side: number, vertical: boolean, color: string) => {
    const pts = [[-.62, .55], [-.98, 1.3], [-1.1, 1.25], [-1, .2]].map(([u, v]) => vertical ? at(u * a, 0, side * v * b) : at(u * a, side * v * b, 0));
    polygon(ctx, pts, color, '#9c7400');
  };
  // Far fins (top, bottom, far side) sit behind the envelope.
  fin(1, true, '#d39e00'); fin(-1, true, '#b88900'); fin(-1, false, '#b88900');
  // Envelope, lit from the upper left like the buildings.
  const shade = ctx.createRadialGradient(centre.x - body.rx * .3, centre.y - body.ry * .55, 3, centre.x, centre.y, body.rx * 1.05);
  shade.addColorStop(0, '#fff2b8'); shade.addColorStop(.35, '#fec001'); shade.addColorStop(.8, '#d9a200'); shade.addColorStop(1, '#a87c00');
  const outline = () => { ctx.beginPath(); ctx.ellipse(centre.x, centre.y, body.rx, body.ry, body.angle, 0, Math.PI * 2); };
  outline(); ctx.fillStyle = shade; ctx.fill();
  ctx.save();
  outline(); ctx.clip();
  // Panel seams wrap around the visible half of the envelope.
  for (const phi of [-.45, .25, .95, 1.65]) {
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const t = -.96 + i * 1.92 / 24, r = Math.sqrt(1 - t * t);
      const q = at(a * t, b * r * Math.cos(phi), b * r * Math.sin(phi));
      if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y);
    }
    ctx.strokeStyle = '#9c740033'; ctx.lineWidth = .8; ctx.stroke();
  }
  // Wordmark painted on the near (+y) flank, following the envelope's axis.
  wallLogo(ctx, 'scooty', at(0, b, 3), a * 1.35);
  ctx.restore();
  outline(); ctx.strokeStyle = '#9c7400aa'; ctx.lineWidth = .8; ctx.stroke();
  // Near side fin.
  fin(1, false, '#e6ad00');
  // Tail propeller
  const hub = at(-a * 1.06, 0, 0), spin = Math.sin(seconds * 30) * 7;
  line(ctx, { x: hub.x, y: hub.y - spin }, { x: hub.x, y: hub.y + spin }, '#9c7400', 1.6);
}
