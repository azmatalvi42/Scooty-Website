import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const announcements = [
  { text: 'Now live in Brampton, Barrie & Burlington', linkText: 'Learn More', href: '/partners' },
  { text: 'Proud partners with Metrolinx', linkText: 'See Partnership', href: '/partners/metrolinx' },
  { text: 'First & last-mile transit powered by AI', linkText: 'Explore', href: '/technology' },
  { text: '100% Canadian — built in Ontario', linkText: 'About Us', href: '/about' },
];

const navigation = [
  { name: 'Home',       href: '/' },
  { name: 'Riders',     href: '/riders' },
  { name: 'Partners',   href: '/partners' },
  { name: 'Technology', href: '/technology' },
  { name: 'About Us',   href: '/about' },
  {name: 'Test Page', href: '/test' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!announcementVisible) return;
    const timer = setInterval(() => {
      setAnnouncementIndex(i => (i + 1) % announcements.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [announcementVisible]);

  const handleContact = () => {
    setIsOpen(false);
    if (location.pathname === '/') {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASING }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* ── Announcement bar ── */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden bg-[#FEC001]"
          >
            <div className="relative flex items-center justify-center h-8 px-10">
              {/* Sliding text */}
              <div className="relative overflow-hidden h-full flex items-center max-w-[calc(100vw-5rem)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={announcementIndex}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASING }}
                    className="flex items-center gap-1.5 whitespace-nowrap text-[11px] sm:text-xs font-semibold text-black/80"
                  >
                    <span className="w-1 h-1 rounded-full bg-black/40 flex-shrink-0" />
                    <span className="truncate">{announcements[announcementIndex].text}</span>
                    <span className="text-black/40 flex-shrink-0">—</span>
                    <Link
                      to={announcements[announcementIndex].href}
                      className="inline-flex items-center gap-0.5 text-black font-bold underline underline-offset-2 hover:opacity-70 transition-opacity flex-shrink-0"
                    >
                      {announcements[announcementIndex].linkText}
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dismiss button — absolutely positioned */}
              <button
                onClick={() => setAnnouncementVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black/80 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main nav bar ── */}
      <motion.div
        animate={{
          backgroundColor: scrolled ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0)',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Three-column layout: logo | nav (centered) | actions */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[4.5rem]">

            {/* ── Logo (left) ── */}
            <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.01 }}>
              <Link to="/" className="flex items-center">
                <img
            src="/assets/scooty-logo-tm.png"
                  alt="SCOOTY"
                  className="h-7 sm:h-8 w-auto brightness-0 invert"
                  fetchPriority="high"
                  decoding="async"
                />
              </Link>
              <span className="hidden lg:inline-flex items-center px-2.5 py-1 bg-[#FEC001]/10 border border-[#FEC001]/20 rounded-full text-[10px] font-semibold text-[#FEC001] tracking-wide whitespace-nowrap">
                Proudly Canadian · Made in Ontario
              </span>
            </motion.div>

            {/* ── Desktop nav (center) ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? 'text-black' : 'text-white/50 hover:text-white/90'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-[#FEC001]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center justify-end gap-2.5">
              <ThemeToggle />

              <motion.button
                onClick={handleContact}
                className="hidden md:flex items-center px-5 py-2 bg-[#FEC001] text-black rounded-full text-sm font-bold"
                whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(254,192,1,0.4)' }}
                whileTap={{ scale: 0.96 }}
              >
                Get Started
              </motion.button>

              {/* Mobile hamburger */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.08] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.13] transition-all duration-200"
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASING }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.97)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="px-3 pt-2 pb-5 space-y-1">
              {navigation.map((item, i) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04, ease: EASING }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'text-white bg-white/[0.07] border border-white/[0.1]'
                          : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FEC001] flex-shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="pt-3 mt-1 border-t border-white/[0.06]">
                <motion.button
                  onClick={handleContact}
                  className="w-full px-4 py-3 bg-[#FEC001] text-black rounded-full text-sm font-bold"
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.22, ease: EASING }}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
