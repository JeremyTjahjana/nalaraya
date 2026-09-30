import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="site-header">
      <Logo />
      <nav aria-label="Navigasi utama">
        <Link href="/#tentang">Tentang</Link>
        <Link href="/#pelajaran">Mata pelajaran</Link>
        <Link className="nav-cta" href="/kimia">
          Mulai belajar <span aria-hidden>↗</span>
        </Link>
      </nav>
    </header>
  );
}
