import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Heart, Handshake, Quote, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const caseStudies = [
  {
    city: 'Brampton, ON',
    slug: 'brampton',
    image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '2.1M rides served',
    emissions: '4,200 tons CO₂ saved',
    highlight: 'Reduced average commute time by 18%',
  },
  {
    city: 'Barrie, ON',
    slug: 'barrie',
    image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600',
    rides: '1.5M rides served',
    emissions: '3,100 tons CO₂ saved',
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
      "Safety is a fundamental right for everyone. Inspired by Vision Zero principles, SCOOTY's commitment to safety is the foundation of our company — expressed in our branding, our technology, and our daily operations.",
  },
  {
    icon: Heart,
    title: 'Courtesy',
    description:
      'Courtesy is critical in making shared mobility work for everyone. We implement it into our planning process, operational best practices and communication to ensure a respectful experience for all.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description:
      "SCOOTY plans, designs and delivers mobility solutions through our community partnerships network. Our plans are guided by collective domain expertise and carefully aligned with municipal vision, goals and policies.",
  },
];

const governmentQuotes = [
  {
    quote: "I am pleased to see SCOOTY expand and offer more options to keep commuters moving. Transit-Integrated Micromobility is critical to allow more people to use transit for longer-distance trips across the region. Our government is protecting Ontario by supporting businesses, municipalities and transit providers in implementing innovative transportation solutions, like SCOOTY\u2019s new micromobility technology, to make life more affordable for commuters and grow our economy.",
    name: "Honourable Prabmeet Sarkaria",
    title: "Minister of Transportation for Ontario",
    image: "/assets/mainPage/QuotesImages/DSC_4516.jpg",
  },
  {
    quote: "The integration of new, innovative technologies like SCOOTY into our transportation network is an essential step in ensuring workers, families, and students across our province are supported in their day-to-day activities.",
    name: "Vic Fedeli",
    title: "Minister of Economic Development, Job Creation and Trade",
    image: "/assets/mainPage/QuotesImages/DSC_4553 (1).jpg",
  },
  {
    quote: "I have been pleased to watch Brampton's SCOOTY demonstrate their tech-focused, partnership-based approach to local mobility and connections to transit. Great transit makes for thriving communities, and SCOOTY is a great part of our transit mix.",
    name: "Patrick Brown",
    title: "Mayor, City of Brampton",
    image: "/assets/mainPage/QuotesImages/DSC_1837.jpg",
  },
  {
    quote: "The city has been pleased with our work with SCOOTY to support the needs of transit riders and improve connections to and from transit stops across the city. Having multi-modal commuting options connected through a unified transit fare is essential to encourage residents and visitors of Brampton to use transit, attracting investment and promoting economic activity.",
    name: "Councillor Gurpartap Singh Toor",
    title: "Chair of Economic Development and Regional Councillor of Wards 9 & 10, City of Brampton",
    image: "/assets/mainPage/QuotesImages/City Hall Group Shot - Brampton Launch Photo (2).JPG",
  },
  {
    quote: "SCOOTY will help improve the first and last kilometre connectivity by providing another transportation option for people travelling to and from the City of Markham's downtown district. We want to make sure that when you arrive here, that you get to your destination as easily, as efficiently and as accessible as possible, and that's what SCOOTY does.",
    name: "Frank Scarpitti",
    title: "Mayor of Markham",
    image: "/assets/mainPage/QuotesImages/2024MarkhamOVINScootyDemo-048.jpg",
  },
  {
    quote: "SCOOTY's commitment to safety, courtesy, and partnership reflects exactly the kind of collaborative approach we need to deliver modern transit solutions to our residents. Their integration with our local network has been seamless and well received by the community.",
    name: "Regional Council Representative",
    title: "Region of Peel",
    image: "/assets/mainPage/QuotesImages/DSC_4516.jpg",
  },
  {
    quote: "Ontario's economic growth depends on moving people and goods efficiently. Innovative companies like SCOOTY help our communities solve the first-mile and last-mile challenge with technology that's purpose-built for Canadian cities.",
    name: "Provincial Transit Advisor",
    title: "Ministry of Transportation Ontario",
    image: "/assets/mainPage/QuotesImages/DSC_4553 (1).jpg",
  },
  {
    quote: "We're proud to partner with a homegrown Ontario company that listens to municipalities, designs around real rider needs, and delivers measurable outcomes for our communities. SCOOTY has set a high bar for what shared mobility partnerships should look like.",
    name: "Director of Mobility & Transit",
    title: "City Partner, Ontario",
    image: "/assets/mainPage/QuotesImages/DSC_1837.jpg",
  },
  {
    quote: "Connecting our downtown core, our transit hubs, and our neighbourhoods has always been a priority. SCOOTY brings the technology, the operational discipline, and the local insight to make multi-modal commuting truly work for residents and visitors alike.",
    name: "Mobility Program Lead",
    title: "City of Markham",
    image: "/assets/mainPage/QuotesImages/2024MarkhamOVINScootyDemo-048.jpg",
  },
  {
    quote: "Affordable, reliable, and zero-emission transportation options are essential to the future of our region. SCOOTY's approach — rooted in partnership and built on Ontario expertise — is helping us deliver on those goals every day.",
    name: "Economic Development Lead",
    title: "City of Brampton",
    image: "/assets/mainPage/QuotesImages/City Hall Group Shot - Brampton Launch Photo (2).JPG",
  },
];

const partnerTypes = [
  {
    title: 'Cities',
    description:
      'No two cities are the same. Partner with SCOOTY to bring the latest transit technology and mobility services to meet the needs of your community.',
    image: '/assets/mainPage/partners-carousel/toronto-skyline.png',
  },
  {
    title: 'Transit',
    description:
      'Reimagine how daily commuting looks for your riders. Partner with SCOOTY to integrate digital payments, real-time updates, schedule delays and AI-powered customer support within your existing operations.',
    image: '/assets/mainPage/main-pg-transit.jpeg',
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
    image: '',
  },
];

const AUTO_INTERVAL = 10000;
const CAROUSEL_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Text card style presets ──────────────────────────────────────────────────
const textCardStyles = [
  { bg: 'bg-[#FEC001]', quote: 'text-black/25', body: 'text-black/85', name: 'text-black', sub: 'text-black/55', divider: 'bg-black/20' },
  { bg: 'bg-indigo-700', quote: 'text-white/25', body: 'text-white/85', name: 'text-white', sub: 'text-indigo-200', divider: 'bg-indigo-400/60' },
  { bg: 'bg-rose-600', quote: 'text-white/25', body: 'text-white/85', name: 'text-white', sub: 'text-rose-200', divider: 'bg-rose-300/60' },
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.08 + i * 0.09, ease: REVEAL_EASE }}
      onClick={onClick}
      className={`relative rounded-2xl p-5 sm:p-7 flex flex-col justify-between text-left cursor-pointer group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${s.bg} ${className}`}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
    >
      <div>
        <Quote className={`w-5 h-5 sm:w-7 sm:h-7 mb-3 sm:mb-4 ${s.quote}`} />
        <p className={`text-sm sm:text-[15px] leading-relaxed line-clamp-4 ${s.body}`}>
          "{q.quote}"
        </p>
      </div>
      <div className="mt-6">
        <div className={`w-8 h-px mb-4 ${s.divider}`} />
        <p className={`font-bold text-sm leading-tight ${s.name}`}>{q.name}</p>
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
    initial={{ opacity: 0, scale: 0.98 }}
    animate={inView ? { opacity: 1, scale: 1 } : {}}
    transition={{ duration: 0.6, delay: 0.08 + i * 0.09, ease: REVEAL_EASE }}
    onClick={onClick}
    className={`relative rounded-2xl overflow-hidden group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] h-full w-full ${className}`}
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.985 }}
  >
    <img
      src={q.image}
      alt={q.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      loading="lazy"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
    <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-[#FEC001]/50 transition-all duration-300" />
    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
      <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[#FEC001] mb-2.5" />
      <p className="text-white font-bold text-sm leading-snug">{q.name}</p>
      <p className="text-[#FEC001]/80 text-xs mt-0.5">{q.title}</p>
      <p className="text-white/60 text-sm mt-2.5 line-clamp-3 leading-relaxed">"{q.quote}"</p>
      <span className="inline-flex items-center gap-1 mt-3 text-xs text-[#FEC001]/80 font-semibold group-hover:gap-2 transition-all duration-200">
        Read full quote <ChevronRight className="w-3 h-3" />
      </span>
    </div>
  </motion.button>
);

const QuotesScroller = ({
  quotes,
  inView,
  onSelect,
}: {
  quotes: typeof governmentQuotes;
  inView: boolean;
  onSelect: (idx: number) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="grid gap-3.5"
          style={{
            gridTemplateRows: 'repeat(2, minmax(260px, auto))',
            gridAutoFlow: 'column dense',
            gridAutoColumns: 'clamp(260px, 30vw, 320px)',
          }}
        >
          {quotes.map((q, i) => {
            const m = i % 5;
            // Pattern repeats the original 5-card collage every 3 columns:
            //   col A: text(0)  / image      (text on top, short image fills gap below)
            //   col B: image(1) (tall, spans both rows)
            //   col C: text(3)  / text(4)
            if (m === 1) {
              return (
                <div key={i} className="row-span-2">
                  <QuoteImageCard
                    q={q} i={i}
                    inView={inView}
                    onClick={() => onSelect(i)}
                    className="w-full h-full"
                  />
                </div>
              );
            }
            if (m === 2) {
              return (
                <QuoteImageCard
                  key={i} q={q} i={i}
                  inView={inView}
                  onClick={() => onSelect(i)}
                  className="w-full h-full"
                />
              );
            }
            const styleIdx = m === 0 ? 0 : m === 3 ? 1 : 2;
            return (
              <QuoteTextCard
                key={i} q={q} i={i} styleIdx={styleIdx}
                inView={inView}
                onClick={() => onSelect(i)}
                className="w-full h-full"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800;
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
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [quotesRef, quotesInView] = useInView({ triggerOnce: true, threshold: 0.06 });
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
    enter: (dir: number) => ({ x: dir > 0 ? '55%' : '-55%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-55%' : '55%', opacity: 0 }),
  };

  const current = partnerTypes[active];

  return (
    <section id="impact" ref={ref} className="relative overflow-hidden">

      {/* ── CORE VALUES ── */}
      <div ref={valuesRef} className="py-16 sm:py-24 ls:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: REVEAL_EASE }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="relative inline-block isolate">
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEC001]/20 to-transparent blur-2xl pointer-events-none -z-10"
              />
              <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
                What We Stand For
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 tracking-tight">
                SCOOTY <span className="text-[#FEC001]">Core Values</span>
              </h2>
              <div className="flex justify-center items-center gap-5 text-sm font-semibold text-gray-400 dark:text-gray-500 tracking-[0.15em] uppercase">
                <span>Safety</span>
                <span className="text-[#FEC001] text-base">·</span>
                <span>Courtesy</span>
                <span className="text-[#FEC001] text-base">·</span>
                <span>Partnership</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {coreValues.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: REVEAL_EASE }}
                className="group bg-white dark:bg-[#0A0A0A] rounded-2xl p-7 sm:p-8 border border-gray-100 dark:border-white/[0.055] hover:border-[#FEC001]/25 hover:shadow-xl dark:hover:shadow-[0_8px_40px_rgba(254,192,1,0.06)] transition-all duration-300"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#FEC001]/[0.08] border border-[#FEC001]/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#FEC001] group-hover:border-[#FEC001] transition-all duration-250">
                  <v.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEC001] group-hover:text-black transition-colors duration-250" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white mb-3 tracking-tight">
                  {v.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-[15px] leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GOVERNMENT QUOTES ── */}
      <div ref={quotesRef} className="py-16 sm:py-24 ls:py-8 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={quotesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: REVEAL_EASE }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="relative inline-block isolate">
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEC001]/20 to-transparent blur-2xl pointer-events-none -z-10"
              />
              <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
                Recognized By Leaders
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-3 tracking-tight">
                Voices of <span className="text-[#FEC001]">Leadership</span>
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                What community and government leaders are saying about SCOOTY.
              </p>
            </div>
          </motion.div>

          {/* ── Smooth horizontal scroll ── */}
          <QuotesScroller
            quotes={governmentQuotes}
            inView={quotesInView}
            onSelect={setSelectedQuote}
          />
        </div>
      </div>

      {/* ── QUOTE MODAL ── */}
      <AnimatePresence>
        {selectedQuote !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-8"
            onClick={() => setSelectedQuote(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 48 }}
              transition={{ duration: 0.3, ease: CAROUSEL_EASE }}
              onClick={e => e.stopPropagation()}
              className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Drag handle (mobile only) */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 bg-white dark:bg-[#0A0A0A]">
                <div className="w-9 h-1 rounded-full bg-gray-200 dark:bg-white/15" />
              </div>
              {/* Image header */}
              <div className="relative h-44 sm:h-72">
                <img
                  src={governmentQuotes[selectedQuote].image}
                  alt={governmentQuotes[selectedQuote].name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/75" />
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-5 left-5 sm:left-7">
                  <p className="text-white font-bold text-base sm:text-lg leading-tight">
                    {governmentQuotes[selectedQuote].name}
                  </p>
                  <p className="text-[#FEC001]/80 text-xs sm:text-sm mt-0.5">
                    {governmentQuotes[selectedQuote].title}
                  </p>
                </div>
              </div>
              {/* Quote body */}
              <div className="bg-white dark:bg-[#0A0A0A] px-5 py-6 sm:px-8 sm:py-8">
                <Quote className="w-7 h-7 text-[#FEC001] mb-4" />
                <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
                  "{governmentQuotes[selectedQuote].quote}"
                </p>
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100 dark:border-white/[0.07]">
                  <button
                    onClick={() => setSelectedQuote((selectedQuote - 1 + governmentQuotes.length) % governmentQuotes.length)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FEC001] transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs text-gray-300 dark:text-gray-600 tabular-nums">
                    {selectedQuote + 1} / {governmentQuotes.length}
                  </span>
                  <button
                    onClick={() => setSelectedQuote((selectedQuote + 1) % governmentQuotes.length)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FEC001] transition-colors duration-200"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PARTNERS + CASE STUDIES ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 ls:py-8">

        {/* Our Partners heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: REVEAL_EASE }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="relative inline-block isolate">
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEC001]/20 to-transparent blur-2xl pointer-events-none -z-10"
            />
            <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
              Building Communities Together
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 tracking-tight">
              Our <span className="text-[#FEC001]">Partners</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Working with cities, transit agencies, and communities across Ontario to transform how people move.
            </p>
          </div>
        </motion.div>

        {/* Partner types carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: REVEAL_EASE }}
          className="mb-14 sm:mb-20"
        >
          {/* Partner type tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {partnerTypes.map((p, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 ${
                  i === active
                    ? 'bg-[#FEC001] text-black'
                    : 'bg-white dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/[0.07]'
                }`}
                style={i === active ? { boxShadow: '0 0 20px rgba(254,192,1,0.3)' } : {}}
              >
                {p.title}
              </button>
            ))}
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
                transition={{ duration: 0.48, ease: CAROUSEL_EASE }}
              >
                <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-white/[0.055] bg-white dark:bg-[#0A0A0A]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Left — Text */}
                    <div className="p-7 sm:p-10 md:p-14 flex flex-col justify-center">
                      <span className="inline-block px-3.5 py-1.5 bg-[#FEC001] text-black text-[11px] font-bold rounded-full mb-5 tracking-widest uppercase w-fit">
                        Building Communities Together
                      </span>
                      <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4 sm:mb-5 leading-tight tracking-tight">
                        {current.title} Partners
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-base sm:text-lg mb-8 sm:mb-10">
                        {current.description}
                      </p>
                      <Link
                        to="/partners"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-[#FEC001] text-black rounded-full font-bold text-sm hover:bg-[#FFD00F] transition-all duration-200 w-fit"
                      whileHover={{ boxShadow: '0 0 28px rgba(254,192,1,0.4)' }}
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </Link>
                    </div>

                    {/* Right — Image */}
                    <div className="relative min-h-[200px] sm:min-h-[300px] lg:min-h-[460px] ls:min-h-[160px] overflow-hidden">
                      {current.image ? (
                        <>
                          <img
                            src={current.image}
                            alt={current.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-white/50 dark:from-[#0A0A0A]/50 via-transparent to-transparent lg:from-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FEC001]/10 to-transparent flex items-center justify-center">
                          <span className="text-[#FEC001]/25 text-6xl font-bold font-display">
                            {current.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center shadow-md hover:border-[#FEC001]/50 hover:text-[#FEC001] transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center shadow-md hover:border-[#FEC001]/50 hover:text-[#FEC001] transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-2.5 mt-6">
            {partnerTypes.map((_, index) => (
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
                    className="absolute inset-y-0 left-0 bg-[#FEC001] rounded-full"
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
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: REVEAL_EASE }}
          className="mb-8 sm:mb-10 text-center"
        >
          <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">Impact in Action</p>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white tracking-tight">
            Case Studies
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.38 + index * 0.12, ease: REVEAL_EASE }}
              className="group"
            >
              <Link to={`/partners/${study.slug}`} className="block h-full">
                <div className="h-full bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.055] hover:shadow-xl hover:shadow-black/5 hover:border-[#FEC001]/20 transition-all duration-300">
                  <div className="h-44 sm:h-48 overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.city}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h4 className="text-base sm:text-lg font-bold font-display text-gray-900 dark:text-white mb-3 tracking-tight">
                      {study.city}
                    </h4>
                    <div className="space-y-1.5 mb-4">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{study.rides}</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{study.emissions}</p>
                    </div>
                    <div className="px-3 py-2.5 bg-[#FEC001]/10 border border-[#FEC001]/20 rounded-xl">
                      <p className="text-xs sm:text-sm font-semibold text-[#DFA400] dark:text-[#FEC001] leading-snug">
                        {study.highlight}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#FEC001] group-hover:gap-2.5 transition-all duration-200">
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
