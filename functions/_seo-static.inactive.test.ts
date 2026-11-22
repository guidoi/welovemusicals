import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { ACTIVE_MUSICAL_IDS, musicals } from "../client/src/lib/data";
import { createSitemapXml } from "../scripts/generate-sitemap";
import { LEGACY_MUSICAL_REDIRECTS, RETIRED_MUSICAL_SLUGS, serveCanonicalSeoRoute } from "./_seo-static";

const TARZAN_SLUG = "disneys-musical-tarzan";

describe("temporär deaktivierte Musical-SEO-Routen", () => {
  it.each([
    [TARZAN_SLUG, "GET"],
    [TARZAN_SLUG, "HEAD"],
    ["tarzan", "GET"],
    ["tarzan", "HEAD"],
  ])("liefert für %s mit %s direkt 404 statt Redirect oder SPA-Fallback", async (slug, method) => {
    const fetch = vi.fn().mockResolvedValue(new Response("SPA shell"));
    const response = await serveCanonicalSeoRoute({
      request: new Request(`https://welovemusicals.com/musical/${slug}?source=archiv`, { method }),
      params: { slug },
      env: { ASSETS: { fetch } },
    }, "musical");

    expect(response.status).toBe(404);
    expect(response.headers.get("Location")).toBeNull();
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).toBe(method === "HEAD" ? "" : "Not Found");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("erhält Tarzans Archiv und ermöglicht Reaktivierung ohne permanente Sperrliste", async () => {
    expect(ACTIVE_MUSICAL_IDS).not.toContain("tarzan");
    expect(musicals.find((musical) => musical.id === "tarzan")?.slug).toBe(TARZAN_SLUG);
    expect(RETIRED_MUSICAL_SLUGS.has(TARZAN_SLUG)).toBe(false);
    expect(RETIRED_MUSICAL_SLUGS.has("tarzan")).toBe(false);
    expect(LEGACY_MUSICAL_REDIRECTS.tarzan).toBe(TARZAN_SLUG);

    ACTIVE_MUSICAL_IDS.push("tarzan");
    try {
      const fetch = vi.fn().mockResolvedValue(new Response("active SEO document"));
      const canonical = await serveCanonicalSeoRoute({
        request: new Request(`https://welovemusicals.com/musical/${TARZAN_SLUG}`),
        params: { slug: TARZAN_SLUG },
        env: { ASSETS: { fetch } },
      }, "musical");
      const alias = await serveCanonicalSeoRoute({
        request: new Request("https://welovemusicals.com/musical/tarzan"),
        params: { slug: "tarzan" },
        env: { ASSETS: { fetch } },
      }, "musical");

      expect(canonical.status).toBe(200);
      expect(await canonical.text()).toBe("active SEO document");
      expect(alias.status).toBe(301);
      expect(alias.headers.get("Location")).toBe(`https://welovemusicals.com/musical/${TARZAN_SLUG}`);
    } finally {
      ACTIVE_MUSICAL_IDS.splice(ACTIVE_MUSICAL_IDS.lastIndexOf("tarzan"), 1);
    }
  });

  it("schließt Tarzan aus generierter und gespeicherter Sitemap sowie llms aus", () => {
    const savedSitemap = readFileSync(resolve(process.cwd(), "client/public/sitemap.xml"), "utf8");
    expect(savedSitemap).toBe(createSitemapXml());
    expect(savedSitemap).not.toContain(TARZAN_SLUG);
    expect(savedSitemap).toContain("/stadt/hamburg");
    expect(readFileSync(resolve(process.cwd(), "client/public/llms.txt"), "utf8")).not.toMatch(/tarzan/i);
  });
});
