import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Battery, Camera, Check, HardHat, MapPin, QrCode, Train } from 'lucide-react';
import { PhoneFrame, DemoNote } from './PhoneFrame';
import { useStepper } from './useStepper';

/*
 * The SCOOTY rider app on one trip: find a SCOOTY near home, scan to unlock, ride to the GO station,
 * park in the blue designated zone with a photo, then carry on by train. Rules shown (20 km/h clear
 * zones, blue designated parking, photo to end a ride, helmet) come from the Riders page; the
 * trip itself is sample data.
 */

const STEPS = [
  { label: 'Find', ms: 2800 },
  { label: 'Unlock', ms: 2800 },
  { label: 'Ride', ms: 5200 },
  { label: 'Park', ms: 3200 },
  { label: 'Connect', ms: 3800 },
];
const DURATIONS = STEPS.map((s) => s.ms);
const RIDE_SECONDS = 4.6;

// Map geometry, in the 276 × 380 viewBox of the phone's map.
type Pt = [number, number];
const RIDE: Pt[] = [[58, 300], [58, 190], [226, 190], [226, 142]];
const WALK = 'M34 318H58V306';
const STATION: Pt = [226, 123];
const RAIL = { from: [0, 58] as Pt, to: [276, 138] as Pt };
const OTHER_SCOOTERS: Pt[] = [[150, 252], [190, 286], [58, 96], [120, 350], [226, 330]];

const ridePath = `M${RIDE.map((p) => p.join(' ')).join('L')}`;
const segLengths = RIDE.slice(1).map((p, i) => Math.hypot(p[0] - RIDE[i][0], p[1] - RIDE[i][1]));
const totalLength = segLengths.reduce((a, b) => a + b, 0);

/** Point `t` (0–1) of the way along the ride. */
function pointAt(t: number): Pt {
  let d = Math.min(Math.max(t, 0), 1) * totalLength;
  for (let i = 0; i < segLengths.length; i++) {
    if (d <= segLengths[i]) {
      const f = d / segLengths[i];
      return [RIDE[i][0] + (RIDE[i + 1][0] - RIDE[i][0]) * f, RIDE[i][1] + (RIDE[i + 1][1] - RIDE[i][1]) * f];
    }
    d -= segLengths[i];
  }
  return RIDE[RIDE.length - 1];
}

/** A tiny e-scooter, drawn around (0, 0). */
const ScooterGlyph = ({ color = '#111' }: { color?: string }) => (
  <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5-5.5h3M3-5.5l2.2 8.3M-5.5 2.8h8.7" />
    <circle cx="-5.3" cy="3.6" r="1.7" />
    <circle cx="5.5" cy="3.6" r="1.7" />
  </g>
);

const MapLayer = ({ step }: { step: number }) => {
  const progress = useMotionValue(step >= 3 ? 1 : 0);
  const riderX = useTransform(progress, (t) => pointAt(t)[0]);
  const riderY = useTransform(progress, (t) => pointAt(t)[1]);
  const train = useMotionValue(0);
  const trainX = useTransform(train, [0, 1], [STATION[0], 330]);
  const trainY = useTransform(train, [0, 1], [STATION[1], STATION[1] + ((330 - STATION[0]) * (RAIL.to[1] - RAIL.from[1])) / 276]);

  useEffect(() => {
    if (step === 2) {
      progress.set(0);
      const ride = animate(progress, 1, { duration: RIDE_SECONDS, ease: [0.45, 0, 0.3, 1] });
      return () => ride.stop();
    }
    progress.set(step >= 3 ? 1 : 0);
  }, [step, progress]);

  useEffect(() => {
    train.set(0);
    if (step !== 4) return;
    const run = animate(train, 1, { duration: 2.4, delay: 0.9, ease: [0.5, 0, 0.75, 0] });
    return () => run.stop();
  }, [step, train]);

  const riding = step >= 2;

  return (
    <svg viewBox="0 0 276 380" className="absolute inset-x-0 top-0 h-[380px] w-full" aria-hidden>
      <rect width="276" height="380" fill="#ecefe9" />
      {/* Building footprints */}
      <g fill="#e1e5de">
        {[[8, 8, 40, 38], [70, 8, 68, 36], [162, 10, 52, 30], [8, 110, 40, 64], [70, 112, 68, 64], [162, 150, 54, 30], [238, 150, 34, 30],
          [8, 200, 40, 74], [162, 200, 54, 74], [238, 200, 34, 74], [8, 298, 16, 44], [70, 296, 68, 44], [162, 296, 54, 44], [238, 296, 34, 24]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="4" />
        ))}
      </g>
      <rect x="72" y="204" width="64" height="70" rx="10" fill="#cfe6c4" />
      <g fill="#b9d9ad"><circle cx="90" cy="222" r="6" /><circle cx="112" cy="246" r="8" /><circle cx="124" cy="218" r="5" /><circle cx="92" cy="258" r="5" /></g>

      {/* Streets: casing, then fill */}
      <g stroke="#d8dce3" strokeLinecap="round">
        <path d="M-4 190H280M150 -4V384" strokeWidth="15" />
        <path d="M-4 286H280M-4 352H280M58 -4V384M226 132V384" strokeWidth="9" />
      </g>
      <g stroke="#ffffff" strokeLinecap="round">
        <path d="M-4 190H280M150 -4V384" strokeWidth="12" />
        <path d="M-4 286H280M-4 352H280M58 -4V384M226 132V384" strokeWidth="6.5" />
      </g>
      <text x="236" y="186" fontSize="7" fill="#8a94a3" fontWeight="600" letterSpacing=".4">QUEEN ST</text>
      <text x="0" y="0" fontSize="7" fill="#8a94a3" fontWeight="600" letterSpacing=".4" transform="translate(146 170) rotate(-90)">MAIN ST</text>

      {/* GO rail line */}
      <path d={`M${RAIL.from.join(' ')}L${RAIL.to.join(' ')}`} stroke="#6b7785" strokeWidth="5" />
      <path d={`M${RAIL.from.join(' ')}L${RAIL.to.join(' ')}`} stroke="#ecefe9" strokeWidth="2" strokeDasharray="5 6" />

      {/* Designated parking zone by the station */}
      <rect x="211" y="132" width="30" height="21" rx="5" fill="#2f80ed" fillOpacity={step >= 3 ? 0.28 : 0.16} stroke="#2f80ed" strokeWidth="1.5" />
      <text x="226" y="146" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2f80ed">P</text>

      {/* Station */}
      <g transform={`translate(${STATION[0]} ${STATION[1] - 16})`}>
        <rect x="-50" y="-26" width="58" height="17" rx="8.5" fill="#fff" stroke="#dfe3e8" />
        <text x="-21" y="-14.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1f2a37">GO Station</text>
      </g>
      <circle cx={STATION[0]} cy={STATION[1]} r="10.5" fill="#1b6b3a" stroke="#fff" strokeWidth="2.5" />
      <g transform={`translate(${STATION[0] - 5} ${STATION[1] - 5.5}) scale(.46)`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="0" width="18" height="18" rx="4" /><path d="M2 9h18M6 22l-3 3M16 22l3 3" />
      </g>

      {/* Other SCOOTYs nearby */}
      {OTHER_SCOOTERS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} opacity={riding ? 0.55 : 1}>
          <circle r="9" fill="#FEC001" stroke="#fff" strokeWidth="2" />
          <g transform="scale(.8)"><ScooterGlyph /></g>
        </g>
      ))}

      {/* Walk from home to the SCOOTY, then the ride itself */}
      <path d={WALK} fill="none" stroke="#2f80ed" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 6" opacity={riding ? 0 : 1} />
      <path d={ridePath} fill="none" stroke="#FEC001" strokeWidth="5" strokeOpacity=".28" strokeLinejoin="round" />
      <motion.path d={ridePath} fill="none" stroke="#e0a800" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: progress }} />

      {/* Home */}
      <g transform="translate(34 318)">
        <circle r="12" fill="#2f80ed" fillOpacity=".15" />
        <circle r="6.5" fill="#2f80ed" stroke="#fff" strokeWidth="2.5" opacity={riding ? 0.35 : 1} />
      </g>

      {/* Train pulling out */}
      {step === 4 && (
        <motion.g style={{ x: trainX, y: trainY }}>
          <g transform="rotate(16.2)">
            <rect x="-4" y="-5" width="30" height="10" rx="4" fill="#1b6b3a" stroke="#fff" strokeWidth="1.5" />
            <rect x="28" y="-5" width="24" height="10" rx="3" fill="#1b6b3a" stroke="#fff" strokeWidth="1.5" />
          </g>
        </motion.g>
      )}

      {/* The SCOOTY being ridden */}
      <motion.g style={{ x: riderX, y: riderY }}>
        <circle r="17" fill="#FEC001" fillOpacity={riding ? 0.25 : 0} />
        <circle r="11" fill="#FEC001" stroke="#fff" strokeWidth="2.5" />
        <ScooterGlyph />
      </motion.g>
    </svg>
  );
};

const MAP_CHIPS = ['3 SCOOTYs nearby', 'Scan to unlock', 'Clear zone · 20 km/h', 'Designated parking', 'GO Transit'];

const Sheet = ({ step }: { step: number }) => (
  <div className="absolute inset-x-0 bottom-0 z-10 h-[262px] rounded-t-[26px] bg-white px-5 pt-2.5 shadow-[0_-10px_30px_rgba(15,23,42,0.12)]">
    <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#cbd5e1]" />
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28 }}
        className="text-[#0f172a]"
      >
        {step === 0 && (
          <>
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#FFF4CC]">
                <svg viewBox="-9 -9 18 18" className="h-9 w-9"><ScooterGlyph /></svg>
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold">E-Scooter</div>
                <div className="text-[12px] text-[#64748b]">#2041 · 2 min walk</div>
              </div>
              <div className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600"><Battery className="h-4 w-4" />86%</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl bg-[#f4f6f9] px-3 py-2"><div className="text-[#64748b]">Top speed</div><div className="font-bold">20 km/h</div></div>
              <div className="rounded-xl bg-[#f4f6f9] px-3 py-2"><div className="text-[#64748b]">Helmet</div><div className="font-bold">Required</div></div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#FEC001] py-3.5 text-[14px] font-bold"><QrCode className="h-4 w-4" />Scan to unlock</div>
          </>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-2xl bg-[#1f2937]">
              <div className="absolute inset-5 grid grid-cols-5 gap-[3px] opacity-70">
                {Array.from({ length: 25 }, (_, i) => (
                  <span key={i} className={`rounded-[1px] ${[0, 1, 3, 5, 6, 8, 12, 14, 16, 18, 19, 20, 21, 23, 24].includes(i) ? 'bg-white' : ''}`} />
                ))}
              </div>
              <span className="absolute left-2 top-2 h-5 w-5 rounded-tl-lg border-l-[3px] border-t-[3px] border-[#FEC001]" />
              <span className="absolute right-2 top-2 h-5 w-5 rounded-tr-lg border-r-[3px] border-t-[3px] border-[#FEC001]" />
              <span className="absolute bottom-2 left-2 h-5 w-5 rounded-bl-lg border-b-[3px] border-l-[3px] border-[#FEC001]" />
              <span className="absolute bottom-2 right-2 h-5 w-5 rounded-br-lg border-b-[3px] border-r-[3px] border-[#FEC001]" />
              <motion.span
                className="absolute inset-x-3 h-[2px] rounded-full bg-[#FEC001] shadow-[0_0_12px_#FEC001]"
                initial={{ top: '14%' }}
                animate={{ top: ['14%', '84%', '14%'] }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 320, damping: 18 }}
                className="absolute inset-0 grid place-items-center bg-emerald-500/90"
              >
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.4, duration: 0.2 }} className="mt-4 text-[13px] font-semibold">
              Scan the QR code on the handlebar
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="-mt-5 text-[13px]">
              <div className="font-bold">Unlocked</div>
              <div className="mt-0.5 flex items-center justify-center gap-1 text-[#64748b]"><HardHat className="h-3.5 w-3.5" />Helmet on. Both hands on.</div>
            </motion.div>
          </div>
        )}
        {step === 2 && <RidePanel />}
        {step === 3 && (
          <>
            <div className="text-[15px] font-bold">Park in a designated zone</div>
            <div className="text-[12px] text-[#64748b]">Blue zones are designated parking</div>
            <div className="mt-3 flex gap-3">
              <div className="relative grid h-[92px] w-[80px] flex-shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-b from-[#9fb3c8] to-[#5f6f82]">
                <svg viewBox="-9 -9 18 18" className="h-12 w-12"><ScooterGlyph color="#FEC001" /></svg>
                <motion.span initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ delay: 0.5, duration: 0.3 }} className="absolute inset-0 bg-white" />
                <span className="absolute bottom-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-500"><Check className="h-3 w-3 text-white" strokeWidth={3} /></span>
              </div>
              <ul className="flex-1 space-y-2 text-[12px]">
                {['Inside the blue zone', 'Parked upright', 'Photo taken'].map((item, i) => (
                  <motion.li key={item} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.35 }} className="flex items-center gap-2">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500"><Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} /></span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#0f172a] py-3.5 text-[14px] font-bold text-white"><Camera className="h-4 w-4" />End ride</div>
          </>
        )}
        {step === 4 && (
          <>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500"><Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /></span>
              <div className="text-[15px] font-bold">Ride ended</div>
            </div>
            <div className="mt-1 text-[12px] text-[#64748b]">Parked at the GO Station</div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#e8ecf1] bg-[#f4f6f9] p-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1b6b3a]"><Train className="h-5 w-5 text-white" /></div>
              <div className="flex-1">
                <div className="text-[13px] font-bold">Continue on GO Transit</div>
                <div className="text-[11px] text-[#64748b]">Platform · 1 min walk</div>
              </div>
              <MapPin className="h-4 w-4 text-[#94a3b8]" />
            </div>
            <div className="mt-3 flex justify-center">
              <span className="rounded-full bg-[#FFF4CC] px-3 py-1.5 text-[11px] font-bold text-[#8a6500]">Transit to Your Doorstep®</span>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  </div>
);

/** Live ride readout: speed within the 20 km/h clear-zone limit, a running timer and trip progress. */
const RidePanel = () => {
  const t = useMotionValue(0);
  const seconds = useTransform(t, (v) => Math.round(v * 312));
  const clock = useTransform(seconds, (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`);
  // Pull away, cruise just under the 20 km/h limit, then slow to a stop.
  const speed = useTransform(t, (v) => {
    if (v < 0.1) return String(Math.round((v / 0.1) * 17));
    if (v > 0.9) return String(Math.round(((1 - v) / 0.1) * 17));
    return String(Math.round(17 + Math.sin(v * 18) * 1.5));
  });
  const width = useTransform(t, (v) => `${v * 100}%`);
  useEffect(() => {
    const run = animate(t, 1, { duration: RIDE_SECONDS, ease: [0.45, 0, 0.3, 1] });
    return () => run.stop();
  }, [t]);
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] text-[#64748b]">Riding to</div>
          <div className="text-[15px] font-bold">GO Station</div>
        </div>
        <span className="rounded-full bg-[#eceff4] px-2.5 py-1 text-[11px] font-semibold text-[#475569]">Clear zone · 20 km/h</span>
      </div>
      <div className="mt-3 flex items-end gap-6">
        <div>
          <div className="flex items-baseline gap-1"><motion.span className="font-display text-[44px] font-bold leading-none tabular-nums">{speed}</motion.span><span className="text-[13px] font-semibold text-[#64748b]">km/h</span></div>
        </div>
        <div className="pb-1">
          <div className="text-[11px] text-[#64748b]">Trip time</div>
          <motion.div className="text-[18px] font-bold tabular-nums">{clock}</motion.div>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eceff4]"><motion.div className="h-full rounded-full bg-[#FEC001]" style={{ width }} /></div>
      <div className="mt-2 flex justify-between text-[11px] text-[#64748b]"><span>Home</span><span>GO Station</span></div>
    </>
  );
};

export const OnDemandDemo = () => {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const [step, pick] = useStepper(DURATIONS, inView);

  return (
    <div ref={ref} className="relative flex w-full flex-col items-center px-4 py-10 sm:py-12">
      <PhoneFrame statusTone="dark" screenClassName="bg-[#ecefe9]">
        <MapLayer step={step} />
        <div className="absolute inset-x-0 top-[52px] z-20 flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#0f172a] shadow-[0_4px_14px_rgba(15,23,42,0.14)]"
            >
              {MAP_CHIPS[step]}
            </motion.span>
          </AnimatePresence>
        </div>
        <Sheet step={step} />
      </PhoneFrame>

      {/* Trip steps: follow along, or jump to one */}
      <ol className="mt-8 flex w-full max-w-sm items-start justify-between" aria-label="Trip steps">
        {STEPS.map((s, i) => (
          <li key={s.label} className="flex flex-1 flex-col items-center">
            <button type="button" onClick={() => pick(i)} className="group flex flex-col items-center gap-2" aria-current={i === step ? 'step' : undefined}>
              <span className="relative h-1 w-12 overflow-hidden rounded-full bg-white/15">
                {i < step && <span className="absolute inset-0 bg-[#FEC001]" />}
                {i === step && (
                  <motion.span
                    key={`${step}-${inView}`}
                    className="absolute inset-y-0 left-0 bg-[#FEC001]"
                    initial={{ width: '0%' }}
                    animate={{ width: inView ? '100%' : '0%' }}
                    transition={{ duration: s.ms / 1000, ease: 'linear' }}
                  />
                )}
              </span>
              <span className={`text-[11px] font-semibold transition-colors ${i === step ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <DemoNote />
    </div>
  );
};
