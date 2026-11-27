interface DrishtiLogoProps {
  compact?: boolean;
}

export function DrishtiLogo({ compact = false }: DrishtiLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
        aria-hidden="true"
      >
        <svg viewBox="0 0 36 36" fill="none" className="h-6 w-6" aria-hidden="true">
          <path
            d="M4 18C7.5 11.8 12.6 9 18 9C23.4 9 28.5 11.8 32 18C28.5 24.2 23.4 27 18 27C12.6 27 7.5 24.2 4 18Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M13 18V18.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M16 14.5V21.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M19.5 12.5V23.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M23 15.5V20.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-foreground">DrishtiVoice</span>
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            Voice-First Vision AI
          </span>
        </span>
      )}
    </span>
  );
}