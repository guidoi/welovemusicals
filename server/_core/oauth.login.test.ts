import { describe, expect, it } from "vitest";
import type { Request } from "express";
import { createOAuthLoginUrl, getPublicRequestOrigin } from "./oauth";

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

describe("getPublicRequestOrigin", () => {
  it("bevorzugt den weitergeleiteten öffentlichen Projekt-Host vor dem internen Server-Host", () => {
    const req = {
      protocol: "http",
      headers: {
        "x-forwarded-host": "welovemusicals.manus.space",
        "x-forwarded-proto": "https",
      },
      get: () => "dwby5qdu6q-xibcyom55a-ue.a.run.app",
    } as unknown as Request;

    expect(getPublicRequestOrigin(req)).toBe("https://welovemusicals.manus.space");
  });
});
