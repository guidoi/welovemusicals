import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACTIVE_MUSICAL_IDS,
  getActiveMusicalsByCity,
  getMusicalsByCity,
  musicals,
} from "./data";
import fixture from "./__fixtures__/dracula-tour-source-2026-11-22.json";

// Die Fixture stammt aus dem Originalbestand VOR der Ergänzung, nicht aus data.ts.
// Andere Produktionen werden verlustfrei durch kanonische SHA-256-Werte geschützt.
const original = fixture.baseline.dracula;
const dracula = () => musicals.find(({ id }) => id === "dracula")!;
const stopKey = ({ city, startDate, endDate }: {
  city: string; startDate: string; endDate?: string;
}) => `${city}|${startDate}|${endDate ?? ""}`;
const originalKeys = new Set(original.tourDates.map(stopKey));
const additions = () => dracula().tourDates!.filter((stop) => !originalKeys.has(stopKey(stop)));
const projectStop = ({ city, venue, startDate, endDate }: {
  city: string; venue: string; startDate: string; endDate?: string;
}) => ({ city, venue, startDate, endDate });
const byStop = (a: Parameters<typeof stopKey>[0], b: Parameters<typeof stopKey>[0]) =>
  stopKey(a).localeCompare(stopKey(b), "de");

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  }
  return value;
}

function stableHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(value)), "utf8").digest("hex");
}

function protectedFields<T extends { cities?: string[]; tourDates?: unknown[] }>(musical: T) {
  const { cities: _cities, tourDates: _tourDates, ...protectedData } = musical;
  return protectedData;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-22T12:00:00Z"));
});
afterEach(() => vi.useRealTimers());

describe("Dracula – vollständiger ShowSlot-Abgleich vom 22.11.2026", () => {
  it("sichert beide tatsächlichen Ergebnisseiten: 12 + 6 = 18 Zeilen und 18 Städte", () => {
    expect(fixture.source.url).toBe("https://showslot.com/de/musicals-shows/dracula/tickets/");
    expect(fixture.source.musicalUuid).toBe("f496c3ca-cfa6-4c0e-a894-6c90b925d88e");
    expect(fixture.source.pages).toEqual([{ page: 1, count: 12 }, { page: 2, count: 6 }]);
    expect(fixture.source.total).toBe(18);
    expect(fixture.source.rows).toHaveLength(18);
    expect(new Set(fixture.source.rows.map(({ city }) => city)).size).toBe(18);
    expect(new Set(fixture.source.rows.map(({ id }) => id)).size).toBe(18);
    for (const page of fixture.source.pages) {
      const rows = fixture.source.rows.filter(({ sourcePage }) => sourcePage === page.page);
      expect(rows).toHaveLength(page.count);
      expect(rows.every(({ sourceUrl }) => sourceUrl === (
        page.page === 1 ? fixture.source.url : `${fixture.source.url}?seite=2`
      ))).toBe(true);
    }
    expect(new Set(fixture.source.rows.map(({ sourcePage }) => sourcePage))).toEqual(new Set([1, 2]));
  });

  it("behält alle 13 Originalblöcke mit sämtlichen Feldern, Original-URLs und relativer Reihenfolge", () => {
    expect(original.tourDates).toHaveLength(13);
    const retained = dracula().tourDates!.filter((stop) => originalKeys.has(stopKey(stop)));
    expect(retained).toEqual(original.tourDates);
    for (const oldStop of original.tourDates) {
      expect(dracula().tourDates!.filter((stop) => stopKey(stop) === stopKey(oldStop)))
        .toEqual([oldStop]);
    }
    // Auch vergangene 2026-Spielzeiten sind keine freigegebene Löschung.
    expect(retained.filter(({ endDate }) => endDate! < "2026-11-22"))
      .toEqual(original.tourDates.filter(({ endDate }) => endDate < "2026-11-22"));
    expect(retained.find(({ city }) => city === "Berlin")?.badge).toBe("5 Wochen Gastspiel");
  });

  it("ergänzt exakt 12 neue Gastspiele und erreicht 25 eindeutige Blöcke in 18 Städten", () => {
    expect(fixture.additions).toHaveLength(12);
    expect(additions()).toHaveLength(12);
    expect(additions().map(projectStop).sort(byStop))
      .toEqual(fixture.additions.map(projectStop).sort(byStop));
    expect(dracula().tourDates).toHaveLength(25);
    expect(new Set(dracula().tourDates!.map(stopKey)).size).toBe(25);
    expect(new Set(dracula().tourDates!.map(({ city }) => city)).size).toBe(18);
    expect(new Set(dracula().tourDates!.map(({ city }) => city)))
      .toEqual(new Set(fixture.source.rows.map(({ city }) => city)));
    expect(additions().filter(({ city }) => original.cities.includes(city))).toHaveLength(7);
    expect(additions().filter(({ city }) => !original.cities.includes(city))).toHaveLength(5);
  });

  it("erweitert nur cities um die fünf neuen Städte und erhält den bisherigen Stadtbestand", () => {
    expect(dracula().cities).toHaveLength(18);
    expect(new Set(dracula().cities).size).toBe(18);
    expect(dracula().cities!.filter((city) => original.cities.includes(city))).toEqual(original.cities);
    expect(new Set(dracula().cities!.filter((city) => !original.cities.includes(city))))
      .toEqual(new Set(fixture.newCities));
    expect(new Set(dracula().cities)).toEqual(new Set(fixture.source.rows.map(({ city }) => city)));
  });

  it.each(fixture.source.rows)("deckt Quellstadt $city von Seite $sourcePage mit den verifizierten Ausnahmen ab", (row) => {
    const cityStops = dracula().tourDates!.filter(({ city }) => city === row.city);
    const exception = fixture.coverageExceptions.find(({ city }) => city === row.city);
    if (exception) {
      expect(cityStops.map(({ startDate, endDate }) => ({ startDate, endDate })))
        .toEqual(exception.ranges);
      if (exception.kind === "split") {
        expect(cityStops).toHaveLength(2);
        expect(cityStops[0].startDate).toBe(row.startDate);
        expect(cityStops[1].endDate).toBe(row.endDate);
        expect(cityStops[0].endDate! < cityStops[1].startDate).toBe(true);
      } else {
        expect(cityStops).toHaveLength(1);
        expect(cityStops[0].startDate <= row.startDate).toBe(true);
        expect(cityStops[0].endDate! >= row.endDate).toBe(true);
      }
    } else {
      expect(cityStops.filter(({ startDate, endDate }) =>
        startDate === row.startDate && endDate === row.endDate,
      )).toHaveLength(1);
    }
  });

  it.each(["Duisburg", "Wien"])("stellt %s nicht als durchgängigen Zweimonatsblock dar und bewahrt die spielfreie Lücke", (city) => {
    const row = fixture.source.rows.find((sourceRow) => sourceRow.city === city)!;
    const exception = fixture.coverageExceptions.find((entry) => entry.city === city)!;
    const cityStops = dracula().tourDates!.filter((stop) => stop.city === city);
    expect(cityStops.some(({ startDate, endDate }) => startDate === row.startDate && endDate === row.endDate))
      .toBe(false);
    const [first, second] = exception.ranges;
    for (const stop of cityStops) {
      expect(stop.startDate <= first.endDate && stop.endDate! >= second.startDate).toBe(false);
      expect(new Date(stop.endDate!).getTime() - new Date(stop.startDate).getTime())
        .toBeLessThan(31 * 24 * 60 * 60 * 1000);
    }
    expect(cityStops.some(({ startDate, endDate }) => startDate <= "2027-12-15" && endDate! >= "2027-12-15"))
      .toBe(false);
  });

  it("behält Köln exakt vom 28. bis 31. Oktober 2027 ohne Quell-Doppelblock oder Verkürzung", () => {
    expect(dracula().tourDates!.filter(({ city }) => city === "Köln"))
      .toEqual(original.tourDates.filter(({ city }) => city === "Köln"));
    expect(dracula().tourDates!.find(({ city }) => city === "Köln")?.startDate).toBe("2027-10-28");
  });

  it("schützt alle übrigen Dracula-Felder inklusive Preis, Awin-Hauptpfaden, Fotos, SEO, Texten, Kategorien und Trailer", () => {
    expect(protectedFields(dracula())).toEqual(protectedFields(original));
    expect(dracula().priceFrom).toBe("40,40");
  });

  it("schützt den übrigen Musicalbestand mit Original-Hashes und freigegebenen Inhaltsaktualisierungen", () => {
    expect(musicals.map(({ id }) => id)).toEqual(fixture.baseline.musicalIds);
    const otherMusicals = musicals.filter(({ id }) => id !== "dracula");
    expect(otherMusicals).toHaveLength(24);
    expect(Object.fromEntries(otherMusicals.map((musical) => [musical.id, stableHash(musical)])))
      .toEqual({
        ...fixture.baseline.otherHashes,
        // Nutzerfreigabe 25.11.2026: Moulin-Rouge-Spielort in Fakten/FAQ nur Hamburg,
        // ohne Zukunfts-/Premierenhinweis. Historische Quellfixture bleibt unverändert.
        // Nutzerfreigabe 28.11.2026 02:07/02:08: Startseiten-Artwork Moulin Rouge und Starlight Express.
        moulinrouge: "426c0eda7e8f9f2f128de79fa7f0ba95389f4c96fd8dc5f66aeb3950b54f4206",
        "starlight-express": "15b099eaa59f05ee3147bed7b5ef22afb7ef06728b30f71e06f1dd3cc9b34379",
        // Nutzerfreigabe 28.11.2026: nur featured-Flag (Phantom Top, Glöckner neben Dracula).
        "gloeckner-von-notre-dame": "15265e658bbd11da8e4929ad22fb88a78a866a87b1f4c333c86f267f94cf62d1",
        // Nutzerfreigabe 28.11.2026 02:04: Phantom-Artwork auf der Startseite.
        "phantom-der-oper": "11f837f201ab35614ae10303530ad697aac45c8166c5d82618c41bcc8a40450b",
      });
  });

  it.each(fixture.newCities)("verwendet für %s eigenes Awin-Tracking und ein sauberes Eventim-Artist-City-Ziel", (city) => {
    const expected = fixture.additions.find((stop) => stop.city === city)!;
    const stop = additions().find((newStop) => newStop.city === city)!;
    expect(stop).toBeDefined();
    const affiliate = new URL(stop.eventimUrl);
    expect(affiliate.origin).toBe("https://www.awin1.com");
    expect(affiliate.pathname).toBe("/cread.php");
    expect(affiliate.searchParams.getAll("awinmid")).toEqual(["11388"]);
    expect(affiliate.searchParams.getAll("awinaffid")).toEqual(["2865727"]);
    expect(affiliate.searchParams.getAll("clickref")).toEqual([expected.clickref]);
    expect(affiliate.searchParams.getAll("ued")).toHaveLength(1);
    expect([...affiliate.searchParams.keys()].sort()).toEqual(["awinaffid", "awinmid", "clickref", "ued"]);
    const target = new URL(affiliate.searchParams.get("ued")!);
    expect(target.origin).toBe("https://www.eventim.de");
    expect(target.pathname).toBe("/artist/dracula-das-musical/");
    expect(target.hash).toBe("");
    expect([...target.searchParams]).toEqual([["cityname", expected.ticketCity]]);
    for (const url of [affiliate, target]) {
      expect([...url.searchParams.keys()].some((key) => /^(affiliate$|utm_)/i.test(key))).toBe(false);
      expect(url.href).not.toMatch(/SS_|J81|DUA|MXA/i);
    }
    expect(stop.oeticketUrl).toBeUndefined();
  });

  it.each(["Berlin", "Duisburg", "Graz", "Innsbruck", "München", "Nürnberg", "Wien"])("verwendet für das neue Gastspiel in %s die vorhandene City-Ticket-URL exakt wieder", (city) => {
    const originalUrl = original.tourDates.find((stop) => stop.city === city)!.eventimUrl;
    const newStop = additions().find((stop) => stop.city === city)!;
    expect(newStop).toBeDefined();
    expect(newStop.eventimUrl).toBe(originalUrl);
    if (["Graz", "Innsbruck", "Wien"].includes(city)) {
      const target = new URL(newStop.eventimUrl);
      expect(target.origin).toBe("https://www.oeticket.com");
      expect(target.searchParams.get("affiliate")).toBe("P96");
      expect(target.searchParams.get("cityname")).toBe(city);
      expect(newStop.eventimUrl).not.toContain("awin1.com");
      expect(newStop.eventimUrl).not.toMatch(/J81|E40/);
    } else if (city === "München") {
      expect(newStop.eventimUrl).toBe("https://www.deutsches-theater.de/dracula/");
    }
  });

  it.each(["Berlin", "Hamburg", "Leipzig", ...fixture.newCities.filter((city) => !["Hamburg", "Leipzig"].includes(city))])(
    "findet Dracula über den cities-basierten Helper und als aktive Produktion in %s",
    (city) => {
      // getMusicalsByCity durchsucht cities/city, nicht tourDates: cities muss daher ebenfalls ergänzt sein.
      expect(getMusicalsByCity(city).filter(({ id }) => id === "dracula")).toHaveLength(1);
      expect(getActiveMusicalsByCity(city).filter(({ id }) => id === "dracula")).toHaveLength(1);
    },
  );

  it("übernimmt die fünf neuen Städte in die echte dynamische Initialisierung des Stadtfilters", () => {
    // Die nicht exportierte Initialisierung isoliert ausführen statt die Filterlogik im Test zu kopieren.
    // Ausschließlich lokaler Projektcode; keine Browser-, Netzwerk- oder Affiliate-Aufrufe.
    const filterSource = readFileSync(new URL("../components/MusicalFilters.tsx", import.meta.url), "utf8");
    const initializer = filterSource.match(/const allFilterCities = \(\(\) => \{([\s\S]*?)\}\)\(\);/);
    expect(initializer).not.toBeNull();
    const body = initializer![1].replace("new Set<string>()", "new Set()");
    const buildCities = (catalog: typeof musicals): string[] => runInNewContext(
      `(() => {${body}})()`,
      { musicals: catalog, ACTIVE_MUSICAL_IDS },
      { timeout: 1_000 },
    );
    const allCities = buildCities(musicals);
    const draculaCities = buildCities([dracula()]);
    expect(draculaCities).toEqual([...dracula().cities!].sort((a, b) => a.localeCompare(b, "de")));
    for (const city of fixture.newCities) {
      expect(allCities.filter((candidate) => candidate === city)).toEqual([city]);
      expect(draculaCities).toContain(city);
    }
  });
});
