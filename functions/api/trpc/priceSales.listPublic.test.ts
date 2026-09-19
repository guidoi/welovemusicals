import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequest, onRequestGet } from "./priceSales.listPublic";

const header = "musical_id,Preis ab,Sale aktiv,Sale-Text,Sale-Hinweis,Gültig ab,Gültig bis,Ticketlink";
const csv = [
  header,
  "fackjugoehte,40,49,Nein,,,,,",
  "wir-sind-am-leben,30,49,Ja,2 FÜR 1,,,30.09.2026,",
].join("\n");

function createContext(url = "https://welovemusicals.com/api/trpc/priceSales.listPublic") {
  return {
    env: {
      GOOGLE_SHEETS_PRICE_CSV_URL: "https://docs.google.com/spreadsheets/d/example/pub?output=csv",
    },
    request: new Request(url),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Cloudflare Pages priceSales.listPublic", () => {
  it("liefert die aktuelle Google-Sheets-Antwort im tRPC-Format", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(csv, { status: 200 })));
    vi.stubGlobal("caches", undefined);

    const response = await onRequestGet(createContext());
    const payload = await response.json() as Array<{ result: { data: { json: unknown[] } } }>;
    const rows = payload[0]?.result.data.json as Array<{ musicalId: string; priceFrom: string; saleEnabled: boolean; saleDiscount: string | null }>;

    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ musicalId: "fackjugoehte", priceFrom: "40,49", saleEnabled: false, saleDiscount: null }),
      expect.objectContaining({ musicalId: "wir-sind-am-leben", priceFrom: "30,49", saleEnabled: true, saleDiscount: "2 FÜR 1" }),
    ]));
  });

  it("verwendet den veröffentlichten Website-Export auch ohne Pages-Umgebungsvariable", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(csv, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("caches", undefined);

    const response = await onRequestGet({
      env: {},
      request: new Request("https://welovemusicals.com/api/trpc/priceSales.listPublic"),
    });
    const payload = await response.json() as Array<{ result: { data: { json: unknown[] } } }>;

    expect(payload[0]?.result.data.json).toEqual(expect.arrayContaining([
      expect.objectContaining({ musicalId: "wir-sind-am-leben", saleDiscount: "2 FÜR 1" }),
    ]));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("docs.google.com/spreadsheets/"),
      expect.any(Object),
    );
  });

  it("weist andere HTTP-Methoden zurück", async () => {
    const response = await onRequest({
      ...createContext(),
      request: new Request("https://welovemusicals.com/api/trpc/priceSales.listPublic", { method: "POST" }),
    });

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET");
  });
});
