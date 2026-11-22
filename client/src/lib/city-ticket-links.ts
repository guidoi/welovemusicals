import type { Musical } from "./data";

/** Nur freigegebene Stadtziele; niemals eine Banner-ID als Textlink ableiten. */
export function getCityTicketSelection(
  musical: Pick<Musical, "ticketUrlsByCity" | "defaultTicketCity">,
  selectedCity: string,
) {
  const cities = Object.keys(musical.ticketUrlsByCity ?? {});
  const city = cities.includes(selectedCity) ? selectedCity
    : musical.defaultTicketCity && cities.includes(musical.defaultTicketCity)
      ? musical.defaultTicketCity : cities[0] ?? "";
  return { cities, city, url: musical.ticketUrlsByCity?.[city] };
}
