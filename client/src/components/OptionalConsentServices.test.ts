import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { shouldLoadClarityForHostname } from "./OptionalConsentServices";

const source = readFileSync(new URL("./OptionalConsentServices.tsx", import.meta.url), "utf8");

describe("Optionale Dienste", () => {
  it("lädt Umami nur nach Analytics-Einwilligung und Schriftarten nur nach separater Einwilligung", () => {
    expect(source).toContain("if (!consent?.analytics) return;");
    expect(source).toContain("loadUmami();");
    expect(source).toContain("shouldLoadClarityForHostname(window.location.hostname)");
    expect(source).toContain("https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}");
    expect(source).toContain('clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });');
    expect(source).toContain('window.clarity?.("consent", false);');
    expect(source).toContain("if (!consent?.externalMedia) return;");
    expect(source).toContain("loadGoogleFonts();");
  });

  it("verhindert Aufzeichnungen in lokalen und Manus-Vorschauen", () => {
    expect(source).toContain('const PRODUCTION_HOSTNAMES = new Set(["welovemusicals.com", "www.welovemusicals.com"]);');
    expect(source).toContain("return PRODUCTION_HOSTNAMES.has(hostname.toLocaleLowerCase(\"en-US\"));");
    expect(shouldLoadClarityForHostname("welovemusicals.com")).toBe(true);
    expect(shouldLoadClarityForHostname("www.welovemusicals.com")).toBe(true);
    expect(shouldLoadClarityForHostname("3000-iznkrqg6bor2v4t2z2yq6-ebc61fa6.us1.manus.computer")).toBe(false);
    expect(shouldLoadClarityForHostname("localhost")).toBe(false);
  });

  it("lädt nur den TradeDoubler-Link-Converter nach Affiliate-Einwilligung", () => {
    expect(source).not.toContain("dwin2.com");
    expect(source).toContain("clk.tradedoubler.com/lc");
    expect(source).toContain("TDLinkConverter");
    expect(source).toContain("tdlcAsyncInit");
    expect(source).toContain('"tdlc-jssdk"');
    expect(source).toContain("MutationObserver");
    expect(source).toContain("if (!consent?.affiliateTracking");
    expect(source).toContain("shouldLoadAffiliateTrackingForPath");
    expect(source).toContain("UNTRACKED_STAGE_DESTINATION_HOSTS");
    expect(source).toContain("visit.stage-entertainment.de/click");
  });
});
