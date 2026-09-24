/**
 * The river, its crossings and the SCOOTY yacht's timetable. Shared by the scene (which draws the
 * yacht and lifts the bridges) and the traffic model (whose GO trains obey the rail-bridge signals),
 * so both always agree on where the yacht is. Times are traffic-simulation seconds.
 */
const BLOCK = 112;

/** Water spans world y 712–820. */
export const RIVER = { top: 712, bottom: 820 };
/** GO lines run north–south through these block columns, 79–96 units in from the column's west street. */
export const RAIL_COLUMNS = [0, 6];

/** Every crossing is a double-leaf drawbridge hinged at each bank, so the yacht can sail the whole river. */
export type Crossing = { x: number; halfWidth: number; kind: 'road' | 'rail'; arch?: boolean };
export const CROSSINGS: Crossing[] = [
  ...RAIL_COLUMNS.map(col => ({ x: col * BLOCK + 88, halfWidth: 14, kind: 'rail' as const })),
  { x: 2 * BLOCK, halfWidth: 17, kind: 'road' },
  { x: 5 * BLOCK, halfWidth: 17, kind: 'road', arch: true },
  { x: 8 * BLOCK, halfWidth: 17, kind: 'road' },
].sort((a, b) => a.x - b.x);
/** Leaves hinge just inside each abutment; the lift is capped at 72°. */
export const LEAF = { north: RIVER.top - 6, south: RIVER.bottom + 6, maxAngle: 72 * Math.PI / 180 };

/** The yacht sails east down the middle of the river, end to end, then re-enters off-screen in the west. */
export const YACHT = { lane: (RIVER.top + RIVER.bottom) / 2, from: -520, span: 2040, speed: 12, halfLength: 49 };
export function yachtX(time: number) {
  return YACHT.from + (((time * YACHT.speed) % YACHT.span) + YACHT.span) % YACHT.span;
}

/** Closest the yacht comes to a crossing within a window of its timetable. */
function nearestApproach(crossingX: number, time: number, before: number, after: number) {
  let nearest = Infinity;
  for (let dt = -before; dt <= after; dt += .5) nearest = Math.min(nearest, Math.abs(yachtX(time + dt) - crossingX));
  return nearest;
}

/** 0 = down, 1 = fully raised. Leaves are fully up before the bow reaches the span and stay up until the stern clears it. */
export function crossingLift(crossingX: number, time: number) {
  const t = Math.min(1, Math.max(0, (140 - nearestApproach(crossingX, time, 4, 10)) / 60));
  return t * t * (3 - 2 * t);
}

/**
 * Rail signal protecting a lifting crossing: red from ~18 s before the leaves start to rise until they
 * are back down, comfortably longer than a full-length train needs to clear the bridge once past the signal.
 */
export function railCrossingBlocked(crossingX: number, time: number) {
  return nearestApproach(crossingX, time, 4, 28) < 140;
}
