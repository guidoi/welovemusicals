import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, cities, getActiveMusicals, getActiveMusicalsByCity, musicals } from "./data";

describe("aktiver Musicalkatalog", () => {
  it("zeigt Wir sind am Leben und entfernt We Will Rock You nach Spielzeitende", () => {
    const activeIds = getActiveMusicals(musicals).map((musical) => musical.id);

    expect(ACTIVE_MUSICAL_IDS).toContain("wir-sind-am-leben");
    expect(ACTIVE_MUSICAL_IDS).not.toContain("we-will-rock-you");
    expect(activeIds).toContain("wir-sind-am-leben");
    expect(activeIds).not.toContain("we-will-rock-you");
  });

  it("führt We Will Rock You auch nicht mehr in der Stuttgarter Stadtkommunikation", () => {
    const stuttgart = cities.find((city) => city.slug === "stuttgart");
    const stuttgartIds = getActiveMusicalsByCity("Stuttgart").map((musical) => musical.id);

    expect(stuttgart?.description).not.toContain("We Will Rock You");
    expect(stuttgartIds).not.toContain("we-will-rock-you");
    expect(stuttgartIds).toContain("eiskoenigin");
  });

  it("aktiviert TINA für Hamburg und aktualisiert die Hamburger Teaserzählung", () => {
    const hamburg = cities.find((city) => city.slug === "hamburg");
    const hamburgIds = getActiveMusicalsByCity("Hamburg").map((musical) => musical.id);

    expect(ACTIVE_MUSICAL_IDS).toContain("tina-das-musical");
    expect(hamburgIds).toContain("tina-das-musical");
    expect(hamburg?.musicalCount).toBe(hamburgIds.length);
  });

  it("aktiviert Der Kleine Lord für Berlin und aktualisiert die Berliner Teaserzählung", () => {
    const berlin = cities.find((city) => city.slug === "berlin");
    const berlinIds = getActiveMusicalsByCity("Berlin").map((musical) => musical.id);

    expect(ACTIVE_MUSICAL_IDS).toContain("der-kleine-lord");
    expect(berlinIds).toContain("der-kleine-lord");
    expect(berlin?.musicalCount).toBe(berlinIds.length);
  });

  it("führt Die Schöne und das Biest mit dem Berliner BlueMax-Termin in Stadtseite und Filtern", () => {
    const berlin = cities.find((city) => city.slug === "berlin");
    const musical = musicals.find((candidate) => candidate.id === "schoene-und-das-biest");
    const berlinIds = getActiveMusicalsByCity("Berlin").map((candidate) => candidate.id);

    expect(musical?.cities).toContain("Berlin");
    expect(musical?.headerCities).toContain("Berlin");
    expect(musical?.tourDates).toContainEqual(expect.objectContaining({
      city: "Berlin",
      venue: "BlueMax Theater",
      startDate: "2027-01-06",
      endDate: "2027-01-23",
    }));
    expect(berlinIds).toContain("schoene-und-das-biest");
    expect(berlin?.musicalCount).toBe(berlinIds.length);
  });

  it("führt Aschenbrödel über aktive Tourtermine auf relevanten Stadtseiten und in Stadtfiltern", () => {
    const berlinIds = getActiveMusicalsByCity("Berlin").map((musical) => musical.id);
    const hamburgIds = getActiveMusicalsByCity("Hamburg").map((musical) => musical.id);
    const hannoverIds = getActiveMusicalsByCity("Hannover").map((musical) => musical.id);

    expect(berlinIds).toContain("dreihaselnuesse");
    expect(hamburgIds).toContain("dreihaselnuesse");
    expect(hannoverIds).toContain("dreihaselnuesse");
    expect(cities.find((city) => city.slug === "berlin")?.musicalCount).toBe(berlinIds.length);
    expect(cities.find((city) => city.slug === "hamburg")?.musicalCount).toBe(hamburgIds.length);
  });
});
