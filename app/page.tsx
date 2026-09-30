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
            <h2>Ruang belajar yang lebih merata.</h2>
            <p className="about-lead">
              Belajar sains seharusnya berarti mengamati, menyentuh, mencoba,
              dan menemukan—bukan hanya menghafal langkah dari buku.
            </p>
          </div>
          <div className="about-story">
            <p className="large-copy">
              Namun bagi banyak siswa, praktikum masih menjadi kesempatan yang
              langka.
            </p>
            <p>
              Laboratorium sekolah dapat memiliki jumlah alat yang terbatas,
              bahan yang cepat habis, waktu penggunaan yang singkat, atau ruang
              yang harus dibagi oleh banyak kelas. Dalam kondisi seperti ini,
              satu kesalahan kecil bisa berarti percobaan harus dihentikan
              karena tidak ada bahan cadangan.
            </p>
            <p>
              Siswa akhirnya lebih sering melihat demonstrasi dari jauh daripada
              memegang alat sendiri. Mereka mengenal nama buret dan pipet,
              tetapi belum tentu sempat belajar mengatur kran, membaca meniskus,
              atau memahami mengapa suatu langkah harus dilakukan dengan urutan
              tertentu.
            </p>
            <p>
              Nalaraya memberi ruang latihan sebelum praktikum nyata. Siswa
              dapat mengulang prosedur, mencoba keputusan berbeda, dan memahami
              konsekuensinya tanpa menghabiskan bahan. Guru tetap menjadi
              pembimbing utama; simulasi ini membantu waktu di laboratorium
              digunakan untuk diskusi dan pengamatan yang lebih bermakna.
            </p>
            <div className="barriers-grid">
              <article>
                <b>Alat terbatas</b>
                <span>
                  Satu set alat harus digunakan bergantian oleh banyak siswa.
                </span>
              </article>
              <article>
                <b>Bahan sekali pakai</b>
                <span>
                  Kesempatan mencoba ulang sering dibatasi persediaan dan biaya.
                </span>
              </article>
              <article>
                <b>Waktu singkat</b>
                <span>
                  Prosedur panjang harus selesai dalam satu jam pelajaran.
                </span>
              </article>
            </div>
            <div className="fact-row">
              <span>
                <b>Interaktif</b>
                <small>Alat dapat dipilih, dipindahkan, dan dipasangkan</small>
              </span>
              <span>
                <b>Terarah</b>
                <small>Latihan dan ujian tersedia dalam satu ruang</small>
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
              Mulai dari kimia. Ruang biologi dan fisika sedang kami siapkan.
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
            <article className="subject-card biology" aria-disabled="true">
              <div className="subject-mark">
                <BiologyIcon />
              </div>
              <h3>Biologi</h3>
              <p>Eksplorasi sel dan sistem kehidupan.</p>
              <span className="card-link">Segera hadir</span>
            </article>
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
