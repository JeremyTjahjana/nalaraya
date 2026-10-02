'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthNav({ close }: { close: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
    return () => subscription.unsubscribe();
  }, []);
  async function signOut() {
    await createClient()?.auth.signOut();
    close();
    router.push('/');
    router.refresh();
  }
  return <div className="nav-actions">{email ? <>
    <Link className="nav-cta" onClick={close} href="/dashboard">Dashboard</Link>
    <details className="nav-account">
      <summary aria-label="Buka menu akun">{email.charAt(0).toUpperCase()}</summary>
      <div className="nav-account-menu"><span>{email}</span><button className="nav-signout" type="button" onClick={signOut}>Keluar dari akun</button></div>
    </details>
  </> : <>
    <Link onClick={close} href="/masuk">Masuk</Link>
    <Link className="nav-cta" onClick={close} href="/#pelajaran">Mulai belajar</Link>
  </>}</div>;
}
