import { Suspense } from "react";
import Lab from "@/components/Lab";
import { requireLearner } from "@/lib/supabase/access";
export default async function Practical({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const mode = (await searchParams).mode;
  await requireLearner(
    "/kimia/titrasi/praktikum" +
      (mode ? "?mode=" + encodeURIComponent(mode) : ""),
  );
  return (
    <Suspense fallback={<p className="loading">Menyiapkan laboratorium…</p>}>
      <Lab />
    </Suspense>
  );
}
