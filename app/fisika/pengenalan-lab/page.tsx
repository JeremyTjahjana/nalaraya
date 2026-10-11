import Link from "next/link";
import Header from "@/components/Header";
import PhysicsLabIntroduction from "@/components/PhysicsLabIntroduction";
export const metadata = {
  title: "Pengenalan alat praktikum fisika — Nalaraya",
};
export default function PhysicsLabIntroductionPage() {
  return (
    <>
      <Header />
      <main className="content inner-page physics-page introduction-course">
        <Link className="back" href="/fisika">
          ← Fisika
        </Link>
        <section className="page-intro">
          <h1>Pengenalan alat praktikum fisika</h1>
          <p className="large-copy">
            Kenali bentuk, fungsi, dan cara aman menggunakan alat dan komponen
            kelistrikan sebelum memasuki ruang praktikum.
          </p>
        </section>
        <PhysicsLabIntroduction />
      </main>
    </>
  );
}
