import {Suspense} from 'react';import Lab from '@/components/Lab';
export default function Practical(){return <Suspense fallback={<p className="loading">Menyiapkan laboratorium…</p>}><Lab/></Suspense>}
