import { describe, expect, it } from "vitest";
import { getTicketCta } from "./ticket-cta";

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
    ).toEqual({ label: "Tickets buchen – ab 44,79 €", kind: "standard" });
  });

  it("verwendet ohne Preis eine neutrale Ticket-CTA", () => {
    expect(getTicketCta({}, now)).toEqual({ label: "Tickets buchen", kind: "standard" });
  });
});
