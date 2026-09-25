import { MobilityNetwork } from '../ui/mobility/MobilityNetwork';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { PartnerMarquee } from '../ui/PartnerMarquee';

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const partners = [
  { name: 'Metrolinx', logo: '/assets/partners-transparent/metrolinx.png', tagline: 'Transit Partner', accent: '#006E51' },
  { name: 'Markham', logo: '/assets/partners-transparent/markham.png', tagline: 'Municipality Partner', accent: '#00509E' },
  { name: 'Brampton', logo: '/assets/partners-transparent/brampton.png', tagline: 'Municipality Partner', accent: '#8B0000' },
  { name: 'Burlington', logo: '/assets/Partners/Marquee/burlington-logo.png', tagline: 'Municipality Partner', accent: '#006B3C' },
  { name: 'Richmond Hill', tagline: 'Municipality Partner', accent: '#6B4C9A' },
  { name: 'Barrie', logo: '/assets/partners-transparent/barrie.png', tagline: 'Municipality Partner', accent: '#1A4A7A' },
  { name: 'OVIN', tagline: 'Innovation Partner', accent: '#C56B18' },
  { name: 'TMU', logo: '/assets/Partners/Marquee/tmu-logo.jpg', tagline: 'Academic Partner', accent: '#002B5C' },
  { name: 'DMZ', tagline: 'Innovation Partner', accent: '#C56B18' },
];
// Municipalities scroll along the bottom row; transit, academic and innovation partners along the top.
const toMarquee = ({ name, logo }: (typeof partners)[number]) => ({ name, img: logo });
const municipal = (partner: (typeof partners)[number]) => partner.tagline === 'Municipality Partner';

const PartnerRail = () => (
  <section className="home-partners py-20 sm:py-28" aria-labelledby="home-partners-heading">
    <h2 id="home-partners-heading" className="mb-12 sm:mb-16 px-4 text-center text-3xl sm:text-4xl font-bold font-display text-gray-900 dark:text-white tracking-tight">
      Proud <span className="text-[#FEC001]">partners</span>
    </h2>
    <PartnerMarquee top={partners.filter(p => !municipal(p)).map(toMarquee)} bottom={partners.filter(municipal).map(toMarquee)} />
  </section>
);

export const Hero = () => {
  return (
    <>
    <section id="home" className="editorial-hero relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Full-width animated city behind the headline panel. */}
      <MobilityNetwork />

      {/* ── Main content ── */}
      <div className="editorial-hero-copy relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="editorial-hero-panel space-y-3 sm:space-y-4"
        >

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: EASING }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold font-display leading-[1.02] tracking-tight"
          >
            <span className="block text-white">Where Mobility</span>
            <span className="block text-[#FEC001]">Meets Intelligence</span>
          </motion.h1>

          <p className="text-2xl text-primary-400 font-display tracking-wide font-bold">
            <span className="text-white">We’re on a mission to  </span>power how cities move people.
          </p>

        </motion.div>
      </div>

      {/* ── Scroll nudge ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="editorial-hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="flex flex-col items-center gap-2 group cursor-pointer"
          aria-label="Scroll to solutions"
        >
          <span className="text-[9px] text-white/25 tracking-[0.25em] uppercase group-hover:text-white/50 transition-colors duration-300">
            Scroll
          </span>
          <div className="w-px h-5 bg-gradient-to-b from-white/25 to-transparent" />
          <ArrowDown className="w-3 h-3 text-white/25 group-hover:text-white/50 transition-colors duration-300" />
        </motion.button>
      </motion.div>
    </section>
    <PartnerRail />
    </>
  );
};
