export type CityGuide = {
  heading: string;
  intro: string;
  steps: Array<{ title: string; text: string }>;
  officialLinks?: Array<{ label: string; href: string }>;
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
  bremen: {
    heading: "Musicaltermine im Metropol Theater Bremen planen",
    intro: "Bremen bündelt die aktuell gelisteten Tournee-Musicals im Metropol Theater. Auf dieser Seite stehen die konkreten Laufzeiten und Produktionen für die Hansestadt übersichtlich zusammen.",
    steps: [
      {
        title: "Zeitraum und Produktion vergleichen",
        text: "Mehrere Tourneen machen nacheinander in Bremen Halt. Prüfe vor der Planung die jeweilige Laufzeit direkt auf der Showkarte, damit dein Wunschtermin zur richtigen Produktion führt.",
      },
      {
        title: "Metropol Theater als Spielort einplanen",
        text: "Die gelisteten Gastspiele finden im Metropol Theater statt. Nimm Spielbeginn und den individuellen Einlasshinweis des Veranstalters in deine Abendplanung auf.",
      },
      {
        title: "Stadttermin gezielt buchen",
        text: "Über den Ticketbutton auf der passenden Showkarte gelangst du zum jeweiligen Terminangebot. Dort sind Sitzplätze, Preise und Verfügbarkeit verbindlich.",
      },
    ],
  },
  duisburg: {
    heading: "Musicaltermine im Theater am Marientor Duisburg planen",
    intro: "Das Theater am Marientor ist der aktuelle Anlaufpunkt für die gelisteten Musicaltourneen in Duisburg. Die Programmübersicht hilft, Produktion, Datum und Spielstätte vor dem Ticketkauf abzugleichen.",
    steps: [
      {
        title: "Tournee-Daten genau vergleichen",
        text: "In Duisburg wechseln die Produktionen über die Saison hinweg. Vergleiche daher zuerst die Laufzeit auf der jeweiligen Showkarte mit deinem Wunschtermin.",
      },
      {
        title: "Theaterbesuch zeitlich planen",
        text: "Plane für Anreise, Einlass und Garderobe ausreichend Zeit ein. Die aktuellen Hinweise zum Einlass veröffentlicht der Veranstalter für die einzelne Vorstellung.",
      },
      {
        title: "Passenden Termin beim Anbieter prüfen",
        text: "Der rote Ticketbutton führt zum passenden Angebot. Preise, Kategorien und freie Plätze werden dort aktuell und verbindlich ausgewiesen.",
      },
    ],
  },
  graz: {
    heading: "Musicaltermine in Graz an der Helmut List Halle planen",
    intro: "Graz empfängt die aktuell gelisteten Musicaltourneen in der Helmut List Halle. Die Übersicht bündelt die Produktionen und Zeiträume für einen gezielten Musicalabend in der steirischen Hauptstadt.",
    steps: [
      {
        title: "Produktion und Reisetermin abstimmen",
        text: "Die Gastspiele liegen an unterschiedlichen Wochenenden. Prüfe zuerst die auf der Karte ausgewiesene Laufzeit, bevor du Anreise und Übernachtung planst.",
      },
      {
        title: "Helmut List Halle als Spielort berücksichtigen",
        text: "Alle aktuell gelisteten Tournee-Termine in Graz führen zur Helmut List Halle. Achte bei der Abendplanung auf den konkreten Vorstellungsbeginn und die Hinweise des Veranstalters.",
      },
      {
        title: "Tickets für den Graz-Termin auswählen",
        text: "Über die jeweilige Showkarte erreichst du das passende Terminangebot. Platzwahl, Preis und Verfügbarkeit werden beim Ticketanbieter verbindlich angezeigt.",
      },
    ],
  },
  innsbruck: {
    heading: "Musicaltermine in Innsbruck planen",
    intro: "In Innsbruck verteilen sich die aktuell gelisteten Tournee-Musicals auf die Säle des Congress Innsbruck. Die Karten oben nennen den jeweiligen Saal und Zeitraum, damit du das passende Gastspiel gezielt auswählst.",
    steps: [
      {
        title: "Saal und Datum zusammen prüfen",
        text: "Je nach Produktion findet das Gastspiel im Saal Tirol oder in der Dogana statt. Vergleiche Spielort und Termin auf der jeweiligen Showkarte vor der Buchung.",
      },
      {
        title: "Anreise zum Congress Innsbruck planen",
        text: "Plane den Theaterbesuch mit genügend Zeit für Anreise und Einlass. Aktuelle Einlass- und Veranstaltungsinformationen veröffentlicht der jeweilige Anbieter.",
      },
      {
        title: "Ticketangebot für Innsbruck öffnen",
        text: "Der Ticketbutton führt zum passenden Stadttermin. Dort siehst du die aktuelle Platzwahl, Preise und Verfügbarkeit für die gewählte Vorstellung.",
      },
    ],
  },
};

export function getCityGuide(citySlug: string): CityGuide | undefined {
  return CITY_GUIDES[citySlug];
}
