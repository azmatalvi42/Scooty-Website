import { RiderCategorySlide } from '../components/ui/RiderCategoryImage';
import { EditorialCarousel } from '../components/ui/EditorialCarousel';
import { SlideOverlay, CaptionList, CAPTION_CTA } from '../components/ui/TabCarouselCaption';
import { RidersHeroVideo } from '../components/ui/RidersHeroVideo';
import { SiteImage } from '../components/ui/SiteImage';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Navigation,
  MapPin,
  ParkingSquare,
  Shield,
  Bike,
  ArrowRight,
  HardHat,
  Route,
  Gauge,
  Satellite,
  Timer,
  UserCheck,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Tab config ───────────────────────────────────────────────────────────────

type Highlight = { value: string; label: string; icon?: LucideIcon };
type RiderTab = {
  icon: LucideIcon;
  label: string;
  slug: string;
  subtitle: string;
  description: string;
  features: string[];
  featureColors?: string[];
  bulleted?: boolean;
  highlights: Highlight[];
};

const TABS: RiderTab[] = [
  {
    icon: Rocket,
    label: 'Getting Started',
    slug: 'getting-started',
    subtitle: 'Start your first ride',
    description: 'Download the app, create an account, and unlock your first SCOOTY ride within seconds.',
    features: ['Download App', 'Create Account', 'Find Vehicles', 'Scan & Ride'],
    highlights: [
      { value: '2 min', label: 'Setup time', icon: Timer },
      { value: '16+', label: 'Age required', icon: UserCheck },
    ],
  },
  {
    icon: Navigation,
    label: 'How to Ride',
    slug: 'how-to-ride',
    subtitle: 'Learn the basics',
    description: 'Scan, unlock, and ride. Follow our simple steps to get moving safely.',
    features: ['Scan QR Code', 'Put on Helmet', 'Follow Safety Rules'],
    highlights: [
      { value: '5', label: 'Easy Steps', icon: ListChecks },
      { value: 'Beginner', label: 'Friendly', icon: Sparkles },
    ],
  },
  {
    icon: MapPin,
    label: 'Where to Ride',
    slug: 'where-to-ride',
    subtitle: 'Know your zones',
    description: 'Check the map in the SCOOTY app and know the different speed control riding and parking zones.',
    features: ['Clear = 20 km/h', 'Yellow = 15 km/h', 'Red = 0 km/h', 'Blue = Designated Parking', 'Purple = Mandatory Parking'],
    // Shown on the carousel card's dark overlay, so each zone colour is a light-on-dark chip.
    featureColors: [
      'bg-white/15 border-white/50 text-white',
      'bg-yellow-400/25 border-yellow-300/70 text-yellow-200',
      'bg-red-500/30 border-red-400/70 text-red-200',
      'bg-blue-500/30 border-blue-400/70 text-blue-200',
      'bg-purple-500/30 border-purple-400/70 text-purple-200',
    ],
    highlights: [
      { value: '20 km/h', label: 'Max speed', icon: Gauge },
    ],
  },
  {
    icon: ParkingSquare,
    label: 'Park Like a Pro',
    slug: 'parking',
    subtitle: 'Park responsibly',
    description: 'Be smart, ride safely, park in 3 easy steps. ',
    features: ['Find a Parking Zone', 'Park Vehicle Upright', 'Take a Photo'],
    highlights: [
      { value: 'Free Parking', label: 'At Designated Zones', icon: ParkingSquare },
    ],
  },
  {
    icon: Shield,
    label: 'Safety',
    slug: 'safety',
    subtitle: 'Ride safely',
    description: 'Be smart, ride safe, follow the rules',
    features: [
      '16+ min. Age requirement',
      'Wear a helmet at all times',
      'No sidewalk riding',
      'One rider per vehicle',
      'No riding under the influence',
      'Follow local riding rules',
    ],
    highlights: [],
  },
  {
    icon: Bike,
    label: 'Micromobility Vehicles',
    slug: 'vehicles',
    subtitle: 'Our fleet',
    description: 'Choose between e-scooters and e-bikes, both equipped with the latest tech.',
    bulleted: true,
    features: [
      'Up to 20 KM/H top speed',
      'Up to 70 KMs E-Scooter range distance',
      'Up to 100 KMs E-Bike range distance',
      'Fast wireless phone charger',
      'Front & Rear brakes',
      'Dual shock suspension',
      'Anti-slip foot grip pad',
      'Turn signals',
      'High visibility reflective vinyl wrap',
      'High visibility LED light',
      'High visibility day-time LED headlight',
    ],
    highlights: [
      { value: '100 KM', label: 'range distance', icon: Route },
      { value: '20 KM/H', label: 'Top speed', icon: Gauge },
      { value: 'GPS tracked', label: '', icon: Satellite },
    ],
  },
];

const HELMET_TOPICS = ['getting-started', 'how-to-ride', 'where-to-ride'];

/** A tab's list: the zone colour key, a feature checklist, or numbered steps. */
const RiderTabDetails = ({ tab }: { tab: RiderTab }) => {
  if (tab.featureColors) {
    return (
      <ul className="grid gap-1.5">
        {tab.features.map((feature, i) => {
          const [zone, meaning] = feature.split('=').map((part) => part.trim());
          return (
            <li key={feature} className="flex items-center gap-3">
              <span className={`inline-flex items-center justify-center w-[72px] py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap flex-shrink-0 [text-shadow:none] ${tab.featureColors![i]}`}>
                {zone}
              </span>
              <span className="text-[12px] sm:text-[13px] text-white/90">{meaning}</span>
            </li>
          );
        })}
      </ul>
    );
  }
  return <CaptionList items={tab.features} marker={tab.bulleted ? 'check' : 'number'} />;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const RidersPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const goToTab = (index: number) => {
    setActiveTab(index);
  };
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef] = useInView({ triggerOnce: true, threshold: 0.1 });


  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero and tab navigation share the SCOOTY footage */}
      <section className="relative overflow-hidden">
        <RidersHeroVideo />
        {/* Keep the heading and navigation readable over changing footage. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75 pointer-events-none" />

        {/* Hero text — evenly spaced with pt-10 rhythm between nav, paragraph, download text, and store icons */}
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-24">
          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.75rem, 7vw, 5.5rem)' }}
            className="whitespace-nowrap font-bold font-display leading-[1.05] tracking-tight [filter:drop-shadow(0_2px_20px_rgba(0,0,0,0.9))]"
          >
            <span className="text-white">Your City,{'  '}</span>
            <span className="text-[#FEC001]">Your Ride</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed pt-10 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]"
          >
            Hop on a SCOOTY e-scooter or e-bike and ride through the city.
          </motion.p>

          {/* Download CTA — yellow pill button with App Store + Play Store icons inline (original-style layout) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-10 flex flex-col items-center"
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-4 px-7 py-4 bg-[#FEC001] text-black rounded-full font-bold text-base shadow-lg shadow-[#FEC001]/30 hover:bg-[#FFD00F] transition-colors"
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(254,192,1,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Download to start riding</span>
              <span className="flex items-center gap-2 border-l border-black/20 pl-4">
                <SiteImage
                  src="/icons/appstore-icon.png"
                  alt="App Store"
                  className="h-6 sm:h-7 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
                  loading="eager"
                  decoding="async"
                />
                <SiteImage
                  src="/icons/playstore-icon.png"
                  alt="Google Play"
                  className="h-6 sm:h-7 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
                  loading="eager"
                  decoding="async"
                />
              </span>
            </motion.a>

            <p className="text-sm text-white/70 mt-4 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]">
              Available on iOS &amp; Android
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab cards */}
      <section ref={contentRef} className="py-10 bg-gray-50 dark:bg-navy-900">
        {/* Tab nav — sits below the hero, above the tab cards */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <div className="overflow-x-auto pb-1 flex justify-start sm:justify-center scrollbar-hide">
              <div className="inline-flex gap-2 bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-gray-200 dark:border-white/20 shadow-lg shrink-0">
                {TABS.map((tab, index) => {
                  const isActive = index === activeTab;
                  return (
                    <button
                      key={index}
                      onClick={() => goToTab(index)}
                      className={`relative flex flex-col items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 min-w-[64px] sm:min-w-[76px] ${
                        isActive
                          ? 'bg-primary-500 text-black shadow-md shadow-primary-500/40'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/15'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="whitespace-nowrap text-[10px] sm:text-[11px] font-semibold leading-tight text-center">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <EditorialCarousel
          items={TABS}
          active={activeTab}
          onActiveChange={setActiveTab}
          getKey={(tab) => tab.slug}
          getLabel={(tab) => tab.label}
          aspect={0.5625}
          phoneAspect={0.75}
          minHeight={540}
          phoneMinHeight={560}
          label="Rider guides"
          trackId="riders-track"
          renderSlide={(tab, active) => (
            <>
              <RiderCategorySlide topic={tab.slug} active={active} />
              <SlideOverlay
                icon={tab.icon}
                eyebrow={tab.subtitle}
                title={tab.label}
                description={tab.description}
                details={<RiderTabDetails tab={tab} />}
                stats={[
                  ...tab.highlights,
                  ...(HELMET_TOPICS.includes(tab.slug) ? [{ value: 'Required', label: 'Helmet', icon: HardHat }] : []),
                ]}
                cta={
                  <Link to={`/riders/${tab.slug}`} draggable={false} className={CAPTION_CTA}>
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-150" />
                  </Link>
                }
                active={active}
              />
            </>
          )}
        />
      </section>
    </div>
  );
};
