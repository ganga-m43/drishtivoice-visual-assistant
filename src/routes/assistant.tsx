import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Eye,
  FileText,
  Globe,
  Mic,
  MicOff,
  Power,
  RefreshCw,
  Search,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DrishtiLogo } from "@/components/DrishtiLogo";
import { VoiceWaveform } from "@/components/VoiceWaveform";
import { Button } from "@/components/ui/button";
import { useDrishti } from "@/contexts/DrishtiContext";
import {
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  type BrowserSpeechRecognition,
} from "@/services/speech";
import { askVoiceAssistant } from "@/services/vision";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Voice Assistant — DrishtiVoice" },
      {
        name: "description",
        content:
          "Distraction-free voice-first visual assistant. Tap to speak naturally and hear clear spoken descriptions.",
      },
      { property: "og:title", content: "Voice Assistant — DrishtiVoice" },
      {
        property: "og:description",
        content: "Speak naturally with DrishtiVoice to understand your surroundings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoiceAssistantPage,
});

type MicState = "idle" | "listening" | "processing" | "responding" | "error";

const STATE_LABELS: Record<MicState, string> = {
  idle: "Tap to speak.",
  listening: "I'm listening...",
  processing: "Understanding your question...",
  responding: "Here's what I found.",
  error: "I couldn't hear you clearly. Please try again.",
};

const QUICK_ACTIONS = [
  { label: "Describe surroundings", prompt: "What is in front of me?", icon: Eye },
  { label: "Read text", prompt: "Please read the text in front of me.", icon: FileText },
  { label: "Find an object", prompt: "Where is my water bottle?", icon: Search },
  { label: "Identify something", prompt: "What am I holding right now?", icon: Sparkles },
] as const;

function VoiceAssistantPage() {
  const {
    languages,
    currentLanguageMeta,
    accessibility,
    isSpeaking,
    speak,
    stopSpeech,
    announce,
    addHistoryEntry,
    setSetupOpen,
  } = useDrishti();

  const [micState, setMicState] = useState<MicState>("idle");
  const [recognizedText, setRecognizedText] = useState("What is in front of me?");
  const [aiResponse, setAiResponse] = useState(
    "There is a wooden table in front of you. A water bottle is on the right side and a plant is on the left.",
  );
  const [speechSupported, setSpeechSupported] = useState(true);
  const [sessionEnded, setSessionEnded] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const micButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
    return () => {
      recognitionRef.current?.abort();
      stopSpeech();
    };
  }, [stopSpeech]);

  const handleProcessQuestion = useCallback(
    async (question: string) => {
      setSessionEnded(false);
      setRecognizedText(question);
      setMicState("processing");
      announce("Understanding your question...");

      try {
        const result = await askVoiceAssistant(question);
        setAiResponse(result.answer);
        setMicState("responding");
        announce(`Here's what I found. ${result.answer}`);
        addHistoryEntry({
          question,
          answer: result.answer,
          source: "voice",
          isDemo: result.isDemo,
        });
        if (accessibility.audioInstructions) {
          speak(result.answer);
        }
      } catch {
        setMicState("error");
        announce("I couldn't understand that clearly. Please speak again.", "assertive");
        speak("I couldn't understand that clearly. Please speak again.");
      }
    },
    [accessibility.audioInstructions, addHistoryEntry, announce, speak],
  );

  const handleMicToggle = () => {
    setSessionEnded(false);
    if (micState === "listening") {
      recognitionRef.current?.stop();
      setMicState("idle");
      announce("Stopped listening.");
      return;
    }

    stopSpeech();

    if (!isSpeechRecognitionSupported()) {
      toast.info("Browser speech recognition is unavailable here. Running a sample voice query.");
      announce("Speech recognition is unavailable in this browser. Running a sample voice query.");
      void handleProcessQuestion("What is in front of me?");
      return;
    }

    const recognition = createSpeechRecognition(languages.speakingLanguage);
    if (!recognition) {
      setMicState("error");
      return;
    }
    recognitionRef.current = recognition;
    let finalTranscript = "";

    recognition.onstart = () => {
      setMicState("listening");
      announce("I'm listening. Speak your question now.");
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        transcript += item?.[0]?.transcript ?? "";
      }
      if (transcript.trim()) {
        finalTranscript = transcript.trim();
        setRecognizedText(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      setMicState("error");
      const msg =
        event.error === "not-allowed"
          ? "Microphone permission was denied. Please allow microphone access or use a quick action below."
          : "I couldn't hear you clearly. Please try again.";
      toast.error(msg);
      announce(msg, "assertive");
      speak("I couldn't understand that clearly. Please speak again.");
    };

    recognition.onend = () => {
      if (finalTranscript) {
        void handleProcessQuestion(finalTranscript);
      } else {
        setMicState((prev) => (prev === "listening" ? "idle" : prev));
      }
    };

    try {
      recognition.start();
    } catch {
      setMicState("error");
    }
  };

  const handleWelcomeSpeech = () => {
    const welcome =
      "Welcome to DrishtiVoice. I can describe your surroundings, read documents, and help you identify objects. You can ask me anything using your voice.";
    speak(welcome);
    announce(welcome);
  };

  const handleEndSession = () => {
    recognitionRef.current?.abort();
    stopSpeech();
    setMicState("idle");
    setSessionEnded(true);
    toast.success("Voice session ended.");
    announce("Voice session ended. Tap the microphone button anytime to start again.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal distraction-free top bar */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="min-h-12 gap-2 px-4">
              <Link to="/" aria-label="Back to home page">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back</span>
              </Link>
            </Button>
            <DrishtiLogo compact />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="min-h-12" onClick={() => setSetupOpen(true)}>First-use setup</Button>
            <span
              role="status"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-subtle px-3.5 py-1.5 text-sm font-semibold text-foreground"
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${
                  micState === "listening"
                    ? "bg-accent"
                    : micState === "error"
                      ? "bg-destructive"
                      : "bg-success"
                }`}
              />
              {micState === "listening"
                ? "Listening"
                : micState === "processing"
                  ? "Processing"
                  : sessionEnded
                    ? "Session Ended"
                    : "Ready"}
            </span>
            <Link
              to="/languages"
              aria-label={`Speaking language: ${currentLanguageMeta.name}. Open language settings`}
              className="inline-flex min-h-12 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Globe className="h-4 w-4 text-secondary" aria-hidden="true" />
              <span>{currentLanguageMeta.name}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
            Hello! I'm your DrishtiVoice assistant.
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            You don't need to see the screen. Just speak naturally.
          </p>
          <div className="mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWelcomeSpeech}
              className="min-h-11 gap-2 text-secondary hover:text-secondary"
            >
              <Volume2 className="h-4 w-4" aria-hidden="true" />
              Hear welcome instructions
            </Button>
          </div>
        </div>

        {/* Central Large Microphone Button */}
        <section aria-label="Voice microphone control" className="mt-8 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {micState === "listening" && (
              <span
                aria-hidden="true"
                className="drishti-pulse-ring absolute h-44 w-44 rounded-full bg-accent/25"
              />
            )}
            <button
              ref={micButtonRef}
              type="button"
              onClick={handleMicToggle}
              disabled={micState === "processing"}
              aria-label={
                micState === "listening"
                  ? "Stop listening"
                  : "Tap to speak to DrishtiVoice assistant"
              }
              aria-pressed={micState === "listening"}
              className={`relative z-10 flex h-40 w-40 flex-col items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-70 sm:h-44 sm:w-44 ${
                micState === "listening"
                  ? "bg-accent text-accent-foreground"
                  : micState === "error"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/95"
              }`}
            >
              {micState === "error" ? (
                <MicOff className="h-14 w-14" aria-hidden="true" />
              ) : (
                <Mic className="h-14 w-14" aria-hidden="true" />
              )}
              <span className="mt-2 text-sm font-bold">
                {micState === "listening" ? "Stop" : "Speak"}
              </span>
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <VoiceWaveform
              active={micState === "listening" || isSpeaking}
              label={
                micState === "listening"
                  ? "Listening to your voice"
                  : isSpeaking
                    ? "Assistant is speaking"
                    : "Voice idle"
              }
            />
            <p role="status" className="text-lg font-bold text-foreground">
              {STATE_LABELS[micState]}
            </p>
            {!speechSupported && (
              <p className="max-w-md text-center text-sm text-muted-foreground">
                Live browser speech recognition is unavailable on this browser. Tap Speak or any
                quick action below to test the spoken demo experience.
              </p>
            )}
          </div>
        </section>

        {/* Conversation Area */}
        <section
          aria-label="Current conversation"
          className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-subtle p-4">
              <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                You asked
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">{recognizedText}</p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold tracking-wide text-secondary uppercase">
                  DrishtiVoice Response (Demo Preview)
                </p>
              </div>
              <p className="mt-1.5 text-base leading-relaxed text-foreground">{aiResponse}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => speak(aiResponse)}
              className="min-h-12 flex-1 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:flex-none"
            >
              <Volume2 className="h-4 w-4" aria-hidden="true" />
              Replay Response
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={stopSpeech}
              disabled={!isSpeaking}
              className="min-h-12 gap-2"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              Stop Speaking
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                micButtonRef.current?.focus();
                handleMicToggle();
              }}
              className="min-h-12 gap-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Ask Another Question
            </Button>
          </div>
        </section>

        {/* Quick Voice-Action Cards */}
        <section aria-label="Quick voice actions" className="mt-8">
          <h2 className="text-lg font-bold text-foreground">Quick Voice Actions</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => void handleProcessQuestion(action.prompt)}
                  className="flex min-h-16 items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-surface-subtle"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-foreground">{action.label}</span>
                    <span className="block text-sm text-muted-foreground">"{action.prompt}"</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Bottom Controls: Switch to Camera + End Session */}
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <Button asChild variant="outline" size="lg" className="min-h-12 gap-2">
            <Link to="/camera">
              <Camera className="h-5 w-5" aria-hidden="true" />
              Open Camera Assistance
            </Link>
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={handleEndSession}
            className="min-h-12 gap-2"
          >
            <Power className="h-5 w-5" aria-hidden="true" />
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
}