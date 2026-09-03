import { describe, expect, it } from "vitest";
import {
  createHeroAnchorHistoryState,
  getHeroAnchorHistoryAction,
  getHomeHeroScrollOptions,
  isHeroAnchorHistoryState,
  shouldRestoreHomeHero,
} from "./hero-anchor-history";

describe("hero anchor history", () => {
  it("kennzeichnet einen Ankerverlauf und bewahrt vorhandenen Verlaufszustand", () => {
    const state = createHeroAnchorHistoryState({ from: "home" }, "#musicals");

    expect(state).toMatchObject({
      from: "home",
      "hero-anchor-navigation": true,
      heroAnchor: "#musicals",
    });
    expect(isHeroAnchorHistoryState(state)).toBe(true);
    expect(isHeroAnchorHistoryState({})).toBe(false);
    expect(getHeroAnchorHistoryAction({})).toBe("push");
    expect(getHeroAnchorHistoryAction(state)).toBe("replace");
  });

  it("liefert für die Rückkehr zur Startseite einen sofortigen Scroll zum Hero", () => {
    expect(getHomeHeroScrollOptions()).toEqual({ top: 0, left: 0, behavior: "auto" });
    expect(shouldRestoreHomeHero("/", "")).toBe(true);
    expect(shouldRestoreHomeHero("/", "#musicals")).toBe(false);
    expect(shouldRestoreHomeHero("/impressum", "")).toBe(false);
  });
});
