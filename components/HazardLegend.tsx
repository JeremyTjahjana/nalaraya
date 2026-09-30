const hazards = [
  {
    name: "Korosif",
    description:
      "Dapat merusak kulit, mata, atau logam. Gunakan APD dan hindari percikan.",
    icon: (
      <svg viewBox="0 0 60 60" role="img" aria-label="Korosif">
        <path
          d="M30 3 57 30 30 57 3 30Z"
          fill="white"
          stroke="#bd2929"
          strokeWidth="3"
        />
        <g stroke="#171717" strokeWidth="2" fill="none">
          <path d="m17 15 13 6-3 6-13-6Zm15-1 13 6-3 6-13-6M15 42h30M30 39l-9-3-5 3M27 30v4m12-6v5" />
        </g>
      </svg>
    ),
  },
  {
    name: "Toksisitas akut",
    description:
      "Dapat berbahaya jika tertelan, terhirup, atau mengenai tubuh dalam jumlah tertentu.",
    icon: (
      <svg viewBox="0 0 60 60" role="img" aria-label="Toksisitas akut">
        <path
          d="M30 3 57 30 30 57 3 30Z"
          fill="white"
          stroke="#bd2929"
          strokeWidth="3"
        />
        <path d="M20 41 40 32M20 32 40 41" stroke="#171717" strokeWidth="3" />
        <path d="M20 23a10 10 0 1 1 20 0l-5 6v5H25v-5Z" fill="#171717" />
        <circle cx="26" cy="22" r="3" fill="white" />
        <circle cx="34" cy="22" r="3" fill="white" />
      </svg>
    ),
  },
  {
    name: "Bahaya lingkungan",
    description:
      "Jangan membuang bahan ke saluran air. Ikuti prosedur pengelolaan limbah.",
    icon: (
      <svg viewBox="0 0 60 60" role="img" aria-label="Bahaya lingkungan">
        <path
          d="M30 3 57 30 30 57 3 30Z"
          fill="white"
          stroke="#bd2929"
          strokeWidth="3"
        />
        <path
          d="M34 16v25m0-12-8-7m8 3 7-5M17 43h27"
          stroke="#171717"
          strokeWidth="2"
        />
        <path d="m17 34 4 3c7-7 13 0 13 0s-6 7-13 0l-4 3Z" fill="#171717" />
      </svg>
    ),
  },
];

export default function HazardLegend({
  detailed = false,
}: {
  detailed?: boolean;
}) {
  return (
    <div
      className={`hazard-legend${detailed ? " detailed" : ""}`}
      aria-label="Referensi simbol GHS"
    >
      {hazards.map((hazard) => (
        <figure key={hazard.name}>
          {hazard.icon}
          <figcaption>
            <strong>{hazard.name}</strong>
            {detailed && <span>{hazard.description}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
