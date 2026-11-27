import { createFileRoute } from "@tanstack/react-router";
import { Check, Globe, Info, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  SUPPORTED_LANGUAGES,
  useDrishti,
  type LanguageCode,
} from "@/contexts/DrishtiContext";

export const Route = createFileRoute("/languages")({
  head: () => ({
    meta: [
      { title: "Language Settings — DrishtiVoice" },
      {
        name: "description",
        content:
          "Choose your preferred speaking and response language from English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, and Bengali.",
      },
      { property: "og:title", content: "Language Settings — DrishtiVoice" },
      {
        property: "og:description",
        content: "Configure Indian language preferences and voice preview for DrishtiVoice.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LanguagesPage,
});

function LanguagesPage() {
  const { languages, updateLanguages, speak, announce } = useDrishti();

  const handleSpeakingSelect = (code: LanguageCode, name: string) => {
    updateLanguages({ speakingLanguage: code });
    toast.success(`Speaking language set to ${name}.`);
    announce(`Preferred speaking language set to ${name}.`);
  };

  const handleResponseSelect = (code: LanguageCode, name: string) => {
    updateLanguages({ responseLanguage: code });
    toast.success(`Response language set to ${name}.`);
    announce(`Preferred response language set to ${name}.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <Globe className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Language Settings
            </h1>
            <p className="text-base text-muted-foreground">
              Select your preferred Indian language for speaking and listening.
            </p>
          </div>
        </div>

        {/* Speaking Language */}
        <section aria-labelledby="speaking-lang-heading" className="mt-8">
          <h2 id="speaking-lang-heading" className="text-xl font-bold text-foreground">
            Preferred Speaking Language
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const selected = languages.speakingLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSpeakingSelect(lang.code, lang.name)}
                  aria-pressed={selected}
                  className={`flex min-h-20 flex-col justify-between rounded-xl border p-4 text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-surface-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold">{lang.name}</span>
                    {selected && <Check className="h-5 w-5" aria-hidden="true" />}
                  </div>
                  <span
                    className={`text-sm ${
                      selected ? "text-primary-foreground/85" : "text-muted-foreground"
                    }`}
                  >
                    {lang.nativeName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Response Language + Voice Preview */}
        <section aria-labelledby="response-lang-heading" className="mt-8">
          <h2 id="response-lang-heading" className="text-xl font-bold text-foreground">
            Preferred Response Language & Voice Preview
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const selected = languages.responseLanguage === lang.code;
              return (
                <div
                  key={lang.code}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-4 ${
                    selected ? "border-secondary bg-secondary/5" : "border-border bg-card"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleResponseSelect(lang.code, lang.name)}
                    aria-pressed={selected}
                    className="flex min-h-12 flex-1 flex-col items-start justify-center text-left"
                  >
                    <span className="flex items-center gap-2 text-base font-bold text-foreground">
                      {lang.name}
                      {selected && (
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                          Selected
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => speak(lang.samplePhrase, lang.code)}
                    aria-label={`Preview voice in ${lang.name}`}
                    className="min-h-12 gap-2"
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    Preview
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Language Behavior Toggles */}
        <section
          aria-label="Language detection options"
          className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="auto-detect-lang" className="text-base font-bold text-foreground">
                Auto-detect spoken language
              </label>
              <p className="text-sm text-muted-foreground">
                Automatically switch recognition when you speak in another supported language.
              </p>
            </div>
            <Switch
              id="auto-detect-lang"
              checked={languages.autoDetect}
              onCheckedChange={(checked) => {
                updateLanguages({ autoDetect: checked });
                announce(`Auto-detect language ${checked ? "enabled" : "disabled"}.`);
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <label htmlFor="mixed-lang" className="text-base font-bold text-foreground">
                Mixed-language support (e.g., Hinglish, Kanglish)
              </label>
              <p className="text-sm text-muted-foreground">
                Allow natural switching between English and regional Indian languages in one sentence.
              </p>
            </div>
            <Switch
              id="mixed-lang"
              checked={languages.mixedLanguage}
              onCheckedChange={(checked) => {
                updateLanguages({ mixedLanguage: checked });
                announce(`Mixed-language support ${checked ? "enabled" : "disabled"}.`);
              }}
            />
          </div>
        </section>

        {/* Provider note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface-subtle p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
          <p>
            Your language preferences are saved locally in this browser. Actual speech recognition
            and spoken response quality depends on your device's installed voices and the connected
            speech and AI providers.
          </p>
        </div>
      </div>
    </div>
  );
}