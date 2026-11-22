import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import TourDates from "./TourDates";
import { getMusicalBySlug } from "@/lib/data";

afterEach(() => vi.useRealTimers());

describe("TourDates", () => {
  it("zeigt Ticketdaten ohne Anbieterlogo in der Ticketkarte", () => {
    const markup = renderToStaticMarkup(
      <TourDates
        musicalId="wir-sind-am-leben"
        musicalSlug="wir-sind-am-leben"
        tourDates={[
          {
            city: "Berlin",
            venue: "Stage Theater des Westens",
            startDate: "2026-07-01",
            endDate: "2027-02-28",
            eventimUrl: "https://www.stage-entertainment.de/musicals-shows/wir-sind-am-leben-berlin",
          },
        ]}
      />,
    );

    expect(markup).toContain("Stage Theater des Westens");
    expect(markup).toContain("Tickets sichern");
    expect(markup).not.toContain('data-testid="tour-date-provider-logo"');
    expect(markup).not.toContain("stage-entertainment-logo-white.png");
    expect(markup).toContain("md:hover:border-gold");
    expect(markup).toContain("focus-within:border-gold");
    expect(markup).toContain('href="/stadt/berlin"');
  });

  it("nutzt auch für weitere Terminlisten den einheitlichen Stadt-CTA", () => {
    const markup = renderToStaticMarkup(
      <TourDates
        musicalId="test-show"
        tourDates={[
          {
            city: "Hamburg",
            venue: "Musicaltheater",
            startDate: "2026-10-01",
            eventimUrl: "https://example.com/tickets",
          },
        ]}
      />,
    );

    expect(markup).toContain("Tickets sichern");
    expect(markup).not.toContain("SALE · 2 FÜR 1");
    expect(markup).toContain('href="/stadt/hamburg"');
    expect(markup).toContain('rel="noopener sponsored"');
    expect(markup).not.toContain("noreferrer");
    expect(markup).toContain('href="https://www.eventim.de/"');
  });

  it("zeigt bei Bibi beide Städte ohne Auswahlbuttons und ignoriert alte Einzelstadt-Auswahl", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-22T12:00:00"));
    const musical = getMusicalBySlug("weihnachten-mit-bibi-tina")!;
    const markup = renderToStaticMarkup(<TourDates musicalId={musical.id} tourDates={musical.tourDates!} hideCityFilter selectedCity="Berlin" />);
    expect(markup).toContain("Stage Theater des Westens");
    expect(markup).toContain("Stage Operettenhaus");
    expect(markup).toContain(`href="${musical.ticketUrlsByCity!.Berlin.replace(/&/g, "&amp;")}"`);
    expect(markup).toContain(`href="${musical.ticketUrlsByCity!.Hamburg.replace(/&/g, "&amp;")}"`);
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("Alle Städte");
    expect(markup).not.toContain("combobox");
  });

  it("behält den bisherigen Stadtfilter standardmäßig für andere Tourneeübersichten", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-22T12:00:00"));
    const musical = getMusicalBySlug("weihnachten-mit-bibi-tina")!;
    const markup = renderToStaticMarkup(<TourDates tourDates={musical.tourDates!} />);
    expect(markup).toContain("Alle Städte (2)");
    expect(markup).toContain("<button");
  });
});
