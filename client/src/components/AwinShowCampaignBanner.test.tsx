import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConsentProvider } from "@/contexts/ConsentContext";
import AwinShowCampaignBanner, {
  AWIN_SHOW_CAMPAIGNS,
  getAwinShowCampaign,
} from "./AwinShowCampaignBanner";

function renderBanner(musicalId: string, format: "wide" | "square") {
  const campaign = getAwinShowCampaign(musicalId);
  if (!campaign) throw new Error(`Missing campaign for ${musicalId}`);

  return renderToStaticMarkup(
    <ConsentProvider>
      <AwinShowCampaignBanner campaign={campaign} format={format} />
    </ConsentProvider>,
  );
}

describe("AwinShowCampaignBanner", () => {
  it("keeps the supplied Eventim creatives for Drei Haselnüsse", () => {
    const campaign = getAwinShowCampaign("dreihaselnuesse");
    const wide = renderBanner("dreihaselnuesse", "wide");
    const square = renderBanner("dreihaselnuesse", "square");

    expect(campaign?.creatives.wide.clickUrl).toContain("s=3980776");
    expect(campaign?.creatives.square.clickUrl).toContain("s=3980773");
    expect(wide).toContain('data-campaign-id="3980776"');
    expect(wide).toContain('width="728"');
    expect(wide).toContain('height="90"');
    expect(square).toContain('data-campaign-id="3980773"');
    expect(square).toContain('width="300"');
    expect(square).toContain('height="250"');
  });

  it("keeps the supplied ATG creative IDs and formats for Glöckner and Phantom", () => {
    const gloeckner = getAwinShowCampaign("gloeckner-von-notre-dame");
    const phantom = getAwinShowCampaign("phantom-der-oper");
    const phantomSquare = renderBanner("phantom-der-oper", "square");

    expect(gloeckner?.partner).toBe("atg");
    expect(gloeckner?.creatives.wide.clickUrl).toContain("s=4882557");
    expect(gloeckner?.creatives.square.clickUrl).toContain("s=4882583");
    expect(phantom?.creatives.wide.clickUrl).toContain("s=4804894");
    expect(phantom?.creatives.square.clickUrl).toContain("s=4804889");
    expect(phantomSquare).toContain('width="320"');
    expect(phantomSquare).toContain('height="480"');
    expect(phantomSquare).toContain("ATG Tickets");
  });

  it("contains exactly the three newly supplied Awin and ATG campaign pairs", () => {
    expect(AWIN_SHOW_CAMPAIGNS.map((campaign) => campaign.musicalId)).toEqual([
      "dreihaselnuesse",
      "gloeckner-von-notre-dame",
      "phantom-der-oper",
    ]);
  });
});
