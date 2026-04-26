/**
 * Dynamische Sitemap.xml
 * Enthält alle Musical- und Stadtdetailseiten sowie statische Seiten.
 * Wird als Express-Route unter /sitemap.xml registriert.
 */
import type { Express, Request, Response } from "express";

// Musical-Slugs (alle aktiven Produktionen)
const musicalSlugs = [
  "koenig-der-loewen",
  "mj-michael-jackson",
  "and-julia",
  "tarzan",
  "zurueck-in-die-zukunft",
  "eiskoenigin",
  "we-will-rock-you",
  "wir-sind-am-leben",
  "der-teufel-traegt-prada",
  "bibi-tina",
  "die-amme",
  "cher-show",
  "dracula",
  "da-vinci-code",
  "sister-act",
  "drei-haselnuesse",
  "fitzek-einladung",
  "pretty-woman",
  "grease",
  "elisabeth",
  "kinky-boots",
  "greatest-show",
  "hans-zimmer",
  "dschungelbuch",
  "aladin",
  "schneekoenigin",
  "harry-potter",
  "phantom-der-oper",
  "moulin-rouge",
  "starlight-express",
  "mrs-doubtfire",
  "weihnachtsbaeckerei",
  "phantom-der-oper-trinity",
  "romeo-und-julia",
  "fack-ju-goehte",
  "drei-haselnuesse-fuer-aschenbroedel",
  "rapunzel",
];

// Stadt-Slugs
const citySlugs = [
  "berlin",
  "bremen",
  "dresden",
  "duesseldorf",
  "duisburg",
  "frankfurt",
  "graz",
  "halle",
  "hamburg",
  "hannover",
  "innsbruck",
  "koeln",
  "leipzig",
  "muenchen",
  "nuernberg",
  "oberhausen",
  "stuttgart",
  "hildesheim",
  "linz",
  "solingen",
  "wien",
];

function buildSitemap(baseUrl: string): string {
  const today = new Date().toISOString().split("T")[0];

  const urls: string[] = [];

  // Statische Seiten
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/impressum", priority: "0.3", changefreq: "monthly" },
    { loc: "/datenschutz", priority: "0.3", changefreq: "monthly" },
  ];

  for (const page of staticPages) {
    urls.push(`  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Musical-Detailseiten
  for (const slug of musicalSlugs) {
    urls.push(`  <url>
    <loc>${baseUrl}/musical/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  }

  // Stadt-Detailseiten
  for (const slug of citySlugs) {
    urls.push(`  <url>
    <loc>${baseUrl}/stadt/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

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

    const sitemap = buildSitemap(baseUrl);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // 1 Stunde cachen
    res.send(sitemap);
  });
}
