# Hero-Schiebe-Navigation – Referenz und Prüfung

Die vom Nutzer benannte Stage-Referenz nutzt eine inhaltliche Direktnavigation mit kurzen, abgerundeten Anker-Tabs, etwa für „Trailer“, „Die Eiswelt“ und „FAQs“. Für die Startseite von We Love Musicals wurde dieses Bedienprinzip eigenständig in die vorhandene Theatralik übersetzt: eine weiße, horizontal scrollbare Pillenleiste mit sichtbaren Vor- und Zurück-Steuerungen, statt der bisherigen zwei großen Hero-CTAs.

Die Navigation beginnt mit „Alle Musicals“ und „Musical-Städte“. Anschließend folgen ausschließlich aktiv geschaltete Musicals anhand der zentralen Datenquelle in deutscher alphabetischer Reihenfolge. Jeder Musical-Tab verweist auf den eindeutigen Anker seiner Karte; bei zunächst ausgeblendeten Karten wird die Übersicht vor dem Scrollen vollständig geöffnet.

Die Desktopprüfung bei 1280 × 900 Pixeln bestätigt eine vollständig sichtbare Leiste innerhalb des Hero-Bereichs. Die weißen, abgerundeten Tabs kontrastieren klar vor der abgedunkelten Bühnenfotografie; die sichtbaren Pfeile rahmen die horizontale Navigation ein, ohne Titel oder Scrollindikator zu überlagern.

Die Mobilprüfung bei 375 × 812 Pixeln bestätigt eine kompakte einzelne Zeile mit horizontalem Überlauf statt mehrzeiliger Tabs. Der erste Tab „Alle Musicals“ bleibt lesbar; die danebenliegenden Einträge lassen sich über die zwei runden Pfeil-Steuerelemente oder durch horizontales Wischen erreichen.

Im gerenderten DOM sind 21 individuelle Musical-Tabs vorhanden – genau ein Button für jedes aktiv geschaltete Musical. Ein exemplarischer Klick auf „WIR SIND AM LEBEN“ setzt die Ziel-URL auf `#musical-wir-sind-am-leben`, öffnet die zunächst gekürzte Musicalübersicht und findet den zugehörigen Kartenanker. Die abschließende Ausrichtung nach der Smooth-Scroll-Bewegung wird separat geprüft.

Nach Abschluss der Smooth-Scroll-Bewegung liegt der Kartenanker „WIR SIND AM LEBEN“ bei 66 Pixeln von der oberen Viewportkante und damit sichtbar unterhalb des Headers. Der Zielbereich befindet sich im Viewport; URL-Hash, geöffnete Übersicht und Zielkarte stimmen überein.

Die linke und rechte Steuerung der Schiebeleiste ist ebenfalls browserseitig geprüft. Bei 1.048 Pixeln sichtbarer Leistenbreite stehen 5.365 Pixel Navigationsinhalt zur Verfügung. Der rechte Pfeil verschiebt die Leiste nachvollziehbar von 0 auf 768 Pixel; der linke Pfeil führt sie wieder auf 10 Pixel zurück. Damit bleiben auch weiter rechts liegende Musicaltitel ohne Umbruch erreichbar.

Nach Nutzerfeedback wurde die Leiste visuell näher an das Stage-Prinzip angenähert: Die Tabs haben jetzt einen transparenten Hintergrund, eine weiße Kontur und weiße Schrift. Die Pfeilsteuerungen wurden entfernt; horizontales Wischen und Scrollen bleibt die Bedienung für weitere Titel. Die Sichtprüfung auf Desktop und Mobil bestätigte die kontraststarke, einzeilige Tab-Leiste. Für exakt gleiche vertikale Abstände wurde der Scrollhinweis anschließend aus der absoluten Positionierung in den Hero-Inhaltsfluss unterhalb der Navigation verschoben; die finale Abstandsmessung folgt.

Die finale Sichtprüfung bei 1280 × 900 sowie 375 × 812 Pixeln bestätigt den gewünschten Stage-inspirierten Eindruck: transparente, weiß umrandete Tabs mit weißer Beschriftung ohne separate Pfeil-Steuerelemente. Die Tabs bleiben auf Mobil eine einzelne horizontal wischbare Zeile. Der Abstand von der Statistik zur Navigation und von der Navigation zum Scrollhinweis wird jeweils durch 3rem gesteuert; die Leiste ist damit im Hero-Bereich oben und unten gleichmäßig eingerahmt.

Eine DOM-Messung nach der finalen Korrektur bestätigt den sichtbaren Abstand jeweils mit 48 Pixeln oberhalb und unterhalb der Navigation. Im Navigationscontainer befinden sich keine Pfeil-Buttons mehr; sein horizontaler Überlauf bleibt auf `auto`, sodass die weiteren Musical-Tabs weiterhin durch Wischen erreichbar sind.

Die abschließende Mobilprüfung im Ziel-Viewport 375 × 812 Pixel nach der `mt-10`-Korrektur zeigt die Leiste vollständig zwischen Statistik und Scrollhinweis. Sie bleibt als eine transparent umrandete, horizontal wischbare Zeile sichtbar. Die visuelle Luft ober- und unterhalb der Navigation ist gleichmäßig; weder die Tab-Leiste noch der Scrollhinweis überlagern den nachfolgenden Highlights-Bereich.

Nach anschließendem Nutzerfeedback wurde der Abstand unter der Navigation bewusst stark reduziert. Der Scrollhinweis nutzt nun `mt-4` statt `mt-10` und rückt dadurch 24 Pixel näher an die Tab-Leiste. Die Sichtprüfung bei 375 × 812 sowie 1280 × 900 Pixeln bestätigt, dass die kompaktere Anordnung weder die Tabs noch den nachfolgenden Highlights-Bereich überlagert.

Die finale Tabverfeinerung entfernt die beiden vorangestellten Ticket- und Standorticons vollständig. Alle Tabs nutzen auf Mobil 48 Pixel Höhe, 24 Pixel horizontalen Innenabstand und 14 Pixel große Schrift; auf Desktop sind es 56 Pixel Höhe, 28 Pixel Innenabstand und 16 Pixel Schrift. Die Sichtprüfungen bei 375 × 812 und 1280 × 900 Pixeln bestätigen die größere, ruhigere Typografie bei unverändert sichtbarer horizontaler Wischbarkeit.

Der zweite feste Einstiegsbutton heißt nun kurz „Städte“, während sein unveränderter Anker `#staedte` weiter auf die Städteübersicht führt. Der Abstand zwischen Tab-Leiste und Scrollhinweis beträgt auf Mobil 8 Pixel (`mt-2`); ab Desktop bleibt er bei 16 Pixeln (`md:mt-4`). Die Sichtprüfungen bei 375 × 812 und 1280 × 900 Pixeln bestätigen die kürzere Beschriftung, den kompakteren mobilen Hero und die unveränderte Desktopgestaltung.

Der Scrollpfeil unterhalb der Hero-Schiebenavigation wurde auf Nutzerwunsch vollständig entfernt. Die Sichtprüfungen bei 375 × 812 und 1280 × 900 Pixeln bestätigen einen ruhigen, klaren Abschluss des Hero-Bereichs ohne zusätzliche Steuerung; die Navigation bleibt vollständig horizontal erreichbar.

Nach der finalen Präzisierung nutzt die Navigationsumhüllung ober- und unterhalb jeweils 15 Pixel Abstand (`mt-[15px] mb-[15px]`). Die Prüfung bei 375 × 812 und 1280 × 900 Pixeln bestätigt die identischen, bewusst kompakten Abstände zwischen Statistik, Tab-Leiste und Hero-Unterkante.
