import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";
import { getMusicalSeo } from "./musical-seo";

describe("Drei Haselnüsse für Aschenbrödel – Tour 2026/2027", () => {
  const musical = getMusicalBySlug("drei-haselnuesse-fuer-aschenbroedel");

  it("übernimmt Preis, SEO und die beiden bestätigten Tourneezeiträume", () => {
    expect(musical).toBeDefined();
    expect(musical?.priceFrom).toBe("40,49");
    expect(musical?.detailHeadline).toBe("ZWEI TOUREN. EIN WINTERMÄRCHEN. ÜBER 70 STÄDTE.");
    expect(musical?.detailDescription).toContain("Nikolaus-Tour");
    expect(musical?.detailDescription).toContain("Rosalie-Tour");
    expect(musical?.detailDescription).toContain("Lena Marie Hespe");
    expect(musical?.detailDescription).toContain("Cassandra Schütt");
    expect(musical?.showFacts).toContainEqual({
      label: "Auf Tour",
      value: "15. Okt. 2026 bis 24. Feb. 2027",
    });

    const seo = getMusicalSeo(musical!);
    expect(seo.title).toBe("Drei Haselnüsse für Aschenbrödel 2026/27 – Tickets");
    expect(seo.description).toContain("über 70 Termine");
    expect(seo.description).toContain("40,49 €");
  });

  it("führt die in den Presseinformationen ergänzten und korrigierten Termine", () => {
    const dates = musical?.tourDates ?? [];
    const find = (city: string, startDate: string) =>
      dates.find((date) => date.city === city && date.startDate === startDate);

    expect(find("Hamburg", "2027-01-27")).toMatchObject({
      venue: "Sporthalle",
      endDate: "2027-01-28",
    });
    expect(find("Mannheim", "2026-11-25")).toMatchObject({ venue: "Rosengarten" });
    expect(find("Heidenheim", "2026-10-25")).toMatchObject({ endDate: "2026-10-25" });
    expect(find("Heidenheim", "2027-01-17")).toMatchObject({ endDate: "2027-01-17" });
    expect(find("Halle (Saale)", "2027-02-22")).toMatchObject({ endDate: "2027-02-22" });
    expect(find("Leipzig", "2027-01-31")).toMatchObject({ endDate: "2027-02-03" });
    expect(find("Stuttgart", "2026-12-22")).toMatchObject({ endDate: "2026-12-28" });
    expect(find("Wien", "2027-01-06")).toMatchObject({ endDate: "2027-01-10" });
    expect(find("Weiden i. d. Oberpfalz", "2026-12-30")).toMatchObject({
      venue: "Max-Reger-Halle (Gustl Lang Saal)",
    });
    expect(find("Würzburg", "2026-12-11")).toBeDefined();
    expect(find("Zweibrücken", "2026-11-20")).toMatchObject({ endDate: "2026-11-21" });
    expect(find("Zwickau", "2027-02-24")).toBeDefined();
    expect(find("Hameln", "2026-11-14")).toBeDefined();
  });

  it("deckt über 70 Städte zwischen dem ersten und letzten bestätigten Spieltag ab", () => {
    const dates = musical?.tourDates ?? [];
    const uniqueCities = new Set(dates.map((date) => date.city));

    expect(uniqueCities.size).toBeGreaterThan(70);
    expect(musical?.cities).toContain("Hamburg");
    expect(musical?.cities).toContain("Mannheim");
    expect(musical?.headerCities).toContain("Hamburg");

    for (const date of dates) {
      expect(date.startDate >= "2026-10-15").toBe(true);
      expect((date.endDate ?? date.startDate) <= "2027-02-24").toBe(true);
    }
  });

  it("verwendet an allen Haupt- und Stadt-CTAs die bereitgestellten Awin/Eventim-Pfade", () => {
    const links = [
      musical?.keyvisualLink,
      musical?.eventimUrl,
      musical?.awinHeroUrl,
      musical?.awinStickyUrl,
      musical?.awinBoxUrl,
      ...(musical?.tourDates ?? []).map((date) => date.eventimUrl),
    ].filter((url): url is string => Boolean(url));

    expect(links.length).toBeGreaterThan(5);
    for (const link of links) {
      const url = new URL(link);
      expect(url.hostname).toBe("www.awin1.com");
      expect(url.pathname).toBe("/cread.php");
      expect(url.searchParams.get("awinmid")).toBe("11388");
      expect(url.searchParams.get("awinaffid")).toBe("2865727");
      expect(url.searchParams.get("clickref")).toMatch(/^3hn-/);
      expect(decodeURIComponent(url.searchParams.get("ued") ?? "")).toContain("eventim.de");
    }

    expect(findDateLink(musical!, "Hamburg")).toContain("clickref=3hn-hamburg-dates");
    expect(findDateLink(musical!, "Mannheim")).toContain("clickref=3hn-mannheim-dates");
  });
});

function findDateLink(
  musical: NonNullable<ReturnType<typeof getMusicalBySlug>>,
  city: string,
): string {
  return musical.tourDates?.find((date) => date.city === city)?.eventimUrl ?? "";
}
