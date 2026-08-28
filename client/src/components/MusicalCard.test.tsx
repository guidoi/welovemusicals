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
    expect(markup).toContain("text-[11px]");
    expect(markup).toContain("tracking-[0.07em]");
    expect(markup).toContain("text-white");
    expect(markup).toContain(SALE_BADGE_LAYOUT.widthClasses);
    expect(markup).toContain("bg-[#ef4444]");
    expect(markup.match(/rounded-md/g)).toHaveLength(2);
    expect(markup).not.toContain("text-[10px] leading-snug text-white/70");
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
});
