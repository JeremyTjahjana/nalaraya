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
              Alat dan waktu praktikum tidak selalu cukup untuk setiap siswa. Nalaraya memberi ruang
              untuk mengenali alat, mengulang prosedur, dan membaca hasil sebelum masuk ke laboratorium nyata.
            </p>
          </div>
          <div className="about-story">
            <p className="large-copy">Coba sendiri. Ulangi sampai paham.</p>
            <p>
              Simulasi ini melengkapi penjelasan guru dan praktikum fisik, bukan menggantikannya.
              Latih langkahnya di sini, lalu gunakan waktu di laboratorium untuk mengamati dan berdiskusi.
            </p>
            <a className="text-link" href="#pelajaran">Pilih praktikum <span aria-hidden="true">↗</span></a>
          </div>
        </section>
        <section id="pelajaran" className="subjects reveal delay-2">
          <div className="section-heading">
            <div>
              <h2>Pilih mata pelajaran.</h2>
            </div>
            <p>
              Jelajahi kimia dan biologi. Ruang fisika sedang kami siapkan.
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
            <article className="subject-card physics" aria-disabled="true">
              <div className="subject-mark">
                <PhysicsIcon />
              </div>
              <h3>Fisika</h3>
              <p>Amati gerak, gaya, dan energi.</p>
              <span className="card-link">Segera hadir</span>
            </article>
          </div>
        </section>
      </main>
      <footer>
        <Logo />
        <span>Belajar melalui percobaan.</span>
        <span>Laboratorium virtual untuk pelajar Indonesia.</span>
      </footer>
    </>
  );
}
