import { afterEach, describe, expect, it, vi } from "vitest";
import { getActiveMusicalsByCity, getMusicalBySlug } from "./data";

describe("Fack Ju Göhte Affiliate-Links", () => {
  afterEach(() => vi.useRealTimers());

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

    expect(berlin).toMatchObject({
      venue: "BlueMax Theater",
      startDate: "2026-09-25",
      endDate: "2026-10-31",
    });
    expect(berlin?.eventimUrl).toContain("clickref=fjg-berlin-dates");
    expect(berlin?.eventimUrl).not.toContain("linkid=4568988");
  });

  it("führt die Berliner BlueMax-Spielzeit während der Laufzeit auf Stadtseite und in Ortsfiltern", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-20T12:00:00"));
    const berlinIds = getActiveMusicalsByCity("Berlin").map((musical) => musical.id);

    expect(berlinIds).toContain("fackjugoehte");
  });

  it("blendet abgelaufene Berliner Termine aus, ohne deren Datensatz oder Affiliate-Link zu entfernen", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-21T12:00:00"));
    expect(getActiveMusicalsByCity("Berlin").map((musical) => musical.id)).not.toContain("fackjugoehte");
    const berlin = getMusicalBySlug("fack-ju-goehte")?.tourDates?.find((date) => date.city === "Berlin");
    expect(berlin?.endDate).toBe("2026-10-31");
    expect(berlin?.eventimUrl).toContain("clickref=fjg-berlin-dates");
  });

  it("führt den Tabellenpreis als redaktionellen Fallback ohne abgelaufene Sale-Aktion", () => {
    const musical = getMusicalBySlug("fack-ju-goehte");

    expect(musical?.priceFrom).toBe("40,49");
    expect(musical?.sale).toBeUndefined();
  });
});
