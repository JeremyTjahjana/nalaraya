import Logo from '@/components/Logo';
import AuthForm from '@/components/AuthForm';
import { safeNext } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Masuk — Nalaraya' };
export default async function SignIn({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const query = await searchParams;
  const next = safeNext(query.next);
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (user) redirect('/lanjut?next=' + encodeURIComponent(next));
  return <main className="auth-layout">
    <section className="auth-brand"><Logo/><div><h1>Belajar sains<br/>dengan mencoba.</h1><p>Satu akun untuk meneruskan percobaan dan melihat perkembangan belajarmu.</p></div><span>Laboratorium virtual Nalaraya</span></section>
    <section className="auth-panel"><AuthForm next={next} configured={Boolean(supabase)} callbackError={Boolean(query.error)}/></section>
  </main>;
}
