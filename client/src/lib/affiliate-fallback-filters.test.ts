import { describe, expect, it } from "vitest";
import { filterAffiliateFallbackRows, hasActiveAffiliateFallbackFilters } from "./affiliate-fallback-filters";

const rows = [
  { musicalId: "tarzan", partner: "stage", placement: "ticket-box", reason: "invalid-url", latestAt: "2026-10-01 10:20:00" },
  { musicalId: "dracula", partner: "awin", placement: "campaign-banner", reason: "invalid-affiliate-parameters", latestAt: "2026-10-02 11:30:00" },
  { musicalId: "koenig-der-loewen", partner: "stage", placement: "keyvisual", reason: "unsupported-destination", latestAt: "2026-10-03 09:10:00" },
];

const emptyFilters = { query: "", partner: "alle", from: "", to: "" };

describe("Affiliate-Fallback-Filter", () => {
  it("durchsucht Musical, Netzwerk, Platzierung und Fehlergrund ohne Groß-/Kleinschreibungsabhängigkeit", () => {
    expect(filterAffiliateFallbackRows(rows, { ...emptyFilters, query: "KÖNIG" }).map((row) => row.musicalId)).toEqual(["koenig-der-loewen"]);
    expect(filterAffiliateFallbackRows(rows, { ...emptyFilters, query: "Banner" }).map((row) => row.musicalId)).toEqual(["dracula"]);
    expect(filterAffiliateFallbackRows(rows, { ...emptyFilters, query: "PARAMETER" }).map((row) => row.musicalId)).toEqual(["dracula"]);
  });

  it("grenzt die bereits geladenen Gruppen nach Netzwerk und UTC-Datumsbereich ein", () => {
    expect(filterAffiliateFallbackRows(rows, { ...emptyFilters, partner: "stage" }).map((row) => row.musicalId)).toEqual(["tarzan", "koenig-der-loewen"]);
    expect(filterAffiliateFallbackRows(rows, { ...emptyFilters, from: "2026-10-02", to: "2026-10-02" }).map((row) => row.musicalId)).toEqual(["dracula"]);
    expect(filterAffiliateFallbackRows(rows, { ...emptyFilters, from: "2026-10-03" })).toEqual([rows[2]]);
  });

  it("erkennt aktive Filter für eine klare Zurücksetzen-Aktion", () => {
    expect(hasActiveAffiliateFallbackFilters(emptyFilters)).toBe(false);
    expect(hasActiveAffiliateFallbackFilters({ ...emptyFilters, partner: "awin" })).toBe(true);
  });
});
