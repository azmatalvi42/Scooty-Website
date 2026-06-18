import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Shield,
  Heart,
  Handshake,
  Leaf,
  SlidersHorizontal,
  Building2,
  Briefcase,
  GraduationCap,
  Home,
  MapPin,
  CheckCircle,
  ArrowRight,
  Users,
  Zap,
  Eye,
  Bell,
  Gauge,
  Bike,
  Clock,
  Network,
  Star,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─────────────────────────────────────────── DATA ─── */

const coreValues = [
  {
    icon: Shield,
    title: 'Safety',
    color: 'from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-500/30',
    description:
      'Safety is the foundation of everything we do. From high-visibility vehicle design to advanced geofencing technology, SCOOTY prioritizes rider and community safety at every level.',
    features: [
      'High-contrast black-on-yellow visibility design',
      'Running lights and turn signals',
      'Double hand braking systems',
      'Concealed and protected cables',
      'Advanced geofencing and speed control technology',
    ],
    note: 'Our programs are guided by Vision Zero principles, helping cities build safer streets for everyone.',
  },
  {
    icon: Heart,
    title: 'Courtesy',
    color: 'from-orange-500/20 to-orange-500/5',
    border: 'border-orange-500/30',
    description:
      'Shared mobility only works when everyone respects the space around them. SCOOTY emphasizes courteous riding through rider education, community engagement, and thoughtful system design.',
    features: [
      'Rider onboarding education programs',
      'Community engagement initiatives',
      'Operational policies built for respect',
      'Pedestrian and cyclist priority',
    ],
    note: 'Our riders are encouraged to respect pedestrians, cyclists, and communities while using SCOOTY vehicles.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    color: 'from-primary-500/20 to-primary-500/5',
    border: 'border-primary-500/30',
    description:
      'Partnership is at the core of how we build mobility programs. We collaborate closely with municipalities, transit agencies, developers, universities, and local organizations.',
    features: [
      'Tailored solutions for each community',
      'Alignment with municipal strategies',
      'Integration with transportation plans',
      'Local insights with global best practices',
    ],
    note: 'By combining local insights with global best practices, we create programs that align with community goals.',
  },
];

const whatWeBring = [
  {
    icon: Leaf,
    title: 'Sustainable New Mobility',
    description:
      'SCOOTY integrates hardware, software, operations, and planning to deliver complete micromobility programs that are efficient, environmentally friendly, and community-focused. Our electric vehicles provide zero-emissions transportation options that reduce congestion while improving accessibility.',
  },
  {
    icon: Network,
    title: 'Connected Communities',
    description:
      "SCOOTY's team brings decades of combined experience in urban planning, civil engineering, transportation policy, mobility operations, and community development — allowing us to design mobility systems that strengthen community connectivity.",
  },
  {
    icon: SlidersHorizontal,
    title: 'Tailored Solutions',
    description:
      'No two communities are the same. We work closely with partners to understand their vision, policies, and transportation needs. Every SCOOTY deployment is customized to align with local infrastructure, transit networks, and development plans.',
  },
  {
    icon: Users,
    title: 'Partnership Beyond Words',
    description:
      'SCOOTY partnerships are built on collaboration. We engage stakeholders throughout planning and operations, ensuring programs evolve with community feedback and data insights.',
  },
];

const partnerSolutions = [
  {
    icon: Building2,
    title: 'Cities',
    subtitle: 'Municipal Programs',
    image: '/assets/Partners/brampton-partnership.webp',
    description:
      'Work with a Canadian mobility provider that understands how municipalities operate. SCOOTY collaborates closely with city teams to design programs aligned with transportation strategies, sustainability goals, and urban planning initiatives.',
    features: [
      'Program design and implementation',
      'Data insights and reporting',
      'Safety-focused fleet management',
      'Transit integration',
      'Community engagement programs',
    ],
    highlights: [
      { value: '4+', label: 'Active Cities', icon: Building2 },
      { value: '100%', label: 'Canadian', icon: Leaf },
    ] as { value: string; label: string; icon: LucideIcon }[],
  },
  {
    icon: Briefcase,
    title: 'Businesses',
    subtitle: 'Commercial Partners',
    image: '/assets/Partners/partners-carousel-business.webp',
    description:
      'Shared mobility can become a competitive advantage. By integrating micromobility into retail, commercial, and mixed-use developments, businesses can attract more visitors, improve accessibility, and enhance customer experiences.',
    features: [
      'Increase foot traffic',
      'Improve site accessibility',
      'Support sustainable development goals',
      'Attract tenants and customers',
    ],
    highlights: [
      { value: '↑', label: 'Foot Traffic', icon: TrendingUp },
      { value: 'TDM', label: 'Compliant', icon: CheckCircle },
    ] as { value: string; label: string; icon: LucideIcon }[],
  },
  {
    icon: GraduationCap,
    title: 'Transit',
    subtitle: 'Academic Programs',
    image: '/assets/Partners/transit.webp',
    description:
      'SCOOTY provides turnkey micromobility programs designed for academic environments. Our solutions combine vehicles, software, operations, and research opportunities that support campus mobility needs.',
    features: [
      'Turnkey vehicle and software programs',
      'Research collaboration opportunities',
      'Campus-wide operational support',
      'Next-generation mobility insights',
    ],
    highlights: [
      { value: 'Turnkey', label: 'Program', icon: Zap },
      { value: 'Research', label: 'Ready', icon: GraduationCap },
    ] as { value: string; label: string; icon: LucideIcon }[],
  },
  {
    icon: Home,
    title: 'Developers',
    subtitle: 'Real Estate & Development',
    image: '/assets/Partners/developers.webp',
    description:
      'Build communities designed for the future of transportation. SCOOTY helps developers create connected neighborhoods where residents can live, work, and move sustainably.',
    features: [
      'Transit-oriented developments',
      'Mixed-use community integration',
      'Residential connectivity programs',
      'Sustainable infrastructure support',
    ],
    highlights: [
      { value: 'Net Zero', label: 'Mobility', icon: Leaf },
      { value: 'Future', label: 'Ready', icon: Sparkles },
    ] as { value: string; label: string; icon: LucideIcon }[],
  },
];

const locations = [
  {
    city: 'Brampton',
    slug: 'brampton',
    launched: 'April 2023',
    status: 'active',
    vehicles: ['E-Scooters'],
    image: '/assets/Partners/cities-brampton.webp',
    highlights: [
      'Service area covering the entire city',
      'Riding on roads ≤ 50 km/h',
      'Slow-speed zones in parks and trails',
      'Transit network integration',
    ],
  },
  {
    city: 'Barrie',
    slug: 'barrie',
    launched: 'June 2024',
    status: 'active',
    vehicles: ['E-Bikes'],
    image: '/assets/Partners/cities-barrie.webp',
    highlights: [
      'Waterfront service area',
      'Riding permitted on local trails',
      'Rides start and end at Centennial Park',
    ],
  },
  {
    city: 'Markham',
    slug: 'markham',
    launched: 'August 2024',
    status: 'active',
    vehicles: ['E-Scooters', 'E-Bikes'],
    image: '/assets/Partners/cities-markham-2.webp',
    highlights: [
      'Riding on roads ≤ 50 km/h',
      'Designated parking zones',
      'Strong transit connectivity',
    ],
  },
  {
    city: 'Burlington',
    slug: 'burlington',
    launched: 'June 2025',
    status: 'active',
    vehicles: ['E-Scooters'],
    image: '/assets/Partners/cities-burlington.webp',
    highlights: [
      '7 km trail corridor',
      'Designated parking zones',
      'Integration with local transit',
    ],
  },
];

const safetyFeatures = [
  { icon: Eye, title: 'High-Visibility Livery', description: 'High-contrast black-on-yellow design ensures visibility in all conditions.' },
  { icon: Zap, title: 'Running Lights', description: 'Front and rear lights keep riders visible day and night.' },
  { icon: Bell, title: 'Turn Signals', description: 'Visual and audio turn signal alerts for safer navigation.' },
  { icon: Shield, title: 'Double Hand Brakes', description: 'Redundant braking systems for reliable stopping power.' },
  { icon: Gauge, title: 'Geofencing & Speed Control', description: 'Advanced technology enforces speed limits and safe zones.' },
  { icon: Bike, title: 'Swappable Batteries', description: 'Designed for operational efficiency and reduced vehicle downtime.' },
];

/* ─────────────────────────────────────────── PROUD PARTNERS ─── */

const proudPartners = [
  {
    name: 'City of Brampton',
    img: '/assets/Partners/Marquee/brampton.webp',
    abbr: 'BRM',
    tagline: 'Municipality Partner',
    accent: '#8B0000',
    bg: 'linear-gradient(135deg, rgba(139,0,0,0.12) 0%, rgba(139,0,0,0.04) 100%)',
    border: 'rgba(139,0,0,0.2)',
  },
  {
    name: 'City of Markham',
    img: '/assets/Partners/Marquee/markham-logo.webp',
    abbr: 'MKM',
    tagline: 'Municipality Partner',
    accent: '#00509E',
    bg: 'linear-gradient(135deg, rgba(0,80,158,0.12) 0%, rgba(0,80,158,0.04) 100%)',
    border: 'rgba(0,80,158,0.2)',
  },
  {
    name: 'Metrolinx',
    img: '/assets/Partners/Marquee/metrolinx-logo.webp',
    abbr: 'MLX',
    tagline: 'Transit Partner',
    accent: '#006E51',
    bg: 'linear-gradient(135deg, rgba(0,110,81,0.12) 0%, rgba(0,110,81,0.04) 100%)',
    border: 'rgba(0,110,81,0.2)',
  },
  {
    name: 'City of Barrie',
    img: '/assets/Partners/Marquee/barrie-logo.webp',
    abbr: 'BRR',
    tagline: 'Municipality Partner',
    accent: '#1A4A7A',
    bg: 'linear-gradient(135deg, rgba(26,74,122,0.12) 0%, rgba(26,74,122,0.04) 100%)',
    border: 'rgba(26,74,122,0.2)',
  },
  {
    name: 'City of Burlington',
    img: '/assets/Partners/Marquee/burlington-logo.webp',
    abbr: 'BRL',
    tagline: 'Municipality Partner',
    accent: '#006B3C',
    bg: 'linear-gradient(135deg, rgba(0,107,60,0.12) 0%, rgba(0,107,60,0.04) 100%)',
    border: 'rgba(0,107,60,0.2)',
  },
  {
    name: 'TMU',
    img: '/assets/Partners/Marquee/tmu-logo.webp',
    abbr: 'TMU',
    tagline: 'Academic Partner',
    accent: '#002B5C',
    bg: 'linear-gradient(135deg, rgba(0,43,92,0.12) 0%, rgba(0,43,92,0.04) 100%)',
    border: 'rgba(0,43,92,0.2)',
  },
  {
    name: 'Ontario Tech University',
    img: '/assets/Partners/Marquee/otu-logo.webp',
    abbr: 'OTU',
    tagline: 'Academic Partner',
    accent: '#2255A4',
    bg: 'linear-gradient(135deg, rgba(34,85,164,0.12) 0%, rgba(34,85,164,0.04) 100%)',
    border: 'rgba(34,85,164,0.2)',
  },
];

const ProudPartnersMarquee = () => {
  // Double the array for seamless infinite loop (CSS translateX -50%)
  const track = [...proudPartners, ...proudPartners];

  return (
    <section className="relative z-10 py-14 sm:py-20 bg-gray-50 dark:bg-black border-t border-gray-100 dark:border-white/[0.05] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
          Trusted By
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 dark:text-white tracking-tight">
          Our Proud <span className="text-[#FEC001]">Partners</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Working alongside leading municipalities, transit agencies, and academic institutions across Ontario.
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Left fade edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--fade-bg), transparent)' }}
        />
        {/* Right fade edge */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--fade-bg), transparent)' }}
        />

        {/* We use two wrapper divs — one for light mode, one for dark — to manage the fade colour */}
        <style>{`
          :root { --fade-bg: #F9FAFB; }
          .dark { --fade-bg: #000000; }
        `}</style>

        <div
          className="flex w-max animate-marquee"
          style={{ gap: '20px', paddingInline: '10px' }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {track.map((partner, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center gap-4 px-5 sm:px-6 py-4 sm:py-5 rounded-2xl border backdrop-blur-sm select-none"
              style={{
                background: partner.bg,
                borderColor: partner.border,
                minWidth: '220px',
              }}
            >
              {/* Logo */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0 overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight whitespace-nowrap">
                  {partner.name}
                </p>
                <p
                  className="text-[10px] sm:text-xs font-semibold mt-0.5 uppercase tracking-wider"
                  style={{ color: partner.accent, opacity: 0.8 }}
                >
                  {partner.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8 tracking-wide">
        🍁 &nbsp;Proud to serve communities across Ontario
      </p>
    </section>
  );
};

/* ─────────────────────────────────────────── COMPONENT ─── */

export const PartnersPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToTab = (index: number) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [bringRef, bringInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [locationsRef, locationsInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [safetyRef, safetyInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const current = partnerSolutions[activeTab];

  return (
    <div className="relative min-h-screen bg-white dark:bg-black">
      {/* ── HERO + TAB NAV ── */}
      <section className="relative z-10 overflow-hidden">
        {/* Background image */}
        <img
          src="/assets/Partners/partner-img.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-gray-50 dark:to-navy-900" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 to-transparent" />

        {/* Hero text */}
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-14">
          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-display leading-[1.05] tracking-tight mb-5 [filter:drop-shadow(0_2px_20px_rgba(0,0,0,0.9))]"
          >
            <span className="block text-white">Partner with</span>
            <span className="block text-[#FEC001] mt-2">SCOOTY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed mb-7 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]"
          >
            Building the future of mobility together.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              className="inline-flex items-center gap-3 px-7 py-4 bg-[#FEC001] text-black rounded-full font-bold text-base shadow-lg shadow-[#FEC001]/30 hover:bg-[#FFD00F] transition-colors"
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(254,192,1,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Become a Partner</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Tab nav — bottom of hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <div className="overflow-x-auto pb-1 flex justify-start sm:justify-center scrollbar-hide">
              <div className="inline-flex gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-lg shrink-0">
                {partnerSolutions.map((sol, index) => {
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
                      <sol.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="whitespace-nowrap text-[10px] sm:text-[11px] font-semibold leading-tight text-center">{sol.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TAB CARDS ── */}
      <section ref={contentRef} className="relative z-10 py-10 bg-gray-50 dark:bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => goToTab((activeTab - 1 + partnerSolutions.length) % partnerSolutions.length)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-navy-800 border border-yellow-500/30 shadow-md hover:bg-primary-500 hover:border-primary-500 hover:text-black text-gray-600 dark:text-gray-300 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right arrow */}
            <button
              onClick={() => goToTab((activeTab + 1) % partnerSolutions.length)}
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
                        {current.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-sm">
                        {current.description}
                      </p>

                      {/* Features */}
                      <motion.div
                        className="flex flex-col gap-2 mb-7"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                        }}
                      >
                        {current.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            variants={{
                              hidden: { opacity: 0, x: -12 },
                              show: { opacity: 1, x: 0 },
                            }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ x: 3 }}
                            className="flex items-center gap-3 py-1 group cursor-default"
                          >
                            <span className="w-5 h-5 rounded-full bg-primary-500 text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{feature}</span>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Stats row */}
                      <motion.div
                        className="flex gap-3 mb-7 flex-wrap"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
                        }}
                      >
                        {current.highlights.map((h, i) => {
                          const HighlightIcon = h.icon;
                          return (
                            <motion.div
                              key={i}
                              variants={{
                                hidden: { opacity: 0, y: 12, scale: 0.94 },
                                show: { opacity: 1, y: 0, scale: 1 },
                              }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              whileHover={{ y: -3, scale: 1.03 }}
                              className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-navy-700/50 border border-yellow-500 dark:border-navy-600/60 backdrop-blur-sm text-center min-w-[110px] min-h-[92px] flex flex-col items-center justify-center gap-1 cursor-default hover:shadow-lg hover:shadow-primary-500/20 transition-shadow"
                            >
                              {HighlightIcon && <HighlightIcon className="w-5 h-5 text-primary-500" />}
                              <div className="text-sm font-black font-display text-primary-500 leading-tight whitespace-nowrap">{h.value}</div>
                              {h.label && (
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{h.label}</div>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>

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
                        alt={current.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-yellow-950/30 lg:via-transparent lg:to-transparent" />
                      {/* Label pill */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/55 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15">
                        <current.icon className="w-3 h-3 text-primary-400" />
                        {current.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-5">
                  {partnerSolutions.map((_, index) => (
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

      {/* ── OUR PROUD PARTNERS ── */}
      <ProudPartnersMarquee />

      {/* ── CORE VALUES ── */}
      <section ref={valuesRef} className="relative z-10 py-24 bg-white dark:bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
              <Star className="w-3.5 h-3.5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Our Foundation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Our Core <span className="text-primary-500">Values</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide every partnership, every deployment, and every ride.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className={`relative bg-gradient-to-b ${value.color} border ${value.border} rounded-3xl p-8 flex flex-col hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 group`}
              >
                <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {value.description}
                </p>
                <ul className="space-y-2.5 flex-1">
                  {value.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start space-x-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feat}</span>
                    </li>
                  ))}
                </ul>
                {value.note && (
                  <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">
                      {value.note}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE BRING ── */}
      <section ref={bringRef} className="relative z-10 py-24 bg-gray-50 dark:bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={bringInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Our Advantage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              What We <span className="text-primary-500">Bring</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              More than vehicles — a complete mobility program built for your community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatWeBring.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={bringInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="bg-white dark:bg-navy-800 rounded-3xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-primary-500 group-hover:text-black transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRENT LOCATIONS ── */}
      <section ref={locationsRef} className="relative z-10 py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.6) 1px, transparent 1px)',
            backgroundSize: '100% 80px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={locationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-4">
              <MapPin className="w-3.5 h-3.5 text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-400">Ontario, Canada</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Current <span className="text-primary-500">Locations</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We take pride in serving the communities that raised us — with more on the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {locations.map((loc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={locationsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer"
              >
                <img
                  src={loc.image}
                  alt={loc.city}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 group-hover:via-black/60 transition-all duration-300" />

                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-40" />
                    <div className="relative w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/40">
                      <MapPin className="w-4 h-4 text-black fill-black" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary-400 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ontario, CA
                  </span>
                </div>

                <div className="absolute top-5 right-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="overflow-hidden max-h-0 group-hover:max-h-28 transition-all duration-500 ease-in-out mb-0 group-hover:mb-3">
                    <ul className="space-y-1">
                      {loc.highlights.slice(0, 3).map((h, hi) => (
                        <li key={hi} className="flex items-center gap-2 text-xs text-gray-300">
                          <span className="w-1 h-1 rounded-full bg-primary-500 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold font-display text-white leading-tight">
                        {loc.city}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Since {loc.launched}</span>
                        <span className="text-gray-600 mx-1">·</span>
                        {loc.vehicles.map((v, vi) => (
                          <span
                            key={vi}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-primary-500/15 text-primary-400 rounded-full border border-primary-500/20"
                          >
                            <Bike className="w-2.5 h-2.5" />
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link to={`/partners/${loc.slug}`}>
                      <motion.div
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:bg-primary-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRight className="w-4 h-4 text-black" />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={locationsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-xs text-gray-400 font-medium">More cities coming soon</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>
        </div>
      </section>

      {/* ── SAFETY & OPERATIONS ── */}
      <section ref={safetyRef} className="relative z-10 py-24 bg-white dark:bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={safetyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <Shield className="w-3.5 h-3.5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Built-In Safety</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-6">
                Safety &amp; <span className="text-primary-500">Operations</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Safety is built into every SCOOTY program. Our vehicles are designed with
                industry-leading safety features that protect riders and communities.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                But safe micromobility requires more than safe vehicles. SCOOTY promotes rider
                education, courteous riding, and partnerships with research institutions and
                transportation organizations to continuously improve safety standards.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                We also work closely with government agencies and transit partners to improve
                micromobility policies and regulations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safetyFeatures.map((feat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={safetyInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300">
                    <feat.icon className="w-5 h-5 text-primary-500 group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{feat.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{feat.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 bg-primary-500 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <motion.div
          className="absolute top-10 left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold font-display text-black mb-4 leading-tight">
              Build the Future of Mobility With SCOOTY
            </h2>
            <p className="text-black/70 text-xl mb-4 max-w-2xl mx-auto">
              Cities around the world are investing in micromobility to improve accessibility,
              reduce congestion, and build more sustainable communities.
            </p>
            <p className="text-black/60 text-base mb-10">
              SCOOTY helps partners design and deliver these programs locally.
              Let's build the future of mobility together.
            </p>
            <motion.button
              className="group px-12 py-5 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-900 transition-colors flex items-center justify-center mx-auto space-x-3 shadow-xl"
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
