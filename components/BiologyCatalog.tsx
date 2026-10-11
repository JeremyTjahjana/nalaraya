"use client";
import Link from "next/link";
import { useState } from "react";
import { BiologyIcon } from "./ScienceIcons";
const experiments = [
  {
    name: "Pengenalan alat praktikum biologi",
    category: "Dasar biologi",
    description: "Kenali alat pengamatan, pengukuran, dan penanganan sampel.",
    href: "/biologi/pengenalan-lab",
  },
  {
    name: "Pengamatan epidermis bawang merah",
    category: "Sel dan jaringan",
    description:
      "Siapkan preparat, atur fokus mikroskop, dan tandai struktur sel yang kamu amati.",
    href: "/biologi/epidermis-bawang",
  },
  {
    name: "Fotosintesis pada daun",
    category: "Fisiologi",
    description: "Selidiki hubungan cahaya dan pembentukan amilum pada daun.",
  },
  {
    name: "Respirasi ragi",
    category: "Bioproses",
    description: "Amati gas yang terbentuk selama fermentasi gula oleh ragi.",
  },
  {
    name: "Enzim katalase",
    category: "Bioproses",
    description: "Bandingkan aktivitas enzim pada kondisi yang berbeda.",
  },
];
export default function BiologyCatalog() {
  const [filter, setFilter] = useState("Semua");
  return (
    <section className="catalog">
      <div className="catalog-heading">
        <h2>Praktikum</h2>
        <p>Amati kehidupan, mulai dari sel.</p>
      </div>
      <div className="catalog-filters" aria-label="Filter praktikum biologi">
        {[
          "Semua",
          "Dasar biologi",
          "Sel dan jaringan",
          "Fisiologi",
          "Bioproses",
        ].map((x) => (
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
        {experiments
          .filter((x) => filter === "Semua" || x.category === filter)
          .map((x) => {
            const content = (
              <>
                <div className="experiment-card-top">{x.category}</div>
                <span className="bio-hex">
                  <BiologyIcon />
                </span>
                <h3>{x.name}</h3>
                <p>{x.description}</p>
                <span className="catalog-status">
                  {x.href ? "Mulai praktikum ↗" : "Segera hadir"}
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
