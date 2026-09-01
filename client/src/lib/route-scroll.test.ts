import { describe, expect, it } from "vitest";
import { didRouteChange, getScrollToTopOptions, resetScrollToTop } from "./route-scroll";

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
});
