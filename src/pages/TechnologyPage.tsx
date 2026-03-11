import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Cpu, Radio, BarChart3, Lock, Layers, ChevronRight, Activity, Zap } from 'lucide-react';

const capabilities = [
  {
    icon: Brain,
    title: 'Machine Learning Engine',
    description:
      'Our proprietary ML models predict demand, optimise fleet placement, and detect anomalies in real time — continuously learning from millions of daily rides.',
    tags: ['Demand Forecasting', 'Anomaly Detection', 'Route Optimisation'],
  },
  {
    icon: Cpu,
    title: 'Edge Computing',
    description:
      'Processing happens directly on the vehicle hardware, enabling sub-100ms response times for safety-critical decisions even in low-connectivity environments.',
    tags: ['On-device Inference', 'Low Latency', 'Offline Resilience'],
  },
  {
    icon: Radio,
    title: 'IoT Fleet Network',
    description:
      'Every vehicle is a smart node in our network — transmitting GPS, battery, speed, and diagnostics data continuously to our cloud infrastructure.',
    tags: ['Real-time Telemetry', 'Remote Diagnostics', 'OTA Updates'],
  },
  {
    icon: BarChart3,
    title: 'Analytics Platform',
    description:
      'A city-level operations dashboard giving partners visibility into fleet health, rider behaviour, revenue, and sustainability metrics — all in one place.',
    tags: ['Live Dashboards', 'Custom Reports', 'Open APIs'],
  },
  {
    icon: Lock,
    title: 'Security & Compliance',
    description:
      'End-to-end encryption, SOC 2 Type II certified infrastructure, GDPR compliance, and granular access controls baked into every layer of the stack.',
    tags: ['SOC 2 Certified', 'GDPR', 'E2E Encryption'],
  },
  {
    icon: Layers,
    title: 'Open Integration Layer',
    description:
      'REST and GraphQL APIs, webhook support, and native integrations with leading MaaS platforms, city data portals, and payment processors.',
    tags: ['REST / GraphQL', 'Webhooks', 'MaaS Integrations'],
  },
];

const stack = [
  { category: 'AI & ML', items: ['PyTorch', 'TensorFlow Lite', 'Scikit-learn', 'Custom LLMs'] },
  { category: 'Infrastructure', items: ['Kubernetes', 'AWS / GCP Multi-cloud', 'Terraform', 'Kafka'] },
  { category: 'Data', items: ['Apache Spark', 'ClickHouse', 'dbt', 'Apache Airflow'] },
  { category: 'Connectivity', items: ['4G LTE / 5G', 'BLE', 'NB-IoT', 'LoRaWAN'] },
];

const metrics = [
  { icon: Activity, value: '<100ms', label: 'Edge Response Time' },
  { icon: Zap, value: '1B+', label: 'Data Points / Day' },
  { icon: BarChart3, value: '99.9%', label: 'Platform Uptime' },
  { icon: Brain, value: '40+', label: 'ML Models in Production' },
];

export const TechnologyPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [metricsRef, metricsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [capabilitiesRef, capabilitiesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [stackRef, stackInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
            className="absolute top-20 right-10 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl"
            animate={{ y: [0, -25, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 left-20 w-32 h-32 bg-primary-400/15 rounded-full blur-2xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6"
          >
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              Our Technology
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6"
          >
            <span className="block text-gray-900 dark:text-white">AI That Moves</span>
            <span className="block text-primary-500">Cities Forward</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
          >
            From on-device edge inference to city-scale analytics, every layer of the Scooty
            platform is engineered for performance, reliability, and intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              className="group px-8 py-4 bg-primary-500 text-black rounded-full font-semibold flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore the Platform</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              className="px-8 py-4 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read the Technical Whitepaper
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Metrics bar */}
      <section ref={metricsRef} className="py-16 bg-gray-900 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {metrics.map((m, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={metricsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-3">
                  <m.icon className="w-8 h-8 text-primary-400" />
                </div>
                <div className="text-4xl font-bold font-display text-primary-500 mb-1">{m.value}</div>
                <div className="text-gray-400 text-sm">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section ref={capabilitiesRef} className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={capabilitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Core <span className="text-primary-500">Capabilities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Six interconnected systems that make the Scooty platform uniquely intelligent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={capabilitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-7 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:border-primary-500/30 transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-5">
                  <cap.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-3">
                  {cap.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                  {cap.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded-full text-xs font-medium border border-primary-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section ref={stackRef} className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={stackInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              The <span className="text-primary-500">Tech Stack</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Best-in-class tools, carefully chosen and battle-tested at scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stack.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={stackInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
              >
                <h3 className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4">
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture diagram callout */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-50 dark:bg-navy-800 rounded-3xl p-10 border border-gray-200 dark:border-white/10 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center">
                <Layers className="w-8 h-8 text-black" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Want to Go Deeper?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto mb-8">
              Our technical whitepaper covers the full architecture — from IoT firmware to
              cloud inference pipelines. Available to verified partners and researchers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-primary-500 text-black rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request the Whitepaper
              </motion.button>
              <motion.button
                className="px-8 py-4 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View API Docs
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
