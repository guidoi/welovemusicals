import { describe, expect, it } from "vitest";
import { resolvePublicPriceSaleOverrides } from "./priceSales";

const sheetValue = {
  musicalId: "eiskoenigin",
  priceFrom: "39,99",
  ticketLink: "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149418",
  saleEnabled: true,
  saleLabel: "SALE",
  saleDiscount: "BIS 40 %",
  saleNote: "Ausgewählte Vorstellungen",
  saleStartsAt: "2026-09-14",
  saleEndsAt: "2026-09-21",
};

const databaseValue = {
  musicalId: "eiskoenigin",
  priceFrom: "44,99",
  saleEnabled: false,
  saleLabel: null,
  saleDiscount: null,
  saleNote: null,
  saleEndsAt: new Date("2026-09-01T00:00:00.000Z"),
  updatedByOpenId: "owner",
  createdAt: new Date("2026-09-01T00:00:00.000Z"),
  updatedAt: new Date("2026-09-01T00:00:00.000Z"),
};

describe("öffentliche Preis- und Sale-Quelle", () => {
  it("priorisiert den freigegebenen Website-Export vor einem früheren Datenbankwert", () => {
    expect(resolvePublicPriceSaleOverrides([sheetValue], [databaseValue])).toEqual([sheetValue]);
  });

  it("behält einen vorhandenen Datenbankwert als Notfall-Fallback, wenn der Export keine Zeile liefert", () => {
    expect(resolvePublicPriceSaleOverrides([], [databaseValue])).toEqual([
      {
        musicalId: "eiskoenigin",
        priceFrom: "44,99",
        ticketLink: null,
        saleEnabled: false,
        saleLabel: null,
        saleDiscount: null,
        saleNote: null,
        saleStartsAt: null,
        saleEndsAt: new Date("2026-09-01T00:00:00.000Z"),
      },
    ]);
  });

  it("erweitert einen Teil-Export um einen sicheren Fallback für eine andere Show", () => {
    const tarzanDatabaseValue = { ...databaseValue, musicalId: "tarzan", priceFrom: "66,99" };
    expect(resolvePublicPriceSaleOverrides([sheetValue], [tarzanDatabaseValue])).toMatchObject([
      { musicalId: "eiskoenigin", priceFrom: "39,99" },
      { musicalId: "tarzan", priceFrom: "66,99" },
    ]);
  });
});
