import { useEffect, useMemo } from "react";
import { useConsent } from "@/contexts/ConsentContext";

export type AovoCampaign = {
  musicalId: string;
  musicalTitle: string;
  groupId: string;
  width: number;
  height: number;
  imageUrl: string;
  trackingNetwork?: "tradedoubler" | "stage";
  placement?: "after-hotel" | "after-faq" | "before-usp" | "before-story-paragraph" | "within-detail-description" | "after-ticket-box";
  storyParagraphIndex?: number;
  detailParagraphIndex?: number;
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
    groupId: "26068538",
    width: 300,
    height: 250,
    imageUrl: "/images/show-visuals/die-eiskoenigin-300x250.png",
  },
  {
    musicalId: "koenig-der-loewen",
    musicalTitle: "König der Löwen",
    groupId: "26180470",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/xFcqGUobMzNazpmJ.jpg",
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
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/flIDVltwpwOIvdKZ.jpg",
    trackingNetwork: "stage",
    placement: "after-ticket-box",
    adLabel: "König der Löwen Ticketangebot",
    clickAriaLabel: "König-der-Löwen-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26180466",
    width: 300,
    height: 250,
    imageUrl: "/images/show-visuals/mj-stage-salesweek-26180466-300x250.jpg?v=20260910",
    trackingNetwork: "stage",
    placement: "after-ticket-box",
    adLabel: "MJ-Ticketangebot",
    clickAriaLabel: "MJ-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26180462",
    width: 728,
    height: 90,
    imageUrl: "/images/show-visuals/mj-stage-salesweek-26180462-728x90.jpg?v=20260910-2",
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
    adLabel: "MJ Ticket & Hotel",
    clickAriaLabel: "MJ Ticket-und-Hotel-Angebot in neuem Tab öffnen",
  },
  {
    musicalId: "ziz",
    musicalTitle: "Zurück in die Zukunft",
    groupId: "26068390",
    width: 970,
    height: 90,
    imageUrl: "/images/show-visuals/zurueck-in-die-zukunft-970x90.png",
  },
  {
    musicalId: "tarzan",
    musicalTitle: "Disneys Tarzan",
    groupId: "26064472",
    width: 300,
    height: 250,
    imageUrl: "/images/show-visuals/tarzan-300x250.png",
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
    imageUrl: "/images/show-visuals/wir-sind-am-leben-728x90.jpg",
    trackingNetwork: "stage",
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
      className="mx-auto mt-8 w-full border-t border-gold/15 pt-6"
      style={{ maxWidth: campaign.width }}
      aria-label={`Anzeige: ${campaign.adLabel ?? `Ticket und Hotel – ${campaign.musicalTitle}`}`}
      data-campaign-id={campaign.groupId}
    >
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Anzeige</p>
      <button
        type="button"
        onClick={() => window.open(getAovoCampaignClickUrl(campaign.groupId, campaign.trackingNetwork), "_blank", "noopener,noreferrer")}
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
