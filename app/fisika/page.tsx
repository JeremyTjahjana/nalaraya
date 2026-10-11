import Link from 'next/link';
import Header from '@/components/Header';
import PhysicsCatalog from '@/components/PhysicsCatalog';
export const metadata={title:'Fisika — Nalaraya'};
export default function Fisika(){return <><Header/><main className="content inner-page physics-page"><Link className="back" href="/">← Semua pelajaran</Link><section className="page-intro"><h1>Fisika</h1><p className="large-copy">Pahami gejala fisis melalui percobaan dan pengukuran langsung.</p></section><PhysicsCatalog/></main></>}
