import { describe, expect, it } from "vitest";
import {
  MOBILE_HERO_NAVIGATION_BOTTOM_CLASS,
  MOBILE_HERO_NAVIGATION_TOP_CLASS,
} from "./home-hero-layout";

describe("Mobile Hero-Navigationsabstände", () => {
  it("verdichtet nur die äußeren Abstände der Tabgruppen", () => {
    expect(MOBILE_HERO_NAVIGATION_TOP_CLASS).toBe("mt-10");
    expect(MOBILE_HERO_NAVIGATION_BOTTOM_CLASS).toBe("pt-8");
  });
});
