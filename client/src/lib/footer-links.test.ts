import { describe, expect, it } from "vitest";
import {
  FEATURED_MUSICAL_IDS,
  FOOTER_DACH_CITY_SLUGS,
  getFeaturedMusicals,
  getFooterDachCities,
} from "./data";
import { FOOTER_INFORMATION_LINKS, FOOTER_LINK_GROUP_LABELS } from "./footer-content";

describe("Footer-Linkkonfiguration", () => {
  it("verwendet die aktuelle zentrale Highlight-Reihenfolge für Top-Musicals", () => {
    expect(getFeaturedMusicals().map((musical) => musical.id)).toEqual(FEATURED_MUSICAL_IDS);
    expect(getFeaturedMusicals()).toHaveLength(9);
  });

  it("verlinkt wichtige Musical-Städte aus Deutschland, Österreich und der Schweiz", () => {
    expect(getFooterDachCities().map((city) => city.slug)).toEqual(FOOTER_DACH_CITY_SLUGS);
    expect(getFooterDachCities().map((city) => city.name)).toEqual([
      "Hamburg",
      "Berlin",
      "Stuttgart",
      "München",
      "Wien",
      "Zürich",
    ]);
  });

  it("verwendet kurze Top-Bezeichnungen und führt Kontakt nicht doppelt im Informationsbereich", () => {
    expect(FOOTER_LINK_GROUP_LABELS).toEqual({
      topMusicals: "TOP MUSICALS & SHOWS",
      topCities: "TOP MUSICAL STÄDTE",
    });
    expect(FOOTER_INFORMATION_LINKS.map((item) => item.label)).toEqual([
      "Über uns",
      "Datenschutz",
      "Impressum",
    ]);
    expect(FOOTER_INFORMATION_LINKS.map((item) => item.label)).not.toContain("Kontakt");
  });
});
