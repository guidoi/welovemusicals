import React, { useEffect } from "react";
import { useConsent } from "@/contexts/ConsentContext";

const CLICK_URL = "https://www.awin1.com/cread.php?s=4568823&v=11388&q=492097&r=2865727";
const IMPRESSION_URL = "https://www.awin1.com/cshow.php?s=4568823&v=11388&q=492097&r=2865727";
const BANNER_SRC = "/images/show-visuals/fjg-eventim-awin-banner-4568823.jpg";

export default function EventimFackJuGoehteBanner() {
  const { consent } = useConsent();

  useEffect(() => {
    if (!consent?.affiliateTracking) return;

    const tracker = new Image();
    tracker.src = IMPRESSION_URL;
  }, [consent?.affiliateTracking]);

  return (
    <aside className="my-8" aria-label="Anzeige: Fack Ju Göhte Tickets bei Eventim">
      <p className="mb-2 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
        Anzeige
      </p>
      <button
        type="button"
        onClick={() => window.open(CLICK_URL, "_blank", "noopener,noreferrer")}
        className="block w-full overflow-hidden rounded-sm text-left transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label="Fack Ju Göhte Tickets bei Eventim ansehen (Anzeige)"
      >
        <img
          src={BANNER_SRC}
          alt="Fack Ju Göhte – Tickets bei Eventim"
          className="h-auto w-full"
          loading="lazy"
        />
      </button>
    </aside>
  );
}
