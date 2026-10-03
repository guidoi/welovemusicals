import type { Musical, MusicalTourDate } from "./data";

export const SITE_URL = "https://welovemusicals.com";

const PROVIDER_URLS: Record<string, string> = {
  "ATG Entertainment": "https://www.atgtickets.de",
  "ATG Touring": "https://www.atgtickets.de",
  "Stage Entertainment": "https://www.stage-entertainment.de",
  "ShowSlot": "https://www.showslot.de",
  "ShowSlot Touring GmbH": "https://showslot.com",
  "Limelight Live Entertainment": "https://www.limelight-entertainment.de",
  "Semmel Concerts": "https://www.semmel.de",
  "Theater Liberi": "https://www.theater-liberi.de",
  "Trinity Concerts": "https://www.trinityconcerts.de",
  "Bavaria Live Promotion": "https://www.bavaria-live.de",
  "Schmidts Tivoli": "https://www.schmidts-tivoli.de",
  // Offizielle Plattform der von Plate & Sommer entwickelten Berliner Musicals.
  "Plate & Sommer": "https://musicalsberlin.com/",
};

export function getCountryForCity(city: string): "DE" | "AT" | "CH" {
  const normalized = city.trim().toLocaleLowerCase("de-DE");
  if (["wien", "graz", "innsbruck", "linz", "dornbirn", "puch bei salzburg", "ried im innkreis", "vöcklabruck", "bad ischl"].includes(normalized)) {
    return "AT";
  }
  if (["zürich", "basel", "bern", "genf", "lausanne", "luzern", "st. gallen"].includes(normalized)) {
    return "CH";
  }
  return "DE";
}

export function getMusicalCanonicalUrl(musical: Pick<Musical, "id" | "slug">): string {
  return `${SITE_URL}/musical/${musical.slug || musical.id}`;
}

function getAbsoluteAssetUrl(value: string): string {
  return new URL(value, `${SITE_URL}/`).href;
}

function getEventIdentifier(musical: Pick<Musical, "id" | "slug">, date: MusicalTourDate): string {
  const city = date.city
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${getMusicalCanonicalUrl(musical)}#event-${city}-${date.startDate}`;
}

function isCurrentOrFutureEvent(date: MusicalTourDate, today: string): boolean {
  return (date.endDate ?? date.startDate) >= today;
}

export type MusicalEventSchema = Record<string, unknown>;

export type MusicalEventSchemaOptions = {
  /**
   * The currently displayed price. It is deliberately optional for static output:
   * the client fills it from the live, Google-Sheets-backed public price source.
   */
  priceFrom?: string;
  today?: string;
};

/**
 * Builds one factual event object per city and run. Event and offer URLs deliberately
 * point to the canonical We Love Musicals detail page, never to an affiliate redirect.
 *
 * `Offer.validFrom` is intentionally omitted for the standard ticket offers: Google
 * requires it only for date-restricted offers, and the catalog has no verified ticket
 * sales-start date for the current, generally available base prices. Inventing one
 * merely to silence a non-critical Search Console recommendation would make the schema
 * less truthful.
 */
export function getMusicalEventSchema(
  musical: Musical,
  date: MusicalTourDate,
  options: MusicalEventSchemaOptions = {},
): MusicalEventSchema {
  const canonicalUrl = getMusicalCanonicalUrl(musical);
  const organizerUrl = PROVIDER_URLS[musical.provider];
  const price = options.priceFrom?.trim();

  return {
    "@type": "MusicEvent",
    "@id": getEventIdentifier(musical, date),
    name: musical.title,
    description: musical.description,
    image: getAbsoluteAssetUrl(musical.image),
    mainEntityOfPage: { "@id": canonicalUrl },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    startDate: date.startDate,
    ...(date.endDate ? { endDate: date.endDate } : {}),
    location: {
      "@type": "MusicVenue",
      name: date.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: date.city,
        addressCountry: getCountryForCity(date.city),
      },
    },
    performer: {
      "@type": "PerformingGroup",
      name: musical.title,
    },
    organizer: {
      "@type": "Organization",
      name: musical.provider,
      ...(organizerUrl ? { url: organizerUrl } : {}),
    },
    ...(price ? {
      offers: {
        "@type": "Offer",
        url: canonicalUrl,
        priceCurrency: "EUR",
        price: price.replace(",", "."),
        availability: "https://schema.org/InStock",
      },
    } : {}),
  };
}

export function getMusicalEventSchemas(
  musical: Musical,
  options: MusicalEventSchemaOptions = {},
): MusicalEventSchema[] {
  const today = options.today ?? new Date().toISOString().slice(0, 10);

  return (musical.tourDates ?? [])
    .filter((date) => isCurrentOrFutureEvent(date, today))
    .map((date) => getMusicalEventSchema(musical, date, options));
}

export function getMusicalEventItemList(
  musical: Musical,
  options: MusicalEventSchemaOptions = {},
): Record<string, unknown> | undefined {
  const events = getMusicalEventSchemas(musical, options);
  if (events.length === 0) return undefined;

  return {
    "@type": "ItemList",
    "@id": `${getMusicalCanonicalUrl(musical)}#events`,
    name: `Termine, Spielstätten und Veranstalter für ${musical.title}`,
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: event,
    })),
  };
}
