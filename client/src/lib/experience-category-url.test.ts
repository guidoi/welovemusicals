import { describe, expect, it } from "vitest";
import {
  createExperienceCategoryHref,
  createMusicalOverviewHref,
  getExperienceCategoryFromSearch,
} from "./experience-category-url";

describe("teilbare Erlebniswelt-URLs", () => {
  it("erstellt eine direkte URL zur gefilterten vollständigen Übersicht", () => {
    expect(createExperienceCategoryHref("kult-klassiker")).toBe(
      "/?erlebnis=kult-klassiker#more-musicals",
    );
  });

  it("akzeptiert nur bekannte Erlebniswelten aus einer geteilten URL", () => {
    expect(getExperienceCategoryFromSearch("?erlebnis=familie-maerchen-magie")).toBe(
      "familie-maerchen-magie",
    );
    expect(getExperienceCategoryFromSearch("?erlebnis=unbekannt")).toBeUndefined();
    expect(getExperienceCategoryFromSearch("")).toBeUndefined();
  });

  it("stellt einen neutralen Link zur doppelfreien Übersicht bereit", () => {
    expect(createMusicalOverviewHref()).toBe("/#more-musicals");
  });
});
