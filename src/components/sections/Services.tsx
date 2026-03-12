import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const solutions = [
  {
    title: 'SCOOTY On-Demand Mobility',
    description:
      'Improving the reach of regional transit by resolving the first-and-last-km service gap through on-demand mobility (Transit to Your Doorstep\u00ae).',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'SCOOTY PAY',
    description:
      'Integrated, secure, and scalable payment processing for transit ticketing and 3rd party mobility services bringing one fare, one platform and many ways to move.',
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'SCOOTY AI RideGuide',
    description:
      'Using conversational AI, real-time service updates, dynamic routing and customer support to enhance the daily transit commuting experience.',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const AUTO_INTERVAL = 10000;

export const Services = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
    enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  const current = solutions[active];

  return (
    <section id="services" ref={ref} className="relative py-20 bg-white dark:bg-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Our <span className="text-primary-500">Solutions</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            End-to-end technology platform powering the next generation of urban mobility.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left — Text */}
                  <div className="p-8 md:p-14 flex flex-col justify-center">
                    <h3 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-6 leading-tight">
                      {current.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-10">
                      {current.description}
                    </p>

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
                  <div className="relative min-h-[300px] lg:min-h-[480px]">
                    <img
                      src={current.image}
                      alt={current.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 dark:from-navy-800/50 to-transparent lg:from-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 w-10 h-10 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-md hover:border-primary-500/60 hover:text-primary-500 transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 w-10 h-10 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-md hover:border-primary-500/60 hover:text-primary-500 transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators + progress */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {solutions.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className="relative h-1.5 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 transition-all duration-300"
              style={{ width: index === active ? 40 : 10 }}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === active && (
                <motion.div
                  key={active}
                  className="absolute inset-y-0 left-0 bg-primary-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
