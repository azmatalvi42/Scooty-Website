import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
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
}> = {
  brampton: {
    name: 'Brampton',
    slug: 'brampton',
    launched: 'April 2023',
    tagline: 'City-wide micromobility serving one of Canada\'s fastest-growing cities.',
    overview:
      'SCOOTY launched in Brampton in April 2023, making it our first Ontario deployment and the foundation of our Canadian operations. Brampton\'s sprawling geography and rapidly growing population presented both a challenge and an opportunity — to demonstrate that micromobility can serve large, diverse cities, not just downtown cores. Today, SCOOTY operates across the entire City of Brampton, connecting communities, supporting commuters, and bridging gaps in the transit network.',
    heroImage:
      'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
      'Brampton is one of Canada\'s most diverse and fastest-growing cities. SCOOTY\'s program was designed with Brampton\'s community in mind — providing affordable, accessible transportation options that reflect the city\'s values of inclusivity and sustainability. We work closely with the City of Brampton to align our operations with local transportation plans and Vision Zero road safety goals.',
    nextCity: 'barrie',
  },

  barrie: {
    name: 'Barrie',
    slug: 'barrie',
    launched: 'June 2024',
    tagline: 'Waterfront e-bike adventures along Barrie\'s stunning Georgian Bay shoreline.',
    overview:
      'SCOOTY launched in Barrie in June 2024, bringing e-bikes to one of Ontario\'s most scenic waterfront destinations. Barrie\'s Centennial Park and lakeside trail network provided the ideal environment for a tourism- and recreation-focused micromobility program. Visitors and residents alike can now explore Barrie\'s beautiful waterfront in a sustainable, car-free way — taking in the sights of Kempenfelt Bay, Centennial Beach, and the surrounding parks.',
    heroImage:
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
      'Barrie is a growing city with a strong identity rooted in its natural surroundings and Georgian Bay waterfront. SCOOTY\'s partnership with the City of Barrie supports the city\'s vision for a connected, sustainable waterfront district. Our e-bike program provides a clean, fun, and accessible way for visitors and residents to experience what makes Barrie unique.',
    prevCity: 'brampton',
    nextCity: 'markham',
  },

  markham: {
    name: 'Markham',
    slug: 'markham',
    launched: 'August 2024',
    tagline: 'Connecting Downtown Markham\'s innovation district with sustainable urban mobility.',
    overview:
      'SCOOTY launched in Markham in August 2024, bringing both e-scooters and e-bikes to Downtown Markham — one of Ontario\'s most dynamic urban centres. Markham is home to a thriving technology sector, a vibrant dining and retail scene, and a growing residential community. Our mixed fleet of e-scooters and e-bikes gives residents, workers, and visitors flexible options for navigating the downtown core and connecting with the regional transit network.',
    heroImage:
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
      'Markham is known as the "High-Tech Capital of Canada," and its urban growth reflects a community that values innovation, diversity, and sustainability. SCOOTY\'s partnership with the City of Markham aligns with the city\'s Smart City strategy and its commitment to building a connected, green urban environment. We collaborate with local businesses, developers, and transit partners to deliver a mobility experience that matches Markham\'s ambitions.',
    prevCity: 'barrie',
    nextCity: 'burlington',
  },

  burlington: {
    name: 'Burlington',
    slug: 'burlington',
    launched: 'June 2025',
    tagline: 'Seven kilometres of trail access connecting Burlington\'s communities sustainably.',
    overview:
      'SCOOTY launched in Burlington in June 2025, bringing e-scooters to the City of Burlington\'s Centennial Trail corridor. The Centennial Trail is one of Burlington\'s most-used active transportation routes, running through the heart of the city and connecting residential areas with parks, schools, and transit hubs. Our program makes this trail more accessible than ever — giving more Burlingtonians a convenient, emission-free way to get around.',
    heroImage:
      'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
      'Burlington is a city that takes pride in its natural beauty, active lifestyle, and commitment to sustainable growth. SCOOTY\'s partnership with the City of Burlington reflects a shared vision for reducing car dependence and making active transportation more accessible. The Centennial Trail program is a natural extension of Burlington\'s investment in cycling and pedestrian infrastructure, and SCOOTY is proud to be part of that story.',
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
    heroImage:
      'https://images.pexels.com/photos/3278015/pexels-photo-3278015.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src={data.heroImage}
          alt={data.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

        {/* Back link */}
        <Link
          to="/partners"
          className="absolute top-28 left-4 sm:left-8 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Locations
        </Link>

        <div ref={heroRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-12">
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
        </div>
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
    </div>
  );
};
