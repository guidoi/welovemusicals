import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getActiveMusicals } from "../client/src/lib/data";
import { AOVO_CAMPAIGNS, resolveAovoCampaignClickUrl } from "../client/src/components/AovoCampaignBanner";
import { getSafeAffiliateTicketLink } from "../client/src/lib/affiliate-link-safety";
import { KDL_TRAVELCIRCUS_OFFER } from "../client/src/lib/travelcircus-offers";
import { TRAVELCIRCUS_LOGO } from "../client/src/lib/travelcircus-logo";

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

  if (parsed.hostname === "visit.stage-entertainment.de"
    || (parsed.hostname === "clk.tradedoubler.com" && parsed.searchParams.get("p") === "394206")) {
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
  ]) {
    const component = source(componentPath);
    requireSource(component, "if (!consent?.affiliateTracking) return;", componentPath);
  }

  for (const componentPath of [
    "client/src/components/AovoCampaignBanner.tsx",
    "client/src/components/AovoTanzDerVampireBanner.tsx",
    "client/src/components/AwinShowCampaignBanner.tsx",
    "client/src/components/EventimDraculaBanner.tsx",
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

  const suggestion = source("client/src/lib/affiliate-link-target-suggestion.ts");
  requireSource(suggestion, "getActiveMusicals", "Katalogvorschlag");
  requireSource(suggestion, "isSafeAffiliateTicketUrl", "Katalogvorschlag");
  requireSource(suggestion, "getAffiliateOverridePartner", "Katalogvorschlag");
  requireSource(suggestion, "return undefined", "Katalogvorschlag");

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

function assertTravelcircusOfferSafety() {
  const offer = KDL_TRAVELCIRCUS_OFFER;
  const parsed = new URL(offer.affiliateUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "www.awin1.com" || parsed.pathname !== "/cread.php"
    || parsed.searchParams.get("awinmid") !== "9151"
    || parsed.searchParams.get("awinaffid") !== AWIN_PUBLISHER_ID
    || parsed.searchParams.get("ued") !== offer.destinationUrl
    || [...parsed.searchParams.keys()].sort().join(",") !== "awinaffid,awinmid,ued") {
    fail("KDL-Reisebox muss den exakt freigegebenen Travelcircus-Deeplink verwenden.");
  }
  assertDirectTicketLink({ musicalId: offer.musicalId, placement: "travelcircus-offer", url: offer.affiliateUrl });
  const component = source("client/src/components/TravelcircusOfferBox.tsx");
  requireSource(component, "href={offer.affiliateUrl}", "Travelcircus-Reisebox");
  requireSource(component, 'rel="sponsored noopener"', "Travelcircus-Reisebox");
  if (/AffiliateImpressionPixel|useConsent|useSafeAffiliateTicketLink|<script|document\.write|noreferrer/.test(component)) {
    fail("Direkter Travelcircus-Angebotspfad darf keine Impressionen, Skripte, Ticketfallbacks oder Consent-Sperre hinzufügen.");
  }
  // Separat autorisiertes natives Anbieterlogo, nicht der direkte Angebots-CTA.
  const logo = TRAVELCIRCUS_LOGO;
  const logoParameters = "s=4803309&v=9151&q=319940&r=2865727";
  if (logo.clickUrl !== `https://www.awin1.com/cread.php?${logoParameters}`
    || logo.impressionUrl !== `https://www.awin1.com/cshow.php?${logoParameters}`
    || logo.width !== 1818 || logo.height !== 519
    || !logo.imageUrl.startsWith("https://files.manuscdn.com/") || !logo.imageUrl.endsWith(".jpg")) {
    fail("Travelcircus-Logo muss native Maße, Originalformat und exakt freigegebene Awin-Kennungen behalten.");
  }
  const logoComponent = source("client/src/components/TravelcircusProviderLogo.tsx");
  requireSource(logoComponent, "href={logo.clickUrl}", "Travelcircus-Logo");
  requireSource(logoComponent, "src={logo.imageUrl}", "Travelcircus-Logo");
  requireSource(logoComponent, "enabled={consent?.affiliateTracking === true}", "Travelcircus-Logo-Impression");
  requireSource(logoComponent, 'typeof window !== "undefined"', "Travelcircus-Logo-NoJS");
  if (/useSafeAffiliateTicketLink|<script|document\.write|noreferrer|src=\{logo\.impressionUrl\}/.test(logoComponent)) {
    fail("Natives Travelcircus-Logo darf keine Ticketfallbacks, Skripte oder ungesteuerte Impressionen hinzufügen.");
  }
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
for (const campaign of AOVO_CAMPAIGNS) {
  const url = resolveAovoCampaignClickUrl(campaign);
  if (getSafeAffiliateTicketLink(url).usedFallback) fail(`${campaign.musicalId} / Banner ${campaign.groupId} wird durch Fallback ersetzt.`);
  const parsed = new URL(url);
  if (parsed.searchParams.get("g") !== campaign.groupId) fail(`Banner ${campaign.groupId} hat eine abweichende Werbemittel-ID.`);
  const network = assertDirectTicketLink({ musicalId: campaign.musicalId, placement: `Banner ${campaign.groupId}`, url });
  if (campaign.trackingNetwork === "stage" && network !== "stage") fail(`Stage-Banner ${campaign.groupId} hat einen partnerfremden Click-Endpunkt.`);
}
assertConsentGuards();
assertTicketPathsRemainConsentIndependent();
assertAttributionSafety();
assertFallbackLoggingSafety();
assertTargetOverrideSafety();
assertTravelcircusOfferSafety();

console.log(
  `Affiliate-Integritätsgate bestanden: ${stageLinks} direkte Stage-Links, ${awinLinks} direkte Awin-Links und ${otherTicketLinks} weitere Partnerziele geprüft; Converter und Impressionen bleiben einwilligungsgesteuert.`,
);
