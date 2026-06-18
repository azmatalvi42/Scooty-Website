import { motion } from 'framer-motion';
import { Zap, CreditCard, Compass, ArrowRight } from 'lucide-react';
import { HeroOverCity } from '../components/hero/HeroVariants';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stats = [
  { value: '5+', label: 'Cities live' },
  { value: '3', label: 'Smart products' },
  { value: '24/7', label: 'Always moving' },
  { value: '100%', label: 'Canadian' },
];

const products = [
  {
    icon: Zap,
    title: 'Ride',
    line: 'On-demand e-scooters waiting at every transit stop.',
  },
  {
    icon: CreditCard,
    title: 'Pay',
    line: 'One tap from bus to scooter with SCOOTY PAY.',
  },
  {
    icon: Compass,
    title: 'Navigate',
    line: 'AI RideGuide plans your whole door-to-door trip.',
  },
];

/* ── Stats — solid brand-yellow band ──────────────────────────── */
const StatsBand = () => (
  <section className="bg-[#FEC001]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          className="text-center"
        >
          <div className="text-5xl sm:text-6xl font-bold font-display text-black tracking-tight">{s.value}</div>
          <div className="mt-2 text-sm font-semibold text-black/60 uppercase tracking-wider">{s.label}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ── What we do — solid ink section ───────────────────────────── */
const WhatWeDo = () => (
  <section className="bg-[#15171C]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-4xl sm:text-6xl font-bold font-display text-white tracking-tight max-w-2xl leading-[1.02]"
      >
        Three apps. <span className="text-[#FEC001]">One smooth ride.</span>
      </motion.h2>

      <div className="mt-16 grid md:grid-cols-3 gap-5">
        {products.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-[#FEC001]/40 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FEC001] flex items-center justify-center mb-6">
              <p.icon className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">{p.title}</h3>
            <p className="text-white/55 leading-relaxed">{p.line}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Living city — transparent, reveals the NetworkCanvas ─────── */
const LivingCity = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#15171C] via-transparent to-[#15171C] pointer-events-none" />
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative z-10 text-center px-6 max-w-3xl"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-wide mb-6 border border-white/15">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FEC001] animate-pulse" />
        Live network
      </span>
      <h2 className="text-4xl sm:text-6xl font-bold font-display text-white tracking-tight leading-[1.02]">
        Built for how cities <span className="text-[#FEC001]">actually move.</span>
      </h2>
      <p className="mt-6 text-lg text-white/65 max-w-xl mx-auto">
        Every scooter, every stop, every trip — moving together in real time.
      </p>
    </motion.div>
  </section>
);

/* ── CTA — solid brand band ───────────────────────────────────── */
const CtaBand = () => (
  <section className="bg-[#FEC001]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <h2 className="text-5xl sm:text-7xl font-bold font-display text-black tracking-tight leading-[0.98]">
          Ready to ride?
        </h2>
        <p className="mt-5 text-lg text-black/70 max-w-md mx-auto">
          Download SCOOTY and move your city forward today.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a href="#" className="inline-flex"><img src="/icons/appstore-icon.png" alt="Download on the App Store" className="h-12 w-auto" /></a>
          <a href="#" className="inline-flex"><img src="/icons/playstore-icon.png" alt="Get it on Google Play" className="h-12 w-auto" /></a>
          <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-black/20 text-black font-bold hover:border-black/50 transition-colors">
            For cities <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export const HomePage = () => (
  <>
    <HeroOverCity />
    <StatsBand />
    <WhatWeDo />
    <LivingCity />
    <CtaBand />
  </>
);
