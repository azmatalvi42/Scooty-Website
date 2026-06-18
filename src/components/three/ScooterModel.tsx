import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/* ──────────────────────────────────────────────────────────────
   SCOOTY — branded kick e-scooter (built from primitives).
   Yellow stem with wavy pattern + SCOOTY wordmark (procedural
   canvas texture, no image files). Faces +Z.
   ────────────────────────────────────────────────────────────── */

const BRAND = '#FEC001';
const INK = '#1A1C22';
const TIRE = '#16181D';

type Vec3 = [number, number, number];

function RBox({
  size,
  radius = 0.04,
  color,
  metalness = 0.15,
  roughness = 0.55,
  ...props
}: {
  size: Vec3;
  radius?: number;
  color: string;
  metalness?: number;
  roughness?: number;
} & React.ComponentProps<'mesh'>) {
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], size[1], size[2], 4, radius), [size, radius]);
  return (
    <mesh geometry={geo} castShadow {...props}>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/** Procedural texture for the stem: yellow base + black wavy lines + SCOOTY + RS99 plate. */
function useStemTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 1024;
    const g = c.getContext('2d')!;
    g.fillStyle = BRAND;
    g.fillRect(0, 0, 256, 1024);

    // wavy vertical-travelling lines (the SCOOTY deco pattern)
    g.strokeStyle = 'rgba(20,18,10,0.92)';
    g.lineWidth = 7;
    for (let k = 0; k < 7; k++) {
      g.beginPath();
      for (let y = -10; y <= 1034; y += 8) {
        const x = 40 + k * 28 + Math.sin(y / 85 + k * 0.7) * 16;
        if (y === -10) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }

    // SCOOTY wordmark running up the stem
    g.save();
    g.translate(128, 470);
    g.rotate(-Math.PI / 2);
    g.fillStyle = '#141210';
    g.font = '900 92px Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('SCOOTY', 0, 0);
    g.restore();

    // RS99 plate near the base
    g.fillStyle = '#141210';
    const px = 58, py = 760, pw = 140, ph = 90;
    g.beginPath();
    // rounded rect
    const r = 16;
    g.moveTo(px + r, py);
    g.arcTo(px + pw, py, px + pw, py + ph, r);
    g.arcTo(px + pw, py + ph, px, py + ph, r);
    g.arcTo(px, py + ph, px, py, r);
    g.arcTo(px, py, px + pw, py, r);
    g.fill();
    g.fillStyle = BRAND;
    g.font = '800 52px Arial, sans-serif';
    g.fillText('RS99', px + pw / 2, py + ph / 2 + 4);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Wheel({ position, spinRef }: { position: Vec3; spinRef: React.MutableRefObject<THREE.Group | null> }) {
  return (
    <group ref={spinRef} position={position}>
      {/* tire */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.27, 0.27, 0.13, 32]} />
        <meshStandardMaterial color={TIRE} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.17, 0.14, 24]} />
        <meshStandardMaterial color="#2A2D35" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* brake disc (brand) */}
      <mesh position={[0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} />
        <meshStandardMaterial color={BRAND} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

export function ScooterModel({
  spin = true,
  ...props
}: { spin?: boolean } & React.ComponentProps<'group'>) {
  const frontWheel = useRef<THREE.Group>(null);
  const rearWheel = useRef<THREE.Group>(null);
  const stemTex = useStemTexture();

  useFrame((_, delta) => {
    if (spin) {
      const d = delta * 3;
      if (frontWheel.current) frontWheel.current.rotation.x += d;
      if (rearWheel.current) rearWheel.current.rotation.x += d;
    }
  });

  return (
    <group {...props}>
      {/* deck */}
      <RBox size={[0.4, 0.09, 1.5]} radius={0.045} color={INK} position={[0, 0.24, 0]} roughness={0.5} />
      {/* deck grip top */}
      <RBox size={[0.3, 0.015, 1.2]} radius={0.01} color="#0E0F12" position={[0, 0.29, 0]} roughness={0.9} />

      {/* wheels */}
      <Wheel position={[0, 0.27, 0.78]} spinRef={frontWheel} />
      <Wheel position={[0, 0.27, -0.78]} spinRef={rearWheel} />

      {/* rear fender (brand yellow) */}
      <mesh castShadow position={[0, 0.5, -0.78]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.42]} />
        <meshStandardMaterial color={BRAND} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.46, -0.95]}>
        <boxGeometry args={[0.18, 0.04, 0.12]} />
        <meshStandardMaterial color="#C24A1F" roughness={0.5} />
      </mesh>

      {/* front fork */}
      <mesh castShadow position={[0.07, 0.42, 0.78]} rotation={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
        <meshStandardMaterial color="#3A3D45" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[-0.07, 0.42, 0.78]} rotation={[0, 0, -0.04]}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
        <meshStandardMaterial color="#3A3D45" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* steering column (tilted, branded) */}
      <group position={[0, 0.32, 0.78]} rotation={[-0.14, 0, 0]}>
        <mesh castShadow position={[0, 0.62, 0]}>
          <boxGeometry args={[0.17, 1.25, 0.12]} />
          <meshStandardMaterial map={stemTex} roughness={0.45} metalness={0.05} />
        </mesh>

        {/* handlebar */}
        <mesh position={[0, 1.27, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.62, 16]} />
          <meshStandardMaterial color={INK} roughness={0.4} metalness={0.3} />
        </mesh>
        {/* grips */}
        <RBox size={[0.1, 0.07, 0.07]} radius={0.03} color="#0E0F12" position={[0.3, 1.27, 0]} />
        <RBox size={[0.1, 0.07, 0.07]} radius={0.03} color="#0E0F12" position={[-0.3, 1.27, 0]} />
        {/* display */}
        <RBox size={[0.16, 0.1, 0.04]} radius={0.02} color="#0E0F12" position={[0, 1.12, 0.07]} />
        <mesh position={[0, 1.12, 0.092]}>
          <planeGeometry args={[0.11, 0.06]} />
          <meshStandardMaterial color="#7FE3D0" emissive="#33C9B0" emissiveIntensity={0.8} />
        </mesh>
        {/* headlight */}
        <mesh position={[0, 0.95, 0.08]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#FFF7DA" emissive="#FFE08A" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Soft Argo-style ground-shadow blob (radial gradient on a plane). */
export function ShadowBlob({ position = [0, 0.01, 0], scale = 2.4 }: { position?: Vec3; scale?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(128, 128, 10, 128, 128, 124);
    grad.addColorStop(0, 'rgba(20,18,12,0.5)');
    grad.addColorStop(0.5, 'rgba(20,18,12,0.22)');
    grad.addColorStop(1, 'rgba(20,18,12,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    return t;
  }, []);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale * 1.35, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}
