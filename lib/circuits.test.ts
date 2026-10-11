import {describe,it,expect} from 'vitest';
import {initial,reducer,score,solve,circuitTools,configForStep,type State,type Action,type Mode} from './circuits';

// Canonical latihan action sequence: one unambiguous trigger per langkah.
const assembly:Action[] = [
 {type:'connect',source:'jumper',target:'rail'},
 {type:'toggleSwitch'},
 {type:'connect',source:'ledA',target:'seri'},
 {type:'connect',source:'ledB',target:'seri'},
 {type:'connect',source:'ledC',target:'paralel'},
 {type:'connect',source:'ledB',target:'paralel-1'},
 {type:'connect',source:'ledC',target:'paralel-2'},
];
function placed(mode:Mode='latihan'):State{let s=initial(mode);for(const t of circuitTools)s=reducer(s,{type:'add',id:t.id});return s;}
function assembled(mode:Mode='latihan'):State{let s=placed(mode);for(const a of assembly)s=reducer(s,a);return s;}
const displayed=(s:State,i:number)=>s.switchOn?s.readout.lamps[i].brightness:0;

describe('circuits — series/parallel physics and reducer flow',()=>{
 it('solves series: R_total=200, I=0.03, each lamp half of single (AC-6a)',()=>{
  const single=solve('single'),series=solve('series2');
  expect(series.rTotal).toBe(200);expect(series.iSource).toBe(0.03);
  expect(series.lamps[0].current).toBe(single.lamps[0].current/2);
  expect(series.lamps[1].current).toBe(single.lamps[0].current/2);
 });
 it('solves parallel: each branch 0.06, total 0.18, R_total≈100/3 (AC-6b)',()=>{
  const parallel=solve('parallel3');
  for(const l of parallel.lamps)expect(l.current).toBe(0.06);
  expect(parallel.iSource).toBeCloseTo(0.18,10);
  expect(parallel.rTotal).toBeCloseTo(100/3,10);
 });
 it('solves combo3: R_total=150, I_A=0.04, I_B=I_C=0.02 (AC-6c)',()=>{
  const combo=solve('combo3');
  expect(combo.rTotal).toBe(150);
  expect(combo.lamps[0].current).toBeCloseTo(0.04,10);
  expect(combo.lamps[1].current).toBeCloseTo(0.02,10);
  expect(combo.lamps[2].current).toBeCloseTo(0.02,10);
 });
 it('challenge deep-equals combo3 (AC-6d)',()=>{expect(solve('challenge')).toEqual(solve('combo3'));});
 it('brightness ordering: parallel===single===1, single>series2, comboA>comboB===comboC≈ (AC-6e)',()=>{
  const single=solve('single'),series=solve('series2'),parallel=solve('parallel3'),combo=solve('combo3');
  expect(single.lamps[0].brightness).toBe(1);
  expect(parallel.lamps[0].brightness).toBe(1);
  expect(parallel.lamps[0].brightness).toBe(single.lamps[0].brightness);
  expect(single.lamps[0].brightness).toBeGreaterThan(series.lamps[0].brightness);
  expect(combo.lamps[0].brightness).toBeGreaterThan(combo.lamps[1].brightness);
  expect(combo.lamps[1].brightness).toBe(combo.lamps[2].brightness);
  expect(combo.lamps[0].brightness).toBeCloseTo(0.444,3);
 });
 it('canonical sequence advances step 0->7 and readout tracks configForStep',()=>{
  let s=placed();expect(s.step).toBe(1);
  const after=[2,2,3,4,5,6,7];
  assembly.forEach((a,i)=>{s=reducer(s,a);expect(s.step).toBe(after[i]);});
  expect(s.step).toBe(7);
  expect(s.readout).toEqual(solve(configForStep[7]));
 });
 it('toggleSwitch flips switchOn and gates displayed brightness',()=>{
  const s=assembled();expect(s.switchOn).toBe(true);
  for(let i=0;i<s.readout.lamps.length;i++)expect(displayed(s,i)).toBe(s.readout.lamps[i].brightness);
  const opened=reducer(s,{type:'toggleSwitch'});
  expect(opened.switchOn).toBe(false);
  for(let i=0;i<opened.readout.lamps.length;i++)expect(displayed(opened,i)).toBe(0);
 });
 it('wrong assembly in latihan: hint + attempts[step]++ and no penalty',()=>{
  let s=placed();const step=s.step; // step 1, Langkah 2 active
  s=reducer(s,{type:'connect',source:'ledA',target:'seri'});
  expect(s.step).toBe(step);
  expect(s.attempts[step]).toBe(1);
  expect(s.feedback).not.toBe('');
  expect(Object.keys(s.penalties)).toHaveLength(0);
 });
 it('wrong assembly in ujian: Perakitan penalty Math.min(20,prev+5) + attempts[step]++',()=>{
  let s=placed('ujian');const step=s.step;
  s=reducer(s,{type:'connect',source:'ledA',target:'seri'});
  expect(s.penalties.Perakitan).toBe(5);
  expect(s.attempts[step]).toBe(1);
  s=reducer(s,{type:'connect',source:'ledA',target:'seri'});
  expect(s.penalties.Perakitan).toBe(10);
  expect(s.attempts[step]).toBe(2);
 });
 it('quiz in ujian: wrong answer adds Perhitungan penalty Math.min(15,prev+5)',()=>{
  let s=initial('ujian');
  s=reducer(s,{type:'answerQuiz',index:0,choice:1});expect(s.penalties.Perhitungan).toBe(5);
  s=reducer(s,{type:'answerQuiz',index:1,choice:0});expect(s.penalties.Perhitungan).toBe(10);
  s=reducer(s,{type:'answerQuiz',index:2,choice:1});expect(s.penalties.Perhitungan).toBe(15);
  s=reducer(s,{type:'answerQuiz',index:3,choice:1});expect(s.penalties.Perhitungan).toBe(15);
  expect(s.quiz[0]).toBe(1);
 });
 it('tick expiry: worked example step===5 + 2 unanswered -> total 30 -> score 70',()=>{
  let s=initial('ujian');
  s={...s,step:5,quiz:[0,2,0,0,1,-1,-1]}; // 2 unanswered
  const expired=reducer(s,{type:'tick',seconds:620});
  expect(expired.finished&&expired.expired).toBe(true);
  expect(expired.remaining).toBe(0);
  expect(expired.penalties).toEqual({Waktu:10,'Langkah belum selesai':10,'Soal belum dijawab':10});
  expect(score(expired)).toBe(70);
 });
 it('initial shape: attempts.length===7, quiz.length===7, switchOn===false',()=>{
  const s=initial('latihan');
  expect(s.attempts).toHaveLength(7);
  expect(s.quiz).toHaveLength(7);
  expect(s.switchOn).toBe(false);
  expect(s.readout).toEqual(solve('none'));
 });
 it('score computes 100 - sum penalties, floored at 0',()=>{
  expect(score(initial('ujian'))).toBe(100);
  expect(score({...initial('ujian'),penalties:{a:60,b:60}})).toBe(0);
 });
 it('reset restores initial; resetStep restores snapshot only in latihan',()=>{
  const assembledLat=assembled();
  expect(reducer(assembledLat,{type:'reset'})).toEqual(initial('latihan'));
  const snapshot=placed();
  const replayed=reducer(assembledLat,{type:'resetStep',snapshot});
  expect(replayed.step).toBe(snapshot.step);
  expect(reducer(assembled('ujian'),{type:'resetStep',snapshot}).mode).toBe('ujian');
  expect(reducer(assembled('ujian'),{type:'resetStep',snapshot}).step).toBe(7);
 });
 it('advance is a no-op on topology at step 7',()=>{
  const s=assembled();expect(s.step).toBe(7);
  expect(reducer(s,{type:'advance'}).step).toBe(7);
 });
});
