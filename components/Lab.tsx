"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useEffect,useReducer,useRef,useState} from 'react';
import {endpoint,initial,reducer,score,steps,tools} from '@/lib/lab';
import Logo from './Logo';
import {ToolIcon} from './ScienceIcons';
import {playLabSound,type SoundKind} from '@/lib/labSound';
import ProgressRecorder from './ProgressRecorder';

const Scene=dynamic(()=>import('./Scene'),{ssr:false,loading:()=> <p className="loading">Menyiapkan meja praktikum…</p>});
const Preview=dynamic(()=>import('./ToolPreview'),{ssr:false});

const hazardMeta={
 corrosive:{src:'/ghs/corrosive.svg',label:'Korosif'},
 flammable:{src:'/ghs/flammable.svg',label:'Mudah terbakar'},
 irritant:{src:'/ghs/exclamation.svg',label:'Iritan'},
} as const;

const stepDetails = [
  "Tekan tombol Kenakan pada kacamata keselamatan, jas laboratorium, dan sarung tangan. Ketiganya harus terpasang sebelum bahan kimia digunakan.",
  "Seret statif ke lingkaran panduan. Setelah terpasang, seret buret ke klem sampai keduanya terkunci pada posisi yang benar.",
  "Letakkan gelas limbah di meja, lalu seret botol NaOH mendekati buret. Bilasan pertama akan ditampung sebagai limbah.",
  "Seret corong ke mulut buret. Setelah corong terpasang, seret botol NaOH ke buret sekali lagi untuk mengisi buret dan membuang gelembung.",
  "Seret corong menjauh dari buret. Corong harus dilepas agar pembacaan volume awal tidak berubah oleh tetesan sisa.",
  "Seret pipet ke botol HCl untuk mengambil sampel, kemudian seret pipet yang sudah terisi ke Erlenmeyer.",
  "Seret botol fenolftalein ke Erlenmeyer. Indikator akan membantu menunjukkan titik akhir titrasi.",
  "Seret Erlenmeyer ke lingkaran tepat di bawah ujung buret sampai posisinya sesuai.",
  "Gunakan kontrol pada jendela titrasi. Tambahkan NaOH dalam 5 mL saat masih jauh dari titik akhir, lalu beralih ke 1 mL atau 0,5 mL. Aduk setelah setiap penambahan.",
  "Saat warna berubah menjadi merah muda pucat, tekan Selesaikan titrasi. Baca bagian bawah meniskus sejajar dengan mata, lalu catat volume awal, volume akhir, dan hasil perhitungan.",
];

export default function Lab(){
 const params=useSearchParams();
 const mode=params.get('mode')==='ujian'?'ujian':'latihan';
 const [state,dispatch]=useReducer(reducer,mode,initial);
 const [selected,select]=useState<string|null>(null);
 const [preview,setPreview]=useState('flask');
 const [muted,setMuted]=useState(false);
 const [drawer,setDrawer]=useState<'tools'|'notes'|''>('tools');
 const [cameraMode,setCameraMode]=useState(false);
 const [cameraReset,setCameraReset]=useState(0);
 const [titrationOpen,setTitrationOpen]=useState(false);
 const [toolTip,setToolTip]=useState({visible:false,x:250,y:110});
 const [answers,setAnswers]=useState({initial:'',final:'',molarity:''});
 const start=useRef(0);
 const soundPlayed=useRef(false);
 const audio=useRef<AudioContext|null>(null);
 const lastLogAt=useRef(0);
 const lastStep=useRef(0);
 const tipHideTimer=useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    start.current = Date.now();
    const interval = setInterval(
      () =>
        dispatch({
          type: "tick",
          value: 600 - Math.floor((Date.now() - start.current) / 1000),
        }),
      500,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.step !== 8 || !state.mixed || !endpoint(state)) return;
    const id = setInterval(() => dispatch({ type: "stable" }), 1000);
    return () => clearInterval(id);
  }, [state.step, state.mixed, state.volume, state.indicator]);

  useEffect(() => {
    const latest = state.log.at(-1);
    if (!latest || latest.at === lastLogAt.current) return;
    const advanced = state.step > lastStep.current;
    playSound(state.feedback ? "error" : advanced ? "stage" : "confirm");
    lastLogAt.current = latest.at;
    lastStep.current = state.step;
  }, [state.log, state.step, state.feedback]);

  useEffect(() => {
    if (!endpoint(state) || soundPlayed.current) return;
    soundPlayed.current = true;
    playSound("endpoint");
  }, [state.volume, state.indicator]);

 useEffect(()=>{if(state.step===8){setTitrationOpen(true);select(null)}},[state.step]);

 function unlockAudio(){if(!audio.current)audio.current=new AudioContext();void audio.current.resume()}
 function keepToolTip(){if(tipHideTimer.current)clearTimeout(tipHideTimer.current)}
 function hideToolTip(){keepToolTip();tipHideTimer.current=setTimeout(()=>setToolTip(value=>({...value,visible:false})),220)}
 function showToolTip(event:React.MouseEvent<HTMLButtonElement>,id:string){keepToolTip();const rect=event.currentTarget.getBoundingClientRect();setPreview(id);setToolTip({visible:true,x:rect.right,y:Math.max(92,Math.min(rect.top-26,window.innerHeight-455))})}
 function playSound(kind:SoundKind,force=false){
  if(muted&&!force)return;
  unlockAudio();
  const ctx=audio.current;if(!ctx)return;
  playLabSound(ctx,kind);
 }
 function toggleSound(){if(muted){setMuted(false);playSound('confirm',true)}else{playSound('touch',true);setMuted(true)}}
 function reset(){dispatch({type:'reset'});select(null);start.current=Date.now();soundPlayed.current=false;lastLogAt.current=0;lastStep.current=0;setTitrationOpen(false);setAnswers({initial:'',final:'',molarity:''});playSound('touch')}

  const item = tools.find((tool) => tool.id === preview)!;
  const progress = state.finished ? 100 : Math.round((state.step / 10) * 100);
  if (state.finished) return <Results state={state} reset={reset} />;

 return <div className="lab-shell" onPointerDown={unlockAudio}>
  <header className="lab-header">
   <div className="lab-brand-group">
    <Logo compact/>
    <div className="lab-title-wrap">
     <h1 className="lab-title">Titrasi asam–basa</h1>
     <span className="lab-mode-badge">{mode==='ujian'?'Ujian mandiri':'Latihan terpandu'}</span>
    </div>
   </div>
   <div className="mobile-tabs">
    <button className={`tab-btn${drawer==='tools'?' active':''}`} onClick={()=>setDrawer(drawer==='tools'?'':'tools')}>Alat & Bahan <span className="tab-badge">{state.objects.length}</span></button>
    <button className={`tab-btn${drawer==='notes'?' active':''}`} onClick={()=>setDrawer(drawer==='notes'?'':'notes')}>Panduan <span className="tab-badge">{state.step+1}/10</span></button>
   </div>
   <div className="lab-progress"><label htmlFor="progress">Progres <span>{progress}%</span></label><progress id="progress" max={100} value={progress}/></div>
   {mode==='ujian'&&<time className={state.remaining<60?'chemistry':''}>{Math.floor(state.remaining/60).toString().padStart(2,'0')}:{(state.remaining%60).toString().padStart(2,'0')}</time>}
   <button className="sound-toggle" aria-label={muted?'Aktifkan suara':'Matikan suara'} aria-pressed={muted} title={muted?'Suara mati':'Suara aktif'} onClick={toggleSound}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4Z"/>{muted?<path d="m17 9 4 6m0-6-4 6"/>:<path d="M16 9c1.5 1.7 1.5 4.3 0 6m2-8c2.8 2.8 2.8 7.2 0 10"/>}</svg></button>
   <Link className="lab-exit" href="/kimia/titrasi">Keluar</Link>
  </header>
  <div className={`lab-body${drawer?` drawer-${drawer}`:''}`}>
   <aside className={`inventory ${drawer==='tools'?'opened':''}`} onMouseLeave={hideToolTip}>
    <div className="panel-heading">
     <div><h2>Alat & bahan</h2><small>Ketuk untuk menambah · Seret di meja</small></div>
     <button type="button" className="panel-close-btn" onClick={()=>setDrawer('')} aria-label="Tutup panel">✕</button>
    </div>
    <div className="inventory-list">{tools.filter(tool=>mode==='ujian'||!['tube','cylinder'].includes(tool.id)).map(tool=>{const isPpe=tool.kind==='ppe';const equipped=state.ppe.includes(tool.id);const onTable=state.objects.some(object=>object.id===tool.id);return <button key={tool.id} draggable={!isPpe} className={`${preview===tool.id?'inventory-item active':'inventory-item'}${isPpe?' ppe-item':''}${equipped||onTable?' item-deployed':''}`} onDragStart={event=>{if(isPpe)return;playSound('touch');event.dataTransfer.setData('text/lab-tool',tool.id);event.dataTransfer.effectAllowed='copy';setPreview(tool.id)}} onMouseEnter={event=>showToolTip(event,tool.id)} onMouseLeave={hideToolTip} onFocus={()=>{keepToolTip();setPreview(tool.id);setToolTip({visible:true,x:270,y:110})}} onBlur={hideToolTip} onClick={()=>{setPreview(tool.id);if(isPpe){if(!equipped)dispatch({type:'add',id:tool.id})}else{if(!onTable){playSound('confirm');dispatch({type:'add',id:tool.id});select(tool.id)}else{playSound('touch');select(tool.id)}}}} onKeyDown={event=>{if(!isPpe&&(event.key==='Enter'||event.key===' ')){event.preventDefault();dispatch({type:'add',id:tool.id})}}}><div className="item-icon-box"><ToolIcon id={tool.id} className="item-icon"/></div><div className="item-meta"><span className="item-name">{tool.name}</span><span className="item-category">{tool.category}</span></div><span className={`item-badge${equipped||onTable?' active-badge':''}`}>{isPpe?(equipped?'Dipakai ✓':'Kenakan'):(onTable?'✓ Di meja':'⋮⋮ Pasang')}</span></button>})}</div>
    <div className={`tool-info${toolTip.visible?' visible':''}`} style={{left:toolTip.x,top:toolTip.y}} role="status" onMouseEnter={keepToolTip} onMouseLeave={hideToolTip}><div className="tool-info-copy"><div className="tool-tags"><span>Kenali alat</span><span className="tool-category-badge">{item.category}</span></div><h3>{item.name}</h3><div className="tool-spec-box"><strong>Spesifikasi:</strong> {item.spec}</div><p>{item.info}</p><div className="tool-safety">{item.hazards?.length&&<div className="tool-hazard-icons">{item.hazards.map(hazard=><img key={hazard} src={hazardMeta[hazard].src} alt={`Pictogram ${hazardMeta[hazard].label}`}/>)}</div>}<p className="safety-copy"><strong>Keselamatan</strong>{item.safety}</p></div></div><div className="popover-preview">{toolTip.visible&&<Preview key={preview} id={preview}/>}</div></div>
   </aside>
   <main className="lab-center">
    <div className="scene-meta"><span>25,00 mL HCl · NaOH 0,100 M</span></div>
    <div className={`camera-toolbar${cameraMode?' active':''}`}>{mode==='latihan'&&<button className="toolbar-step-btn" title={`Ulangi langkah ${state.step+1}`} onClick={()=>{playSound('touch');select(null);soundPlayed.current=false;dispatch({type:'resetStep'})}}>↺ Reset langkah {state.step+1}</button>}<button aria-pressed={cameraMode} onClick={()=>{playSound('touch');setCameraMode(!cameraMode);select(null)}}>{cameraMode?'Selesai menggeser':'Geser kamera'}</button><button onClick={()=>{playSound('touch');setCameraReset(value=>value+1);setCameraMode(false)}}>Pusatkan</button></div>
    <div className="lab-toast" key={state.log.at(-1)?.at||state.step}><span className={state.feedback?'error':''}/>{state.log.at(-1)?.text||steps[state.step]}</div>
    <div className={`scene${cameraMode?' camera-active':''}`} onDragOver={event=>{event.preventDefault();event.dataTransfer.dropEffect='copy'}} onDrop={event=>{event.preventDefault();playSound('confirm');const id=event.dataTransfer.getData('text/lab-tool');if(id){dispatch({type:'add',id});select(id)}}}><Scene state={state} dispatch={dispatch} selected={selected} select={select} cameraMode={cameraMode} resetKey={cameraReset} onInteract={()=>playSound('touch')} onAction={playSound} modalOpen={titrationOpen||state.step===9}/></div>
    <div className="scene-help">{cameraMode?'Tarik area lab untuk menggeser pandangan. Klik “Selesai menggeser” untuk kembali memindahkan alat.':'Kamera terkunci · Seret alat dari panel dan interaksikan langsung di meja · Scroll / cubit untuk zoom'}</div>
    {state.step===8&&!titrationOpen&&<button className="open-titration" onClick={()=>{playSound('touch');select(null);setTitrationOpen(true)}}>Buka kontrol titrasi</button>}
   </main>
   <aside className={`notes ${drawer==='notes'?'opened':''}`}>
    <div className="panel-heading mobile-notes-heading">
     <div><h2>Panduan & Catatan</h2><small>Langkah {state.step+1} dari 10</small></div>
     <button type="button" className="panel-close-btn" onClick={()=>setDrawer('')} aria-label="Tutup panel">✕</button>
    </div>
    {mode==='latihan'&&<section><h2>Panduan praktikum</h2><div className="step-accordions">{steps.map((step,index)=><details key={step} open={index===state.step} className={index===state.step?'current':index<state.step?'done':''}><summary><span>{index<state.step?'✓':index+1}</span>{step}</summary><p>{stepDetails[index]}</p></details>)}</div><div className="step-actions"><button type="button" className="step-btn prev-btn" disabled={state.step===0} onClick={()=>{playSound('touch');select(null);if(state.step===8)setTitrationOpen(false);dispatch({type:'prevStep'})}} title="Kembali ke langkah sebelumnya">← Langkah {Math.max(1,state.step)}</button><button type="button" className="step-btn reset-btn" onClick={()=>{playSound('touch');select(null);soundPlayed.current=false;dispatch({type:'resetStep'})}} title={`Ulangi langkah ${state.step+1}`}>↺ Ulangi langkah {state.step+1}</button></div></section>}
    <section><h2>Catatan reaksi</h2><p>HCl + NaOH → NaCl + H₂O</p><p className="formula">MₐVₐ = MᵦVᵦ</p><p>Gunakan selisih pembacaan buret untuk memperoleh volume titran.</p><p className="muted">APD: {state.ppe.length}/3 terpasang</p></section>
    <section><h2>Log aktivitas</h2><ol className="event-log">{state.log.slice(-8).map((entry,index)=><li key={index}>{mode==='ujian'?`Tindakan ${state.log.length-Math.min(8,state.log.length)+index+1} dicatat.`:entry.text}</li>)}</ol></section>
    {mode==='latihan'&&<button className="reset-lab-btn" onClick={reset}>Ulangi seluruh praktikum dari awal</button>}
   </aside>
  </div>
  {drawer!==''&&<div className="drawer-backdrop" onClick={()=>setDrawer('')}/>}
  <div className="portrait-gate" role="status"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="8" width="24" height="42" rx="3"/><path d="M49 25c6 7 6 17 0 24m3-5-3 5-5-3"/></svg><h2>Putar perangkat ke landscape.</h2><p>Ruang praktikum membutuhkan bidang kerja mendatar agar alat dapat dipindahkan dengan akurat.</p></div>
  {state.step===8&&titrationOpen&&<TitrationDialog state={state} close={()=>setTitrationOpen(false)} dose={value=>{playSound('dose');dispatch({type:'dose',value})}} swirl={()=>{playSound('swirl');dispatch({type:'mix'})}} finish={()=>{playSound(endpoint(state)?'stage':'error');dispatch({type:'finish'})}} resetTitration={()=>{playSound('touch');soundPlayed.current=false;dispatch({type:'resetTitration'})}}/>}
  {state.step===9&&<div className="assessment-overlay"><section className="assessment assessment-split"><div className="meniscus-side"><span className="modal-kicker">Hasil pengukuran</span><h2>Baca meniskus.</h2><p>Gunakan bagian bawah lengkungan cairan dan baca sejajar dengan mata.</p><div className="meniscus-pair"><Meniscus value={.15} label="Pembacaan awal"/><Meniscus value={.15+state.volume} label="Pembacaan akhir"/></div></div><div className="answer-side"><span className="modal-kicker">Uji pemahaman</span><h2>Catat hasilmu.</h2><p>Masukkan pembacaan buret dan hitung konsentrasi sampel.</p><form onSubmit={event=>{event.preventDefault();playSound('stage');dispatch({type:'submit',answers})}}>{[['initial','Volume awal (mL)'],['final','Volume akhir (mL)'],['molarity','Molaritas HCl (M)']].map(([key,label])=><label key={key}>{label}<input required inputMode="decimal" pattern="[0-9]+([.,][0-9]+)?" value={answers[key as keyof typeof answers]} onChange={event=>setAnswers({...answers,[key]:event.target.value})}/></label>)}<button className="primary" type="submit">Kumpulkan hasil ↗</button></form></div></section></div>}
 </div>;
}

function TitrationDialog({state,dose,swirl,finish,close,resetTitration}:{state:ReturnType<typeof initial>;dose:(value:number)=>void;swirl:()=>void;finish:()=>void;close:()=>void;resetTitration:()=>void}){
 const pink=endpoint(state);
 const over=state.volume>25.0;
 return <div className="titration-overlay"><section className="titration-dialog" role="dialog" aria-modal="true" aria-labelledby="titration-heading"><button className="modal-close" onClick={close} aria-label="Tutup kontrol titrasi">×</button><div className="titration-visual"><div className="dose-animation" key={state.volume} aria-hidden="true"><span className="dose-nozzle"/>{state.volume>0&&<><i/><i/><i/></>}</div><div key={`swirl-${state.mixed}`} className={`modal-flask${state.mixed?' is-swirling':''}${over?' over':pink?' pink':''}`}><div className="modal-liquid"><span/><span/><span/></div></div><p>{over?'Larutan terlalu pekat (lewat titik akhir).':pink?'Warna pink pucat tercapai.':'Larutan masih bening.'}</p></div><div className="titration-panel"><span className="modal-kicker">Titrasi berlangsung</span><h2 id="titration-heading">Tambahkan titran perlahan.</h2><p>Tambahkan NaOH, lalu aduk labu untuk meratakan larutan. Hentikan ketika warna berubah menjadi pink pucat.</p><div className="volume-display"><span>NaOH dialirkan</span><strong>{state.volume.toFixed(2)} mL</strong></div><div className="dose-grid"><button onClick={()=>dose(5)}>Tambahkan 5 mL</button><button onClick={()=>dose(1)}>Tambahkan 1 mL</button><button onClick={()=>dose(.5)}>Tambahkan 0,5 mL</button></div><button className={`swirl-button${state.mixed?' complete':''}`} onClick={swirl}>{state.mixed?'✓ Sudah diaduk':'Swirl / aduk labu'}</button><div className="titration-actions"><button type="button" className="reset-titration-btn" disabled={state.volume===0} onClick={resetTitration} title="Ulangi penambahan titran dari 0 mL">↺ Reset titran (0,00 mL)</button><button className="primary finish-titration" disabled={!pink} onClick={finish}>Selesaikan titrasi</button></div></div></section></div>;
}

function Results({state,reset}:{state:ReturnType<typeof initial>;reset:()=>void}){
 const finalScore=score(state);
 const summary=finalScore>=90?'Pembacaan dan perhitunganmu akurat.':finalScore>=75?'Tinjau kembali bagian yang masih dikurangi.':'Pelajari kembali pembacaan meniskus dan perhitunganmu.';
 const penalties={ppe:'APD',selection:'Pemilihan alat',procedure:'Prosedur',endpoint:'Titik akhir',meniscus:'Pembacaan meniskus',calculation:'Perhitungan molaritas',time:'Waktu',incomplete:'Tahap belum selesai'} as Record<string,string>;
 return <main className="results content"><ProgressRecorder lab="chemistry_titration" mode={state.mode} score={state.mode==='ujian'?finalScore:null}/>
  <header className="result-header"><Link href="/kimia">← Kelas kimia</Link><div><h1>Hasil praktikum</h1><p>{state.mode==='ujian'?'Ujian titrasi asam–basa':'Latihan titrasi asam–basa'}</p></div><div className="result-score" aria-label={`Nilai ${finalScore} dari 100`}><strong>{finalScore}</strong><span>/100</span></div></header>
  <p className="result-summary">{summary}</p>
  {state.expired&&<p className="result-notice">Waktu habis. Tahap yang belum selesai tercatat dalam penilaian.</p>}
  <div className="result-grid">
   <section className="measurement-report"><h2>Catatan pengukuran</h2><dl><dt>Volume awal</dt><dd>0,15 mL</dd><dt>Volume akhir</dt><dd>{(.15+state.volume).toFixed(2)} mL</dd><dt>NaOH terpakai</dt><dd>{state.volume.toFixed(2)} mL</dd><dt>Molaritas terhitung</dt><dd>{(.1*state.volume/25).toFixed(4)} M</dd><dt>Interpretasi</dt><dd>{endpoint(state)?'Titik akhir berada dalam rentang simulasi.':'Titik akhir belum tepat; hasil tidak dianggap pengukuran valid.'}</dd></dl><div className="calculation-note"><p>M HCl = (M NaOH × V NaOH) / V HCl</p><p>Volume terpakai diperoleh dari pembacaan akhir dikurangi pembacaan awal, bukan sisa cairan dalam buret.</p>{state.answers&&<p>Jawabanmu: {state.answers.initial} mL → {state.answers.final} mL; {state.answers.molarity} M.</p>}</div><div className="result-actions"><button className="primary" onClick={reset}>Ulangi {state.mode}</button><Link className="button" href="/kimia/titrasi">Pilih mode</Link></div></section>
   <section className="assessment-report"><h2>Rincian penilaian</h2>{Object.keys(state.penalties).length===0?<p className="no-deductions">Tidak ada pengurangan nilai.</p>:<dl className="deduction-list">{Object.entries(state.penalties).map(([key,value])=><div key={key}><dt>{penalties[key]}</dt><dd>−{value}</dd></div>)}</dl>}<details className="activity-record"><summary>Rekaman praktikum <span>{state.log.length} aktivitas</span></summary><ol>{state.log.map((entry,index)=><li key={index}>{entry.text}</li>)}</ol></details></section>
  </div>
 </main>;
}

function Meniscus({ value, label }: { value: number; label: string }) {
  const base = Math.floor(value);
  const y = 30 + (value - base) * 120;
  return (
    <figure>
      <figcaption>{label}</figcaption>
      <svg
        viewBox="0 0 130 180"
        role="img"
        aria-label={`${label}, skala buret ${base} sampai ${base + 1} mL`}
      >
        <path
          d={`M35 ${y - 8} Q55 ${y + 8} 75 ${y - 8} L75 170 L35 170Z`}
          fill="#d6e5e1"
        />
        <path
          d={`M35 ${y - 8} Q55 ${y + 8} 75 ${y - 8}`}
          fill="none"
          stroke="#293f3c"
          strokeWidth="2"
        />
        <path d="M35 10V170M75 10V170" stroke="#778983" />
        {Array.from({ length: 11 }, (_, index) => (
          <g key={index}>
            <path
              d={`M75 ${30 + index * 12}h${index % 5 === 0 ? 16 : 9}`}
              stroke="#222"
            />
            {index % 5 === 0 && (
              <text x="96" y={34 + index * 12} fontSize="11">
                {(base + index / 10).toFixed(1)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </figure>
  );
}
