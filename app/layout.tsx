import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "./globals.css";
import "./account.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Nalaraya — Laboratorium Virtual",
  description:
    "Laboratorium virtual interaktif untuk siswa SMA. Pelajari kimia dan biologi melalui latihan dan ujian.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
