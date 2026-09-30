'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {FormEvent,useEffect,useRef,useState} from 'react';
import HazardLegend from './HazardLegend';
import {equipment,EquipmentId,introQuestions,gradeIntroduction,readCompletion,saveCompletion} from '@/lib/introduction';

const Preview=dynamic(()=>import('./EquipmentPreview'),{ssr:false,loading:()=> <p className="course-preview-loading">Menyiapkan model…</p>});

export default function LabIntroduction(){
 const [selected,setSelected]=useState<EquipmentId>('goggles');
 const [answers,setAnswers]=useState<number[]>(Array(introQuestions.length).fill(-1));
 const [result,setResult]=useState<ReturnType<typeof gradeIntroduction>>(null);
 const [completed,setCompleted]=useState(false);
 const [storageNotice,setStorageNotice]=useState('');
 const dialog=useRef<HTMLDialogElement>(null);
 const continueButton=useRef<HTMLButtonElement>(null);
 const resultHeading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{try{setCompleted(readCompletion(window.localStorage))}catch{/* Storage can be disabled by browser privacy settings. */}},[]);
 useEffect(()=>{if(result)resultHeading.current?.focus()},[result]);
 const item=equipment.find(tool=>tool.id===selected)!;
 function submit(event:FormEvent){
  event.preventDefault();
  const grade=gradeIntroduction(answers);
  if(!grade)return;
  setResult(grade);
  if(grade.passed){
   setCompleted(true);
   try{if(!saveCompletion(window.localStorage))setStorageNotice('Hasilmu tetap lulus, tetapi browser tidak dapat menyimpannya.')}catch{setStorageNotice('Hasilmu tetap lulus, tetapi browser tidak dapat menyimpannya.')}
  }
  dialog.current?.scrollTo({top:0});
 }
 function retry(){
  setAnswers(Array(introQuestions.length).fill(-1));setResult(null);setStorageNotice('');
  requestAnimationFrame(()=>{dialog.current?.scrollTo({top:0});dialog.current?.querySelector<HTMLInputElement>('input')?.focus()});
 }
 return <>
  <section className="equipment-section" aria-labelledby="equipment-heading">
   <h2 id="equipment-heading">Peralatan laboratorium</h2>
   <p>Kenali 20 alat yang sering digunakan di laboratorium SMA. Pilih alat untuk melihat bentuknya dari berbagai sisi dan pelajari cara menggunakannya.</p>
   <div className="equipment-explorer">
    <nav className="equipment-picker" aria-label="Pilih peralatan">{equipment.map(tool=><button key={tool.id} aria-pressed={selected===tool.id} onClick={()=>setSelected(tool.id)}>{tool.name}</button>)}</nav>
    <article className="equipment-detail" aria-label={item.name}>
     <Preview key={selected} id={selected}/>
     <div className="equipment-copy" aria-live="polite"><h3>{item.name}</h3><p>{item.purpose}</p><dl><dt>Ciri pengenal</dt><dd>{item.features}</dd><dt>Cara penggunaan</dt><dd>{item.use}</dd><dt>Perhatikan keselamatan</dt><dd>{item.safety}</dd></dl></div>
    </article>
   </div>
  </section>
  <section className="course-hazards" aria-labelledby="hazard-heading">
   <h2 id="hazard-heading">Simbol bahaya bahan kimia</h2>
   <p>Sebelum memasuki ruang praktikum, kenali sembilan pictogram GHS berikut. Setiap gambar menunjukkan jenis bahaya, bukan tingkat keamanan secara keseluruhan.</p>
   <HazardLegend detailed/>
   <div className="label-reading"><h3>Baca seluruh label, bukan hanya simbolnya.</h3><p>Pictogram pada produk bergantung pada klasifikasi bahaya, konsentrasi, dan formulasi bahan. Baca nama bahan, kata sinyal, pernyataan bahaya, petunjuk pencegahan, serta SDS (lembar data keselamatan) produk yang digunakan. Tidak adanya pictogram bukan jaminan bahan aman.</p><p>Tanda seru tidak sama dengan tengkorak: tanda seru dapat menunjukkan iritasi atau bahaya akut yang lebih rendah, sedangkan tengkorak menunjukkan toksisitas akut yang dapat fatal atau toksik.</p></div>
  </section>
  <div className="course-next">{completed&&<p className="completion-badge">Kelas pengenalan telah lulus.</p>}<button ref={continueButton} className="primary" onClick={()=>dialog.current?.showModal()}>Lanjut</button></div>
  <dialog className="course-quiz-dialog" ref={dialog} aria-labelledby="quiz-heading" onClose={()=>continueButton.current?.focus()}>
   <div className="quiz-dialog-header"><h2 id="quiz-heading">Uji pemahaman</h2><button autoFocus type="button" onClick={()=>dialog.current?.close()} aria-label="Tutup ujian">Tutup</button></div>
   {result?<section className="course-quiz-result"><h3 ref={resultHeading} tabIndex={-1}>{result.passed?'Lulus':'Belum lulus'} — {result.score}/5 benar</h3><p>{result.passed?'Kamu sudah mengenali dasar peralatan dan simbol bahaya.':'Pelajari pembahasan berikut, lalu coba kembali. Minimal empat jawaban benar untuk lulus.'}</p>
    {result.incorrect.map(index=>{const question=introQuestions[index];return <article key={question.q}><h4>{index+1}. {question.q}</h4><p>Jawabanmu: {question.options[answers[index]]}</p><p><strong>Jawaban benar: {question.options[question.answer]}</strong></p><p>{question.explanation}</p></article>})}
    {storageNotice&&<p role="status">{storageNotice}</p>}
    <div className="quiz-actions"><button onClick={retry}>Coba lagi</button><button onClick={()=>dialog.current?.close()}>Kembali ke materi</button>{result.passed&&<Link className="button primary" href="/kimia">Kembali ke kelas kimia</Link>}</div>
   </section>:<form className="course-quiz-form" onSubmit={submit}><p>Jawab seluruh lima soal. Minimal empat jawaban benar untuk lulus.</p>{introQuestions.map((question,index)=><fieldset key={question.q}><legend>{index+1}. {question.q}</legend>{question.options.map((option,optionIndex)=><label key={option}><input type="radio" name={'question-'+index} required checked={answers[index]===optionIndex} onChange={()=>setAnswers(current=>current.map((value,i)=>i===index?optionIndex:value))}/><span>{option}</span></label>)}</fieldset>)}<div className="quiz-actions"><button className="primary" type="submit">Periksa jawaban</button><button type="button" onClick={()=>dialog.current?.close()}>Kembali ke materi</button></div></form>}
  </dialog>
 </>;
}
