import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");

describe("MusicalDetail ticket CTA hierarchy", () => {
  it("verwendet für die Ticket-Conversion oberhalb des mobilen Detailinhalts Rot", () => {
    expect(source).toContain("whitespace-nowrap rounded-sm border border-red bg-red py-3 text-sm font-semibold tracking-wide text-white");
    expect(source).toContain('import { getTicketCta } from "@/lib/ticket-cta";');
    expect(source).toContain("const ticketCta = getTicketCta(musical);");
    expect(source).toContain("{ticketCta.label}");
    expect(source).toContain("aria-label={`Tickets für ${musical.title}: ${ticketCta.label} bei ${ticketProviderName}`}");
    expect(source).toContain('trackDetailTicketClick("mobile-hero", heroTicketLink)');
    expect(source).toContain('trackDetailTicketClick("ticket-box", boxTicketLink)');
    expect(source).toContain('trackDetailTicketClick("sticky", stickyTicketLink)');
    expect(source.match(/rel="noopener sponsored"/g)).toHaveLength(3);
  });

  it("behält Gold für die Erlebniswelt und Orientierung im Hero", () => {
    expect(source).toContain("data-testid=\"detail-experience-category\"");
    expect(source).toContain("border border-gold bg-transparent");
  });

  it("belässt die Ticket-CTAs an einzelnen Spielorten bei der ruhigen Standardbeschriftung", () => {
    expect(source).toContain('<TourDates tourDates={musical.tourDates}');
    expect(source).not.toContain('ticketCtaLabel={ticketCta.label}');
    expect(source).toContain('trackDetailTicketClick("city-date", ticketUrl)');
  });

  it("hält den CTA-Text auf Mobilgeräten kompakt und lässt Partnerlogos sauber umbrechen", () => {
    expect(source).toContain('className="flex flex-wrap items-center gap-4"');
    expect(source).toContain('inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm bg-red px-5 py-4 text-base');
    expect(source).toContain('h-7 max-w-28 w-auto shrink-0 object-contain object-left opacity-90 sm:ml-3 sm:max-w-36');
    expect(source).toContain('className="flex items-center gap-3"');
    expect(source).toContain('shrink-0 object-contain object-right opacity-90');
  });
});
