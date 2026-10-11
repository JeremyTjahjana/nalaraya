import Link from "next/link";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import Ambient from "@/components/Ambient";
import HeroArt from "@/components/HeroArt";
import {
  BiologyIcon,
  ChemistryIcon,
  PhysicsIcon,
} from "@/components/ScienceIcons";

const modelLicense = "https://creativecommons.org/licenses/by/4.0/";
const modelCredits = [
  {
    title: "CC0 - Funnel 3",
    creator: "plaggy",
    source:
      "https://sketchfab.com/3d-models/cc0-funnel-3-9c71ecea8e0941af9f0e7b59895f7fd4",
    change: "Pratinjau corong; bentuk tidak diubah.",
  },
  {
    title: "Rubber Med Gloves (free to download)",
    creator: "KOMODOZ",
    source:
      "https://sketchfab.com/3d-models/rubber-med-gloves-free-to-download-ef128b0efbb1461c8c0f37b83b5f17af",
    change: "Tekstur pratinjau diperkecil dan data tak terpakai dibersihkan.",
  },
  {
    title: "Glasses",
    creator: "vinigor",
    source:
      "https://sketchfab.com/3d-models/glasses-c3d6459e82d647bf990ff05173d9aecb",
    change: "Tekstur pratinjau diperkecil dan data tak terpakai dibersihkan.",
  },
  {
    title: "Chemistry Glassware",
    creator: "maxdragonn",
    source:
      "https://sketchfab.com/3d-models/chemistry-glassware-b8594f7dc7e8442dbaaae7a11da4a962",
    change: "Node beker dan gelas ukur digunakan dari model yang sama.",
  },
  {
    title: "Microscope",
    creator: "VeeRuby Technologies Pvt Ltd",
    source:
      "https://sketchfab.com/3d-models/microscope-2435e338bf7541a4b919e53df50eeeea",
    change: "Skala dan posisi disesuaikan saat ditampilkan.",
  },
] as const;

export default function Home() {
  return (
    <>
      <Header />
      <main className="landing">
        <Ambient />
        <section className="hero reveal">
          <div className="hero-copy">
            <h1>
              Belajar sains
              <br />
              dengan mencoba.
            </h1>
            <div className="hero-bottom">
              <p>
                Nalaraya menghadirkan praktikum interaktif yang dapat diakses
                dari mana saja. Susun alat, lakukan percobaan, dan pahami alasan
                di balik setiap hasil.
              </p>
              <a className="text-link" href="#pelajaran">
                Lihat praktikum <span>↓</span>
              </a>
            </div>
          </div>
          <HeroArt />
        </section>
        <section id="tentang" className="about reveal delay-1">
          <div className="about-heading">
            <h2>Lebih banyak kesempatan untuk mencoba.</h2>
            <p className="about-lead">
              Alat dan waktu praktikum tidak selalu cukup untuk setiap siswa.
              Nalaraya memberi ruang untuk mengenali alat, mengulang prosedur,
              dan membaca hasil sebelum masuk ke laboratorium nyata.
            </p>
          </div>
          <div className="about-story">
            <p className="large-copy">Coba sendiri. Ulangi sampai paham.</p>
            <p>
              Simulasi ini melengkapi penjelasan guru dan praktikum fisik, bukan
              menggantikannya. Latih langkahnya di sini, lalu gunakan waktu di
              laboratorium untuk mengamati dan berdiskusi.
            </p>
            <a className="text-link" href="#pelajaran">
              Pilih praktikum <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        <section id="pelajaran" className="subjects reveal delay-2">
          <div className="section-heading">
            <div>
              <h2>Pilih mata pelajaran.</h2>
            </div>
            <p>
              Jelajahi kimia, biologi, dan fisika. Ketiganya kini tersedia untuk
              dicoba.
            </p>
          </div>
          <div className="subject-grid">
            <Link href="/kimia" className="subject-card chemistry">
              <div className="subject-mark">
                <ChemistryIcon />
              </div>
              <h3>Kimia</h3>
              <p>Titrasi asam–basa kini tersedia untuk dicoba.</p>
              <span className="card-link">Buka ruang kimia ↗</span>
            </Link>
            <Link href="/biologi" className="subject-card biology">
              <div className="subject-mark">
                <BiologyIcon />
              </div>
              <h3>Biologi</h3>
              <p>Eksplorasi sel dan sistem kehidupan.</p>
              <span className="card-link">Buka ruang biologi ↗</span>
            </Link>
            <Link href="/fisika" className="subject-card physics">
              <div className="subject-mark">
                <PhysicsIcon />
              </div>
              <h3>Fisika</h3>
              <p>Rangkaian seri dan paralel kini tersedia untuk dicoba.</p>
              <span className="card-link">Buka ruang fisika ↗</span>
            </Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-main">
          <Logo />
          <p>
            Belajar melalui percobaan.
            <br />
            Selalu gratis.
          </p>
        </div>
        <details className="footer-credits">
          <summary>Kredit model 3D</summary>
          <ul>
            {modelCredits.map(({ title, creator, source, change }) => (
              <li key={source}>
                <a href={source}>{title}</a> oleh {creator} ·{" "}
                <a href={modelLicense}>CC BY 4.0</a>
                <small>{change}</small>
              </li>
            ))}
          </ul>
        </details>
      </footer>
    </>
  );
}
