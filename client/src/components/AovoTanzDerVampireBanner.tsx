import { useMemo } from "react";

export const AOVO_TDV_CLICK_URL = "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26137318";
export const AOVO_TDV_FALLBACK_BANNER_URL = "/manus-storage/tanz-der-vampire-ticket-hotel-banner_93366e33.png";

export function getAovoTdVImpressionUrl(cacheBuster: string) {
  return `https://imp.tradedoubler.com/imp?type(img)g(26137318)a(3492604)${cacheBuster}`;
}

export default function AovoTanzDerVampireBanner() {
  const impressionUrl = useMemo(
    () => getAovoTdVImpressionUrl(String(Math.random()).slice(2, 11)),
    []
  );

  return (
    <aside className="mt-8 border-t border-gold/15 pt-6" aria-label="Anzeige: Aovo Reisen">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Anzeige</p>
      <a
        href={AOVO_TDV_CLICK_URL}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="block overflow-hidden rounded-sm border border-white/10 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <img
          src={impressionUrl}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = AOVO_TDV_FALLBACK_BANNER_URL;
          }}
          width={750}
          height={200}
          alt="Aovo Reisen: Tanz der Vampire – Ticket und Hotel"
          className="h-auto w-full"
          loading="lazy"
        />
      </a>
    </aside>
  );
}
