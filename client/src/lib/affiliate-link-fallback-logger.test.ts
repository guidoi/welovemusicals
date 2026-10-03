import { afterEach, describe, expect, it, vi } from "vitest";
import {
  __resetAffiliateFallbackReportsForTest,
  getAffiliateFallbackLogPayload,
  reportAffiliateLinkFallback,
} from "./affiliate-link-fallback-logger";

const invalidLink = {
  url: "https://www.eventim.de/",
  usedFallback: true,
  reason: "invalid-affiliate-parameters" as const,
};

const entry = {
  link: invalidLink,
  musicalId: "koenig-der-loewen",
  placement: "ticket-box" as const,
  partner: "stage" as const,
};

afterEach(() => {
  __resetAffiliateFallbackReportsForTest();
  vi.unstubAllGlobals();
});

describe("Affiliate-Fallback-Logger", () => {
  it("erstellt ausschließlich den datensparsamen technischen Fehlerdatensatz", () => {
    expect(getAffiliateFallbackLogPayload(entry)).toEqual({
      reason: "invalid-affiliate-parameters",
      partner: "stage",
      placement: "ticket-box",
      musicalId: "koenig-der-loewen",
    });
    expect(getAffiliateFallbackLogPayload({ ...entry, link: { url: entry.link.url, usedFallback: false } })).toBeUndefined();
  });

  it("meldet nur in Produktion einmalig und ohne Browser-Credentials", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    vi.stubGlobal("window", { location: { hostname: "welovemusicals.com" } });
    vi.stubGlobal("fetch", fetchMock);

    expect(reportAffiliateLinkFallback(entry)).toBe(true);
    expect(reportAffiliateLinkFallback(entry)).toBe(false);
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith("/api/affiliate-link-fallback", expect.objectContaining({
      method: "POST",
      credentials: "omit",
      keepalive: true,
      body: JSON.stringify({
        reason: "invalid-affiliate-parameters",
        partner: "stage",
        placement: "ticket-box",
        musicalId: "koenig-der-loewen",
      }),
    }));
  });

  it("bleibt in lokalen und Manus-Vorschauen vollständig inaktiv", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("window", { location: { hostname: "3000-iznkrqg6bor2v4t2z2yq6-ebc61fa6.us1.manus.computer" } });
    vi.stubGlobal("fetch", fetchMock);

    expect(reportAffiliateLinkFallback(entry)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
