import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { SiteImage } from '../ui/SiteImage';
import { EditorialCarousel } from '../ui/EditorialCarousel';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

const solutions = products;
type Solution = (typeof solutions)[number];

const REVEAL = [0.16, 1, 0.3, 1] as const;

/**
 * Everything around the cards on desktop (section padding, heading, caption, pagination, navbar);
 * the cards take what's left of the screen height so the whole section fits in one view.
 */
const DESKTOP_CHROME = 520;

/** The active solution's copy, set under the carousel and aligned with the active card. */
const SolutionCaption = ({ solution }: { solution: Solution }) => (
  <div className="grid gap-3 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] md:gap-10 lg:gap-14">
    <div>
      <span
        className="inline-block px-2.5 py-0.5 text-black text-[10px] font-bold rounded-full mb-2.5 tracking-widest uppercase"
        style={{ backgroundColor: solution.accent }}
      >
        {solution.tag}
      </span>
      <h3 className="font-bold font-display text-gray-900 dark:text-white leading-[1.1] tracking-tight text-xl sm:text-2xl">
        {solution.title}
      </h3>
    </div>
    <div className="flex flex-col items-start gap-4 md:pt-7">
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm sm:text-[15px]">
        {solution.description}
      </p>
      <Link
        to={`/products/${solution.slug}`}
        draggable={false}
        className="group/cta inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] text-black"
        style={{ backgroundColor: solution.accent }}
      >
        <span>Learn More</span>
        <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-150" />
      </Link>
    </div>
  </div>
);

export const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="services" ref={ref} className="relative isolate overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: REVEAL }}
          className="max-w-2xl mb-6 sm:mb-8"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-2">
            Scooty Transit Platform
          </p>
          <h2 id="solutions-heading" className="text-3xl sm:text-4xl font-bold font-display text-gray-900 dark:text-white mb-2 tracking-tight">
            Our <span className="text-[#FEC001]">Solutions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            End-to-end technology platform powering the next generation of urban mobility.
          </p>
        </motion.div>
      </div>

      <EditorialCarousel
        items={solutions}
        getKey={(s) => s.slug}
        getLabel={(s) => s.tag}
        getAccent={(s) => s.accent}
        getBackdrop={(s) => s.backdrop ?? '#181916'}
        fitChrome={DESKTOP_CHROME}
        revealed={inView}
        labelledBy="solutions-heading"
        trackId="solutions-track"
        renderSlide={(solution, active) => (
          <SiteImage
            src={solution.image}
            alt={solution.alt}
            draggable={false}
            // Illustrations are shown whole, letterboxed on their own backdrop colour.
            className={`w-full h-full transition-[filter] duration-500 ${solution.image.endsWith('.svg') ? 'object-contain' : 'object-cover'} ${
              active ? '' : 'saturate-[.75] group-hover/card:saturate-100'
            }`}
            style={{ objectPosition: solution.position }}
          />
        )}
        renderCaption={(solution) => <SolutionCaption solution={solution} />}
      />
    </section>
  );
};
