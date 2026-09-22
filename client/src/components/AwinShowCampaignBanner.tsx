import React, { useEffect } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import { trackAffiliateTicketClick } from "@/lib/category-analytics";

export type AwinShowCampaignFormat = "wide" | "square";
type AwinPartner = "eventim" | "atg";

type AwinShowCreative = {
  creativeId: string;
  clickUrl: string;
  impressionUrl: string;
  imageUrl: string;
  width: number;
  height: number;
};

export type AwinShowCampaign = {
  musicalId: string;
  title: string;
  partner: AwinPartner;
  wideDetailParagraphIndex: number;
  creatives: Record<AwinShowCampaignFormat, AwinShowCreative>;
};

const createAwinCreative = ({
  creativeId,
  merchantId,
  queryId,
  imageUrl,
  width,
  height,
}: {
  creativeId: string;
  merchantId: string;
  queryId: string;
  imageUrl: string;
  width: number;
  height: number;
}): AwinShowCreative => {
  const parameters = `s=${creativeId}&v=${merchantId}&q=${queryId}&r=2865727`;
  return {
    creativeId,
    clickUrl: `https://www.awin1.com/cread.php?${parameters}`,
    impressionUrl: `https://www.awin1.com/cshow.php?${parameters}`,
    imageUrl,
    width,
    height,
  };
};

/**
 * Native creatives avoid executing advertiser document.write snippets.  The image
 * itself is hosted by the project; AWIN impressions only load after affiliate consent.
 */
export const AWIN_SHOW_CAMPAIGNS: readonly AwinShowCampaign[] = [
  {
    musicalId: "dreihaselnuesse",
    title: "Drei Haselnüsse für Aschenbrödel",
    partner: "eventim",
    wideDetailParagraphIndex: 3,
    creatives: {
      wide: createAwinCreative({
        creativeId: "3980776",
        merchantId: "11388",
        queryId: "492097",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/QnxiMgIPvccVyvto.jpg",
        width: 728,
        height: 90,
      }),
      square: createAwinCreative({
        creativeId: "3980773",
        merchantId: "11388",
        queryId: "492097",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/iPsFKigUrFQWvbNt.jpg",
        width: 300,
        height: 250,
      }),
    },
  },
  {
    musicalId: "gloeckner-von-notre-dame",
    title: "Disney Der Glöckner von Notre-Dame",
    partner: "atg",
    wideDetailParagraphIndex: 4,
    creatives: {
      wide: createAwinCreative({
        creativeId: "4882557",
        merchantId: "111888",
        queryId: "614186",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/KJylXBgAulkUaibk.jpg",
        width: 728,
        height: 90,
      }),
      square: createAwinCreative({
        creativeId: "4882583",
        merchantId: "111888",
        queryId: "614186",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/jxYHHgdSuLhcecbs.jpg",
        width: 300,
        height: 250,
      }),
    },
  },
  {
    musicalId: "phantom-der-oper",
    title: "Das Phantom der Oper",
    partner: "atg",
    wideDetailParagraphIndex: 4,
    creatives: {
      wide: createAwinCreative({
        creativeId: "4804894",
        merchantId: "111888",
        queryId: "602812",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/CtqEOYNjHQQzWrXE.jpg",
        width: 728,
        height: 90,
      }),
      square: createAwinCreative({
        creativeId: "4804889",
        merchantId: "111888",
        queryId: "602812",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/sKyIOZKkbUznUtEq.jpg",
        width: 320,
        height: 480,
      }),
    },
  },
  {
    musicalId: "moulinrouge",
    title: "Moulin Rouge! Das Musical",
    partner: "atg",
    // Nach dem vollständigen Abschnitt zur Theaterverwandlung,
    // vor dem abschließenden Tony-Award-Kontext.
    wideDetailParagraphIndex: 4,
    creatives: {
      wide: createAwinCreative({
        creativeId: "4782564",
        merchantId: "111888",
        queryId: "597568",
        imageUrl: "/manus-storage/05212026-233915595-asset_93453a11.jpg",
        width: 728,
        height: 90,
      }),
      square: createAwinCreative({
        creativeId: "4782560",
        merchantId: "111888",
        queryId: "597568",
        imageUrl: "/manus-storage/05212026-233915793-asset_fc839ed7.jpg",
        width: 600,
        height: 600,
      }),
    },
  },
  {
    musicalId: "starlight-express",
    title: "Starlight Express",
    partner: "atg",
    // Nach dem vollständigen Rollschuh-Action-Abschnitt,
    // vor der Geschichte von Rusty.
    wideDetailParagraphIndex: 2,
    creatives: {
      wide: createAwinCreative({
        creativeId: "4785482",
        merchantId: "111888",
        queryId: "508544",
        imageUrl: "/manus-storage/05262026-060503701-asset_4113c4ab.jpg",
        width: 728,
        height: 90,
      }),
      square: createAwinCreative({
        creativeId: "4785481",
        merchantId: "111888",
        queryId: "508544",
        imageUrl: "/manus-storage/05262026-060504131-asset_fc450ba9.jpg",
        width: 320,
        height: 480,
      }),
    },
  },
  {
    musicalId: "schoene-und-das-biest",
    title: "Die Schöne und das Biest – Das neue Musical",
    partner: "eventim",
    // Nach dem vollständigen Familienabschnitt, vor den Tourneestädten.
    wideDetailParagraphIndex: 3,
    creatives: {
      wide: createAwinCreative({
        creativeId: "3736769",
        merchantId: "11388",
        queryId: "492097",
        imageUrl: "/manus-storage/imgdie-schoene-und-das-biest-das-neue-musical-awin-728x90-1773759468872_06dfa802.jpg",
        width: 728,
        height: 90,
      }),
      square: createAwinCreative({
        creativeId: "3736775",
        merchantId: "11388",
        queryId: "492097",
        imageUrl: "/manus-storage/imgdie-schoene-und-das-biest-das-neue-musical-awin-300x250-1773759509379_acc6b7d2.jpg",
        width: 300,
        height: 250,
      }),
    },
  },
  {
    musicalId: "rapunzel",
    title: "Rapunzel – Das märchenhafte Musical",
    partner: "eventim",
    // Nach dem vollständigen Märchen- und Musikabschnitt,
    // vor dem kreativen Traumteam.
    wideDetailParagraphIndex: 2,
    creatives: {
      wide: createAwinCreative({
        creativeId: "4573325",
        merchantId: "11388",
        queryId: "492097",
        imageUrl: "/manus-storage/imgrapunzel-das-neue-musical-awin-728x90-1784714913612_2a361a37.jpg",
        width: 728,
        height: 90,
      }),
      square: createAwinCreative({
        creativeId: "4573313",
        merchantId: "11388",
        queryId: "492097",
        imageUrl: "/manus-storage/imgrapunzel-das-neue-musical-awin-300x250-1784714842593_61296029.jpg",
        width: 300,
        height: 250,
      }),
    },
  },
] as const;

export function getAwinShowCampaign(musicalId: string) {
  return AWIN_SHOW_CAMPAIGNS.find((campaign) => campaign.musicalId === musicalId);
}

export default function AwinShowCampaignBanner({
  campaign,
  format,
}: {
  campaign: AwinShowCampaign;
  format: AwinShowCampaignFormat;
}) {
  const { consent } = useConsent();
  const creative = campaign.creatives[format];
  const placementLabel = format === "wide" ? "im Fließtext" : "nach der Bildergalerie";

  useEffect(() => {
    if (!consent?.affiliateTracking) return;

    const tracker = new Image();
    tracker.src = creative.impressionUrl;
  }, [consent?.affiliateTracking, creative.impressionUrl]);

  return (
    <aside
      className="mx-auto my-8 w-full"
      style={{ maxWidth: creative.width }}
      aria-label={`Anzeige: ${campaign.title} ${placementLabel}`}
      data-campaign-id={creative.creativeId}
    >
      <p className="mb-2 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
        Anzeige
      </p>
      <button
        type="button"
        onClick={() => {
          trackAffiliateTicketClick({
            musicalId: campaign.musicalId,
            partner: campaign.partner,
            placement: "campaign-banner",
            analyticsConsent: consent?.analytics === true,
          });
          window.open(creative.clickUrl, "_blank", "noopener,noreferrer");
        }}
        className="block w-full overflow-hidden rounded-sm text-left transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label={`${campaign.title} bei ${campaign.partner === "atg" ? "ATG Tickets" : "Eventim"} ansehen (Anzeige)`}
      >
        <img
          src={creative.imageUrl}
          alt={`${campaign.title} bei ${campaign.partner === "atg" ? "ATG Tickets" : "Eventim"}`}
          width={creative.width}
          height={creative.height}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </button>
    </aside>
  );
}
