import React, { useEffect } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import { trackAffiliateTicketClick } from "@/lib/category-analytics";

type FackJuGoehteBannerFormat = "wide" | "square";

type FackJuGoehteCampaign = {
  campaignId: string;
  clickUrl: string;
  impressionUrl: string;
  imageUrl: string;
  width: number;
  height: number;
  placementLabel: string;
};

export const FACK_JU_GOEHTE_BACK_TO_SCHOOL_CAMPAIGNS: Record<FackJuGoehteBannerFormat, FackJuGoehteCampaign> = {
  wide: {
    campaignId: "4568827",
    clickUrl: "https://www.awin1.com/cread.php?s=4568827&v=11388&q=492097&r=2865727",
    impressionUrl: "https://www.awin1.com/cshow.php?s=4568827&v=11388&q=492097&r=2865727",
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/IYUUlUxAFyeyrOCw.jpg",
    width: 728,
    height: 90,
    placementLabel: "im Fließtext",
  },
  square: {
    campaignId: "4568823",
    clickUrl: "https://www.awin1.com/cread.php?s=4568823&v=11388&q=492097&r=2865727",
    impressionUrl: "https://www.awin1.com/cshow.php?s=4568823&v=11388&q=492097&r=2865727",
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/LAhwDrJpzorIeACT.jpg",
    width: 300,
    height: 250,
    placementLabel: "nach der Bildergalerie",
  },
};

export default function EventimFackJuGoehteBanner({
  format = "wide",
}: {
  format?: FackJuGoehteBannerFormat;
}) {
  const { consent } = useConsent();
  const campaign = FACK_JU_GOEHTE_BACK_TO_SCHOOL_CAMPAIGNS[format];

  useEffect(() => {
    if (!consent?.affiliateTracking) return;

    const tracker = new Image();
    tracker.src = campaign.impressionUrl;
  }, [campaign.impressionUrl, consent?.affiliateTracking]);

  return (
    <aside
      className="mx-auto my-8 w-full"
      style={{ maxWidth: campaign.width }}
      aria-label={`Anzeige: Fack Ju Göhte Back-to-School-Sale ${campaign.placementLabel}`}
      data-campaign-id={campaign.campaignId}
    >
      <p className="mb-2 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
        Anzeige
      </p>
      <button
        type="button"
        onClick={() => {
          trackAffiliateTicketClick({
            musicalId: "fackjugoehte",
            partner: "eventim",
            placement: "campaign-banner",
            analyticsConsent: consent?.analytics === true,
          });
          window.open(campaign.clickUrl, "_blank", "noopener,noreferrer");
        }}
        className="block w-full overflow-hidden rounded-sm text-left transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label="Fack Ju Göhte Back-to-School-Sale bei Eventim ansehen (Anzeige)"
      >
        <img
          src={campaign.imageUrl}
          alt="Fack Ju Göhte – Back-to-School-Sale: 30 % bei Eventim"
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
