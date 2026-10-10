import type { City, Musical } from "./data";

const CURRENT_SEASON = "2026/2027";
const MAX_DESCRIPTION_LENGTH = 160;

type CitySeoInput = Pick<City, "name" | "description">;
type CityProgramMusical = Pick<Musical, "title" | "tourDates">;
type CityProgramEntry = {
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
};

function trimAtWordBoundary(value: string, maxLength = MAX_DESCRIPTION_LENGTH): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength - 1);
  const wordBoundary = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, wordBoundary > 0 ? wordBoundary : truncated.length).trimEnd()}…`;
}

export function getUpcomingCityProgram(cityName: string, musicals: CityProgramMusical[]): CityProgramEntry[] {
  const today = new Date().toISOString().slice(0, 10);

  return musicals
    .flatMap((musical) => (musical.tourDates ?? [])
      .filter((date) => date.city === cityName && (date.endDate ?? date.startDate) >= today)
      .map((date) => ({
        title: musical.title,
        venue: date.venue,
        startDate: date.startDate,
        endDate: date.endDate ?? date.startDate,
      })))
    .sort((first, second) => first.startDate.localeCompare(second.startDate));
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} und ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} und ${items.at(-1)}`;
}

function getProgramDescription(city: CitySeoInput, musicalCount: number, musicals: CityProgramMusical[]): string {
  const program = getUpcomingCityProgram(city.name, musicals);
  const showTitles: string[] = Array.from(new Set<string>(program.map((entry) => entry.title))).slice(0, 3);
  const venues: string[] = Array.from(new Set<string>(program.map((entry) => entry.venue))).slice(0, 2);

  if (showTitles.length > 0) {
    const additionalShows = new Set(program.map((entry) => entry.title)).size > showTitles.length;
    const venueText = venues.length === 1
      ? `im ${venues[0]}`
      : `in ${formatList(venues)}`;
    const showText = `${formatList(showTitles)}${additionalShows ? " und weitere Shows" : ""}`;

    return trimAtWordBoundary(
      `Musicals in ${city.name}: ${showText} ${venueText}. Aktuelle Termine und Tickets ${CURRENT_SEASON}.`,
    );
  }

  const programText = musicalCount > 0
    ? `${musicalCount} ${musicalCount === 1 ? "Musical" : "Musicals"} mit aktuellen Spielterminen`
    : "Aktuelle Musical-Termine";

  return trimAtWordBoundary(
    `${programText} in ${city.name}: Spielorte, Termine und Ticketinfos ${CURRENT_SEASON}. ${city.description}`,
  );
}

export function getCityPageTitle(cityName: string): string {
  return `Musicals in ${cityName} – Termine & Tickets ${CURRENT_SEASON}`;
}

export function getCityPageHeading(cityName: string): string {
  return `Musicals in ${cityName}: Termine ${CURRENT_SEASON}`;
}

export function getCityPageDescription(
  city: CitySeoInput,
  musicalCount: number,
  musicals: CityProgramMusical[] = [],
): string {
  return getProgramDescription(city, musicalCount, musicals);
}

export function getCitySeo(
  city: CitySeoInput,
  musicalCount: number,
  musicals: CityProgramMusical[] = [],
) {
  return {
    title: getCityPageTitle(city.name),
    heading: getCityPageHeading(city.name),
    description: getCityPageDescription(city, musicalCount, musicals),
  };
}
