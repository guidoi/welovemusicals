import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cityDetailSource = readFileSync(new URL("./CityDetail.tsx", import.meta.url), "utf8");

describe("CityDetail redaktionelle Stadtinhalte", () => {
  it("verbindet den aktiven Katalog mit Highlights, Spielstätten und internen Musical-Links", () => {
    expect(cityDetailSource).toContain('import { getCityEditorialContent } from "@/lib/city-editorial-content";');
    expect(cityDetailSource).toContain("const editorialContent = getCityEditorialContent(city, cityMusicals);");
    expect(cityDetailSource).toContain('aria-labelledby="city-editorial-heading"');
    expect(cityDetailSource).toContain("editorialContent.highlightsHeading");
    expect(cityDetailSource).toContain("editorialContent.venuesHeading");
    expect(cityDetailSource).toContain("editorialContent.planningHeading");
    expect(cityDetailSource).toContain('href={`/musical/${highlight.slug}`}');
  });

  it("hält offizielle Quellen als Ergänzung bereit, ohne den redaktionellen Katalogtext zu duplizieren", () => {
    expect(cityDetailSource).toContain("Offizielle Hinweise für deinen Besuch in {city.name}");
    expect(cityDetailSource).toContain("cityGuide.officialLinks.map");
    expect(cityDetailSource).not.toContain("cityGuide.steps.map");
  });
});
