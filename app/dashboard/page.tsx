import Link from 'next/link';
import Header from '@/components/Header';
import IntroProgressSync from '@/components/IntroProgressSync';
import { requireLearner } from '@/lib/supabase/access';

export const metadata = { title: 'Dashboard — Nalaraya' };
export const dynamic = 'force-dynamic';

function ProgressStatus({ complete, label }: { complete: boolean; label?: string }) {
  return <span className={`dashboard-status${complete ? ' is-complete' : ''}`}>
    {complete && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>}
    {label ? `${label} ` : ''}{complete ? 'selesai' : 'belum selesai'}
  </span>;
}

export default async function Dashboard() {
  const { supabase, user, profile } = await requireLearner('/dashboard');
  const { data: progress, error } = await supabase.from('lab_progress').select('lab_key, practice_completed, exam_completed, best_exam_score').eq('user_id', user.id);
  const byKey = new Map((progress ?? []).map(row => [row.lab_key, row]));
  const chemistry = byKey.get('chemistry_titration');
  const biology = byKey.get('biology_onion_epidermis');
  const intro = byKey.get('chemistry_intro');

  const metadataName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  const name = typeof metadataName === 'string' && metadataName.trim()
    ? metadataName.trim()
    : user.email?.split('@')[0] ?? 'Pengguna Nalaraya';
  const initials = name.split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase();
  const metadataAvatar = user.user_metadata?.avatar_url;
  const avatar = typeof metadataAvatar === 'string' && metadataAvatar.startsWith('https://') ? metadataAvatar : null;
  const joined = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(user.created_at));
  const grade = ({ '10': 'Kelas 10', '11': 'Kelas 11', '12': 'Kelas 12', university: 'Perguruan tinggi', other: 'Lainnya' } as Record<string, string>)[profile.grade ?? ''];

  return <><Header /><IntroProgressSync alreadySaved={Boolean(intro?.practice_completed)} />
    <main className="dashboard-page">
      <section className="dashboard-profile" aria-labelledby="profile-name">
        <div className="dashboard-avatar">{avatar ? <img src={avatar} alt="" referrerPolicy="no-referrer" /> : initials}</div>
        <div className="dashboard-identity">
          <h1 id="profile-name">{name}</h1>
          <p>{user.email}</p>
          <div className="dashboard-profile-meta">
            <span>{profile.role === 'teacher' ? 'Guru' : 'Siswa'}{profile.role === 'student' && grade ? ` · ${grade}` : ''}</span>
            <span>Bergabung sejak {joined}</span>
          </div>
        </div>
      </section>

      <div className="dashboard-heading"><h2>Praktikummu</h2><p>Lanjutkan percobaan dan lihat hasil terbaikmu.</p></div>
      {error && <p role="alert">Progres belum dapat dimuat. Coba muat ulang halaman.</p>}
      <section className="dashboard-curricula" aria-label="Mata pelajaran">
        <section className="dashboard-subject" aria-labelledby="kimia-title">
          <div className="dashboard-subject-head"><div><h3 id="kimia-title">Kimia</h3><p>Kenali alat dan latih pengukuran titrasi.</p></div><Link href="/kimia">Lihat pelajaran <span aria-hidden="true">↗</span></Link></div>
          <div className="dashboard-labs">
            <article className="dashboard-lab-card">
              <h4>Pengenalan laboratorium</h4>
              <div className="dashboard-statuses"><ProgressStatus complete={Boolean(intro?.practice_completed)} /></div>
              <Link className="dashboard-lab-action" href="/kimia/pengenalan-lab">{intro?.practice_completed ? 'Pelajari lagi' : 'Mulai belajar'} <span aria-hidden="true">↗</span></Link>
            </article>
            <article className="dashboard-lab-card">
              <h4>Titrasi asam–basa</h4>
              <div className="dashboard-statuses"><ProgressStatus label="Latihan" complete={Boolean(chemistry?.practice_completed)} /><ProgressStatus label="Ujian" complete={Boolean(chemistry?.exam_completed)} /></div>
              <div className="dashboard-lab-bottom">{chemistry?.best_exam_score != null && <span className="dashboard-score">Nilai terbaik <strong>{chemistry.best_exam_score}/100</strong></span>}<Link className="dashboard-lab-action" href="/kimia/titrasi">Buka praktikum <span aria-hidden="true">↗</span></Link></div>
            </article>
          </div>
        </section>
        <section className="dashboard-subject" aria-labelledby="biologi-title">
          <div className="dashboard-subject-head"><div><h3 id="biologi-title">Biologi</h3><p>Amati sel epidermis bawang merah.</p></div><Link href="/biologi">Lihat pelajaran <span aria-hidden="true">↗</span></Link></div>
          <div className="dashboard-labs">
            <article className="dashboard-lab-card">
              <h4>Epidermis bawang merah</h4>
              <div className="dashboard-statuses"><ProgressStatus label="Latihan" complete={Boolean(biology?.practice_completed)} /><ProgressStatus label="Ujian" complete={Boolean(biology?.exam_completed)} /></div>
              <div className="dashboard-lab-bottom">{biology?.best_exam_score != null && <span className="dashboard-score">Nilai terbaik <strong>{biology.best_exam_score}/100</strong></span>}<Link className="dashboard-lab-action" href="/biologi/epidermis-bawang">Buka praktikum <span aria-hidden="true">↗</span></Link></div>
            </article>
          </div>
        </section>
        <article className="dashboard-subject upcoming"><div className="dashboard-subject-head"><div><h3>Fisika</h3><p>Ruang untuk menjelajahi gerak, gaya, dan energi sedang kami siapkan.</p></div><span>Segera hadir</span></div></article>
      </section>
    </main>
  </>;
}
