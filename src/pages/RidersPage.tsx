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
  CheckCircle,
} from 'lucide-react';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  {
    icon: Rocket,
    label: 'Getting Started',
    slug: 'getting-started',
    subtitle: 'Start your first ride',
    description: 'Download the app, create an account, and unlock your first SCOOTY in minutes.',
    features: ['Download App', 'Create Account', 'Find Vehicles', 'Scan & Ride'],
    highlights: [
      { value: '2 min', label: 'Setup time' },
      { value: '16+', label: 'Age required' },
    ],
    image: 'https://images.pexels.com/photos/4543829/pexels-photo-4543829.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Navigation,
    label: 'How to Ride',
    slug: 'how-to-ride',
    subtitle: 'Learn the basics',
    description: 'Scan, unlock, and ride. Follow our simple steps to get moving safely.',
    features: ['Scan QR Code', 'Wear Helmet', 'Follow Rules', 'End Ride'],
    highlights: [
      { value: '8 steps', label: 'Quick guide' },
      { value: 'Easy', label: 'Learning curve' },
    ],
    image: 'https://images.pexels.com/photos/4543833/pexels-photo-4543833.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: MapPin,
    label: 'Where to Ride',
    slug: 'where-to-ride',
    subtitle: 'Know your zones',
    description: 'Green, yellow, and red zones control your speed. Check the app map for details.',
    features: ['Green Zones', 'Yellow Zones', 'Red Zones', 'Live Map'],
    highlights: [
      { value: '20 km/h', label: 'Max speed' },
      { value: '3', label: 'Zone types' },
    ],
    image: 'https://images.pexels.com/photos/3894382/pexels-photo-3894382.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: ParkingSquare,
    label: 'Parking',
    slug: 'parking',
    subtitle: 'Park responsibly',
    description: 'Find designated parking zones in the app. Park upright and take a photo.',
    features: ['Find Zones', 'Park Upright', 'Take Photo', 'End Ride'],
    highlights: [
      { value: 'Blue P', label: 'Parking icon' },
      { value: 'Free', label: 'At zones' },
    ],
    image: 'https://images.pexels.com/photos/5386754/pexels-photo-5386754.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/5386755/pexels-photo-5386755.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/4543837/pexels-photo-4543837.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export const RidersPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const current = TABS[activeTab];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white dark:from-black dark:via-navy-800 dark:to-black" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-2xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 left-20 w-28 h-28 bg-primary-400/15 rounded-full blur-2xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6"
          >
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">For Riders</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
          >
            <span className="block text-gray-900 dark:text-white">Your City,</span>
            <span className="block text-primary-500">Your Ride</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-10"
          >
            Hop on a SCOOTY e-scooter or e-bike and glide through the city.
          </motion.p>

          {/* Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-4 px-8 py-5 bg-primary-500 text-black rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:bg-primary-400 transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Download to start riding</span>
              <span className="flex items-center gap-2 border-l border-black/20 pl-4">
                <Apple className="w-5 h-5" />
                <Play className="w-4 h-4 fill-current" />
              </span>
            </motion.a>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">Available on iOS &amp; Android</p>
          </motion.div>
        </div>
      </section>

      {/* Tab section */}
      <section ref={contentRef} className="py-16 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Icon navbar - matching homepage style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 bg-white dark:bg-navy-800 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 dark:border-white/10 max-w-full">
              {TABS.map((tab, index) => {
                const isActive = index === activeTab;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all duration-300 min-w-[72px] ${
                      isActive
                        ? 'bg-gray-100 dark:bg-black shadow-lg text-black dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-500 text-black scale-110'
                          : 'bg-gray-200 dark:bg-secondary-800 text-gray-500 dark:text-gray-500'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                    </div>
                    <span className="hidden sm:block whitespace-nowrap">{tab.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="rider-active-dot"
                        className="sm:hidden w-1.5 h-1.5 rounded-full bg-primary-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Slide content - matching homepage style */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left — Text */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit bg-primary-500 text-black">
                      <current.icon className="w-3.5 h-3.5" />
                      {current.subtitle}
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
                      {current.label}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                      {current.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {current.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-6 mb-8">
                      {current.highlights.map((h, i) => (
                        <div key={i}>
                          <div className="text-2xl font-bold font-display text-primary-500">{h.value}</div>
                          <div className="text-xs text-gray-500">{h.label}</div>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/riders/${current.slug}`}
                      className="group inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 w-fit"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Right — Image */}
                  <div className="relative min-h-[300px] lg:min-h-0">
                    <img
                      src={current.image}
                      alt={current.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-navy-800/60 to-transparent lg:from-transparent" />
                  </div>
                </div>
              </div>

              {/* Slide indicator dots */}
              <div className="flex justify-center gap-2 mt-6">
                {TABS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
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
      </section>
    </div>
  );
};
