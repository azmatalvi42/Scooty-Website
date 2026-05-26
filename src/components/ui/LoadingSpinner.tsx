import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  text?: string;
}

const Scooter = () => (
  <svg
    viewBox="0 0 90 60"
    width="120"
    height="80"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_4px_12px_rgba(254,192,1,0.35)]"
  >
    {/* Deck */}
    <rect x="16" y="42" width="58" height="5" rx="2" fill="#FEC001" stroke="#1a1a22" strokeWidth="0.6" />
    {/* Front fork */}
    <line x1="74" y1="42" x2="74" y2="50" stroke="#1a1a22" strokeWidth="2" strokeLinecap="round" />
    {/* T-stem */}
    <line x1="74" y1="42" x2="68" y2="12" stroke="#FEC001" strokeWidth="3.2" strokeLinecap="round" />
    {/* Handlebar */}
    <line x1="62" y1="12" x2="74" y2="12" stroke="#1a1a22" strokeWidth="3" strokeLinecap="round" />
    {/* Rider body */}
    <rect x="32" y="22" width="13" height="16" rx="4" fill="#1f1f28" />
    {/* Rider head */}
    <circle cx="38.5" cy="15" r="5" fill="#FEC001" />
    {/* Rider arm */}
    <line x1="44" y1="25" x2="66" y2="14" stroke="#1f1f28" strokeWidth="3.2" strokeLinecap="round" />
    {/* Rider legs */}
    <rect x="34" y="36" width="3.5" height="9" rx="1.5" fill="#1f1f28" />
    <rect x="40" y="36" width="3.5" height="9" rx="1.5" fill="#1f1f28" />
    {/* Rear wheel */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '20px 50px' }}
    >
      <circle cx="20" cy="50" r="8" fill="#1a1a22" />
      <circle cx="20" cy="50" r="6.5" fill="#0a0a0a" />
      <line x1="20" y1="42.5" x2="20" y2="57.5" stroke="#FEC001" strokeWidth="1.3" />
      <line x1="12.5" y1="50" x2="27.5" y2="50" stroke="#FEC001" strokeWidth="1.3" />
      <circle cx="20" cy="50" r="1.4" fill="#FEC001" />
    </motion.g>
    {/* Front wheel */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '74px 50px' }}
    >
      <circle cx="74" cy="50" r="8" fill="#1a1a22" />
      <circle cx="74" cy="50" r="6.5" fill="#0a0a0a" />
      <line x1="74" y1="42.5" x2="74" y2="57.5" stroke="#FEC001" strokeWidth="1.3" />
      <line x1="66.5" y1="50" x2="81.5" y2="50" stroke="#FEC001" strokeWidth="1.3" />
      <circle cx="74" cy="50" r="1.4" fill="#FEC001" />
    </motion.g>
  </svg>
);

export const LoadingSpinner = ({ text = 'Loading Scooty...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white dark:bg-black gap-6">
      <div className="relative w-[360px] h-[140px] overflow-hidden">
        {/* Speed lines */}
        {[0, 1, 2, 3].map(i => (
          <motion.span
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#FEC001]/55 to-transparent"
            style={{ top: `${28 + i * 16}px`, width: '70px' }}
            animate={{ x: [-90, 450] }}
            transition={{
              duration: 0.55,
              repeat: Infinity,
              delay: i * 0.13,
              ease: 'linear',
            }}
          />
        ))}

        {/* Road */}
        <div className="absolute bottom-2.5 left-0 right-0 h-px bg-gray-300 dark:bg-white/20" />
        <motion.div
          className="absolute bottom-1.5 left-0 h-px w-[200%]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #FEC001 0, #FEC001 12px, transparent 12px, transparent 32px)',
          }}
        />

        {/* Scooter */}
        <motion.div
          className="absolute bottom-0 left-0"
          initial={{ x: -130 }}
          animate={{ x: 360 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
        >
          <Scooter />
        </motion.div>
      </div>

      <motion.p
        className="text-gray-600 dark:text-gray-300 font-medium font-display tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
    </div>
  );
};
