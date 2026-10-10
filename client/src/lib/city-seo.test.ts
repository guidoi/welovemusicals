import { describe, expect, it } from "vitest";
import { getCitySeo, getUpcomingCityProgram } from "./city-seo";

const hamburg = {
  name: "Hamburg",
  description: "Die Musical-Hauptstadt Deutschlands mit großen Theatern und aktuellen Shows.",
};

describe("Stadtseiten-SEO", () => {
  it("erzeugt einen eindeutigen, suchintentionstarken Titel für Stadtseiten", () => {
    const seo = getCitySeo(hamburg, 7);

    expect(seo.title).toBe("Musicals in Hamburg – Termine & Tickets 2026/2027");
    expect(seo.heading).toBe("Musicals in Hamburg: Termine 2026/2027");
  });

  it("nennt Programminhalte und Spielort statt eines vorlagenhaften Stadttexts", () => {
    const seo = getCitySeo(hamburg, 2, [
      {
        title: "MUSICAL A",
        tourDates: [{ city: "Hamburg", venue: "Theater am Hafen", startDate: "2099-03-01", endDate: "2099-03-10", eventimUrl: "https://example.com/a" }],
      },
      {
        title: "MUSICAL B",
        tourDates: [{ city: "Hamburg", venue: "Theater an der Elbe", startDate: "2099-04-01", endDate: "2099-04-10", eventimUrl: "https://example.com/b" }],
      },
    ]);

    expect(seo.description).toContain("MUSICAL A und MUSICAL B");
    expect(seo.description).toContain("Theater am Hafen und Theater an der Elbe");
    expect(seo.description).toContain("Aktuelle Termine und Tickets 2026/2027");
    expect(seo.description.length).toBeLessThanOrEqual(160);
  });

  it("beschreibt Städte ohne aktives Programm ehrlich über aktuelle Termine", () => {
    const seo = getCitySeo({ name: "Dresden", description: "Kulturstadt mit Tournee-Gastspielen." }, 0);

    expect(seo.description).toContain("Aktuelle Musical-Termine in Dresden");
    expect(seo.description).not.toContain("0 Musicals");
  });

  it("liefert nur zukünftige, stadtbezogene Termine in chronologischer Reihenfolge", () => {
    const program = getUpcomingCityProgram("Graz", [
      {
        title: "SPÄTER",
        tourDates: [{ city: "Graz", venue: "Helmut List Halle", startDate: "2099-04-20", endDate: "2099-04-21", eventimUrl: "https://example.com/later" }],
      },
      {
        title: "FRÜHER",
        tourDates: [
          { city: "Wien", venue: "Wiener Stadthalle", startDate: "2099-01-01", endDate: "2099-01-01", eventimUrl: "https://example.com/wien" },
          { city: "Graz", venue: "Helmut List Halle", startDate: "2099-02-01", endDate: "2099-02-02", eventimUrl: "https://example.com/early" },
        ],
      },
    ]);

    expect(program.map((entry) => entry.title)).toEqual(["FRÜHER", "SPÄTER"]);
    expect(program.every((entry) => entry.venue === "Helmut List Halle")).toBe(true);
  });
});
