import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { VoiceWaveform } from "@/components/VoiceWaveform";
import { useDrishti } from "@/contexts/DrishtiContext";
import { answerImageQuestion } from "@/lib/vision.functions";
import { parseVoiceCommand } from "@/lib/voice-commands";
import { createSpeechRecognition, speakText, stopSpeaking, type BrowserSpeechRecognition } from "@/services/speech";

export const Route = createFileRoute("/talk")({
  head: () => ({
    meta: [
      { title: "Hands-free Mode — DrishtiVoice" },
      { name: "description", content: "Tap anywhere and speak. DrishtiVoice looks through your camera and answers out loud — no need to see the screen." },
      { property: "og:title", content: "Hands-free Mode — DrishtiVoice" },
      { property: "og:description", content: "A screen-free, voice-only way to ask about your surroundings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TalkPage,
});

type Phase = "off" | "starting" | "listening" | "thinking" | "speaking";

const HELP =
  "Ask any question about what is in front of your phone, like: what is in front of me, read this, or what colour is this. Say repeat to hear the last answer again, stop to silence me, or goodbye to finish. Tap anywhere on the screen to interrupt me and speak.";

function beep(freq: number) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
    osc.onended = () => void ctx.close();
  } catch {
    // Sound cues are optional
  }
}

function TalkPage() {
  const navigate = useNavigate();
  const ask = useServerFn(answerImageQuestion);
  const { languages, accessibility, addHistoryEntry, announce } = useDrishti();
  const [phase, setPhase] = useState<Phase>("off");
  const [caption, setCaption] = useState("Tap anywhere to start talking.");
  const [typed, setTyped] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<BrowserSpeechRecognition | null>(null);
  const lastAnswer = useRef("");
  const activeRef = useRef(false);
  const lang = languages.responseLanguage;

  const say = useCallback(
    (text: string, then?: () => void) => {
      setCaption(text);
      announce(text);
      setPhase("speaking");
      const ok = speakText(text, {
        lang,
        rate: accessibility.voiceSpeed,
        volume: accessibility.voiceVolume,
        ...(accessibility.preferredVoiceURI ? { voiceURI: accessibility.preferredVoiceURI } : {}),
        onEnd: () => then?.(),
        onError: () => then?.(),
      });
      if (!ok) then?.();
    },
    [lang, accessibility, announce],
  );

  const shutdown = useCallback(() => {
    activeRef.current = false;
    recRef.current?.abort();
    recRef.current = null;
    stopSpeaking();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setPhase("off");
  }, []);

  useEffect(() => shutdown, [shutdown]);

  const grabFrame = (): string | null => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return null;
    const scale = Math.min(1, 1280 / v.videoWidth);
    const c = document.createElement("canvas");
    c.width = Math.round(v.videoWidth * scale);
    c.height = Math.round(v.videoHeight * scale);
    c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.8);
  };

  const listenRef = useRef<() => void>(() => {});

  const handleSpeech = useCallback(
    async (text: string) => {
      const cmd = parseVoiceCommand(text);
      if (!cmd) return listenRef.current();
      if (cmd.type === "stop") { stopSpeaking(); setCaption("Stopped. Tap anywhere to speak."); setPhase("off"); return; }
      if (cmd.type === "repeat") return say(lastAnswer.current || "There is no answer to repeat yet.", listenRef.current);
      if (cmd.type === "help") return say(HELP, listenRef.current);
      if (cmd.type === "exit") { say("Goodbye. Camera and microphone are now off."); setTimeout(shutdown, 2500); return; }
      const image = grabFrame();
      if (!image) return say("I can't see through the camera yet. Point your phone forward and ask again.", listenRef.current);
      setPhase("thinking");
      setCaption(`You asked: ${text}. Looking now…`);
      beep(520);
      announce("Looking now");
      try {
        const res = await ask({ data: { image, question: cmd.question, language: lang } });
        if (!activeRef.current) return;
        const answer = res.answer || res.error || "Sorry, I could not answer that. Please try again.";
        if (res.answer) {
          lastAnswer.current = res.answer;
          addHistoryEntry({ question: text, answer: res.answer, source: "camera", isDemo: false });
        }
        say(answer, listenRef.current);
      } catch {
        say("I couldn't connect. Check your internet and ask again.", listenRef.current);
      }
    },
    [ask, lang, say, shutdown, addHistoryEntry, announce],
  );

  const listen = useCallback(() => {
    if (!activeRef.current) return;
    recRef.current?.abort();
    const rec = createSpeechRecognition(lang);
    if (!rec) {
      setPhase("off");
      setCaption("Voice input isn't available in this browser. Type your question below, or use Chrome on Android.");
      return;
    }
    rec.interimResults = false;
    recRef.current = rec;
    let got = false;
    rec.onstart = () => { setPhase("listening"); setCaption("I'm listening…"); beep(880); };
    rec.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0]?.transcript ?? "").join(" ").trim();
      if (text) { got = true; void handleSpeech(text); }
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed") { got = true; say("Microphone access is blocked. Please allow the microphone in your browser settings, then tap the screen again."); setPhase("off"); }
    };
    rec.onend = () => { if (!got && activeRef.current) { setPhase("off"); setCaption("I didn't hear anything. Tap anywhere to speak."); beep(330); } };
    try { rec.start(); } catch { setPhase("off"); }
  }, [lang, handleSpeech, say]);
  listenRef.current = listen;

  const onTap = async () => {
    if (phase === "speaking") { stopSpeaking(); return listen(); }
    if (phase === "listening") { recRef.current?.stop(); return; }
    if (phase === "thinking") return;
    if (activeRef.current && streamRef.current) return listen();
    activeRef.current = true;
    setPhase("starting");
    setCaption("Starting camera…");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      if (!activeRef.current) { s.getTracks().forEach((t) => t.stop()); return; }
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play().catch(() => {}); }
      say("Camera is on. Hold your phone facing forward and ask me anything. Say help to hear what you can say.", listen);
    } catch {
      activeRef.current = false;
      say("I couldn't open the camera. Please allow camera access in your browser settings, then tap the screen again.");
      setPhase("off");
    }
  };

  const label: Record<Phase, string> = {
    off: "Tap anywhere to talk",
    starting: "Starting",
    listening: "Listening. Tap when done speaking",
    thinking: "Looking at the camera view",
    speaking: "Speaking. Tap to interrupt and ask",
  };

  return (
    <div className="flex min-h-dvh flex-col bg-primary text-primary-foreground">
      <h1 className="sr-only">DrishtiVoice hands-free mode</h1>
      <button
        type="button"
        onClick={() => void onTap()}
        aria-label={`${label[phase]}. ${caption}`}
        aria-describedby="talk-help"
        className="flex flex-1 flex-col items-center justify-center gap-8 p-6 text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent"
      >
        <span className={`flex h-44 w-44 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-2xl ${phase === "listening" ? "drishti-pulse-ring" : ""}`}>
          <Mic className="h-20 w-20" aria-hidden="true" />
        </span>
        <VoiceWaveform active={phase === "listening" || phase === "speaking"} label="" />
        <span className="text-3xl font-extrabold" aria-hidden="true">{label[phase]}</span>
        <span className="max-w-xl text-xl leading-relaxed opacity-90" aria-hidden="true">{caption}</span>
      </button>
      <p id="talk-help" className="sr-only">{HELP}</p>
      <video ref={videoRef} muted playsInline aria-hidden="true" className="pointer-events-none fixed bottom-24 right-3 h-20 w-16 rounded-md object-cover opacity-60" />
      <div className="flex gap-2 border-t border-primary-foreground/20 p-3">
        <form
          className="flex flex-1 gap-2"
          onSubmit={(e) => { e.preventDefault(); if (!typed.trim()) return; activeRef.current = true; void handleSpeech(typed); setTyped(""); }}
        >
          <label htmlFor="typed-q" className="sr-only">Type a question instead of speaking</label>
          <input id="typed-q" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Or type a question" className="min-h-12 flex-1 rounded-lg bg-background px-3 text-foreground placeholder:text-muted-foreground" />
        </form>
        <button type="button" onClick={() => { shutdown(); void navigate({ to: "/" }); }} className="min-h-12 rounded-lg border border-primary-foreground/40 px-4 font-semibold">
          Exit
        </button>
      </div>
    </div>
  );
}
