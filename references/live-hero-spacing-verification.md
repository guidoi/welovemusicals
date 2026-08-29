# Live-Prüfung der Hero-Schiebenavigation

**Prüfdatum:** 29. August 2026  
**Ziel:** Tatsächliche sichtbare Abstände oberhalb und unterhalb der Hero-Schiebenavigation in der Live-Auslieferung prüfen.

Die Live-Startseite unter `https://welovemusicals.com/` war erreichbar und zeigte die aktuelle Schiebe-Navigation mit den Einträgen „Alle Musicals“, „Städte“ sowie allen 21 aktiven Musicaltiteln. Die erste DOM-Abfrage verwendete eine abweichende Großschreibung und fand den Button daher nicht; eine anschließende Linktext-Prüfung bestätigte die Schaltfläche als „Alle Musicals“ und die aktuelle Kurzform „DISNEYS TARZAN“ sowie „ZURÜCK IN DIE ZUKUNFT“.

Die folgende Messung verwendet diese tatsächlichen DOM-Texte und dokumentiert die berechneten CSS-Ränder sowie die sichtbaren Abstände getrennt.

Die Live-DOM-Prüfung im Desktop-Viewport bestätigt am äußeren Navigationscontainer die berechneten CSS-Werte `margin-top: 15px` und `margin-bottom: 15px`. Die Navigation selbst liegt zwischen 684,5 und 748,5 px. Der Hero-Bereich endet jedoch erst bei 935 px; der sichtbare Raum darunter wird somit nicht allein durch den 15-Pixel-Margin bestimmt. Eine zweite Messung erfasst deshalb zusätzlich den konkreten Abstand zur Statistik oberhalb und zum visuellen Übergang unterhalb.

Die Ursache war die Mindesthöhe `min-h-[85vh]` der Hero-Sektion. Nach deren Entfernung endet der Hero-Inhalt unmittelbar nach der unteren 15-Pixel-Margin der Navigation. Sichtprüfungen bei 375 × 812 und 1280 × 900 Pixeln bestätigen einen deutlich kompakteren Übergang vom Hero zu den Top-Musical-Empfehlungen bei unverändertem Abstand zur Statistik oberhalb.

Für den tatsächlich sichtbaren Abstand zum ersten Inhalt der Folgesektion wurde zusätzlich die obere Polsterung der Top-Musical-Sektion von 64 bzw. 96 Pixeln auf 8 Pixel reduziert und die untere Margin der Navigationsumhüllung entfernt. Die Sichtprüfungen zeigen jetzt einen kompakten Übergang: Die goldene Abschnittskennzeichnung folgt direkt unter der Schiebe-Navigation, ohne einen ungewollt großen schwarzen Leerraum. Auf Desktop und bei 375 × 812 Pixeln bleiben die Tabs vollständig sichtbar und horizontal bedienbar.

Die finale DOM-Messung im lokalen Desktop-Viewport bestätigt `15 px` sichtbaren Abstand von der Statistik bis zur Schiebe-Navigation sowie `15,5 px` von der Navigation bis zur ersten goldenen Kennzeichnung der Top-Musical-Sektion. Die minimale Abweichung von 0,5 px entsteht durch die vertikale Zentrierung der 1 Pixel hohen Kennzeichnung innerhalb ihrer Zeile. Der zugrunde liegende CSS-Abstand beträgt oben 15 px und für die Folgesektion 8 px; die sichtbare Gestaltung entspricht damit dem kompakten 15-Pixel-Ziel.
