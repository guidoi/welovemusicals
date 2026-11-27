import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TravelcircusOfferBox from "./TravelcircusOfferBox";
import { getTravelcircusOffer, KDL_TRAVELCIRCUS_OFFER as offer } from "@/lib/travelcircus-offers";
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

  it("zeigt das neue Reiseangebot ausschließlich für König der Löwen", () => {
    expect(getTravelcircusOffer("koenig-der-loewen")).toBe(offer);
    for (const musical of musicals.filter((show) => show.id !== offer.musicalId)) {
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

  it("behält den kompakten Nach-FAQ-Slot und mobil gestapelte Darstellung bei", () => {
    const source = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    const slot = source.slice(source.indexOf("{(afterFaqCampaigns.length > 0 || travelcircusOffer)"), source.indexOf("{/* Kampagnenanzeigen bleiben"));
    expect(slot).toContain('data-testid="after-faq-campaign-section"');
    expect(slot).toContain("<TravelcircusOfferBox offer={travelcircusOffer} />");
    expect(source.indexOf("<MusicalShowFacts")).toBeLessThan(source.indexOf(slot));
    expect(source.indexOf(slot)).toBeLessThan(source.indexOf("{/* Related Musicals"));
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

  it("zeigt die bestätigte Bestpreisgarantie mit kleinem Häkchen, ohne pauschale kostenlose Ticketstornierung zu versprechen", () => {
    const markup = html();
    expect(markup).toContain('data-testid="travelcircus-offer-assurances"');
    expect(markup).toContain("Bestpreisgarantie");
    expect(markup).toContain("lucide-check");
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain("Kostenlos stornierbar");
  });
});
