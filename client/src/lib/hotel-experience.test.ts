import { describe, expect, it } from "vitest";
import {
  CURATED_HOTEL_CITY_SLUGS,
  HOTEL_EXPERIENCE_PARTNERS,
  SHOW_CITY_HOTEL_SECTIONS,
  SHOW_MUSICAL_HOTEL_SECTIONS,
} from "./hotel-experience";

describe("hotel experience configuration", () => {
  it("kuratiert die drei großen Musical-Destinationen für die Startseite", () => {
    expect(CURATED_HOTEL_CITY_SLUGS).toEqual(["berlin", "hamburg", "stuttgart"]);
  });

  it("deaktiviert HRS und hält Travelcircus bis zur Auswahl eines Werbemittels bereit", () => {
    expect(HOTEL_EXPERIENCE_PARTNERS.accommodation).toMatchObject({ name: "HRS", status: "inactive" });
    expect(HOTEL_EXPERIENCE_PARTNERS.package).toMatchObject({
      name: "Travelcircus",
      status: "confirmed",
      awinMerchantId: "9151",
      integrationStatus: "awaiting-creative",
    });
  });

  it("blendet HRS-Hotelbereiche auf Musical- und Stadtseiten bis zur neuen Partnerlösung aus", () => {
    expect(SHOW_MUSICAL_HOTEL_SECTIONS).toBe(false);
    expect(SHOW_CITY_HOTEL_SECTIONS).toBe(false);
  });
});
