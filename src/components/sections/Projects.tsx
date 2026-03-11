import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Leaf, MapPin, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const impactStats = [
  { icon: MapPin, value: 50, suffix: '+', label: 'Cities Worldwide' },
  { icon: Users, value: 10, suffix: 'M+', label: 'Rides Completed' },
  { icon: Leaf, value: 25, suffix: 'K', label: 'Tons CO2 Saved' },
  { icon: TrendingUp, value: 40, suffix: '%', label: 'Avg Cost Reduction' },
];

const caseStudies = [
  {
    city: 'Brampton, ON',
    image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '2.1M rides served',
    emissions: '4,200 tons CO2 saved',
    highlight: 'Reduced average commute time by 18%',
  },
  {
    city: 'Barrie, ON',
    image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '1.5M rides served',
    emissions: '3,100 tons CO2 saved',
    highlight: 'Fleet utilization increased by 35%',
  },
  {
    city: 'Burlington, ON',
    image: 'https://images.pexels.com/photos/1128408/pexels-photo-1128408.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '3.4M rides served',
    emissions: '6,800 tons CO2 saved',
    highlight: 'Expanded to 12 districts in 6 months',
  },
];

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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="impact" ref={ref} className="relative py-20 bg-gray-50 dark:bg-navy-800 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Our <span className="text-primary-500">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Measurable results in cities around the world. Every ride makes urban transportation
            smarter and more sustainable.
          </p>
        </motion.div>

        {/* Impact counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center bg-white dark:bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary-500 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-black" />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Case studies */}
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
              <div className="bg-white dark:bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300">
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
