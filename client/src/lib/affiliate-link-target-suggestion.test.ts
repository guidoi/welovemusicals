import { describe, expect, it } from "vitest";
import { getAffiliateTargetSuggestion } from "./affiliate-link-target-suggestion";
import { musicals } from "./data";

describe("Affiliate-Zielvorschlag aus dem Katalog", () => {
  it("liefert keinen aktiven Vorschlag für Tarzan, erhält aber dessen validen Stage-Katalogpfad im Archiv", () => {
    const suggestion = getAffiliateTargetSuggestion("tarzan", "stage", "ticket-box");
    expect(suggestion).toBeUndefined();
    const tarzan = musicals.find((musical) => musical.id === "tarzan");
    expect(tarzan?.awinBoxUrl).toBe("https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408");
  });

  it("liefert für eine Eventim-CTA einen direkten Awin-Katalogpfad", () => {
    const suggestion = getAffiliateTargetSuggestion("dracula", "eventim", "ticket-box");
    expect(suggestion?.url).toContain("www.awin1.com");
    expect(suggestion?.url).toContain("2865727");
  });

  it("erfindet keine stadt- oder kreativspezifischen Kampagnenziele", () => {
    expect(getAffiliateTargetSuggestion("tarzan", "stage", "city-date")).toBeUndefined();
    expect(getAffiliateTargetSuggestion("tarzan", "stage", "campaign-banner")).toBeUndefined();
  });
});
