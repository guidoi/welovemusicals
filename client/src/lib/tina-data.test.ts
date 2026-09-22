import { describe, expect, it } from "vitest";
import { createAwinLink, getMusicalBySlug } from "./data";

describe("TINA – Das Tina Turner Musical", () => {
  it("enthält die bestätigten Hamburg-Produktionsdaten und den Stage-Textlink", () => {
    const tina = getMusicalBySlug("tina-das-tina-turner-musical");
    const stageTextLink = "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26204074";

    expect(tina).toBeDefined();
    expect(tina).toMatchObject({
      id: "tina-das-musical",
      experienceCategory: "pop-rock-filmhits",
      city: "Hamburg",
      venue: "Stage Operettenhaus",
      priceFrom: "53,99",
      keyvisual: "/manus-storage/tina-das-tina-turner-musical-keyvisual-2027-1024x1024_9690bcc2.webp",
      youtubeTrailerId: "N5BdeG7SVug",
    });
    expect(tina?.tourDates).toEqual([
      expect.objectContaining({
        city: "Hamburg",
        venue: "Stage Operettenhaus",
        startDate: "2027-04-06",
        displayLabel: "Ab April 2027",
        eventimUrl: stageTextLink,
      }),
    ]);
    expect([
      tina?.keyvisualLink,
      tina?.ticketCtaUrl,
      tina?.eventimUrl,
      tina?.awinHeroUrl,
      tina?.awinStickyUrl,
      tina?.awinBoxUrl,
    ]).toEqual(Array(6).fill(stageTextLink));
    expect(createAwinLink(stageTextLink)).toBe(stageTextLink);
  });

  it("kennzeichnet die autorisierte Produktion ohne ein nicht belegtes Enddatum", () => {
    const tina = getMusicalBySlug("tina-das-tina-turner-musical");

    expect(tina?.description).toContain("ab April 2027");
    expect(tina?.description).toContain("autorisierte Originalproduktion");
    expect(tina?.tourDates?.[0]?.endDate).toBeUndefined();
  });
});
