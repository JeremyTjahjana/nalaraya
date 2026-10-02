import Link from 'next/link';
import Header from '@/components/Header';
import Ambient from '@/components/Ambient';
import LabIntroduction from '@/components/LabIntroduction';

export default function LabIntroductionPage(){return <><Header/><main className="content inner-page introduction-course"><Ambient/><Link className="back" href="/kimia">← Kimia</Link><section className="page-intro"><h1>Pengenalan peralatan dan bahan kimia</h1><p className="large-copy">Kenali bentuk, fungsi, label, dan cara aman menggunakan perlengkapan dasar sebelum memasuki ruang praktikum.</p></section><LabIntroduction/></main></>}
