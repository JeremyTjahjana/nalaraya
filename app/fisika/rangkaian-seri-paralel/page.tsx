import Link from "next/link";
import Header from "@/components/Header";
export const metadata = {
  title: "Rangkaian seri dan paralel — Nalaraya",
};
export default function CircuitIntroduction() {
  return (
    <>
      <Header />
      <main className="content inner-page physics-page">
        <Link className="back" href="/fisika">
          ← Fisika
        </Link>
        <section className="page-intro experiment-intro">
          <h1>Rangkaian seri dan paralel</h1>
          <p className="large-copy">
            Dari satu lampu hingga rangkaian gabungan, amati bagaimana susunan
            komponen mengubah hambatan, arus, dan kecerahan.
          </p>
        </section>
        <div className="intro-grid">
          <section className="brief">
            <h2>Menyusun dan menghitung rangkaian</h2>
            <p>
              Pada rangkaian seri, komponen tersusun berurutan sehingga arus
              yang sama melewati setiap komponen dan hambatan total merupakan
              jumlah hambatan tiap komponen. Pada rangkaian paralel, tiap cabang
              menerima tegangan penuh sehingga arus terbagi dan hambatan total
              menjadi lebih kecil.
            </p>
            <p>
              Kamu akan memasang sumber tegangan, project board, LED, kawat
              jumper, dan sakelar. Setelah menutup sakelar, susun rangkaian
              mengikuti langkah: satu LED, dua LED seri, tiga LED paralel, lalu
              rangkaian gabungan. Amati kecerahan tiap lampu dan hitung besaran
              listriknya dengan hukum Ohm.
            </p>
            <div className="learning-points">
              <h3>Yang akan kamu lakukan</h3>
              <ul>
                <li>Merangkai sumber tegangan dan komponen pada project board.</li>
                <li>
                  Menyusun rangkaian seri, paralel, dan gabungan sesuai langkah.
                </li>
                <li>
                  Menghitung hambatan total dan arus menggunakan hukum Ohm.
                </li>
              </ul>
            </div>
            <p className="safety-note">
              Pada simulasi ini LED dimodelkan sebagai resistor ohmik identik
              (100 Ω) agar perbandingan kecerahan mudah diamati. Nilai dan
              kecerahan merupakan ilustrasi edukatif, bukan pengukuran alat
              nyata. Latihan ini melengkapi kegiatan laboratorium dengan
              pendampingan guru.
            </p>
          </section>
          <div className="mode-list">
            <article>
              <h3>Latihan terpandu</h3>
              <p>
                Ikuti tujuh langkah perakitan, pelajari perhitungannya, dan
                ulangi bagian yang belum tepat.
              </p>
              <Link
                className="button primary"
                href="/fisika/rangkaian-seri-paralel/praktikum?mode=latihan"
              >
                Mulai latihan ↗
              </Link>
            </article>
            <article>
              <h3>Ujian mandiri</h3>
              <p>
                10 menit untuk merangkai seri dan paralel serta menjawab soal
                hukum Ohm tanpa petunjuk langkah.
              </p>
              <Link
                className="button"
                href="/fisika/rangkaian-seri-paralel/praktikum?mode=ujian"
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
