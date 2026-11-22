import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, getMusicalBySlug } from "./data";
import { WBT_PENDING_BANNERS, WBT_PUBLICATION_REQUIREMENTS } from "./bibi-tina-weihnachten-draft";

describe("WBT – aktivierte Veröffentlichung und originales Affiliate-Material", () => {
  it("ist mit explizit freigegebenen Textlinks und Einstiegspreis aktiv", () => {
    const musical = getMusicalBySlug("weihnachten-mit-bibi-tina");
    expect(ACTIVE_MUSICAL_IDS).toContain("weihnachten-mit-bibi-tina");
    expect(musical).toBeDefined();
    expect(WBT_PUBLICATION_REQUIREMENTS.status).toBe("active");
    expect(WBT_PUBLICATION_REQUIREMENTS.approvedTextLinks).toEqual({
      showPage: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442",
      Berlin: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442",
      Hamburg: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26175768",
    });
    expect(musical?.eventimUrl).toBe(WBT_PUBLICATION_REQUIREMENTS.approvedTextLinks.Berlin);
    expect(musical?.ticketUrlsByCity).toEqual({
      Berlin: WBT_PUBLICATION_REQUIREMENTS.approvedTextLinks.Berlin,
      Hamburg: WBT_PUBLICATION_REQUIREMENTS.approvedTextLinks.Hamburg,
    });
    expect(WBT_PUBLICATION_REQUIREMENTS.approvedPrice).toBe("12,50");
    expect(musical?.priceFrom).toBe("12,50");
    expect(WBT_PUBLICATION_REQUIREMENTS.rollbackCheckpoint).toBe("3c21c548");
  });

  it("bewahrt die vier exakten Bannerlinks mit korrekten Maßen und eindeutigen Städten", () => {
    expect(WBT_PENDING_BANNERS.map(({ city, groupId, width, height }) => ({ city, groupId, width, height }))).toEqual([
      { city: "Hamburg", groupId: "26185746", width: 728, height: 90 },
      { city: "Hamburg", groupId: "26185744", width: 300, height: 250 },
      { city: "Berlin", groupId: "26185738", width: 728, height: 90 },
      { city: "Berlin", groupId: "26185736", width: 300, height: 250 },
    ]);
    expect(WBT_PENDING_BANNERS.map((banner) => banner.imageUrl)).toEqual([
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/wqFPKzdDqhtLuloh.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WtdGzhcRNTMHaPvn.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/TBfvDdCQTqmaXBEA.jpg",
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/EgOezITKRLrTBGfa.jpg",
    ]);
    for (const banner of WBT_PENDING_BANNERS) {
      expect(banner.clickUrl).toBe(`https://clk.tradedoubler.com/click?p=394206&a=3492604&g=${banner.groupId}`);
      expect(banner.placement).toBe(banner.width === 728 ? "within-detail-description" : "after-gallery");
    }
  });
});
