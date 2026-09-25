import { useCallback, useEffect, useState } from 'react';

/**
 * Walks a demo through its steps, holding each for its duration (ms) and looping, while `running`.
 * Picking a step by hand restarts the clock from there. Reduced-motion users get manual control only.
 */
export function useStepper(durations: number[], running: boolean) {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0); // bumps on manual picks so the timer restarts

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!running || reduce) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => window.clearTimeout(id);
  }, [step, tick, running, reduce, durations]);

  const pick = useCallback((next: number) => {
    setStep(next);
    setTick((t) => t + 1);
  }, []);

  return [step, pick] as const;
}
