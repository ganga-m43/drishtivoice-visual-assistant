import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  CameraOff,
  Eye,
  FileText,
  HelpCircle,
  Loader2,
  MessageSquare,
  RotateCcw,
  Search,
  ShieldAlert,
  Square,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import heroSample from "@/assets/hero-drishtivoice.jpg";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDrishti } from "@/contexts/DrishtiContext";
import { useCamera } from "@/hooks/useCamera";
import {
  analyzeCameraImage,
  type VisionAnalysisResult,
  type VisionTask,
} from "@/services/vision";

export const Route = createFileRoute("/camera")({
  head: () => ({
    meta: [
      { title: "Camera Assistance — DrishtiVoice" },
      {
        name: "description",
        content:
          "Use your rear smartphone camera to describe surroundings, read printed text, find objects, and ask follow-up questions.",
      },
      { property: "og:title", content: "Camera Assistance — DrishtiVoice" },
      {
        property: "og:description",
        content: "Accessible rear-camera visual assistance with spoken descriptions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CameraAssistancePage,
});

const TASKS: { id: VisionTask; label: string; icon: typeof Eye }[] = [
  { id: "describe", label: "Describe Surroundings", icon: Eye },
  { id: "read_text", label: "Read Text", icon: FileText },
  { id: "find_object", label: "Find Object", icon: Search },
  { id: "ask_image", label: "Ask About Image", icon: HelpCircle },
];

function CameraAssistancePage() {
  const { speak, stopSpeech, isSpeaking, announce, accessibility, addHistoryEntry } = useDrishti();
  const {
    videoRef,
    status,
    capturedImage,
    errorMessage,
    startCamera,
    captureImage,
    setDemoImage,
    retake,
    stopCamera,
  } = useCamera();

  const [selectedTask, setSelectedTask] = useState<VisionTask>("describe");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [followUp, setFollowUp] = useState("");

  const runAnalysis = async (imageData: string, task: VisionTask, question?: string) => {
    setAnalyzing(true);
    setSelectedTask(task);
    announce("Analyzing captured image...");
    try {
      const res = await analyzeCameraImage(imageData, task, question);
      setAnalysis(res);
      announce(`Analysis complete. ${res.description}`);
      addHistoryEntry({
        question: question?.trim() || TASKS.find((t) => t.id === task)?.label || "Camera analysis",
        answer: res.description,
        source: "camera",
        isDemo: res.isDemo,
      });
      if (accessibility.audioInstructions) {
        speak(res.description);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setAnalysis(null);
    const ok = await startCamera();
    if (ok) {
      toast.success("Rear camera is active.");
      announce("Camera is active. Point your phone ahead and press Capture Image.");
    } else {
      announce("Camera could not be started. You can use Demo Capture below.", "assertive");
    }
  };

  const handleCapture = () => {
    const img = captureImage();
    if (!img) {
      toast.error("Could not capture frame. Please try again.");
      return;
    }
    toast.success("Image captured in memory only (not saved).");
    void runAnalysis(img, selectedTask);
  };

  const handleDemoCapture = () => {
    setDemoImage(heroSample);
    toast.info("Demo image loaded. Showing sample AI output.");
    void runAnalysis(heroSample, selectedTask);
  };

  const handleStop = () => {
    stopCamera();
    stopSpeech();
    setAnalysis(null);
    toast.info("Camera stopped.");
    announce("Camera stopped.");
  };

  const handleTaskClick = (task: VisionTask) => {
    setSelectedTask(task);
    if (capturedImage) {
      void runAnalysis(capturedImage, task, task === "ask_image" ? followUp : undefined);
    } else {
      toast.info(`Selected "${TASKS.find((t) => t.id === task)?.label}". Capture an image first.`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Camera Assistance
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              Capture surroundings or documents for clear spoken descriptions.
            </p>
          </div>
          <span
            role="status"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold ${
              status === "active"
                ? "border-success bg-success/10 text-success"
                : "border-border bg-card text-foreground"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${
                status === "active" ? "bg-success" : "bg-muted-foreground"
              }`}
            />
            {status === "active"
              ? "Camera Active"
              : status === "captured"
                ? "Image Captured"
                : status === "requesting"
                  ? "Requesting Permission..."
                  : "Camera Off"}
          </span>
        </div>

        {/* Viewport */}
        <section aria-label="Camera preview" className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="relative aspect-[4/3] w-full bg-primary/5 sm:aspect-[16/10]">
            <video
              ref={videoRef}
              playsInline
              muted
              aria-label="Live rear camera preview"
              className={`h-full w-full object-cover ${status === "active" ? "block" : "hidden"}`}
            />

            {status === "captured" && capturedImage && (
              <img
                src={capturedImage}
                alt="Captured camera frame ready for analysis"
                className="h-full w-full object-cover"
              />
            )}

            {(status === "idle" || status === "requesting" || status === "error") && (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {status === "error" ? (
                    <AlertTriangle className="h-8 w-8 text-warning" aria-hidden="true" />
                  ) : (
                    <Camera className="h-8 w-8" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-4 max-w-md text-base font-semibold text-foreground">
                  {status === "error"
                    ? errorMessage
                    : "Camera permission is requested only when you tap Start Camera."}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Photos stay in temporary memory and are never stored by default.
                </p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex flex-wrap gap-3 border-t border-border bg-card p-4">
            {status !== "active" && (
              <Button
                type="button"
                size="lg"
                onClick={() => void handleStart()}
                className="min-h-12 flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:flex-none"
              >
                <Camera className="h-5 w-5" aria-hidden="true" />
                Start Camera
              </Button>
            )}
            {status === "active" && (
              <Button
                type="button"
                size="lg"
                onClick={handleCapture}
                className="min-h-12 flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 sm:flex-none"
              >
                <Camera className="h-5 w-5" aria-hidden="true" />
                Capture Image
              </Button>
            )}
            {status === "captured" && (
              <Button type="button" size="lg" variant="outline" onClick={retake} className="min-h-12 gap-2">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Retake Image
              </Button>
            )}
            {(status === "active" || status === "captured") && (
              <Button type="button" size="lg" variant="destructive" onClick={handleStop} className="min-h-12 gap-2">
                <CameraOff className="h-4 w-4" aria-hidden="true" />
                Stop Camera
              </Button>
            )}
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleDemoCapture}
              className="min-h-12 gap-2"
            >
              Try Demo Capture
            </Button>
          </div>
        </section>

        {/* Four Task Buttons */}
        <section aria-label="Visual assistance tasks" className="mt-6">
          <h2 className="text-lg font-bold text-foreground">Choose What You Need</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TASKS.map((task) => {
              const Icon = task.icon;
              const active = selectedTask === task.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleTaskClick(task.id)}
                  aria-pressed={active}
                  className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-surface-subtle"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{task.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Analysis Panel */}
        {(analyzing || analysis) && (
          <section
            aria-label="Image analysis results"
            className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            {analyzing ? (
              <div role="status" className="flex items-center gap-3 py-4">
                <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden="true" />
                <p className="text-base font-semibold text-foreground">
                  Analyzing captured image...
                </p>
              </div>
            ) : (
              analysis && (
                <div className="space-y-5">
                  {analysis.isDemo && (
                    <div
                      role="note"
                      className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-3.5 text-sm text-foreground"
                    >
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
                      <p>{analysis.uncertaintyNote}</p>
                    </div>
                  )}

                  <div>
                    <h2 className="text-lg font-bold text-primary">Description</h2>
                    <p className="mt-2 text-base leading-relaxed text-foreground">
                      {analysis.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                      Visible Objects & Approximate Positions
                    </h3>
                    <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {analysis.objects.map((obj) => (
                        <li
                          key={obj.name}
                          className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm"
                        >
                          <span className="font-bold text-foreground">{obj.name}</span>
                          <span className="text-muted-foreground">{obj.position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => speak(analysis.description)}
                      className="min-h-12 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                      Read Aloud
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={stopSpeech}
                      disabled={!isSpeaking}
                      className="min-h-12 gap-2"
                    >
                      <Square className="h-4 w-4" aria-hidden="true" />
                      Stop Reading
                    </Button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!followUp.trim() || !capturedImage) return;
                      void runAnalysis(capturedImage, "ask_image", followUp);
                      setFollowUp("");
                    }}
                    className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row"
                  >
                    <label htmlFor="follow-up-input" className="sr-only">
                      Ask a follow-up question about this image
                    </label>
                    <Input
                      id="follow-up-input"
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      placeholder="Ask a follow-up question about this image..."
                      className="min-h-12 flex-1"
                    />
                    <Button type="submit" size="lg" className="min-h-12 gap-2">
                      <MessageSquare className="h-4 w-4" aria-hidden="true" />
                      Ask Follow-up
                    </Button>
                  </form>
                </div>
              )
            )}
          </section>
        )}

        {/* Safety reminder */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
          <p>
            <strong className="text-foreground">Safety reminder:</strong> DrishtiVoice provides
            assistive visual descriptions and cannot guarantee obstacle detection or safe walking
            paths. Always use your white cane or guide dog for navigation. Need voice-only help?{" "}
            <Link to="/assistant" className="font-semibold text-accent underline">
              Return to Voice Assistant
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}