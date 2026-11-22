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
    expect(markup).toContain('class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"');
    expect(markup).toContain('class="shrink-0 rounded-sm bg-red px-5 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-red-dark"');
    expect(markup).toMatch(/<a[^>]*>Tickets sichern<\/a>/);
    expect(markup).not.toContain('data-testid="wbt-city-ticket"');
    expect(markup).not.toContain("data-wbt-city");
    expect(markup).not.toContain("Tickets für Hamburg");
    expect(markup).not.toContain("min-h-12");
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

  it("stapelt nur WBT-Stadttickets mobil mit 48px Mindesthöhe, voller Breite und 12px Abstand und erhält das md-Desktoplayout", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-22T12:00:00"));
    const musical = getMusicalBySlug("weihnachten-mit-bibi-tina")!;
    const markup = renderToStaticMarkup(
      <TourDates musicalId={musical.id} tourDates={musical.tourDates!} hideCityFilter selectedCity="Berlin" />,
    );
    const tickets = Array.from(markup.matchAll(
      /<div class="([^"]*)"><p class="text-sm font-semibold text-gold">([^<]+)<\/p><a ([^>]*data-testid="wbt-city-ticket"[^>]*)>(.*?)<\/a><\/div>/g,
    ));
    const expectedCities = [
      { city: "Berlin", url: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442" },
      { city: "Hamburg", url: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26175768" },
    ];

    expect(Array.from(markup.matchAll(/data-wbt-city="([^"]+)"/g), (match) => match[1]))
      .toEqual(expectedCities.map(({ city }) => city));
    expect(tickets).toHaveLength(2);
    expect(markup.match(/data-testid="wbt-city-ticket"/g)).toHaveLength(2);

    tickets.forEach(([, layout, dateLabel, attributes, content], index) => {
      const { city, url } = expectedCities[index];
      // Tailwind's default spacing scale: min-h-12 = 48px and gap-3 = 12px.
      expect(layout.split(" ")).toEqual([
        "flex", "flex-col", "gap-3", "md:flex-row", "md:items-center", "md:justify-between",
      ]);
      expect(dateLabel).not.toBe("");
      expect(attributes).toContain(`href="${url.replace(/&/g, "&amp;")}"`);
      expect(attributes).toContain('target="_blank"');
      expect(attributes).toContain('rel="noopener sponsored"');
      expect(attributes).toContain(`aria-label="Tickets für Weihnachten mit Bibi &amp; Tina in ${city}"`);
      const classes = attributes.match(/class="([^"]+)"/)![1].split(" ");
      expect(classes).toEqual(expect.arrayContaining([
        "inline-flex", "min-h-12", "w-full", "items-center", "justify-center", "px-5", "py-3",
        "md:min-h-0", "md:w-auto", "md:py-2",
      ]));
      expect(classes.some((className) => className.startsWith("sm:"))).toBe(false);
      expect(content).toBe(`<span class="md:hidden">Tickets für ${city}</span><span class="hidden md:inline">Tickets sichern</span>`);
    });
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
