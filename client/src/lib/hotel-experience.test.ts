import { describe, expect, it } from "vitest";
import {
  CURATED_HOTEL_CITY_SLUGS,
  HOTEL_EXPERIENCE_PARTNERS,
  SHOW_MUSICAL_HOTEL_SECTIONS,
} from "./hotel-experience";

describe("hotel experience configuration", () => {
  it("kuratiert die drei großen Musical-Destinationen für die Startseite", () => {
    expect(CURATED_HOTEL_CITY_SLUGS).toEqual(["berlin", "hamburg", "stuttgart"]);
  });

  it("hält HRS aktiv und Travelcircus bis zur Partnerzusage in Vorbereitung", () => {
    expect(HOTEL_EXPERIENCE_PARTNERS.accommodation).toMatchObject({ name: "HRS", status: "active" });
    expect(HOTEL_EXPERIENCE_PARTNERS.package).toMatchObject({ name: "Travelcircus", status: "pending" });
  });

  it("blendet HRS-Hotelbereiche auf Musical-Landingpages bis zur neuen Partnerlösung aus", () => {
    expect(SHOW_MUSICAL_HOTEL_SECTIONS).toBe(false);
  });
});
