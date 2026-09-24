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
  junction: string | null;
  travelled: number;
  /** Seconds spent blocked, and by whom; only a closed loop of waits (true gridlock) triggers the breaker. */
  waiting: number;
  blockedBy?: number;
  /** Trains only: path distances of station stops, and remaining dwell time. */
  stops?: number[];
  /** Trains only: rail signals before lifting crossings, as the path distance the train's centre must stop at. */
  signals?: { at: number; crossingX: number }[];
  dwell?: number;
  served?: number;
};
export type Traffic = { actors: Actor[]; reservations: Map<string, number>; time: number; accumulator: number };
export const CITY_BLOCK = 112;
const FIXED_STEP = 1 / 30;
const CLEARANCE = 1.2;
const JUNCTION_HALF = 26;
const STATION_DWELL = 8;
const TRAIN_BRAKE = 12;
/** After this long in a closed loop of waits, an actor may squeeze past stopped traffic so gridlock always clears. */
const GRIDLOCK_WAIT = 8;
const TRAIN_SPEED = 30;
/** Three GO carriages of 60 units with small gaps; the scene draws them 61 apart. */
const TRAIN_LENGTH = 184;

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
  // Riders always see each other; road vehicles see a rider only while it is out on the asphalt crossing a street.
  if (onBikeLane(a) && onBikeLane(b)) return true;
  if (onBikeLane(a) || onBikeLane(b)) {
    const rider = onBikeLane(a) ? a : b, other = rider === a ? b : a;
    return other.kind !== 'walker' && other.kind !== 'train' && riderOnRoad(rider);
  }
  const layer = (actor: Actor) => actor.kind === 'walker' ? 0 : actor.kind === 'train' ? 2 : 1;
  return layer(a) === layer(b);
}
/** Scooters and bikes ride kerbside bike lanes, meeting road traffic only where they cross a street. */
function onBikeLane(actor: Actor) { return actor.kind === 'scooter' || actor.kind === 'bike'; }
/** Within a street's asphalt (14 either side of its centre line, plus a unit of margin). */
function onAsphalt(p: Point) {
  const dx = Math.abs(p.x - Math.round(p.x / CITY_BLOCK) * CITY_BLOCK), dy = Math.abs(p.y - Math.round(p.y / CITY_BLOCK) * CITY_BLOCK);
  return dx < 15 || dy < 15;
}
/** Any part of a rider (nose, middle or tail) out on the asphalt. */
function riderOnRoad(actor: Actor) {
  const { x, y, angle } = actor.position, half = actor.length / 2, cx = Math.cos(angle) * half, cy = Math.sin(angle) * half;
  return onAsphalt(actor.position) || onAsphalt({ x: x + cx, y: y + cy }) || onAsphalt({ x: x - cx, y: y - cy });
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
  const traffic: Traffic = { actors: [], reservations: new Map(), time: 0, accumulator: 0 };
  const add = (kind: Actor['kind'], route: Path, phase: number) => {
    // Real-world proportions at ~0.26 m per unit (car 4.4 m, city bus 11.5 m, GO coach 13 m, e-scooter 1.6 m,
    // bike 2 m), enlarged to match the scene: people and micromobility 2.5×, vehicles 1.5×. Widths are capped to
    // the lanes, and buses to the 60 units between junction boxes so one waiting at a light never blocks the junction behind.
    const dimensions = { bus: [56, 14, 18], gobus: [58, 14, 17], car: [26, 12, 21], scooter: [15, 5, 12], bike: [20, 5, 14], walker: [5, 5, 3], train: [TRAIN_LENGTH, 16, TRAIN_SPEED] }[kind];
    const actor: Actor = { id: traffic.actors.length, kind, path: route, distance: phase * route.length, speed: 0, maxSpeed: dimensions[2], length: dimensions[0], width: dimensions[1], position: sample(route, phase * route.length), junction: null, travelled: 0, waiting: 0 };
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
  // Micromobility: SCOOTY scooters and bikes ride the kerbside bike lanes (centre 19 in from the road's
  // centre line) on loops spanning two or four blocks, crossing the streets inside each loop at the
  // crosswalks beside the junctions. The loops tile the city without overlapping, so no two routes ever
  // cross; the wide corner radius keeps a 20-unit bike's ends from swinging out over the kerb.
  const smallBlocks: [number, number][] = [];
  for (let y = -2; y <= 5; y++) for (let x = -3; x <= 8; x++) if (x !== 0 && x !== 6) smallBlocks.push([x, y]);
  const tiles: [number, number, number, number][] = [];
  for (const [x0, x1] of [[-3, -1], [-1, 0], [1, 3], [3, 5], [5, 6], [7, 9]]) for (let y = -2; y <= 4; y += 2) tiles.push([x0, y, x1, y + 2]);
  tiles.forEach(([x0, y0, x1, y1], i) => {
    const route = circuit(x0 * CITY_BLOCK, y0 * CITY_BLOCK, x1 * CITY_BLOCK, y1 * CITY_BLOCK, 19, 25);
    const riders = x0 >= 1 && x1 <= 6 && y0 >= 0 ? 4 : 3;
    for (let r = 0; r < riders; r++) add((i + r) % 3 === 0 ? 'bike' : 'scooter', route, (i * .271 + r / riders) % 1);
  });
  // Walkers circulate on block pavements, never wandering through live traffic lanes.
  smallBlocks.forEach(([x, y], i) => {
    if (i % 3 === 1) return;
    add('walker', circuit(x * CITY_BLOCK, y * CITY_BLOCK, (x + 1) * CITY_BLOCK, (y + 1) * CITY_BLOCK, 25, 2), (i * .149) % 1);
  });
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

function step(traffic: Traffic, dt: number) {
  traffic.time += dt;
  // Junction occupants finish their manoeuvre even if the light changes meanwhile.
  for (const actor of traffic.actors) {
    if (actor.junction && junctionAt(actor, actor.position) !== actor.junction) {
      traffic.reservations.delete(actor.junction);
      actor.junction = null;
    }
  }
  for (const actor of traffic.actors) {
    if (actor.kind === 'train' && trainControl(actor, dt, traffic.time)) continue;
    if (onBikeLane(actor) && !riderOnRoad(actor)) {
      // About to ride out across a street: wait at the kerb for the walk signal (green for this direction
      // of travel) and for the crossing to be clear of road traffic. Once any part of the rider is on the
      // asphalt it is committed, and cars stop for it.
      // Riders wait with their front wheel ~10 units back from the road edge, clear of a turning bus's inner corner.
      const kerb = sample(actor.path, actor.distance + actor.length / 2 + 10);
      if (onAsphalt(kerb)) {
        const id = `${Math.round(kerb.x / CITY_BLOCK)}:${Math.round(kerb.y / CITY_BLOCK)}`;
        if (!hasGreen(traffic, id, kerb)) { actor.speed = 0; actor.blockedBy = undefined; continue; }
        const across = sample(actor.path, actor.distance + actor.length / 2 + 46);
        const lane = { left: Math.min(kerb.x, across.x) - 6, right: Math.max(kerb.x, across.x) + 6, top: Math.min(kerb.y, across.y) - 6, bottom: Math.max(kerb.y, across.y) + 6 };
        const car = traffic.actors.find(other => other !== actor && !onBikeLane(other) && other.kind !== 'walker' && other.kind !== 'train' && overlaps(lane, actorBounds(other)));
        if (car) { actor.speed = 0; actor.waiting += dt; actor.blockedBy = car.id; continue; }
      }
    }
    let target = actor.maxSpeed;
    const lookahead = sample(actor.path, actor.distance + actor.speed * 1.3 + 9);
    const upcoming = junctionAt(actor, lookahead);
    if (upcoming && upcoming !== actor.junction) {
      const owner = traffic.reservations.get(upcoming);
      if ((owner !== undefined && owner !== actor.id) || !hasGreen(traffic, upcoming, lookahead)) target = Math.min(target, 3);
    }
    actor.speed += Math.max(-24 * dt, Math.min(7 * dt, target - actor.speed));
    const distance = (actor.distance + actor.speed * dt) % actor.path.length;
    const position = sample(actor.path, distance);
    const junction = junctionAt(actor, position);
    const stuck = actor.waiting > GRIDLOCK_WAIT && inGridlock(traffic, actor);
    const block = (by: number) => { actor.speed = 0; actor.waiting += dt; actor.blockedBy = by; };
    // Everyone waits for green. Waiting at a red light is normal, not gridlock, so it doesn't count
    // toward the breaker, and the breaker never lets a stuck vehicle run a red.
    if (junction && actor.junction !== junction && !hasGreen(traffic, junction, actor.position)) { actor.speed = 0; actor.blockedBy = undefined; continue; }
    if (junction && actor.junction !== junction && !stuck) {
      const owner = traffic.reservations.get(junction);
      if (owner !== undefined && owner !== actor.id) { block(owner); continue; }
      // Reserve only when the exit has room for the whole vehicle clear of the junction box ("don't block
      // the box"): from a stop at the box edge that is half the vehicle, the box, the other half, and a margin.
      const exit = sample(actor.path, actor.distance + JUNCTION_HALF * 2 + actor.length + 8);
      const exitBlocker = traffic.actors.find(other => sharesLayer(actor, other) && overlaps(actorBounds(actor, exit, 5), actorBounds(other)));
      if (exitBlocker) { block(exitBlocker.id); continue; }
    }
    const current = actorBounds(actor, actor.position, CLEARANCE);
    const next = actorBounds(actor, position, CLEARANCE);
    const swept = { left: Math.min(current.left, next.left), right: Math.max(current.right, next.right), top: Math.min(current.top, next.top), bottom: Math.max(current.bottom, next.bottom) };
    const blocker = traffic.actors.find(other => sharesLayer(actor, other) && (!stuck || other.speed > 0) && overlaps(swept, actorBounds(other)));
    if (blocker) { block(blocker.id); continue; }
    actor.blockedBy = undefined;
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

/** Fixed small steps make clearance independent of desktop/mobile frame rate or long frames. */
export function advanceTraffic(traffic: Traffic, elapsed: number) {
  traffic.accumulator += Math.max(0, Math.min(elapsed, .25));
  while (traffic.accumulator >= FIXED_STEP - 1e-9) {
    step(traffic, FIXED_STEP);
    traffic.accumulator -= FIXED_STEP;
  }
}
