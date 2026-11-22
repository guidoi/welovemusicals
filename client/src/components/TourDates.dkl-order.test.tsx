import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAwinLink, getMusicalBySlug } from "@/lib/data";
import TourDates from "./TourDates";

const citiesIn = (markup: string) => Array.from(markup.matchAll(/data-tour-city="([^"]+)"/g), (match) => match[1]);
afterEach(() => vi.useRealTimers());

function freezeDate() {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-22T12:00:00"));
}

describe("Der Kleine Lord: vollständige Tourübersicht", () => {
  it("zeigt Berlin einmalig zuerst und alle 20 Tourstädte darunter, auch bei alter Berliner Vorauswahl", () => {
    freezeDate();
    const musical = getMusicalBySlug("der-kleine-lord")!;
    const markup = renderToStaticMarkup(
      <TourDates musicalId={musical.id} tourDates={musical.tourDates!} hideCityFilter selectedCity="Berlin" />,
    );
    expect(citiesIn(markup)).toEqual(musical.cities);
    expect(citiesIn(markup)).toHaveLength(21);
    expect(citiesIn(markup).filter((city) => city === "Berlin")).toEqual(["Berlin"]);
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("combobox");
    expect(markup).not.toContain("data-wbt-city");
    expect(markup).not.toContain('data-testid="wbt-city-ticket"');
    expect(markup).toContain("Rhein-Mosel-Halle");
    expect(markup).toContain("28.11.2027 – 29.11.2027");
    expect(markup).toContain("TipsArena");
    expect(markup).toContain("26.12.2027");
    for (const date of musical.tourDates!) {
      expect(markup).toContain(`href="${date.eventimUrl.replace(/&/g, "&amp;")}"`);
    }
    expect(markup.match(/rel="noopener sponsored"/g)).toHaveLength(21);
    expect(markup.match(/>Tickets sichern<\/a>/g)).toHaveLength(21);
  });

  it("pinnt nur für DKL Berlin vor alphabetisch früheren Städten und gruppiert mehrere Berliner Termine", () => {
    freezeDate();
    const date = { venue: "Testspielstätte", startDate: "2027-12-01", endDate: "2027-12-02", eventimUrl: createAwinLink("https://www.eventim.de/") };
    // Aachen ist eine reine Sortier-Testfixture, kein veröffentlichter DKL-Tourstopp.
    const tourDates = [
      { ...date, city: "Aachen" },
      { ...date, city: "Berlin" },
      { ...date, city: "Berlin", startDate: "2027-12-03", endDate: "2027-12-04" },
    ];
    const dkl = renderToStaticMarkup(<TourDates musicalId="der-kleine-lord" tourDates={tourDates} hideCityFilter />);
    const other = renderToStaticMarkup(<TourDates musicalId="andere-show" tourDates={tourDates} hideCityFilter />);
    expect(citiesIn(dkl)).toEqual(["Berlin", "Aachen"]);
    expect(citiesIn(other)).toEqual(["Aachen", "Berlin"]);
    expect(dkl).toContain("01.12.2027 – 02.12.2027");
    expect(dkl).toContain("03.12.2027 – 04.12.2027");
  });
});
