import { Suspense } from "react";
import EpidermisLab from "@/components/EpidermisLab";
import { requireLearner } from "@/lib/supabase/access";
export const metadata = {
  title: "Praktikum epidermis bawang merah — Nalaraya",
};
export default async function EpidermisPractical({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const mode = (await searchParams).mode;
  await requireLearner(
    "/biologi/epidermis-bawang/praktikum" +
      (mode ? "?mode=" + encodeURIComponent(mode) : ""),
  );
  return (
    <Suspense fallback={<p className="loading">Menyiapkan meja biologi…</p>}>
      <EpidermisLab />
    </Suspense>
  );
}
