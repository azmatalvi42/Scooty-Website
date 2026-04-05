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
  Apple,
  Play,
  ArrowRight,
  HardHat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  {
    icon: Rocket,
    label: 'Getting Started',
    slug: 'getting-started',
    subtitle: 'Start your first ride',
    description: 'Download the app, create an account, and unlock your first SCOOTY ride within seconds.',
    features: ['Download App', 'Create Account', 'Find Vehicles', 'Scan & Ride'],
    highlights: [
      { value: '2 min', label: 'Setup time' },
      { value: '16+', label: 'Age required' },
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
      { value: '5', label: 'Easy Steps' },
      { value: 'Beginner', label: 'Friendly' },
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
      { value: '20 km/h', label: 'Max speed' },
    ],
    image: '/assets/Riders/Carousel/riders-carousel-map.png',
  },
  {
    icon: ParkingSquare,
    label: 'Park Like a Pro',
    slug: 'parking',
    subtitle: 'Park responsibly',
    description: 'Be smart, ride safely, park in 3 easy steps. ',
    features: ['Find Zones', 'Park Upright', 'Take Photo'],
    highlights: [
      { value: 'Free Parking', label: 'At Designated Zones' },
    ],
    image: '/assets/Riders/Carousel/riders-carousel-parking.png',
  },
  {
    icon: Shield,
    label: 'Safety',
    slug: 'safety',
    subtitle: 'Ride safely',
    description: 'Wear a helmet, follow traffic rules, and never ride on sidewalks.',
    features: ['Wear Helmet', 'Follow Rules', 'Single Rider', 'Stay Alert'],
    highlights: [
      { value: '100%', label: 'Helmet rate goal' },
      { value: '0', label: 'Sidewalk riding' },
    ],
    image: '/assets/Riders/Carousel/riders-carousel-safety.png',
  },
  {
    icon: Bike,
    label: 'Vehicles',
    slug: 'vehicles',
    subtitle: 'Our fleet',
    description: 'Choose between e-scooters and e-bikes, both equipped with the latest tech.',
    features: ['E-Scooters', 'E-Bikes', 'GPS Enabled', 'Smart Lock'],
    highlights: [
      { value: '2', label: 'Vehicle types' },
      { value: '20 km/h', label: 'Top speed' },
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
        {/* Overlay fades to section bg at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-gray-50 dark:to-navy-900" />

        {/* Hero text */}
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-primary-500/20 border border-primary-500/40 rounded-full mb-6"
          >
            <span className="text-sm font-medium text-primary-400">For Riders</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
          >
            <span className="block text-white">Your City,</span>
            <span className="block text-primary-500 mt-2">Your Ride</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-200 mb-10"
          >
            Hop on a SCOOTY e-scooter or e-bike and ride through the city.
          </motion.p>

          {/* Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-4 px-6 py-5 bg-primary-500 text-black rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:bg-primary-400 transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Download to start riding</span>
              <span className="flex items-center gap-2 border-l border-black/20 pl-4">
                <Apple className="w-5 h-5" />
                <Play className="w-4 h-4 fill-current" />
              </span>
            </motion.a>
            <p className="text-s text-white mt-3 font">Available on iOS &amp; Android</p>
          </motion.div>
        </div>

        {/* Tab nav — bottom of hero, over the fading overlay */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
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
                      {current.features.map((feature, i) => {
                        const colors = (current as any).featureColors?.[i];
                        return colors ? (
                          <div key={i} className="flex items-center gap-3 py-1">
                            <span className={`inline-flex items-center justify-center w-20 py-1 rounded-full border text-xs font-bold whitespace-nowrap ${colors}`}>
                              {feature.split('=')[0].trim()}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {feature.split('=')[1].trim()}
                            </span>
                          </div>
                        ) : (
                          <div key={i} className="flex items-center gap-3 py-1">
                            <span className="w-5 h-5 rounded-full bg-primary-500 text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{feature}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-3 mb-7 flex-wrap">
                      {current.highlights.map((h, i) => (
                        <div key={i} className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-navy-700/50 border border-yellow-500 border-width: 1px dark:border-navy-600/60 backdrop-blur-sm text-center min-w-[100px]">
                          <div className="text-base font-black font-display text-primary-500 leading-none">{h.value}</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{h.label}</div>
                        </div>
                      ))}
                      {showHelmet && (
                        <div className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-navy-700/50 border border-red-500 backdrop-blur-sm text-center min-w-[100px]">
                          <HardHat className="w-5 h-5 text-red-500 mx-auto" />
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Helmet required</div>
                        </div>
                      )}
                    </div>

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

                  {/* Right — Image */}
                  <div className="relative overflow-hidden min-h-[240px] sm:min-h-[300px] lg:min-h-0 rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl">
                    <img
                      src={current.image}
                      alt={current.label}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Gradient blends into card on desktop */}
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
    </div>
  );
};
