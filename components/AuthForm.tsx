'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthForm({ next, configured, callbackError }: { next: string; configured: boolean; callbackError: boolean }) {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(callbackError ? 'Tautan masuk tidak berhasil. Coba lagi.' : '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClient();
  const callback = typeof window === 'undefined' ? '' : new URL('/auth/callback?next=' + encodeURIComponent(next), window.location.origin).toString();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setMessage('');
    if (view === 'forgot') {
      const redirectTo = new URL('/auth/callback?next=' + encodeURIComponent('/atur-ulang-sandi'), window.location.origin).toString();
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setMessage(error ? error.message : 'Jika alamat ini terdaftar, tautan pengaturan ulang akan dikirim ke emailmu.');
    } else if (view === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: callback } });
      if (error) setMessage(error.message);
      else if (data.session) router.push('/lanjut?next=' + encodeURIComponent(next));
      else setMessage('Periksa emailmu untuk mengonfirmasi akun, lalu lanjutkan ke Nalaraya.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else { router.push('/lanjut?next=' + encodeURIComponent(next)); router.refresh(); }
    }
    setBusy(false);
  }

  async function google() {
    if (!supabase) return;
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback } });
    if (error) { setMessage(error.message); setBusy(false); }
  }

  return <div className="auth-form-wrap">
    <Link className="auth-back" href="/">← Kembali ke beranda</Link>
    <div className="auth-form-body"><h2>{view === 'signup' ? 'Buat akun' : view === 'forgot' ? 'Atur ulang kata sandi' : 'Masuk ke Nalaraya'}</h2>
      <p>{view === 'signup' ? 'Simpan hasil praktikum dan lihat kemajuanmu.' : view === 'forgot' ? 'Kami akan mengirim tautan pengaturan ulang ke emailmu.' : 'Lanjutkan ke laboratorium dan simpan hasil belajarmu.'}</p>
      {!configured && <p className="form-error" role="alert">Supabase belum dikonfigurasi. Tambahkan variabel di .env.local dan jalankan migrasi database.</p>}
      <form onSubmit={submit} className="auth-form">
        <label htmlFor="auth-email">Email</label><input id="auth-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} disabled={!configured || busy}/>
        {view !== 'forgot' && <><label htmlFor="auth-password">Kata sandi</label><input id="auth-password" type="password" minLength={6} autoComplete={view === 'signup' ? 'new-password' : 'current-password'} required value={password} onChange={event => setPassword(event.target.value)} disabled={!configured || busy}/></>}
        {view === 'login' && <button type="button" className="auth-text-button" onClick={() => { setView('forgot'); setMessage(''); }}>Lupa kata sandi?</button>}
        <button className="auth-primary" type="submit" disabled={!configured || busy}>{busy ? 'Mohon tunggu…' : view === 'signup' ? 'Buat akun' : view === 'forgot' ? 'Kirim tautan' : 'Masuk'}</button>
      </form>
      {view !== 'forgot' && <><div className="auth-divider"><span>atau</span></div><button className="auth-google" type="button" onClick={google} disabled={!configured || busy}>Lanjutkan dengan Google</button></>}
      {message && <p className="auth-message" role="status">{message}</p>}
      <p className="auth-switch">{view === 'login' ? <>Belum punya akun? <button onClick={() => {setView('signup');setMessage('');}}>Daftar</button></> : <>Sudah punya akun? <button onClick={() => {setView('login');setMessage('');}}>Masuk</button></>}</p>
    </div>
    <p className="auth-foot">Akses materi tetap terbuka untuk semua pengunjung.</p>
  </div>;
}
