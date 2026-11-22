import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getActiveMusicalsByCity, getMusicalBySlug, type MusicalTourDate } from "./data";
import { getMusicalSeo } from "./musical-seo";
import fixture from "./__fixtures__/aschenbroedel-showslot-tour-2026-2028.json";

const AS_OF = "2026-11-22";
// Trotz des historischen Feldnamens enthält die Fixture alle 106 Originalzeilen.
// Nur diese eingecheckte Fixture wird im CI benötigt, keine externe Research-Datei.
const baselineStops = fixture.retainedFutureStops;
const futureStops = baselineStops.filter((date) => endOf(date) >= AS_OF);
const expectedStops = [
  ...futureStops.map((date) =>
    fixture.extensions.find((extension) => stopKey(extension.before) === stopKey(date))?.after ?? date,
  ),
  ...fixture.newStops,
];
const expectedCities = [...new Set([
  ...fixture.sourceRows.map((row) => row.portalCity),
  ...fixture.sourceOnlyMissingFutureCitiesRetained,
])].sort();

// Verbatim aus der schreibgeschützten Originalbaseline; keine Link-Neuerzeugung.
const originalMainLinks = {
  keyvisualLink: "https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&clickref=3hn-keyvisual&ued=https%3A%2F%2Fwww.eventim.de%2Fartist%2Fdrei-haselnuesse-fuer-aschenbroedel-das-musical%2F",
  eventimUrl: "https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&clickref=3hn-eventim&ued=https%3A%2F%2Fwww.eventim.de%2Fartist%2Fdrei-haselnuesse-fuer-aschenbroedel-das-musical%2F",
  awinHeroUrl: "https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&clickref=3hn-hero&ued=https%3A%2F%2Fwww.eventim.de%2Fartist%2Fdrei-haselnuesse-fuer-aschenbroedel-das-musical%2F",
  awinStickyUrl: "https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&clickref=3hn-sticky&ued=https%3A%2F%2Fwww.eventim.de%2Fartist%2Fdrei-haselnuesse-fuer-aschenbroedel-das-musical%2F",
  awinBoxUrl: "https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&clickref=3hn-box&ued=https%3A%2F%2Fwww.eventim.de%2Fartist%2Fdrei-haselnuesse-fuer-aschenbroedel-das-musical%2F",
} as const;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${AS_OF}T12:00:00`));
});
afterEach(() => vi.useRealTimers());

describe("Drei Haselnüsse für Aschenbrödel – Tour 2026–2028, Stand 22.11.2026", () => {
  const musical = getMusicalBySlug("drei-haselnuesse-fuer-aschenbroedel")!;
  const dates = musical?.tourDates ?? [];
  const find = (city: string, startDate: string) =>
    dates.find((date) => date.city === city && date.startDate === startDate);

  it("übernimmt Preis, SEO und die bestätigte Tournee bis 16. Januar 2028", () => {
    expect(musical).toBeDefined();
    expect(musical.priceFrom).toBe("40,49");
    expect(musical.experienceCategory).toBe("weihnachten");
    expect(musical.additionalExperienceCategories).toEqual(["familie-maerchen-magie"]);
    expect(musical.category).toBe("tournee");
    expect(musical.categories).toEqual(["tournee", "familie"]);
    expect(musical.tags).toEqual(["Tournee", "Familie", "Märchen"]);
    expect(musical.detailHeadline).toBe("ZWEI TOUREN. EIN WINTERMÄRCHEN. 77 STÄDTE.");
    expect(musical.detailDescription).toContain("Nikolaus-Tour");
    expect(musical.detailDescription).toContain("Rosalie-Tour");
    expect(musical.detailDescription).toContain("Lena Marie Hespe");
    expect(musical.detailDescription).toContain("Cassandra Schütt");
    expect(musical.detailDescription).toContain("November 2026 bis Januar 2028 in 77 Städte");
    expect(musical.showFacts).toContainEqual({ label: "Auf Tour", value: "Nov. 2026 bis 16. Jan. 2028" });
    expect(musical.showFacts).toContainEqual({ label: "Altersempfehlung", value: "Ab 6 Jahren" });
    expect(musical.faqItems?.find((item) => item.question === "Was kosten die Tickets?")?.answer)
      .toContain("40,49 Euro");
    expect(musical.faqItems?.find((item) => item.question === "Gibt es eine Altersempfehlung?")?.answer)
      .toContain("ab 6 Jahren");
    expect(musical.faqItems?.find((item) => item.question === "Wo wird das Musical gespielt?")?.answer)
      .toContain("77 Städten");

    const seo = getMusicalSeo(musical);
    expect(seo.title).toBe("Drei Haselnüsse für Aschenbrödel 2026–2028 ❤️ Tickets");
    expect(seo.description).toContain("77 Städte");
    expect(seo.description).toContain("40,49 €");
  });

  it("nennt die Veranstalter der Nikolaus- und Rosalie-Tour korrekt", () => {
    const organizerFaq = musical.faqItems?.find((item) => item.question === "Wer veranstaltet die Tourneen?");
    expect(organizerFaq?.answer).toContain("ShowSlot");
    expect(organizerFaq?.answer).toContain("Nikolaus-Tour");
    expect(organizerFaq?.answer).toContain("Bavaria Live Promotion");
    expect(organizerFaq?.answer).toContain("Rosalie-Tour");
  });

  it("führt die weiterhin bestätigten Presse-Termine einschließlich des erweiterten Hamburg-Blocks", () => {
    expect(find("Hamburg", "2027-01-26")).toMatchObject({ venue: "Sporthalle", endDate: "2027-01-28" });
    expect(find("Berlin", "2027-02-28")).toMatchObject({ venue: "BlueMax Theater", endDate: "2027-04-04" });
    expect(find("Fulda", "2027-12-21")).toMatchObject({ venue: "Esperantohalle", endDate: "2027-12-22" });
    expect(find("Hannover", "2027-02-17")).toMatchObject({ venue: "Swiss Life Hall" });
    expect(find("Nürnberg", "2027-02-02")).toMatchObject({ endDate: "2027-02-04" });
    expect(find("Wien", "2027-01-06")).toMatchObject({ endDate: "2027-01-17" });
    expect(find("Neuss", "2028-01-11")).toMatchObject({ endDate: "2028-01-13" });
    expect(find("Paderborn", "2028-01-03")).toMatchObject({ endDate: "2028-01-07" });
    expect(find("Würzburg", "2027-12-19")).toMatchObject({ endDate: "2027-12-20" });
    expect(find("Aschaffenburg", "2026-12-14")).toBeDefined();
    expect(find("Donaueschingen", "2026-12-15")).toMatchObject({ venue: "Donauhalle (Mozart-Saal)" });
    expect(find("Halle (Saale)", "2026-12-03")).toMatchObject({ endDate: "2026-12-04" });
    expect(find("Koblenz", "2026-11-30")).toBeDefined();
    expect(find("Ravensburg", "2026-12-16")).toBeDefined();
    expect(find("Wetzlar", "2026-11-29")).toBeDefined();
  });

  it("sichert sieben unterschiedliche Quellseiten mit 12 × 6 + 1 Zeilen und 73 eindeutigen Städten", () => {
    expect(fixture.retrieved).toBe(AS_OF);
    expect(fixture.source).toBe("https://showslot.com/en/musicals-shows/three-wishes-for-cinderella/tickets/");
    expect(fixture.pages.map((page) => page.page)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(fixture.pages.map((page) => page.count)).toEqual([12, 12, 12, 12, 12, 12, 1]);
    expect(new Set(fixture.pages.map((page) => page.url)).size).toBe(7);
    expect(fixture.sourceCityCount).toBe(73);
    expect(fixture.sourceRows).toHaveLength(73);
    expect(new Set(fixture.sourceRows.map((row) => row.id)).size).toBe(73);
    expect(new Set(fixture.sourceRows.map((row) => row.city)).size).toBe(73);
    expect(new Set(fixture.sourceRows.map((row) => row.portalCity)).size).toBe(73);
    for (const page of fixture.pages) {
      expect(page.url).toBe(page.page === 1 ? fixture.source : `${fixture.source}?seite=${page.page}`);
      const rows = fixture.sourceRows.filter((row) => row.sourcePage === page.page);
      expect(rows, `Quellseite ${page.page}`).toHaveLength(page.count);
      expect(rows.every((row) => row.sourceUrl === page.url)).toBe(true);
    }
    expect(fixture.sourceRows.every((row) => fixture.pages.some((page) => page.page === row.sourcePage))).toBe(true);
  });

  it("deckt Anfang und letzten Label-Spieltag jeder der 73 Quellstädte in echten Stadtblöcken ab", () => {
    for (const row of fixture.sourceRows) {
      const firstDay = row.isoDateTime.slice(0, 10);
      const lastDay = lastLabelDay(row.dateLabel);
      const cityDates = dates.filter((date) => date.city === row.portalCity);
      expect(cityDates.length, `${row.city}: Stadtzuordnung`).toBeGreaterThan(0);
      expect(cityDates.some((date) => includesDay(date, firstDay)), `${row.city}: erster Spieltag ${firstDay}`).toBe(true);
      expect(cityDates.some((date) => includesDay(date, lastDay)), `${row.city}: letzter Spieltag ${lastDay}`).toBe(true);
    }
  });

  it("behält alle 81 alten Future-Blöcke inklusive unveränderter URLs und erlaubt nur echte Erweiterungen", () => {
    expect(baselineStops).toHaveLength(106);
    expect(futureStops).toHaveLength(81);
    const retained = futureStops.map((before) => {
      const matches = dates.filter((date) => date.city === before.city
        && date.venue === before.venue
        && date.startDate <= before.startDate
        && endOf(date) >= endOf(before));
      expect(matches, `Future-Retention ${stopKey(before)}`).toHaveLength(1);
      expect(matches[0].eventimUrl, `Original-URL ${stopKey(before)}`).toBe(before.eventimUrl);
      return stopKey(matches[0]);
    });
    // Ein Sammelfenster darf nicht mehrere vorher getrennte Gastspiele ersetzen.
    expect(new Set(retained).size).toBe(81);
  });

  it("entfernt genau die 25 vor dem Stichtag abgelaufenen Blöcke, behält aber Kempten am heutigen Tag", () => {
    const expiredBaseline = baselineStops.filter((date) => endOf(date) < AS_OF);
    expect(expiredBaseline).toHaveLength(25);
    expect(sortedStops(fixture.expiredStops)).toEqual(sortedStops(expiredBaseline));
    for (const expired of fixture.expiredStops) {
      expect(endOf(expired) < AS_OF).toBe(true);
      expect(dates.some((date) => date.city === expired.city
        && date.startDate <= expired.startDate
        && endOf(date) >= endOf(expired)), `Abgelaufen ${stopKey(expired)}`).toBe(false);
    }
    expect(dates.every((date) => endOf(date) >= AS_OF)).toBe(true);
    expect(find("Kempten", AS_OF)).toMatchObject({ venue: "bigBOX Allgäu", endDate: AS_OF });
    expect(getActiveMusicalsByCity("Kempten").map((item) => item.id)).toContain(musical.id);
    // Bereits laufende Gastspiele werden nicht auf den Stichtag gekürzt.
    expect(find("Duisburg", "2026-11-18")).toMatchObject({ endDate: "2026-11-23" });
  });

  it("ergänzt sämtliche 14 neuen Terminblöcke mit ihren Fixture-Werten", () => {
    expect(fixture.newStops).toHaveLength(14);
    expect(new Set(fixture.newStops.map(stopKey)).size).toBe(14);
    for (const added of fixture.newStops) {
      expect(baselineStops.some((before) => stopKey(before) === stopKey(added))).toBe(false);
      expect(find(added.city, added.startDate), `Neuer Block ${stopKey(added)}`).toEqual(added);
    }
  });

  it("erweitert ausschließlich Cottbus, Hamburg und Karlsruhe ohne URL-Wechsel", () => {
    expect(fixture.extensions.map(({ after }) => [after.city, after.startDate, after.endDate])).toEqual([
      ["Cottbus", "2027-01-04", "2027-01-05"],
      ["Hamburg", "2027-01-26", "2027-01-28"],
      ["Karlsruhe", "2027-12-25", "2027-12-26"],
    ]);
    for (const { before, after } of fixture.extensions) {
      expect(baselineStops).toContainEqual(before);
      expect(after.startDate <= before.startDate).toBe(true);
      expect(endOf(after) >= endOf(before)).toBe(true);
      expect(after.eventimUrl).toBe(before.eventimUrl);
      expect(find(after.city, after.startDate)).toEqual(after);
      expect(dates.filter((date) => date.city === after.city)).toHaveLength(
        expectedStops.filter((date) => date.city === after.city).length,
      );
    }
  });

  it("übernimmt alle fünf unabhängig aufgelösten Sammelfenster als separate Gastspiele", () => {
    expect(fixture.resolvedAggregates.map((aggregate) => aggregate.city).sort()).toEqual([
      "Duisburg", "Heilbronn", "Limburg", "Lüneburg", "Passau",
    ].sort());
    for (const aggregate of fixture.resolvedAggregates) {
      expect(aggregate.verified, aggregate.city).toBe(true);
      expect(aggregate.newStops).toHaveLength(1);
      for (const resolved of aggregate.newStops) {
        expect(new URL(resolved.sourceUrl).protocol).toBe("https:");
        expect(find(aggregate.city, resolved.startDate)).toMatchObject({
          startDate: resolved.startDate, endDate: resolved.endDate,
        });
        expect(fixture.newStops.some((date) => date.city === aggregate.city
          && date.startDate === resolved.startDate && date.endDate === resolved.endDate)).toBe(true);
      }
      expect(sortedStops(dates.filter((date) => date.city === aggregate.city)))
        .toEqual(sortedStops(expectedStops.filter((date) => date.city === aggregate.city)));
    }
  });

  it("bewahrt insbesondere Dresden, Frankfurt, Ravensburg, Zwickau und das kurze Deggendorf-Fenster getrennt", () => {
    const separateRuns: Record<string, string[][]> = {
      Dresden: [["2026-12-16", "2026-12-20"], ["2027-02-12", "2027-02-14"]],
      "Frankfurt am Main": [["2026-11-26", "2026-11-29"], ["2027-02-06", "2027-02-07"]],
      Ravensburg: [["2026-12-16", "2026-12-16"], ["2027-02-28", "2027-02-28"]],
      Zwickau: [["2026-12-09", "2026-12-09"], ["2027-02-24", "2027-02-24"]],
      Deggendorf: [["2026-12-18", "2026-12-18"], ["2026-12-28", "2026-12-28"]],
    };
    for (const [city, runs] of Object.entries(separateRuns)) {
      expect(dates.filter((date) => date.city === city)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .map((date) => [date.startDate, endOf(date)]), city).toEqual(runs);
    }
  });

  it("führt exakt 95 Terminblöcke ohne erfundene Wochen- oder Monats-Sammelfenster", () => {
    expect(fixture.activeStopCount).toBe(95);
    expect(expectedStops).toHaveLength(95);
    expect(dates).toHaveLength(95);
    expect(new Set(dates.map(stopKey)).size).toBe(95);
    expect(sortedStops(dates)).toEqual(sortedStops(expectedStops));
    expect(dates.map((date) => date.startDate).sort()[0]).toBe("2026-11-18");
    expect(dates.map(endOf).sort().at(-1)).toBe("2028-01-16");
    for (const date of dates) {
      expect(date.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(endOf(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(date.startDate <= endOf(date)).toBe(true);
      expect(endOf(date) >= AS_OF).toBe(true);
      expect(endOf(date) <= "2028-01-16").toBe(true);
    }
  });

  it("ordnet am fixierten Stichtag alle 77 aktiven Städte vollständig über getActiveMusicalsByCity zu", () => {
    expect(fixture.activeCityCount).toBe(77);
    expect(expectedCities).toHaveLength(77);
    expect([...new Set(dates.map((date) => date.city))].sort()).toEqual(expectedCities);
    expect(musical.cities).toHaveLength(77);
    expect([...(musical.cities ?? [])].sort()).toEqual(expectedCities);
    for (const city of expectedCities) {
      expect(getActiveMusicalsByCity(city).filter((item) => item.id === musical.id), city).toHaveLength(1);
    }
    const expiredOnlyCities = [...new Set(baselineStops.map((date) => date.city))]
      .filter((city) => !expectedCities.includes(city));
    expect(expiredOnlyCities).toHaveLength(9);
    for (const city of expiredOnlyCities) {
      expect(musical.cities).not.toContain(city);
      expect(getActiveMusicalsByCity(city).map((item) => item.id), city).not.toContain(musical.id);
    }
    expect(musical.headerCities).toContain("Hamburg");
    expect(musical.headerCities).toEqual([
      "Berlin", "Bochum", "Bremen", "Dresden", "Duisburg", "Frankfurt am Main", "Hamburg",
      "Köln", "Leipzig", "München", "Nürnberg", "Stuttgart", "Wien",
    ]);
  });

  it("behält die vier Future-Städte außerhalb ShowSlot und reaktiviert keine ausdrücklich entfernten Alttermine", () => {
    expect(fixture.sourceOnlyMissingFutureCitiesRetained).toEqual([
      "Crailsheim", "Gera", "München", "Weiden i. d. Oberpfalz",
    ]);
    for (const city of fixture.sourceOnlyMissingFutureCitiesRetained) {
      expect(fixture.sourceRows.some((row) => row.portalCity === city)).toBe(false);
      expect(sortedStops(dates.filter((date) => date.city === city)))
        .toEqual(sortedStops(futureStops.filter((date) => date.city === city)));
      expect(getActiveMusicalsByCity(city).map((item) => item.id)).toContain(musical.id);
    }
    expect(find("Mannheim", "2026-11-25")).toBeUndefined();
    expect(find("Würzburg", "2026-12-11")).toBeUndefined();
    expect(find("Mannheim", "2027-11-04")).toMatchObject({
      venue: "Rosengarten (Mozartsaal)", endDate: "2027-11-04",
    });
    expect(musical.cities).toContain("Mannheim");
  });

  it("behält die fünf Haupt-URLs und sämtliche bestehenden Stadt-URLs bytegleich", () => {
    for (const key of Object.keys(originalMainLinks) as Array<keyof typeof originalMainLinks>) {
      expect(musical[key], key).toBe(originalMainLinks[key]);
    }
    for (const date of dates) {
      const originalCityLinks = baselineStops.filter((before) => before.city === date.city).map((before) => before.eventimUrl);
      if (originalCityLinks.length > 0) {
        expect(originalCityLinks, `Unveränderte Stadt-URL ${date.city}`).toContain(date.eventimUrl);
      }
    }
    // Bestehender, ausdrücklich nicht zur Bereinigung freigegebener ZEE-Deeplink.
    const originalOder = baselineStops.find((date) => date.city === "Frankfurt (Oder)")!;
    expect(find("Frankfurt (Oder)", "2027-01-03")?.eventimUrl).toBe(originalOder.eventimUrl);
    expect(new URL(new URL(originalOder.eventimUrl).searchParams.get("ued")!).searchParams.get("affiliate")).toBe("ZEE");
  });

  it("verwendet an allen Haupt- und Stadt-CTAs die bereitgestellten Awin/Eventim-Pfade", () => {
    const links = [
      musical.keyvisualLink, musical.eventimUrl, musical.awinHeroUrl, musical.awinStickyUrl, musical.awinBoxUrl,
      ...dates.map((date) => date.eventimUrl),
    ];
    expect(links).toHaveLength(100);
    for (const link of links) {
      expect(link).toBeTruthy();
      const url = new URL(link!);
      expect(url.hostname).toBe("www.awin1.com");
      expect(url.pathname).toBe("/cread.php");
      expect(url.searchParams.get("awinmid")).toBe("11388");
      expect(url.searchParams.get("awinaffid")).toBe("2865727");
      expect(url.searchParams.get("clickref")).toMatch(/^3hn-/);
      expect(new URL(url.searchParams.get("ued")!).hostname).toBe("www.eventim.de");
    }
    expect(findDateLink(musical, "Hamburg")).toContain("clickref=3hn-hamburg-dates");
    expect(findDateLink(musical, "Berlin")).toContain("clickref=3hn-berlin-dates");
    expect(findDateLink(musical, "Neuss")).toContain("clickref=3hn-neuss-dates");
  });

  it("bereinigt nur die sechs neuen Stadtlinks ohne fremde Affiliate-, UTM- oder Sessionparameter", () => {
    const newCityDates = dates.filter((date) => !baselineStops.some((before) => before.city === date.city));
    expect(newCityDates.map((date) => date.city).sort()).toEqual([
      "Aachen", "Augsburg", "Ingelheim am Rhein", "Landshut", "Mannheim", "Neu-Ulm",
    ].sort());
    for (const date of newCityDates) {
      const outer = new URL(date.eventimUrl);
      expect([...outer.searchParams.keys()].sort()).toEqual(["awinaffid", "awinmid", "clickref", "ued"]);
      expect(outer.searchParams.get("awinmid")).toBe("11388");
      expect(outer.searchParams.get("awinaffid")).toBe("2865727");
      expect(outer.searchParams.get("clickref")).toMatch(/^3hn-[a-z-]+-dates$/);
      const destination = new URL(outer.searchParams.get("ued")!);
      expect(destination.protocol).toBe("https:");
      expect(destination.hostname).toBe("www.eventim.de");
      expect(destination.pathname).toBe("/artist/drei-haselnuesse-fuer-aschenbroedel-das-musical/");
      expect([...destination.searchParams.keys()]).toEqual(["cityname"]);
      expect(destination.searchParams.get("cityname")).toBeTruthy();
      expect(destination.hash).toBe("");
    }
  });
});

function endOf(date: Pick<MusicalTourDate, "startDate" | "endDate">): string {
  return date.endDate ?? date.startDate;
}

function stopKey(date: Pick<MusicalTourDate, "city" | "startDate" | "endDate">): string {
  return `${date.city}|${date.startDate}|${endOf(date)}`;
}

function sortedStops(dates: MusicalTourDate[]): MusicalTourDate[] {
  return [...dates].sort((a, b) => stopKey(a).localeCompare(stopKey(b)));
}

function includesDay(date: MusicalTourDate, day: string): boolean {
  return date.startDate <= day && endOf(date) >= day;
}

function lastLabelDay(label: string): string {
  // Funktioniert für Einzeltermine, 04.–05.12.2027, 28.02.–04.04.2027
  // und jahresübergreifende Sammellabels; keine erfundene durchgehende Spielzeit.
  const match = label.match(/(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) throw new Error(`Unbekanntes Quell-Datumslabel: ${label}`);
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function findDateLink(
  musical: NonNullable<ReturnType<typeof getMusicalBySlug>>,
  city: string,
): string {
  return musical.tourDates?.find((date) => date.city === city)?.eventimUrl ?? "";
}
