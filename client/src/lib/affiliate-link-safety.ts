import { AWIN_PUBLISHER_ID } from "./data";

export type AffiliateFallbackReason = "invalid-url" | "unsupported-destination" | "invalid-affiliate-parameters";

export type SafeAffiliateLink = {
  url: string;
  usedFallback: boolean;
  reason?: AffiliateFallbackReason;
};

const STAGE_HOST = "visit.stage-entertainment.de";
const AWIN_HOST = "www.awin1.com";
const TRADEDOUBLER_CLICK_HOST = "clk.tradedoubler.com";
const SAFE_DIRECT_TICKET_HOSTS = new Set([
  "www.atgtickets.de",
  "shop.atgtickets.de",
  "www.eventim.de",
  "www.oeticket.com",
  "www.ticketcorner.ch",
  "www.deutsches-theater.de",
]);

const OFFICIAL_FALLBACKS = {
  stage: "https://www.stage-entertainment.de/",
  atg: "https://www.atgtickets.de/",
  eventim: "https://www.eventim.de/",
  oeticket: "https://www.oeticket.com/",
  ticketcorner: "https://www.ticketcorner.ch/",
  deutschesTheater: "https://www.deutsches-theater.de/",
} as const;

function tryParseUrl(value: string | undefined): URL | undefined {
  if (!value) return undefined;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function isDirectStageClick(parsed: URL): boolean {
  return parsed.hostname === STAGE_HOST
    && parsed.pathname === "/click"
    && parsed.searchParams.get("p") === "394206"
    && parsed.searchParams.get("a") === "3492604"
    && Boolean(parsed.searchParams.get("g"))
    && !parsed.searchParams.has("ttid")
    && !parsed.searchParams.has("url");
}

function isDirectAwinClick(parsed: URL): boolean {
  if (parsed.hostname !== AWIN_HOST || !new Set(["/awclick.php", "/cread.php"]).has(parsed.pathname)) {
    return false;
  }

  const legacyCreative = parsed.searchParams.get("r") === AWIN_PUBLISHER_ID
    && Boolean(parsed.searchParams.get("s"))
    && Boolean(parsed.searchParams.get("v"))
    && Boolean(parsed.searchParams.get("q"));
  const textLink = parsed.searchParams.get("awinaffid") === AWIN_PUBLISHER_ID
    && (Boolean(parsed.searchParams.get("ued")) || (
      Boolean(parsed.searchParams.get("gid"))
      && Boolean(parsed.searchParams.get("mid"))
      && Boolean(parsed.searchParams.get("linkid"))
    ));

  return legacyCreative || textLink;
}

function isDirectTradeDoublerClick(parsed: URL): boolean {
  return parsed.hostname === TRADEDOUBLER_CLICK_HOST
    && parsed.pathname === "/click"
    && parsed.searchParams.get("p") === "377032"
    && parsed.searchParams.get("a") === "3492604"
    && Boolean(parsed.searchParams.get("g"));
}

/**
 * Ensures that a visible ticket target is a known HTTPS partner destination.
 * It deliberately validates only the locally rendered URL and does not probe a
 * partner endpoint: automatic probes could create affiliate clicks, impression
 * traffic or third-party logs without a deliberate visitor action.
 */
export function isSafeAffiliateTicketUrl(value: string | undefined): boolean {
  const parsed = tryParseUrl(value);
  if (!parsed) return false;
  if (isDirectStageClick(parsed) || isDirectAwinClick(parsed) || isDirectTradeDoublerClick(parsed)) return true;
  return SAFE_DIRECT_TICKET_HOSTS.has(parsed.hostname);
}

function fallbackFor(value: string | undefined): string {
  const hostname = tryParseUrl(value)?.hostname;

  if (hostname === STAGE_HOST || hostname === "clk.tradedoubler.com" || hostname?.endsWith("stage-entertainment.de")) {
    return OFFICIAL_FALLBACKS.stage;
  }
  if (hostname?.endsWith("atgtickets.de")) return OFFICIAL_FALLBACKS.atg;
  if (hostname === AWIN_HOST) {
    const merchantId = tryParseUrl(value)?.searchParams.get("mid") ?? tryParseUrl(value)?.searchParams.get("v");
    return merchantId === "111888" ? OFFICIAL_FALLBACKS.atg : OFFICIAL_FALLBACKS.eventim;
  }
  if (hostname?.endsWith("oeticket.com")) return OFFICIAL_FALLBACKS.oeticket;
  if (hostname?.endsWith("ticketcorner.ch")) return OFFICIAL_FALLBACKS.ticketcorner;
  if (hostname?.endsWith("deutsches-theater.de")) return OFFICIAL_FALLBACKS.deutschesTheater;
  return OFFICIAL_FALLBACKS.eventim;
}

function fallbackReason(value: string | undefined): AffiliateFallbackReason {
  if (!tryParseUrl(value)) return "invalid-url";
  const parsed = tryParseUrl(value)!;
  if (parsed.hostname === STAGE_HOST || parsed.hostname === AWIN_HOST) return "invalid-affiliate-parameters";
  return "unsupported-destination";
}

/**
 * Returns the intended direct tracking link when it is locally valid. A broken
 * target is temporarily replaced with an official HTTPS provider entry point,
 * while an optional valid primary link can preserve the show-specific path.
 */
export function getSafeAffiliateTicketLink(
  candidate: string | undefined,
  primaryFallback?: string,
): SafeAffiliateLink {
  if (isSafeAffiliateTicketUrl(candidate)) {
    return { url: candidate!, usedFallback: false };
  }

  const resolvedFallback = isSafeAffiliateTicketUrl(primaryFallback)
    ? primaryFallback!
    : fallbackFor(candidate ?? primaryFallback);

  return {
    url: resolvedFallback,
    usedFallback: true,
    reason: fallbackReason(candidate),
  };
}
