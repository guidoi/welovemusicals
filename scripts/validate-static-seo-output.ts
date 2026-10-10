import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getCityBySlug, getMusicalBySlug } from "../client/src/lib/data";
import { getCitySeo } from "../client/src/lib/city-seo";
import { getMusicalSeo } from "../client/src/lib/musical-seo";
import { LEGACY_MUSICAL_REDIRECTS, RETIRED_MUSICAL_SLUGS } from "../functions/_seo-static";

const DIST_ROOT = resolve(import.meta.dirname, "..", "dist");
const SITE_ORIGIN = "https://welovemusicals.com";
const BLOCKED_MUSICAL_PATHS = new Set([
  ...Object.keys(LEGACY_MUSICAL_REDIRECTS),
  ...RETIRED_MUSICAL_SLUGS,
].map((slug) => `/musical/${slug}`));

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function assertPage(relativePath: string, expectations: string[]) {
  const html = await readFile(resolve(DIST_ROOT, relativePath, "index.html"), "utf8");
  if (!html.includes('<div id="root"><noscript>')) {
    throw new Error(`${relativePath}/index.html must keep its static SEO content inside noscript`);
  }
  for (const expectation of expectations) {
    if (!html.includes(expectation)) {
      throw new Error(`${relativePath}/index.html misses expected SEO value: ${expectation}`);
    }
  }
}

async function listHtmlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  }));
  return nested.flat();
}

function getInternalMusicalTargets(html: string): string[] {
  const hrefs = html.matchAll(/\bhref=(["'])(.*?)\1/g);
  const targets: string[] = [];

  for (const [, , href] of hrefs) {
    const target = new URL(href, SITE_ORIGIN);
    if (target.origin !== SITE_ORIGIN || !target.pathname.startsWith("/musical/")) continue;
    targets.push(target.pathname.replace(/\/$/, ""));
  }

  return targets;
}

async function assertStaticHtmlHasNoBlockedInternalLinks() {
  const htmlFiles = await listHtmlFiles(DIST_ROOT);
  const violations: string[] = [];

  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    const forbiddenTargets = getInternalMusicalTargets(html).filter((target) => BLOCKED_MUSICAL_PATHS.has(target));
    if (forbiddenTargets.length > 0) {
      violations.push(`${filePath.replace(`${DIST_ROOT}/`, "")}: ${[...new Set(forbiddenTargets)].join(", ")}`);
    }
  }

  if (violations.length > 0) {
    throw new Error(`Static HTML links must never point to redirected or retired musical pages:\n${violations.join("\n")}`);
  }
}

async function main() {
  const hamburg = getCityBySlug("hamburg");
  const berlin = getCityBySlug("berlin");
  const graz = getCityBySlug("graz");
  const fackJuGoehte = getMusicalBySlug("fack-ju-goehte");
  const derKleineLord = getMusicalBySlug("der-kleine-lord");
  const mj = getMusicalBySlug("mj-das-michael-jackson-musical");
  if (!hamburg || !berlin || !graz || !fackJuGoehte || !derKleineLord || !mj) throw new Error("Expected reference pages are not active");

  const hamburgSeo = getCitySeo(hamburg, 6);
  const berlinSeo = getCitySeo(berlin, 5);
  const mjSeo = getMusicalSeo(mj);

  await Promise.all([
    assertPage("impressum", [
      "<title>Impressum | We Love Musicals</title>",
      'href="https://welovemusicals.com/impressum"',
      "<h1>Impressum</h1>",
      'id="site-schema"',
    ]),
    assertPage("datenschutz", [
      "<title>Datenschutzerklärung | We Love Musicals</title>",
      'href="https://welovemusicals.com/datenschutz"',
      "<h1>Datenschutzerklärung</h1>",
      'id="site-schema"',
    ]),
    assertPage("stadt/hamburg", [
      `<title>${escapeHtml(hamburgSeo.title)}</title>`,
      'href="https://welovemusicals.com/stadt/hamburg"',
      'id="site-schema"',
      '"@type":"ItemList"',
      '<h1>Musicals in Hamburg: Termine 2026/2027</h1>',
      '<h2>Termine &amp; Spielstätten in Hamburg</h2>',
      '<h2>Musicalabend in Hamburg planen</h2>',
      'href="/musical/mj-das-michael-jackson-musical"',
    ]),
    assertPage("musical/mj-das-michael-jackson-musical", [
      `<title>${escapeHtml(mjSeo.title)}</title>`,
      `href="${mjSeo.canonicalUrl}"`,
      'id="site-schema"',
      'data-schema-page="musical"',
      '"@type":"CreativeWork"',
      '"@type":"BreadcrumbList"',
      '"name":"Musicals & Shows"',
      '"@type":"FAQPage"',
      '"name":"Wo wird MJ – Das Michael Jackson Musical gespielt?"',
      '"text":"Das Musical läuft im Stage Theater an der Elbe, Norderelbstraße 8, 20457 Hamburg."',
      '"@type":"MusicEvent"',
      '"startDate":"2024-12-01"',
      '"name":"Stage Theater an der Elbe"',
      '"priceCurrency":"EUR"',
      '"url":"https://welovemusicals.com/musical/mj-das-michael-jackson-musical"',
      `<h1>${escapeHtml(mj.title)}</h1>`,
      '<h2>Termine &amp; Spielstätten</h2>',
      'href="/stadt/hamburg"',
    ]),
    assertPage("stadt/berlin", [
      `<title>${escapeHtml(berlinSeo.title)}</title>`,
      '<h2>Musicalabend in Berlin planen</h2>',
      'href="/musical/wir-sind-am-leben"',
      'href="/musical/der-kleine-lord"',
    ]),
    assertPage("stadt/graz", [
      `<title>${escapeHtml(getCitySeo(graz, 3).title)}</title>`,
      '<h2>Termine &amp; Spielstätten in Graz</h2>',
      'Helmut List Halle',
      '<h2>Musicaltermine in Graz an der Helmut List Halle planen</h2>',
      'FACK JU GÖHTE',
    ]),
    assertPage("musical/der-kleine-lord", [
      `<h1>${escapeHtml(derKleineLord.title)}</h1>`,
      'data-schema-page="musical"',
      'href="/stadt/berlin"',
      'BlueMax Theater am Potsdamer Platz',
      '2026-11-13',
      '2026-12-30',
      'Uwe Kröger',
    ]),
    assertPage("musical/fack-ju-goehte", [
      `<h1>${escapeHtml(fackJuGoehte.title)}</h1>`,
      'aria-label="Musical-Städte"',
      'href="/stadt/berlin"',
      'href="/stadt/bochum"',
    ]),
  ]);

  await assertStaticHtmlHasNoBlockedInternalLinks();

  console.log("Static SEO output assertions passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
