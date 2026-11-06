/**
 * Turns a stream of wheel events into carousel gestures. Kept free of the DOM and React so it can be
 * replayed against recorded trackpad traces.
 *
 * Browsers leave two constraints on this. Chromium makes the rest of a wheel sequence uncancelable
 * once its first event goes uncancelled, so wrongly letting a swipe through can't be undone, while
 * wrongly cancelling a page scroll can: the first uncancelled event starts it. Unclear gestures are
 * therefore held back for a few pixels instead of being passed on. And a trackpad keeps sending
 * momentum events long after the fingers lift, so a new swipe has to be picked out of that coast.
 */

const GESTURE_GAP_MS = 120; // silence that ends a gesture
const AXIS_LEAD_PX = 4; // how far vertical must lead before the gesture is handed to the page
const FAST_EVENT_PX = 24; // one event this big is a clear swipe
const COMMIT_PX = 28; // distance that changes slide straight away, capped at COMMIT_WIDTH of the card
const COMMIT_WIDTH = 0.05;
const SETTLE_PX = 12; // a shorter swipe still changes slide once it ends, if it travelled this far
const MIN_COMMIT_GAP_MS = 180; // one swipe never advances twice inside this window
const FLIP_PX = 8; // travel against the coast that counts as a swipe back
const DECAYED = 0.6; // the coast has to fall to this share of its peak before a new swipe can register
const RISING_SAMPLES = 3; // consecutive speed increases that mean fingers are pushing again
const REBOUND_FACTOR = 1.5; // and the speed has to clear the coast's low point by this much
const MIN_SWIPE_RATE = 0.3; // px/ms, so jitter in the coast's tail doesn't count

export const WHEEL_IDLE_MS = GESTURE_GAP_MS;

export type WheelSample = {
  dx: number;
  dy: number;
  /** event.timeStamp: when the input happened, so a busy main thread doesn't look like a pause. */
  time: number;
  cancelable: boolean;
  ctrlKey: boolean;
};

export type WheelStep = {
  /** Cancel the event, keeping it from the page. */
  prevent: boolean;
  /** Pixels of swipe the track should follow, when this event moved it. */
  drag: number | null;
  /** Slide change this event triggered: -1, 0 or 1. */
  commit: number;
};

const PASS: WheelStep = { prevent: false, drag: null, commit: 0 };
const HOLD: WheelStep = { prevent: true, drag: null, commit: 0 };

export function createWheelGesture() {
  let axis: 'idle' | 'pending' | 'x' | 'y' = 'idle';
  let sumX = 0;
  let sumY = 0;
  let last = -Infinity;

  let committed = false;
  let commitDirection = 0;
  let commitTime = -Infinity;
  let flip = 0;
  let peak = 0;
  let trough = Infinity;
  let previousRate = 0;
  let decayed = false;
  let rising = 0;

  const begin = () => {
    axis = 'idle';
    sumX = 0;
    sumY = 0;
    committed = false;
  };

  const commit = (direction: number, time: number) => {
    committed = true;
    commitDirection = direction;
    commitTime = time;
    sumX = 0;
    sumY = 0;
    flip = 0;
    peak = 0;
    trough = Infinity;
    previousRate = 0;
    decayed = false;
    rising = 0;
  };

  /** While coasting after a commit: the direction of a new swipe, or 0 if this is still momentum. */
  const newSwipe = (dx: number, dt: number) => {
    if (!dx) return 0;
    const direction = Math.sign(dx);
    if (direction !== commitDirection) {
      flip += Math.abs(dx);
      return flip >= FLIP_PX ? direction : 0;
    }
    flip = 0;
    const rate = Math.abs(dx) / Math.max(dt, 1);
    peak = Math.max(peak, rate);
    // A swipe still speeding up at the moment it commits must not read as a second swipe.
    if (!decayed && rate < peak * DECAYED) decayed = true;
    if (decayed) trough = Math.min(trough, rate);
    rising = rate > previousRate ? rising + 1 : 0;
    previousRate = rate;
    return decayed && rising >= RISING_SAMPLES && rate >= MIN_SWIPE_RATE && rate >= trough * REBOUND_FACTOR ? direction : 0;
  };

  return {
    handle({ dx, dy, time, cancelable, ctrlKey }: WheelSample, cardWidth: number): WheelStep {
      if (ctrlKey) return PASS; // pinch-zoom
      const dt = time - last;
      last = time;
      if (dt > GESTURE_GAP_MS) begin();
      if (!cancelable && !committed) return PASS; // the browser already owns this sequence

      if (committed) {
        const direction = newSwipe(dx, dt);
        if (!direction || time - commitTime < MIN_COMMIT_GAP_MS) return HOLD;
        commit(direction, time);
        return { prevent: true, drag: null, commit: direction };
      }

      if (axis === 'idle') {
        if (!dx && !dy) return PASS;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : Math.abs(dy) > AXIS_LEAD_PX ? 'y' : 'pending';
      }
      if (axis === 'y') return PASS;

      sumX += dx;
      sumY += dy;

      if (Math.abs(sumY) > Math.abs(sumX) + AXIS_LEAD_PX) {
        const wasMovingTrack = axis === 'x';
        axis = 'y';
        return wasMovingTrack ? { prevent: false, drag: 0, commit: 0 } : PASS;
      }
      if (axis === 'pending') {
        if (Math.abs(sumX) <= Math.abs(sumY)) return HOLD;
        axis = 'x';
      }

      if (Math.abs(dx) > FAST_EVENT_PX || Math.abs(sumX) > Math.min(COMMIT_PX, cardWidth * COMMIT_WIDTH)) {
        const direction = Math.sign(sumX || dx);
        commit(direction, time);
        return { prevent: true, drag: null, commit: direction };
      }
      return { prevent: true, drag: sumX, commit: 0 };
    },

    /** The events stopped: a swipe too short to have committed still counts if it travelled far enough. */
    idle(time: number): number {
      if (committed || axis !== 'x' || Math.abs(sumX) < SETTLE_PX) return 0;
      const direction = Math.sign(sumX);
      commit(direction, time);
      return direction;
    },
  };
}
