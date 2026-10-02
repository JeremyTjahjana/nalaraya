'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthNav({ close }: { close: () => void }) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => subscription.unsubscribe();
  }, []);
  async function signOut() {
    await createClient()?.auth.signOut();
    close();
    router.push('/');
    router.refresh();
  }
  return signedIn ? <><Link onClick={close} href="/dashboard">Dashboard</Link><button className="nav-signout" type="button" onClick={signOut}>Keluar</button></> : <Link onClick={close} href="/masuk">Masuk</Link>;
}
