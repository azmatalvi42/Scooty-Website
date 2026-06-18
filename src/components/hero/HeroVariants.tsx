import { useRef, useMemo, MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScooterModel, ShadowBlob } from '../three/ScooterModel';

function useScrollProgressRef(target: MutableRefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] });
  const ref = useRef(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    ref.current = v;
  });
  return ref;
}

/* ── Yellow glow blob — reads beautifully on the dark city ─────────── */
function GlowBlob({ position = [0, 0.01, 0] as [number, number, number], scale = 2.6 }) {
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

/* ── Scooter that drives right → left as the hero scrolls off ───────── */
function RidingScooter({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!g.current) return;
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    // Starts in the right third of the screen, rides left as hero scrolls off
    g.current.position.x = THREE.MathUtils.lerp(1.25, -1.3, p);
    // Float above the city — makes it feel like it's hovering, not sitting on it
    g.current.position.y = 0.4 + Math.sin(t * 1.65) * 0.022;
    // Subtle roll with bob
    g.current.rotation.z = Math.sin(t * 1.65) * 0.007;
    // Slight nose-down lean like riding
    g.current.rotation.x = 0.014;
    // Yaw: front-left 3/4 face so it looks like it's riding toward the left
    g.current.rotation.y = -0.20 + Math.sin(t * 0.42) * 0.025;
  });

  return (
    <group ref={g} scale={0.82}>
      <ScooterModel spin />
      <GlowBlob position={[0, -0.35, 0]} scale={3.4} />
    </group>
  );
}

/* ── Canvas wired for the over-city dark hero ───────────────────────── */
function OverCityCanvas({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [2.2, 1.1, 5.8], fov: 36 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.9, 0)}
    >
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#c8bc90', '#1A1C22', 0.55]} />
      {/* Key light — warm top-front */}
      <directionalLight position={[3, 7, 4]} intensity={1.8} color="#fff4d0" />
      {/* Subtle fill from the left */}
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#FEC001" />
      {/* Brand under-glow for the floating feel */}
      <pointLight position={[0.4, -0.25, 0.5]} intensity={3.2} color="#FEC001" distance={3.8} decay={2} />
      <RidingScooter progressRef={progressRef} />
    </Canvas>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Shared pieces kept for HeroLab / HeroSplit
   ──────────────────────────────────────────────────────────────────── */

function ScooterStage({
  progressRef,
  scale = 1,
  baseYaw = -0.5,
  xRange = 0.8,
  xOffset = 0,
}: {
  progressRef: MutableRefObject<number>;
  scale?: number;
  baseYaw?: number;
  xRange?: number;
  xOffset?: number;
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
  progressRef,
  transparent = false,
  stage,
}: {
  progressRef: MutableRefObject<number>;
  transparent?: boolean;
  stage?: StageProps;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: transparent }}
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

/* ── Variant B — Split / Argo-style (kept for /hero-lab) ──────────── */
export function HeroSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useScrollProgressRef(sectionRef);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#EFEAE1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 min-h-screen grid lg:grid-cols-2 items-center gap-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#15171C] text-white text-xs font-bold tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FEC001]" />
            First & last-mile, powered by AI
          </span>
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold font-display tracking-tight text-[#15171C] leading-[0.98]">
            Move your
            <br />
            city <span className="text-[#caa400]">forward.</span>
          </h1>
          <p className="mt-6 text-lg text-[#5b5749] max-w-md">
            Shared e-scooters that close the gap between transit and your front door.
          </p>
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

/* ── Over the Living City — THE homepage hero ──────────────────────── */
export function HeroOverCity() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useScrollProgressRef(sectionRef);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Solid-to-transparent gradient: left text column is fully opaque dark, city shows on right */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to right, #0c0e13 35%, rgba(12,14,19,0.88) 50%, rgba(12,14,19,0.25) 68%, transparent 85%)' }}
      />
      {/* Top/bottom depth fades */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65 pointer-events-none z-[1]" />

      {/* 3D scooter — transparent canvas so the city glows through */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <OverCityCanvas progressRef={progressRef} />
      </div>

      {/* Left-anchored content */}
      <div className="relative z-[3] max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[520px] pt-8"
        >
          {/* Headline */}
          <h1 className="text-[clamp(48px,6.5vw,88px)] font-black font-display tracking-[-0.03em] text-white leading-[0.92]">
            Where Mobility<br />
            <span className="text-[#FEC001]">Meets Intelligence</span>
          </h1>

          {/* Sub */}
          <p className="mt-6 text-base sm:text-xl text-white/65 max-w-[400px] leading-relaxed font-display font-bold">
            <span className="text-white">We're on a mission to </span>power how cities move people.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full bg-[#FEC001] text-black font-black text-sm tracking-wide hover:bg-[#FFD20F] transition-colors">
              Find a ride <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full border border-white/22 bg-white/[0.06] backdrop-blur-sm text-white font-bold text-sm hover:bg-white/10 transition-colors">
              For cities
            </button>
          </div>

          {/* Scroll nudge */}
          <div className="mt-16 flex items-center gap-2.5 text-white/28 text-[11px] font-semibold tracking-[0.12em] uppercase select-none">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/20">
              <span className="w-[3px] h-[3px] rounded-full bg-white/45 animate-bounce" />
            </span>
            Scroll to explore
          </div>
        </motion.div>
      </div>
    </section>
  );
}
