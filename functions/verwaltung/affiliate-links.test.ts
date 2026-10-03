import { describe, expect, it } from "vitest";
import { onRequest } from "./affiliate-links";

describe("Affiliate-Link-Verwaltungsroute", () => {
  it("kennzeichnet die geschützte Ansicht als nicht indexierbar und privat", async () => {
    const response = await onRequest({
      next: async () => new Response("app", { status: 200, headers: { "content-type": "text/html" } }),
    });

    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow, noarchive");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
