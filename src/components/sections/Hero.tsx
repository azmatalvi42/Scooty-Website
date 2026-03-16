import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

const stats = [
  { number: '5+', label: 'Canadian Cities' },
  { number: '10M+', label: 'Rides' },
  { number: '99.9%', label: 'Uptime' },
  { number: '40%', label: 'Cost Reduction' },
];

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Video background ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        {/* Primary — close-up scooter riding */}
        <source
          src="https://videos.pexels.com/video-files/5321794/5321794-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
        {/* Fallback */}
        <source
          src="https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* ── Dark overlay with bottom gradient pull ── */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* ── Subtle yellow grid — sits on top of video ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(234,179,8,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Subtle yellow glow orbs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-24 left-12 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl"
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Heading - Removed the large pb-20 to keep centering clean */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight"
          >
            <span className="block text-white">Where Mobility</span>
            <span className="block text-primary-500">Meets Intelligence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-lg text-white/70 max-w-3xl mx-auto"
          >
            We integrate on-demand mobility, digital payments and AI-powered transit intelligence with existing transit infrastructure to make daily commuting smooth, simple and efficient.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Bottom Sentence - Pinned to the section bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-20 left-0 right-0 text-center px-4"
      >
        <p className="text-xl text-primary-400 font-display tracking-wide font-bold pb-5">
          <span className="text-white">We’re on a mission to  </span>power how cities move people.
        </p>
      </motion.div>

      {/* ── Scroll nudge ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs text-white/40 tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};
