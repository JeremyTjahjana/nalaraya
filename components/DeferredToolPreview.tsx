"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ToolPreview = dynamic(() => import("./ToolPreview"), {
  ssr: false,
  loading: () => (
    <div className="equipment-viewer deferred-preview" role="status">
      Menyiapkan model...
    </div>
  ),
});

export default function DeferredToolPreview({ id }: { id: string }) {
  const placeholder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    if (placeholder.current) observer.observe(placeholder.current);
    return () => observer.disconnect();
  }, [visible]);

  return visible ? (
    <ToolPreview key={id} id={id} controls />
  ) : (
    <div ref={placeholder} className="equipment-viewer deferred-preview">
      Model 3D akan ditampilkan saat bagian ini terlihat.
    </div>
  );
}
