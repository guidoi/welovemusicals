import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("öffentliche Sitemap", () => {
  it("führt Sister Act nach der Deaktivierung nicht mehr als Musical-URL", () => {
    const sitemapSource = readFileSync(new URL("./sitemap.ts", import.meta.url), "utf8");
    expect(sitemapSource).not.toMatch(/^\s*"sister-act",?\s*$/m);
  });
});
