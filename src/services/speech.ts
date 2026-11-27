export interface SpeechOptions {
  lang?: string;
  rate?: number;
  volume?: number;
  voiceURI?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export interface BrowserSpeechRecognitionEvent {
  results: ArrayLike<{
    0?: { transcript?: string };
    isFinal?: boolean;
  }>;
}

export interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w["SpeechRecognition"] || w["webkitSpeechRecognition"]);
}

export function createSpeechRecognition(lang: string): BrowserSpeechRecognition | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"]) as
    | SpeechRecognitionCtor
    | undefined;
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
}

export function stopSpeaking(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, options: SpeechOptions = {}): boolean {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    options.onError?.("Text-to-speech is not supported in this browser.");
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? "en-IN";
  utterance.rate = options.rate ?? 1;
  utterance.volume = options.volume ?? 1;

  if (options.voiceURI) {
    const match = window.speechSynthesis
      .getVoices()
      .find((v) => v.voiceURI === options.voiceURI);
    if (match) utterance.voice = match;
  }

  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = (e) => options.onError?.(e.error || "Speech playback failed");
  window.speechSynthesis.speak(utterance);
  return true;
}