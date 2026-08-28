# Anbieterlogos – Verifikationsnotizen

Das bereitgestellte weiße Stage-Entertainment-SVG wurde in der statischen Auslieferung unter `/images/branding/stage-entertainment-logo-white.svg` abgelegt. Nach dem Neustart der Entwicklungsumgebung liefert der Pfad HTTP 200 mit `image/svg+xml` und einer Dateigröße von 8.434 Bytes.

Auf der Startseite werden die technischen Anbietertexte in den Teaser-CTA-Zeilen nicht mehr ausgegeben. Stattdessen weist die gerenderte Seite die passenden Bild-Alternativtexte und Quellen für Stage Entertainment, Eventim und ATG Tickets aus. Die Ticket-CTA-Zeile mit „Tickets sichern“ bleibt pro Karte sichtbar.

Die KÖNIG-DER-LÖWEN-Detailseite verweist in ihrer Ticketsektion auf das bereitgestellte Stage-Entertainment-Logo. Die direkte Ticket-Weiterleitung bleibt dabei unverändert über den bestehenden Partnerlink zu `stage-entertainment.de` erhalten. Die abschließende Sichtprüfung der mobilen Ticketsektion erfolgt als nächster Schritt.

Die Browserprüfung der KÖNIG-DER-LÖWEN-Detailseite erreichte die Ticketsektion im normalen Seitenverlauf. Der Ticket-CTA bleibt über den bestehenden Stage-Entertainment-Partnerlink erreichbar; die finale Sichtprüfung konzentriert sich auf die sichtbare Logoausrichtung neben diesem CTA.

Die sichtbare Detailseitenprüfung zeigt aktuell statt der grafischen Stage-Entertainment-Markierung nur den Bildplatzhalter mit Alternativtext. Obwohl der SVG-Pfad im lokalen Server mit HTTP 200 und dem richtigen SVG-MIME-Typ ausgeliefert wird, rendert das bereitgestellte SVG in der eingebundenen Ansicht nicht zuverlässig. Vor dem Abschluss wird daher eine browserzuverlässige PNG- oder WebP-Variante aus dem freigegebenen Logo erzeugt und der Pfad zentral ersetzt.

Nach dem Umstieg auf die gerenderte PNG-Variante wird das Stage-Entertainment-Logo im Teaser ohne Bildplatzhalter ausgeliefert. Die DOM-Prüfung bestätigt die zentrale Zuordnung: KÖNIG DER LÖWEN, DIE EISKÖNIGIN, & JULIA, DER TEUFEL TRÄGT PRADA, TARZAN, MJ, SALON ROSIE, TANZ DER VAMPIRE, WE WILL ROCK YOU, WIR SIND AM LEBEN und ZURÜCK IN DIE ZUKUNFT verwenden Stage Entertainment. MOULIN ROUGE!, STARLIGHT EXPRESS, DAS PHANTOM DER OPER und DER GLÖCKNER VON NOTRE-DAME verwenden ATG Tickets; Eventim-Titel verwenden das Eventim-Logo. Damit entspricht das Teaser-Logo dem jeweiligen Ticketziel.

Die mobile KÖNIG-DER-LÖWEN-Ticketsektion rendert die finale Stage-Entertainment-PNG mit einer natürlichen Bildgröße von 444 × 395 px und einer sichtbaren Höhe von 28 px. Das Logo steht rechts neben dem Ticket-CTA; der Stage-Entertainment-Partnerlink bleibt unverändert. In der mobilen Teaser-Karte steht die kleinere Stage-Kennung an der früheren Position der entfernten „via …“-Zeile, während „Tickets sichern“ unverändert rechts ausgerichtet bleibt. Die Karte bleibt klar lesbar und der Sale-Störer wird nicht beeinträchtigt.

Die vollständige Prüfsequenz endet mit 8 erfolgreichen Testdateien und 21 erfolgreichen Tests, einem fehlerfreien TypeScript-Check sowie einem erfolgreichen Produktionsbuild.

## Vergrößerte Teaserlogos

Die Anbieterlogos in den Startseiten-Teasern wurden mit mobilem Schwerpunkt vergrößert. Die mobile CTA-Zeile verwendet nun eine Logo-Höhe von 24 px und eine maximale Breite von 96 px; im Desktop-Layout beträgt die Höhe bewusst maßvoll 20 px bei höchstens 80 px Breite. Damit bleiben die Anbieter klar erkennbar, während „Tickets sichern“ rechts in derselben CTA-Zeile ausgerichtet bleibt.

Die mobile Ansicht der KÖNIG-DER-LÖWEN-Karte bestätigt die klar sichtbare Stage-Entertainment-Kennung neben der Ticket-CTA. Die Desktopansicht bestätigt die größere, aber weiterhin zurückhaltende Stage-Kennung; Eventim und ATG Tickets verwenden dieselbe responsive Größenlogik. Die Teaserhöhe und die Sale-Störer-Position bleiben unverändert.

Die finale DOM-Messung bestätigt die CTA-Ausrichtung und Kartenhöhe mit echten Browserwerten. Auf Mobil (375 × 812 px) wird das Stage-Entertainment-Logo mit 26,97 × 24 px gerendert; „Tickets sichern“ misst 121,69 × 20 px. Logo und CTA sind vertikal ausgerichtet, liegen vollständig innerhalb der Karte und die Karte ist 400,63 px hoch. Auf Desktop (1280 × 720 px) misst das Logo 22,47 × 20 px, die CTA bleibt 121,69 × 20 px groß, die Ausrichtung bleibt korrekt und die Kartenhöhe beträgt 423,91 px. In beiden Viewports ist das Logo sichtbar und die CTA-Zeile bleibt vollständig innerhalb der Karte.
