import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import {
  Bike,
  Handshake,
  Info,
  Leaf,
  Share2,
  ArrowRight,
  CheckCircle,
  Code
} from 'lucide-react';

const solutions = [
  {
    icon: Code,
    title: 'Technology',
    subtitle: 'Built around the rider experience',
    description:
      'A dedicated section speaking directly to everyday riders — how to get started, what makes Scooty different, and why millions choose us for their daily commute.',
    features: ['App Download CTA', 'Ride Benefits', 'Safety Features', 'Rewards Program'],
    highlights: [
      { value: '4.8★', label: 'App Store rating' },
      { value: '72%', label: 'Rider retention' },
    ],
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Bike,
    title: 'Riders',
    subtitle: 'Built around the rider experience',
    description:
      'A dedicated section speaking directly to everyday riders — how to get started, what makes Scooty different, and why millions choose us for their daily commute.',
    features: ['App Download CTA', 'Ride Benefits', 'Safety Features', 'Rewards Program'],
    highlights: [
      { value: '4.8★', label: 'App Store rating' },
      { value: '72%', label: 'Rider retention' },
    ],
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Handshake,
    title: 'Our Partners',
    subtitle: 'Why cities and operators choose us',
    description:
      'A section tailored to city officials, fleet operators, and developers — showcasing our partnership models, cost outcomes, and the data-driven tools we put in their hands.',
    features: ['Partnership Tiers', 'ROI Calculator', 'City Dashboard', 'Operator Tools'],
    highlights: [
      { value: '40%', label: 'Cost reduction' },
      { value: '50+', label: 'City partners' },
    ],
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Info,
    title: 'About SCOOTY',
    subtitle: 'Our mission and story',
    description:
      'Who we are, why we started, and where we\'re headed. This section humanises the brand — sharing our founding principles, our team, and our vision for the future of urban transport.',
    features: ['Founding Story', 'Mission Statement', 'Core Values', 'Team Intro'],
    highlights: [
      { value: '2019', label: 'Founded' },
      { value: '3', label: 'Continents active' },
    ],
    image: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Leaf,
    title: 'Our Impact',
    subtitle: 'Measuring what matters',
    description:
      'Scooty exists to make cities cleaner. This section tracks our environmental footprint — CO₂ avoided, car trips replaced, and the sustainability milestones we\'ve hit along the way.',
    features: ['CO₂ Avoided', 'Car Trips Replaced', 'Sustainability Goals', 'City-level Data'],
    highlights: [
      { value: '12k t', label: 'CO₂ avoided' },
      { value: '4M+', label: 'Car trips replaced' },
    ],
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Share2,
    title: 'Social Media',
    subtitle: 'Community, proof, and connection',
    description:
      'Real posts, real riders, real cities. Our social feed brings the Scooty community to life — showing authentic moments from the streets and keeping the brand current and relatable.',
    features: ['Live Feed', 'User Content', 'Brand Moments', 'Community Highlights'],
    highlights: [
      { value: '280k', label: 'Followers' },
      { value: '18%', label: 'Avg engagement' },
    ],
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const Services = () => {
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const current = solutions[active];

  return (
    <section id="services" ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Our <span className="text-primary-500">Solutions</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            End-to-end technology platform powering the next generation of urban micro-mobility.
          </p>
        </motion.div>

        {/* Icon navbar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 bg-gray-100 dark:bg-navy-800 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 dark:border-white/10 max-w-full">
            {solutions.map((solution, index) => {
              const isActive = index === active;
              return (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all duration-300 min-w-[72px] ${
                    isActive
                      ? 'bg-white dark:bg-black shadow-lg text-black dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-black/50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-500 text-black scale-110'
                        : 'bg-gray-200 dark:bg-secondary-800 text-gray-500 dark:text-gray-500'
                    }`}
                  >
                    <solution.icon className="w-5 h-5" />
                  </div>
                  <span className="hidden sm:block whitespace-nowrap">{solution.title}</span>

                  {isActive && (
                    <motion.div
                      layoutId="active-dot"
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
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy-800 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left — Text */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit bg-primary-500 text-black">
                    <current.icon className="w-3.5 h-3.5" />
                    {current.subtitle}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
                    {current.title}
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
                        <div className="text-2xl font-bold font-display text-primary-500">
                          {h.value}
                        </div>
                        <div className="text-xs text-gray-500">{h.label}</div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() =>
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }
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
                    src={current.image}
                    alt={current.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-navy-800/60 to-transparent lg:from-transparent" />
                </div>
              </div>
            </div>

            {/* Slide indicator dots */}
            <div className="flex justify-center gap-2 mt-6">
              {solutions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === active
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
  );
};
