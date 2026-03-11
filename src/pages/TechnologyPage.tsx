import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef } from 'react';
import { ArrowRight, MapPin, CreditCard, Bot, Bus, Navigation, Zap, MessageSquare, Route, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '../components/ui/ParticleBackground';

/* ── Reusable section wrapper ── */
const useSection = () => useInView({ triggerOnce: true, threshold: 0.1 });

/* ── First/Last KM diagram ── */
const FirstLastKmDiagram = () => (
  <div className="relative w-full h-full min-h-[420px] flex items-center justify-center p-8">
    {/* Background glow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
    </div>

    <div className="relative w-full max-w-sm">
      {/* Journey nodes */}
      <div className="flex flex-col gap-0">

        {/* Home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
            <MapPin className="w-7 h-7 text-black" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Your Home</div>
            <div className="text-gray-400 text-xs">Starting point</div>
          </div>
        </motion.div>

        {/* Connector with SCOOTY label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-4 ml-7 my-1"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-primary-500/40" />
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <div className="w-px h-3 bg-primary-500/40" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-full">
            <Zap className="w-3 h-3 text-primary-400" />
            <span className="text-xs font-semibold text-primary-400">SCOOTY On-Demand</span>
          </div>
        </motion.div>

        {/* Transit Stop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <Bus className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Transit Stop</div>
            <div className="text-gray-400 text-xs">Bus · LRT · GO Train</div>
          </div>
        </motion.div>

        {/* Connector — transit leg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex items-center gap-4 ml-7 my-1"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-px h-3 bg-white/20" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Route className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Regional Transit</span>
          </div>
        </motion.div>

        {/* Destination Stop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <Bus className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Destination Stop</div>
            <div className="text-gray-400 text-xs">Nearest station</div>
          </div>
        </motion.div>

        {/* Connector with SCOOTY label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex items-center gap-4 ml-7 my-1"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-primary-500/40" />
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <div className="w-px h-3 bg-primary-500/40" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-full">
            <Zap className="w-3 h-3 text-primary-400" />
            <span className="text-xs font-semibold text-primary-400">SCOOTY On-Demand</span>
          </div>
        </motion.div>

        {/* Final destination */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
            <Navigation className="w-7 h-7 text-black" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Your Destination</div>
            <div className="text-gray-400 text-xs">Door-to-door delivery</div>
          </div>
        </motion.div>

      </div>

      {/* Trademark badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full"
      >
        <span className="w-2 h-2 rounded-full bg-primary-500" />
        <span className="text-xs font-semibold text-primary-400">Transit to Your Doorstep®</span>
      </motion.div>
    </div>
  </div>
);

/* ── PAY visual ── */
const PayVisual = () => (
  <div className="relative w-full h-full min-h-[420px] flex items-center justify-center p-8">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
    </div>

    <div className="relative w-full max-w-xs space-y-4">
      {/* Card mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="relative h-44 rounded-3xl overflow-hidden border border-primary-500/30 shadow-2xl shadow-primary-500/10"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2200 50%, #1a1a1a 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.6) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute top-4 left-5 right-5 bottom-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-primary-400 font-bold text-sm tracking-widest">SCOOTY PAY</div>
            <CreditCard className="w-5 h-5 text-primary-500/60" />
          </div>
          <div>
            <div className="text-white/30 text-xs mb-1">Balance</div>
            <div className="text-white font-bold text-2xl font-display">$24.80</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-xs">•••• •••• •••• 4291</div>
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transaction rows */}
      {[
        { label: 'GO Train — Union to Brampton', amount: '-$4.20', time: 'Today 8:42 AM', icon: Bus },
        { label: 'SCOOTY Ride — 2.1 km', amount: '-$1.80', time: 'Today 8:30 AM', icon: Zap },
        { label: 'SCOOTY PAY Top-Up', amount: '+$25.00', time: 'Yesterday', icon: RefreshCw },
      ].map((tx, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
          className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3"
        >
          <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
            <tx.icon className="w-4 h-4 text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{tx.label}</div>
            <div className="text-gray-500 text-xs">{tx.time}</div>
          </div>
          <div className={`text-xs font-semibold flex-shrink-0 ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-gray-300'}`}>
            {tx.amount}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ── AI RideGuide visual ── */
const RideGuideVisual = () => (
  <div className="relative w-full h-full min-h-[420px] flex items-center justify-center p-8">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
    </div>

    <div className="relative w-full max-w-xs space-y-3">
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
        <div>
          <div className="text-white text-xs font-semibold">SCOOTY AI RideGuide</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-400 text-xs">Online</span>
          </div>
        </div>
      </motion.div>

      {/* Chat bubbles */}
      {[
        { from: 'user', text: "What's the fastest way to get to Brampton GO from here?", delay: 0.4 },
        { from: 'ai', text: "There's a SCOOTY 3 min away. Ride to Meadowvale Station, then take the 9:14 GO — arrives Brampton in 22 min. Want me to unlock a ride?", delay: 0.8 },
        { from: 'user', text: "Is there any service disruption today?", delay: 1.3 },
        { from: 'ai', text: "Minor delay on Line 1 Yonge — 4 min. Your route is unaffected. ✓", delay: 1.7 },
      ].map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: msg.delay, duration: 0.4 }}
          className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
            msg.from === 'user'
              ? 'bg-primary-500 text-black font-medium rounded-tr-sm'
              : 'bg-white/8 border border-white/10 text-gray-200 rounded-tl-sm'
          }`}>
            {msg.text}
          </div>
        </motion.div>
      ))}

      {/* Typing indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 2.3, duration: 1.2, repeat: Infinity }}
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

      {/* Route card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.5 }}
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
        {/* Video / photo bg */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1031698/pexels-photo-1031698.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-primary-500/15 border border-primary-500/30 rounded-full mb-6"
          >
            <span className="text-sm font-medium text-primary-400">Our Products</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl font-bold font-display text-white leading-tight mb-6"
          >
            Built for the <span className="text-primary-500">Future</span>
            <br />of Transit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            Three products. One platform. Connecting communities through on-demand mobility, seamless payments, and AI-powered transit intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => document.getElementById('on-demand')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-8 py-4 bg-primary-500 text-black rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/partners')}
              className="px-8 py-4 border border-white/20 text-white rounded-full font-medium hover:border-primary-500/60 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Become a Partner
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll nudge */}
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
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-500/3 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
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

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={s1InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-white/8 bg-white/3"
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <FirstLastKmDiagram />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT 2: SCOOTY PAY ── */}
      <section id="pay" ref={s2Ref} className="relative py-28 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-primary-500/3 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual — left on this row */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={s2InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-white/8 bg-white/3 order-2 lg:order-1"
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <PayVisual />
            </motion.div>

            {/* Text — right */}
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
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-500/3 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
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

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={s3InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-white/8 bg-white/3"
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <RideGuideVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="py-24 bg-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
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
