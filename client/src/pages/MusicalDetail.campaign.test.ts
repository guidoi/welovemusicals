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

  it("platziert nach der Ticketbox konfigurierte Kampagnen sichtbar vor Presse und Galerie", () => {
    const campaignPlacement = musicalDetailSource.indexOf('aovoCampaign?.placement === "after-ticket-box"');
    const pressQuotes = musicalDetailSource.indexOf("{/* Pressequotes */}");

    expect(campaignPlacement).toBeGreaterThan(-1);
    expect(pressQuotes).toBeGreaterThan(campaignPlacement);
    expect(musicalDetailSource).toContain('data-testid="after-ticket-box-campaign-section"');
  });

  it("rendert die Kampagne nach der Ticketbox nicht ein zweites Mal im unteren Kampagnenbereich", () => {
    expect(musicalDetailSource).toContain('aovoCampaign.placement !== "after-ticket-box"');
  });
});
