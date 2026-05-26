import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';


const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const useSection = () => useInView({ triggerOnce: true, threshold: 0.08 });
const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];


export const About = () => {
  const [socialsRef, socialsInView] = useSection();

  return (
    <section id="about">

      {/* ── SOCIALS ── */}
      <div ref={socialsRef} className="relative isolate py-16 sm:py-20 ls:py-8">
        {/* Soft round glow — same colour as the city animation so it blends seamlessly */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(254,192,1,0.09), rgba(254,192,1,0.04) 32%, rgba(254,192,1,0) 60%), radial-gradient(circle at 50% 40%, rgba(7,7,16,0.82), rgba(7,7,16,0.6) 20%, rgba(7,7,16,0.34) 40%, rgba(7,7,16,0.15) 60%, rgba(7,7,16,0.05) 76%, rgba(7,7,16,0) 90%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={socialsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASING }}
            className="text-center"
          >
            <div className="relative inline-block mb-10">
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
