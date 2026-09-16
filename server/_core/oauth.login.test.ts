import { describe, expect, it } from "vitest";
import { createOAuthLoginUrl } from "./oauth";

describe("createOAuthLoginUrl", () => {
  it("erzeugt eine vollständige Manus-Anmeldeadresse mit Rückkehr zur Preisverwaltung", () => {
    const result = new URL(createOAuthLoginUrl("https://welovemusicals.com", "/verwaltung/preise"));

    expect(result.origin).toBe("https://manus.im");
    expect(result.pathname).toBe("/app-auth");
    expect(result.searchParams.get("appId")).toBeTruthy();
    expect(result.searchParams.get("redirectUri")).toBe("https://welovemusicals.com/api/oauth/callback?returnTo=%2Fverwaltung%2Fpreise");
    expect(Buffer.from(result.searchParams.get("state") ?? "", "base64").toString()).toBe(result.searchParams.get("redirectUri"));
  });
});
