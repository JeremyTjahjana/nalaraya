import { describe, it, expect } from "vitest";
import {
  initial,
  reducer,
  circuitTools,
  type State,
  type Mode,
} from "./circuits";
import {
  SLOTS,
  EXPECTED_FOR_STEP,
  nearestSlot,
  resolveDragUp,
  SLOT_RADIUS,
  DRAG_THRESHOLD,
} from "./circuitScene";

// These tests exercise the bug-B mouse-drag path WITHOUT R3F/WebGL. CircuitScene.up() delegates
// its branching to resolveDragUp(); here we drive that pure logic with the real board slot
// coordinates and feed the resulting drop into the real reducer, proving a moved-then-released
// drag reaches the SAME connect dispatch as the keyboard and advances every langkah.
function placed(mode: Mode = "latihan"): State {
  let s = initial(mode);
  for (const t of circuitTools) s = reducer(s, { type: "add", id: t.id });
  return s;
}

describe("circuitScene — mouse-drag resolution reaches the reducer (bug B)", () => {
  it("nearestSlot snaps a release at a slot centre to that slot", () => {
    for (const [id, pos] of Object.entries(SLOTS))
      expect(nearestSlot(pos[0], pos[2])).toBe(id);
  });
  it("nearestSlot returns null when the release is beyond SLOT_RADIUS of every slot", () => {
    expect(nearestSlot(100, 100)).toBeNull();
    // Pull far to -x past the rail (the left-most slot) so no slot is within radius.
    const rail = SLOTS.rail;
    expect(nearestSlot(rail[0] - SLOT_RADIUS - 0.01, rail[2])).toBeNull();
  });
  it("a release that never travelled past the threshold is a click, not a drop", () => {
    const start: [number, number, number] = [SLOTS.seri[0], 0.3, SLOTS.seri[2]];
    const out = resolveDragUp(
      { id: "ledA", start, moved: false },
      start[0],
      start[2],
    );
    expect(out).toEqual({ kind: "click", id: "ledA" });
  });
  it("a drag released off every slot resolves to no-op (no connect)", () => {
    const out = resolveDragUp(
      { id: "ledA", start: [0.95, 0.3, 0.5], moved: true },
      5,
      5,
    );
    expect(out).toEqual({ kind: "none" });
  });
  it("DRAG_THRESHOLD distinguishes a real drag from a jittered click", () => {
    const start: [number, number, number] = [0, 0.3, 0];
    // Travel just under the threshold → click.
    expect(
      resolveDragUp(
        { id: "ledA", start, moved: false },
        DRAG_THRESHOLD * 0.5,
        0,
      ).kind,
    ).toBe("click");
    // Travel past the threshold onto the seri slot → drop.
    expect(
      resolveDragUp(
        { id: "ledA", start, moved: false },
        SLOTS.seri[0],
        SLOTS.seri[2],
      ).kind,
    ).toBe("drop");
  });

  it("EXPECTED_FOR_STEP mirrors the reducer connectForStep order literally", () => {
    expect(EXPECTED_FOR_STEP).toEqual({
      1: { source: "jumper", target: "rail" },
      2: { source: "ledA", target: "seri" },
      3: { source: "ledB", target: "seri" },
      4: { source: "ledC", target: "paralel" },
      5: { source: "ledB", target: "paralel-1" },
      6: { source: "ledC", target: "paralel-2" },
    });
  });

  it("each langkah: dragging the expected token onto its slot drops the exact connect and advances the step", () => {
    // Start assembled at step 1 (all 5 tools placed, step 0 complete).
    let s = placed();
    // Close the switch once (step 2 toggles the switch in the canonical flow; harmless earlier).
    for (let step = 1; step <= 6; step++) {
      const expected = EXPECTED_FOR_STEP[step];
      expect(s.step).toBe(step);
      // Simulate the drag: grab the token at the tray, release over the target slot centre.
      const slotPos = SLOTS[expected.target];
      const out = resolveDragUp(
        { id: expected.source, start: [0.95, 0.3, 0.5], moved: false },
        slotPos[0],
        slotPos[2],
      );
      expect(out).toEqual({
        kind: "drop",
        id: expected.source,
        target: expected.target,
      });
      // Feed the drop into the real reducer exactly as CircuitScene.onDrop -> connect does.
      if (out.kind === "drop") {
        if (step === 2) s = reducer(s, { type: "toggleSwitch" }); // close the switch before the first LED, per canonical flow
        s = reducer(s, { type: "connect", source: out.id, target: out.target });
      }
      expect(s.step).toBe(step + 1);
    }
    expect(s.step).toBe(7);
  });
});
