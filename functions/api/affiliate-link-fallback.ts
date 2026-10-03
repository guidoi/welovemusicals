type AffiliateFallbackReason = "invalid-url" | "unsupported-destination" | "invalid-affiliate-parameters";
type AffiliateFallbackPartner = "stage" | "tradedoubler" | "awin" | "atg" | "eventim" | "other";
type AffiliateFallbackPlacement = "ticket-base" | "keyvisual" | "mobile-hero" | "sticky" | "ticket-box" | "city-date" | "campaign-banner";

type AffiliateFallbackPayload = {
  reason: AffiliateFallbackReason;
  partner: AffiliateFallbackPartner;
  placement: AffiliateFallbackPlacement;
  musicalId: string;
};

const REASONS = new Set<AffiliateFallbackReason>([
  "invalid-url",
  "unsupported-destination",
  "invalid-affiliate-parameters",
]);
const PARTNERS = new Set<AffiliateFallbackPartner>(["stage", "tradedoubler", "awin", "atg", "eventim", "other"]);
const PLACEMENTS = new Set<AffiliateFallbackPlacement>([
  "ticket-base",
  "keyvisual",
  "mobile-hero",
  "sticky",
  "ticket-box",
  "city-date",
  "campaign-banner",
]);
const MAX_BODY_BYTES = 512;

function noStoreHeaders() {
  return {
    "cache-control": "no-store",
    "content-type": "text/plain; charset=utf-8",
  };
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function isPayload(value: unknown): value is AffiliateFallbackPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  const keys = Object.keys(payload).sort();

  return keys.join(",") === "musicalId,partner,placement,reason"
    && typeof payload.musicalId === "string"
    && /^[a-z0-9-]{1,80}$/.test(payload.musicalId)
    && typeof payload.reason === "string"
    && REASONS.has(payload.reason as AffiliateFallbackReason)
    && typeof payload.partner === "string"
    && PARTNERS.has(payload.partner as AffiliateFallbackPartner)
    && typeof payload.placement === "string"
    && PLACEMENTS.has(payload.placement as AffiliateFallbackPlacement);
}

/**
 * Datensparsames First-Party-Protokoll für tatsächlich verwendete sichere
 * Affiliate-Fallbacks. Es akzeptiert bewusst keine URL, Query-Parameter,
 * Consent-Information, Besucher- oder Gerätekennung.
 */
export async function onRequestPost(context: { request: Request }): Promise<Response> {
  const { request } = context;
  if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403, headers: noStoreHeaders() });
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return new Response("Unsupported Media Type", { status: 415, headers: noStoreHeaders() });
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return new Response("Payload Too Large", { status: 413, headers: noStoreHeaders() });

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Bad Request", { status: 400, headers: noStoreHeaders() });
  }

  if (!isPayload(payload)) return new Response("Bad Request", { status: 400, headers: noStoreHeaders() });

  // Cloudflare Pages Observability records this structured technical warning.
  // The timestamp is supplied by the platform; no client, URL or tracking data is logged.
  console.warn("affiliate_link_fallback", payload);
  return new Response(null, { status: 204, headers: noStoreHeaders() });
}

export async function onRequest(context: { request: Request }): Promise<Response> {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { ...noStoreHeaders(), Allow: "POST" } });
  }
  return onRequestPost(context);
}
