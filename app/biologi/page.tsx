import Link from "next/link";
import Header from "@/components/Header";
import BiologyCatalog from "@/components/BiologyCatalog";
export const metadata = { title: "Biologi — Nalaraya" };
export default function Biology() {
  return (
    <>
      <Header />
      <main className="content inner-page biology-page">
        <Link className="back" href="/">
          ← Semua pelajaran
        </Link>
        <section className="page-intro">
          <h1>Biologi</h1>
          <p className="large-copy">
            Kenali kehidupan melalui pengamatan dan percobaan.
          </p>
        </section>
        <BiologyCatalog />
      </main>
    </>
  );
}
