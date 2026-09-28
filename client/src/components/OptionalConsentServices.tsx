import { useEffect } from "react";
import { useLocation } from "wouter";
import { useConsent } from "@/contexts/ConsentContext";

// TradeDoubler's official Link Converter bootstrap uses this exact script id.
const TRADEDOUBLER_SCRIPT_ID = "tdlc-jssdk";
const GOOGLE_FONTS_ID = "welovemusicals-google-fonts";
const UMAMI_SCRIPT_ID = "welovemusicals-umami";
const AFFILIATE_EXCLUDED_PATHS = new Set(["/impressum", "/datenschutz"]);

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

export default function OptionalConsentServices() {
  const { consent } = useConsent();
  const [location] = useLocation();

  useEffect(() => {
    if (!consent?.analytics) return;
    loadUmami();
  }, [consent?.analytics]);

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
