import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const musicalDetailSource = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");

describe("MJ-Kampagnenplatzierung", () => {
  it("platziert das schmale MJ-Banner in der Mitte des oberen Fließtexts", () => {
    const inlineCampaign = musicalDetailSource.indexOf('inlineDescriptionCampaign?.placement === "within-detail-description"');
    const tourDates = musicalDetailSource.indexOf("{/* Tour Dates */}");

    expect(inlineCampaign).toBeGreaterThan(-1);
    expect(tourDates).toBeGreaterThan(inlineCampaign);
    expect(musicalDetailSource).toContain('data-testid="within-detail-description-campaign"');
    expect(musicalDetailSource).toContain('data-testid="within-detail-description-campaign-mobile"');
    expect(musicalDetailSource).toContain('className="my-8 hidden lg:block"');
    expect(musicalDetailSource).toContain('className="my-8 lg:hidden"');
  });

  it("platziert große Kampagnen nach der Bildergalerie und vor dem Wissensbereich", () => {
    const gallery = musicalDetailSource.indexOf("{/* Gallery */}");
    const campaignPlacement = musicalDetailSource.indexOf('afterGalleryCampaigns.length > 0');
    const showFacts = musicalDetailSource.indexOf("{/* Show Facts + FAQ */}");

    expect(campaignPlacement).toBeGreaterThan(-1);
    expect(campaignPlacement).toBeGreaterThan(gallery);
    expect(showFacts).toBeGreaterThan(campaignPlacement);
    expect(musicalDetailSource).toContain('data-testid="after-gallery-campaign-section"');
  });

  it("platziert die Aovo-Reisekampagne getrennt nach FAQ und Hotelbereich", () => {
    const faqCampaign = musicalDetailSource.indexOf('afterFaqCampaigns.length > 0');
    const hotelSection = musicalDetailSource.indexOf('{/* HRS-Hotelbereich');
    const lowerCampaignSection = musicalDetailSource.indexOf('{/* Kampagnenanzeigen bleiben unabhängig');

    expect(faqCampaign).toBeGreaterThan(hotelSection);
    expect(lowerCampaignSection).toBeGreaterThan(faqCampaign);
    expect(musicalDetailSource).toContain('data-testid="after-faq-campaign-section"');
    expect(musicalDetailSource).toContain("hasCompactAfterFaqCampaign");
    expect(musicalDetailSource).toContain('"bg-background pt-2 pb-10 md:pt-3 md:pb-12"');
  });

  it("rendert platzierte Kampagnen nicht ein zweites Mal im unteren Kampagnenbereich", () => {
    expect(musicalDetailSource).toContain('aovoCampaign && !aovoCampaign.placement');
  });
});
