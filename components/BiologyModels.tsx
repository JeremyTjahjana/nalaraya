"use client";
import { Clone, useGLTF } from "@react-three/drei";
import { Component, type ReactNode, Suspense, useMemo } from "react";
import { Box3, Vector3 } from "three";
import { getPreviewAsset } from "@/lib/previewModels";
import { Model } from "./Scene";
function Part({
  pos = [0, 0, 0],
  size,
  color = "#dfe7e5",
  rotation = [0, 0, 0],
}: {
  pos?: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={pos} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
}
export function MicroscopeFallback() {
  return (
    <group>
      <Part pos={[0, 0.06, 0]} size={[0.85, 0.12, 0.65]} />
      <Part pos={[0, 0.65, -0.25]} size={[0.16, 1.2, 0.16]} />
      <Part pos={[0, 0.62, 0]} size={[0.7, 0.06, 0.48]} color="#303a37" />
      <Part
        pos={[0, 1.2, -0.1]}
        size={[0.16, 0.5, 0.16]}
        rotation={[0.3, 0, 0]}
      />
      <mesh position={[0, 0.97, 0.05]}>
        <cylinderGeometry args={[0.07, 0.055, 0.25, 20]} />
        <meshStandardMaterial color="#596663" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.6, -0.25]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 20]} />
        <meshStandardMaterial color="#25332e" />
      </mesh>
    </group>
  );
}
class AssetBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <MicroscopeFallback /> : this.props.children;
  }
}
function MicroscopeAsset() {
  const { scene } = useGLTF(getPreviewAsset("microscope")!.path);
  const { scale, offset } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene),
      size = box.getSize(new Vector3()),
      center = box.getCenter(new Vector3());
    return {
      scale: 1.65 / size.y,
      offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
    };
  }, [scene]);
  return (
    <group scale={scale}>
      <group position={offset}>
        <Clone object={scene} />
      </group>
    </group>
  );
}
export function Microscope() {
  return (
    <AssetBoundary>
      <Suspense fallback={<MicroscopeFallback />}>
        <MicroscopeAsset />
      </Suspense>
    </AssetBoundary>
  );
}
export function BiologyModel({ id }: { id: string }) {
  if (id === "microscope") return <Microscope />;
  if (["water", "goggles", "gloves", "coat"].includes(id))
    return <Model id={id} />;
  if (id === "slide" || id === "coverslip")
    return (
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry
          args={id === "slide" ? [0.8, 0.025, 0.3] : [0.28, 0.012, 0.28]}
        />
        <meshStandardMaterial
          color="#d4eff4"
          transparent
          opacity={0.68}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
    );
  if (id === "forceps")
    return (
      <group>
        {[-1, 1].map((s) => (
          <Part
            key={s}
            pos={[s * 0.032, 0.025, 0]}
            size={[0.018, 0.025, 0.55]}
            rotation={[0, s * 0.1, 0]}
            color="#9bacb0"
          />
        ))}
      </group>
    );
  if (id === "tissue")
    return <Part pos={[0, 0.015, 0]} size={[0.45, 0.03, 0.35]} color="#fff" />;
  if (id === "onion")
    return (
      <group>
        <mesh position={[0, 0.14, 0]} scale={[1, 0.72, 1]}>
          <sphereGeometry args={[0.25, 24, 16]} />
          <meshStandardMaterial color="#9e5266" roughness={0.75} />
        </mesh>
        {[0.18, 0.14, 0.1, 0.06].map((r, i) => (
          <mesh
            key={r}
            position={[0, 0.275, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[r - 0.015, r, 28]} />
            <meshStandardMaterial color={i % 2 ? "#a7657a" : "#efcbd8"} />
          </mesh>
        ))}
      </group>
    );
  if (id === "epidermis")
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.22, 0.18, 3, 3]} />
        <meshStandardMaterial
          color="#d89baf"
          transparent
          opacity={0.72}
          side={2}
        />
      </mesh>
    );
  if (id === "lugol")
    return (
      <group>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.12, 0.13, 0.32, 20]} />
          <meshStandardMaterial color="#76501f" transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.12, 16]} />
          <meshStandardMaterial color="#252321" />
        </mesh>
        <Part
          pos={[0, 0.19, 0.124]}
          size={[0.17, 0.15, 0.008]}
          color="#fff6de"
        />
      </group>
    );
  return null;
}
