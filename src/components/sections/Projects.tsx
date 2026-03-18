import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Leaf, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, Shield, Heart, Handshake, Quote, X } from 'lucide-react';
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
    city: 'Metrolinx',
    slug: 'metrolinx',
    image: 'https://images.pexels.com/photos/3278015/pexels-photo-3278015.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: 'GTHA-wide integration',
    emissions: 'First & last-mile transit',
    highlight: 'Proud partners innovating transit across Ontario',
  },
];

const coreValues = [
  {
    icon: Shield,
    title: 'Safety',
    description:
      'Safety is a fundamental right for everyone. Inspired by Vision Zero principles, SCOOTY\'s commitment to safety is the foundation of our company; expressed and demonstrated in our branding, our technology, and our daily operations to make SCOOTY the safest option for all members of a community.',
  },
  {
    icon: Heart,
    title: 'Courtesy',
    description:
      'Courtesy is critical in making shared mobility work for everyone. We encompass courtesy as a design thinking principle and implement it into our planning process, operational best practices and communication awareness.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description:
      'SCOOTY plans, designs and delivers mobility solutions through our community partnerships network. Our plans are guided by the collective domain knowledge and expertise of our partners, tailored to your community\'s needs and carefully aligned with municipal vision, goals, strategies, plans and policies.',
  },
];

const governmentQuotes = [
  {
    quote: 'I am pleased to see SCOOTY expand and offer more options to keep commuters moving. Transit-Integrated Micromobility is critical to allow more people to use transit for longer-distance trips across the region. Our government is protecting Ontario by supporting businesses, municipalities and transit providers in implementing innovative transportation solutions, like SCOOTY’s new micromobility technology, to make life more affordable for commuters and grow our economy.',
    name: "Honourable Prabmeet Sarkaria",
    title: "Minister of Transportation for Ontario",
    image: "src/assets/QuotesImages/DSC_4516.jpg",
  },
  {
    quote: "The integration of new, innovative technologies like SCOOTY into our transportation network is an essential step in ensuring workers, families, and students across our province are supported in their day-to-day activities.",
    name: "Vic Fedeli",
    title: "Minister of Economic Development, Job Creation and Trade",
    image: "src/assets/QuotesImages/DSC_4553 (1).jpg",
  },
  {
    quote: "I have been pleased to watch Brampton’s SCOOTY demonstrate their tech-focused, partnership-based approach to local mobility and connections to transit. Great transit makes for thriving communities, and SCOOTY is a great part of our transit mix.",
    name: "Patrick Brown",
    title: "Mayor, City of Brampton",
    image: "src/assets/QuotesImages/DSC_1837.jpg",
  },
  {
    quote: "The city has been pleased with our work with SCOOTY to support the needs of transit riders and improve connections to and from transit stops across the city. Having multi-modal commuting options connected through a unified transit fare is essential to encourage residents and visitors of Brampton to use transit, attracting investment and promoting economic activity.",
    name: "Councillor Gurpartap Singh Toor",
    title: "Chair of Economic Development and Regional Councillor of Wards 9 & 10, City of Brampton",
    image: "src/assets/QuotesImages/City Hall Group Shot - Brampton Launch Photo (2).JPG",
  },
  {
    quote: "SCOOTY will help improve the first and last kilometre connectivity by providing another transportation option for people travelling to and from the City of Markham’s downtown district. We want to make sure that when you arrive here, that you get to your destination as easily, as efficiently and as accessible as possible, and that’s what SCOOTY does.",
    name: "Frank Scarpitti",
    title: "Mayor of Markham",
    image: "src/assets/QuotesImages/2024MarkhamOVINScootyDemo-048.jpg",
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

const textCardStyles = [
  { bg: 'bg-primary-500', quote: 'text-black/30', body: 'text-black/90', name: 'text-black', sub: 'text-black/55', divider: 'bg-black/25' },
  { bg: 'bg-indigo-700', quote: 'text-white/30', body: 'text-white/90', name: 'text-white', sub: 'text-indigo-200', divider: 'bg-indigo-400' },
  { bg: 'bg-rose-600', quote: 'text-white/30', body: 'text-white/90', name: 'text-white', sub: 'text-rose-200', divider: 'bg-rose-300' },
];

const QuoteTextCard = ({
  q,
  i,
  styleIdx,
  inView,
  onClick,
  className = '',
}: {
  q: typeof governmentQuotes[0];
  i: number;
  styleIdx: number;
  inView: boolean;
  onClick: () => void;
  className?: string;
}) => {
  const s = textCardStyles[styleIdx];
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
      onClick={onClick}
      className={`relative rounded-2xl p-5 sm:p-7 flex flex-col justify-between text-left cursor-pointer group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${s.bg} ${className}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div>
        <Quote className={`w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 ${s.quote}`} />
        <p className={`text-sm sm:text-base leading-relaxed line-clamp-4 font-medium ${s.body}`}>
          "{q.quote}"
        </p>
      </div>
      <div className="mt-6">
        <div className={`w-8 h-px mb-4 ${s.divider}`} />
        <p className={`font-bold text-sm ${s.name}`}>{q.name}</p>
        <p className={`text-xs mt-1 leading-snug ${s.sub}`}>{q.title}</p>
        <span className={`inline-flex items-center gap-1 mt-4 text-xs font-semibold group-hover:gap-2 transition-all duration-200 ${s.sub}`}>
          Read full quote <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.button>
  );
};

const QuoteImageCard = ({
  q,
  i,
  inView,
  onClick,
  className = '',
}: {
  q: typeof governmentQuotes[0];
  i: number;
  inView: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.97 }}
    animate={inView ? { opacity: 1, scale: 1 } : {}}
    transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
    onClick={onClick}
    className={`relative rounded-2xl overflow-hidden group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 h-full w-full ${className}`}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <img
      src={q.image}
      alt={q.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
    <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary-500 transition-all duration-300" />
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <Quote className="w-5 h-5 text-primary-500 mb-3" />
      <p className="text-white font-bold text-sm leading-snug">{q.name}</p>
      <p className="text-primary-400 text-xs mt-1">{q.title}</p>
      <p className="text-white/65 text-sm mt-3 line-clamp-3 leading-relaxed">"{q.quote}"</p>
      <span className="inline-flex items-center gap-1 mt-4 text-xs text-primary-400 font-semibold group-hover:gap-2 transition-all duration-200">
        Read full quote <ChevronRight className="w-3 h-3" />
      </span>
    </div>
  </motion.button>
);

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
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [quotesRef, quotesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
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
    <section id="impact" ref={ref} className="relative py-10 sm:py-20 ls:py-6 bg-gray-50 dark:bg-black overflow-hidden">

      {/* ── CORE VALUES ── */}
      <div ref={valuesRef} className="py-5 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              SCOOTY <span className="text-primary-500">Core Values</span>
            </h2>
            <div className="flex justify-center items-center gap-6 text-lg font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
              <span>Safety</span>
              <span className="text-primary-500">·</span>
              <span>Courtesy</span>
              <span className="text-primary-500">·</span>
              <span>Partnership</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {coreValues.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="bg-white dark:bg-black rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300">
                  <v.icon className="w-6 h-6 text-primary-500 group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-white-600 dark:text-gray-400 text-m leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GOVERNMENT QUOTES ── */}
      <div ref={quotesRef} className="py-16 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={quotesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-3">
              Voices of <span className="text-primary-500">Leadership</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto">
              What community and government leaders are saying about SCOOTY. Click any card to read the full quote.
            </p>
          </motion.div>

          {/* ── Mobile layout (< lg) ── */}
          <div className="lg:hidden flex flex-col gap-4">
            {/* Vic Fedeli — full-width image hero */}
            <QuoteImageCard
              q={governmentQuotes[1]} i={1}
              inView={quotesInView} onClick={() => setSelectedQuote(1)}
              className="h-72 sm:h-80"
            />
            {/* 2-col row: Sarkaria + Patrick Brown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuoteTextCard
                q={governmentQuotes[0]} i={0} styleIdx={0}
                inView={quotesInView} onClick={() => setSelectedQuote(0)}
                className="min-h-[220px]"
              />
              <QuoteTextCard
                q={governmentQuotes[2]} i={2} styleIdx={1}
                inView={quotesInView} onClick={() => setSelectedQuote(2)}
                className="min-h-[220px]"
              />
            </div>
            {/* 2-col row: Frank image + Councillor Toor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuoteImageCard
                q={governmentQuotes[4]} i={4}
                inView={quotesInView} onClick={() => setSelectedQuote(4)}
                className="h-64 sm:h-72"
              />
              <QuoteTextCard
                q={governmentQuotes[3]} i={3} styleIdx={2}
                inView={quotesInView} onClick={() => setSelectedQuote(3)}
                className="min-h-[220px]"
              />
            </div>
          </div>

          {/* ── Desktop collage (lg+): 3 cols × 2 rows ── */}
          {/* Layout: [Sarkaria] [Vic Fedeli tall] [Patrick Brown] / [Frank Scarpitti] [Vic continues] [Councillor Toor] */}
          <div
            className="hidden lg:grid grid-cols-3 gap-4"
            style={{ gridTemplateRows: 'repeat(2, minmax(300px, auto))' }}
          >
            <QuoteTextCard
              q={governmentQuotes[0]} i={0} styleIdx={0}
              inView={quotesInView} onClick={() => setSelectedQuote(0)}
            />
            <div className="row-span-2">
              <QuoteImageCard
                q={governmentQuotes[1]} i={1}
                inView={quotesInView} onClick={() => setSelectedQuote(1)}
              />
            </div>
            <QuoteTextCard
              q={governmentQuotes[2]} i={2} styleIdx={1}
              inView={quotesInView} onClick={() => setSelectedQuote(2)}
            />
            <QuoteImageCard
              q={governmentQuotes[4]} i={4}
              inView={quotesInView} onClick={() => setSelectedQuote(4)}
            />
            <QuoteTextCard
              q={governmentQuotes[3]} i={3} styleIdx={2}
              inView={quotesInView} onClick={() => setSelectedQuote(3)}
            />
          </div>
        </div>
      </div>

      {/* ── QUOTE MODAL ── */}
      <AnimatePresence>
        {selectedQuote !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-8"
            onClick={() => setSelectedQuote(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Drag handle (mobile only) */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 bg-white dark:bg-black">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
              </div>
              {/* Image header */}
              <div className="relative h-44 sm:h-72">
                <img
                  src={governmentQuotes[selectedQuote].image}
                  alt={governmentQuotes[selectedQuote].name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
                {/* Close button */}
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* Name overlay on image */}
                <div className="absolute bottom-5 left-6">
                  <p className="text-white font-bold text-lg leading-tight">{governmentQuotes[selectedQuote].name}</p>
                  <p className="text-primary-400 text-sm mt-0.5">{governmentQuotes[selectedQuote].title}</p>
                </div>
              </div>

              {/* Quote body */}
              <div className="bg-white dark:bg-black px-5 py-6 sm:px-7 sm:py-8">
                <Quote className="w-8 h-8 text-primary-500 mb-4" />
                <p className="text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
                  "{governmentQuotes[selectedQuote].quote}"
                </p>
                {/* Nav arrows */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                  <button
                    onClick={() => setSelectedQuote((selectedQuote - 1 + governmentQuotes.length) % governmentQuotes.length)}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs text-gray-400">{selectedQuote + 1} / {governmentQuotes.length}</span>
                  <button
                    onClick={() => setSelectedQuote((selectedQuote + 1) % governmentQuotes.length)}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* ── Our Partners heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
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
                <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-black">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Left — Text */}
                    <div className="p-6 sm:p-8 md:p-14 flex flex-col justify-center">
                      <span className="inline-block px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-5 tracking-wide uppercase w-fit"
                      >Building Communities Together</span>

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
