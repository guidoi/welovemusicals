import { afterEach, describe, expect, it, vi } from "vitest";
import { getActiveMusicalCountByCity, getMusicalBySlug } from "./data";

describe("Rapunzel Berlin-Termin", () => {
  afterEach(() => vi.useRealTimers());

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

  it("führt Berlin im Rapunzel-Header und zählt mit dem ergänzten Dracula-Gastspiel zehn aktive Musicals", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-20T12:00:00"));
    const rapunzel = getMusicalBySlug("rapunzel");

    expect(rapunzel?.cities).toContain("Berlin");
    expect(getActiveMusicalCountByCity("Berlin")).toBe(10);
  });

  it("nutzt die neuen Rapunzel-Artworks responsiv", () => {
    const rapunzel = getMusicalBySlug("rapunzel");

    expect(rapunzel).toMatchObject({
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/kGHppGRVbSoKlriz.webp",
      heroImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/pYzmfdYMSFiUcBYM.webp",
      keyvisual: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/kGHppGRVbSoKlriz.webp",
    });
  });
});
