'use client';
import { useState } from 'react';
import { completeOnboarding } from '@/app/onboarding/actions';

const questions = [
  { key: 'role', title: 'Kamu belajar sebagai apa?', description: 'Ini membantu kami menyiapkan pengalaman belajar yang sesuai.', choices: [['student', 'Siswa'], ['teacher', 'Guru']] },
  { key: 'grade', title: 'Sekarang kamu di tingkat apa?', description: 'Pilih tingkat yang paling mendekati keadaanmu.', choices: [['10', 'Kelas 10'], ['11', 'Kelas 11'], ['12', 'Kelas 12'], ['university', 'Perguruan tinggi'], ['other', 'Lainnya']] },
  { key: 'source', title: 'Dari mana kamu mengenal Nalaraya?', description: 'Jawabanmu membantu kami mengenalkan laboratorium ini ke lebih banyak pelajar.', choices: [['school', 'Sekolah atau guru'], ['friend', 'Teman'], ['social', 'Media sosial'], ['search', 'Pencarian web'], ['other', 'Lainnya']] },
] as const;

export default function OnboardingForm({ next }: { next: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ role: '', grade: '', source: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const question = questions[step];
  const value = answers[question.key];
  async function advance() {
    if (!value) return;
    if (step < 2) { setStep(step + 1); return; }
    setBusy(true); setError('');
    const result = await completeOnboarding({ ...answers, next });
    if (result) setError(result);
    setBusy(false);
  }
  return <section className="onboarding-sheet"><div className="onboarding-track"><span>Langkah {step + 1} dari 3</span><progress value={step + 1} max={3}/></div><h1>{question.title}</h1><p>{question.description}</p><div className="onboarding-options" role="radiogroup" aria-label={question.title}>{question.choices.map(([key, label]) => <label key={key} className={value === key ? 'selected' : ''}><input type="radio" name={question.key} value={key} checked={value === key} onChange={() => setAnswers({ ...answers, [question.key]: key })}/><span>{label}</span></label>)}</div>{error && <p className="form-error" role="alert">{error}</p>}<div className="onboarding-actions">{step > 0 && <button type="button" onClick={() => setStep(step - 1)}>← Kembali</button>}<button type="button" className="auth-primary" disabled={!value || busy} onClick={advance}>{busy ? 'Menyimpan…' : step === 2 ? 'Selesai' : 'Lanjut →'}</button></div></section>;
}
