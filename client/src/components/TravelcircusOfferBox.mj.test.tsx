import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TravelcircusOfferBox from "./TravelcircusOfferBox";
import { getAovoCampaigns } from "./AovoCampaignBanner";
import { getTravelcircusOffer, KDL_TRAVELCIRCUS_OFFER, MJ_TRAVELCIRCUS_OFFER as offer } from "@/lib/travelcircus-offers";

const html = () => renderToStaticMarkup(<TravelcircusOfferBox offer={offer} />);
const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("MJ Travelcircus-Reisebox – Nutzerfreigabe 27.11.2026", () => {
  it("verwendet exakt den MJ-Awin-Deeplink des Nutzers ohne Zusatzparameter", () => {
    expect(getTravelcircusOffer("mj-musical")).toBe(offer);
    expect(offer.affiliateUrl).toBe("https://www.awin1.com/cread.php?awinmid=9151&awinaffid=2865727&ued=https%3A%2F%2Fwww.travelcircus.de%2Fmichael-jackson-musical-hamburg");
    const url = new URL(offer.affiliateUrl);
    expect(url.searchParams.get("awinmid")).toBe("9151");
    expect(url.searchParams.get("awinaffid")).toBe("2865727");
    expect(url.searchParams.get("ued")).toBe(offer.destinationUrl);
    expect(Array.from(url.searchParams.keys()).sort()).toEqual(["awinaffid", "awinmid", "ued"]);
    expect(html()).toContain(offer.affiliateUrl.replaceAll("&", "&amp;"));
  });

  it("rendert MJ-Titel, zugänglichen CTA und alle fünf exakten Nutzerleistungen ohne KDL-Texte", () => {
    const markup = html();
    expect(markup).toContain("MJ – Das Michael Jackson Musical");
    expect(markup).toContain(offer.ctaAriaLabel);
    for (const benefit of [
      "Übernachtung im Premium Hotel deiner Wahl",
      "Tägliches Frühstück im gewählten Hotel",
      "Tickets für MJ – Das Michael Jackson Musical in Hamburg",
      "Schiff-Shuttleservice von den Landungsbrücken zum Theater",
      "Weitere Extras, je nach gewähltem Hotel",
    ]) expect(markup).toContain(benefit);
    expect(markup).toContain("Exklusiv für Travelcircus Kunden");
    expect((markup.match(/<li /g) ?? []).length).toBe(5);
    expect(markup).not.toContain("KÖNIG DER LÖWEN");
    expect(markup).not.toContain("König der Löwen");
    expect(markup).toContain('data-musical-offer="mj-musical"');
  });

  it("zeigt 109,00 Euro pro Person und 139,00 Euro als goldfarbenen semantischen Streichpreis", () => {
    const markup = html();
    expect(offer.priceFrom).toBe("109,00");
    expect(offer.originalPrice).toBe("139,00");
    expect(markup).toContain("Nur für kurze Zeit:");
    expect(markup).toContain("109,00 €");
    expect(markup).toMatch(/<del class="text-sm text-gold"[^>]*>ab 139,00 €<\/del>/);
    expect(markup).toContain("pro Person");
    expect(markup).toContain("Preis und Verfügbarkeit je nach Termin und Hotel");
    expect(markup).not.toMatch(/% sparen|BLACK SALE/);
  });

  it("verwendet das vollständige Nutzerfoto als öffentliches WebP im unveränderten 3:2-Format", () => {
    const markup = html();
    expect(offer.imageUrl).toBe("https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/FifwZuZminvUpnAF.webp");
    expect(offer.imageWidth).toBe(1080);
    expect(offer.imageHeight).toBe(720);
    expect(markup).toContain('width="1080" height="720"');
    expect(markup).toContain(offer.imageAlt);
    expect(markup).toContain("object-contain");
    expect(markup).toContain("Foto: Morris Mac Matzen");
    expect(markup).not.toMatch(/object-cover|scale-|manus-storage/);
  });

  it("nutzt dasselbe native Logo, direkte Anchors und kein Tracker-Script im NoJS-HTML", () => {
    const markup = html();
    expect(markup).toContain("Anzeige · Affiliate-Link");
    expect(markup).toContain('target="_blank" rel="sponsored noopener"');
    expect(markup).toContain("NFyuZHcQZdnHEeat.jpg");
    expect(markup).toContain("https://www.awin1.com/cread.php?s=4803309&amp;v=9151&amp;q=319940&amp;r=2865727");
    expect((markup.match(/<a /g) ?? []).length).toBe(2);
    expect(markup).not.toMatch(/<script|<iframe|cshow\.php|noreferrer|imp\.tradedoubler/);
    expect(source("./TravelcircusOfferBox.tsx")).not.toMatch(/useSafeAffiliateTicketLink|useConsent|trackAffiliateTicketClick|window\.open/);
  });

  it("enthält weder Bestpreisgarantie noch pauschale Stornierungsversprechen", () => {
    expect(html()).not.toMatch(/Bestpreisgarantie|Kostenlos stornierbar|Stornierung|Stornokosten|lucide-check/);
  });

  it("ergänzt die Box vor FAQ ohne die vorhandenen MJ-Banner zu entfernen oder umzupositionieren", () => {
    const detail = source("../pages/MusicalDetail.tsx");
    expect(detail).toContain('const relocatedStageCampaign = musical.id === "koenig-der-loewen" && travelcircusOffer');
    expect(detail.indexOf("<MusicalGallery")).toBeLessThan(detail.indexOf("<TravelcircusOfferBox offer={travelcircusOffer} />"));
    expect(detail.indexOf("<TravelcircusOfferBox offer={travelcircusOffer} />")).toBeLessThan(detail.indexOf("<MusicalShowFacts"));
    const campaigns = getAovoCampaigns("mj-musical");
    expect(campaigns.map(({ groupId }) => groupId).sort()).toEqual(["26068482", "26180462", "26180466"]);
    expect(campaigns.find(({ groupId }) => groupId === "26180462")?.placement).toBe("within-detail-description");
    expect(campaigns.find(({ groupId }) => groupId === "26180466")?.placement).toBe("after-gallery");
    expect(campaigns.find(({ groupId }) => groupId === "26068482")?.placement).toBe("after-faq");
    expect(source("../../../scripts/prerender-seo-routes.ts")).toContain("${travelOfferContent}${faqContent}");
  });

  it("belässt auf Hamburg ausschließlich die KDL-Box und schützt beide KDL-Preise", () => {
    expect(source("../pages/CityDetail.tsx")).toContain("<TravelcircusOfferBox offer={KDL_TRAVELCIRCUS_OFFER} />");
    expect(source("../pages/CityDetail.tsx")).not.toContain("MJ_TRAVELCIRCUS_OFFER");
    expect(KDL_TRAVELCIRCUS_OFFER.priceFrom).toBe("119,00");
    expect(KDL_TRAVELCIRCUS_OFFER.originalPrice).toBe("145,00");
    expect(renderToStaticMarkup(<TravelcircusOfferBox offer={KDL_TRAVELCIRCUS_OFFER} />)).toMatch(/<del class="text-sm text-gold"[^>]*>ab 145,00 €<\/del>/);
  });
});
