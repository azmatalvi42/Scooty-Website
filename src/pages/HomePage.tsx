import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Heart, Handshake, ExternalLink, Play, Zap, Battery, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroOverCity } from '../components/hero/HeroVariants';
import { SceneRide, SceneRideGuide, ScenePatchForce } from '../components/home/ProductScenes';
import { governmentQuotes } from '../data/projects';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Stats band ──────────────────────────────────────────────────── */
const stats = [
  { value: '5+',    label: 'Cities live' },
  { value: '100K+', label: 'Rides completed' },
  { value: '2021',  label: 'Founded in Ontario' },
  { value: '100%',  label: 'Canadian built' },
];

const StatsBand = () => (
  <section className="bg-[#FEC001]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
          className="text-center"
        >
          <div className="text-5xl sm:text-6xl font-black font-display text-black tracking-tight">{s.value}</div>
          <div className="mt-1.5 text-xs font-bold text-black/60 uppercase tracking-widest">{s.label}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ── Platform section (Argo-style 3D panels) ─────────────────────── */
const products = [
  {
    tag: 'Micromobility',
    name: 'SCOOTY Ride',
    desc: 'On-demand e-scooters and e-bikes closing the first and last kilometre gap between transit stops and your front door. Scan, ride, park — in minutes.',
    Scene: SceneRide,
    bg: '#ECE7DE',
    text: '#1A1C22',
    tagColor: '#7B7465',
    cta: '/riders',
  },
  {
    tag: 'AI Navigation',
    name: 'AI RideGuide',
    desc: 'The smarter way to navigate public transit. AI-powered routing combines your bus, subway, and scooter legs into one seamless trip — with real-time delays and alternatives.',
    Scene: SceneRideGuide,
    bg: '#E6E2F0',
    text: '#1A1C22',
    tagColor: '#6B65A0',
    cta: '/technology',
  },
  {
    tag: 'City Infrastructure',
    name: 'PatchForce',
    desc: 'Riders flag potholes and road hazards in one tap. City crews are automatically dispatched and tracked — closing the loop between the public and municipal maintenance.',
    Scene: ScenePatchForce,
    bg: '#EAE5DA',
    text: '#1A1C22',
    tagColor: '#7B7465',
    cta: '/technology',
  },
];

const PlatformSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <section ref={ref} className="bg-[#0D0F14] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <span className="text-[#FEC001] text-xs font-bold tracking-[0.15em] uppercase">Our Platform</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black font-display text-white tracking-[-0.02em] leading-[0.95] max-w-xl">
            Three ways we move your city.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{ background: p.bg }}
            >
              <div className="h-[268px] w-full">
                <p.Scene />
              </div>
              <div className="flex-1 px-6 pt-5 pb-6 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: p.tagColor }}>{p.tag}</span>
                <h3 className="text-xl font-bold font-display leading-tight" style={{ color: p.text }}>{p.name}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(26,28,34,0.6)' }}>{p.desc}</p>
                <Link to={p.cta} className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-[#1A1C22] mt-1">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Fleet showcase ──────────────────────────────────────────────── */
const FleetSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [active, setActive] = useState<'scooter' | 'ebike'>('scooter');

  const fleet = {
    scooter: {
      name: 'SCOOTY E-Scooter',
      subtitle: 'Segway ES-Series',
      img: '/assets/fleet/scooter-cutout.webp',
      specs: [
        { icon: Gauge, label: 'Max speed', value: '24 km/h' },
        { icon: Battery, label: 'Range', value: '65 km' },
        { icon: Zap, label: 'Battery', value: 'Swappable' },
      ],
      desc: 'Compact, nimble, and built for the city. Lock to any bike rack. The fastest way from the transit stop to your door.',
    },
    ebike: {
      name: 'SCOOTY E-Bike',
      subtitle: 'Segway EB-Series',
      img: '/assets/fleet/ebike-hero.webp',
      specs: [
        { icon: Gauge, label: 'Max speed', value: '25 km/h' },
        { icon: Battery, label: 'Range', value: '80+ km' },
        { icon: Zap, label: 'Battery', value: 'Swappable' },
      ],
      desc: 'More cargo, more comfort. A front basket, full mudguards, and a step-through frame make this the city commuter\'s go-to.',
    },
  };

  const v = fleet[active];

  return (
    <section ref={ref} className="bg-[#0a0c10] py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <span className="text-[#FEC001] text-xs font-bold tracking-[0.15em] uppercase">Our Fleet</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black font-display text-white tracking-[-0.02em] leading-[0.95]">
            Purpose-built for city streets.
          </h2>
        </motion.div>

        {/* Toggle */}
        <div className="flex gap-2 mb-10">
          {(['scooter', 'ebike'] as const).map((k) => (
            <button key={k} onClick={() => setActive(k)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                active === k ? 'bg-[#FEC001] text-black' : 'bg-white/[0.06] text-white/55 hover:text-white border border-white/10'
              }`}
            >
              {k === 'scooter' ? 'E-Scooter' : 'E-Bike'}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="grid lg:grid-cols-2 gap-10 items-center"
        >
          {/* Vehicle image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60%] h-[40%] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(254,192,1,0.14) 0%, transparent 70%)', filter: 'blur(32px)' }} />
            </div>
            <motion.img
              src={v.img}
              alt={v.name}
              className="relative h-[360px] sm:h-[420px] w-auto object-contain"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>

          {/* Specs */}
          <div>
            <p className="text-[#FEC001] text-xs font-bold tracking-[0.12em] uppercase mb-2">{v.subtitle}</p>
            <h3 className="text-3xl sm:text-4xl font-black font-display text-white mb-4">{v.name}</h3>
            <p className="text-white/55 text-base leading-relaxed mb-8 max-w-md">{v.desc}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {v.specs.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <s.icon className="w-5 h-5 text-[#FEC001] mb-2" />
                  <div className="text-xl font-black text-white">{s.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <Link to="/riders/vehicles" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white font-bold text-sm hover:border-[#FEC001]/40 hover:text-[#FEC001] transition-colors">
              Vehicle specs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ── Living city (NetworkCanvas reveal) ──────────────────────────── */
const LivingCitySection = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10] via-transparent to-[#0D0F14] pointer-events-none" />
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative z-10 text-center px-6 max-w-3xl"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-bold tracking-[0.1em] uppercase mb-6 border border-white/15">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FEC001] animate-pulse" /> Live network
      </div>
      <h2 className="text-4xl sm:text-6xl font-black font-display text-white tracking-[-0.02em] leading-[0.94]">
        The city runs<br /><span className="text-[#FEC001]">on SCOOTY.</span>
      </h2>
      <p className="mt-6 text-lg text-white/55 max-w-lg mx-auto leading-relaxed">
        Every scooter, every stop, every trip — moving together in real time across your city.
      </p>
    </motion.div>
  </section>
);

/* ── Year-end brand video ─────────────────────────────────────────── */
const VideoSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  return (
    <section ref={ref} className="bg-[#0D0F14] py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-10"
        >
          <span className="text-[#FEC001] text-xs font-bold tracking-[0.15em] uppercase">In Motion</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black font-display text-white tracking-[-0.02em]">
            A year of moving cities forward.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="relative rounded-3xl overflow-hidden bg-black cursor-pointer group"
          onClick={toggle}
        >
          <video
            ref={videoRef}
            src="/assets/video/year-end.mp4"
            poster="/assets/video/year-end-poster.jpg"
            className="w-full aspect-video object-cover"
            playsInline
            onEnded={() => setPlaying(false)}
          />
          {/* Play overlay */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors duration-300">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-18 h-18 rounded-full bg-[#FEC001] flex items-center justify-center shadow-2xl"
                style={{ width: 72, height: 72 }}
              >
                <Play className="w-7 h-7 text-black ml-1" fill="black" />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* ── Core Values ─────────────────────────────────────────────────── */
const values = [
  {
    icon: Shield,
    title: 'Safety',
    body: 'Safety is a fundamental right for everyone. Inspired by Vision Zero principles, SCOOTY\'s commitment to safety is the foundation of our company — expressed in our branding, our technology, and our daily operations.',
    practices: ['High-visibility livery', 'Geofencing speed control', 'Double hand brakes', 'Running lights & signals'],
  },
  {
    icon: Heart,
    title: 'Courtesy',
    body: 'Courtesy is critical in making shared mobility work for everyone. We implement it into our planning, operational best practices, and communication to ensure a respectful experience for all.',
    practices: ['Rider onboarding education', 'Community engagement', 'Pedestrian priority', 'Respectful operations'],
  },
  {
    icon: Handshake,
    title: 'Partnership',
    body: 'SCOOTY plans, designs and delivers mobility solutions through our community partnerships network. Our plans are guided by collective domain expertise, carefully aligned with municipal vision and goals.',
    practices: ['Municipal alignment', 'Transit integration', 'Local insights', 'Tailored deployments'],
  },
];

const ValuesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section ref={ref} className="bg-[#0D0F14] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <span className="text-[#FEC001] text-xs font-bold tracking-[0.15em] uppercase">What We Stand For</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black font-display text-white tracking-[-0.02em] leading-[0.95]">
            SCOOTY Core Values
          </h2>
          <p className="mt-3 text-white/40 text-sm">Safety · Courtesy · Partnership</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <motion.div key={v.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-7 cursor-pointer hover:border-[#FEC001]/30 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FEC001] flex items-center justify-center mb-5">
                <v.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-3">{v.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{v.body}</p>
              {open === i && (
                <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 space-y-2">
                  {v.practices.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-white/65">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FEC001] shrink-0" />{p}
                    </li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Case Studies ────────────────────────────────────────────────── */
const caseStudies = [
  { city: 'Brampton, ON', slug: 'brampton', image: '/assets/Partners/cities-brampton.webp', rides: '2.1M rides served', emissions: '4,200 tons CO₂ saved', highlight: 'Reduced average commute time by 18%' },
  { city: 'Barrie, ON',   slug: 'barrie',   image: '/assets/Partners/cities-barrie.webp',   rides: '1.5M rides served', emissions: '3,100 tons CO₂ saved', highlight: 'Fleet utilization increased by 35%' },
  { city: 'Metrolinx',    slug: 'metrolinx', image: '/assets/Partners/transit.webp',         rides: 'GTHA-wide integration', emissions: 'First & last-mile transit', highlight: 'Proud partners innovating transit across Ontario' },
];

const CaseStudiesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <section ref={ref} className="bg-[#0a0c10] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }} className="mb-14">
          <span className="text-[#FEC001] text-xs font-bold tracking-[0.15em] uppercase">Impact in Action</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black font-display text-white tracking-[-0.02em] leading-[0.95]">Case Studies</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {caseStudies.map((c, i) => (
            <motion.div key={c.city}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="group rounded-3xl overflow-hidden border border-white/[0.07] hover:border-[#FEC001]/30 transition-colors"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={c.image} alt={c.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5"><p className="text-white font-bold text-lg">{c.city}</p></div>
              </div>
              <div className="bg-white/[0.03] p-6 space-y-3">
                <p className="text-[#FEC001] text-sm font-bold">{c.rides}</p>
                <p className="text-white/60 text-sm">{c.emissions}</p>
                <p className="text-white text-sm leading-relaxed border-t border-white/10 pt-3">{c.highlight}</p>
                <Link to={`/partners/${c.slug}`} className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-[#FEC001] transition-colors font-semibold">
                  View partnership <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Quotes ──────────────────────────────────────────────────────── */
const QuotesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const scroll = (dir: 'l' | 'r') => scrollRef.current?.scrollBy({ left: dir === 'r' ? 320 : -320, behavior: 'smooth' });

  return (
    <section ref={ref} className="bg-[#0D0F14] py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-[#FEC001] text-xs font-bold tracking-[0.15em] uppercase">Testimonials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black font-display text-white tracking-[-0.02em]">What people are saying</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('l')} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => scroll('r')} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </motion.div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {governmentQuotes.map((q, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4), ease: EASE }}
              className="shrink-0 w-[300px] sm:w-[320px] snap-start rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 flex flex-col gap-4"
            >
              <p className="text-white/75 text-sm leading-relaxed flex-1 line-clamp-6">"{q.quote}"</p>
              <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                <img src={q.image} alt={q.name} className="w-9 h-9 rounded-full object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div>
                  <p className="text-white text-xs font-bold leading-tight">{q.name}</p>
                  <p className="text-white/40 text-[10px] leading-tight mt-0.5">{q.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Ontario Story ───────────────────────────────────────────────── */
const OntarioSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <section ref={ref} className="bg-[#0a0c10] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
            <span className="text-[#FEC001] text-xs font-bold tracking-[0.15em] uppercase">Our Story</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black font-display text-white tracking-[-0.02em] leading-[0.95]">
              Built Proudly<br />in Ontario. 🍁
            </h2>
            <p className="mt-6 text-white/60 text-base leading-relaxed max-w-lg">
              SCOOTY is a 100% Canadian company, built and developed with local talent right here in Ontario. We live in the communities we serve — so we have a deep sense of ownership and passion to bring the latest mobility solutions that meet the needs of our communities.
            </p>
            <p className="mt-4 text-white/40 text-sm leading-relaxed max-w-lg">
              From Brampton to Markham, Barrie to Burlington — we partner with municipalities, transit agencies, and institutions to deliver micromobility that's built for how Canadians actually move.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] border border-white/15 text-white font-bold text-sm hover:bg-white/10 transition-colors">
                Our story <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/partners" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#FEC001]/30 text-[#FEC001] font-bold text-sm hover:bg-[#FEC001]/10 transition-colors">
                Partner cities
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} className="grid grid-cols-2 gap-4">
            {[
              { n: '2021', l: 'Year Founded' },
              { n: '5+',   l: 'Ontario Cities' },
              { n: 'TMU',  l: 'Incubated at Toronto Metropolitan University' },
              { n: 'OVIN', l: 'Ontario Vehicle Innovation Network Partner' },
            ].map((m) => (
              <div key={m.n} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="text-3xl font-black font-display text-[#FEC001]">{m.n}</div>
                <div className="mt-2 text-white/55 text-sm leading-snug">{m.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ── CTA ─────────────────────────────────────────────────────────── */
const CtaSection = () => (
  <section className="bg-[#FEC001]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-28 text-center">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, ease: EASE }}>
        <h2 className="text-5xl sm:text-7xl font-black font-display text-black tracking-[-0.03em] leading-[0.95]">Ready to ride?</h2>
        <p className="mt-5 text-base text-black/65 max-w-sm mx-auto leading-relaxed">Download SCOOTY and start moving your city forward today.</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a href="#"><img src="/icons/appstore-icon.png" alt="Download on the App Store" className="h-12 w-auto" /></a>
          <a href="#"><img src="/icons/playstore-icon.png" alt="Get it on Google Play" className="h-12 w-auto" /></a>
          <Link to="/partners" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-black/20 text-black font-bold hover:border-black/50 transition-colors text-sm">
            For cities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ── Page ────────────────────────────────────────────────────────── */
export const HomePage = () => (
  <>
    <HeroOverCity />
    <StatsBand />
    <PlatformSection />
    <FleetSection />
    <LivingCitySection />
    <VideoSection />
    <ValuesSection />
    <CaseStudiesSection />
    <QuotesSection />
    <OntarioSection />
    <CtaSection />
  </>
);
