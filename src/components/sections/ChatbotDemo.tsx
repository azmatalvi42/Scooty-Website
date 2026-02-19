import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Eye, Wifi, BarChart3, Wrench, MessageSquare } from 'lucide-react';

const capabilities = [
  {
    icon: Brain,
    title: 'Machine Learning',
    description: 'Demand prediction, dynamic pricing, and fleet optimization powered by deep learning models.'
  },
  {
    icon: Eye,
    title: 'Computer Vision',
    description: 'Automated parking compliance, vehicle damage detection, and sidewalk analysis.'
  },
  {
    icon: Wifi,
    title: 'IoT Integration',
    description: 'Real-time telemetry from thousands of connected vehicles with edge computing.'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Live dashboards processing millions of data points per minute for instant insights.'
  },
  {
    icon: Wrench,
    title: 'Predictive Maintenance',
    description: 'ML models that forecast component failures before they happen, reducing downtime by 60%.'
  },
  {
    icon: MessageSquare,
    title: 'Natural Language Processing',
    description: 'Intelligent customer support and automated reporting with advanced NLP pipelines.'
  }
];

export const ChatbotDemo = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="technology" ref={ref} className="py-20 bg-gray-50 dark:bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full mb-4">
              Our Technology
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-6">
              The Scooty <span className="text-primary-500">Intelligence Platform</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Our proprietary AI platform processes billions of mobility data points to optimize every
              aspect of micro-mobility operations — from vehicle placement to rider safety, maintenance
              scheduling to city compliance.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2B+', label: 'Data points / day' },
                { value: '<50ms', label: 'Decision latency' },
                { value: '99.97%', label: 'Model accuracy' },
                { value: '3x', label: 'Faster than manual ops' },
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="bg-white dark:bg-black/60 rounded-xl p-4 border border-gray-200 dark:border-white/10"
                >
                  <div className="text-2xl font-bold font-display text-primary-500">{metric.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-black rounded-2xl p-8 border border-white/10 overflow-hidden">
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, #EAB308 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                  <span className="text-primary-400 text-sm font-medium font-display">Scooty Intelligence Platform — Live</span>
                </div>

                {capabilities.map((cap, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-4 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <cap.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{cap.title}</h4>
                      <p className="text-gray-500 text-xs mt-1">{cap.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
