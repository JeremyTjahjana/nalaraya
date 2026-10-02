"use client";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { tools, targets, State, Action } from "@/lib/lab";
import { liquidFeedback, type LiquidFeedback } from "@/lib/liquidFeedback";

function Glass({ children }: { children: React.ReactNode }) {
  return <group>{children}</group>;
}

function FlaskLiquid({ pink, over }: { pink: boolean; over: boolean }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const targetColor = useMemo(() => {
    if (over) return new THREE.Color("#c9287a");
    if (pink) return new THREE.Color("#f5b5cc");
    return new THREE.Color("#e5eee8");
  }, [pink, over]);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.color.lerp(targetColor, Math.min(1, delta * 3.5));
    }
  });

  return (
    <mesh position={[0, 0.11, 0]}>
      <cylinderGeometry args={[0.09, 0.176, 0.2, 18]} />
      <meshStandardMaterial
        ref={matRef}
        color={pink ? "#f5b5cc" : "#e5eee8"}
        transparent
        opacity={0.85}
        roughness={0.1}
      />
    </mesh>
  );
}

function BuretteLiquidAndValve({
  filled,
  volume = 0,
  dosing = false,
  glass,
}: {
  filled: boolean;
  volume?: number;
  dosing?: boolean;
  glass: React.ReactNode;
}) {
  const colRef = useRef<THREE.Mesh>(null);
  const valveRef = useRef<THREE.Group>(null);
  const currentVol = useRef(volume);

  useFrame((_, delta) => {
    if (filled && colRef.current) {
      currentVol.current = THREE.MathUtils.lerp(
        currentVol.current,
        volume,
        Math.min(1, delta * 4)
      );
      const fraction = Math.min(1, Math.max(0, currentVol.current / 50));
      const height = Math.max(0.06, 1.18 * (1 - fraction * 0.92));
      colRef.current.scale.set(1, height / 1.18, 1);
      colRef.current.position.y = 0.82 - (1.18 - height) / 2;
    }
    if (valveRef.current) {
      const targetAngle = dosing ? Math.PI / 2 : 0;
      valveRef.current.rotation.x = THREE.MathUtils.lerp(
        valveRef.current.rotation.x,
        targetAngle,
        Math.min(1, delta * 12)
      );
    }
  });

  return (
    <>
      {filled && (
        <mesh ref={colRef} position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.18, 14]} />
          <meshStandardMaterial color="#a7c8c6" transparent opacity={0.62} />
        </mesh>
      )}
      {/* Valve / stopcock casing */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.09, 12]} />
        {glass}
      </mesh>
      {/* Animated Stopcock valve handle in laboratory red */}
      <group ref={valveRef} position={[0, 0.19, 0]}>
        <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.14, 10]} />
          <meshStandardMaterial color="#b72d2d" roughness={0.35} />
        </mesh>
        <mesh position={[0.095, 0, 0]}>
          <boxGeometry args={[0.02, 0.07, 0.032]} />
          <meshStandardMaterial color="#b72d2d" roughness={0.35} />
        </mesh>
      </group>
    </>
  );
}

export function Model({
  id,
  pink = false,
  filled = false,
  over = false,
  loaded = false,
  active = false,
  volume = 0,
  dosing = false,
}: {
  id: string;
  pink?: boolean;
  filled?: boolean;
  over?: boolean;
  loaded?: boolean;
  active?: boolean;
  volume?: number;
  dosing?: boolean;
}) {
  const flaskLathe = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.02, 0),
          new THREE.Vector2(0.185, 0.015),
          new THREE.Vector2(0.19, 0.05),
          new THREE.Vector2(0.068, 0.38),
          new THREE.Vector2(0.062, 0.485),
          new THREE.Vector2(0.076, 0.5),
        ],
        20,
      ),
    [],
  );

  const bottleLabel = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 144;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#fffdf7";
    context.fillRect(0, 0, 256, 144);
    const hazard = tools.find((tool) => tool.id === id)?.hazards?.[0];
    if (hazard) {
      context.save();
      context.translate(35, 35);
      context.rotate(Math.PI / 4);
      context.strokeStyle = "#c8323b";
      context.lineWidth = 5;
      context.strokeRect(-21, -21, 42, 42);
      context.restore();
      context.strokeStyle = "#171717";
      context.fillStyle = "#171717";
      context.lineWidth = 3;
      if (hazard === "flammable") {
        context.beginPath();
        context.moveTo(35, 51);
        context.bezierCurveTo(18, 42, 31, 30, 35, 17);
        context.bezierCurveTo(40, 29, 51, 34, 43, 47);
        context.bezierCurveTo(41, 50, 38, 52, 35, 51);
        context.fill();
      }
      if (hazard === "irritant") {
        context.fillRect(32, 18, 6, 21);
        context.beginPath();
        context.arc(35, 47, 4, 0, Math.PI * 2);
        context.fill();
      }
      if (hazard === "corrosive") {
        context.beginPath();
        context.moveTo(18, 21);
        context.lineTo(34, 28);
        context.moveTo(38, 19);
        context.lineTo(51, 25);
        context.stroke();
        context.fillRect(16, 43, 36, 3);
        context.beginPath();
        context.arc(29, 35, 3, 0, Math.PI * 2);
        context.arc(43, 33, 3, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.fillStyle = "#202522";
    context.font = "700 44px sans-serif";
    context.fillText(
      (
        { naoh: "NaOH", hcl: "HCl", indicator: "PhPh", water: "H₂O" } as Record<
          string,
          string
        >
      )[id] || id,
      74,
      57,
    );
    context.font = "22px sans-serif";
    context.fillStyle = "#59615c";
    context.fillText(
      id === "indicator"
        ? "Indikator"
        : id === "water"
          ? "Deionisasi"
          : "Larutan",
      74,
      94,
    );
    if (!hazard) {
      context.fillStyle = "#d8dfda";
      context.beginPath();
      context.arc(35, 35, 8, 0, Math.PI * 2);
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [id]);

  const glass = (
    <meshPhysicalMaterial
      color="#e9fbf8"
      transmission={0.58}
      opacity={0.78}
      roughness={0.08}
      metalness={0}
      ior={1.46}
      thickness={0.08}
      transparent
      side={THREE.DoubleSide}
    />
  );
  const chrome = (
    <meshStandardMaterial color="#c5cbc7" metalness={0.85} roughness={0.16} />
  );
  const darkIron = (
    <meshStandardMaterial color="#2d3330" roughness={0.55} metalness={0.25} />
  );
  const whiteTile = (
    <meshStandardMaterial color="#fafaf8" roughness={0.22} metalness={0.04} />
  );
  const kind = tools.find((t) => t.id === id)?.kind;

  if (kind === "flask")
    return (
      <Glass>
        <mesh geometry={flaskLathe}>{glass}</mesh>
        <mesh position={[0, 0.495, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.068, 0.007, 8, 20]} />
          <meshStandardMaterial color="#d4e8e4" roughness={0.1} />
        </mesh>
        {filled && <FlaskLiquid pink={pink} over={over} />}
        <mesh position={[0, 0.28, 0.11]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
          <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
        </mesh>
        <mesh position={[0, 0.2, 0.16]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
          <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
        </mesh>
      </Glass>
    );

  if (kind === "stand")
    return (
      <group>
        {/* Base plate */}
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[0.66, 0.055, 0.46]} />
          {darkIron}
        </mesh>
        {/* White titration observation plate directly under burette */}
        <mesh position={[0.28, 0.058, 0]}>
          <boxGeometry args={[0.32, 0.006, 0.32]} />
          {whiteTile}
        </mesh>
        {/* Upright metal rod */}
        <mesh position={[-0.2, 1.05, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 2.1, 16]} />
          {chrome}
        </mesh>
        <mesh position={[-0.2, 2.1, 0]}>
          <sphereGeometry args={[0.028, 12, 8]} />
          {chrome}
        </mesh>
        {/* Bosshead / clamp holder */}
        <mesh position={[-0.2, 1.2, 0]}>
          <boxGeometry args={[0.075, 0.085, 0.075]} />
          {darkIron}
        </mesh>
        <mesh position={[-0.24, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.013, 0.013, 0.08, 8]} />
          {darkIron}
        </mesh>
        {/* Extension rod to burette */}
        <mesh position={[0.04, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.42, 10]} />
          {chrome}
        </mesh>
        {/* Dual clamp jaws wrapped around burette position (x = 0.28) */}
        <mesh position={[0.25, 1.2, 0.036]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.045, 0.018]} />
          <meshStandardMaterial color="#9c3232" />
        </mesh>
        <mesh position={[0.25, 1.2, -0.036]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.1, 0.045, 0.018]} />
          <meshStandardMaterial color="#9c3232" />
        </mesh>
        <mesh position={[0.32, 1.2, 0]}>
          <boxGeometry args={[0.035, 0.045, 0.08]} />
          {darkIron}
        </mesh>
      </group>
    );

  if (kind === "burette")
    return (
      <group>
        {/* 50 mL burette: shorter than the stand, with a narrow calibrated barrel. */}
        <mesh position={[0, 0.86, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 1.28, 20]} />
          {glass}
        </mesh>
        {/* Top reinforced rim */}
        <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.036, 0.007, 8, 24]} />
          <meshStandardMaterial color="#b9d6d1" roughness={0.1} />
        </mesh>
        <BuretteLiquidAndValve
          filled={filled}
          volume={volume}
          dosing={dosing}
          glass={glass}
        />
        {/* Fine graduation markings along the burette */}
        {Array.from({ length: 21 }, (_, i) => (
          <mesh key={i} position={[0, 0.25 + i * 0.059, 0.038]}>
            <boxGeometry args={[i % 5 === 0 ? 0.06 : 0.032, 0.004, 0.003]} />
            <meshBasicMaterial color="#263b35" />
          </mesh>
        ))}
        {/* Tapered dispensing tip */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.018, 0.007, 0.14, 10]} />
          {glass}
        </mesh>
      </group>
    );

  if (kind === "pipette")
    return (
      <group scale={0.72} position={active ? [0, 0, 0] : [0.4, 0.09, 0]} rotation={[0, 0, active ? 0 : Math.PI / 2]}>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.017, 0.009, 1.02, 16]} />
          {glass}
        </mesh>
        {loaded && (
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.007, 0.005, 0.72, 8]} />
            <meshStandardMaterial color="#9fc8c3" transparent opacity={0.82} />
          </mesh>
        )}
        {/* Central expansion bulb */}
        <mesh position={[0, 0.48, 0]} scale={[1, 2.8, 1]}>
          <sphereGeometry args={[0.06, 20, 16]} />
          {glass}
        </mesh>
        {loaded && <mesh position={[0, 0.48, 0]} scale={[1, 2.8, 1]}><sphereGeometry args={[0.047, 16, 12]} /><meshStandardMaterial color="#7ab7c8" transparent opacity={0.7} /></mesh>}
        {/* Etched mark ring */}
        <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.018, 0.003, 6, 16]} />
          <meshBasicMaterial color="#33443e" />
        </mesh>
        {/* Propipet rubber bulb at the top */}
        <mesh position={[0, 1.12, 0]} scale={[1, 1.1, 1]}>
          <sphereGeometry args={[0.105, 20, 16]} />
          <meshStandardMaterial color="#b73030" roughness={0.4} />
        </mesh>
        {([[0, 1.26, 0], [0, 0.99, 0], [0.13, 1.01, 0]] as const).map((p, i) => <group key={i} position={[...p]}><mesh rotation={[0, 0, i === 2 ? Math.PI / 2 : 0]}><cylinderGeometry args={[0.03, 0.03, 0.09, 12]} /><meshStandardMaterial color="#a02626" /></mesh><mesh position={[0, 0, 0.025]}><sphereGeometry args={[0.023, 12, 8]} /><meshStandardMaterial color="#dc7166" /></mesh></group>)}
      </group>
    );

  if (kind === "funnel")
    return (
      <group>
        {/* Wide, open mouth tapers down into the hollow stem. */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.16, 0.018, 0.2, 32, 1, true]} />
          {glass}
        </mesh>
        {/* Lower stem fitting into burette mouth */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.018, 0.012, 0.2, 16, 1, true]} />
          {glass}
        </mesh>
      </group>
    );

  if (id === "goggles")
    return (
      <group position={[0, 0.19, 0]} rotation={[-0.12, 0, 0]}>
        {/* One-piece chemical splash goggles, not ordinary spectacles. */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.58, 0.23, 0.07]} />
          <meshStandardMaterial
            color="#d8eeef"
            transparent
            opacity={0.42}
            roughness={0.12}
          />
        </mesh>
        <mesh position={[0, 0.115, 0.005]}>
          <boxGeometry args={[0.58, 0.025, 0.09]} />
          <meshStandardMaterial color="#405554" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.115, 0.005]}>
          <boxGeometry args={[0.58, 0.025, 0.09]} />
          <meshStandardMaterial color="#405554" roughness={0.45} />
        </mesh>
        <mesh position={[-0.29, 0, 0.005]}>
          <boxGeometry args={[0.025, 0.22, 0.09]} />
          <meshStandardMaterial color="#405554" roughness={0.45} />
        </mesh>
        <mesh position={[0.29, 0, 0.005]}>
          <boxGeometry args={[0.025, 0.22, 0.09]} />
          <meshStandardMaterial color="#405554" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.1, 0.05]} scale={[1.1, 0.65, 1]}>
          <torusGeometry args={[0.075, 0.018, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#405554" />
        </mesh>
        <mesh position={[-0.35, 0, -0.02]}>
          <boxGeometry args={[0.12, 0.11, 0.12]} />
          <meshStandardMaterial color="#8fb0ae" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.35, 0, -0.02]}>
          <boxGeometry args={[0.12, 0.11, 0.12]} />
          <meshStandardMaterial color="#8fb0ae" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0, 0, -0.25]} scale={[1.15, 0.65, 1]}>
          <torusGeometry args={[0.36, 0.014, 8, 30, Math.PI]} />
          <meshStandardMaterial color="#667b76" roughness={0.7} />
        </mesh>
      </group>
    );

  if (id === "coat")
    return (
      <group position={[0, 0.36, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.7, 4]} />
          <meshStandardMaterial color="#f6f5f0" roughness={0.78} />
        </mesh>
        <mesh position={[-0.29, 0.02, 0]} rotation={[0, 0, -0.16]}>
          <capsuleGeometry args={[0.07, 0.48, 7, 14]} />
          <meshStandardMaterial color="#efeee9" roughness={0.8} />
        </mesh>
        <mesh position={[0.29, 0.02, 0]} rotation={[0, 0, 0.16]}>
          <capsuleGeometry args={[0.07, 0.48, 7, 14]} />
          <meshStandardMaterial color="#efeee9" roughness={0.8} />
        </mesh>
        <mesh position={[-0.09, 0.18, 0.06]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.16, 0.28, 0.018]} />
          <meshStandardMaterial color="#deddd8" />
        </mesh>
        <mesh position={[0.09, 0.18, 0.06]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.16, 0.28, 0.018]} />
          <meshStandardMaterial color="#e8e7e2" />
        </mesh>
        <mesh position={[0, -0.05, 0.06]}>
          <boxGeometry args={[0.015, 0.46, 0.018]} />
          <meshStandardMaterial color="#aeb2ad" />
        </mesh>
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, -0.15, 0.065]}>
            <boxGeometry args={[0.12, 0.1, 0.02]} />
            <meshStandardMaterial color="#d8d8d3" />
          </mesh>
        ))}
        {[-0.12, 0, 0.12].map((y) => (
          <mesh key={y} position={[0, y - 0.02, 0.078]}>
            <sphereGeometry args={[0.012, 10, 8]} />
            <meshStandardMaterial color="#5e6661" />
          </mesh>
        ))}
      </group>
    );

  if (id === "gloves")
    return (
      <group position={[0, 0.12, 0]} rotation={[-0.18, 0, -0.25]}>
        <mesh scale={[1.1, 0.8, 0.55]}>
          <sphereGeometry args={[0.15, 18, 12]} />
          <meshStandardMaterial color="#78a7bb" />
        </mesh>
        {[-0.1, -0.035, 0.035, 0.1].map((x, i) => (
          <mesh key={x} position={[x, 0.17 + (i % 2) * 0.015, 0]}>
            <capsuleGeometry args={[0.026, 0.17, 5, 8]} />
            <meshStandardMaterial color="#78a7bb" />
          </mesh>
        ))}
        <mesh position={[-0.16, 0.06, 0]} rotation={[0, 0, -0.7]}>
          <capsuleGeometry args={[0.03, 0.14, 5, 8]} />
          <meshStandardMaterial color="#78a7bb" />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.105, 0.13, 0.18, 14]} />
          <meshStandardMaterial color="#6999ae" />
        </mesh>
      </group>
    );

  if (kind === "beaker")
    return (
      <group>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.16, 0.15, 0.36, 22, 1, true]} />
          {glass}
        </mesh>
        <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.011, 8, 24]} />
          <meshStandardMaterial color="#d4e8e4" roughness={0.1} />
        </mesh>
        {filled && <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.145, 0.14, 0.14, 24]} /><meshStandardMaterial color="#95c7d0" transparent opacity={0.65} /></mesh>}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={i} position={[0, 0.12 + i * 0.06, 0.155]}>
            <boxGeometry args={[0.04, 0.004, 0.002]} />
            <meshBasicMaterial color="#2d3f38" />
          </mesh>
        ))}
      </group>
    );

  // Bottles (NaOH, HCl, Indikator Fenolftalein, Air Deionisasi)
  if (id === "indicator")
    return (
      <group>
        {/* Amber dropper bottle */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.14, 0.15, 0.4, 20]} />
          <meshStandardMaterial color="#5c381e" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry
            args={[0.13, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#5c381e" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.1, 16]} />
          <meshStandardMaterial color="#1a1c1a" roughness={0.4} />
        </mesh>
        {/* Dropper bulb at top */}
        <mesh position={[0, 0.57, 0]}>
          <sphereGeometry args={[0.062, 14, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.22, 0.145]}>
          <planeGeometry args={[0.22, 0.14]} />
          <meshBasicMaterial
            map={bottleLabel || undefined}
            toneMapped={false}
          />
        </mesh>
      </group>
    );

  if (id === "water")
    return (
      <group>
        {/* Wash bottle with angled dispenser spout */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.15, 0.17, 0.46, 20]} />
          <meshStandardMaterial
            color="#edf4f5"
            roughness={0.35}
            transparent
            opacity={0.75}
          />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.09, 16]} />
          <meshStandardMaterial color="#2a5f78" roughness={0.45} />
        </mesh>
        {/* Curved squirt nozzle */}
        <mesh position={[0.06, 0.56, 0]} rotation={[0, 0, -0.45]}>
          <cylinderGeometry args={[0.014, 0.014, 0.18, 8]} />
          <meshStandardMaterial color="#2a5f78" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.25, 0.16]}>
          <planeGeometry args={[0.24, 0.14]} />
          <meshBasicMaterial
            map={bottleLabel || undefined}
            toneMapped={false}
          />
        </mesh>
      </group>
    );

  return (
    <group>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.42, 20]} />
        <meshStandardMaterial color="#e8e9e3" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <sphereGeometry args={[0.15, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e8e9e3" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.53, 0]} visible={!active}>
        <cylinderGeometry args={[0.085, 0.085, 0.14, 20]} />
        <meshStandardMaterial
          color={id === "naoh" ? "#b72d37" : "#27312c"}
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, 0.25, 0.171]}>
        <planeGeometry args={[0.27, 0.15]} />
        <meshBasicMaterial map={bottleLabel || undefined} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.145, 0.16, 0.11, 20]} />
        <meshStandardMaterial
          color={id === "naoh" ? "#d9e6e2" : "#e7dfd0"}
          transparent
          opacity={0.72}
        />
      </mesh>
    </group>
  );
}

type WorldSound = "clink" | "pour" | "drop";

function LiquidMotion({ kind, state, reduced }: { kind: LiquidFeedback; state: State; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pouring = useRef<THREE.Group>(null);
  const draining = useRef<THREE.Group>(null);
  const bottle = useRef<THREE.Group>(null);
  const drops = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const flask = state.objects.find(o => o.id === 'flask')?.pos || targets.flask;
  const isBottle = kind === 'rinse' || kind === 'fill';
  const isPipette = kind === 'aspirate' || kind === 'transfer';
  const target = isBottle ? targets.funnel : kind === 'aspirate'
    ? state.objects.find(o => o.id === 'hcl')?.pos || flask : flask;
  const mouth = isBottle ? (kind === 'fill' ? .32 : 0) : kind === 'aspirate' ? .52 : .5;
  const height = kind === 'dose' ? Math.max(.12, targets.burette[1] + .01 - flask[1] - mouth) : isPipette ? .28 : .48;
  useFrame((_, delta) => {
    elapsed.current += delta;
    if (bottle.current) bottle.current.rotation.z = reduced ? -2.05 : -0.2 - 1.85 * Math.min(1, elapsed.current / .3);
    if (kind === 'rinse') {
      if (pouring.current) pouring.current.visible = !reduced && elapsed.current < .75;
      if (draining.current) draining.current.visible = reduced || elapsed.current >= .75;
    }
    if (group.current && kind === 'swirl' && !reduced) {
      group.current.position.x = Math.sin(elapsed.current * 9) * .055;
      group.current.position.z = Math.cos(elapsed.current * 9) * .055;
      group.current.rotation.z = Math.sin(elapsed.current * 9) * .06;
      group.current.rotation.x = Math.cos(elapsed.current * 9) * .04;
    }
    drops.current?.children.forEach((drop, i) => {
      const phase = reduced ? i / 5 : (elapsed.current * 1.8 + i / 5) % 1;
      const easedPhase = phase * phase;
      drop.position.y = kind === 'aspirate' ? phase * height : (1 - easedPhase) * height;
      drop.scale.setScalar(.8 + Math.sin(phase * Math.PI) * .35);
    });
    if (ripple.current) {
      const r = (elapsed.current * 2.2) % 1;
      ripple.current.scale.setScalar(0.7 + r * 1.6);
      if (ripple.current.material && 'opacity' in ripple.current.material) {
        (ripple.current.material as THREE.Material).opacity = Math.max(0, 0.5 * (1 - r));
      }
    }
  });
  return <>
    {kind === 'rinse' && <group ref={draining} visible={false} position={[targets.burette[0], .87, targets.burette[2]]}>
      <Model id="waste" filled />
      <mesh position={[0, .43, 0]}><cylinderGeometry args={[.012, .018, .14, 12]} /><meshStandardMaterial color="#68aabc" transparent opacity={.7} /></mesh>
    </group>}
    <group ref={pouring} position={[target[0], target[1] + (kind === 'swirl' ? 0 : mouth), target[2]]}>
      {kind === 'swirl' ? <group ref={group}><Model id="flask" filled pink={state.volume >= 24.8} over={state.volume > 25.0} /></group> : <>
        {isBottle && <group ref={bottle} position={[0, height, 0]} rotation={[0, 0, -2.05]}><group position={[0, -.5, 0]}><Model id="naoh" active /></group></group>}
        {isPipette && <group position={[0, height, 0]}><Model id="pipette" active loaded /></group>}
        {kind === 'indicator' && <group position={[0, height + .13, 0]}><mesh><cylinderGeometry args={[.016, .008, .28, 12]} /><meshStandardMaterial color="#b9dcdf" transparent opacity={.8} /></mesh><mesh position={[0, .2, 0]}><capsuleGeometry args={[.04, .1, 6, 12]} /><meshStandardMaterial color="#353c39" /></mesh></group>}
        {(isBottle || kind === 'transfer') && <mesh position={[0, height / 2, 0]}><cylinderGeometry args={[.012, .018, height, 12]} /><meshStandardMaterial color="#68aabc" transparent opacity={.65} /></mesh>}
        <group ref={drops}>{Array.from({ length: 5 }, (_, i) => <mesh key={i} scale={[1, 1.4, 1]}><sphereGeometry args={[kind === 'dose' ? .017 : .023, 10, 8]} /><meshStandardMaterial color={kind === 'dose' && state.volume >= 24.8 ? "#f3a5bf" : "#60a8be"} transparent opacity={.85} /></mesh>)}</group>
        <mesh ref={ripple} rotation={[-Math.PI / 2, 0, 0]} position={[0, .015, 0]}><circleGeometry args={[.055, 20]} /><meshBasicMaterial color={state.volume >= 24.8 ? "#f3a5bf" : "#83c3d0"} transparent opacity={.45} side={THREE.DoubleSide} /></mesh>
      </>}
    </group></>;
}

function Item({
  obj,
  state,
  dispatch,
  select,
  selected,
  cameraMode,
  onInteract,
  onAction,
  modalOpen,
  dosing = false,
}: {
  obj: State["objects"][number];
  state: State;
  dispatch: React.Dispatch<Action>;
  select: (id: string) => void;
  selected: boolean;
  cameraMode: boolean;
  onInteract: () => void;
  onAction: (kind: WorldSound) => void;
  modalOpen?: boolean;
  dosing?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const dragging = useRef(false);
  const lastPos = useRef<[number, number, number] | null>(null);
  const itemGroup = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(obj.pos[0], obj.pos[1] + (obj.locked ? 0 : 0.28), obj.pos[2]));
  const targetPos = useMemo(() => new THREE.Vector3(...obj.pos), [obj.pos]);
  const isSpawned = useRef(false);
  const { raycaster, invalidate } = useThree();

  useEffect(() => {
    if (!isSpawned.current) {
      if (!obj.locked) {
        currentPos.current.set(obj.pos[0], obj.pos[1] + 0.28, obj.pos[2]);
      }
      isSpawned.current = true;
    }
  }, [obj.locked, obj.pos]);

  useFrame((_, delta) => {
    if (!itemGroup.current) return;
    if (dragging.current) {
      currentPos.current.copy(targetPos);
      itemGroup.current.position.copy(targetPos);
    } else {
      currentPos.current.lerp(targetPos, Math.min(1, delta * 14));
      itemGroup.current.position.copy(currentPos.current);
    }
  });
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.87),
    [],
  );
  const kind = tools.find((tool) => tool.id === obj.id)?.kind;
  const modelScale =
    kind === "stand"
      ? 1
      : kind === "burette"
        ? 1
        : kind === "pipette"
          ? 1
          : kind === "flask"
            ? 1
            : kind === "funnel"
              ? 1
              : kind === "beaker"
                ? 1
                : 1;
  const near = (id: string, p: [number, number, number], distance = 0.65) => {
    const other = state.objects.find((item) => item.id === id);
    return (
      !!other && Math.hypot(p[0] - other.pos[0], p[2] - other.pos[2]) < distance
    );
  };
  function move(e: ThreeEvent<PointerEvent>) {
    if (cameraMode || !dragging.current || obj.locked) return;
    e.stopPropagation();
    const point = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, point)) {
      let x = Math.max(-2.5, Math.min(2.5, point.x)),
        z = Math.max(-1, Math.min(1, point.z));
      if (state.step === 8 && obj.id === "flask") {
        x = Math.max(-0.68, Math.min(0.08, x));
        z = Math.max(-0.18, Math.min(0.52, z));
        dispatch({ type: "mix" });
      }
      const pos: [number, number, number] = [x, 0.87, z];
      lastPos.current = pos;
      dispatch({ type: "move", id: obj.id, pos });
      invalidate();
    }
  }
  function up(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    dragging.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    const p = lastPos.current || obj.pos;
    lastPos.current = null;
    if (state.step === 1 && ["stand", "burette"].includes(obj.id)) {
      const t = targets[obj.id];
      if (Math.hypot(p[0] - t[0], p[2] - t[2]) < 0.68) {
        onAction("clink");
        dispatch({ type: "move", id: obj.id, pos: t });
        dispatch({ type: "lock", id: obj.id });
        return;
      }
    }
    if (state.step === 2 && obj.id === "naoh" && near("burette", p)) {
      onAction("pour");
      dispatch({ type: "rinse" });
      return;
    }
    if (state.step === 3 && obj.id === "funnel" && near("burette", p)) {
      onAction("clink");
      dispatch({ type: "placeFunnel" });
      return;
    }
    if (
      state.step === 3 &&
      obj.id === "naoh" &&
      state.funnelPlaced &&
      near("burette", p)
    ) {
      onAction("pour");
      dispatch({ type: "fill" });
      return;
    }
    if (state.step === 4 && obj.id === "funnel" && !near("burette", p, 0.85)) {
      onAction("clink");
      dispatch({ type: "record" });
      return;
    }
    if (state.step === 5 && obj.id === "pipette" && near("hcl", p)) {
      onAction("pour");
      dispatch({ type: "loadPipette" });
      return;
    }
    if (
      state.step === 5 &&
      obj.id === "pipette" &&
      state.pipetteLoaded &&
      near("flask", p)
    ) {
      onAction("pour");
      dispatch({ type: "pipette" });
      return;
    }
    if (state.step === 6 && obj.id === "indicator" && near("flask", p)) {
      onAction("drop");
      dispatch({ type: "indicator" });
      return;
    }
    if (state.step === 7 && obj.id === "flask") {
      const t = targets.flask;
      if (Math.hypot(p[0] - t[0], p[2] - t[2]) < 0.68) {
        onAction("clink");
        dispatch({ type: "move", id: "flask", pos: t });
        dispatch({ type: "ready" });
        return;
      }
    }
    if (state.step === 8 && obj.id === "flask") {
      dispatch({ type: "move", id: "flask", pos: targets.flask });
      dispatch({ type: "mix" });
    }
  }
  return (
    <group
      ref={itemGroup}
      position={obj.pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
      onPointerDown={(e) => {
        if (cameraMode) return;
        e.stopPropagation();
        onInteract();
        select(obj.id);
        dragging.current = !obj.locked;
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={move}
      onPointerUp={up}
    >
      <group scale={modelScale}>
        <Model
          id={obj.id}
          filled={obj.id === 'burette' ? state.step >= 4 : obj.id === 'waste' ? state.step >= 3 : state.step >= 6}
          pink={state.indicator && state.volume >= 24.8}
          over={state.indicator && state.volume > 25.0}
          volume={state.volume}
          dosing={dosing}
          loaded={obj.id === "pipette" && state.pipetteLoaded}
        />
      </group>
      {!modalOpen && (hover || selected) && (
        <Html
          position={[
            0,
            kind === "burette"
              ? 1.46
              : kind === "stand"
                ? 2.15
                : kind === "flask"
                  ? 0.58
                  : 0.75,
            0,
          ]}
          center
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span className="object-label">
            {tools.find((t) => t.id === obj.id)?.name}
            {obj.locked ? " · terpasang" : ""}
          </span>
        </Html>
      )}
      {selected && !obj.locked && obj.id !== 'funnel' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <ringGeometry args={[0.3, 0.32, 24]} />
          <meshBasicMaterial color="#c62828" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export function Room() {
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[8, 0.15, 6]} />
        <meshStandardMaterial color="#eeeee7" />
      </mesh>
      <mesh position={[0, 1.4, -2.6]}>
        <boxGeometry args={[8, 3, 0.1]} />
        <meshStandardMaterial color="#e0e3da" />
      </mesh>
      <mesh position={[-3.8, 1.4, 0]}>
        <boxGeometry args={[0.1, 3, 5.2]} />
        <meshStandardMaterial color="#d6dcd3" />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[6.8, 0.2, 3.6]} />
        <meshStandardMaterial color="#e0d1b3" />
      </mesh>
      <mesh position={[0, 0.64, 0]}>
        <boxGeometry args={[6.8, 0.06, 3.6]} />
        <meshStandardMaterial color="#6b736a" />
      </mesh>
      {[-3, 3].flatMap((x) =>
        [-1.4, 1.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.3, z]}>
            <boxGeometry args={[0.1, 0.7, 0.1]} />
            <meshStandardMaterial color="#59665c" />
          </mesh>
        )),
      )}
      <mesh position={[1.8, 1.6, -2.48]}>
        <boxGeometry args={[2.1, 1, 0.06]} />
        <meshStandardMaterial color="#f7f9ee" />
      </mesh>
      <mesh position={[-2.9, 0.88, 1.25]}>
        <boxGeometry args={[0.55, 0.04, 0.35]} />
        <meshStandardMaterial color="#f6f4e8" />
      </mesh>
    </group>
  );
}
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(90);
    for (let i = 0; i < 30; i++) {
      values[i * 3] = (Math.random() - 0.5) * 6;
      values[i * 3 + 1] = 0.9 + Math.random() * 2;
      values[i * 3 + 2] = -1.8 + Math.random() * 3.6;
    }
    return values;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.018;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#9fb4aa"
        size={0.035}
        transparent
        opacity={0.48}
        sizeAttenuation
      />
    </points>
  );
}
function CameraReset({ resetKey }: { resetKey: number }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(6.8, 6.2, 7.8);
    camera.lookAt(0, 1.35, 0);
    if ("zoom" in camera) {
      const isNarrow = size.width < 420;
      const isMobile = size.width < 640;
      camera.zoom = isNarrow ? 58 : isMobile ? 68 : 88;
      camera.updateProjectionMatrix();
    }
    invalidate();
  }, [camera, size.width, invalidate, resetKey]);
  return null;
}

export default function Scene({
  state,
  dispatch,
  selected,
  select,
  cameraMode,
  resetKey,
  onInteract,
  onAction,
  modalOpen,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  selected: string | null;
  select: (id: string) => void;
  cameraMode: boolean;
  resetKey: number;
  onInteract: () => void;
  onAction: (kind: WorldSound) => void;
  modalOpen?: boolean;
}) {
  const previous = useRef(state);
  const [motion, setMotion] = useState<{ kind: LiquidFeedback; key: number; state: State } | null>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const kind = liquidFeedback(previous.current, state);
    if (kind) setMotion({ kind, key: performance.now(), state });
    else if (state.step < previous.current.step || state.finished) setMotion(null);
    previous.current = state;
  }, [state]);
  useEffect(() => {
    if (!motion) return;
    const timer = setTimeout(() => setMotion(null), reduced ? 650 : 1800);
    return () => clearTimeout(timer);
  }, [motion, reduced]);
  const movingId = motion && ({ rinse: 'naoh', fill: 'naoh', aspirate: 'pipette', transfer: 'pipette', indicator: '', dose: '', swirl: 'flask' }[motion.kind]);
  const snapIds =
    state.step === 1 ? ["stand", "burette"] : state.step === 7 ? ["flask"] : [];
  return (
    <Canvas
      orthographic
      camera={{ position: [6.8, 6.2, 7.8], zoom: 88 }}
      dpr={[1, 1.5]}
      frameloop="always"
      fallback={
        <p>WebGL2 tidak tersedia. Gunakan browser terbaru untuk membuka lab.</p>
      }
    >
      <CameraReset resetKey={resetKey} />
      <color attach="background" args={["#f2f3ed"]} />
      <hemisphereLight color="#ffffff" groundColor="#c8d1c8" intensity={1.8} />
      <directionalLight position={[5, 9, 5]} intensity={2.2} />
      <pointLight position={[-2, 4, 2]} intensity={1.2} color="#e8ffff" />
      <Particles />
      <Room />
      {state.mode === "latihan" &&
        snapIds.map((id) => {
          const p = targets[id];
          return (
            <mesh
              key={id}
              position={[p[0], 0.868, p[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.28, 0.3, 32]} />
              <meshBasicMaterial color="#bc5757" transparent opacity={0.6} />
            </mesh>
          );
        })}
      {motion && <LiquidMotion key={motion.key} kind={motion.kind} state={motion.state} reduced={reduced} />}
      {state.objects.filter(obj => obj.id !== movingId && !(motion?.kind === 'rinse' && obj.id === 'waste')).map((obj) => (
        <Item
          key={obj.id}
          obj={obj}
          state={state}
          dispatch={dispatch}
          selected={selected === obj.id}
          select={select}
          cameraMode={cameraMode}
          onInteract={onInteract}
          onAction={onAction}
          modalOpen={modalOpen}
          dosing={motion?.kind === 'dose' && obj.id === 'burette'}
        />
      ))}
      <OrbitControls
        makeDefault
        enableRotate={false}
        enablePan={cameraMode}
        enableZoom
        minZoom={35}
        maxZoom={220}
        target={[0, 1.35, 0]}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
        touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
    </Canvas>
  );
}
