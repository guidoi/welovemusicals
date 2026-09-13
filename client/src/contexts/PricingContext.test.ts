import { describe, expect, it } from "vitest";
import { musicals } from "@/lib/data";
import { applyPriceSaleOverrides } from "./PricingContext";

describe("applyPriceSaleOverrides", () => {
  it("übernimmt einen gespeicherten Preis zentral in Fakten, FAQ und SEO-Text", () => {
    const result = applyPriceSaleOverrides(musicals, [
      {
        musicalId: "mj-musical",
        priceFrom: "39,99",
        saleEnabled: true,
        saleLabel: "SALE",
        saleDiscount: "2 FÜR 1",
        saleNote: "Nur für kurze Zeit",
        saleEndsAt: "2026-12-31",
      },
    ]);
    const mj = result.find((musical) => musical.id === "mj-musical");

    expect(mj?.priceFrom).toBe("39,99");
    expect(mj?.sale).toEqual({
      label: "SALE",
      discount: "2 FÜR 1",
      note: "Nur für kurze Zeit",
      validUntil: "2026-12-31",
    });
    expect(mj?.showFacts?.find((fact) => fact.label === "Tickets ab")?.value).toContain("39,99 €");
    expect(mj?.faqItems?.find((item) => item.question.includes("Wie viel"))?.answer).toContain("39,99 €");
    expect(mj?.seoDescription).toContain("39,99 €");
  });

  it("entfernt einen bestehenden Sale-Störer, wenn die Redaktion ihn deaktiviert", () => {
    const result = applyPriceSaleOverrides(musicals, [
      {
        musicalId: "eiskoenigin",
        priceFrom: "41,99",
        saleEnabled: false,
        saleLabel: null,
        saleDiscount: null,
        saleNote: null,
        saleEndsAt: null,
      },
    ]);
    const eiskoenigin = result.find((musical) => musical.id === "eiskoenigin");

    expect(eiskoenigin?.priceFrom).toBe("41,99");
    expect(eiskoenigin?.sale).toBeUndefined();
  });
});
