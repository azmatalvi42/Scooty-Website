import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Shield,
  Heart,
  Handshake,
  Leaf,
  Globe,
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
} from 'lucide-react';

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
    subtitle: 'Municipality Programs',
    image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Work with a Canadian mobility provider that understands how municipalities operate. SCOOTY collaborates closely with city teams to design programs aligned with transportation strategies, sustainability goals, and urban planning initiatives.',
    features: [
      'Program design and implementation',
      'Data insights and reporting',
      'Safety-focused fleet management',
      'Transit integration',
      'Community engagement programs',
    ],
  },
  {
    icon: Briefcase,
    title: 'Businesses & Property Owners',
    subtitle: 'Commercial Partners',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Shared mobility can become a competitive advantage. By integrating micromobility into retail, commercial, and mixed-use developments, businesses can attract more visitors, improve accessibility, and enhance customer experiences.',
    features: [
      'Increase foot traffic',
      'Improve site accessibility',
      'Support sustainable development goals',
      'Attract tenants and customers',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Campuses',
    subtitle: 'Academic Programs',
    image: 'https://images.pexels.com/photos/1462009/pexels-photo-1462009.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'SCOOTY provides turnkey micromobility programs designed for academic environments. Our solutions combine vehicles, software, operations, and research opportunities that support campus mobility needs.',
    features: [
      'Turnkey vehicle and software programs',
      'Research collaboration opportunities',
      'Campus-wide operational support',
      'Next-generation mobility insights',
    ],
  },
  {
    icon: Home,
    title: 'Developers',
    subtitle: 'Real Estate & Development',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Build communities designed for the future of transportation. SCOOTY helps developers create connected neighborhoods where residents can live, work, and move sustainably.',
    features: [
      'Transit-oriented developments',
      'Mixed-use community integration',
      'Residential connectivity programs',
      'Sustainable infrastructure support',
    ],
  },
];

const locations = [
  {
    city: 'Brampton',
    slug: 'brampton',
    launched: 'April 2023',
    status: 'active',
    vehicles: ['E-Scooters'],
    image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=900',
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
    image: 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=900',
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
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900',
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
    image: 'https://images.pexels.com/photos/1139556/pexels-photo-1139556.jpeg?auto=compress&cs=tinysrgb&w=900',
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

/* ─────────────────────────────────────────── COMPONENT ─── */

export const PartnersPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [bringRef, bringInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [solutionsRef, solutionsInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [locationsRef, locationsInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [safetyRef, safetyInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const currentSolution = partnerSolutions[activeTab];

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-black dark:via-navy-800 dark:to-black" />
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-16 left-8 w-64 h-64 bg-primary-500/15 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-32 right-16 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl"
            animate={{ y: [0, 25, 0], x: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-16 left-1/3 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6"
              >
                <Globe className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  Canadian Micromobility Partner
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6"
              >
                <span className="block text-gray-900 dark:text-white">Partner With</span>
                <span className="block text-primary-500">SCOOTY</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-4 font-medium"
              >
                Building the future of mobility together.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="text-base text-gray-500 dark:text-gray-400 mb-4 leading-relaxed max-w-xl"
              >
                SCOOTY is a Canadian micromobility company delivering safe, sustainable transportation
                solutions to cities, campuses, businesses, and communities across Ontario.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xl"
              >
                Through strong partnerships and innovative technology, we help communities improve
                mobility, reduce emissions, and create more connected urban environments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  className="group px-8 py-4 bg-primary-500 text-black rounded-full font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Become a Partner</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </div>

            {/* Right — visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-gray-200 dark:border-white/10 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="SCOOTY Community Partnership"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
                {/* Floating stat cards */}
                <motion.div
                  className="absolute bottom-6 left-6 bg-white dark:bg-navy-800 rounded-2xl px-5 py-4 shadow-xl border border-gray-100 dark:border-white/10"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-2xl font-bold font-display text-primary-500">5+</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Ontario Cities</div>
                </motion.div>
                <motion.div
                  className="absolute top-6 right-6 bg-primary-500 rounded-2xl px-5 py-4 shadow-xl"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-2xl font-bold font-display text-black">2023</div>
                  <div className="text-xs text-black/70">First Launch</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section ref={valuesRef} className="py-24 bg-gray-50 dark:bg-navy-900">
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
                {/* Icon */}
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
      <section ref={bringRef} className="py-24 bg-white dark:bg-black">
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
                className="bg-gray-50 dark:bg-navy-800 rounded-3xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300 group"
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
                    {item.sublist && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.sublist.map((tag, ti) => (
                          <span
                            key={ti}
                            className="text-xs px-3 py-1 bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded-full border border-primary-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER SOLUTIONS ── */}
      <section ref={solutionsRef} className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
              <Handshake className="w-3.5 h-3.5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Partnership Options</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Partner <span className="text-primary-500">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tailored programs designed for the unique needs of every type of community partner.
            </p>
          </motion.div>

          {/* Icon tab bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 bg-white dark:bg-navy-800 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 dark:border-white/10 max-w-full">
              {partnerSolutions.map((sol, index) => {
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
                      <sol.icon className="w-5 h-5" />
                    </div>
                    <span className="hidden sm:block whitespace-nowrap">{sol.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="partner-active-dot"
                        className="sm:hidden w-1.5 h-1.5 rounded-full bg-primary-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Slide content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left — Text */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit bg-primary-500 text-black">
                      <currentSolution.icon className="w-3.5 h-3.5" />
                      {currentSolution.subtitle}
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
                      {currentSolution.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                      {currentSolution.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {currentSolution.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      className="group inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 w-fit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                  {/* Right — Image */}
                  <div className="relative min-h-[300px] lg:min-h-0">
                    <img
                      src={currentSolution.image}
                      alt={currentSolution.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-navy-800/60 to-transparent lg:from-transparent" />
                  </div>
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {partnerSolutions.map((_, index) => (
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

      {/* ── CURRENT LOCATIONS ── */}
      <section ref={locationsRef} className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Latitude-style horizontal lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.6) 1px, transparent 1px)',
            backgroundSize: '100% 80px',
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
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

          {/* Pin card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {locations.map((loc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={locationsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer"
              >
                {/* Photo */}
                <img
                  src={loc.image}
                  alt={loc.city}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 group-hover:via-black/60 transition-all duration-300" />

                {/* Pulsing map pin — top left */}
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

                {/* Status badge — top right */}
                <div className="absolute top-5 right-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Highlights — slide up on hover */}
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

          {/* "More coming soon" strip */}
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
      <section ref={safetyRef} className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
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

            {/* Right — feature grid */}
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
      <section className="py-24 bg-primary-500 relative overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Orbs */}
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
