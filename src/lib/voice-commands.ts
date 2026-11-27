export type VoiceCommand =
  | { type: "stop" }
  | { type: "repeat" }
  | { type: "help" }
  | { type: "exit" }
  | { type: "ask"; question: string };

const has = (t: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}\\b`).test(t));

/** Turns a spoken phrase into a hands-free command. Anything unrecognised is a question about the camera view. */
export function parseVoiceCommand(raw: string): VoiceCommand | null {
  const t = raw.toLowerCase().trim().replace(/[.!?,]/g, "");
  if (!t) return null;
  if (/^(stop|quiet|silence|be quiet|cancel)$/.test(t)) return { type: "stop" };
  if (/^(repeat|again|say (that|it) again|repeat (that|it))$/.test(t)) return { type: "repeat" };
  if (/^(help|what can i say|commands)$/.test(t)) return { type: "help" };
  if (/^(exit|close|end session|goodbye|bye)$/.test(t)) return { type: "exit" };
  if (has(t, ["read"]) && t.split(" ").length <= 3) return { type: "ask", question: "Read all the printed text you can see, clearly and in order." };
  if (/^(describe|what is this|what's this|look)$/.test(t)) return { type: "ask", question: "Describe what is in front of me." };
  return { type: "ask", question: raw.trim() };
}
