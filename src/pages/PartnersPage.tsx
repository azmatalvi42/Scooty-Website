import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ChevronRight,
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
    sublist: ['Urban planning', 'Civil engineering', 'Transportation policy', 'Mobility operations', 'Community development'],
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
    sublist: ['Municipal governments', 'Transit agencies', 'Universities and colleges', 'Developers and landowners', 'Community organizations', 'Local businesses'],
  },
];

const partnerSolutions = [
  {
    icon: Building2,
    title: 'Cities',
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
    note: 'We prioritize data privacy and only share aggregated, anonymized insights with municipalities.',
  },
  {
    icon: Briefcase,
    title: 'Businesses & Property Owners',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Shared mobility can become a competitive advantage. By integrating micromobility into retail, commercial, and mixed-use developments, businesses can attract more visitors, improve accessibility, and enhance customer experiences.',
    features: [
      'Increase foot traffic',
      'Improve site accessibility',
      'Support sustainable development goals',
      'Attract tenants and customers',
    ],
    note: 'Turn mobility into a competitive advantage for your development.',
  },
  {
    icon: GraduationCap,
    title: 'Campuses',
    image: 'https://images.pexels.com/photos/1462009/pexels-photo-1462009.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'SCOOTY provides turnkey micromobility programs designed for academic environments. Our solutions combine vehicles, software, operations, and research opportunities that support campus mobility needs.',
    features: [
      'Turnkey vehicle and software programs',
      'Research collaboration opportunities',
      'Campus-wide operational support',
      'Next-generation mobility insights',
    ],
    note: 'We actively collaborate with universities and research institutions to develop next-generation mobility technology.',
  },
  {
    icon: Home,
    title: 'Developers',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Build communities designed for the future of transportation. SCOOTY helps developers create connected neighborhoods where residents can live, work, and move sustainably.',
    features: [
      'Transit-oriented developments',
      'Mixed-use community integration',
      'Residential connectivity programs',
      'Sustainable infrastructure support',
    ],
    note: 'Build communities designed for the future of transportation.',
  },
];

const locations = [
  {
    city: 'Brampton',
    slug: 'brampton',
    launched: 'April 2023',
    status: 'active',
    vehicles: ['E-Scooters'],
    highlights: [
      'Service area covering the entire city',
      'Riding on roads ≤ 50 km/h',
      'Slow-speed zones in parks and trails',
      'Designated parking zones',
      'Transit network integration',
    ],
  },
  {
    city: 'Barrie',
    slug: 'barrie',
    launched: 'June 2024',
    status: 'active',
    vehicles: ['E-Bikes'],
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
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [bringRef, bringInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [solutionsRef, solutionsInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [locationsRef, locationsInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [safetyRef, safetyInView] = useInView({ triggerOnce: true, threshold: 0.05 });

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
                <motion.button
                  className="px-8 py-4 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Work with a local partner that understands your community.
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {partnerSolutions.map((sol, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="bg-white dark:bg-navy-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 group"
              >
                {/* Image header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={sol.image}
                    alt={sol.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                      <sol.icon className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white">{sol.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5">
                    {sol.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {sol.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center space-x-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {sol.note && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic border-t border-gray-100 dark:border-white/10 pt-4">
                      {sol.note}
                    </p>
                  )}

                  <motion.button
                    className="mt-5 group/btn inline-flex items-center space-x-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    whileHover={{ x: 4 }}
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRENT LOCATIONS ── */}
      <section ref={locationsRef} className="py-24 bg-black relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(234,179,8,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.6) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

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

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-primary-500/40 to-transparent -translate-x-1/2 hidden sm:block" />

            <div className="space-y-10">
              {locations.map((loc, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    animate={locationsInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.12 }}
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                  >
                    {/* Card */}
                    <div className="w-full sm:w-[calc(50%-2.5rem)]">
                      <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300">
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary-500/10 border border-primary-500/30 rounded-xl flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-primary-400" />
                            </div>
                            <h3 className="text-lg font-bold font-display text-white">{loc.city}</h3>
                          </div>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              loc.status === 'active'
                                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                                : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                            }`}
                          >
                            {loc.status === 'active' ? 'Active' : 'Upcoming'}
                          </span>
                        </div>

                        {/* Launch date */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{loc.status === 'upcoming' ? 'Launching' : 'Launched'} {loc.launched}</span>
                        </div>

                        {/* Vehicle badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {loc.vehicles.map((v, vi) => (
                            <span
                              key={vi}
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20"
                            >
                              <Bike className="w-3 h-3" />
                              {v}
                            </span>
                          ))}
                        </div>

                        {/* Highlights */}
                        <ul className="space-y-1.5 mb-5">
                          {loc.highlights.map((h, hi) => (
                            <li key={hi} className="flex items-start gap-2 text-xs text-gray-400">
                              <span className="w-1 h-1 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                              {h}
                            </li>
                          ))}
                        </ul>

                        <Link to={`/partners/${loc.slug}`}>
                          <motion.div
                            className="inline-flex items-center gap-2 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors group/cta"
                            whileHover={{ x: 3 }}
                          >
                            <span>Read full article</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
                          </motion.div>
                        </Link>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full border-2 border-primary-500 bg-black items-center justify-center z-10 shadow-lg shadow-primary-500/30">
                      <span className="w-3 h-3 rounded-full bg-primary-500" />
                    </div>

                    {/* Spacer on other side */}
                    <div className="hidden sm:block w-[calc(50%-2.5rem)]" />
                  </motion.div>
                );
              })}
            </div>
          </div>
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
