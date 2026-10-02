import Link from 'next/link';
import Header from '@/components/Header';
import IntroProgressSync from '@/components/IntroProgressSync';
import { requireLearner } from '@/lib/supabase/access';

export const metadata = { title: 'Dashboard — Nalaraya' };
export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  const { supabase, user } = await requireLearner('/dashboard');
  const { data: progress, error } = await supabase.from('lab_progress').select('lab_key, practice_completed, exam_completed, best_exam_score').eq('user_id', user.id);
  const byKey = new Map((progress ?? []).map(row => [row.lab_key, row]));
  const chemistry = byKey.get('chemistry_titration');
  const biology = byKey.get('biology_onion_epidermis');
  const intro = byKey.get('chemistry_intro');
  return <><Header/><IntroProgressSync alreadySaved={Boolean(intro?.practice_completed)}/><main className="dashboard-page"><div className="dashboard-heading"><div><h1>Ruang belajarmu.</h1><p>Lanjutkan praktikum dan lihat hasil terbaikmu di sini.</p></div><span>{user.email}</span></div>{error && <p role="alert">Progres belum dapat dimuat. Coba muat ulang halaman.</p>}<section className="dashboard-curricula" aria-label="Mata pelajaran"><article className="dashboard-subject"><div className="dashboard-subject-head"><h2>Kimia</h2><Link href="/kimia">Buka pelajaran ↗</Link></div><p>Kenali alat, lalu latih pengukuran lewat titrasi asam–basa.</p><div className="dashboard-lab"><div><h3>Pengenalan laboratorium</h3><span>{intro?.practice_completed ? 'Selesai' : 'Belum selesai'}</span></div><Link href="/kimia/pengenalan-lab">{intro?.practice_completed ? 'Pelajari lagi' : 'Mulai'} ↗</Link></div><div className="dashboard-lab"><div><h3>Titrasi asam–basa</h3><span>{chemistry?.practice_completed ? 'Latihan selesai' : 'Latihan belum selesai'} · {chemistry?.exam_completed ? 'Ujian selesai' : 'Ujian belum selesai'}</span></div><strong>{chemistry?.best_exam_score == null ? '—' : chemistry.best_exam_score + '/100'}<small>Nilai ujian terbaik</small></strong><Link href="/kimia/titrasi">Buka praktikum ↗</Link></div></article><article className="dashboard-subject"><div className="dashboard-subject-head"><h2>Biologi</h2><Link href="/biologi">Buka pelajaran ↗</Link></div><p>Amati sel melalui pengamatan epidermis bawang merah.</p><div className="dashboard-lab"><div><h3>Epidermis bawang merah</h3><span>{biology?.practice_completed ? 'Latihan selesai' : 'Latihan belum selesai'} · {biology?.exam_completed ? 'Ujian selesai' : 'Ujian belum selesai'}</span></div><strong>{biology?.best_exam_score == null ? '—' : biology.best_exam_score + '/100'}<small>Nilai ujian terbaik</small></strong><Link href="/biologi/epidermis-bawang">Buka praktikum ↗</Link></div></article><article className="dashboard-subject upcoming"><div className="dashboard-subject-head"><h2>Fisika</h2><span>Segera hadir</span></div><p>Ruang untuk menjelajahi gerak, gaya, dan energi sedang kami siapkan.</p></article></section></main></>;
}
