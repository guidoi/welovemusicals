import { describe, expect, it } from "vitest";
import { shouldLoadAffiliateTrackingForPath } from "./OptionalConsentServices";

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
});
