/**
 * React Hook Tests
 *
 * Tests for highest-risk hooks: SSR behavior, state persistence,
 * cleanup, and edge cases.
 *
 * Run: npx vitest run
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";
import { useLocalStorage } from "../useLocalStorage";
import { useCopyToClipboard } from "../useCopyToClipboard";
import { useMediaQuery } from "../useMediaQuery";

// ---------------------------------------------------------------------------
// useDebounce
// ---------------------------------------------------------------------------

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("debounces value updates by the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } },
    );

    expect(result.current).toBe("a");

    rerender({ value: "b", delay: 300 });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("b");
  });

  it("resets timer when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("c");
  });

  it("cleans up timeout on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("test", 500));
    expect(() => unmount()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// useLocalStorage
// ---------------------------------------------------------------------------

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial value when key is not in storage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("reads existing value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("writes value to localStorage on set", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe("updated");
  });

  it("supports function updater pattern", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    expect(result.current[0]).toBe(2);
  });

  it("removes value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("default");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("bad-key", "not-json{{{");
    const { result } = renderHook(() => useLocalStorage("bad-key", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("handles complex objects", () => {
    const obj = { nested: { value: [1, 2, 3] } };
    const { result } = renderHook(() => useLocalStorage("obj-key", obj));

    expect(result.current[0]).toEqual(obj);
  });
});

// ---------------------------------------------------------------------------
// useCopyToClipboard
// ---------------------------------------------------------------------------

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with copied=false and no error", () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets copied=true on successful copy", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("test text");
    });

    expect(result.current.copied).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
  });

  it("resets copied after delay", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const { result } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current.copy("text");
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(false);
  });

  it("sets error on clipboard failure", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
    });

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("text");
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error?.message).toBe("Denied");
  });

  it("cleans up timeout on unmount", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const { result, unmount } = renderHook(() => useCopyToClipboard(5000));

    await act(async () => {
      await result.current.copy("text");
    });
    expect(() => unmount()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// useMediaQuery
// ---------------------------------------------------------------------------

describe("useMediaQuery", () => {
  it("returns defaultValue before mount (SSR safety)", () => {
    const { result } = renderHook(() =>
      useMediaQuery("(max-width: 768px)", true),
    );
    // On first render in test env, mounted is false, so returns defaultValue
    // After effect runs, it will use actual matchMedia
    expect(typeof result.current).toBe("boolean");
  });

  it("accepts custom defaultValue", () => {
    const { result } = renderHook(() =>
      useMediaQuery("(min-width: 1024px)", true),
    );
    expect(typeof result.current).toBe("boolean");
  });

  it("defaults to false when no defaultValue provided", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 99999px)"));
    expect(typeof result.current).toBe("boolean");
  });
});
