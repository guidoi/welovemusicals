import { describe, expect, it } from "vitest";
import { cities, getActiveMusicals, getActiveMusicalsByCity } from "../client/src/lib/data";
import { createSitemapXml } from "../scripts/generate-sitemap";
import { buildSitemap } from "./sitemap";

const BASE_URL = "https://welovemusicals.com";

function sitemapMusicalPaths(sitemap: string): string[] {
  return [...sitemap.matchAll(/<loc>https:\/\/welovemusicals\.com(\/musical\/[^<]+)<\/loc>/g)]
    .map((match) => match[1]);
}

function sitemapCityPaths(sitemap: string): string[] {
  return [...sitemap.matchAll(/<loc>https:\/\/welovemusicals\.com(\/stadt\/[^<]+)<\/loc>/g)]
    .map((match) => match[1]);
}

describe("öffentliche Sitemap", () => {
  it("führt ausschließlich kanonische Detailrouten des aktiven Katalogs", () => {
    const sitemap = createSitemapXml(BASE_URL);
    const expectedPaths = getActiveMusicals().map((musical) => `/musical/${musical.slug}`);

    expect(sitemapMusicalPaths(sitemap)).toEqual(expectedPaths);
    expect(sitemap).not.toContain("/musical/sister-act");
    expect(sitemap).not.toContain("/musical/we-will-rock-you");
    expect(sitemap).not.toContain("/musical/eiskoenigin");
    expect(sitemap).not.toContain("/musical/mj-musical");
    expect(sitemap).not.toContain("/musical/tarzan");
    expect(sitemap).not.toContain("/musical/ziz");
  });

  it("führt ausschließlich Stadtseiten mit mindestens einer aktiven Show", () => {
    const sitemap = createSitemapXml(BASE_URL);
    const expectedPaths = cities
      .filter((city) => getActiveMusicalsByCity(city.name).length > 0)
      .map((city) => `/stadt/${city.slug}`);

    expect(sitemapCityPaths(sitemap)).toEqual(expectedPaths);
    expect(sitemap).toContain("/stadt/hannover");
    expect(sitemap).not.toContain("/stadt/oberhausen");
  });

  it("verwendet keinen künstlichen lastmod-Zeitstempel allein für einen Build", () => {
    expect(createSitemapXml(BASE_URL)).not.toContain("<lastmod>");
  });

  it("liefert im Entwicklungsserver dasselbe kanonische URL-Inventar", () => {
    expect(buildSitemap(BASE_URL)).toBe(createSitemapXml(BASE_URL).trimEnd());
  });
});
