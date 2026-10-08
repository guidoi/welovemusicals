import { describe, expect, it, vi } from "vitest";
import { onRequestDelete, onRequestPut } from "./affiliate-link-target-overrides";

function database() {
  const run = vi.fn().mockResolvedValue({ success: true });
  const bind = vi.fn().mockReturnValue({ run, all: vi.fn().mockResolvedValue({ results: [] }) });
  return { prepare: vi.fn().mockReturnValue({ bind }) };
}

const endpoint = "https://welovemusicals.com/api/admin/affiliate-link-target-overrides";
const payload = { musicalId: "tarzan", partner: "stage", placement: "ticket-box", targetUrl: "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408" };

describe("geschützte Affiliate-Link-Zielroute", () => {
  it("speichert ausschließlich valide, partnergebundene Direct-Tracking-URLs", async () => {
    const response = await onRequestPut({ request: new Request(endpoint, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }), env: { AFFILIATE_FALLBACK_LOGS: database() } } as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ override: payload });
  });

  it("lehnt ein fremdes oder ungetracktes Ziel ab", async () => {
    const response = await onRequestPut({ request: new Request(endpoint, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, targetUrl: "https://www.eventim.de/artist/example" }) }), env: { AFFILIATE_FALLBACK_LOGS: database() } } as never);
    expect(response.status).toBe(400);
  });

  it("entfernt einen Override für die Rückkehr zur Katalog-URL", async () => {
    const response = await onRequestDelete({ request: new Request(endpoint, { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ musicalId: payload.musicalId, partner: payload.partner, placement: payload.placement }) }), env: { AFFILIATE_FALLBACK_LOGS: database() } } as never);
    expect(response.status).toBe(204);
  });
});
