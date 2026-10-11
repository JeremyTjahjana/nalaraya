import Link from "next/link";
import Header from "@/components/Header";
import BiologyLabIntroduction from "@/components/BiologyLabIntroduction";
export const metadata = {
  title: "Pengenalan alat praktikum biologi — Nalaraya",
};
export default function BiologyLabIntroductionPage() {
  return (
    <>
      <Header />
      <main className="content inner-page biology-page introduction-course">
        <Link className="back" href="/biologi">
          ← Biologi
        </Link>
        <section className="page-intro">
          <h1>Pengenalan alat praktikum biologi</h1>
          <p className="large-copy">
            Kenali bentuk, fungsi, dan cara aman menggunakan alat dan bahan
            praktikum sebelum memasuki ruang praktikum.
          </p>
        </section>
        <BiologyLabIntroduction />
      </main>
    </>
  );
}
