import { describe, expect, it } from "vitest";
import type { Musical, MusicalSale } from "./data";
import { BLACK_SALE_MUSICAL_IDS, formatBlackSaleEndDate, getBlackSaleCampaign } from "./black-sale";

const now = new Date("2026-11-22T12:00:00");
const sale: MusicalSale = {
  label: "BLACK SALE",
  discount: "BIS 40 %",
  validFrom: "2026-11-20",
  validUntil: "2026-11-30",
};
function musical(id = "und-julia", offer: MusicalSale | undefined = sale): Musical {
  return {
    id, slug: id, title: id, category: "ensuite", provider: "Stage",
    description: "", image: "original-artwork.webp", eventimUrl: "", tags: [], sale: offer,
  };
}

describe("BLACK SALE – November 2026", () => {
  it("berücksichtigt die neun freigegebenen Shows einschließlich WBT und nicht Tarzan", () => {
    const catalog = [...BLACK_SALE_MUSICAL_IDS, "tarzan", "anderes-musical"].map((id) => musical(id));
    expect(BLACK_SALE_MUSICAL_IDS).toHaveLength(9);
    expect(BLACK_SALE_MUSICAL_IDS).toContain("weihnachten-mit-bibi-tina");
    expect(getBlackSaleCampaign(catalog, now)?.musicalIds).toEqual(BLACK_SALE_MUSICAL_IDS);
    expect(getBlackSaleCampaign([musical("tarzan")], now)).toBeNull();
    expect(getBlackSaleCampaign([musical("fremde-id", sale), { ...musical("tarzan"), slug: "und-julia" }], now)).toBeNull();
  });

  it("liest den höchsten Prozentrabatt und das späteste Ende aus aktuellen Sale-Feldern", () => {
    expect(getBlackSaleCampaign([
      musical("und-julia", { ...sale, discount: "Bis zu 25 % sparen", validUntil: "2026-11-27" }),
      musical("mj-musical", { ...sale, discount: "BIS 40 %" }),
      musical("eiskoenigin", { ...sale, discount: "BIS 15 %" }),
    ], now)).toEqual({
      musicalIds: ["und-julia", "mj-musical", "eiskoenigin"], maxDiscountPercent: 40, endsOn: "2026-11-30",
    });
  });

  it("passt Rabatt und Enddatum nach einer Sheet-Änderung an statt 40 % oder 30.11. festzuschreiben", () => {
    expect(getBlackSaleCampaign([musical("mj-musical", { ...sale, discount: "Bis 32,5 %", validUntil: "2026-11-25" })], now))
      .toMatchObject({ maxDiscountPercent: 32.5, endsOn: "2026-11-25" });
  });

  it("berechnet keine Prozentbehauptung aus 2-für-1, Ticketpreisen oder Notizen", () => {
    expect(getBlackSaleCampaign([
      musical("salon-rosie", { ...sale, discount: "2 FÜR 1", note: "40 % in einer Notiz" }),
      musical("koenig-der-loewen", { ...sale, discount: "2. Ticket ab 25 €" }),
    ], now)?.maxDiscountPercent).toBeNull();
  });

  it("behauptet keinen Stuttgart-Rabatt durch die ausgeschlossene Tarzan-Aktion", () => {
    expect(getBlackSaleCampaign([
      musical("tarzan", { ...sale, discount: "BIS 40 %" }),
      { ...musical("eiskoenigin", { ...sale, discount: "BIS 15 %" }), city: "Stuttgart" },
    ], now)).toMatchObject({ musicalIds: ["eiskoenigin"], maxDiscountPercent: 15 });
  });

  it.each([
    "2026-10-31T23:59:59", "2026-12-01T00:00:00", "2027-11-22T12:00:00", "2025-11-22T12:00:00",
  ])("bleibt außerhalb November 2026 unsichtbar: %s", (date) => {
    expect(getBlackSaleCampaign([musical()], new Date(date))).toBeNull();
  });

  it("berücksichtigt Start und Ende der einzelnen Angebote einschließlich Endtag", () => {
    expect(getBlackSaleCampaign([musical()], new Date("2026-11-19T23:59:59"))).toBeNull();
    expect(getBlackSaleCampaign([musical()], new Date("2026-11-20T00:00:00"))).not.toBeNull();
    expect(getBlackSaleCampaign([musical()], new Date("2026-11-30T23:59:59"))).not.toBeNull();
    expect(getBlackSaleCampaign([musical("mj-musical", { ...sale, validUntil: "2026-11-21" })], now)).toBeNull();
  });

  it.each([
    { ...sale, validUntil: undefined },
    { ...sale, validFrom: "2026-12-01", validUntil: "2026-12-31" },
    { ...sale, validFrom: "2027-11-01", validUntil: "2027-11-30" },
    { ...sale, validUntil: "2026-12-05" },
    { ...sale, validUntil: "2026-11-31" },
    { ...sale, validUntil: "kein-datum" },
    { ...sale, validFrom: "2026-10-01" },
  ])("lässt Daueraktionen und spätere Kampagnen nicht als BLACK SALE gelten: %o", (offer) => {
    expect(getBlackSaleCampaign([musical("mj-musical", offer)], now)).toBeNull();
  });

  it("akzeptiert ein Sheet-Enddatum im November auch ohne optionalen Start", () => {
    expect(getBlackSaleCampaign([musical("ziz", { ...sale, validFrom: undefined })], now)?.musicalIds).toEqual(["ziz"]);
  });

  it("ignoriert abgelaufene oder noch nicht begonnene höhere Rabatte", () => {
    expect(getBlackSaleCampaign([
      musical("mj-musical", { ...sale, discount: "80 %", validUntil: "2026-11-21" }),
      musical("und-julia", { ...sale, discount: "70 %", validFrom: "2026-11-28" }),
      musical("eiskoenigin", { ...sale, discount: "15 %" }),
    ], now)?.maxDiscountPercent).toBe(15);
  });

  it("bleibt ohne passende Angebote oder bei ungültigem Prüfdatum unsichtbar", () => {
    expect(getBlackSaleCampaign([], now)).toBeNull();
    expect(getBlackSaleCampaign([{ ...musical(), sale: undefined }], now)).toBeNull();
    expect(getBlackSaleCampaign([musical()], new Date("invalid"))).toBeNull();
  });

  it("lässt die gelieferten Daten und Artworks unverändert und vermeidet doppelte IDs", () => {
    const item = Object.freeze({ ...musical(), sale: Object.freeze({ ...sale }) });
    expect(getBlackSaleCampaign([item, item], now)?.musicalIds).toEqual(["und-julia"]);
    expect(item.image).toBe("original-artwork.webp");
    expect(item.sale.discount).toBe("BIS 40 %");
  });

  it("formatiert das Sheet-Enddatum ohne Zeitzonenverschiebung", () => {
    expect(formatBlackSaleEndDate("2026-11-30")).toBe("30.11.2026");
  });
});
