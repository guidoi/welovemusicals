import React, { useEffect } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import { trackAffiliateTicketClick } from "@/lib/category-analytics";

type DraculaBannerFormat = "wide" | "square";

type DraculaCampaign = {
  campaignId: string;
  clickUrl: string;
  impressionUrl: string;
  imageUrl: string;
  width: number;
  height: number;
  placementLabel: string;
};

export const DRACULA_AWIN_CAMPAIGNS: Record<DraculaBannerFormat, DraculaCampaign> = {
  wide: {
    campaignId: "3889113",
    clickUrl: "https://www.awin1.com/cread.php?s=3889113&v=11388&q=492097&r=2865727",
    impressionUrl: "https://www.awin1.com/cshow.php?s=3889113&v=11388&q=492097&r=2865727",
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/aBHXjxadgwlLEJqV.jpg",
    width: 728,
    height: 90,
    placementLabel: "im Fließtext",
  },
  square: {
    campaignId: "3889111",
    clickUrl: "https://www.awin1.com/cread.php?s=3889111&v=11388&q=492097&r=2865727",
    impressionUrl: "https://www.awin1.com/cshow.php?s=3889111&v=11388&q=492097&r=2865727",
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/bwWmNznqUwumQWJP.jpg",
    width: 300,
    height: 250,
    placementLabel: "nach der Bildergalerie",
  },
};

export default function EventimDraculaBanner({
  format = "wide",
}: {
  format?: DraculaBannerFormat;
}) {
  const { consent } = useConsent();
  const campaign = DRACULA_AWIN_CAMPAIGNS[format];

  useEffect(() => {
    if (!consent?.affiliateTracking) return;

    const tracker = new Image();
    tracker.src = campaign.impressionUrl;
  }, [campaign.impressionUrl, consent?.affiliateTracking]);

  return (
    <aside
      className={format === "wide" ? "mx-auto mt-3 mb-8 w-full md:my-8" : "mx-auto my-8 w-full"}
      style={{ maxWidth: campaign.width }}
      aria-label={`Anzeige: Dracula – Das Musical bei Eventim ${campaign.placementLabel}`}
      data-campaign-id={campaign.campaignId}
    >
      <p className="mb-2 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
        Anzeige
      </p>
      <button
        type="button"
        onClick={() => {
          trackAffiliateTicketClick({
            musicalId: "dracula",
            partner: "eventim",
            placement: "campaign-banner",
            analyticsConsent: consent?.analytics === true,
          });
          window.open(campaign.clickUrl, "_blank", "noopener,noreferrer");
        }}
        className="block w-full overflow-hidden rounded-sm text-left transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label="Dracula – Das Musical bei Eventim ansehen (Anzeige)"
      >
        <img
          src={campaign.imageUrl}
          alt="Dracula – Das Musical bei Eventim"
          width={campaign.width}
          height={campaign.height}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </button>
    </aside>
  );
}
