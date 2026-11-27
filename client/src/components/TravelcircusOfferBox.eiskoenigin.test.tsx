import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TravelcircusOfferBox from "./TravelcircusOfferBox";
import { getAovoCampaigns } from "./AovoCampaignBanner";
import { getTravelcircusOffer, EISKOENIGIN_TRAVELCIRCUS_OFFER as offer } from "@/lib/travelcircus-offers";

const html = () => renderToStaticMarkup(<TravelcircusOfferBox offer={offer} />);

describe("Eiskönigin Travelcircus-Reisebox – Nutzerfreigabe 27.11.2026", () => {
  it("verwendet den exakten eigenen Awin-Deeplink und ausschließlich das freigegebene Eiskönigin-Ziel", () => {
    expect(getTravelcircusOffer("eiskoenigin")).toBe(offer);
    expect(offer.affiliateUrl).toBe("https://www.awin1.com/cread.php?awinmid=9151&awinaffid=2865727&ued=https%3A%2F%2Fwww.travelcircus.de%2Feiskoenigin-das-musical");
    const url = new URL(offer.affiliateUrl);
    expect(url.searchParams.get("awinmid")).toBe("9151");
    expect(url.searchParams.get("awinaffid")).toBe("2865727");
    expect(url.searchParams.get("ued")).toBe("https://www.travelcircus.de/eiskoenigin-das-musical");
    expect(Array.from(url.searchParams.keys()).sort()).toEqual(["awinaffid", "awinmid", "ued"]);
    expect(html()).toContain(offer.affiliateUrl.replaceAll("&", "&amp;"));
  });

  it("nennt Stuttgart und genau die vier Nutzerleistungen ohne Hamburger Schiff-Shuttle", () => {
    const markup = html();
    expect(offer.city).toBe("Stuttgart");
    expect(markup).toContain("Disneys DIE EISKÖNIGIN – Das Musical");
    expect(markup).toContain("Exklusiv für Travelcircus Kunden");
    for (const text of [
      "Übernachtung in einem Premium Hotel deiner Wahl in Stuttgart",
      "Tägliches Frühstück im gewählten Hotel",
      "Eintrittskarten für Disneys DIE EISKÖNIGIN – Das Musical in Stuttgart",
      "Weitere Extras, je nach gewähltem Hotel",
    ]) expect(markup).toContain(text);
    expect((markup.match(/<li /g) ?? []).length).toBe(4);
    expect(offer.includesShuttle).toBe(false);
    expect(markup).not.toMatch(/Hamburg|Landungsbrücken|Schiff-Shuttleservice|lucide-ship|Michael Jackson|KÖNIG DER LÖWEN/);
  });

  it("zeigt ab109 Euro pro Person und ab135 Euro als goldfarbenen Streichpreis", () => {
    expect(offer.priceFrom).toBe("109,00");
    expect(offer.originalPrice).toBe("135,00");
    expect(html()).toContain("Nur für kurze Zeit:");
    expect(html()).toContain("109,00 €");
    expect(html()).toMatch(/<del class="text-sm text-gold"[^>]*>ab 135,00 €<\/del>/);
    expect(html()).toContain("pro Person");
    expect(html()).toContain("Preis und Verfügbarkeit je nach Termin und Hotel");
    expect(html()).not.toMatch(/% sparen|BLACK SALE/);
  });

  it("verwendet das vollständige Apollo-Theater-Foto als öffentliches WebP mit seinen Ausgabemaßen", () => {
    expect(offer.imageUrl).toBe("https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/qbxITJacXQfeQODd.webp");
    expect(offer.imageWidth).toBe(1920);
    expect(offer.imageHeight).toBe(1083);
    expect(html()).toContain('width="1920" height="1083"');
    expect(html()).toContain(offer.imageAlt);
    expect(html()).toContain("Stage Apollo Theater · Stuttgart");
    expect(html()).toContain("object-contain");
    expect(html()).not.toMatch(/object-cover|scale-|manus-storage|Morris Mac Matzen/);
  });

  it("zeigt das native Travelcircus-Logo ohne unfreigegebene Scripts oder NoJS-Impressionen", () => {
    expect(html()).toContain("NFyuZHcQZdnHEeat.jpg");
    expect(html()).toContain("https://www.awin1.com/cread.php?s=4803309&amp;v=9151&amp;q=319940&amp;r=2865727");
    expect(html()).toContain('target="_blank" rel="sponsored noopener"');
    expect((html().match(/<a /g) ?? []).length).toBe(2);
    expect(html()).not.toMatch(/<script|<iframe|cshow\.php|noreferrer|Bestpreisgarantie|Stornierung|Kostenlos stornierbar/);
  });

  it("behält beide nativen Stage-Banner und begrenzt den Anzeigen-Platztausch weiter auf KDL", () => {
    const campaigns = getAovoCampaigns("eiskoenigin");
    expect(campaigns).toHaveLength(2);
    expect(campaigns.find(({ groupId }) => groupId === "26185658")?.placement).toBe("within-detail-description");
    expect(campaigns.find(({ groupId }) => groupId === "26185656")?.placement).toBe("after-gallery");
    const detail = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    expect(detail).toContain('const relocatedStageCampaign = musical.id === "koenig-der-loewen" && travelcircusOffer');
    expect(detail.indexOf("<MusicalGallery")).toBeLessThan(detail.indexOf("<TravelcircusOfferBox offer={travelcircusOffer} />"));
    expect(detail.indexOf("<TravelcircusOfferBox offer={travelcircusOffer} />")).toBeLessThan(detail.indexOf("<MusicalShowFacts"));
    expect(readFileSync(new URL("../pages/CityDetail.tsx", import.meta.url), "utf8")).not.toContain("EISKOENIGIN_TRAVELCIRCUS_OFFER");
  });
});
