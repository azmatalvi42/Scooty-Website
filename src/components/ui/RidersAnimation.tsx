import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/** Lightweight vector scene: riders stay in frame while the city rolls past. */
export function RidersAnimation() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  const wheel = (x: number, y: number, r: number) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#e9eee3" stroke="#243a34" strokeWidth="7" />
      <g className="riding-wheel" stroke="#7c9183" strokeWidth="2">
        <path d={`M${-r + 4} 0H${r - 4}M0 ${-r + 4}V${r - 4}M${-r * .65} ${-r * .65}L${r * .65} ${r * .65}M${-r * .65} ${r * .65}L${r * .65} ${-r * .65}`} />
      </g>
      <circle r="4" fill="#243a34" />
    </g>
  );

  return (
    <div ref={host} className="riders-scene" data-running={visible && !paused}>
      <svg viewBox="0 0 760 580" role="img" aria-label="Helmeted riders travelling through a leafy city on a yellow electric bicycle and electric scooter">
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
        {/* E-bike, complete with battery, crank and pedalling rider. */}
        <g transform="translate(110 8)">
          <ellipse cx="160" cy="416" rx="139" ry="9" fill="#627665" opacity=".17" />
          {wheel(65, 363, 46)}{wheel(260, 363, 46)}
          <g fill="none" stroke="#e7ae00" strokeWidth="10" strokeLinejoin="round">
            <path d="M65 363 117 284 161 363H65L219 284H117M161 363 219 284 260 363" />
          </g>
          <path d="m196 319 17-26" stroke="#243a34" strokeWidth="14" />
          <path d="m219 284-10-33h28m-120 33-7-16m-17 0h36" fill="none" stroke="#243a34" strokeWidth="7" strokeLinecap="round" />
          <circle cx="161" cy="363" r="12" fill="#243a34" />
          <g className="riding-crank" style={{ transformOrigin: '161px 363px' }} stroke="#edf0e7" strokeWidth="4"><path d="m147 350 28 26m-33-26h10m19 26h10" /></g>
          <g className="riding-body">
            <path d="m135 267 44 36-24 46" fill="none" stroke="#314e55" strokeWidth="19" strokeLinecap="round" />
            <path d="m128 266 13 53 37 36" fill="none" stroke="#466a6c" strokeWidth="20" strokeLinecap="round" className="riding-leg" />
            <path d="m147 349 16 5m9 2h18" stroke="#20382e" strokeWidth="9" strokeLinecap="round" />
            <path d="m161 196-37 63 31 14 33-56" fill="#df8058" />
            <path d="m177 217 20 35 30 2" fill="none" stroke="#a9704d" strokeWidth="12" strokeLinecap="round" />
            <path d="m173 187-5 17" stroke="#a9704d" strokeWidth="14" />
            <circle cx="181" cy="173" r="20" fill="#b98057" />
            <path d="M158 172a23 23 0 0 1 46-3l-30 1-12 11Z" fill="#233f35" />
            <path d="m170 173 9 20 15-12" fill="none" stroke="#233f35" strokeWidth="3" />
          </g>
        </g>
        {/* Standing e-scooter rider in the foreground lane. */}
        <g transform="translate(468 88)">
          <ellipse cx="88" cy="424" rx="105" ry="8" fill="#627665" opacity=".2" />
          {wheel(14, 398, 20)}{wheel(167, 398, 20)}
          <path d="M14 394h112l26-25-14-125" fill="none" stroke="#edb700" strokeWidth="9" strokeLinejoin="round" />
          <path d="m126 242 30-3m-14 134 25 25" stroke="#284138" strokeWidth="6" strokeLinecap="round" />
          <g className="riding-body riding-body-scooter">
            <path d="m68 263 5 60-14 63m26-121 14 61-6 60" fill="none" stroke="#28463f" strokeWidth="17" strokeLinecap="round" />
            <path d="M52 388h28m7 0h24" stroke="#faf5df" strokeWidth="9" strokeLinecap="round" />
            <path d="m68 186-18 73q20 19 46 4l-2-66Z" fill="#f6c12e" />
            <path d="m88 206 18 35 34 1" stroke="#d8a07c" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="m81 185 2-16" stroke="#d8a07c" strokeWidth="13" />
            <circle cx="86" cy="153" r="19" fill="#d8a07c" />
            <path d="M64 152a22 22 0 0 1 44-2l-29 2-12 10Z" fill="#f8f5e9" />
            <path d="m75 154 8 17 14-12" fill="none" stroke="#49665a" strokeWidth="3" />
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
