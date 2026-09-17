import { describe, expect, it } from "vitest";
import { getGoogleSheetPriceSourceConfiguration } from "./googleSheetPriceSource";

describe("Google-Sheets-Quellkonfiguration", () => {
  it("akzeptiert ausschließlich eine veröffentlichte HTTPS-CSV-Quelle", () => {
    expect(getGoogleSheetPriceSourceConfiguration({
      GOOGLE_SHEETS_PRICE_CSV_URL: "https://docs.google.com/spreadsheets/d/e/export/pub?output=csv",
    })).toEqual({ configured: true });
    expect(getGoogleSheetPriceSourceConfiguration({
      GOOGLE_SHEETS_PRICE_CSV_URL: "http://docs.google.com/export.csv",
    })).toEqual({ configured: false });
    expect(getGoogleSheetPriceSourceConfiguration({})).toEqual({ configured: false });
  });
});
