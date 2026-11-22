import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ACTIVE_MUSICAL_IDS,
  createAwinLink,
  getActiveMusicalsByCity,
  getAdditionalMusicals,
  getFeaturedMusicals,
  getMusicalBySlug,
  musicals,
  WBT_STAGE_BERLIN_TEXT_LINK_URL,
  WBT_STAGE_HAMBURG_TEXT_LINK_URL,
} from "./data";
import { getMusicalExperienceCategory, getMusicalExperienceCategories, hasExperienceCategory } from "./experience-categories";
import { getMusicalCanonicalUrl, getMusicalEventSchemas } from "./event-schema";
import { getMusicalSeo } from "./musical-seo";
import { isSaleActive } from "./sale";

const id = "weihnachten-mit-bibi-tina";
const berlinUrl = "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442";
const hamburgUrl = "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26175768";
const canonicalUrl = `https://welovemusicals.com/musical/${id}`;

afterEach(() => vi.useRealTimers());

describe("WEIHNACHTEN MIT BIBI & TINA – aktive Produktionsdaten", () => {
  it("aktiviert genau einen kanonischen Eintrag als zehnte Top-Empfehlung ohne Duplikat weiter unten", () => {
    const musical = getMusicalBySlug(id);
    expect(musical).toMatchObject({ id, slug: id, title: "WEIHNACHTEN MIT BIBI & TINA", provider: "Stage Entertainment", featured: true });
    expect(ACTIVE_MUSICAL_IDS).toContain(id);
    expect(musicals.filter((show) => show.id === id)).toHaveLength(1);
    expect(getFeaturedMusicals()[9]).toBe(musical);
    expect(getAdditionalMusicals().map((show) => show.id)).not.toContain(id);
    expect(musical?.headerCities).toBeUndefined();
    expect(musical?.priceFrom).toBe("12,50");
    expect(musical?.tags).toHaveLength(3);
  });

  it("führt Berlin und Hamburg mit jeweils exakter freigegebener Textproduktseite und ohne Stuttgart", () => {
    const musical = getMusicalBySlug(id)!;
    expect(WBT_STAGE_BERLIN_TEXT_LINK_URL).toBe(berlinUrl);
    expect(WBT_STAGE_HAMBURG_TEXT_LINK_URL).toBe(hamburgUrl);
    expect(musical.cities).toEqual(["Berlin", "Hamburg"]);
    expect(musical.defaultTicketCity).toBe("Berlin");
    expect(musical.ticketUrlsByCity).toEqual({ Berlin: berlinUrl, Hamburg: hamburgUrl });
    expect([
      musical.eventimUrl, musical.keyvisualLink, musical.ticketCtaUrl,
      musical.awinHeroUrl, musical.awinStickyUrl, musical.awinBoxUrl,
    ]).toEqual(Array(6).fill(berlinUrl));
    expect(musical.tourDates).toEqual([
      { city: "Berlin", venue: "Stage Theater des Westens", startDate: "2026-11-14", endDate: "2027-01-03", eventimUrl: berlinUrl },
      { city: "Hamburg", venue: "Stage Operettenhaus", startDate: "2026-11-21", endDate: "2027-01-03", eventimUrl: hamburgUrl },
    ]);
    for (const url of Object.values(musical.ticketUrlsByCity!)) {
      expect(createAwinLink(url)).toBe(url);
      expect(new URL(url).searchParams.get("p")).toBe("394206");
      expect(new URL(url).searchParams.get("a")).toBe("3492604");
    }
    expect(JSON.stringify(musical)).not.toMatch(/Stuttgart|26175772|26185746|26185744|26185738|26185736/);
  });

  it("erscheint im Spielzeitfenster in beiden Stadtlisten, nie in Stuttgart, und nach Ende nicht mehr", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-22T12:00:00"));
    expect(getActiveMusicalsByCity("Berlin").map((show) => show.id)).toContain(id);
    expect(getActiveMusicalsByCity("Hamburg").map((show) => show.id)).toContain(id);
    expect(getActiveMusicalsByCity("Stuttgart").map((show) => show.id)).not.toContain(id);
    vi.setSystemTime(new Date("2027-01-04T12:00:00"));
    expect(getActiveMusicalsByCity("Berlin").map((show) => show.id)).not.toContain(id);
    expect(getActiveMusicalsByCity("Hamburg").map((show) => show.id)).not.toContain(id);
  });

  it("ordnet die Produktion Weihnachten sowie zusätzlich Familie & Kids zu", () => {
    const musical = getMusicalBySlug(id)!;
    expect(getMusicalExperienceCategory(id)).toBe("weihnachten");
    expect(getMusicalExperienceCategories(musical)).toEqual(["weihnachten", "familie-maerchen-magie"]);
    expect(hasExperienceCategory(musical, "weihnachten")).toBe(true);
    expect(hasExperienceCategory(musical, "familie-maerchen-magie")).toBe(true);
    expect(musical.categories).toEqual(["fester-standort", "familie", "kinder"]);
  });

  it("verwendet unveränderte gesicherte WebP-Assets und schreibt Foto- und Artwork-Credits getrennt", () => {
    const musical = getMusicalBySlug(id)!;
    expect(musical.image).toBe("https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/YqlpbjvubQJLnLqO.webp");
    expect(musical.homepageArtworkImage).toBe(musical.keyvisual);
    expect(musical.keyvisualLandscape).toBe(true);
    expect(musical.heroImage).toBe("https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VnOoWhZMdWLXybYP.webp");
    expect(musical.gallery).toHaveLength(4);
    expect(musical.gallery?.some((photo) => photo.url === musical.heroImage)).toBe(true);
    for (const photo of musical.gallery ?? []) {
      expect(photo.url).toMatch(/^https:\/\/files\.manuscdn\.com\/.*\.webp$/);
      expect(photo.alt).toContain("© Jörn Hartmann");
    }
    const impressum = readFileSync(new URL("../pages/Impressum.tsx", import.meta.url), "utf8");
    const credits = impressum.match(/\{\/\* Weihnachten mit Bibi & Tina \*\/\}([\s\S]*?)\{\/\* Unsplash/)?.[1];
    expect(credits).toBeDefined();
    expect(credits).toContain("Szenenfotos, Headerbild &amp; Galerie:</strong> © Jörn Hartmann");
    expect(credits).toContain("Artwork &amp; Keyvisual:</strong> Vom Projektinhaber bereitgestelltes Produktionsmaterial");
    expect(credits).not.toMatch(/Artwork[^\n]*Hartmann/);
    expect(musical.quotes).toBeUndefined();
  });

  it("führt den freigegebenen Einstiegspreis und den BF-Rabatt nur bis einschließlich 30. November", () => {
    const musical = getMusicalBySlug(id)!;
    expect(musical.sale).toEqual({ label: "BLACK FRIDAY", discount: "BIS 30 %", validUntil: "2026-11-30" });
    expect(isSaleActive(musical.sale, new Date("2026-11-22T12:00:00"))).toBe(true);
    expect(isSaleActive(musical.sale, new Date("2026-11-30T23:59:59"))).toBe(true);
    expect(isSaleActive(musical.sale, new Date("2026-12-01T00:00:00"))).toBe(false);
    expect(musical.priceFrom).toBe("12,50");
    expect(musical.showFacts).toContainEqual({ label: "Tickets ab", value: "12,50 €" });
    expect([musical.description, musical.detailDescription, musical.seoDescription].join(" ")).not.toMatch(/\d+[,.]\d{2}\s*(?:€|Euro)|Tickets ab/);
  });

  it("veröffentlicht kanonische SEO- und Event-URLs mit juristischem Veranstalter, ohne erfundenes Preisangebot", () => {
    const musical = getMusicalBySlug(id)!;
    const seo = getMusicalSeo(musical);
    expect(seo.canonicalUrl).toBe(canonicalUrl);
    expect(getMusicalCanonicalUrl(musical)).toBe(canonicalUrl);
    expect(seo.title).toContain("Weihnachten mit Bibi & Tina 2026/2027");
    expect(seo.description).toContain("Berlin und Hamburg");
    const events = getMusicalEventSchemas(musical, { today: "2026-11-22" });
    expect(events).toHaveLength(2);
    for (const [index, event] of events.entries()) {
      expect(event).toMatchObject({
        "@type": "MusicEvent",
        mainEntityOfPage: { "@id": canonicalUrl },
        startDate: index === 0 ? "2026-11-14" : "2026-11-21",
        endDate: "2027-01-03",
        location: { address: { addressLocality: index === 0 ? "Berlin" : "Hamburg", addressCountry: "DE" } },
        organizer: { "@type": "Organization", name: "Stage Entertainment Produktionsgesellschaft mbH", url: "https://www.stage-entertainment.de" },
      });
      expect(String(event["@id"])).toMatch(new RegExp(`^${canonicalUrl}#event-`));
      expect(event).not.toHaveProperty("offers");
    }
    expect(JSON.stringify(events)).not.toMatch(/clk\.tradedoubler|awin1\.com|Stuttgart|pop-out/);
    const pricedEvents = getMusicalEventSchemas(musical, { today: "2026-11-22", priceFrom: musical.priceFrom });
    for (const event of pricedEvents) {
      expect(event.offers).toMatchObject({ "@type": "Offer", price: "12.50", priceCurrency: "EUR", url: canonicalUrl });
    }
    expect(getMusicalEventSchemas(musical, { today: "2027-01-04" })).toEqual([]);
  });
});
