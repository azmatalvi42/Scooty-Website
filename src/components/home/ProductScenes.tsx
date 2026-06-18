/**
 * Three Argo-style isometric 3D product panels — same orthographic camera,
 * shadow quality, and warm palette as ScootyDiorama (/demo-3d).
 */
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const BRAND = '#FEC001';
const INK   = '#20242E';

type Vec3 = [number, number, number];

/* ── shared primitives (mirror of ScootyDiorama) ────────────────── */
function RBox({
  size, radius = 0.06, color, metalness = 0.1, roughness = 0.6,
  emissive, emissiveIntensity = 0, castShadow = true, receiveShadow = false, ...props
}: {
  size: Vec3; radius?: number; color: string; metalness?: number; roughness?: number;
  emissive?: string; emissiveIntensity?: number; castShadow?: boolean; receiveShadow?: boolean;
} & React.ComponentProps<'mesh'>) {
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], size[1], size[2], 4, radius), [size, radius]);
  return (
    <mesh geometry={geo} castShadow={castShadow} receiveShadow={receiveShadow} {...props}>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness}
        emissive={emissive ?? '#000000'} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
}

function Wheel({ position }: { position: Vec3 }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.x += d * 2.2; });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 28]} />
        <meshStandardMaterial color="#15171C" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.14, 16]} />
        <meshStandardMaterial color={BRAND} roughness={0.35} metalness={0.3} />
      </mesh>
    </group>
  );
}

function Scooter({ position = [0, 0, 0] as Vec3 }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      const t = s.clock.elapsedTime;
      g.current.position.y = position[1] + Math.sin(t * 1.4) * 0.04;
      g.current.rotation.z = Math.sin(t * 1.4) * 0.012;
    }
  });
  return (
    <group ref={g} position={position}>
      <RBox size={[0.34, 0.08, 1.05]} radius={0.04} color={INK} position={[0, 0.2, 0]} roughness={0.45} />
      <RBox size={[0.24, 0.02, 0.8]} radius={0.01} color={BRAND} position={[0, 0.245, 0]} castShadow={false} />
      <RBox size={[0.2, 0.12, 0.22]} radius={0.05} color={INK} position={[0, 0.26, -0.5]} />
      <Wheel position={[0, 0.22, 0.56]} />
      <Wheel position={[0, 0.22, -0.56]} />
      <group position={[0, 0.22, 0.56]} rotation={[-0.16, 0, 0]}>
        <RBox size={[0.07, 0.92, 0.07]} radius={0.03} color="#2C3140" position={[0, 0.5, 0]} />
        <mesh position={[0, 0.96, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.52, 16]} />
          <meshStandardMaterial color={INK} roughness={0.4} />
        </mesh>
        <RBox size={[0.08, 0.05, 0.05]} radius={0.02} color={BRAND} position={[0.26, 0.96, 0]} />
        <RBox size={[0.08, 0.05, 0.05]} radius={0.02} color={BRAND} position={[-0.26, 0.96, 0]} />
        <mesh position={[0, 0.74, 0.06]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#FFF7DA" emissive="#FFE08A" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.5, 10]} />
        <meshStandardMaterial color="#6B4B2F" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.62, 0]}>
        <coneGeometry args={[0.34, 0.6, 14]} />
        <meshStandardMaterial color="#4F9E6A" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0]}>
        <coneGeometry args={[0.26, 0.5, 14]} />
        <meshStandardMaterial color="#5CB07A" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Lamp({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 1.4, 10]} />
        <meshStandardMaterial color={INK} roughness={0.5} metalness={0.4} />
      </mesh>
      <RBox size={[0.34, 0.06, 0.12]} radius={0.03} color={INK} position={[0.15, 1.42, 0]} />
      <mesh position={[0.28, 1.36, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FFF3C9" emissive="#FFD24D" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

function Building({ position, size, color }: { position: Vec3; size: Vec3; color: string }) {
  return (
    <group position={position}>
      <RBox size={size} radius={0.08} color={color} position={[0, size[1] / 2, 0]} roughness={0.7} receiveShadow />
      {[0.3, 0.6, 0.85].map((f) => (
        <RBox key={f} size={[size[0] * 0.7, 0.06, size[2] + 0.02]} radius={0.01}
          color="#FFE08A" emissive="#FFD24D" emissiveIntensity={0.5}
          position={[0, size[1] * f, 0]} castShadow={false} />
      ))}
    </group>
  );
}

function Bench({ position, rotation = [0, 0, 0] as Vec3 }: { position: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      <RBox size={[0.9, 0.06, 0.3]} radius={0.03} color="#9C7A53" position={[0, 0.26, 0]} />
      <RBox size={[0.9, 0.28, 0.06]} radius={0.03} color="#9C7A53" position={[0, 0.4, -0.12]} />
      <RBox size={[0.06, 0.26, 0.28]} radius={0.02} color={INK} position={[-0.38, 0.13, 0]} />
      <RBox size={[0.06, 0.26, 0.28]} radius={0.02} color={INK} position={[0.38, 0.13, 0]} />
    </group>
  );
}

function Cone({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <RBox size={[0.26, 0.04, 0.26]} radius={0.02} color="#E25C12" position={[0, 0.02, 0]} />
      <mesh castShadow position={[0, 0.2, 0]}>
        <coneGeometry args={[0.12, 0.34, 16]} />
        <meshStandardMaterial color="#F26A1B" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.085, 0.105, 0.06, 16]} />
        <meshStandardMaterial color="#F4F1EA" roughness={0.5} />
      </mesh>
    </group>
  );
}

function GreenPatch({ position, size }: { position: Vec3; size: [number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#7FB283" roughness={0.95} />
    </mesh>
  );
}

/* ── Shared lighting + camera rig (mirrors ScootyDiorama exactly) ── */
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#ffffff', '#cfc6b4', 0.5]} />
      <directionalLight
        position={[6, 11, 5]} intensity={1.7} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-left={-9} shadow-camera-right={9}
        shadow-camera-top={9} shadow-camera-bottom={-9}
        shadow-camera-near={0.1} shadow-camera-far={40}
        shadow-bias={-0.0005}
      />
    </>
  );
}

function AutoRotate({ speed = 0.5 }: { speed?: number }) {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);
  useEffect(() => {
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = speed;
    controls.target.set(0, 0.5, 0);
    return () => controls.dispose();
  }, [controls, speed]);
  useFrame(() => controls.update());
  return null;
}

/* ════════════════════════════════════════════════════════════════════
   PANEL 1 — SCOOTY Ride: the full city-block diorama
   ════════════════════════════════════════════════════════════════════ */
function RideScene() {
  return (
    <group>
      {/* ground tile */}
      <RBox size={[10, 0.7, 10]} radius={0.3} color="#DED7C9" position={[0, -0.35, 0]} receiveShadow roughness={0.85} />
      {/* road */}
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.3, 10]} />
        <meshStandardMaterial color="#50515A" roughness={0.85} />
      </mesh>
      {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((z) => (
        <mesh key={z} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.5]} />
          <meshStandardMaterial color={BRAND} roughness={0.6} />
        </mesh>
      ))}
      <GreenPatch position={[3, 0.012, -2.6]} size={[3.2, 3.6]} />
      <GreenPatch position={[-3, 0.012, 2.4]} size={[3.2, 4]} />
      <Scooter position={[0, 0, 0]} />
      <Tree position={[3.1, 0.012, -3]} scale={1.15} />
      <Tree position={[2.4, 0.012, -1.4]} scale={0.9} />
      <Tree position={[-3.2, 0.012, 2.7]} scale={1.05} />
      <Cone position={[0.7, 0.012, 2.2]} />
      <Cone position={[-0.7, 0.012, 1.7]} />
      <Bench position={[-1.9, 0.012, -1.4]} rotation={[0, Math.PI / 2, 0]} />
      <Lamp position={[1.9, 0.012, 1]} />
      <Lamp position={[-1.9, 0.012, -3]} />
      <Building position={[3.4, 0.012, 2.9]} size={[1.5, 2.6, 1.5]} color="#C9C2B4" />
      <Building position={[-3.3, 0.012, -2.9]} size={[1.4, 1.9, 1.4]} color="#B7AEA0" />
      <Building position={[-3.4, 0.012, -1.1]} size={[1.1, 1.3, 1.1]} color="#CFC8BB" />
    </group>
  );
}

export function SceneRide() {
  return (
    <Canvas shadows dpr={[1, 1.5]} orthographic
      camera={{ position: [9, 7.5, 9], zoom: 52, near: -50, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#ECE7DE']} />
      <fog attach="fog" args={['#ECE7DE', 18, 34]} />
      <SceneLights />
      <RideScene />
      <AutoRotate speed={0.45} />
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PANEL 2 — AI RideGuide: route map with GPS pins + floating phone
   ════════════════════════════════════════════════════════════════════ */
function GpsPin({ position, active = false }: { position: Vec3; active?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current && active) {
      g.current.position.y = position[1] + 0.12 + Math.sin(s.clock.elapsedTime * 1.8) * 0.06;
    }
  });
  return (
    <group ref={g} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={active ? BRAND : '#8A8FA0'} roughness={0.35}
          emissive={active ? BRAND : '#444'} emissiveIntensity={active ? 0.5 : 0.1} />
      </mesh>
      <mesh position={[0, -0.3, 0]} castShadow>
        <coneGeometry args={[0.1, 0.28, 12]} />
        <meshStandardMaterial color={active ? BRAND : '#6A6F80'} roughness={0.5} />
      </mesh>
      {active && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color={BRAND} transparent opacity={0.14} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function RouteArch({ from, to }: { from: Vec3; to: Vec3 }) {
  const pts = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += 0.7;
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return curve.getPoints(32);
  }, [from, to]);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={BRAND} linewidth={2} />
    </line>
  );
}

function FloatingPhone() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      g.current.position.y = 1.8 + Math.sin(s.clock.elapsedTime * 1.2) * 0.09;
      g.current.rotation.y = -0.3 + Math.sin(s.clock.elapsedTime * 0.45) * 0.12;
    }
  });
  const body = useMemo(() => new RoundedBoxGeometry(0.62, 1.1, 0.08, 4, 0.1), []);
  return (
    <group ref={g} position={[0, 1.8, 0]} rotation={[-0.12, 0, 0]}>
      <mesh geometry={body} castShadow>
        <meshStandardMaterial color={INK} roughness={0.25} metalness={0.55} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0, 0.043]}>
        <planeGeometry args={[0.5, 0.9]} />
        <meshStandardMaterial color="#0B1F14" emissive="#102A1C" emissiveIntensity={0.7} />
      </mesh>
      {/* map dots on screen */}
      {([[-0.1, 0.22], [0.05, -0.04], [-0.07, -0.28]] as [number,number][]).map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.048]}>
          <circleGeometry args={[0.035, 12]} />
          <meshBasicMaterial color={i === 0 ? BRAND : '#4AE88A'} />
        </mesh>
      ))}
      {/* route squiggle on screen */}
      <mesh position={[0, -0.04, 0.048]}>
        <planeGeometry args={[0.28, 0.02]} />
        <meshBasicMaterial color={BRAND} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function RideGuideScene() {
  const pins: Vec3[] = [[-2.2, 0.2, 1.8], [0, 0.2, 0], [2.4, 0.2, -2.0]];
  return (
    <group>
      {/* ground tile */}
      <RBox size={[10, 0.7, 10]} radius={0.3} color="#D6D2E8" position={[0, -0.35, 0]} receiveShadow roughness={0.85} />
      {/* subtle grid */}
      {([-3, -1, 1, 3] as number[]).map((x) => (
        <mesh key={`gx${x}`} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 10]} />
          <meshBasicMaterial color="#B8B4D0" transparent opacity={0.35} />
        </mesh>
      ))}
      {([-3, -1, 1, 3] as number[]).map((z) => (
        <mesh key={`gz${z}`} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 0.03]} />
          <meshBasicMaterial color="#B8B4D0" transparent opacity={0.35} />
        </mesh>
      ))}
      {/* route arches */}
      <RouteArch from={pins[0]} to={pins[1]} />
      <RouteArch from={pins[1]} to={pins[2]} />
      {/* GPS pins */}
      <GpsPin position={pins[0]} />
      <GpsPin position={pins[1]} active />
      <GpsPin position={pins[2]} />
      {/* trees along route */}
      <Tree position={[-3.2, 0.012, -2.8]} scale={1.05} />
      <Tree position={[3.1, 0.012, 2.6]} scale={0.9} />
      <Tree position={[-1.5, 0.012, -2.5]} scale={0.8} />
      {/* bus stop */}
      <mesh castShadow position={[2.4, 0.012, 2.2]}>
        <cylinderGeometry args={[0.04, 0.05, 1.5, 10]} />
        <meshStandardMaterial color="#6B6F7B" metalness={0.5} roughness={0.4} />
      </mesh>
      <RBox size={[0.45, 0.28, 0.07]} radius={0.04} color={INK} position={[2.4, 1.6, 2.2]} />
      <mesh position={[2.4, 1.6, 2.245]}>
        <planeGeometry args={[0.34, 0.18]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.55} />
      </mesh>
      {/* buildings */}
      <Building position={[-3.4, 0.012, -2.8]} size={[1.3, 2.2, 1.3]} color="#C9C2B4" />
      <Building position={[3.3, 0.012, 2.5]} size={[1.2, 1.6, 1.2]} color="#B7AEA0" />
      {/* floating phone */}
      <FloatingPhone />
    </group>
  );
}

export function SceneRideGuide() {
  return (
    <Canvas shadows dpr={[1, 1.5]} orthographic
      camera={{ position: [9, 7.5, 9], zoom: 52, near: -50, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#E8E4F2']} />
      <fog attach="fog" args={['#E8E4F2', 18, 34]} />
      <SceneLights />
      <RideGuideScene />
      <AutoRotate speed={0.45} />
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PANEL 3 — PatchForce: transit station + payment terminals + card
   ════════════════════════════════════════════════════════════════════ */
function TransitKiosk({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {/* base */}
      <RBox size={[0.38, 0.08, 0.38]} radius={0.04} color="#3A3D48" position={[0, 0.04, 0]} />
      {/* pillar */}
      <RBox size={[0.18, 1.0, 0.18]} radius={0.04} color={INK} position={[0, 0.58, 0]} />
      {/* screen */}
      <RBox size={[0.38, 0.54, 0.08]} radius={0.04} color="#1A2035" position={[0, 1.2, 0.1]}
        emissive="#1A2035" emissiveIntensity={0.4} />
      {/* screen glow */}
      <mesh position={[0, 1.2, 0.15]}>
        <planeGeometry args={[0.28, 0.38]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.55} transparent opacity={0.85} />
      </mesh>
      {/* brand stripe */}
      <RBox size={[0.38, 0.06, 0.04]} radius={0.02} color={BRAND} position={[0, 0.9, 0.12]}
        emissive={BRAND} emissiveIntensity={0.5} castShadow={false} />
    </group>
  );
}

function FloatingCard() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      const t = s.clock.elapsedTime;
      g.current.position.y = 1.6 + Math.sin(t * 1.1) * 0.1;
      g.current.rotation.y = -0.2 + Math.sin(t * 0.5) * 0.18;
      g.current.rotation.x = -0.12 + Math.sin(t * 0.7) * 0.04;
    }
  });
  const geo = useMemo(() => new RoundedBoxGeometry(1.05, 0.66, 0.05, 4, 0.08), []);
  return (
    <group ref={g} position={[0, 1.6, 0]}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#1C2340" roughness={0.2} metalness={0.75} />
      </mesh>
      {/* yellow accent stripe */}
      <mesh position={[0, 0.15, 0.028]}>
        <planeGeometry args={[0.78, 0.09]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.7} />
      </mesh>
      {/* chip */}
      <RBox size={[0.2, 0.15, 0.02]} radius={0.025} color="#D4A017"
        position={[-0.3, -0.06, 0.029]} metalness={0.85} roughness={0.15} />
      {/* SCOOTY text bar */}
      <mesh position={[0.18, -0.2, 0.028]}>
        <planeGeometry args={[0.38, 0.07]} />
        <meshBasicMaterial color="white" transparent opacity={0.55} />
      </mesh>
      {/* shadow blob below */}
      <mesh position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, 1.0]} />
        <meshBasicMaterial color="#000" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ConnectionBeam({ from, to }: { from: Vec3; to: Vec3 }) {
  const pts = useMemo(() =>
    [new THREE.Vector3(...from), new THREE.Vector3(...to)],
    [from, to]);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={BRAND} transparent opacity={0.5} />
    </line>
  );
}

function Platform({ position, size }: { position: Vec3; size: [number, number] }) {
  return (
    <group position={position}>
      <RBox size={[size[0], 0.18, size[1]]} radius={0.07} color="#C0BAA8" position={[0, 0.09, 0]} receiveShadow roughness={0.8} />
      {/* yellow edge strip */}
      <mesh position={[0, 0.185, size[1] / 2 - 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0], 0.14]} />
        <meshStandardMaterial color={BRAND} roughness={0.6} />
      </mesh>
    </group>
  );
}

function PatchForceScene() {
  const kioskPositions: Vec3[] = [[-2.5, 0.012, -1.5], [2.5, 0.012, 1.5]];
  const cardPos: Vec3 = [0, 1.6, 0];
  return (
    <group>
      {/* main ground */}
      <RBox size={[10, 0.7, 10]} radius={0.3} color="#D8D3C8" position={[0, -0.35, 0]} receiveShadow roughness={0.85} />
      {/* transit platform */}
      <Platform position={[0, 0.012, 0.6]} size={[9.0, 2.5]} />
      {/* platform lane markings */}
      {([-3, -1.5, 0, 1.5, 3] as number[]).map((x) => (
        <mesh key={x} position={[x, 0.2, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, 2.5]} />
          <meshBasicMaterial color="white" transparent opacity={0.25} />
        </mesh>
      ))}
      {/* kiosks */}
      {kioskPositions.map((p, i) => <TransitKiosk key={i} position={p} />)}
      {/* connection beams from kiosks to card */}
      <ConnectionBeam from={[-2.5, 1.3, -1.5]} to={cardPos} />
      <ConnectionBeam from={[2.5, 1.3, 1.5]} to={cardPos} />
      {/* floating transit card */}
      <FloatingCard />
      {/* environment */}
      <Building position={[-3.5, 0.012, -2.8]} size={[1.5, 3.0, 1.4]} color="#C5BEB0" />
      <Building position={[3.4, 0.012, -3.0]} size={[1.3, 2.0, 1.3]} color="#BCB5A7" />
      <Lamp position={[-3.5, 0.012, 1.8]} />
      <Lamp position={[3.5, 0.012, -0.8]} />
      <Tree position={[-3.0, 0.012, 2.8]} scale={1.0} />
      <Tree position={[3.0, 0.012, 2.6]} scale={0.85} />
    </group>
  );
}

export function ScenePatchForce() {
  return (
    <Canvas shadows dpr={[1, 1.5]} orthographic
      camera={{ position: [9, 7.5, 9], zoom: 52, near: -50, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#EAE5DA']} />
      <fog attach="fog" args={['#EAE5DA', 18, 34]} />
      <SceneLights />
      <PatchForceScene />
      <AutoRotate speed={0.45} />
    </Canvas>
  );
}
