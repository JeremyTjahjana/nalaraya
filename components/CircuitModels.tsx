'use client';
// Primitive-only component meshes for the Fisika "Rangkaian seri & paralel" module.
// NO GLB / useGLTF / previewModels.ts — every mesh is an inline three.js primitive so
// the Canvas mounts the intended geometry on the first frame (FR-5.6). The factories take
// plain props (no scene-only context) so both CircuitScene and CircuitToolPreview can call them.
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Vec3 = [number, number, number];

// --- CanvasTexture label technique borrowed from Scene.tsx `Model` bottle-label ---
function useLabelTexture(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  width = 192,
  height = 112,
) {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;
    draw(context, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
    // draw/width/height are stable per call site; label content is static per component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ---------------------------------------------------------------------------
// Battery: cylinder body + two terminal nubs (+ / −) + a "6 V" CanvasTexture label.
// ---------------------------------------------------------------------------
export function BatteryModel() {
  const label = useLabelTexture((ctx, w, h) => {
    ctx.fillStyle = '#1f2733';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f4d35e';
    ctx.font = '700 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('6 V', w / 2, h / 2 - 6);
    ctx.font = '26px sans-serif';
    ctx.fillStyle = '#e8edf2';
    ctx.fillText('Baterai', w / 2, h / 2 + 34);
  });
  return (
    <group>
      {/* Body laid on its side so terminals face +x. */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 0.92, 28]} />
        <meshStandardMaterial color="#28303c" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Wrap label plane on the top face. */}
      <mesh position={[0, 0.261, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.84, 0.42]} />
        <meshBasicMaterial map={label || undefined} toneMapped={false} transparent />
      </mesh>
      {/* Positive terminal (red nub, +x end). */}
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
        <meshStandardMaterial color="#c8323b" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Negative terminal (blue nub, −x end). */}
      <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
        <meshStandardMaterial color="#2a5f9e" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Project board / breadboard: flat slab + hole-grid CanvasTexture + two power rails.
// ---------------------------------------------------------------------------
export function BoardModel() {
  const holes = useLabelTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#eef0ea';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#c3c7bd';
      const cols = 20;
      const rows = 10;
      const dx = w / (cols + 1);
      const dy = h / (rows + 1);
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          ctx.beginPath();
          ctx.arc(c * dx, r * dy, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    512,
    256,
  );
  return (
    <group>
      {/* Flat slab. */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[2.4, 0.12, 1.3]} />
        <meshStandardMaterial color="#f0f1eb" roughness={0.7} />
      </mesh>
      {/* Hole-grid markings on the top face. */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 1.2]} />
        <meshBasicMaterial map={holes || undefined} toneMapped={false} transparent />
      </mesh>
      {/* + rail (red) along the top edge. */}
      <mesh position={[0, 0.045, -0.56]}>
        <boxGeometry args={[2.3, 0.02, 0.07]} />
        <meshStandardMaterial color="#c8323b" />
      </mesh>
      {/* − rail (blue) along the bottom edge. */}
      <mesh position={[0, 0.045, 0.56]}>
        <boxGeometry args={[2.3, 0.02, 0.07]} />
        <meshStandardMaterial color="#2a5f9e" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// LED lamp: dome sphere on a short cylinder base. Emissive color + intensity and a
// co-located pointLight lerp toward the brightness target (snapped when reduced).
// `brightness` is the already-switch-gated displayed value (0..1).
// ---------------------------------------------------------------------------
const EMISSIVE_MIN = 0.05;
const EMISSIVE_MAX = 2.4;
const LIGHT_MIN = 0.05;
const LIGHT_MAX = 2.4;

export function LedModel({
  brightness = 0,
  reduced = false,
  color = '#ffd34d',
}: {
  brightness?: number;
  reduced?: boolean;
  color?: string;
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const b = Math.max(0, Math.min(1, brightness));
  const targetEmissive = EMISSIVE_MIN + b * (EMISSIVE_MAX - EMISSIVE_MIN);
  const targetLight = b <= 0 ? 0 : LIGHT_MIN + b * (LIGHT_MAX - LIGHT_MIN);

  useFrame((_, dt) => {
    const t = reduced ? 1 : Math.min(1, dt * 6);
    if (mat.current) {
      mat.current.emissiveIntensity += (targetEmissive - mat.current.emissiveIntensity) * t;
    }
    if (light.current) {
      light.current.intensity += (targetLight - light.current.intensity) * t;
    }
  });

  return (
    <group>
      {/* Glass dome. */}
      <mesh position={[0, 0.17, 0]}>
        <sphereGeometry args={[0.12, 20, 16]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={reduced ? targetEmissive : EMISSIVE_MIN}
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Short base. */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.08, 20]} />
        <meshStandardMaterial color="#9aa3a0" metalness={0.5} roughness={0.4} />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 0.22, 0]}
        color={color}
        intensity={reduced ? targetLight : 0}
        distance={1.4}
        decay={2}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Jumper wire: thin tube between two fixed node positions, colored by polarity.
// ---------------------------------------------------------------------------
export function JumperModel({
  from,
  to,
  polarity = 'plus',
}: {
  from: Vec3;
  to: Vec3;
  polarity?: 'plus' | 'minus';
}) {
  const geometry = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.18; // small arch
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return new THREE.TubeGeometry(curve, 24, 0.022, 10, false);
  }, [from, to]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={polarity === 'plus' ? '#c8323b' : '#2a5f9e'}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Switch (sakelar): box base + a box lever rotating between open/closed, lerped
// in useFrame (snapped when reduced).
// ---------------------------------------------------------------------------
export function SwitchModel({ on = false, reduced = false }: { on?: boolean; reduced?: boolean }) {
  const lever = useRef<THREE.Group>(null);
  const targetAngle = on ? -0.5 : 0.5; // closed tips toward the board, open tips up
  useFrame((_, dt) => {
    if (!lever.current) return;
    const t = reduced ? 1 : Math.min(1, dt * 10);
    lever.current.rotation.z += (targetAngle - lever.current.rotation.z) * t;
  });
  return (
    <group>
      {/* Base plate. */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.34, 0.06, 0.2]} />
        <meshStandardMaterial color="#30363d" roughness={0.6} />
      </mesh>
      {/* Pivot block. */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.14]} />
        <meshStandardMaterial color="#4a525a" roughness={0.5} />
      </mesh>
      {/* Lever. */}
      <group ref={lever} position={[0, 0.1, 0]} rotation={[0, 0, reduced ? targetAngle : 0.5]}>
        <mesh position={[0.11, 0, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.05]} />
          <meshStandardMaterial
            color={on ? '#5fae63' : '#c8323b'}
            emissive={on ? '#2f6a33' : '#000000'}
            emissiveIntensity={on ? 0.4 : 0}
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Shared id -> mesh dispatcher so CircuitScene and CircuitToolPreview share one source.
// ---------------------------------------------------------------------------
export function CircuitComponentModel({
  id,
  brightness = 0,
  on = false,
  reduced = false,
}: {
  id: string;
  brightness?: number;
  on?: boolean;
  reduced?: boolean;
}) {
  switch (id) {
    case 'battery':
      return <BatteryModel />;
    case 'board':
      return <BoardModel />;
    case 'led':
    case 'ledA':
    case 'ledB':
    case 'ledC':
      return <LedModel brightness={brightness} reduced={reduced} />;
    case 'jumper':
      // A representative short jumper for the inventory preview.
      return <JumperModel from={[-0.3, 0, 0]} to={[0.3, 0, 0]} polarity="plus" />;
    case 'switch':
      return <SwitchModel on={on} reduced={reduced} />;
    default:
      return null;
  }
}
