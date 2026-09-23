import { describe, expect, it } from "vitest";
import {
  createAwinLink,
  getMusicalBySlug,
  TINA_STAGE_SHOW_PAGE_URL,
  TINA_STAGE_TEXT_LINK_URL,
} from "./data";

describe("TINA – Das Tina Turner Musical", () => {
  it("enthält die bestätigten Hamburg-Produktionsdaten, die Showseite am Keyvisual und den Shop an den CTAs", () => {
    const tina = getMusicalBySlug("tina-das-tina-turner-musical");

    expect(tina).toBeDefined();
    expect(tina).toMatchObject({
      id: "tina-das-musical",
      experienceCategory: "pop-rock-filmhits",
      city: "Hamburg",
      venue: "Stage Operettenhaus",
      priceFrom: "53,99",
      keyvisual: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/PQObqPVEcqxSqgEF.webp",
      keyvisualLink: TINA_STAGE_SHOW_PAGE_URL,
      youtubeTrailerId: "N5BdeG7SVug",
    });
    expect(tina?.tourDates).toEqual([
      expect.objectContaining({
        city: "Hamburg",
        venue: "Stage Operettenhaus",
        startDate: "2027-04-06",
        displayLabel: "Ab April 2027",
        eventimUrl: TINA_STAGE_TEXT_LINK_URL,
      }),
    ]);
    expect([
      tina?.ticketCtaUrl,
      tina?.eventimUrl,
      tina?.awinHeroUrl,
      tina?.awinStickyUrl,
      tina?.awinBoxUrl,
    ]).toEqual(Array(5).fill(TINA_STAGE_TEXT_LINK_URL));
    expect(createAwinLink(TINA_STAGE_TEXT_LINK_URL)).toBe(TINA_STAGE_TEXT_LINK_URL);
  });

  it("kennzeichnet die autorisierte Produktion ohne ein nicht belegtes Enddatum", () => {
    const tina = getMusicalBySlug("tina-das-tina-turner-musical");

    expect(tina?.description).toContain("ab April 2027");
    expect(tina?.description).toContain("autorisierte Originalproduktion");
    expect(tina?.tourDates?.[0]?.endDate).toBeUndefined();
  });
});
