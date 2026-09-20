import type { City } from "./data";

const CURRENT_SEASON = "2026/2027";
const MAX_DESCRIPTION_LENGTH = 160;

type CitySeoInput = Pick<City, "name" | "description">;

function trimAtWordBoundary(value: string, maxLength = MAX_DESCRIPTION_LENGTH): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength - 1);
  const wordBoundary = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, wordBoundary > 0 ? wordBoundary : truncated.length).trimEnd()}…`;
}

export function getCityPageTitle(cityName: string): string {
  return `Musicals in ${cityName} ${CURRENT_SEASON}: Termine & Tickets | We Love Musicals`;
}

export function getCityPageHeading(cityName: string): string {
  return `Musicals in ${cityName} ${CURRENT_SEASON}`;
}

export function getCityPageDescription(city: CitySeoInput, musicalCount: number): string {
  const program = musicalCount > 0
    ? `${musicalCount} ${musicalCount === 1 ? "Musical" : "Musicals"} in ${city.name}`
    : `Aktuelle Musical-Termine in ${city.name}`;

  return trimAtWordBoundary(
    `${program}: Entdecke Shows, Spielorte und Ticketlinks für deinen Musicalabend. ${city.description}`,
  );
}

export function getCitySeo(city: CitySeoInput, musicalCount: number) {
  return {
    title: getCityPageTitle(city.name),
    heading: getCityPageHeading(city.name),
    description: getCityPageDescription(city, musicalCount),
  };
}
