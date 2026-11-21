import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, musicals } from "./data";
import { getMusicalExperienceCategories } from "./experience-categories";
import { WBT_EDITORIAL_DRAFT, WBT_PENDING_BANNERS, WBT_PUBLICATION_REQUIREMENTS } from "./bibi-tina-weihnachten-draft";

describe("WBT – redaktionsfertiger Entwurf, fehlendes Affiliate-Material", () => {
  it("bleibt bis zur Lieferung gültiger Textlinks und nativer Bilder außerhalb des aktiven Katalogs", () => {
    expect(ACTIVE_MUSICAL_IDS).not.toContain(WBT_EDITORIAL_DRAFT.id);
    expect(musicals.find((show) => show.id === WBT_EDITORIAL_DRAFT.id)).toBeUndefined();
    expect(WBT_EDITORIAL_DRAFT).not.toHaveProperty("eventimUrl");
    expect(WBT_PUBLICATION_REQUIREMENTS.approvedTextLinks).toEqual({ showPage: null, Berlin: null, Hamburg: null });
    expect(WBT_PUBLICATION_REQUIREMENTS.approvedPrice).toBeNull();
    expect(WBT_EDITORIAL_DRAFT.priceFrom).toBeUndefined();
  });

  it("führt die bestätigten Spielzeiten und beide Erlebniswelten", () => {
    expect(getMusicalExperienceCategories(WBT_EDITORIAL_DRAFT)).toEqual(["weihnachten", "familie-maerchen-magie"]);
    expect(WBT_EDITORIAL_DRAFT.tourDates).toEqual([
      { city: "Berlin", venue: "Stage Theater des Westens", startDate: "2026-11-14", endDate: "2027-01-03" },
      { city: "Hamburg", venue: "Stage Operettenhaus", startDate: "2026-11-21", endDate: "2027-01-03" },
    ]);
    expect(WBT_EDITORIAL_DRAFT.tags).toHaveLength(3);
  });

  it("verwendet das gelieferte Querformat für Karte und Keyvisual und vier Fotos mit richtigem Credit", () => {
    expect(WBT_EDITORIAL_DRAFT.homepageArtworkImage).toBe(WBT_EDITORIAL_DRAFT.keyvisual);
    expect(WBT_EDITORIAL_DRAFT.keyvisualLandscape).toBe(true);
    expect(WBT_EDITORIAL_DRAFT.gallery).toHaveLength(4);
    for (const photo of WBT_EDITORIAL_DRAFT.gallery ?? []) {
      expect(photo.url).toMatch(/^https:\/\/files\.manuscdn\.com\/.*\.webp$/);
      expect(photo.alt).toContain("© Jörn Hartmann");
    }
    expect(WBT_EDITORIAL_DRAFT.quotes).toBeUndefined();
  });

  it("bewahrt die vier exakten Bannerlinks mit korrekten Maßen und eindeutigen Städten", () => {
    expect(WBT_PENDING_BANNERS.map(({ city, groupId, width, height }) => ({ city, groupId, width, height }))).toEqual([
      { city: "Hamburg", groupId: "26185746", width: 728, height: 90 },
      { city: "Hamburg", groupId: "26185744", width: 300, height: 250 },
      { city: "Berlin", groupId: "26185738", width: 728, height: 90 },
      { city: "Berlin", groupId: "26185736", width: 300, height: 250 },
    ]);
    for (const banner of WBT_PENDING_BANNERS) {
      expect(banner.clickUrl).toBe(`https://clk.tradedoubler.com/click?p=394206&a=3492604&g=${banner.groupId}`);
      expect(banner.imageUrl).toMatch(/^https:\/\/files\.manuscdn\.com\/.*\.jpg$/);
      expect(banner.placement).toBe(banner.width === 728 ? "within-detail-description" : "after-gallery");
    }
  });
});
