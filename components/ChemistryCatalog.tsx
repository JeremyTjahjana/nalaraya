'use client';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {FlaskCatalogIcon} from './ScienceIcons';
import {readCompletion} from '@/lib/introduction';

const experiments=[
 {title:'Pengenalan peralatan dan bahan kimia',category:'Dasar laboratorium',description:'Pelajari APD, fungsi alat, label bahan, dan simbol bahaya sebelum praktikum.',href:'/kimia/pengenalan-lab',status:'Mulai di sini'},
 {title:'Titrasi asam–basa',category:'Asam & basa',description:'Tentukan konsentrasi HCl melalui reaksi netralisasi dengan NaOH.',href:'/kimia/titrasi',status:'Tersedia'},
 {title:'Uji daya hantar larutan',category:'Elektrokimia',description:'Bandingkan kekuatan elektrolit melalui nyala lampu dan perubahan arus.',status:'Segera hadir'},
 {title:'Laju reaksi',category:'Kinetika',description:'Amati pengaruh suhu dan luas permukaan terhadap kecepatan reaksi.',status:'Segera hadir'},
 {title:'Identifikasi asam dan basa',category:'Asam & basa',description:'Gunakan indikator untuk mengenali sifat beberapa larutan sehari-hari.',status:'Segera hadir'},
 {title:'Sel volta sederhana',category:'Elektrokimia',description:'Susun dua elektroda dan pelajari perpindahan elektron.',status:'Segera hadir'},
 {title:'Kesetimbangan warna',category:'Kesetimbangan',description:'Amati pergeseran kesetimbangan ketika kondisi larutan berubah.',status:'Segera hadir'}
];
const filters=['Semua','Dasar laboratorium','Asam & basa','Elektrokimia','Kinetika','Kesetimbangan'];

export default function ChemistryCatalog(){
  const [filter,setFilter]=useState('Semua');
  const [introPassed,setIntroPassed]=useState(false);

  useEffect(()=>{
    try{setIntroPassed(readCompletion(window.localStorage))}catch{}
  },[]);

  const shown=filter==='Semua'?experiments:experiments.filter(item=>item.category===filter);
  return <section className="catalog reveal delay-1">
    <div className="catalog-heading">
      <h2>Praktikum</h2>
      <p>Pilih materi yang ingin dipelajari melalui simulasi.</p>
    </div>
    <div className="catalog-filters" aria-label="Filter praktikum">
      {filters.map(item=><button key={item} className={filter===item?'active':''} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}
    </div>
    <div className="experiment-grid">
      {shown.map((item,index)=>{
        const isIntro = item.href === '/kimia/pengenalan-lab';
        const displayStatus = isIntro && introPassed ? '✓ Lulus' : item.status;
        const content=<>
          <div className="experiment-card-top">
            <span>{item.category}</span>
            <span>{String(index+1).padStart(2,'0')}</span>
          </div>
          <div className="mini-flask" aria-hidden="true"><FlaskCatalogIcon /></div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <span className={`catalog-status${isIntro && introPassed ? ' status-passed' : ''}`}>
            {displayStatus}{item.href?' ↗':''}
          </span>
        </>;
        return item.href?<Link className="catalog-card available" href={item.href} key={item.title}>{content}</Link>:<article className="catalog-card" key={item.title} aria-disabled="true">{content}</article>
      })}
    </div>
  </section>;
}
