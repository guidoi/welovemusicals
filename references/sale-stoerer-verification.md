# Sale-Störer – Prüfung

Die Teaser-Karte von KÖNIG DER LÖWEN zeigt die Aktion „Familientage“ als kompakten, hochkontrastierenden Störer auf dem Keyvisual. Dargestellt werden „Bis 15 % sparen“ sowie der Familien-Tickets-Hinweis.

Die Darstellung wurde am 28.08.2026 sowohl im Desktop-Viewport (1280 × 720 px) als auch im Mobil-Viewport (375 × 812 px) kontrolliert. Der Störer bleibt innerhalb des Bildbereichs, kollidiert nicht mit dem Top-Musical-Badge und ist auch auf kleineren Displays lesbar.

Die anschließende Browserprüfung auf der Startseite bestätigte die gerenderte Reihenfolge und den Inhalt: „Aktion Familientage“, „Bis 15 % sparen“ sowie der Familien-Tickets-Hinweis stehen vollständig auf der KÖNIG-DER-LÖWEN-Karte. Im Desktop-Layout liegt der Sale-Störer links oben; das unabhängige Top-Musical-Badge bleibt rechts oben sichtbar.

Für die mobile Prüfung wurde eine Chromium-Sitzung mit 375 × 812 px gezielt zur Top-Musical-Sektion gescrollt. Der Sale-Störer ist vollständig sichtbar, bleibt oberhalb des Kartentitels im Keyvisual und hat ausreichend Abstand zum rechts positionierten Top-Musical-Badge. Aktionsname, Rabatt und Hinweis sind lesbar; kein Inhalt wird überdeckt oder abgeschnitten.

Die Vitest-Suite, inklusive eines serverseitigen Rendering-Tests für MusicalCard, sowie der TypeScript-Check und Produktionsbuild wurden erfolgreich ausgeführt: 4 Testdateien / 11 Tests bestanden, keine TypeScript-Fehler.

## Kompakte Preisschild-Variante

Die Familientage-Variante wurde auf Wunsch des Nutzers nachgeschärft. Der Störer ist nun auf eine feste, schmale Breite begrenzt, der beschreibende Familien-Tickets-Satz wird auf der Karte nicht mehr angezeigt und das Sale-Element endet deutlich vor dem Top-Musical-Badge. Als visueller Anker dient ein größeres rotes Preisschild mit Prozentzeichen statt des bisherigen kleinen Ticket-Symbols.

Die Desktop-Prüfung zeigt die KÖNIG-DER-LÖWEN-Karte mit Sale-Störer oben links und Top-Musical-Badge oben rechts. Zwischen beiden Elementen bleibt ein klarer freier Bildbereich; sie überschneiden sich nicht. Die gezielte mobile Browseraufnahme vom 28.08.2026 (375 × 812 px) bestätigt dieselbe Trennung: Preisschild, „Aktion Familientage“ und „Bis 15 % sparen“ sind vollständig lesbar, während der Top-Musical-Rahmen rechts eigenständig sichtbar bleibt.
