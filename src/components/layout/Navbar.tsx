import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/LOGO - TM.png';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';



const announcements = [
  { text: '🛴 SCOOTY is now live in Brampton, Barrie & Burlington', linkText: 'Learn More', href: '/partners' },
  { text: '🤝 Proud partners with Metrolinx — innovating transit across Ontario', linkText: 'See the Partnership', href: '/partners/metrolinx' },
  { text: '⚡ First & last-mile transit solutions powered by AI', linkText: 'Explore Technology', href: '/technology' },
  { text: '🍁 100% Canadian — built and operated right here in Ontario', linkText: 'About Us', href: '/about' },
];

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Riders', href: '/riders' },
  { name: 'Partners', href: '/partners' },
  { name: 'Technology', href: '/technology' },
  { name: 'About Us', href: '/about' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!announcementVisible) return;
    const timer = setInterval(() => {
      setAnnouncementIndex(i => (i + 1) % announcements.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [announcementVisible]);

  const handleTalkToUs = () => {
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
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-black/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
    >
      {/* ── Announcement Bar ── */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-primary-500 text-black"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-center text-xs font-semibold relative overflow-hidden h-6">
              <AnimatePresence mode="wait">
                <motion.span
                  key={announcementIndex}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center gap-1.5"
                >
                  <span>{announcements[announcementIndex].text} —</span>
                  <Link
                    to={announcements[announcementIndex].href}
                    className="underline underline-offset-2 hover:opacity-75 transition-opacity"
                  >
                    {announcements[announcementIndex].linkText}
                  </Link>
                </motion.span>
              </AnimatePresence>
              <button
                onClick={() => setAnnouncementVisible(false)}
                className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity z-10"
                aria-label="Dismiss announcement"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Scooty" className="h-10 w-auto" />
              {/* Badge — desktop only */}
              <span className="hidden md:inline-flex items-center px-2.5 py-1 bg-[#fec001]/10 border border-[#fec001]/30 rounded-full text-xs font-semibold text-[#fec001]">
                Proudly Canadian · Made in Ontario
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-baseline space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-primary-400'
                      }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.button
              onClick={handleTalkToUs}
              className="hidden sm:flex px-5 py-2 bg-primary-500 text-black rounded-full text-sm font-semibold hover:bg-primary-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download the App
            </motion.button>
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-primary-400 p-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-lg overflow-hidden border-t border-gray-100 dark:border-white/10"
      >
        <div className="px-4 pt-3 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-500/5'
                  : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-gray-100 dark:border-white/10">
            <button
              onClick={handleTalkToUs}
              className="w-full mt-2 px-4 py-2.5 bg-primary-500 text-black rounded-full text-sm font-semibold hover:bg-primary-400 transition-all duration-300"
            >
              Talk to Us
            </button>
            <div className="flex justify-center mt-3">
              <span className="inline-flex items-center px-2.5 py-1 bg-[#fec001]/10 border border-[#fec001]/30 rounded-full text-xs font-semibold text-[#fec001]">
                Proudly Canadian · Made in Ontario
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};
