import { useEffect, useMemo } from "react";

export type AovoCampaign = {
  musicalId: string;
  musicalTitle: string;
  groupId: string;
  width: number;
  height: number;
  imageUrl: string;
  trackingNetwork?: "tradedoubler" | "stage";
  placement?: "after-hotel" | "before-usp";
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
    groupId: "26068528",
    width: 750,
    height: 200,
    imageUrl: "/images/show-visuals/koenig-der-loewen-750x200.png",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26068474",
    width: 970,
    height: 90,
    imageUrl: "/images/show-visuals/mj-970x90.png",
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
    placement: "before-usp",
  },
];

export function getAovoCampaign(musicalId: string) {
  return AOVO_CAMPAIGNS.find((campaign) => campaign.musicalId === musicalId);
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
  const impressionUrl = useMemo(
    () => getAovoCampaignImpressionUrl(campaign.groupId, String(Math.random()).slice(2, 11), campaign.trackingNetwork),
    [campaign.groupId, campaign.trackingNetwork]
  );

  useEffect(() => {
    const impressionPixel = new Image();
    impressionPixel.src = impressionUrl;
  }, [impressionUrl]);

  return (
    <aside className="mt-8 border-t border-gold/15 pt-6" aria-label={`Anzeige: Ticket und Hotel – ${campaign.musicalTitle}`}>
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Anzeige</p>
      <button
        type="button"
        onClick={() => window.open(getAovoCampaignClickUrl(campaign.groupId, campaign.trackingNetwork), "_blank", "noopener,noreferrer")}
        className="block w-full overflow-hidden rounded-sm border border-white/10 bg-transparent p-0 text-left transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`Ticket-und-Hotel-Angebot für ${campaign.musicalTitle} in neuem Tab öffnen`}
      >
        <span
          aria-hidden="true"
          className="block w-full bg-center bg-no-repeat"
          style={{
            aspectRatio: `${campaign.width} / ${campaign.height}`,
            backgroundImage: `url(${campaign.imageUrl})`,
            backgroundSize: "100% 100%",
          }}
        />
      </button>
    </aside>
  );
}
