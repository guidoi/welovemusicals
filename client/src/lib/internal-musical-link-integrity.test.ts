import { describe, expect, it } from "vitest";
import { LEGACY_MUSICAL_REDIRECTS, RETIRED_MUSICAL_SLUGS } from "../../../functions/_seo-static";
import {
  ACTIVE_MUSICAL_IDS,
  cities,
  FEATURED_MUSICAL_IDS,
  getActiveMusicals,
  getActiveMusicalsByCity,
  getAdditionalMusicals,
  getEditorialOverviewMusicals,
  getFeaturedMusicals,
  type Musical,
} from "./data";
import { getHeroNavigationItems } from "./hero-navigation";
import { getRelatedMusicals } from "./related-musicals";

const blockedSlugs = new Set([
  ...Object.keys(LEGACY_MUSICAL_REDIRECTS),
  ...RETIRED_MUSICAL_SLUGS,
]);

function expectCanonicalMusicalLinks(musicals: Musical[]) {
  for (const musical of musicals) {
    expect(
      ACTIVE_MUSICAL_IDS.includes(musical.id) || ACTIVE_MUSICAL_IDS.includes(musical.slug),
    ).toBe(true);
    expect(blockedSlugs.has(musical.slug)).toBe(false);
  }
}

describe("interne Musicalnavigation", () => {
  it("gibt in allen öffentlichen Katalog-, Stadt- und Empfehlungslisten ausschließlich aktive kanonische Musicalseiten aus", () => {
    const activeMusicals = getActiveMusicals();
    const publicLinkSources = [
      activeMusicals,
      getFeaturedMusicals(),
      getAdditionalMusicals(),
      getEditorialOverviewMusicals(false),
      getEditorialOverviewMusicals(true),
      ...cities.map((city) => getActiveMusicalsByCity(city.name)),
      ...activeMusicals.map((musical) => getRelatedMusicals(activeMusicals, musical)),
    ];

    publicLinkSources.forEach(expectCanonicalMusicalLinks);
  });

  it("erzeugt auch in der Hero-Navigation keine 301- oder 410-Ziele", () => {
    const heroItems = getHeroNavigationItems(getActiveMusicals(), ACTIVE_MUSICAL_IDS, FEATURED_MUSICAL_IDS);
    const musicalSlugs = heroItems
      .filter((item) => item.kind === "musical")
      .map((item) => item.href.replace("/musical/", ""));

    expect(musicalSlugs).toHaveLength(FEATURED_MUSICAL_IDS.length);
    musicalSlugs.forEach((slug) => expect(blockedSlugs.has(slug)).toBe(false));
  });
});
