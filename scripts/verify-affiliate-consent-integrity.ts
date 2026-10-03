import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getActiveMusicals } from "../client/src/lib/data";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const TRADEDOUBLER_WEBSITE_ID = "3492604";
const AWIN_PUBLISHER_ID = "2865727";
const TICKET_FIELDS = [
  "keyvisualLink",
  "ticketCtaUrl",
  "eventimUrl",
  "awinHeroUrl",
  "awinStickyUrl",
  "awinBoxUrl",
] as const;

type TicketLink = {
  musicalId: string;
  placement: string;
  url: string;
};

function source(relativePath: string) {
  return readFileSync(resolve(PROJECT_ROOT, relativePath), "utf8");
}

function fail(message: string): never {
  throw new Error(`[affiliate-integrity] ${message}`);
}

function requireSource(sourceCode: string, expected: string, label: string) {
  if (!sourceCode.includes(expected)) {
    fail(`${label} muss „${expected}“ enthalten.`);
  }
}

function getTicketLinks(): TicketLink[] {
  return getActiveMusicals().flatMap((musical) => [
    ...TICKET_FIELDS.flatMap((placement) => {
      const url = musical[placement];
      return url ? [{ musicalId: musical.id, placement, url }] : [];
    }),
    ...(musical.tourDates ?? []).flatMap((tourDate, index) =>
      tourDate.eventimUrl
        ? [{ musicalId: musical.id, placement: `tourDates[${index}] (${tourDate.city})`, url: tourDate.eventimUrl }]
        : [],
    ),
  ]);
}

function assertDirectTicketLink(link: TicketLink) {
  const parsed = new URL(link.url);
  const context = `${link.musicalId} / ${link.placement}`;

  if (parsed.hostname === "visit.stage-entertainment.de") {
    if (parsed.pathname !== "/click") fail(`${context} muss den direkten Stage-Click-Endpunkt verwenden.`);
    if (parsed.searchParams.get("p") !== "394206") fail(`${context} muss die Stage-Program-ID p=394206 enthalten.`);
    if (parsed.searchParams.get("a") !== TRADEDOUBLER_WEBSITE_ID) fail(`${context} muss a=${TRADEDOUBLER_WEBSITE_ID} enthalten.`);
    if (!parsed.searchParams.get("g")) fail(`${context} muss eine Stage-Kampagnenkennung g enthalten.`);
    if (parsed.searchParams.has("ttid") || parsed.searchParams.has("url")) {
      fail(`${context} darf als bereits getrackter Stage-Link nicht doppelt konvertiert sein.`);
    }
    return "stage";
  }

  if (parsed.hostname === "www.awin1.com") {
    if (!new Set(["/awclick.php", "/cread.php"]).has(parsed.pathname)) {
      fail(`${context} muss einen Awin-Click-Endpunkt statt eines Impressionendpunkts verwenden.`);
    }
    const publisherId = parsed.searchParams.get("awinaffid") ?? parsed.searchParams.get("r");
    if (publisherId !== AWIN_PUBLISHER_ID) fail(`${context} muss den Awin-Publisher ${AWIN_PUBLISHER_ID} enthalten.`);
    return "awin";
  }

  return "other";
}

function assertConsentGuards() {
  const optionalServices = source("client/src/components/OptionalConsentServices.tsx");
  requireSource(optionalServices, "if (!consent?.affiliateTracking", "TradeDoubler-Converter");
  requireSource(optionalServices, "shouldLoadAffiliateTrackingForPath", "TradeDoubler-Converter");
  requireSource(optionalServices, "clk.tradedoubler.com/lc", "TradeDoubler-Converter");
  requireSource(optionalServices, "tdlc-jssdk", "TradeDoubler-Converter");

  const sharedPixel = source("client/src/components/AffiliateImpressionPixel.tsx");
  requireSource(sharedPixel, "if (!enabled)", "Gemeinsamer Affiliate-Pixel");
  requireSource(sharedPixel, "src={shouldLoad ? url : undefined}", "Gemeinsamer Affiliate-Pixel");

  for (const componentPath of [
    "client/src/components/AovoCampaignBanner.tsx",
    "client/src/components/AwinShowCampaignBanner.tsx",
  ]) {
    const component = source(componentPath);
    requireSource(component, "enabled={consent?.affiliateTracking === true}", componentPath);
  }

  for (const componentPath of [
    "client/src/components/AovoTanzDerVampireBanner.tsx",
    "client/src/components/EventimDraculaBanner.tsx",
    "client/src/components/EventimFackJuGoehteBanner.tsx",
  ]) {
    const component = source(componentPath);
    requireSource(component, "if (!consent?.affiliateTracking) return;", componentPath);
  }

  for (const componentPath of [
    "client/src/components/AovoCampaignBanner.tsx",
    "client/src/components/AovoTanzDerVampireBanner.tsx",
    "client/src/components/AwinShowCampaignBanner.tsx",
    "client/src/components/EventimDraculaBanner.tsx",
    "client/src/components/EventimFackJuGoehteBanner.tsx",
  ]) {
    requireSource(source(componentPath), "useSafeAffiliateTicketLink", componentPath);
  }
}

function assertTicketPathsRemainConsentIndependent() {
  const ticketRenderers = [
    {
      path: "client/src/pages/MusicalDetail.tsx",
      requiredLinks: [
        "href={heroTicketLink}",
        "href={boxTicketLink}",
        "href={stickyTicketLink}",
        "useAffiliateLinkFallbackLogging",
      ],
    },
    {
      path: "client/src/components/MusicalKeyVisual.tsx",
      requiredLinks: ["href={ticketLink}"],
    },
    {
      path: "client/src/components/TourDates.tsx",
      requiredLinks: [
        "useSafeAffiliateTicketLink(date.eventimUrl",
        "href={safeTicketLink.url}",
        "useAffiliateLinkFallbackLogging",
      ],
    },
  ];

  for (const { path, requiredLinks } of ticketRenderers) {
    const component = source(path);
    if (component.includes("affiliateTracking")) {
      fail(`${path} darf den sichtbaren Ticketpfad nicht an die Affiliate-Einwilligung koppeln.`);
    }
    for (const requiredLink of requiredLinks) requireSource(component, requiredLink, path);
  }
}

function assertAttributionSafety() {
  for (const componentPath of [
    "client/src/components/AovoCampaignBanner.tsx",
    "client/src/components/AovoTanzDerVampireBanner.tsx",
    "client/src/components/AwinShowCampaignBanner.tsx",
    "client/src/components/EventimDraculaBanner.tsx",
    "client/src/components/EventimFackJuGoehteBanner.tsx",
    "client/src/components/MusicalKeyVisual.tsx",
    "client/src/components/TourDates.tsx",
  ]) {
    const component = source(componentPath);
    if (component.includes("noreferrer")) fail(`${componentPath} darf den Affiliate-Referrer nicht unterdrücken.`);
    if (/\bdocument\.write\s*\(/.test(component)) {
      fail(`${componentPath} darf kein fremdes document.write-Werbemittel ausführen.`);
    }
  }
}

function assertFallbackLoggingSafety() {
  const logger = source("client/src/lib/affiliate-link-fallback-logger.ts");
  requireSource(logger, 'fetch("/api/affiliate-link-fallback"', "Fallback-Logger");
  requireSource(logger, 'credentials: "omit"', "Fallback-Logger");
  requireSource(logger, "PRODUCTION_HOSTNAMES", "Fallback-Logger");

  const endpoint = source("functions/api/affiliate-link-fallback.ts");
  requireSource(endpoint, "const MAX_BODY_BYTES = 512", "Fallback-Protokollroute");
  requireSource(endpoint, "keys.join(\",\") === \"musicalId,partner,placement,reason\"", "Fallback-Protokollroute");
  requireSource(endpoint, 'console.warn("affiliate_link_fallback", payload)', "Fallback-Protokollroute");
  requireSource(endpoint, "recordAffiliateFallbackEvent", "Fallback-Protokollroute");

  const eventStore = source("functions/_affiliate-fallback-events.ts");
  requireSource(eventStore, "affiliate_link_fallback_events", "D1-Fallback-Ablage");
  requireSource(eventStore, "musical_id, partner, placement, reason", "D1-Fallback-Ablage");

  for (const componentPath of [
    "client/src/components/AovoCampaignBanner.tsx",
    "client/src/components/AovoTanzDerVampireBanner.tsx",
    "client/src/components/AwinShowCampaignBanner.tsx",
    "client/src/components/EventimDraculaBanner.tsx",
    "client/src/components/EventimFackJuGoehteBanner.tsx",
  ]) {
    requireSource(source(componentPath), "useAffiliateLinkFallbackLogging", componentPath);
  }
}

function assertTargetOverrideSafety() {
  const provider = source("client/src/contexts/AffiliateLinkOverridesContext.tsx");
  requireSource(provider, 'fetch("/api/affiliate-link-overrides"', "Zieloverride-Provider");
  requireSource(provider, 'credentials: "omit"', "Zieloverride-Provider");
  requireSource(provider, "PRODUCTION_HOSTNAMES", "Zieloverride-Provider");

  const resolver = source("client/src/lib/use-affiliate-link-target.ts");
  requireSource(resolver, "getSafeAffiliateTicketLink(override ?? candidate", "Zieloverride-Auflösung");
  requireSource(resolver, "useAffiliateLinkOverrides", "Zieloverride-Auflösung");

  const adminEndpoint = source("functions/api/admin/affiliate-link-target-overrides.ts");
  requireSource(adminEndpoint, "isValidAffiliateOverrideTarget", "Zieloverride-Verwaltung");
  requireSource(adminEndpoint, "onRequestPut", "Zieloverride-Verwaltung");
  requireSource(adminEndpoint, "onRequestDelete", "Zieloverride-Verwaltung");

  const validator = source("functions/_affiliate-target-validation.ts");
  requireSource(validator, '&& url.searchParams.get("a") === "3492604"', "Zieloverride-Validierung");
  requireSource(validator, 'const AWIN_PUBLISHER_ID = "2865727"', "Zieloverride-Validierung");
  requireSource(validator, "isDirectStageClick", "Zieloverride-Validierung");
  requireSource(validator, "isDirectTradeDoublerClick", "Zieloverride-Validierung");
}

const ticketLinks = getTicketLinks();
let stageLinks = 0;
let awinLinks = 0;
let otherTicketLinks = 0;

for (const ticketLink of ticketLinks) {
  const network = assertDirectTicketLink(ticketLink);
  if (network === "stage") stageLinks += 1;
  else if (network === "awin") awinLinks += 1;
  else otherTicketLinks += 1;
}

if (stageLinks === 0) fail("Es wurden keine direkten Stage-Ticketlinks geprüft.");
if (awinLinks === 0) fail("Es wurden keine direkten Awin-Ticketlinks geprüft.");
assertConsentGuards();
assertTicketPathsRemainConsentIndependent();
assertAttributionSafety();
assertFallbackLoggingSafety();
assertTargetOverrideSafety();

console.log(
  `Affiliate-Integritätsgate bestanden: ${stageLinks} direkte Stage-Links, ${awinLinks} direkte Awin-Links und ${otherTicketLinks} weitere Partnerziele geprüft; Converter und Impressionen bleiben einwilligungsgesteuert.`,
);
