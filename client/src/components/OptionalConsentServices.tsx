import { useEffect } from "react";
import { useConsent } from "@/contexts/ConsentContext";

const AWIN_SCRIPT_ID = "awin-mastertag";
const TRADEDOUBLER_SCRIPT_ID = "tradedoubler-link-converter";
const GOOGLE_FONTS_ID = "welovemusicals-google-fonts";
const UMAMI_SCRIPT_ID = "welovemusicals-umami";

function loadAwinMasterTag() {
  if (document.getElementById(AWIN_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = AWIN_SCRIPT_ID;
  script.defer = true;
  script.src = "https://www.dwin2.com/pub.2865727.min.js";
  document.head.appendChild(script);
}

function startTradeDoublerConverter() {
  if (document.getElementById(TRADEDOUBLER_SCRIPT_ID)) return () => undefined;

  let observer: MutationObserver | undefined;

  const convertStageLinksWithFallback = () => {
    for (const link of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
      let destination: URL;
      try {
        destination = new URL(link.href);
      } catch {
        continue;
      }

      const isStageDestination =
        destination.hostname === "stage-entertainment.de" ||
        destination.hostname.endsWith(".stage-entertainment.de");
      if (!isStageDestination) continue;
      link.href = `https://visit.stage-entertainment.de/click?p=394206&a=3492604&ttid=18&url=${encodeURIComponent(destination.href)}`;
    }
  };

  const convertEligibleLinks = () => {
    const converter = (window as Window & { TDLinkConverter?: { init: (options: object) => void } }).TDLinkConverter;
    if (converter?.init) converter.init({});
    else convertStageLinksWithFallback();
  };

  const script = document.createElement("script");
  script.id = TRADEDOUBLER_SCRIPT_ID;
  script.src = `https://clk.tradedoubler.com/lc?a(3492604)rand(${Math.floor(Date.now() / 3_600_000)})`;
  script.onload = () => {
    convertEligibleLinks();
    observer = new MutationObserver(convertEligibleLinks);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };
  script.onerror = convertStageLinksWithFallback;
  document.head.appendChild(script);
  // Der Fallback konvertiert vorhandene Stage-Ziele sofort nach Zustimmung,
  // sodass ein schneller Ticketklick nicht auf das externe Skript warten muss.
  convertStageLinksWithFallback();

  return () => {
    observer?.disconnect();
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

  useEffect(() => {
    if (!consent?.analytics) return;
    loadUmami();
  }, [consent?.analytics]);

  useEffect(() => {
    if (!consent?.affiliateTracking) return;
    loadAwinMasterTag();
    return startTradeDoublerConverter();
  }, [consent?.affiliateTracking]);

  useEffect(() => {
    if (!consent?.externalMedia) return;
    loadGoogleFonts();
  }, [consent?.externalMedia]);

  return null;
}
