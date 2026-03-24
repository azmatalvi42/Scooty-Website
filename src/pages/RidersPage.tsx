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
    image: 'https://images.pexels.com/photos/4543829/pexels-photo-4543829.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/4543833/pexels-photo-4543833.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: MapPin,
    label: 'Where to Ride',
    slug: 'where-to-ride',
    subtitle: 'Know your zones',
    description: 'Check the map in the SCOOTY app and know the different speed control riding and parking zones.',
    features: ['Clear = 20 km/h', 'Yellow = 15 km/h', 'Red = 0 km/h', 'Blue = Designated Parking', 'Purple = Mandatory Parking'],
    featureColors: [
      'bg-white dark:bg-gray-100 border-gray-300 text-gray-800',
      'bg-yellow-400 border-yellow-500 text-black',
      'bg-red-500 border-red-600 text-white',
      'bg-blue-500 border-blue-600 text-white',
      'bg-purple-600 border-purple-700 text-white',
    ],
    highlights: [
      { value: '20 km/h', label: 'Max speed' },
    ],
    image: 'https://images.pexels.com/photos/3894382/pexels-photo-3894382.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: ParkingSquare,
    label: 'Park Like a Pro',
    slug: 'parking',
    subtitle: 'Park responsibly',
    description: 'Find designated parking zones in the app. Park upright and take a photo.',
    features: ['Find Zones', 'Park Upright', 'Take Photo', 'End Ride'],
    highlights: [
      { value: 'Free Parking', label: 'At Designated Zones' },
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
  const [direction, setDirection] = useState(1);

  const goToTab = (index: number) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const current = TABS[activeTab];
  const isGettingStarted = current.slug === 'getting-started';
  const isCentered = true;
  const showHelmet = isGettingStarted || current.slug === 'how-to-ride' || current.slug === 'where-to-ride';

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white dark:from-black dark:via-navy-800 dark:to-black" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(234,179,8,0.4) 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)',
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
            <span className="block text-primary-500 mt-2">Your Ride</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-10"
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
            <p className="text-s text-primary-500 dark:text-primary-500 mt-3 font-bold">Available on iOS &amp; Android</p>
          </motion.div>
        </div>
      </section>

      {/* Tab section */}
      <section ref={contentRef} className="py-10 sm:py-14 lg:py-20 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tab nav — scrollable on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 sm:mb-10"
          >
            <div className="overflow-x-auto pb-1 flex justify-start sm:justify-center scrollbar-hide">
              <div className="inline-flex gap-1.5 sm:gap-2 bg-white dark:bg-navy-800 rounded-2xl p-1.5 border border-gray-200 dark:border-navy-700 shrink-0">
                {TABS.map((tab, index) => {
                  const isActive = index === activeTab;
                  return (
                    <button
                      key={index}
                      onClick={() => goToTab(index)}
                      className={`relative flex flex-col items-center gap-1 px-2.5 sm:px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 min-w-[60px] sm:min-w-[72px] ${isActive
                        ? 'bg-gray-100 dark:bg-black shadow text-black dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/50'
                        }`}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive
                        ? 'bg-primary-500 text-black'
                        : 'bg-gray-200 dark:bg-navy-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="whitespace-nowrap text-[10px] sm:text-xs">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Slide content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 shadow-lg">
                {/* Accent bar */}
                <div className="h-1 w-full bg-primary-500" />

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left — Text */}
                  <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

                    {/* Subtitle badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 w-fit bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400">
                      <current.icon className="w-3 h-3" />
                      {current.subtitle}
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 dark:text-white mb-2">
                      {current.label}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                      {current.description}
                    </p>

                    {/* Feature rows */}
                    <div className="flex flex-col gap-1.5 mb-6">
                      {current.features.map((feature, i) => {
                        const colors = (current as any).featureColors?.[i];
                        return colors ? (
                          <div key={i} className={`flex items-center px-3.5 py-2.5 rounded-xl border font-medium text-sm ${colors}`}>
                            {feature}
                          </div>
                        ) : (
                          <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-700 border border-gray-100 dark:border-navy-700">
                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500 text-black text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    <div className={`flex gap-2.5 mb-6 flex-wrap justify-center`}>
                      {current.highlights.map((h, i) => (
                        <div key={i} className={`w-36 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-700 border border-primary-500 text-center`}>
                          <div className="text-lg font-black font-display text-primary-500 leading-none h-[20px] flex items-center justify-center">{h.value}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{h.label}</div>
                        </div>
                      ))}
                      {showHelmet && (
                        <div className={`w-36 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-700 border border-primary-500 text-center`}>
                          <HardHat className="w-5 h-5 text-primary-500 mx-auto" />
                          <div className="text-xs text-gray-500 mt-0.5">Helmet required</div>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className={isCentered ? 'flex justify-center' : ''}>
                      <Link
                        to={`/riders/${current.slug}`}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-black rounded-full text-sm font-semibold hover:bg-primary-400 transition-all duration-300 w-fit shadow-sm shadow-primary-500/30 hover:shadow-md hover:shadow-primary-500/40"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right — Image */}
                  <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[420px]">
                    <img
                      src={current.image}
                      alt={current.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-white/20 dark:lg:from-navy-800/40 lg:to-transparent" />
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
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
                    className={`h-1.5 rounded-full transition-all duration-300 ${index === activeTab
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
