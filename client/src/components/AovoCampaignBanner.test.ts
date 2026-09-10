import { statSync } from "node:fs";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AOVO_CAMPAIGNS,
  getAovoCampaign,
  getAovoCampaigns,
  getAovoCampaignClickUrl,
  getAovoCampaignImpressionUrl,
} from "./AovoCampaignBanner";

describe("Aovo campaign banners", () => {
  it("maps all provided musical campaigns to unique tracking group IDs", () => {
    expect(AOVO_CAMPAIGNS).toHaveLength(12);
    expect(AOVO_CAMPAIGNS.map((campaign) => campaign.musicalId)).toEqual([
      "moulinrouge",
      "salon-rosie",
      "teufel-traegt-prada",
      "eiskoenigin",
      "koenig-der-loewen",
      "mj-musical",
      "mj-musical",
      "ziz",
      "tarzan",
      "starlight-express",
      "wir-sind-am-leben",
      "und-julia",
    ]);
    expect(new Set(AOVO_CAMPAIGNS.map((campaign) => campaign.groupId)).size).toBe(12);
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

  it("keeps the supplied 300 × 250 creatives at native dimensions", () => {
    expect(getAovoCampaign("eiskoenigin")).toMatchObject({
      width: 300,
      height: 250,
      imageUrl: "/images/show-visuals/die-eiskoenigin-300x250.png",
    });
    expect(getAovoCampaign("tarzan")).toMatchObject({
      width: 300,
      height: 250,
      imageUrl: "/images/show-visuals/tarzan-300x250.png",
    });
    expect(getAovoCampaign("mj-musical")).toMatchObject({
      groupId: "26180466",
      width: 300,
      height: 250,
      imageUrl: "/images/show-visuals/mj-stage-salesweek-26180466-300x250.jpg?v=20260910",
      trackingNetwork: "stage",
      placement: "after-ticket-box",
      adLabel: "MJ-Ticketangebot",
      clickAriaLabel: "MJ-Ticketangebot in neuem Tab öffnen",
    });
  });

  it("uses the supplied Stage Entertainment tracking and in-story placement for Wir sind am Leben and & Julia", () => {
    const undJulia = getAovoCampaign("und-julia");
    const wirSindAmLeben = getAovoCampaign("wir-sind-am-leben");
    const mj = getAovoCampaign("mj-musical");

    expect(undJulia).toMatchObject({
      groupId: "26185666",
      width: 728,
      height: 90,
      trackingNetwork: "stage",
      placement: "before-story-paragraph",
      storyParagraphIndex: 2,
    });
    expect(wirSindAmLeben).toMatchObject({ groupId: "26185700", trackingNetwork: "stage" });
    expect(mj).toMatchObject({
      groupId: "26180466",
      trackingNetwork: "stage",
      placement: "after-ticket-box",
    });
    expect(getAovoCampaigns("mj-musical")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26180462",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 2,
        imageUrl: "/images/show-visuals/mj-stage-salesweek-26180462-728x90.jpg?v=20260910",
      }),
    ]));
    expect(getAovoCampaignClickUrl("26185666", "stage")).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26185666"
    );
    expect(getAovoCampaignImpressionUrl("26185666", "123456789", "stage")).toBe(
      "https://visit.stage-entertainment.de/imp?type(img)g(26185666)a(3492604)123456789"
    );
  });

  it("liefert die bereitgestellten MJ-Originalgrafiken als öffentliche Produktionsassets aus", () => {
    const banner300 = statSync(new URL("../../public/images/show-visuals/mj-stage-salesweek-26180466-300x250.jpg", import.meta.url));
    const banner728 = statSync(new URL("../../public/images/show-visuals/mj-stage-salesweek-26180462-728x90.jpg", import.meta.url));

    expect(banner300.size).toBeGreaterThan(0);
    expect(banner728.size).toBeGreaterThan(0);
    expect(banner300.mode & 0o444).toBeGreaterThan(0);
    expect(banner728.mode & 0o444).toBeGreaterThan(0);
  });

  it("rendert Kampagnencreatives als native Bilder mit ihren vorgegebenen Abmessungen", () => {
    const componentSource = readFileSync(new URL("./AovoCampaignBanner.tsx", import.meta.url), "utf8");

    expect(componentSource).toContain("<img");
    expect(componentSource).toContain("src={campaign.imageUrl}");
    expect(componentSource).toContain("width={campaign.width}");
    expect(componentSource).toContain("height={campaign.height}");
  });
});
