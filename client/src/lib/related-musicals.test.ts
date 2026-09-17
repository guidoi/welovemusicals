import { describe, expect, it } from "vitest";
import type { Musical } from "./data";
import { getRelatedMusicals } from "./related-musicals";

function musical(id: string, overrides: Partial<Musical> = {}): Musical {
  return {
    id,
    slug: id,
    title: id,
    provider: "Testanbieter",
    category: "ensuite",
    description: "Testbeschreibung",
    image: "/test.webp",
    eventimUrl: "https://example.test",
    tags: [],
    ...overrides,
  };
}

describe("ähnliche Musicals", () => {
  it("priorisiert dieselbe Erlebniswelt vor Anbieter und Legacy-Kategorie", () => {
    const current = musical("aktuell", { experienceCategory: "kult-klassiker" });
    const sameExperience = musical("gleiche-erlebniswelt", { experienceCategory: "kult-klassiker", provider: "Anderer Anbieter", category: "tournee" });
    const sameProvider = musical("gleicher-anbieter", { experienceCategory: "blockbuster-spektakel" });
    const sameLegacyCategory = musical("gleiche-produktionsart", { experienceCategory: "besondere-geschichten", provider: "Anderer Anbieter" });

    expect(getRelatedMusicals([current, sameLegacyCategory, sameProvider, sameExperience], current).map((item) => item.id)).toEqual([
      "gleiche-erlebniswelt",
      "gleicher-anbieter",
      "gleiche-produktionsart",
    ]);
  });

  it("bevorzugt bei gleicher Nähe Highlights und schließt die aktuelle Show aus", () => {
    const current = musical("aktuell", { experienceCategory: "pop-rock-filmhits" });
    const highlighted = musical("highlight", { experienceCategory: "pop-rock-filmhits", featured: true });
    const standard = musical("standard", { experienceCategory: "pop-rock-filmhits" });

    expect(getRelatedMusicals([current, standard, highlighted], current).map((item) => item.id)).toEqual(["highlight", "standard"]);
  });
});
