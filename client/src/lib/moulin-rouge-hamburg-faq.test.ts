import { describe, expect, it } from "vitest";
import { musicals } from "./data";

const musical = musicals.find(item => item.id === "moulinrouge")!;

describe("Moulin Rouge: aktueller Spielort in Showfakten und FAQ", () => {
  it("nennt nur Hamburg ohne veralteten Beginn in den Spielort-Fakten", () => {
    expect(musical.showFacts?.filter(fact => fact.label.startsWith("Spielort"))).toEqual([
      { label: "Spielort Hamburg", value: "Theater am Großmarkt Hamburg" },
    ]);
  });

  it("nennt in der FAQ den aktuellen Spielort ohne Köln oder künftige Premiere", () => {
    expect(musical.faqItems?.find(faq => faq.question === "Wo wird das Musical gespielt?")?.answer)
      .toBe("Moulin Rouge! Das Musical wird im Theater am Großmarkt Hamburg gespielt.");
    expect(JSON.stringify(musical.faqItems)).not.toMatch(/Köln|Oktober|28\.10\.2026|Vorverkauf|Premiere/);
    expect(musical.faqItems).toHaveLength(10);
  });

  it("erhält archivierte Spieltermine und die Hamburger Ticketzuordnung", () => {
    expect(musical.tourDates?.find(date => date.city === "Köln")).toMatchObject({
      startDate: "2026-01-01", endDate: "2026-07-18",
      eventimUrl: "https://shop.atgtickets.de/moulin-rouge-das-musical/webticket/productiondetail?eventsView=calendar&productionId=28",
    });
    expect(musical.tourDates?.find(date => date.city === "Hamburg")).toMatchObject({
      venue: "Theater am Großmarkt Hamburg", startDate: "2026-10-28", endDate: "2027-12-31",
    });
    expect(musical.priceFrom).toBe("59,90");
    expect(musical.ticketCtaUrl).toContain("moulinrouge-cta");
  });
});
