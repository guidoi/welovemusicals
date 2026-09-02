# Cookie- und Drittanbieter-Audit

Stand: 2. September 2026

## Ausgangslage

Die Website bindet optionale Dienste für Reichweitenmessung, Affiliate-/Kampagnenmessung und externe Videos ein. Für die Umsetzung wurde deshalb ein Consent-Modell mit notwendigen sowie optionalen Kategorien gewählt.

| Kategorie | Technische Dienste | Verhalten ohne aktive Auswahl |
|---|---|---|
| Technisch notwendig | Speicherung der Consent-Auswahl und Darstellungseinstellungen | aktiv |
| Reichweitenmessung | Umami | blockiert |
| Partner- und Affiliate-Messung | Awin MasterTag, TradeDoubler Link Converter, Aovo-Impressionen | blockiert |
| Externe Medien und Schriftarten | YouTube-Embed, Google Fonts | blockiert |

Normale Ticket- und Angebotslinks bleiben bewusst nutzbar. Die Weiterleitung zu einem Partner findet erst nach einem bewussten Klick statt.

## Quellen und Kernaussagen

Die Bundesbeauftragte für den Datenschutz und die Informationsfreiheit unterscheidet zwischen technisch notwendigen und nicht notwendigen Tracking-Technologien. Nicht notwendige Tracking-Technologien benötigen grundsätzlich eine Einwilligung; über notwendige Speicherungen ist zu informieren.

Die Datenschutzaufsicht Baden-Württemberg erläutert, dass ein Cookie-Banner nicht erforderlich ist, wenn keine einwilligungsbedürftigen Verarbeitungen stattfinden. Für eingebettete YouTube-Videos wird eine Zwei-Klick-Lösung empfohlen: Erst nach transparenter Information und aktiver Interaktion sollen Daten an die Videoplattform fließen.

## Originalquellen

1. BfDI, „Cookies und andere Tracking-Technologien“: https://www.bfdi.bund.de/DE/Buerger/Inhalte/Telemedien/Cookies.html
2. LfDI Baden-Württemberg, „Einbindung von Videos in eigene Webseiten“: https://www.baden-wuerttemberg.datenschutz.de/videos-einbinden/
3. LfDI Baden-Württemberg, „FAQ zu Cookies und Tracking“: https://www.baden-wuerttemberg.datenschutz.de/faq-zu-cookies-und-tracking-2/

> Diese Dokumentation ist eine technische Arbeitsgrundlage und ersetzt keine rechtliche Prüfung der finalen Datenschutzerklärung.
