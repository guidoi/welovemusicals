import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TourDates from "./TourDates";

describe("TourDates", () => {
  it("zeigt Ticketdaten ohne Anbieterlogo in der Ticketkarte", () => {
    const markup = renderToStaticMarkup(
      <TourDates
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
  });
});
