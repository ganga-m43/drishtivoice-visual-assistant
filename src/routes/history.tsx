import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Clock, Info, Mic, Square, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useDrishti } from "@/contexts/DrishtiContext";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Conversation History — DrishtiVoice" },
      {
        name: "description",
        content:
          "Review previous DrishtiVoice questions and spoken responses, replay answers aloud, or clear your history.",
      },
      { property: "og:title", content: "Conversation History — DrishtiVoice" },
      {
        property: "og:description",
        content: "Replay or manage your recent DrishtiVoice conversations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history, deleteHistoryEntry, clearHistory, speak, stopSpeech, isSpeaking, announce } =
    useDrishti();

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    toast.success("Conversation removed.");
    announce("Conversation deleted from history.");
  };

  const handleClearAll = () => {
    clearHistory();
    stopSpeech();
    toast.success("Conversation history cleared.");
    announce("All conversation history cleared.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Conversation History
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              Replay previous spoken answers or remove entries anytime.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <Button type="button" variant="outline" onClick={stopSpeech} className="min-h-12 gap-2">
                <Square className="h-4 w-4" aria-hidden="true" />
                Stop Speaking
              </Button>
            )}
            <Button
              type="button"
              variant="destructive"
              disabled={history.length === 0}
              onClick={handleClearAll}
              className="min-h-12 gap-2"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear History
            </Button>
          </div>
        </div>

        {/* Demonstration Data Notice */}
        <div
          role="note"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface-subtle p-4 text-sm text-muted-foreground"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
          <p>
            Initial entries are sample demonstration data stored only in this browser's local
            storage. No voice recordings or camera images are saved to a server.
          </p>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-bold text-foreground">No conversations saved</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a voice session or camera description and your recent exchanges will appear here.
            </p>
            <Button asChild size="lg" className="mt-5 min-h-12 bg-primary text-primary-foreground">
              <Link to="/assistant">Start Voice Assistant</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {history.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    {item.source === "camera" ? (
                      <Camera className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                    ) : (
                      <Mic className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    )}
                    {item.source === "camera" ? "Camera Assistance" : "Voice Assistant"}
                    {item.isDemo ? " · Demo" : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="mt-3 text-base font-bold text-foreground">{item.question}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => speak(item.answer)}
                    aria-label={`Replay answer to: ${item.question}`}
                    className="min-h-11 gap-2"
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    Replay Response
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Delete conversation: ${item.question}`}
                    className="min-h-11 gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}