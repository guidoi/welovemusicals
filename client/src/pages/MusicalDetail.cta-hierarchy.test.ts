import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");

describe("MusicalDetail ticket CTA hierarchy", () => {
  it("verwendet für die Ticket-Conversion oberhalb des mobilen Detailinhalts Rot", () => {
    expect(source).toContain("border border-red bg-red py-3 text-sm font-semibold tracking-wide text-white");
    expect(source).toContain('import { getTicketCta } from "@/lib/ticket-cta";');
    expect(source).toContain("const ticketCta = getTicketCta(musical);");
    expect(source).toContain("{ticketCta.label}");
  });

  it("behält Gold für die Erlebniswelt und Orientierung im Hero", () => {
    expect(source).toContain("data-testid=\"detail-experience-category\"");
    expect(source).toContain("border border-gold bg-transparent");
  });

  it("belässt die Ticket-CTAs an einzelnen Spielorten bei der ruhigen Standardbeschriftung", () => {
    expect(source).toContain('<TourDates tourDates={musical.tourDates}');
    expect(source).not.toContain('ticketCtaLabel={ticketCta.label}');
  });
});
