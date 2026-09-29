import Link from 'next/link';

export default function Logo({compact=false}:{compact?:boolean}){
 return <Link className={`brand-logo${compact?' compact':''}`} href="/" aria-label="Nalaraya — beranda">
  <svg className="brand-symbol" viewBox="0 0 44 44" aria-hidden="true">
   <path d="M17 7h10M19 7v10l-8 14.5c-1 1.8.3 4 2.4 4h17.2c2.1 0 3.4-2.2 2.4-4L25 17V7" fill="#fff" stroke="#171817" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
   <path d="M14.8 29.2h14.4l2.1 3.7c.5.9-.1 1.9-1.1 1.9H13.8c-1 0-1.6-1-1.1-1.9l2.1-3.7Z" fill="#cf3434"/>
   <path d="M17.2 25.8c2.7-1.9 6.8 2 9.8 0" fill="none" stroke="#cf3434" strokeWidth="2" strokeLinecap="round"/>
  </svg>
  {!compact&&<svg className="brand-word" viewBox="0 0 152 32" role="img" aria-label="Nalaraya">
   <text x="0" y="24" fontFamily="Atkinson Hyperlegible, sans-serif" fontSize="27" fontWeight="700" letterSpacing="-1.1">nalaraya</text>
   <circle cx="147" cy="22" r="3" fill="#c92f2f"/>
  </svg>}
 </Link>
}
