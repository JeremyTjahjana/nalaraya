import { Suspense } from "react";
import CircuitLab from "@/components/CircuitLab";
import { requireLearner } from "@/lib/supabase/access";
export const metadata = {
  title: "Praktikum rangkaian seri dan paralel — Nalaraya",
};
export default async function CircuitPractical({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const mode = (await searchParams).mode;
  await requireLearner(
    "/fisika/rangkaian-seri-paralel/praktikum" +
      (mode ? "?mode=" + encodeURIComponent(mode) : ""),
  );
  return (
    <Suspense fallback={<p className="loading">Menyiapkan papan rangkaian…</p>}>
      <CircuitLab />
    </Suspense>
  );
}
