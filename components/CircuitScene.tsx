'use client';
// Board-framed orthographic 3D scene for the Fisika circuit module. Mirrors BiologyScene.tsx:
// a default export wrapping <Canvas orthographic …> in a copied CanvasBoundary error boundary,
// plane-intersection drag + select-then-target onClick dispatch with nearest-slot snapping, and
// constrained OrbitControls so the view stays board-framed (FR-5.4). Primitives only — it renders
// meshes from CircuitModels.tsx (NO GLB/useGLTF/previewModels, no Suspense model swap → no
// first-open placeholder flash, FR-5.6). Switch gating lives here in the view, not in solve().
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Component, ReactNode, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { type State, configForStep } from '@/lib/circuits';
import {
  BatteryModel,
  BoardModel,
  JumperModel,
  LedModel,
  SwitchModel,
} from './CircuitModels';

type Vec3 = [number, number, number];

// Fixed board slots (named nodes). Drops snap to the nearest slot within SLOT_RADIUS; the slot id
// is the `target` the onConnect dispatch sends (matching lib/circuits connectForStep / challengeTargetSlots).
const BOARD_CENTER: Vec3 = [0, 0.1, 0];
const SLOT_RADIUS = 0.6;
const SLOTS: Record<string, Vec3> = {
  rail: [-0.9, 0.12, -0.56],
  seri: [-0.5, 0.12, 0.1],
  paralel: [0.1, 0.12, 0.1],
  'paralel-1': [0.5, 0.12, -0.18],
  'paralel-2': [0.5, 0.12, 0.38],
};

const BATTERY_POS: Vec3 = [-1.55, 0.3, 0];
const SWITCH_POS: Vec3 = [0.95, 0.09, -0.5];

// Which LED slots are populated at each config, mapped to the readout.lamps order.
const ledSlotsForConfig: Record<string, string[]> = {
  none: [],
  powered: [],
  single: ['seri'],
  series2: ['seri', 'paralel'],
  parallel3: ['seri', 'paralel', 'paralel-1'],
  combo3: ['seri', 'paralel-1', 'paralel-2'],
  challenge: ['seri', 'paralel-1', 'paralel-2'],
};

type Props = {
  state: State;
  onConnect: (source: string, target: string) => void;
  onDrop: (source: string, target: string) => void;
  onClick: (id: string) => void;
  cameraMode: boolean;
  reduced: boolean;
};

function World({ state, onConnect, onDrop, onClick, cameraMode, reduced }: Props) {
  const { camera, size } = useThree();
  const drag = useRef<{ id: string; start: THREE.Vector3; moved: boolean } | null>(null);
  const [held, setHeld] = useState<Vec3 | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    camera.zoom = Math.max(70, Math.min(size.width / 4.6, size.height / 3.0));
    camera.updateProjectionMatrix();
  }, [camera, size]);

  const config = configForStep[state.step];
  const ledSlots = ledSlotsForConfig[config] || [];
  const powered = state.step >= 2;

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.12);
  const hit = (e: ThreeEvent<PointerEvent>) =>
    e.ray.intersectPlane(plane, new THREE.Vector3());

  // Snap a dropped point to the nearest named slot within radius.
  function nearestSlot(point: THREE.Vector3): string | null {
    let best: string | null = null;
    let bestDist = SLOT_RADIUS;
    for (const [id, pos] of Object.entries(SLOTS)) {
      const d = Math.hypot(point.x - pos[0], point.z - pos[2]);
      if (d < bestDist) {
        bestDist = d;
        best = id;
      }
    }
    return best;
  }

  function down(e: ThreeEvent<PointerEvent>, id: string) {
    if (cameraMode) return;
    e.stopPropagation();
    const p = hit(e);
    if (!p) return;
    drag.current = { id, start: p.clone(), moved: false };
    setHeld([p.x, 0.3, p.z]);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function move(e: ThreeEvent<PointerEvent>) {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    const p = hit(e);
    if (!p) return;
    if (p.distanceTo(d.start) > 0.08) d.moved = true;
    if (d.moved) setHeld([p.x, 0.3, p.z]);
  }
  function up(e: ThreeEvent<PointerEvent>) {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    drag.current = null;
    setHeld(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (!d.moved) {
      onClick(d.id);
      return;
    }
    const p = hit(e);
    if (!p) return;
    const slot = nearestSlot(p);
    if (slot) onDrop(d.id, slot);
  }

  return (
    <>
      <color attach="background" args={['#f6f1e7']} />
      <hemisphereLight color="#ffffff" groundColor="#d8d3c4" intensity={1.7} />
      <directionalLight position={[5, 9, 5]} intensity={2.1} />
      <pointLight position={[-2, 4, 2]} intensity={1.1} color="#fff4e0" />

      {/* Board (always present once placed; shown from the start as the work surface). */}
      <group position={BOARD_CENTER}>
        <BoardModel />
      </group>

      {/* Battery sits beside the board; clickable to select it for a connect target. */}
      <group
        position={BATTERY_POS}
        onPointerDown={(e) => down(e, 'battery')}
        onPointerMove={move}
        onPointerUp={up}
        onPointerOver={() => setHover('battery')}
        onPointerOut={() => setHover(null)}
      >
        <BatteryModel />
      </group>

      {/* Power jumpers: appear once the rails are connected (step >= 2). */}
      {powered && (
        <>
          <JumperModel
            from={[BATTERY_POS[0] + 0.5, 0.12, -0.05]}
            to={SLOTS.rail}
            polarity="plus"
          />
          <JumperModel
            from={[BATTERY_POS[0] - 0.5, 0.12, 0.05]}
            to={[SLOTS.rail[0], 0.12, 0.56]}
            polarity="minus"
          />
        </>
      )}

      {/* LEDs for the current config; brightness gated by the switch (view-layer gating). */}
      {ledSlots.map((slotId, i) => {
        const slot = SLOTS[slotId];
        const lampBrightness = state.readout.lamps[i]?.brightness ?? 0;
        const displayedBrightness = state.switchOn ? lampBrightness : 0;
        return (
          <group key={slotId} position={slot}>
            <LedModel brightness={displayedBrightness} reduced={reduced} />
          </group>
        );
      })}

      {/* Switch: present once placed; clicking it dispatches toggleSwitch via onClick. */}
      {state.placed.includes('switch') && (
        <group
          position={SWITCH_POS}
          onPointerDown={(e) => {
            if (cameraMode) return;
            e.stopPropagation();
            onClick('switch');
          }}
          onPointerOver={() => setHover('switch')}
          onPointerOut={() => setHover(null)}
        >
          <SwitchModel on={state.switchOn} reduced={reduced} />
        </group>
      )}

      {/* The component currently being dragged, floating under the pointer. */}
      {held && drag.current && (
        <group position={held}>
          {drag.current.id === 'battery' ? (
            <BatteryModel />
          ) : drag.current.id === 'switch' ? (
            <SwitchModel on={state.switchOn} reduced={reduced} />
          ) : drag.current.id === 'jumper' ? (
            <JumperModel from={[-0.3, 0, 0]} to={[0.3, 0, 0]} polarity="plus" />
          ) : (
            <LedModel brightness={state.switchOn ? 1 : 0} reduced={reduced} />
          )}
        </group>
      )}

      {hover && (
        <Html
          position={[BOARD_CENTER[0], 1.1, BOARD_CENTER[2]]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            background: '#fff',
            padding: '6px 10px',
            fontSize: 13,
          }}
        >
          {hover === 'battery' ? 'Sumber tegangan' : 'Sakelar'}
        </Html>
      )}

      <OrbitControls
        enableRotate={cameraMode}
        enablePan={cameraMode}
        enableZoom
        minZoom={60}
        maxZoom={190}
        target={BOARD_CENTER}
        maxPolarAngle={Math.PI / 2.3}
      />
    </>
  );
}

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="loading">
        Tampilan 3D tidak tersedia. Gunakan kontrol sentuh &amp; keyboard untuk melanjutkan.
      </p>
    ) : (
      this.props.children
    );
  }
}

export default function CircuitScene(props: Props & { resetKey: number }) {
  return (
    <CanvasBoundary>
      <Canvas
        key={props.resetKey}
        orthographic
        camera={{ position: [5, 6, 7], zoom: 90 }}
        dpr={[1, 1.5]}
        fallback={<p>WebGL tidak tersedia. Gunakan kontrol sentuh &amp; keyboard.</p>}
      >
        <World {...props} />
      </Canvas>
    </CanvasBoundary>
  );
}
