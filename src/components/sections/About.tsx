import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Heart, Handshake, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

const OntarioFlag = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 120 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="60" fill="#CF142B" />
    <rect width="60" height="30" fill="#012169" />
    <line x1="0" y1="0" x2="60" y2="30" stroke="white" strokeWidth="10" />
    <line x1="60" y1="0" x2="0" y2="30" stroke="white" strokeWidth="10" />
    <polygon points="30,12 60,0 60,5 35,15" fill="#CF142B" />
    <polygon points="0,25 25,15 0,30" fill="#CF142B" />
    <polygon points="30,18 60,25 60,30 55,30" fill="#CF142B" />
    <polygon points="0,0 5,0 30,12" fill="#CF142B" />
    <rect x="24" y="0" width="12" height="30" fill="white" />
    <rect x="0" y="12" width="60" height="6" fill="white" />
    <rect x="26" y="0" width="8" height="30" fill="#CF142B" />
    <rect x="0" y="13" width="60" height="4" fill="#CF142B" />
    <path d="M78,7 L108,7 L108,42 L93,55 L78,42 Z" fill="white" />
    <path d="M78,7 L108,7 L108,23 L78,23 Z" fill="#CF142B" />
    <rect x="89" y="7" width="9" height="16" fill="#FFD700" />
    <rect x="78" y="14" width="30" height="5" fill="#FFD700" />
    <rect x="90.5" y="7" width="6" height="16" fill="#CF142B" />
    <rect x="78" y="15" width="30" height="3" fill="#CF142B" />
    <path d="M78,23 L108,23 L108,42 L93,55 L78,42 Z" fill="#215732" />
    {[83, 93, 103].map((cx, i) => (
      <path
        key={i}
        transform={`translate(${cx},36) scale(0.32)`}
        d="M0,-14 C0,-14 -4,2 -7,4 C-10,6 -16,2 -19,3 C-22,4 -18,10 -18,13 C-18,16 -24,17 -24,20 C-24,23 -18,23 -16,26 C-14,29 -17,35 -15,36 C-13,37 -7,32 -4,33 L-4,46 L4,46 L4,33 C7,32 13,37 15,36 C17,35 14,29 16,26 C18,23 24,23 24,20 C24,17 18,16 18,13 C18,10 22,4 19,3 C16,2 10,6 7,4 C4,2 0,-14 0,-14 Z"
        fill="#FFD700"
      />
    ))}
  </svg>
);

const MapleLeafSVG = ({ className = '' }: { className?: string }) => (
  <svg viewBox="-2015 -2000 4030 4030" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const useSection = () => useInView({ triggerOnce: true, threshold: 0.1 });

const coreValues = [
  {
    icon: Shield,
    title: 'Safety',
    description:
      'Safety is a fundamental right for everyone. Inspired by Vision Zero principles, SCOOTY\'s commitment to safety is the foundation of our company; expressed and demonstrated in our branding, our technology, and our daily operations to make SCOOTY the safest option for all members of a community.',
  },
  {
    icon: Heart,
    title: 'Courtesy',
    description:
      'Courtesy is critical in making shared mobility work for everyone. We encompass courtesy as a design thinking principle and implement it into our planning process, operational best practices and communication awareness.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description:
      'SCOOTY plans, designs and delivers mobility solutions through our community partnerships network. Our plans are guided by the collective domain knowledge and expertise of our partners, tailored to your community\'s needs and carefully aligned with municipal vision, goals, strategies, plans and policies.',
  },
];

export const About = () => {
  const [headerRef, headerInView] = useSection();
  const [valuesRef, valuesInView] = useSection();
  const [canadaRef, canadaInView] = useSection();
  const [socialsRef, socialsInView] = useSection();

  return (
    <section id="about" className="bg-white dark:bg-black">

      {/* ── BUILT PROUDLY IN ONTARIO ── */}
      <div ref={headerRef} className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">
              Built Proudly in <span className="text-red-500">Ontario</span>
            </h2>
            <MapleLeafSVG className="w-10 h-11 text-red-500 dark:text-white flex-shrink-0" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed pb-10">
            SCOOTY is a 100% owned and operated Canadian company built and developed with local talent that has world-class experience, here in Ontario. We live in the communities we serve so we have a deep sense of ownership and passion to bring the latest mobility solutions and technologies that meet the needs of our communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Brampton', 'Brampton HQ', 'Serving 5+ Cities', 'Expanding Nationwide'].map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-[#fec001]/10 border border-[#fec001]/30 text-[#fec001] rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CORE VALUES ── */}
      <div ref={valuesRef} className="py-24 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              SCOOTY <span className="text-primary-500">Core Values</span>
            </h2>
            <div className="flex justify-center items-center gap-6 text-lg font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
              <span>Safety</span>
              <span className="text-primary-500">·</span>
              <span>Courtesy</span>
              <span className="text-primary-500">·</span>
              <span>Partnership</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {coreValues.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="bg-white dark:bg-navy-800 rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300">
                  <v.icon className="w-6 h-6 text-primary-500 group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-black rounded-full font-semibold hover:bg-primary-400 transition-all duration-300"
            >
              Learn More <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── MADE IN CANADA ── */}
      <div ref={canadaRef} className="py-24 bg-black relative overflow-hidden">
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
            initial={{ opacity: 0, y: 40 }}
            animate={canadaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >




            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={canadaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap justify-center gap-3"
            >
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── SOCIALS ── */}
      <div ref={socialsRef} className="py-24 bg-gray-50 dark:bg-navy-900">
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
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Stay connected with SCOOTY — real stories, city launches, and the future of transit, live from our community.
            </p>
            <div className="flex justify-center space-x-4">
              {[
                { icon: Linkedin, href: 'https://linkedin.com/company/ridescooty' },
                { icon: Twitter, href: 'https://twitter.com/ridescooty' },
                { icon: Instagram, href: 'https://instagram.com/ridescooty' },
                { icon: Facebook, href: 'https://facebook.com/ridescooty' },
                { icon: TikTokIcon, href: 'https://tiktok.com/@ride.scooty' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-black hover:bg-primary-400 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};
