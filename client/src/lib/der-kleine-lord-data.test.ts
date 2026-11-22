import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getActiveMusicalsByCity, getMusicalBySlug } from "./data";
import tourFixture from "./__fixtures__/der-kleine-lord-tour-2027-2028.json";

const DKL_CDN_PREFIX = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/";
const DKL_LOGO_FREE_CARD_AND_HERO = `${DKL_CDN_PREFIX}sMrkJMvPtRQdnlMJ.webp`;
const DKL_BRANDED_KEYVISUAL = `${DKL_CDN_PREFIX}UARCYeGDkgcsgNrm.webp`;
// Absichtlich nicht mit createAwinLink erzeugt: Der Originalpfad muss exakt erhalten bleiben.
const DKL_BERLIN_TICKET_URL = "https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&ued=https%3A%2F%2Fwww.eventim.de%2Fartist%2Fder-kleine-lord-das-musical%2F";
const DKL_LINZ_EVENT_URL = "https://www.eventim.de/en/event/der-kleine-lord-das-musical-tipsarena-linz-22233603/";
const expectedCities = ["Berlin", ...tourFixture.tour.map(({ city }) => city)];

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-22T12:00:00"));
});
afterEach(() => vi.useRealTimers());

describe("Der Kleine Lord – Katalog und Ticketpfade", () => {
  it("führt die Berliner Weltpremiere einmalig mit unveränderter Spielzeit, Preis und direktem Awin-Ziel", () => {
    const musical = getMusicalBySlug("der-kleine-lord");

    expect(musical).toBeDefined();
    expect(musical?.title).toBe("DER KLEINE LORD");
    expect(musical?.city).toBe("Berlin");
    expect(musical?.headerCities).toEqual(["Berlin"]);
    expect(musical?.venue).toBe("BlueMax Theater am Potsdamer Platz");
    expect(musical?.priceFrom).toBe("59,99");
    expect(musical?.ticketCtaUrl).toContain("www.awin1.com/awclick.php");
    expect(musical?.ticketCtaUrl).toContain("gid=492097");
    expect(musical?.ticketCtaUrl).toContain("mid=11388");
    expect(musical?.ticketCtaUrl).toContain("awinaffid=2865727");
    expect(musical?.ticketCtaUrl).toContain("linkid=3666159");
    // Nur Berlin vergleichen, statt die ergänzte Tournee durch ein Einträge-Limit auszuschließen.
    expect(musical?.tourDates?.filter(({ city }) => city === "Berlin")).toEqual([
      {
        city: "Berlin",
        venue: "BlueMax Theater am Potsdamer Platz",
        startDate: "2026-11-13",
        endDate: "2026-12-30",
        premiereDate: "2026-11-13",
        eventimUrl: DKL_BERLIN_TICKET_URL,
      },
    ]);
    expect(musical?.tourDates?.[0]?.city).toBe("Berlin");
  });

  it("verwendet den gelieferten Awin-Textlink an allen allgemeinen CTAs und behält den Berliner Terminpfad bei", () => {
    const musical = getMusicalBySlug("der-kleine-lord");
    const expectedBase = "https://www.awin1.com/awclick.php?gid=492097&mid=11388&awinaffid=2865727&linkid=3666159&clickref=";

    expect(musical?.keyvisualLink).toBe(`${expectedBase}dkl-keyvisual`);
    expect(musical?.ticketCtaUrl).toBe(`${expectedBase}dkl-cta`);
    expect(musical?.eventimUrl).toBe(`${expectedBase}dkl-ticket`);
    expect(musical?.awinHeroUrl).toBe(`${expectedBase}dkl-hero`);
    expect(musical?.awinStickyUrl).toBe(`${expectedBase}dkl-sticky`);
    expect(musical?.awinBoxUrl).toBe(`${expectedBase}dkl-box`);
    expect(musical?.tourDates?.[0]?.eventimUrl).toBe(DKL_BERLIN_TICKET_URL);
    expect(musical?.tourDates?.[0]?.eventimUrl).not.toContain("linkid=3666159");
  });

  it("übernimmt exakt die 20 neuen Städte, Spielstätten und Zeiträume aus der ShowSlot-Fixture", () => {
    const musical = getMusicalBySlug("der-kleine-lord")!;
    const projectStop = ({ city, venue, startDate, endDate }: {
      city: string; venue: string; startDate: string; endDate?: string;
    }) => ({ city, venue, startDate, endDate });
    const byCity = (a: { city: string }, b: { city: string }) => a.city.localeCompare(b.city, "de");
    const newStops = musical.tourDates!.filter(({ city }) => city !== "Berlin");

    expect(tourFixture.tour).toHaveLength(20);
    expect(newStops).toHaveLength(20);
    expect(newStops.map(projectStop).sort(byCity))
      .toEqual(tourFixture.tour.map(projectStop).sort(byCity));
    expect(newStops.every((stop) => stop.premiereDate === undefined)).toBe(true);
  });

  it("führt insgesamt 21 eindeutige Städte und die passenden cities-/venuePerCity-Einträge", () => {
    const musical = getMusicalBySlug("der-kleine-lord")!;
    const tourCities = musical.tourDates!.map(({ city }) => city);
    const expectedVenues = Object.fromEntries([
      ["Berlin", "BlueMax Theater am Potsdamer Platz"],
      ...tourFixture.tour.map(({ city, venue }) => [city, venue]),
    ]);

    expect(tourFixture.source_city_count).toBe(21);
    expect(musical.tourDates).toHaveLength(21);
    expect(new Set(tourCities).size).toBe(21);
    expect(new Set(tourCities)).toEqual(new Set(expectedCities));
    expect(musical.cities).toHaveLength(21);
    expect(new Set(musical.cities)).toEqual(new Set(expectedCities));
    expect(musical.venuePerCity).toEqual(expectedVenues);
    expect(tourCities).not.toContain("Aachen");
  });

  it.each(tourFixture.tour)("verwendet für $city nur eigenes Awin-Tracking zum korrekten Eventim-Ziel", (fixtureStop) => {
    const musical = getMusicalBySlug("der-kleine-lord")!;
    const stop = musical.tourDates!.find(({ city }) => city === fixtureStop.city)!;
    const affiliate = new URL(stop.eventimUrl);

    expect(affiliate.origin).toBe("https://www.awin1.com");
    expect(affiliate.pathname).toBe("/cread.php");
    expect(affiliate.searchParams.getAll("awinmid")).toEqual(["11388"]);
    expect(affiliate.searchParams.getAll("awinaffid")).toEqual(["2865727"]);
    expect(affiliate.searchParams.getAll("ued")).toHaveLength(1);
    const target = new URL(affiliate.searchParams.get("ued")!);
    expect(target.origin).toBe("https://www.eventim.de");
    expect(target.hash).toBe("");
    if (fixtureStop.city === "Linz") {
      expect(target.href).toBe(DKL_LINZ_EVENT_URL);
      expect(Array.from(target.searchParams)).toEqual([]);
    } else {
      expect(target.pathname).toBe("/artist/der-kleine-lord-das-musical/");
      expect(Array.from(target.searchParams)).toEqual([["cityname", fixtureStop.ticketCity]]);
    }
    for (const url of [affiliate, target]) {
      expect(Array.from(url.searchParams.keys()).some((key) => /^(affiliate$|utm_)/i.test(key))).toBe(false);
      expect(url.href).not.toMatch(/SS_|J81|TUG|MXA/i);
    }
    expect(decodeURIComponent(stop.eventimUrl)).not.toContain("oeticket.com");
    expect(stop.oeticketUrl).toBeUndefined();
  });

  it("bewahrt für Linz den verifizierten Eventim-Einzelevent in der TipsArena am 26. Dezember 2027", () => {
    const linzFixture = tourFixture.tour.find(({ city }) => city === "Linz")!;
    const linz = getMusicalBySlug("der-kleine-lord")!.tourDates!.find(({ city }) => city === "Linz")!;

    expect(linzFixture.verifiedEventimEventUrl).toBe(DKL_LINZ_EVENT_URL);
    expect(linz).toMatchObject({
      city: "Linz", venue: "TipsArena", startDate: "2027-12-26", endDate: "2027-12-26",
    });
    expect(new URL(linz.eventimUrl).searchParams.get("ued")).toBe(DKL_LINZ_EVENT_URL);
  });

  it("verwendet das logo-freie WebP-Motiv für Karte und Header und behält das Keyvisual bei", () => {
    const musical = getMusicalBySlug("der-kleine-lord");

    expect(musical?.image).toBe(DKL_LOGO_FREE_CARD_AND_HERO);
    expect(musical?.heroImage).toBe(DKL_LOGO_FREE_CARD_AND_HERO);
    expect(musical?.keyvisual).toBe(DKL_BRANDED_KEYVISUAL);
    expect(musical?.inlineDetailImage).toEqual(
      expect.objectContaining({
        url: `${DKL_CDN_PREFIX}ZWCOQhljNRjcinLB.webp`,
        alt: expect.stringContaining("Uwe Kröger"),
      }),
    );
    expect(musical?.inlineDetailImageAfterParagraphIndex).toBe(4);
    expect(musical?.gallery).toBeUndefined();
  });

  it("bleibt ein Familien-Weihnachtsmusical und erhält die ergänzten Standort-/Tournee-Kategorien", () => {
    const berlinIds = getActiveMusicalsByCity("Berlin").map((musical) => musical.id);
    const musical = getMusicalBySlug("der-kleine-lord");

    expect(berlinIds).toContain("der-kleine-lord");
    expect(musical?.category).toBe("kinder");
    expect(musical?.categories).toEqual(["fester-standort", "tournee", "familie", "kinder"]);
    expect(musical?.tags).toEqual(expect.arrayContaining(["Familie", "Weihnachten"]));
    expect(musical?.experienceCategory).toBe("weihnachten");
    expect(musical?.additionalExperienceCategories).toEqual(["familie-maerchen-magie"]);
  });

  it.each(expectedCities)("findet Der Kleine Lord am 22. November 2026 als aktives Musical in %s", (city) => {
    expect(getActiveMusicalsByCity(city).filter(({ id }) => id === "der-kleine-lord"))
      .toHaveLength(1);
  });

  it("nennt Spielzeit, Weltpremiere und Veranstalter in den strukturiert auslesbaren Daten", () => {
    const musical = getMusicalBySlug("der-kleine-lord");

    expect(musical?.detailDescription).toContain("Weltpremiere");
    expect(musical?.showFacts).toContainEqual(
      expect.objectContaining({ label: "Spielzeit", value: "13. November bis 30. Dezember 2026" }),
    );
    expect(musical?.faqItems).toContainEqual(
      expect.objectContaining({
        question: "Wer veranstaltet die Produktion?",
        answer: "Veranstalter der Weltpremiere ist ShowSlot Touring GmbH.",
      }),
    );
  });
});
