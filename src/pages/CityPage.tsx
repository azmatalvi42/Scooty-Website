import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MapPin,
  Clock,
  Bike,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Users,
  Navigation,
  Train,
  Leaf,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
} from 'lucide-react';

/* ─────────────────────────────────────── CITY DATA ─── */

const cityData: Record<string, {
  name: string;
  slug: string;
  launched: string;
  tagline: string;
  overview: string;
  heroImage: string;
  vehicles: string[];
  stats: { label: string; value: string }[];
  serviceArea: {
    title: string;
    description: string;
    rules: string[];
  };
  highlights: string[];
  transit: {
    description: string;
    connections: string[];
  };
  community: string;
  nextCity?: string;
  prevCity?: string;
  gallery?: { src: string; title: string; caption: string }[];
  heroPosition?: 'top' | 'center' | 'bottom';
  heroObjectPosition?: string; // overrides heroPosition when set (e.g. 'center calc(50% - 10px)')
}> = {
  brampton: {
    name: 'Brampton',
    slug: 'brampton',
    launched: 'April 2023',
    tagline: 'Where it all started — city-wide micromobility in one of Canada\'s fastest-growing cities.',
    overview:
      'Our first Ontario deployment, and the foundation of SCOOTY\'s Canadian story. Brampton proved that micromobility can serve entire cities — not just downtown cores.',
    heroImage: '/assets/Cities/Brampton/brampton-hero.webp',
    heroPosition: 'center',
    heroObjectPosition: 'center calc(50% - 170px)',
    gallery: [
      {
        src: '/assets/Cities/Brampton/brampton-cityhall.webp',
        title: 'Brampton City Hall',
        caption: 'Where the partnership began — civic launch with the City of Brampton.',
      },
      {
        src: '/assets/Cities/Brampton/brampton-bbq.webp',
        title: 'In the Community',
        caption: 'Showing up at neighbourhood events and street fairs.',
      },
      {
        src: '/assets/Cities/Brampton/brampton-mascot.webp',
        title: 'Built for Brampton',
        caption: 'The SCOOTY mascot — a local face for a local program.',
      },
    ],
    vehicles: ['E-Scooters'],
    stats: [
      { label: 'Launch Year', value: '2023' },
      { label: 'Service Area', value: 'City-Wide' },
      { label: 'Speed Limit', value: '50 km/h' },
      { label: 'Vehicles', value: 'E-Scooters' },
    ],
    serviceArea: {
      title: 'City-Wide Coverage',
      description:
        'SCOOTY\'s Brampton service area covers the entire city, giving residents access to e-scooters across neighbourhoods, employment centres, parks, and transit hubs.',
      rules: [
        'Riding permitted on roads with speed limits of 50 km/h or less',
        'Slow-speed zones enforced in parks and along trails',
        'Designated parking zones available across the city',
        'Dockless parking options in select areas',
        'Geofencing technology enforces zone boundaries automatically',
      ],
    },
    highlights: [
      'First SCOOTY deployment in Ontario',
      'Covers the entire city — not just the downtown core',
      'Slow-speed geofenced zones in all major parks and trails',
      'Supports first- and last-mile commuter connectivity',
      'Integrated with Brampton Transit and Züm rapid transit',
    ],
    transit: {
      description:
        'SCOOTY in Brampton is designed to strengthen — not compete with — the existing transit network. Riders can use SCOOTY to bridge the gap between home, transit stops, and workplaces.',
      connections: [
        'Brampton Transit bus network',
        'Züm Bus Rapid Transit corridors',
        'Brampton GO Station connections',
        'Bramalea GO Station access',
      ],
    },
    community:
      'Designed with Brampton\'s community in mind — affordable, accessible, and aligned with Vision Zero road safety goals.',
    nextCity: 'barrie',
  },

  barrie: {
    name: 'Barrie',
    slug: 'barrie',
    launched: 'June 2024',
    tagline: 'Waterfront e-bike adventures along Barrie\'s stunning Georgian Bay shoreline.',
    overview:
      'E-bikes for Barrie\'s lakeside trails and Centennial Park — a clean, fun way to explore Kempenfelt Bay and the waterfront.',
    heroImage: '/assets/Cities/Barrie/barrie-hero.webp',
    heroPosition: 'center',
    gallery: [
      {
        src: '/assets/Cities/Barrie/barrie-mayor.webp',
        title: 'Partnership in Action',
        caption: 'Out on the trails with City of Barrie leadership — a program built shoulder-to-shoulder with the community.',
      },
    ],
    vehicles: ['E-Bikes'],
    stats: [
      { label: 'Launch Year', value: '2024' },
      { label: 'Service Area', value: 'Waterfront' },
      { label: 'Base Station', value: 'Centennial Park' },
      { label: 'Vehicles', value: 'E-Bikes' },
    ],
    serviceArea: {
      title: 'Waterfront & Trail Network',
      description:
        'SCOOTY\'s Barrie service focuses on the waterfront corridor, giving riders access to the city\'s most scenic routes along Kempenfelt Bay and the Barrie trail system.',
      rules: [
        'Riding permitted on local trails and designated waterfront paths',
        'All rides start and end at Centennial Park',
        'Riders must stay within the defined waterfront service zone',
        'E-bikes are governed to safe trail speeds within the zone',
        'Helmet use is strongly encouraged for all riders',
      ],
    },
    highlights: [
      'E-bikes purpose-built for trail and recreational riding',
      'Hub-based model — all rides begin and end at Centennial Park',
      'Focused on tourism and recreational use along the waterfront',
      'Perfect for exploring Barrie\'s shoreline and natural spaces',
      'Supports Barrie\'s sustainable tourism strategy',
    ],
    transit: {
      description:
        'While Barrie\'s SCOOTY program is primarily recreation-focused, it connects naturally with the city\'s transit infrastructure and tourist gateway points.',
      connections: [
        'Barrie South GO Station access',
        'Barrie Transit bus connections at Centennial Park',
        'Downtown Barrie retail and dining corridor',
        'Barrie waterfront tourism district',
      ],
    },
    community:
      'A partnership built around Barrie\'s waterfront identity — clean, accessible mobility for visitors and residents.',
    prevCity: 'brampton',
    nextCity: 'markham',
  },

  markham: {
    name: 'Markham',
    slug: 'markham',
    launched: 'August 2024',
    tagline: 'Connecting Downtown Markham\'s innovation district with sustainable urban mobility.',
    overview:
      'Our only Ontario program with both e-scooters and e-bikes — serving Markham\'s tech corridor, downtown, and YRT/Viva transit network.',
    heroImage: '/assets/Cities/Markham/markham-hero.webp',
    heroPosition: 'center',
    heroObjectPosition: 'center calc(50% - 90px)',
    gallery: [
      {
        src: '/assets/Cities/Markham/markham-mayor.webp',
        title: 'Riding with the Mayor',
        caption: 'Markham\'s leadership riding alongside SCOOTY at the city launch.',
      },
      {
        src: '/assets/Cities/Markham/markham-mayorspeech.webp',
        title: 'Launch Day',
        caption: 'Officially live at markham.ca — a partnership built around Markham\'s Smart City vision.',
      },
      {
        src: '/assets/Cities/Markham/markham-helmet.webp',
        title: 'Built for Safety',
        caption: 'SCOOTY helmets and dual-vehicle fleet — e-scooters and e-bikes side-by-side.',
      },
      {
        src: '/assets/Cities/Markham/markham-ebikes.webp',
        title: 'Dual-Vehicle Fleet',
        caption: 'SCOOTY\'s Markham program runs both e-scooters and Canadian-built e-bikes from a single app.',
      },
    ],
    vehicles: ['E-Scooters', 'E-Bikes'],
    stats: [
      { label: 'Launch Year', value: '2024' },
      { label: 'Service Area', value: 'Downtown' },
      { label: 'Speed Limit', value: '50 km/h' },
      { label: 'Vehicles', value: 'E-Scooters + E-Bikes' },
    ],
    serviceArea: {
      title: 'Downtown Markham Coverage',
      description:
        'SCOOTY\'s Markham service covers Downtown Markham and the surrounding urban core, providing first- and last-mile connectivity for one of York Region\'s busiest employment and residential hubs.',
      rules: [
        'Riding permitted on roads with speed limits of 50 km/h or less',
        'Designated parking zones throughout downtown',
        'Riders must park in designated zones to end their trip',
        'Geofencing enforces service zone boundaries',
        'Both e-scooter and e-bike options available in the same app',
      ],
    },
    highlights: [
      'SCOOTY\'s only dual-vehicle (e-scooter + e-bike) Ontario deployment',
      'Serves Markham\'s technology corridor and downtown employment district',
      'Strong connections to YRT/Viva regional transit',
      'Supports Markham\'s Smart City and sustainability initiatives',
      'Integrated parking zones for clean, organized vehicle management',
    ],
    transit: {
      description:
        'Markham\'s SCOOTY program is deeply integrated with York Region\'s transit network, making it easy for commuters to extend their transit journey by scooter or e-bike.',
      connections: [
        'VIVA bus rapid transit corridors',
        'York Region Transit (YRT) routes',
        'Unionville GO Station first-mile connections',
        'Markham Centre transit terminal',
      ],
    },
    community:
      'A partnership built around Markham\'s Smart City strategy — clean, connected mobility for the "High-Tech Capital of Canada."',
    prevCity: 'barrie',
    nextCity: 'burlington',
  },

  burlington: {
    name: 'Burlington',
    slug: 'burlington',
    launched: 'June 2025',
    tagline: 'Seven kilometres of trail access connecting Burlington\'s communities sustainably.',
    overview:
      'E-scooters along Burlington\'s 7 km Centennial Trail — a clean, emission-free way to move through the city.',
    heroImage: '/assets/Cities/Burlington/burlington-hero.webp',
    heroPosition: 'center',
    heroObjectPosition: 'center calc(50% - 60px)',
    gallery: [
      {
        src: '/assets/Cities/Burlington/burlington-rider.webp',
        title: 'On the Trail',
        caption: 'Cruising through downtown Burlington on the Centennial Trail corridor.',
      },
      {
        src: '/assets/Cities/Burlington/burlington-scooters.webp',
        title: 'Designated Parking',
        caption: '17 designated parking zones keep the fleet organized across the corridor.',
      },
    ],
    vehicles: ['E-Scooters'],
    stats: [
      { label: 'Launch Year', value: '2025' },
      { label: 'Trail Length', value: '7 km' },
      { label: 'Route', value: 'Centennial Trail' },
      { label: 'Vehicles', value: 'E-Scooters' },
    ],
    serviceArea: {
      title: 'Centennial Trail Corridor',
      description:
        'SCOOTY\'s Burlington service is focused on the 7 km Centennial Trail corridor, one of the city\'s primary active transportation routes. Designated parking zones are placed at key access points along the trail.',
      rules: [
        'Service operates along the 7 km Centennial Trail corridor',
        'Designated parking zones at trail access points',
        'E-scooters governed to trail-appropriate speeds within the zone',
        'Riders must park in designated zones to end their trip',
        'Integration with local transit stops along the corridor',
      ],
    },
    highlights: [
      'Purpose-built for Burlington\'s Centennial Trail active transportation corridor',
      '7 km of continuous trail access for residents and visitors',
      'Designated parking zones at key trailhead and transit access points',
      'Supports Burlington\'s active transportation and sustainability goals',
      'Integration with Burlington Transit along the corridor',
    ],
    transit: {
      description:
        'Burlington\'s SCOOTY program links directly with Burlington Transit, enabling seamless connections between bus routes and the Centennial Trail corridor.',
      connections: [
        'Burlington Transit bus routes along the corridor',
        'Aldershot GO Station first-mile access',
        'Burlington GO Station connectivity',
        'Downtown Burlington retail and waterfront district',
      ],
    },
    community:
      'A natural extension of Burlington\'s investment in active transportation — built around the city\'s love of trails, cycling, and sustainable growth.',
    prevCity: 'markham',
    nextCity: 'metrolinx',
  },

  metrolinx: {
    name: 'Metrolinx',
    slug: 'metrolinx',
    launched: '2024',
    tagline: 'Proud partners with Metrolinx, innovating transit across the Greater Toronto and Hamilton Area.',
    overview:
      'SCOOTY is proud to partner with Metrolinx — the Crown agency responsible for regional transit across the Greater Toronto and Hamilton Area — to help reimagine how people connect to and from the GO Transit network. Our partnership focuses on closing the first-and-last-mile gap that prevents riders from choosing transit over the car. By integrating SCOOTY\'s on-demand micromobility and AI-powered RideGuide technology with Metrolinx\'s regional network, we are making it easier than ever for commuters across Ontario to choose sustainable, connected transit.',
    heroImage: '/assets/Partners/transit.webp',
    vehicles: ['E-Scooters', 'E-Bikes'],
    stats: [
      { label: 'Partner Type', value: 'Transit Agency' },
      { label: 'Service Region', value: 'GTHA' },
      { label: 'Network', value: 'GO Transit' },
      { label: 'Focus', value: 'First & Last Mile' },
    ],
    serviceArea: {
      title: 'GTHA-Wide First & Last Mile',
      description:
        'Our Metrolinx partnership extends SCOOTY\'s reach across the entire GTHA, placing shared mobility where riders need it most — at GO stations, bus terminals, and transit hubs throughout the region.',
      rules: [
        'SCOOTY vehicles stationed at key GO Transit stations across the GTHA',
        'Seamless connection between SCOOTY trips and GO Train / GO Bus services',
        'Integrated digital payments through a single platform',
        'Real-time availability and trip planning through SCOOTY AI RideGuide',
        'Geofenced service zones aligned with Metrolinx station boundaries',
      ],
    },
    highlights: [
      'Official mobility partner of Metrolinx across the Greater Toronto and Hamilton Area',
      'Closing the first-and-last-mile gap at GO Transit stations region-wide',
      'Integrated with Metrolinx\'s digital fare and transit planning systems',
      'Supporting Ontario\'s broader transit ridership and emissions reduction goals',
      'Bringing AI-powered transit support to millions of GO Transit commuters',
    ],
    transit: {
      description:
        'The SCOOTY–Metrolinx partnership is built around seamless transit integration. Riders can connect from their neighbourhood to a GO station, and continue onward — all within a single, connected mobility ecosystem.',
      connections: [
        'GO Train network across the GTHA',
        'GO Bus regional routes',
        'UP Express airport link connectivity',
        'Local transit agency cross-connections',
      ],
    },
    community:
      'Metrolinx serves millions of transit riders across the Greater Toronto and Hamilton Area every year. SCOOTY\'s partnership with Metrolinx reflects our shared belief that a truly connected transit network means meeting riders at every step of their journey — not just at the platform. Together, we are working to reduce car dependence, lower emissions, and make regional transit a more accessible, attractive choice for everyone in Ontario.',
    prevCity: 'burlington',
  },
};

const cityOrder = ['brampton', 'barrie', 'markham', 'burlington', 'metrolinx'];

/* ─────────────────────────────────────── TILT CARD ─── */

const TiltCard = ({
  children,
  className = '',
  onClick,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  max?: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-200, 200], [max, -max]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-max, max]), { stiffness: 180, damping: 18 });

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────── COMPONENT ─── */

export const CityPage = () => {
  const { city } = useParams<{ city: string }>();
  const { pathname } = useLocation();
  const data = city ? cityData[city] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [areaRef, areaInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [transitRef, transitInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [communityRef, communityInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [galleryRef, galleryInView] = useInView({ triggerOnce: true, threshold: 0.08 });

  // Lightbox state
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Hero scroll parallax
  const heroSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(heroScroll, [0, 1], ['0%', '22%']);
  const heroImgScale = useTransform(heroScroll, [0, 1], [1, 1.12]);
  const heroTextY = useTransform(heroScroll, [0, 1], ['0%', '-40%']);

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">City Not Found</h1>
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Partners
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = cityOrder.indexOf(data.slug);

  return (
    <div className="min-h-screen bg-white dark:bg-black">

      {/* ── HERO ── */}
      <section ref={heroSectionRef} className="relative h-[80vh] min-h-[560px] flex items-end overflow-hidden">
        <motion.img
          src={data.heroImage}
          alt={data.name}
          style={{
            y: heroImgY,
            scale: heroImgScale,
            ...(data.heroObjectPosition ? { objectPosition: data.heroObjectPosition } : {}),
          }}
          className={`absolute inset-0 w-full h-[120%] object-cover ${
            data.heroObjectPosition
              ? ''
              : data.heroPosition === 'center'
                ? 'object-center'
                : data.heroPosition === 'bottom'
                  ? 'object-bottom'
                  : 'object-top'
          }`}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Back link */}
        <Link
          to="/partners"
          className="absolute top-28 left-4 sm:left-8 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Locations
        </Link>

        <motion.div ref={heroRef} style={{ y: heroTextY }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500 text-black text-xs font-bold rounded-full">
                <MapPin className="w-3 h-3" />
                Ontario, Canada
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/40 text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20">
                <Clock className="w-3 h-3" />
                Launched {data.launched}
              </span>
              {data.vehicles.map((v, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20">
                  <Bike className="w-3 h-3" />
                  {v}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-4 leading-tight">
              {data.name}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">{data.tagline}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {data.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="text-2xl font-bold font-display text-black">{stat.value}</div>
                <div className="text-black/60 text-xs mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section ref={overviewRef} className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={overviewInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <MapPin className="w-3.5 h-3.5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">About This Program</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-6">
                SCOOTY in {data.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {data.overview}
              </p>
            </motion.div>

            {/* Highlights sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={overviewInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-6 border border-gray-200 dark:border-white/10 sticky top-28">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Key Highlights
                </h3>
                <ul className="space-y-3">
                  {data.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── IMAGE BENTO GALLERY (only if city has gallery) ── */}
      {data.gallery && data.gallery.length > 0 && (
        <section ref={galleryRef} className="py-16 sm:py-20 bg-black relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={galleryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-between flex-wrap gap-4 mb-8 sm:mb-10"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-full mb-3">
                  <Camera className="w-3.5 h-3.5 text-primary-400" />
                  <span className="text-xs font-semibold text-primary-400 tracking-wide uppercase">In Pictures</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                  {data.name} in <span className="text-primary-500">Action</span>
                </h2>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                Tap any photo to view full size.
              </p>
            </motion.div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {data.gallery.map((g, i) => {
                const onlyOne = data.gallery!.length === 1;
                // Layout:
                //  - 1 image  → full-width spotlight
                //  - 2+ images → first spans two rows on desktop; others stack
                const span = onlyOne
                  ? 'sm:col-span-2 aspect-[16/9]'
                  : i === 0
                    ? 'sm:row-span-2 aspect-[4/5] sm:aspect-auto sm:h-full'
                    : 'aspect-[16/10]';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    animate={galleryInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: 0.08 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={span}
                  >
                    <TiltCard
                      onClick={() => setLightboxIdx(i)}
                      max={6}
                      className="group relative w-full h-full rounded-3xl overflow-hidden border border-white/10 cursor-pointer shadow-xl shadow-black/40 hover:shadow-primary-500/20 transition-shadow duration-500"
                    >
                      <img
                        src={g.src}
                        alt={g.title}
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Hover/tap overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute inset-0 ring-1 ring-transparent group-hover:ring-primary-500/40 transition-all duration-300 rounded-3xl pointer-events-none" />

                      {/* Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                        <h3 className="text-white font-bold text-base sm:text-lg leading-tight tracking-tight">
                          {g.title}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {g.caption}
                        </p>
                      </div>

                      {/* Zoom indicator */}
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/55 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 group-hover:bg-primary-500 group-hover:text-black transition-all duration-300">
                        <Camera className="w-4 h-4" />
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICE AREA ── */}
      <section ref={areaRef} className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={areaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <Navigation className="w-3.5 h-3.5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Service Area</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
                {data.serviceArea.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {data.serviceArea.description}
              </p>
              <ul className="space-y-3">
                {data.serviceArea.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-500/15 border border-primary-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Visual card grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={areaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Shield, title: 'Safety First', desc: 'Geofenced zones and speed limits protect riders and communities.' },
                { icon: Zap, title: 'Electric Fleet', desc: 'Zero-emission vehicles powered by swappable battery systems.' },
                { icon: MapPin, title: 'Smart Parking', desc: 'Designated zones keep vehicles organized and accessible.' },
                { icon: Leaf, title: 'Zero Emissions', desc: 'Every ride replaces a car trip and reduces urban emissions.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRANSIT ── */}
      <section ref={transitRef} className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={transitInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <Train className="w-3.5 h-3.5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Transit Integration</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
                Connected to the Network
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {data.transit.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={transitInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-3"
            >
              {data.transit.connections.map((conn, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-gray-50 dark:bg-navy-800 rounded-xl px-5 py-4 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Train className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{conn}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section ref={communityRef} className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={communityInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
              <Users className="w-3.5 h-3.5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Community Partnership</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-6">
              Built for {data.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg max-w-2xl mx-auto">
              {data.community}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary-500 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-black mb-4">
              Partner in {data.name}
            </h2>
            <p className="text-black/70 text-lg mb-8">
              Interested in working with SCOOTY in {data.name}? Get in touch with our partnerships team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="group px-10 py-4 bg-black text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-xl hover:bg-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Contact the Partnerships Team</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <Link to="/partners">
                <motion.button
                  className="px-10 py-4 border-2 border-black/30 text-black rounded-full font-medium hover:border-black transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Locations
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PREV / NEXT NAV ── */}
      {(currentIndex > 0 || currentIndex < cityOrder.length - 1) && (
        <section className="py-12 bg-white dark:bg-black border-t border-gray-100 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex justify-between items-center">
              {currentIndex > 0 ? (
                <Link
                  to={`/partners/${cityOrder[currentIndex - 1]}`}
                  className="group flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Previous</div>
                    <div className="font-semibold capitalize">{cityOrder[currentIndex - 1]}</div>
                  </div>
                </Link>
              ) : <div />}

              <Link
                to="/partners"
                className="text-sm text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                All Locations
              </Link>

              {currentIndex < cityOrder.length - 1 ? (
                <Link
                  to={`/partners/${cityOrder[currentIndex + 1]}`}
                  className="group flex items-center gap-3 text-right text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Next</div>
                    <div className="font-semibold capitalize">{cityOrder[currentIndex + 1]}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : <div />}
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIdx !== null && data.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIdx(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
          >
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            {data.gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx((lightboxIdx! - 1 + data.gallery!.length) % data.gallery!.length);
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next */}
            {data.gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx((lightboxIdx! + 1) % data.gallery!.length);
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[88vh] flex flex-col items-center gap-4"
            >
              <img
                src={data.gallery[lightboxIdx].src}
                alt={data.gallery[lightboxIdx].title}
                className="max-w-full max-h-[72vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              />
              <div className="text-center max-w-2xl px-4">
                <h3 className="text-white font-bold text-lg sm:text-xl">{data.gallery[lightboxIdx].title}</h3>
                <p className="text-gray-300 text-sm mt-1.5">{data.gallery[lightboxIdx].caption}</p>
                <p className="text-gray-500 text-xs mt-3 tabular-nums">
                  {lightboxIdx + 1} / {data.gallery.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
