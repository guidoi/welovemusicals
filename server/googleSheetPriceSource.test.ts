import { describe, expect, it, vi } from "vitest";
import { createGoogleSheetPriceSource, parseCsv, parseGoogleSheetPriceCsv } from "./googleSheetPriceSource";

const header = "musical_id,Preis ab,Sale aktiv,Sale-Text,Sale-Hinweis,Gültig ab,Gültig bis,Ticketlink,Notiz";
const validRow = 'eiskoenigin,"39,99 €",Ja,"BIS 40 %","Ausgewählte Vorstellungen",14.09.2026,21.09.2026,https://example.test/tickets,"redaktionell privat"';

function response(csv: string, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => csv,
  };
}

describe("Google-Sheets-Preisquelle", () => {
  it("parst Google-CSV sicher mit Anführungszeichen und bewahrt nur Website-Felder", () => {
    const overrides = parseGoogleSheetPriceCsv(`${header}\n${validRow}`);

    expect(overrides).toEqual([
      {
        musicalId: "eiskoenigin",
        priceFrom: "39,99",
        saleEnabled: true,
        saleLabel: "SALE",
        saleDiscount: "BIS 40 %",
        saleNote: "Ausgewählte Vorstellungen",
        saleStartsAt: "2026-09-14",
        saleEndsAt: "2026-09-21",
      },
    ]);
    expect(Object.keys(overrides[0]!)).not.toContain("ticketLink");
    expect(JSON.stringify(overrides)).not.toContain("redaktionell privat");
    expect(parseCsv('a,"b,c"\n1,2')).toEqual([["a", "b,c"], ["1", "2"]]);
  });

  it("ignoriert unbekannte IDs und verwirft unsichere Preis- oder Sale-Zeilen", () => {
    const csv = [
      header,
      "unbekannt,19,99,Nein,,,,,,",
      "mj-musical,ungültig,Nein,,,,,,",
      "tarzan,66,99,Ja,,,,,,",
      "koenig-der-loewen,63,99,Ja,BIS 15 %,Hinweis,21.09.2026,14.09.2026,,,",
      "mj-musical,35,Nein,SHOULD NOT LEAK,Private note,,,,",
    ].join("\n");

    expect(parseGoogleSheetPriceCsv(csv)).toEqual([
      {
        musicalId: "mj-musical",
        priceFrom: "35",
        saleEnabled: false,
        saleLabel: null,
        saleDiscount: null,
        saleNote: null,
        saleStartsAt: null,
        saleEndsAt: null,
      },
    ]);
  });

  it("verwendet den Cache innerhalb des Intervalls und bei einem späteren Quellfehler den Letztstand", async () => {
    let currentTime = 1_000;
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(`${header}\n${validRow}`))
      .mockResolvedValueOnce(response("nicht verfügbar", 401));
    const source = createGoogleSheetPriceSource({
      url: "https://docs.google.com/spreadsheets/d/e/public-export/pub?output=csv",
      fetcher,
      now: () => currentTime,
      cacheTtlMs: 600,
    });

    const first = await source.listOverrides();
    currentTime += 300;
    const cached = await source.listOverrides();
    currentTime += 600;
    const fallback = await source.listOverrides();

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(cached).toEqual(first);
    expect(fallback).toEqual(first);
  });

  it("verwirft einen vollständigen ungültigen Abruf statt einen zuvor sicheren Stand zu überschreiben", async () => {
    let currentTime = 1_000;
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(`${header}\n${validRow}`))
      .mockResolvedValueOnce(response(`${header}\nunbekannt,39,99,Nein,,,,,,`));
    const source = createGoogleSheetPriceSource({
      url: "https://docs.google.com/spreadsheets/d/e/public-export/pub?output=csv",
      fetcher,
      now: () => currentTime,
      cacheTtlMs: 1,
    });

    const first = await source.listOverrides();
    currentTime += 2;
    expect(await source.listOverrides()).toEqual(first);
  });
});
