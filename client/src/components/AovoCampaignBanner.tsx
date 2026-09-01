import { useMemo } from "react";

export type AovoCampaign = {
  musicalId: string;
  musicalTitle: string;
  groupId: string;
  width: number;
  height: number;
  imageUrl: string;
};

export const AOVO_CAMPAIGNS: readonly AovoCampaign[] = [
  {
    musicalId: "moulinrouge",
    musicalTitle: "Moulin Rouge!",
    groupId: "26068414",
    width: 750,
    height: 200,
    imageUrl: "/images/advertising/aovo/moulin-rouge-750x200.png",
  },
  {
    musicalId: "salon-rosie",
    musicalTitle: "Salon Rosie",
    groupId: "26130644",
    width: 970,
    height: 90,
    imageUrl: "/images/advertising/aovo/salon-rosie-970x90.png",
  },
  {
    musicalId: "teufel-traegt-prada",
    musicalTitle: "Der Teufel trägt Prada",
    groupId: "26084292",
    width: 750,
    height: 200,
    imageUrl: "/images/advertising/aovo/teufel-traegt-prada-970x90.gif",
  },
  {
    musicalId: "eiskoenigin",
    musicalTitle: "Die Eiskönigin",
    groupId: "26068538",
    width: 300,
    height: 250,
    imageUrl: "/images/advertising/aovo/die-eiskoenigin-300x250.png",
  },
  {
    musicalId: "koenig-der-loewen",
    musicalTitle: "König der Löwen",
    groupId: "26068528",
    width: 750,
    height: 200,
    imageUrl: "/images/advertising/aovo/koenig-der-loewen-750x200.png",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26068474",
    width: 970,
    height: 90,
    imageUrl: "/images/advertising/aovo/mj-970x90.png",
  },
];

export function getAovoCampaign(musicalId: string) {
  return AOVO_CAMPAIGNS.find((campaign) => campaign.musicalId === musicalId);
}

export function getAovoCampaignClickUrl(groupId: string) {
  return `https://clk.tradedoubler.com/click?p=377032&a=3492604&g=${groupId}`;
}

export function getAovoCampaignImpressionUrl(groupId: string, cacheBuster: string) {
  return `https://imp.tradedoubler.com/imp?type(img)g(${groupId})a(3492604)${cacheBuster}`;
}

export default function AovoCampaignBanner({ campaign }: { campaign: AovoCampaign }) {
  const impressionUrl = useMemo(
    () => getAovoCampaignImpressionUrl(campaign.groupId, String(Math.random()).slice(2, 11)),
    [campaign.groupId]
  );

  return (
    <aside className="mt-8 border-t border-gold/15 pt-6" aria-label={`Anzeige: Aovo Reisen – ${campaign.musicalTitle}`}>
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Anzeige</p>
      <a
        href={getAovoCampaignClickUrl(campaign.groupId)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="block overflow-hidden rounded-sm border border-white/10 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <img
          src={impressionUrl}
          alt=""
          width={1}
          height={1}
          className="sr-only"
          aria-hidden="true"
        />
        <img
          src={campaign.imageUrl}
          width={campaign.width}
          height={campaign.height}
          alt={`Aovo Reisen: ${campaign.musicalTitle} – Ticket und Hotel`}
          className="h-auto w-full"
          loading="eager"
        />
      </a>
    </aside>
  );
}
