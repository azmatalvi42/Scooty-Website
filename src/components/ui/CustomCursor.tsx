import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', updateMousePosition);

    const hoverElements = document.querySelectorAll('button, a, [role="button"]');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{
        x: mousePosition.x - 14,
        y: mousePosition.y - 14,
        scale: isHovering ? 1.3 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      {/* Mini scooter SVG */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
      >
        {/* Back wheel */}
        <circle cx="6" cy="23" r="3.5" stroke="#EAB308" strokeWidth="2" fill="none" />
        {/* Front wheel */}
        <circle cx="22" cy="23" r="3.5" stroke="#EAB308" strokeWidth="2" fill="none" />
        {/* Deck */}
        <line x1="6" y1="20" x2="22" y2="20" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
        {/* Stem */}
        <line x1="20" y1="20" x2="22" y2="8" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
        {/* Handlebar */}
        <line x1="18" y1="8" x2="26" y2="8" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};
