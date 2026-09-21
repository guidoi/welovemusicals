import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getCityBySlug, getMusicalBySlug } from "../client/src/lib/data";
import { getCitySeo } from "../client/src/lib/city-seo";
import { getMusicalSeo } from "../client/src/lib/musical-seo";

const DIST_ROOT = resolve(import.meta.dirname, "..", "dist");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function assertPage(relativePath: string, expectations: string[]) {
  const html = await readFile(resolve(DIST_ROOT, relativePath, "index.html"), "utf8");
  for (const expectation of expectations) {
    if (!html.includes(expectation)) {
      throw new Error(`${relativePath}/index.html misses expected SEO value: ${expectation}`);
    }
  }
}

async function main() {
  const hamburg = getCityBySlug("hamburg");
  const berlin = getCityBySlug("berlin");
  const fackJuGoehte = getMusicalBySlug("fack-ju-goehte");
  const mj = getMusicalBySlug("mj-das-michael-jackson-musical");
  if (!hamburg || !berlin || !fackJuGoehte || !mj) throw new Error("Expected reference pages are not active");

  const hamburgSeo = getCitySeo(hamburg, 6);
  const berlinSeo = getCitySeo(berlin, 5);
  const mjSeo = getMusicalSeo(mj);

  await Promise.all([
    assertPage("stadt/hamburg", [
      `<title>${escapeHtml(hamburgSeo.title)}</title>`,
      'href="https://welovemusicals.com/stadt/hamburg"',
      'id="site-schema"',
      '"@type":"ItemList"',
      '<h1>Musicals in Hamburg 2026/2027</h1>',
      '<h2>Musicalabend in Hamburg planen</h2>',
      'href="/musical/mj-das-michael-jackson-musical"',
    ]),
    assertPage("musical/mj-das-michael-jackson-musical", [
      `<title>${escapeHtml(mjSeo.title)}</title>`,
      `href="${mjSeo.canonicalUrl}"`,
      'id="site-schema"',
      '"@type":"CreativeWork"',
      `<h1>${escapeHtml(mj.title)}</h1>`,
      'href="/stadt/hamburg"',
    ]),
    assertPage("stadt/berlin", [
      `<title>${escapeHtml(berlinSeo.title)}</title>`,
      '<h2>Musicalabend in Berlin planen</h2>',
      'href="/musical/wir-sind-am-leben"',
    ]),
    assertPage("musical/fack-ju-goehte", [
      `<h1>${escapeHtml(fackJuGoehte.title)}</h1>`,
      'aria-label="Musical-Städte"',
      'href="/stadt/berlin"',
      'href="/stadt/bochum"',
    ]),
  ]);

  console.log("Static SEO output assertions passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
