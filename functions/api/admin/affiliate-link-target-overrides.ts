import {
  deleteAffiliateLinkTargetOverride,
  getAffiliateLinkTargetOverrides,
  saveAffiliateLinkTargetOverride,
  type AffiliateLinkTargetOverrideEnvironment,
  type AffiliateLinkTargetOverrideInput,
} from "../../_affiliate-link-target-overrides";
import { isValidAffiliateOverrideTarget, type AffiliateOverridePartner } from "../../_affiliate-target-validation";

type Context = {
  request: Request;
  env: AffiliateLinkTargetOverrideEnvironment;
};

const PARTNERS = new Set<AffiliateOverridePartner>(["stage", "tradedoubler", "awin", "atg", "eventim", "other"]);
const PLACEMENTS = new Set(["ticket-base", "keyvisual", "mobile-hero", "sticky", "ticket-box", "city-date", "campaign-banner"]);
const MAX_BODY_BYTES = 4096;

function headers() {
  return {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    vary: "Cookie",
  };
}

function isKey(value: unknown): value is Omit<AffiliateLinkTargetOverrideInput, "targetUrl"> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const input = value as Record<string, unknown>;
  return typeof input.musicalId === "string"
    && /^[a-z0-9-]{1,80}$/.test(input.musicalId)
    && typeof input.partner === "string"
    && PARTNERS.has(input.partner as AffiliateOverridePartner)
    && typeof input.placement === "string"
    && PLACEMENTS.has(input.placement);
}

function isSaveInput(value: unknown): value is AffiliateLinkTargetOverrideInput {
  if (!isKey(value)) return false;
  const input = value as Record<string, unknown>;
  return typeof input.targetUrl === "string"
    && input.targetUrl.length <= 2048
    && isValidAffiliateOverrideTarget(input.targetUrl, input.partner as AffiliateOverridePartner);
}

async function parseBody(request: Request): Promise<unknown | undefined> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return undefined;
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return undefined;
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

/** Access-protected owner mutation for one exact fallback group. */
export async function onRequestPut(context: Context): Promise<Response> {
  const input = await parseBody(context.request);
  if (!isSaveInput(input)) {
    return Response.json({ error: "Die Ziel-URL passt nicht zum ausgewählten Partner oder enthält keine gültigen Affiliate-Parameter." }, { status: 400, headers: headers() });
  }

  const saved = await saveAffiliateLinkTargetOverride(context.env.AFFILIATE_FALLBACK_LOGS, input);
  if (!saved) return Response.json({ error: "Die Zielverwaltung ist momentan nicht verfügbar." }, { status: 503, headers: headers() });
  return Response.json({ override: input }, { headers: headers() });
}

/** Removing an override restores the catalog URL immediately for subsequent page loads. */
export async function onRequestDelete(context: Context): Promise<Response> {
  const input = await parseBody(context.request);
  if (!isKey(input)) return Response.json({ error: "Ungültige Zielzuordnung." }, { status: 400, headers: headers() });

  const removed = await deleteAffiliateLinkTargetOverride(context.env.AFFILIATE_FALLBACK_LOGS, input);
  if (!removed) return Response.json({ error: "Die Zielverwaltung ist momentan nicht verfügbar." }, { status: 503, headers: headers() });
  return new Response(null, { status: 204, headers: headers() });
}

export async function onRequest(context: Context): Promise<Response> {
  if (context.request.method === "PUT") return onRequestPut(context);
  if (context.request.method === "DELETE") return onRequestDelete(context);
  return new Response("Method Not Allowed", { status: 405, headers: { ...headers(), Allow: "PUT, DELETE" } });
}

export { getAffiliateLinkTargetOverrides };
