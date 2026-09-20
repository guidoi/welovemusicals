import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("öffentliche Sitemap", () => {
  it("führt Sister Act nach der Deaktivierung nicht mehr als Musical-URL", () => {
    const sitemapSource = readFileSync(new URL("./sitemap.ts", import.meta.url), "utf8");
    expect(sitemapSource).not.toMatch(/^\s*"sister-act",?\s*$/m);
  });

  it("führt We Will Rock You nach Saisonende nicht mehr als Musical-URL", () => {
    const sitemapSource = readFileSync(new URL("./sitemap.ts", import.meta.url), "utf8");
    expect(sitemapSource).not.toMatch(/^\s*"we-will-rock-you",?\s*$/m);
  });

  it("führt We Will Rock You auch nicht in der veröffentlichten statischen Sitemap", () => {
    const sitemap = readFileSync(new URL("../client/public/sitemap.xml", import.meta.url), "utf8");
    expect(sitemap).not.toContain("/musical/we-will-rock-you");
  });
});
