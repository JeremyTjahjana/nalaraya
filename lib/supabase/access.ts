import { redirect } from 'next/navigation';
import { createClient } from './server';
import { safeNext } from '@/lib/auth';

export async function requireLearner(destination: string) {
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user || !supabase) redirect('/masuk?next=' + encodeURIComponent(safeNext(destination)));
  const { data: profile } = await supabase.from('profiles').select('onboarding_completed_at').eq('id', user.id).maybeSingle();
  if (!profile?.onboarding_completed_at) redirect('/onboarding?next=' + encodeURIComponent(safeNext(destination)));
  return { supabase, user };
}
