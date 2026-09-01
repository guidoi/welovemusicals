import { describe, expect, it } from "vitest";
import { didRouteChange, getScrollToTopOptions, resetScrollToTop, scheduleScrollToTop } from "./route-scroll";

describe("route scroll helpers", () => {
  it("scrollt nicht beim ersten Render, aber bei jedem echten internen Routenwechsel", () => {
    expect(didRouteChange(null, "/stadt/graz")).toBe(false);
    expect(didRouteChange("/", "/stadt/graz")).toBe(true);
    expect(didRouteChange("/stadt/graz", "/stadt/graz")).toBe(false);
  });

  it("liefert eine unmittelbare, positionsneutrale Scrollkorrektur zum Seitenanfang", () => {
    expect(getScrollToTopOptions()).toEqual({ top: 0, left: 0, behavior: "auto" });
  });

  it("setzt den Scrollstand synchron zurück, bevor eine Städtekarte die Route wechselt", () => {
    const scrollTo = (options: ScrollToOptions) => calls.push(options);
    const calls: ScrollToOptions[] = [];

    resetScrollToTop(scrollTo);

    expect(calls).toEqual([{ top: 0, left: 0, behavior: "auto" }]);
  });

  it("sichert den Stadtseiten-Start zusätzlich nach Frame und Layoutverzögerung ab", () => {
    const calls: ScrollToOptions[] = [];
    let frameCallback: (() => void) | undefined;
    let delayCallback: (() => void) | undefined;
    const cancelled: number[] = [];
    const cleared: number[] = [];
    const cleanup = scheduleScrollToTop(
      (options) => calls.push(options),
      {
        requestFrame: (callback) => {
          frameCallback = callback;
          return 7;
        },
        cancelFrame: (id) => cancelled.push(id),
        setDelay: (callback, delay) => {
          expect(delay).toBe(120);
          delayCallback = callback;
          return 11;
        },
        clearDelay: (id) => cleared.push(id),
      },
    );

    frameCallback?.();
    delayCallback?.();
    cleanup();

    expect(calls).toEqual([
      { top: 0, left: 0, behavior: "auto" },
      { top: 0, left: 0, behavior: "auto" },
      { top: 0, left: 0, behavior: "auto" },
    ]);
    expect(cancelled).toEqual([7]);
    expect(cleared).toEqual([11]);
  });
});
