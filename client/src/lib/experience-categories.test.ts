import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, getActiveMusicals } from "./data";
import {
  EXPERIENCE_CATEGORIES,
  EXPERIENCE_CATEGORY_BY_MUSICAL_ID,
  QUICK_CITY_NAMES,
  getExperienceCategory,
} from "./experience-categories";

describe("Erlebnis-Kategorien", () => {
  it("definiert die fünf kuratierten Erlebniswelten", () => {
    expect(EXPERIENCE_CATEGORIES.map((category) => category.id)).toEqual([
      "blockbuster-spektakel",
      "kult-klassiker",
      "pop-rock-filmhits",
      "familie-maerchen-magie",
      "besondere-geschichten",
    ]);
  });

  it("ordnet die Filter nach Conversion-Priorität von Breitenwirkung bis Nische", () => {
    expect(EXPERIENCE_CATEGORIES.map((category) => category.label)).toEqual([
      "Blockbuster & Spektakel",
      "Kult & Klassiker",
      "Pop, Rock & Filmhits",
      "Familie, Märchen & Magie",
      "Besondere Geschichten",
    ]);
    const familyCategory = EXPERIENCE_CATEGORIES.find((category) => category.id === "familie-maerchen-magie");
    expect(familyCategory?.shortLabel).toBe("Familie, Märchen & Magie");
  });

  it("liefert für jede Erlebniswelt eine emotionale Empfehlungseinleitung", () => {
    expect(EXPERIENCE_CATEGORIES.every((category) => category.recommendationHeadline.length > 12)).toBe(true);
    expect(EXPERIENCE_CATEGORIES.every((category) => category.recommendationIntro.length > 24)).toBe(true);
  });

  it("ordnet jedes aktive Musical genau einer Erlebniswelt zu", () => {
    const activeMusicals = getActiveMusicals();
    expect(activeMusicals).toHaveLength(ACTIVE_MUSICAL_IDS.length);
    expect(activeMusicals.every((musical) => musical.experienceCategory)).toBe(true);
    expect(activeMusicals.every((musical) => musical.experienceCategory === EXPERIENCE_CATEGORY_BY_MUSICAL_ID[musical.id])).toBe(true);
  });

  it("stellt die zentrale Kategorie und die wichtigsten Städteschnellzugriffe bereit", () => {
    expect(getExperienceCategory("blockbuster-spektakel")?.label).toBe("Blockbuster & Spektakel");
    expect(QUICK_CITY_NAMES).toEqual(["Hamburg", "Stuttgart", "Berlin", "Köln", "Bochum", "München", "Düsseldorf"]);
  });

  it("ordnet Das Phantom der Oper als Kultklassiker ein", () => {
    expect(EXPERIENCE_CATEGORY_BY_MUSICAL_ID["phantom-der-oper"]).toBe("kult-klassiker");
    expect(getActiveMusicals().find((musical) => musical.id === "phantom-der-oper")?.experienceCategory).toBe("kult-klassiker");
  });

  it("ordnet die Disney-Highlights nach ihrer primären Erlebniswelt ein", () => {
    const activeMusicals = getActiveMusicals();
    expect(activeMusicals.find((musical) => musical.id === "eiskoenigin")?.experienceCategory).toBe("familie-maerchen-magie");
    expect(activeMusicals.find((musical) => musical.id === "koenig-der-loewen")?.experienceCategory).toBe("blockbuster-spektakel");
    expect(activeMusicals.find((musical) => musical.id === "tarzan")?.experienceCategory).toBe("blockbuster-spektakel");
  });
});
