'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {FormEvent,useEffect,useRef,useState} from 'react';
import HazardLegend from './HazardLegend';
import {equipment,EquipmentId,introQuestions,gradeIntroduction,readCompletion,saveCompletion} from '@/lib/introduction';
import {createClient} from '@/lib/supabase/client';

const Preview=dynamic(()=>import('./ToolPreview'),{ssr:false,loading:()=> <p className="course-preview-loading">Menyiapkan model…</p>});

const toolCategory: Record<EquipmentId, string> = {
  goggles: 'Alat Pelindung Diri',
  coat: 'Alat Pelindung Diri',
  gloves: 'Alat Pelindung Diri',
  flask: 'Wadah Reaksi',
  beaker: 'Wadah Reaksi',
  tube: 'Wadah Reaksi',
  mortar: 'Wadah Reaksi',
  burette: 'Volumetrik & Pengukur',
  cylinder: 'Volumetrik & Pengukur',
  volumetric: 'Volumetrik & Pengukur',
  pipette: 'Volumetrik & Pengukur',
  dropper: 'Volumetrik & Pengukur',
  propipette: 'Volumetrik & Pengukur',
  stand: 'Penyangga & Bantu',
  funnel: 'Penyangga & Bantu',
  rod: 'Penyangga & Bantu',
  spatula: 'Penyangga & Bantu',
  rack: 'Penyangga & Bantu',
  holder: 'Penyangga & Bantu',
  burner: 'Penyangga & Bantu',
};

const categories = ['Semua', 'Alat Pelindung Diri', 'Wadah Reaksi', 'Volumetrik & Pengukur', 'Penyangga & Bantu'] as const;
type Category = typeof categories[number];

export default function LabIntroduction(){
 const [selected,setSelected]=useState<EquipmentId>('goggles');
 const [category,setCategory]=useState<Category>('Semua');
 const [viewed,setViewed]=useState<Set<EquipmentId>>(()=>new Set<EquipmentId>(['goggles']));
 const [answers,setAnswers]=useState<number[]>(Array(introQuestions.length).fill(-1));
 const [result,setResult]=useState<ReturnType<typeof gradeIntroduction>>(null);
 const [completed,setCompleted]=useState(false);
 const [storageNotice,setStorageNotice]=useState('');
 const dialog=useRef<HTMLDialogElement>(null);
 const continueButton=useRef<HTMLButtonElement>(null);
 const resultHeading=useRef<HTMLHeadingElement>(null);

 useEffect(()=>{try{setCompleted(readCompletion(window.localStorage))}catch{/* Storage can be disabled by browser privacy settings. */}
  const supabase=createClient();if(!supabase)return;void supabase.auth.getUser().then(async ({data})=>{if(!data.user)return;const {data:progress}=await supabase.from('lab_progress').select('practice_completed').eq('lab_key','chemistry_intro').eq('user_id',data.user.id).maybeSingle();if(progress?.practice_completed){setCompleted(true);return;}try{if(readCompletion(window.localStorage))void supabase.rpc('record_lab_progress',{p_lab_key:'chemistry_intro',p_mode:'latihan',p_score:null});}catch{}});},[]);
 useEffect(()=>{if(result)resultHeading.current?.focus()},[result]);

 const item=equipment.find(tool=>tool.id===selected)!;
 const filteredEquipment=category==='Semua'?equipment:equipment.filter(tool=>toolCategory[tool.id]===category);

 function submit(event:FormEvent){
  event.preventDefault();
  const grade=gradeIntroduction(answers);
  if(!grade)return;
  setResult(grade);
  if(grade.passed){
   setCompleted(true);
   try{if(!saveCompletion(window.localStorage))setStorageNotice('Hasilmu tetap lulus, tetapi browser tidak dapat menyimpannya.')}catch{setStorageNotice('Hasilmu tetap lulus, tetapi browser tidak dapat menyimpannya.')}
   const supabase=createClient();if(supabase)void supabase.auth.getUser().then(({data})=>{if(data.user)void supabase.rpc('record_lab_progress',{p_lab_key:'chemistry_intro',p_mode:'latihan',p_score:null}).then(({error})=>{if(error)setStorageNotice('Hasilmu lulus, tetapi akun belum dapat menyimpannya. Coba lagi nanti.');});});
  }
  dialog.current?.scrollTo({top:0});
 }

 function retry(){
  setAnswers(Array(introQuestions.length).fill(-1));setResult(null);setStorageNotice('');
  requestAnimationFrame(()=>{dialog.current?.scrollTo({top:0});dialog.current?.querySelector<HTMLInputElement>('input')?.focus()});
 }

 return <>
  <section className="equipment-section" aria-labelledby="equipment-heading">
   <div className="equipment-section-header">
     <h2 id="equipment-heading">Peralatan laboratorium</h2>
     <span className="equipment-counter-badge">Dipelajari: <strong>{viewed.size}</strong>/{equipment.length} alat</span>
   </div>
   <p>Kenali 20 alat yang sering digunakan di laboratorium SMA. Pilih alat untuk melihat bentuknya dari berbagai sisi dan pelajari cara menggunakannya.</p>
   
   <div className="equipment-category-tabs" role="tablist" aria-label="Filter kategori alat">
     {categories.map(cat => (
       <button
         key={cat}
         type="button"
         className={`category-tab-btn${category === cat ? ' active' : ''}`}
         aria-pressed={category === cat}
         onClick={() => setCategory(cat)}
       >
         {cat} {cat === 'Semua' ? `(${equipment.length})` : `(${equipment.filter(t => toolCategory[t.id] === cat).length})`}
       </button>
     ))}
   </div>

   <div className="equipment-explorer">
    <nav className="equipment-picker" aria-label="Pilih peralatan">
      {filteredEquipment.map(tool => (
        <button
          key={tool.id}
          className="equipment-pick-btn"
          aria-pressed={selected === tool.id}
          onClick={() => {
            setSelected(tool.id);
            setViewed(prev => new Set([...prev, tool.id]));
          }}
        >
          <span className="tool-btn-name">{tool.name}</span>
          {viewed.has(tool.id) && <span className="viewed-badge" aria-label="Sudah dipelajari" title="Sudah dipelajari">✓</span>}
        </button>
      ))}
    </nav>
    <article className="equipment-detail" aria-label={item.name}>
     <Preview key={selected} id={selected} controls/>
     <div className="equipment-copy" aria-live="polite">
       <div className="equipment-copy-header">
         <span className="equipment-category-pill">{toolCategory[selected]}</span>
       </div>
       <h3>{item.name}</h3>
       <p>{item.purpose}</p>
       <dl>
         <dt>Ciri pengenal</dt>
         <dd>{item.features}</dd>
         <dt>Cara penggunaan</dt>
         <dd>{item.use}</dd>
         <dt>Perhatikan keselamatan</dt>
         <dd>{item.safety}</dd>
       </dl>
     </div>
    </article>
   </div>
  </section>
  <section className="course-hazards" aria-labelledby="hazard-heading">
   <h2 id="hazard-heading">Simbol bahaya bahan kimia</h2>
   <p>Sebelum memasuki ruang praktikum, kenali sembilan pictogram GHS berikut. Setiap gambar menunjukkan jenis bahaya, bukan tingkat keamanan secara keseluruhan.</p>
   <HazardLegend detailed/>
   <div className="label-reading">
     <h3>Baca seluruh label, bukan hanya simbolnya.</h3>
     <p>Pictogram pada produk bergantung pada klasifikasi bahaya, konsentrasi, dan formulasi bahan. Baca nama bahan, kata sinyal, pernyataan bahaya, petunjuk pencegahan, serta SDS (lembar data keselamatan) produk yang digunakan. Tidak adanya pictogram bukan jaminan bahan aman.</p>
     <p>Tanda seru tidak sama dengan tengkorak: tanda seru dapat menunjukkan iritasi atau bahaya akut yang lebih rendah, sedangkan tengkorak menunjukkan toksisitas akut yang dapat fatal atau toksik.</p>
   </div>
  </section>
  <div className="course-next">
   {completed&&<p className="completion-badge">✓ Kelas pengenalan telah lulus.</p>}
   <div className="course-next-actions">
     <button ref={continueButton} className="primary" onClick={()=>dialog.current?.showModal()}>
       {completed ? 'Uji Ulang Pemahaman' : 'Uji Pemahaman'}
     </button>
     {completed && (
       <Link className="button primary next-lab-btn" href="/kimia/titrasi">
         Mulai Praktikum Titrasi →
       </Link>
     )}
   </div>
  </div>
  <dialog className="course-quiz-dialog" ref={dialog} aria-labelledby="quiz-heading" onClose={()=>continueButton.current?.focus()}>
   <div className="quiz-dialog-header">
     <h2 id="quiz-heading">Uji pemahaman</h2>
     <button autoFocus type="button" onClick={()=>dialog.current?.close()} aria-label="Tutup ujian">Tutup</button>
   </div>
   {result ? (
     <section className="course-quiz-result">
       <h3 ref={resultHeading} tabIndex={-1}>{result.passed ? 'Lulus' : 'Belum lulus'} — {result.score}/5 benar</h3>
       <p>{result.passed ? 'Kamu sudah mengenali dasar peralatan dan simbol bahaya dengan baik.' : 'Pelajari pembahasan berikut, lalu coba kembali. Minimal empat jawaban benar untuk lulus.'}</p>
       {result.incorrect.map(index => {
         const question=introQuestions[index];
         return (
           <article key={question.q}>
             <h4>{index+1}. {question.q}</h4>
             <p>Jawabanmu: {question.options[answers[index]]}</p>
             <p><strong>Jawaban benar: {question.options[question.answer]}</strong></p>
             <p>{question.explanation}</p>
           </article>
         );
       })}
       {storageNotice&&<p role="status">{storageNotice}</p>}
       <div className="quiz-actions">
         <button onClick={retry}>Coba lagi</button>
         <button onClick={()=>dialog.current?.close()}>Kembali ke materi</button>
         {result.passed && (
           <Link className="button primary next-lab-btn" href="/kimia/titrasi">
             Mulai Praktikum Titrasi →
           </Link>
         )}
         {result.passed && (
           <Link className="button secondary" href="/kimia">
             Kembali ke kelas kimia
           </Link>
         )}
       </div>
     </section>
   ) : (
     <form className="course-quiz-form" onSubmit={submit}>
       <p>Jawab seluruh lima soal. Minimal empat jawaban benar untuk lulus.</p>
       {introQuestions.map((question,index)=>(
         <fieldset key={question.q}>
           <legend>{index+1}. {question.q}</legend>
           {question.options.map((option,optionIndex)=>(
             <label key={option}>
               <input
                 type="radio"
                 name={'question-'+index}
                 required
                 checked={answers[index]===optionIndex}
                 onChange={()=>setAnswers(current=>current.map((value,i)=>i===index?optionIndex:value))}
               />
               <span>{option}</span>
             </label>
           ))}
         </fieldset>
       ))}
       <div className="quiz-actions">
         <button className="primary" type="submit">Periksa jawaban</button>
         <button type="button" onClick={()=>dialog.current?.close()}>Kembali ke materi</button>
       </div>
     </form>
   )}
  </dialog>
 </>;
}
