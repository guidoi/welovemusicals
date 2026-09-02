import { describe, expect, it } from "vitest";
import {
  ALL_CONSENT,
  NECESSARY_ONLY_CONSENT,
  hasRevokedOptionalService,
  normalizeConsent,
} from "./consent";

describe("consent preferences", () => {
  it("accepts only complete boolean consent preferences", () => {
    expect(normalizeConsent(ALL_CONSENT)).toEqual(ALL_CONSENT);
    expect(normalizeConsent({ analytics: true })).toBeNull();
    expect(normalizeConsent(null)).toBeNull();
  });

  it("detects revocation of an already active optional service", () => {
    expect(hasRevokedOptionalService(ALL_CONSENT, NECESSARY_ONLY_CONSENT)).toBe(true);
    expect(hasRevokedOptionalService(NECESSARY_ONLY_CONSENT, ALL_CONSENT)).toBe(false);
  });
});
