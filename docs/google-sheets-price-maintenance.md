# Preise und Aktionen über Google Sheets pflegen

Die Preise und Sale-Hinweise von **We Love Musicals** werden über die private Arbeitsmappe gepflegt. Für die Website ist ausschließlich das schmale, veröffentlichte Tabellenblatt **`Website-Export`** freigegeben. Die private Bearbeitungstabelle wird weder im Frontend angezeigt noch von der Website an Besucher ausgeliefert.

## Regelmäßige Pflege

Änderungen erfolgen in der Bearbeitungstabelle **`Preise & Aktionen`**. Das Blatt `Website-Export` übernimmt ausschließlich die für den öffentlichen Auftritt notwendigen Felder. Die Website ruft den veröffentlichten CSV-Export serverseitig ab; Besucher erhalten dabei weder die Tabellenadresse noch nicht freigegebene Spalten.

| Feld | Eingabe | Wirkung auf der Website |
|---|---|---|
| `musical_id` | Unverändert lassen | Eindeutige technische Zuordnung des Musicals. |
| `Preis ab` | Zahl, beispielsweise `39,99` oder `39,99 €` | Aktualisiert den Einstiegspreis in Teasern, Detailseiten, Fakten und geeigneten Textstellen. |
| `Sale aktiv` | `Ja` oder `Nein` | Aktiviert bzw. deaktiviert den Sale-Störer. |
| `Sale-Text` | Beispielsweise `BIS 40 %`, `2 FÜR 1` oder `2. TICKET 35 €` | Sichtbarer Vorteil im Sale-Störer. Bei aktivem Sale erforderlich. |
| `Sale-Hinweis` | Optionaler kurzer Hinweis | Ergänzende Information auf der Detailseite, sofern dort verwendet. |
| `Gültig ab` | `TT.MM.JJJJ` oder `JJJJ-MM-TT` | Sale erscheint frühestens an diesem Tag. Optional. |
| `Gültig bis` | `TT.MM.JJJJ` oder `JJJJ-MM-TT` | Sale endet nach diesem Tag. Optional. |
| `Ticketlink` | Vollständiger HTTPS-Affiliate- oder Ticketlink | Optional. Ersetzt die zentralen Ticket-CTAs für genau dieses Musical. Akzeptiert werden nur freigegebene Hosts von AWIN, Stage, Tradedoubler, Eventim, oeticket und ATG. |

> **Linkformat:** In `Ticketlink` gehört stets der komplette von AWIN, Stage, Tradedoubler, Eventim, oeticket oder ATG bereitgestellte Trackinglink. Die Website übernimmt diesen direkt und verschachtelt ihn nicht erneut in eine Affiliate-Umleitung.

## Aktualisierungszeit und Ausfallsicherheit

Nach einer Änderung in Google Sheets kann Google den Export zunächst zwischenspeichern. Die Website prüft den veröffentlichten Export mindestens **einmal pro Minute**; offene Seiten fragen die Preisquelle ebenfalls minütlich neu ab, beim nächsten Seitenaufruf sofort. Die Website selbst speichert keine alte Browserantwort. Google bestimmt lediglich eine zusätzliche, kurze Veröffentlichungsverzögerung des CSV-Exports, die technisch nicht beschleunigt werden kann.

Die Website ermittelt den aktuellen Stand automatisch; nach dem Eintragen ist weder ein Manus-Login noch ein Datei-Upload noch ein manueller Website-Refresh erforderlich. Bei einer bereits geöffneten Seite wird der neue Stand innerhalb des nächsten Minutenintervalls geladen. Bei einem neuen Seitenaufruf erscheint der zuletzt von Google veröffentlichte Stand sofort.

Wenn Google Sheets kurzzeitig nicht erreichbar ist oder eine Tabellenzeile fehlerhaft formatiert wurde, bleiben die letzten erfolgreich geprüften Preise und Aktionen aktiv. Falls noch kein erfolgreicher Abruf vorliegt, verwendet die Website weiterhin die redaktionell hinterlegten Standardwerte. Eine fehlerhafte externe Quelle führt somit nicht zu leeren Preisen oder einer defekten Website.

## Wichtige Regeln

`musical_id` darf nicht umbenannt werden. Zusätzliche Notiz- oder Bearbeitungsspalten werden bewusst ignoriert. Die optionale Spalte `Ticketlink` ist die einzige Linkspalte, die für das jeweilige Musical übernommen wird; ungültige oder nicht freigegebene Ziele werden verworfen, der bisherige sichere Ticketlink bleibt dann aktiv.
