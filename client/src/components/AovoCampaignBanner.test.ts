import { describe, expect, it } from "vitest";
import {
  AOVO_CAMPAIGNS,
  getAovoCampaign,
  getAovoCampaignClickUrl,
  getAovoCampaignImpressionUrl,
} from "./AovoCampaignBanner";

describe("Aovo campaign banners", () => {
  it("maps all eleven provided musical campaigns to unique tracking group IDs", () => {
    expect(AOVO_CAMPAIGNS).toHaveLength(11);
    expect(AOVO_CAMPAIGNS.map((campaign) => campaign.musicalId)).toEqual([
      "moulinrouge",
      "salon-rosie",
      "teufel-traegt-prada",
      "eiskoenigin",
      "koenig-der-loewen",
      "mj-musical",
      "ziz",
      "tarzan",
      "starlight-express",
      "wir-sind-am-leben",
      "und-julia",
    ]);
    expect(new Set(AOVO_CAMPAIGNS.map((campaign) => campaign.groupId)).size).toBe(11);
  });

  it("keeps the provided Moulin Rouge campaign dimensions and tracking URLs", () => {
    const campaign = getAovoCampaign("moulinrouge");
    expect(campaign).toMatchObject({
      groupId: "26068414",
      width: 750,
      height: 200,
      imageUrl: "/images/show-visuals/moulin-rouge-750x200.png",
    });
    expect(getAovoCampaignClickUrl("26068414")).toBe(
      "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26068414"
    );
    expect(getAovoCampaignImpressionUrl("26068414", "123456789")).toBe(
      "https://imp.tradedoubler.com/imp?type(img)g(26068414)a(3492604)123456789"
    );
  });

  it("uses the supplied Stage Entertainment tracking for Wir sind am Leben and & Julia", () => {
    const undJulia = getAovoCampaign("und-julia");
    const wirSindAmLeben = getAovoCampaign("wir-sind-am-leben");

    expect(undJulia).toMatchObject({ groupId: "26185666", trackingNetwork: "stage", placement: "before-usp" });
    expect(wirSindAmLeben).toMatchObject({ groupId: "26185700", trackingNetwork: "stage" });
    expect(getAovoCampaignClickUrl("26185666", "stage")).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26185666"
    );
    expect(getAovoCampaignImpressionUrl("26185666", "123456789", "stage")).toBe(
      "https://visit.stage-entertainment.de/imp?type(img)g(26185666)a(3492604)123456789"
    );
  });
});
