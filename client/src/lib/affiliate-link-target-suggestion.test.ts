import { describe, expect, it } from "vitest";
import { getAffiliateTargetSuggestion } from "./affiliate-link-target-suggestion";

describe("Affiliate-Zielvorschlag aus dem Katalog", () => {
  it("liefert nur einen bereits validen Stage-Katalogpfad für die passende Show", () => {
    const suggestion = getAffiliateTargetSuggestion("tarzan", "stage", "ticket-box");
    expect(suggestion).toEqual(expect.objectContaining({
      sourceField: expect.any(String),
      url: "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149406",
    }));
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
