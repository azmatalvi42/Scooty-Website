import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight,
  MapPin,
  Bot,
  Bus,
  Navigation,
  Zap,
  MessageSquare,
  Route,
  Play,
  Sparkles,
  ShieldCheck,
  Radio,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '../components/ui/ParticleBackground';

/* ── Reusable section wrapper ── */
const useSection = () => useInView({ triggerOnce: true, threshold: 0.1 });

/* ── Mouse-tracked 3D tilt wrapper ── */
const TiltCard = ({
  children,
  className = '',
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-200, 200], [max, -max]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-max, max]), {
    stiffness: 150,
    damping: 18,
  });
  const glowX = useTransform(x, [-200, 200], ['0%', '100%']);
  const glowY = useTransform(y, [-200, 200], ['0%', '100%']);
  const glowBg = useTransform(
    [glowX, glowY] as never,
    ([px, py]: string[]) =>
      `radial-gradient(circle at ${px} ${py}, rgba(254,192,1,0.18), transparent 55%)`
  );

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={`relative ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60"
        style={{ background: glowBg }}
      />
      {children}
    </motion.div>
  );
};

/* ── First/Last KM diagram (interactive) ── */
const FirstLastKmDiagram = () => {
  const [playKey, setPlayKey] = useState(0);

  const steps = [
    { type: 'place', icon: MapPin, title: 'Your Home', sub: 'Starting point', primary: true },
    { type: 'link', icon: Zap, label: 'SCOOTY On-Demand', primary: true },
    { type: 'place', icon: Bus, title: 'Transit Stop', sub: 'Bus · LRT · GO Train', primary: false },
    { type: 'link', icon: Route, label: 'Regional Transit', primary: false },
    { type: 'place', icon: Bus, title: 'Destination Stop', sub: 'Nearest station', primary: false },
    { type: 'link', icon: Zap, label: 'SCOOTY On-Demand', primary: true },
    { type: 'place', icon: Navigation, title: 'Your Destination', sub: 'Door-to-door delivery', primary: true },
  ];

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div key={playKey} className="flex flex-col gap-0">
            {steps.map((step, i) => {
              const delay = i * 0.25;
              if (step.type === 'place') {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay, duration: 0.5 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                        step.primary
                          ? 'bg-primary-500 shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/60'
                          : 'bg-white/10 border border-white/20 group-hover:border-white/40'
                      }`}
                    >
                      <Icon className={`w-7 h-7 ${step.primary ? 'text-black' : 'text-white'}`} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{step.title}</div>
                      <div className="text-gray-400 text-xs">{step.sub}</div>
                    </div>
                  </motion.div>
                );
              }
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay, duration: 0.4 }}
                  className="flex items-center gap-4 ml-7 my-1"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={`w-px h-3 ${step.primary ? 'bg-primary-500/40' : 'bg-white/20'}`} />
                    <motion.div
                      animate={step.primary ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      className={`w-2 h-2 rounded-full ${step.primary ? 'bg-primary-500' : 'bg-white/40'}`}
                    />
                    <div className={`w-px h-3 ${step.primary ? 'bg-primary-500/40' : 'bg-white/20'}`} />
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                      step.primary
                        ? 'bg-primary-500/10 border-primary-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${step.primary ? 'text-primary-400' : 'text-gray-400'}`} />
                    <span className={`text-xs font-semibold ${step.primary ? 'text-primary-400' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Replay + badge row */}
      <div className="relative mt-8 flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => setPlayKey((k) => k + 1)}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-primary-500/15 border border-white/10 hover:border-primary-500/40 rounded-full text-xs font-semibold text-gray-300 hover:text-primary-300 transition-all"
        >
          <Play className="w-3 h-3 group-hover:scale-110 transition-transform" />
          Replay journey
        </button>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-xs font-semibold text-primary-400">Transit to Your Doorstep®</span>
        </div>
      </div>
    </div>
  );
};

/* ── Patchforce operations map (interactive) ── */
const PATCH_ISSUES = [
  { id: 'pothole', label: 'Pothole', location: 'Queen St W & Main', color: '#FEC001', icon: 'P' },
  { id: 'streetlight', label: 'Street light', location: 'Maple Ave & 4th', color: '#7dd3fc', icon: 'L' },
  { id: 'flooding', label: 'Flooding', location: 'Riverside Trail', color: '#60a5fa', icon: 'F' },
];

const PayVisual = () => {
  const [selected, setSelected] = useState(0);
  const issue = PATCH_ISSUES[selected];
  return (
    <div className="relative w-full h-full min-h-[520px] flex items-center justify-center p-5 sm:p-7">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary-500/30 bg-[#162520] shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div><div className="text-primary-400 text-sm font-bold tracking-widest">PATCHFORCE</div><div className="text-[10px] text-white/45">Public works operations</div></div>
          <Layers className="h-5 w-5 text-primary-400" />
        </div>
        <div className="relative h-80 sm:h-[25rem] overflow-hidden bg-[#f5f2ea]" style={{ backgroundImage: 'linear-gradient(18deg, transparent 42%, #d6dde4 43% 47%, #b8c5d0 48% 49%, transparent 50%), linear-gradient(112deg, transparent 44%, #d6dde4 45% 49%, #b8c5d0 50% 51%, transparent 52%), linear-gradient(#e6e9ed 1px, transparent 1px), linear-gradient(90deg, #e6e9ed 1px, transparent 1px)', backgroundSize: '100% 100%, 100% 100%, 42px 42px, 42px 42px' }}>
          <div className="absolute left-[8%] top-[7%] h-[30%] w-[25%] rounded-[42%] bg-[#dcebd5] opacity-80" />
          <div className="absolute right-[7%] bottom-[9%] h-[26%] w-[27%] rounded-[45%] bg-[#e0eedb] opacity-80" />
          <div className="absolute -right-[10%] top-0 h-full w-[18%] rotate-[9deg] bg-[#a9e0e7] opacity-90" />
          <div className="absolute left-[9%] top-[17%] text-[10px] font-bold uppercase tracking-[.18em] text-[#719078]">Cedar Park</div>
          <div className="absolute right-[16%] bottom-[18%] text-[10px] font-bold uppercase tracking-[.18em] text-[#719078]">Riverside</div>
          <div className="absolute left-[44%] bottom-[8%] rotate-[-18deg] text-[9px] font-semibold uppercase tracking-[.16em] text-[#718096]">Main Street</div>
          <div className="absolute left-[58%] top-[21%] rotate-[58deg] text-[9px] font-semibold uppercase tracking-[.14em] text-[#718096]">Maple Avenue</div>
          <div className="absolute left-[22%] bottom-[32%] rotate-[26deg] text-[9px] font-semibold uppercase tracking-[.14em] text-[#718096]">Queen Street</div>
          {PATCH_ISSUES.map((item, index) => (
            <button key={item.id} type="button" onClick={() => setSelected(index)} aria-label={`Show ${item.label} issue`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${[29, 66, 48][index]}%`, top: `${[34, 58, 76][index]}%` }}>
              <span className={`absolute inset-0 rounded-full animate-ping ${selected === index ? 'opacity-30' : 'opacity-0'}`} style={{ backgroundColor: item.color }} />
              <span className="relative grid h-9 w-9 rotate-45 place-items-center rounded-[5px] border-2 border-white text-xs font-black text-[#162520] shadow-lg" style={{ backgroundColor: '#FEC001' }}><span className="-rotate-45">{item.icon}</span></span>
              <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-[#425466] shadow-sm">{item.label}</span>
            </button>
          ))}
          <div className="absolute bottom-3 left-3 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-semibold text-[#31483d] backdrop-blur">Live municipal map · 3 open issues</div>
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Selected report</span><span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: `${issue.color}33`, color: issue.color }}>Needs review</span></div>
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl text-sm font-black text-[#162520]" style={{ backgroundColor: issue.color }}>{issue.icon}</span><div><div className="text-sm font-bold text-white">{issue.label}</div><div className="text-xs text-white/50">{issue.location}</div></div></div>
          <div className="mt-4 flex gap-2">{PATCH_ISSUES.map((item, index) => <button key={item.id} type="button" onClick={() => setSelected(index)} className={`flex-1 rounded-xl border px-2 py-2 text-[10px] font-semibold transition-colors ${selected === index ? 'border-primary-500/60 bg-primary-500/15 text-primary-300' : 'border-white/10 text-white/50 hover:border-white/25'}`}>{item.label}</button>)}</div>
        </div>
      </div>
    </div>
  );
};

/* ── AI RideGuide visual (interactive) ── */
type ChatMsg = { id: number; from: 'user' | 'ai'; text: string };

const PROMPTS = [
  {
    id: 'fastest',
    text: 'Fastest way to Brampton GO?',
    reply:
      "There's a SCOOTY 3 min away. Ride to Meadowvale Station, then the 9:14 GO arrives in 22 min. Want me to unlock a ride?",
  },
  {
    id: 'disruption',
    text: 'Any service disruptions today?',
    reply: 'Minor delay on Line 1 Yonge — 4 min. Your usual route is unaffected ✓',
  },
  {
    id: 'cost',
    text: 'How much will my commute cost?',
    reply: 'Estimated $6.00 total: $1.80 SCOOTY + $4.20 GO Train. SCOOTY PAY can cover both in one tap.',
  },
  {
    id: 'time',
    text: 'Best time to leave?',
    reply: 'Leave in 8 min to catch the 9:14 GO comfortably. Next one after is 9:32.',
  },
];

const RideGuideVisual = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 0,
      from: 'ai',
      text: 'Hey! I can help plan routes, check disruptions, and unlock rides. Ask me anything.',
    },
  ]);
  const [usedPrompts, setUsedPrompts] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const idCounter = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const askPrompt = (prompt: typeof PROMPTS[number]) => {
    if (usedPrompts.has(prompt.id) || isTyping) return;
    idCounter.current += 1;
    setMessages((prev) => [...prev, { id: idCounter.current, from: 'user', text: prompt.text }]);
    setUsedPrompts((s) => new Set(s).add(prompt.id));
    setIsTyping(true);
    setTimeout(() => {
      idCounter.current += 1;
      setMessages((prev) => [...prev, { id: idCounter.current, from: 'ai', text: prompt.reply }]);
      setIsTyping(false);
    }, 1100);
  };

  const reset = () => {
    setMessages([
      {
        id: 0,
        from: 'ai',
        text: 'Hey! I can help plan routes, check disruptions, and unlock rides. Ask me anything.',
      },
    ]);
    setUsedPrompts(new Set());
    setIsTyping(false);
    idCounter.current = 1;
  };

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
      </div>

      <div className="rideguide-phone">
        <div className="rideguide-phone-speaker" aria-hidden="true" />
        <div className="rideguide-phone-screen">
        <div className="relative w-full max-w-xs space-y-3 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 bg-primary-500/10 border border-primary-500/30 rounded-2xl px-4 py-3"
        >
          <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold">SCOOTY AI RideGuide</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-400 text-xs">Online</span>
            </div>
          </div>
          {usedPrompts.size > 0 && (
            <button
              onClick={reset}
              className="text-[10px] text-gray-400 hover:text-primary-400 transition-colors font-semibold"
            >
              Reset
            </button>
          )}
        </motion.div>

        {/* Chat messages */}
        <div
          ref={scrollRef}
          className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, type: 'spring', stiffness: 280, damping: 22 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-primary-500 text-black font-medium rounded-tr-sm'
                      : 'bg-white/8 border border-white/10 text-gray-200 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex justify-start"
              >
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1 items-center">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ delay: d, duration: 0.6, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt chips */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-primary-400" />
            Try asking
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((p) => {
              const used = usedPrompts.has(p.id);
              return (
                <motion.button
                  key={p.id}
                  disabled={used || isTyping}
                  onClick={() => askPrompt(p)}
                  whileHover={!used && !isTyping ? { scale: 1.04 } : {}}
                  whileTap={!used && !isTyping ? { scale: 0.96 } : {}}
                  className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                    used
                      ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                      : 'bg-white/5 border-white/15 hover:border-primary-500/40 hover:bg-primary-500/10 text-gray-300 hover:text-primary-300'
                  }`}
                >
                  {p.text}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Suggested route footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white/5 border border-primary-500/20 rounded-2xl px-4 py-3 flex items-center gap-3"
        >
          <Route className="w-4 h-4 text-primary-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-white text-xs font-medium">Suggested Route</div>
            <div className="text-gray-400 text-xs">SCOOTY → GO Train → 22 min total</div>
          </div>
          <MessageSquare className="w-3.5 h-3.5 text-primary-500/60" />
        </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
};

/* ── Product model ─────────────────────────────────────────────
   Every string below is drawn from the page's own approved copy or
   the interactive visuals above — no fabricated metrics or claims. */
type Feature = { icon: LucideIcon; label: string };
type Product = {
  id: string;
  n: string;
  icon: LucideIcon;
  shortName: string;
  tagline: string;
  titleTop: string;
  titleAccent: string;
  titleBottom?: string;
  description: string;
  features: Feature[];
  cta: { label: string; href: string };
  Visual: () => JSX.Element;
};

const PRODUCTS: Product[] = [
  {
    id: 'on-demand',
    n: '01',
    icon: Zap,
    shortName: 'On-Demand Mobility',
    tagline: 'Closing the first & last-km gap, on demand.',
    titleTop: 'SCOOTY',
    titleAccent: 'On-Demand',
    titleBottom: 'Mobility',
    description:
      'Improving the reach of regional transit by resolving the first-and-last-km service gap through on-demand mobility (Transit to Your Doorstep®).',
    features: [
      { icon: Route, label: 'First & last-km' },
      { icon: Bus, label: 'Bus · LRT · GO Train' },
      { icon: Navigation, label: 'Door-to-door' },
    ],
    cta: { label: 'Learn More', href: '/riders' },
    Visual: FirstLastKmDiagram,
  },
  {
    id: 'patchforce',
    n: '02',
    icon: Layers,
    shortName: 'Patchforce',
    tagline: 'From resident report to documented repair.',
    titleTop: '',
    titleAccent: 'Patchforce',
    description:
      'AI-native reporting and operations for municipal public works. A resident’s photo becomes a ranked, routed and fully documented repair.',
    features: [
      { icon: MapPin, label: 'Resident reports' },
      { icon: Zap, label: 'Ranked & routed' },
      { icon: ShieldCheck, label: 'Fully documented' },
    ],
    cta: { label: 'Learn More', href: '/products/patchforce' },
    Visual: PayVisual,
  },
  {
    id: 'rideguide',
    n: '03',
    icon: Bot,
    shortName: 'AI RideGuide',
    tagline: 'Conversational, real-time transit intelligence.',
    titleTop: 'SCOOTY AI',
    titleAccent: 'RideGuide',
    description:
      'Using conversational AI, real-time service updates, dynamic routing and customer support to enhance the daily transit commuting experience.',
    features: [
      { icon: Bot, label: 'Conversational AI' },
      { icon: Radio, label: 'Real-time updates' },
      { icon: Route, label: 'Dynamic routing' },
    ],
    cta: { label: 'Learn More', href: '/partners' },
    Visual: RideGuideVisual,
  },
];

/* ── Feature chip row ── */
const FeatureChips = ({ features }: { features: Feature[] }) => (
  <div className="flex flex-wrap gap-2.5 mb-9">
    {features.map((f) => (
      <span
        key={f.label}
        className="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-gray-300"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500/12">
          <f.icon className="w-3 h-3 text-primary-400" />
        </span>
        {f.label}
      </span>
    ))}
  </div>
);

/* ── Products overview (delivers the hero's "three products, one platform" promise) ── */
const ProductIndex = ({ products }: { products: Product[] }) => {
  const [ref, inView] = useSection();
  return (
    <section className="relative bg-black pt-24 pb-8 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white leading-tight">
            Three products working as one
          </h2>
          <p className="text-gray-400 mt-4 text-base sm:text-lg leading-relaxed">
            On-demand mobility, unified payments, and AI transit intelligence — built to move
            people the entire way, not just part of it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.a
              key={p.id}
              href={`#${p.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-7 hover:border-primary-500/40 hover:bg-white/[0.05] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 transition-colors duration-300">
                  <p.icon className="w-6 h-6 text-primary-400 group-hover:text-black transition-colors duration-300" />
                </div>
                <span className="text-5xl font-black font-display leading-none text-white/[0.06] group-hover:text-primary-500/25 transition-colors duration-300">
                  {p.n}
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">{p.shortName}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{p.tagline}</p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-400">
                Explore
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── One product section (alternating layout, data-driven) ── */
const ProductSection = ({ product, index }: { product: Product; index: number }) => {
  const navigate = useNavigate();
  const [ref, inView] = useSection();
  const reversed = index % 2 === 1; // 02 puts the visual on the left
  const tone = reversed ? 'bg-gray-950' : 'bg-black';
  const { Visual } = product;

  const text = (
    <motion.div
      initial={{ opacity: 0, x: reversed ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={reversed ? 'order-1 lg:order-2' : ''}
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
        <product.icon className="w-3.5 h-3.5" />
        Product {product.n}
      </div>
      <h2 className="text-5xl md:text-6xl font-bold font-display text-white leading-tight mb-6">
        {product.titleTop && <>{product.titleTop}<br /></>}
        <span className="text-primary-500">{product.titleAccent}</span>
        {product.titleBottom && (
          <>
            <br />
            {product.titleBottom}
          </>
        )}
      </h2>
      <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">{product.description}</p>
      <FeatureChips features={product.features} />
      <motion.button
        onClick={() => navigate(product.cta.href)}
        className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 shadow-lg shadow-primary-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{product.cta.label}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );

  const visual = (
    <motion.div
      initial={{ opacity: 0, x: reversed ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={reversed ? 'order-2 lg:order-1' : ''}
    >
      <TiltCard className="rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] backdrop-blur-sm">
        <Visual />
      </TiltCard>
    </motion.div>
  );

  return (
    <section id={product.id} ref={ref} className={`relative py-28 scroll-mt-24 overflow-hidden ${tone}`}>
      {/* Texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: reversed
            ? 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
          backgroundSize: reversed ? '60px 60px' : '30px 30px',
        }}
      />
      <div
        className={`absolute top-0 h-full w-1/2 from-primary-500/[0.04] to-transparent ${
          reversed ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'
        }`}
      />
      {/* Editorial watermark number */}
      <div
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[16rem] leading-none font-black font-display text-white/[0.015] select-none hidden xl:block ${
          reversed ? 'right-8' : 'left-8'
        }`}
      >
        {product.n}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {text}
          {visual}
        </div>
      </div>
    </section>
  );
};

/* ── Main page ── */
export const TechnologyPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [ctaRef, ctaInView] = useSection();

  return (
    <div className="relative min-h-screen bg-black">
      <ParticleBackground absolute />

      {/* ── HERO ── */}
      <section ref={heroRef} className="technology-hero relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="/assets/mainPage/our-solutions-hero.png"
            alt="A commuter on a SCOOTY e-scooter beside a city bus and transit shelter at sunset"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </motion.div>
        {/* Cinematic overlay stack — darken, vignette, brand wash, bottom fade to black.
           The photo is a bright golden-hour scene, so the centre carries an extra
           scrim to keep the headline legible over the sun flare. */}
        <div className="absolute inset-0 bg-black/45" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(75% 70% at 50% 52%, rgba(0,0,0,0.55) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 90% at 50% 25%, transparent 35%, rgba(0,0,0,0.6) 100%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-primary-500/[0.06] blur-[120px] rounded-full pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(254,192,1,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(254,192,1,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
        >

          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-display text-white leading-[1.05] tracking-tight mb-5 [filter:drop-shadow(0_2px_20px_rgba(0,0,0,0.9))]"
          >
            Built for the <span className="text-[#FEC001]">Future</span>
            <br />of Transit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-7 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]"
          >
            Three products. One platform. Connecting communities through on-demand mobility, seamless payments, and AI-powered transit intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => document.getElementById('on-demand')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-7 py-4 bg-[#FEC001] text-black rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FEC001]/25 hover:bg-[#FFD00F] transition-colors"
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(254,192,1,0.45)' }}
              whileTap={{ scale: 0.96 }}
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/partners')}
              className="px-7 py-4 bg-white/[0.12] backdrop-blur-sm border border-white/25 text-white rounded-full font-semibold text-base hover:bg-white/[0.20] hover:border-white/40 transition-all duration-200"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Become a Partner
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => document.getElementById('on-demand')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── PRODUCTS OVERVIEW ── */}
      <ProductIndex products={PRODUCTS} />

      {/* ── PRODUCT SECTIONS ── */}
      {PRODUCTS.map((product, i) => (
        <ProductSection key={product.id} product={product} index={i} />
      ))}

      {/* ── CTA ── */}
      <section ref={ctaRef} className="py-24 bg-primary-500 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <motion.div
          className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold font-display text-black leading-tight mb-5">
              Ready to Transform Transit?
            </h2>
            <p className="text-black/60 text-xl mb-10 max-w-xl mx-auto">
              Partner with SCOOTY to bring on-demand mobility, unified payments, and AI transit intelligence to your community.
            </p>
            <motion.button
              onClick={() => navigate('/partners')}
              className="group px-12 py-5 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-900 transition-colors flex items-center justify-center mx-auto gap-3 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Partner With SCOOTY</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
