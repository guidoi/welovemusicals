import type { City, Musical } from "./data";

const CURRENT_SEASON = "2026/2027";
const MAX_HIGHLIGHTS = 4;

export type CityEditorialHighlight = {
  title: string;
  slug: string;
  venue?: string;
};

export type CityEditorialVenue = {
  name: string;
  musicalTitles: string[];
};

export type CityEditorialPlanningStep = {
  title: string;
  text: string;
};

export type CityEditorialContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  highlightsHeading: string;
  highlights: CityEditorialHighlight[];
  venuesHeading: string;
  venues: CityEditorialVenue[];
  planningHeading: string;
  planningSteps: CityEditorialPlanningStep[];
};

function getVenueForCity(musical: Musical, cityName: string): string | undefined {
  const matchingTourDate = musical.tourDates?.find((tourDate) => tourDate.city === cityName);
  return matchingTourDate?.venue ?? musical.venue;
}

function joinNaturalLanguage(values: string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} und ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} und ${values.at(-1)}`;
}

function getVenueSummary(venues: CityEditorialVenue[]): string {
  const venueNames = venues.map((venue) => venue.name);
  if (venueNames.length === 0) return "den aktuellen Spielstätten";
  if (venueNames.length <= 2) return joinNaturalLanguage(venueNames);
  return `${joinNaturalLanguage(venueNames.slice(0, 2))} und weiteren Spielstätten`;
}

function getHighlights(musicals: Musical[], cityName: string): CityEditorialHighlight[] {
  return [...musicals]
    .sort((left, right) => {
      if (Boolean(left.featured) !== Boolean(right.featured)) return left.featured ? -1 : 1;
      return left.title.localeCompare(right.title, "de");
    })
    .slice(0, MAX_HIGHLIGHTS)
    .map((musical) => ({
      title: musical.title,
      slug: musical.slug,
      venue: getVenueForCity(musical, cityName),
    }));
}

function getVenues(musicals: Musical[], cityName: string): CityEditorialVenue[] {
  const titlesByVenue = new Map<string, string[]>();

  for (const musical of musicals) {
    const venue = getVenueForCity(musical, cityName);
    if (!venue) continue;

    const titles = titlesByVenue.get(venue) ?? [];
    if (!titles.includes(musical.title)) titles.push(musical.title);
    titlesByVenue.set(venue, titles);
  }

  return Array.from(titlesByVenue.entries())
    .map(([name, musicalTitles]) => ({
      name,
      musicalTitles: [...musicalTitles].sort((left, right) => left.localeCompare(right, "de")),
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "de"));
}

function getIntro(city: City, highlights: CityEditorialHighlight[], venues: CityEditorialVenue[]): string {
  const showNames = joinNaturalLanguage(highlights.slice(0, 3).map((highlight) => highlight.title));
  const venueSummary = getVenueSummary(venues);

  const citySpecificIntros: Record<string, string> = {
    hamburg: `Hamburg bündelt große Musicalproduktionen an der Elbe, am Hafen und in St. Pauli. ${showNames} gehören aktuell zum Programm – prüfe vor der Planung immer Theater, Termin und den passenden Ticketweg zusammen.`,
    bochum: `Bochum verbindet große Tournee-Gastspiele im RuhrCongress mit dem festen Starlight Express Theater. ${showNames} zählen aktuell zum Programm; der genaue Spielort ist deshalb der beste Startpunkt für deine Abendplanung.`,
    berlin: `Berlin verbindet feste Musicalspielstätten mit wechselnden Gastspielen. ${showNames} stehen aktuell auf dem Programm; achte bei der Auswahl besonders auf Laufzeit und Spielort.`,
    stuttgart: `Stuttgart kombiniert große Musicaltheater mit Tournee-Gastspielen. ${showNames} gehören aktuell dazu – entscheide zuerst, ob dein Abend ins Apollo, Palladium oder zu einem Gastspiel führen soll.`,
    koeln: `Köln vereint feste Produktionen und Tournee-Gastspiele an unterschiedlichen Spielorten. ${showNames} bilden den aktuellen Einstieg; mit dem Spielort ${venueSummary} lässt sich der Besuch gezielt planen.`,
  };

  if (citySpecificIntros[city.slug]) return citySpecificIntros[city.slug];

  if (highlights.length === 1) {
    return `In ${city.name} ist aktuell ${showNames} angekündigt. Der Besuch führt in ${venueSummary}; prüfe Termin, Einlass und Ticketangebot vor deiner Planung direkt an der gewählten Show.`;
  }

  return `In ${city.name} stehen aktuell ${showNames} und weitere Musicals auf dem Programm. Die Produktionen verteilen sich auf ${venueSummary}; so kannst du Show, Spielort und Termin passend zu deinem Musicalabend kombinieren.`;
}

function getPlanningSteps(city: City, venues: CityEditorialVenue[]): CityEditorialPlanningStep[] {
  const venueSummary = getVenueSummary(venues);
  const citySpecificFirstStep: Record<string, CityEditorialPlanningStep> = {
    hamburg: {
      title: "Theater und Stadtteil zusammen planen",
      text: "Die Hamburger Musicaltheater liegen an unterschiedlichen Orten. Vergleiche vorab Spielstätte, Anreisehinweise und Einlasszeit des jeweiligen Theaters.",
    },
    bochum: {
      title: "RuhrCongress und STARLIGHT EXPRESS Theater unterscheiden",
      text: "Beide Spielstätten gehören zum aktuellen Programm, liegen aber nicht am selben Veranstaltungsort. Wähle deshalb zuerst deine Show und prüfe danach die passende Route.",
    },
    berlin: {
      title: "Laufzeit und Spielort zusammen prüfen",
      text: "In Berlin wechseln Gastspiele, während andere Produktionen fest spielen. Die Showkarte zeigt dir, welches Theater und welcher Zeitraum aktuell passen.",
    },
    stuttgart: {
      title: "Das passende Theater auswählen",
      text: "Apollo, Palladium und Gastspielorte stehen für unterschiedliche Produktionen. Mit dem Spielort auf der Showkarte planst du Anreise und Abend gezielt.",
    },
  };

  return [
    citySpecificFirstStep[city.slug] ?? {
      title: "Spielstätte mit der Show abgleichen",
      text: `Die aktuellen Produktionen spielen in ${venueSummary}. Prüfe den auf der Showkarte genannten Ort, bevor du deine Anreise festlegst.`,
    },
    {
      title: "Anreise und Einlass rechtzeitig prüfen",
      text: "Aktuelle Hinweise zu ÖPNV, Parken, Einlass und möglichen Besonderheiten veröffentlicht die jeweilige Spielstätte. Plane für den Besuch ausreichend Zeit ein.",
    },
    {
      title: "Den passenden Stadttermin buchen",
      text: "Bei Tourneeproduktionen führt der Weg über die Detailseite zum passenden Termin. Preise, Platzwahl und Verfügbarkeit bestätigt der Ticketpartner verbindlich.",
    },
  ];
}

export function getCityEditorialContent(city: City, musicals: Musical[]): CityEditorialContent | undefined {
  if (musicals.length === 0) return undefined;

  const highlights = getHighlights(musicals, city.name);
  const venues = getVenues(musicals, city.name);

  return {
    eyebrow: `AKTUELL IN ${city.name.toLocaleUpperCase("de-DE")} · MUSICALS & SHOWS ${CURRENT_SEASON}`,
    heading: `Musicalabend in ${city.name}: Highlights & Planung`,
    intro: getIntro(city, highlights, venues),
    highlightsHeading: `Aktuelle Highlights in ${city.name}`,
    highlights,
    venuesHeading: "Spielstätten im aktuellen Programm",
    venues,
    planningHeading: `Deinen Musicalabend in ${city.name} planen`,
    planningSteps: getPlanningSteps(city, venues),
  };
}
