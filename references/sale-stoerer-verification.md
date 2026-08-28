# Sale-Störer – Prüfung

Die Teaser-Karte von KÖNIG DER LÖWEN zeigt die Aktion „Familientage“ als kompakten, hochkontrastierenden Störer auf dem Keyvisual. Dargestellt werden „Bis 15 % sparen“ sowie der Familien-Tickets-Hinweis.

Die Darstellung wurde am 28.08.2026 sowohl im Desktop-Viewport (1280 × 720 px) als auch im Mobil-Viewport (375 × 812 px) kontrolliert. Der Störer bleibt innerhalb des Bildbereichs, kollidiert nicht mit dem Top-Musical-Badge und ist auch auf kleineren Displays lesbar.

Die anschließende Browserprüfung auf der Startseite bestätigte die gerenderte Reihenfolge und den Inhalt: „Aktion Familientage“, „Bis 15 % sparen“ sowie der Familien-Tickets-Hinweis stehen vollständig auf der KÖNIG-DER-LÖWEN-Karte. Im Desktop-Layout liegt der Sale-Störer links oben; das unabhängige Top-Musical-Badge bleibt rechts oben sichtbar.

Für die mobile Prüfung wurde eine Chromium-Sitzung mit 375 × 812 px gezielt zur Top-Musical-Sektion gescrollt. Der Sale-Störer ist vollständig sichtbar, bleibt oberhalb des Kartentitels im Keyvisual und hat ausreichend Abstand zum rechts positionierten Top-Musical-Badge. Aktionsname, Rabatt und Hinweis sind lesbar; kein Inhalt wird überdeckt oder abgeschnitten.

Die Vitest-Suite, inklusive eines serverseitigen Rendering-Tests für MusicalCard, sowie der TypeScript-Check und Produktionsbuild wurden erfolgreich ausgeführt: 4 Testdateien / 11 Tests bestanden, keine TypeScript-Fehler.

## Kompakte Preisschild-Variante

Die Familientage-Variante wurde auf Wunsch des Nutzers nachgeschärft. Der Störer ist nun auf eine feste, schmale Breite begrenzt, der beschreibende Familien-Tickets-Satz wird auf der Karte nicht mehr angezeigt und das Sale-Element endet deutlich vor dem Top-Musical-Badge. Als visueller Anker dient ein größeres rotes Preisschild mit Prozentzeichen statt des bisherigen kleinen Ticket-Symbols.

Die Desktop-Prüfung zeigt die KÖNIG-DER-LÖWEN-Karte mit Sale-Störer oben links und Top-Musical-Badge oben rechts. Zwischen beiden Elementen bleibt ein klarer freier Bildbereich; sie überschneiden sich nicht. Die gezielte mobile Browseraufnahme vom 28.08.2026 (375 × 812 px) bestätigt dieselbe Trennung: Preisschild, „Aktion Familientage“ und „Bis 15 % sparen“ sind vollständig lesbar, während der Top-Musical-Rahmen rechts eigenständig sichtbar bleibt.

## Bordeaux-Variante mit ausgeschriebenem Aktionsnamen

Der Sale-Störer verwendet nun eine halbtransparente Bordeaux-Fläche anstelle von Schwarz. Der Aktionsname „Aktion Familientage“ wird ohne Kürzung ausgeschrieben. Sale-Störer und Top-Musical-Badge besitzen beide die gleiche abgerundete Eckenform und bleiben voneinander getrennt.

Die Desktop-Prüfung bestätigt die klare räumliche Trennung der beiden Badges. Die mobile Aufnahme im 375 × 812-px-Viewport bestätigt den ausgeschriebenen Aktionsnamen, das größere Preisschild-Icon und die lesbare Rabattzeile ohne Überlappung oder Abschneiden.

## Reproduzierbarer DOM-Layouttest

Die finale Bordeaux-Variante wurde zusätzlich mit einer echten Chromium-Browsermessung anhand der gerenderten DOM-Positionen geprüft. Im Desktop-Viewport (1280 × 720 px) ist „Aktion Familientage“ vollständig sichtbar, der Sale-Störer liegt vollständig innerhalb der Karte und der Abstand bis zum Top-Musical-Badge beträgt 59 px. Im Mobil-Viewport (375 × 812 px) ist der Aktionsname ebenfalls vollständig sichtbar, beide Badges überschneiden sich nicht und zwischen ihnen bleiben 13 px freier Raum. Der Sale-Störer bleibt auch dort vollständig innerhalb der Kartenfläche.

Der Rendering-Test sichert die strukturellen Regeln: nicht gekürzter Aktionsname, Bordeaux-Stil, keine sichtbare Subline, einheitlich abgerundete Ecken und reservierter Badge-Abstand. Der Layouttest verwendet die echten gerenderten Bounding-Rects beider Badges statt angenommener Kartenbreiten.

Die finale Variante ist zusätzlich über zentrale Layoutkonstanten abgesichert. Der Störer hält bei Top-Musical-Karten 9 rem auf der rechten Kartenseite frei und kann höchstens 12,25 rem breit werden. Die Komponententests sichern den vollständigen, nicht gekürzten Aktionsnamen, den Bordeaux-Stil, die fehlende sichtbare Subline und die einheitlich abgerundeten Ecken. Ein separater Layouttest prüft diese Freiraumregel für eine Desktop-Kartenbreite von 17 rem sowie für die 343 px breite Mobilkarte.

Nach dieser letzten Variante wurden alle Prüfungen erneut ausgeführt: 7 Testdateien / 17 Tests, TypeScript-Check und Produktionsbuild sind erfolgreich.
