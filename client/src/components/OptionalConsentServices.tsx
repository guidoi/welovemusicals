import { useEffect } from "react";
import { useLocation } from "wouter";
import { useConsent } from "@/contexts/ConsentContext";

// TradeDoubler's official Link Converter bootstrap uses this exact script id.
const TRADEDOUBLER_SCRIPT_ID = "tdlc-jssdk";
const GOOGLE_FONTS_ID = "welovemusicals-google-fonts";
const UMAMI_SCRIPT_ID = "welovemusicals-umami";
const CLARITY_SCRIPT_ID = "welovemusicals-microsoft-clarity";
const CLARITY_PROJECT_ID = "yrei35xhu5";
const GOOGLE_ANALYTICS_SCRIPT_ID = "welovemusicals-google-analytics";
const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-V5YZXQEB04";
const AFFILIATE_EXCLUDED_PATHS = new Set(["/impressum", "/datenschutz"]);
const PRODUCTION_HOSTNAMES = new Set(["welovemusicals.com", "www.welovemusicals.com"]);

type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] };
type GoogleTagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    clarity?: ClarityFunction;
    dataLayer?: unknown[][];
    gtag?: GoogleTagFunction;
  }
}

// Direct visit.stage-entertainment.de links are already TradeDoubler targets
// and must never be wrapped a second time by the converter.
const UNTRACKED_STAGE_DESTINATION_HOSTS = new Set([
  "stage-entertainment.de",
  "www.stage-entertainment.de",
]);

export function shouldLoadAffiliateTrackingForPath(pathname: string, search = "") {
  const isWebdevPreview = new URLSearchParams(search).get("from_webdev") === "1";
  return !AFFILIATE_EXCLUDED_PATHS.has(pathname) && !isWebdevPreview;
}

/**
 * Restores TradeDoubler's approved Link Converter for legacy Stage links.
 * It is loaded only after affiliate consent; direct network click URLs remain
 * the primary path and are deliberately excluded from any second conversion.
 */
function startTradeDoublerConverter() {
  if (document.getElementById(TRADEDOUBLER_SCRIPT_ID)) return () => undefined;

  let observer: MutationObserver | undefined;

  const convertUntrackedStageLinks = () => {
    for (const link of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
      let destination: URL;
      try {
        destination = new URL(link.href);
      } catch {
        continue;
      }

      if (!UNTRACKED_STAGE_DESTINATION_HOSTS.has(destination.hostname)) continue;

      link.href = `https://visit.stage-entertainment.de/click?p=394206&a=3492604&ttid=18&url=${encodeURIComponent(destination.href)}`;
    }
  };

  const tradeDoublerWindow = window as Window & {
    TDLinkConverter?: { init: (options: object) => void };
    tdlcAsyncInit?: () => void;
  };
  const previousAsyncInit = tradeDoublerWindow.tdlcAsyncInit;
  const initialiseConverter = () => {
    const converter = tradeDoublerWindow.TDLinkConverter;

    try {
      converter?.init({});
    } catch {
      // The local conversion below preserves affiliate attribution even if the
      // provider's opaque helper cannot initialize in a particular browser.
    }
  };

  // Matches the official snippet supplied by TradeDoubler for website 3492604:
  // the provider invokes this callback after its loader is available.
  tradeDoublerWindow.tdlcAsyncInit = initialiseConverter;

  const script = document.createElement("script");
  script.id = TRADEDOUBLER_SCRIPT_ID;
  script.src = `https://clk.tradedoubler.com/lc?a(3492604)rand(${Math.floor(Date.now() / 3_600_000)})`;
  script.onload = () => {
    convertUntrackedStageLinks();
  };
  script.onerror = convertUntrackedStageLinks;

  // Keep the local fallback active even if a browser blocks the provider helper.
  // React can add ticket links after consent has already been granted.
  observer = new MutationObserver(convertUntrackedStageLinks);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Do not leave initial raw Stage links untracked while the provider helper is
  // still loading.
  convertUntrackedStageLinks();
  document.head.appendChild(script);

  return () => {
    observer?.disconnect();
    if (tradeDoublerWindow.tdlcAsyncInit === initialiseConverter) {
      tradeDoublerWindow.tdlcAsyncInit = previousAsyncInit;
    }
  };
}

function loadGoogleFonts() {
  if (document.getElementById(GOOGLE_FONTS_ID)) return;
  const link = document.createElement("link");
  link.id = GOOGLE_FONTS_ID;
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap";
  document.head.appendChild(link);
}

function loadUmami() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  if (!endpoint || !websiteId || document.getElementById(UMAMI_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = UMAMI_SCRIPT_ID;
  script.defer = true;
  script.src = `${endpoint}/umami`;
  script.dataset.websiteId = websiteId;
  document.body.appendChild(script);
}

/** Never mix development-preview recordings into the production Clarity project. */
export function shouldLoadClarityForHostname(hostname: string) {
  return PRODUCTION_HOSTNAMES.has(hostname.toLocaleLowerCase("en-US"));
}

/** GA4 must never receive visits from local or Manus preview environments. */
export function shouldLoadGoogleAnalyticsForHostname(hostname: string) {
  return PRODUCTION_HOSTNAMES.has(hostname.toLocaleLowerCase("en-US"));
}

function getGoogleTag() {
  const gtag: GoogleTagFunction = window.gtag ?? ((...args: unknown[]) => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(args);
  });
  window.gtag = gtag;
  return gtag;
}

/**
 * GA4 is initialized only after the visitor accepts statistics. Advertising
 * storage remains denied; route changes are sent explicitly for this SPA.
 */
function startGoogleAnalytics() {
  if (document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID)) return () => undefined;

  const gtag = getGoogleTag();
  gtag("js", new Date());
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("config", GOOGLE_ANALYTICS_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  return () => {
    // The consent context immediately reloads after a revocation. This signal
    // stops any already initialized GA4 collection before that reload occurs.
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  };
}

function trackGoogleAnalyticsPageView() {
  const gtag = window.gtag;
  if (!gtag) return;

  gtag("event", "page_view", {
    send_to: GOOGLE_ANALYTICS_MEASUREMENT_ID,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
  });
}

/**
 * Clarity is a statistics service, not affiliate tracking. The official consentv2
 * signal is queued before its provider script loads; advertising storage remains
 * denied even after a visitor accepts analytics.
 */
function startClarity() {
  if (document.getElementById(CLARITY_SCRIPT_ID)) return () => undefined;

  const clarity: ClarityFunction = window.clarity ?? Object.assign(
    (...args: unknown[]) => {
      clarity.q = clarity.q ?? [];
      clarity.q.push(args);
    },
    {},
  );
  window.clarity = clarity;
  clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });

  const script = document.createElement("script");
  script.id = CLARITY_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  document.head.appendChild(script);

  return () => {
    // The consent context also triggers a reload after revocation. This immediate
    // command additionally clears Clarity cookies before that reload can occur.
    window.clarity?.("consent", false);
  };
}

export default function OptionalConsentServices() {
  const { consent } = useConsent();
  const [location] = useLocation();

  useEffect(() => {
    if (!consent?.analytics) return;
    loadUmami();
  }, [consent?.analytics]);

  useEffect(() => {
    if (!consent?.analytics || !shouldLoadClarityForHostname(window.location.hostname)) return;
    return startClarity();
  }, [consent?.analytics]);

  useEffect(() => {
    if (!consent?.analytics || !shouldLoadGoogleAnalyticsForHostname(window.location.hostname)) return;
    return startGoogleAnalytics();
  }, [consent?.analytics]);

  useEffect(() => {
    if (!consent?.analytics || !shouldLoadGoogleAnalyticsForHostname(window.location.hostname)) return;
    trackGoogleAnalyticsPageView();
  }, [consent?.analytics, location]);

  useEffect(() => {
    if (!consent?.affiliateTracking || !shouldLoadAffiliateTrackingForPath(location, window.location.search)) return;
    return startTradeDoublerConverter();
  }, [consent?.affiliateTracking, location]);

  useEffect(() => {
    if (!consent?.externalMedia) return;
    loadGoogleFonts();
  }, [consent?.externalMedia]);

  return null;
}
