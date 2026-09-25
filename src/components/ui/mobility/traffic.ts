/** Fixed-step, lane-based traffic. Road users share junction reservations and physical clearance. */
import { RIVER, railCrossingBlocked } from './river';
export type Position = { x: number; y: number; angle: number };
type Point = { x: number; y: number };
type Path = { points: Point[]; distances: number[]; length: number };
export type Actor = {
  id: number;
  kind: 'bus' | 'gobus' | 'car' | 'scooter' | 'bike' | 'walker' | 'train';
  path: Path;
  distance: number;
  speed: number;
  maxSpeed: number;
  length: number;
  width: number;
  position: Position;
  /** Position at the start of the current fixed step, for interpolated rendering between steps. */
  prev: Position;
  junction: string | null;
  travelled: number;
  /** Seconds spent blocked, and by whom; only a closed loop of waits (true gridlock) triggers the breaker. */
  waiting: number;
  blockedBy?: number;
  /** Riders only: the crossing zone held, and whether the rider has reached the asphalt yet. */
  crossing?: string;
  crossingStarted?: boolean;
  /** Trains only: path distances of station stops, and remaining dwell time. */
  stops?: number[];
  /** Trains only: rail signals before lifting crossings, as the path distance the train's centre must stop at. */
  signals?: { at: number; crossingX: number }[];
  dwell?: number;
  served?: number;
};
/** A mid-block bike crossing: the full road width across a rider's crossing line, and the riders on it. */
type CrossingZone = { bounds: ReturnType<typeof actorBounds>; riders: Set<number> };
export type Traffic = { actors: Actor[]; reservations: Map<string, number>; crossings: Map<string, CrossingZone>; time: number; accumulator: number };
export const CITY_BLOCK = 112;
const FIXED_STEP = 1 / 30;
const CLEARANCE = 1.2;
const JUNCTION_HALF = 26;
const STATION_DWELL = 8;
const TRAIN_BRAKE = 12;
/** After this long in a closed loop of waits, an actor may squeeze past stopped traffic so gridlock always clears. */
const GRIDLOCK_WAIT = 8;
const TRAIN_SPEED = 30;
/** Three GO carriages end to end (TRAIN_CAR in scene.ts: 52 long, drawn 53 apart). */
const TRAIN_LENGTH = 3 * 53 - 1;

function path(points: Point[]): Path {
  let length = 0;
  const distances = points.map((p, i) => {
    if (i) length += Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y);
    return length;
  });
  return { points, distances, length };
}

/** A closed, rounded clockwise circuit stays in the correct lane, including through turns. */
function circuit(left: number, top: number, right: number, bottom: number, inset = 7, radius = 15): Path {
  const x0 = left + inset, y0 = top + inset, x1 = right - inset, y1 = bottom - inset;
  const points: Point[] = [];
  for (const [x, y, start] of [[x1 - radius, y0 + radius, -Math.PI / 2], [x1 - radius, y1 - radius, 0], [x0 + radius, y1 - radius, Math.PI / 2], [x0 + radius, y0 + radius, Math.PI]]) {
    for (let i = 0; i <= 12; i++) {
      const angle = start + i / 12 * Math.PI / 2;
      points.push({ x: x + Math.cos(angle) * radius, y: y + Math.sin(angle) * radius });
    }
  }
  points.push({ ...points[0] });
  return path(points);
}
/** Closed loop through axis-aligned waypoints, each corner rounded (radius capped at half the shorter leg). */
function roundedLoop(corners: Point[], radius: number): Path {
  const points: Point[] = [];
  corners.forEach((c, i) => {
    const a = corners[(i + corners.length - 1) % corners.length], b = corners[(i + 1) % corners.length];
    const inLen = Math.hypot(c.x - a.x, c.y - a.y), outLen = Math.hypot(b.x - c.x, b.y - c.y);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const s = { x: c.x + (a.x - c.x) / inLen * r, y: c.y + (a.y - c.y) / inLen * r };
    const e = { x: c.x + (b.x - c.x) / outLen * r, y: c.y + (b.y - c.y) / outLen * r };
    for (let k = 0; k <= 8; k++) {
      const t = k / 8, u = 1 - t;
      points.push({ x: u * u * s.x + 2 * u * t * c.x + t * t * e.x, y: u * u * s.y + 2 * u * t * c.y + t * t * e.y });
    }
  });
  points.push({ ...points[0] });
  return path(points);
}
function sample(route: Path, distance: number): Position {
  const d = ((distance % route.length) + route.length) % route.length;
  let i = 1;
  while (i < route.distances.length - 1 && route.distances[i] < d) i++;
  const a = route.points[i - 1], b = route.points[i];
  const t = (d - route.distances[i - 1]) / (route.distances[i] - route.distances[i - 1]);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) };
}
export function actorBounds(actor: Actor, position = actor.position, clearance = 0) {
  const x = Math.abs(Math.cos(position.angle)) * actor.length / 2 + Math.abs(Math.sin(position.angle)) * actor.width / 2 + clearance;
  const y = Math.abs(Math.sin(position.angle)) * actor.length / 2 + Math.abs(Math.cos(position.angle)) * actor.width / 2 + clearance;
  return { left: position.x - x, right: position.x + x, top: position.y - y, bottom: position.y + y };
}
function overlaps(a: ReturnType<typeof actorBounds>, b: ReturnType<typeof actorBounds>) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
export function actorsOverlap(a: Actor, b: Actor, clearance = 0) {
  return overlaps(actorBounds(a, a.position, clearance), actorBounds(b));
}
/** Pavement, road and rail are separate layers: only actors on the same layer can block each other. */
function sharesLayer(a: Actor, b: Actor) {
  if (a === b) return false;
  // Riders always see each other; road vehicles see a rider only while it is crossing a street (holding a
  // crossing zone), not while it rounds an ordinary street corner on its bike lane.
  if (onBikeLane(a) && onBikeLane(b)) return true;
  if (onBikeLane(a) || onBikeLane(b)) {
    const rider = onBikeLane(a) ? a : b, other = rider === a ? b : a;
    return other.kind !== 'walker' && other.kind !== 'train' && (rider.crossing !== undefined || onAsphalt(rider.position));
  }
  const layer = (actor: Actor) => actor.kind === 'walker' ? 0 : actor.kind === 'train' ? 2 : 1;
  return layer(a) === layer(b);
}
/** Scooters and bikes ride kerbside bike lanes, meeting road traffic only where they cross a street. */
function onBikeLane(actor: Actor) { return actor.kind === 'scooter' || actor.kind === 'bike'; }
/** Within a street's asphalt (14 either side of its centre line), plus `margin`. */
function onAsphalt(p: Point, margin = 1) {
  const dx = Math.abs(p.x - Math.round(p.x / CITY_BLOCK) * CITY_BLOCK), dy = Math.abs(p.y - Math.round(p.y / CITY_BLOCK) * CITY_BLOCK);
  return dx < 14 + margin || dy < 14 + margin;
}
/** Any part of a rider (nose, middle or tail) out on the asphalt. */
function riderOnRoad(actor: Actor) {
  const { x, y, angle } = actor.position, half = actor.length / 2, cx = Math.cos(angle) * half, cy = Math.sin(angle) * half;
  // Nose and tail count once their corners (half the width either side) could reach the asphalt.
  const reach = 1 + actor.width / 2;
  return onAsphalt(actor.position) || onAsphalt({ x: x + cx, y: y + cy }, reach) || onAsphalt({ x: x - cx, y: y - cy }, reach);
}
function junctionAt(actor: Actor, position: Position): string | null {
  if (actor.kind === 'walker' || actor.kind === 'train' || onBikeLane(actor)) return null;
  const x = Math.round(position.x / CITY_BLOCK), y = Math.round(position.y / CITY_BLOCK);
  const bounds = actorBounds(actor, position, 2);
  if (overlaps(bounds, { left: x * CITY_BLOCK - JUNCTION_HALF, right: x * CITY_BLOCK + JUNCTION_HALF, top: y * CITY_BLOCK - JUNCTION_HALF, bottom: y * CITY_BLOCK + JUNCTION_HALF })) return `${x}:${y}`;
  return null;
}
export function signalPhase(time: number, col: number, row: number): 'horizontal' | 'vertical' | 'clearance' {
  const phase = (time + (col * 3 + row * 2) % 9) % 24;
  return phase < 10 ? 'horizontal' : phase < 12 ? 'clearance' : phase < 22 ? 'vertical' : 'clearance';
}
function hasGreen(traffic: Traffic, id: string, position: Position) {
  const [col, row] = id.split(':').map(Number);
  const axis = Math.abs(Math.cos(position.angle)) > Math.abs(Math.sin(position.angle)) ? 'horizontal' : 'vertical';
  return signalPhase(traffic.time, col, row) === axis;
}

export function createTraffic(): Traffic {
  const traffic: Traffic = { actors: [], reservations: new Map(), crossings: new Map(), time: 0, accumulator: 0 };
  const add = (kind: Actor['kind'], route: Path, phase: number) => {
    // Real-world proportions at ~0.26 m per unit (car 4.4 m, city bus 11.5 m, GO coach 13 m, e-scooter 1.6 m,
    // bike 2 m), enlarged to match the scene: people and micromobility 2.5×, vehicles 1.5×. Sizes match what is
    // drawn (wheels, handlebars and arms included), so figures keep visibly clear of each other. Widths are capped to
    // the lanes, and buses to the 60 units between junction boxes so one waiting at a light never blocks the junction behind.
    const dimensions = { bus: [56, 14, 18], gobus: [58, 14, 17], car: [26, 12, 21], scooter: [16, 6, 12], bike: [19, 6, 14], walker: [7, 7, 3], train: [TRAIN_LENGTH, 14, TRAIN_SPEED] }[kind];
    const actor: Actor = { id: traffic.actors.length, kind, path: route, distance: phase * route.length, speed: 0, maxSpeed: dimensions[2], length: dimensions[0], width: dimensions[1], position: sample(route, phase * route.length), prev: sample(route, phase * route.length), junction: null, travelled: 0, waiting: 0 };
    // Seed a clear section of lane; never spawn on top of another actor or inside a junction.
    let placed = false;
    for (let attempt = 0; attempt < 180; attempt++) {
      actor.position = sample(route, actor.distance);
      // Buses are longer than the road between junction boxes, so they may start straddling one.
      const clearOfJunction = actor.length > 40 || !junctionAt(actor, actor.position);
      if (clearOfJunction && traffic.actors.every(other => !actorsOverlap(actor, other, 8))) { placed = true; break; }
      actor.distance = (actor.distance + 11) % route.length;
    }
    if (!placed) throw new Error(`Unable to safely place ${kind}`);
    actor.prev = actor.position;
    traffic.actors.push(actor);
  };
  const blocks = (x0: number, y0: number, x1: number, y1: number) => circuit(x0 * CITY_BLOCK, y0 * CITY_BLOCK, x1 * CITY_BLOCK, y1 * CITY_BLOCK);
  add('bus', blocks(1, 1, 6, 5), .1);
  add('bus', blocks(2, 0, 5, 6), .43);
  add('bus', blocks(1, 2, 5, 5), .76);
  // GO Transit coaches on longer loops, including one out on the west side.
  add('gobus', blocks(1, 0, 6, 6), .3);
  add('gobus', blocks(7, -2, 9, 6), .6); // Wraps the east car loops, sharing their outer lanes in the same direction.
  add('gobus', blocks(-3, -1, 0, 5), .15);
  for (let i = 0; i < 7; i++) add('car', blocks(1 + i % 3, i % 3, 4 + i % 3, 4 + i % 2), (.13 + i * .157) % 1);
  // Outskirt traffic keeps the edges of the city moving too (never crossing the railways in block columns 0 and 6).
  // Loops are a block apart from each other and from the core routes, so no two share a turning corner
  // (where a long car's swing could clip another).
  for (const [x0, y0, x1, y1, phase] of [[-3, -2, 0, 1, .2], [-3, 2, 0, 5, .6], [1, -3, 3, -1, .5], [4, -3, 6, -1, .05], [7, -2, 9, 0, .35], [7, 1, 9, 3, .8], [7, 4, 9, 6, .7]]) add('car', blocks(x0, y0, x1, y1), phase);
  // Micromobility: SCOOTY scooters and bikes ride the bike lanes (centre 21 in from the road's
  // centre line) on loops round a pair of neighbouring blocks, crossing the street between them mid-block
  // (out at 50 units along the block, back at 62), away from junctions and turning traffic. The pairs
  // tile the city, so no two routes ever meet; the corner radius keeps a bike's ends from swinging out
  // over the kerb at street corners.
  const L = 21, B = CITY_BLOCK, OUT = 50, BACK = 62;
  const sideBySide = (x: number, y: number) => {
    const u = x * B, v = y * B, U = u + B;
    return [[u + L, v + L], [U - L, v + L], [U - L, v + OUT], [U + L, v + OUT], [U + L, v + L], [U + B - L, v + L], [U + B - L, v + B - L], [U + L, v + B - L], [U + L, v + BACK], [U - L, v + BACK], [U - L, v + B - L], [u + L, v + B - L]];
  };
  const stacked = (x: number, y: number) => {
    const u = x * B, v = y * B, V = v + B;
    return [[u + L, v + L], [u + B - L, v + L], [u + B - L, V - L], [u + BACK, V - L], [u + BACK, V + L], [u + B - L, V + L], [u + B - L, V + B - L], [u + L, V + B - L], [u + L, V + L], [u + OUT, V + L], [u + OUT, V - L], [u + L, V - L]];
  };
  const pairs: { corners: number[][]; core: boolean }[] = [];
  for (let y = -2; y <= 5; y++) for (const x of [-3, 1, 3, 7]) pairs.push({ corners: sideBySide(x, y), core: x >= 1 && x <= 4 && y >= 0 });
  for (let y = -2; y <= 4; y += 2) for (const x of [-1, 5]) pairs.push({ corners: stacked(x, y), core: x === 5 && y >= 0 });
  pairs.forEach(({ corners, core }, i) => {
    const route = roundedLoop(corners.map(([x, y]) => ({ x, y })), 25);
    const riders = core ? 3 : 2;
    for (let r = 0; r < riders; r++) add((i + r) % 3 === 0 ? 'bike' : 'scooter', route, (i * .271 + r / riders) % 1);
  });
  // No pavement walkers: at the scene's enlarged figure scale the footway is too narrow to share with the
  // bike lane without figures overlapping. People appear on the fields, in the park, on bikes and on boats.
  // Rail runs west of the road circuits; its loop closes far outside the visible camera.
  add('train', path([{ x: 87, y: -850 }, { x: 87, y: 1850 }, { x: -700, y: 1850 }, { x: -700, y: -850 }, { x: 87, y: -850 }]), .08);
  // Southbound trains call at the GO station platform (world y 244–316, centred on 280).
  const west = traffic.actors[traffic.actors.length - 1];
  west.stops = [850 + 280];
  // Signal before the rail drawbridge: the train's nose stops 12 units short of the north abutment.
  west.signals = [{ at: 850 + (RIVER.top - 26) - TRAIN_LENGTH / 2, crossingX: 88 }];
  // A second, northbound GO line in block column 6 calls at the station right of centre (platform y 356–428).
  add('train', path([{ x: 759, y: 1850 }, { x: 759, y: -850 }, { x: 1800, y: -850 }, { x: 1800, y: 1850 }, { x: 759, y: 1850 }]), .3);
  const east = traffic.actors[traffic.actors.length - 1];
  east.stops = [1850 - 392];
  // Northbound, the nose stops 12 units short of the south abutment.
  east.signals = [{ at: 1850 - (RIVER.bottom + 26) - TRAIN_LENGTH / 2, crossingX: 760 }];
  return traffic;
}

/**
 * Uniform grid of actors, rebuilt each step, so collision queries only look at near neighbours instead
 * of every actor in the city. Actors move under a unit per step, which QUERY_REACH covers.
 */
const CELL = 48;
const QUERY_REACH = 36; // Largest road-vehicle half-extent (a coach, ~31) plus the per-step drift.
type Grid = Map<number, Actor[]>;
const cellKey = (cx: number, cy: number) => cx * 4099 + cy;
function buildGrid(actors: Actor[]): Grid {
  const grid: Grid = new Map();
  for (const actor of actors) {
    if (actor.kind === 'train') continue;
    const key = cellKey(Math.floor(actor.position.x / CELL), Math.floor(actor.position.y / CELL));
    const bucket = grid.get(key);
    if (bucket) bucket.push(actor); else grid.set(key, [actor]);
  }
  return grid;
}
function* near(grid: Grid, bounds: ReturnType<typeof actorBounds>) {
  const x0 = Math.floor((bounds.left - QUERY_REACH) / CELL), x1 = Math.floor((bounds.right + QUERY_REACH) / CELL);
  const y0 = Math.floor((bounds.top - QUERY_REACH) / CELL), y1 = Math.floor((bounds.bottom + QUERY_REACH) / CELL);
  for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) {
    const bucket = grid.get(cellKey(cx, cy));
    if (bucket) yield* bucket;
  }
}
/** Nearest actor (other than `self`) matching `test` whose bounds overlap `bounds`. */
function findNear(traffic: Traffic, grid: Grid, self: Actor, bounds: ReturnType<typeof actorBounds>, test: (other: Actor) => boolean) {
  const pool = self.kind === 'train' ? traffic.actors.filter(a => a.kind === 'train') : near(grid, bounds);
  for (const other of pool) if (other !== self && test(other) && overlaps(bounds, actorBounds(other))) return other;
  return undefined;
}

/** The crossing zone a rider's path takes it through, found by following the path to the street's centre line. */
function crossingZoneAhead(traffic: Traffic, actor: Actor, from: number): { key: string; zone: CrossingZone } | undefined {
  for (let d = from; d <= from + 48; d += 2) {
    const p = sample(actor.path, actor.distance + d);
    const X = Math.round(p.x / CITY_BLOCK) * CITY_BLOCK, Y = Math.round(p.y / CITY_BLOCK) * CITY_BLOCK;
    const vertical = Math.abs(p.x - X) < 1.5, horizontal = Math.abs(p.y - Y) < 1.5;
    if (!vertical && !horizontal) continue;
    const key = vertical ? `v:${X}:${Math.round(p.y)}` : `h:${Y}:${Math.round(p.x)}`;
    let zone = traffic.crossings.get(key);
    if (!zone) {
      const bounds = vertical
        // Along the road the zone spans ±24, covering the rider's whole turn on and off the crossing.
        ? { left: X - 16, right: X + 16, top: p.y - 24, bottom: p.y + 24 }
        : { left: p.x - 24, right: p.x + 24, top: Y - 16, bottom: Y + 16 };
      zone = { bounds, riders: new Set() };
      traffic.crossings.set(key, zone);
    }
    return { key, zone };
  }
  return undefined;
}

/** Comfortable braking (units/s²) used to ease into stop lines, kerbs and queues instead of stopping dead. */
const EASE_BRAKE = 18;
/** How far back from the road edge riders wait to cross. */
const KERB_WAIT = 8;
const easeTo = (gap: number) => Math.sqrt(2 * EASE_BRAKE * Math.max(0, gap));

function step(traffic: Traffic, dt: number) {
  traffic.time += dt;
  for (const actor of traffic.actors) actor.prev = actor.position;
  const grid = buildGrid(traffic.actors);
  const activeZones = [...traffic.crossings.values()].filter(zone => zone.riders.size > 0);
  // Junction occupants finish their manoeuvre even if the light changes meanwhile.
  for (const actor of traffic.actors) {
    if (actor.junction && junctionAt(actor, actor.position) !== actor.junction) {
      traffic.reservations.delete(actor.junction);
      actor.junction = null;
    }
  }
  for (const actor of traffic.actors) {
    if (actor.kind === 'train' && trainControl(actor, dt, traffic.time)) continue;
    let target = actor.maxSpeed;
    // Who (if anyone) an eased stop is waiting on, so gentle stops still show up in gridlock detection.
    let waitingOn: number | undefined;
    if (onBikeLane(actor)) {
      // Mid-block bike crossings work like small junctions. A rider may only ride out once it holds the
      // crossing zone, which it can take only when no road vehicle is in it or too close to stop before
      // it (riders following one another may share it); road vehicles never enter a held zone. So a vehicle never waits on a rider it is blocking, and
      // no rider/vehicle standoff can form. The rider lets go once it is back on the pavement.
      const onRoad = riderOnRoad(actor);
      if (actor.crossing) {
        if (onRoad) actor.crossingStarted = true;
        else if (actor.crossingStarted) {
          const held = traffic.crossings.get(actor.crossing);
          held?.riders.delete(actor.id);
          actor.crossing = undefined;
          actor.crossingStarted = false;
        }
      }
      if (!onRoad && !actor.crossing) {
        // `lookahead` (s) widens the too-close band while approaching, so a rider eases off early rather than
        // having to stop hard when a car closes in just as it reaches the kerb.
        const canTake = (zone: CrossingZone, lookahead = 0) => {
          const reach = { left: zone.bounds.left - 60, right: zone.bounds.right + 60, top: zone.bounds.top - 60, bottom: zone.bounds.bottom + 60 };
          for (const other of near(grid, reach)) {
            if (onBikeLane(other) || other.kind === 'walker' || other.kind === 'train') continue;
            const b = actorBounds(other);
            if (overlaps(b, { left: zone.bounds.left - 2, right: zone.bounds.right + 2, top: zone.bounds.top - 2, bottom: zone.bounds.bottom + 2 })) return { ok: false, by: other.id };
            // Heading toward the zone and too close to ease to a stop short of it?
            const gapX = Math.max(zone.bounds.left - b.right, b.left - zone.bounds.right, 0);
            const gapY = Math.max(zone.bounds.top - b.bottom, b.top - zone.bounds.bottom, 0);
            const gap = Math.max(gapX, gapY);
            const towards = (zone.bounds.left + zone.bounds.right) / 2 - other.position.x, towardsY = (zone.bounds.top + zone.bounds.bottom) / 2 - other.position.y;
            const approaching = towards * Math.cos(other.position.angle) + towardsY * Math.sin(other.position.angle) > 0;
            if (approaching && gap < other.speed * other.speed / (2 * EASE_BRAKE) + 8 + other.speed * lookahead) return { ok: false, by: other.id };
          }
          return { ok: true, by: undefined };
        };
        const kerb = sample(actor.path, actor.distance + actor.length / 2 + KERB_WAIT);
        if (onAsphalt(kerb)) {
          const ahead = crossingZoneAhead(traffic, actor, actor.length / 2 + KERB_WAIT);
          if (ahead) {
            const { ok, by } = canTake(ahead.zone);
            if (!ok) { actor.speed = 0; actor.waiting += dt; actor.blockedBy = by; continue; }
            ahead.zone.riders.add(actor.id);
            actor.crossing = ahead.key;
            actor.crossingStarted = false;
          }
        } else {
          // Ease toward the kerb when the crossing ahead can't be taken yet.
          for (let gap = 4; gap <= 28; gap += 6) {
            if (!onAsphalt(sample(actor.path, actor.distance + actor.length / 2 + KERB_WAIT + gap))) continue;
            const ahead = crossingZoneAhead(traffic, actor, actor.length / 2 + KERB_WAIT + gap);
            if (ahead && !canTake(ahead.zone, 1.2).ok) target = Math.min(target, easeTo(gap - 6));
            break;
          }
        }
      }
    }
    const stuck = actor.waiting > GRIDLOCK_WAIT && inGridlock(traffic, actor);
    // Ease toward a red light or a junction someone else holds.
    for (let gap = 6; gap <= 42; gap += 6) {
      const probe = sample(actor.path, actor.distance + gap);
      const upcoming = junctionAt(actor, probe);
      if (!upcoming || upcoming === actor.junction) continue;
      const owner = traffic.reservations.get(upcoming);
      const held = owner !== undefined && owner !== actor.id;
      // Also ease if there won't be room beyond the junction to clear it ("don't block the box").
      const exit = held || !hasGreen(traffic, upcoming, probe) ? undefined : sample(actor.path, actor.distance + gap + JUNCTION_HALF * 2 + actor.length + 8);
      const exitBlocker = exit && findNear(traffic, grid, actor, actorBounds(actor, exit, 5), other => sharesLayer(actor, other));
      if (held || !hasGreen(traffic, upcoming, probe) || exitBlocker) {
        target = Math.min(target, easeTo(gap - 6));
        waitingOn = held ? owner : exitBlocker ? exitBlocker.id : undefined;
      }
      break;
    }
    // Road vehicles ease to a stop before a bike crossing a rider holds.
    const heldZones = onBikeLane(actor) || actor.kind === 'walker' || actor.kind === 'train' ? [] : activeZones;
    if (heldZones.length) {
      for (let gap = 4; gap <= 40; gap += 6) {
        const probe = actorBounds(actor, sample(actor.path, actor.distance + gap), CLEARANCE);
        const zone = heldZones.find(z => overlaps(probe, z.bounds));
        if (!zone || overlaps(actorBounds(actor), zone.bounds)) continue;
        target = Math.min(target, easeTo(gap - 4));
        waitingOn = zone.riders.values().next().value;
        break;
      }
    }
    // Ease in behind whatever is ahead (skipped while breaking a gridlock). Road vehicles give way to a
    // rider crossing ~10 units short of it, keeping their nose out of the rider's path across the road.
    if (!stuck && actor.kind !== 'train') {
      for (const gap of [3, 8, 14, 22, 32]) {
        const probe = actorBounds(actor, sample(actor.path, actor.distance + gap), CLEARANCE);
        const ahead = findNear(traffic, grid, actor, probe, other => sharesLayer(actor, other) && !behind(actor, other));
        if (!ahead) continue;
        const standOff = onBikeLane(ahead) && !onBikeLane(actor) ? 10 : 3;
        const limit = Math.min(Math.max(0, (gap - standOff) * 1.6), ahead.speed + Math.max(0, gap - standOff) * 1.2);
        if (limit < target) { target = limit; waitingOn = ahead.id; }
        break;
      }
    }
    actor.speed += Math.max(-24 * dt, Math.min(7 * dt, target - actor.speed));
    if (actor.speed < .5 && target < .5 && waitingOn !== undefined) { actor.waiting += dt; actor.blockedBy = waitingOn; }
    const distance = (actor.distance + actor.speed * dt) % actor.path.length;
    const position = sample(actor.path, distance);
    const junction = junctionAt(actor, position);
    const block = (by: number) => { actor.speed = 0; actor.waiting += dt; actor.blockedBy = by; };
    // Everyone waits for green. Waiting at a red light is normal, not gridlock, so it doesn't count
    // toward the breaker, and the breaker never lets a stuck vehicle run a red. Like a yellow light, the
    // brief all-way clearance phase lets through a vehicle already too close to stop comfortably; it
    // still needs the junction's reservation, so cross traffic waits for it.
    if (junction && actor.junction !== junction && !hasGreen(traffic, junction, actor.position)) {
      const [col, row] = junction.split(':').map(Number);
      const committed = signalPhase(traffic.time, col, row) === 'clearance' && actor.speed > 6;
      if (!committed) { actor.speed = 0; actor.blockedBy = undefined; continue; }
    }
    if (junction && actor.junction !== junction && !stuck) {
      const owner = traffic.reservations.get(junction);
      if (owner !== undefined && owner !== actor.id) { block(owner); continue; }
      // Reserve only when the exit has room for the whole vehicle clear of the junction box ("don't block
      // the box"): from a stop at the box edge that is half the vehicle, the box, the other half, and a margin.
      const exit = sample(actor.path, actor.distance + JUNCTION_HALF * 2 + actor.length + 8);
      const exitBlocker = findNear(traffic, grid, actor, actorBounds(actor, exit, 5), other => sharesLayer(actor, other));
      if (exitBlocker) { block(exitBlocker.id); continue; }
    }
    if (heldZones.length) {
      const nextBounds = actorBounds(actor, position), nowBounds = actorBounds(actor);
      const zone = heldZones.find(z => overlaps(nextBounds, z.bounds) && !overlaps(nowBounds, z.bounds));
      if (zone) { block(zone.riders.values().next().value as number); continue; }
    }
    const current = actorBounds(actor, actor.position, CLEARANCE);
    const next = actorBounds(actor, position, CLEARANCE);
    const swept = { left: Math.min(current.left, next.left), right: Math.max(current.right, next.right), top: Math.min(current.top, next.top), bottom: Math.max(current.bottom, next.bottom) };
    const blocker = findNear(traffic, grid, actor, swept, other => sharesLayer(actor, other) && (!stuck || other.speed > 0));
    if (blocker) { block(blocker.id); continue; }
    if (actor.speed > .5) actor.blockedBy = undefined;
    // Only genuine progress drains the wait; creeping a few centimetres between stops does not.
    actor.waiting = Math.max(0, actor.waiting - dt * 4 * actor.speed / actor.maxSpeed);
    if (junction && actor.junction !== junction) {
      // A long vehicle's nose can reach the next junction before its tail clears the last one; hand
      // over the old reservation rather than leaking it (a leaked one strands everything behind it).
      if (actor.junction && traffic.reservations.get(actor.junction) === actor.id) traffic.reservations.delete(actor.junction);
      traffic.reservations.set(junction, actor.id);
      actor.junction = junction;
    }
    actor.travelled += actor.speed * dt;
    actor.distance = distance;
    actor.position = position;
  }
}

/** True when `other` is behind `actor` (relative to its heading), so it never counts as traffic ahead. */
function behind(actor: Actor, other: Actor) {
  const { x, y, angle } = actor.position;
  return (other.position.x - x) * Math.cos(angle) + (other.position.y - y) * Math.sin(angle) < 0;
}

/** True when following who-waits-for-whom from this actor leads back to it: a real gridlock, not a queue. */
function inGridlock(traffic: Traffic, actor: Actor) {
  let current = actor.blockedBy;
  for (let hops = 0; hops < 24 && current !== undefined; hops++) {
    if (current === actor.id) return true;
    current = traffic.actors[current].blockedBy;
  }
  return false;
}

/**
 * Brakes for red rail signals and station stops, dwells at platforms, then departs.
 * Returns true while the train is held.
 */
function trainControl(actor: Actor, dt: number, time: number) {
  if (actor.dwell && actor.dwell > 0) {
    actor.dwell -= dt;
    actor.speed = 0;
    return true;
  }
  actor.maxSpeed = TRAIN_SPEED;
  const brakeFor = (remaining: number) => { actor.maxSpeed = Math.min(actor.maxSpeed, Math.max(2, Math.sqrt(2 * TRAIN_BRAKE * remaining))); };
  for (const signal of actor.signals ?? []) {
    const remaining = signal.at - actor.distance;
    if (remaining < -1 || !railCrossingBlocked(signal.crossingX, time)) continue;
    if (remaining <= .5) { actor.speed = 0; return true; }
    brakeFor(remaining);
  }
  const stops = actor.stops ?? [];
  const index = stops.findIndex(stop => stop >= actor.distance - 1);
  if (actor.served !== undefined && actor.distance > stops[actor.served] + 5) actor.served = undefined;
  if (index < 0 || index === actor.served) return false;
  const remaining = stops[index] - actor.distance;
  if (remaining <= .5) {
    actor.distance = stops[index];
    actor.position = sample(actor.path, actor.distance);
    actor.speed = 0;
    actor.dwell = STATION_DWELL;
    actor.served = index;
    return true;
  }
  // Cap speed so the train can brake smoothly to a halt at the platform.
  brakeFor(remaining);
  return false;
}

/**
 * Where to draw an actor between fixed steps: `alpha` (0–1) is how far the clock has run into the next
 * step, so motion stays smooth whatever the display's frame rate.
 */
export function renderPosition(actor: Actor, alpha: number): Position {
  const { prev, position } = actor;
  let turn = position.angle - prev.angle;
  if (turn > Math.PI) turn -= Math.PI * 2; else if (turn < -Math.PI) turn += Math.PI * 2;
  return { x: prev.x + (position.x - prev.x) * alpha, y: prev.y + (position.y - prev.y) * alpha, angle: prev.angle + turn * alpha };
}
/** Fraction of a fixed step accumulated since the last one, for interpolated rendering. */
export function stepAlpha(traffic: Traffic) { return Math.min(1, traffic.accumulator / FIXED_STEP); }

/** Fixed small steps make clearance independent of desktop/mobile frame rate or long frames. */
export function advanceTraffic(traffic: Traffic, elapsed: number) {
  traffic.accumulator += Math.max(0, Math.min(elapsed, .25));
  while (traffic.accumulator >= FIXED_STEP - 1e-9) {
    step(traffic, FIXED_STEP);
    traffic.accumulator -= FIXED_STEP;
  }
}
