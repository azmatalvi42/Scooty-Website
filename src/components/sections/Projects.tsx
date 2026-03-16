import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Leaf, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';


const caseStudies = [
  {
    city: 'Brampton, ON',
    slug: 'brampton',
    image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '2.1M rides served',
    emissions: '4,200 tons CO2 saved',
    highlight: 'Reduced average commute time by 18%',
  },
  {
    city: 'Barrie, ON',
    slug: 'barrie',
    image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '1.5M rides served',
    emissions: '3,100 tons CO2 saved',
    highlight: 'Fleet utilization increased by 35%',
  },
  {
    city: 'Burlington, ON',
    slug: 'burlington',
    image: 'https://images.pexels.com/photos/1128408/pexels-photo-1128408.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '3.4M rides served',
    emissions: '6,800 tons CO2 saved',
    highlight: 'Expanded to 12 districts in 6 months',
  },
];

const partnerTypes = [
  {
    title: 'Cities',
    description:
      'No two cities are the same. Partner with SCOOTY to bring the latest transit technology and mobility services to meet the needs of your community.',
    image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Transit',
    description:
      'Reimagine how daily commuting looks for your riders. Partner with SCOOTY to integrate digital payments, real-time updates, schedule delays and AI-powered customer support within your existing operations.',
    image: 'https://images.pexels.com/photos/3278015/pexels-photo-3278015.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Real Estate',
    description:
      'Looking to meet your Transportation Demand Management (TDM) plans for your current or upcoming development? Partner with SCOOTY to bring shared, zero-emission mobility solutions to your residential, commercial or retail properties.',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Non-Profit',
    description:
      'Enhance mobility access and engagement for your local community. Partner with SCOOTY to bring shared, zero-emission transportation and innovative mobility programs to campuses, events, tourism destinations, and local organizations.',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const AUTO_INTERVAL = 10000;

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > active ? 1 : -1);
      setActive(index);
    },
    [active]
  );

  const next = useCallback(() => {
    const nextIndex = (active + 1) % partnerTypes.length;
    setDirection(1);
    setActive(nextIndex);
  }, [active]);

  const prev = useCallback(() => {
    const prevIndex = (active - 1 + partnerTypes.length) % partnerTypes.length;
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

  const current = partnerTypes[active];

  return (
    <section id="impact" ref={ref} className="relative py-10 sm:py-20 ls:py-6 bg-gray-50 dark:bg-navy-800 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Our Partners heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Our <span className="text-primary-500">Partners</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Building Communities Together
          </p>
        </motion.div>

        {/* ── Partner types carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10 sm:mb-20"
        >
          {/* Yellow bar + heading */}
          <div className="text-center mb-10">
          </div>

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
                <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Left — Text */}
                    <div className="p-6 sm:p-8 md:p-14 flex flex-col justify-center">
                      <span className="inline-block px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-5 tracking-wide uppercase w-fit"
                      >Our Partners</span>

                      <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                        {current.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg mb-6 sm:mb-10">
                        {current.description}
                      </p>
                      <Link
                        to="/partners"
                        className="group inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 w-fit"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Right — Image */}
                    <div className="relative min-h-[180px] sm:min-h-[280px] lg:min-h-[460px] ls:min-h-[150px]">
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

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {partnerTypes.map((_, index) => (
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
        </motion.div>


        {/* ── Case Studies ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-8 text-center">
            Case Studies
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
              className="group"
            >
              <Link to={`/partners/${study.slug}`} className="block">
                <div className="bg-white dark:bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-xl hover:border-primary-500/30 transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-3">
                      {study.city}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>{study.rides}</p>
                      <p>{study.emissions}</p>
                    </div>
                    <div className="mt-4 px-3 py-2 bg-primary-500 rounded-lg">
                      <p className="text-sm font-medium text-black">{study.highlight}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-500 group-hover:gap-2.5 transition-all duration-200">
                      <span>View Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
