import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Heart, Handshake, Quote, X, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { governmentQuotes } from '../../data/projects';

const MapleLeafSVG = ({ className = '' }: { className?: string }) => (
  <svg viewBox="-2015 -2000 4030 4030" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" />
  </svg>
);

const coreValues = [
  {
    icon: Shield,
    title: 'Safety',
    description:
      "Safety is a fundamental right for everyone. Inspired by Vision Zero principles, SCOOTY's commitment to safety is the foundation of our company — expressed in our branding, our technology, and our daily operations.",
    practices: ['High-visibility livery', 'Geofencing speed control', 'Double hand brakes', 'Running lights & signals'],
  },
  {
    icon: Heart,
    title: 'Courtesy',
    description:
      'Courtesy is critical in making shared mobility work for everyone. We implement it into our planning process, operational best practices and communication to ensure a respectful experience for all.',
    practices: ['Rider onboarding education', 'Community engagement', 'Pedestrian priority', 'Respectful operations'],
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description:
      "SCOOTY plans, designs and delivers mobility solutions through our community partnerships network. Our plans are guided by collective domain expertise and carefully aligned with municipal vision, goals and policies.",
    practices: ['Municipal alignment', 'Transit integration', 'Local insights', 'Tailored deployments'],
  },
];

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
  // styleIdx 0 is the yellow card — a white ring is invisible on it, so use black.
  const ringColor = styleIdx === 0 ? 'focus-visible:ring-black' : 'focus-visible:ring-white';
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.08 + i * 0.09, ease: REVEAL_EASE }}
      onClick={onClick}
      className={`relative rounded-2xl p-5 sm:p-7 flex flex-col justify-between text-left cursor-pointer group h-full focus:outline-none focus-visible:ring-2 ${ringColor} ${s.bg} ${className}`}
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
    className={`relative rounded-2xl overflow-hidden group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] focus-visible:ring-offset-2 focus-visible:ring-offset-black h-full w-full ${className}`}
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

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide pb-4 scroll-smooth overscroll-x-contain overscroll-y-auto"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y pan-x' }}
      >
        <div
          className="grid gap-3.5 px-4 sm:px-6 lg:px-8"
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

export const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [quotesRef, quotesInView] = useInView({ triggerOnce: true, threshold: 0.06 });
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [expandedValue, setExpandedValue] = useState<number | null>(null);

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
              <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 gap-y-1 px-2 text-[11px] sm:text-sm font-semibold text-gray-400 dark:text-gray-500 tracking-[0.12em] sm:tracking-[0.15em] uppercase">
                <span>Safety</span>
                <span className="text-[#FEC001] text-base">·</span>
                <span>Courtesy</span>
                <span className="text-[#FEC001] text-base">·</span>
                <span>Partnership</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {coreValues.map((v, i) => {
              const isCourtesy = v.title === 'Courtesy';
              const isOutlined = v.title === 'Safety' || v.title === 'Partnership';
              const cardClasses = isCourtesy
                ? 'group bg-[#FEC001] rounded-2xl p-7 sm:p-8 border border-[#FEC001] hover:shadow-xl dark:hover:shadow-[0_8px_40px_rgba(254,192,1,0.2)] transition-all duration-300'
                : isOutlined
                  ? 'group bg-white dark:bg-[#0A0A0A] rounded-2xl p-7 sm:p-8 border-2 border-[#FEC001] hover:border-[#FEC001] hover:shadow-xl dark:hover:shadow-[0_8px_40px_rgba(254,192,1,0.1)] transition-all duration-300'
                  : 'group bg-white dark:bg-[#0A0A0A] rounded-2xl p-7 sm:p-8 border border-gray-100 dark:border-white/[0.055] hover:border-[#FEC001]/25 hover:shadow-xl dark:hover:shadow-[0_8px_40px_rgba(254,192,1,0.06)] transition-all duration-300';
              const iconWrapClasses = isCourtesy
                ? 'w-11 h-11 sm:w-12 sm:h-12 bg-black/10 border border-black/15 rounded-xl flex items-center justify-center mb-5 transition-all duration-250'
                : 'w-11 h-11 sm:w-12 sm:h-12 bg-[#FEC001]/[0.08] border border-[#FEC001]/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#FEC001] group-hover:border-[#FEC001] transition-all duration-250';
              const iconClasses = isCourtesy
                ? 'w-5 h-5 sm:w-6 sm:h-6 text-black transition-colors duration-250'
                : 'w-5 h-5 sm:w-6 sm:h-6 text-[#FEC001] group-hover:text-black transition-colors duration-250';
              const titleClasses = isCourtesy
                ? 'text-lg sm:text-xl font-bold font-display text-black mb-3 tracking-tight'
                : 'text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white mb-3 tracking-tight';
              const descClasses = isCourtesy
                ? 'text-black/80 text-sm sm:text-[15px] leading-relaxed'
                : 'text-gray-500 dark:text-gray-400 text-sm sm:text-[15px] leading-relaxed';
              const isExpanded = expandedValue === i;
              const toggleClasses = isCourtesy
                ? 'inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-black/70 hover:text-black tracking-wider uppercase transition-colors'
                : 'inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-[#FEC001] hover:text-[#FFD00F] tracking-wider uppercase transition-colors';
              const chipClasses = isCourtesy
                ? 'inline-flex items-center px-3 py-1.5 rounded-full bg-black/10 border border-black/15 text-[11px] font-semibold text-black/80'
                : 'inline-flex items-center px-3 py-1.5 rounded-full bg-[#FEC001]/10 border border-[#FEC001]/25 text-[11px] font-semibold text-gray-700 dark:text-gray-200';
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: REVEAL_EASE }}
                  className={cardClasses}
                >
                  <motion.div layout="position">
                    <div className={iconWrapClasses}>
                      <v.icon className={iconClasses} />
                    </div>
                    <h3 className={titleClasses}>
                      {v.title}
                    </h3>
                    <p className={descClasses}>
                      {v.description}
                    </p>
                  </motion.div>

                  <button
                    onClick={() => setExpandedValue(isExpanded ? null : i)}
                    className={toggleClasses}
                    aria-expanded={isExpanded}
                  >
                    <motion.span
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </motion.span>
                    {isExpanded ? 'Hide details' : 'See in action'}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="practices"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: REVEAL_EASE }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="flex flex-wrap gap-2 pt-4 mt-1"
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.05 } },
                          }}
                        >
                          {v.practices.map((p, pi) => (
                            <motion.span
                              key={pi}
                              variants={{
                                hidden: { opacity: 0, y: 6 },
                                show: { opacity: 1, y: 0 },
                              }}
                              transition={{ duration: 0.25, ease: REVEAL_EASE }}
                              className={chipClasses}
                            >
                              {p}
                            </motion.span>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white tracking-tight">
                What people are saying about <span className="text-[#FEC001]">SCOOTY</span>
              </h2>
            </div>
          </motion.div>
        </div>

        {/* ── Edge-to-edge horizontal scroll (sideways only) ── */}
        <QuotesScroller
          quotes={governmentQuotes}
          inView={quotesInView}
          onSelect={setSelectedQuote}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── BUILT PROUDLY IN ONTARIO ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={quotesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: REVEAL_EASE }}
            className="relative isolate text-center mt-14 sm:mt-20 pt-10 sm:pt-12 border-t border-gray-100 dark:border-white/[0.05]"
          >
            {/* Soft round glow — same colour as the city animation so it blends seamlessly */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(254,192,1,0.09), rgba(254,192,1,0.04) 32%, rgba(254,192,1,0) 60%), radial-gradient(circle at 50% 50%, rgba(7,7,16,0.82), rgba(7,7,16,0.6) 20%, rgba(7,7,16,0.34) 40%, rgba(7,7,16,0.15) 60%, rgba(7,7,16,0.05) 76%, rgba(7,7,16,0) 90%)',
              }}
            />
            <div className="relative inline-block">
              <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
                Our Story
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white tracking-tight">
                  Built Proudly in <span className="text-yellow-500">Ontario</span>
                </h2>
                <MapleLeafSVG className="w-9 h-10 sm:w-11 sm:h-12 text-red-500 dark:text-red-400 flex-shrink-0" />
              </div>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                SCOOTY is a 100% owned and operated Canadian company built and developed with local talent that has world-class experience, right here in Ontario. We live in the communities we serve — so we have a deep sense of ownership and passion to bring the latest mobility solutions that meet the needs of our communities.
              </p>
            </div>
          </motion.div>
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
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] transition-colors"
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
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FEC001] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs text-gray-300 dark:text-gray-600 tabular-nums">
                    {selectedQuote + 1} / {governmentQuotes.length}
                  </span>
                  <button
                    onClick={() => setSelectedQuote((selectedQuote + 1) % governmentQuotes.length)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FEC001] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEC001] transition-colors duration-200"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CASE STUDIES ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 ls:py-8">

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
