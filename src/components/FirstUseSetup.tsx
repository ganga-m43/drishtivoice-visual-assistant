import { useEffect, useRef, useState } from "react";
import { Camera, Mic, Volume2, Square, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useDrishti, SUPPORTED_LANGUAGES, type LanguageCode } from "@/contexts/DrishtiContext";
import { useSetupDevice } from "@/hooks/useSetupDevice";
import { createSpeechRecognition, isSpeechRecognitionSupported, type BrowserSpeechRecognition } from "@/services/speech";

const STEPS = ["Your language", "Microphone", "Camera", "Voice controls"];

export function FirstUseSetup() {
  const { setupOpen, setSetupOpen, languages, updateLanguages, speak, stopSpeech, announce } = useDrishti();
  const [step, setStep] = useState(0);
  const [micChecked, setMicChecked] = useState(false);
  const [cameraChecked, setCameraChecked] = useState(false);
  const [heardSound, setHeardSound] = useState(false);
  const [level, setLevel] = useState(0);
  const [practice, setPractice] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const device = useSetupDevice();
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const language = SUPPORTED_LANGUAGES.find((item) => item.code === languages.speakingLanguage);

  useEffect(() => {
    if (!setupOpen) return;
    setStep(0);
    setSpeechSupported(isSpeechRecognitionSupported());
  }, [setupOpen]);

  useEffect(() => {
    if (setupOpen) headingRef.current?.focus();
  }, [setupOpen, step]);

  useEffect(() => {
    if (!setupOpen) {
      device.stop();
      recognitionRef.current?.abort();
      stopSpeech();
    }
  }, [setupOpen, device.stop, stopSpeech]);

  useEffect(() => {
    if (!device.stream || step !== 2 || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = device.stream;
    void video.play().then(() => setCameraChecked(true)).catch(() => {});
    return () => { video.srcObject = null; };
  }, [device.stream, step]);

  useEffect(() => {
    if (!device.stream || step !== 1) return;
    setMicChecked(true);
    let context: AudioContext | null = null;
    let frame = 0;
    try {
      context = new AudioContext();
      void context.resume().catch(() => {});
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      context.createMediaStreamSource(device.stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const update = () => {
        analyser.getByteTimeDomainData(samples);
        const strength = Math.min(100, Math.round(Math.max(...samples.map((value) => Math.abs(value - 128))) * 3));
        setLevel(strength);
        if (strength > 8) setHeardSound(true);
        frame = requestAnimationFrame(update);
      };
      update();
    } catch {
      // Permission can succeed even when the browser cannot expose an audio meter.
    }
    return () => {
      cancelAnimationFrame(frame);
      if (context && context.state !== "closed") void context.close().catch(() => {});
    };
  }, [device.stream, step]);

  useEffect(() => () => { recognitionRef.current?.abort(); }, []);

  function finish(completed: boolean) {
    device.stop();
    recognitionRef.current?.abort();
    setListening(false);
    stopSpeech();
    try { localStorage.setItem("drishtivoice_setup_v1", completed ? "complete" : "skipped"); } catch { /* Device storage may be unavailable. */ }
    setSetupOpen(false);
    announce(completed ? "Setup complete. You can start your voice assistant." : "Setup skipped. Reopen First-use setup any time.");
  }

  function move(next: number) {
    device.stop();
    recognitionRef.current?.abort();
    setListening(false);
    stopSpeech();
    setStep(next);
  }

  function startPractice() {
    stopSpeech();
    recognitionRef.current?.abort();
    const recognition = createSpeechRecognition(languages.speakingLanguage);
    if (!recognition) {
      setPractice("Speech recognition is unavailable. You can use the assistant’s quick action buttons instead.");
      return;
    }
    recognitionRef.current = recognition;
    setPractice("");
    recognition.onstart = () => { setListening(true); announce("Listening. Ask a short question."); };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i]?.[0]?.transcript ?? "";
      if (transcript.trim()) setPractice(`You said: ${transcript.trim()}`);
    };
    recognition.onerror = (event) => {
      setListening(false);
      setPractice(event.error === "not-allowed"
        ? "Microphone access was blocked. Allow it in your browser’s site settings and retry."
        : "No speech was recognized. Check your connection and try again, or continue without practice.");
    };
    recognition.onend = () => setListening(false);
    try { recognition.start(); } catch { setPractice("Voice practice could not start. Please retry."); }
  }

  const instructions = step === 0
    ? "Welcome to DrishtiVoice. Choose your speaking and response language, then continue. All device tests are optional."
    : step === 1
      ? "Select Test microphone and allow access in the browser. Say hello. Sound detected means your microphone hears sound. Select Stop test when done."
      : step === 2
        ? "Select Test camera and allow access in the browser. Point the camera at something nearby. The live preview stays on your device. Select Stop test when done."
        : "Tap Speak in the assistant, then ask your question. Tap Stop to stop listening. Replay Response reads the last answer. Stop Speaking silences the answer. End Session stops the session. There is no always-on listening or wake word.";

  return (
    <Dialog open={setupOpen} onOpenChange={(open) => { if (!open) finish(false); }}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg p-5 sm:p-7 [&>button]:min-h-12 [&>button]:min-w-12 [&>button]:right-1 [&>button]:top-1 [&>button]:flex [&>button]:items-center [&>button]:justify-center" onOpenAutoFocus={(event) => { event.preventDefault(); headingRef.current?.focus(); }}>
        <div className="pr-7">
          <p className="mb-2 text-sm font-bold text-secondary">DrishtiVoice · First-use setup</p>
          <DialogTitle ref={headingRef} tabIndex={-1} className="text-2xl leading-snug">{STEPS[step]}</DialogTitle>
          <DialogDescription className="mt-2">Step {step + 1} of 4. Take your time; every test is optional.</DialogDescription>
        </div>
        <ol aria-label="Setup progress" className="grid grid-cols-4 gap-2">
          {STEPS.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined} className={`border-t-4 pt-2 text-xs font-semibold ${index <= step ? "border-secondary text-foreground" : "border-border text-muted-foreground"}`}><span className="sr-only">Step {index + 1}: </span>{label}</li>)}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => speak(instructions, "en-IN")} className="min-h-12"><Volume2 aria-hidden="true" />Hear this step</Button>
          <Button variant="ghost" onClick={stopSpeech} className="min-h-12"><Square aria-hidden="true" />Stop audio</Button>
        </div>
        {step === 0 && <div className="space-y-4">
          <p>Choose the language you want to speak and hear. You can change these separately in Language Settings later.</p>
          <label htmlFor="setup-language" className="block font-semibold">Speaking and response language</label>
          <select id="setup-language" value={languages.speakingLanguage} onChange={(event) => { const code = event.target.value as LanguageCode; updateLanguages({ speakingLanguage: code, responseLanguage: code }); }} className="min-h-12 w-full rounded-md border border-input bg-background px-3 text-foreground">
            {SUPPORTED_LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.name} — {item.nativeName}</option>)}
          </select>
          <Button variant="outline" className="min-h-12" onClick={() => { if (language) speak(language.samplePhrase, language.code); }}><Volume2 aria-hidden="true" />Preview selected language</Button>
          <p className="text-sm text-muted-foreground">Available voices depend on your device. Setup instructions are in English; the preview uses your selected language.</p>
        </div>}
        {(step === 1 || step === 2) && <div className="space-y-4">
          <p>{step === 1 ? "Allow microphone access, then say “hello” to check that sound reaches your microphone." : "Allow camera access to check the live view. Point your phone at a nearby object."}</p>
          <p className="text-sm text-muted-foreground">Nothing is recorded, saved, or uploaded during this test. Leaving this step turns the device off.</p>
          {step === 2 && <video ref={videoRef} autoPlay muted playsInline aria-label="Camera test live preview" className={`aspect-video max-h-40 w-full rounded-md bg-muted object-contain ${device.status === "active" ? "block" : "hidden"}`} onLoadedData={() => setCameraChecked(true)} />}
          {step === 1 && device.status === "active" && <div>
            <label htmlFor="setup-sound" className="block text-sm font-semibold">Microphone sound level</label>
            <meter id="setup-sound" min={0} max={100} value={level} className="h-6 w-full" />
          </div>}
          <p role="status" aria-live="polite" className="font-semibold">
            {device.status === "requesting" ? "Waiting for browser permission…" : device.status === "active" ? step === 1 ? heardSound ? "Sound detected. Your microphone is working." : "Microphone access allowed. Say hello; waiting for sound…" : cameraChecked ? "Camera preview ready. Your camera is working." : "Camera access allowed. Waiting for the preview…" : step === 1 && micChecked ? "Microphone test stopped." : step === 2 && cameraChecked ? "Camera test stopped." : "Not tested yet."}
          </p>
          {device.error && <p role="alert" className="text-destructive">{device.error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button disabled={device.status === "requesting" || device.status === "active"} className="min-h-12" onClick={() => { setHeardSound(false); setCameraChecked(false); void device.start(step === 1 ? "microphone" : "camera"); }}>{step === 1 ? <Mic aria-hidden="true" /> : <Camera aria-hidden="true" />}{device.status === "error" ? "Retry test" : step === 1 ? "Test microphone" : "Test camera"}</Button>
            {(device.status === "active" || device.status === "requesting") && <Button variant="outline" className="min-h-12" onClick={device.stop}><Square aria-hidden="true" />Stop test</Button>}
          </div>
        </div>}
        {step === 3 && <div className="space-y-4">
          <p>Tap <strong>Speak</strong>, then ask “What is in front of me?” or a question in your chosen language.</p>
          <dl className="space-y-2 text-sm">
            <div><dt className="font-bold">Stop listening</dt><dd>Tap the microphone again while it is listening.</dd></div>
            <div><dt className="font-bold">Replay Response / Stop Speaking</dt><dd>Hear the last answer again, or silence playback.</dd></div>
            <div><dt className="font-bold">End Session</dt><dd>Stop listening and spoken playback.</dd></div>
          </dl>
          <p className="text-sm text-muted-foreground">No wake word or always-on listening. Practice only checks speech recognition; it does not analyze your surroundings or add to history.</p>
          {speechSupported ? <Button className="min-h-12" onClick={listening ? () => recognitionRef.current?.stop() : startPractice}>{listening ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}{listening ? "Stop listening" : "Practice speaking"}</Button> : <p role="status">Speech recognition is unavailable in this browser. Use the assistant’s quick actions instead, or try Chrome on Android.</p>}
          <p role="status" aria-live="polite">{listening ? "Listening…" : practice || "You can finish without practicing."}</p>
          <p className="text-sm text-muted-foreground">Visual answers currently use demo mode. Keep using your usual mobility aids; DrishtiVoice is not a navigation aid.</p>
        </div>}
        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background py-4">
          {step > 0 ? <Button variant="outline" className="min-h-12" onClick={() => move(step - 1)}><ArrowLeft aria-hidden="true" />Back</Button> : <Button variant="ghost" className="min-h-12" onClick={() => finish(false)}>Set up later</Button>}
          <Button className="min-h-12" onClick={() => step === 3 ? finish(true) : move(step + 1)}>{step === 3 ? <CheckCircle2 aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}{step === 3 ? "Finish setup" : (step === 1 || step === 2) && device.status !== "active" && !(step === 1 ? micChecked : cameraChecked) ? "Skip test" : "Continue"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}