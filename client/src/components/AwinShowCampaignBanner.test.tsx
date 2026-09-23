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

  it("uses the supplied Moulin Rouge, Starlight, Biest and Rapunzel creative pairs at native dimensions", () => {
    const moulinRouge = getAwinShowCampaign("moulinrouge");
    const starlight = getAwinShowCampaign("starlight-express");
    const biest = getAwinShowCampaign("schoene-und-das-biest");
    const rapunzel = getAwinShowCampaign("rapunzel");
    const moulinRougeSquare = renderBanner("moulinrouge", "square");
    const starlightSquare = renderBanner("starlight-express", "square");

    expect(moulinRouge?.partner).toBe("atg");
    expect(moulinRouge?.wideDetailParagraphIndex).toBe(4);
    expect(moulinRouge?.creatives.wide.clickUrl).toContain("s=4782564");
    expect(moulinRouge?.creatives.square.clickUrl).toContain("s=4782560");
    expect(moulinRouge?.creatives.wide.imageUrl).toContain("UgTcyxPlEFQcQEfj.jpg");
    expect(moulinRouge?.creatives.square.imageUrl).toContain("LLbYiHYYucAcIsfS.jpg");
    expect(moulinRougeSquare).toContain('width="600"');
    expect(moulinRougeSquare).toContain('height="600"');
    expect(moulinRougeSquare).toContain('loading="eager"');
    expect(moulinRougeSquare).toContain('decoding="sync"');

    expect(starlight?.partner).toBe("atg");
    expect(starlight?.wideDetailParagraphIndex).toBe(2);
    expect(starlight?.creatives.wide.clickUrl).toContain("s=4785482");
    expect(starlight?.creatives.square.clickUrl).toContain("s=4785481");
    expect(starlight?.creatives.wide.imageUrl).toContain("cNjssQMFzIxxObAw.jpg");
    expect(starlight?.creatives.square.imageUrl).toContain("aVLvtLqeZGZpSyOm.jpg");
    expect(starlightSquare).toContain('width="320"');
    expect(starlightSquare).toContain('height="480"');

    expect(biest?.partner).toBe("eventim");
    expect(biest?.wideDetailParagraphIndex).toBe(3);
    expect(biest?.creatives.wide.clickUrl).toContain("s=3736769");
    expect(biest?.creatives.square.clickUrl).toContain("s=3736775");
    expect(biest?.creatives.wide.imageUrl).toContain("ofkQWvwvsFFYcItR.jpg");
    expect(biest?.creatives.square.imageUrl).toContain("GDrhbvoacicMlOjP.jpg");

    expect(rapunzel?.partner).toBe("eventim");
    expect(rapunzel?.wideDetailParagraphIndex).toBe(2);
    expect(rapunzel?.creatives.wide.clickUrl).toContain("s=4573325");
    expect(rapunzel?.creatives.square.clickUrl).toContain("s=4573313");
    expect(rapunzel?.creatives.wide.imageUrl).toContain("kXTJLZsyeoxkPzcT.jpg");
    expect(rapunzel?.creatives.square.imageUrl).toContain("NnlhNtybfKuJEoGP.jpg");
    expect(renderBanner("rapunzel", "wide")).toContain('loading="eager"');
    expect(renderBanner("rapunzel", "wide")).toContain('decoding="sync"');
    expect(renderBanner("rapunzel", "wide")).toContain("mt-3 mb-8 w-full md:my-8");
    expect(renderBanner("rapunzel", "square")).toContain("mx-auto my-8 w-full");
  });

  it("contains every supplied Awin and ATG campaign pair", () => {
    expect(AWIN_SHOW_CAMPAIGNS.map((campaign) => campaign.musicalId)).toEqual([
      "dreihaselnuesse",
      "gloeckner-von-notre-dame",
      "phantom-der-oper",
      "moulinrouge",
      "starlight-express",
      "schoene-und-das-biest",
      "rapunzel",
    ]);
  });
});
