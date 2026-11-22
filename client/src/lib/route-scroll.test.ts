import { describe, expect, it } from "vitest";
import {
  didRouteChange,
  getScrollRestorationMode,
  getScrollToTopOptions,
  resetScrollToTop,
  scheduleScrollToTop,
} from "./route-scroll";

describe("route scroll helpers", () => {
  it.each([
    ["/", "", "auto"],
    ["/", "#more-musicals", "manual"],
    ["/", "#", "manual"],
    ["/musical/der-kleine-lord", "", "manual"],
    ["/musical/der-kleine-lord", "#tickets", "manual"],
    ["/stadt/graz", "", "manual"],
    ["/stadt/hamburg", "#musicals", "manual"],
  ] as const)("wählt für %s%s den Wiederherstellungsmodus %s", (pathname, hash, mode) => {
    expect(getScrollRestorationMode(pathname, hash)).toBe(mode);
  });

  it.each(["/?category=shows", "/?city=hamburg&view=list"])(
    "belässt die Home-Wiederherstellung mit Query %s beim Browser",
    (value) => {
      const url = new URL(value, "https://welovemusicals.com");
      expect(getScrollRestorationMode(url.pathname, url.hash)).toBe("auto");
    },
  );

  it("scrollt nicht beim ersten Render, aber bei jedem echten internen Routenwechsel", () => {
    expect(didRouteChange(null, "/")).toBe(false);
    expect(didRouteChange(null, "/musical/der-kleine-lord")).toBe(false);
    expect(didRouteChange(null, "/stadt/graz")).toBe(false);
    expect(didRouteChange("/", "/stadt/graz")).toBe(true);
    expect(didRouteChange("/stadt/graz", "/")).toBe(true);
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
