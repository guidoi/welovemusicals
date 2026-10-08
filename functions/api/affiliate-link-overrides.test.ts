import { describe, expect, it, vi } from "vitest";
import { onRequest, onRequestGet } from "./affiliate-link-overrides";

function database() {
  const all = vi.fn().mockResolvedValue({ results: [{ musicalId: "tarzan", partner: "stage", placement: "ticket-box", targetUrl: "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408", updatedAt: "2026-10-03 15:00:00" }] });
  return { prepare: vi.fn().mockReturnValue({ bind: vi.fn().mockReturnValue({ all }) }) };
}

describe("öffentliche Affiliate-Zieloverrides", () => {
  it("liefert ausschließlich aktuelle Zielkonfigurationen ohne Caching", async () => {
    const response = await onRequestGet({ request: new Request("https://welovemusicals.com/api/affiliate-link-overrides"), env: { AFFILIATE_FALLBACK_LOGS: database() } } as never);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual(expect.objectContaining({ overrides: [expect.objectContaining({ musicalId: "tarzan", targetUrl: expect.any(String) })] }));
  });

  it("lehnt andere Methoden ab", async () => {
    const response = await onRequest({ request: new Request("https://welovemusicals.com/api/affiliate-link-overrides", { method: "POST" }) } as never);
    expect(response.status).toBe(405);
  });
});
