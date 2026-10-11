"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function useLabLandscape() {
  const [landscape, setLandscape] = useState(false);

  useEffect(() => {
    const orientation = window.matchMedia("(orientation: landscape)");
    const update = () => setLandscape(orientation.matches);
    update();
    orientation.addEventListener("change", update);
    return () => orientation.removeEventListener("change", update);
  }, []);

  return landscape;
}

export default function LabOrientationGate({ backHref }: { backHref: string }) {
  return (
    <main className="lab-orientation-gate">
      <div className="lab-orientation-content">
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <rect x="26" y="9" width="28" height="48" rx="5" />
          <path d="M62 31a27 27 0 0 1-14 34m1-9-1 9 9-1" />
        </svg>
        <h1>Putar perangkat ke landscape.</h1>
        <p>
          Ruang praktikum memerlukan bidang kerja mendatar agar alat dan kontrol
          dapat digunakan dengan tepat.
        </p>
        <Link href={backHref}>Kembali ke halaman praktikum</Link>
      </div>
    </main>
  );
}
