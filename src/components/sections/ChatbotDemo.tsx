import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download, MapPin, Shield, Zap } from 'lucide-react';

const perks = [
  {
    icon: MapPin,
    title: 'Find a Ride Near You',
    description: 'Locate SCOOTY vehicles and transit connections in real time across your city.',
  },
  {
    icon: Zap,
    title: 'Instant Unlocking',
    description: 'Scan and go! Unlock any SCOOTY in seconds straight from the app.',
  },
  {
    icon: Shield,
    title: 'Ride Safe, Ride Smart',
    description: 'Up-to-date technology, built-in safety features and 24/7 multilingual support.',
  },
];



export const ChatbotDemo = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <section id="riders" ref={ref} className="relative py-10 sm:py-24 ls:py-6 bg-gray-50 dark:bg-navy-800 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 ls:gap-6 items-center">

          {/* ── Left — Text ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Yellow pill */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-5 tracking-wide uppercase"
            >
              SCOOTY Micromobility Rideshare
            </motion.span>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-gray-900 dark:text-white mb-6 leading-tight">
              Riders
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              Looking to ride with SCOOTY? Get all the information you need to get started before you take your first trip.
            </p>

            {/* Perks */}
            <div className="space-y-5 mb-10">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <perk.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{perk.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{perk.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={() => navigate('/riders')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 shadow-lg shadow-primary-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-black border border-primary-500 text-primary-500 rounded-full font-semibold hover:border-primary-400 hover:text-primary-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download App</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ── Right — Visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main image card */}
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
              <img
                src="https://images.pexels.com/photos/7129713/pexels-photo-7129713.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="SCOOTY rider"
                className="w-full h-[220px] sm:h-[340px] md:h-[420px] ls:h-[180px] object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Bottom badge */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">SCOOTY is nearby</div>
                    <div className="text-white/60 text-xs">2 min walk · Transit to your doorstep®</div>
                  </div>
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
