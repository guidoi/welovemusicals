import { describe, expect, it } from "vitest";
import { isSaleActive } from "./sale";

describe("isSaleActive", () => {
  const now = new Date("2026-08-28T12:00:00");

  it("zeigt ein Angebot ohne Ablaufdatum an", () => {
    expect(isSaleActive({ label: "Familientage", discount: "Bis 15 % sparen" }, now)).toBe(true);
  });

  it("zeigt ein noch gültiges Angebot an", () => {
    expect(
      isSaleActive(
        { label: "Familientage", discount: "Bis 15 % sparen", validUntil: "2026-08-28" },
        now
      )
    ).toBe(true);
  });

  it("blendet ein abgelaufenes oder ungültig datiertes Angebot aus", () => {
    expect(
      isSaleActive(
        { label: "Familientage", discount: "Bis 15 % sparen", validUntil: "2026-08-27" },
        now
      )
    ).toBe(false);
    expect(
      isSaleActive(
        { label: "Familientage", discount: "Bis 15 % sparen", validUntil: "kein-datum" },
        now
      )
    ).toBe(false);
  });

  it("blendet ohne Angebotsdaten keinen Störer ein", () => {
    expect(isSaleActive(undefined, now)).toBe(false);
  });
});
