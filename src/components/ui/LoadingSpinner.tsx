import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  text?: string;
}

/* ── Wheels (spinning) ── */
const Wheel = ({ cx, cy, r = 7, spoke = true }: { cx: number; cy: number; r?: number; spoke?: boolean }) => (
  <motion.g
    animate={{ rotate: 360 }}
    transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
    style={{ transformOrigin: `${cx}px ${cy}px` }}
  >
    <circle cx={cx} cy={cy} r={r} fill="#1a1a22" />
    <circle cx={cx} cy={cy} r={r * 0.78} fill="#0a0a0a" />
    {spoke && (
      <>
        <line x1={cx} y1={cy - r * 0.9} x2={cx} y2={cy + r * 0.9} stroke="#FEC001" strokeWidth="1.1" />
        <line x1={cx - r * 0.9} y1={cy} x2={cx + r * 0.9} y2={cy} stroke="#FEC001" strokeWidth="1.1" />
      </>
    )}
    <circle cx={cx} cy={cy} r={r * 0.18} fill="#FEC001" />
  </motion.g>
);

/* ── Vehicles ── */

const Scooter = () => (
  <svg viewBox="0 0 90 60" width="100" height="68" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="42" width="58" height="5" rx="2" fill="#FEC001" stroke="#1a1a22" strokeWidth="0.6" />
    <line x1="74" y1="42" x2="74" y2="50" stroke="#1a1a22" strokeWidth="2" strokeLinecap="round" />
    <line x1="74" y1="42" x2="68" y2="12" stroke="#FEC001" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="62" y1="12" x2="74" y2="12" stroke="#1a1a22" strokeWidth="3" strokeLinecap="round" />
    <rect x="32" y="22" width="13" height="16" rx="4" fill="#1f1f28" />
    <circle cx="38.5" cy="15" r="5" fill="#FEC001" />
    <line x1="44" y1="25" x2="66" y2="14" stroke="#1f1f28" strokeWidth="3.2" strokeLinecap="round" />
    <rect x="34" y="36" width="3.5" height="9" rx="1.5" fill="#1f1f28" />
    <rect x="40" y="36" width="3.5" height="9" rx="1.5" fill="#1f1f28" />
    <Wheel cx={20} cy={50} r={8} />
    <Wheel cx={74} cy={50} r={8} />
  </svg>
);

const EBike = () => (
  <svg viewBox="0 0 110 60" width="118" height="68" xmlns="http://www.w3.org/2000/svg">
    {/* Frame */}
    <line x1="25" y1="50" x2="55" y2="32" stroke="#FEC001" strokeWidth="3" strokeLinecap="round" />
    <line x1="55" y1="32" x2="85" y2="50" stroke="#FEC001" strokeWidth="3" strokeLinecap="round" />
    <line x1="55" y1="32" x2="55" y2="50" stroke="#FEC001" strokeWidth="2.5" strokeLinecap="round" />
    {/* Front fork + stem */}
    <line x1="85" y1="50" x2="88" y2="20" stroke="#1a1a22" strokeWidth="2.5" strokeLinecap="round" />
    {/* Handlebar */}
    <line x1="82" y1="20" x2="94" y2="20" stroke="#1a1a22" strokeWidth="3" strokeLinecap="round" />
    {/* Seat */}
    <rect x="48" y="28" width="12" height="3" rx="1.5" fill="#1a1a22" />
    {/* Battery box */}
    <rect x="42" y="34" width="10" height="14" rx="1.5" fill="#1a1a22" />
    <rect x="44" y="36" width="6" height="2" rx="0.5" fill="#FEC001" />
    {/* Rider */}
    <circle cx="65" cy="14" r="5" fill="#FEC001" />
    <rect x="58" y="19" width="13" height="14" rx="4" fill="#1f1f28" />
    <line x1="71" y1="22" x2="88" y2="20" stroke="#1f1f28" strokeWidth="3" strokeLinecap="round" />
    <line x1="60" y1="32" x2="55" y2="45" stroke="#1f1f28" strokeWidth="3" strokeLinecap="round" />
    {/* Wheels */}
    <Wheel cx={25} cy={50} r={9} />
    <Wheel cx={85} cy={50} r={9} />
  </svg>
);

const Bus = () => (
  <svg viewBox="0 0 150 65" width="170" height="74" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <rect x="6" y="14" width="138" height="36" rx="6" fill="#FEC001" stroke="#1a1a22" strokeWidth="1.2" />
    {/* Roof stripe */}
    <rect x="6" y="14" width="138" height="4" rx="2" fill="#1a1a22" opacity="0.85" />
    {/* Windows */}
    {[0, 1, 2, 3, 4].map((i) => (
      <rect
        key={i}
        x={14 + i * 26}
        y={22}
        width={20}
        height={14}
        rx={1.5}
        fill="#0a0a0a"
        opacity={0.85}
      />
    ))}
    {/* Door */}
    <rect x="118" y="22" width="12" height="22" rx="1.5" fill="#1a1a22" opacity="0.9" />
    <line x1="124" y1="22" x2="124" y2="44" stroke="#FEC001" strokeWidth="0.7" />
    {/* Headlight */}
    <motion.circle
      cx={141}
      cy={41}
      r={1.8}
      fill="#FFD00F"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Front grille */}
    <rect x="138" y="34" width="6" height="3" rx="0.5" fill="#1a1a22" opacity="0.7" />
    {/* Wheels */}
    <Wheel cx={28} cy={52} r={8} />
    <Wheel cx={120} cy={52} r={8} />
  </svg>
);

const Train = () => (
  <svg viewBox="0 0 200 60" width="220" height="68" xmlns="http://www.w3.org/2000/svg">
    {/* Front car nose (angled) */}
    <path
      d="M6 22 L24 14 L196 14 L196 50 L6 50 Z"
      fill="#1a1a22"
      stroke="#FEC001"
      strokeWidth="1.5"
    />
    {/* Top accent */}
    <path d="M24 14 L196 14 L196 19 L24 19 Z" fill="#FEC001" />
    {/* Windscreen */}
    <path d="M10 24 L24 18 L36 18 L36 30 L10 30 Z" fill="#0a0a0a" opacity="0.9" />
    {/* Headlight */}
    <motion.circle
      cx={9}
      cy={42}
      r={2.2}
      fill="#FFD00F"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Side windows */}
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <rect
        key={i}
        x={42 + i * 22}
        y={23}
        width={16}
        height={10}
        rx={1}
        fill="#0a0a0a"
        opacity={0.9}
      />
    ))}
    {/* Side stripe */}
    <rect x="6" y="36" width="190" height="2" fill="#FEC001" opacity="0.7" />
    {/* Doors */}
    <rect x="68" y="20" width="3" height="28" fill="#FEC001" opacity="0.5" />
    <rect x="134" y="20" width="3" height="28" fill="#FEC001" opacity="0.5" />
    {/* Wheels (under-carriage) */}
    <rect x="20" y="50" width="170" height="3" fill="#0a0a0a" />
    <Wheel cx={36} cy={54} r={5} spoke={false} />
    <Wheel cx={68} cy={54} r={5} spoke={false} />
    <Wheel cx={132} cy={54} r={5} spoke={false} />
    <Wheel cx={170} cy={54} r={5} spoke={false} />
  </svg>
);

/* ── Vehicle data ── */

type Vehicle = {
  Comp: () => JSX.Element;
  width: number;
  delay: number;
  duration: number;
  bottom: number;
};

const FLEET: Vehicle[] = [
  { Comp: Train,   width: 220, delay: 0.0, duration: 3.6, bottom: 0 },
  { Comp: Bus,     width: 170, delay: 1.2, duration: 3.2, bottom: 2 },
  { Comp: EBike,   width: 118, delay: 2.4, duration: 2.6, bottom: 0 },
  { Comp: Scooter, width: 100, delay: 3.4, duration: 2.4, bottom: 0 },
];

/* ── Skyline (subtle parallax silhouette) ── */
const Skyline = () => (
  <svg
    viewBox="0 0 800 80"
    preserveAspectRatio="none"
    className="absolute bottom-9 left-0 w-[200%] h-12 opacity-25"
  >
    <path
      d="M0,80 L0,55 L24,55 L24,38 L48,38 L48,52 L80,52 L80,30 L100,30 L100,46 L130,46 L130,22 L150,22 L150,40 L184,40 L184,28 L208,28 L208,52 L240,52 L240,18 L260,18 L260,42 L300,42 L300,32 L330,32 L330,55 L360,55 L360,26 L388,26 L388,46 L420,46 L420,18 L444,18 L444,40 L480,40 L480,30 L508,30 L508,52 L540,52 L540,22 L568,22 L568,46 L600,46 L600,30 L628,30 L628,52 L660,52 L660,40 L688,40 L688,18 L720,18 L720,46 L750,46 L750,28 L780,28 L780,52 L800,52 L800,80 Z"
      fill="#FEC001"
    />
  </svg>
);

/* ── Component ── */

export const LoadingSpinner = ({ text = 'Connecting your ride…' }: LoadingSpinnerProps) => {
  const TOTAL_CYCLE = 6; // seconds — matches the slowest vehicle's start + duration

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-[#0a0a0a] gap-8 px-4">
      <div className="relative w-full max-w-[600px] h-[200px] sm:h-[220px] overflow-hidden rounded-3xl border border-gray-200/40 dark:border-white/[0.06] bg-white/40 dark:bg-black/60 backdrop-blur-sm">

        {/* Soft ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-[#FEC001]/15 blur-3xl" />
        </div>

        {/* Parallax skyline */}
        <motion.div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <Skyline />
        </motion.div>

        {/* Speed lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#FEC001]/55 to-transparent"
            style={{ top: `${30 + i * 18}px`, width: '90px' }}
            animate={{ x: [-110, 700] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.13,
              ease: 'linear',
            }}
          />
        ))}

        {/* Road line + animated dashes */}
        <div className="absolute bottom-7 left-0 right-0 h-px bg-gray-300 dark:bg-white/20" />
        <motion.div
          className="absolute bottom-6 left-0 h-px w-[200%]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #FEC001 0, #FEC001 14px, transparent 14px, transparent 38px)',
          }}
        />

        {/* Fleet — each vehicle on its own staggered loop */}
        {FLEET.map(({ Comp, width, delay, duration, bottom }, i) => (
          <motion.div
            key={i}
            className="absolute left-0 drop-shadow-[0_4px_12px_rgba(254,192,1,0.25)]"
            style={{ bottom: `${bottom + 12}px` }}
            initial={{ x: -width - 40 }}
            animate={{ x: ['-' + (width + 40) + 'px', '700px'] }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              repeatDelay: Math.max(0, TOTAL_CYCLE - duration - delay),
              ease: 'linear',
            }}
          >
            <Comp />
          </motion.div>
        ))}
      </div>

      {/* Status text + dots */}
      <div className="flex flex-col items-center gap-3">
        <motion.p
          className="text-gray-700 dark:text-gray-200 font-semibold font-display tracking-wide text-sm sm:text-base"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
        <div className="flex items-center gap-1.5">
          {[0, 0.15, 0.3].map((d, i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#FEC001]"
              animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ delay: d, duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
