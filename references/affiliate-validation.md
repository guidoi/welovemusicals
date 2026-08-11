# Affiliate-Validierung

## König der Löwen – Trade Doubler

- Die direkte Stage-Entertainment-Produktseite lautet: `https://www.stage-entertainment.de/musicals-shows/b/disneys-der-koenig-der-loewen-hamburg`.
- Keyvisual, Haupt-CTA und Hamburg-Tourtermin verwenden diese URL.
- Die Detailseite kennzeichnet die Weiterleitung als `stage-entertainment.de` und als Stage Entertainment.
- Der Trade-Doubler Link Converter mit Advertiser-ID `3492604` wird global im HTML-Head geladen. In der lokalen Vorschau wird das externe Skript angefordert, stellt jedoch noch kein `TDLinkConverter`-Global bereit. Die endgültige Partnerlink-Transformation muss nach Aktivierung im Trade-Doubler-Konto auf der veröffentlichten Domain getestet werden.
- Auf der lokalen Musical-Übersicht wird DIE AMME nicht mehr in der aktiven Liste gezeigt. Die MJ-Detailseite verifiziert Keyvisual, Ticket-CTA und Hamburg-Tourtermin mit der direkten Stage-Entertainment-Produktseite sowie die Kennzeichnung als Stage Entertainment.
- Die erneute Übersichtskontrolle bestätigt die korrekte Abgrenzung: MJ wird als „via Stage Entertainment“ angezeigt, während FACK JU GÖHTE und RAPUNZEL weiterhin als „via Eventim“ erscheinen.

## Live-Diagnose Trade Doubler

Auf der veröffentlichten König-der-Löwen-Seite ist das Script-Element `tdlc-jssdk` vorhanden und die Ressource `clk.tradedoubler.com/lc?a(3492604)rand(...)` wird angefordert. Dennoch bleibt `window.TDLinkConverter` undefiniert; die Stage-Entertainment-Links werden deshalb nicht sichtbar als Konverter-Links initialisiert. Das Awin-Master-Tag wird parallel angefordert. Die Fehlerursache liegt damit beim Trade-Doubler-Loader oder dessen Aktivierung für die Live-Domain, nicht bei den hinterlegten Stage-Produktseiten.

Der direkt abgerufene Trade-Doubler-Loader liefert eine gültige Konverterdefinition: Er ordnet `www.stage-entertainment.de` dem Programm `394206` zu und würde Direktlinks auf `visit.stage-entertainment.de/click?p=394206&a=3492604&ttid=18&url=...` umschreiben. Auf der Live-Seite wird diese Definition jedoch nicht in `window.TDLinkConverter` verfügbar. Die Lade- und Initialisierungslogik benötigt daher eine explizite und überprüfbare Fallback-Initialisierung.

Die lokale Nachprüfung bestätigt das gleiche Verhalten nach der ersten Initialisierungsverbesserung: Das Loader-Skript ist im DOM vorhanden, doch `window.TDLinkConverter` bleibt undefiniert und die Ticketlinks bleiben auf `www.stage-entertainment.de`. Deshalb wird ein Stage-spezifischer Tracking-Fallback ergänzt, der ausschließlich dann greift, wenn der offizielle Loader nach einem kurzen Zeitfenster nicht verfügbar ist.

Nach dem ersten Fallback-Versuch blieben die Links unverändert. Die Ursache: Der Fallback war noch ausschließlich an `tdlcAsyncInit` gekoppelt; wenn der externe Loader zwar als Ressource erscheint, aber nicht ausgeführt wird, wird dieser Callback nie aufgerufen. Die Integration startet den Callback deshalb nun zusätzlich beim DOMContentLoaded-Event und installiert den Beobachter unabhängig vom Loader.

Die finale lokale Prüfung bestätigt den Fallback: Alle sechs König-der-Löwen-Links wurden nach dem React-Renderzyklus auf `https://visit.stage-entertainment.de/click?p=394206&a=3492604&ttid=18&url=...` umgeschrieben. Damit ist die Trade-Doubler-Partnerkennung `a=3492604` zuverlässig in den tatsächlichen Ziel-URLs enthalten, auch wenn der externe Loader keinen `TDLinkConverter`-Global exportiert.

Die Detailroute von Die Eiskönigin lautet `/musical/die-eiskoenigin`; die zuvor getestete Variante mit dem Präfix `disneys-` führt erwartungsgemäß zur Nicht-gefunden-Seite. Die korrekte Seite lädt die Stage-Entertainment-Ticketbereiche.
