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
  it("rendert die kompakte rote Sale-Pill im Karteninhalt", () => {
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

    expect(markup).toContain(">SALE · BIS 15 %<");
    expect(markup).not.toContain("FAMILIEN:");
    expect(markup).not.toContain("BIS 15 % SPAREN");
    expect(markup).toContain('data-testid="sale-badge"');
    expect(markup).toContain('data-testid="sale-label"');
    expect(markup).toContain('data-testid="sale-icon"');
    expect(markup).toContain('data-testid="sale-icon" aria-hidden="true"');
    expect(markup).toContain("h-3.5 w-3.5 shrink-0");
    expect(markup).not.toContain("fill-red-dark text-red-dark");
    expect(markup).not.toContain('stroke-width="0"');
    expect(markup).not.toContain("text-[14px]");
    expect(markup).not.toContain('data-testid="featured-badge"');
    expect(markup).toContain("whitespace-nowrap");
    expect(markup).toContain('data-testid="sale-label" class="whitespace-nowrap"');
    expect(markup).toContain("text-white");
    expect(markup).toContain('data-sale-placement="content"');
    expect(markup).toContain('data-sale-layout="inline"');
    expect(markup).toContain(SALE_BADGE_LAYOUT.pillClasses);
    expect(markup).toContain('data-testid="teaser-meta-pills"');
    expect(markup).toContain("flex-wrap");
    expect(markup).toContain("bg-red");
    expect(markup).not.toContain("border-red-200/90");
    expect(markup).toContain("rounded-full");
    expect(markup).not.toContain("text-[10px] leading-snug text-white/70");
  });

  it("behält die Badge-Geometrie bei langen Aktionsnamen bei und zeigt nur die einheitliche Sale-Bezeichnung", () => {
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

    expect(markup).toContain('data-sale-layout="inline"');
    expect(markup).toContain(SALE_BADGE_LAYOUT.pillClasses);
    expect(markup).toContain(">SALE · 30 %<");
    expect(markup).not.toContain("BACK TO SCHOOL");
    expect(markup).not.toContain("data-testid=\"sale-label-line\"");
    expect(markup).toContain("30 %");
    expect(markup).toContain("min-h-8");
    expect(markup).toContain("items-center gap-1.5");
    expect(markup).toContain("h-3.5 w-3.5");
    expect(markup).toContain("text-xs");
    expect(markup).toContain("md:text-sm");
    expect(markup).toContain("whitespace-nowrap");
    expect(markup).not.toContain("BACK TO SCHOOL SALE");
  });

  it("zeigt kurze, frei pflegbare Sale-Vorteiltexte ohne feste Rabattlogik", () => {
    const twoForOneMarkup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          sale: { label: "Partnerangebot", discount: "2 FÜR 1" },
        }}
      />,
    );
    const secondTicketMarkup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          sale: { label: "Partnerangebot", discount: "2. TICKET 35 €" },
        }}
      />,
    );
    const priceFromMarkup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          sale: { label: "Sales Week", discount: "AB 35 €" },
        }}
      />,
    );

    expect(twoForOneMarkup).toContain(">SALE · 2 FÜR 1<");
    expect(secondTicketMarkup).toContain(">SALE · 2. TICKET 35 €<");
    expect(priceFromMarkup).toContain(">SALE · AB 35 €<");
    expect(twoForOneMarkup).toContain(SALE_BADGE_LAYOUT.pillClasses);
    expect(secondTicketMarkup).toContain(SALE_BADGE_LAYOUT.pillClasses);
    expect(priceFromMarkup).toContain(SALE_BADGE_LAYOUT.pillClasses);
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

  it("zeigt einen zur Musical-Detailseite passenden Informations- und Ticket-CTA ohne Anbieterzeile", () => {
    const markup = renderToStaticMarkup(<MusicalCard musical={baseMusical} />);

    expect(markup).toContain("Infos &amp; Tickets");
    expect(markup).toContain('data-testid="teaser-ticket-cta-icon"');
    expect(markup).toContain("h-7 w-7 shrink-0 items-center justify-center rounded-full");
    expect(markup).toContain('text-cream transition-colors group-hover:text-white');
    expect(markup).toContain('border border-gold/55 bg-transparent text-gold');
    expect(markup).not.toContain('group-hover:bg-gold group-hover:text-background');
    expect(markup).toContain('stroke-width="2.25"');
    expect(markup).not.toContain("Tickets sichern");
    expect(markup).not.toContain("via Eventim");
    expect(markup).not.toContain("via Stage Entertainment");
    expect(markup).not.toContain("via ATG Tickets");
  });

  it("zeigt die kuratierte Erlebniswelt anstelle beliebiger Teaser-Schlagwörter", () => {
    const markup = renderToStaticMarkup(
      <MusicalCard musical={{ ...baseMusical, featured: true, experienceCategory: "blockbuster-spektakel", tags: ["Legacy-Tag"] }} />,
    );

    expect(markup).toContain('data-testid="teaser-experience-category"');
    expect(markup).toContain(">Blockbuster<");
    expect(markup).not.toContain("Blockbuster &amp; Spektakel");
    expect(markup).not.toContain("Legacy-Tag");
    expect(markup).toContain('data-testid="teaser-experience-category" class="inline-flex h-8 items-center gap-1.5 rounded-full border border-gold/60 bg-transparent px-3 text-[11px] font-semibold text-gold md:h-10 md:px-4 md:text-xs"');
    expect(markup).not.toContain('data-testid="featured-badge"');
    expect(markup).not.toContain("px-2.5 py-1 text-xs");
    expect(markup).not.toContain("shadow-gold");
    expect(markup).not.toContain("md:text-[10px]");
  });

  it("zeigt optionale Startseiten-Artworks vollständig und den Musicaltitel erst unter dem Motiv", () => {
    const markup = renderToStaticMarkup(
      <MusicalCard
        musical={{
          ...baseMusical,
          title: "DISNEYS TESTMUSICAL",
          featured: true,
          homepageArtworkImage: "https://cdn.example.test/testmusical-artwork.webp",
          homepageArtworkObjectPosition: "center 80%",
          sale: { label: "Aktion", discount: "BIS 25 %" },
        }}
      />,
    );

    expect(markup).toContain('data-testid="teaser-image" data-homepage-artwork="true"');
    expect(markup).toContain('src="https://cdn.example.test/testmusical-artwork.webp"');
    expect(markup).toContain("h-full w-full object-cover");
    expect(markup).toContain('data-homepage-artwork-position="center 80%"');
    expect(markup).toContain("object-position:center 80%");
    expect(markup).not.toContain("blur-xl");
    expect(markup).toContain('data-testid="teaser-artwork-title"');
    expect(markup).toContain('data-testid="sale-badge"');
    expect(markup).not.toContain('data-testid="featured-badge"');
    expect(markup).not.toContain('data-testid="teaser-artwork-sale-badge"');
    expect(markup).not.toContain('data-testid="teaser-artwork-featured-badge"');
  });

  it("blendet die redundante Subline Das Musical in Karten aus", () => {
    const genericMarkup = renderToStaticMarkup(
      <MusicalCard musical={{ ...baseMusical, subtitle: "Das Musical" }} />,
    );
    const editorialMarkup = renderToStaticMarkup(
      <MusicalCard musical={{ ...baseMusical, subtitle: "Das neue Musical" }} />,
    );

    expect(genericMarkup).not.toContain("Das Musical");
    expect(editorialMarkup).toContain("Das neue Musical");
  });

  it("kann Spielortzeilen in kompakten Startseitenkarten ausblenden", () => {
    const regularMarkup = renderToStaticMarkup(<MusicalCard musical={baseMusical} />);
    const compactMarkup = renderToStaticMarkup(<MusicalCard musical={baseMusical} showLocation={false} />);

    expect(regularMarkup).toContain('data-testid="teaser-location"');
    expect(regularMarkup).toContain("Hamburg (Testtheater)");
    expect(compactMarkup).not.toContain('data-testid="teaser-location"');
    expect(compactMarkup).not.toContain("Hamburg (Testtheater)");
  });

  it("kann wiederholte Beschreibungen in kompakten Startseitenkarten ausblenden", () => {
    const regularMarkup = renderToStaticMarkup(<MusicalCard musical={baseMusical} />);
    const compactMarkup = renderToStaticMarkup(<MusicalCard musical={baseMusical} showDescription={false} />);

    expect(regularMarkup).toContain("Eine Testbeschreibung.");
    expect(compactMarkup).not.toContain("Eine Testbeschreibung.");
  });

  it("rundet alle Musicalkarten einheitlich großzügiger ab", () => {
    const markup = renderToStaticMarkup(<MusicalCard musical={baseMusical} />);

    expect(markup).toContain("rounded-xl");
    expect(markup).not.toContain("rounded-sm");
  });

  it("spielt nach einer Filteraktualisierung nur eine dezente Teaseranimation ab", () => {
    const markup = renderToStaticMarkup(
      <MusicalCard musical={baseMusical} anchorId="musical-test" filterAnimationKey={2} />,
    );

    expect(markup).toContain('id="musical-test"');
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
