import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSetupDevice } from "@/hooks/useSetupDevice";

afterEach(() => vi.restoreAllMocks());

function mockMedia(getUserMedia: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });
}

describe("First-use permission tests", () => {
  it("requests microphone only and stops its tracks on exit", async () => {
    const stop = vi.fn();
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
    mockMedia(getUserMedia);
    const { result, unmount } = renderHook(() => useSetupDevice());
    await act(async () => { await result.current.start("microphone"); });
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true, video: false });
    expect(result.current.status).toBe("active");
    unmount();
    expect(stop).toHaveBeenCalledOnce();
  });

  it("requests a rear-facing camera without microphone access", async () => {
    const stop = vi.fn();
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
    mockMedia(getUserMedia);
    const { result, unmount } = renderHook(() => useSetupDevice());
    await act(async () => { await result.current.start("camera"); });
    expect(getUserMedia).toHaveBeenCalledWith({ audio: false, video: { facingMode: { ideal: "environment" } } });
    act(() => result.current.stop());
    expect(stop).toHaveBeenCalledOnce();
    expect(result.current.stream).toBeNull();
    expect(result.current.status).toBe("idle");
    unmount();
  });

  it("handles denied permission and permits a successful retry", async () => {
    const getUserMedia = vi.fn().mockRejectedValueOnce(new DOMException("Denied", "NotAllowedError"))
      .mockResolvedValueOnce({ getTracks: () => [{ stop: vi.fn() }] });
    mockMedia(getUserMedia);
    const { result, unmount } = renderHook(() => useSetupDevice());
    await act(async () => { await result.current.start("microphone"); });
    expect(result.current.status).toBe("error");
    expect(result.current.stream).toBeNull();
    await act(async () => { await result.current.start("microphone"); });
    expect(result.current.status).toBe("active");
    unmount();
  });

  it("releases late permission grants after the user leaves a test", async () => {
    const stop = vi.fn();
    let resolveStream: ((stream: unknown) => void) | undefined;
    mockMedia(vi.fn(() => new Promise((resolve) => { resolveStream = resolve; })));
    const { result, unmount } = renderHook(() => useSetupDevice());
    act(() => { void result.current.start("camera"); });
    act(() => result.current.stop());
    await act(async () => { resolveStream?.({ getTracks: () => [{ stop }] }); });
    await waitFor(() => expect(stop).toHaveBeenCalledOnce());
    expect(result.current.status).toBe("idle");
    expect(result.current.stream).toBeNull();
    unmount();
  });
});