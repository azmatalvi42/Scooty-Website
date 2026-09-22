/** Fixed-step, lane-based traffic. Road users share junction reservations and physical clearance. */
export type Position = { x: number; y: number; angle: number };
type Point = { x: number; y: number };
type Path = { points: Point[]; distances: number[]; length: number };
export type Actor = {
  id: number;
  kind: 'bus' | 'car' | 'scooter' | 'walker' | 'train';
  path: Path;
  distance: number;
  speed: number;
  maxSpeed: number;
  length: number;
  width: number;
  position: Position;
  junction: string | null;
  travelled: number;
};
export type Traffic = { actors: Actor[]; reservations: Map<string, number>; time: number; accumulator: number };
export const CITY_BLOCK = 112;
const FIXED_STEP = 1 / 30;
const CLEARANCE = 1.2;
const JUNCTION_HALF = 26;

function path(points: Point[]): Path {
  let length = 0;
  const distances = points.map((p, i) => {
    if (i) length += Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y);
    return length;
  });
  return { points, distances, length };
}

/** A closed, rounded clockwise circuit stays in the correct lane, including through turns. */
function circuit(left: number, top: number, right: number, bottom: number, inset = 8, radius = 15): Path {
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
function junctionAt(actor: Actor, position: Position): string | null {
  if (actor.kind === 'walker' || actor.kind === 'train') return null;
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
    const dimensions = { bus: [30, 12, 18], car: [17, 11, 21], scooter: [12, 5, 12], walker: [4, 4, 3], train: [100, 12, 23] }[kind];
    const actor: Actor = { id: traffic.actors.length, kind, path: route, distance: phase * route.length, speed: 0, maxSpeed: dimensions[2], length: dimensions[0], width: dimensions[1], position: sample(route, phase * route.length), junction: null, travelled: 0 };
    // Seed a clear section of lane; never spawn on top of another actor or inside a junction.
    let placed = false;
    for (let attempt = 0; attempt < 180; attempt++) {
      actor.position = sample(route, actor.distance);
      if (!junctionAt(actor, actor.position) && traffic.actors.every(other => !actorsOverlap(actor, other, 8))) { placed = true; break; }
      actor.distance = (actor.distance + 11) % route.length;
    }
    if (!placed) throw new Error(`Unable to safely place ${kind}`);
    traffic.actors.push(actor);
  };
  const blocks = (x0: number, y0: number, x1: number, y1: number) => circuit(x0 * CITY_BLOCK, y0 * CITY_BLOCK, x1 * CITY_BLOCK, y1 * CITY_BLOCK);
  add('bus', blocks(1, 1, 6, 5), .1);
  add('bus', blocks(2, 0, 5, 6), .43);
  add('bus', blocks(1, 2, 5, 5), .76);
  for (let i = 0; i < 7; i++) add('car', blocks(1 + i % 3, i % 3, 4 + i % 3, 4 + i % 2), (.13 + i * .157) % 1);
  for (let i = 0; i < 12; i++) {
    const x = 1 + i % 5, y = 1 + Math.floor(i / 5);
    add('scooter', blocks(x, y, x + 1, y + 1), (i * .271) % 1);
  }
  // Walkers circulate on block pavements, never wandering through live traffic lanes.
  for (let i = 0; i < 6; i++) {
    const x = 1 + i % 5, y = 1 + Math.floor(i / 5);
    add('walker', circuit(x * CITY_BLOCK, y * CITY_BLOCK, (x + 1) * CITY_BLOCK, (y + 1) * CITY_BLOCK, 19, 2), i * .149);
  }
  // Rail runs west of the road circuits; its loop closes far outside the visible camera.
  add('train', path([{ x: 87, y: -850 }, { x: 87, y: 1850 }, { x: -700, y: 1850 }, { x: -700, y: -850 }, { x: 87, y: -850 }]), .08);
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
    if (junction && actor.junction !== junction) {
      const owner = traffic.reservations.get(junction);
      if ((owner !== undefined && owner !== actor.id) || !hasGreen(traffic, junction, actor.position)) { actor.speed = 0; continue; }
      // Reserve only when the exit has room for the whole vehicle, avoiding gridlock.
      const exit = sample(actor.path, actor.distance + 80);
      if (traffic.actors.some(other => other !== actor && overlaps(actorBounds(actor, exit, 5), actorBounds(other)))) { actor.speed = 0; continue; }
    }
    const current = actorBounds(actor, actor.position, CLEARANCE);
    const next = actorBounds(actor, position, CLEARANCE);
    const swept = { left: Math.min(current.left, next.left), right: Math.max(current.right, next.right), top: Math.min(current.top, next.top), bottom: Math.max(current.bottom, next.bottom) };
    if (traffic.actors.some(other => other !== actor && overlaps(swept, actorBounds(other)))) { actor.speed = 0; continue; }
    if (junction && actor.junction !== junction) {
      traffic.reservations.set(junction, actor.id);
      actor.junction = junction;
    }
    actor.travelled += actor.speed * dt;
    actor.distance = distance;
    actor.position = position;
  }
}

/** Fixed small steps make clearance independent of desktop/mobile frame rate or long frames. */
export function advanceTraffic(traffic: Traffic, elapsed: number) {
  traffic.accumulator += Math.max(0, Math.min(elapsed, .25));
  while (traffic.accumulator >= FIXED_STEP - 1e-9) {
    step(traffic, FIXED_STEP);
    traffic.accumulator -= FIXED_STEP;
  }
}
