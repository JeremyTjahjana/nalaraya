'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { readCompletion } from '@/lib/introduction';
import { createClient } from '@/lib/supabase/client';

export default function IntroProgressSync({ alreadySaved }: { alreadySaved: boolean }) {
  const router = useRouter();
  useEffect(() => {
    try { if (alreadySaved || !readCompletion(window.localStorage)) return; } catch { return; }
    const supabase = createClient();
    if (!supabase) return;
    void supabase.rpc('record_lab_progress', { p_lab_key: 'chemistry_intro', p_mode: 'latihan', p_score: null }).then(({ error }) => {
      if (!error) router.refresh();
    });
  }, [alreadySaved, router]);
  return null;
}
