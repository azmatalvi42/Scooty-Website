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
  CreditCard,
  Bot,
  Bus,
  Navigation,
  Zap,
  MessageSquare,
  Route,
  RefreshCw,
  Play,
  Plus,
  Sparkles,
} from 'lucide-react';
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

/* ── PAY visual (interactive) ── */
type Tx = { id: number; label: string; amount: string; time: string; icon: typeof Zap; isNew?: boolean };

const SAMPLE_TAPS: Omit<Tx, 'id' | 'time' | 'isNew'>[] = [
  { label: 'SCOOTY Ride — 1.8 km', amount: '-$1.40', icon: Zap },
  { label: 'GO Train — Brampton to Union', amount: '-$4.20', icon: Bus },
  { label: 'SCOOTY Ride — 2.6 km', amount: '-$2.10', icon: Zap },
  { label: 'SCOOTY Ride — 0.9 km', amount: '-$0.90', icon: Zap },
];

const PayVisual = () => {
  const [balance, setBalance] = useState(24.8);
  const [txs, setTxs] = useState<Tx[]>([
    { id: 1, label: 'GO Train — Union to Brampton', amount: '-$4.20', time: 'Today 8:42 AM', icon: Bus },
    { id: 2, label: 'SCOOTY Ride — 2.1 km', amount: '-$1.80', time: 'Today 8:30 AM', icon: Zap },
    { id: 3, label: 'SCOOTY PAY Top-Up', amount: '+$25.00', time: 'Yesterday', icon: RefreshCw },
  ]);
  const [tapPing, setTapPing] = useState(0);
  const idCounter = useRef(100);

  const handleTap = () => {
    const sample = SAMPLE_TAPS[Math.floor(Math.random() * SAMPLE_TAPS.length)];
    const amount = parseFloat(sample.amount.replace(/[^\d.]/g, ''));
    idCounter.current += 1;
    const newTx: Tx = {
      id: idCounter.current,
      label: sample.label,
      amount: sample.amount,
      time: 'Just now',
      icon: sample.icon,
      isNew: true,
    };
    setBalance((b) => Math.max(0, +(b - amount).toFixed(2)));
    setTxs((prev) => [newTx, ...prev].slice(0, 4));
    setTapPing((n) => n + 1);
  };

  const handleTopUp = () => {
    idCounter.current += 1;
    const newTx: Tx = {
      id: idCounter.current,
      label: 'SCOOTY PAY Top-Up',
      amount: '+$25.00',
      time: 'Just now',
      icon: RefreshCw,
      isNew: true,
    };
    setBalance((b) => +(b + 25).toFixed(2));
    setTxs((prev) => [newTx, ...prev].slice(0, 4));
  };

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xs space-y-4">
        {/* Card mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative h-48 rounded-3xl overflow-hidden border border-primary-500/30 shadow-2xl shadow-primary-500/10"
          style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2200 50%, #1a1a1a 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.6) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {/* Tap ripple */}
          <AnimatePresence>
            {tapPing > 0 && (
              <motion.div
                key={tapPing}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute top-1/2 right-8 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-500/40 pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="absolute top-4 left-5 right-5 bottom-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-primary-400 font-bold text-sm tracking-widest">SCOOTY PAY</div>
              <CreditCard className="w-5 h-5 text-primary-500/60" />
            </div>
            <div>
              <div className="text-white/30 text-xs mb-1">Balance</div>
              <motion.div
                key={balance}
                initial={{ scale: 1.1, color: '#FEC001' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.4 }}
                className="text-white font-bold text-2xl font-display tabular-nums"
              >
                ${balance.toFixed(2)}
              </motion.div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-xs">•••• •••• •••• 4291</div>
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={handleTap}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-400 text-black rounded-2xl text-xs font-bold transition-colors shadow-md shadow-primary-500/25"
          >
            <Zap className="w-3.5 h-3.5" />
            Tap to Pay
          </motion.button>
          <motion.button
            onClick={handleTopUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-2xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Top Up
          </motion.button>
        </div>

        {/* Transaction rows */}
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {txs.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={tx.isNew ? { opacity: 0, y: -10, scale: 0.96 } : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 22 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-primary-500/30 rounded-2xl px-4 py-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <tx.icon className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{tx.label}</div>
                  <div className="text-gray-500 text-xs">{tx.time}</div>
                </div>
                <div
                  className={`text-xs font-semibold flex-shrink-0 tabular-nums ${
                    tx.amount.startsWith('+') ? 'text-green-400' : 'text-gray-300'
                  }`}
                >
                  {tx.amount}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
  );
};

/* ── Main page ── */
export const TechnologyPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [s1Ref, s1InView] = useSection();
  const [s2Ref, s2InView] = useSection();
  const [s3Ref, s3InView] = useSection();
  const [ctaRef, ctaInView] = useSection();

  return (
    <div className="relative min-h-screen bg-black">
      <ParticleBackground absolute />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="/assets/mainPage/our-solutions-carousel/toronto-skyline.webp"
            alt="Toronto city skyline at dusk"
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
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

      {/* ── PRODUCT 1: ON-DEMAND MOBILITY ── */}
      <section id="on-demand" ref={s1Ref} className="relative py-28 bg-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-500/3 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={s1InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
                <Zap className="w-3.5 h-3.5" />
                Product 01
              </div>
              <h2 className="text-5xl md:text-6xl font-bold font-display text-white leading-tight mb-6">
                SCOOTY<br />
                <span className="text-primary-500">On-Demand</span><br />
                Mobility
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                Improving the reach of regional transit by resolving the first-and-last-km service gap through on-demand mobility (Transit to Your Doorstep®).
              </p>
              <motion.button
                onClick={() => navigate('/riders')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 shadow-lg shadow-primary-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={s1InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TiltCard className="rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] backdrop-blur-sm">
                <FirstLastKmDiagram />
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT 2: SCOOTY PAY ── */}
      <section id="pay" ref={s2Ref} className="relative py-28 bg-gray-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-primary-500/3 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={s2InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              <TiltCard className="rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] backdrop-blur-sm">
                <PayVisual />
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={s2InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
                <CreditCard className="w-3.5 h-3.5" />
                Product 02
              </div>
              <h2 className="text-5xl md:text-6xl font-bold font-display text-white leading-tight mb-6">
                SCOOTY<br />
                <span className="text-primary-500">PAY</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                Seamlessly integrated, secure, and scalable payment processing for transit ticketing and 3rd party mobility services through a unified MaaS platform.
              </p>
              <motion.button
                onClick={() => navigate('/partners')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 shadow-lg shadow-primary-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT 3: AI RIDEGUIDE ── */}
      <section id="rideguide" ref={s3Ref} className="relative py-28 bg-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-500/3 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={s3InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
                <Bot className="w-3.5 h-3.5" />
                Product 03
              </div>
              <h2 className="text-5xl md:text-6xl font-bold font-display text-white leading-tight mb-6">
                SCOOTY AI<br />
                <span className="text-primary-500">RideGuide</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                Using conversational AI, real-time service updates, dynamic routing and customer support to enhance the daily transit commuting experience.
              </p>
              <motion.button
                onClick={() => navigate('/partners')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 shadow-lg shadow-primary-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={s3InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TiltCard className="rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] backdrop-blur-sm">
                <RideGuideVisual />
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

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
