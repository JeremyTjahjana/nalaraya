"use client";
// Board-framed orthographic 3D scene for the Fisika circuit module. Mirrors BiologyScene.tsx:
// a default export wrapping <Canvas orthographic …> in a copied CanvasBoundary error boundary,
// plane-intersection drag + select-then-target onClick dispatch with nearest-slot snapping, and
// constrained OrbitControls so the view stays board-framed (FR-5.4). Primitives only — it renders
// meshes from CircuitModels.tsx (NO GLB/useGLTF/previewModels, no Suspense model swap → no
// first-open placeholder flash, FR-5.6). Switch gating lives here in the view, not in solve().
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { Bounds, Html, OrbitControls } from "@react-three/drei";
import { Component, ReactNode, useRef, useState } from "react";
import * as THREE from "three";
import { type State, configForStep } from "@/lib/circuits";
import {
  type Vec3,
  BOARD_CENTER,
  BATTERY_POS,
  SWITCH_POS,
  BATTERY_PLUS,
  BATTERY_MINUS,
  RAIL_PLUS,
  RAIL_MINUS,
  SLOT_Y,
  SLOTS,
  EXPECTED_FOR_STEP,
  resolveDragUp,
} from "@/lib/circuitScene";
import {
  BatteryModel,
  BoardModel,
  JumperModel,
  LedModel,
  SwitchModel,
} from "./CircuitModels";

// Tray position where the pending token rests, in front of the board so it never overlaps the
// slots or the battery while staying inside the fixed framed extent (z within [-0.65,0.65]).
const TRAY_POS: Vec3 = [0.95, 0.32, 0.5];

// Which LED slots are populated at each config, mapped to the readout.lamps order.
const ledSlotsForConfig: Record<string, string[]> = {
  none: [],
  powered: [],
  single: ["seri"],
  series2: ["seri", "paralel"],
  parallel3: ["seri", "paralel", "paralel-1"],
  combo3: ["seri", "paralel-1", "paralel-2"],
  challenge: ["seri", "paralel-1", "paralel-2"],
};

type Props = {
  state: State;
  // onConnect and onDrop are both bound to CircuitLab's connect() so the mouse-drop and the
  // keyboard "Rangkai" paths reach the SAME dispatch. The scene only needs one of them (onDrop),
  // but the prop is kept for the keyboard parity binding in CircuitLab.
  onConnect: (source: string, target: string) => void;
  onDrop: (source: string, target: string) => void;
  onClick: (id: string) => void;
  cameraMode: boolean;
  reduced: boolean;
};

function World({ state, onDrop, onClick, cameraMode, reduced }: Props) {
  const drag = useRef<{
    id: string;
    start: THREE.Vector3;
    moved: boolean;
  } | null>(null);
  const [held, setHeld] = useState<Vec3 | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const config = configForStep[state.step];
  const ledSlots = ledSlotsForConfig[config] || [];
  const powered = state.step >= 2;
  // The component the current step is waiting for (bug B): a real draggable token the user can
  // drop onto a slot to dispatch connect(expectedSource, slotId) — same contract as the keyboard.
  const expected = EXPECTED_FOR_STEP[state.step];

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.12);
  const hit = (e: ThreeEvent<PointerEvent>) =>
    e.ray.intersectPlane(plane, new THREE.Vector3());

  function down(e: ThreeEvent<PointerEvent>, id: string) {
    if (cameraMode) return;
    e.stopPropagation();
    const p = hit(e);
    if (!p) return;
    // Record the grab point only; do NOT move the token yet (mirror BiologyScene: movement
    // happens in move() once the pointer has travelled far enough to count as a drag). This keeps
    // the token resting at TRAY_POS for a bare click (which falls through to onClick in up()).
    drag.current = { id, start: p.clone(), moved: false };
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
    const p = hit(e);
    // Resolve the pointer-up through the pure helper (unit-tested in lib/circuitScene.test.ts):
    // bare click → onClick(select/toggle); dragged onto a slot → onDrop(id, slot) which is the
    // SAME connect dispatch the keyboard "Rangkai" button fires; dragged off every slot → no-op.
    const release = p ? { x: p.x, z: p.z } : { x: d.start.x, z: d.start.z };
    const outcome = resolveDragUp(
      { id: d.id, start: [d.start.x, d.start.y, d.start.z], moved: d.moved },
      release.x,
      release.z,
    );
    if (outcome.kind === "click") onClick(outcome.id);
    else if (outcome.kind === "drop") onDrop(outcome.id, outcome.target);
  }

  return (
    <>
      <color attach="background" args={["#f6f1e7"]} />
      <hemisphereLight color="#ffffff" groundColor="#d8d3c4" intensity={1.7} />
      <directionalLight position={[5, 9, 5]} intensity={2.1} />
      <pointLight position={[-2, 4, 2]} intensity={1.1} color="#fff4e0" />

      {/* Fit the known static content (board + battery + rails/jumpers + LED layer) to the frame
          at every viewport width (bug A). <Bounds observe> refits on resize, mirroring ToolPreview;
          OrbitControls stays usable but clamped below. */}
      <Bounds fit clip observe margin={1.2}>
        {/* Fixed framing anchor (invisible): pins <Bounds fit> to the full known content extent
            — x∈[-2.1,1.4], y∈[-0.1,0.6], z∈[-0.65,0.65] (board + battery + arched jumpers + slots)
            — so the frame stays stable as LEDs/jumpers/the ring appear per langkah instead of
            re-zooming between steps (review bug-A refit note). `visible={false}` keeps it out of
            the render but Box3 still counts it toward the fit. */}
        <mesh position={[-0.35, 0.25, 0]} visible={false}>
          <boxGeometry args={[3.5, 0.7, 1.3]} />
          <meshBasicMaterial />
        </mesh>

        {/* Board (always present once placed; shown from the start as the work surface). */}
        <group position={BOARD_CENTER}>
          <BoardModel />
        </group>

        {/* Battery sits beside the board; clickable to select it for a connect target. */}
        <group
          position={BATTERY_POS}
          onPointerDown={(e) => down(e, "battery")}
          onPointerMove={move}
          onPointerUp={up}
          onPointerOver={() => setHover("battery")}
          onPointerOut={() => setHover(null)}
        >
          <BatteryModel />
        </group>

        {/* Power jumpers: appear once the rails are connected (step >= 2). Endpoints are the real
            battery-terminal and board-rail world positions so the wires actually touch (bug C). */}
        {powered && (
          <>
            <JumperModel from={BATTERY_PLUS} to={RAIL_PLUS} polarity="plus" />
            <JumperModel
              from={BATTERY_MINUS}
              to={RAIL_MINUS}
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
        {state.placed.includes("switch") && (
          <group
            position={SWITCH_POS}
            onPointerDown={(e) => {
              if (cameraMode) return;
              e.stopPropagation();
              onClick("switch");
            }}
            onPointerOver={() => setHover("switch")}
            onPointerOut={() => setHover(null)}
          >
            <SwitchModel on={state.switchOn} reduced={reduced} />
          </group>
        )}

        {/* Target-slot marker ring for the current step, so the user sees where to drop the token
            (mirrors BiologyScene's step-1 ring). Hidden while actively dragging to reduce clutter.
            This marker is static per step, so keeping it inside Bounds does not shift the fit. */}
        {expected && !cameraMode && !held && (
          <mesh
            position={[
              SLOTS[expected.target][0],
              SLOT_Y + 0.01,
              SLOTS[expected.target][2],
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.17, 0.2, 36]} />
            <meshBasicMaterial color="#d08400" transparent opacity={0.85} />
          </mesh>
        )}
      </Bounds>

      {/* The pending token the current step expects: a real draggable component (bug B). It
          carries the id EXPECTED_FOR_STEP[step].source so a drop dispatches the exact connect the
          reducer waits for (jumper→rail at step 1, ledA→seri at step 2, … ledC→paralel-2 at 6).

          CRITICAL (review fix): this ONE interactive group stays mounted for the whole drag —
          its position follows `held` while dragging and rests at TRAY_POS otherwise — so the
          onPointerMove/onPointerUp handlers and the R3F pointer capture survive to completion,
          mirroring BiologyScene's MovingTool (which never unmounts the dragged node). It also
          lives OUTSIDE <Bounds> so dragging it never influences the fit computation. */}
      {expected && (
        <group
          position={held ?? TRAY_POS}
          onPointerDown={(e) => down(e, expected.source)}
          onPointerMove={move}
          onPointerUp={up}
          onPointerOver={() => setHover("token")}
          onPointerOut={() => setHover(null)}
        >
          {expected.source === "jumper" ? (
            <JumperModel
              from={[-0.26, 0, 0]}
              to={[0.26, 0, 0]}
              polarity="plus"
            />
          ) : (
            <LedModel brightness={0} reduced={reduced} />
          )}
        </group>
      )}

      {hover && (
        <Html
          position={[BOARD_CENTER[0], 1.1, BOARD_CENTER[2]]}
          center
          style={{
            pointerEvents: "none",
            whiteSpace: "nowrap",
            background: "#fff",
            padding: "6px 10px",
            fontSize: 13,
          }}
        >
          {hover === "battery"
            ? "Sumber tegangan"
            : hover === "switch"
              ? "Sakelar"
              : expected?.source === "jumper"
                ? "Kawat jumper · seret ke rel daya"
                : "LED · seret ke slot bertanda"}
        </Html>
      )}

      <OrbitControls
        makeDefault
        enableRotate={cameraMode}
        enablePan={cameraMode}
        enableZoom
        minZoom={55}
        maxZoom={190}
        target={BOARD_CENTER}
        maxPolarAngle={Math.PI / 2.3}
      />
    </>
  );
}

class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="loading">
        Tampilan 3D tidak tersedia. Gunakan kontrol sentuh &amp; keyboard untuk
        melanjutkan.
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
        fallback={
          <p>WebGL tidak tersedia. Gunakan kontrol sentuh &amp; keyboard.</p>
        }
      >
        <World {...props} />
      </Canvas>
    </CanvasBoundary>
  );
}
