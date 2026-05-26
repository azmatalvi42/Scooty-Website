import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const solutions = [
  {
    title: 'SCOOTY On-Demand Mobility',
    description:
      'Improving the reach of regional transit by resolving the first-and-last-km service gap through on-demand mobility (Transit to Your Doorstep\u00ae).',
    image: '/assets/mainPage/our-solutions-carousel/Gemini_Generated_Image_tnpy9stnpy9stnpy.png',
    tag: 'Micromobility',
    accent: '#FEC001',
  },
  {
    title: 'SCOOTY PAY',
    description:
      'Integrated, secure, and scalable payment processing API for transit fare ticketing and 3rd party mobility services.',
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tag: 'Payments',
    accent: '#01FEC0',
  },
  {
    title: 'SCOOTY AI RideGuide',
    description:
      'Using conversational AI, real-time service updates, dynamic routing and customer support to enhance the daily transit commuting experience.',
    image: '/assets/mainPage/our-solutions-carousel/ai-ride-guide.png',
    tag: 'AI RideGuide',
    accent: '#01BDFE',
  },
];

const AUTO_INTERVAL = 10000;
const EASING: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const Services = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > active ? 1 : -1);
      setActive(index);
    },
    [active]
  );

  const next = useCallback(() => {
    const nextIndex = (active + 1) % solutions.length;
    setDirection(1);
    setActive(nextIndex);
  }, [active]);

  const prev = useCallback(() => {
    const prevIndex = (active - 1 + solutions.length) % solutions.length;
    setDirection(-1);
    setActive(prevIndex);
  }, [active]);

  useEffect(() => {
    const timer = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '55%' : '-55%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-55%' : '55%', opacity: 0 }),
  };

  const current = solutions[active];

  return (
    <section id="services" ref={ref} className="relative isolate py-12 sm:py-16 ls:py-8 overflow-hidden">

      {/* Soft round glow — same colour as the city animation so it blends seamlessly */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 22%, rgba(254,192,1,0.09), rgba(254,192,1,0.04) 32%, rgba(254,192,1,0) 60%), radial-gradient(circle at 50% 22%, rgba(7,7,16,0.82), rgba(7,7,16,0.6) 20%, rgba(7,7,16,0.34) 40%, rgba(7,7,16,0.15) 60%, rgba(7,7,16,0.05) 76%, rgba(7,7,16,0) 90%)',
        }}
      />

      {/* Decorative background blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#FEC001]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#01BDFE]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#01FEC0]/[0.03] rounded-full blur-2xl pointer-events-none" />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #FEC001 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="relative inline-block">
            <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
              Scooty Transit Platform
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 tracking-tight">
              Our <span className="text-[#FEC001]">Solutions</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              End-to-end technology platform powering the next generation of urban mobility.
            </p>
          </div>
        </motion.div>

        {/* Tab selector — scrollable on mobile, no wrapping */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-start sm:justify-center gap-2 mb-8 sm:mb-10 overflow-x-auto pb-1 scrollbar-hide"
        >
          {solutions.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 ${
                i === active
                  ? 'text-black'
                  : 'bg-white dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/[0.07]'
              }`}
              style={
                i === active
                  ? { backgroundColor: s.accent, boxShadow: `0 0 20px ${s.accent}55` }
                  : {}
              }
            >
              {s.tag}
            </button>
          ))}
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.48, ease: EASING }}
            >
              <div
                className="rounded-3xl overflow-hidden border bg-white dark:bg-[#0A0A0A] shadow-md dark:shadow-none"
                style={{ borderColor: `${current.accent}35` }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                  {/* Left — Text */}
                  <div className="p-7 sm:p-10 md:p-14 flex flex-col justify-between">
                    <div>
                      <span
                        className="inline-block px-3.5 py-1.5 text-black text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase w-fit"
                        style={{ backgroundColor: current.accent }}
                      >
                        {current.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4 sm:mb-5 leading-tight tracking-tight">
                        {current.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
                        {current.description}
                      </p>
                    </div>

                    {/* Bottom row: CTA + arrows */}
                    <div className="flex items-center justify-between mt-8 sm:mt-10">
                      <motion.button
                        onClick={() =>
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-black transition-all duration-200"
                        style={{ backgroundColor: current.accent }}
                        whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${current.accent}66` }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </motion.button>

                      {/* Prev / Next inside card */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prev}
                          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                          aria-label="Previous"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={next}
                          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                          aria-label="Next"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right — Image */}
                  <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[460px] ls:min-h-[180px] overflow-hidden">
                    <img
                      src={current.image}
                      alt={current.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Per-solution accent tint */}
                    <div
                      className="absolute inset-0 opacity-[0.07]"
                      style={{ background: `linear-gradient(135deg, ${current.accent}, transparent 60%)` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50/60 dark:from-[#0A0A0A]/60 via-transparent to-transparent lg:from-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="flex justify-center items-center gap-2.5 mt-6">
            {solutions.map((s, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className="relative h-1 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 transition-all duration-300"
                style={{ width: index === active ? 36 : 8 }}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === active && (
                  <motion.div
                    key={active}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: s.accent }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
