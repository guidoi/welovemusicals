import { describe, expect, it } from "vitest";
import { getActiveMusicalCountByCity, getMusicalBySlug } from "./data";

describe("Rapunzel Berlin-Termin", () => {
  it("enthält den Berlin-Termin im BlueMax Theater mit korrektem Zeitraum", () => {
    const rapunzel = getMusicalBySlug("rapunzel");
    const berlinDate = rapunzel?.tourDates?.find((date) => date.city === "Berlin");

    expect(berlinDate).toEqual(
      expect.objectContaining({
        city: "Berlin",
        venue: "BlueMax Theater",
        startDate: "2027-05-14",
        endDate: "2027-06-06",
      }),
    );
    expect(berlinDate?.eventimUrl).toContain("clickref=rapunzel-berlin-dates");
  });

  it("führt Berlin im Rapunzel-Header und zählt nach der Sister-Act-Deaktivierung fünf aktive Musicals", () => {
    const rapunzel = getMusicalBySlug("rapunzel");

    expect(rapunzel?.cities).toContain("Berlin");
    expect(getActiveMusicalCountByCity("Berlin")).toBe(5);
  });
});
