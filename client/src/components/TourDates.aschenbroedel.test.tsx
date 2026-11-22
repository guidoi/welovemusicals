import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMusicalBySlug, type MusicalTourDate } from "@/lib/data";
import fixture from "@/lib/__fixtures__/aschenbroedel-showslot-tour-2026-2028.json";
import TourDates from "./TourDates";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-22T12:00:00"));
});
afterEach(() => vi.useRealTimers());

const citiesIn = (markup: string) =>
  Array.from(markup.matchAll(/data-tour-city="([^"]+)"/g), (match) => match[1]);
const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const formatDay = (iso: string) => iso.split("-").reverse().join(".");
const labelFor = (date: MusicalTourDate) => date.startDate === date.endDate
  ? formatDay(date.startDate)
  : `${formatDay(date.startDate)} – ${formatDay(date.endDate!)}`;

function cityBox(markup: string, city: string): string {
  const start = markup.indexOf(`data-tour-city="${escapeHtml(city)}"`);
  expect(start, `Stadtbox ${city}`).toBeGreaterThanOrEqual(0);
  const next = markup.indexOf("data-tour-city=", start + 1);
  return markup.slice(start, next === -1 ? undefined : next);
}

describe("Aschenbrödel: TourDates-Rendering, Stand 22.11.2026", () => {
  it("rendert genau eine Box je 77 Städten und alle 95 Blöcke chronologisch, auch bei umgekehrter Eingabe", () => {
    const musical = getMusicalBySlug("drei-haselnuesse-fuer-aschenbroedel")!;
    const dates = musical.tourDates!;
    const originalOrder = dates.map((date) => `${date.city}|${date.startDate}`);
    const markup = renderToStaticMarkup(
      <TourDates
        musicalId={musical.id}
        tourDates={[...dates].reverse()}
        forceDropdown
        hideCityFilter
        selectedCity="Berlin"
      />,
    );
    const renderedCities = citiesIn(markup);
    expect(renderedCities).toHaveLength(77);
    expect(new Set(renderedCities).size).toBe(77);
    expect(renderedCities).toEqual([...(musical.cities ?? [])].sort((a, b) => a.localeCompare(b, "de")));
    expect(markup.match(/>Tickets sichern<\/a>/g)).toHaveLength(95);
    expect(markup.match(/rel="noopener sponsored"/g)).toHaveLength(95);
    expect(markup).not.toContain("combobox");
    expect(markup).not.toContain("<button");

    for (const city of renderedCities) {
      const box = cityBox(markup, city);
      const cityDates = dates.filter((date) => date.city === city)
        .sort((a, b) => a.startDate.localeCompare(b.startDate));
      expect(box.match(/>Tickets sichern<\/a>/g), city).toHaveLength(cityDates.length);
      let previousPosition = -1;
      for (const date of cityDates) {
        const label = labelFor(date);
        const position = box.indexOf(label);
        expect(position, `${city}: ${label}`).toBeGreaterThan(previousPosition);
        expect(box).toContain(`href="${escapeHtml(date.eventimUrl)}"`);
        previousPosition = position;
      }
    }
    expect(cityBox(markup, "Kempten")).toContain("22.11.2026");
    expect(cityBox(markup, "Neu-Ulm")).toContain("15.01.2028 – 16.01.2028");
    expect(dates.map((date) => `${date.city}|${date.startDate}`)).toEqual(originalOrder);
  });

  it("zeigt getrennte Gastspiele als einzelne Zeilen statt erfundener Sammelfenster und filtert Alttermine", () => {
    const musical = getMusicalBySlug("drei-haselnuesse-fuer-aschenbroedel")!;
    const markup = renderToStaticMarkup(
      <TourDates
        musicalId={musical.id}
        tourDates={[...fixture.expiredStops, ...musical.tourDates!].reverse()}
        hideCityFilter
      />,
    );
    expect(citiesIn(markup)).toHaveLength(77);
    expect(markup.match(/>Tickets sichern<\/a>/g)).toHaveLength(95);
    for (const city of ["Dresden", "Frankfurt am Main", "Ravensburg", "Zwickau", "Deggendorf",
      ...fixture.resolvedAggregates.map((aggregate) => aggregate.city)]) {
      const box = cityBox(markup, city);
      const cityDates = musical.tourDates!.filter((date) => date.city === city)
        .sort((a, b) => a.startDate.localeCompare(b.startDate));
      expect(box.match(/>Tickets sichern<\/a>/g), city).toHaveLength(cityDates.length);
      for (const date of cityDates) expect(box).toContain(labelFor(date));
      expect(box, `Kein Sammelfenster für ${city}`).not.toContain(
        `${formatDay(cityDates[0].startDate)} – ${formatDay(cityDates.at(-1)!.endDate!)}`,
      );
    }
    expect(citiesIn(markup)).not.toContain("Bad Neustadt a. d. Saale");
    expect(citiesIn(markup)).not.toContain("Zweibrücken");
    expect(cityBox(markup, "Kempten")).toContain("22.11.2026");
  });
});
