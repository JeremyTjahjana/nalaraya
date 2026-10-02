'use client';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import {epidermisTools} from '@/lib/epidermis';
const Preview=dynamic(()=>import('./ToolPreview'),{ssr:false});
export default function BiologyEquipment(){const [selected,setSelected]=useState('microscope'),tool=epidermisTools.find(t=>t.id===selected)!;return <section className="biology-equipment"><h2>Kenali alat dan bahan</h2><p>Pilih alat untuk melihat bentuk, fungsi, dan cara aman menggunakannya.</p><div className="catalog-filters" aria-label="Pilih alat">{epidermisTools.map(t=><button key={t.id} aria-pressed={t.id===selected} onClick={()=>setSelected(t.id)}>{t.name}</button>)}</div><div className="biology-equipment-detail"><div><h3>{tool.name}</h3><p>{tool.spec}</p><p>{tool.info}</p><p><strong>Penggunaan aman.</strong> {tool.safety}</p></div><Preview id={selected} controls/></div></section>}
