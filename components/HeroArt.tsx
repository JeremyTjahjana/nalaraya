export default function HeroArt() {
  return (
    <div className="hero-art" aria-label="Labu Erlenmeyer">
      <svg viewBox="0 0 520 520" role="img" className="hero-flask-svg">
        <title>Labu Erlenmeyer</title>

        {/* Orbit reference rings */}
        <circle className="art-ring ring-a" cx="260" cy="260" r="205" />
        <circle className="art-ring ring-b" cx="260" cy="260" r="150" />

        {/* Swaying Erlenmeyer Flask Group */}
        <g className="art-flask-group">
          {/* Flask borosilicate body */}
          <path
            className="art-glass"
            d="M205 72h110M225 72v118L112 386c-16 28 4 62 36 62h224c32 0 52-34 36-62L295 190V72"
          />

          {/* Volume markings */}
          <g className="flask-graduations" stroke="#27322d" strokeWidth="2" opacity="0.45" strokeLinecap="round">
            <line x1="182" y1="360" x2="204" y2="360" />
            <line x1="196" y1="320" x2="214" y2="320" />
            <line x1="210" y1="280" x2="226" y2="280" />
            <line x1="222" y1="240" x2="236" y2="240" />
          </g>

          <clipPath id="flask-clip">
            <path d="M225 72v118L112 386c-16 28 4 62 36 62h224c32 0 52-34 36-62L295 190V72Z" />
          </clipPath>

          {/* Liquid content sloshing inside */}
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

          {/* Subtle micro bubbles inside */}
          <g className="art-bubbles">
            <circle cx="202" cy="321" r="9" />
            <circle cx="310" cy="346" r="6" />
            <circle cx="265" cy="294" r="5" />
            <circle cx="342" cy="384" r="11" />
          </g>
        </g>
      </svg>
    </div>
  );
}
