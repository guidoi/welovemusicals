import { describe, expect, it } from "vitest";
import { cities, getActiveMusicals, getActiveMusicalsByCity } from "./data";
import { getCitySeo } from "./city-seo";
import { getMusicalSeo } from "./musical-seo";
import { SEO_TITLE_HEART, withSeoTitleHeart } from "./seo-title";

describe("SEO-Titeltrenner", () => {
  it("ersetzt den Marken-Trenner durch das rote Herz", () => {
    expect(withSeoTitleHeart("MUSICAL – Termine | We Love Musicals"))
      .toBe(`MUSICAL – Termine ${SEO_TITLE_HEART} We Love Musicals`);
  });

  it("ersetzt den letzten Trenner auch bei ortsbezogenen Titeln", () => {
    expect(withSeoTitleHeart("MUSICAL in Berlin | Tickets ab 40 €"))
      .toBe(`MUSICAL in Berlin ${SEO_TITLE_HEART} Tickets ab 40 €`);
  });

  it("ersetzt den vorangestellten Tickettrenner ohne künstlichen Markenzusatz", () => {
    expect(withSeoTitleHeart("MUSICAL – Tickets"))
      .toBe(`MUSICAL ${SEO_TITLE_HEART} Tickets`);
  });

  it("bleibt bei bereits markierten Titeln idempotent", () => {
    const title = `MUSICAL ${SEO_TITLE_HEART} We Love Musicals`;

    expect(withSeoTitleHeart(title)).toBe(title);
  });

  it("führt das Herz in allen aktiven Musical- und Stadtseitentiteln", () => {
    const musicalTitles = getActiveMusicals().map((musical) => getMusicalSeo(musical).title);
    const cityTitles = cities.map((city) => {
      const cityMusicals = getActiveMusicalsByCity(city.name);
      return getCitySeo(city, cityMusicals.length, cityMusicals).title;
    });

    expect(musicalTitles).not.toHaveLength(0);
    expect(cityTitles).not.toHaveLength(0);
    expect([...musicalTitles, ...cityTitles].every((title) => title.includes(SEO_TITLE_HEART))).toBe(true);
  });
});
