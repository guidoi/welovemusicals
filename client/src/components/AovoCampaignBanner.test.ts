import { describe, expect, it } from "vitest";
import {
  AOVO_CAMPAIGNS,
  getAovoCampaign,
  getAovoCampaignClickUrl,
  getAovoCampaignImpressionUrl,
} from "./AovoCampaignBanner";

describe("Aovo campaign banners", () => {
  it("maps all six provided musical campaigns to unique TradeDoubler group IDs", () => {
    expect(AOVO_CAMPAIGNS).toHaveLength(6);
    expect(AOVO_CAMPAIGNS.map((campaign) => campaign.musicalId)).toEqual([
      "moulinrouge",
      "salon-rosie",
      "teufel-traegt-prada",
      "eiskoenigin",
      "koenig-der-loewen",
      "mj-musical",
    ]);
    expect(new Set(AOVO_CAMPAIGNS.map((campaign) => campaign.groupId)).size).toBe(6);
  });

  it("keeps the provided Moulin Rouge campaign dimensions and tracking URLs", () => {
    const campaign = getAovoCampaign("moulinrouge");
    expect(campaign).toMatchObject({
      groupId: "26068414",
      width: 750,
      height: 200,
      imageUrl: "/images/advertising/aovo/moulin-rouge-750x200.png",
    });
    expect(getAovoCampaignClickUrl("26068414")).toBe(
      "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26068414"
    );
    expect(getAovoCampaignImpressionUrl("26068414", "123456789")).toBe(
      "https://imp.tradedoubler.com/imp?type(img)g(26068414)a(3492604)123456789"
    );
  });
});
