import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HOME_HERO_IMAGE } from "../lib/home-hero";

const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const hero = source.slice(source.indexOf("{/* ===== HERO SECTION ===== */}"), source.indexOf("{/* Stats */}"));

describe("Originalfarben des KDL-Startseitenfotos", () => {
  it("entfernt die flächige Abdunklung statt Foto oder Sättigung künstlich zu verändern", () => {
    expect(hero).not.toContain("from-background/80");
    expect(hero).not.toContain("via-background/40");
    expect(hero).not.toMatch(/brightness-|saturate-|contrast-|opacity-\d+/);
    expect(hero).toContain("src={HOME_HERO_IMAGE}");
    expect(HOME_HERO_IMAGE).toContain("KDL_HH_Prio1_Rafiki_");
  });

  it("behält nur einen kurzen unteren Übergang, der das obere Motiv nicht abdunkelt", () => {
    expect(hero).toContain('data-testid="home-hero-bottom-fade"');
    expect(hero).toContain("bottom-0 h-[28%] bg-gradient-to-t from-background to-transparent");
    expect(hero).toContain('aria-hidden="true"');
    expect(hero).toContain("pointer-events-none");
  });

  it("sichert Schrift ohne neue Bild-Abdunklung oder Layoutänderung", () => {
    expect(hero).toContain('filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.9))"');
    expect(hero).not.toContain("textShadow:");
    expect(hero).toContain("HOME_HERO_CONTENT_TOP_CLASS");
    expect(hero).toContain("DESKTOP_HERO_SECTION_CLASS");
    expect(hero).toContain("DESKTOP_HERO_IMAGE_POSITION_CLASS");
    expect(hero).toContain('width={676}');
    expect(hero).toContain('height={496}');
    expect(hero).toContain('initial={{ opacity: 0, y: 40 }}');
  });
});
