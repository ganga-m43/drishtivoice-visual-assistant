interface VoiceWaveformProps {
  active: boolean;
  label?: string;
  size?: "sm" | "lg";
}

const BARS = [
  { h: "h-4", delay: "0ms" },
  { h: "h-7", delay: "120ms" },
  { h: "h-10", delay: "240ms" },
  { h: "h-6", delay: "360ms" },
  { h: "h-11", delay: "180ms" },
  { h: "h-8", delay: "60ms" },
  { h: "h-5", delay: "300ms" },
];

export function VoiceWaveform({
  active,
  label = "Voice activity indicator",
  size = "lg",
}: VoiceWaveformProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`inline-flex items-center justify-center gap-1.5 ${size === "lg" ? "h-12" : "h-7"}`}
    >
      {BARS.map((bar, idx) => (
        <span
          key={idx}
          style={{ animationDelay: bar.delay }}
          className={`w-1.5 rounded-full transition-colors ${
            size === "lg" ? bar.h : "h-5"
          } ${active ? "drishti-wave-bar bg-accent" : "scale-y-50 bg-border"}`}
        />
      ))}
    </div>
  );
}