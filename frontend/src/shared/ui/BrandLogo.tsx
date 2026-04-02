function LogoMark() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill="#FFDF00" d="M50 10 L90 50 L50 90 L10 50 Z" />
      <circle fill="#002776" cx="50" cy="50" r="28" />
      <circle cx="50" cy="44" r="2.2" fill="white" />
      <circle cx="56" cy="51" r="1.7" fill="white" />
      <circle cx="44" cy="51" r="1.7" fill="white" />
      <circle cx="50" cy="57" r="1.7" fill="white" />
    </svg>
  );
}

export function BrandLogo() {
  return (
    <div className="logo" aria-label="Catalojogo">
      <span>CATAL</span>
      <LogoMark />
      <span>JOGO</span>
    </div>
  );
}
