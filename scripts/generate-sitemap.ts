import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { cities, getActiveMusicals } from "../client/src/lib/data";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const DEFAULT_BASE_URL = "https://welovemusicals.com";
const DEFAULT_OUTPUT_PATH = resolve(PROJECT_ROOT, "client", "public", "sitemap.xml");

type SitemapEntry = {
  path: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
};

function toUrlEntry(baseUrl: string, entry: SitemapEntry): string {
  return `  <url>
    <loc>${baseUrl}${entry.path}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

/**
 * Produces the sole public URL inventory from the same active catalog used by
 * canonical detail routes and the static SEO renderer. Deliberately avoids
 * automatic <lastmod> timestamps: a build alone is not a content change.
 */
export function createSitemapXml(baseUrl = DEFAULT_BASE_URL): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const staticPages: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/impressum", changefreq: "yearly", priority: "0.3" },
    { path: "/datenschutz", changefreq: "yearly", priority: "0.3" },
  ];
  const musicalPages: SitemapEntry[] = getActiveMusicals().map((musical) => ({
    path: `/musical/${musical.slug}`,
    changefreq: "monthly",
    priority: "0.9",
  }));
  const cityPages: SitemapEntry[] = cities.map((city) => ({
    path: `/stadt/${city.slug}`,
    changefreq: "monthly",
    priority: city.slug === "hamburg" || city.slug === "berlin" ? "0.8" : "0.7",
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...musicalPages, ...cityPages].map((entry) => toUrlEntry(normalizedBaseUrl, entry)).join("\n")}
</urlset>
`;
}

async function main(): Promise<void> {
  const outputPath = process.env.SITEMAP_OUTPUT
    ? resolve(PROJECT_ROOT, process.env.SITEMAP_OUTPUT)
    : DEFAULT_OUTPUT_PATH;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, createSitemapXml(), "utf8");
  console.log(`Generated canonical sitemap with ${getActiveMusicals().length} musical routes: ${outputPath}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
