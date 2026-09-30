'use client';

import {Canvas} from '@react-three/fiber';
import {Bounds,Center,OrbitControls} from '@react-three/drei';
import {Component,ReactNode,useMemo,useState} from 'react';
import {DoubleSide,Vector2} from 'three';
import type {EquipmentId} from '@/lib/introduction';

type Position=[number,number,number];
const glass='#b8dce3',metal='#8eaaa9',rubber='#ab343d';
function Part({at=[0,0,0],size,color=metal,rotate=[0,0,0],round=false}:{at?:Position;size:Position;color?:string;rotate?:Position;round?:boolean}) {
 return <mesh position={at} rotation={rotate} scale={size}>{round?<sphereGeometry args={[1,24,16]}/>:<boxGeometry args={[1,1,1]}/>}<meshStandardMaterial color={color} roughness={.38}/></mesh>;
}
function Rod({at=[0,0,0],radius=.025,height=1,color=metal,rotate=[0,0,0]}:{at?:Position;radius?:number;height?:number;color?:string;rotate?:Position}) {
 return <mesh position={at} rotation={rotate}><cylinderGeometry args={[radius,radius,height,24]}/><meshStandardMaterial color={color} roughness={.28}/></mesh>;
}
function Ring({at,radius,tube=.014,color=metal}:{at:Position;radius:number;tube?:number;color?:string}) {
 return <mesh position={at} rotation={[Math.PI/2,0,0]}><torusGeometry args={[radius,tube,8,40]}/><meshStandardMaterial color={color}/></mesh>;
}
function Vessel({profile,color=glass,opaque=false}:{profile:[number,number][];color?:string;opaque?:boolean}) {
 const points=useMemo(()=>profile.map(([r,y])=>new Vector2(r,y)),[profile]);
 return <mesh><latheGeometry args={[points,40]}/><meshStandardMaterial color={color} side={DoubleSide} transparent={!opaque} opacity={opaque?1:.65} roughness={.2} depthWrite={opaque}/></mesh>;
}
function Marks({radius,from,count,step}:{radius:number;from:number;count:number;step:number}) {
 return <>{Array.from({length:count},(_,i)=><Part key={i} at={[0,from+i*step,radius+.005]} size={[i%5===0?.11:.06,.009,.006]} color="#34575c"/>)}</>;
}
function Tube(){return <><Vessel profile={[[0,0],[.055,.013],[.09,.055],[.1,.11],[.1,.85],[.088,.85],[.088,.12],[.07,.065],[0,.02]]}/><Ring at={[0,.85,0]} radius={.096} color={glass}/></>}

export function EquipmentModel({id}:{id:EquipmentId}) {
 switch(id){
 case 'goggles':return <group>
  <Part size={[1,.42,.055]} color={glass}/>
  {[-1,1].map(side=><group key={side}><Part at={[side*.51,0,-.08]} size={[.045,.46,.25]} color="#456a6d"/><Part at={[side*.35,0,-.14]} size={[.28,.36,.2]} color={glass}/></group>)}
  {[-1,1].map(side=><Part key={side} at={[0,side*.225,0]} size={[1.03,.045,.11]} color="#456a6d"/>)}
  <mesh position={[0,0,-.21]} rotation={[Math.PI/2,0,0]} scale={[1,.62,1]}><torusGeometry args={[.48,.03,8,48]}/><meshStandardMaterial color="#334e50"/></mesh>
  <Part at={[0,-.18,.04]} size={[.1,.07,.07]} color="#456a6d" round/>
 </group>;
 case 'coat':return <group>
  <mesh><cylinderGeometry args={[.32,.40,1.12,8]}/><meshStandardMaterial color="#f0f1f4"/></mesh>
  {[-1,1].map(side=><group key={side}><Rod at={[side*.45,.19,0]} height={.78} radius={.12} color="#e6eaee" rotate={[0,0,side*.3]}/><Part at={[side*.2,-.22,.35]} size={[.18,.2,.025]} color="#dde4e9"/><Part at={[side*.1,.46,.27]} size={[.17,.24,.025]} color="#d4dde4" rotate={[0,0,side*.45]}/></group>)}
  <Part at={[0,-.03,.37]} size={[.012,.96,.013]} color="#a3b2bf"/>
  {[0,.16,.32,-.16,-.32].map(y=><Part key={y} at={[.045,y,.38]} size={[.022,.022,.018]} color="#7e919e" round/>)}
 </group>;
 case 'gloves':return <group rotation={[0,0,-.1]}>
  {[-1,1].map(side=><group key={side} position={[side*.27,0,0]} rotation={[0,0,side*-.12]}><Part size={[.35,.4,.09]} color="#86b4cc" round/>{[0,1,2,3].map(i=><mesh key={i} position={[-.12+i*.078,.28-(i===3?.045:0),0]}><capsuleGeometry args={[.037,.24-(i===3?.07:0),6,12]}/><meshStandardMaterial color="#86b4cc"/></mesh>)}<Part at={[-.22,.03,0]} size={[.065,.18,.045]} color="#86b4cc" rotate={[0,0,-.6]} round/><Part at={[0,-.24,0]} size={[.26,.15,.085]} color="#749cb4"/></group>)}
 </group>;
 case 'stand':return <group><Part at={[0,0,0]} size={[.85,.06,.6]} color="#425758"/><Rod at={[-.28,.85,0]} height={1.7}/><Part at={[-.28,1.1,0]} size={[.09,.11,.1]} color="#344a4d"/><Rod at={[.02,1.1,0]} height={.6} radius={.018} rotate={[0,0,Math.PI/2]}/><Ring at={[.33,1.1,0]} radius={.08} tube={.02} color={rubber}/><Part at={[-.32,1.1,.1]} size={[.13,.03,.06]} color="#344a4d"/></group>;
 case 'burette':return <group><Vessel profile={[[.015,0],[.025,.16],[.046,.22],[.046,1.7],[.034,1.7],[.034,.22],[.008,.16]]}/><Ring at={[0,1.7,0]} radius={.043} color={glass}/><Marks radius={.046} from={.32} count={24} step={.055}/><Rod at={[.04,.2,0]} height={.2} radius={.025} color={rubber} rotate={[0,0,Math.PI/2]}/><Part at={[.14,.2,0]} size={[.035,.11,.055]} color={rubber}/></group>;
 case 'flask':return <group><Vessel profile={[[0,0],[.3,0],[.31,.04],[.1,.56],[.1,.78],[.087,.78],[.087,.56],[.29,.04],[0,.025]]}/><Ring at={[0,.78,0]} radius={.096} color={glass}/><Marks radius={.23} from={.17} count={3} step={.08}/></group>;
 case 'beaker':return <group><Vessel profile={[[0,0],[.32,0],[.32,.66],[.30,.66],[.30,.025],[0,.025]]}/><Ring at={[0,.66,0]} radius={.31} color={glass}/><Part at={[.32,.65,0]} size={[.10,.025,.07]} color={glass} rotate={[0,0,.3]}/><Marks radius={.32} from={.12} count={6} step={.08}/></group>;
 case 'cylinder':return <group><mesh position={[0,.035,0]}><cylinderGeometry args={[.25,.25,.07,6]}/><meshStandardMaterial color="#607f85"/></mesh><Vessel profile={[[0,.07],[.11,.07],[.11,1.24],[.096,1.24],[.096,.09],[0,.09]]}/><Ring at={[0,1.24,0]} radius={.104} color={glass}/><Part at={[.11,1.24,0]} size={[.055,.02,.04]} color={glass}/><Marks radius={.11} from={.2} count={17} step={.055}/></group>;
 case 'volumetric':return <group><Vessel profile={[[0,0],[.19,0],[.29,.15],[.3,.28],[.24,.43],[.07,.59],[.07,1.05],[.056,1.05],[.056,.59],[.22,.43],[.28,.28],[.27,.15],[.17,.025],[0,.025]]}/><Ring at={[0,.86,0]} radius={.071} tube={.006} color={rubber}/><mesh position={[0,1.08,0]}><cylinderGeometry args={[.085,.06,.1,20]}/><meshStandardMaterial color="#e4eef1"/></mesh></group>;
 case 'pipette':return <group rotation={[0,0,-.15]}><Vessel profile={[[.009,0],[.02,.12],[.02,.5],[.065,.59],[.065,.78],[.02,.88],[.02,1.35]]}/><Ring at={[0,1.1,0]} radius={.021} tube={.004} color={rubber}/></group>;
 case 'dropper':return <group rotation={[0,0,-.2]}><Vessel profile={[[.006,0],[.027,.12],[.027,.66]]}/><mesh position={[0,.77,0]}><capsuleGeometry args={[.065,.18,8,20]}/><meshStandardMaterial color={rubber}/></mesh></group>;
 case 'propipette':return <group><Part at={[0,.24,0]} size={[.24,.25,.22]} color={rubber} round/><Rod at={[0,-.07,0]} radius={.04} height={.26} color={rubber}/><Rod at={[0,.52,0]} radius={.045} height={.12} color={rubber}/><Rod at={[.2,.01,0]} radius={.04} height={.24} color={rubber} rotate={[0,0,Math.PI/2]}/><Part at={[.3,.01,0]} size={[.06,.07,.07]} color="#732b32" round/></group>;
 case 'tube':return <Tube/>;
 case 'rack':return <group><Part at={[0,0,0]} size={[1.25,.07,.45]} color="#c2986d"/>{[-.59,.59].map(x=><Part key={x} at={[x,.25,0]} size={[.05,.5,.45]} color="#c2986d"/>)}{[-.2,.2].map(z=><Part key={z} at={[0,.5,z]} size={[1.25,.04,.06]} color="#c2986d"/>)}{[-.5,-.25,0,.25,.5].map(x=><group key={x}><Ring at={[x,.5,0]} radius={.102} tube={.028} color="#c2986d"/><group position={[x,.04,0]} scale={.78}><Tube/></group></group>)}</group>;
 case 'holder':return <group rotation={[0,0,-.35]}>{[-1,1].map(side=><group key={side}><Part at={[side*.065,0,0]} size={[.08,.85,.08]} color="#c4a477" rotate={[0,0,side*.08]}/><Part at={[side*.055,.44,0]} size={[.06,.08,.1]} color="#ae8859"/></group>)}<Rod at={[0,-.12,0]} height={.22} radius={.025} rotate={[0,0,Math.PI/2]}/></group>;
 case 'funnel':return <group><Vessel profile={[[.025,0],[.025,.36],[.31,.72],[.30,.735],[.014,.37],[.014,0]]}/><Ring at={[0,.735,0]} radius={.305} color={glass}/></group>;
 case 'rod':return <group rotation={[0,0,-.3]}><mesh><capsuleGeometry args={[.025,1.25,6,20]}/><meshStandardMaterial color={glass} roughness={.15}/></mesh></group>;
 case 'spatula':return <group rotation={[0,0,-.3]}><Rod height={.95} radius={.018}/><Part at={[0,.55,0]} size={[.12,.28,.015]}/><mesh position={[0,-.57,0]} scale={[.08,.14,.035]}><sphereGeometry args={[1,24,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color={metal} side={DoubleSide}/></mesh></group>;
 case 'mortar':return <group><Vessel opaque color="#e4e7ea" profile={[[0,0],[.24,0],[.36,.14],[.42,.42],[.35,.42],[.29,.17],[0,.1]]}/><mesh position={[.11,.45,0]} rotation={[0,0,-.55]}><capsuleGeometry args={[.075,.63,8,24]}/><meshStandardMaterial color="#c4ced5"/></mesh><Ring at={[0,.42,0]} radius={.385} tube={.034} color="#e4e7ea"/></group>;
 case 'burner':return <group><Vessel profile={[[0,0],[.29,0],[.32,.07],[.29,.27],[.12,.36],[.12,.4]]}/><Rod at={[0,.41,0]} radius={.13} height={.07}/><Rod at={[0,.49,0]} radius={.025} height={.13} color="#d7c6a4"/><group position={[.43,0,0]}><Vessel opaque color={metal} profile={[[.13,0],[.13,.19],[.07,.24],[0,.24]]}/></group></group>;
 }
}

class PreviewBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<p className="course-preview-loading">Model 3D tidak tersedia. Ciri pengenal alat tetap dapat dibaca di materi.</p>:this.props.children}
}

export default function EquipmentPreview({id}:{id:EquipmentId}) {
 const [angle,setAngle]=useState(0);
 return <div className="equipment-viewer">
  <div className="equipment-canvas" role="img" aria-label={'Model 3D '+id}>
   <PreviewBoundary><Canvas key={id} dpr={[1,1.5]} frameloop="demand" camera={{position:[2,1.3,3],fov:38}} fallback={<p>WebGL tidak tersedia. Baca ciri pengenal alat di materi.</p>}>
    <ambientLight intensity={1.8}/><directionalLight position={[3,5,4]} intensity={2.5}/><directionalLight position={[-3,2,-1]} intensity={1}/>
    <Bounds fit clip observe margin={1.35}><Center><group rotation={[0,angle,0]}><EquipmentModel id={id}/></group></Center></Bounds>
    <OrbitControls makeDefault enablePan={false} enableZoom={false}/>
   </Canvas></PreviewBoundary>
  </div>
  <div className="model-controls"><button type="button" aria-label="Putar alat ke kiri" onClick={()=>setAngle(value=>value-Math.PI/6)}>Putar kiri</button><span>Seret untuk memutar</span><button type="button" aria-label="Putar alat ke kanan" onClick={()=>setAngle(value=>value+Math.PI/6)}>Putar kanan</button></div>
 </div>;
}
