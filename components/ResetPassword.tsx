"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = supabase
        ? await supabase.auth.updateUser({ password })
        : { error: new Error("Supabase belum dikonfigurasi.") };
      if (error) setMessage(error.message);
      else {
        router.push("/lanjut");
        router.refresh();
      }
    } catch {
      setMessage("Koneksi terputus. Periksa internetmu, lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="account-sheet">
      <Link href="/">← Beranda</Link>
      <h1>Buat kata sandi baru</h1>
      <p>Gunakan sedikitnya 6 karakter.</p>
      <form className="auth-form" onSubmit={submit} aria-busy={busy}>
        <label htmlFor="new-password">Kata sandi baru</label>
        <input
          id="new-password"
          type="password"
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={busy}
        />
        <button className="auth-primary" disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan kata sandi"}
        </button>
      </form>
      {message && (
        <p id="reset-password-error" role="alert">
          {message}
        </p>
      )}
    </section>
  );
}
