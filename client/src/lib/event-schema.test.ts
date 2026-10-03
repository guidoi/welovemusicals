import { describe, expect, it } from "vitest";
import { getActiveMusicals, getMusicalBySlug } from "./data";
import { getMusicalEventItemList, getMusicalEventSchemas } from "./event-schema";

describe("maschinenlesbare Veranstaltungsdaten", () => {
  it("liefert für aktive Termine vollständige MusicEvent-Objekte ohne Affiliate-URL", () => {
    const mj = getMusicalBySlug("mj-das-michael-jackson-musical");
    expect(mj).toBeDefined();

    const events = getMusicalEventSchemas(mj!, { priceFrom: "56,99", today: "2026-10-02" });
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      "@type": "MusicEvent",
      "@id": "https://welovemusicals.com/musical/mj-das-michael-jackson-musical#event-hamburg-2024-12-01",
      name: "MJ – DAS MICHAEL JACKSON MUSICAL",
      mainEntityOfPage: { "@id": "https://welovemusicals.com/musical/mj-das-michael-jackson-musical" },
      startDate: "2024-12-01",
      endDate: "2027-08-29",
      location: {
        "@type": "MusicVenue",
        name: "Stage Theater an der Elbe",
        address: { addressLocality: "Hamburg", addressCountry: "DE" },
      },
      organizer: {
        "@type": "Organization",
        name: "Stage Entertainment",
        url: "https://www.stage-entertainment.de",
      },
      offers: {
        "@type": "Offer",
        url: "https://welovemusicals.com/musical/mj-das-michael-jackson-musical",
        priceCurrency: "EUR",
        price: "56.99",
      },
    });
    expect(JSON.stringify(events)).not.toMatch(/awin1\.com|visit\.stage-entertainment\.de|atgtickets\.de\/.*webticket/);
  });

  it("lässt vergangene Termine weg und fasst die aktuellen Termine als ItemList zusammen", () => {
    const fackJuGoehte = getMusicalBySlug("fack-ju-goehte");
    expect(fackJuGoehte).toBeDefined();

    const events = getMusicalEventSchemas(fackJuGoehte!, { priceFrom: "39,99", today: "2026-10-02" });
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((event) => String(event.endDate ?? event.startDate) >= "2026-10-02")).toBe(true);
    expect(events).toContainEqual(expect.objectContaining({
      startDate: "2026-11-04",
      location: expect.objectContaining({
        address: expect.objectContaining({ addressLocality: "Bochum" }),
      }),
    }));

    const list = getMusicalEventItemList(fackJuGoehte!, { priceFrom: "39,99", today: "2026-10-02" });
    expect(list).toMatchObject({
      "@type": "ItemList",
      numberOfItems: events.length,
    });
  });

  it("führt Preisangebote nur aus, wenn ein verlässlicher Preis vorliegt", () => {
    const tina = getMusicalBySlug("tina-das-tina-turner-musical");
    expect(tina).toBeDefined();

    const [event] = getMusicalEventSchemas(tina!, { today: "2026-10-02" });
    expect(event).toBeDefined();
    expect(event).not.toHaveProperty("offers");
  });

  it("liefert für alle aktiven Events eine offizielle Veranstalterdomain", () => {
    const events = getActiveMusicals().flatMap((musical) => getMusicalEventSchemas(musical, {
      priceFrom: musical.priceFrom,
      today: "2026-10-03",
    }));

    expect(events.length).toBeGreaterThan(0);
    events.forEach((event) => {
      expect(event.organizer).toMatchObject({
        "@type": "Organization",
        name: expect.any(String),
        url: expect.stringMatching(/^https:\/\//),
      });
    });
  });
});
