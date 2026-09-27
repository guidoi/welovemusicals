import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./OptionalConsentServices.tsx", import.meta.url), "utf8");

describe("Optionale Dienste", () => {
  it("lädt Umami nur nach Analytics-Einwilligung und Schriftarten nur nach separater Einwilligung", () => {
    expect(source).toContain("if (!consent?.analytics) return;");
    expect(source).toContain("loadUmami();");
    expect(source).toContain("if (!consent?.externalMedia) return;");
    expect(source).toContain("loadGoogleFonts();");
  });

  it("lädt nur den TradeDoubler-Link-Converter nach Affiliate-Einwilligung", () => {
    expect(source).not.toContain("dwin2.com");
    expect(source).toContain("clk.tradedoubler.com/lc");
    expect(source).toContain("TDLinkConverter");
    expect(source).toContain("MutationObserver");
    expect(source).toContain("if (!consent?.affiliateTracking");
    expect(source).toContain("shouldLoadAffiliateTrackingForPath");
    expect(source).toContain("UNTRACKED_STAGE_DESTINATION_HOSTS");
    expect(source).toContain("visit.stage-entertainment.de/click");
  });
});
