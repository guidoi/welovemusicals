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

## Aktualisierungszeit und Ausfallsicherheit

Nach einer Änderung in Google Sheets kann Google den Export zunächst zwischenspeichern. Die Website verwendet zusätzlich einen serverseitigen Cache von **bis zu zehn Minuten**. Üblicherweise wird eine Änderung deshalb nach wenigen Minuten, spätestens nach dem nächsten Cache-Abruf sichtbar.

Wenn Google Sheets kurzzeitig nicht erreichbar ist oder eine Tabellenzeile fehlerhaft formatiert wurde, bleiben die letzten erfolgreich geprüften Preise und Aktionen aktiv. Falls noch kein erfolgreicher Abruf vorliegt, verwendet die Website weiterhin die redaktionell hinterlegten Standardwerte. Eine fehlerhafte externe Quelle führt somit nicht zu leeren Preisen oder einer defekten Website.

## Wichtige Regeln

`musical_id` darf nicht umbenannt werden. Zusätzliche Notiz-, Link- oder Bearbeitungsspalten sind für die Website nicht erforderlich und werden bewusst ignoriert. Ticket- und Affiliate-Links bleiben außerhalb dieser Preisquelle zentral gepflegt, damit Preisänderungen keine bestehende Partnerzuordnung überschreiben.
