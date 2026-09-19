import { parseGoogleSheetPriceCsv } from "../../../server/googleSheetPriceSource";

type PriceFunctionContext = {
  env: {
    GOOGLE_SHEETS_PRICE_CSV_URL?: string;
  };
  request: Request;
  waitUntil?: (promise: Promise<unknown>) => void;
};

type CacheWithDefault = {
  default?: {
    match: (request: Request) => Promise<Response | undefined>;
    put: (request: Request, response: Response) => Promise<void>;
  };
};

const CACHE_SECONDS = 600;
// This is the intentionally public Website-Export, never the private editing sheet.
// Pages Functions use it when the deployment does not inject an environment binding.
const PUBLISHED_WEBSITE_EXPORT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRC2Ymp15Lrw6yzWFVFvhYR0cRa3rTYfGcAJ4PnYth3TFZ3E4A6ajuecKXvr_T7Nmn7WIiQFzlXmH8s/pub?gid=1001113831&single=true&output=csv";
const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": `public, max-age=0, s-maxage=${CACHE_SECONDS}, must-revalidate`,
  "X-Content-Type-Options": "nosniff",
};

function trpcSuccess(data: unknown): Response {
  return new Response(JSON.stringify([{ result: { data: { json: data } } }]), {
    status: 200,
    headers: JSON_HEADERS,
  });
}

function getCache(): CacheWithDefault["default"] | undefined {
  const runtimeCaches = (globalThis as typeof globalThis & { caches?: CacheWithDefault }).caches;
  return runtimeCaches?.default;
}

/**
 * Cloudflare Pages counterpart to the Express `priceSales.listPublic` query.
 * It fetches only the published Website-Export and returns the tRPC JSON shape
 * expected by the existing client, never exposing the upstream URL to visitors.
 */
export async function onRequestGet(context: PriceFunctionContext): Promise<Response> {
  const cache = getCache();
  // This key must never overlap a Pages route: earlier static deployments answered
  // unknown routes with index.html, which would otherwise be returned as a cache hit.
  const cacheKey = new Request(new URL("/_edge-cache/price-sales-v2-20260919", context.request.url));
  const cached = cache ? await cache.match(cacheKey) : undefined;
  if (cached) return cached;

  const csvUrl = context.env.GOOGLE_SHEETS_PRICE_CSV_URL ?? PUBLISHED_WEBSITE_EXPORT_URL;

  try {
    const response = await fetch(csvUrl, {
      headers: {
        Accept: "text/csv",
        "User-Agent": "WeLoveMusicalsPriceSync/1.0",
      },
    });
    if (!response.ok) return trpcSuccess([]);

    const records = parseGoogleSheetPriceCsv(await response.text());
    const output = trpcSuccess(records);

    if (cache) {
      const cacheWrite = cache.put(cacheKey, output.clone());
      if (context.waitUntil) context.waitUntil(cacheWrite);
      else await cacheWrite;
    }

    return output;
  } catch {
    return trpcSuccess([]);
  }
}

export async function onRequest(context: PriceFunctionContext): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET" } });
  }
  return onRequestGet(context);
}
