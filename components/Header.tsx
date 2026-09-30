'use client';
import Link from 'next/link';
import {useState} from 'react';
import Logo from './Logo';

export default function Header(){const [open,setOpen]=useState(false);return <header className={`site-header${open?' menu-open':''}`}><Logo/><button className="nav-toggle" type="button" aria-label={open?'Tutup navigasi':'Buka navigasi'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(value=>!value)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={open?'M5 5 19 19M19 5 5 19':'M4 7h16M4 12h16M4 17h16'}/></svg></button><nav id="main-navigation" aria-label="Navigasi utama"><Link onClick={()=>setOpen(false)} href="/#tentang">Tentang</Link><Link onClick={()=>setOpen(false)} href="/#pelajaran">Mata pelajaran</Link><Link onClick={()=>setOpen(false)} className="nav-cta" href="/kimia">Mulai belajar <span aria-hidden>↗</span></Link></nav></header>}
