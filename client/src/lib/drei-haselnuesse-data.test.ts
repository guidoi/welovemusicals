import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";
import { getMusicalSeo } from "./musical-seo";

describe("Drei Haselnüsse für Aschenbrödel – Tour 2026/2027", () => {
  const musical = getMusicalBySlug("drei-haselnuesse-fuer-aschenbroedel");

  it("übernimmt Preis, SEO und die bestätigte Tournee bis 2028", () => {
    expect(musical).toBeDefined();
    expect(musical?.priceFrom).toBe("40,49");
    expect(musical?.detailHeadline).toBe("ZWEI TOUREN. EIN WINTERMÄRCHEN. 80 STÄDTE.");
    expect(musical?.detailDescription).toContain("Nikolaus-Tour");
    expect(musical?.detailDescription).toContain("Rosalie-Tour");
    expect(musical?.detailDescription).toContain("Lena Marie Hespe");
    expect(musical?.detailDescription).toContain("Cassandra Schütt");
    expect(musical?.showFacts).toContainEqual({
      label: "Auf Tour",
      value: "15. Okt. 2026 bis 13. Jan. 2028",
    });

    const seo = getMusicalSeo(musical!);
    expect(seo.title).toBe("Drei Haselnüsse für Aschenbrödel 2026–2028 – Tickets");
    expect(seo.description).toContain("80 Städte");
    expect(seo.description).toContain("40,49 €");
  });

  it("nennt die Veranstalter der Nikolaus- und Rosalie-Tour korrekt", () => {
    const organizerFaq = musical?.faqItems?.find((item) => item.question === "Wer veranstaltet die Tourneen?");

    expect(organizerFaq?.answer).toContain("ShowSlot");
    expect(organizerFaq?.answer).toContain("Nikolaus-Tour");
    expect(organizerFaq?.answer).toContain("Bavaria Live Promotion");
    expect(organizerFaq?.answer).toContain("Rosalie-Tour");
  });

  it("führt die in den Presseinformationen ergänzten und korrigierten Termine", () => {
    const dates = musical?.tourDates ?? [];
    const find = (city: string, startDate: string) =>
      dates.find((date) => date.city === city && date.startDate === startDate);

    expect(find("Hamburg", "2027-01-27")).toMatchObject({
      venue: "Sporthalle",
      endDate: "2027-01-28",
    });
    expect(find("Berlin", "2027-02-28")).toMatchObject({
      venue: "BlueMax Theater",
      endDate: "2027-04-04",
    });
    expect(find("Fulda", "2027-12-21")).toMatchObject({ venue: "Esperantohalle", endDate: "2027-12-22" });
    expect(find("Hannover", "2027-02-17")).toMatchObject({ venue: "Swiss Life Hall" });
    expect(find("Nürnberg", "2027-02-02")).toMatchObject({ endDate: "2027-02-04" });
    expect(find("Wien", "2027-01-06")).toMatchObject({ endDate: "2027-01-17" });
    expect(find("Neuss", "2028-01-11")).toMatchObject({ endDate: "2028-01-13" });
    expect(find("Paderborn", "2028-01-03")).toMatchObject({ endDate: "2028-01-07" });
    expect(find("Würzburg", "2027-12-19")).toMatchObject({ endDate: "2027-12-20" });
    expect(find("Mannheim", "2026-11-25")).toBeUndefined();
  });

  it("deckt 80 Städte zwischen dem ersten und letzten bestätigten Spieltag ab", () => {
    const dates = musical?.tourDates ?? [];
    const uniqueCities = new Set(dates.map((date) => date.city));

    expect(uniqueCities.size).toBe(80);
    expect(musical?.cities).toContain("Berlin");
    expect(musical?.cities).toContain("Hannover");
    expect(musical?.cities).toContain("Hamburg");
    expect(musical?.cities).not.toContain("Mannheim");
    expect(musical?.headerCities).toContain("Hamburg");

    for (const date of dates) {
      expect(date.startDate >= "2026-10-15").toBe(true);
      expect((date.endDate ?? date.startDate) <= "2028-01-13").toBe(true);
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
    expect(findDateLink(musical!, "Berlin")).toContain("clickref=3hn-berlin-dates");
    expect(findDateLink(musical!, "Neuss")).toContain("clickref=3hn-neuss-dates");
  });
});

function findDateLink(
  musical: NonNullable<ReturnType<typeof getMusicalBySlug>>,
  city: string,
): string {
  return musical.tourDates?.find((date) => date.city === city)?.eventimUrl ?? "";
}
