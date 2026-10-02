import { redirect } from 'next/navigation';
import { safeNext } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function ContinuePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user || !supabase) redirect('/masuk?next=' + encodeURIComponent(next));
  const { data: profile } = await supabase.from('profiles').select('onboarding_completed_at').eq('id', user.id).maybeSingle();
  if (!profile?.onboarding_completed_at) redirect('/onboarding?next=' + encodeURIComponent(next));
  redirect(next);
}
