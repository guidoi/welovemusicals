import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import type { Musical } from "@/lib/data";
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
  it("rendert Aktionsname, Rabatt und Hinweis bei einem aktiven sale", () => {
    const markup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          sale: {
            label: "Aktion Familientage",
            discount: "Bis 15 % sparen",
            note: "Familien-Tickets für ausgewählte Termine",
          },
        }}
      />
    );

    expect(markup).toContain("Aktion Familientage");
    expect(markup).toContain("Bis 15 % sparen");
    expect(markup).toContain("Familien-Tickets für ausgewählte Termine");
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
