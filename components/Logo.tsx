import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand-logo${compact ? ' compact' : ''}`} href="/" aria-label="Nalaraya — beranda">
      <span className="brand-symbol">
        <Image
          src="/logo_nalaraya_symbol.png"
          alt="Simbol Labu Nalaraya"
          width={462}
          height={555}
          priority
          className="brand-symbol-img"
        />
      </span>
      {!compact && (
        <span className="brand-word">
          <Image
            src="/logo_nalaraya_word.png"
            alt="nalaraya."
            width={1402}
            height={339}
            priority
            className="brand-word-img"
          />
        </span>
      )}
    </Link>
  );
}
