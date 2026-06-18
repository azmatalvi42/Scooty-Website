import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const navColumns = [
  {
    heading: 'Riders',
    links: [
      { label: 'Get Started',   href: '/riders/getting-started' },
      { label: 'Where to Ride', href: '/riders/where-to-ride' },
      { label: 'Safety',        href: '/riders/safety' },
      { label: 'Vehicles',      href: '/riders/vehicles' },
      { label: 'Parking',       href: '/riders/parking' },
    ],
  },
  {
    heading: 'Partners',
    links: [
      { label: 'Brampton',   href: '/partners/brampton' },
      { label: 'Barrie',     href: '/partners/barrie' },
      { label: 'Markham',    href: '/partners/markham' },
      { label: 'Burlington', href: '/partners/burlington' },
      { label: 'Metrolinx',  href: '/partners/metrolinx' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',   href: '/about' },
      { label: 'Technology', href: '/technology' },
      { label: 'Blog',       href: '/blog' },
      { label: 'Contact',    href: '/#contact' },
    ],
  },
];

const partnerLogos = [
  { src: '/assets/Partners/Marquee/barrie-logo.webp',     alt: 'City of Barrie' },
  { src: '/assets/Partners/Marquee/markham-logo.webp',    alt: 'City of Markham' },
  { src: '/assets/Partners/Marquee/burlington-logo.webp', alt: 'City of Burlington' },
  { src: '/assets/Partners/Marquee/metrolinx-logo.webp',  alt: 'Metrolinx' },
  { src: '/assets/Partners/Marquee/otu-logo.webp',        alt: 'OTU' },
  { src: '/assets/Partners/Marquee/tmu-logo.webp',        alt: 'TMU' },
];

const socials = [
  { icon: Linkedin,   href: 'https://linkedin.com/company/ridescooty', label: 'LinkedIn' },
  { icon: Twitter,    href: 'https://twitter.com/ridescooty',           label: 'Twitter/X' },
  { icon: Instagram,  href: 'https://instagram.com/ridescooty',         label: 'Instagram' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@ride.scooty',          label: 'TikTok' },
  { icon: Mail,       href: 'mailto:partnerships@scooty.ca',            label: 'Email' },
];

export const Footer = () => (
  <footer className="bg-[#070810] border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">

      {/* ── Top: logo + nav columns ── */}
      <div className="py-14 grid grid-cols-2 sm:grid-cols-4 gap-10 lg:gap-14">

        {/* Logo column */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-5">
          <Link to="/">
            <img
              src="/assets/logo-white-horizontal.webp"
              alt="SCOOTY"
              className="h-8 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/scooty-logo-horizontal-white.webp';
              }}
            />
          </Link>
          <p className="text-white/30 text-xs leading-relaxed max-w-[180px]">
            Moving cities forward — one ride at a time. 🍁
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={s.label}
                className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/35 hover:text-[#FEC001] hover:border-[#FEC001]/30 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
              >
                <s.icon className="w-3.5 h-3.5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {navColumns.map((col) => (
          <div key={col.heading}>
            <p className="text-white text-xs font-bold tracking-[0.1em] uppercase mb-4">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-white/38 text-xs hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Partner logos ── */}
      <div className="border-t border-white/[0.05] py-8">
        <p className="text-white/22 text-[10px] font-bold tracking-[0.12em] uppercase mb-5">
          Partners & Supporters
        </p>
        <div className="flex flex-wrap items-center gap-7">
          {partnerLogos.map((p) => (
            <img
              key={p.alt}
              src={p.src}
              alt={p.alt}
              className="h-5 w-auto opacity-25 hover:opacity-55 transition-opacity duration-200 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.05] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/22 text-[11px]">
          © {new Date().getFullYear()} SCOOTY Technologies Inc. All rights reserved. · Proudly Canadian 🍁
        </p>
        <div className="flex items-center gap-5">
          {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((name) => (
            <a key={name} href="#" className="text-white/22 text-[11px] hover:text-white/50 transition-colors duration-200">
              {name}
            </a>
          ))}
        </div>
      </div>

    </div>
  </footer>
);
