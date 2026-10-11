// Pure, view-free geometry + drag-resolution helpers for the Fisika circuit scene
// (components/CircuitScene.tsx). Extracted so the drag lifecycle — "a moved-then-released drag
// over a slot resolves to connect(expectedSource, slotId)" — is unit-testable WITHOUT R3F/WebGL
// (lib/circuitScene.test.ts), covering the bug-B mouse path that can't be exercised headlessly.
// Primitives-only scene; no three.js import here on purpose (plain numbers in/out).

export type Vec3 = [number, number, number];

// Board group origin and the battery group origin. Child-mesh offsets below are read straight
// from CircuitModels so endpoints actually touch the geometry (bug C).
export const BOARD_CENTER: Vec3 = [0, 0.1, 0];
export const BATTERY_POS: Vec3 = [-1.55, 0.3, 0];
export const SWITCH_POS: Vec3 = [0.95, 0.09, -0.5];

// Battery terminal nubs: local x=±0.5, y=0 inside the battery group (CircuitModels BatteryModel).
export const BATTERY_PLUS: Vec3 = [
  BATTERY_POS[0] + 0.5,
  BATTERY_POS[1],
  BATTERY_POS[2],
];
export const BATTERY_MINUS: Vec3 = [
  BATTERY_POS[0] - 0.5,
  BATTERY_POS[1],
  BATTERY_POS[2],
];

// Board rails: local y=0.045, z=∓0.56 inside the board group (CircuitModels BoardModel). The red
// (+) rail sits at z=-0.56, the blue (−) rail at z=+0.56. Pick an x near the battery side.
export const RAIL_Y = BOARD_CENTER[1] + 0.045;
export const RAIL_X = -0.9;
export const RAIL_PLUS: Vec3 = [RAIL_X, RAIL_Y, BOARD_CENTER[2] - 0.56];
export const RAIL_MINUS: Vec3 = [RAIL_X, RAIL_Y, BOARD_CENTER[2] + 0.56];

export const SLOT_Y = BOARD_CENTER[1] + 0.02;
export const SLOT_RADIUS = 0.6;

// Fixed board slots (named nodes). Drops snap to the nearest slot within SLOT_RADIUS; the slot id
// is the `target` the connect dispatch sends (matching lib/circuits connectForStep).
export const SLOTS: Record<string, Vec3> = {
  rail: [RAIL_X, SLOT_Y, BOARD_CENTER[2] - 0.56],
  seri: [-0.5, SLOT_Y, 0.1],
  paralel: [0.1, SLOT_Y, 0.1],
  "paralel-1": [0.5, SLOT_Y, -0.18],
  "paralel-2": [0.5, SLOT_Y, 0.38],
};

// Mirror of the reducer's connectForStep (by state.step): the component the current step expects
// and the slot it must drop onto. Derived from the same literals as CircuitLab's
// CONNECT_SOURCES/CONNECT_TARGETS — NOT imported from reducer internals.
export const EXPECTED_FOR_STEP: Record<
  number,
  { source: string; target: string }
> = {
  1: { source: "jumper", target: "rail" },
  2: { source: "ledA", target: "seri" },
  3: { source: "ledB", target: "seri" },
  4: { source: "ledC", target: "paralel" },
  5: { source: "ledB", target: "paralel-1" },
  6: { source: "ledC", target: "paralel-2" },
};

// Snap a dropped point (x,z on the board plane) to the nearest named slot within radius.
export function nearestSlot(x: number, z: number): string | null {
  let best: string | null = null;
  let bestDist = SLOT_RADIUS;
  for (const [id, pos] of Object.entries(SLOTS)) {
    const d = Math.hypot(x - pos[0], z - pos[2]);
    if (d < bestDist) {
      bestDist = d;
      best = id;
    }
  }
  return best;
}

export type DragState = { id: string; start: Vec3; moved: boolean };

// The three outcomes a pointer-up can produce, matching CircuitScene's up() handler.
export type DragOutcome =
  | { kind: "click"; id: string } // released without moving far enough → select/toggle
  | { kind: "drop"; id: string; target: string } // moved then released over a slot → connect
  | { kind: "none" }; // moved then released off every slot → no-op

// Threshold (world units) past which a pointer travel counts as a drag, not a click.
export const DRAG_THRESHOLD = 0.08;

// Pure resolution of a pointer-up given the active drag and the release point on the board plane.
// This is exactly the branching inside CircuitScene.up(): bare click → onClick; dragged onto a
// slot → onDrop(id, slot) (the connect dispatch); dragged off every slot → nothing.
export function resolveDragUp(
  drag: DragState,
  releaseX: number,
  releaseZ: number,
): DragOutcome {
  const travelled = Math.hypot(
    releaseX - drag.start[0],
    releaseZ - drag.start[2],
  );
  const moved = drag.moved || travelled > DRAG_THRESHOLD;
  if (!moved) return { kind: "click", id: drag.id };
  const slot = nearestSlot(releaseX, releaseZ);
  return slot ? { kind: "drop", id: drag.id, target: slot } : { kind: "none" };
}
