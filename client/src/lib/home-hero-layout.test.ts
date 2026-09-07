import { describe, expect, it } from "vitest";
import {
  DESKTOP_HERO_HIGHLIGHTS_TOP_CLASS,
  DESKTOP_HERO_IMAGE_POSITION_CLASS,
  DESKTOP_HERO_SECTION_CLASS,
  MOBILE_HERO_NAVIGATION_BOTTOM_CLASS,
  MOBILE_HERO_NAVIGATION_TOP_CLASS,
} from "./home-hero-layout";

describe("Mobile Hero-Navigationsabstände", () => {
  it("verdichtet nur die äußeren Abstände der Tabgruppen", () => {
    expect(MOBILE_HERO_NAVIGATION_TOP_CLASS).toBe("mt-10");
    expect(MOBILE_HERO_NAVIGATION_BOTTOM_CLASS).toBe("pt-8");
  });

  it("vergrößert den Desktop-Hero und priorisiert Sonne sowie Rafiki im Bildausschnitt", () => {
    expect(DESKTOP_HERO_SECTION_CLASS).toBe("md:min-h-[620px] xl:min-h-[700px] 2xl:min-h-[760px]");
    expect(DESKTOP_HERO_IMAGE_POSITION_CLASS).toBe("md:object-[50%_18%]");
  });

  it("rückt die Highlights am Desktop näher an den Hero, ohne den mobilen Abstand zu verändern", () => {
    expect(DESKTOP_HERO_HIGHLIGHTS_TOP_CLASS).toBe("md:pt-6");
    expect(MOBILE_HERO_NAVIGATION_BOTTOM_CLASS).toBe("pt-8");
  });
});
