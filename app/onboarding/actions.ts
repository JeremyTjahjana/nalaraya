'use server';
import { redirect } from 'next/navigation';
import { validOnboarding, safeNext } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function completeOnboarding(input: { role: string; grade: string; source: string; next: string }) {
  if (!validOnboarding(input)) return 'Pilih jawaban untuk ketiga pertanyaan.';
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user || !supabase) redirect('/masuk?next=' + encodeURIComponent(safeNext(input.next)));
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    role: input.role,
    grade: input.grade,
    referral_source: input.source,
    onboarding_completed_at: new Date().toISOString(),
  });
  if (error) return 'Profil belum tersimpan. Coba lagi.';
  redirect(safeNext(input.next));
}
