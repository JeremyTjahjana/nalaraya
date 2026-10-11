import Link from "next/link";
import Header from "@/components/Header";
export const metadata = {
  title: "Pengamatan epidermis bawang merah — Nalaraya",
};
export default function EpidermisIntroduction() {
  return (
    <>
      <Header />
      <main className="content inner-page biology-page">
        <Link className="back" href="/biologi">
          ← Biologi
        </Link>
        <section className="page-intro experiment-intro">
          <h1>Pengamatan epidermis bawang merah</h1>
          <p className="large-copy">
            Dari lapisan tipis bawang hingga struktur sel yang terlihat melalui
            mikroskop.
          </p>
        </section>
        <div className="intro-grid">
          <section className="brief">
            <h2>Melihat jaringan dari dekat</h2>
            <p>
              Epidermis adalah lapisan sel di permukaan organ tumbuhan. Pada
              bagian dalam sisik umbi bawang merah, lapisan ini cukup tipis
              untuk dijadikan preparat basah dan diamati dengan mikroskop
              cahaya.
            </p>
            <p>
              Kamu akan mengambil epidermis menggunakan pinset, meletakkannya
              dalam setetes air, menambahkan Lugol, lalu memasang kaca penutup.
              Preparat yang rata dan tipis membantu cahaya menembus jaringan;
              kaca penutup yang diturunkan miring mengurangi gelembung udara.
            </p>
            <div className="learning-points">
              <h3>Yang akan kamu lakukan</h3>
              <ul>
                <li>Menyiapkan preparat secara berurutan dan aman.</li>
                <li>Memusatkan jaringan dan mengatur fokus mikroskop.</li>
                <li>
                  Menandai dinding sel, vakuola, dan inti sel langsung pada
                  bidang pandang.
                </li>
              </ul>
            </div>
            <p>
              Mulai pengamatan dengan objektif rendah. Dalam simulasi ini,
              okuler 10× dan objektif 10× mewakili pembesaran total 100×. Lugol
              membantu memperjelas kontras; ketampakan inti dan vakuola pada
              preparat nyata bergantung pada ketebalan jaringan, pewarnaan,
              serta pengaturan mikroskop.
            </p>
            <p className="safety-note">
              Bidang pandang merupakan ilustrasi edukatif, bukan foto mikrograf.
              Latihan ini melengkapi kegiatan laboratorium dengan pendampingan
              guru.
            </p>
          </section>
          <div className="mode-list">
            <article>
              <h3>Latihan terpandu</h3>
              <p>
                Ikuti langkah persiapan, pelajari pengaturan fokus, dan ulangi
                bagian yang belum tepat.
              </p>
              <Link
                className="button primary"
                href="/biologi/epidermis-bawang/praktikum?mode=latihan"
              >
                Mulai latihan ↗
              </Link>
            </article>
            <article>
              <h3>Ujian mandiri</h3>
              <p>
                10 menit untuk menyiapkan preparat, mengatur mikroskop, dan
                menandai struktur sel tanpa petunjuk langkah.
              </p>
              <Link
                className="button"
                href="/biologi/epidermis-bawang/praktikum?mode=ujian"
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
