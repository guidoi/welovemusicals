import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";

describe("WIR SIND AM LEBEN ticket data", () => {
  it("exposes the Berlin ticket section with venue, dates and Stage destination", () => {
    const musical = getMusicalBySlug("wir-sind-am-leben");

    expect(musical?.tourDates).toEqual([
      expect.objectContaining({
        city: "Berlin",
        venue: "Stage Theater des Westens",
        startDate: "2026-07-01",
        endDate: "2027-02-28",
        eventimUrl: "https://www.stage-entertainment.de/musicals-shows/wir-sind-am-leben-berlin",
      }),
    ]);
    expect(musical?.showFacts).toContainEqual({ label: "Spielzeit", value: "01.07.2026 – 28.02.2027" });
  });
});

