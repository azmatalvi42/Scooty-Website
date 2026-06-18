/**
 * Argo-style isometric 3D product panels.
 * Orthographic camera, 1024px shadows, warm fog — same formula as ScootyDiorama.
 *
 * Ride        — city block with real scooter, transit stop
 * RideGuide   — AI transit routing: bus stop → subway hub → scooter leg
 * PatchForce  — pothole reporting + crew dispatch map
 */
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const BRAND = '#FEC001';
const INK   = '#20242E';
type Vec3 = [number, number, number];

/* ── primitives ─────────────────────────────────────────────────── */
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
        emissive={emissive ?? '#000'} emissiveIntensity={emissiveIntensity} />
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

function Scooter({ position = [0, 0, 0] as Vec3, rotation = [0, 0, 0] as Vec3 }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.4) * 0.04;
  });
  return (
    <group ref={g} position={position} rotation={rotation}>
      <RBox size={[0.34, 0.08, 1.05]} radius={0.04} color={INK} position={[0, 0.2, 0]} roughness={0.45} />
      <RBox size={[0.24, 0.02, 0.8]} radius={0.01} color={BRAND} position={[0, 0.245, 0]} castShadow={false} />
      <RBox size={[0.2, 0.12, 0.22]} radius={0.05} color={INK} position={[0, 0.26, -0.5]} />
      <Wheel position={[0, 0.22,  0.56]} />
      <Wheel position={[0, 0.22, -0.56]} />
      <group position={[0, 0.22, 0.56]} rotation={[-0.16, 0, 0]}>
        <RBox size={[0.07, 0.92, 0.07]} radius={0.03} color="#2C3140" position={[0, 0.5, 0]} />
        <mesh position={[0, 0.96, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.52, 16]} />
          <meshStandardMaterial color={INK} roughness={0.4} />
        </mesh>
        <RBox size={[0.08, 0.05, 0.05]} radius={0.02} color={BRAND} position={[ 0.26, 0.96, 0]} />
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
          color="#FFE08A" emissive="#FFD24D" emissiveIntensity={0.45}
          position={[0, size[1] * f, 0]} castShadow={false} />
      ))}
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

/* ── Shared lighting + auto-rotate ─────────────────────────────── */
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#ffffff', '#cfc6b4', 0.5]} />
      <directionalLight position={[6, 11, 5]} intensity={1.7} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-left={-9} shadow-camera-right={9}
        shadow-camera-top={9} shadow-camera-bottom={-9}
        shadow-camera-near={0.1} shadow-camera-far={40}
        shadow-bias={-0.0005} />
    </>
  );
}

function AutoRotate({ speed = 0.5 }: { speed?: number }) {
  const { camera, gl } = useThree();
  const ctrl = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);
  useEffect(() => {
    ctrl.enablePan = ctrl.enableZoom = ctrl.enableRotate = false;
    ctrl.enableDamping = true;
    ctrl.dampingFactor = 0.08;
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = speed;
    ctrl.target.set(0, 0.5, 0);
    return () => ctrl.dispose();
  }, [ctrl, speed]);
  useFrame(() => ctrl.update());
  return null;
}

function IsoCanvas({ children, bg = '#ECE7DE', fogColor }: {
  children: React.ReactNode; bg?: string; fogColor?: string;
}) {
  return (
    <Canvas shadows dpr={[1, 1.5]} orthographic
      camera={{ position: [9, 7.5, 9], zoom: 52, near: -50, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[fogColor ?? bg, 18, 34]} />
      <SceneLights />
      {children}
      <AutoRotate speed={0.45} />
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════════
   PANEL 1 — SCOOTY Ride: city block with transit stop
   ════════════════════════════════════════════════════════════════ */
export function SceneRide() {
  return (
    <IsoCanvas bg="#ECE7DE">
      {/* ground */}
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
      {/* scooter */}
      <Scooter position={[0.3, 0, 0.2]} rotation={[0, -0.3, 0]} />
      {/* transit stop sign */}
      <mesh castShadow position={[-1.5, 0.012, 0.9]}>
        <cylinderGeometry args={[0.04, 0.05, 1.5, 10]} />
        <meshStandardMaterial color="#6B6F7B" metalness={0.5} roughness={0.4} />
      </mesh>
      <RBox size={[0.42, 0.26, 0.06]} radius={0.04} color={INK} position={[-1.5, 1.5, 0.9]} />
      <mesh position={[-1.5, 1.5, 0.935]}>
        <planeGeometry args={[0.32, 0.16]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.6} />
      </mesh>
      {/* props */}
      <Tree position={[3.1, 0.012, -3]} scale={1.15} />
      <Tree position={[2.4, 0.012, -1.4]} scale={0.9} />
      <Tree position={[-3.2, 0.012, 2.7]} scale={1.05} />
      <Lamp position={[1.9, 0.012, 1]} />
      <Lamp position={[-1.9, 0.012, -3]} />
      <Building position={[3.4, 0.012, 2.9]} size={[1.5, 2.6, 1.5]} color="#C9C2B4" />
      <Building position={[-3.3, 0.012, -2.9]} size={[1.4, 1.9, 1.4]} color="#B7AEA0" />
    </IsoCanvas>
  );
}

/* ════════════════════════════════════════════════════════════════
   PANEL 2 — AI RideGuide: bus → subway → scooter leg, AI-optimised
   ════════════════════════════════════════════════════════════════ */
function BusShape({ position }: { position: Vec3 }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.position.x = position[0] + Math.sin(s.clock.elapsedTime * 0.6) * 0.12;
  });
  return (
    <group ref={g} position={position}>
      <RBox size={[0.9, 0.5, 1.8]} radius={0.08} color="#2A5FBF" position={[0, 0.25, 0]} roughness={0.5} />
      <RBox size={[0.85, 0.32, 1.5]} radius={0.04} color="#3A75D9"
        position={[0, 0.44, 0]} emissive="#4488EE" emissiveIntensity={0.18} castShadow={false} />
      {/* windows */}
      {[-0.45, 0, 0.45].map((z) => (
        <RBox key={z} size={[0.88, 0.18, 0.28]} radius={0.02}
          color="#B8D4F8" emissive="#B8D4F8" emissiveIntensity={0.2}
          position={[0, 0.48, z]} castShadow={false} />
      ))}
      {/* wheels */}
      {[-0.55, 0.55].map((z) => [-0.38, 0.38].map((x) => (
        <mesh key={`${z}${x}`} position={[x, 0.1, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 14]} />
          <meshStandardMaterial color="#1A1C22" />
        </mesh>
      )))}
      {/* SCOOTY badge */}
      <RBox size={[0.3, 0.1, 0.02]} radius={0.02} color={BRAND}
        position={[0.46, 0.22, 0.3]} emissive={BRAND} emissiveIntensity={0.5} />
    </group>
  );
}

function SubwayStation({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <RBox size={[1.8, 0.22, 2.4]} radius={0.08} color="#D0C8BC" position={[0, 0.11, 0]} receiveShadow roughness={0.8} />
      <RBox size={[1.7, 0.95, 2.2]} radius={0.06} color="#3A3D4A" position={[0, 0.69, 0]} roughness={0.6} />
      <RBox size={[1.6, 0.7, 2.0]} radius={0.04} color="#1A2035"
        position={[0, 0.75, 0.1]} emissive="#1A2035" emissiveIntensity={0.5} castShadow={false} />
      {/* subway entrance arrow */}
      <mesh position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function RoutePath({ points, color = BRAND }: { points: Vec3[]; color?: string }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 40, 0.04, 8, false);
  }, [points]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.3} />
    </mesh>
  );
}

function RoutePin({ position, label, active }: { position: Vec3; label?: string; active?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current && active)
      g.current.position.y = position[1] + 0.1 + Math.sin(s.clock.elapsedTime * 2) * 0.06;
  });
  return (
    <group ref={g} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[active ? 0.2 : 0.14, 16, 16]} />
        <meshStandardMaterial color={active ? BRAND : '#6B6F80'}
          emissive={active ? BRAND : '#333'} emissiveIntensity={active ? 0.6 : 0.1} />
      </mesh>
      {active && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.34, 16, 16]} />
          <meshStandardMaterial color={BRAND} transparent opacity={0.15} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export function SceneRideGuide() {
  const routePoints: Vec3[] = [[-3.2, 0.2, 2.8], [-1.2, 0.2, 0.8], [0.4, 0.2, -0.6], [2.8, 0.2, -2.8]];
  return (
    <IsoCanvas bg="#E6E2F0">
      {/* ground */}
      <RBox size={[10, 0.7, 10]} radius={0.3} color="#D0CCDE" position={[0, -0.35, 0]} receiveShadow roughness={0.85} />
      {/* sidewalk strips */}
      {[[-2, 6], [2, 6]].map(([x, len], i) => (
        <mesh key={i} position={[x, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.8, len]} />
          <meshStandardMaterial color="#C8C4D4" roughness={0.9} />
        </mesh>
      ))}
      {/* the AI-optimised transit route */}
      <RoutePath points={routePoints} />
      {/* route stops */}
      <RoutePin position={[-3.2, 0.2, 2.8]} />         {/* origin */}
      <RoutePin position={[-1.2, 0.2, 0.8]} active />  {/* active transfer */}
      <RoutePin position={[0.4, 0.2, -0.6]} />         {/* subway stop */}
      <RoutePin position={[2.8, 0.2, -2.8]} />         {/* destination */}
      {/* bus arriving at first stop */}
      <BusShape position={[-3.0, 0.012, 2.0]} />
      {/* subway station at mid-point */}
      <SubwayStation position={[0.4, 0.012, -0.6]} />
      {/* scooter at destination (last leg) */}
      <Scooter position={[2.6, 0, -2.5]} rotation={[0, -0.5, 0]} />
      {/* environment */}
      <Tree position={[-3.5, 0.012, -2.5]} scale={1.0} />
      <Tree position={[3.2, 0.012, 2.4]} scale={0.9} />
      <Building position={[-3.4, 0.012, -2.8]} size={[1.3, 2.4, 1.3]} color="#C4BED2" />
      <Building position={[3.3, 0.012, 2.5]} size={[1.2, 1.7, 1.2]} color="#B8B2C6" />
      <Lamp position={[1.8, 0.012, 1.0]} />
    </IsoCanvas>
  );
}

/* ════════════════════════════════════════════════════════════════
   PANEL 3 — PatchForce: pothole report + crew dispatch
   ════════════════════════════════════════════════════════════════ */
function PotholeMarker({ position }: { position: Vec3 }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      const pulse = 0.95 + Math.sin(s.clock.elapsedTime * 2.5) * 0.05;
      g.current.scale.setScalar(pulse);
    }
  });
  return (
    <group ref={g} position={position}>
      {/* pothole depression on road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial color="#3A3840" roughness={0.95} />
      </mesh>
      {/* hazard ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.38, 0.52, 32]} />
        <meshStandardMaterial color="#FF3838" emissive="#FF3838" emissiveIntensity={0.7} transparent opacity={0.8} depthWrite={false} />
      </mesh>
      {/* warning pin */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FF3838" emissive="#FF3838" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <coneGeometry args={[0.08, 0.32, 12]} />
        <meshStandardMaterial color="#FF3838" roughness={0.5} />
      </mesh>
      {/* outer pulse ring */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#FF3838" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CrewVan({ position, targetX }: { position: Vec3; targetX: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const t  = s.clock.elapsedTime;
    const px = position[0] + Math.sin(t * 0.5) * 0.3;
    g.current.position.x = px;
    g.current.rotation.y = Math.sin(t * 0.5) * 0.08;
  });
  return (
    <group ref={g} position={position}>
      {/* van body */}
      <RBox size={[0.8, 0.55, 1.6]} radius={0.08} color="#F5F0E8" position={[0, 0.28, 0]} roughness={0.5} />
      {/* cab */}
      <RBox size={[0.75, 0.42, 0.6]} radius={0.07} color="#EAE5DC" position={[0, 0.52, 0.52]} roughness={0.5} />
      {/* windows */}
      <RBox size={[0.7, 0.24, 0.48]} radius={0.03} color="#9DCAF8" emissive="#9DCAF8"
        emissiveIntensity={0.15} position={[0, 0.6, 0.54]} castShadow={false} />
      {/* scooty brand stripe */}
      <RBox size={[0.82, 0.12, 1.2]} radius={0.02} color={BRAND} position={[0, 0.26, -0.1]}
        emissive={BRAND} emissiveIntensity={0.3} castShadow={false} />
      {/* wheels */}
      {[-0.5, 0.5].map((z) => [-0.38, 0.38].map((x) => (
        <mesh key={`${z}${x}`} position={[x, 0.1, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.09, 16]} />
          <meshStandardMaterial color="#15171C" roughness={0.6} />
        </mesh>
      )))}
    </group>
  );
}

function DispatchLine({ from, to }: { from: Vec3; to: Vec3 }) {
  const pts = useMemo(() => [new THREE.Vector3(...from), new THREE.Vector3(...to)], [from, to]);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  const mat = useRef<THREE.LineDashedMaterial>(null);
  useFrame((s) => {
    if (mat.current) mat.current.dashOffset = -s.clock.elapsedTime * 0.8;
  });
  useEffect(() => {
    if (mat.current && geo) {
      (geo as THREE.BufferGeometry).computeBoundingSphere?.();
    }
  }, [geo]);
  return (
    <line geometry={geo} onUpdate={(l) => l.computeLineDistances()}>
      <lineDashedMaterial ref={mat} color={BRAND} dashSize={0.25} gapSize={0.12} />
    </line>
  );
}

function ReportPhone() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) {
      g.current.position.y = 2.1 + Math.sin(s.clock.elapsedTime * 1.3) * 0.08;
      g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.55) * 0.15 - 0.2;
    }
  });
  const body = useMemo(() => new RoundedBoxGeometry(0.55, 1.0, 0.07, 4, 0.1), []);
  return (
    <group ref={g} position={[-1.5, 2.1, -1.0]}>
      <mesh geometry={body} castShadow>
        <meshStandardMaterial color={INK} roughness={0.25} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[0.44, 0.85]} />
        <meshStandardMaterial color="#0B1A10" emissive="#0B220A" emissiveIntensity={0.7} />
      </mesh>
      {/* map dot and report marker */}
      <mesh position={[0, 0.05, 0.044]}>
        <circleGeometry args={[0.08, 14]} />
        <meshBasicMaterial color="#FF3838" />
      </mesh>
      <mesh position={[0, -0.25, 0.044]}>
        <planeGeometry args={[0.32, 0.06]} />
        <meshBasicMaterial color={BRAND} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export function ScenePatchForce() {
  const potholePos: Vec3 = [0.4, 0.012, 0.2];
  const vanPos: Vec3     = [-2.4, 0.012, -1.6];
  return (
    <IsoCanvas bg="#E9E4DA">
      {/* ground tile */}
      <RBox size={[10, 0.7, 10]} radius={0.3} color="#DDD8CC" position={[0, -0.35, 0]} receiveShadow roughness={0.85} />
      {/* road surface */}
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 10]} />
        <meshStandardMaterial color="#4A4C55" roughness={0.88} />
      </mesh>
      {/* cracked texture hint (dark irregular patch) */}
      <mesh position={[0.4, 0.014, 0.2]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color="#363840" roughness={0.95} />
      </mesh>
      {/* road lane markings */}
      {[-3.5, -2.0, -0.5, 1.0, 2.5, 4.0].map((z) => (
        <mesh key={z} position={[0, 0.018, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.5]} />
          <meshStandardMaterial color="#F5F0DC" roughness={0.7} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* green verges */}
      <GreenPatch position={[3.2, 0.012, 0]} size={[3.2, 9]} />
      <GreenPatch position={[-3.2, 0.012, 0]} size={[3.2, 9]} />
      {/* pothole + hazard marker */}
      <PotholeMarker position={potholePos} />
      {/* crew van driving toward pothole */}
      <CrewVan position={vanPos} targetX={potholePos[0]} />
      {/* dashed dispatch line: van → pothole */}
      <DispatchLine from={[-2.4, 0.08, -1.6]} to={[0.4, 0.6, 0.2]} />
      {/* rider's phone showing the report */}
      <ReportPhone />
      {/* dispatch line: phone → pothole */}
      <DispatchLine from={[-1.5, 1.6, -1.0]} to={[0.4, 0.62, 0.2]} />
      {/* environment */}
      <Building position={[3.5, 0.012, -2.5]} size={[1.3, 2.0, 1.3]} color="#CBC4B8" />
      <Building position={[3.5, 0.012,  2.0]} size={[1.0, 1.4, 1.0]} color="#BFB8AC" />
      <Building position={[-3.4, 0.012, 2.6]} size={[1.2, 1.8, 1.2]} color="#C4BDB1" />
      <Tree position={[-3.4, 0.012, -2.0]} scale={1.05} />
      <Tree position={[3.1, 0.012, -3.5]} scale={0.9} />
      <Lamp position={[1.9, 0.012, 3.0]} />
      <Lamp position={[-1.9, 0.012, -3.5]} />
    </IsoCanvas>
  );
}
