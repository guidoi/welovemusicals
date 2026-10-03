import { describe, expect, it } from "vitest";
import { cities, getActiveMusicalsByCity } from "./data";
import { getCityEditorialContent } from "./city-editorial-content";

describe("katalogbasierte Stadtinhalte", () => {
  it("erstellt für Hamburg Highlights, Spielstätten und konkrete Planungsschritte", () => {
    const city = cities.find((candidate) => candidate.slug === "hamburg");
    expect(city).toBeDefined();

    const content = getCityEditorialContent(city!, getActiveMusicalsByCity(city!.name));

    expect(content?.eyebrow).toBe("AKTUELL IN HAMBURG · MUSICALS & SHOWS 2026/2027");
    expect(content?.heading).toBe("Musicalabend in Hamburg: Highlights & Planung");
    expect(content?.highlights).toHaveLength(4);
    expect(content?.highlights.map((highlight) => highlight.slug)).toContain("koenig-der-loewen");
    expect(content?.venues.map((venue) => venue.name)).toEqual(expect.arrayContaining([
      "Stage Theater im Hafen",
      "Stage Theater an der Elbe",
      "Stage Theater Neue Flora",
    ]));
    expect(content?.planningSteps).toHaveLength(3);
    expect(content?.planningSteps[0]?.title).toBe("Theater und Stadtteil zusammen planen");
  });

  it("macht für Bochum die unterschiedlichen Spielstätten transparent", () => {
    const city = cities.find((candidate) => candidate.slug === "bochum");
    expect(city).toBeDefined();

    const content = getCityEditorialContent(city!, getActiveMusicalsByCity(city!.name));

    expect(content?.intro).toContain("RuhrCongress");
    expect(content?.intro).toContain("Starlight Express Theater");
    expect(content?.venues.map((venue) => venue.name)).toEqual(expect.arrayContaining([
      "RuhrCongress",
      "STARLIGHT EXPRESS Theater Bochum",
    ]));
    expect(content?.planningSteps[0]?.title).toBe("RuhrCongress und STARLIGHT EXPRESS Theater unterscheiden");
  });

  it("liefert für jede aktiv bespielte Stadt eigene Inhalte und keine Ausgabe ohne Programm", () => {
    for (const city of cities) {
      const musicals = getActiveMusicalsByCity(city.name);
      const content = getCityEditorialContent(city, musicals);

      if (musicals.length === 0) {
        expect(content).toBeUndefined();
        continue;
      }

      expect(content?.intro).toContain(city.name);
      expect(content?.highlights.length).toBeGreaterThan(0);
      expect(content?.highlights.length).toBeLessThanOrEqual(4);
      expect(content?.venues.length).toBeGreaterThan(0);
      expect(content?.planningSteps).toHaveLength(3);
      expect(content?.highlights.every((highlight) => musicals.some((musical) => musical.slug === highlight.slug))).toBe(true);
    }
  });
});
