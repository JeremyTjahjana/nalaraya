// Biology lab-introduction content, reusing the existing epidermisTools inventory.
import {epidermisTools} from './epidermis';
import type {ToolItem} from './lab';

export {epidermisTools};
export type BiologyToolId = (typeof epidermisTools)[number]['id'];

// Categories are derived from the tools' own category field (unique, sorted) with 'Semua' prepended.
export const categories = ['Semua', ...Array.from(new Set(epidermisTools.map(tool=>tool.category))).sort((a,b)=>a.localeCompare(b,'id'))] as const;
export type Category = typeof categories[number];

export function toolsInCategory(category:Category):ToolItem[] {
 return category==='Semua'?epidermisTools:epidermisTools.filter(tool=>tool.category===category);
}

export const biologyIntroQuestions = [
 {q:'Bagaimana cara membawa mikroskop dengan benar?',options:['Satu tangan pada lengan mikroskop','Dua tangan: satu pada lengan, satu menopang alas','Diseret di atas meja'],answer:1,explanation:'Mikroskop dibawa dengan dua tangan, satu memegang lengan dan satu menopang alas, agar tidak terjatuh.'},
 {q:'Saat mulai mengamati, objektif mana yang digunakan lebih dahulu?',options:['Objektif pembesaran rendah','Objektif pembesaran tertinggi','Tanpa objektif'],answer:0,explanation:'Mulai dari objektif pembesaran rendah agar jaringan mudah dipusatkan dan lensa tidak menyentuh preparat.'},
 {q:'Apa fungsi pinset dalam pembuatan preparat epidermis bawang merah?',options:['Mengaduk pewarna','Mengangkat epidermis tipis dan meratakannya di kaca objek','Menyerap cairan berlebih'],answer:1,explanation:'Pinset dipakai untuk mengangkat lapisan epidermis tipis dan meratakannya di atas kaca objek tanpa merusak jaringan.'},
 {q:'Mengapa Lugol diteteskan pada preparat epidermis?',options:['Sebagai pelarut preparat basah','Untuk menambah kontras agar struktur sel lebih mudah diamati','Untuk membersihkan kaca objek'],answer:1,explanation:'Lugol berfungsi sebagai pewarna yang menambah kontras sehingga struktur sel lebih mudah diamati.'},
 {q:'Bagaimana memasang kaca penutup agar mengurangi gelembung udara, dan apa yang harus diingat tentang sampel praktikum?',options:['Dijatuhkan datar; sampel boleh dicicipi','Diturunkan miring; sampel praktikum tidak dikonsumsi','Ditekan kuat; sampel disimpan untuk dimakan'],answer:1,explanation:'Kaca penutup diturunkan secara miring untuk mengurangi gelembung udara. Sampel praktikum tidak boleh dikonsumsi.'},
] as const;

export function gradeBiologyIntro(answers: readonly number[]) {
 if (answers.length !== biologyIntroQuestions.length || answers.some((answer,index)=>!Number.isInteger(answer)||answer<0||answer>=biologyIntroQuestions[index].options.length)) return null;
 const incorrect=biologyIntroQuestions.flatMap((question,index)=>answers[index]===question.answer?[]:[index]);
 return {score:biologyIntroQuestions.length-incorrect.length,passed:incorrect.length<=1,incorrect};
}

export const biologyCompletionKey='nalaraya:biology-intro-complete';
export function readBiologyCompletion(storage:Pick<Storage,'getItem'>) {try{return storage.getItem(biologyCompletionKey)==='true'}catch{return false}}
export function saveBiologyCompletion(storage:Pick<Storage,'setItem'>) {try{storage.setItem(biologyCompletionKey,'true');return true}catch{return false}}
