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

export function PhysicsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="4" fill="currentColor" />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        transform="rotate(60 32 32)"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        transform="rotate(120 32 32)"
      />
      <circle cx="54" cy="35" r="3" fill="currentColor" />
    </svg>
  );
}
