import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "active" | "captured" | "error";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    setCapturedImage(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMessage(
        "Camera access is not supported in this browser or context. You can still try Demo Capture below.",
      );
      return false;
    }

    setStatus("requesting");
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("active");
      return true;
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setErrorMessage(
          "Camera permission was denied. Please allow camera access in your browser settings, or use Demo Capture to test the interface.",
        );
      } else if (name === "NotFoundError") {
        setErrorMessage(
          "No camera was detected on this device. You can use Demo Capture to preview how DrishtiVoice describes images.",
        );
      } else {
        setErrorMessage(
          "Unable to start the camera right now. You can retry or use Demo Capture.",
        );
      }
      setStatus("error");
      return false;
    }
  }, []);

  const captureImage = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopStream();
    setStatus("captured");
    return dataUrl;
  }, [stopStream]);

  const setDemoImage = useCallback(
    (imageUrl: string) => {
      stopStream();
      setErrorMessage(null);
      setCapturedImage(imageUrl);
      setStatus("captured");
    },
    [stopStream],
  );

  const retake = useCallback(() => {
    setCapturedImage(null);
    void startCamera();
  }, [startCamera]);

  const stopCamera = useCallback(() => {
    stopStream();
    setCapturedImage(null);
    setErrorMessage(null);
    setStatus("idle");
  }, [stopStream]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  return {
    videoRef,
    status,
    capturedImage,
    errorMessage,
    startCamera,
    captureImage,
    setDemoImage,
    retake,
    stopCamera,
  };
}