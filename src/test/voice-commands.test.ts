import { describe, expect, it } from "vitest";
import { parseVoiceCommand } from "@/lib/voice-commands";

describe("parseVoiceCommand", () => {
  it("stop silences speech", () => expect(parseVoiceCommand("Stop.")).toEqual({ type: "stop" }));
  it("repeat replays", () => expect(parseVoiceCommand("repeat that")).toEqual({ type: "repeat" }));
  it("help lists commands", () => expect(parseVoiceCommand("What can I say?")).toEqual({ type: "help" }));
  it("exit ends session", () => expect(parseVoiceCommand("goodbye")).toEqual({ type: "exit" }));
  it("short read asks for text", () => expect(parseVoiceCommand("read this")?.type).toBe("ask"));
  it("other speech is a question", () =>
    expect(parseVoiceCommand("Is the stove on?")).toEqual({ type: "ask", question: "Is the stove on?" }));
  it("empty is ignored", () => expect(parseVoiceCommand("  ")).toBeNull());
});
