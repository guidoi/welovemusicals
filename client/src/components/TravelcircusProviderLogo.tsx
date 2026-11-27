import React from "react";
import AffiliateImpressionPixel from "@/components/AffiliateImpressionPixel";
import { useConsent } from "@/contexts/ConsentContext";
import { TRAVELCIRCUS_LOGO as logo } from "@/lib/travelcircus-logo";

function TravelcircusLogoImpression() {
  const { consent } = useConsent();
  return <AffiliateImpressionPixel url={logo.impressionUrl} enabled={consent?.affiliateTracking === true} />;
}

/** Native Logo-Darstellung bleibt sichtbar; optionales Impressiontracking nie vor Consent.
 * Im NoJS-Prerender wird nur das statische Logo mit direktem Nutzer-Link ausgegeben.
 */
export default function TravelcircusProviderLogo() {
  return (
    <div className="relative mb-4 flex flex-wrap items-center gap-x-4 gap-y-2" data-testid="travelcircus-provider-logo" data-campaign-id={logo.creativeId}>
      <span className="text-xs text-white/65">Dein Reiseanbieter</span>
      <a
        href={logo.clickUrl}
        target="_blank"
        rel="sponsored noopener"
        className="inline-flex rounded-sm bg-white px-3 py-2 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none"
        aria-label="Travelcircus ansehen (Anzeige, öffnet in neuem Tab)"
      >
        <img
          src={logo.imageUrl}
          alt="Travelcircus"
          width={logo.width}
          height={logo.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-[150px] max-w-full object-contain"
        />
      </a>
      {typeof window !== "undefined" && <TravelcircusLogoImpression />}
    </div>
  );
}
