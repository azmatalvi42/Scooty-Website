import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { AlertTriangle, Camera, Check, Lightbulb, Sparkles, Trash2, Truck } from 'lucide-react';
import { DemoNote } from './PhoneFrame';
import { useStepper } from './useStepper';

/*
 * Patchforce's public-works console following one report end to end, the way the product copy
 * describes it: a resident's photo becomes a ranked, routed and fully documented repair. The
 * reports, scores and crews are sample data.
 */

const PHASES = [2400, 2400, 3400, 3200]; // new → ranked → routed → repaired
const PHASE_LABELS = ['Reported', 'Ranked', 'Routed', 'Repaired'];

type Report = { id: string; type: string; where: string; score: number; severity: 'High' | 'Medium' | 'Low'; age: string; status: string; pin: [number, number]; Icon: typeof AlertTriangle };

const OTHERS: Report[] = [
  { id: 'r2', type: 'Damaged sign', where: 'Vodden St E', score: 71, severity: 'Medium', age: '1 h ago', status: 'Routed', pin: [132, 58], Icon: AlertTriangle },
  { id: 'r3', type: 'Streetlight out', where: 'Church St W', score: 64, severity: 'Medium', age: '3 h ago', status: 'Ranked', pin: [268, 176], Icon: Lightbulb },
  { id: 'r4', type: 'Litter', where: 'Gage Park', score: 38, severity: 'Low', age: '5 h ago', status: 'Ranked', pin: [168, 214], Icon: Trash2 },
];
const LIVE_PIN: [number, number] = [262, 78];
const SEVERITY = { High: '#ef4444', Medium: '#f59e0b', Low: '#94a3b8' };

// Crew route from the depot to the new report, along the map's streets (360 × 250 viewBox). The panel
// crops the sides on narrow layouts, so everything that matters sits between x ≈ 60 and 300.
const ROUTE: [number, number][] = [[80, 214], [80, 136], [206, 136], [206, 78], [250, 78]];
const segs = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
const total = segs.reduce((a, b) => a + b, 0);
const routePath = `M${ROUTE.map((p) => p.join(' ')).join('L')}`;
function along(t: number): [number, number] {
  let d = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const f = d / segs[i];
      return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * f, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * f];
    }
    d -= segs[i];
  }
  return ROUTE[ROUTE.length - 1];
}

/** The resident's photo: a pothole on asphalt, or the same spot patched. */
const RoadPhoto = ({ repaired }: { repaired: boolean }) => (
  <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden>
    <defs>
      <linearGradient id="pf-asphalt" x2="0" y2="1"><stop stopColor="#7a8374" /><stop offset="1" stopColor="#4d564a" /></linearGradient>
      <pattern id="pf-grain" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#fff" fillOpacity=".14" /><circle cx="6" cy="6" r=".6" fill="#000" fillOpacity=".2" /></pattern>
    </defs>
    <rect width="120" height="90" fill="url(#pf-asphalt)" />
    <rect width="120" height="90" fill="url(#pf-grain)" />
    <path d="M14 0V90" stroke="#e9e4c8" strokeWidth="3" />
    <path d="M100 0V90" stroke="#e9d27a" strokeWidth="3" strokeDasharray="14 10" />
    {repaired ? (
      <g>
        <rect x="34" y="28" width="52" height="36" rx="3" fill="#3e463b" stroke="#6b7466" strokeWidth="1.2" />
        <path d="M34 36h52M34 56h52" stroke="#4a5347" strokeWidth=".8" />
      </g>
    ) : (
      <g>
        <path d="M36 42c4-11 23-14 35-9 12 5 18 13 14 23-4 11-22 14-35 10-11-4-18-13-14-24z" fill="#2f372d" />
        <path d="M44 44c4-7 18-8 26-4 7 4 9 11 5 17-5 6-19 7-27 3-6-4-8-10-4-16z" fill="#1f251e" />
        <path d="M37 40c5-10 23-13 34-8" stroke="#98a291" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M85 52l10 3 5-2M36 50l-9 4-3 5M60 67l2 9" stroke="#353d33" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

const MapPanel = ({ phase, selected }: { phase: number; selected: string }) => {
  const t = useMotionValue(phase >= 3 ? 1 : 0);
  const truckX = useTransform(t, (v) => along(v)[0]);
  const truckY = useTransform(t, (v) => along(v)[1]);
  useEffect(() => {
    if (phase === 2) {
      t.set(0);
      const run = animate(t, 1, { duration: 2.6, delay: 0.3, ease: [0.45, 0, 0.3, 1] });
      return () => run.stop();
    }
    t.set(phase === 3 ? 1 : 0);
  }, [phase, t]);

  return (
    <svg viewBox="0 0 360 250" className="block h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="360" height="250" fill="#15211b" />
      <g fill="#1b2a22">
        {[[8, 8, 64, 118], [92, 8, 106, 40], [92, 70, 106, 58], [218, 8, 134, 62], [218, 92, 134, 36], [8, 150, 64, 92], [92, 150, 106, 40], [92, 206, 40, 38], [218, 150, 134, 92]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="5" />
        ))}
      </g>
      <rect x="140" y="200" width="58" height="44" rx="8" fill="#1f3a2a" />
      <g stroke="#25372d" strokeWidth="9" strokeLinecap="round">
        <path d="M-4 136H364M80 -4V254M206 -4V254M-4 58H364M-4 196H364" />
      </g>
      <g stroke="#2e4437" strokeWidth="1" strokeDasharray="6 7"><path d="M-4 136H364M206 -4V254" /></g>
      <text x="226" y="131" fontSize="7" fill="#6e8a78" fontWeight="600" letterSpacing=".5">QUEEN ST</text>
      <text x="0" y="0" fontSize="7" fill="#6e8a78" fontWeight="600" letterSpacing=".5" transform="translate(201 40) rotate(-90)">MAIN ST</text>

      {/* Crew route and truck */}
      {phase >= 2 && (
        <>
          <path d={routePath} fill="none" stroke="#FEC001" strokeWidth="6" strokeOpacity=".18" strokeLinejoin="round" />
          <motion.path d={routePath} fill="none" stroke="#FEC001" strokeWidth="2.5" strokeDasharray="7 5" strokeLinejoin="round" style={{ pathLength: t }} />
        </>
      )}
      <g transform="translate(80 214)">
        <rect x="-11" y="-11" width="22" height="22" rx="6" fill="#A9C8A0" />
        <path d="M-6 5V-2l6-4 6 4v7" fill="none" stroke="#15211b" strokeWidth="1.8" strokeLinejoin="round" />
      </g>

      {/* Other open reports */}
      {OTHERS.map((r, i) => (
        <g key={r.id} transform={`translate(${r.pin[0]} ${r.pin[1]})`}>
          {selected === r.id && <circle r="15" fill={SEVERITY[r.severity]} fillOpacity=".2" />}
          <circle r="9" fill={SEVERITY[r.severity]} stroke="#15211b" strokeWidth="2" />
          <text y="3.2" textAnchor="middle" fontSize="9" fontWeight="800" fill="#15211b">{i + 2}</text>
        </g>
      ))}

      {/* The live report */}
      <g transform={`translate(${LIVE_PIN[0]} ${LIVE_PIN[1]})`}>
        {phase < 3 && (
          <motion.circle r="10" fill={phase === 0 ? '#FEC001' : SEVERITY.High} animate={{ r: [10, 22], opacity: [0.45, 0] }} transition={{ duration: 1.4, repeat: Infinity }} />
        )}
        <circle r="10" fill={phase === 3 ? '#22c55e' : phase === 0 ? '#FEC001' : SEVERITY.High} stroke="#15211b" strokeWidth="2" />
        {phase === 3 ? (
          <path d="M-4 0l2.8 2.8L4.5-3" fill="none" stroke="#15211b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <text y="3.4" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#15211b">{phase === 0 ? '?' : 1}</text>
        )}
      </g>

      {phase >= 2 && (
        <motion.g style={{ x: truckX, y: truckY }}>
          <rect x="-10" y="-7" width="20" height="14" rx="4" fill="#FEC001" stroke="#15211b" strokeWidth="1.5" />
          <path d="M-5-1h7v4h-7zM2 0h3l1.6 1.6V3H2" fill="#15211b" />
        </motion.g>
      )}
    </svg>
  );
};

/** Score that counts up once the report is ranked. */
const Score = ({ value, live }: { value: number; live: boolean }) => {
  const v = useMotionValue(live ? 0 : value);
  const shown = useTransform(v, (n) => String(Math.round(n)));
  useEffect(() => {
    if (!live) return;
    const run = animate(v, value, { duration: 0.9, ease: 'easeOut' });
    return () => run.stop();
  }, [live, value, v]);
  return <motion.span className="tabular-nums">{shown}</motion.span>;
};

export const PatchforceDemo = () => {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [selected, setSelected] = useState('live');
  const following = selected === 'live';
  const [phase, pickPhase] = useStepper(PHASES, inView && following);

  const other = OTHERS.find((r) => r.id === selected);
  const liveStatus = ['Analyzing…', 'Ranked', 'Routed', 'Repaired'][phase];

  return (
    <div ref={ref} className="relative w-full px-3 py-8 sm:px-5 sm:py-10">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1713] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        {/* Window bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#0b120e] px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center text-[11px] font-semibold text-white/50">Patchforce · Public Works</div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Live</span>
        </div>

        <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* Work queue */}
          <div className="border-b border-white/[0.07] md:border-b-0 md:border-r">
            <div className="flex items-baseline justify-between px-4 pb-2 pt-3">
              <span className="text-[12px] font-bold text-white">Work queue</span>
              <span className="text-[10px] text-white/40">Ranked by priority</span>
            </div>
            <ul className="space-y-1 px-2 pb-3">
              <li>
                <button type="button" onClick={() => setSelected('live')} className={`relative flex w-full items-center gap-2.5 overflow-hidden rounded-xl px-2 py-2 text-left transition-colors ${following ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'}`}>
                  {phase === 0 && <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEC001]/10 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.2, repeat: Infinity }} />}
                  <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg"><RoadPhoto repaired={phase === 3} /></span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold text-white">{phase === 0 ? 'New resident report' : 'Pothole'}</span>
                    <span className="block truncate text-[10px] text-white/45">Queen St W &amp; Main St · Just now</span>
                  </span>
                  <span className="relative text-right">
                    <span className="block text-[13px] font-bold text-white">{phase === 0 ? '—' : <Score value={92} live={following && phase === 1} />}</span>
                    <span className={`block text-[9px] font-bold ${phase === 3 ? 'text-emerald-400' : phase === 0 ? 'text-[#FEC001]' : 'text-red-400'}`}>{phase === 0 ? 'Analyzing…' : phase === 3 ? 'Repaired' : 'High'}</span>
                  </span>
                </button>
              </li>
              {OTHERS.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => setSelected(r.id)} className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors ${selected === r.id ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'}`}>
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-white/[0.06]"><r.Icon className="h-4 w-4 text-white/60" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold text-white">{r.type}</span>
                      <span className="block truncate text-[10px] text-white/45">{r.where} · {r.age}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[13px] font-bold tabular-nums text-white">{r.score}</span>
                      <span className="block text-[9px] font-bold" style={{ color: SEVERITY[r.severity] }}>{r.severity}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="relative h-[240px] md:h-auto">
            <MapPanel phase={phase} selected={selected} />
            <AnimatePresence>
              {following && phase === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-3 right-3 top-3 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b120e]/90 px-3 py-2 backdrop-blur"
                >
                  <Camera className="h-3.5 w-3.5 text-[#FEC001]" />
                  <span className="text-[11px] font-semibold text-white">New report · photo from a resident</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-[#0b120e]/85 px-2.5 py-1 text-[9px] font-semibold text-white/70 backdrop-blur">
              <Truck className="h-3 w-3 text-[#A9C8A0]" />Crew 3 · Depot
            </div>
          </div>
        </div>

        {/* Selected report */}
        <div className="border-t border-white/[0.07] p-4">
          {following ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative h-[92px] w-[124px] flex-shrink-0 overflow-hidden rounded-xl">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={phase === 3 ? 'after' : 'before'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                    <RoadPhoto repaired={phase === 3} />
                  </motion.div>
                </AnimatePresence>
                <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">{phase === 3 ? 'After' : 'Resident photo'}</span>
                {phase >= 1 && phase < 3 && (
                  <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-x-5 top-6 bottom-3 rounded-md border-2 border-dashed border-[#FEC001]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold text-white">{phase === 0 ? 'Classifying photo…' : 'Pothole · Queen St W & Main St'}</span>
                  {phase >= 1 && <span className="inline-flex items-center gap-1 rounded-full bg-[#FEC001]/15 px-2 py-0.5 text-[9px] font-bold text-[#FEC001]"><Sparkles className="h-2.5 w-2.5" />AI: high severity</span>}
                </div>
                {/* Report → repair timeline */}
                <ol className="mt-3 grid grid-cols-4 gap-1.5">
                  {PHASE_LABELS.map((label, i) => {
                    const done = i < phase || (i === phase && i === 3);
                    const current = i === phase && i !== 3;
                    const sub = ['9:02 · Photo', '#1 of 14', 'Crew 3', 'Documented'][i];
                    return (
                      <li key={label}>
                        <button type="button" onClick={() => pickPhase(i)} className="w-full text-left">
                          <span className={`block h-1 rounded-full ${done ? 'bg-[#A9C8A0]' : current ? 'bg-[#FEC001]' : 'bg-white/10'}`} />
                          <span className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${done ? 'text-[#A9C8A0]' : current ? 'text-white' : 'text-white/35'}`}>
                            {done && <Check className="h-3 w-3" strokeWidth={3} />}{label}
                          </span>
                          <span className={`block text-[9px] ${done || current ? 'text-white/50' : 'text-white/25'}`}>{done || current ? sub : '—'}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-2 text-[10px] text-white/40">Status: <span className="font-semibold text-white/70">{liveStatus}</span></div>
              </div>
            </div>
          ) : (
            other && (
              <div className="flex items-center gap-4">
                <span className="grid h-[72px] w-[92px] flex-shrink-0 place-items-center rounded-xl bg-white/[0.06]"><other.Icon className="h-7 w-7 text-white/50" /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-white">{other.type} · {other.where}</div>
                  <div className="mt-1 text-[11px] text-white/50">Priority {other.score} · {other.severity} · reported {other.age}</div>
                  <div className="mt-2 inline-flex rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] font-semibold text-white/70">{other.status}</div>
                </div>
                <button type="button" onClick={() => setSelected('live')} className="flex-shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold text-white/70 hover:border-[#FEC001]/50 hover:text-white">
                  Back to live report
                </button>
              </div>
            )
          )}
        </div>
      </div>
      <DemoNote>Illustrative demo · sample reports</DemoNote>
    </div>
  );
};
