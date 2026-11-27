import { useCallback, useEffect, useRef, useState } from "react";

export function useSetupDevice() {
  const streamRef = useRef<MediaStream | null>(null);
  const generation = useRef(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<"idle" | "requesting" | "active" | "error">("idle");
  const [error, setError] = useState("");

  const release = useCallback(() => {
    generation.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    release();
    setStream(null);
    setStatus("idle");
  }, [release]);

  const start = useCallback(async (kind: "microphone" | "camera") => {
    stop();
    const request = generation.current;
    setError("");
    setStatus("requesting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }
      const next = await navigator.mediaDevices.getUserMedia(
        kind === "microphone"
          ? { audio: true, video: false }
          : { audio: false, video: { facingMode: { ideal: "environment" } } },
      );
      if (request !== generation.current) {
        next.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = next;
      setStream(next);
      setStatus("active");
    } catch (cause) {
      if (request !== generation.current) return;
      const name = cause instanceof Error ? cause.name : "";
      setError(name === "NotAllowedError" || name === "SecurityError"
        ? `Access to your ${kind} was blocked. In your browser’s site settings, allow ${kind} access, then retry. You can also skip this test.`
        : name === "NotFoundError"
          ? `No ${kind} was found. Connect one and retry, or skip this test.`
          : `Your ${kind} could not start. Check that it is not in use by another app and that you are using a supported browser on a secure connection. Retry or skip this test.`);
      setStatus("error");
    }
  }, [stop]);

  useEffect(() => release, [release]);
  return { stream, status, error, start, stop };
}