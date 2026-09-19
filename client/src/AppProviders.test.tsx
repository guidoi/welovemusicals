import React from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppProviders, trpcFetch } from "./AppProviders";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AppProviders", () => {
  it("rendert tRPC innerhalb des React-Query-Kontexts ohne Invalid-Hook-Call", () => {
    expect(() =>
      renderToString(
        <AppProviders>
          <main>Provider bereit</main>
        </AppProviders>,
      ),
    ).not.toThrow();
  });

  it("sendet die öffentliche Preisabfrage ohne Session-Cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    await trpcFetch("/api/trpc/priceSales.listPublic", { credentials: "include" });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/trpc/priceSales.listPublic",
      expect.objectContaining({ credentials: "omit", cache: "no-store" }),
    );
  });

  it("behält Sitzungs-Cookies für geschützte tRPC-Prozeduren", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    await trpcFetch("/api/trpc/auth.me");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/trpc/auth.me",
      expect.objectContaining({ credentials: "include" }),
    );
  });
});
