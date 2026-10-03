import { useEffect, useMemo } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import { getSafeAffiliateTicketLink } from "@/lib/affiliate-link-safety";
import { useAffiliateLinkFallbackLogging } from "@/lib/affiliate-link-fallback-logger";

export const AOVO_TDV_CLICK_URL = "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26137318";
export const AOVO_TDV_BANNER_URL = "/images/show-visuals/tanz-der-vampire-500x500.png";

export function getAovoTdVImpressionUrl(cacheBuster: string) {
  return `https://imp.tradedoubler.com/imp?type(img)g(26137318)a(3492604)${cacheBuster}`;
}

export default function AovoTanzDerVampireBanner() {
  const { consent } = useConsent();
  const impressionUrl = useMemo(
    () => getAovoTdVImpressionUrl(String(Math.random()).slice(2, 11)),
    []
  );
  const safeClickLink = useMemo(() => getSafeAffiliateTicketLink(AOVO_TDV_CLICK_URL), []);
  useAffiliateLinkFallbackLogging([{
    link: safeClickLink,
    musicalId: "tanz-der-vampire",
    placement: "campaign-banner",
    partner: "tradedoubler",
  }]);

  useEffect(() => {
    if (!consent?.affiliateTracking) return;
    const impressionPixel = new Image();
    impressionPixel.src = impressionUrl;
  }, [consent?.affiliateTracking, impressionUrl]);

  return (
    <aside className="mt-8 pt-6" aria-label="Anzeige: Ticket und Hotel – Tanz der Vampire">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Anzeige</p>
      <button
        type="button"
        onClick={() => window.open(safeClickLink.url, "_blank", "noopener")}
        className="block w-full overflow-hidden rounded-sm border border-white/10 bg-transparent p-0 text-left transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Ticket-und-Hotel-Angebot für Tanz der Vampire in neuem Tab öffnen"
      >
        <span
          aria-hidden="true"
          className="block w-full bg-center bg-no-repeat"
          style={{
            aspectRatio: "1 / 1",
            backgroundImage: `url(${AOVO_TDV_BANNER_URL})`,
            backgroundSize: "100% 100%",
          }}
        />
      </button>
    </aside>
  );
}
