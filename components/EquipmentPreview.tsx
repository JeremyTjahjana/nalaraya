"use client";

import { useMemo } from "react";
import { DoubleSide, Vector2 } from "three";
import type { EquipmentId } from "@/lib/introduction";

type Position = [number, number, number];
const glass = "#b8dce3",
  metal = "#8eaaa9",
  rubber = "#ab343d";
function Part({
  at = [0, 0, 0],
  size,
  color = metal,
  rotate = [0, 0, 0],
  round = false,
}: {
  at?: Position;
  size: Position;
  color?: string;
  rotate?: Position;
  round?: boolean;
}) {
  return (
    <mesh position={at} rotation={rotate} scale={size}>
      {round ? (
        <sphereGeometry args={[1, 24, 16]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial color={color} roughness={0.38} />
    </mesh>
  );
}
function Rod({
  at = [0, 0, 0],
  radius = 0.025,
  height = 1,
  color = metal,
  rotate = [0, 0, 0],
}: {
  at?: Position;
  radius?: number;
  height?: number;
  color?: string;
  rotate?: Position;
}) {
  return (
    <mesh position={at} rotation={rotate}>
      <cylinderGeometry args={[radius, radius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.28} />
    </mesh>
  );
}
function Ring({
  at,
  radius,
  tube = 0.014,
  color = metal,
}: {
  at: Position;
  radius: number;
  tube?: number;
  color?: string;
}) {
  return (
    <mesh position={at} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, 8, 40]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function Vessel({
  profile,
  color = glass,
  opaque = false,
}: {
  profile: [number, number][];
  color?: string;
  opaque?: boolean;
}) {
  const points = useMemo(
    () => profile.map(([r, y]) => new Vector2(r, y)),
    [profile],
  );
  return (
    <mesh>
      <latheGeometry args={[points, 40]} />
      <meshStandardMaterial
        color={color}
        side={DoubleSide}
        transparent={!opaque}
        opacity={opaque ? 1 : 0.65}
        roughness={0.2}
        depthWrite={opaque}
      />
    </mesh>
  );
}
function Marks({
  radius,
  from,
  count,
  step,
}: {
  radius: number;
  from: number;
  count: number;
  step: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Part
          key={i}
          at={[0, from + i * step, radius + 0.005]}
          size={[i % 5 === 0 ? 0.11 : 0.06, 0.009, 0.006]}
          color="#34575c"
        />
      ))}
    </>
  );
}
function Tube() {
  return (
    <>
      <Vessel
        profile={[
          [0, 0],
          [0.055, 0.013],
          [0.09, 0.055],
          [0.1, 0.11],
          [0.1, 0.85],
          [0.088, 0.85],
          [0.088, 0.12],
          [0.07, 0.065],
          [0, 0.02],
        ]}
      />
      <Ring at={[0, 0.85, 0]} radius={0.096} color={glass} />
    </>
  );
}

export function EquipmentModel({ id }: { id: EquipmentId }) {
  switch (id) {
    case "goggles":
      return (
        <group>
          <Part size={[1, 0.42, 0.055]} color={glass} />
          {[-1, 1].map((side) => (
            <group key={side}>
              <Part
                at={[side * 0.51, 0, -0.08]}
                size={[0.045, 0.46, 0.25]}
                color="#456a6d"
              />
              <Part
                at={[side * 0.35, 0, -0.14]}
                size={[0.28, 0.36, 0.2]}
                color={glass}
              />
            </group>
          ))}
          {[-1, 1].map((side) => (
            <Part
              key={side}
              at={[0, side * 0.225, 0]}
              size={[1.03, 0.045, 0.11]}
              color="#456a6d"
            />
          ))}
          <mesh
            position={[0, 0, -0.21]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, 0.62, 1]}
          >
            <torusGeometry args={[0.48, 0.03, 8, 48]} />
            <meshStandardMaterial color="#334e50" />
          </mesh>
          <Part
            at={[0, -0.18, 0.04]}
            size={[0.1, 0.07, 0.07]}
            color="#456a6d"
            round
          />
        </group>
      );
    case "coat":
      return (
        <group position={[0, 0.02, 0]}>
          <Part at={[0, -0.08, 0]} size={[0.72, 1.08, 0.24]} color="#f1f3f2" />
          <Part at={[0, -0.53, 0]} size={[0.84, 0.32, 0.27]} color="#f1f3f2" />
          {[-1, 1].map((side) => (
            <group key={side}>
              <Rod
                at={[side * 0.52, 0.02, 0]}
                height={0.92}
                radius={0.13}
                color="#e9edeb"
                rotate={[0, 0, side * 0.18]}
              />
              <Part
                at={[side * 0.6, -0.42, 0]}
                size={[0.28, 0.1, 0.28]}
                color="#d9dfdc"
              />
              <Part
                at={[side * 0.24, 0.42, 0.145]}
                size={[0.28, 0.34, 0.035]}
                color="#e2e7e4"
                rotate={[0, 0, side * 0.52]}
              />
              <Part
                at={[side * 0.23, -0.29, 0.145]}
                size={[0.3, 0.23, 0.035]}
                color="#e3e8e5"
              />
            </group>
          ))}
          <mesh position={[0, 0.54, 0]}>
            <cylinderGeometry args={[0.19, 0.22, 0.12, 24]} />
            <meshStandardMaterial color="#dfe5e2" roughness={0.45} />
          </mesh>
          <Part
            at={[0, -0.12, 0.145]}
            size={[0.018, 0.86, 0.025]}
            color="#b6c1bc"
          />
          {[0.24, 0.05, -0.14, -0.33].map((y) => (
            <Part
              key={y}
              at={[0.055, y, 0.17]}
              size={[0.025, 0.025, 0.025]}
              color="#71817b"
              round
            />
          ))}
        </group>
      );
    case "gloves":
      return (
        <group rotation={[0, 0, -0.1]}>
          {[-1, 1].map((side) => (
            <group
              key={side}
              position={[side * 0.27, 0, 0]}
              rotation={[0, 0, side * -0.12]}
            >
              <Part size={[0.35, 0.4, 0.09]} color="#86b4cc" round />
              {[0, 1, 2, 3].map((i) => (
                <mesh
                  key={i}
                  position={[
                    -0.12 + i * 0.078,
                    0.28 - (i === 3 ? 0.045 : 0),
                    0,
                  ]}
                >
                  <capsuleGeometry
                    args={[0.037, 0.24 - (i === 3 ? 0.07 : 0), 6, 12]}
                  />
                  <meshStandardMaterial color="#86b4cc" />
                </mesh>
              ))}
              <Part
                at={[-0.22, 0.03, 0]}
                size={[0.065, 0.18, 0.045]}
                color="#86b4cc"
                rotate={[0, 0, -0.6]}
                round
              />
              <Part
                at={[0, -0.24, 0]}
                size={[0.26, 0.15, 0.085]}
                color="#749cb4"
              />
            </group>
          ))}
        </group>
      );
    case "stand":
      return (
        <group>
          <Part at={[0, 0, 0]} size={[0.85, 0.06, 0.6]} color="#425758" />
          <Rod at={[-0.28, 0.85, 0]} height={1.7} />
          <Part at={[-0.28, 1.1, 0]} size={[0.09, 0.11, 0.1]} color="#344a4d" />
          <Rod
            at={[0.02, 1.1, 0]}
            height={0.6}
            radius={0.018}
            rotate={[0, 0, Math.PI / 2]}
          />
          <Ring at={[0.33, 1.1, 0]} radius={0.08} tube={0.02} color={rubber} />
          <Part
            at={[-0.32, 1.1, 0.1]}
            size={[0.13, 0.03, 0.06]}
            color="#344a4d"
          />
        </group>
      );
    case "burette":
      return (
        <group>
          <Vessel
            profile={[
              [0.015, 0],
              [0.025, 0.16],
              [0.046, 0.22],
              [0.046, 1.7],
              [0.034, 1.7],
              [0.034, 0.22],
              [0.008, 0.16],
            ]}
          />
          <Ring at={[0, 1.7, 0]} radius={0.043} color={glass} />
          <Marks radius={0.046} from={0.32} count={24} step={0.055} />
          <Rod
            at={[0.04, 0.2, 0]}
            height={0.2}
            radius={0.025}
            color={rubber}
            rotate={[0, 0, Math.PI / 2]}
          />
          <Part
            at={[0.14, 0.2, 0]}
            size={[0.035, 0.11, 0.055]}
            color={rubber}
          />
        </group>
      );
    case "flask":
      return (
        <group>
          <Vessel
            profile={[
              [0, 0],
              [0.3, 0],
              [0.31, 0.04],
              [0.1, 0.56],
              [0.1, 0.78],
              [0.087, 0.78],
              [0.087, 0.56],
              [0.29, 0.04],
              [0, 0.025],
            ]}
          />
          <Ring at={[0, 0.78, 0]} radius={0.096} color={glass} />
          <Marks radius={0.23} from={0.17} count={3} step={0.08} />
        </group>
      );
    case "beaker":
      return (
        <group>
          <Vessel
            profile={[
              [0, 0],
              [0.32, 0],
              [0.32, 0.66],
              [0.3, 0.66],
              [0.3, 0.025],
              [0, 0.025],
            ]}
          />
          <Ring at={[0, 0.66, 0]} radius={0.31} color={glass} />
          <Part
            at={[0.32, 0.65, 0]}
            size={[0.1, 0.025, 0.07]}
            color={glass}
            rotate={[0, 0, 0.3]}
          />
          <Marks radius={0.32} from={0.12} count={6} step={0.08} />
        </group>
      );
    case "cylinder":
      return (
        <group>
          <mesh position={[0, 0.035, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.07, 6]} />
            <meshStandardMaterial color="#607f85" />
          </mesh>
          <Vessel
            profile={[
              [0, 0.07],
              [0.11, 0.07],
              [0.11, 1.24],
              [0.096, 1.24],
              [0.096, 0.09],
              [0, 0.09],
            ]}
          />
          <Ring at={[0, 1.24, 0]} radius={0.104} color={glass} />
          <Part at={[0.11, 1.24, 0]} size={[0.055, 0.02, 0.04]} color={glass} />
          <Marks radius={0.11} from={0.2} count={17} step={0.055} />
        </group>
      );
    case "volumetric":
      return (
        <group>
          <Vessel
            profile={[
              [0, 0],
              [0.19, 0],
              [0.29, 0.15],
              [0.3, 0.28],
              [0.24, 0.43],
              [0.07, 0.59],
              [0.07, 1.05],
              [0.056, 1.05],
              [0.056, 0.59],
              [0.22, 0.43],
              [0.28, 0.28],
              [0.27, 0.15],
              [0.17, 0.025],
              [0, 0.025],
            ]}
          />
          <Ring at={[0, 0.86, 0]} radius={0.071} tube={0.006} color={rubber} />
          <mesh position={[0, 1.08, 0]}>
            <cylinderGeometry args={[0.085, 0.06, 0.1, 20]} />
            <meshStandardMaterial color="#e4eef1" />
          </mesh>
        </group>
      );
    case "pipette":
      return (
        <group rotation={[0, 0, -0.15]}>
          <Vessel
            profile={[
              [0.009, 0],
              [0.02, 0.12],
              [0.02, 0.5],
              [0.065, 0.59],
              [0.065, 0.78],
              [0.02, 0.88],
              [0.02, 1.35],
            ]}
          />
          <Ring at={[0, 1.1, 0]} radius={0.021} tube={0.004} color={rubber} />
        </group>
      );
    case "dropper":
      return (
        <group rotation={[0, 0, -0.2]}>
          <Vessel
            profile={[
              [0.006, 0],
              [0.027, 0.12],
              [0.027, 0.66],
            ]}
          />
          <mesh position={[0, 0.77, 0]}>
            <capsuleGeometry args={[0.065, 0.18, 8, 20]} />
            <meshStandardMaterial color={rubber} />
          </mesh>
        </group>
      );
    case "propipette":
      return (
        <group>
          <Part
            at={[0, 0.24, 0]}
            size={[0.24, 0.25, 0.22]}
            color={rubber}
            round
          />
          <Rod at={[0, -0.07, 0]} radius={0.04} height={0.26} color={rubber} />
          <Rod at={[0, 0.52, 0]} radius={0.045} height={0.12} color={rubber} />
          <Rod
            at={[0.2, 0.01, 0]}
            radius={0.04}
            height={0.24}
            color={rubber}
            rotate={[0, 0, Math.PI / 2]}
          />
          <Part
            at={[0.3, 0.01, 0]}
            size={[0.06, 0.07, 0.07]}
            color="#732b32"
            round
          />
        </group>
      );
    case "tube":
      return <Tube />;
    case "rack":
      return (
        <group>
          <Part at={[0, 0, 0]} size={[1.25, 0.07, 0.45]} color="#c2986d" />
          {[-0.59, 0.59].map((x) => (
            <Part
              key={x}
              at={[x, 0.25, 0]}
              size={[0.05, 0.5, 0.45]}
              color="#c2986d"
            />
          ))}
          {[-0.2, 0.2].map((z) => (
            <Part
              key={z}
              at={[0, 0.5, z]}
              size={[1.25, 0.04, 0.06]}
              color="#c2986d"
            />
          ))}
          {[-0.5, -0.25, 0, 0.25, 0.5].map((x) => (
            <group key={x}>
              <Ring
                at={[x, 0.5, 0]}
                radius={0.102}
                tube={0.028}
                color="#c2986d"
              />
              <group position={[x, 0.04, 0]} scale={0.78}>
                <Tube />
              </group>
            </group>
          ))}
        </group>
      );
    case "holder":
      return (
        <group rotation={[0, 0, -0.35]}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <Part
                at={[side * 0.065, 0, 0]}
                size={[0.08, 0.85, 0.08]}
                color="#c4a477"
                rotate={[0, 0, side * 0.08]}
              />
              <Part
                at={[side * 0.055, 0.44, 0]}
                size={[0.06, 0.08, 0.1]}
                color="#ae8859"
              />
            </group>
          ))}
          <Rod
            at={[0, -0.12, 0]}
            height={0.22}
            radius={0.025}
            rotate={[0, 0, Math.PI / 2]}
          />
        </group>
      );
    case "funnel":
      return (
        <group>
          <Vessel
            profile={[
              [0.025, 0],
              [0.025, 0.36],
              [0.31, 0.72],
              [0.3, 0.735],
              [0.014, 0.37],
              [0.014, 0],
            ]}
          />
          <Ring at={[0, 0.735, 0]} radius={0.305} color={glass} />
        </group>
      );
    case "rod":
      return (
        <group rotation={[0, 0, -0.3]}>
          <mesh>
            <capsuleGeometry args={[0.025, 1.25, 6, 20]} />
            <meshStandardMaterial color={glass} roughness={0.15} />
          </mesh>
        </group>
      );
    case "spatula":
      return (
        <group rotation={[0, 0, -0.3]}>
          <Rod height={0.95} radius={0.018} />
          <Part at={[0, 0.55, 0]} size={[0.12, 0.28, 0.015]} />
          <mesh position={[0, -0.57, 0]} scale={[0.08, 0.14, 0.035]}>
            <sphereGeometry
              args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color={metal} side={DoubleSide} />
          </mesh>
        </group>
      );
    case "mortar":
      return (
        <group>
          <Vessel
            opaque
            color="#e4e7ea"
            profile={[
              [0, 0],
              [0.24, 0],
              [0.36, 0.14],
              [0.42, 0.42],
              [0.35, 0.42],
              [0.29, 0.17],
              [0, 0.1],
            ]}
          />
          <mesh position={[0.11, 0.45, 0]} rotation={[0, 0, -0.55]}>
            <capsuleGeometry args={[0.075, 0.63, 8, 24]} />
            <meshStandardMaterial color="#c4ced5" />
          </mesh>
          <Ring at={[0, 0.42, 0]} radius={0.385} tube={0.034} color="#e4e7ea" />
        </group>
      );
    case "burner":
      return (
        <group>
          <Vessel
            profile={[
              [0, 0],
              [0.29, 0],
              [0.32, 0.07],
              [0.29, 0.27],
              [0.12, 0.36],
              [0.12, 0.4],
            ]}
          />
          <Rod at={[0, 0.41, 0]} radius={0.13} height={0.07} />
          <Rod at={[0, 0.49, 0]} radius={0.025} height={0.13} color="#d7c6a4" />
          <group position={[0.43, 0, 0]}>
            <Vessel
              opaque
              color={metal}
              profile={[
                [0.13, 0],
                [0.13, 0.19],
                [0.07, 0.24],
                [0, 0.24],
              ]}
            />
          </group>
        </group>
      );
  }
}
