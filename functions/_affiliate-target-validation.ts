export type AffiliateOverridePartner = "stage" | "tradedoubler" | "awin" | "atg" | "eventim" | "other";

const STAGE_HOST = "visit.stage-entertainment.de";
const AWIN_HOST = "www.awin1.com";
const TRADEDOUBLER_CLICK_HOST = "clk.tradedoubler.com";
const AWIN_PUBLISHER_ID = "2865727";
const ATG_MERCHANT_ID = "111888";
const EVENTIM_MERCHANT_ID = "11388";

function parseHttpsUrl(value: string): URL | undefined {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function decodeUrlParameter(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

function isDirectStageClick(url: URL): boolean {
  return url.hostname === STAGE_HOST
    && url.pathname === "/click"
    && url.searchParams.get("p") === "394206"
    && url.searchParams.get("a") === "3492604"
    && Boolean(url.searchParams.get("g"))
    && !url.searchParams.has("ttid")
    && !url.searchParams.has("url");
}

function isDirectTradeDoublerClick(url: URL): boolean {
  return url.hostname === TRADEDOUBLER_CLICK_HOST
    && url.pathname === "/click"
    && url.searchParams.get("p") === "377032"
    && url.searchParams.get("a") === "3492604"
    && Boolean(url.searchParams.get("g"));
}

function isAwinClick(url: URL): boolean {
  if (url.hostname !== AWIN_HOST || !new Set(["/awclick.php", "/cread.php"]).has(url.pathname)) return false;

  const wrapped = decodeUrlParameter(url.searchParams.get("ued"));
  const wrappedUrl = wrapped ? parseHttpsUrl(wrapped) : undefined;
  const legacyCreative = url.searchParams.get("r") === AWIN_PUBLISHER_ID
    && Boolean(url.searchParams.get("s"))
    && Boolean(url.searchParams.get("v"))
    && Boolean(url.searchParams.get("q"));
  const textLink = url.searchParams.get("awinaffid") === AWIN_PUBLISHER_ID
    && Boolean(url.searchParams.get("gid"))
    && Boolean(url.searchParams.get("mid"))
    && Boolean(url.searchParams.get("linkid"));

  return legacyCreative || textLink || Boolean(
    url.searchParams.get("awinaffid") === AWIN_PUBLISHER_ID
    && wrappedUrl
    && ["www.eventim.de", "www.atgtickets.de", "shop.atgtickets.de"].includes(wrappedUrl.hostname),
  );
}

function awinMerchant(url: URL): string | null {
  return url.searchParams.get("mid") ?? url.searchParams.get("v");
}

function isDirectAwinTicketUrl(url: URL, hostSuffix: string): boolean {
  return url.hostname.endsWith(hostSuffix) && url.searchParams.get("aw_affid") === AWIN_PUBLISHER_ID;
}

/**
 * Validates a manual target before it can replace a rendered affiliate link.
 * It accepts only direct, tracked URLs for the affected partner category.
 */
export function isValidAffiliateOverrideTarget(value: string, partner: AffiliateOverridePartner): boolean {
  if (value.length > 2048) return false;
  const url = parseHttpsUrl(value);
  if (!url) return false;

  if (partner === "stage") return isDirectStageClick(url);
  if (partner === "tradedoubler") return isDirectTradeDoublerClick(url);
  if (partner === "awin") return isAwinClick(url);
  if (partner === "eventim") return (isAwinClick(url) && awinMerchant(url) === EVENTIM_MERCHANT_ID)
    || isDirectAwinTicketUrl(url, "eventim.de");
  if (partner === "atg") return (isAwinClick(url) && awinMerchant(url) === ATG_MERCHANT_ID)
    || isDirectAwinTicketUrl(url, "atgtickets.de");

  return false;
}
