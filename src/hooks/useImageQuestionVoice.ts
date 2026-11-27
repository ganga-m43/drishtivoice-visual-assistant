import { useCallback, useEffect, useRef, useState } from "react";
import { createSpeechRecognition, isSpeechRecognitionSupported, type BrowserSpeechRecognition } from "@/services/speech";

export function useImageQuestionVoice(language: string, onQuestion: (text: string) => void) {
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState("");
  const stop = useCallback(() => { recognitionRef.current?.abort(); recognitionRef.current = null; setListening(false); }, []);
  useEffect(() => {
    setSupported(isSpeechRecognitionSupported());
    return () => { recognitionRef.current?.abort(); };
  }, []);
  useEffect(() => { stop(); }, [language, stop]);
  function start() {
    stop();
    setError("");
    const recognition = createSpeechRecognition(language);
    if (!recognition) { setError("Speech recognition is unavailable. Type your question instead, or use Chrome on Android."); return; }
    recognitionRef.current = recognition;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) text += event.results[i]?.[0]?.transcript ?? "";
      if (text.trim()) onQuestion(text.trim());
    };
    recognition.onerror = (event) => {
      setListening(false);
      setError(event.error === "not-allowed" ? "Microphone permission was denied. Allow microphone access in your browser’s site settings, or type your question." : "Speech could not be recognized. Check your connection and try again, or type your question.");
    };
    try { recognition.start(); } catch { setError("Microphone could not start. Please retry or type your question."); }
  }
  return { listening, supported, error, start, stop };
}