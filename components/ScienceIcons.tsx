type IconProps = { className?: string };

export function ChemistryIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M23 8h18M27 8v16L14.5 46.5A6.5 6.5 0 0 0 20.2 56h23.6a6.5 6.5 0 0 0 5.7-9.5L37 24V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 43c7 3 18-4 27 0l4 8.5a6 6 0 0 1-5.5 4.5h-25a6 6 0 0 1-5.5-4.5Z"
        fill="currentColor"
        opacity=".18"
      />
      <circle cx="26" cy="46" r="2" fill="currentColor" />
      <circle cx="38" cy="49" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function BiologyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M51 14c8 9 6 27-3 35-9 8-27 8-35-2-8-10-5-28 6-36 10-7 24-5 32 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M39 23c5 5 4 13-1 17-5 4-13 2-16-3-3-6 0-13 6-16 4-2 8-1 11 2Z"
        fill="currentColor"
        opacity=".2"
      />
      <circle
        cx="31"
        cy="31"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M15 29c4 1 6-1 8-5M42 43c1 4 4 6 8 6M19 45c3-3 2-7 1-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PhysicsIcon({className}:IconProps){return <svg className={className} viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="4" fill="currentColor"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="currentColor" strokeWidth="2.5"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="currentColor" strokeWidth="2.5" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="currentColor" strokeWidth="2.5" transform="rotate(120 32 32)"/><circle cx="54" cy="35" r="3" fill="currentColor"/></svg>}

export function ToolIcon({id,className}:{id:string;className?:string}){
 const biology:Record<string,React.ReactNode>={
  microscope:<><path d="m9 3 4 2-3 6-4-2zM11 7c8 1 9 10 2 12M5 21h14M5 14h9M9 14v5"/><circle cx="17" cy="13" r="2"/></>,
  slide:<><path d="M3 7h18v10H3z"/><path d="M13 9h6v6h-6z"/></>,
  coverslip:<path d="m4 8 12-4 4 12-12 4z"/>,
  onion:<><path d="M10 3h4l-1 4c8 4 8 13-1 14C3 20 3 11 11 7z"/><path d="M11 8c-5 6-5 10 1 13m1-13c5 6 5 10-1 13"/></>,
  forceps:<path d="M10 3 4 21m8-18 8 18M10 3h2m-5 13 2 1m8-1-2 1"/>,
  tissue:<><path d="M3 7h18v14H3zM6 7V3h12v4M8 12h8"/><path d="m7 7 5-3 5 3"/></>,
  lugol:<><path d="M10 2h4v6l4 3v10H6V11l4-3zM8 14h8v4H8z"/></>,
 };
 if(biology[id])return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{biology[id]}</svg>;
 if(id==='goggles')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="8" height="9" rx="3"/><rect x="14" y="7" width="8" height="9" rx="3"/><path d="M10 11h4M2 11H1M22 11h1"/><circle cx="6" cy="11.5" r="1.5" fill="currentColor"/><circle cx="18" cy="11.5" r="1.5" fill="currentColor"/></svg>;
 if(id==='coat')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12l3 5-3 3v10H6V11L3 8l3-5z"/><path d="M9 3v5l3 3 3-3V3M12 11v10"/><rect x="14" y="13" width="3" height="3"/></svg>;
 if(id==='gloves')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 21v-4L4 13c-.6-.8-.3-2 .5-2.5.8-.6 2-.3 2.5.5l1 2V4c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v6h.5V3c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v7h.5V4.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v9l1 3v4H7z"/></svg>;
 if(id==='stand')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18M7 21V3M7 7h8m-3-2v4M15 5v4"/><line x1="15" y1="2" x2="15" y2="18" strokeDasharray="2 2"/></svg>;
 if(id==='burette')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 2h4v15l-2 3-2-3V2z"/><path d="M12 20v2M8 15h8"/><path d="M11 5h2M11 8h2M10 11h3M11 14h2"/></svg>;
 if(id==='flask')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 2h4M10 2v6L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 8V2"/><path d="M7 16c2.5 1 7.5-1 10 0" strokeDasharray="1 1"/></svg>;
 if(id==='pipette')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a2.5 2.5 0 0 1 2.5 2.5c0 1-.5 1.8-1.3 2.2L13 10a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2v6l-1 2-1-2v-6a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2l-.2-3.3A2.5 2.5 0 0 1 12 2z"/><circle cx="12" cy="4.5" r="1.5" fill="currentColor"/></svg>;
 if(id==='funnel')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h18l-7 9v8l-4-2v-6L3 4z"/><path d="M3 4c0 1 4 2 9 2s9-1 9-2"/></svg>;
 if(id==='waste')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 4h-2V3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1l-1 3 1 1v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4z"/><path d="M4 8h16M7 11h3M7 14h5M7 17h3"/></svg>;
 if(id==='naoh')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 3h6v3H9zM7 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><rect x="7.5" y="11" width="9" height="6" rx="1" fill="currentColor" opacity=".12"/><path d="M10 13h4M12 15h2"/></svg>;
 if(id==='hcl')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 3h6v3H9zM7 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M12 11l-3 5h6l-3-5z" fill="currentColor" opacity=".15"/><circle cx="12" cy="15" r=".7" fill="currentColor"/></svg>;
 if(id==='indicator')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 6h4v2h-4zM12 2a2 2 0 0 1 2 2v2h-4V4a2 2 0 0 1 2-2zM8 8h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z"/><path d="M12 12v5m-1 0h2"/></svg>;
 if(id==='water')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 8h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z"/><path d="M10 8V5h4v3M12 5V2l5 2"/></svg>;
 if(id==='tube')return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3h8M9 3v13a3 3 0 0 0 6 0V3"/><path d="M9 11c1 .5 3 .5 4 0"/></svg>;
 return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>;
}

export function FlaskCatalogIcon({className}:{className?:string}){
 return <svg className={className} viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  <path d="M12 4h8M14 4v7L7 23a3 3 0 0 0 2.6 4.5h12.8A3 3 0 0 0 25 23l-7-12V4" />
  <path d="M10 20.5c3 1.2 9-1.2 12 0" strokeDasharray="1.5 1.5" />
  <circle cx="14" cy="23" r="1" fill="currentColor" />
  <circle cx="18" cy="24" r="0.8" fill="currentColor" />
 </svg>;
}
