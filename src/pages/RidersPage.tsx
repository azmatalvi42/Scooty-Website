import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Navigation,
  MapPin,
  ParkingSquare,
  Shield,
  Bike,
  ArrowRight,
  HardHat,
  ChevronLeft,
  ChevronRight,
  Check,
  Route,
  Gauge,
  Satellite,
  Timer,
  UserCheck,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Tab config ───────────────────────────────────────────────────────────────

type Highlight = { value: string; label: string; icon?: LucideIcon };
type RiderTab = {
  icon: LucideIcon;
  label: string;
  slug: string;
  subtitle: string;
  description: string;
  features: string[];
  featureColors?: string[];
  bulleted?: boolean;
  highlights: Highlight[];
  image: string;
};

const TABS: RiderTab[] = [
  {
    icon: Rocket,
    label: 'Getting Started',
    slug: 'getting-started',
    subtitle: 'Start your first ride',
    description: 'Download the app, create an account, and unlock your first SCOOTY ride within seconds.',
    features: ['Download App', 'Create Account', 'Find Vehicles', 'Scan & Ride'],
    highlights: [
      { value: '2 min', label: 'Setup time', icon: Timer },
      { value: '16+', label: 'Age required', icon: UserCheck },
    ],
    image: "/assets/Riders/Carousel/riders-carousel.gif"
  },
  {
    icon: Navigation,
    label: 'How to Ride',
    slug: 'how-to-ride',
    subtitle: 'Learn the basics',
    description: 'Scan, unlock, and ride. Follow our simple steps to get moving safely.',
    features: ['Scan QR Code', 'Put on Helmet', 'Follow Safety Rules'],
    highlights: [
      { value: '5', label: 'Easy Steps', icon: ListChecks },
      { value: 'Beginner', label: 'Friendly', icon: Sparkles },
    ],
    image: '/assets/Riders/Carousel/riders-carousel-ride.png',
  },
  {
    icon: MapPin,
    label: 'Where to Ride',
    slug: 'where-to-ride',
    subtitle: 'Know your zones',
    description: 'Check the map in the SCOOTY app and know the different speed control riding and parking zones.',
    features: ['Clear = 20 km/h', 'Yellow = 15 km/h', 'Red = 0 km/h', 'Blue = Designated Parking', 'Purple = Mandatory Parking'],
    featureColors: [
      'bg-gray-100/60 border-gray-300/60 text-gray-700',
      'bg-yellow-400/30 border-yellow-500/50 text-yellow-700 dark:text-yellow-400',
      'bg-red-500/25 border-red-500/50 text-red-600 dark:text-red-400',
      'bg-blue-500/25 border-blue-500/50 text-blue-600 dark:text-blue-400',
      'bg-purple-600/25 border-purple-600/50 text-purple-600 dark:text-purple-400',
    ],
    highlights: [
      { value: '20 km/h', label: 'Max speed', icon: Gauge },
    ],
    image: '/assets/Riders/Carousel/riders-carousel-map.png',
  },
  {
    icon: ParkingSquare,
    label: 'Park Like a Pro',
    slug: 'parking',
    subtitle: 'Park responsibly',
    description: 'Be smart, ride safely, park in 3 easy steps. ',
    features: ['Find a Parking Zone', 'Park Vehicle Upright', 'Take a Photo'],
    highlights: [
      { value: 'Free Parking', label: 'At Designated Zones', icon: ParkingSquare },
    ],
    image: '/assets/Riders/Carousel/riders-carousel-parking.png',
  },
  {
    icon: Shield,
    label: 'Safety',
    slug: 'safety',
    subtitle: 'Ride safely',
    description: 'Be smart, ride safe, follow the rules',
    features: [
      '16+ min. Age requirement',
      'Wear a helmet at all times',
      'No sidewalk riding',
      'One rider per vehicle',
      'No riding under the influence',
      'Follow local riding rules',
    ],
    highlights: [],
    image: '/assets/Riders/Carousel/riders-carousel-safety.png',
  },
  {
    icon: Bike,
    label: 'Micromobility Vehicles',
    slug: 'vehicles',
    subtitle: 'Our fleet',
    description: 'Choose between e-scooters and e-bikes, both equipped with the latest tech.',
    bulleted: true,
    features: [
      'Up to 20 KM/H top speed',
      'Up to 70 KMs E-Scooter range distance',
      'Up to 100 KMs E-Bike range distance',
      'Fast wireless phone charger',
      'Front & Rear brakes',
      'Dual shock suspension',
      'Anti-slip foot grip pad',
      'Turn signals',
      'High visibility reflective vinyl wrap',
      'High visibility LED light',
      'High visibility day-time LED headlight',
    ],
    highlights: [
      { value: '100 KM', label: 'range distance', icon: Route },
      { value: '20 KM/H', label: 'Top speed', icon: Gauge },
      { value: 'GPS tracked', label: '', icon: Satellite },
    ],
    image: '/assets/Riders/Carousel/riders-carousel-vehicles.png',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export const RidersPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToTab = (index: number) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const current = TABS[activeTab];
  const isGettingStarted = current.slug === 'getting-started';
  const showHelmet = isGettingStarted || current.slug === 'how-to-ride' || current.slug === 'where-to-ride';

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero + Tab nav — share one background image */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="/assets/Riders/riders-page-hero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {/* Overlay — light tint so the image stays vivid */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-gray-50 dark:to-navy-900" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Hero text — evenly spaced with pt-10 rhythm between nav, paragraph, download text, and store icons */}
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-10">
          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.75rem, 7vw, 5.5rem)' }}
            className="whitespace-nowrap font-bold font-display leading-[1.05] tracking-tight [filter:drop-shadow(0_2px_20px_rgba(0,0,0,0.9))]"
          >
            <span className="text-white">Your City,{'  '}</span>
            <span className="text-[#FEC001]">Your Ride</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed pt-10 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]"
          >
            Hop on a SCOOTY e-scooter or e-bike and ride through the city.
          </motion.p>

          {/* Download CTA — yellow pill button with App Store + Play Store icons inline (original-style layout) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-10 flex flex-col items-center"
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-4 px-7 py-4 bg-[#FEC001] text-black rounded-full font-bold text-base shadow-lg shadow-[#FEC001]/30 hover:bg-[#FFD00F] transition-colors"
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(254,192,1,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Download to start riding</span>
              <span className="flex items-center gap-2 border-l border-black/20 pl-4">
                <img
                  src="/icons/appstore-icon.png"
                  alt="App Store"
                  className="h-6 sm:h-7 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
                  loading="eager"
                  decoding="async"
                />
                <img
                  src="/icons/playstore-icon.png"
                  alt="Google Play"
                  className="h-6 sm:h-7 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
                  loading="eager"
                  decoding="async"
                />
              </span>
            </motion.a>

            <p className="text-sm text-white/70 mt-4 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]">
              Available on iOS &amp; Android
            </p>
          </motion.div>
        </div>

        {/* Tab nav — bottom of hero, over the fading overlay */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65 }}
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

      {/* Tab cards */}
      <section ref={contentRef} className="py-10 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Card + arrows */}
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
                    <motion.div
                      className={`flex flex-col gap-2 mb-7 ${current.bulleted ? 'sm:grid sm:grid-cols-2 sm:gap-x-6' : ''}`}
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                      }}
                    >
                      {current.features.map((feature, i) => {
                        const colors = current.featureColors?.[i];
                        const bulleted = current.bulleted;
                        const rowVariants = {
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0 },
                        };
                        if (colors) {
                          return (
                            <motion.div
                              key={i}
                              variants={rowVariants}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-center gap-3 py-1"
                            >
                              <span className={`inline-flex items-center justify-center w-20 py-1 rounded-full border text-xs font-bold whitespace-nowrap flex-shrink-0 ${colors}`}>
                                {feature.split('=')[0].trim()}
                              </span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {feature.split('=')[1].trim()}
                              </span>
                            </motion.div>
                          );
                        }
                        if (bulleted) {
                          return (
                            <motion.div
                              key={i}
                              variants={rowVariants}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-center gap-3 py-1"
                            >
                              <span className="w-5 h-5 rounded-full bg-primary-500/15 border border-primary-500/40 text-primary-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3" />
                              </span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{feature}</span>
                            </motion.div>
                          );
                        }
                        return (
                          <motion.div
                            key={i}
                            variants={rowVariants}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ x: 3 }}
                            className="flex items-center gap-3 py-1 group cursor-default"
                          >
                            <span className="w-5 h-5 rounded-full bg-primary-500 text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{feature}</span>
                          </motion.div>
                        );
                      })}
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
                      {showHelmet && (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 12, scale: 0.94 },
                            show: { opacity: 1, y: 0, scale: 1 },
                          }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ y: -3, scale: 1.03 }}
                          className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-navy-700/50 border border-yellow-500 dark:border-navy-600/60 backdrop-blur-sm text-center min-w-[110px] min-h-[92px] flex flex-col items-center justify-center gap-1 cursor-default hover:shadow-lg hover:shadow-primary-500/20 transition-shadow"
                        >
                          <HardHat className="w-5 h-5 text-primary-500" />
                          <div className="text-sm font-black font-display text-primary-500 leading-tight whitespace-nowrap">Required</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">Helmet</div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* CTA */}
                    <div>
                      <Link
                        to={`/riders/${current.slug}`}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-black rounded-full text-sm font-semibold hover:bg-primary-400 transition-all duration-300 w-fit shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/35"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/*
                    Right — Image
                    Recommended carousel image dimensions: 1200×1200px (1:1 square),
                    or 1200×900px (4:3) with subject centered. The column is portrait
                    on desktop (~420×600) and landscape on mobile (~375×240), and uses
                    object-cover — a centered subject in a square source avoids awkward
                    crops at any breakpoint. Export PNG/WebP at ~150–250 KB.
                  */}
                  <div className="relative overflow-hidden min-h-[240px] sm:min-h-[300px] lg:min-h-0 rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl">
                    {current.slug === 'where-to-ride' ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/25 via-yellow-500/10 to-transparent flex flex-col items-center justify-center p-8 text-center">
                        <div
                          className="absolute inset-0 opacity-[0.08]"
                          style={{
                            backgroundImage:
                              'linear-gradient(rgba(254,192,1,1) 1px, transparent 1px), linear-gradient(90deg, rgba(254,192,1,1) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                          }}
                        />
                        <div className="relative w-16 h-16 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center mb-4">
                          <MapPin className="w-8 h-8 text-primary-500" />
                        </div>
                        <p className="relative text-base font-bold font-display text-gray-800 dark:text-white">
                          Riding Zone Map
                        </p>
                        <p className="relative text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[260px]">
                          Live map coming soon. Check the SCOOTY app for current zones.
                        </p>
                      </div>
                    ) : (
                      <>
                        <img
                          src={current.image}
                          alt={current.label}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Gradient blends into card on desktop */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-yellow-950/30 lg:via-transparent lg:to-transparent" />
                      </>
                    )}
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
    </div>
  );
};
