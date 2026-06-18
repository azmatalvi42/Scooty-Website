/**
 * Three Argo-style isometric 3D product scenes.
 * One compact Canvas per panel — frameloop="demand" to keep GPU idle when off-screen.
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ScooterModel } from '../three/ScooterModel';

const BRAND = '#FEC001';
const INK   = '#1A1C22';

/* ── shared geometry helpers ──────────────────────────────────────── */
function RBox({
  size, radius = 0.05, color, metalness = 0.1, roughness = 0.55, emissive, emissiveIntensity = 0, ...props
}: {
  size: [number,number,number]; radius?: number; color: string;
  metalness?: number; roughness?: number; emissive?: string; emissiveIntensity?: number;
} & React.ComponentProps<'mesh'>) {
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], size[1], size[2], 4, radius), [size, radius]);
  return (
    <mesh geometry={geo} castShadow receiveShadow {...props}>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness}
        emissive={emissive ?? color} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
}

function Tree({ position }: { position: [number,number,number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <coneGeometry args={[0.28, 0.65, 8]} />
        <meshStandardMaterial color="#4A7C59" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#6B4226" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 1 — Ride: SCOOTY scooter at a transit stop
   ═══════════════════════════════════════════════════════════════════ */
function SceneRideContent() {
  const scooterG = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (scooterG.current) {
      scooterG.current.position.y = Math.sin(s.clock.elapsedTime * 1.5) * 0.025;
    }
  });

  return (
    <>
      {/* ground tile */}
      <RBox size={[4.8, 0.12, 4.8]} radius={0.12} color="#D8D0C4" position={[0, -0.06, 0]} roughness={0.9} />
      {/* road strip */}
      <RBox size={[4.8, 0.14, 0.9]} radius={0.04} color="#4A4E5A" position={[0, -0.04, 0]} roughness={0.85} />
      {/* centre line */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.6, 0.01, 0.06]} />
        <meshStandardMaterial color="#FEC001" roughness={0.7} />
      </mesh>
      {/* transit stop sign post */}
      <mesh position={[-1.6, 0.55, 0.8]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <meshStandardMaterial color="#6B6F7B" metalness={0.5} roughness={0.4} />
      </mesh>
      <RBox size={[0.4, 0.25, 0.06]} radius={0.04} color={INK} position={[-1.6, 1.15, 0.8]} emissive={INK} />
      <mesh position={[-1.6, 1.15, 0.84]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.6} />
      </mesh>
      {/* trees */}
      <Tree position={[1.6, 0.0, -1.3]} />
      <Tree position={[-0.6, 0.0, -1.5]} />
      {/* scooter — bobbing */}
      <group ref={scooterG} position={[0.3, 0.05, 0.1]} rotation={[0, -0.35, 0]} scale={0.62}>
        <ScooterModel spin />
      </group>
      {/* glow blob */}
      <mesh position={[0.3, 0.01, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color={BRAND} transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </>
  );
}

export function SceneRide() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      shadows
      camera={{ position: [4.5, 4.2, 5.5], fov: 28 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
    >
      <color attach="background" args={['#E9E4DA']} />
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#f5f0e8', '#c8c0b0', 0.55]} />
      <directionalLight position={[5, 8, 4]} intensity={1.6} castShadow
        shadow-mapSize={[512, 512]} shadow-camera-near={0.1} shadow-camera-far={30}
        shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
      <directionalLight position={[-3, 3, -2]} intensity={0.35} color="#FFE8A0" />
      <SceneRideContent />
    </Canvas>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 2 — AI RideGuide: floating route + device
   ═══════════════════════════════════════════════════════════════════ */
function PinShape({ position, active = false }: { position: [number,number,number]; active?: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={active ? BRAND : '#8A8FA0'} emissive={active ? BRAND : '#555'} emissiveIntensity={active ? 0.9 : 0.2} />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <coneGeometry args={[0.07, 0.22, 8]} />
        <meshStandardMaterial color={active ? BRAND : '#6A6F80'} />
      </mesh>
      {active && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={BRAND} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function RouteLine() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push(new THREE.Vector3(
        THREE.MathUtils.lerp(-1.4, 1.4, t),
        0.15 + Math.sin(t * Math.PI) * 0.35,
        THREE.MathUtils.lerp(0.8, -0.8, t) + Math.sin(t * Math.PI * 2) * 0.2,
      ));
    }
    return pts;
  }, []);
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.025, 8, false), [points]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={1.1} roughness={0.2} />
    </mesh>
  );
}

function PhoneDevice() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.6) * 0.18;
      g.current.position.y = 0.9 + Math.sin(s.clock.elapsedTime * 1.2) * 0.04;
    }
  });
  const bodyGeo = useMemo(() => new RoundedBoxGeometry(0.55, 1.0, 0.07, 4, 0.08), []);
  return (
    <group ref={g} position={[0, 0.9, -0.2]} rotation={[-0.15, 0, 0]}>
      <mesh geometry={bodyGeo} castShadow>
        <meshStandardMaterial color={INK} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[0.44, 0.85]} />
        <meshStandardMaterial color="#0D2A1A" emissive="#0D3020" emissiveIntensity={0.6} />
      </mesh>
      {/* mini map dots */}
      {[[-0.08, 0.2], [0.05, -0.05], [-0.05, -0.25]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.044]}>
          <circleGeometry args={[0.03, 12]} />
          <meshBasicMaterial color={i === 0 ? BRAND : '#4AE88A'} />
        </mesh>
      ))}
    </group>
  );
}

function SceneRideGuideContent() {
  return (
    <>
      <RBox size={[4.4, 0.12, 4.4]} radius={0.12} color="#D4CFE8" position={[0, -0.06, 0]} roughness={0.9} />
      {/* subtle grid on ground */}
      {[-1.5, -0.5, 0.5, 1.5].map((x) =>
        [-1.5, -0.5, 0.5, 1.5].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshBasicMaterial color="#BEB9D0" transparent opacity={0.3} />
          </mesh>
        ))
      )}
      <RouteLine />
      <PinShape position={[-1.4, 0.15, 0.8]} />
      <PinShape position={[0, 0.5, 0]}  active />
      <PinShape position={[1.4, 0.15, -0.8]} />
      <PhoneDevice />
    </>
  );
}

export function SceneRideGuide() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      shadows
      camera={{ position: [4.2, 4.5, 5.2], fov: 28 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
    >
      <color attach="background" args={['#EAE6F0']} />
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#f0ecff', '#c0b8d8', 0.5]} />
      <directionalLight position={[4, 7, 4]} intensity={1.5} castShadow shadow-mapSize={[512, 512]} />
      <directionalLight position={[-3, 3, -2]} intensity={0.3} color="#D8D0FF" />
      <pointLight position={[0, 1.5, 0]} intensity={1.8} color={BRAND} distance={4} />
      <SceneRideGuideContent />
    </Canvas>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 3 — PatchForce: transit payment API network
   ═══════════════════════════════════════════════════════════════════ */
function ApiNode({ position, color = BRAND, label = false }: {
  position: [number,number,number]; color?: string; label?: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.6 + Math.random() * 0.6, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame((s) => {
    if (g.current) {
      g.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * speed + offset) * 0.08;
    }
  });
  const boxGeo = useMemo(() => new RoundedBoxGeometry(0.28, 0.28, 0.1, 4, 0.06), []);
  return (
    <group ref={g} position={position}>
      <mesh geometry={boxGeo} castShadow>
        <meshStandardMaterial color={label ? BRAND : INK} roughness={0.3} metalness={0.6}
          emissive={color} emissiveIntensity={label ? 0.5 : 0.15} />
      </mesh>
      {/* glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]}>
        <ringGeometry args={[0.18, 0.26, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ConnectionLine({ from, to }: { from: [number,number,number]; to: [number,number,number] }) {
  const geo = useMemo(() => {
    const pts = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [from, to]);
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={BRAND} transparent opacity={0.4} />
    </line>
  );
}

function TransitCard() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      g.current.rotation.y = -0.4 + Math.sin(s.clock.elapsedTime * 0.5) * 0.12;
      g.current.position.y = 0.5 + Math.sin(s.clock.elapsedTime * 0.9) * 0.06;
    }
  });
  const geo = useMemo(() => new RoundedBoxGeometry(0.9, 0.58, 0.04, 4, 0.06), []);
  return (
    <group ref={g} position={[0, 0.5, 0]} rotation={[-0.25, 0, 0]}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#1C2340" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* stripe */}
      <mesh position={[-0.14, 0.12, 0.022]}>
        <planeGeometry args={[0.55, 0.08]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.7} />
      </mesh>
      {/* chip */}
      <RBox size={[0.16, 0.12, 0.02]} radius={0.02} color="#D4A017"
        position={[-0.27, -0.06, 0.025]} metalness={0.8} roughness={0.2} />
      {/* SCOOTY wordmark */}
      <mesh position={[0.15, -0.12, 0.022]}>
        <planeGeometry args={[0.3, 0.06]} />
        <meshBasicMaterial color="white" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

const NODE_POSITIONS: [number,number,number][] = [
  [-1.3, 0.6, -0.6],
  [1.3, 0.4, -0.8],
  [-1.1, 0.3, 0.9],
  [1.2, 0.7, 0.8],
  [-0.4, 1.2, -1.0],
  [0.5, 1.0, 1.0],
];

const CONNECTIONS: [[number,number,number],[number,number,number]][] = [
  [[-1.3,0.6,-0.6],[0,0.5,0]],
  [[1.3,0.4,-0.8],[0,0.5,0]],
  [[-1.1,0.3,0.9],[0,0.5,0]],
  [[1.2,0.7,0.8],[0,0.5,0]],
  [[-0.4,1.2,-1.0],[0,0.5,0]],
  [[0.5,1.0,1.0],[0,0.5,0]],
];

function ScenePatchForceContent() {
  return (
    <>
      <RBox size={[4.4, 0.12, 4.4]} radius={0.12} color="#1C2030" position={[0, -0.06, 0]} roughness={0.7} />
      {/* PCB grid lines */}
      {[-1.5,-0.5,0.5,1.5].map(x => (
        <mesh key={x} position={[x, 0.005, 0]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[0.02, 4]} />
          <meshBasicMaterial color={BRAND} transparent opacity={0.12} />
        </mesh>
      ))}
      {[-1.5,-0.5,0.5,1.5].map(z => (
        <mesh key={z} position={[0, 0.005, z]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[4, 0.02]} />
          <meshBasicMaterial color={BRAND} transparent opacity={0.12} />
        </mesh>
      ))}
      {CONNECTIONS.map(([from, to], i) => <ConnectionLine key={i} from={from} to={to} />)}
      {NODE_POSITIONS.map((p, i) => <ApiNode key={i} position={p} color={i % 2 === 0 ? BRAND : '#4AE8B0'} />)}
      <TransitCard />
    </>
  );
}

export function ScenePatchForce() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{ position: [4.2, 4.2, 5.0], fov: 30 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
    >
      <color attach="background" args={['#131828']} />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#203060', '#080C18', 0.6]} />
      <directionalLight position={[4, 6, 4]} intensity={1.0} />
      <pointLight position={[0, 0.8, 0]} intensity={4.0} color={BRAND} distance={5} decay={2} />
      <pointLight position={[0, 0.8, 0]} intensity={2.0} color="#4AE8B0" distance={4} decay={2} />
      <ScenePatchForceContent />
    </Canvas>
  );
}
