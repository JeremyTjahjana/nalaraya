export default function HeroArt() {
  return (
    <div
      className="hero-art"
      aria-label="Ilustrasi labu Erlenmeyer dengan cairan bergerak"
    >
      <svg viewBox="0 0 520 520" role="img">
        <title>Eksperimen cairan di dalam labu Erlenmeyer</title>
        <circle className="art-ring ring-a" cx="260" cy="260" r="205" />
        <circle className="art-ring ring-b" cx="260" cy="260" r="150" />
        <path
          className="art-glass"
          d="M205 72h110M225 72v118L112 386c-16 28 4 62 36 62h224c32 0 52-34 36-62L295 190V72"
        />
        <clipPath id="flask-clip">
          <path d="M225 72v118L112 386c-16 28 4 62 36 62h224c32 0 52-34 36-62L295 190V72Z" />
        </clipPath>
        <g clipPath="url(#flask-clip)">
          <path
            className="art-liquid"
            d="M96 349c55-32 94 29 151 1s104-2 177-18v132H96Z"
          />
          <path
            className="art-wave"
            d="M80 351c63-45 112 28 174-2s116 4 188-20"
          />
        </g>
        <g className="art-bubbles">
          <circle cx="202" cy="321" r="10" />
          <circle cx="310" cy="346" r="7" />
          <circle cx="265" cy="294" r="5" />
          <circle cx="342" cy="384" r="12" />
        </g>
        <g className="art-drops">
          <path d="M366 118c0 0-17 22-17 33a17 17 0 0 0 34 0c0-11-17-33-17-33Z" />
          <path d="M147 202c0 0-10 13-10 20a10 10 0 0 0 20 0c0-7-10-20-10-20Z" />
        </g>
        <g className="art-molecules">
          <circle cx="101" cy="124" r="12" />
          <circle cx="79" cy="109" r="7" />
          <path d="M91 117 84 112" />
          <circle cx="427" cy="260" r="10" />
          <circle cx="455" cy="248" r="7" />
          <circle cx="451" cy="278" r="6" />
          <path d="m436 256 13-6m-12 15 10 10" />
        </g>
      </svg>
    </div>
  );
}
