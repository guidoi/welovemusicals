import { describe, expect, it, vi } from "vitest";
import { onRequest, onRequestPost } from "./affiliate-link-fallback";

const endpoint = "https://welovemusicals.com/api/affiliate-link-fallback";
const validPayload = {
  reason: "invalid-affiliate-parameters",
  partner: "stage",
  placement: "ticket-box",
  musicalId: "koenig-der-loewen",
};

function createDatabase() {
  const run = vi.fn().mockResolvedValue({ success: true });
  const bind = vi.fn().mockReturnValue({ run });
  return { database: { prepare: vi.fn().mockReturnValue({ bind }) }, run };
}

describe("Affiliate-Fallback-Protokollroute", () => {
  it("protokolliert ausschließlich den erlaubten Minimaldatensatz", async () => {
    const db = createDatabase();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const response = await onRequestPost({
      request: new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://welovemusicals.com" },
        body: JSON.stringify(validPayload),
      }),
      env: { AFFILIATE_FALLBACK_LOGS: db.database },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(warn).toHaveBeenCalledWith("affiliate_link_fallback", validPayload);
    expect(db.run).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("weist URLs, zusätzliche Felder, fremde Origins und andere Methoden zurück", async () => {
    const invalidPayload = { ...validPayload, originalUrl: "https://visit.stage-entertainment.de/click?p=394206" };
    const extraField = await onRequestPost({
      request: new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://welovemusicals.com" },
        body: JSON.stringify(invalidPayload),
      }),
    });
    const foreignOrigin = await onRequestPost({
      request: new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://example.test" },
        body: JSON.stringify(validPayload),
      }),
    });
    const missingOrigin = await onRequestPost({
      request: new Request(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validPayload),
      }),
    });
    const get = await onRequest({ request: new Request(endpoint) });

    expect(extraField.status).toBe(400);
    expect(foreignOrigin.status).toBe(403);
    expect(missingOrigin.status).toBe(403);
    expect(get.status).toBe(405);
    expect(get.headers.get("Allow")).toBe("POST");
  });
});
