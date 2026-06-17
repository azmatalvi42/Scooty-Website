import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const navLinks = [
  { name: 'Home',       href: '/' },
  { name: 'Riders',     href: '/riders' },
  { name: 'Partners',   href: '/partners' },
  { name: 'Technology', href: '/technology' },
  { name: 'Blog',       href: '/blog' },
  { name: 'About',      href: '/about' },
  { name: 'Contact',    href: '/#contact' },
];

const socials = [
  { icon: Linkedin,  href: 'https://linkedin.com/company/ridescooty', label: 'LinkedIn' },
  { icon: Twitter,   href: 'https://twitter.com/ridescooty',          label: 'Twitter' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@ride.scooty',       label: 'TikTok' },
  { icon: Mail,      href: 'mailto:partnerships@scooty.ca',           label: 'Email' },
];

export const Footer = () => (
  <footer className="bg-black border-t border-white/[0.05]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      {/* Top row: logo + nav + socials */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-xs text-gray-500 hover:text-white transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-2.5">
          {socials.map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={s.label}
              className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-[#FEC001] hover:border-[#FEC001]/25 hover:bg-[#FEC001]/08 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
            >
              <s.icon className="w-3 h-3" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.04] mb-6" />

      {/* Bottom row: copyright + legal */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-gray-600">
          &copy; {new Date().getFullYear()} SCOOTY Technologies Inc. All rights reserved. · 🍁 Proudly Canadian
        </p>
        <div className="flex items-center gap-4">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((name) => (
            <a
              key={name}
              href="#"
              className="text-[11px] text-gray-600 hover:text-[#FEC001] transition-colors duration-200"
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
