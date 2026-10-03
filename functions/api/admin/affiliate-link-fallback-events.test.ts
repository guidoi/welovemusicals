import { describe, expect, it, vi } from "vitest";
import { onRequest, onRequestGet } from "./affiliate-link-fallback-events";

const endpoint = "https://welovemusicals.com/api/admin/affiliate-link-fallback-events?days=7";

function createDatabase(musicalId = "tarzan") {
  const all = vi.fn()
    .mockResolvedValueOnce({ results: [{ total: 2, last24Hours: 1, latestAt: "2026-10-03 12:00:00" }] })
    .mockResolvedValueOnce({ results: [{ musicalId, partner: "stage", placement: "ticket-box", reason: "invalid-url", eventCount: 2, latestAt: "2026-10-03 12:00:00" }] })
    .mockResolvedValueOnce({ results: [] });
  const bind = vi.fn().mockReturnValue({ all });
  return { prepare: vi.fn().mockReturnValue({ bind }) };
}

describe("Affiliate-Fallback-Auswertungsroute", () => {
  it("liefert ausschließlich aggregierte und nicht zwischengespeicherte Daten", async () => {
    const response = await onRequestGet({ request: new Request(endpoint), env: { AFFILIATE_FALLBACK_LOGS: createDatabase() } } as never);
    const payload = await response.json() as { periodDays: number; summary: { total: number }; rows: Array<{ musicalId: string }>; overrides: unknown[] };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(payload).toEqual(expect.objectContaining({
      periodDays: 7,
      summary: expect.objectContaining({ total: 2 }),
    }));
    expect(payload.rows).toEqual([{ musicalId: "tarzan", partner: "stage", placement: "ticket-box", reason: "invalid-url", eventCount: 2, latestAt: "2026-10-03 12:00:00" }]);
    expect(payload.overrides).toEqual([]);
  });

  it("lehnt andere Methoden ab und meldet eine fehlende Datenbank", async () => {
    const method = await onRequest({ request: new Request(endpoint, { method: "POST" }), env: {} });
    const unavailable = await onRequestGet({ request: new Request(endpoint), env: {} });

    expect(method.status).toBe(405);
    expect(unavailable.status).toBe(503);
  });

  it("liefert einen nicht zwischengespeicherten CSV-Export ohne Linkdaten", async () => {
    const response = await onRequestGet({
      request: new Request(`${endpoint}&format=csv`),
      env: { AFFILIATE_FALLBACK_LOGS: createDatabase() },
    } as never);
    const csv = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/csv; charset=utf-8");
    expect(response.headers.get("content-disposition")).toBe('attachment; filename="affiliate-link-fallbacks-7-tage.csv"');
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(csv).toContain("Auswertungszeitraum (Tage)");
    expect(csv).toContain('"tarzan";"stage";"ticket-box";"invalid-url";"2"');
    expect(csv).not.toContain("originalUrl");
  });

  it("neutralisiert Formelzeichen in CSV-Zellen", async () => {
    const response = await onRequestGet({
      request: new Request(`${endpoint}&format=csv`),
      env: { AFFILIATE_FALLBACK_LOGS: createDatabase("=HYPERLINK(\"https://example.test\")") },
    } as never);

    await expect(response.text()).resolves.toContain("\"'=HYPERLINK(\"\"https://example.test\"\")\"");
  });
});
