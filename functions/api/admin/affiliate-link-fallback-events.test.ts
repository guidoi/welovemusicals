import { describe, expect, it, vi } from "vitest";
import { onRequest, onRequestGet } from "./affiliate-link-fallback-events";

const endpoint = "https://welovemusicals.com/api/admin/affiliate-link-fallback-events?days=7";

function createDatabase() {
  const all = vi.fn()
    .mockResolvedValueOnce({ results: [{ total: 2, last24Hours: 1, latestAt: "2026-10-03 12:00:00" }] })
    .mockResolvedValueOnce({ results: [{ musicalId: "tarzan", partner: "stage", placement: "ticket-box", reason: "invalid-url", eventCount: 2, latestAt: "2026-10-03 12:00:00" }] });
  const bind = vi.fn().mockReturnValue({ all });
  return { prepare: vi.fn().mockReturnValue({ bind }) };
}

describe("Affiliate-Fallback-Auswertungsroute", () => {
  it("liefert ausschließlich aggregierte und nicht zwischengespeicherte Daten", async () => {
    const response = await onRequestGet({ request: new Request(endpoint), env: { AFFILIATE_FALLBACK_LOGS: createDatabase() } } as never);
    const payload = await response.json() as { periodDays: number; summary: { total: number }; rows: Array<{ musicalId: string }> };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(payload).toEqual(expect.objectContaining({
      periodDays: 7,
      summary: expect.objectContaining({ total: 2 }),
    }));
    expect(payload.rows).toEqual([{ musicalId: "tarzan", partner: "stage", placement: "ticket-box", reason: "invalid-url", eventCount: 2, latestAt: "2026-10-03 12:00:00" }]);
  });

  it("lehnt andere Methoden ab und meldet eine fehlende Datenbank", async () => {
    const method = await onRequest({ request: new Request(endpoint, { method: "POST" }), env: {} });
    const unavailable = await onRequestGet({ request: new Request(endpoint), env: {} });

    expect(method.status).toBe(405);
    expect(unavailable.status).toBe(503);
  });
});
