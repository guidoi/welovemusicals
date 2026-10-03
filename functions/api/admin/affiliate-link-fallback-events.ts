import {
  getAffiliateFallbackReport,
  type AffiliateFallbackEnvironment,
} from "../../_affiliate-fallback-events";

type Context = {
  request: Request;
  env: AffiliateFallbackEnvironment;
};

function noStoreHeaders() {
  return {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    vary: "Cookie",
  };
}

function getRequestedDays(request: Request): number {
  const raw = new URL(request.url).searchParams.get("days");
  if (!raw || !/^\d{1,3}$/.test(raw)) return 30;
  return Number(raw);
}

/**
 * This endpoint must remain behind the Cloudflare Access applications documented
 * in docs/affiliate-link-admin-access.md. Access performs owner authentication
 * at the edge; this function intentionally returns aggregate, non-personal data only.
 */
export async function onRequestGet(context: Context): Promise<Response> {
  const report = await getAffiliateFallbackReport(context.env.AFFILIATE_FALLBACK_LOGS, getRequestedDays(context.request));
  if (!report) {
    return Response.json(
      { error: "Die Auswertung ist momentan nicht verfügbar." },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  return Response.json(report, { headers: noStoreHeaders() });
}

export async function onRequest(context: Context): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: { ...noStoreHeaders(), Allow: "GET" } });
  }

  return onRequestGet(context);
}
