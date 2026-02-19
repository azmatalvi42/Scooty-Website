import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Leaf, Building2, BarChart3 } from 'lucide-react';

const pillars = [
  { icon: Brain, title: 'AI-First', description: 'Every decision is informed by machine learning and real-time data processing.' },
  { icon: Leaf, title: 'Sustainable', description: 'We are replacing car trips with clean, electric micro-mobility alternatives.' },
  { icon: Building2, title: 'City-Partnered', description: 'Built for cities — we work hand-in-hand with transportation departments.' },
  { icon: BarChart3, title: 'Data-Driven', description: 'Billions of data points power better outcomes for riders, operators, and cities.' },
];

const techStack = [
  'Machine Learning', 'Computer Vision', 'IoT', 'Cloud Infrastructure', 'Edge Computing', 'Real-time Systems'
];

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            About <span className="text-primary-500">Scooty</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We combine cutting-edge AI with micro-mobility to transform urban transportation —
            making cities cleaner, smarter, and more accessible for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Company story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-8 border border-gray-200 dark:border-white/10">
              <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Founded with the belief that urban transportation should be intelligent, sustainable, and
                accessible, Scooty is building the operating system for micro-mobility. Our platform
                connects riders, operators, and cities through AI — optimizing everything from fleet
                placement to maintenance scheduling to regulatory compliance.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Today we operate in 50+ cities across three continents, managing millions of rides and
                helping municipalities meet their sustainability goals. Our technology reduces operating
                costs by up to 40% while improving rider satisfaction and safety outcomes.
              </p>
            </div>

            {/* Tech stack badges */}
            <div className="bg-primary-500/5 rounded-2xl p-6 border border-primary-500/20">
              <h4 className="text-lg font-semibold font-display text-gray-900 dark:text-white mb-4">
                Powered By
              </h4>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium border border-primary-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                className="bg-gray-50 dark:bg-navy-800 rounded-xl p-6 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
                  <pillar.icon className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-semibold font-display text-gray-900 dark:text-white mb-2">{pillar.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{pillar.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
