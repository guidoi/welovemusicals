import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HOME_HERO_IMAGE } from "../lib/home-hero";

const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const hero = source.slice(source.indexOf("{/* ===== HERO SECTION ===== */}"), source.indexOf("{/* Stats */}"));

describe("Wiederhergestellte Lesbarkeit des KDL-Startseitenheaders", () => {
  it("stellt den ursprünglichen flächigen transparenten Dunkelverlauf exakt wieder her", () => {
    expect(hero).toContain('className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"');
    expect(hero).not.toContain('data-testid="home-hero-bottom-fade"');
    expect(hero).not.toContain("h-[28%]");
    expect(hero).not.toMatch(/brightness-|saturate-|contrast-|opacity-\d+/);
    expect(hero).toContain("src={HOME_HERO_IMAGE}");
    expect(HOME_HERO_IMAGE).toContain("KDL_HH_Prio1_Rafiki_");
  });

  it("behält die ursprüngliche weiße und goldene Schrift ohne zusätzlichen Schattenfilter", () => {
    expect(hero).toContain("font-bold text-white");
    expect(hero).toContain('className="gold-gradient"');
    expect(hero).toContain("text-cream/75");
    expect(hero).not.toContain("drop-shadow(");
    expect(hero).not.toContain("textShadow:");
    expect(hero).not.toContain("filter:");
  });

  it("erhält Originalfoto, Bildausschnitt, Abstände und Eingangsanimation unverändert", () => {
    expect(hero).toContain("HOME_HERO_CONTENT_TOP_CLASS");
    expect(hero).toContain("DESKTOP_HERO_SECTION_CLASS");
    expect(hero).toContain("DESKTOP_HERO_IMAGE_POSITION_CLASS");
    expect(hero).toContain('width={676}');
    expect(hero).toContain('height={496}');
    expect(hero).toContain('initial={{ opacity: 0, y: 40 }}');
    expect(hero).toContain('animate={{ opacity: 1, y: 0 }}');
  });
});
