export type CityGuide = {
  heading: string;
  intro: string;
  steps: Array<{ title: string; text: string }>;
  officialLinks: Array<{ label: string; href: string }>;
};

const CITY_GUIDES: Record<string, CityGuide> = {
  hamburg: {
    heading: "Musicalabend in Hamburg planen",
    intro: "Hamburg verbindet große Musicaltheater am Hafen, an der Elbe und rund um St. Pauli. Wähle zuerst die Show, prüfe dann Spielort und Termin – so führt der Ticketweg direkt zum passenden Angebot.",
    steps: [
      {
        title: "Show und Spielort zusammen wählen",
        text: "Die Übersicht oben ordnet jede Produktion ihrem Theater zu. So lässt sich ein Musicalabend besser mit dem gewünschten Stadtteil und der Anreise verbinden.",
      },
      {
        title: "Hafen- und Elbtheater rechtzeitig ansteuern",
        text: "Für Theater am Hafen und an der Elbe informiert der jeweilige Veranstalter über die aktuelle Anreise und den Shuttleverkehr ab den Landungsbrücken. Prüfe Zeiten und Hinweise immer vor dem Besuch direkt beim Theater.",
      },
      {
        title: "Ticketangebot vor dem Kauf prüfen",
        text: "Preise, Platzwahl und Verfügbarkeit werden beim jeweiligen Ticketanbieter verbindlich angezeigt. Unsere roten Ticketbuttons führen direkt zum passenden Partnerangebot.",
      },
    ],
    officialLinks: [
      {
        label: "Offizielle Übersicht der Hamburger Musicaltheater",
        href: "https://www.hamburg-travel.com/see-explore/musicals-shows/musicaltheater/",
      },
      {
        label: "Anreisehinweise für das Stage Theater im Hafen",
        href: "https://www.stage-entertainment.de/musicals-shows/disneys-der-koenig-der-loewen-hamburg/theater-anfahrt",
      },
    ],
  },
  berlin: {
    heading: "Musicalabend in Berlin planen",
    intro: "Berlin vereint feste Musicalspielstätten und wechselnde Gastspiele. Wähle deshalb zuerst Produktion und Zeitraum, bevor du den Spielort und das passende Ticketangebot prüfst.",
    steps: [
      {
        title: "Zeitraum zuerst prüfen",
        text: "Bei Tournee- und Gastspielproduktionen kann sich der Berliner Zeitraum unterscheiden. Die Karten oben zeigen Spielort und aktuelle Laufzeit für die jeweilige Show.",
      },
      {
        title: "Anreise zum Theater planen",
        text: "Für das Stage Theater des Westens nennt der Veranstalter den Bahnhof Zoologischer Garten als nahe gelegenen ÖPNV-Knoten. Prüfe für jeden Spielort die aktuellen Anreise- und Einlasshinweise direkt beim Theater.",
      },
      {
        title: "Verfügbarkeit beim Anbieter bestätigen",
        text: "Der Ticketanbieter zeigt Plätze, Preise und Verfügbarkeit verbindlich an. Unsere Ticketbuttons führen zur passenden Show oder, bei Tourneen, direkt zum Stadttermin.",
      },
    ],
    officialLinks: [
      {
        label: "Offizielle Übersicht zu Shows und Musicals in Berlin",
        href: "https://www.visitberlin.de/de/shows-musicals",
      },
      {
        label: "Anreise zum Stage Theater des Westens",
        href: "https://www.stage-entertainment.de/musicals-shows/wir-sind-am-leben-berlin/theater-anfahrt",
      },
    ],
  },
};

export function getCityGuide(citySlug: string): CityGuide | undefined {
  return CITY_GUIDES[citySlug];
}
