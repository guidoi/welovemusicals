import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AffiliateLinkFallbackAdmin.tsx", import.meta.url), "utf8");

describe("Affiliate-Link-Auswertung", () => {
  it("stellt eine geschützte, aggregierte und manuell aktualisierbare Sicht bereit", () => {
    expect(source).toContain("/api/admin/affiliate-link-fallback-events?days=${period}");
    expect(source).toContain("application/json");
    expect(source).toContain("Die Auswertung ist in dieser lokalen Vorschau nicht verfügbar.");
    expect(source).toContain("Zeitraum der technischen Ereignisse");
    expect(source).toContain("Aggregiert, maximal 100 Gruppen");
    expect(source).toContain("URLs und personenbezogene Daten werden nicht gespeichert");
    expect(source).not.toContain("originalUrl");
    expect(source).not.toContain("fallbackUrl");
  });
});
