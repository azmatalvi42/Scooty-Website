import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Globe, Zap, Instagram, Linkedin, Twitter, Facebook, Youtube, ExternalLink } from 'lucide-react';

const useSection = () => useInView({ triggerOnce: true, threshold: 0.1 });

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
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 L56 30 L80 18 L68 40 L95 42 L75 56 L82 80 L60 68 L58 95 L50 75 L42 95 L40 68 L18 80 L25 56 L5 42 L32 40 L20 18 L44 30 Z" />
  </svg>
);

export const AboutPage = () => {
  const [heroRef, heroInView] = useSection();
  const [storyRef, storyInView] = useSection();
  const [missionRef, missionInView] = useSection();
  const [canadaRef, canadaInView] = useSection();
  const [socialsRef, socialsInView] = useSection();

  return (
    <div className="min-h-screen bg-white dark:bg-black">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white dark:from-black dark:via-navy-800 dark:to-black" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-2xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 left-20 w-28 h-28 bg-red-500/10 rounded-full blur-2xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6"
          >
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">About Us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
          >
            <span className="block text-gray-900 dark:text-white">Built in Canada.</span>
            <span className="block text-primary-500">For Every Community.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
            A Canadian mobility company on a mission to modernize public transit — one community at a time.
          </motion.p>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section ref={storyRef} className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-6">
                Who We <span className="text-primary-500">Are</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-lg">
                SCOOTY is a Canadian mobility company delivering safe, sustainable, and intelligent transportation solutions to cities, campuses, businesses, and communities across Ontario.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Through three integrated products — On-Demand Mobility, SCOOTY PAY, and AI RideGuide — we connect riders to regional transit, simplify how people pay for their journeys, and use AI to make every commute smarter and more reliable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '2023', label: 'Founded in Ontario' },
                { value: '5+', label: 'Cities Active' },
                { value: '3', label: 'Core Products' },
                { value: '100%', label: 'Canadian-Built' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={storyInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all duration-300"
                >
                  <div className="text-3xl font-bold font-display text-primary-500 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ── */}
      <section ref={missionRef} className="py-24 bg-gray-50 dark:bg-navy-900">
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
                className="bg-white dark:bg-navy-800 rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300 group"
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
              <MapleLeaf className="relative w-20 h-20 text-red-500" />
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

          {/* Canadian flag */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={canadaInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center mx-auto w-48 h-8 rounded-lg overflow-hidden mb-12 shadow-lg"
          >
            <div className="w-1/4 h-full bg-red-600" />
            <div className="w-1/2 h-full bg-white flex items-center justify-center">
              <MapleLeaf className="w-5 h-5 text-red-600" />
            </div>
            <div className="w-1/4 h-full bg-red-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {['Founded in Ontario', 'Brampton HQ', 'Serving 5+ Cities', 'Expanding Nationwide'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
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
