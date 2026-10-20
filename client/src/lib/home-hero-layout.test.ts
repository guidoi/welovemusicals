import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DESKTOP_HERO_HIGHLIGHTS_TOP_CLASS,
  DESKTOP_HERO_IMAGE_POSITION_CLASS,
  DESKTOP_HERO_SECTION_CLASS,
  HOME_HERO_CONTENT_TOP_CLASS,
  MOBILE_HERO_NAVIGATION_BOTTOM_CLASS,
  MOBILE_HERO_NAVIGATION_TOP_CLASS,
} from "./home-hero-layout";

describe("Mobile Hero-Navigationsabstände", () => {
  it("verdichtet nur die äußeren Abstände der Tabgruppen", () => {
    expect(MOBILE_HERO_NAVIGATION_TOP_CLASS).toBe("mt-5");
    expect(MOBILE_HERO_NAVIGATION_BOTTOM_CLASS).toBe("pt-5");
    expect(HOME_HERO_CONTENT_TOP_CLASS).toBe("pt-28 md:pt-20");
  });

  it("vergrößert den Desktop-Hero und priorisiert Sonne sowie Rafiki im Bildausschnitt", () => {
    expect(DESKTOP_HERO_SECTION_CLASS).toBe("md:min-h-[620px] xl:min-h-[700px] 2xl:min-h-[760px]");
    expect(DESKTOP_HERO_IMAGE_POSITION_CLASS).toBe("md:object-[50%_18%]");
  });

  it("rückt die Highlights am Desktop näher an den Hero, ohne den mobilen Abstand zu verändern", () => {
    expect(DESKTOP_HERO_HIGHLIGHTS_TOP_CLASS).toBe("md:pt-0");
    expect(MOBILE_HERO_NAVIGATION_BOTTOM_CLASS).toBe("pt-5");
  });

  it("beginnt die ankernlose Startseite bereits vor React zuverlässig am Hero", () => {
    const indexHtml = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain('id="home-scroll-bootstrap"');
    expect(indexHtml).toContain('window.history.scrollRestoration = "manual"');
    expect(indexHtml).toContain('window.location.pathname !== "/" || window.location.hash');
    expect(indexHtml).toContain('window.addEventListener("pageshow"');
    expect(indexHtml).toContain('window.setTimeout(resetHomeScroll, 120)');
    expect(indexHtml).toContain('window.setTimeout(resetHomeScroll, 500)');
    expect(indexHtml).toContain('window.addEventListener("scroll", lockHomeScroll');
    expect(indexHtml).toContain('window.removeEventListener("scroll", lockHomeScroll)');
    expect(indexHtml).toContain('}, 1000)');
    expect(indexHtml).toContain('window.addEventListener("load", scheduleHomeScrollReset');
  });
});
