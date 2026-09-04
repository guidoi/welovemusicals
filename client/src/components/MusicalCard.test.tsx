import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import type { Musical } from "@/lib/data";
import { SALE_BADGE_LAYOUT } from "@/lib/sale-layout";
import MusicalCard from "./MusicalCard";

vi.mock("wouter", () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

const baseMusical: Musical = {
  id: "test-musical",
  slug: "test-musical",
  title: "TEST MUSICAL",
  provider: "Test",
  category: "fester-standort",
  city: "Hamburg",
  venue: "Testtheater",
  description: "Eine Testbeschreibung.",
  image: "/images/test.webp",
  eventimUrl: "https://example.com/tickets",
  tags: ["Test"],
};

describe("MusicalCard Sale-Störer", () => {
  it("rendert die kompakte Logo-Rot-Variante mit ausgeschriebenem Aktionsnamen und dunklerotem Preisschild", () => {
    const markup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          featured: true,
          sale: {
            label: "FAMILIEN:",
            discount: "BIS 15 %",
            note: "Familien-Tickets für ausgewählte Termine",
          },
        }}
      />
    );

    expect(markup).toContain("FAMILIEN:");
    expect(markup).toContain("BIS 15 %");
    expect(markup).not.toContain("BIS 15 % SPAREN");
    expect(markup).toContain('data-testid="sale-badge"');
    expect(markup).toContain('data-testid="sale-label"');
    expect(markup).toContain('data-testid="sale-icon"');
    expect(markup).toContain('data-testid="sale-icon" class="relative grid h-10 w-10 shrink-0 place-items-center" aria-hidden="true">');
    expect(markup).toContain("fill-[#991b1b] text-[#991b1b]");
    expect(markup).toContain('stroke-width="0"');
    expect(markup).toContain("text-[20px]");
    expect(markup).toContain('data-testid="featured-badge"');
    expect(markup).toContain("whitespace-nowrap");
    expect(markup).toContain('data-testid="sale-label" class="block whitespace-nowrap font-heading text-lg font-semibold leading-none text-white"');
    expect(markup).toContain("text-white");
    expect(markup).toContain(SALE_BADGE_LAYOUT.widthClasses);
    expect(markup).toContain(SALE_BADGE_LAYOUT.heightClass);
    expect(markup).toContain(SALE_BADGE_LAYOUT.mobileTextInsetClass);
    expect(markup).toContain("bg-[#ef4444]");
    expect(markup.match(/rounded-md/g)).toHaveLength(2);
    expect(markup).not.toContain("text-[10px] leading-snug text-white/70");
  });

  it("bricht Back to School Sale kontrolliert um und behält die Badge-Geometrie des König-der-Löwen-Sales", () => {
    const markup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          id: "fackjugoehte",
          slug: "fack-ju-goehte",
          sale: {
            label: "BACK TO SCHOOL SALE",
            discount: "30 %",
          },
        }}
      />,
    );

    expect(markup).toContain('data-sale-layout="long-label"');
    expect(markup).toContain(SALE_BADGE_LAYOUT.longLabelWidthClasses);
    expect(SALE_BADGE_LAYOUT.longLabelWidthClasses).toBe(SALE_BADGE_LAYOUT.widthClasses);
    expect(markup).toContain(SALE_BADGE_LAYOUT.heightClass);
    expect(markup).toContain(SALE_BADGE_LAYOUT.mobileTextInsetClass);
    expect(markup).toContain('data-testid="sale-label-line"');
    expect((markup.match(/data-testid="sale-label-line"/g) ?? [])).toHaveLength(2);
    expect(markup).toContain(">BACK TO SCHOOL<");
    expect(markup).toContain(">SALE <span data-testid=\"sale-discount-inline\">· 30 %</span><");
    expect(markup).toContain("30 %");
    expect(markup).toContain("overflow-hidden");
    expect(markup).toContain("gap-2");
    expect(markup).toContain("h-10 w-10");
    expect(markup).toContain("text-[9px]");
    expect(markup).toContain("leading-[0.85]");
    expect(markup).toContain("whitespace-nowrap");
    expect(markup).not.toContain("BACK TO SCHOOL SALE</span>");
  });

  it("rendert keinen Sale-Störer ohne sale oder nach Ablauf", () => {
    const withoutSale = renderToStaticMarkup(<MusicalCard musical={baseMusical} />);
    const expiredSale = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          sale: {
            label: "Abgelaufene Aktion",
            discount: "Bis 15 % sparen",
            validUntil: "2000-01-01",
          },
        }}
      />
    );

    expect(withoutSale).not.toContain("Bis 15 % sparen");
    expect(expiredSale).not.toContain("Abgelaufene Aktion");
  });

  it("zeigt den Ticket-CTA ohne Anbieterzeile", () => {
    const markup = renderToStaticMarkup(<MusicalCard musical={baseMusical} />);

    expect(markup).toContain("Tickets sichern");
    expect(markup).not.toContain("via Eventim");
    expect(markup).not.toContain("via Stage Entertainment");
    expect(markup).not.toContain("via ATG Tickets");
  });

  it("zeigt das passende Anbieterlogo anstelle einer Anbieterzeile", () => {
    const stageMarkup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          eventimUrl: "https://www.stage-entertainment.de/musicals-shows/koenig-der-loewen",
        }}
      />,
    );

    expect(stageMarkup).toContain('data-testid="teaser-provider-logo"');
    expect(stageMarkup).toContain('data-testid="teaser-ticket-cta"');
    expect(stageMarkup).toContain('src="/images/branding/stage-entertainment-logo-white.png"');
    expect(stageMarkup).toContain('alt="Stage Entertainment"');
    expect(stageMarkup).toContain('data-provider-brand="stage"');
    expect(stageMarkup).toContain('class="h-8 max-w-32 md:max-w-28 w-auto object-contain object-left opacity-90 md:h-7"');
  });

  it("verwendet in Eventim-Teasern das transparente Eventim-Asset", () => {
    const markup = renderToStaticMarkup(<MusicalCard musical={baseMusical} />);

    expect(markup).toContain('data-provider-brand="eventim"');
    expect(markup).toContain('src="/images/branding/eventim-logo-transparent.png"');
    expect(markup).toContain('class="h-8 max-w-20 md:max-w-[4.5rem] w-auto object-contain object-left opacity-90 md:h-7"');
  });
});
