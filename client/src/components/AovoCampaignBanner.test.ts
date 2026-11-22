import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AOVO_CAMPAIGNS,
  getAovoCampaign,
  getAovoCampaigns,
  getAovoCampaignClickUrl,
  getAovoCampaignImpressionUrl,
  resolveAovoCampaignClickUrl,
  getAovoCampaignImageUrl,
  isAovoCampaignVisible,
} from "./AovoCampaignBanner";

describe("Aovo campaign banners", () => {
  it("ordnet die vier nativen WBT-Banner nur Berlin und Hamburg zu und blendet sie zum Aktionsende aus", () => {
    const campaigns = getAovoCampaigns("weihnachten-mit-bibi-tina");
    expect(campaigns.map(({ city, groupId, width, height }) => ({ city, groupId, width, height }))).toEqual([
      { city: "Hamburg", groupId: "26185746", width: 728, height: 90 },
      { city: "Hamburg", groupId: "26185744", width: 300, height: 250 },
      { city: "Berlin", groupId: "26185738", width: 728, height: 90 },
      { city: "Berlin", groupId: "26185736", width: 300, height: 250 },
    ]);
    const sale = { label: "BLACK SALE", discount: "BIS 30 %", validUntil: "2026-11-30" };
    for (const campaign of campaigns) {
      expect(resolveAovoCampaignClickUrl(campaign)).toBe(`https://clk.tradedoubler.com/click?p=394206&a=3492604&g=${campaign.groupId}`);
      expect(getAovoCampaignImpressionUrl(campaign.groupId, "123", campaign.trackingNetwork)).toBe(`https://visit.stage-entertainment.de/imp?type(img)g(${campaign.groupId})a(3492604)123`);
      expect(campaign.imageUrl).toMatch(/\.jpg$/);
      expect(isAovoCampaignVisible(campaign, sale, new Date("2026-11-30T23:59:58"))).toBe(true);
      expect(isAovoCampaignVisible(campaign, sale, new Date("2026-12-01T00:00:00"))).toBe(false);
      expect(isAovoCampaignVisible(campaign, undefined, new Date("2026-11-22T12:00:00"))).toBe(false);
      expect(isAovoCampaignVisible(campaign, { ...sale, validUntil: "2026-11-22" }, new Date("2026-11-23T12:00:00"))).toBe(false);
      expect(isAovoCampaignVisible(campaign, { ...sale, validFrom: "2026-11-28" }, new Date("2026-11-22T12:00:00"))).toBe(false);
      expect(isAovoCampaignVisible(campaign, { ...sale, validUntil: "2027-11-30" }, new Date("2027-11-22T12:00:00"))).toBe(false);
    }
  });

  it("verknüpft alle eindeutig freigegebenen Black-Sale-Creatives mit passenden Stage-IDs und begrenzter Laufzeit", () => {
    const expected = {
      "26185722": "UJgPKhwhnwJwDgxx.jpg",
      "26185720": "tuNHqvCYYXYuTFZC.jpg",
      "26185658": "owWZZGWpRzIstsol.jpg",
      "26185656": "xkxRczJddsOAlGMV.jpg",
      "26180470": "XJUIQKKUaULjNyHO.jpg",
      "26180466": "KVRTmqSgMjYOHZiY.jpg",
      "26180462": "odQonaPQiRcLmGKP.jpg",
      "26185502": "VYqCMmjdsLjwDixM.jpg",
      "26185500": "EhkNrPdpwvFlzEQv.jpg",
      "26185666": "mviShaCbXqtJIjsj.jpg",
      "26185664": "awRytLNRSmByGCfT.jpg",
      "26185700": "mxowpUldrZlyEZrT.jpg",
      "26185698": "VxqBEqBNXMPdspJI.jpg",
    };
    const sale = { label: "SALE", discount: "BIS 30 %", validUntil: "2026-11-30" };
    for (const [groupId, asset] of Object.entries(expected)) {
      const campaign = AOVO_CAMPAIGNS.find((item) => item.groupId === groupId)!;
      expect(resolveAovoCampaignClickUrl(campaign)).toBe(`https://clk.tradedoubler.com/click?p=394206&a=3492604&g=${groupId}`);
      expect(getAovoCampaignImpressionUrl(groupId, "123", campaign.trackingNetwork)).toBe(`https://visit.stage-entertainment.de/imp?type(img)g(${groupId})a(3492604)123`);
      expect(getAovoCampaignImageUrl(campaign, sale, new Date("2026-11-22T12:00:00"))).toBe(`https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/${asset}`);
      expect(getAovoCampaignImageUrl(campaign, undefined, new Date("2026-11-22T12:00:00"))).toBe(campaign.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, sale, new Date("2026-12-01T00:00:00"))).toBe(campaign.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, { ...sale, validFrom: "2026-11-28" }, new Date("2026-11-22T12:00:00"))).toBe(campaign.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, { ...sale, validUntil: "2027-11-30" }, new Date("2027-11-22T12:00:00"))).toBe(campaign.imageUrl);
    }
    const untouched = AOVO_CAMPAIGNS.filter((item) => !item.clickUrl);
    expect(untouched.map((item) => item.groupId)).toEqual(["26180460", "26068528", "26068482", "26185546", "26185544"]);
    for (const campaign of untouched) {
      expect(campaign.promotion).toBeUndefined();
      expect(resolveAovoCampaignClickUrl(campaign)).toBe(getAovoCampaignClickUrl(campaign.groupId, campaign.trackingNetwork));
      expect(resolveAovoCampaignClickUrl(campaign)).toBe(campaign.trackingNetwork === "stage"
        ? `https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=${campaign.groupId}`
        : `https://clk.tradedoubler.com/click?p=377032&a=3492604&g=${campaign.groupId}`);
    }
    expect(AOVO_CAMPAIGNS.find((item) => item.groupId === "26180462")?.musicalId).toBe("mj-musical");
    expect(AOVO_CAMPAIGNS.find((item) => item.groupId === "26185500")?.musicalId).toBe("ziz");
  });

  it.each([
    {
      musicalId: "tanz-der-vampire", groupId: "26185674", width: 728, height: 90,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tDBGPfoLhwaJKjUn.jpg",
      placement: "within-detail-description", detailParagraphIndex: 4,
      clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185674",
      impressionUrl: "https://visit.stage-entertainment.de/imp?type(img)g(26185674)a(3492604)123456789",
    },
    {
      musicalId: "tanz-der-vampire", groupId: "26185672", width: 300, height: 250,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/rhQrRnQFCqgoFCBr.jpg",
      placement: "after-gallery", detailParagraphIndex: undefined,
      clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185672",
      impressionUrl: "https://visit.stage-entertainment.de/imp?type(img)g(26185672)a(3492604)123456789",
    },
    {
      musicalId: "tina-das-musical", groupId: "26204070", width: 728, height: 90,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/NoaaqXXsebwRvAeb.jpg",
      placement: "within-detail-description", detailParagraphIndex: 2,
      clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26204070",
      impressionUrl: "https://visit.stage-entertainment.de/imp?type(img)g(26204070)a(3492604)123456789",
    },
    {
      musicalId: "tina-das-musical", groupId: "26204068", width: 300, height: 250,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/llOBXxpQYhaNzRBy.jpg",
      placement: "after-gallery", detailParagraphIndex: undefined,
      clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26204068",
      impressionUrl: "https://visit.stage-entertainment.de/imp?type(img)g(26204068)a(3492604)123456789",
    },
  ])("löst den genehmigten Click für $musicalId/$groupId exakt auf und behält Bild, Format, Placement und Stage-Impression bei", (expected) => {
    const campaigns = getAovoCampaigns(expected.musicalId);
    expect(campaigns).toHaveLength(2);
    const campaign = campaigns.find((item) => item.groupId === expected.groupId)!;
    expect(campaign).toMatchObject({
      musicalId: expected.musicalId, groupId: expected.groupId,
      width: expected.width, height: expected.height, imageUrl: expected.imageUrl,
      trackingNetwork: "stage", placement: expected.placement, clickUrl: expected.clickUrl,
    });
    expect(campaign.detailParagraphIndex).toBe(expected.detailParagraphIndex);
    expect(campaign.promotion).toBeUndefined();
    expect(resolveAovoCampaignClickUrl(campaign)).toBe(expected.clickUrl);
    expect(getAovoCampaignImageUrl(campaign)).toBe(expected.imageUrl);
    expect(getAovoCampaignImageUrl(campaign, { label: "SALE", discount: "BIS 30 %", validUntil: "2026-11-30" }, new Date("2026-11-22T12:00:00"))).toBe(expected.imageUrl);
    expect(getAovoCampaignImpressionUrl(campaign.groupId, "123456789", campaign.trackingNetwork)).toBe(expected.impressionUrl);
  });

  it("zeigt Stuttgart als eigenständige Vorverkaufsanzeige, nie als Hamburger Rabattcreative", () => {
    const campaign = AOVO_CAMPAIGNS.find((item) => item.groupId === "26229530")!;
    expect(campaign).toMatchObject({ musicalId: "ziz", width: 300, height: 250, placement: "within-season-announcement", trackingNetwork: "stage" });
    expect(campaign.promotion).toBeUndefined();
    expect(resolveAovoCampaignClickUrl(campaign)).toBe("https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26229530");
    expect(getAovoCampaignImageUrl(campaign, { label: "SALE", discount: "BIS 40 %" })).toBe(campaign.imageUrl);
  });

  it("integriert die Prada-Black-Friday-Motive und exakten URLs, ohne Stage-Impressionen umzuleiten", () => {
    const expected = [
      { groupId: "26185640", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/xHKXvjHHESEEEovz.jpg" },
      { groupId: "26185638", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/ZLfXGtmkrHGOoNOx.jpg" },
    ];
    const sale = { label: "SALE", discount: "Bis 15 % sparen", validUntil: "2026-11-30" };
    for (const entry of expected) {
      const campaign = getAovoCampaigns("teufel-traegt-prada").find((item) => item.groupId === entry.groupId)!;
      expect(campaign.trackingNetwork).toBe("stage");
      expect(resolveAovoCampaignClickUrl(campaign)).toBe(`https://clk.tradedoubler.com/click?p=394206&a=3492604&g=${entry.groupId}`);
      expect(getAovoCampaignImpressionUrl(entry.groupId, "123", campaign.trackingNetwork)).toBe(`https://visit.stage-entertainment.de/imp?type(img)g(${entry.groupId})a(3492604)123`);
      expect(getAovoCampaignImageUrl(campaign, sale, new Date("2026-11-21T12:00:00"))).toBe(entry.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, sale, new Date("2026-11-30T23:59:58"))).toBe(entry.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, sale, new Date("2026-12-01T00:00:00"))).toBe(campaign.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, undefined, new Date("2026-11-21T12:00:00"))).toBe(campaign.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, { ...sale, validFrom: "2026-11-28" }, new Date("2026-11-21T12:00:00"))).toBe(campaign.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, { ...sale, validUntil: "2026-11-22" }, new Date("2026-11-23T12:00:00"))).toBe(campaign.imageUrl);
      expect(getAovoCampaignImageUrl(campaign, { ...sale, validUntil: "2027-11-30" }, new Date("2027-11-21T12:00:00"))).toBe(campaign.imageUrl);
    }
  });

  it("maps all provided musical campaigns to unique tracking group IDs", () => {
    expect(AOVO_CAMPAIGNS).toHaveLength(29);
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
      "ziz",
      "weihnachten-mit-bibi-tina",
      "weihnachten-mit-bibi-tina",
      "weihnachten-mit-bibi-tina",
      "weihnachten-mit-bibi-tina",
    ]);
    expect(new Set(AOVO_CAMPAIGNS.map((campaign) => campaign.groupId)).size).toBe(29);
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
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/NoaaqXXsebwRvAeb.jpg",
      }),
      expect.objectContaining({
        groupId: "26204068",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/llOBXxpQYhaNzRBy.jpg",
      }),
    ]));
    expect(resolveAovoCampaignClickUrl(getAovoCampaign("tina-das-musical")!)).toBe(
      "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26204070"
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
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/osgmYIWPeOyuZfSn.jpg",
      }),
      expect.objectContaining({
        groupId: "26185656",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/lqNxRsgKDNJxTxBA.jpg",
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
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/HcQFjBBQPyQprfJy.jpg",
      }),
      expect.objectContaining({
        groupId: "26185500",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WTvQqjFUcwszTzyS.jpg",
      }),
    ]));
    expect(getAovoCampaign("mj-musical")).toMatchObject({
      groupId: "26180466",
      width: 300,
      height: 250,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tiqvXnBdPglWxtcQ.jpg",
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
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/iZLYVRYfnhSMdcWc.jpg",
      }),
      expect.objectContaining({
        groupId: "26185664",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/iyfrmzybzwFtZpud.jpg",
      }),
    ]));
    expect(wirSindAmLeben).toMatchObject({
      groupId: "26185700",
      width: 728,
      height: 90,
      trackingNetwork: "stage",
      placement: "within-detail-description",
      detailParagraphIndex: 4,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XAikZZLFOHfLKdhM.jpg",
    });
    expect(getAovoCampaigns("wir-sind-am-leben")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26185698",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/xcZOVgRQGIktemOe.jpg",
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
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/nNJlNqZzBBkFCxEw.jpg",
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
      expect.objectContaining({ groupId: "26185722", width: 728, height: 90, trackingNetwork: "stage", placement: "within-detail-description", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WYnMWynDOdrKGiFW.jpg" }),
      expect.objectContaining({ groupId: "26185720", width: 300, height: 250, trackingNetwork: "stage", placement: "after-gallery", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/BPkgBMtaBRmniDPS.jpg" }),
    ]));
    expect(getAovoCampaigns("tanz-der-vampire")).toEqual(expect.arrayContaining([
      expect.objectContaining({ groupId: "26185674", width: 728, height: 90, trackingNetwork: "stage", placement: "within-detail-description", detailParagraphIndex: 4, imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tDBGPfoLhwaJKjUn.jpg" }),
      expect.objectContaining({ groupId: "26185672", width: 300, height: 250, trackingNetwork: "stage", placement: "after-gallery", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/rhQrRnQFCqgoFCBr.jpg" }),
    ]));
    expect(getAovoCampaigns("teufel-traegt-prada")).toEqual(expect.arrayContaining([
      expect.objectContaining({ groupId: "26185640", width: 728, height: 90, trackingNetwork: "stage", placement: "within-detail-description", detailParagraphIndex: 4, imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/QWKJdWesQhytFcux.jpg" }),
      expect.objectContaining({ groupId: "26185638", width: 300, height: 250, trackingNetwork: "stage", placement: "after-gallery", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/UfrgocXJiuRcQTBu.jpg" }),
    ]));
  });

  it("ordnet die aktuellen KDL- und MJ-Aovo-Creatives der gewünschten Bannerhierarchie zu", () => {
    expect(getAovoCampaigns("koenig-der-loewen")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupId: "26180470",
        width: 728,
        height: 90,
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/TdEwZrFcppFjxYLL.jpg",
      }),
      expect.objectContaining({
        groupId: "26180460",
        width: 300,
        height: 250,
        trackingNetwork: "stage",
        placement: "after-gallery",
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XsclnrVkSHkqekmf.jpg",
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

  it("keeps the delivered Stage click targets for the new Salon Rosie, WSAL and KDL creatives", () => {
    const expectedStageClicks = ["26185722", "26185720", "26185700", "26185698", "26180470", "26180460"];

    for (const groupId of expectedStageClicks) {
      expect(getAovoCampaignClickUrl(groupId, "stage")).toBe(
        `https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=${groupId}`,
      );
    }
  });

  it("referenziert die aktuellen MJ-Creatives über dauerhafte Projekt-Asset-Adressen", () => {
    const mjCampaigns = getAovoCampaigns("mj-musical");

    expect(mjCampaigns.find((campaign) => campaign.groupId === "26180466")?.imageUrl).toBe(
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/tiqvXnBdPglWxtcQ.jpg"
    );
    expect(mjCampaigns.find((campaign) => campaign.groupId === "26180462")?.imageUrl).toBe(
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/nNJlNqZzBBkFCxEw.jpg"
    );
  });

  it("löst die ausdrücklich freigegebenen Click-Ziele für TINA, Prada und MJ exakt auf", () => {
    const expectedClicks = ["26204070", "26204068", "26185640", "26185638", "26180462", "26180466"];

    for (const groupId of expectedClicks) {
      const campaign = AOVO_CAMPAIGNS.find((item) => item.groupId === groupId)!;
      expect(resolveAovoCampaignClickUrl(campaign)).toBe(
        `https://clk.tradedoubler.com/click?p=394206&a=3492604&g=${groupId}`,
      );
    }
  });

  it("rendert Kampagnencreatives als native Bilder mit ihren vorgegebenen Abmessungen", () => {
    const componentSource = readFileSync(new URL("./AovoCampaignBanner.tsx", import.meta.url), "utf8");

    expect(componentSource).toContain("<img");
    expect(componentSource).toContain("src={getAovoCampaignImageUrl(campaign, sale)}");
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
