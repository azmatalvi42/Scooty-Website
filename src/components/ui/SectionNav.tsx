import { motion } from 'framer-motion';
import { SNAP_SECTIONS } from '../../hooks/useSectionSnap';

const LABELS: Record<string, string> = {
  home:     'Home',
  services: 'Services',
  riders:   'Chatbot',
  impact:   'Projects',
  about:    'About',
};

interface SectionNavProps {
  currentIndex: number;
}

export const SectionNav = ({ currentIndex }: SectionNavProps) => {
  const goTo = (idx: number) => {
    const el = document.getElementById(SNAP_SECTIONS[idx]);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      {SNAP_SECTIONS.map((id, idx) => {
        const isActive = idx === currentIndex;
        return (
          <button
            key={id}
            onClick={() => goTo(idx)}
            aria-label={`Go to ${LABELS[id] ?? id}`}
            className="group relative flex items-center justify-end"
          >
            {/* Label — shown on hover, desktop only */}
            <span className="pointer-events-none absolute right-full mr-3 hidden sm:block whitespace-nowrap text-xs font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
              {LABELS[id] ?? id}
            </span>

            {/* Pill / dot */}
            <motion.div
              layout
              animate={
                isActive
                  ? { height: 32, width: 4, opacity: 1 }
                  : { height: 6,  width: 6,  opacity: 0.45 }
              }
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              style={{
                borderRadius: 99,
                background: isActive
                  ? 'linear-gradient(to bottom, #FEC001, #FFD84D)'
                  : 'rgba(255,255,255,0.7)',
                boxShadow: isActive
                  ? '0 0 10px 2px rgba(254,192,1,0.55)'
                  : 'none',
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
