'use client';
// Inventory mini-preview for the circuit components. Mirrors the SHAPE of ToolPreview.tsx
// (tiny fixed-camera Canvas, role="img"/aria-label, text WebGL fallback, error boundary) but
// renders CircuitModels primitives by id. It does NOT import lib/previewModels.ts and never
// uses useGLTF — the caller imports it via next/dynamic({ ssr:false }).
import { Bounds, Center, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Component, ReactNode } from 'react';
import { CircuitComponentModel } from './CircuitModels';

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

export default function CircuitToolPreview({ id }: { id: string }) {
  const fallback = <p>Model 3D tidak tersedia. Baca ciri komponen pada materi.</p>;
  return (
    <div className="tool-preview-viewer">
      <div className="equipment-canvas" role="img" aria-label={`Model 3D ${id}`}>
        <PreviewBoundary fallback={fallback}>
          <Canvas
            key={id}
            orthographic
            dpr={[1, 1.5]}
            frameloop="demand"
            camera={{ position: [2.2, 1.8, 2.6], zoom: 140 }}
            fallback={fallback}
          >
            <ambientLight intensity={1.8} />
            <directionalLight position={[3, 5, 4]} intensity={2.4} />
            <directionalLight position={[-3, 2, -1]} intensity={1.1} />
            <Bounds fit clip observe margin={1.3}>
              <Center cacheKey={id}>
                {/* Preview the switch closed and the LED lit so the inventory icon reads clearly. */}
                <CircuitComponentModel id={id} brightness={1} on reduced />
              </Center>
            </Bounds>
            <OrbitControls makeDefault enablePan={false} enableZoom={false} enableRotate={false} />
          </Canvas>
        </PreviewBoundary>
      </div>
    </div>
  );
}
