import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const INK = '#1d2a26';
const BRAND = '#FEC001';

/* E-bike pedalling geometry (bike-local coordinates). */
const HIP = { x: 134, y: 268 };
const BB = { x: 161, y: 363 };
const CRANK = 22;
const THIGH = 62;
const SHIN = 60;

type Pt = { x: number; y: number };

/** Two-bone IK: knee position for a leg from hip to foot, knee bent forward. */
function knee(hip: Pt, foot: Pt): Pt {
  const dx = foot.x - hip.x;
  const dy = foot.y - hip.y;
  const d = Math.min(Math.hypot(dx, dy), THIGH + SHIN - 0.5);
  const base = Math.atan2(dy, dx);
  const a = Math.acos((THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d));
  const k1 = { x: hip.x + THIGH * Math.cos(base - a), y: hip.y + THIGH * Math.sin(base - a) };
  const k2 = { x: hip.x + THIGH * Math.cos(base + a), y: hip.y + THIGH * Math.sin(base + a) };
  return k1.x > k2.x ? k1 : k2;
}

function legPose(angle: number) {
  const foot = { x: BB.x + CRANK * Math.cos(angle), y: BB.y + CRANK * Math.sin(angle) };
  const k = knee(HIP, foot);
  return {
    leg: `M${HIP.x} ${HIP.y}L${k.x.toFixed(1)} ${k.y.toFixed(1)}L${foot.x.toFixed(1)} ${foot.y.toFixed(1)}`,
    shoe: `M${(foot.x - 7).toFixed(1)} ${(foot.y + 2).toFixed(1)}h17`,
    crank: `M${BB.x} ${BB.y}L${foot.x.toFixed(1)} ${foot.y.toFixed(1)}`,
    pedal: `M${(foot.x - 7).toFixed(1)} ${foot.y.toFixed(1)}h14`,
  };
}

/** SCOOTY-branded bike helmet, facing right, centred on the rider's head. */
const Helmet = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-6 3 3 18l9-2" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-23 6C-26-16-6-28 8-25c10 2 16 11 16 19l7 3-1 4H17Z" fill={BRAND} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M24-6l7 3-1 4H18Z" fill={INK} />
    <path d="M-12-20l5-3m7-2h6" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    <text x="-1" y="-5" textAnchor="middle" fontSize="8" fontWeight="900" letterSpacing=".4" fill={INK} fontFamily="inherit">SCOOTY</text>
  </g>
);

const Face = ({ x, y, skin }: { x: number; y: number; skin: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="18" fill={skin} />
    <circle cx="10" cy="4" r="2" fill={INK} />
    <path d="M8 11q4 2 7-1" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
  </g>
);

/** Lightweight vector scene: riders stay in frame while the city rolls past. */
export function RidersAnimation() {
  const host = useRef<HTMLDivElement>(null);
  const nearLeg = useRef<SVGPathElement>(null);
  const nearShoe = useRef<SVGPathElement>(null);
  const nearCrank = useRef<SVGPathElement>(null);
  const nearPedal = useRef<SVGPathElement>(null);
  const farLeg = useRef<SVGPathElement>(null);
  const farShoe = useRef<SVGPathElement>(null);
  const farCrank = useRef<SVGPathElement>(null);
  const farPedal = useRef<SVGPathElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const running = visible && !paused;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  // Pedalling is driven in JS so both feet stay locked to the cranks.
  const angle = useRef(0);
  useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      angle.current += ((now - last) / 1000) * Math.PI * 1.6;
      last = now;
      const near = legPose(angle.current);
      const far = legPose(angle.current + Math.PI);
      nearLeg.current?.setAttribute('d', near.leg);
      nearShoe.current?.setAttribute('d', near.shoe);
      nearCrank.current?.setAttribute('d', near.crank);
      nearPedal.current?.setAttribute('d', near.pedal);
      farLeg.current?.setAttribute('d', far.leg);
      farShoe.current?.setAttribute('d', far.shoe);
      farCrank.current?.setAttribute('d', far.crank);
      farPedal.current?.setAttribute('d', far.pedal);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const near0 = legPose(0);
  const far0 = legPose(Math.PI);

  const wheel = (x: number, y: number, r: number) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#e9eee3" stroke={INK} strokeWidth="7" />
      <g className="riding-wheel" stroke="#7c9183" strokeWidth="2">
        <path d={`M${-r + 4} 0H${r - 4}M0 ${-r + 4}V${r - 4}M${-r * .65} ${-r * .65}L${r * .65} ${r * .65}M${-r * .65} ${r * .65}L${r * .65} ${-r * .65}`} />
      </g>
      <circle r="5" fill={BRAND} stroke={INK} strokeWidth="2" />
    </g>
  );

  return (
    <div ref={host} className="riders-scene" data-running={running}>
      <svg viewBox="0 0 760 580" role="img" aria-label="Riders in SCOOTY helmets travelling through a leafy city on a SCOOTY electric bike and electric scooter">
        <rect width="760" height="580" fill="#e7eee0" />
        <circle cx="604" cy="104" r="55" fill="#f6ce62" />
        <path d="M0 210Q170 95 340 200T760 150V380H0Z" fill="#d0ddc8" />
        <g className="riding-skyline" fill="#b4c9b6">
          {[0, 760].map(offset => <g key={offset} transform={`translate(${offset} 0)`}>
            <path d="M0 310V190H68V310M85 310V133H169V310M190 310V175H258V310M290 310V112H361V310M390 310V185H470V310M490 310V150H551V310M580 310V203H665V310M687 310V137H753V310" />
            <path d="M104 158h46m-46 28h46m-46 28h46m159-72h34m-34 28h34m-34 28h34m158-26h27m-27 28h27m165-40h32m-32 28h32" stroke="#e7eee0" strokeWidth="8" />
          </g>)}
        </g>
        <path d="M0 301Q230 267 760 307V397H0Z" fill="#9bbca0" />
        <g className="riding-trees">
          {[0, 760].map(offset => <g key={offset} transform={`translate(${offset} 0)`}>
            {[40, 440, 710].map(x => <g key={x} transform={`translate(${x} 0)`}>
              <path d="M0 220V345" stroke="#627e65" strokeWidth="9" />
              <ellipse cy="226" rx="35" ry="55" fill="#719879" />
              <path d="M0 224v73m0-29 18-22m-18 4-16-18" stroke="#456d54" strokeWidth="3" fill="none" />
            </g>)}
          </g>)}
        </g>
        <path d="M0 350H760V580H0Z" fill="#ccd5c7" />
        <path d="M0 363H760M0 552H760" stroke="#f6f6e9" strokeWidth="5" />
        <g className="riding-road" stroke="#f6f6e9" strokeWidth="4" strokeDasharray="48 48"><path d="M0 458H1520" /></g>

        {/* SCOOTY e-bike with a pedalling rider. */}
        <g transform="translate(110 8)">
          <ellipse cx="160" cy="416" rx="139" ry="9" fill="#627665" opacity=".17" />

          {/* Far leg and crank sit behind the frame. */}
          <path ref={farLeg} d={far0.leg} fill="none" stroke="#2c474d" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          <path ref={farShoe} d={far0.shoe} stroke="#15241f" strokeWidth="8" strokeLinecap="round" />
          <path ref={farCrank} d={far0.crank} stroke="#4b5c55" strokeWidth="5" strokeLinecap="round" />
          <path ref={farPedal} d={far0.pedal} stroke="#4b5c55" strokeWidth="4" strokeLinecap="round" />

          {wheel(65, 363, 46)}{wheel(260, 363, 46)}
          {/* Fenders */}
          <path d="M14 355a52 52 0 0 1 96-22M214 330a52 52 0 0 1 97 22" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />

          {/* Rear rack + branded cargo box */}
          <path d="M40 310H112M65 363 58 310M100 310l-8 25" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <rect x="30" y="274" width="80" height="34" rx="6" fill={BRAND} stroke={INK} strokeWidth="3" />
          <text x="70" y="296" textAnchor="middle" fontSize="13" fontWeight="900" letterSpacing=".8" fill={INK} fontFamily="inherit">SCOOTY</text>

          {/* Frame */}
          <g fill="none" stroke={BRAND} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            <path d="M65 363 124 290M161 363 120 276M124 292 221 283M218 296 161 363M65 363H161" />
          </g>
          {/* Down-tube battery */}
          <g transform="translate(190 330) rotate(-49.6)">
            <rect x="-30" y="-9" width="60" height="18" rx="5" fill={INK} />
            <path d="M3-6-5 1h6l-3 6 8-8H0Z" fill={BRAND} />
          </g>
          {/* Fork, stem, bars, headlight, saddle */}
          <path d="M224 268 260 363M224 270l-4-20M208 250h28" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <rect x="226" y="272" width="12" height="9" rx="3" fill="#fff6cf" stroke={INK} strokeWidth="2" />
          <path d="M102 270h34q5 0 2 7h-32q-6 0-4-7Z" fill={INK} />
          <circle cx={BB.x} cy={BB.y} r="12" fill={INK} />
          <circle cx={BB.x} cy={BB.y} r="5" fill={BRAND} />

          {/* Rider */}
          <g className="riding-body">
            <path d="M136 266 176 210" stroke="#df8058" strokeWidth="28" strokeLinecap="round" />
            <path d="m184 196 3-10" stroke="#a9704d" strokeWidth="12" strokeLinecap="round" />
            <path d="m178 214 26 22 30 14" fill="none" stroke="#a9704d" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            <Face x={190} y={176} skin="#b98057" />
            <Helmet x={190} y={176} />
          </g>

          {/* Near leg and crank in front of the frame. */}
          <path ref={nearLeg} d={near0.leg} fill="none" stroke="#466a6c" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path ref={nearShoe} d={near0.shoe} stroke="#15241f" strokeWidth="9" strokeLinecap="round" />
          <path ref={nearCrank} d={near0.crank} stroke="#edf0e7" strokeWidth="5" strokeLinecap="round" />
          <path ref={nearPedal} d={near0.pedal} stroke="#edf0e7" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* SCOOTY e-scooter with a standing rider. */}
        <g transform="translate(468 88)">
          <ellipse cx="88" cy="424" rx="105" ry="8" fill="#627665" opacity=".2" />
          {wheel(14, 398, 20)}{wheel(167, 398, 20)}
          <path d="M-8 392a22 22 0 0 1 40-12" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M150 374 167 398" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          {/* Deck + neck */}
          <path d="M14 392H128L150 372" fill="none" stroke={BRAND} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 399H124" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          {/* Branded stem */}
          <path d="M150 376 138 246" stroke={BRAND} strokeWidth="17" strokeLinecap="round" />
          <text transform="translate(145 318) rotate(-95.3)" textAnchor="middle" y="4" fontSize="11" fontWeight="900" letterSpacing="1" fill={INK} fontFamily="inherit">SCOOTY</text>
          <path d="M124 244h36" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <circle cx="141" cy="262" r="5" fill="#fff6cf" stroke={INK} strokeWidth="2" />

          {/* Rider: legs planted, upper body bobs. */}
          <path d="m68 263 5 60-14 63m26-121 14 61-6 60" fill="none" stroke="#28463f" strokeWidth="17" strokeLinecap="round" />
          <path d="M52 386h28m7 0h24" stroke="#faf5df" strokeWidth="9" strokeLinecap="round" />
          <g className="riding-body riding-body-scooter">
            <path d="m68 186-18 73q20 19 46 4l-2-66Z" fill="#3f7f78" />
            <path d="m88 206 18 35 34 1" stroke="#d8a07c" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="m81 185 2-16" stroke="#d8a07c" strokeWidth="13" />
            <Face x={86} y={153} skin="#d8a07c" />
            <Helmet x={86} y={153} />
          </g>
        </g>
      </svg>
      <div className="riders-scene-caption"><span className="w-2 h-2 rounded-full bg-[#fec001]" /> A little electric. A lot of possibility.</div>
      <button type="button" className="riders-scene-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play riding animation' : 'Pause riding animation'} aria-pressed={paused}>
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  );
}
