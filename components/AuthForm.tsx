"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({
  next,
  configured,
  callbackError,
}: {
  next: string;
  configured: boolean;
  callbackError: boolean;
}) {
  const router = useRouter();
  const [view, setView] = useState<"login" | "signup" | "forgot">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    callbackError ? "Tautan masuk tidak berhasil. Coba lagi." : "",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();
  const callback =
    typeof window === "undefined"
      ? ""
      : new URL(
          "/auth/callback?next=" + encodeURIComponent(next),
          window.location.origin,
        ).toString();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    if (view === "forgot") {
      const redirectTo = new URL(
        "/auth/callback?next=" + encodeURIComponent("/atur-ulang-sandi"),
        window.location.origin,
      ).toString();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      setMessage(
        error
          ? error.message
          : "Jika alamat ini terdaftar, tautan pengaturan ulang akan dikirim ke emailmu.",
      );
    } else if (view === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callback },
      });
      if (error) setMessage(error.message);
      else if (data.session)
        router.push("/lanjut?next=" + encodeURIComponent(next));
      else
        setMessage(
          "Periksa emailmu untuk mengonfirmasi akun, lalu lanjutkan ke Nalaraya.",
        );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else {
        router.push("/lanjut?next=" + encodeURIComponent(next));
        router.refresh();
      }
    }
    setBusy(false);
  }

  async function google() {
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback },
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth-form-wrap">
      <Link className="auth-back" href="/">
        ← Kembali ke beranda
      </Link>
      <div className="auth-form-body">
        <h2>
          {view === "signup"
            ? "Buat akun"
            : view === "forgot"
              ? "Atur ulang kata sandi"
              : "Masuk ke Nalaraya"}
        </h2>
        <p>
          {view === "signup"
            ? "Simpan hasil praktikum dan lihat kemajuanmu."
            : view === "forgot"
              ? "Kami akan mengirim tautan pengaturan ulang ke emailmu."
              : "Lanjutkan ke laboratorium dan simpan hasil belajarmu."}
        </p>
        {!configured && (
          <p className="form-error" role="alert">
            Supabase belum dikonfigurasi. Tambahkan variabel di .env.local dan
            jalankan migrasi database.
          </p>
        )}
        <form onSubmit={submit} className="auth-form">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={!configured || busy}
          />
          {view !== "forgot" && (
            <>
              <label htmlFor="auth-password">Kata sandi</label>
              <input
                id="auth-password"
                type="password"
                minLength={6}
                autoComplete={
                  view === "signup" ? "new-password" : "current-password"
                }
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={!configured || busy}
              />
            </>
          )}
          {view === "login" && (
            <button
              type="button"
              className="auth-text-button"
              onClick={() => {
                setView("forgot");
                setMessage("");
              }}
            >
              Lupa kata sandi?
            </button>
          )}
          <button
            className="auth-primary"
            type="submit"
            disabled={!configured || busy}
          >
            {busy
              ? "Mohon tunggu…"
              : view === "signup"
                ? "Buat akun"
                : view === "forgot"
                  ? "Kirim tautan"
                  : "Masuk"}
          </button>
        </form>
        {view !== "forgot" && (
          <>
            <div className="auth-divider">
              <span>atau</span>
            </div>
            <button
              className="auth-google"
              type="button"
              onClick={google}
              disabled={!configured || busy}
            >
              <svg
                viewBox="0 0 48 48"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 5.38 6.51 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.76 7.18l7.73 6C44.42 38.03 46.98 31.88 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.77-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.92-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.2C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>
          </>
        )}
        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}
        <p className="auth-switch">
          {view === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => {
                  setView("signup");
                  setMessage("");
                }}
              >
                Daftar
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => {
                  setView("login");
                  setMessage("");
                }}
              >
                Masuk
              </button>
            </>
          )}
        </p>
      </div>
      <p className="auth-foot">
        Akses materi tetap terbuka untuk semua pengunjung.
      </p>
    </div>
  );
}
