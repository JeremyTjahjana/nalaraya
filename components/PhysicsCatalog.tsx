"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhysicsIcon } from "./ScienceIcons";
import { readPhysicsIntroCompletion } from "@/lib/physicsIntro";
import { readPhysicsCircuitsCompletion } from "@/lib/circuits";

const experiments = [
  {
    name: "Pengenalan alat praktikum fisika",
    category: "Dasar fisika",
    description:
      "Kenali sumber tegangan, project board, LED, kawat jumper, dan sakelar sebelum merangkai.",
    href: "/fisika/pengenalan-lab",
  },
  {
    name: "Rangkaian seri dan paralel",
    category: "Kelistrikan",
    description:
      "Rangkai LED secara seri dan paralel, tutup sakelar, lalu hitung hambatan dan arus dengan hukum Ohm.",
    href: "/fisika/rangkaian-seri-paralel",
  },
  {
    name: "Pengukuran dengan jangka sorong",
    category: "Pengukuran",
    description: "Baca skala utama dan skala nonius untuk menentukan panjang benda.",
  },
  {
    name: "Hukum gerak Newton",
    category: "Mekanika",
    description: "Amati hubungan gaya, massa, dan percepatan pada bidang datar.",
  },
  {
    name: "Pemantulan dan pembiasan cahaya",
    category: "Optika",
    description: "Selidiki arah sinar saat memantul dan menembus medium berbeda.",
  },
];

const filters = [
  "Semua",
  "Dasar fisika",
  "Kelistrikan",
  "Pengukuran",
  "Mekanika",
  "Optika",
];

export default function PhysicsCatalog() {
  const [filter, setFilter] = useState("Semua");
  const [introPassed, setIntroPassed] = useState(false);
  const [circuitDone, setCircuitDone] = useState(false);

  useEffect(() => {
    try {
      setIntroPassed(readPhysicsIntroCompletion(window.localStorage));
    } catch {
      /* Storage can be disabled by browser privacy settings. */
    }
    try {
      setCircuitDone(readPhysicsCircuitsCompletion(window.localStorage));
    } catch {
      /* Storage can be disabled by browser privacy settings. */
    }
  }, []);

  const shown =
    filter === "Semua"
      ? experiments
      : experiments.filter((x) => x.category === filter);

  return (
    <section className="catalog">
      <div className="catalog-heading">
        <h2>Praktikum</h2>
        <p>Mulai dari mengenal alat, lalu rangkai dan ukur sendiri.</p>
      </div>
      <div className="catalog-filters" aria-label="Filter praktikum fisika">
        {filters.map((x) => (
          <button
            key={x}
            aria-pressed={filter === x}
            className={filter === x ? "active" : ""}
            onClick={() => setFilter(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="experiment-grid">
        {shown.map((x) => {
          const isIntro = x.href === "/fisika/pengenalan-lab";
          const isCircuit = x.href === "/fisika/rangkaian-seri-paralel";
          const done = (isIntro && introPassed) || (isCircuit && circuitDone);
          const baseStatus = x.href ? "Mulai praktikum ↗" : "Segera hadir";
          const displayStatus = isIntro && introPassed
            ? "✓ Lulus"
            : isCircuit && circuitDone
              ? "✓ Selesai"
              : baseStatus;
          const content = (
            <>
              <div className="experiment-card-top">{x.category}</div>
              <span className="phys-hex">
                <PhysicsIcon />
              </span>
              <h3>{x.name}</h3>
              <p>{x.description}</p>
              <span
                className={`catalog-status${done ? " status-passed" : ""}`}
              >
                {displayStatus}
              </span>
            </>
          );
          return x.href ? (
            <Link
              className="catalog-card available"
              key={x.name}
              href={x.href}
            >
              {content}
            </Link>
          ) : (
            <article
              className="catalog-card"
              key={x.name}
              aria-disabled="true"
            >
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
