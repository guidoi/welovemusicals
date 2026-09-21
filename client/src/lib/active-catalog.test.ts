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
});
