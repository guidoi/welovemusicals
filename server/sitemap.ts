import type { Express, Request, Response } from "express";
import { cities, getActiveMusicals } from "../client/src/lib/data";

function entry(baseUrl: string, path: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Development-server counterpart of the build-generated public sitemap.
 * Both use only canonical, currently active routes from the shared catalog.
 */
export function buildSitemap(baseUrl: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const urls = [
    entry(normalizedBaseUrl, "/", "weekly", "1.0"),
    entry(normalizedBaseUrl, "/impressum", "yearly", "0.3"),
    entry(normalizedBaseUrl, "/datenschutz", "yearly", "0.3"),
    ...getActiveMusicals().map((musical) => entry(normalizedBaseUrl, `/musical/${musical.slug}`, "monthly", "0.9")),
    ...cities.map((city) => entry(
      normalizedBaseUrl,
      `/stadt/${city.slug}`,
      "monthly",
      city.slug === "hamburg" || city.slug === "berlin" ? "0.8" : "0.7",
    )),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export function registerSitemapRoute(app: Express): void {
  app.get("/sitemap.xml", (req: Request, res: Response) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "welovemusicals.com";
    const baseUrl = `${protocol}://${host}`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(buildSitemap(baseUrl));
  });
}
