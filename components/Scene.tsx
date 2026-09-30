'use client';
import {Canvas,ThreeEvent,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls,Html} from '@react-three/drei';
import {useEffect,useMemo,useRef,useState} from 'react';import * as THREE from 'three';
import {tools,targets,State,Action} from '@/lib/lab';

function Glass({children}:{children:React.ReactNode}){return <group>{children}</group>}

export function Model({id,pink=false,filled=false,over=false,loaded=false}:{id:string;pink?:boolean;filled?:boolean;over?:boolean;loaded?:boolean}){
 const flaskLathe=useMemo(()=>new THREE.LatheGeometry([
  new THREE.Vector2(.02,0),
  new THREE.Vector2(.185,.015),
  new THREE.Vector2(.19,.05),
  new THREE.Vector2(.068,.38),
  new THREE.Vector2(.062,.485),
  new THREE.Vector2(.076,.50)
 ],20),[]);

 const bottleLabel=useMemo(()=>{
  if(typeof document==='undefined')return null;
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=144;
  const context=canvas.getContext('2d');if(!context)return null;
  context.fillStyle='#fffdf7';context.fillRect(0,0,256,144);
  context.strokeStyle='#c8323b';context.lineWidth=7;context.strokeRect(9,9,52,52);
  context.fillStyle='#202522';context.font='700 44px sans-serif';
  context.fillText(({naoh:'NaOH',hcl:'HCl',indicator:'PhPh',water:'H₂O'} as Record<string,string>)[id]||id,74,57);
  context.font='22px sans-serif';context.fillStyle='#59615c';
  context.fillText(id==='indicator'?'Indikator':id==='water'?'Deionisasi':'Larutan',74,94);
  context.fillStyle='#c8323b';context.beginPath();context.arc(35,35,8,0,Math.PI*2);context.fill();
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
 },[id]);

 const glass=<meshPhysicalMaterial color="#ffffff" transmission={0.90} opacity={1} roughness={0.06} metalness={0.02} ior={1.48} thickness={0.06} transparent side={THREE.DoubleSide}/>;
 const chrome=<meshStandardMaterial color="#c5cbc7" metalness={0.85} roughness={0.16}/>;
 const darkIron=<meshStandardMaterial color="#2d3330" roughness={0.55} metalness={0.25}/>;
 const whiteTile=<meshStandardMaterial color="#fafaf8" roughness={0.22} metalness={0.04}/>;
 const kind=tools.find(t=>t.id===id)?.kind;

 if(kind==='flask')return <Glass>
  <mesh geometry={flaskLathe}>{glass}</mesh>
  <mesh position={[0,.495,0]}><torusGeometry args={[.068,.007,8,20]}/><meshStandardMaterial color="#d4e8e4" roughness={.1}/></mesh>
  {filled&&<mesh position={[0,.11,0]}><cylinderGeometry args={[.09,.176,.2,18]}/><meshStandardMaterial color={over?'#c9287a':pink?'#f5b5cc':'#e5eee8'} transparent opacity={.85} roughness={.1}/></mesh>}
  <mesh position={[0,.28,.11]}><boxGeometry args={[.08,.02,.01]}/><meshStandardMaterial color="#ffffff" opacity={.9} transparent/></mesh>
  <mesh position={[0,.20,.16]}><boxGeometry args={[.08,.02,.01]}/><meshStandardMaterial color="#ffffff" opacity={.9} transparent/></mesh>
 </Glass>;

 if(kind==='stand')return <group>
  {/* Base plate */}
  <mesh position={[0,.028,0]}><boxGeometry args={[.66,.055,.46]}/>{darkIron}</mesh>
  {/* White titration observation plate directly under burette */}
  <mesh position={[.28,.058,0]}><boxGeometry args={[.32,.006,.32]}/>{whiteTile}</mesh>
  {/* Upright metal rod */}
  <mesh position={[-.20,1.22,0]}><cylinderGeometry args={[.022,.022,2.44,14]}/>{chrome}</mesh>
  <mesh position={[-.20,2.44,0]}><sphereGeometry args={[.026,12,8]}/>{chrome}</mesh>
  {/* Bosshead / clamp holder */}
  <mesh position={[-.20,1.55,0]}><boxGeometry args={[.07,.08,.07]}/>{darkIron}</mesh>
  <mesh position={[-.24,1.55,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.012,.012,.08,8]}/>{darkIron}</mesh>
  {/* Extension rod to burette */}
  <mesh position={[.04,1.55,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.014,.014,.42,8]}/>{chrome}</mesh>
  {/* Dual clamp jaws wrapped around burette position (x = 0.28) */}
  <mesh position={[.25,1.55,.036]} rotation={[0,.2,0]}><boxGeometry args={[.10,.045,.018]}/><meshStandardMaterial color="#9c3232"/></mesh>
  <mesh position={[.25,1.55,-.036]} rotation={[0,-.2,0]}><boxGeometry args={[.10,.045,.018]}/><meshStandardMaterial color="#9c3232"/></mesh>
  <mesh position={[.32,1.55,0]}><boxGeometry args={[.035,.045,.08]}/>{darkIron}</mesh>
 </group>;

 if(kind==='burette')return <group>
  {/* Long slender burette barrel (height 1.64, radius 0.034) */}
  <mesh position={[0,1.06,0]}><cylinderGeometry args={[.034,.034,1.64,16]}/>{glass}</mesh>
  {/* Top reinforced rim */}
  <mesh position={[0,1.88,0]}><torusGeometry args={[.034,.006,8,20]}/><meshStandardMaterial color="#d4e8e4" roughness={.1}/></mesh>
  {/* Liquid column inside burette */}
  <mesh position={[0,.96,0]}><cylinderGeometry args={[.024,.024,1.44,12]}/><meshStandardMaterial color="#a7c8c6" transparent opacity={.58}/></mesh>
  {/* Fine graduation markings along the burette */}
  {Array.from({length:22},(_,i)=><mesh key={i} position={[0,.28+i*.072,.035]}><boxGeometry args={[i%5===0?.055:.030,.004,.003]}/><meshBasicMaterial color="#22332e"/></mesh>)}
  {/* Valve / stopcock casing */}
  <mesh position={[0,.19,0]}><cylinderGeometry args={[.038,.038,.09,12]}/>{glass}</mesh>
  {/* Stopcock valve handle in laboratory red */}
  <mesh position={[.04,.19,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.018,.018,.14,10]}/><meshStandardMaterial color="#b72d2d" roughness={.35}/></mesh>
  <mesh position={[.095,.19,0]}><boxGeometry args={[.02,.07,.032]}/><meshStandardMaterial color="#b72d2d" roughness={.35}/></mesh>
  {/* Tapered dispensing tip */}
  <mesh position={[0,.08,0]}><cylinderGeometry args={[.018,.007,.14,10]}/>{glass}</mesh>
 </group>;

 if(kind==='pipette')return <group rotation={[0,0,Math.PI/2]}>
  <mesh position={[0,.48,0]}><cylinderGeometry args={[.010,.007,1.02,12]}/>{glass}</mesh>
  {loaded&&<mesh position={[0,.42,0]}><cylinderGeometry args={[.007,.005,.72,8]}/><meshStandardMaterial color="#9fc8c3" transparent opacity={.82}/></mesh>}
  {/* Central expansion bulb */}
  <mesh position={[0,.48,0]} scale={[1,2.5,1]}><sphereGeometry args={[.042,16,12]}/>{glass}</mesh>
  {/* Etched mark ring */}
  <mesh position={[0,.78,0]}><torusGeometry args={[.011,.002,6,16]}/><meshBasicMaterial color="#33443e"/></mesh>
  {/* Propipet rubber bulb at the top */}
  <mesh position={[0,1.02,0]} scale={[.85,1.25,.85]}><sphereGeometry args={[.08,16,12]}/><meshStandardMaterial color="#b73030" roughness={.4}/></mesh>
  <mesh position={[-.06,1.02,0]}><cylinderGeometry args={[.018,.018,.04,8]}/><meshStandardMaterial color="#a02626"/></mesh>
 </group>;

 if(kind==='funnel')return <group>
  {/* Upper glass cone */}
  <mesh position={[0,.22,0]}><coneGeometry args={[.15,.18,20,1,true]}/>{glass}</mesh>
  {/* Rolled rim */}
  <mesh position={[0,.31,0]}><torusGeometry args={[.15,.009,8,24]}/><meshStandardMaterial color="#d4e8e4" roughness={.1}/></mesh>
  {/* Lower stem fitting into burette mouth */}
  <mesh position={[0,.06,0]}><cylinderGeometry args={[.016,.012,.22,12]}/>{glass}</mesh>
 </group>;

 if(id==='goggles')return <group position={[0,.16,0]}>
  <mesh position={[-.14,0,0]} scale={[1.35,.82,1]}><torusGeometry args={[.105,.018,10,24]}/><meshStandardMaterial color="#293a3a"/></mesh>
  <mesh position={[.14,0,0]} scale={[1.35,.82,1]}><torusGeometry args={[.105,.018,10,24]}/><meshStandardMaterial color="#293a3a"/></mesh>
  <mesh position={[-.14,0,-.006]} scale={[1.2,.72,1]}><circleGeometry args={[.095,24]}/><meshStandardMaterial color="#b9d5d2" transparent opacity={.45}/></mesh>
  <mesh position={[.14,0,-.006]} scale={[1.2,.72,1]}><circleGeometry args={[.095,24]}/><meshStandardMaterial color="#b9d5d2" transparent opacity={.45}/></mesh>
  <mesh position={[0,0,0]}><boxGeometry args={[.075,.025,.025]}/><meshStandardMaterial color="#293a3a"/></mesh>
  <mesh position={[0,0,-.04]} scale={[1.1,.65,1]}><torusGeometry args={[.29,.012,8,24,Math.PI]}/><meshStandardMaterial color="#536664"/></mesh>
 </group>;

 if(id==='coat')return <group position={[0,.35,0]}>
  <mesh position={[0,0,0]}><boxGeometry args={[.38,.62,.1]}/><meshStandardMaterial color="#f4f3ef"/></mesh>
  <mesh position={[-.28,.02,0]} rotation={[0,0,-.18]}><capsuleGeometry args={[.065,.45,6,12]}/><meshStandardMaterial color="#efeee9"/></mesh>
  <mesh position={[.28,.02,0]} rotation={[0,0,.18]}><capsuleGeometry args={[.065,.45,6,12]}/><meshStandardMaterial color="#efeee9"/></mesh>
  <mesh position={[-.09,.18,.06]} rotation={[0,0,-.35]}><boxGeometry args={[.16,.28,.018]}/><meshStandardMaterial color="#deddd8"/></mesh>
  <mesh position={[.09,.18,.06]} rotation={[0,0,.35]}><boxGeometry args={[.16,.28,.018]}/><meshStandardMaterial color="#e8e7e2"/></mesh>
  <mesh position={[0,-.05,.06]}><boxGeometry args={[.015,.46,.018]}/><meshStandardMaterial color="#aeb2ad"/></mesh>
  {[-.12,.12].map(x=><mesh key={x} position={[x,-.15,.065]}><boxGeometry args={[.12,.1,.02]}/><meshStandardMaterial color="#d8d8d3"/></mesh>)}
 </group>;

 if(id==='gloves')return <group position={[0,.12,0]} rotation={[-.18,0,-.25]}>
  <mesh scale={[1.1,.8,.55]}><sphereGeometry args={[.15,18,12]}/><meshStandardMaterial color="#78a7bb"/></mesh>
  {[-.1,-.035,.035,.1].map((x,i)=><mesh key={x} position={[x,.17+(i%2)*.015,0]}><capsuleGeometry args={[.026,.17,5,8]}/><meshStandardMaterial color="#78a7bb"/></mesh>)}
  <mesh position={[-.16,.06,0]} rotation={[0,0,-.7]}><capsuleGeometry args={[.03,.14,5,8]}/><meshStandardMaterial color="#78a7bb"/></mesh>
  <mesh position={[0,-.16,0]}><cylinderGeometry args={[.105,.13,.18,14]}/><meshStandardMaterial color="#6999ae"/></mesh>
 </group>;

 if(kind==='beaker')return <group>
  <mesh position={[0,.18,0]}><cylinderGeometry args={[.16,.15,.36,22,1,true]}/>{glass}</mesh>
  <mesh position={[0,.36,0]}><torusGeometry args={[.16,.011,8,24]}/><meshStandardMaterial color="#d4e8e4" roughness={.1}/></mesh>
  {Array.from({length:4},(_,i)=><mesh key={i} position={[0,.12+i*.06,.155]}><boxGeometry args={[.04,.004,.002]}/><meshBasicMaterial color="#2d3f38"/></mesh>)}
 </group>;

 // Bottles (NaOH, HCl, Indikator Fenolftalein, Air Deionisasi)
 if(id==='indicator')return <group>
  {/* Amber dropper bottle */}
  <mesh position={[0,.20,0]}><cylinderGeometry args={[.14,.15,.40,20]}/><meshStandardMaterial color="#5c381e" roughness={.25}/></mesh>
  <mesh position={[0,.40,0]}><sphereGeometry args={[.13,18,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#5c381e" roughness={.25}/></mesh>
  <mesh position={[0,.48,0]}><cylinderGeometry args={[.065,.065,.10,16]}/><meshStandardMaterial color="#1a1c1a" roughness={.4}/></mesh>
  {/* Dropper bulb at top */}
  <mesh position={[0,.57,0]}><sphereGeometry args={[.062,14,10]}/><meshStandardMaterial color="#1a1a1a" roughness={.6}/></mesh>
  <mesh position={[0,.22,.145]}><planeGeometry args={[.22,.14]}/><meshBasicMaterial map={bottleLabel||undefined} toneMapped={false}/></mesh>
 </group>;

 if(id==='water')return <group>
  {/* Wash bottle with angled dispenser spout */}
  <mesh position={[0,.24,0]}><cylinderGeometry args={[.15,.17,.46,20]}/><meshStandardMaterial color="#edf4f5" roughness={.35} transparent opacity={.75}/></mesh>
  <mesh position={[0,.48,0]}><cylinderGeometry args={[.08,.08,.09,16]}/><meshStandardMaterial color="#2a5f78" roughness={.45}/></mesh>
  {/* Curved squirt nozzle */}
  <mesh position={[.06,.56,0]} rotation={[0,0,-.45]}><cylinderGeometry args={[.014,.014,.18,8]}/><meshStandardMaterial color="#2a5f78" roughness={.45}/></mesh>
  <mesh position={[0,.25,.16]}><planeGeometry args={[.24,.14]}/><meshBasicMaterial map={bottleLabel||undefined} toneMapped={false}/></mesh>
 </group>;

 return <group>
  <mesh position={[0,.22,0]}><cylinderGeometry args={[.16,.18,.42,20]}/><meshStandardMaterial color="#e8e9e3" roughness={.35}/></mesh>
  <mesh position={[0,.43,0]}><sphereGeometry args={[.15,20,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#e8e9e3" roughness={.35}/></mesh>
  <mesh position={[0,.53,0]}><cylinderGeometry args={[.085,.085,.14,20]}/><meshStandardMaterial color={id==='naoh'?'#b72d37':'#27312c'} roughness={.55}/></mesh>
  <mesh position={[0,.25,.171]}><planeGeometry args={[.27,.15]}/><meshBasicMaterial map={bottleLabel||undefined} toneMapped={false}/></mesh>
  <mesh position={[0,.08,0]}><cylinderGeometry args={[.145,.16,.11,20]}/><meshStandardMaterial color={id==='naoh'?'#d9e6e2':'#e7dfd0'} transparent opacity={.72}/></mesh>
 </group>;
}

function Item({obj,state,dispatch,select,selected,cameraMode,onInteract,modalOpen}:{obj:State['objects'][number];state:State;dispatch:React.Dispatch<Action>;select:(id:string)=>void;selected:boolean;cameraMode:boolean;onInteract:()=>void;modalOpen?:boolean}){
 const [hover,setHover]=useState(false);const dragging=useRef(false);const lastPos=useRef<[number,number,number]|null>(null);const {raycaster,invalidate}=useThree();const plane=useMemo(()=>new THREE.Plane(new THREE.Vector3(0,1,0),-.87),[]);
 const kind=tools.find(tool=>tool.id===obj.id)?.kind;
 const modelScale=kind==='stand'?1:kind==='burette'?1:kind==='pipette'?1:kind==='flask'?1:kind==='funnel'?1:kind==='beaker'?1:1;
 const near=(id:string,p:[number,number,number],distance=.65)=>{const other=state.objects.find(item=>item.id===id);return !!other&&Math.hypot(p[0]-other.pos[0],p[2]-other.pos[2])<distance};
 function move(e:ThreeEvent<PointerEvent>){if(cameraMode||!dragging.current||obj.locked)return;e.stopPropagation();const point=new THREE.Vector3();if(raycaster.ray.intersectPlane(plane,point)){let x=Math.max(-2.5,Math.min(2.5,point.x)),z=Math.max(-1,Math.min(1,point.z));if(state.step===8&&obj.id==='flask'){x=Math.max(-.68,Math.min(.08,x));z=Math.max(-.18,Math.min(.52,z));dispatch({type:'mix'})}const pos:[number,number,number]=[x,.87,z];lastPos.current=pos;dispatch({type:'move',id:obj.id,pos});invalidate()}}
 function up(e:ThreeEvent<PointerEvent>){e.stopPropagation();dragging.current=false;(e.target as Element).releasePointerCapture?.(e.pointerId);const p=lastPos.current||obj.pos;lastPos.current=null;
  if(state.step===1&&['stand','burette'].includes(obj.id)){const t=targets[obj.id];if(Math.hypot(p[0]-t[0],p[2]-t[2])<.68){dispatch({type:'move',id:obj.id,pos:t});dispatch({type:'lock',id:obj.id});return}}
  if(state.step===2&&obj.id==='naoh'&&near('burette',p)){dispatch({type:'rinse'});return}
  if(state.step===3&&obj.id==='funnel'&&near('burette',p)){dispatch({type:'placeFunnel'});return}
  if(state.step===3&&obj.id==='naoh'&&state.funnelPlaced&&near('burette',p)){dispatch({type:'fill'});return}
  if(state.step===4&&obj.id==='funnel'&&!near('burette',p,.85)){dispatch({type:'record'});return}
  if(state.step===5&&obj.id==='pipette'&&near('hcl',p)){dispatch({type:'loadPipette'});return}
  if(state.step===5&&obj.id==='pipette'&&state.pipetteLoaded&&near('flask',p)){dispatch({type:'pipette'});return}
  if(state.step===6&&obj.id==='indicator'&&near('flask',p)){dispatch({type:'indicator'});return}
  if(state.step===7&&obj.id==='flask'){const t=targets.flask;if(Math.hypot(p[0]-t[0],p[2]-t[2])<.68){dispatch({type:'move',id:'flask',pos:t});dispatch({type:'ready'});return}}
  if(state.step===8&&obj.id==='flask'){dispatch({type:'move',id:'flask',pos:targets.flask});dispatch({type:'mix'})}
 }
 return <group position={obj.pos} onPointerOver={e=>{e.stopPropagation();setHover(true)}} onPointerOut={()=>setHover(false)} onPointerDown={e=>{if(cameraMode)return;e.stopPropagation();onInteract();select(obj.id);dragging.current=!obj.locked;(e.target as Element).setPointerCapture?.(e.pointerId)}} onPointerMove={move} onPointerUp={up}>
 <group scale={modelScale}><Model id={obj.id} filled={state.step>=6} pink={state.indicator&&state.volume>=24.8} loaded={obj.id==='pipette'&&state.pipetteLoaded}/></group>{!modalOpen&&(hover||selected)&&<Html position={[0,kind==='burette'?1.75:kind==='stand'?2.35:kind==='flask'?.58:.75,0]} center style={{pointerEvents:'none',whiteSpace:'nowrap'}}><span className="object-label">{tools.find(t=>t.id===obj.id)?.name}{obj.locked?' · terpasang':''}</span></Html>}
 {selected&&<mesh rotation={[-Math.PI/2,0,0]} position={[0,.006,0]}><ringGeometry args={[.3,.32,24]}/><meshBasicMaterial color="#c62828" side={THREE.DoubleSide}/></mesh>}</group>
}

function Room(){return <group><mesh position={[0,-.1,0]}><boxGeometry args={[8,.15,6]}/><meshStandardMaterial color="#eeeee7"/></mesh><mesh position={[0,1.4,-2.6]}><boxGeometry args={[8,3,.1]}/><meshStandardMaterial color="#e0e3da"/></mesh><mesh position={[-3.8,1.4,0]}><boxGeometry args={[.1,3,5.2]}/><meshStandardMaterial color="#d6dcd3"/></mesh><mesh position={[0,.75,0]}><boxGeometry args={[6.8,.2,3.6]}/><meshStandardMaterial color="#e0d1b3"/></mesh><mesh position={[0,.64,0]}><boxGeometry args={[6.8,.06,3.6]}/><meshStandardMaterial color="#6b736a"/></mesh>{[-3,3].flatMap(x=>[-1.4,1.4].map(z=><mesh key={`${x}${z}`} position={[x,.3,z]}><boxGeometry args={[.1,.7,.1]}/><meshStandardMaterial color="#59665c"/></mesh>))}<mesh position={[1.8,1.6,-2.48]}><boxGeometry args={[2.1,1,.06]}/><meshStandardMaterial color="#f7f9ee"/></mesh><mesh position={[-2.9,.88,1.25]}><boxGeometry args={[.55,.04,.35]}/><meshStandardMaterial color="#f6f4e8"/></mesh></group>}
function Particles(){const ref=useRef<THREE.Points>(null);const positions=useMemo(()=>{const values=new Float32Array(90);for(let i=0;i<30;i++){values[i*3]=(Math.random()-.5)*6;values[i*3+1]=.9+Math.random()*2;values[i*3+2]=-1.8+Math.random()*3.6}return values},[]);useFrame((_,delta)=>{if(ref.current)ref.current.rotation.y+=delta*.018});return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color="#9fb4aa" size={.035} transparent opacity={.48} sizeAttenuation/></points>}
function CameraReset({resetKey}:{resetKey:number}){
 const {camera,size,invalidate}=useThree();
 useEffect(()=>{
  camera.position.set(6.8,6.2,7.8);
  camera.lookAt(0,1.35,0);
  if('zoom' in camera){
   const isNarrow=size.width<420;
   const isMobile=size.width<640;
   camera.zoom=isNarrow?48:isMobile?54:66;
   camera.updateProjectionMatrix();
  }
  invalidate();
 },[camera,size.width,invalidate,resetKey]);
 return null;
}

export default function Scene({state,dispatch,selected,select,cameraMode,resetKey,onInteract,modalOpen}:{state:State;dispatch:React.Dispatch<Action>;selected:string|null;select:(id:string)=>void;cameraMode:boolean;resetKey:number;onInteract:()=>void;modalOpen?:boolean}){
 const snapIds=state.step===1?['stand','burette']:state.step===7?['flask']:[];
 return <Canvas orthographic camera={{position:[6.8,6.2,7.8],zoom:66}} dpr={[1,1.5]} frameloop="always" fallback={<p>WebGL2 tidak tersedia. Gunakan browser terbaru untuk membuka lab.</p>}>
  <CameraReset resetKey={resetKey}/>
  <color attach="background" args={['#f2f3ed']}/>
  <hemisphereLight color="#ffffff" groundColor="#c8d1c8" intensity={1.8}/>
  <directionalLight position={[5,9,5]} intensity={2.2}/>
  <pointLight position={[-2,4,2]} intensity={1.2} color="#e8ffff"/>
  <Particles/>
  <Room/>
  {state.mode==='latihan'&&snapIds.map(id=>{const p=targets[id];return <mesh key={id} position={[p[0],.868,p[2]]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.28,.3,32]}/><meshBasicMaterial color="#bc5757" transparent opacity={.6}/></mesh>})}
  {state.objects.map(obj=><Item key={obj.id} obj={obj} state={state} dispatch={dispatch} selected={selected===obj.id} select={select} cameraMode={cameraMode} onInteract={onInteract} modalOpen={modalOpen}/>)}
  <OrbitControls makeDefault enableRotate={false} enablePan={cameraMode} enableZoom minZoom={35} maxZoom={120} target={[0,1.35,0]} mouseButtons={{LEFT:THREE.MOUSE.PAN,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.PAN}} touches={{ONE:THREE.TOUCH.PAN,TWO:THREE.TOUCH.DOLLY_PAN}}/>
 </Canvas>
}

export function Preview({id}:{id:string}){
 const kind=tools.find(t=>t.id===id)?.kind;
 const scale=kind==='burette'?.50:kind==='stand'?.44:kind==='pipette'?.62:1.15;
 const posY=kind==='burette'?-1.0:kind==='stand'?-1.05:kind==='pipette'?-.45:-.28;
 return <Canvas camera={{position:[2.2,1.6,3.2],fov:38}} dpr={1}>
  <ambientLight intensity={2.2}/>
  <directionalLight position={[4,5,4]} intensity={2.4}/>
  <group position={[0,posY,0]} scale={scale}>
   <Model id={id}/>
  </group>
  <OrbitControls autoRotate enableZoom={false} enablePan={false}/>
 </Canvas>;
}
