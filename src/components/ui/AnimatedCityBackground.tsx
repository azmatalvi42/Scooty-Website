/**
 * AnimatedCityBackground.tsx — React Three Fiber (polished)
 *
 * Isometric night-city scene:
 *   • Reflective ground with subtle tech grid
 *   • Road grid with glowing Scooty-yellow lane markings + sidewalks
 *   • Canvas-texture window buildings with coloured roof glow
 *   • Warm amber street lamps, crosswalk stripes, intersection halos
 *   • E-scooters (yellow), bikes (cyan), skateboards (purple) + headlights
 *   • ACES Filmic tone mapping + SRGB output for cinematic colours
 *
 * Pure @react-three/fiber + three — no extra helpers.
 */

import { Canvas, useFrame } from '@react-three/fiber'
import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// ─── Procedural textures ──────────────────────────────────────────────────────

/** Canvas-drawn window grid for building emissive maps. */
function makeWindowTex(seed: number): THREE.CanvasTexture {
  const W = 160, H = 320
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const cx = cv.getContext('2d')!

  // Black base = no emission by default
  cx.fillStyle = '#000'
  cx.fillRect(0, 0, W, H)

  const COLS = 6, ROWS = 12
  const cw = W / COLS, ch = H / ROWS

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Deterministic per-cell brightness from seeded trig
      const v = Math.abs(Math.sin(seed + r * 5.33 + c * 9.71))
      if (v < 0.36) continue // ~36 % dark / unlit

      cx.fillStyle =
        v > 0.94 ? '#FDC002' : // Scooty yellow — rare accent
        v > 0.76 ? '#ffebb8' : // warm cream
        v > 0.58 ? '#ffd580' : // amber
                   '#c0d8ff'   // cool blue

      const pad = 3
      cx.fillRect(
        Math.round(c * cw + pad), Math.round(r * ch + pad),
        Math.round(cw - pad * 2), Math.round(ch - pad * 2),
      )
    }
  }

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Subtle blue-purple tech grid for the ground plane. */
function makeGroundTex(): THREE.CanvasTexture {
  const S = 512
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const cx = cv.getContext('2d')!

  cx.fillStyle = '#03030b'
  cx.fillRect(0, 0, S, S)

  const step = S / 14
  cx.strokeStyle = 'rgba(70, 50, 210, 0.10)'
  cx.lineWidth = 0.7
  for (let i = 0; i <= 14; i++) {
    cx.beginPath(); cx.moveTo(i * step, 0); cx.lineTo(i * step, S); cx.stroke()
    cx.beginPath(); cx.moveTo(0, i * step); cx.lineTo(S, i * step); cx.stroke()
  }

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(9, 9)
  return tex
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ROAD_POS = [-16, -8, 0, 8, 16] as const
const ROAD_W   = 3.2
const EXTENT   = 22
const LANE     = ROAD_W * 0.265     // lane centre offset from road centre
const rnd      = (a: number, b: number) => a + Math.random() * (b - a)

/** rotation.y so that local +Z = direction of travel */
function yRot(axis: 'x' | 'z', dir: number): number {
  return axis === 'x' ? (dir > 0 ? -Math.PI / 2 : Math.PI / 2) : (dir > 0 ? 0 : Math.PI)
}

// ─── Camera: very slow breathing drift ────────────────────────────────────────

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.set(
      Math.sin(t * 0.024) * 4.5,
      21 + Math.sin(t * 0.038) * 1.8,
      14 + Math.cos(t * 0.031) * 2.2,
    )
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Ground ───────────────────────────────────────────────────────────────────

function Ground() {
  const tex = useMemo(makeGroundTex, [])
  useEffect(() => () => tex.dispose(), [tex])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[130, 130]} />
      <meshStandardMaterial
        color="#0a0a1a"
        map={tex}
        roughness={0.28}
        metalness={0.0}
      />
    </mesh>
  )
}

// ─── Roads, sidewalks, markings, intersections ────────────────────────────────

function Roads() {
  // Centre-line dash positions (skip over intersections)
  const dashes = useMemo(() => {
    const out: { x: number; z: number; ry: number }[] = []
    const step = 1.9
    const skip = ROAD_W / 2 + 0.35

    for (const rz of ROAD_POS) {
      for (let x = -EXTENT + 0.95; x < EXTENT; x += step) {
        if (ROAD_POS.some(rx => Math.abs(x - rx) < skip)) continue
        out.push({ x, z: rz, ry: 0 })
      }
    }
    for (const rx of ROAD_POS) {
      for (let z = -EXTENT + 0.95; z < EXTENT; z += step) {
        if (ROAD_POS.some(rz => Math.abs(z - rz) < skip)) continue
        out.push({ x: rx, z, ry: Math.PI / 2 })
      }
    }
    return out
  }, [])

  // Crosswalk stripe positions — zebra at alternating intersections
  const crosswalks = useMemo(() => {
    const out: { x: number; z: number; ry: number }[] = []
    const SW = 0.26, SG = 0.20, SH = ROAD_W * 0.44

    for (let hi = 0; hi < ROAD_POS.length; hi++) {
      for (let vi = 0; vi < ROAD_POS.length; vi++) {
        if ((hi + vi) % 2 !== 0) continue
        const rz = ROAD_POS[hi], rx = ROAD_POS[vi]
        for (let s = 0; s < 4; s++) {
          const off = ROAD_W / 2 + (s + 0.5) * (SW + SG)
          out.push({ x: rx - off, z: rz,      ry: 0             })
          out.push({ x: rx + off, z: rz,      ry: 0             })
          out.push({ x: rx,       z: rz - off, ry: Math.PI / 2  })
          out.push({ x: rx,       z: rz + off, ry: Math.PI / 2  })
        }
      }
    }
    return out
  }, [])

  return (
    <group>
      {/* Road surfaces */}
      {ROAD_POS.map(rz => (
        <mesh key={`hr${rz}`} position={[0, 0.01, rz]}>
          <boxGeometry args={[EXTENT * 2, 0.022, ROAD_W]} />
          <meshStandardMaterial color="#0e0e1c" roughness={0.93} metalness={0.06} />
        </mesh>
      ))}
      {ROAD_POS.map(rx => (
        <mesh key={`vr${rx}`} position={[rx, 0.01, 0]}>
          <boxGeometry args={[ROAD_W, 0.022, EXTENT * 2]} />
          <meshStandardMaterial color="#0e0e1c" roughness={0.93} metalness={0.06} />
        </mesh>
      ))}

      {/* Sidewalk strips */}
      {(ROAD_POS as readonly number[]).flatMap(rz =>
        [-1, 1].map(side => (
          <mesh key={`swh${rz}${side}`} position={[0, 0.045, rz + side * (ROAD_W / 2 + 0.5)]}>
            <boxGeometry args={[EXTENT * 2, 0.06, 0.78]} />
            <meshStandardMaterial color="#161624" roughness={0.88} />
          </mesh>
        ))
      )}
      {(ROAD_POS as readonly number[]).flatMap(rx =>
        [-1, 1].map(side => (
          <mesh key={`swv${rx}${side}`} position={[rx + side * (ROAD_W / 2 + 0.5), 0.045, 0]}>
            <boxGeometry args={[0.78, 0.06, EXTENT * 2]} />
            <meshStandardMaterial color="#161624" roughness={0.88} />
          </mesh>
        ))
      )}

      {/* Glowing yellow centre-line dashes */}
      {dashes.map((d, i) => (
        <mesh key={i} position={[d.x, 0.032, d.z]} rotation={[0, d.ry, 0]}>
          <boxGeometry args={[0.10, 0.007, 0.44]} />
          <meshStandardMaterial
            color="#FDC002" emissive="#FDC002" emissiveIntensity={2.2}
            roughness={1}
          />
        </mesh>
      ))}

      {/* Intersection ambient halos */}
      {(ROAD_POS as readonly number[]).flatMap(rx =>
        (ROAD_POS as readonly number[]).map(rz => (
          <mesh key={`ih${rx}${rz}`} rotation={[-Math.PI / 2, 0, 0]} position={[rx, 0.014, rz]}>
            <circleGeometry args={[1.8, 24]} />
            <meshStandardMaterial
              color="#ffffff" emissive="#ffffff" emissiveIntensity={0.045}
              transparent opacity={0.55} roughness={1} depthWrite={false}
            />
          </mesh>
        ))
      )}

      {/* Crosswalk zebra stripes */}
      {crosswalks.map((cw, i) => (
        <mesh key={i} position={[cw.x, 0.024, cw.z]} rotation={[0, cw.ry, 0]}>
          <boxGeometry args={[0.26, 0.007, ROAD_W * 0.44]} />
          <meshStandardMaterial
            color="#c8c8dc" emissive="#c8c8dc" emissiveIntensity={0.35}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Buildings with canvas window textures ────────────────────────────────────

const ROOF_PALETTE = ['#FDC002', '#00AAFF', '#8830FF', '#FF2255', '#18FF80', '#FF7010']

function Buildings() {
  // 8 shared window textures — buildings pick one each
  const pool = useMemo<THREE.CanvasTexture[]>(() =>
    Array.from({ length: 8 }, (_, i) => makeWindowTex(i * 74.3)),
  [])
  useEffect(() => () => pool.forEach(t => t.dispose()), [pool])

  const data = useMemo(() => {
    type B = {
      x: number; z: number; w: number; d: number; h: number
      tex: THREE.CanvasTexture; roofCol: string; roofGlow: number
    }
    const out: B[] = []
    const centres  = [-12, -4, 4, 12]
    const blockHalf = (8 - ROAD_W) / 2 - 0.2   // ≈ 2.2 units

    for (const cx of centres) {
      for (const cz of centres) {
        const n = 1 + Math.floor(rnd(0, 3.1))
        for (let i = 0; i < n; i++) {
          const w    = rnd(blockHalf * 0.45, blockHalf * 0.95)
          const d    = rnd(blockHalf * 0.45, blockHalf * 0.95)
          const h    = rnd(2, 13)
          const maxO = blockHalf - Math.max(w, d) / 2 - 0.12
          out.push({
            x: cx + rnd(-maxO, maxO),
            z: cz + rnd(-maxO, maxO),
            w, d, h,
            tex:      pool[Math.floor(rnd(0, pool.length))],
            roofCol:  ROOF_PALETTE[Math.floor(rnd(0, ROOF_PALETTE.length))],
            roofGlow: rnd(0.55, 1.1),
          })
        }
      }
    }
    return out
  }, [pool])

  return (
    <group>
      {data.map((b, i) => (
        <group key={i}>
          {/* Body: window emissive map on 4 sides, solid roof, dark base */}
          <mesh position={[b.x, b.h / 2, b.z]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            {/* +X face */ }<meshStandardMaterial attach="material-0" color="#0c0c1c" emissiveMap={b.tex} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.92} />
            {/* -X face */ }<meshStandardMaterial attach="material-1" color="#0c0c1c" emissiveMap={b.tex} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.92} />
            {/* +Y roof  */ }<meshStandardMaterial attach="material-2" color={b.roofCol} emissive={b.roofCol} emissiveIntensity={b.roofGlow} roughness={0.8} />
            {/* -Y base  */ }<meshStandardMaterial attach="material-3" color="#060610" roughness={1} />
            {/* +Z face  */ }<meshStandardMaterial attach="material-4" color="#0c0c1c" emissiveMap={b.tex} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.92} />
            {/* -Z face  */ }<meshStandardMaterial attach="material-5" color="#0c0c1c" emissiveMap={b.tex} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.92} />
          </mesh>

          {/* Soft roof glow halo plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[b.x, b.h + 0.08, b.z]}>
            <planeGeometry args={[b.w * 1.6, b.d * 1.6]} />
            <meshStandardMaterial
              color={b.roofCol} emissive={b.roofCol} emissiveIntensity={0.22}
              transparent opacity={0.55} roughness={1} depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── Street lights ────────────────────────────────────────────────────────────

function StreetLight({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Pole */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.022, 0.028, 3.1, 7]} />
        <meshStandardMaterial color="#1c1c2e" roughness={0.65} metalness={0.7} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.44, 3.18, 0]} rotation={[0, 0, Math.PI * 0.09]}>
        <cylinderGeometry args={[0.012, 0.012, 0.95, 5]} />
        <meshStandardMaterial color="#1c1c2e" roughness={0.65} metalness={0.7} />
      </mesh>
      {/* Lamp globe */}
      <mesh position={[0.88, 3.06, 0]}>
        <sphereGeometry args={[0.095, 10, 7]} />
        <meshStandardMaterial color="#fff8d8" emissive="#ffdf50" emissiveIntensity={4.0} roughness={0.5} />
      </mesh>
      {/* Warm light pool */}
      <pointLight position={[0.88, 3.06, 0]} color="#ffc830" intensity={7} distance={12} decay={2} />
    </group>
  )
}

function StreetLights() {
  const off = ROAD_W / 2 + 0.55
  const positions = [
    { x: -8 + off, z: -8 + off }, { x: -8 + off, z:  8 - off },
    { x:  8 - off, z: -8 + off }, { x:  8 - off, z:  8 - off },
    { x:      off, z:      off }, { x:     -off,  z:     -off },
    { x: -16 + off, z:  0 + off }, { x: 16 - off, z:  0 - off },
    { x:  0 + off,  z: -16 + off }, { x:  0 - off, z: 16 - off },
  ]
  return <>{positions.map((p, i) => <StreetLight key={i} x={p.x} z={p.z} />)}</>
}

// ─── Shared vehicle movement hook ─────────────────────────────────────────────

interface VehicleProps {
  axis: 'x' | 'z'; roadPos: number; laneOff: number
  startPos: number; speed: number; dir: 1 | -1; color: string
}

function useVehicleMove(
  gRef: MutableRefObject<THREE.Group>,
  { axis, roadPos, laneOff, speed, dir }: Omit<VehicleProps, 'startPos' | 'color'>,
  posRef: MutableRefObject<number>,
) {
  useFrame((_, dt) => {
    posRef.current += speed * dir * dt
    if (posRef.current >  EXTENT) posRef.current = -EXTENT
    if (posRef.current < -EXTENT) posRef.current =  EXTENT
    gRef.current.position.set(
      axis === 'x' ? posRef.current : roadPos + laneOff,
      0,
      axis === 'z' ? posRef.current : roadPos + laneOff,
    )
  })
}

// ─── E-Scooter ────────────────────────────────────────────────────────────────

function EScooter(p: VehicleProps) {
  const gRef = useRef<THREE.Group>(null!)
  const pos  = useRef(p.startPos)
  useVehicleMove(gRef, p, pos)
  const c = p.color

  return (
    <group ref={gRef} rotation={[0, yRot(p.axis, p.dir), 0]}>
      {/* Deck */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.175, 0.045, 0.80]} />
        <meshStandardMaterial color="#111118" roughness={0.75} metalness={0.25} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.50, 0.34]} rotation={[0.17, 0, 0]}>
        <cylinderGeometry args={[0.020, 0.022, 0.78, 7]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.0} roughness={0.35} metalness={0.65} />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0, 0.88, 0.27]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.017, 0.017, 0.42, 7]} />
        <meshStandardMaterial color="#181828" roughness={0.55} metalness={0.6} />
      </mesh>
      {/* Wheels */}
      {([-0.34, 0.34] as const).map((z, i) => (
        <mesh key={i} position={[0, 0.068, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.068, 0.072, 11]} />
          <meshStandardMaterial color="#08080f" roughness={0.95} />
        </mesh>
      ))}
      {/* Rider body */}
      <mesh position={[0, 0.375, 0.04]}>
        <capsuleGeometry args={[0.07, 0.17, 4, 9]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} roughness={0.7} />
      </mesh>
      {/* Rider head */}
      <mesh position={[0, 0.70, 0.02]}>
        <sphereGeometry args={[0.076, 10, 8]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.35} roughness={0.7} />
      </mesh>
      {/* Headlight */}
      <mesh position={[0, 0.145, 0.43]}>
        <sphereGeometry args={[0.038, 7, 5]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffe8a0" emissiveIntensity={4.5} roughness={1} />
      </mesh>
    </group>
  )
}

// ─── Bike ─────────────────────────────────────────────────────────────────────

function Bike(p: VehicleProps) {
  const gRef = useRef<THREE.Group>(null!)
  const pos  = useRef(p.startPos)
  useVehicleMove(gRef, p, pos)
  const c = p.color

  return (
    <group ref={gRef} rotation={[0, yRot(p.axis, p.dir), 0]}>
      {/* Wheels */}
      {([-0.32, 0.32] as const).map((z, i) => (
        <mesh key={i} position={[0, 0.118, z]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.105, 0.022, 9, 16]} />
          <meshStandardMaterial color="#181828" roughness={0.88} metalness={0.25} />
        </mesh>
      ))}
      {/* Chain stay */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.020, 0.030, 0.56]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.75} roughness={0.35} metalness={0.55} />
      </mesh>
      {/* Down tube */}
      <mesh position={[0, 0.34, 0.12]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.015, 0.40, 0.015]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.65} roughness={0.35} metalness={0.55} />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0, 0.50, 0.29]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.28, 7]} />
        <meshStandardMaterial color="#181828" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Rider */}
      <mesh position={[0, 0.54, 0.02]}>
        <capsuleGeometry args={[0.058, 0.21, 4, 9]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.42} roughness={0.7} />
      </mesh>
      {/* Headlight */}
      <mesh position={[0, 0.118, 0.35]}>
        <sphereGeometry args={[0.030, 7, 5]} />
        <meshStandardMaterial color="#ffffff" emissive="#e8f4ff" emissiveIntensity={3.5} roughness={1} />
      </mesh>
    </group>
  )
}

// ─── Skateboard ───────────────────────────────────────────────────────────────

function Skateboard(p: VehicleProps) {
  const gRef = useRef<THREE.Group>(null!)
  const kRef = useRef<THREE.Group>(null!)
  const pos  = useRef(p.startPos)
  useVehicleMove(gRef, p, pos)

  useFrame(({ clock }) => {
    kRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 7.2 + pos.current * 0.3) * 0.042
  })

  const wheelPos: [number, number, number][] = [
    [-0.088, 0.042, 0.25], [0.088, 0.042, 0.25],
    [-0.088, 0.042, -0.25], [0.088, 0.042, -0.25],
  ]

  return (
    <group ref={gRef} rotation={[0, yRot(p.axis, p.dir), 0]}>
      <group ref={kRef}>
        {/* Board */}
        <mesh position={[0, 0.073, 0]}>
          <boxGeometry args={[0.195, 0.042, 0.70]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.65} roughness={0.72} />
        </mesh>
        {/* Trucks */}
        {([-0.25, 0.25] as const).map((z, i) => (
          <mesh key={i} position={[0, 0.042, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.017, 0.017, 0.23, 6]} />
            <meshStandardMaterial color="#1e1e30" roughness={0.55} metalness={0.65} />
          </mesh>
        ))}
        {/* Wheels */}
        {wheelPos.map(([wx, wy, wz], i) => (
          <mesh key={i} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.038, 0.038, 0.052, 9]} />
            <meshStandardMaterial color="#111120" roughness={0.9} />
          </mesh>
        ))}
        {/* Rider */}
        <mesh position={[0, 0.315, 0]}>
          <capsuleGeometry args={[0.052, 0.17, 4, 8]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

type VehicleConfig = VehicleProps & { kind: 'scooter' | 'bike' | 'skate' }

function Scene() {
  const vehicles = useMemo<VehicleConfig[]>(() => {
    const yellows = ['#FDC002', '#FFD030', '#FFC018']
    const cyans   = ['#00C0FF', '#22D8FF', '#00AADE']
    const purples = ['#A030FF', '#B858FF', '#7818EE']
    const pick    = <T,>(a: T[]) => a[Math.floor(rnd(0, a.length))]

    const v = (
      kind: VehicleConfig['kind'],
      axis: 'x' | 'z', roadPos: number, dir: 1 | -1, pal: string[],
    ): VehicleConfig => ({
      kind, axis, roadPos,
      laneOff:  dir * LANE,
      startPos: rnd(-EXTENT, EXTENT),
      speed: kind === 'scooter' ? rnd(4.0, 6.5)
           : kind === 'bike'    ? rnd(2.8, 5.0)
           :                      rnd(2.2, 3.8),
      dir, color: pick(pal),
    })

    return [
      // ── E-scooters ─────────────────────────────────────────────────────
      v('scooter', 'x',  -8,  1, yellows), v('scooter', 'x',   0, -1, yellows),
      v('scooter', 'x',   8,  1, yellows), v('scooter', 'x', -16,  1, yellows),
      v('scooter', 'x',  16, -1, yellows), v('scooter', 'z',  -8,  1, yellows),
      v('scooter', 'z',   0, -1, yellows), v('scooter', 'z',   8,  1, yellows),
      v('scooter', 'z', -16,  1, yellows), v('scooter', 'z',  16, -1, yellows),
      // ── Bikes ──────────────────────────────────────────────────────────
      v('bike', 'x', -8, -1, cyans), v('bike', 'x', 0,  1, cyans),
      v('bike', 'z', -8, -1, cyans), v('bike', 'z', 0,  1, cyans),
      v('bike', 'x',  8, -1, cyans), v('bike', 'z', 8,  1, cyans),
      // ── Skateboards ────────────────────────────────────────────────────
      v('skate', 'x',  -8,  1, purples),
      v('skate', 'z',   8, -1, purples),
      v('skate', 'x',   0, -1, purples),
      v('skate', 'z',  -16,  1, purples),
    ]
  }, [])

  return (
    <>
      {/* Atmospheric fog — colour matches Canvas background */}
      <fog attach="fog" args={['#05050d', 34, 75]} />

      {/* ── Lighting ──────────────────────────────────────────────────── */}
      {/* Cool ambient — deep blue night sky base */}
      <ambientLight color="#12122a" intensity={1.4} />
      {/* Key: warm-white from upper right */}
      <directionalLight position={[16, 24, 10]} color="#dcdcf8" intensity={2.2} />
      {/* Fill: cold blue from lower left — rim separation */}
      <directionalLight position={[-12, 8, -18]} color="#0818b0" intensity={0.7} />
      {/* Ground bounce: very faint upward purple tint */}
      <pointLight position={[0, -3, 0]} color="#2010c0" intensity={2} distance={60} decay={1} />

      <Ground />
      <Roads />
      <Buildings />
      <StreetLights />

      {vehicles.map((vc, i) => {
        const { kind, ...p } = vc
        if (kind === 'scooter') return <EScooter   key={i} {...p} />
        if (kind === 'bike')    return <Bike       key={i} {...p} />
        return                         <Skateboard key={i} {...p} />
      })}

      <CameraRig />
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AnimatedCityBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 20, 14], fov: 46, near: 0.1, far: 160 }}
        gl={{
          antialias: true,
          toneMapping:          THREE.ACESFilmicToneMapping,
          toneMappingExposure:  1.15,
          outputColorSpace:     THREE.SRGBColorSpace,
        }}
        style={{ background: '#05050d' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
