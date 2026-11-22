import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AWIN_MERCHANT_ID,
  AWIN_PUBLISHER_ID,
  createAwinLink,
  getActiveMusicalsByCity,
  getMusicalBySlug,
  type MusicalTourDate,
} from "./data";
import tourFixture from "./__fixtures__/schoene-und-das-biest-showslot-tour-2027.json";

const MUSICAL_ID = "schoene-und-das-biest";
// Literal statt Affiliate-Helper: Auch Änderungen an Kennungen und Serialisierung müssen auffallen.
const ORIGINAL_AWIN_BASE = "https://www.awin1.com/awclick.php?gid=492097&mid=11388&awinaffid=2865727&linkid=3737237&clickref=";
const ORIGINAL_BERLIN_URL = `${ORIGINAL_AWIN_BASE}dsudb-ticket`;
// Originalwerte vom 22.11.2026 bewusst eingebettet; CI benötigt keine Dateien außerhalb des Repos.
const ORIGINAL_ARTWORK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/sch%C3%B6ne-biest-keyvisual_c2c2405d.webp";
const NEW_CITIES = ["Bad Vilbel", "Friedrichshafen", "Hannover", "Heppenheim", "Ilsenburg", "Mannheim"];
const NEW_STOP_CITIES = [...NEW_CITIES, "Zwickau"];
const expectedCities = tourFixture.tour.map(({ city }) => city);
const originalCityNames = new Set([...tourFixture.originalStops.map(({ city }) => city), "Zwickau"]);
const cleanedSourceLinks = new Map(tourFixture.sourceRows.map(({ portalCity, link }) => {
  const target = new URL(link);
  // Nur das offizielle Ticketziel und ggf. cityname, nie ShowSlot-/Fremdaffiliate-Tracking.
  const cityname = target.searchParams.get("cityname");
  target.search = "";
  target.hash = "";
  if (cityname !== null) target.searchParams.set("cityname", cityname);
  return [portalCity, target.href];
}));

function getMusical() {
  const musical = getMusicalBySlug(MUSICAL_ID);
  expect(musical).toBeDefined();
  return musical!;
}

function projectStop({ city, venue, startDate, endDate, eventimUrl }: MusicalTourDate) {
  return { city, venue, startDate, endDate, eventimUrl };
}

function byCity(a: { city: string }, b: { city: string }) {
  return a.city.localeCompare(b.city, "de");
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-22T12:00:00Z"));
});
afterEach(() => vi.useRealTimers());

describe("Die Schöne und das Biest – offizieller Tourabgleich vom 22.11.2026", () => {
  it("sichert 67 eindeutige Quellzeilen auf sechs echten Seiten mit 12 × 5 + 7 Städten", () => {
    expect(tourFixture.retrieved).toBe("2026-11-22");
    expect(tourFixture.source).toBe("https://showslot.com/de/musicals-shows/die-schoene-und-das-biest/tickets/");
    expect(tourFixture.sourceCityCount).toBe(67);
    expect(tourFixture.sourceRows).toHaveLength(67);
    expect(new Set(tourFixture.sourceRows.map(({ portalCity }) => portalCity)).size).toBe(67);
    expect(tourFixture.pages).toHaveLength(6);
    expect(tourFixture.pages.map(({ count }) => count)).toEqual([12, 12, 12, 12, 12, 7]);
    expect(new Set(tourFixture.pages.map(({ url }) => url)).size).toBe(6);
    expect(new Set(tourFixture.sourceRows.map(({ sourceUrl }) => sourceUrl)))
      .toEqual(new Set(tourFixture.pages.map(({ url }) => url)));
    expect(new Set(tourFixture.sourceRows.map(({ sourcePage }) => sourcePage)))
      .toEqual(new Set([1, 2, 3, 4, 5, 6]));
    expect(new Set(tourFixture.sourceRows.map(({ portalCity }) => portalCity)))
      .toEqual(new Set(expectedCities));
  });

  it.each(tourFixture.pages)("deckt Quellseite $page vollständig und ohne fremde Zeilen ab", ({ page, url, count }) => {
    expect(url).toBe(`${tourFixture.source}${page === 1 ? "" : `?seite=${page}`}`);
    const rows = tourFixture.sourceRows.filter(({ sourcePage }) => sourcePage === page);
    expect(rows).toHaveLength(count);
    expect(rows.every(({ sourceUrl }) => sourceUrl === url)).toBe(true);
    expect(tourFixture.sourceRows.filter(({ sourceUrl }) => sourceUrl === url)).toEqual(rows);
  });

  it("führt exakt 67 Terminblöcke und 67 zugeordnete Städte ohne Dubletten", () => {
    const musical = getMusical();
    expect(tourFixture.tour).toHaveLength(67);
    expect(new Set(expectedCities).size).toBe(67);
    expect(musical.tourDates).toHaveLength(67);
    expect(new Set(musical.tourDates!.map(({ city }) => city)).size).toBe(67);
    expect(musical.tourDates!.map(projectStop).sort(byCity))
      .toEqual(tourFixture.tour.map(projectStop).sort(byCity));
    expect(musical.cities).toHaveLength(67);
    expect(new Set(musical.cities)).toEqual(new Set(expectedCities));
    expect(musical.tourDates!.every(({ premiereDate }) => premiereDate === undefined)).toBe(true);
  });

  it.each(tourFixture.tour)("übernimmt für $city Spielstätte, Beginn, Ende und Ticket-URL exakt aus der Fixture", (fixtureStop) => {
    const stops = getMusical().tourDates!.filter(({ city }) => city === fixtureStop.city);
    expect(stops).toHaveLength(1);
    expect(projectStop(stops[0])).toEqual(fixtureStop);
    const sourceRows = tourFixture.sourceRows.filter(({ portalCity }) => portalCity === fixtureStop.city);
    expect(sourceRows).toHaveLength(1);
    expect(fixtureStop.startDate).toBe(sourceRows[0].isoDateTime.slice(0, 10));
    expect(fixtureStop.startDate).toMatch(/^2027-\d{2}-\d{2}$/);
    expect(fixtureStop.endDate).toMatch(/^2027-\d{2}-\d{2}$/);
    expect(fixtureStop.endDate >= fixtureStop.startDate).toBe(true);
  });

  it.each(expectedCities)("findet das Musical am 22.11.2026 genau einmal als aktives Musical in %s", (city) => {
    expect(getActiveMusicalsByCity(city).filter(({ id }) => id === MUSICAL_ID)).toHaveLength(1);
  });

  it("ergänzt nur sechs neue cities und den bisher fehlenden Termin für die schon vorhandene Stadt Zwickau", () => {
    const musical = getMusical();
    expect(tourFixture.originalStops).toHaveLength(60);
    expect(originalCityNames.size).toBe(61);
    expect(tourFixture.newStops).toHaveLength(7);
    expect(new Set(tourFixture.newStops.map(({ city }) => city))).toEqual(new Set(NEW_STOP_CITIES));
    expect(musical.cities!.filter((city) => !originalCityNames.has(city)).sort()).toEqual([...NEW_CITIES].sort());
    expect(musical.tourDates!.filter(({ city }) => NEW_STOP_CITIES.includes(city)).map(projectStop).sort(byCity))
      .toEqual(tourFixture.newStops.map(projectStop).sort(byCity));
    expect(tourFixture.originalStops.some(({ city }) => city === "Zwickau")).toBe(false);
    expect(musical.tourDates!.find(({ city }) => city === "Zwickau")).toMatchObject({
      venue: "Sparkassen-Arena", startDate: "2027-03-30", endDate: "2027-03-30",
    });
  });

  it("behält Berlin einmalig am 06.–23.01.2027 im BlueMax Theater mit dem freigegebenen Original-AWClick", () => {
    const stops = getMusical().tourDates!;
    expect(stops.filter(({ city }) => city === "Berlin")).toEqual([{
      city: "Berlin", venue: "BlueMax Theater", startDate: "2027-01-06", endDate: "2027-01-23",
      eventimUrl: ORIGINAL_BERLIN_URL,
    }]);
    expect(stops.filter(({ eventimUrl }) => new URL(eventimUrl).pathname === "/awclick.php")).toHaveLength(1);
    expect(createAwinLink(ORIGINAL_BERLIN_URL)).toBe(ORIGINAL_BERLIN_URL);
  });

  it("bewahrt alle fünf allgemeinen AWIN-CTAs bytegleich mit den ursprünglichen Kennungen und Clickrefs", () => {
    const musical = getMusical();
    expect(AWIN_MERCHANT_ID).toBe("11388");
    expect(AWIN_PUBLISHER_ID).toBe("2865727");
    expect(musical.keyvisualLink).toBe(`${ORIGINAL_AWIN_BASE}dsudb-keyvisual`);
    expect(musical.eventimUrl).toBe(`${ORIGINAL_AWIN_BASE}dsudb-ticket`);
    expect(musical.awinHeroUrl).toBe(`${ORIGINAL_AWIN_BASE}dsudb-hero`);
    expect(musical.awinStickyUrl).toBe(`${ORIGINAL_AWIN_BASE}dsudb-sticky`);
    expect(musical.awinBoxUrl).toBe(`${ORIGINAL_AWIN_BASE}dsudb-box`);
    expect(musical.ticketCtaUrl).toBeUndefined();
  });

  it.each(tourFixture.originalStops)("bewahrt den bestehenden Ticketpfad für $city bytegleich, auch bei korrigiertem Termin", (originalStop) => {
    const stops = getMusical().tourDates!.filter(({ city }) => city === originalStop.city);
    expect(stops).toHaveLength(1);
    expect(stops[0].eventimUrl).toBe(originalStop.eventimUrl);
    expect(stops[0].oeticketUrl).toBeUndefined();
    const change = tourFixture.changes.find(({ before }) => before.city === originalStop.city);
    expect(projectStop(stops[0])).toEqual(change?.after ?? originalStop);
  });

  it("beschränkt die acht bestehenden Tourkorrekturen auf die belegten Städte und Daten", () => {
    expect(tourFixture.changes).toHaveLength(8);
    expect(tourFixture.changes.map(({ after }) => [after.city, after.venue, after.startDate, after.endDate])).toEqual([
      ["Bochum", "RuhrCongress", "2027-03-11", "2027-03-12"],
      ["Duisburg", "Theater am Marientor", "2027-01-27", "2027-01-28"],
      ["Hanau", "Congress Park", "2027-02-15", "2027-02-16"],
      ["Idar-Oberstein", "Messe", "2027-03-09", "2027-03-09"],
      ["Köln", "Motorworld", "2027-04-06", "2027-04-08"],
      ["Magdeburg", "AMO Kulturhaus", "2027-01-25", "2027-01-26"],
      ["Suhl", "Congress Centrum", "2027-03-04", "2027-03-04"],
      ["Weimar", "Weimarhalle", "2027-05-08", "2027-05-09"],
    ]);
    for (const { before, after, sourceUrl } of tourFixture.changes) {
      expect(tourFixture.originalStops.find(({ city }) => city === before.city)).toEqual(before);
      expect(projectStop(getMusical().tourDates!.find(({ city }) => city === after.city)!)).toEqual(after);
      expect(after.eventimUrl).toBe(before.eventimUrl);
      expect(tourFixture.sourceRows.find(({ portalCity }) => portalCity === after.city)?.sourceUrl).toBe(sourceUrl);
    }
    expect(getMusical().tourDates!.filter(({ city, startDate }) => city === "Suhl" && startDate === "2027-04-03"))
      .toHaveLength(0);
  });

  it.each(tourFixture.newStops)("verwendet für den neuen DE-Termin $city nur eigenes AWIN-Tracking und das bereinigte Quellziel", (fixtureStop) => {
    const stop = getMusical().tourDates!.find(({ city }) => city === fixtureStop.city)!;
    const affiliate = new URL(stop.eventimUrl);
    expect(affiliate.origin).toBe("https://www.awin1.com");
    expect(affiliate.pathname).toBe("/cread.php");
    expect(affiliate.hash).toBe("");
    expect(Array.from(affiliate.searchParams.keys()).sort())
      .toEqual(["awinaffid", "awinmid", "clickref", "ued"]);
    expect(affiliate.searchParams.getAll("awinmid")).toEqual(["11388"]);
    expect(affiliate.searchParams.getAll("awinaffid")).toEqual(["2865727"]);
    expect(affiliate.searchParams.getAll("clickref"))
      .toEqual([`dsudb-${fixtureStop.city.toLowerCase().replaceAll(" ", "-")}-dates`]);
    expect(affiliate.searchParams.getAll("ued")).toHaveLength(1);
    const target = new URL(affiliate.searchParams.get("ued")!);
    const cleanedSource = new URL(cleanedSourceLinks.get(fixtureStop.city)!);
    expect(target.origin).toBe("https://www.eventim.de");
    expect(target.href).toBe(cleanedSource.href);
    expect(target.pathname).toBe(cleanedSource.pathname);
    expect(Array.from(target.searchParams)).toEqual(Array.from(cleanedSource.searchParams));
    expect(Array.from(target.searchParams.keys())).toEqual(cleanedSource.searchParams.has("cityname") ? ["cityname"] : []);
    expect(target.hash).toBe("");
    expect(decodeURIComponent(stop.eventimUrl)).not.toMatch(/oeticket\.com|NG6|NGF|SS_|J81|utm_|promo_id|affiliate=/i);
    expect(stop.oeticketUrl).toBeUndefined();
    expect(createAwinLink(stop.eventimUrl)).toBe(stop.eventimUrl);
  });

  it("behält die bestehenden AT-Ticketpfade trotz fremder ShowSlot-Quelllinks unverändert", () => {
    const austrianRows = tourFixture.sourceRows.filter(({ link }) => new URL(link).hostname === "www.oeticket.com");
    expect(new Set(austrianRows.map(({ portalCity }) => portalCity)))
      .toEqual(new Set(["Bad Ischl", "Feldkirch", "Graz", "Innsbruck", "Linz", "Puch bei Salzburg"]));
    for (const { portalCity } of austrianRows) {
      const original = tourFixture.originalStops.find(({ city }) => city === portalCity)!;
      expect(original).toBeDefined();
      expect(getMusical().tourDates!.find(({ city }) => city === portalCity)?.eventimUrl).toBe(original.eventimUrl);
      expect(NEW_STOP_CITIES).not.toContain(portalCity);
    }
  });

  it("nennt 67 Spielorte und die vollständige Tour bis August 2027 in Fakten, Detailtext, FAQ und SEO", () => {
    const musical = getMusical();
    expect(musical.showFacts).toEqual([
      { label: "Showdauer", value: "ca. 2 Stunden (inkl. Pause)" },
      { label: "Sprache", value: "Alle Dialoge und Songs in deutscher Sprache" },
      { label: "Auf Tour", value: "Jan. bis Aug. 2027" },
      { label: "Altersempfehlung", value: "Ab 6 Jahren" },
    ]);
    expect(musical.description).toContain("Januar 2027");
    expect(musical.description).toContain("August 2027");
    expect(musical.detailDescription).toContain("67 Tourneestädte");
    expect(musical.detailDescription).toContain("67 Spielorten");
    expect(musical.faqItems!.find(({ question }) => question === "Wo wird das Musical gespielt?")?.answer)
      .toContain("67 Spielstätten");
    expect(musical.uspItems).toContainEqual({ icon: "MapPin", title: "67 Tourneestädte", text: "Quer durch Deutschland und Österreich" });
    expect(musical.seoDescription).toContain("67 Städte");
    expect(musical.seoDescription).toContain("Januar bis August 2027");
    for (const text of [musical.detailDescription, musical.seoDescription, ...musical.faqItems!.map(({ answer }) => answer)]) {
      expect(text).not.toMatch(/60\+?|61\s+(?:Städte|Spielstätten|Spielorte)/);
    }
    expect(musical.tourDates!.map(({ startDate }) => startDate).sort()[0]).toBe("2027-01-06");
    expect(musical.tourDates!.map(({ endDate }) => endDate!).sort().at(-1)).toBe("2027-08-22");
  });

  it("lässt Preis 54,00 €, Bavaria-Veranstalter, Familienkategorien und Original-Artworks unangetastet", () => {
    const musical = getMusical();
    expect(musical.title).toBe("DIE SCHÖNE UND DAS BIEST");
    expect(musical.subtitle).toBe("Das neue Musical");
    expect(musical.provider).toBe("Bavaria Live Promotion");
    expect(musical.category).toBe("tournee");
    expect(musical.categories).toEqual(["tournee", "familie"]);
    expect(musical.experienceCategory).toBe("familie-maerchen-magie");
    expect(musical.additionalExperienceCategories).toBeUndefined();
    expect(musical.tags).toEqual(["Tournee", "Familie", "Märchen"]);
    expect(musical.featured).toBe(false);
    expect(musical.priceFrom).toBe("54,00");
    expect(musical.faqItems).toContainEqual({
      question: "Was kosten die Tickets?",
      answer: "Tickets sind ab 54,00 € erhältlich. Die Preise variieren je nach Spieltag, Spielort und Preiskategorie. Aktuelle Preise finden Sie direkt bei Eventim.",
    });
    expect(musical.faqItems).toContainEqual({
      question: "Wer ist der Veranstalter?",
      answer: "Veranstalter ist Bavaria Live Promotion GmbH aus Würzburg, ein erfahrener Tournee-Veranstalter mit jahrzehntelanger Erfahrung im Live-Entertainment-Bereich.",
    });
    expect(musical.image).toBe(ORIGINAL_ARTWORK);
    expect(musical.keyvisual).toBe(ORIGINAL_ARTWORK);
    expect(musical.heroImage).toBeUndefined();
    expect(musical.homepageArtworkImage).toBeUndefined();
    expect(musical.gallery).toBeUndefined();
    expect(musical.inlineDetailImage).toBeUndefined();
    expect(musical).not.toHaveProperty("cast");
    expect(musical).not.toHaveProperty("ensemble");
    expect(musical.quotes).toBeUndefined();
    expect(musical.headerCities).toEqual(["Berlin", "Bochum", "Braunschweig", "Dresden", "Graz", "Köln", "Leipzig", "Nürnberg", "Stuttgart"]);
    expect(musical.detailHeadline).toBe("EIN MÄRCHEN WIRD WIRKLICHKEIT");
    expect(musical.storyHeadline).toBe("EIN MÄRCHEN SO ALT WIE DIE WELT");
    expect(musical.seoTitle).toBe("Die Schöne und das Biest – Das Musical Tickets 2027 | We Love Musicals");
  });
});
