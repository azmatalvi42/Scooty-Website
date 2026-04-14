import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Video background ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform' }}
      >
        <source src="https://videos.pexels.com/video-files/5321794/5321794-hd_1920_1080_25fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* ── Layered overlays ── */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/55" />
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black to-transparent" />

      {/* ── Subtle brand grid ── */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(254,192,1,1) 1px, transparent 1px), linear-gradient(90deg, rgba(254,192,1,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />


      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: EASING }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold font-display leading-[1.02] tracking-tight"
          >
            <span className="block text-white">Where Mobility</span>
            <span className="block text-[#FEC001]">Meets Intelligence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: EASING }}
            className="text-base sm:text-lg md:text-xl text-gray-200 max-w-xl sm:max-w-2xl mx-auto leading-relaxed"
          >
            We integrate on-demand mobility, digital payments and AI-powered transit intelligence
            with existing transit infrastructure to make daily commuting smooth, simple and efficient.
          </motion.p>

          {/* ── CTA buttons ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.44, ease: EASING }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1"
          >
          </motion.div>
          <p className="text-2xl text-primary-400 font-display tracking-wide font-bold pt-20">
          <span className="text-white">We’re on a mission to  </span>power how cities move people.
        </p>

        </motion.div>
      </div>

      {/* ── Scroll nudge ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 group cursor-pointer"
          aria-label="Scroll to solutions"
        >
          <span className="text-[9px] text-white/25 tracking-[0.25em] uppercase group-hover:text-white/50 transition-colors duration-300">
            Scroll
          </span>
          <div className="w-px h-5 bg-gradient-to-b from-white/25 to-transparent" />
          <ArrowDown className="w-3 h-3 text-white/25 group-hover:text-white/50 transition-colors duration-300" />
        </motion.button>
      </motion.div>
    </section>
  );
};
