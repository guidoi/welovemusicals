import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  cities,
  getActiveMusicals,
  getActiveMusicalsByCity,
  type City,
  type Musical,
} from "../client/src/lib/data";
import { getCitySeo } from "../client/src/lib/city-seo";
import { getMusicalSeo } from "../client/src/lib/musical-seo";
import { getCityGuide } from "../client/src/lib/city-guide";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const DIST_ROOT = resolve(PROJECT_ROOT, "dist");
const BASE_URL = "https://welovemusicals.com";
const activeMusicals = getActiveMusicals();

interface SeoPage {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  canonicalUrl: string;
  schema: Record<string, unknown>;
  contentHtml: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function createPageSchema(
  page: Pick<SeoPage, "title" | "description" | "image" | "imageAlt" | "canonicalUrl">,
  breadcrumbs: Array<Record<string, unknown>>,
  mainEntity?: Record<string, unknown>,
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${page.canonicalUrl}#webpage`,
        url: page.canonicalUrl,
        name: page.title,
        description: page.description,
        inLanguage: "de-DE",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: page.image,
          caption: page.imageAlt,
        },
        ...(mainEntity ? { mainEntity } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs,
      },
    ],
  };
}

function getCityBreadcrumbs(city: City) {
  return [
    { "@type": "ListItem", position: 1, name: "We Love Musicals", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Städte", item: `${BASE_URL}/#staedte` },
    { "@type": "ListItem", position: 3, name: city.name, item: `${BASE_URL}/stadt/${city.slug}` },
  ];
}

function getMusicalBreadcrumbs(musical: Musical) {
  const canonicalUrl = `${BASE_URL}/musical/${musical.slug || musical.id}`;
  return [
    { "@type": "ListItem", position: 1, name: "We Love Musicals", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Musicals & Shows", item: `${BASE_URL}/#musicals` },
    { "@type": "ListItem", position: 3, name: musical.title, item: canonicalUrl },
  ];
}

function getCityItemList(city: City, cityMusicals: Musical[]) {
  return {
    "@type": "ItemList",
    name: `Aktuelle Musicals in ${city.name}`,
    numberOfItems: cityMusicals.length,
    itemListElement: cityMusicals.map((musical, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/musical/${musical.slug}`,
      name: musical.title,
    })),
  };
}

function createCityContent(city: City, cityMusicals: Musical[], heading: string): string {
  const guide = getCityGuide(city.slug);
  const musicalLinks = cityMusicals.map((musical) => (
    `<li><a href="/musical/${escapeHtml(musical.slug)}">${escapeHtml(musical.title)}</a></li>`
  )).join("");
  const guideContent = guide ? `
    <section><h2>${escapeHtml(guide.heading)}</h2><p>${escapeHtml(guide.intro)}</p>
      <ol>${guide.steps.map((step) => `<li><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></li>`).join("")}</ol>
    </section>` : "";

  return `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(city.description)}</p>
    <section><h2>Aktuelle Musicals in ${escapeHtml(city.name)}</h2><ul>${musicalLinks}</ul></section>${guideContent}
  </main>`;
}

function createMusicalContent(musical: Musical, heading: string): string {
  const location = [musical.city, musical.venue].filter(Boolean).join(" · ");
  const musicalCities = Array.from(new Set([
    ...(musical.city ? [musical.city] : []),
    ...(musical.cities ?? []),
  ]));
  const cityLinks = musicalCities
    .map((cityName) => cities.find((city) => city.name === cityName))
    .filter((city): city is City => Boolean(city))
    .slice(0, 12)
    .map((city) => `<a href="/stadt/${escapeHtml(city.slug)}">Musicals in ${escapeHtml(city.name)}</a>`)
    .join(" · ");
  return `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(musical.description)}</p>
    ${location ? `<p><strong>Spielort:</strong> ${escapeHtml(location)}</p>` : ""}
    ${cityLinks ? `<nav aria-label="Musical-Städte"><p>${cityLinks}</p></nav>` : ""}
  </main>`;
}

function createCityPage(city: City): SeoPage {
  const cityMusicals = getActiveMusicalsByCity(city.name);
  const seo = getCitySeo(city, cityMusicals.length);
  const canonicalUrl = `${BASE_URL}/stadt/${city.slug}`;

  return {
    path: `/stadt/${city.slug}`,
    title: seo.title,
    description: seo.description,
    image: city.image,
    imageAlt: `Musicals in ${city.name}`,
    canonicalUrl,
    schema: createPageSchema(
      seoPageShape(seo.title, seo.description, city.image, `Musicals in ${city.name}`, canonicalUrl),
      getCityBreadcrumbs(city),
      getCityItemList(city, cityMusicals),
    ),
    contentHtml: createCityContent(city, cityMusicals, seo.heading),
  };
}

function createMusicalPage(musical: Musical): SeoPage {
  const seo = getMusicalSeo(musical);
  const imageAlt = musical.title;

  return {
    path: `/musical/${musical.slug}`,
    title: seo.title,
    description: seo.description,
    image: seo.image,
    imageAlt,
    canonicalUrl: seo.canonicalUrl,
    schema: createPageSchema(seoPageShape(seo.title, seo.description, seo.image, imageAlt, seo.canonicalUrl), getMusicalBreadcrumbs(musical), {
      "@type": "CreativeWork",
      name: musical.title,
      description: seo.description,
      url: seo.canonicalUrl,
    }),
    contentHtml: createMusicalContent(musical, musical.title),
  };
}

function seoPageShape(title: string, description: string, image: string, imageAlt: string, canonicalUrl: string) {
  return { title, description, image, imageAlt, canonicalUrl };
}

function applySeoTemplate(html: string, page: SeoPage): string {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const image = escapeHtml(page.image);
  const imageAlt = escapeHtml(page.imageAlt);
  const canonicalUrl = escapeHtml(page.canonicalUrl);
  const schema = escapeJsonForHtml(page.schema);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${imageAlt}" />`)
    .replace(/<meta property="twitter:url" content="[^"]*" \/>/, `<meta property="twitter:url" content="${canonicalUrl}" />`)
    .replace(/<meta property="twitter:title" content="[^"]*" \/>/, `<meta property="twitter:title" content="${title}" />`)
    .replace(/<meta property="twitter:description" content="[^"]*" \/>/, `<meta property="twitter:description" content="${description}" />`)
    .replace(/<meta property="twitter:image" content="[^"]*" \/>/, `<meta property="twitter:image" content="${image}" />`)
    .replace(/<meta property="twitter:image:alt" content="[^"]*" \/>/, `<meta property="twitter:image:alt" content="${imageAlt}" />`)
    .replace(/\s*<meta property="og:image:type"[^>]*\/>/, "")
    .replace(/\s*<meta property="og:image:width"[^>]*\/>/, "")
    .replace(/\s*<meta property="og:image:height"[^>]*\/>/, "")
    .replace(/<script id="site-schema" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="site-schema" type="application/ld+json">${schema}</script>`)
    // Static content remains available to crawlers and no-JavaScript visitors,
    // but does not flash briefly before the React app mounts on regular reloads.
    .replace('<div id="root"></div>', `<div id="root"><noscript>${page.contentHtml}</noscript></div>`);
}

async function writePage(page: SeoPage, shellHtml: string): Promise<void> {
  const outputPath = resolve(DIST_ROOT, `.${page.path}`, "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, applySeoTemplate(shellHtml, page), "utf8");
}

async function main() {
  const shellHtml = await readFile(resolve(DIST_ROOT, "index.html"), "utf8");
  const pages = [
    ...cities.map(createCityPage),
    ...activeMusicals.map(createMusicalPage),
  ];

  await Promise.all(pages.map((page) => writePage(page, shellHtml)));
  console.log(`Generated static SEO metadata for ${pages.length} canonical city and musical routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
