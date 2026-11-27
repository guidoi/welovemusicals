import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TravelcircusOfferBox from "./TravelcircusOfferBox";
import { getTravelcircusOffer, KDL_TRAVELCIRCUS_OFFER as offer, MJ_TRAVELCIRCUS_OFFER, EISKOENIGIN_TRAVELCIRCUS_OFFER, PRADA_TRAVELCIRCUS_OFFER, JULIA_TRAVELCIRCUS_OFFER, TINA_TRAVELCIRCUS_OFFER, ZIZ_TRAVELCIRCUS_OFFER, TDV_TRAVELCIRCUS_OFFER, ROSIE_TRAVELCIRCUS_OFFER } from "@/lib/travelcircus-offers";
import { musicals } from "@/lib/data";

const html = () => renderToStaticMarkup(<TravelcircusOfferBox offer={offer} />);

describe("KDL Travelcircus-Reisebox", () => {
  it("erhält den exakt vom Nutzer generierten Awin-Link ohne Zusatztracking", () => {
    expect(offer.affiliateUrl).toBe("https://www.awin1.com/cread.php?awinmid=9151&awinaffid=2865727&ued=https%3A%2F%2Fwww.travelcircus.de%2Fkoenig-der-loewen-hamburg");
    const url = new URL(offer.affiliateUrl);
    expect(url.searchParams.get("awinmid")).toBe("9151");
    expect(url.searchParams.get("awinaffid")).toBe("2865727");
    expect(url.searchParams.get("ued")).toBe(offer.destinationUrl);
    expect(Array.from(url.searchParams.keys()).sort()).toEqual(["awinaffid", "awinmid", "ued"]);
    expect(html()).toContain(offer.affiliateUrl.replaceAll("&", "&amp;"));
  });

  it("zeigt Reiseangebote ausschließlich für die freigegebenen Shows KDL, MJ, Eiskönigin, Prada, &Julia, TINA und ZIZ", () => {
    expect(getTravelcircusOffer("koenig-der-loewen")).toBe(offer);
    expect(getTravelcircusOffer("mj-musical")).toBe(MJ_TRAVELCIRCUS_OFFER);
    expect(getTravelcircusOffer("eiskoenigin")).toBe(EISKOENIGIN_TRAVELCIRCUS_OFFER);
    expect(getTravelcircusOffer("teufel-traegt-prada")).toBe(PRADA_TRAVELCIRCUS_OFFER);
    expect(getTravelcircusOffer("und-julia")).toBe(JULIA_TRAVELCIRCUS_OFFER);
    expect(getTravelcircusOffer("tina-das-musical")).toBe(TINA_TRAVELCIRCUS_OFFER);
    expect(getTravelcircusOffer("ziz")).toBe(ZIZ_TRAVELCIRCUS_OFFER);
    expect(getTravelcircusOffer("tanz-der-vampire")).toBe(TDV_TRAVELCIRCUS_OFFER);
    expect(getTravelcircusOffer("salon-rosie")).toBe(ROSIE_TRAVELCIRCUS_OFFER);
    for (const musical of musicals.filter((show) => show.id !== offer.musicalId && show.id !== MJ_TRAVELCIRCUS_OFFER.musicalId && show.id !== EISKOENIGIN_TRAVELCIRCUS_OFFER.musicalId && show.id !== PRADA_TRAVELCIRCUS_OFFER.musicalId && show.id !== JULIA_TRAVELCIRCUS_OFFER.musicalId && show.id !== TINA_TRAVELCIRCUS_OFFER.musicalId && show.id !== ZIZ_TRAVELCIRCUS_OFFER.musicalId && show.id !== TDV_TRAVELCIRCUS_OFFER.musicalId && show.id !== ROSIE_TRAVELCIRCUS_OFFER.musicalId)) {
      expect(getTravelcircusOffer(musical.id)).toBeUndefined();
    }
    expect(getTravelcircusOffer("unknown")).toBeUndefined();
  });

  it("verwendet das vollständige Hafenfoto als öffentliches 16:9-WebP mit expliziten Maßen und Fotografencredit", () => {
    const markup = html();
    expect(offer.imageUrl).toMatch(/^https:\/\/files\.manuscdn\.com\/.*\.webp$/);
    expect(offer.imageUrl).toContain("RrpSTmvrCaqJrNbs.webp");
    expect(markup).toContain('width="1920" height="1080"');
    expect(markup).toContain("object-contain");
    expect(markup).toContain(offer.imageAlt);
    expect(markup).toContain("Foto: Morris Mac Matzen");
    expect(markup).toContain("<figcaption");
    expect(markup).not.toContain("gelbes Löwen-Artwork");
    expect(markup).not.toMatch(/object-cover|scale-|manus-storage/);
  });

  it("kennzeichnet Anbieter und Werbung mit zugänglichem direkten CTA ohne Referrerunterdrückung", () => {
    const markup = html();
    expect(markup).toContain("Anzeige · Affiliate-Link");
    expect(markup).toContain("Travelcircus");
    expect(markup).toContain("Ticket + Hotel ansehen");
    expect(markup).toContain('target="_blank" rel="sponsored noopener"');
    expect(markup).toContain("öffnet in neuem Tab");
    expect(markup).not.toContain("noreferrer");
  });

  it("hat ohne optionale Einwilligung denselben direkten Pfad und lädt keine Partnerpixel oder Skripte", () => {
    const source = readFileSync(new URL("./TravelcircusOfferBox.tsx", import.meta.url), "utf8");
    expect(source).not.toMatch(/useConsent|AffiliateImpressionPixel|useSafeAffiliateTicketLink|<script|window\.open|trackAffiliateTicketClick/);
    expect(html()).not.toMatch(/<script|<iframe|cshow\.php|imp\.tradedoubler/);
    expect((html().match(/<a /g) ?? []).length).toBe(2); // Direktes Angebot und separat freigegebenes Anbieterlogo.
  });

  it("tauscht nur bei KDL Reisebox und Stage-Anzeige: Box nach Galerie vor FAQ, Anzeige nach FAQ", () => {
    const source = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    const gallerySlot = source.slice(source.indexOf("{(visibleAfterGalleryCampaigns.length"), source.indexOf("{/* Show Facts + FAQ */}"));
    const faqSlot = source.slice(source.indexOf("{(afterFaqCampaigns.length > 0 || relocatedStageCampaign)"), source.indexOf("{/* Kampagnenanzeigen bleiben"));
    expect(gallerySlot).toContain('data-testid="after-gallery-campaign-section"');
    expect(gallerySlot).toContain("<TravelcircusOfferBox offer={travelcircusOffer} />");
    expect(source.indexOf("<MusicalGallery")).toBeLessThan(source.indexOf(gallerySlot));
    expect(source.indexOf(gallerySlot)).toBeLessThan(source.indexOf("<MusicalShowFacts"));
    expect(source.indexOf("<MusicalShowFacts")).toBeLessThan(source.indexOf(faqSlot));
    expect(faqSlot).toContain("<AovoCampaignBanner campaign={relocatedStageCampaign} sale={musical.sale} />");
    expect(faqSlot).not.toContain("<TravelcircusOfferBox");
    expect(source).toContain('afterGalleryCampaigns.find((campaign) => campaign.width === 300 && campaign.height === 250)');
    const prerender = readFileSync(new URL("../../../scripts/prerender-seo-routes.ts", import.meta.url), "utf8");
    expect(prerender).toContain("${travelOfferContent}${faqContent}");
    expect(html()).toContain("max-w-[750px]");
    expect(html()).toContain("md:grid-cols-");
  });

  it("zeigt die ausdrücklich verlangten Preise und alle fünf Inklusivleistungen", () => {
    const markup = html();
    expect(offer.priceFrom).toBe("119,00");
    expect(offer.originalPrice).toBe("145,00");
    expect(markup).toContain("Nur für kurze Zeit:");
    expect(markup).toContain("119,00 €");
    expect(markup).toMatch(/<del[^>]*>ab 145,00 €<\/del>/);
    expect(markup).toMatch(/<del class="text-sm text-gold"/);
    expect(markup).toContain("pro Person");
    expect(markup).toContain("Exklusiv für Travelcircus Kunden");
    expect(markup).toContain("Übernachtung in einem Premium Hotel nach Wahl");
    expect(markup).toContain("Tägliches Frühstück im gewählten Hotel");
    expect(markup).toContain("Tickets für Disneys DER KÖNIG DER LÖWEN Musical");
    expect(markup).toContain("Schiff-Shuttleservice von den Landungsbrücken zum Theater");
    expect(markup).toContain("Weitere Extras, je nach gewähltem Hotel");
    expect((markup.match(/<li /g) ?? []).length).toBe(5);
    expect(markup).toContain("Preis und Verfügbarkeit je nach Termin und Hotel");
    expect(markup).not.toMatch(/% sparen|BLACK SALE|FreizeitparkDeals|partner-referral/);
  });

  it("nennt auf ausdrücklichen Nutzerwunsch weder Bestpreisgarantie noch Stornierungshinweise", () => {
    const markup = html();
    expect(markup).not.toContain('data-testid="travelcircus-offer-assurances"');
    expect(markup).not.toContain("Bestpreisgarantie");
    expect(markup).not.toContain("lucide-check");
    expect(markup).not.toContain("Kostenlos stornierbar");
    expect(markup).not.toMatch(/Stornierung|Stornokosten/);
  });
});
