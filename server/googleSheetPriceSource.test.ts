import { describe, expect, it } from "vitest";

describe("Google-Sheets-Preisquelle", () => {
  it("liefert die freigegebenen Preis- und Sale-Spalten", async () => {
    const url = process.env.GOOGLE_SHEETS_PRICE_CSV_URL;

    expect(url).toMatch(/^https:\/\/docs\.google\.com\/spreadsheets\//);

    const csvUrl = new URL(url!);
    csvUrl.searchParams.set("single", "true");
    csvUrl.searchParams.set("output", "csv");

    const response = await fetch(csvUrl);
    expect(response.status, `Google-Sheets-Abruf lieferte HTTP ${response.status}`).toBe(200);

    const csv = await response.text();
    expect(csv).toContain("musical_id,Preis ab,Sale aktiv,Sale-Text,Sale-Hinweis,Gültig ab,Gültig bis,Ticketlink");
  }, 15_000);
});
