import { useMemo } from "react";
import AffiliateImpressionPixel from "@/components/AffiliateImpressionPixel";
import { useConsent } from "@/contexts/ConsentContext";
import { trackAffiliateTicketClick } from "@/lib/category-analytics";
import { useSafeAffiliateTicketLink } from "@/lib/use-affiliate-link-target";
import { useAffiliateLinkFallbackLogging } from "@/lib/affiliate-link-fallback-logger";
import type { MusicalSale } from "@/lib/data";
import { isSaleActive } from "@/lib/sale";
import { WBT_PENDING_BANNERS } from "@/lib/bibi-tina-weihnachten-draft";

export type AovoCampaign = {
  musicalId: string;
  musicalTitle: string;
  groupId: string;
  width: number;
  height: number;
  imageUrl: string;
  clickUrl?: string; // Exakte, vom Projektinhaber gelieferte URL; verändert nicht das Impressionnetzwerk.
  city?: string; // Expliziter Stadtbezug; Detailseite zeigt nur die ausgewählte Stadt.
  activeUntil?: string; // Befristetes Original ohne neutrales Folgecreative: anschließend ausblenden.
  requiresActiveSale?: boolean;
  promotion?: { imageUrl: string; validUntil: string }; // Datiertes Creative, zusätzlich an das Sheet-Angebot gebunden.
  trackingNetwork?: "tradedoubler" | "stage";
  placement?: "after-hotel" | "after-faq" | "before-usp" | "before-story-paragraph" | "within-detail-description" | "after-gallery" | "within-season-announcement";
  storyParagraphIndex?: number;
  detailParagraphIndex?: number;
  compactTopSpacing?: boolean;
  adLabel?: string;
  clickAriaLabel?: string;
};

export const AOVO_CAMPAIGNS: readonly AovoCampaign[] = [
  {
    musicalId: "salon-rosie",
    musicalTitle: "Salon Rosie",
    groupId: "26185722",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WYnMWynDOdrKGiFW.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185722",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/UJgPKhwhnwJwDgxx.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 2,
    adLabel: "Salon Rosie Ticketangebot",
    clickAriaLabel: "Salon-Rosie-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "salon-rosie",
    musicalTitle: "Salon Rosie",
    groupId: "26185720",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/BPkgBMtaBRmniDPS.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185720",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tuNHqvCYYXYuTFZC.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "Salon Rosie Ticketangebot",
    clickAriaLabel: "Salon-Rosie-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "teufel-traegt-prada",
    musicalTitle: "Der Teufel trägt Prada",
    groupId: "26185640",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/QWKJdWesQhytFcux.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185640",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/xHKXvjHHESEEEovz.jpg",
      validUntil: "2026-11-30", // Enddatum aus dem Sheet, geprüft am 21.11.2026.
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 4,
    adLabel: "Der-Teufel-trägt-Prada-Ticketangebot",
    clickAriaLabel: "Der-Teufel-trägt-Prada-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "teufel-traegt-prada",
    musicalTitle: "Der Teufel trägt Prada",
    groupId: "26185638",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/UfrgocXJiuRcQTBu.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185638",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/ZLfXGtmkrHGOoNOx.jpg",
      validUntil: "2026-11-30",
    },
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "Der-Teufel-trägt-Prada-Ticketangebot",
    clickAriaLabel: "Der-Teufel-trägt-Prada-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "eiskoenigin",
    musicalTitle: "Die Eiskönigin",
    groupId: "26185658",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/osgmYIWPeOyuZfSn.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185658",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/owWZZGWpRzIstsol.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    // Nach dem vollständigen Abschnitt „Spektakel für alle Sinne“;
    // nicht direkt unter dem mobilen Keyvisual.
    detailParagraphIndex: 4,
    adLabel: "Die Eiskönigin Ticketangebot",
    clickAriaLabel: "Die-Eiskönigin-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "eiskoenigin",
    musicalTitle: "Die Eiskönigin",
    groupId: "26185656",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/lqNxRsgKDNJxTxBA.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185656",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/xkxRczJddsOAlGMV.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
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
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/TdEwZrFcppFjxYLL.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26180470",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XJUIQKKUaULjNyHO.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 4,
    adLabel: "König der Löwen Ticketangebot",
    clickAriaLabel: "König-der-Löwen-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "koenig-der-loewen",
    musicalTitle: "König der Löwen",
    groupId: "26180460",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XsclnrVkSHkqekmf.jpg",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "König der Löwen Ticketangebot",
    clickAriaLabel: "König-der-Löwen-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "mj-musical",
    musicalTitle: "MJ – Das Michael Jackson Musical",
    groupId: "26180466",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tiqvXnBdPglWxtcQ.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26180466",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/KVRTmqSgMjYOHZiY.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
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
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/nNJlNqZzBBkFCxEw.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26180462",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/odQonaPQiRcLmGKP.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 4,
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
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/NoaaqXXsebwRvAeb.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26204070",
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
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/llOBXxpQYhaNzRBy.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26204068",
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
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/HcQFjBBQPyQprfJy.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185502",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VYqCMmjdsLjwDixM.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 4,
    adLabel: "Zurück-in-die-Zukunft-Ticketangebot",
    clickAriaLabel: "Zurück-in-die-Zukunft-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "ziz",
    musicalTitle: "Zurück in die Zukunft",
    groupId: "26185500",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WTvQqjFUcwszTzyS.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185500",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/EhkNrPdpwvFlzEQv.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
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
    detailParagraphIndex: 4,
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
    musicalId: "tanz-der-vampire",
    musicalTitle: "Tanz der Vampire",
    groupId: "26185674",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tDBGPfoLhwaJKjUn.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185674",
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 4,
    adLabel: "Tanz-der-Vampire-Ticketangebot",
    clickAriaLabel: "Tanz-der-Vampire-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "tanz-der-vampire",
    musicalTitle: "Tanz der Vampire",
    groupId: "26185672",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/rhQrRnQFCqgoFCBr.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185672",
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "Tanz-der-Vampire-Ticketangebot",
    clickAriaLabel: "Tanz-der-Vampire-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "wir-sind-am-leben",
    musicalTitle: "Wir sind am Leben",
    groupId: "26185700",
    width: 728,
    height: 90,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XAikZZLFOHfLKdhM.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185700",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/mxowpUldrZlyEZrT.jpg",
      validUntil: "2026-11-30",
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 4,
    adLabel: "Wir sind am Leben Ticketangebot",
    clickAriaLabel: "Wir-sind-am-Leben-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "wir-sind-am-leben",
    musicalTitle: "Wir sind am Leben",
    groupId: "26185698",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/xcZOVgRQGIktemOe.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185698",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VxqBEqBNXMPdspJI.jpg",
      validUntil: "2026-11-30",
    },
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
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/iZLYVRYfnhSMdcWc.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185666",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/mviShaCbXqtJIjsj.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "within-detail-description",
    detailParagraphIndex: 3,
    adLabel: "&-Julia-Ticketangebot",
    clickAriaLabel: "&-Julia-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "und-julia",
    musicalTitle: "& Julia",
    groupId: "26185664",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/iyfrmzybzwFtZpud.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185664",
    promotion: {
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/awRytLNRSmByGCfT.jpg",
      validUntil: "2026-11-30", // Sheet-Enddatum; früheres Abschalten im Sheet hat Vorrang.
    },
    trackingNetwork: "stage",
    placement: "after-gallery",
    adLabel: "&-Julia-Ticketangebot",
    clickAriaLabel: "&-Julia-Ticketangebot in neuem Tab öffnen",
  },
  {
    musicalId: "ziz",
    musicalTitle: "Zurück in die Zukunft – Stuttgart",
    groupId: "26229530",
    width: 300,
    height: 250,
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tfsnyFZLYJhxTNGv.jpg",
    clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26229530",
    trackingNetwork: "stage",
    placement: "within-season-announcement",
    compactTopSpacing: true,
    adLabel: "Zurück in die Zukunft – Vorverkauf Stuttgart ab Oktober 2027",
    clickAriaLabel: "Zurück-in-die-Zukunft-Ticketangebot für Stuttgart in neuem Tab öffnen",
  },
  ...WBT_PENDING_BANNERS.map((banner): AovoCampaign => ({
    ...banner,
    musicalId: "weihnachten-mit-bibi-tina",
    musicalTitle: `Weihnachten mit Bibi & Tina – ${banner.city}`,
    trackingNetwork: "stage",
    activeUntil: "2026-11-30",
    requiresActiveSale: true,
    detailParagraphIndex: banner.width === 728 ? 2 : undefined,
    adLabel: `Weihnachten mit Bibi & Tina – BLACK SALE ${banner.city}`,
    clickAriaLabel: `WBT-Ticketangebot für ${banner.city} in neuem Tab öffnen`,
  })),
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

export function resolveAovoCampaignClickUrl(campaign: AovoCampaign) {
  return campaign.clickUrl ?? getAovoCampaignClickUrl(campaign.groupId, campaign.trackingNetwork);
}

export function getAovoCampaignImageUrl(campaign: AovoCampaign, sale?: MusicalSale, now = new Date()) {
  // Die Sheet-Aktion kann das Motiv früher beenden; spätere Aktionen dürfen
  // das alte Black-Friday-Creative nach seinem eigenen Ende nicht reaktivieren.
  return campaign.promotion && isSaleActive(sale, now)
    && isSaleActive({ label: "Creative", discount: "", validUntil: campaign.promotion.validUntil }, now)
    ? campaign.promotion.imageUrl
    : campaign.imageUrl;
}

export function isAovoCampaignVisible(campaign: AovoCampaign, sale?: MusicalSale, now = new Date()) {
  return (!campaign.activeUntil || isSaleActive({ label: "Creative", discount: "", validUntil: campaign.activeUntil }, now))
    && (!campaign.requiresActiveSale || isSaleActive(sale, now));
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

export default function AovoCampaignBanner({ campaign, sale }: { campaign: AovoCampaign; sale?: MusicalSale }) {
  const { consent } = useConsent();
  const isInlineWideCampaign = campaign.placement === "within-detail-description" && campaign.width >= 700;
  const impressionUrl = useMemo(
    () => getAovoCampaignImpressionUrl(campaign.groupId, String(Math.random()).slice(2, 11), campaign.trackingNetwork),
    [campaign.groupId, campaign.trackingNetwork]
  );
  const campaignClickUrl = resolveAovoCampaignClickUrl(campaign);
  const safeClickLink = useSafeAffiliateTicketLink(campaignClickUrl, {
    musicalId: campaign.musicalId,
    partner: campaign.trackingNetwork === "stage" ? "stage" : "tradedoubler",
    placement: "campaign-banner",
  });
  useAffiliateLinkFallbackLogging([{
    link: safeClickLink,
    musicalId: campaign.musicalId,
    placement: "campaign-banner",
    partner: campaign.trackingNetwork === "stage" ? "stage" : "tradedoubler",
  }]);

  if (!isAovoCampaignVisible(campaign, sale)) return null;

  return (
    <aside
      className={campaign.compactTopSpacing
        ? "relative mx-auto mt-2 w-full pt-2 md:mt-3 md:pt-3"
        : isInlineWideCampaign
          ? "relative mx-auto mt-3 mb-8 w-full pt-1 md:my-8 md:pt-6"
        : "relative mx-auto mt-8 w-full pt-6"}
      style={{ maxWidth: campaign.width }}
      aria-label={`Anzeige: ${campaign.adLabel ?? `Ticket und Hotel – ${campaign.musicalTitle}`}`}
      data-campaign-id={campaign.groupId}
    >
      <AffiliateImpressionPixel
        url={impressionUrl}
        enabled={consent?.affiliateTracking === true}
      />
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
          // `noopener` schützt das Ursprungsfenster, ohne den für die
          // Affiliate-Attribution relevanten Herkunftsverweis zu unterdrücken.
          window.open(safeClickLink.url, "_blank", "noopener");
        }}
        className="block w-full overflow-hidden rounded-sm bg-transparent p-0 text-left outline outline-1 outline-white/10 outline-offset-0 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={campaign.clickAriaLabel ?? `Ticket-und-Hotel-Angebot für ${campaign.musicalTitle} in neuem Tab öffnen`}
      >
        <img
          src={getAovoCampaignImageUrl(campaign, sale)}
          alt=""
          width={campaign.width}
          height={campaign.height}
          className="block h-auto w-full"
        />
      </button>
    </aside>
  );
}
