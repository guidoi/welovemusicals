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
    expect(AOVO_CAMPAIGNS).toHaveLength(24);
    expect(AOVO_CAMPAIGNS.map((campaign) => campaign.musicalId)).toEqual([
      "salon-rosie",
      "salon-rosie",
      "teufel-traegt-prada",
      "teufel-traegt-prada",
      "eiskoenigin",
      "eiskoenigin",
      "koenig-der-loewen",
      "koenig-der-loewen",
      "koenig-der-loewen",
      "mj-musical",
      "mj-musical",
      "mj-musical",
      "tina-das-musical",
      "tina-das-musical",
      "ziz",
      "ziz",
      "tarzan",
      "tarzan",
      "tanz-der-vampire",
      "tanz-der-vampire",
      "wir-sind-am-leben",
      "wir-sind-am-leben",
      "und-julia",
      "und-julia",
    ]);
    expect(new Set(AOVO_CAMPAIGNS.map((campaign) => campaign.groupId)).size).toBe(24);
  });

  it("uses the supplied native TINA creatives and Stage tracking IDs", () => {
    expect(getAovoCampaigns("tina-das-musical")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26204070",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 2,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/krTROylxWabyrCcC.jpg",
      }),
      expect.objectContaining({
        groupId: "26204068",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/fqeFcGbNUPrUgytq.jpg",
      }),
    ]));
    expect(getAovoCampaignClickUrl("26204070", "stage")).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26204070"
    );
    expect(getAovoCampaignImpressionUrl("26204068", "123456789", "stage")).toBe(
      "https://visit.stage-entertainment.de/imp?type(img)g(26204068)a(3492604)123456789"
    );
  });

  it("removes superseded unplaced Moulin Rouge and Starlight campaigns", () => {
    expect(getAovoCampaign("moulinrouge")).toBeUndefined();
    expect(getAovoCampaign("starlight-express")).toBeUndefined();
  });

  it("platziert das Eiskönigin-Querbanner nach dem abgeschlossenen Spektakel-Abschnitt und behält native Formate bei", () => {
    expect(getAovoCampaigns("eiskoenigin")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26185658",
        width: 729,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XAIAosoXydWgLiUv.jpg",
      }),
      expect.objectContaining({
        groupId: "26185656",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/wkPNMqjIKNhqFhlt.jpg",
      }),
    ]));
    expect(getAovoCampaigns("tarzan")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26185546",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/hMSLfxEDGvtpGuxe.jpg",
      }),
      expect.objectContaining({
        groupId: "26185544",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/kFgSOCDcCAnOWbkF.jpg",
      }),
    ]));
    expect(getAovoCampaigns("ziz")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26185502",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/BkyJevjHoYNAGGBb.jpg",
      }),
      expect.objectContaining({
        groupId: "26185500",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/zrbcvAjlcjmZFmkg.jpg",
      }),
    ]));
    expect(getAovoCampaign("mj-musical")).toMatchObject({
      groupId: "26180466",
      width: 300,
      height: 250,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/kqfKEqTblBouOywS.jpg",
      trackingNetwork: "stage",
      placement: "after-gallery",
      adLabel: "MJ-Ticketangebot",
      clickAriaLabel: "MJ-Ticketangebot in neuem Tab öffnen",
    });
  });

  it("uses the supplied Stage Entertainment tracking and in-description placement for Wir sind am Leben and & Julia", () => {
    const undJulia = getAovoCampaigns("und-julia");
    const wirSindAmLeben = getAovoCampaign("wir-sind-am-leben");
    const mj = getAovoCampaign("mj-musical");

    expect(undJulia).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26185666",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 3,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/zLhEgGUtvChrLSXQ.jpg",
      }),
      expect.objectContaining({
        groupId: "26185664",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/yGwFLzKjTQuzjxpb.jpg",
      }),
    ]));
    expect(wirSindAmLeben).toMatchObject({
      groupId: "26185700",
      width: 728,
      height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/GjHNFEoIcaLNLtYD.jpg",
    });
    expect(getAovoCampaigns("wir-sind-am-leben")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26185698",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VtiecJiBFLMHWhcC.jpg",
      }),
    ]));
    expect(mj).toMatchObject({
      groupId: "26180466",
      trackingNetwork: "stage",
      placement: "after-gallery",
    });
    expect(getAovoCampaigns("mj-musical")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26180462",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/yHDbGkiApdeTfiVB.jpg",
      }),
    ]));
    expect(getAovoCampaignClickUrl("26185666", "stage")).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26185666"
    );
    expect(getAovoCampaignImpressionUrl("26185666", "123456789", "stage")).toBe(
      "https://visit.stage-entertainment.de/imp?type(img)g(26185666)a(3492604)123456789"
    );
  });

  it("uses the delivered Stage creatives for Salon Rosie, Tanz der Vampire and Der Teufel trägt Prada", () => {
    expect(getAovoCampaigns("salon-rosie")).toEqual(expect.arrayContaining([
      expect.objectContaining({ groupId: "26185722", width: 728, height: 90, trackingNetwork: "stage", placement: "within-detail-description" }),
      expect.objectContaining({ groupId: "26185720", width: 300, height: 250, placement: "after-gallery" }),
    ]));
    expect(getAovoCampaigns("tanz-der-vampire")).toEqual(expect.arrayContaining([
      expect.objectContaining({ groupId: "26185674", width: 728, height: 90, trackingNetwork: "stage", placement: "within-detail-description", detailParagraphIndex: 4 }),
      expect.objectContaining({ groupId: "26185672", width: 300, height: 250, trackingNetwork: "stage", placement: "after-gallery" }),
    ]));
    expect(getAovoCampaigns("teufel-traegt-prada")).toEqual(expect.arrayContaining([
      expect.objectContaining({ groupId: "26185640", width: 728, height: 90, trackingNetwork: "stage", placement: "within-detail-description", detailParagraphIndex: 4 }),
      expect.objectContaining({ groupId: "26185638", width: 300, height: 250, trackingNetwork: "stage", placement: "after-gallery" }),
    ]));
  });

  it("ordnet die bereitgestellten KDL- und MJ-Aovo-Creatives der gewünschten Bannerhierarchie zu", () => {
    expect(getAovoCampaigns("koenig-der-loewen")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26180470",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/KGtCOEFGfgbQHHaH.jpg",
      }),
      expect.objectContaining({
        groupId: "26180460",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/IfbilkdRigknWprn.jpg",
      }),
      expect.objectContaining({
        groupId: "26068528",
        width: 750,
        height: 200,
        placement: "after-faq",
        compactTopSpacing: true,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/fSsmgKqWQourDufP.png",
      }),
    ]));
    expect(getAovoCampaigns("mj-musical")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26068482",
        width: 750,
        height: 200,
        placement: "after-faq",
        compactTopSpacing: true,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/gVVzRonIwuCZlwnB.png",
      }),
    ]));
    expect(getAovoCampaigns("mj-musical").some((campaign) => campaign.groupId === "26068476")).toBe(false);
    expect(getAovoCampaignClickUrl("26180470", "stage")).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26180470"
    );
    expect(getAovoCampaignClickUrl("26068482")).toBe(
      "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26068482"
    );
    expect(getAovoCampaignClickUrl("26068528")).toBe(
      "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26068528"
    );
  });

  it("referenziert die aktuellen MJ-Creatives über dauerhafte Projekt-Asset-Adressen", () => {
    const mjCampaigns = getAovoCampaigns("mj-musical");

    expect(mjCampaigns.find((campaign) => campaign.groupId === "26180466")?.imageUrl).toBe(
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/kqfKEqTblBouOywS.jpg"
    );
    expect(mjCampaigns.find((campaign) => campaign.groupId === "26180462")?.imageUrl).toBe(
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/yHDbGkiApdeTfiVB.jpg"
    );
  });

  it("rendert Kampagnencreatives als native Bilder mit ihren vorgegebenen Abmessungen", () => {
    const componentSource = readFileSync(new URL("./AovoCampaignBanner.tsx", import.meta.url), "utf8");

    expect(componentSource).toContain("<img");
    expect(componentSource).toContain("src={campaign.imageUrl}");
    expect(componentSource).toContain("width={campaign.width}");
    expect(componentSource).toContain("height={campaign.height}");
    expect(componentSource).toContain("campaign.compactTopSpacing");
    expect(componentSource).toContain('"relative mx-auto mt-2 w-full pt-2 md:mt-3 md:pt-3"');
    expect(componentSource).toContain('campaign.placement === "within-detail-description" && campaign.width >= 700');
    expect(componentSource).toContain('"relative mx-auto mt-3 mb-8 w-full pt-1 md:my-8 md:pt-6"');
    expect(componentSource).toContain('<AffiliateImpressionPixel');
    expect(componentSource).toContain('enabled={consent?.affiliateTracking === true}');
    expect(componentSource).toContain('url={impressionUrl}');
    expect(componentSource).not.toContain('new Image()');
    expect(componentSource).not.toContain("border-t border-gold/15");
    expect(componentSource).toContain(">Anzeige</p>");
  });
});
