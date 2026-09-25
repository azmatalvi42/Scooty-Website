import { SiteImage } from '../components/ui/SiteImage';
import { EditorialCarousel } from '../components/ui/EditorialCarousel';
import { SlideOverlay, CaptionList } from '../components/ui/TabCarouselCaption';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Heart,
  Globe,
  Zap,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  ExternalLink,
  Users,
  Flag,
  Calendar,
  MapPin,
  Home,
  Clock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── Tab config ──────────────────────────────────────────────────────────── */

const TABS = [
  {
    icon: Users,
    label: 'Who We Are',
    slug: 'who-we-are',
    subtitle: 'Our story',
    description:
      'SCOOTY is a Canadian mobility company delivering safe, sustainable, and intelligent transportation solutions to cities, campuses, businesses, and communities across Ontario.',
    features: [
      'On-Demand Mobility platform',
      'SCOOTY PAY integrated payments',
      'AI RideGuide commuter assistant',
      'Active in 5+ Ontario cities',
    ],
    highlights: [
      { value: '2023', label: 'Founded', icon: Calendar },
      { value: '100%', label: 'Canadian', icon: Flag },
    ] as { value: string; label: string; icon: LucideIcon }[],
    image: '/assets/About/WhatsApp Image 2025-08-09 at 15.09.56 (2).jpeg',
    imagePosition: '50% 45%',
  },
  {
    icon: Zap,
    label: 'Our Mission',
    slug: 'our-mission',
    subtitle: 'Why we exist',
    description:
      'We believe every person deserves a reliable, connected way to get where they\'re going — regardless of where they live or how far they are from a transit stop.',
    features: [
      'Close the first-and-last-km gap',
      'Connect communities to regional transit',
      'Serve people first, technology second',
      'Modernize public transit across Canada',
    ],
    highlights: [
      { value: '3', label: 'Core Products', icon: Zap },
      { value: '5+', label: 'Cities Served', icon: MapPin },
    ] as { value: string; label: string; icon: LucideIcon }[],
    image: '/assets/About/2024MarkhamOVINScootyDemo-059.jpg',
    imagePosition: '50% 30%',
  },
  {
    icon: Flag,
    label: 'Made in Canada',
    slug: 'made-in-canada',
    subtitle: 'Proudly Canadian',
    description:
      'SCOOTY was founded in Ontario with a simple belief: Canadians deserve world-class mobility technology built right here at home — by a team that understands our cities, winters, and communities.',
    features: [
      'Headquartered in Brampton, Ontario',
      'Built for Canadian winters & cities',
      'Expanding to cities across the country',
      'Partnering with Canadian transit agencies',
    ],
    highlights: [
      { value: 'Ontario', label: 'Home Base', icon: Home },
      { value: 'Canada', label: 'Born & Built', icon: Flag },
    ] as { value: string; label: string; icon: LucideIcon }[],
    image: '/assets/About/2024MarkhamOVINScootyDemo-066.jpg',
    imagePosition: '50% 45%',
  },
  {
    icon: Globe,
    label: 'Follow Us',
    slug: 'follow-us',
    subtitle: 'Stay connected',
    description:
      'Stay connected with SCOOTY — real stories, city launches, and the future of transit, live from our community across every platform.',
    features: [
      'Instagram: @scootymobility',
      'LinkedIn: SCOOTY Inc.',
      'X / Twitter: @scootymobility',
      'Facebook: SCOOTY',
      'YouTube: SCOOTY Mobility',
    ],
    highlights: [
      { value: '5', label: 'Platforms', icon: Globe },
      { value: 'Daily', label: 'Updates', icon: Clock },
    ] as { value: string; label: string; icon: LucideIcon }[],
    image: '/assets/About/2024MarkhamOVINScootyDemo-053.jpg',
    imagePosition: '50% 30%',
  },
];

/* ─── Data ────────────────────────────────────────────────────────────────── */

const missions = [
  {
    icon: Zap,
    title: 'Close the Gap',
    description: 'Bridging the first-and-last-km gap between regional transit and the communities it serves — making public transit a true door-to-door experience.',
  },
  {
    icon: Globe,
    title: 'Connect Communities',
    description: 'Building a more connected Ontario by giving people better tools to move, pay, and navigate — all through a single unified mobility platform.',
  },
  {
    icon: Heart,
    title: 'Serve People First',
    description: 'Every product we build starts with the rider. We exist to reduce friction, improve reliability, and make daily transit more human.',
  },
];

const socials = [
  {
    icon: Instagram,
    name: 'Instagram',
    handle: '@scootymobility',
    description: 'Behind-the-scenes, city launches, and rider stories.',
    color: 'from-fuchsia-500/15 to-orange-500/15',
    border: 'border-fuchsia-500/20 hover:border-fuchsia-500/50',
    iconColor: 'text-fuchsia-400',
    href: '#',
  },
  {
    icon: Linkedin,
    name: 'LinkedIn',
    handle: 'SCOOTY Inc.',
    description: 'Company news, partnerships, and career opportunities.',
    color: 'from-blue-500/15 to-blue-600/15',
    border: 'border-blue-500/20 hover:border-blue-500/50',
    iconColor: 'text-blue-400',
    href: '#',
  },
  {
    icon: Twitter,
    name: 'X / Twitter',
    handle: '@scootymobility',
    description: 'Real-time updates, transit news, and community chat.',
    color: 'from-gray-500/15 to-gray-400/15',
    border: 'border-gray-500/20 hover:border-gray-400/40',
    iconColor: 'text-gray-300',
    href: '#',
  },
  {
    icon: Facebook,
    name: 'Facebook',
    handle: 'SCOOTY',
    description: 'City-specific pages, events, and community groups.',
    color: 'from-blue-600/15 to-indigo-600/15',
    border: 'border-blue-600/20 hover:border-blue-600/50',
    iconColor: 'text-blue-500',
    href: '#',
  },
  {
    icon: Youtube,
    name: 'YouTube',
    handle: 'SCOOTY Mobility',
    description: 'Product walkthroughs, city spotlights, and tutorials.',
    color: 'from-red-500/15 to-red-600/15',
    border: 'border-red-500/20 hover:border-red-500/50',
    iconColor: 'text-red-400',
    href: '#',
  },
];

const MapleLeaf = ({ className = '' }: { className?: string }) => (
  <SiteImage
    src="/assets/About/maple-leafs.png"
    alt="Maple leaf"
    className={`${className} object-contain`}
    loading="lazy"
    decoding="async"
  />
);

/* ─── Page ────────────────────────────────────────────────────────────────── */

export const AboutPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const goToTab = (index: number) => {
    setActiveTab(index);
  };

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [canadaRef, canadaInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [socialsRef, socialsInView] = useInView({ triggerOnce: true, threshold: 0.05 });


  return (
    <div className="min-h-screen bg-white dark:bg-black">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <SiteImage
          src="/assets/About/2024MarkhamOVINScootyDemo-031.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 22%' }}
          sizes="100vw"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {/* Overlay — light tint so the photo stays vivid behind the heading */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-gray-50 dark:to-navy-900" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Hero text */}
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-24">
          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-display leading-[1.05] tracking-tight mb-5 [filter:drop-shadow(0_2px_20px_rgba(0,0,0,0.9))]"
          >
            <span className="block text-white">Built in Canada.</span>
            <span className="block text-[#FEC001] mt-2">For Every Community.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.8))]"
          >
            A Canadian mobility company on a mission to modernize public transit — one community at a time.
          </motion.p>
        </div>
      </section>

      {/* ── TAB CARDS ── */}
      <section ref={contentRef} className="py-10 bg-gray-50 dark:bg-navy-900">
        {/* Tab nav — sits below the hero, above the tab cards */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
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
          getKey={(tab) => tab.label}
          getLabel={(tab) => tab.label}
          aspect={0.5625}
          phoneAspect={0.75}
          minHeight={540}
          phoneMinHeight={560}
          label="About SCOOTY"
          trackId="about-track"
          renderSlide={(tab, active) => (
            <>
              <SiteImage
                src={tab.image}
                alt={tab.label}
                draggable={false}
                className={`w-full h-full object-cover transition-[filter] duration-500 ${active ? '' : 'saturate-[.75] group-hover/card:saturate-100'}`}
                style={{ objectPosition: tab.imagePosition }}
                sizes="(min-width: 768px) 62vw, 100vw"
              />
              <SlideOverlay
                icon={tab.icon}
                eyebrow={tab.subtitle}
                title={tab.label}
                description={tab.description}
                details={<CaptionList items={tab.features} />}
                stats={tab.highlights}
                active={active}
              />
            </>
          )}
        />
      </section>

      {/* ── OUR MISSION ── */}
      <section ref={missionRef} className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Our Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-10">
              Moving People,{' '}
              <span className="text-primary-500">Connecting Communities</span>
            </h2>

            {/* Pull quote */}
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute -top-4 -left-2 text-8xl text-primary-500/20 font-serif leading-none select-none">"</div>
              <p className="relative text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed italic px-8">
                We believe every person deserves a reliable, connected way to get where they're going — regardless of where they live or how far they are from a transit stop.
              </p>
              <div className="absolute -bottom-8 -right-2 text-8xl text-primary-500/20 font-serif leading-none select-none rotate-180">"</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {missions.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300">
                  <m.icon className="w-6 h-6 text-primary-500 group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-3">{m.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{m.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MADE IN CANADA ── */}
      <section ref={canadaRef} className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(234,179,8,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={canadaInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 120 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl scale-150" />
              <MapleLeaf className="relative w-full max-w-[400px] h-20 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6"
          >
            <span className="text-sm font-semibold text-red-400 tracking-wide uppercase">Proudly Canadian</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl md:text-6xl font-bold font-display text-white mb-6 leading-tight"
          >
            Made in <span className="text-red-500">Canada</span>.<br />
            Built for <span className="text-primary-500">Every Community</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            SCOOTY was founded in Ontario with a simple belief: Canadians deserve world-class mobility technology built right here at home — by a team that understands our cities, our winters, and our communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={canadaInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center mx-auto w-full max-w-[600px] h-80 rounded-lg overflow-hidden mb-12 shadow-lg"
          >
            <SiteImage
              src="/assets/About/canada-mask.png"
              alt="Canadian flag"
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

        </div>
      </section>

      {/* ── SOCIALS ── */}
      <section ref={socialsRef} className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={socialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Follow the <span className="text-primary-500">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay connected with SCOOTY — real stories, city launches, and the future of transit, live from our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={socialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`group relative bg-gradient-to-br ${social.color} border ${social.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl flex flex-col gap-4 cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-black/20 flex items-center justify-center">
                    <social.icon className={`w-6 h-6 ${social.iconColor}`} />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{social.name}</div>
                  <div className={`text-sm font-semibold ${social.iconColor} mb-2`}>{social.handle}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{social.description}</p>
                </div>
                <div className={`text-xs font-semibold ${social.iconColor} flex items-center gap-1 mt-auto`}>
                  <span>Follow us</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
