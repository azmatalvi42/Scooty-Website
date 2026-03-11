import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// ── Vehicle SVG Illustrations ──────────────────────────────────────

const ScooterSVG = () => (
  <svg viewBox="0 0 120 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="96" cy="60" r="13" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="96" cy="60" r="4"  fill="currentColor" opacity="0.4" />
    <circle cx="24" cy="60" r="13" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="24" cy="60" r="4"  fill="currentColor" opacity="0.4" />
    <rect   x="22"  y="46" width="75" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
    <path   d="M34 46 L22 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path   d="M10 18 L36 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="10" cy="18" r="4" fill="currentColor" opacity="0.55" />
    <circle cx="60" cy="46" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="60" cy="46" r="2" fill="currentColor" opacity="0.4" />
  </svg>
);

const BikeSVG = () => (
  <svg viewBox="0 0 130 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="102" cy="68" r="16" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="102" cy="68" r="5"  fill="currentColor" opacity="0.3" />
    <circle cx="28"  cy="68" r="16" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="28"  cy="68" r="5"  fill="currentColor" opacity="0.3" />
    <path d="M65 30 L102 68" stroke="currentColor" strokeWidth="2.5" />
    <path d="M65 55 L102 68" stroke="currentColor" strokeWidth="2.5" />
    <path d="M65 55 L65 30"  stroke="currentColor" strokeWidth="2.5" />
    <path d="M65 30 L28  68" stroke="currentColor" strokeWidth="2.5" />
    <path d="M65 30 L82  26" stroke="currentColor" strokeWidth="2.5" />
    <path d="M82 26 L82  34" stroke="currentColor" strokeWidth="3"   strokeLinecap="round" />
    <path d="M57 32 L73  32" stroke="currentColor" strokeWidth="5"   strokeLinecap="round" />
    <circle cx="65" cy="55" r="7" stroke="currentColor" strokeWidth="2" />
    <circle cx="65" cy="55" r="3" fill="currentColor" opacity="0.3" />
  </svg>
);

const CargoSVG = () => (
  <svg viewBox="0 0 150 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="122" cy="62" r="14" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="122" cy="62" r="4"  fill="currentColor" opacity="0.4" />
    <circle cx="28"  cy="62" r="14" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="28"  cy="62" r="4"  fill="currentColor" opacity="0.4" />
    <rect x="26"  y="46" width="97" height="8" rx="4" fill="currentColor" opacity="0.85" />
    <rect x="74"  y="16" width="52" height="30" rx="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.15" />
    <line x1="88"  y1="20" x2="88"  y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <line x1="100" y1="20" x2="100" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <path d="M38 46 L26 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M14 22 L40 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="14" cy="22" r="3.5" fill="currentColor" opacity="0.6" />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────

interface EndpointData {
  method: string;
  path: string;
  value: string;
  live: boolean;
  methodColor: string;
  borderColor: string;
}

interface VehicleData {
  name: string;
  model: string;
  description: string;
  vehicleColor: string;
  modelBadgeClass: string;
  cardClass: string;
  lineStroke: string;
  Svg: () => JSX.Element;
  endpoints: EndpointData[];
}

// ── Data ───────────────────────────────────────────────────────────

const vehicles: VehicleData[] = [
  {
    name: 'Electric Scooter',
    model: 'ES-200',
    description: 'Last-mile urban mobility with sub-second telemetry and 80 km range per charge.',
    vehicleColor: 'text-primary-400',
    modelBadgeClass: 'bg-primary-500/10 text-primary-400',
    cardClass: 'border-primary-500/20 hover:border-primary-500/40',
    lineStroke: '#eab308',
    Svg: ScooterSVG,
    endpoints: [
      { method: 'STREAM', path: '/v1/location', value: '37.774°N 122.419°W', live: true,  methodColor: 'text-sky-400',     borderColor: 'border-sky-500/40' },
      { method: 'GET',    path: '/v1/battery',  value: '87% · 42 km left',   live: true,  methodColor: 'text-green-400',   borderColor: 'border-green-500/40' },
      { method: 'STREAM', path: '/v1/speed',    value: '18.4 km/h',          live: true,  methodColor: 'text-primary-400', borderColor: 'border-primary-500/40' },
      { method: 'GET',    path: '/v1/status',   value: 'Active · Locked',    live: false, methodColor: 'text-violet-400',  borderColor: 'border-violet-500/40' },
    ],
  },
  {
    name: 'Electric Bike',
    model: 'EB-450',
    description: 'Performance e-bike with assist levels, real-time cadence analytics, and trip AI.',
    vehicleColor: 'text-sky-400',
    modelBadgeClass: 'bg-sky-500/10 text-sky-400',
    cardClass: 'border-sky-500/20 hover:border-sky-500/40',
    lineStroke: '#38bdf8',
    Svg: BikeSVG,
    endpoints: [
      { method: 'STREAM', path: '/v1/location', value: '52.520°N 13.405°E',  live: true,  methodColor: 'text-sky-400',    borderColor: 'border-sky-500/40' },
      { method: 'GET',    path: '/v1/battery',  value: '63% · 71 km left',   live: true,  methodColor: 'text-green-400',  borderColor: 'border-green-500/40' },
      { method: 'STREAM', path: '/v1/cadence',  value: '72 RPM · Assist 2',  live: true,  methodColor: 'text-cyan-400',   borderColor: 'border-cyan-500/40' },
      { method: 'POST',   path: '/v1/trip/end', value: '8.2 km · 28 min',    live: false, methodColor: 'text-orange-400', borderColor: 'border-orange-500/40' },
    ],
  },
  {
    name: 'Cargo Scooter',
    model: 'CS-800',
    description: 'Heavy-duty fleet vehicle for deliveries with load monitoring and route intelligence.',
    vehicleColor: 'text-emerald-400',
    modelBadgeClass: 'bg-emerald-500/10 text-emerald-400',
    cardClass: 'border-emerald-500/20 hover:border-emerald-500/40',
    lineStroke: '#34d399',
    Svg: CargoSVG,
    endpoints: [
      { method: 'STREAM', path: '/v1/location', value: '30.044°N 31.235°E',  live: true,  methodColor: 'text-sky-400',     borderColor: 'border-sky-500/40' },
      { method: 'GET',    path: '/v1/payload',  value: '42.1 kg / max 80',   live: true,  methodColor: 'text-emerald-400', borderColor: 'border-emerald-500/40' },
      { method: 'STREAM', path: '/v1/temp',     value: '22.4°C · optimal',   live: true,  methodColor: 'text-red-400',     borderColor: 'border-red-500/40' },
      { method: 'GET',    path: '/v1/service',  value: 'Next in 340 km',     live: false, methodColor: 'text-violet-400',  borderColor: 'border-violet-500/40' },
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────

const EndpointChip = ({ ep }: { ep: EndpointData }) => (
  <div className={`bg-gray-950/90 backdrop-blur-sm border ${ep.borderColor} rounded-lg px-2.5 py-1.5 w-[130px]`}>
    <div className="flex items-center gap-1.5 mb-0.5">
      {ep.live && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
      )}
      <span className={`text-[9px] font-mono font-bold ${ep.methodColor}`}>{ep.method}</span>
    </div>
    <span className="block text-[9px] font-mono text-gray-400 leading-tight truncate">{ep.path}</span>
    <span className="block text-[10px] text-gray-300 leading-tight mt-0.5 truncate">{ep.value}</span>
  </div>
);

// Dot that travels from vehicle center outward along a line
const FlowDot = ({
  x1, y1, x2, y2, delay, color,
}: {
  x1: number; y1: number; x2: number; y2: number; delay: number; color: string;
}) => (
  <motion.circle
    r="2.5"
    fill={color}
    initial={{ cx: x1, cy: y1, opacity: 0 }}
    animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 0.9, 0] }}
    transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 1.4, ease: 'linear' }}
  />
);

const VehicleCard = ({ vehicle, inView }: { vehicle: VehicleData; inView: boolean }) => {
  const { Svg, name, model, description, vehicleColor, modelBadgeClass, cardClass, lineStroke, endpoints } = vehicle;

  // Positions in a 0-100 coordinate space (matches viewBox="0 0 100 100" with preserveAspectRatio="none")
  // Chip centers: TL=(16,14), TR=(84,14), BL=(16,86), BR=(84,86), Vehicle center=(50,50)
  const lines = [
    { x2: 16, y2: 14 },
    { x2: 84, y2: 14 },
    { x2: 16, y2: 86 },
    { x2: 84, y2: 86 },
  ];

  return (
    <div className={`bg-white dark:bg-black/60 backdrop-blur-sm rounded-2xl border ${cardClass} transition-all duration-300 overflow-hidden`}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold font-display text-gray-900 dark:text-white">{name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Live Telemetry</span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${modelBadgeClass}`}>
          {model}
        </span>
      </div>

      {/* Diagram: vehicle + connection lines + endpoint chips */}
      <div className="relative h-[220px] mx-3">
        {/* SVG overlay — dashed connection lines + animated flow dots */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {lines.map((l, i) => (
            <line
              key={i}
              x1="50" y1="50"
              x2={l.x2} y2={l.y2}
              stroke={lineStroke}
              strokeWidth="0.6"
              strokeDasharray="2 2"
              opacity="0.35"
            />
          ))}
          {inView && lines.map((l, i) => (
            <FlowDot
              key={i}
              x1={50} y1={50}
              x2={l.x2} y2={l.y2}
              delay={i * 0.45}
              color={lineStroke}
            />
          ))}
        </svg>

        {/* Vehicle SVG — centered */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 z-10 ${vehicleColor}`}>
          <Svg />
        </div>

        {/* Endpoint chips at the four corners */}
        <div className="absolute top-0 left-0 z-20">
          <EndpointChip ep={endpoints[0]} />
        </div>
        <div className="absolute top-0 right-0 z-20">
          <EndpointChip ep={endpoints[1]} />
        </div>
        <div className="absolute bottom-0 left-0 z-20">
          <EndpointChip ep={endpoints[2]} />
        </div>
        <div className="absolute bottom-0 right-0 z-20">
          <EndpointChip ep={endpoints[3]} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-white/5 mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// ── Section Export ─────────────────────────────────────────────────

export const Team = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="fleet" ref={ref} className="relative py-20 bg-gray-50 dark:bg-navy-800 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Connected <span className="text-primary-500">Fleet</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Every vehicle in the Scooty network streams real-time data through our API — giving operators full visibility at scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <VehicleCard vehicle={vehicle} inView={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
