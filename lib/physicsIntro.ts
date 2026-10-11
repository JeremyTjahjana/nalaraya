// Physics lab-introduction content, reusing the existing circuitTools inventory.
import {circuitTools} from './circuits';
import type {ToolItem} from './lab';

export {circuitTools};
export type PhysicsToolId = (typeof circuitTools)[number]['id'];

// Categories are derived from the tools' own category field (unique, sorted) with 'Semua' prepended.
export const categories = ['Semua', ...Array.from(new Set(circuitTools.map(tool=>tool.category))).sort((a,b)=>a.localeCompare(b,'id'))] as const;
export type Category = typeof categories[number];

export function toolsInCategory(category:Category):ToolItem[] {
 return category==='Semua'?circuitTools:circuitTools.filter(tool=>tool.category===category);
}

export const physicsIntroQuestions = [
 {q:'Apa fungsi sumber tegangan (baterai) pada sebuah rangkaian?',options:['Menyimpan cahaya','Menyediakan beda potensial yang mendorong arus mengalir','Menghentikan arus listrik'],answer:1,explanation:'Baterai menyediakan beda potensial (tegangan) yang mendorong arus mengalir pada rangkaian.'},
 {q:'Apa kegunaan project board (breadboard) dalam merangkai komponen?',options:['Memanaskan komponen','Tempat memasang dan menghubungkan komponen tanpa menyolder','Mengukur arus listrik'],answer:1,explanation:'Project board menjadi tempat komponen dipasang dan dihubungkan tanpa menyolder; lubang pada satu baris saling terhubung.'},
 {q:'Kapan sebuah LED akan menyala pada rangkaian?',options:['Saat tidak ada arus','Saat dialiri arus dengan arah dan besar yang sesuai','Saat sakelar dibuka'],answer:1,explanation:'LED menyala saat dialiri arus dengan arah yang benar; pada modul ini LED dimodelkan sebagai resistor ohmik.'},
 {q:'Apa fungsi kawat jumper?',options:['Menyimpan muatan listrik','Menghubungkan sumber tegangan ke rel daya dan antar komponen','Mengubah warna cahaya LED'],answer:1,explanation:'Kawat jumper menghubungkan sumber tegangan ke rel daya dan menyambung antar komponen pada project board.'},
 {q:'Apa yang terjadi pada rangkaian saat sakelar ditutup?',options:['Rangkaian terputus dan lampu padam','Rangkaian tersambung sehingga arus mengalir dan lampu menyala','Tegangan baterai menjadi nol'],answer:1,explanation:'Menutup sakelar menyambung rangkaian sehingga arus mengalir dan lampu menyala; membukanya memutus arus.'},
] as const;

export function gradePhysicsIntro(answers: readonly number[]) {
 if (answers.length !== physicsIntroQuestions.length || answers.some((answer,index)=>!Number.isInteger(answer)||answer<0||answer>=physicsIntroQuestions[index].options.length)) return null;
 const incorrect=physicsIntroQuestions.flatMap((question,index)=>answers[index]===question.answer?[]:[index]);
 return {score:physicsIntroQuestions.length-incorrect.length,passed:incorrect.length<=1,incorrect};
}

export const physicsIntroCompletionKey='nalaraya:physics-intro-complete';
export function readPhysicsIntroCompletion(storage:Pick<Storage,'getItem'>) {try{return storage.getItem(physicsIntroCompletionKey)==='true'}catch{return false}}
export function savePhysicsIntroCompletion(storage:Pick<Storage,'setItem'>) {try{storage.setItem(physicsIntroCompletionKey,'true');return true}catch{return false}}
