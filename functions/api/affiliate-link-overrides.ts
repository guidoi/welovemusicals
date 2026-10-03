import { getAffiliateLinkTargetOverrides, type AffiliateLinkTargetOverrideEnvironment } from "../_affiliate-link-target-overrides";

type Context = {
  request: Request;
  env?: AffiliateLinkTargetOverrideEnvironment;
};

const headers = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

/**
 * Serves only currently approved destination overrides. This is a functional
 * configuration fetch, not a visitor log, click tracker, pixel or consent signal.
 */
export async function onRequestGet(context: Context): Promise<Response> {
  const overrides = await getAffiliateLinkTargetOverrides(context.env?.AFFILIATE_FALLBACK_LOGS);
  if (!overrides) return Response.json({ overrides: [] }, { headers });
  return Response.json({ overrides }, { headers });
}

export async function onRequest(context: Context): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: { ...headers, Allow: "GET" } });
  }
  return onRequestGet(context);
}
