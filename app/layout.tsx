import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "./globals.css";
export const metadata = {
  title: "Nalaraya — Ruang untuk bereksperimen",
  description:
    "Laboratorium virtual interaktif untuk siswa SMA. Pelajari titrasi melalui latihan dan ujian.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
