'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useEffect,useReducer,useRef,useState} from 'react';
import Logo from './Logo';
import {BiologyIcon,ToolIcon} from './ScienceIcons';
import {initial,reducer,score,steps,structures,epidermisTools,type State} from '@/lib/epidermis';
import {playLabSound,type SoundKind} from '@/lib/labSound';
import MicroscopeView from './MicroscopeView';
import ProgressRecorder from './ProgressRecorder';
const Scene=dynamic(()=>import('./BiologyScene'),{ssr:false,loading:()=> <p className="loading">Menyiapkan meja…</p>});
const Preview=dynamic(()=>import('./ToolPreview'),{ssr:false});
export default function EpidermisLab(){
 const mode=useSearchParams().get('mode')==='ujian'?'ujian':'latihan';
 const [state,dispatch]=useReducer(reducer,mode,initial);
 const [drawer,setDrawer]=useState<'tools'|'notes'|''>('');
 const [selected,setSelected]=useState(''),[target,setTarget]=useState('slide');
 const [preview,setPreview]=useState('goggles'),[camera,setCamera]=useState(false),[cameraKey,setCameraKey]=useState(0);
 const [muted,setMuted]=useState(false),[portrait,setPortrait]=useState(true),[reduced,setReduced]=useState(false),[scope,setScope]=useState(false),[audioError,setAudioError]=useState(false);
 const audio=useRef<AudioContext|null>(null),lastEvent=useRef(0),lastStep=useRef(0),snapshots=useRef<Record<number,State>>({0:initial(mode)});
 const [toolTip,setToolTip]=useState({visible:false,x:300,y:100});
 const tipHideTimer=useRef<ReturnType<typeof setTimeout>|null>(null),stageTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{const orientation=matchMedia('(max-width: 900px) and (orientation: portrait)'),motion=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setPortrait(orientation.matches);setReduced(motion.matches);};update();orientation.addEventListener('change',update);motion.addEventListener('change',update);return()=>{orientation.removeEventListener('change',update);motion.removeEventListener('change',update);};},[]);
 useEffect(()=>{if(state.finished||mode!=='ujian')return;let last=Date.now();const timer=setInterval(()=>{const now=Date.now(),seconds=Math.floor((now-last)/1000);if(seconds){last+=seconds*1000;dispatch({type:'tick',seconds});}},250);return()=>clearInterval(timer);},[mode,state.finished]);
 useEffect(()=>{if(!snapshots.current[state.step])snapshots.current[state.step]=structuredClone(state);},[state]);
 function unlock(){try{audio.current??=new AudioContext();void audio.current.resume().catch(()=>setAudioError(true));}catch{setAudioError(true);}}
 function sound(kind:SoundKind,force=false){if(muted&&!force)return;unlock();if(audio.current)playLabSound(audio.current,kind);}
 useEffect(()=>{if(state.event!==lastEvent.current){lastEvent.current=state.event;sound(state.sound);if(state.step>lastStep.current&&state.sound!=='stage'){if(stageTimer.current)clearTimeout(stageTimer.current);stageTimer.current=setTimeout(()=>sound('stage'),350);}lastStep.current=state.step;}},[state.event]);
 useEffect(()=>()=>{if(tipHideTimer.current)clearTimeout(tipHideTimer.current);if(stageTimer.current)clearTimeout(stageTimer.current);void audio.current?.close();},[]);
 useEffect(()=>{if(state.step===9){const timer=setTimeout(()=>setScope(true),reduced?0:1400);return()=>clearTimeout(timer);}},[state.step,reduced]);
 function interact(source:string,destination:string){dispatch({type:'interact',source,target:destination});setSelected('');}
 function keepToolTip(){if(tipHideTimer.current)clearTimeout(tipHideTimer.current);}
 function hideToolTip(){keepToolTip();tipHideTimer.current=setTimeout(()=>setToolTip(value=>({...value,visible:false})),220);}
 function showToolTip(event:React.MouseEvent<HTMLButtonElement>,id:string){keepToolTip();const rect=event.currentTarget.getBoundingClientRect();setPreview(id);setToolTip({visible:true,x:rect.right,y:Math.max(92,Math.min(rect.top-26,window.innerHeight-455))});}
 function click(id:string){if(id==='microscope'&&state.step>=9){setScope(true);return;}if(selected&&selected!==id)interact(selected,id);else {setSelected(id);sound('touch');}}
 function reset(){dispatch({type:'reset'});snapshots.current={0:initial(mode)};lastEvent.current=0;lastStep.current=0;setScope(false);setSelected('');}
 if(state.finished)return <EpidermisResults state={state} reset={reset}/>;
 const item=epidermisTools.find(t=>t.id===preview)!;
 const progress=Math.round(state.step/11*100);
 return <div className="lab-shell biology-lab" onPointerDown={unlock}>
  <header className="lab-header"><div className="lab-brand-group"><Logo compact/><div className="lab-title-wrap"><h1 className="lab-title">Epidermis bawang merah</h1><span className="lab-mode-badge">{mode==='latihan'?'Latihan terpandu':'Ujian mandiri'}</span></div></div>
   <div className="mobile-tabs"><button className={drawer==='tools'?'tab-btn active':'tab-btn'} aria-expanded={drawer==='tools'} onClick={()=>setDrawer(drawer==='tools'?'':'tools')}>Alat & bahan</button><button className={drawer==='notes'?'tab-btn active':'tab-btn'} aria-expanded={drawer==='notes'} onClick={()=>setDrawer(drawer==='notes'?'':'notes')}>Panduan</button></div>
   <div className="lab-progress"><label htmlFor="bio-progress">Progres <span>{progress}%</span></label><progress id="bio-progress" max={100} value={progress}/></div>
   {mode==='ujian'&&<time>{Math.floor(state.remaining/60).toString().padStart(2,'0')}:{(state.remaining%60).toString().padStart(2,'0')}</time>}
   <button className="sound-toggle" aria-pressed={muted} aria-label={muted?'Aktifkan suara':'Matikan suara'} onClick={()=>{sound(muted?'confirm':'touch',true);setMuted(!muted);}}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4Z"/>{muted?<path d="m17 9 4 6m0-6-4 6"/>:<path d="M16 9c1.5 1.7 1.5 4.3 0 6m2-8c2.8 2.8 2.8 7.2 0 10"/>}</svg></button>
   <Link className="lab-exit" href="/biologi/epidermis-bawang">Keluar</Link>
  </header>
  <div className={drawer?'lab-body drawer-'+drawer:'lab-body'}>
   <aside className={`inventory ${drawer==='tools'?'opened':''}`} onMouseLeave={hideToolTip}>
    <div className="panel-heading"><div><h2>Alat & bahan</h2><small>Ketuk untuk menambah · Seret di meja</small></div><button type="button" className="panel-close-btn" onClick={()=>setDrawer('')} aria-label="Tutup panel">✕</button></div>
    <div className="inventory-list">{epidermisTools.map(t=>{const isPpe=t.kind==='ppe',deployed=isPpe?state.ppe.includes(t.id):state.objects.some(o=>o.id===t.id);return <button key={t.id} draggable={!isPpe} className={`${preview===t.id?'inventory-item active':'inventory-item'}${isPpe?' ppe-item':''}${deployed?' item-deployed':''}`} onDragStart={e=>{if(isPpe)return;e.dataTransfer.setData('text/bio-tool',t.id);e.dataTransfer.effectAllowed='copy';setPreview(t.id);setSelected(t.id);}} onMouseEnter={e=>showToolTip(e,t.id)} onMouseLeave={hideToolTip} onFocus={()=>{keepToolTip();setPreview(t.id);setToolTip({visible:true,x:300,y:110});}} onBlur={hideToolTip} onClick={()=>{setPreview(t.id);if(!deployed)dispatch({type:'add',id:t.id});if(!isPpe)setSelected(t.id);setToolTip(value=>({...value,visible:false}));}}><div className="item-icon-box">{isPpe?<ToolIcon id={t.id} className="item-icon"/>:<ToolIcon id={t.id} className="item-icon"/>}</div><div className="item-meta"><span className="item-name">{t.name}</span><span className="item-category">{t.category}</span></div><span className={`item-badge${deployed?' active-badge':''}`}>{isPpe?(deployed?'Dipakai ✓':'Kenakan'):(deployed?'✓ Di meja':'⋮⋮ Pasang')}</span></button>})}</div>
    <div className={`tool-info${toolTip.visible?' visible':''}`} style={{left:toolTip.x,top:toolTip.y}} role="status" onMouseEnter={keepToolTip} onMouseLeave={hideToolTip}><div className="tool-info-copy"><div className="tool-tags"><span>Kenali alat</span><span className="tool-category-badge">{item.category}</span></div><h3>{item.name}</h3><div className="tool-spec-box"><strong>Spesifikasi:</strong> {item.spec}</div><p>{item.info}</p><div className="tool-safety"><p className="safety-copy"><strong>Keselamatan</strong>{item.safety}</p></div></div><div className="popover-preview">{toolTip.visible&&<Preview key={preview} id={preview}/>}</div></div>
   </aside>

   <main className="lab-center">
    <div className="scene-meta"><span>Epidermis bawang merah · Preparat basah</span></div>
    <div className={camera?'camera-toolbar active':'camera-toolbar'}>{mode==='latihan'&&<button className="toolbar-step-btn" onClick={()=>{dispatch({type:'resetStep',snapshot:snapshots.current[state.step]||initial(mode)});setSelected('');}}>Reset langkah {state.step+1}</button>}<button aria-pressed={camera} onClick={()=>{sound('touch');setCamera(!camera);}}>{camera?'Selesai menggeser':'Geser kamera'}</button><button onClick={()=>{sound('touch');setCameraKey(k=>k+1);setCamera(false);}}>Pusatkan</button>{state.step>=9&&<button onClick={()=>{sound('touch');setScope(true);}}>Buka mikroskop</button>}</div>
    <div className="lab-toast" role="status" key={state.event}><span className={state.feedback?'error':''}/>{state.log.at(-1)||'Mulai dengan mengenakan APD di panel alat.'}</div>
    <div className={camera?'scene camera-active':'scene'} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('text/bio-tool');if(id){dispatch({type:'add',id});setSelected(id);setToolTip(v=>({...v,visible:false}));}}}>{!portrait&&<Scene state={state} cameraMode={camera} resetKey={cameraKey} reduced={reduced} onMove={(id,pos)=>dispatch({type:'move',id,pos})} onDrop={interact} onClick={click}/>}</div>
    <div className="scene-help">{camera?'Geser pandangan; matikan Geser kamera untuk kembali memindahkan alat.':selected?'Dipilih: '+epidermisTools.find(t=>t.id===selected)?.name+' · Seret ke tujuan atau ketuk alat tujuan.':'Kamera terkunci · Seret alat di meja · Scroll / cubit untuk zoom'}</div>
    <div className="bio-controls"><details><summary>Kontrol sentuh & keyboard</summary><p>Pilih alat dan tujuan untuk melakukan interaksi yang sama seperti menyeret.</p><div><label>Alat<select aria-label="Alat" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Pilih alat</option>{state.objects.map(o=><option key={o.id} value={o.id}>{epidermisTools.find(t=>t.id===o.id)!.name}</option>)}</select></label><label>Tujuan<select aria-label="Tujuan" value={target} onChange={e=>setTarget(e.target.value)}>{['slide','onion','microscope'].filter(id=>state.objects.some(o=>o.id===id)).map(id=><option key={id} value={id}>{epidermisTools.find(t=>t.id===id)!.name}</option>)}</select></label><button disabled={!selected||!state.objects.some(o=>o.id===target)} onClick={()=>interact(selected,target)}>Gunakan</button></div></details></div>
   </main>
   <aside className={drawer==='notes'?'notes opened':'notes'}><div className="panel-heading mobile-notes-heading"><div><h2>{mode==='latihan'?'Panduan praktikum':'Catatan percobaan'}</h2><small>Langkah {state.step+1} dari 11</small></div><button type="button" className="panel-close-btn" aria-label="Tutup panel" onClick={()=>setDrawer('')}>×</button></div>
    {mode==='latihan'?<div className="step-accordions">{steps.map(([title,detail],i)=><details key={title} open={i===state.step} className={i===state.step?'current':i<state.step?'done':''}><summary><span>{i<state.step?'✓':i+1}</span>{title}</summary><p>{detail}</p></details>)}</div>:<p>Siapkan preparat epidermis bawang merah, amati menggunakan mikroskop cahaya, lalu identifikasi struktur sel yang terlihat. Pembesaran total = pembesaran okuler × objektif.</p>}
    <section><h2>Catatan pengamatan</h2><p>Jaringan epidermis adalah lapisan permukaan sisik umbi. Preparat harus tipis agar cahaya dapat menembusnya.</p><p>Lugol membantu memperjelas kontras. Warna dan keterlihatan struktur pada preparat nyata dapat berbeda.</p></section>
    {audioError&&<p role="status">Suara tidak tersedia. Konfirmasi visual tetap aktif.</p>}
   </aside>
  </div>
  {drawer!==''&&<div className="drawer-backdrop" onClick={()=>setDrawer('')}/>}
  <div className="portrait-gate" role="status"><BiologyIcon/><h2>Putar perangkat ke landscape.</h2><p>Ruang praktikum membutuhkan bidang kerja mendatar agar alat dapat dipindahkan dengan akurat.</p></div>
  <MicroscopeView state={state} dispatch={dispatch} open={scope&&!portrait} onClose={()=>setScope(false)}/>
 </div>;
}
function EpidermisResults({state,reset}:{state:State;reset:()=>void}){return <main className="content biology-page epidermis-results"><ProgressRecorder lab="biology_onion_epidermis" mode={state.mode} score={state.mode==='ujian'?score(state):null}/><Logo/><h1>{state.expired?'Waktu ujian selesai':'Pengamatan selesai'}</h1><p className="result-score">Nilai praktikum <strong>{score(state)}/100</strong></p><p>{state.expired?'Tinjau tahapan yang belum selesai dan coba kembali.':'Kamu telah menyiapkan preparat, mengatur mikroskop, dan mengenali struktur sel epidermis.'}</p><section><h2>Hasil observasi</h2><dl>{structures.map((name,i)=><div key={name}><dt>{name}</dt><dd>{state.marked.includes(i)?'Ditandai · '+state.attempts[i]+' percobaan':'Belum ditandai'}</dd></div>)}</dl><p>Dinding sel membatasi bentuk sel; vakuola menempati ruang besar di bagian dalam; inti sel tampak sebagai struktur lebih gelap. Sel epidermis umbi umumnya tidak memperlihatkan kloroplas.</p></section><section><h2>Rincian penilaian</h2>{Object.keys(state.penalties).length?<dl>{Object.entries(state.penalties).map(([name,n])=><div key={name}><dt>{name}</dt><dd>−{n}</dd></div>)}</dl>:<p>Seluruh tahapan dan penandaan selesai tanpa pengurangan nilai.</p>}</section><details><summary>Rekaman praktikum · {state.log.length} tindakan</summary><ol>{state.log.map((line,i)=><li key={i}>{line}</li>)}</ol></details><div className="result-actions"><button onClick={reset}>Ulangi {state.mode}</button><Link className="button" href="/biologi/epidermis-bawang">Pilih mode</Link><Link href="/biologi">Kembali ke biologi</Link></div></main>}

