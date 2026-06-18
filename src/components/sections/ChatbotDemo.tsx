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
    description: 'Scan and go. Unlock any SCOOTY in seconds straight from the app.',
  },
  {
    icon: Shield,
    title: 'Ride Safe, Ride Smart',
    description: 'Up-to-date technology, built-in safety features and 24/7 multilingual support.',
  },
];

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const ChatbotDemo = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const navigate = useNavigate();

  return (
    <section id="riders" ref={ref} className="relative isolate py-16 sm:py-24 ls:py-8 overflow-hidden">
      {/* Soft round glow — same colour as the city animation so it blends seamlessly */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(254,192,1,0.09), rgba(254,192,1,0.04) 32%, rgba(254,192,1,0) 60%), radial-gradient(circle at 50% 40%, rgba(7,7,16,0.82), rgba(7,7,16,0.6) 20%, rgba(7,7,16,0.34) 40%, rgba(7,7,16,0.15) 60%, rgba(7,7,16,0.05) 76%, rgba(7,7,16,0) 90%)',
        }}
      />

      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100 dark:bg-white/[0.04]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 ls:gap-6 items-center">

          {/* ── Left — Text ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: EASING }}
          >
            <div className="relative inline-block mb-10">
              {/* Eyebrow pill */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, ease: EASING }}
                className="inline-block px-3.5 py-1.5 bg-[#FEC001] text-black text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase"
              >
                SCOOTY Micromobility Rideshare
              </motion.span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-5 leading-tight tracking-tight">
                Riders
              </h2>

              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                Looking to ride with SCOOTY? Get all the information you need to get started before you take your first trip.
              </p>
            </div>

            {/* Perks */}
            <div className="space-y-5 mb-10">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.22 + i * 0.1, ease: EASING }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FEC001]/[0.08] border border-[#FEC001]/[0.15] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#FEC001] group-hover:border-[#FEC001] transition-all duration-250">
                    <perk.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FEC001] group-hover:text-black transition-colors duration-250" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 tracking-tight">
                      {perk.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {perk.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55, ease: EASING }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                onClick={() => navigate('/riders')}
                className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#FEC001] text-black rounded-full font-bold text-sm hover:bg-[#FFD00F] transition-all duration-200"
                whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(254,192,1,0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </motion.button>

              <motion.button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-gray-300 rounded-full font-semibold text-sm hover:border-[#FEC001]/50 hover:text-[#FEC001] dark:hover:text-[#FEC001] transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-150" />
                <span>Download App</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ── Right — Visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.12, ease: EASING }}
            className="relative flex justify-center"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 bg-[#FEC001]/[0.07] rounded-full blur-3xl" />
            </div>

            {/* Main image card */}
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-150 dark:border-white/[0.06]">
              <img
                src="/assets/mainPage/main-pg-riders.webp"
                alt="SCOOTY rider"
                className="w-full h-[220px] sm:h-[340px] md:h-[420px] ls:h-[180px] object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Status badge */}
              <div className="absolute bottom-5 left-4 right-4">
                <div className="bg-black/30 backdrop-blur-xl border border-white/[0.12] rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FEC001] rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-black" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-xs font-semibold leading-tight">SCOOTY is nearby</div>
                    <div className="text-white/55 text-xs mt-0.5 truncate">2 min walk · Transit to your doorstep®</div>
                  </div>
                  <div className="ml-auto flex-shrink-0 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
