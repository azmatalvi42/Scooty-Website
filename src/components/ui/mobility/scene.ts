import { createTraffic, signalPhase, type Traffic } from './traffic';

/** An illustrative city, not live coverage or rider-location data. All positions are local. */
export type Point = { x: number; y: number };
type Cell = readonly [number, number];
export type Route = { points: Point[]; lengths: number[]; length: number; color: string; transit: boolean; phase: number };
type Scenery = { kind: 'building' | 'tree' | 'shelter' | 'dock' | 'lamp' | 'bench' | 'goal' | 'hoop'; x: number; y: number; width: number; depth: number; height: number; variant: number };
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
const GOLD = '#e9b616';
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
    { kind: 'soccer', x: 3 * STEP + 25, y: 2 * STEP + 28, width: 64, depth: 55 },
    { kind: 'soccer', x: 5 * STEP + 25, y: 4 * STEP + 28, width: 64, depth: 55 },
    { kind: 'basketball', x: STEP + 27, y: 4 * STEP + 28, width: 60, depth: 54 },
    { kind: 'basketball', x: 4 * STEP + 27, y: 3 * STEP + 28, width: 60, depth: 54 },
    { kind: 'rink', x: 4 * STEP + 25, y: 25, width: 64, depth: 62 },
    { kind: 'rink', x: 6 * STEP + 25, y: 4 * STEP + 25, width: 64, depth: 62 },
    { kind: 'fair', x: 5 * STEP + 25, y: STEP + 25, width: 64, depth: 62 },
    { kind: 'fair', x: 2 * STEP + 25, y: 5 * STEP + 25, width: 64, depth: 62 },
    { kind: 'park', x: 2 * STEP + 25, y: STEP + 25, width: 64, depth: 62 },
    { kind: 'park', x: 6 * STEP + 25, y: 25, width: 64, depth: 62 },
    { kind: 'park', x: 3 * STEP + 25, y: 5 * STEP + 25, width: 64, depth: 62 },
  ];
  const add = (kind: Scenery['kind'], x: number, y: number, width: number, depth: number, height: number, variant = 0) => scenery.push({ kind, x, y, width, depth, height, variant });
  for (let y = 0; y < 6; y++) {
    for (let x = 1; x < 7; x++) {
      const u = x * STEP, v = y * STEP;
      const facility = facilities.find(field => Math.floor(field.x / STEP) === x && Math.floor(field.y / STEP) === y);
      const park = Boolean(facility);
      if (!park) {
        const variant = [0, 1, 2, 3, 4, 7, 8, 9, 10][(x * 7 + y * 3) % 9];
        const tower = (x === 3 && y === 3) || (x === 4 && y === 1) || (x === 1 && y === 2);
        add('building', u + 30, v + 30, variant === 7 ? 52 : 37, variant === 8 ? 43 : 36, tower ? 110 + x * 7 : variant === 7 ? 15 : variant === 8 ? 23 : variant === 9 ? 34 : variant === 10 ? 28 : 24 + variant * 7, tower ? 5 : variant);
        if (!tower && variant < 7 && (x + y) % 2 === 0) add('building', u + 73, v + 49, 16, 25, 24, 1);
        add('tree', u + 83, v + 24, 18, 18, 27, x % 3);
        add('tree', u + 29, v + 83, 19, 19, 28, y % 3);
      } else {
        add('tree', u + 23, v + 92, 15, 15, 20, 1);
        add('tree', u + 88, v + 92, 15, 15, 20, 2);
        add('bench', u + 46, v + 91, 18, 4, 5);
        if (facility?.kind === 'park') {
          add('tree', u + 35, v + 35, 19, 19, 29, 0);
          add('tree', u + 82, v + 39, 19, 19, 26, 2);
          add('bench', u + 70, v + 71, 16, 4, 5);
        }
      }
      if ((x + y) % 2 === 0) add('lamp', u + 15, v + 15, 2, 2, 36);
      if (y === 5) {
        add('tree', u + 25, 700, 19, 19, 28, 1);
        add('bench', u + 60, 697, 18, 5, 6);
      }
    }
  }
  // Continue the neighbourhood beyond the camera crop instead of exposing an empty grid.
  for (let y = -2; y <= 8; y++) {
    if (y === 6) continue; // River and embankment remain clear.
    for (let x = 1; x <= 8; x++) {
      if (x <= 6 && y >= 0 && y < 6) continue;
      const u = x * STEP, v = y * STEP;
      add('building', u + 31, v + 31, 36, 33, 24 + ((x + y + 4) % 3) * 6, (x + y + 4) % 4);
      add('tree', u + 82, v + 62, 20, 20, 28, (x + y + 4) % 3);
    }
  }
  // A station district beside the railway, and a park on the opposite riverbank.
  add('building', 15, 265, 57, 81, 23, 6);
  for (let n = 0; n < 12; n++) add('tree', 18 + n % 2 * 46, 34 + n * 47, 19, 19, 29, n % 3);
  for (let n = 0; n < 13; n++) add('tree', 70 + n * 57, 810 + n % 2 * 27, 23, 23, 31, n % 3);
  hubs.forEach((p, i) => {
    add('shelter', p.x + 30, p.y - 40, 29, 10, 18, i);
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
  plane(ctx, x - 6, y - 6, w + 12, d + 12, field.kind === 'soccer' ? '#6aad7b' : '#638ca8');
  if (field.kind === 'rink') {
    plane(ctx, x - 3, y - 3, w + 6, d + 6, '#f5edcf');
    plane(ctx, x, y, w, d, '#d4f0f2');
    groundOutline(ctx, x + 2, y + 2, w - 4, d - 4, '#79b4c6');
    for (const u of [.28, .72]) line(ctx, project({ x: x + w * u, y }), project({ x: x + w * u, y: y + d }), '#80aec6', 1.2);
    line(ctx, project({ x: x + w / 2, y }), project({ x: x + w / 2, y: y + d }), '#d78088', 1);
    groundArc(ctx, x + w / 2, y + d / 2, 9, 0, Math.PI * 2, '#d78088');
    for (const v of [y - 3, y + d]) box(ctx, x - 3, v, w + 6, 2, 3, ['#fff9e7', '#b9dce1', '#8db7c5']);
    return;
  }
  if (field.kind === 'park' || field.kind === 'fair') {
    plane(ctx, x - 6, y - 6, w + 12, d + 12, '#83b77e');
    plane(ctx, x + w / 2 - 4, y - 6, 8, d + 12, '#e7d7ac');
    plane(ctx, x - 6, y + d / 2 - 4, w + 12, 8, '#e7d7ac');
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
    box(ctx, x + 5, y + 4, w - 10, 3, 4, ['#c4c29e', '#9d9e84', '#878f7d']);
    box(ctx, x + w + 5, y, 2, 2, 23, ['#687e73', '#687e73', '#687e73']);
    box(ctx, x + w + 3, y - 1, 6, 3, 6, ['#f1c338', '#e9b616', '#ac922e'], 20);
  } else if (o.kind === 'dock') {
    plane(ctx, x - 3, y - 3, 33, 14, '#d5d7c6');
    for (let i = 0; i < 4; i++) drawScooter(ctx, { x: x + i * 7, y }, Math.PI / 2, false, i);
    line(ctx, project({ x: x - 3, y: y - 3 }), project({ x: x + 30, y: y - 3 }), GOLD, 2);
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
  plane(ctx, -300, -300, 1600, 1500, '#c0dca0');
  // River, embankments, and a continuous waterfront walking route.
  plane(ctx, -300, 720, 1600, 70, '#58afb8');
  plane(ctx, -300, 712, 1600, 8, '#dce0cb', 2);
  plane(ctx, -300, 790, 1600, 8, '#dce0cb', 2);
  for (let n = 0; n < 72; n++) {
    const x = -150 + n * 21;
    line(ctx, project({ x, y: 733 + n % 4 * 13 }), project({ x: x + 13, y: 733 + n % 4 * 13 }), '#a1c2bc', .7);
  }
  const road = (x: number, y: number, w: number, d: number) => {
    plane(ctx, x - 5, y - 5, w + 10, d + 10, '#e8e7d9');
    plane(ctx, x, y, w, d, '#adaeaa');
  };
  for (let i = -1; i <= 9; i++) {
    road(-220, i * STEP - 14, 1500, 28);
    road(i * STEP - 14, -220, 28, 929);
    road(i * STEP - 14, 803, 28, 390);
  }
  // Two bridges carry the same continuous road/transit network across the river.
  for (const x of [224, 560]) {
    road(x - 14, 701, 28, 110);
    box(ctx, x - 19, 704, 2, 103, 4, ['#e3e5d5', '#c5cbbd', '#aab7ad']);
    box(ctx, x + 17, 704, 2, 103, 4, ['#e3e5d5', '#c5cbbd', '#aab7ad']);
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
    for (const side of [-1, 1]) for (let n = -10; n < 11; n += 4) {
      plane(ctx, x + n, y + side * 19, 2, 7, '#f5f3e9');
      plane(ctx, x + side * 19, y + n, 7, 2, '#f5f3e9');
    }
  }
  // Segregated scooter/cycle lanes near the main transit corridor.
  for (let x = 115; x < 775; x += 16) plane(ctx, x, 232, 9, 2, '#779e80');
  // Railway bridge has a visible deck and piers above the water.
  box(ctx, 74, 715, 28, 82, 5, ['#c4cabc', '#abb8ae', '#95a99f']);
  for (const y of [731, 771]) box(ctx, 77, y, 21, 5, 8, ['#b4c2b5', '#95aaa3', '#879f99']);
  // Railway with sleepers, twin rails and a station platform.
  plane(ctx, 79, -220, 17, 1330, '#b8b8a4');
  for (let y = -200; y < 1100; y += 9) plane(ctx, 80, y, 15, 2, '#8f9789');
  for (const x of [83, 92]) line(ctx, project({ x, y: -200 }), project({ x, y: 1100 }), '#dde0ce', 1.7);
  plane(ctx, 61, 275, 17, 106, '#e4dfc9', 3);
  line(ctx, project({ x: 74, y: 275 }, 3), project({ x: 74, y: 381 }, 3), '#d4b75d', 2);
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
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const at = (along: number, z = 0) => project({ x: p.x + direction.x * along, y: p.y + direction.y * along }, z);
  ellipse(ctx, project(p), rider ? 9 : 7, 3, '#43585328');
  for (const offset of [-5, 5]) {
    ellipse(ctx, at(offset, 2), 2.2, 2.7, '#314543');
    ellipse(ctx, at(offset, 2), .8, 1.2, '#abb5a2');
  }
  line(ctx, at(-5, 4), at(5, 4), '#e9b616', 2.8);
  line(ctx, at(4, 4), at(5, 15), '#dba914', 2);
  line(ctx, { x: at(5, 15).x - 3, y: at(5, 15).y }, { x: at(5, 15).x + 3, y: at(5, 15).y }, '#354b46', 1.6);
  if (!rider) return;
  const hip = at(-1, 15), shoulder = at(0, 23), head = at(0, 28);
  line(ctx, at(-4, 5), hip, '#3e535c', 2.5);
  line(ctx, at(1, 5), hip, '#34454b', 2.5);
  line(ctx, hip, shoulder, ['#345e60', '#ddbd5c', '#8e7770'][variant % 3], 5);
  line(ctx, shoulder, at(5, 15), '#b38f72', 2);
  ellipse(ctx, head, 3.4, 3.9, '#c5a082');
  ellipse(ctx, { x: head.x, y: head.y - 2 }, 3.8, 2.9, '#f0c331');
}
function drawVehicle(ctx: CanvasRenderingContext2D, p: Point, angle: number, transit: boolean, variant: number, train = false, detailed = true) {
  const length = transit ? 30 : 17, width = transit ? 12 : 11;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const world = (x: number, y: number) => ({ x: p.x + x * cos - y * sin, y: p.y + x * sin + y * cos });
  const local = (x: number, y: number, z = 0) => project(world(x, y), z);
  const body = (x: number, y: number, w: number, d: number, h: number, colors: string[], z = 0) => {
    const corners = [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];
    const sides = corners.map((a, i) => ({ a, b: corners[(i + 1) % 4] })).filter(({ a, b }) => {
      const u = world(a[0], a[1]), v = world(b[0], b[1]);
      return (v.y - u.y) - (v.x - u.x) > 0;
    });
    for (const { a, b } of sides) polygon(ctx, [local(a[0], a[1], z), local(b[0], b[1], z), local(b[0], b[1], z + h), local(a[0], a[1], z + h)], (b[0] - a[0]) * cos > 0 ? colors[1] : colors[2]);
    polygon(ctx, corners.map(([u, v]) => local(u, v, z + h)), colors[0]);
  };
  const paint = transit ? ['#ffce47', '#e8b323', '#bd8d26'] : [['#f4d49c', '#dfa66f', '#b47a5e'], ['#8bd1d7', '#58a7bb', '#397f9b'], ['#e89594', '#c9717d', '#a75068'], ['#bba9e0', '#927bbd', '#715b97']][variant % 4];
  const x = -length / 2, y = -width / 2;
  polygon(ctx, [local(x + 2, y + 2), local(x + length + 2, y + 2), local(x + length + 2, y + width + 2), local(x + 2, y + width + 2)], '#43585335');
  body(x, y, length, width, transit ? 13 : 7, paint, 2);
  if (detailed) {
    body(x + 2, y + 1, length - 4, width - 2, 4, ['#658e95', '#31575e', '#294e55'], 5);
    polygon(ctx, [local(x + 1, y + 1, transit ? 15 : 9), local(x + length - 1, y + 1, transit ? 15 : 9), local(x + length - 1, y + width - 1, transit ? 15 : 9), local(x + 1, y + width - 1, transit ? 15 : 9)], train ? '#d5daca' : paint[0]);
    for (const u of [x + 3, x + length - 3]) for (const v of [y, y + width]) ellipse(ctx, local(u, v, 3), 2, 2.5, '#344844');
  } else {
    line(ctx, local(x + length - 2, y + 2, 10), local(x + length - 2, y + width - 2, 10), '#31575e', 3);
  }
}

function drawPerson(ctx: CanvasRenderingContext2D, p: Point, phase: number, color: string, skating = false) {
  const stride = Math.sin(phase) * (skating ? 3 : 1.8);
  const hip = project(p, 6), shoulder = project({ x: p.x + (skating ? 1.5 : 0), y: p.y }, 11);
  ellipse(ctx, project(p), 4, 1.8, '#425b5826');
  for (const side of [-1, 1]) {
    const foot = project({ x: p.x + side * stride, y: p.y + side * 1.5 }, .5);
    line(ctx, hip, foot, '#40556b', 1.7);
    if (skating) line(ctx, { x: foot.x - 2, y: foot.y + 1 }, { x: foot.x + 2, y: foot.y + 1 }, '#697b83', .8);
    line(ctx, shoulder, project({ x: p.x + side * 4, y: p.y - side * stride }, 7), color, 1.5);
  }
  line(ctx, hip, shoulder, color, 3.5);
  ellipse(ctx, project({ x: p.x + (skating ? 1.5 : 0), y: p.y }, 14), 2.2, 2.6, '#c89b78');
  if (skating) ellipse(ctx, project({ x: p.x + 1.5, y: p.y }, 16), 2.5, 1.6, color);
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
  for (const actor of scene.traffic.actors) {
    const p = actor.position;
    if (actor.kind === 'train') {
      for (let carriage = -1; carriage <= 1; carriage++) {
        const car = { x: p.x + Math.cos(p.angle) * carriage * 34, y: p.y + Math.sin(p.angle) * carriage * 34 };
        entities.push({ depth: car.x + car.y, draw: () => drawVehicle(ctx, car, p.angle, true, actor.id, true, !compact) });
      }
    } else if (actor.kind === 'walker') {
      entities.push({ depth: p.x + p.y, draw: () => {
        const stride = Math.sin(actor.travelled * .8) * 1.5;
        line(ctx, project({ x: p.x - stride, y: p.y }), project(p, 7), '#425873', 1.5);
        line(ctx, project({ x: p.x + stride, y: p.y }), project(p, 7), '#425873', 1.5);
        line(ctx, project(p, 6), project(p, 11), ['#de8263', '#558bab', '#bc87ba'][actor.id % 3], 3.5);
        ellipse(ctx, project(p, 14), 2.3, 2.8, '#b99776');
      } });
    } else {
      entities.push({ depth: p.x + p.y, draw: () => actor.kind === 'scooter'
        ? drawScooter(ctx, p, p.angle, true, actor.id)
        : drawVehicle(ctx, p, p.angle, actor.kind === 'bus', actor.id, false, !compact) });
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
  entities.forEach(entity => entity.draw());
}
