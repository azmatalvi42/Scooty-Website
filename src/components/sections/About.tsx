import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';


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

const useSection = () => useInView({ triggerOnce: true, threshold: 0.08 });
const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];


export const About = () => {
  const [headerRef, headerInView] = useSection();
  const [socialsRef, socialsInView] = useSection();

  return (
    <section id="about">

      {/* ── BUILT PROUDLY IN ONTARIO ── */}
      <div ref={headerRef} className="py-12 sm:py-16 ls:py-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEC001]/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: EASING }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="relative inline-block isolate">
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEC001]/20 to-transparent blur-2xl pointer-events-none -z-10"
            />
            <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
              Our Story
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white tracking-tight">
                Built Proudly in <span className="text-yellow-500">Ontario</span>
              </h2>
              <MapleLeafSVG className="w-9 h-10 sm:w-11 sm:h-12 text-red-500 dark:text-red-400 flex-shrink-0" />
            </div>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              SCOOTY is a 100% owned and operated Canadian company built and developed with local talent that has world-class experience, right here in Ontario. We live in the communities we serve — so we have a deep sense of ownership and passion to bring the latest mobility solutions that meet the needs of our communities.
            </p>
          </div>
        </motion.div>

        </div>
      </div>{/* /Built Proudly wrapper */}

      {/* ── SOCIALS ── */}
      <div ref={socialsRef} className="py-16 sm:py-20 ls:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={socialsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASING }}
            className="text-center"
          >
            <div className="relative inline-block isolate mb-10">
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEC001]/20 to-transparent blur-2xl pointer-events-none -z-10"
              />
              <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
                Follow Along
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 tracking-tight">
                Stay in Motion with <span className="text-[#FEC001]">SCOOTY</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Real stories, city launches, and the future of transit — live from our community.
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-3 sm:gap-4">
              {[
                { icon: Linkedin, href: 'https://linkedin.com/company/ridescooty', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://twitter.com/ridescooty', label: 'Twitter' },
                { icon: Instagram, href: 'https://instagram.com/ridescooty', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com/ridescooty', label: 'Facebook' },
                { icon: TikTokIcon, href: 'https://tiktok.com/@ride.scooty', label: 'TikTok' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 sm:w-12 sm:h-12 bg-[#FEC001] rounded-xl flex items-center justify-center text-black hover:bg-[#FFD00F] transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -3, boxShadow: '0 0 24px rgba(254,192,1,0.45)' }}
                  whileTap={{ scale: 0.93 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={socialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.07, ease: EASING }}
                >
                  <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>{/* /Socials */}

    </section>
  );
};
