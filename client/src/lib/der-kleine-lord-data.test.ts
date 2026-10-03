import { describe, expect, it } from "vitest";
import { getActiveMusicalsByCity, getMusicalBySlug } from "./data";

const DKL_CDN_PREFIX = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/";

describe("Der Kleine Lord – Katalog und Ticketpfade", () => {
  it("führt die Berliner Weltpremiere mit Spielzeit, Preis und direktem Awin-Ziel", () => {
    const musical = getMusicalBySlug("der-kleine-lord");

    expect(musical).toBeDefined();
    expect(musical?.title).toBe("DER KLEINE LORD");
    expect(musical?.city).toBe("Berlin");
    expect(musical?.venue).toBe("BlueMax Theater am Potsdamer Platz");
    expect(musical?.priceFrom).toBe("59,99");
    expect(musical?.ticketCtaUrl).toContain("www.awin1.com/awclick.php");
    expect(musical?.ticketCtaUrl).toContain("gid=492097");
    expect(musical?.ticketCtaUrl).toContain("mid=11388");
    expect(musical?.ticketCtaUrl).toContain("awinaffid=2865727");
    expect(musical?.ticketCtaUrl).toContain("linkid=3666159");
    expect(musical?.tourDates).toEqual([
      expect.objectContaining({
        city: "Berlin",
        venue: "BlueMax Theater am Potsdamer Platz",
        startDate: "2026-11-13",
        endDate: "2026-12-30",
        premiereDate: "2026-11-13",
      }),
    ]);
  });

  it("verwendet den gelieferten Awin-Textlink an allen allgemeinen CTAs und behält den Berliner Terminpfad bei", () => {
    const musical = getMusicalBySlug("der-kleine-lord");
    const expectedBase = "https://www.awin1.com/awclick.php?gid=492097&mid=11388&awinaffid=2865727&linkid=3666159&clickref=";

    expect(musical?.keyvisualLink).toBe(`${expectedBase}dkl-keyvisual`);
    expect(musical?.ticketCtaUrl).toBe(`${expectedBase}dkl-cta`);
    expect(musical?.eventimUrl).toBe(`${expectedBase}dkl-ticket`);
    expect(musical?.awinHeroUrl).toBe(`${expectedBase}dkl-hero`);
    expect(musical?.awinStickyUrl).toBe(`${expectedBase}dkl-sticky`);
    expect(musical?.awinBoxUrl).toBe(`${expectedBase}dkl-box`);
    expect(musical?.tourDates?.[0]?.eventimUrl).toContain("www.awin1.com/cread.php");
    expect(musical?.tourDates?.[0]?.eventimUrl).toContain("awinmid=11388");
    expect(musical?.tourDates?.[0]?.eventimUrl).toContain("awinaffid=2865727");
    expect(musical?.tourDates?.[0]?.eventimUrl).not.toContain("linkid=3666159");
  });

  it("verwendet die gelieferten WebP-Motive und führt Uwe Kröger in der Detailgalerie", () => {
    const musical = getMusicalBySlug("der-kleine-lord");

    expect(musical?.image).toBe(`${DKL_CDN_PREFIX}UARCYeGDkgcsgNrm.webp`);
    expect(musical?.heroImage).toBe(`${DKL_CDN_PREFIX}iNtOfOSmUuVXFCre.webp`);
    expect(musical?.keyvisual).toBe(`${DKL_CDN_PREFIX}UARCYeGDkgcsgNrm.webp`);
    expect(musical?.gallery).toEqual([
      expect.objectContaining({
        url: `${DKL_CDN_PREFIX}ZWCOQhljNRjcinLB.webp`,
        alt: expect.stringContaining("Uwe Kröger"),
      }),
    ]);
  });

  it("ist als Familienmusical auf der Berliner Stadtseite und im Stadtfilter aktiv", () => {
    const berlinIds = getActiveMusicalsByCity("Berlin").map((musical) => musical.id);

    expect(berlinIds).toContain("der-kleine-lord");
  });

  it("nennt Spielzeit, Weltpremiere und Veranstalter in den strukturiert auslesbaren Daten", () => {
    const musical = getMusicalBySlug("der-kleine-lord");

    expect(musical?.detailDescription).toContain("Weltpremiere");
    expect(musical?.showFacts).toContainEqual(
      expect.objectContaining({ label: "Spielzeit", value: "13. November bis 30. Dezember 2026" }),
    );
    expect(musical?.faqItems).toContainEqual(
      expect.objectContaining({
        question: "Wer veranstaltet die Produktion?",
        answer: "Veranstalter der Weltpremiere ist ShowSlot Touring GmbH.",
      }),
    );
  });
});
