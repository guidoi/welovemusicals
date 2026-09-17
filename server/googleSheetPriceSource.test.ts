import { describe, expect, it } from "vitest";

/**
 * Google may reject automated serverless requests even though the same published
 * CSV downloads in a user browser. This smoke test is deliberately opt-in so a
 * third-party availability or permission change can never block website QA.
 * Run it manually with RUN_LIVE_GOOGLE_SHEET_SMOKE_TEST=true.
 */
const liveSheetSmokeTest = process.env.RUN_LIVE_GOOGLE_SHEET_SMOKE_TEST === "true" ? it : it.skip;

describe("Google-Sheets-Preisquelle", () => {
  liveSheetSmokeTest("liefert die freigegebenen Preis- und Sale-Spalten", async () => {
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
