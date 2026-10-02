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
            <h2>Ruang belajar sains yang lebih merata.</h2>
            <p className="about-lead">
              Belajar sains seharusnya berarti mengamati fenomena, menyentuh alat, mencoba reaksi,
              dan menemukan jawaban—bukan sekadar menghafal langkah kerja dari buku cetak.
            </p>
            <p className="about-context">
              Namun di banyak sekolah, kesempatan praktikum langsung masih sangat terbatas.
              Keterbatasan jumlah instrumen, mahalnya bahan sekali pakai, serta sempitnya jam
              pelajaran membuat siswa lebih sering hanya menyaksikan demonstrasi guru dari kejauhan.
            </p>
            <div className="barriers-grid">
              <article>
                <b>Alat terbatas</b>
                <span>Satu set aparatus harus bergantian digunakan oleh banyak kelompok siswa.</span>
              </article>
              <article>
                <b>Bahan sekali pakai</b>
                <span>Siswa ragu mencoba ulang karena khawatir menghabiskan reagen praktikum.</span>
              </article>
              <article>
                <b>Waktu sempit</b>
                <span>Prosedur analitis yang panjang terpaksa diselesaikan secara tergesa-gesa.</span>
              </article>
            </div>
          </div>
          <div className="about-story">
            <p className="large-copy">
              Eksplorasi mandiri tanpa rasa takut salah, sebelum melangkah ke laboratorium nyata.
            </p>
            <p>
              Nalaraya hadir sebagai laboratorium virtual yang dapat diakses kapan saja. Siswa
              bebas mengenali fungsi tiap alat, melatih kepekaan membaca meniskus buret, serta
              mengamati perubahan warna indikator tetes demi tetes hingga benar-benar memahami
              prinsip netralisasi.
            </p>
            <p>
              Simulasi ini tidak dimaksudkan untuk menggantikan peran guru maupun praktikum fisik,
              melainkan menjembataninya. Ketika siswa sudah memahami alur kerja teknis di Nalaraya,
              waktu di laboratorium sekolah dapat difokuskan sepenuhnya untuk pengamatan kritis,
              diskusi ilmiah, dan pemecahan masalah bersama.
            </p>
            <div className="fact-row">
              <span>
                <b>Interaktif & Bebas Risiko</b>
                <small>Alat dapat dirangkai dan diuji coba berulang kali tanpa risiko bahaya.</small>
              </span>
              <span>
                <b>Terarah & Terukur</b>
                <small>Tersedia latihan langkah demi langkah serta mode ujian dengan batas waktu.</small>
              </span>
            </div>
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
