import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { shouldLoadAffiliateTrackingForPath } from "./OptionalConsentServices";

const source = readFileSync(new URL("./OptionalConsentServices.tsx", import.meta.url), "utf8");

describe("Affiliate-Dienste auf Rechtsseiten", () => {
  it("unterbindet Affiliate-Skripte auf Impressum und Datenschutzerklärung", () => {
    expect(shouldLoadAffiliateTrackingForPath("/impressum")).toBe(false);
    expect(shouldLoadAffiliateTrackingForPath("/datenschutz")).toBe(false);
  });

  it("erlaubt Affiliate-Skripte auf redaktionellen und Ticketseiten", () => {
    expect(shouldLoadAffiliateTrackingForPath("/")).toBe(true);
    expect(shouldLoadAffiliateTrackingForPath("/musical/fack-ju-goehte")).toBe(true);
    expect(shouldLoadAffiliateTrackingForPath("/stadt/berlin")).toBe(true);
  });

  it("unterbindet externe Affiliate-Skripte in der Webdev-Vorschau", () => {
    expect(shouldLoadAffiliateTrackingForPath("/", "?from_webdev=1")).toBe(false);
    expect(shouldLoadAffiliateTrackingForPath("/", "?from_webdev=0")).toBe(true);
  });

  it("initialisiert den TradeDoubler-Converter nur einmal und fängt externe Fehler sicher ab", () => {
    expect(source).toContain("const initialiseConverterOnce");
    expect(source).toContain("try {");
    expect(source).toContain("converter.init({});");
    expect(source).toContain("catch {");
    expect(source).toContain("new MutationObserver(convertStageLinksWithFallback)");
    expect(source).not.toContain("new MutationObserver(convertEligibleLinks)");
  });

  it("misst die Verfügbarkeit optionaler Partner-Skripte nur über die consent-gebundene Analysehilfe", () => {
    expect(source).toContain('import { trackPartnerScriptStatus } from "@/lib/category-analytics"');
    expect(source).toContain('partner: "awin", status: "loaded", analyticsConsent');
    expect(source).toContain('partner: "awin", status: "failed", analyticsConsent');
    expect(source).toContain('partner: "tradedoubler", status: "loaded", analyticsConsent');
    expect(source).toContain('partner: "tradedoubler", status: "failed", analyticsConsent');
  });
});
