import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const robots = readFileSync(resolve(import.meta.dirname, "../../public/robots.txt"), "utf8");

describe("Crawler-Freigaben", () => {
  it("erlaubt Google, Gemini-Grounding und ChatGPT Search den öffentlichen Katalog", () => {
    expect(robots).toContain("User-agent: *\nAllow: /");
    expect(robots).toContain("User-agent: OAI-SearchBot\nAllow: /");
    expect(robots).toContain("User-agent: Google-Extended\nAllow: /");
    expect(robots).toContain("Sitemap: https://welovemusicals.com/sitemap.xml");
  });

  it("schließt geschützte Verwaltungsrouten von Crawls aus", () => {
    expect(robots).toContain("Disallow: /verwaltung/");
  });
});
