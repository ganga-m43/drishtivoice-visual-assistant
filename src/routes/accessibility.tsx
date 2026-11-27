import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  CheckCircle2,
  Keyboard,
  Smartphone,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useDrishti, type TextSize } from "@/contexts/DrishtiContext";
import { getAvailableVoices } from "@/services/speech";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Settings — DrishtiVoice" },
      {
        name: "description",
        content:
          "Customize text size, high contrast mode, voice speed, volume, reduced motion, preferred voice, and review TalkBack/VoiceOver guidance.",
      },
      { property: "og:title", content: "Accessibility Settings — DrishtiVoice" },
      {
        property: "og:description",
        content: "Tailor DrishtiVoice for TalkBack, VoiceOver, high contrast, and voice comfort.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccessibilityPage,
});

const TEXT_SIZES: { value: TextSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra Large" },
];

function AccessibilityPage() {
  const { accessibility, updateAccessibility, speak, announce } = useDrishti();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => setVoices(getAvailableVoices());
    loadVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    }
    return undefined;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Accessibility className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Accessibility Settings
            </h1>
            <p className="text-base text-muted-foreground">
              Changes apply immediately across DrishtiVoice and are saved on this device.
            </p>
          </div>
        </div>

        {/* Visual & Display Settings */}
        <section
          aria-labelledby="display-settings-heading"
          className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6"
        >
          <h2 id="display-settings-heading" className="text-xl font-bold text-foreground">
            Display & Motion
          </h2>

          <div>
            <p className="text-base font-bold text-foreground">Text Size</p>
            <p className="text-sm text-muted-foreground">
              Adjust text scale across all pages and controls.
            </p>
            <div role="radiogroup" aria-label="Text size" className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TEXT_SIZES.map((size) => {
                const selected = accessibility.textSize === size.value;
                return (
                  <button
                    key={size.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      updateAccessibility({ textSize: size.value });
                      toast.success(`Text size set to ${size.label}.`);
                      announce(`Text size set to ${size.label}.`);
                    }}
                    className={`min-h-12 rounded-xl border px-4 text-sm font-bold transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-surface-subtle"
                    }`}
                  >
                    {size.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <label htmlFor="high-contrast-toggle" className="text-base font-bold text-foreground">
                High Contrast Mode
              </label>
              <p className="text-sm text-muted-foreground">
                Strengthens borders, text contrast, and focus outlines for low-vision clarity.
              </p>
            </div>
            <Switch
              id="high-contrast-toggle"
              checked={accessibility.highContrast}
              onCheckedChange={(checked) => {
                updateAccessibility({ highContrast: checked });
                announce(`High contrast mode ${checked ? "enabled" : "disabled"}.`);
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <label htmlFor="reduce-motion-toggle" className="text-base font-bold text-foreground">
                Reduce Animations
              </label>
              <p className="text-sm text-muted-foreground">
                Disables pulsing rings, waveform movement, and smooth transitions.
              </p>
            </div>
            <Switch
              id="reduce-motion-toggle"
              checked={accessibility.reduceAnimations}
              onCheckedChange={(checked) => {
                updateAccessibility({ reduceAnimations: checked });
                announce(`Reduce animations ${checked ? "enabled" : "disabled"}.`);
              }}
            />
          </div>
        </section>

        {/* Voice & Speech Settings */}
        <section
          aria-labelledby="voice-settings-heading"
          className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="voice-settings-heading" className="text-xl font-bold text-foreground">
              Voice & Audio Controls
            </h2>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                speak(
                  "This is your current DrishtiVoice speaking speed and volume preview.",
                )
              }
              className="min-h-12 gap-2"
            >
              <Volume2 className="h-4 w-4" aria-hidden="true" />
              Test Voice
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="voice-speed-slider" className="text-base font-bold text-foreground">
                Voice Speed
              </label>
              <span className="text-sm font-semibold text-secondary">
                {accessibility.voiceSpeed.toFixed(1)}x
              </span>
            </div>
            <Slider
              id="voice-speed-slider"
              aria-label="Voice speed"
              min={0.6}
              max={1.6}
              step={0.1}
              value={[accessibility.voiceSpeed]}
              onValueChange={([val]) => {
                if (typeof val === "number") updateAccessibility({ voiceSpeed: val });
              }}
              className="mt-3"
            />
          </div>

          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <label htmlFor="voice-volume-slider" className="text-base font-bold text-foreground">
                Voice Volume
              </label>
              <span className="text-sm font-semibold text-secondary">
                {Math.round(accessibility.voiceVolume * 100)}%
              </span>
            </div>
            <Slider
              id="voice-volume-slider"
              aria-label="Voice volume"
              min={0.2}
              max={1}
              step={0.1}
              value={[accessibility.voiceVolume]}
              onValueChange={([val]) => {
                if (typeof val === "number") updateAccessibility({ voiceVolume: val });
              }}
              className="mt-3"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <label htmlFor="audio-instructions-toggle" className="text-base font-bold text-foreground">
                Spoken Audio Responses
              </label>
              <p className="text-sm text-muted-foreground">
                Automatically read assistant answers and camera descriptions aloud.
              </p>
            </div>
            <Switch
              id="audio-instructions-toggle"
              checked={accessibility.audioInstructions}
              onCheckedChange={(checked) => {
                updateAccessibility({ audioInstructions: checked });
                announce(`Spoken audio responses ${checked ? "enabled" : "disabled"}.`);
              }}
            />
          </div>

          <div className="border-t border-border pt-5">
            <label htmlFor="preferred-voice-select" className="block text-base font-bold text-foreground">
              Preferred System Voice
            </label>
            <p className="text-sm text-muted-foreground">
              Choose from voices installed on your device.
            </p>
            <select
              id="preferred-voice-select"
              value={accessibility.preferredVoiceURI}
              onChange={(e) => updateAccessibility({ preferredVoiceURI: e.target.value })}
              className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground"
            >
              <option value="">System Default Voice</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Screen Reader & Keyboard Guidance */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5 text-primary">
              <Smartphone className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-bold">Screen Reader Support</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Android TalkBack:</strong> Swipe right/left to move through controls; double-tap to activate the microphone or camera.</li>
              <li><strong className="text-foreground">iOS VoiceOver:</strong> All status updates announce automatically via live regions without moving your focus.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5 text-primary">
              <Keyboard className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-bold">Keyboard Navigation</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Tab / Shift + Tab:</strong> Move forward or backward across buttons, links, and toggles.</li>
              <li><strong className="text-foreground">Enter / Space:</strong> Activate buttons, toggle switches, or start/stop voice listening.</li>
            </ul>
          </section>
        </div>

        {/* Accessibility Statement */}
        <section
          aria-labelledby="a11y-statement-heading"
          className="mt-6 rounded-2xl border border-border bg-surface-subtle p-6"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
            <div>
              <h2 id="a11y-statement-heading" className="text-base font-bold text-foreground">
                Accessibility Statement
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                DrishtiVoice is designed to meet WCAG 2.1 AA standards with semantic HTML landmarks,
                minimum 48px interactive touch targets, high-contrast color tokens, non-color-only
                status indicators, and full screen-reader compatibility.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}