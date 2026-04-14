import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Heart,
  Globe,
  Zap,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  ExternalLink,
  Users,
  Flag,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

/* ─── Tab config ──────────────────────────────────────────────────────────── */

const TABS = [
  {
    icon: Users,
    label: 'Who We Are',
    slug: 'who-we-are',
    subtitle: 'Our story',
    description:
      'SCOOTY is a Canadian mobility company delivering safe, sustainable, and intelligent transportation solutions to cities, campuses, businesses, and communities across Ontario.',
    features: [
      'On-Demand Mobility platform',
      'SCOOTY PAY integrated payments',
      'AI RideGuide commuter assistant',
      'Active in 5+ Ontario cities',
    ],
    highlights: [
      { value: '2023', label: 'Founded' },
      { value: '100%', label: 'Canadian' },
    ],
    image: '/assets/mainPage/QuotesImages/DSC_1837.jpg',
  },
  {
    icon: Zap,
    label: 'Our Mission',
    slug: 'our-mission',
    subtitle: 'Why we exist',
    description:
      'We believe every person deserves a reliable, connected way to get where they\'re going — regardless of where they live or how far they are from a transit stop.',
    features: [
      'Close the first-and-last-km gap',
      'Connect communities to regional transit',
      'Serve people first, technology second',
      'Modernize public transit across Canada',
    ],
    highlights: [
      { value: '3', label: 'Core Products' },
      { value: '5+', label: 'Cities Served' },
    ],
    image: '/assets/mainPage/QuotesImages/2024MarkhamOVINScootyDemo-048.jpg',
  },
  {
    icon: Flag,
    label: 'Made in Canada',
    slug: 'made-in-canada',
    subtitle: 'Proudly Canadian',
    description:
      'SCOOTY was founded in Ontario with a simple belief: Canadians deserve world-class mobility technology built right here at home — by a team that understands our cities, winters, and communities.',
    features: [
      'Headquartered in Brampton, Ontario',
      'Built for Canadian winters & cities',
      'Expanding to cities across the country',
      'Partnering with Canadian transit agencies',
    ],
    highlights: [
      { value: 'Ontario', label: 'Home Base' },
      { value: 'Canada', label: 'Born & Built' },
    ],
    image: '/assets/mainPage/QuotesImages/City Hall Group Shot - Brampton Launch Photo (2).JPG',
  },
  {
    icon: Globe,
    label: 'Follow Us',
    slug: 'follow-us',
    subtitle: 'Stay connected',
    description:
      'Stay connected with SCOOTY — real stories, city launches, and the future of transit, live from our community across every platform.',
    features: [
      'Instagram: @scootymobility',
      'LinkedIn: SCOOTY Inc.',
      'X / Twitter: @scootymobility',
      'Facebook: SCOOTY',
      'YouTube: SCOOTY Mobility',
    ],
    highlights: [
      { value: '5', label: 'Platforms' },
      { value: 'Daily', label: 'Updates' },
    ],
    image: '/assets/Partners/brampton-partnership.JPG',
  },
];

/* ─── Data ────────────────────────────────────────────────────────────────── */

const missions = [
  {
    icon: Zap,
    title: 'Close the Gap',
    description: 'Bridging the first-and-last-km gap between regional transit and the communities it serves — making public transit a true door-to-door experience.',
  },
  {
    icon: Globe,
    title: 'Connect Communities',
    description: 'Building a more connected Ontario by giving people better tools to move, pay, and navigate — all through a single unified mobility platform.',
  },
  {
    icon: Heart,
    title: 'Serve People First',
    description: 'Every product we build starts with the rider. We exist to reduce friction, improve reliability, and make daily transit more human.',
  },
];

const socials = [
  {
    icon: Instagram,
    name: 'Instagram',
    handle: '@scootymobility',
    description: 'Behind-the-scenes, city launches, and rider stories.',
    color: 'from-fuchsia-500/15 to-orange-500/15',
    border: 'border-fuchsia-500/20 hover:border-fuchsia-500/50',
    iconColor: 'text-fuchsia-400',
    href: '#',
  },
  {
    icon: Linkedin,
    name: 'LinkedIn',
    handle: 'SCOOTY Inc.',
    description: 'Company news, partnerships, and career opportunities.',
    color: 'from-blue-500/15 to-blue-600/15',
    border: 'border-blue-500/20 hover:border-blue-500/50',
    iconColor: 'text-blue-400',
    href: '#',
  },
  {
    icon: Twitter,
    name: 'X / Twitter',
    handle: '@scootymobility',
    description: 'Real-time updates, transit news, and community chat.',
    color: 'from-gray-500/15 to-gray-400/15',
    border: 'border-gray-500/20 hover:border-gray-400/40',
    iconColor: 'text-gray-300',
    href: '#',
  },
  {
    icon: Facebook,
    name: 'Facebook',
    handle: 'SCOOTY',
    description: 'City-specific pages, events, and community groups.',
    color: 'from-blue-600/15 to-indigo-600/15',
    border: 'border-blue-600/20 hover:border-blue-600/50',
    iconColor: 'text-blue-500',
    href: '#',
  },
  {
    icon: Youtube,
    name: 'YouTube',
    handle: 'SCOOTY Mobility',
    description: 'Product walkthroughs, city spotlights, and tutorials.',
    color: 'from-red-500/15 to-red-600/15',
    border: 'border-red-500/20 hover:border-red-500/50',
    iconColor: 'text-red-400',
    href: '#',
  },
];

const MapleLeaf = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 L56 30 L80 18 L68 40 L95 42 L75 56 L82 80 L60 68 L58 95 L50 75 L42 95 L40 68 L18 80 L25 56 L5 42 L32 40 L20 18 L44 30 Z" />
  </svg>
);

/* ─── Page ────────────────────────────────────────────────────────────────── */

export const AboutPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToTab = (index: number) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [canadaRef, canadaInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [socialsRef, socialsInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const current = TABS[activeTab];

  return (
    <div className="min-h-screen bg-white dark:bg-black">

      {/* ── HERO + TAB NAV ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8a/The_Game_%28Unsplash%29.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {/* Overlay — very light tint so the drone shot stays vivid */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-gray-50 dark:to-navy-900" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Hero text */}
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-14">
          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-display leading-[1.05] tracking-tight mb-5 [filter:drop-shadow(0_2px_20px_rgba(0,0,0,0.9))]"
          >
            <span className="block text-white">Built in Canada.</span>
            <span className="block text-[#FEC001] mt-2">For Every Community.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]"
          >
            A Canadian mobility company on a mission to modernize public transit — one community at a time.
          </motion.p>
        </div>

        {/* Tab nav */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <div className="overflow-x-auto pb-1 flex justify-start sm:justify-center scrollbar-hide">
              <div className="inline-flex gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-lg shrink-0">
                {TABS.map((tab, index) => {
                  const isActive = index === activeTab;
                  return (
                    <button
                      key={index}
                      onClick={() => goToTab(index)}
                      className={`relative flex flex-col items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 min-w-[64px] sm:min-w-[76px] ${
                        isActive
                          ? 'bg-primary-500 text-black shadow-md shadow-primary-500/40'
                          : 'text-white/70 hover:text-white hover:bg-white/15'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="whitespace-nowrap text-[10px] sm:text-[11px] font-semibold leading-tight text-center">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TAB CARDS ── */}
      <section ref={contentRef} className="py-10 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => goToTab((activeTab - 1 + TABS.length) % TABS.length)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-navy-800 border border-yellow-500/30 shadow-md hover:bg-primary-500 hover:border-primary-500 hover:text-black text-gray-600 dark:text-gray-300 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right arrow */}
            <button
              onClick={() => goToTab((activeTab + 1) % TABS.length)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-navy-800 border border-yellow-500/30 shadow-md hover:bg-primary-500 hover:border-primary-500 hover:text-black text-gray-600 dark:text-gray-300 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent border border-yellow-500/25 rounded-3xl shadow-lg">
                  {/* Top accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500/30" />

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px]">
                    {/* Left — Text */}
                    <div className="p-7 sm:p-9 lg:p-12 flex flex-col justify-center">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 w-fit bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400">
                        <current.icon className="w-3 h-3" />
                        {current.subtitle}
                      </div>

                      <h3 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 dark:text-white mb-3">
                        {current.label}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-sm">
                        {current.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-col gap-2 mb-7">
                        {current.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 py-1">
                            <span className="w-5 h-5 rounded-full bg-primary-500 text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="flex gap-3 mb-7 flex-wrap">
                        {current.highlights.map((h, i) => (
                          <div key={i} className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-navy-700/50 border border-yellow-500 dark:border-navy-600/60 backdrop-blur-sm text-center min-w-[100px]">
                            <div className="text-base font-black font-display text-primary-500 leading-none">{h.value}</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{h.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div>
                        <motion.button
                          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-black rounded-full text-sm font-semibold hover:bg-primary-400 transition-all duration-300 w-fit shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/35"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Right — Image */}
                    <div className="relative overflow-hidden min-h-[240px] sm:min-h-[300px] lg:min-h-0 rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl">
                      <img
                        src={current.image}
                        alt={current.label}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-yellow-950/30 lg:via-transparent lg:to-transparent" />
                      {/* Label pill */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/55 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15">
                        <current.icon className="w-3 h-3 text-primary-400" />
                        {current.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-5">
                  {TABS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTab(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeTab
                          ? 'w-8 bg-primary-500'
                          : 'w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ── */}
      <section ref={missionRef} className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Our Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-10">
              Moving People,{' '}
              <span className="text-primary-500">Connecting Communities</span>
            </h2>

            {/* Pull quote */}
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute -top-4 -left-2 text-8xl text-primary-500/20 font-serif leading-none select-none">"</div>
              <p className="relative text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed italic px-8">
                We believe every person deserves a reliable, connected way to get where they're going — regardless of where they live or how far they are from a transit stop.
              </p>
              <div className="absolute -bottom-8 -right-2 text-8xl text-primary-500/20 font-serif leading-none select-none rotate-180">"</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {missions.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300">
                  <m.icon className="w-6 h-6 text-primary-500 group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-3">{m.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{m.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MADE IN CANADA ── */}
      <section ref={canadaRef} className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={canadaInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 120 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl scale-150" />
              <MapleLeaf className="relative w-20 h-20 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6"
          >
            <span className="text-sm font-semibold text-red-400 tracking-wide uppercase">Proudly Canadian</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl md:text-6xl font-bold font-display text-white mb-6 leading-tight"
          >
            Made in <span className="text-red-500">Canada</span>.<br />
            Built for <span className="text-primary-500">Every Community</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            SCOOTY was founded in Ontario with a simple belief: Canadians deserve world-class mobility technology built right here at home — by a team that understands our cities, our winters, and our communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={canadaInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center mx-auto w-48 h-8 rounded-lg overflow-hidden mb-12 shadow-lg"
          >
            <div className="w-1/4 h-full bg-red-600" />
            <div className="w-1/2 h-full bg-white flex items-center justify-center">
              <MapleLeaf className="w-5 h-5 text-red-600" />
            </div>
            <div className="w-1/4 h-full bg-red-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {['Founded in Ontario', 'Brampton HQ', 'Serving 5+ Cities', 'Expanding Nationwide'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SOCIALS ── */}
      <section ref={socialsRef} className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={socialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Follow the <span className="text-primary-500">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay connected with SCOOTY — real stories, city launches, and the future of transit, live from our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={socialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`group relative bg-gradient-to-br ${social.color} border ${social.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl flex flex-col gap-4 cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-black/20 flex items-center justify-center">
                    <social.icon className={`w-6 h-6 ${social.iconColor}`} />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{social.name}</div>
                  <div className={`text-sm font-semibold ${social.iconColor} mb-2`}>{social.handle}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{social.description}</p>
                </div>
                <div className={`text-xs font-semibold ${social.iconColor} flex items-center gap-1 mt-auto`}>
                  <span>Follow us</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
