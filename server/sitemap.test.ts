import { describe, expect, it } from "vitest";
import { getActiveMusicals } from "../client/src/lib/data";
import { createSitemapXml } from "../scripts/generate-sitemap";
import { buildSitemap } from "./sitemap";

const BASE_URL = "https://welovemusicals.com";

function sitemapMusicalPaths(sitemap: string): string[] {
  return [...sitemap.matchAll(/<loc>https:\/\/welovemusicals\.com(\/musical\/[^<]+)<\/loc>/g)]
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

  it("verwendet keinen künstlichen lastmod-Zeitstempel allein für einen Build", () => {
    expect(createSitemapXml(BASE_URL)).not.toContain("<lastmod>");
  });

  it("liefert im Entwicklungsserver dasselbe kanonische URL-Inventar", () => {
    expect(buildSitemap(BASE_URL)).toBe(createSitemapXml(BASE_URL).trimEnd());
  });
});
