import { describe, expect, it } from "vitest";
import { getStickyTicketCta, getTicketCta } from "./ticket-cta";

const now = new Date("2026-09-19T12:00:00");

describe("getTicketCta", () => {
  it("stellt eine aktive Aktion vor der Preisangabe heraus", () => {
    expect(
      getTicketCta(
        { priceFrom: "63,99", sale: { label: "Familienangebot", discount: "BIS 15 %" } },
        now,
      ),
    ).toEqual({ label: "SALE · BIS 15 %", kind: "offer" });
  });

  it("übernimmt Sonderangebote wie 2 für 1 unverändert", () => {
    expect(
      getTicketCta(
        { sale: { label: "Aktion", discount: "2 FÜR 1" } },
        now,
      ),
    ).toEqual({ label: "SALE · 2 FÜR 1", kind: "offer" });
  });

  it("fällt nach Angebotsende auf den Mindestpreis zurück", () => {
    expect(
      getTicketCta(
        {
          priceFrom: "44,79",
          sale: { label: "Aktion", discount: "BIS 40 %", validUntil: "2026-09-18" },
      },
      now,
    ),
    ).toEqual({ label: "ab 44,79 €", kind: "standard" });
  });

  it("verwendet ohne Preis eine neutrale Ticket-CTA", () => {
    expect(getTicketCta({}, now)).toEqual({ label: "Tickets sichern", kind: "standard" });
  });
});

describe("getStickyTicketCta – Preisinfo im mobilen Footer", () => {
  it.each([
    { label: "BLACK SALE", discount: "BIS 40 %" },
    { label: "Aktion", discount: "2 FÜR 1" },
    { label: "Abgelaufen", discount: "BIS 15 %", validUntil: "2026-09-18" },
    { label: "Geplant", discount: "BIS 30 %", validFrom: "2027-01-01" },
  ])("zeigt den Ab-Preis unabhängig von der Aktion $label", (sale) => {
    expect(getStickyTicketCta({ priceFrom: "63,99", sale })).toEqual({ label: "ab 63,99 €", kind: "standard" });
  });

  it("zeigt auch ohne Aktion den freigegebenen Preis", () => {
    expect(getStickyTicketCta({ priceFrom: "49,99" })).toEqual({ label: "ab 49,99 €", kind: "standard" });
  });

  it("erfindet bei fehlendem Preis keinen Einstiegspreis und nennt keinen Ersatzrabatt", () => {
    for (const priceFrom of [undefined, "", "   "]) {
      expect(getStickyTicketCta({ priceFrom, sale: { label: "BLACK SALE", discount: "BIS 30 %" } })).toEqual({ label: "Tickets sichern", kind: "standard" });
    }
  });
});
