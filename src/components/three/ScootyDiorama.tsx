import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/* ──────────────────────────────────────────────────────────────
   SCOOTY — real-time isometric 3D diorama
   Built with raw three + react-three-fiber (no extra deps).
   Brand colors: yellow #FEC001, ink #20242E.
   ────────────────────────────────────────────────────────────── */

const BRAND = '#FEC001';
const INK = '#20242E';

type Vec3 = [number, number, number];

/** Rounded box helper (uses three's built-in RoundedBoxGeometry). */
function RBox({
  size,
  radius = 0.06,
  color,
  metalness = 0.1,
  roughness = 0.6,
  emissive,
  emissiveIntensity = 0,
  castShadow = true,
  receiveShadow = false,
  ...props
}: {
  size: Vec3;
  radius?: number;
  color: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
} & React.ComponentProps<'mesh'>) {
  const geo = useMemo(
    () => new RoundedBoxGeometry(size[0], size[1], size[2], 4, radius),
    [size, radius]
  );
  return (
    <mesh geometry={geo} castShadow={castShadow} receiveShadow={receiveShadow} {...props}>
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive ?? '#000000'}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

/** A spinning wheel. Axle runs along X so it rolls in Z. */
function Wheel({ position }: { position: Vec3 }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.x += delta * 2.2;
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 28]} />
        <meshStandardMaterial color="#15171C" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* hub */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.14, 16]} />
        <meshStandardMaterial color={BRAND} roughness={0.35} metalness={0.3} />
      </mesh>
    </group>
  );
}

/** The hero e-scooter, built from primitives. Gentle showroom bob. */
function Scooter() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 1.4) * 0.04;
      group.current.rotation.z = Math.sin(t * 1.4) * 0.012;
    }
  });
  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* deck */}
      <RBox size={[0.34, 0.08, 1.05]} radius={0.04} color={INK} position={[0, 0.2, 0]} roughness={0.45} />
      {/* deck grip (brand stripe) */}
      <RBox size={[0.24, 0.02, 0.8]} radius={0.01} color={BRAND} position={[0, 0.245, 0]} castShadow={false} />
      {/* rear fender */}
      <RBox size={[0.2, 0.12, 0.22]} radius={0.05} color={INK} position={[0, 0.26, -0.5]} />
      {/* wheels */}
      <Wheel position={[0, 0.22, 0.56]} />
      <Wheel position={[0, 0.22, -0.56]} />
      {/* steering column (tilted) */}
      <group position={[0, 0.22, 0.56]} rotation={[-0.16, 0, 0]}>
        <RBox size={[0.07, 0.92, 0.07]} radius={0.03} color="#2C3140" position={[0, 0.5, 0]} />
        {/* handlebar */}
        <mesh position={[0, 0.96, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.52, 16]} />
          <meshStandardMaterial color={INK} roughness={0.4} />
        </mesh>
        {/* grips */}
        <RBox size={[0.08, 0.05, 0.05]} radius={0.02} color={BRAND} position={[0.26, 0.96, 0]} />
        <RBox size={[0.08, 0.05, 0.05]} radius={0.02} color={BRAND} position={[-0.26, 0.96, 0]} />
        {/* headlight */}
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

function Bench({ position, rotation = [0, 0, 0] }: { position: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      <RBox size={[0.9, 0.06, 0.3]} radius={0.03} color="#9C7A53" position={[0, 0.26, 0]} />
      <RBox size={[0.9, 0.28, 0.06]} radius={0.03} color="#9C7A53" position={[0, 0.4, -0.12]} />
      <RBox size={[0.06, 0.26, 0.28]} radius={0.02} color={INK} position={[-0.38, 0.13, 0]} />
      <RBox size={[0.06, 0.26, 0.28]} radius={0.02} color={INK} position={[0.38, 0.13, 0]} />
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
      {/* window strips */}
      {[0.25, 0.5, 0.75].map((f) => (
        <RBox
          key={f}
          size={[size[0] * 0.7, 0.06, size[2] + 0.02]}
          radius={0.01}
          color="#FFE08A"
          emissive="#FFD24D"
          emissiveIntensity={0.5}
          position={[0, size[1] * f, 0]}
          castShadow={false}
        />
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

function Scene() {
  return (
    <group>
      {/* ground tile */}
      <RBox size={[10, 0.7, 10]} radius={0.3} color="#DED7C9" position={[0, -0.35, 0]} receiveShadow roughness={0.85} />

      {/* road (runs along Z) */}
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.3, 10]} />
        <meshStandardMaterial color="#50515A" roughness={0.85} />
      </mesh>
      {/* center dashes */}
      {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((z) => (
        <mesh key={z} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.5]} />
          <meshStandardMaterial color={BRAND} roughness={0.6} />
        </mesh>
      ))}

      {/* greens */}
      <GreenPatch position={[3, 0.012, -2.6]} size={[3.2, 3.6]} />
      <GreenPatch position={[-3, 0.012, 2.4]} size={[3.2, 4]} />

      {/* hero scooter */}
      <Scooter />

      {/* props */}
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

/** OrbitControls wired imperatively (no drei dependency). */
function Controls() {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);
  useEffect(() => {
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.3;
    controls.minZoom = 35;
    controls.maxZoom = 110;
    controls.target.set(0, 0.5, 0);
    return () => controls.dispose();
  }, [controls]);
  useFrame(() => controls.update());
  return null;
}

export function ScootyDiorama() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      orthographic
      camera={{ position: [9, 7.5, 9], zoom: 58, near: -50, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#ECE7DE']} />
      <fog attach="fog" args={['#ECE7DE', 18, 34]} />

      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#ffffff', '#cfc6b4', 0.5]} />
      <directionalLight
        position={[6, 11, 5]}
        intensity={1.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        shadow-bias={-0.0005}
      />

      <Scene />
      <Controls />
    </Canvas>
  );
}
