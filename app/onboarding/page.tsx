import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import HeroArt from "@/components/HeroArt";
import OnboardingForm from "@/components/OnboardingForm";
import { safeNext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Kenalan dulu — Nalaraya" };
export default async function Onboarding({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user || !supabase) redirect("/masuk?next=" + encodeURIComponent(next));
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.onboarding_completed_at) redirect(next);

  return (
    <main className="onboarding-page">
      <div className="onboarding-scene" inert aria-hidden="true">
        <div className="onboarding-scene-header">
          <Logo />
          <span>Tentang</span>
          <span>Mata pelajaran</span>
        </div>
        <div className="onboarding-scene-hero">
          <div>
            <h2>
              Belajar sains
              <br />
              dengan mencoba.
            </h2>
            <p>
              Susun alat, lakukan percobaan, dan pahami alasan di balik setiap
              hasil.
            </p>
          </div>
          <HeroArt />
        </div>
        <div className="onboarding-scene-subjects">
          <span>Kimia</span>
          <span>Biologi</span>
          <span>Fisika</span>
        </div>
      </div>
      <OnboardingForm next={next} />
    </main>
  );
}
