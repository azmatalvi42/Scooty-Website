/**
 * Hero variants.
 * HeroOverCity — real scooter PNG over the live city animation.
 * HeroSplit    — Argo-style split layout (kept for /hero-lab).
 */
import { useRef, useMemo, MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScooterModel, ShadowBlob } from '../three/ScooterModel';

/* ══════════════════════════════════════════════════════════════════
   HERO OVER CITY  —  real scooter photo + brand squiggly over city
   ══════════════════════════════════════════════════════════════════ */
export function HeroOverCity() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* Scooter parallax: slides up + fades as hero scrolls off */
  const scooterY   = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const scooterX   = useTransform(scrollYProgress, [0, 1], ['0%',  '6%']);
  /* NOTE: opacity on the outer wrapper caused a Framer Motion init bug (starts at ~0.08).
     Instead, apply fade via the inner motion.div's animate prop + scroll listener. */

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">

      {/* ── Left text veil ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to right, #0c0e13 30%, rgba(12,14,19,0.88) 46%, rgba(12,14,19,0.22) 62%, transparent 80%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55 pointer-events-none z-[1]" />

      {/* ── Brand squiggly — decorative behind scooter ── */}
      <motion.div
        className="absolute right-[-4%] top-[10%] w-[55vw] max-w-[700px] pointer-events-none z-[2] select-none"
        style={{ y: scooterY }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src="/assets/fleet/squiggly-gold.webp" alt="" aria-hidden className="w-full h-auto" />
      </motion.div>

      {/* ── Real scooter PNG (the actual vehicle, not a 3D model) ── */}
      <motion.div
        className="absolute right-[2%] top-0 bottom-0 flex items-center pointer-events-none z-[3]"
        style={{ y: scooterY, x: scooterX }}
      >
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Warm halo — dark scooter needs a bright backdrop to pop against dark city */}
          <div
            className="absolute inset-0 -m-[15%] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 52% 48%, rgba(255,215,80,0.52) 0%, rgba(254,192,1,0.32) 28%, rgba(230,160,0,0.12) 52%, transparent 72%)',
              filter: 'blur(28px)',
            }}
          />
          {/* Subtle ground reflection */}
          <div
            className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[75%] h-[12%] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(254,192,1,0.6) 0%, transparent 70%)', filter: 'blur(14px)' }}
          />
          {/* Scooter image — bright yellow & black, clearly readable on dark bg */}
          <motion.img
            src="/assets/fleet/scooter-cutout.webp"
            alt="SCOOTY e-scooter"
            className="h-[66vh] max-h-[620px] w-auto object-contain select-none relative z-10"
            style={{ filter: 'drop-shadow(0 28px 56px rgba(0,0,0,0.65)) drop-shadow(0 0 60px rgba(254,192,1,0.38)) drop-shadow(-4px 0 24px rgba(254,192,1,0.22))' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
          />
        </motion.div>
      </motion.div>

      {/* ── Text content ── */}
      <div className="relative z-[4] max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[520px]"
        >
          <h1 className="text-[clamp(46px,6vw,88px)] font-black font-display tracking-[-0.03em] text-white leading-[0.91]">
            Where Mobility<br />
            <span className="text-[#FEC001]">Meets Intelligence</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white max-w-[400px] leading-relaxed font-display font-bold">
            <span className="text-white/65">We're on a mission to </span>
            power how cities move people.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full bg-[#FEC001] text-black font-black text-sm tracking-wide hover:bg-[#FFD20F] transition-colors"
            >
              Find a ride <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full border border-white/22 bg-white/[0.06] backdrop-blur-sm text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              For cities
            </motion.button>
          </div>

          {/* Scroll nudge */}
          <motion.div
            className="mt-16 flex items-center gap-2.5 text-white/28 text-[11px] font-semibold tracking-[0.12em] uppercase select-none cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/20">
              <span className="w-[3px] h-[3px] rounded-full bg-white/45 animate-bounce" />
            </span>
            Scroll to explore
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════════
   Everything below is kept for /hero-lab only
   ══════════════════════════════════════════════════════════════════ */

function useScrollProgressRef(target: MutableRefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] });
  const ref = useRef(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (scrollYProgress as any).on('change', (v: number) => { ref.current = v; });
  return ref;
}

function GlowBlob({ position = [0, 0.01, 0] as [number,number,number], scale = 2.6 }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 4, 128, 128, 122);
    grad.addColorStop(0, 'rgba(254,192,1,0.42)');
    grad.addColorStop(0.45, 'rgba(254,192,1,0.15)');
    grad.addColorStop(1, 'rgba(254,192,1,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale * 1.55, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function RidingScooter({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!g.current) return;
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    g.current.position.x = THREE.MathUtils.lerp(1.25, -1.3, p);
    g.current.position.y = 0.4 + Math.sin(t * 1.65) * 0.022;
    g.current.rotation.z = Math.sin(t * 1.65) * 0.007;
    g.current.rotation.x = 0.014;
    g.current.rotation.y = -0.20 + Math.sin(t * 0.42) * 0.025;
  });
  return (
    <group ref={g} scale={0.82}>
      <ScooterModel spin />
      <GlowBlob position={[0, -0.35, 0]} scale={3.0} />
    </group>
  );
}

function OverCityCanvas({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}
      camera={{ position: [2.2, 1.1, 5.8], fov: 36 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.9, 0)}
    >
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#c8bc90', '#1A1C22', 0.55]} />
      <directionalLight position={[3, 7, 4]} intensity={1.8} color="#fff4d0" />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#FEC001" />
      <pointLight position={[0.4, -0.25, 0.5]} intensity={3.2} color="#FEC001" distance={3.8} decay={2} />
      <RidingScooter progressRef={progressRef} />
    </Canvas>
  );
}

function ScooterStage({
  progressRef, scale = 1, baseYaw = -0.5, xRange = 0.8, xOffset = 0,
}: {
  progressRef: MutableRefObject<number>;
  scale?: number; baseYaw?: number; xRange?: number; xOffset?: number;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    if (g.current) {
      g.current.position.x = xOffset + THREE.MathUtils.lerp(-xRange, xRange, p);
      g.current.position.y = Math.sin(t * 1.7) * 0.025;
      g.current.rotation.y = baseYaw + Math.sin(t * 0.35) * 0.04;
      g.current.rotation.z = Math.sin(t * 1.7) * 0.008;
    }
  });
  return (
    <group ref={g} scale={scale}>
      <ScooterModel />
      <ShadowBlob position={[0, 0.02, 0]} scale={2.1} />
    </group>
  );
}

type StageProps = { scale?: number; xRange?: number; xOffset?: number };

function HeroScooterCanvas({
  progressRef, transparent = false, stage,
}: {
  progressRef: MutableRefObject<number>;
  transparent?: boolean;
  stage?: StageProps;
}) {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: transparent }}
      camera={{ position: [4.0, 2.7, 4.7], fov: 30 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.85, 0)}
    >
      {!transparent && <color attach="background" args={['#EBE6DC']} />}
      <ambientLight intensity={0.75} />
      <hemisphereLight args={['#ffffff', '#d8cfbb', 0.55]} />
      <directionalLight position={[5, 8, 4]} intensity={1.5} />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#FFE6A0" />
      <ScooterStage progressRef={progressRef} {...stage} />
    </Canvas>
  );
}

export function HeroSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useScrollProgressRef(sectionRef);
  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#EFEAE1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 min-h-screen grid lg:grid-cols-2 items-center gap-8 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#15171C] text-white text-xs font-bold tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FEC001]" /> First & last-mile, powered by AI
          </span>
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold font-display tracking-tight text-[#15171C] leading-[0.98]">
            Move your <br /> city <span className="text-[#caa400]">forward.</span>
          </h1>
          <p className="mt-6 text-lg text-[#5b5749] max-w-md">Shared e-scooters that close the gap between transit and your front door.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FEC001] text-black font-bold hover:bg-[#FFD00F] transition-colors">
              Find a ride <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-[#15171C]/15 text-[#15171C] font-bold hover:border-[#15171C]/40 transition-colors">
              For cities
            </button>
          </div>
        </motion.div>
        <div className="relative h-[46vh] lg:h-[78vh] rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#E7E0D2] to-[#DDD4C2] border border-black/[0.06]">
          <HeroScooterCanvas progressRef={progressRef} stage={{ scale: 0.92, xRange: 0.7 }} />
        </div>
      </div>
    </section>
  );
}
