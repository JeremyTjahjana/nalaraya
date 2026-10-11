import Link from "next/link";
import Header from "@/components/Header";
import Ambient from "@/components/Ambient";
export default function Introduction() {
  return (
    <>
      <Header />
      <main className="content inner-page">
        <Ambient />
        <Link className="back reveal" href="/kimia">
          ← Kimia
        </Link>
        <section className="page-intro experiment-intro reveal">
          <h1>Titrasi asam–basa</h1>
          <p className="large-copy">
            Pelajari cara mengetahui konsentrasi larutan yang belum diketahui
            melalui reaksi netralisasi.
          </p>
        </section>
        <div className="intro-grid reveal delay-1">
          <div className="brief">
            <h2>Mengenal materi ini</h2>
            <p>
              Titrasi asam–basa adalah materi kimia larutan yang mempertemukan
              asam dan basa dalam perbandingan terukur. Ketika jumlah keduanya
              setara, reaksi mencapai titik netralisasi. Dari volume larutan
              yang digunakan, kita dapat mencari konsentrasi sampel yang
              sebelumnya belum diketahui.
            </p>
            <p>
              Dalam percobaan ini, sampel HCl direaksikan perlahan dengan NaOH
              yang konsentrasinya sudah diketahui. Fenolftalein membantu melihat
              kapan reaksi mendekati selesai: larutan berubah dari bening
              menjadi merah muda pucat yang menetap.
            </p>
            <div className="learning-points">
              <h3>Yang akan kamu lakukan</h3>
              <ul>
                <li>Menyiapkan alat dengan aman dan membaca skala buret.</li>
                <li>
                  Menambahkan larutan sedikit demi sedikit sambil mengamati
                  perubahan warna.
                </li>
                <li>
                  Menggunakan hasil pengukuran untuk menentukan konsentrasi HCl.
                </li>
              </ul>
            </div>
            <p className="context-note">
              Prinsip titrasi digunakan dalam pengujian kualitas air, makanan,
              obat, dan berbagai proses industri yang perlu mengontrol tingkat
              keasaman.
            </p>
            <p className="safety-note">
              Simulasi menggunakan model kimia ideal. Praktikum nyata tetap
              memerlukan guru, APD, dan petunjuk keselamatan bahan.
            </p>
          </div>
          <div className="mode-list">
            <article>
              <h3>Latihan terpandu</h3>
              <p>
                Petunjuk langkah demi langkah. Ulangi proses tanpa tekanan nilai
                atau waktu.
              </p>
              <Link
                className="button primary"
                href="/kimia/titrasi/praktikum?mode=latihan"
              >
                Mulai latihan ↗
              </Link>
            </article>
            <article>
              <h3>Ujian mandiri</h3>
              <p>
                10 menit. Pilih perlengkapan sendiri dan selesaikan perhitungan
                untuk memperoleh nilai.
              </p>
              <Link
                className="button"
                href="/kimia/titrasi/praktikum?mode=ujian"
              >
                Mulai ujian ↗
              </Link>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
