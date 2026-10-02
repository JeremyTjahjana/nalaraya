'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { completeOnboarding } from '@/app/onboarding/actions';

const questions = [
  { key: 'role', title: 'Kamu belajar sebagai apa?', description: 'Pilih peranmu untuk memulai.', choices: [['student', 'Siswa'], ['teacher', 'Guru']] },
  { key: 'grade', title: 'Sekarang kamu di tingkat apa?', description: 'Pilih tingkat yang paling mendekati keadaanmu.', choices: [['10', 'Kelas 10'], ['11', 'Kelas 11'], ['12', 'Kelas 12'], ['university', 'Perguruan tinggi'], ['other', 'Lainnya']] },
  { key: 'source', title: 'Dari mana kamu mengenal Nalaraya?', description: 'Jawabanmu membantu kami mengenalkan laboratorium ini ke lebih banyak pelajar.', choices: [['school', 'Sekolah atau guru'], ['friend', 'Teman'], ['social', 'Media sosial'], ['search', 'Pencarian web'], ['other', 'Lainnya']] },
] as const;

function RoleIcon({ role }: { role: 'student' | 'teacher' }) {
  return <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {role === 'student' ? <>
      <path d="M12 27 40 15l28 12-28 12-28-12Z" />
      <path d="M24 33v12c0 8 7 14 16 14s16-6 16-14V33M68 27v20" />
      <path d="M64 53c3-4 5-4 8 0" />
    </> : <>
      <path d="M15 14h50v37H48M31 51H15V14" />
      <path d="m49 34 11-10M34 35a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="M18 65v-9c0-9 7-15 16-15s16 6 16 15v9M12 65h44" />
    </>}
  </svg>;
}

export default function OnboardingForm({ next }: { next: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ role: '', grade: '', source: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const question = questions[step];
  const value = answers[question.key];

  useEffect(() => { heading.current?.focus(); }, [step]);

  async function advance() {
    if (!value) return;
    if (step < 2) { setStep(step + 1); return; }
    setBusy(true);
    setError('');
    const result = await completeOnboarding({ ...answers, next });
    if (result) setError(result);
    setBusy(false);
  }

  return <section className="onboarding-sheet" role="dialog" aria-modal="true" aria-labelledby="onboarding-title" aria-describedby="onboarding-description">
    <div className="onboarding-topline"><Link href="/">Kembali ke beranda ↗</Link></div>
    <div className="onboarding-track"><span>Langkah {step + 1} dari 3</span><progress value={step + 1} max={3} aria-label="Progres pertanyaan" /></div>
    <h1 id="onboarding-title" ref={heading} tabIndex={-1}>{question.title}</h1>
    <p id="onboarding-description">{question.description}</p>
    <div className={`onboarding-options${step === 0 ? ' role-options' : ''}`} role="radiogroup" aria-label={question.title}>
      {question.choices.map(([key, label]) => <label key={key} className={value === key ? 'selected' : ''}>
        <input type="radio" name={question.key} value={key} checked={value === key} onChange={() => setAnswers({ ...answers, [question.key]: key })} />
        <span>{step === 0 && <RoleIcon role={key === 'student' ? 'student' : 'teacher'} />}<strong>{label}</strong>{step === 0 && <small>{key === 'student' ? 'Aku ingin belajar lewat percobaan.' : 'Aku ingin menjelajahi materi untuk mengajar.'}</small>}</span>
      </label>)}
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="onboarding-actions">
      {step > 0 && <button type="button" className="onboarding-back" onClick={() => setStep(step - 1)}>← Kembali</button>}
      <button type="button" className="auth-primary" disabled={!value || busy} onClick={advance}>{busy ? 'Menyimpan…' : step === 2 ? 'Selesai' : 'Lanjut →'}</button>
    </div>
  </section>;
}
