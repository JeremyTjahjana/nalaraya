"use client";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Component, ReactNode, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { type State, type Point, epidermisTools, homes } from "@/lib/epidermis";
import { Room } from "./Scene";
import { BiologyModel } from "./BiologyModels";
function MovingTool({
  object,
  state,
  reduced,
  children,
}: {
  object: State["objects"][number];
  state: State;
  reduced: boolean;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null),
    time = useRef(10);
  useEffect(() => {
    if (state.motion?.source === object.id) time.current = 0;
  }, [state.motion, object.id]);
  useFrame((_, dt) => {
    if (!ref.current) return;
    time.current += dt;
    const motion =
      state.motion?.source === object.id && time.current < 1.4 && !reduced;
    const target =
      state.objects.find((o) => o.id === state.motion?.target)?.pos ||
      object.pos;
    const p = motion ? Math.sin(Math.min(1, time.current / 1.4) * Math.PI) : 0;
    ref.current.position.set(
      object.pos[0] + (target[0] - object.pos[0]) * p,
      object.pos[1] + p * 0.3,
      object.pos[2] + (target[2] - object.pos[2]) * p,
    );
    ref.current.rotation.z = motion
      ? object.id === "coverslip"
        ? (1 - time.current / 1.4) * 0.65
        : object.id === "water" || object.id === "lugol"
          ? -p * 0.7
          : object.id === "tissue"
            ? Math.sin(time.current * 15) * 0.1
            : 0
      : 0;
  });
  return (
    <group ref={ref} position={object.pos}>
      {children}
    </group>
  );
}
function Liquid({
  event,
  stained,
  reduced,
}: {
  event: number;
  stained: boolean;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null),
    time = useRef(0);
  useEffect(() => {
    time.current = 0;
  }, [event]);
  useFrame((_, dt) => {
    time.current += dt;
    if (ref.current) {
      ref.current.visible = !reduced && time.current < 1.2;
      ref.current.position.y = 0.5 - (time.current % 0.4) * 1.1;
    }
  });
  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshStandardMaterial color={stained ? "#af7a26" : "#76b5ce"} />
      </mesh>
      <mesh
        position={[0, 0.034, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.3, 1, 1]}
      >
        <circleGeometry args={[0.1, 24]} />
        <meshStandardMaterial
          color={stained ? "#b48631" : "#89bfca"}
          transparent
          opacity={0.62}
        />
      </mesh>
    </>
  );
}
function CoverSlip({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    time.current += dt;
    const p = reduced ? 1 : Math.min(1, time.current / 1.1);
    if (ref.current) {
      ref.current.position.y = 0.045 + (1 - p) * 0.35;
      ref.current.rotation.z = (1 - p) * 0.8;
    }
  });
  return (
    <group ref={ref} position={[0, 0.4, 0]}>
      <BiologyModel id="coverslip" />
    </group>
  );
}
function EpidermisTransfer({
  state,
  reduced,
}: {
  state: State;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null),
    time = useRef(0);
  const start =
      state.objects.find((o) => o.id === "forceps")?.pos || homes.forceps,
    end = state.objects.find((o) => o.id === "slide")?.pos || homes.slide;
  useFrame((_, dt) => {
    time.current += dt;
    const p = Math.min(1, time.current / 1.1);
    if (ref.current) {
      ref.current.visible = p < 1 && !reduced;
      ref.current.position.set(
        start[0] + (end[0] - start[0]) * p,
        start[1] + 0.1 + Math.sin(p * Math.PI) * 0.3,
        start[2] + (end[2] - start[2]) * p,
      );
    }
  });
  return (
    <group ref={ref}>
      <BiologyModel id="epidermis" />
    </group>
  );
}
type Props = {
  state: State;
  onMove: (id: string, pos: Point) => void;
  onDrop: (id: string, target: string) => void;
  onClick: (id: string) => void;
  cameraMode: boolean;
  reduced: boolean;
};
function World({ state, onMove, onDrop, onClick, cameraMode, reduced }: Props) {
  const { camera, size } = useThree(),
    drag = useRef<{
      id: string;
      start: THREE.Vector3;
      pos: Point;
      moved: boolean;
    } | null>(null),
    [hover, setHover] = useState<string | null>(null);
  useEffect(() => {
    camera.zoom = Math.max(25, Math.min(size.width / 7.8, size.height / 4.6));
    camera.updateProjectionMatrix();
  }, [camera, size]);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.94),
    hit = (e: ThreeEvent<PointerEvent>) =>
      e.ray.intersectPlane(plane, new THREE.Vector3());
  function down(e: ThreeEvent<PointerEvent>, id: string, pos: Point) {
    if (cameraMode) return;
    e.stopPropagation();
    const p = hit(e);
    if (!p) return;
    drag.current = { id, start: p.clone(), pos, moved: false };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function move(e: ThreeEvent<PointerEvent>) {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    const p = hit(e);
    if (!p) return;
    if (p.distanceTo(d.start) > 0.08) d.moved = true;
    if (d.moved)
      onMove(d.id, [
        d.pos[0] + p.x - d.start.x,
        0.94,
        d.pos[2] + p.z - d.start.z,
      ]);
  }
  function up(e: ThreeEvent<PointerEvent>) {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    drag.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (!d.moved) {
      onClick(d.id);
      return;
    }
    const p = hit(e);
    if (!p) return;
    const end = [d.pos[0] + p.x - d.start.x, d.pos[2] + p.z - d.start.z];
    const target = state.objects
      .filter(
        (o) => o.id !== d.id && ["onion", "slide", "microscope"].includes(o.id),
      )
      .sort(
        (a, b) =>
          Math.hypot(a.pos[0] - end[0], a.pos[2] - end[1]) -
          Math.hypot(b.pos[0] - end[0], b.pos[2] - end[1]),
      )[0];
    if (
      target &&
      Math.hypot(target.pos[0] - end[0], target.pos[2] - end[1]) < 0.65
    )
      onDrop(d.id, target.id);
  }
  return (
    <>
      <color attach="background" args={["#f2f3ed"]} />
      <hemisphereLight color="#ffffff" groundColor="#c8d1c8" intensity={1.8} />
      <directionalLight position={[5, 9, 5]} intensity={2.2} />
      <pointLight position={[-2, 4, 2]} intensity={1.2} color="#e8ffff" />
      <Room />
      {state.objects
        .filter((o) => !(o.id === "coverslip" && state.step >= 7))
        .map((o) => (
          <MovingTool key={o.id} object={o} state={state} reduced={reduced}>
            <group
              onPointerDown={(e) => down(e, o.id, o.pos)}
              onPointerMove={move}
              onPointerUp={up}
              onPointerOver={() => setHover(o.id)}
              onPointerOut={() => setHover(null)}
            >
              <BiologyModel id={o.id} />
              {o.id === "forceps" && state.step >= 3 && state.step <= 4 && (
                <group position={[0, 0.05, 0.22]}>
                  <BiologyModel id="epidermis" />
                </group>
              )}
              {o.id === "slide" && (
                <>
                  {state.step >= 4 && state.step < 8 && (
                    <Liquid
                      event={state.motion?.event || 0}
                      stained={state.step >= 6}
                      reduced={reduced}
                    />
                  )}
                  {state.step >= 5 && (
                    <group position={[0, 0.04, 0]}>
                      <BiologyModel id="epidermis" />
                    </group>
                  )}
                  {state.step >= 7 && <CoverSlip reduced={reduced} />}
                </>
              )}
              {o.id === "microscope" &&
                state.step >= 9 &&
                [-1, 1].map((n) => (
                  <mesh key={n} position={[n * 0.23, 0.72, 0.07]}>
                    <boxGeometry args={[0.025, 0.025, 0.25]} />
                    <meshStandardMaterial
                      color="#8a9898"
                      metalness={0.65}
                      roughness={0.3}
                    />
                  </mesh>
                ))}
              {hover === o.id && (
                <Html
                  position={[0, o.id === "microscope" ? 1.85 : 0.65, 0]}
                  center
                  style={{
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    background: "#fff",
                    padding: "6px 10px",
                    fontSize: 13,
                  }}
                >
                  {epidermisTools.find((t) => t.id === o.id)?.name}
                </Html>
              )}
            </group>
          </MovingTool>
        ))}
      {state.mode === "latihan" && state.step === 1 && (
        <mesh
          position={[homes.slide[0], 0.925, homes.slide[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.4, 0.415, 40]} />
          <meshBasicMaterial color="#246746" />
        </mesh>
      )}
      {state.step === 5 && (
        <EpidermisTransfer
          key={state.motion?.event}
          state={state}
          reduced={reduced}
        />
      )}
      <OrbitControls
        enableRotate={cameraMode}
        enablePan={cameraMode}
        enableZoom
        minZoom={25}
        maxZoom={170}
        target={[0, 0.8, 0]}
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
        Tampilan 3D tidak tersedia. Gunakan kontrol sentuh & keyboard untuk
        melanjutkan.
      </p>
    ) : (
      this.props.children
    );
  }
}
export default function BiologyScene(props: Props & { resetKey: number }) {
  return (
    <CanvasBoundary>
      <Canvas
        key={props.resetKey}
        orthographic
        camera={{ position: [6, 6, 7], zoom: 70 }}
        dpr={[1, 1.5]}
        fallback={
          <p>WebGL tidak tersedia. Gunakan kontrol sentuh & keyboard.</p>
        }
      >
        <World {...props} />
      </Canvas>
    </CanvasBoundary>
  );
}
