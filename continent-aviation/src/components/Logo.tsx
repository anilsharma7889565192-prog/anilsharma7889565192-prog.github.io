export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="#C8A96B" strokeWidth="1" />
        <path d="M7 20.5 25 11.5M13 21.5l12-10" stroke="#C8A96B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 15.5h5" stroke="#F5F2EA" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-[1.55rem] font-medium tracking-[0.04em] text-ivory">CONTINENT</span>
        <span className="mt-1 block text-[0.6rem] tracking-[0.5em] text-gold">AVIATION</span>
      </span>
    </span>
  );
}
