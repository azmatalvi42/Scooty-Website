import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef } from 'react';
import {
  ArrowRight,
  MapPin,
  Bot,
  Bus,
  Navigation,
  Zap,
  Route,
  ShieldCheck,
  Radio,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '../components/ui/ParticleBackground';
import { SiteImage } from '../components/ui/SiteImage';
import { OnDemandDemo } from '../components/tech/OnDemandDemo';
import { PatchforceDemo } from '../components/tech/PatchforceDemo';
import { RideGuideDemo } from '../components/tech/RideGuideDemo';

/* ── Reusable section wrapper ── */
const useSection = () => useInView({ triggerOnce: true, threshold: 0.1 });

/* ── Product model ─────────────────────────────────────────────
   Every string below is drawn from the page's own approved copy or
   the interactive visuals above — no fabricated metrics or claims. */
type Feature = { icon: LucideIcon; label: string };
type Product = {
  id: string;
  n: string;
  icon: LucideIcon;
  shortName: string;
  tagline: string;
  titleTop: string;
  titleAccent: string;
  titleBottom?: string;
  description: string;
  features: Feature[];
  cta: { label: string; href: string };
  Visual: () => JSX.Element;
};

const PRODUCTS: Product[] = [
  {
    id: 'on-demand',
    n: '01',
    icon: Zap,
    shortName: 'On-Demand Mobility',
    tagline: 'Closing the first & last-km gap, on demand.',
    titleTop: 'SCOOTY',
    titleAccent: 'On-Demand',
    titleBottom: 'Mobility',
    description:
      'Improving the reach of regional transit by resolving the first-and-last-km service gap through on-demand mobility (Transit to Your Doorstep®).',
    features: [
      { icon: Route, label: 'First & last-km' },
      { icon: Bus, label: 'Bus · LRT · GO Train' },
      { icon: Navigation, label: 'Door-to-door' },
    ],
    cta: { label: 'Learn More', href: '/riders' },
    Visual: OnDemandDemo,
  },
  {
    id: 'patchforce',
    n: '02',
    icon: Layers,
    shortName: 'Patchforce',
    tagline: 'From resident report to documented repair.',
    titleTop: '',
    titleAccent: 'Patchforce',
    description:
      'AI-native reporting and operations for municipal public works. A resident’s photo becomes a ranked, routed and fully documented repair.',
    features: [
      { icon: MapPin, label: 'Resident reports' },
      { icon: Zap, label: 'Ranked & routed' },
      { icon: ShieldCheck, label: 'Fully documented' },
    ],
    cta: { label: 'Learn More', href: '/products/patchforce' },
    Visual: PatchforceDemo,
  },
  {
    id: 'rideguide',
    n: '03',
    icon: Bot,
    shortName: 'AI RideGuide',
    tagline: 'Conversational, real-time transit intelligence.',
    titleTop: 'SCOOTY AI',
    titleAccent: 'RideGuide',
    description:
      'Using conversational AI, real-time service updates, dynamic routing and customer support to enhance the daily transit commuting experience.',
    features: [
      { icon: Bot, label: 'Conversational AI' },
      { icon: Radio, label: 'Real-time updates' },
      { icon: Route, label: 'Dynamic routing' },
    ],
    cta: { label: 'Learn More', href: '/partners' },
    Visual: RideGuideDemo,
  },
];

/* ── Feature chip row ── */
const FeatureChips = ({ features }: { features: Feature[] }) => (
  <div className="flex flex-wrap gap-2.5 mb-9">
    {features.map((f) => (
      <span
        key={f.label}
        className="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-gray-300"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500/12">
          <f.icon className="w-3 h-3 text-primary-400" />
        </span>
        {f.label}
      </span>
    ))}
  </div>
);

/* ── Products overview (delivers the hero's "three products, one platform" promise) ── */
const ProductIndex = ({ products }: { products: Product[] }) => {
  const [ref, inView] = useSection();
  return (
    <section className="relative bg-black pt-24 pb-8 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white leading-tight">
            Three products working as one
          </h2>
          <p className="text-gray-400 mt-4 text-base sm:text-lg leading-relaxed">
            On-demand mobility, AI-native public works, and AI transit intelligence — built to move
            people the entire way, not just part of it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.a
              key={p.id}
              href={`#${p.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-7 hover:border-primary-500/40 hover:bg-white/[0.05] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 transition-colors duration-300">
                  <p.icon className="w-6 h-6 text-primary-400 group-hover:text-black transition-colors duration-300" />
                </div>
                <span className="text-5xl font-black font-display leading-none text-white/[0.06] group-hover:text-primary-500/25 transition-colors duration-300">
                  {p.n}
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">{p.shortName}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{p.tagline}</p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-400">
                Explore
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── One product section (alternating layout, data-driven) ── */
const ProductSection = ({ product, index }: { product: Product; index: number }) => {
  const navigate = useNavigate();
  const [ref, inView] = useSection();
  const reversed = index % 2 === 1; // 02 puts the visual on the left
  const tone = reversed ? 'bg-gray-950' : 'bg-black';
  const { Visual } = product;

  const text = (
    <motion.div
      initial={{ opacity: 0, x: reversed ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={reversed ? 'order-1 lg:order-2' : ''}
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500 text-black text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
        <product.icon className="w-3.5 h-3.5" />
        Product {product.n}
      </div>
      <h2 className="text-5xl md:text-6xl font-bold font-display text-white leading-tight mb-6">
        {product.titleTop && <>{product.titleTop}<br /></>}
        <span className="text-primary-500">{product.titleAccent}</span>
        {product.titleBottom && (
          <>
            <br />
            {product.titleBottom}
          </>
        )}
      </h2>
      <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">{product.description}</p>
      <FeatureChips features={product.features} />
      <motion.button
        onClick={() => navigate(product.cta.href)}
        className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300 shadow-lg shadow-primary-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{product.cta.label}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );

  const visual = (
    <motion.div
      initial={{ opacity: 0, x: reversed ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={reversed ? 'order-2 lg:order-1' : ''}
    >
      <Visual />
    </motion.div>
  );

  return (
    <section id={product.id} ref={ref} className={`relative py-28 scroll-mt-24 overflow-hidden ${tone}`}>
      {/* Texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: reversed
            ? 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
          backgroundSize: reversed ? '60px 60px' : '30px 30px',
        }}
      />
      <div
        className={`absolute top-0 h-full w-1/2 from-primary-500/[0.04] to-transparent ${
          reversed ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'
        }`}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {text}
          {visual}
        </div>
      </div>
    </section>
  );
};

/* ── Main page ── */
export const TechnologyPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [ctaRef, ctaInView] = useSection();

  return (
    <div className="relative min-h-screen bg-black">
      <ParticleBackground absolute />

      {/* ── HERO ── */}
      <section ref={heroRef} className="technology-hero relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <SiteImage
            src="/assets/mainPage/built-for-riders-hero.png"
            alt="A SCOOTY e-scooter parked on the waterfront with the Toronto skyline behind it"
            className="w-full h-full object-cover"
            // Keep the scooter in frame on narrow screens, where the photo is cropped hardest.
            style={{ objectPosition: '72% center' }}
            sizes="100vw"
            fetchPriority="high"
            loading="eager"
          />
        </motion.div>
        {/* Cinematic overlay stack — darken, vignette, brand wash, bottom fade to black.
           The photo is a bright golden-hour scene, so the centre carries an extra
           scrim to keep the headline legible over the sun flare. */}
        <div className="absolute inset-0 bg-black/45" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(75% 70% at 50% 52%, rgba(0,0,0,0.55) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 90% at 50% 25%, transparent 35%, rgba(0,0,0,0.6) 100%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-primary-500/[0.06] blur-[120px] rounded-full pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(254,192,1,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(254,192,1,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
        >

          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-display text-white leading-[1.05] tracking-tight mb-5 [filter:drop-shadow(0_2px_20px_rgba(0,0,0,0.9))]"
          >
            Built for the <span className="text-[#FEC001]">Future</span>
            <br />of Transit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-7 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]"
          >
            Three products. One platform. Connecting communities through on-demand mobility, AI-native public works, and AI-powered transit intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => document.getElementById('on-demand')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-7 py-4 bg-[#FEC001] text-black rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FEC001]/25 hover:bg-[#FFD00F] transition-colors"
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(254,192,1,0.45)' }}
              whileTap={{ scale: 0.96 }}
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/partners')}
              className="px-7 py-4 bg-white/[0.12] backdrop-blur-sm border border-white/25 text-white rounded-full font-semibold text-base hover:bg-white/[0.20] hover:border-white/40 transition-all duration-200"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Become a Partner
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => document.getElementById('on-demand')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── PRODUCTS OVERVIEW ── */}
      <ProductIndex products={PRODUCTS} />

      {/* ── PRODUCT SECTIONS ── */}
      {PRODUCTS.map((product, i) => (
        <ProductSection key={product.id} product={product} index={i} />
      ))}

      {/* ── CTA ── */}
      <section ref={ctaRef} className="py-24 bg-primary-500 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <motion.div
          className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold font-display text-black leading-tight mb-5">
              Ready to Transform Transit?
            </h2>
            <p className="text-black/60 text-xl mb-10 max-w-xl mx-auto">
              Partner with SCOOTY to bring on-demand mobility, AI-native public works, and AI transit intelligence to your community.
            </p>
            <motion.button
              onClick={() => navigate('/partners')}
              className="group px-12 py-5 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-900 transition-colors flex items-center justify-center mx-auto gap-3 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Partner With SCOOTY</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
