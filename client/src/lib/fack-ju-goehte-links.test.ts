import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";

describe("Fack Ju Göhte Affiliate-Links", () => {
  it("verwendet den gelieferten AWIN-Textlink für allgemeine CTAs", () => {
    const musical = getMusicalBySlug("fack-ju-goehte");
    expect(musical).toBeDefined();

    const expectedBase = "https://www.awin1.com/awclick.php?gid=492097&mid=11388&awinaffid=2865727&linkid=4568988&clickref=";
    expect(musical?.keyvisualLink).toBe(`${expectedBase}fjg-keyvisual`);
    expect(musical?.ticketCtaUrl).toBe(`${expectedBase}fjg-cta`);
    expect(musical?.eventimUrl).toBe(`${expectedBase}fjg-ticket`);
    expect(musical?.awinHeroUrl).toBe(`${expectedBase}fjg-hero`);
    expect(musical?.awinStickyUrl).toBe(`${expectedBase}fjg-sticky`);
    expect(musical?.awinBoxUrl).toBe(`${expectedBase}fjg-box`);
  });

  it("behält die stadtbezogenen Ticketlinks für die Städtebuttons bei", () => {
    const musical = getMusicalBySlug("fack-ju-goehte");
    const berlin = musical?.tourDates?.find((date) => date.city === "Berlin");

    expect(berlin?.eventimUrl).toContain("clickref=fjg-berlin-dates");
    expect(berlin?.eventimUrl).not.toContain("linkid=4568988");
  });
});
