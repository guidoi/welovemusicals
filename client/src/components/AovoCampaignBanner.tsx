import { useEffect, useMemo } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import { trackAffiliateTicketClick } from "@/lib/category-analytics";

export type AovoCampaign = {
  musicalId: string;
  musicalTitle: string;
  groupId: string;
  width: number;
  height: number;
  imageUrl: string;
  trackingNetwork?: "tradedoubler" | "stage";
  placement?: "after-hotel" | "after-faq" | "before-usp" | "before-story-paragraph" | "within-detail-description" | "after-gallery";
  storyParagraphIndex?: number;
  detailParagraphIndex?: number;
  compactTopSpacing?: boolean;
  adLabel?: string;
  clickAriaLabel?: string;
};

export const AOVO_CAMPAIGNS: readonly AovoCampaign[] = [
  {
    musicalId: "moulinrouge",
    musicalTitle: "Moulin Rouge!",
    groupId: "26068414",
    width: 750,
    height: 200,
    imageUrl: "/images/show-visuals/moulin-rouge-750x200.png",
  },
  {
    musicalId: "salon-rosie",
    musicalTitle: "Salon Rosie",
    groupId: "26130644",
    width: 970,
    height: 90,
    imageUrl: "/images/show-visuals/salon-rosie-970x90.png",
  },
  {
    musicalId: "teufel-traegt-prada",
    musicalTitle: "Der Teufel trägt Prada",
    groupId: "26084292",
    width: 970,
    height: 90,
    imageUrl: "/images/show-visuals/teufel-traegt-prada-970x90.gif",
  },
  {
    musicalId: "eiskoenigin",
    musicalTitle: "Die Eiskönigin",
    groupId: "26185658",
    width: 729,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/yYleKPaaEBoJnkwk.jpg",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "Die Eiskönigin Ticketangebot",
    clickAriaLabel: "Die-Eiskönigin-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "eiskoenigin",
    musicalTitle: "Die Eiskönigin",
    groupId: "26185656",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/xzexNcKEKQeyouzb.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "Die Eiskönigin Ticketangebot",
    clickAriaLabel: "Die-Eiskönigin-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "koenig-der-loewen",
    musicalTitle: "König der Löwen",
    groupId: "26180470",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/KGtCOEFGfgbQHHaH.jpg",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "König der Löwen Ticketangebot",
    clickAriaLabel: "König-der-Löwen-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "koenig-der-loewen",
    musicalTitle: "König der Löwen",
    groupId: "26180460",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/IfbilkdRigknWprn.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "König der Löwen Ticketangebot",
    clickAriaLabel: "König-der-Löwen-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "koenig-der-loewen",
    musicalTitle: "König der Löwen",
    groupId: "26068528",
    width: 750,
    height: 200,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/fSsmgKqWQourDufP.png",
    placement: "after-faq",
    compactTopSpacing: true,
    adLabel: "König der Löwen Ticket & Hotel",
    clickAriaLabel: "König-der-Löwen-Ticket-und-Hotel-Angebot in neuem Tab öffnen",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26180466",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/kqfKEqTblBouOywS.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "MJ-Ticketangebot",
    clickAriaLabel: "MJ-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26180462",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/yHDbGkiApdeTfiVB.jpg",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "MJ-Ticketangebot",
    clickAriaLabel: "MJ-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26068482",
    width: 750,
    height: 200,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/gVVzRonIwuCZlwnB.png",
    placement: "after-faq",
    compactTopSpacing: true,
    adLabel: "MJ Ticket & Hotel",
    clickAriaLabel: "MJ Ticket-und-Hotel-Angebot in neuem Tab öffnen",
  },
  {
    musicalId: "tina-das-musical",
    musicalTitle: "TINA – Das Tina Turner Musical",
    groupId: "26204070",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/krTROylxWabyrCcC.jpg",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "TINA Ticketangebot",
    clickAriaLabel: "TINA-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "tina-das-musical",
    musicalTitle: "TINA – Das Tina Turner Musical",
    groupId: "26204068",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/fqeFcGbNUPrUgytq.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "TINA Ticketangebot",
    clickAriaLabel: "TINA-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "ziz",
    musicalTitle: "Zurück in die Zukunft",
    groupId: "26185502",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/BkyJevjHoYNAGGBb.jpg",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "Zurück-in-die-Zukunft-Ticketangebot",
    clickAriaLabel: "Zurück-in-die-Zukunft-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "ziz",
    musicalTitle: "Zurück in die Zukunft",
    groupId: "26185500",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/zrbcvAjlcjmZFmkg.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "Zurück-in-die-Zukunft-Ticketangebot",
    clickAriaLabel: "Zurück-in-die-Zukunft-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "tarzan",
    musicalTitle: "Disneys Tarzan",
    groupId: "26185546",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/hMSLfxEDGvtpGuxe.jpg",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "Tarzan Abschiedstickets",
    clickAriaLabel: "Tarzan-Abschiedstickets in neuem Tab öffnen",
  },
  {
    musicalId: "tarzan",
    musicalTitle: "Disneys Tarzan",
    groupId: "26185544",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/kFgSOCDcCAnOWbkF.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "Tarzan Abschiedstickets",
    clickAriaLabel: "Tarzan-Abschiedstickets in neuem Tab öffnen",
  },
  {
    musicalId: "starlight-express",
    musicalTitle: "Starlight Express",
    groupId: "26068496",
    width: 750,
    height: 200,
    imageUrl: "/images/show-visuals/starlight-express-750x200.png",
  },
  {
    musicalId: "wir-sind-am-leben",
    musicalTitle: "Wir sind am Leben",
    groupId: "26185700",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/GjHNFEoIcaLNLtYD.jpg",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "Wir sind am Leben Ticketangebot",
    clickAriaLabel: "Wir-sind-am-Leben-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "wir-sind-am-leben",
    musicalTitle: "Wir sind am Leben",
    groupId: "26185698",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VtiecJiBFLMHWhcC.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "Wir sind am Leben Ticketangebot",
    clickAriaLabel: "Wir-sind-am-Leben-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "und-julia",
    musicalTitle: "& Julia",
    groupId: "26185666",
    width: 728,
    height: 90,
    imageUrl: "/images/show-visuals/und-julia-728x90.jpg",
    trackingNetwork: "stage",
    placement: "before-story-paragraph",
    storyParagraphIndex: 2,
  },
];

export function getAovoCampaign(musicalId: string) {
  return AOVO_CAMPAIGNS.find((campaign) => campaign.musicalId === musicalId);
}

export function getAovoCampaigns(musicalId: string) {
  return AOVO_CAMPAIGNS.filter((campaign) => campaign.musicalId === musicalId);
}

export function getAovoCampaignClickUrl(
  groupId: string,
  trackingNetwork: AovoCampaign["trackingNetwork"] = "tradedoubler"
) {
  const baseUrl = trackingNetwork === "stage"
    ? "https://visit.stage-entertainment.de/click?p=394206&a=3492604"
    : "https://clk.tradedoubler.com/click?p=377032&a=3492604";
  return `${baseUrl}&g=${groupId}`;
}

export function getAovoCampaignImpressionUrl(
  groupId: string,
  cacheBuster: string,
  trackingNetwork: AovoCampaign["trackingNetwork"] = "tradedoubler"
) {
  const baseUrl = trackingNetwork === "stage"
    ? "https://visit.stage-entertainment.de/imp"
    : "https://imp.tradedoubler.com/imp";
  return `${baseUrl}?type(img)g(${groupId})a(3492604)${cacheBuster}`;
}

export default function AovoCampaignBanner({ campaign }: { campaign: AovoCampaign }) {
  const { consent } = useConsent();
  const impressionUrl = useMemo(
    () => getAovoCampaignImpressionUrl(campaign.groupId, String(Math.random()).slice(2, 11), campaign.trackingNetwork),
    [campaign.groupId, campaign.trackingNetwork]
  );

  useEffect(() => {
    if (!consent?.affiliateTracking) return;
    const impressionPixel = new Image();
    impressionPixel.src = impressionUrl;
  }, [consent?.affiliateTracking, impressionUrl]);

  return (
    <aside
      className={campaign.compactTopSpacing
        ? "mx-auto mt-2 w-full pt-2 md:mt-3 md:pt-3"
        : "mx-auto mt-8 w-full pt-6"}
      style={{ maxWidth: campaign.width }}
      aria-label={`Anzeige: ${campaign.adLabel ?? `Ticket und Hotel – ${campaign.musicalTitle}`}`}
      data-campaign-id={campaign.groupId}
    >
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Anzeige</p>
      <button
        type="button"
        onClick={() => {
          trackAffiliateTicketClick({
            musicalId: campaign.musicalId,
            partner: campaign.trackingNetwork === "stage" ? "stage" : "tradedoubler",
            placement: "campaign-banner",
            analyticsConsent: consent?.analytics === true,
          });
          window.open(getAovoCampaignClickUrl(campaign.groupId, campaign.trackingNetwork), "_blank", "noopener,noreferrer");
        }}
        className="block w-full overflow-hidden rounded-sm bg-transparent p-0 text-left outline outline-1 outline-white/10 outline-offset-0 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={campaign.clickAriaLabel ?? `Ticket-und-Hotel-Angebot für ${campaign.musicalTitle} in neuem Tab öffnen`}
      >
        <img
          src={campaign.imageUrl}
          alt=""
          width={campaign.width}
          height={campaign.height}
          className="block h-auto w-full"
        />
      </button>
    </aside>
  );
}
