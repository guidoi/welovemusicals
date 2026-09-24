import { useEffect } from "react";
import { useConsent } from "@/contexts/ConsentContext";

const GOOGLE_FONTS_ID = "welovemusicals-google-fonts";
const UMAMI_SCRIPT_ID = "welovemusicals-umami";

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

/**
 * Optional analytics and presentation services only. Affiliate attribution is
 * deliberately handled by the native, consent-gated creatives and direct
 * network click URLs in the campaign components. This avoids opaque third-party
 * JavaScript, including cross-origin "Script error." failures in previews.
 */
export default function OptionalConsentServices() {
  const { consent } = useConsent();

  useEffect(() => {
    if (!consent?.analytics) return;
    loadUmami();
  }, [consent?.analytics]);

  useEffect(() => {
    if (!consent?.externalMedia) return;
    loadGoogleFonts();
  }, [consent?.externalMedia]);

  return null;
}
