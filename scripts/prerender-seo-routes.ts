import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  cities,
  getActiveMusicals,
  getActiveMusicalsByCity,
  type City,
  type Musical,
} from "../client/src/lib/data";
import { getCitySeo, getUpcomingCityProgram } from "../client/src/lib/city-seo";
import { getMusicalSeo } from "../client/src/lib/musical-seo";
import { getCityGuide } from "../client/src/lib/city-guide";
import { getMusicalEventSchemas } from "../client/src/lib/event-schema";
import { getMusicalFaqSchema, getVisibleFaqItems } from "../client/src/lib/faq-schema";
import { createGoogleSheetPriceSource, WEBSITE_PRICE_SHEET_CSV_URL } from "../server/googleSheetPriceSource";

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
  schemaPage?: "city" | "musical";
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

function createLegalPage(
  path: "impressum" | "datenschutz",
  heading: string,
  description: string,
): SeoPage {
  const canonicalUrl = `${BASE_URL}/${path}`;
  const image = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/hero-stage-LExvJcmcPP3dpbDQunFpAD.webp";
  const title = `${heading} | We Love Musicals`;
  const imageAlt = "Bühnenatmosphäre bei We Love Musicals";
  const breadcrumbs = [
    { "@type": "ListItem", position: 1, name: "We Love Musicals", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: heading, item: canonicalUrl },
  ];

  return {
    path: `/${path}`,
    title,
    description,
    image,
    imageAlt,
    canonicalUrl,
    schema: createPageSchema({ title, description, image, imageAlt, canonicalUrl }, breadcrumbs),
    contentHtml: `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></main>`,
  };
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

function createCityContent(city: City, cityMusicals: Musical[], heading: string, description: string): string {
  const guide = getCityGuide(city.slug);
  const cityProgram = getUpcomingCityProgram(city.name, cityMusicals).slice(0, 6);
  const musicalLinks = cityMusicals.map((musical) => (
    `<li><a href="/musical/${escapeHtml(musical.slug)}">${escapeHtml(musical.title)}</a></li>`
  )).join("");
  const programContent = cityProgram.length > 0 ? `
    <section><h2>Termine &amp; Spielstätten in ${escapeHtml(city.name)}</h2><ul>${cityProgram.map((entry) => {
      const duration = entry.endDate !== entry.startDate
        ? `${formatGermanDate(entry.startDate)} bis ${formatGermanDate(entry.endDate)}`
        : formatGermanDate(entry.startDate);
      return `<li><strong>${escapeHtml(entry.title)}</strong> · ${escapeHtml(duration)} · ${escapeHtml(entry.venue)}</li>`;
    }).join("")}</ul></section>` : "";
  const guideContent = guide ? `
    <section><h2>${escapeHtml(guide.heading)}</h2><p>${escapeHtml(guide.intro)}</p>
      <ol>${guide.steps.map((step) => `<li><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></li>`).join("")}</ol>${guide.officialLinks?.length ? `<p>${guide.officialLinks.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join(" · ")}</p>` : ""}
    </section>` : "";

  return `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p>
    <section><h2>Aktuelle Musicals in ${escapeHtml(city.name)}</h2><ul>${musicalLinks}</ul></section>${programContent}${guideContent}
  </main>`;
}

function formatGermanDate(value: string): string {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
    .format(new Date(`${value}T12:00:00Z`));
}

function createMusicalContent(musical: Musical, heading: string, priceFrom?: string): string {
  const location = [musical.city, musical.venue].filter(Boolean).join(" · ");
  const today = new Date().toISOString().slice(0, 10);
  const upcomingTourDates = (musical.tourDates ?? [])
    .filter((date) => (date.endDate ?? date.startDate) >= today);
  const musicalCities = Array.from(new Set(
    upcomingTourDates.length > 0
      ? upcomingTourDates.map((date) => date.city)
      : [...(musical.city ? [musical.city] : []), ...(musical.cities ?? [])],
  ));
  const cityLinks = musicalCities
    .map((cityName) => cities.find((city) => city.name === cityName))
    .filter((city): city is City => Boolean(city))
    .slice(0, 12)
    .map((city) => `<a href="/stadt/${escapeHtml(city.slug)}">Musicals in ${escapeHtml(city.name)}</a>`)
    .join(" · ");
  const upcomingDates = upcomingTourDates
    .map((date) => {
      const duration = date.endDate && date.endDate !== date.startDate
        ? `${formatGermanDate(date.startDate)} bis ${formatGermanDate(date.endDate)}`
        : formatGermanDate(date.startDate);
      return `<li><strong>${escapeHtml(date.city)}</strong> · ${escapeHtml(date.venue)} · ${escapeHtml(duration)}</li>`;
    })
    .join("");
  const faqItems = getVisibleFaqItems(musical);
  const faqContent = faqItems.length > 0
    ? `<section><h2>Alles, was du wissen musst</h2><dl>${faqItems.map((faq) => (
      `<dt>${escapeHtml(faq.question)}</dt><dd>${escapeHtml(faq.answer)}</dd>`
    )).join("")}</dl></section>`
    : "";
  return `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(musical.description)}</p>
    ${location ? `<p><strong>Spielort:</strong> ${escapeHtml(location)}</p>` : ""}
    ${priceFrom ? `<p><strong>Tickets ab:</strong> ${escapeHtml(priceFrom)} €</p>` : ""}
    ${upcomingDates ? `<section><h2>Termine &amp; Spielstätten</h2><ul>${upcomingDates}</ul></section>` : ""}
    ${cityLinks ? `<nav aria-label="Musical-Städte"><p>${cityLinks}</p></nav>` : ""}${faqContent}
  </main>`;
}

function createCityPage(city: City): SeoPage {
  const cityMusicals = getActiveMusicalsByCity(city.name);
  const seo = getCitySeo(city, cityMusicals.length, cityMusicals);
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
    contentHtml: createCityContent(city, cityMusicals, seo.heading, seo.description),
    schemaPage: "city",
  };
}

function createMusicalPage(musical: Musical, priceFrom?: string): SeoPage {
  const seo = getMusicalSeo(musical);
  const imageAlt = musical.title;
  const pageSchema = createPageSchema(
    seoPageShape(seo.title, seo.description, seo.image, imageAlt, seo.canonicalUrl),
    getMusicalBreadcrumbs(musical),
    {
      "@type": "CreativeWork",
      name: musical.title,
      description: seo.description,
      url: seo.canonicalUrl,
    },
  );
  pageSchema["@graph"].push(...getMusicalEventSchemas(musical, { priceFrom }));
  const faqSchema = getMusicalFaqSchema(musical);
  if (faqSchema) pageSchema["@graph"].push(faqSchema);

  return {
    path: `/musical/${musical.slug}`,
    title: seo.title,
    description: seo.description,
    image: seo.image,
    imageAlt,
    canonicalUrl: seo.canonicalUrl,
    schema: pageSchema,
    contentHtml: createMusicalContent(musical, musical.title, priceFrom),
    schemaPage: "musical",
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
    .replace(/<script id="site-schema" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="site-schema" type="application/ld+json" data-schema-page="${page.schemaPage ?? "default"}">${schema}</script>`)
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
  const priceOverrides = await createGoogleSheetPriceSource({ url: WEBSITE_PRICE_SHEET_CSV_URL }).listOverrides();
  const pricesByMusicalId = new Map(priceOverrides.map((override) => [override.musicalId, override.priceFrom]));
  const pages = [
    createLegalPage(
      "impressum",
      "Impressum",
      "Impressum und Anbieterinformationen von We Love Musicals, dem Musical-Portal für Deutschland, Österreich und die Schweiz.",
    ),
    createLegalPage(
      "datenschutz",
      "Datenschutzerklärung",
      "Datenschutzerklärung von We Love Musicals: Informationen zur Verarbeitung personenbezogener Daten, Cookies, Analyse und Affiliate-Links.",
    ),
    ...cities.map(createCityPage),
    ...activeMusicals.map((musical) => createMusicalPage(musical, pricesByMusicalId.get(musical.id) ?? musical.priceFrom)),
  ];

  await Promise.all(pages.map((page) => writePage(page, shellHtml)));
  console.log(`Generated static SEO metadata for ${pages.length} canonical city and musical routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
