"use client";

import { Bounds, Center, Clone, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, ReactNode, Suspense, useEffect, useState } from "react";
import type { Object3D } from "three";
import { equipment, type EquipmentId } from "@/lib/introduction";
import { getPreviewAsset, type PreviewAsset } from "@/lib/previewModels";
import { EquipmentModel } from "./EquipmentPreview";
import { Model } from "./Scene";
import { BiologyModel, MicroscopeFallback } from "./BiologyModels";
import { epidermisTools } from "@/lib/epidermis";

const equipmentIds = new Set<string>(equipment.map((item) => item.id));

function GeometryFallback({ id }: { id: string }) {
  if (id === 'pipette') return <Model id="pipette" active/>;
  if (id === 'microscope') return <MicroscopeFallback/>;
  const biologyTool = epidermisTools.find((item) => item.id === id);
  if (biologyTool && !['goggles', 'coat', 'gloves', 'waste'].includes(id)) {
    return <BiologyModel id={id} />;
  }
  return equipmentIds.has(id) ? (
    <EquipmentModel id={id as EquipmentId} />
  ) : (
    <Model id={id} />
  );
}

function GltfModel({ asset }: { asset: PreviewAsset }) {
  const { nodes, scene } = useGLTF(asset.path);
  const object = (asset.node ? nodes[asset.node] : scene) as Object3D | undefined;
  if (!object) throw new Error(`Node ${asset.node} tidak ditemukan di ${asset.path}`);
  return (
    <group rotation={asset.rotation}>
      <Clone object={object} />
    </group>
  );
}

class PreviewBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function PreviewObject({ id }: { id: string }) {
  const asset = getPreviewAsset(id);
  const fallback = <GeometryFallback id={id} />;
  if (!asset) return fallback;
  return (
    <PreviewBoundary fallback={fallback}>
      <GltfModel asset={asset} />
    </PreviewBoundary>
  );
}

export default function ToolPreview({
  id,
  controls = false,
}: {
  id: string;
  controls?: boolean;
}) {
  const [angle, setAngle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className={controls ? "equipment-viewer" : "tool-preview-viewer"}>
      <div className="equipment-canvas" role="img" aria-label={`Model 3D ${id}`}>
        <Canvas
          key={id}
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={{ position: [2, 1.3, 3], fov: 38 }}
          fallback={<p>WebGL tidak tersedia. Baca ciri alat pada materi.</p>}
        >
          <ambientLight intensity={2.1} />
          <directionalLight position={[3, 5, 4]} intensity={2.7} />
          <directionalLight position={[-3, 2, -1]} intensity={1.2} />
          <Suspense
            fallback={
              <Bounds fit clip observe margin={1.25}>
                <Center>
                  <GeometryFallback id={id} />
                </Center>
              </Bounds>
            }
          >
            <Bounds fit clip observe margin={1.25}>
              <Center>
                <group rotation={[0, angle, 0]}>
                  <PreviewObject id={id} />
                </group>
              </Center>
            </Bounds>
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={false}
            autoRotate={!controls && !reducedMotion}
            autoRotateSpeed={1.25}
          />
        </Canvas>
      </div>
      {controls && (
        <div className="model-controls">
          <button
            type="button"
            aria-label="Putar alat ke kiri"
            onClick={() => setAngle((value) => value - Math.PI / 6)}
          >
            Putar kiri
          </button>
          <span>Seret untuk memutar</span>
          <button
            type="button"
            aria-label="Putar alat ke kanan"
            onClick={() => setAngle((value) => value + Math.PI / 6)}
          >
            Putar kanan
          </button>
        </div>
      )}
    </div>
  );
}
