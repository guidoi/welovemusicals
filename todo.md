# TODO

## Phase 4 – Website finalisieren
- [x] Hero-Sektion
- [x] Featured Musicals
- [x] Alle Musicals mit Filtern
- [x] Tourneestädte
- [x] Hotels-Sektion
- [x] Anbieter-Sektion
- [x] CTA-Sektion
- [x] Musical-Detailseite
- [x] Stadt-Detailseite
- [x] Header & Footer
- [x] Anbieter-Filter entfernt
- [x] Filterreihenfolge geändert: Städte → Kategorie → Sortierung
- [x] Build-Konfiguration: outDir von dist/public zu dist geändert (für Cloudflare Pages)
- [x] Logo-Spacing: Abstand zwischen WE, Herz und MUSICALS verringert (gap-2 zu gap-1)
- [x] Impressum-Seite erstellt mit Headerfoto und Footer-Link
- [x] Letzte visuelle Optimierungen prüfen
- [x] Die zwei Hero-CTA-Buttons durch eine weiße, abgerundete und horizontal schiebbare Anker-Navigation ersetzen
- [x] Navigationseinträge für „Alle Musicals“, „Musical-Städte“ und alle Musicaltitel alphabetisch aus den zentralen Musicaldaten erzeugen
- [x] Ankerpositionen, Tastaturbedienung sowie Desktop- und Mobil-Darstellung der Schiebe-Navigation verifizieren
- [x] Für jedes aktive Musical einen eigenen alphabetisch einsortierten Navigationsbutton und eindeutigen Zielanker nachweisen
- [x] Schiebenavigation auf transparente Tabs mit weißer Kontur und weißer Schrift im Stage-inspirierten Stil umstellen
- [x] Linke und rechte Pfeil-Steuerungen entfernen und horizontales Wischen beibehalten
- [x] Vertikale Abstände oberhalb und unterhalb der Navigation im Hero-Bereich angleichen und auf Desktop sowie Mobil prüfen
- [x] Finale Hero-Abstände nach der letzten mt-10-Korrektur im mobilen Ziel-Viewport prüfen und dokumentieren
- [x] Unteren Abstand zwischen Hero-Schiebenavigation und Scrollhinweis deutlich reduzieren und auf Desktop sowie Mobil prüfen
- [x] Ticket- und Standort-Icon aus den ersten beiden Hero-Navigationstabs entfernen
- [x] Schriftgröße und Innenabstände sämtlicher Hero-Navigationstabs auf Desktop und Mobil sichtbar vergrößern
- [x] Iconfreiheit, Lesbarkeit, Wischbarkeit und Hero-Layout nach der Typografieanpassung verifizieren
- [x] Hero-Navigationstab „Musical-Städte“ in „Städte“ umbenennen
- [x] Unteren Abstand zwischen Navigation und Scrollhinweis ausschließlich im mobilen Hero weiter reduzieren und prüfen
- [x] Hero-Button „DISNEYS MUSICAL TARZAN“ auf „DISNEYS TARZAN“ kürzen
- [x] Hero-Button „ZURÜCK IN DIE ZUKUNFT – Das Musical“ auf „ZURÜCK IN DIE ZUKUNFT“ kürzen
- [x] Gekürzte Beschriftungen, alphabetische Reihenfolge und Zielanker auf Desktop sowie Mobil verifizieren
- [x] Scrollpfeil unter der Hero-Schiebenavigation entfernen und Hero-Abschluss auf Desktop sowie Mobil prüfen
- [x] Oberen und unteren Abstand rund um die Hero-Schiebenavigation auf jeweils 15 px setzen und auf Desktop sowie Mobil prüfen
- [x] Finale Hero-Abstände nach den letzten Layout-Änderungen erneut auf der Live-Domain messen und in der Referenzdoku aktualisieren
- [x] Sichtbaren unteren Hero-Leerraum unter der Schiebenavigation deutlich reduzieren und die 15 px oberhalb der Leiste beibehalten
- [x] Oberen Abstand der Top-Musical-Sektion auf einen kompakten Wert reduzieren, damit der sichtbare Abstand unter der Hero-Navigation dem Ziel entspricht
- [x] Finale mobile DOM-Messwerte des Hero-Abschlusses (375 × 812; sichtbarer Abstand oben/unten und relevante Bounding-Rects) in der Referenzdokumentation ergänzen

## Phase 5 – Webflow-Import-Paket
- [x] Entfällt auf Nutzerwunsch: kein statisches Webflow-HTML/CSS-Paket erforderlich
- [x] Entfällt auf Nutzerwunsch: keine Webflow-CMS-Dokumentation erforderlich
- [x] Entfällt auf Nutzerwunsch: kein Webflow-Token-/Klassen-Mapping erforderlich
- [x] Entfällt auf Nutzerwunsch: keine Webflow-Asset-Liste erforderlich
- [x] Entfällt auf Nutzerwunsch: keine Webflow-Bauanleitung erforderlich
- [x] Entfällt auf Nutzerwunsch: kein Webflow-ZIP-Paket erforderlich

## Phase 6 – Auslieferung
- [x] Checkpoint für den aktuellen Projektstand erstellt
- [x] Ergebnisse dem Nutzer präsentieren

## Bugfixes – Weiße/schwarze Seite beim Laden
- [x] Fix: sonner.tsx importiert useTheme von next-themes statt eigenem ThemeContext
- [x] Fix: Inline-CSS auf body für sofortigen dunklen Hintergrund vor CSS-Laden
- [x] Fix: Cache-Control HTTP-Header auf Server-Ebene für HTML-Responses
- [x] Dracula Detailseite: Headline und Beschreibungstext aktualisieren
- [x] Header auf Detailseite vergrößern und Bildausschnitt anpassen (Personen nicht abschneiden)

## Drei Haselnüsse für Aschenbrödel
- [x] Keyvisual hochladen und Musical-Eintrag in data.ts anlegen
- [x] Dropdown-Komponente für Tourtermine integrieren
- [x] Musical aktivieren (ACTIVE_MUSICAL_IDS) und Impressum ergänzen

## Sister Act – Neues Musical
- [x] Sister Act Bilder hochladen (6 Show-Impressionen + 1 Keyvisual)
- [x] Sister Act als neues Musical in data.ts anlegen (Kategorien: Tournee + Erwachsene)
- [x] Sister Act Tourtermine eintragen (10 Städte)
- [x] Sister Act Pressestimmen eintragen (WAZ, BUNTE.de, Münchner Merkur)
- [x] Sister Act FAQ/Wissenswertes eintragen (Show-Dauer, Sprache, Auf Tour, Veranstalter)
- [x] Sister Act in ACTIVE_MUSICAL_IDS aufnehmen
- [x] Dracula: Sprache auf „Alle Dialoge und Songs in deutscher Sprache" aktualisieren
- [x] Dracula/FJG/Aschenbrödel: „Auf Tour"-Zeiträume in FAQ aktualisieren

## Drei Haselnüsse – Tourtermine-Update (April 2026)
- [x] 80 aktualisierte Tourtermine in data.ts eingepflegt (vorher 64)
- [x] 5 neue Städte hinzugefügt: Donaueschingen, Dornbirn, Puch bei Salzburg, Ried im Innkreis, Vöcklabruck
- [x] 13 Städte mit zusätzlichen zweiten Datumsblöcken (Bochum, Braunschweig, Dresden, Flensburg, Frankfurt am Main, Fulda, Kiel, Leipzig, Magdeburg, Rostock, Schwerin, Wolfsburg)
- [x] Jahres-Korrekturen: Hameln→2027, Heidenheim→2027, Weiden→2027, Würzburg→2027, Zweibrücken→2027
- [x] Venue-Korrekturen: Fulda (Esperanto Kongress- und Kulturzentrum), Gera (Kultur- und Kongresszentrum Gera), Weiden (Max-Reger-Halle), Würzburg (Congress Centrum Würzburg), Rostock (Stadthalle), Weimar (Stadthalle)
- [x] Frankfurt → Frankfurt am Main umbenannt
- [x] Alle 80 Einträge mit stadtspezifischen Awin-Links und clickrefs
- [x] cities-Array aktualisiert (69 Städte)
- [x] showFacts Auf-Tour-Zeitraum aktualisiert: Okt. 2026 bis Dez. 2027
- [x] TypeScript-Check bestanden (0 Fehler)

## Drei Haselnüsse – Header-Städte begrenzen
- [x] headerCities-Feld: 11 größte Städte im Header + "und 58 weitere Tourneestädte" in Gold
- [x] Mobile UX verbessern: weniger Text im Header-Bereich

## Drei Haselnüsse – Fehlende Eventim-Städtelinks
- [x] cityname-Werte korrigiert: Frankfurt am Main, Halle (Saale), Lindau, Puch bei Salzburg, Bad Neustadt, Ried im Innkreis, Weiden i.d.Oberpfalz, Frankfurt (Oder), Bad Ischl

## Alle Musicals – cityname-Korrektur global
- [x] Doppelt encodierte Umlaute in 5 Musicals korrigiert (Köln, Nürnberg, München, Saarbrücken, Gütersloh, Lüneburg, Osnabrück, Würzburg, Zweibrücken, Vöcklabruck)
- [x] Dracula: Halle → Halle / Saale, Frankfurt → frankfurt
- [x] 3HN Frankfurt (Oder): Schrägstrich + Plus-Zeichen statt Klammern

## Detailseiten – Floating Back-Button
- [x] Zurück-Link im Hero durch Floating Back-Button (oben links, rund, halbtransparent) ersetzen – auch auf CityDetail-Seiten

## SEO – "und" vs. "&"
- [x] Home.tsx: "Alle Musicals und Shows" + "Deutschland, Österreich und der Schweiz" (& → und)
- [x] TourDates.tsx: bereits korrekt mit "und"
- [x] index.html Title/Meta: kein & vorhanden, bereits korrekt
- [x] data.ts: & nur in Eigennamen (Filmtitel, Charakternamen) – korrekt beibehalten

## SEO – Dynamische Meta-Tags & Schema.org
- [x] useSEO-Hook erstellt (client/src/hooks/useSEO.ts)
- [x] Dynamische Meta-Tags auf MusicalDetail-Seite eingebaut
- [x] Dynamische Meta-Tags auf CityDetail-Seite eingebaut
- [x] Schema.org MusicEvent + BreadcrumbList JSON-LD auf MusicalDetail-Seite (SchemaOrg.tsx)

## SEO – Sitemap & Rich-Results-Test
- [x] Dynamische Sitemap.xml als Server-Endpoint (/sitemap.xml) implementiert (alle Musical- und Stadtseiten)
- [x] robots.txt mit Sitemap-Verweis erstellt
- [x] Schema.org Rich-Results-Test: 0 Fehler, 0 Warnungen (BreadcrumbList + ItemList/MusicEvent)

## SEO – Domain welovemusicals.com
- [x] Sitemap-Endpoint Fallback-Domain auf welovemusicals.com aktualisiert
- [x] robots.txt Sitemap-URL auf welovemusicals.com aktualisiert

## SEO – Statische Sitemap für Cloudflare Pages
- [x] sitemap.xml als statische Datei in client/public/sitemap.xml erstellt (47 URLs: Startseite + 21 aktive Musicals + 23 Städte + 2 statische Seiten)

## SEO – Schema.org auf CityDetail-Seiten
- [x] CityDetail-Seiten mit TouristDestination + MusicEvent-Liste + BreadcrumbList JSON-LD ausgestattet (SchemaOrgCity.tsx)

## Hotels – HRS statt Booking.com
- [x] Alle 21 Booking.com-hotelSearchUrl in data.ts durch HRS-Awin-Deeplinks ersetzt (Awin ID 15152)
- [x] Home.tsx: Städtekarten-Links + CTA-Button auf HRS umgestellt
- [x] CityDetail.tsx: JSX-Fragment-Fehler behoben
- [x] MusicalDetail.tsx: Hotel-Karten nutzen city.hotelSearchUrl (automatisch HRS)

## Hotels – HRS Stadtseiten-Deeplinks
- [x] HRS location-Codes für alle 21 Städte ermittelt (statt web3/search.do → de/list?location=CODE)
- [x] data.ts: hotelSearchUrl auf HRS-Stadtseiten-Deeplinks umgestellt

## Moulin Rouge! Das Musical – Neues Musical (ATG Entertainment)
- [x] Alle 10 Fotos + Keyvisual (quer) auf CDN hochgeladen
- [x] Musical-Eintrag in data.ts angelegt (fester Standort, Hamburg, Theater am Großmarkt, ab Herbst 2026)
- [x] SEO-Text mit Headline und Sublines erstellt
- [x] Musical in ACTIVE_MUSICAL_IDS aufgenommen (Position 2, nach Dracula)
- [x] Hamburg musicalCount auf 7 aktualisiert
- [x] Sitemap.xml enthält moulin-rouge bereits
- [x] Bildnachweise im Impressum ergänzt (© Johan Persson / Nilz Boehme, ATG Entertainment)

## SEO-Optimierungen Phase 2 (Mai 2026)
- [x] Schema.org JSON-LD auf Musical-Detailseiten geprüft, einschließlich absoluter Bild-URLs, Events, Offers und Breadcrumbs
- [x] Canonical-Tags auf Home-, Musical-, Stadt- und Rechteseiten geprüft und vervollständigt
- [x] Spezifisches OG-Image pro Musical-Detailseite aus dem jeweiligen Musical-Bild gesetzt und absolute URLs normalisiert
- [x] Radius-Chips auf 25/50/100/150/200 km reduziert (300/500 entfernt)
- [x] Scroll zum ersten Suchergebnis nach erfolgreicher PLZ-Suche geprüft
- [x] robots.txt Sitemap-URL auf die primäre Live-Domain welovemusicals.com geprüft und gesetzt

## König der Löwen – Neues Musical (Stage Entertainment)
- [x] KDL Assets hochladen: Keyvisual (quadratisch), Teaserfoto (Rafiki), Headerfoto (Savanne), Galerie-Fotos
- [x] SEO-Texte aus Pressemappe redaktionell aufbereiten
- [x] Musical-Eintrag in data.ts erstellen (Preis ab 79,49 €, Laufzeit bis 04.04.2027)
- [x] Eventim Affiliate-Link setzen: https://www.eventim.de/artist/disneys-der-koenig-der-loewen/?affiliate=SX4
- [x] KDL in Top-Musicals aufnehmen, Glöckner in allgemeine Übersicht verschieben
- [x] Fotocredits im Impressum ergänzen
- [x] Video + Keyvisual Positionierung analog Eiskönigin (kein YouTube-Trailer vorhanden, Keyvisual korrekt positioniert)

## MJ – Das Michael Jackson Musical (Stage Entertainment)
- [x] MJ Musical: Vollständiger Eintrag in data.ts mit SEO-Texten aus Pressetext
- [x] MJ Musical: 10 Pressefotos als statische Assets in client/public/images/mj/
- [x] MJ Musical: Alle CTAs mit eigenen Awin-Links (Publisher 2865727, clickref=mj-*)
- [x] MJ Musical: Tickets ab 51,49 €, Laufzeit bis 29.08.2027
- [x] MJ Musical: Nur in normaler Auflistung (featured: false), nicht in Top-Musicals
- [x] MJ Musical: Fotocredits im Impressum ergänzt (Matthew Murphy / Stage Entertainment)
- [x] MJ Musical: Keyvisual-Positionierung analog Eiskönigin (nach Absatz 2)
- [x] MJ Musical: YouTube Video weggelassen (kein youtubeTrailerId)

## Tanz der Vampire – Neues Musical (Stage Entertainment)
- [x] TDV Bilder konvertieren (WebP) und in client/public/images/tanz-der-vampire/ ablegen
- [x] TDV Musical-Eintrag in data.ts erstellen (Preis ab 45,49 €, Spielzeit 11.03.2027–30.09.2027, Stuttgart)
- [x] TDV in ACTIVE_MUSICAL_IDS aufnehmen
- [x] TDV Fotocredits im Impressum ergänzen
- [x] TDV MusicalDetail-Bedingungen (mobile Trailer + Keyvisual) ergänzen
- [x] TDV TypeScript-Check bestanden

## WE WILL ROCK YOU – Neues Musical (Stage Entertainment)
- [x] WWRY Bilder konvertieren (WebP) und in client/public/images/we-will-rock-you/ ablegen
- [x] WWRY Musical-Eintrag in data.ts erstellen (Preis ab 48,49 €, Spielzeit 02.07.2026–30.08.2026, Stuttgart)
- [x] WWRY in ACTIVE_MUSICAL_IDS aufnehmen
- [x] WWRY Fotocredits im Impressum ergänzen
- [x] WWRY MusicalDetail-Bedingungen (mobile Trailer + Keyvisual) ergänzen
- [x] WWRY TypeScript-Check bestanden

## SALON ROSIE – Neues Musical (Plate & Sommer)
- [x] SR Bild konvertieren (WebP) und in client/public/images/salon-rosie/ ablegen
- [x] SR Musical-Eintrag in data.ts erstellen (Preis ab 68,49 €, Spielzeit 30.10.2026–26.02.2027, Berlin)
- [x] SR in ACTIVE_MUSICAL_IDS aufnehmen
- [x] SR Fotocredits im Impressum ergänzen
- [x] SR MusicalDetail-Bedingungen (mobile Trailer + Keyvisual) ergänzen
- [x] SR TypeScript-Check bestanden

## Sale-Störer auf Musical-Teasern
- [x] Optionales sale-Feld im Musical-Datenmodell für Aktionsname, Rabattwert, Hinweissatz und optionales Ablaufdatum ergänzen
- [x] Wiederverwendbaren, zugänglichen Sale-Störer in MusicalCard für Desktop und Mobil gestalten
- [x] KÖNIG DER LÖWEN mit Aktion „Familientage“, „Bis 15 % sparen“ und Familienrabatt-Hinweis konfigurieren
- [x] Darstellung im Desktop- und Mobil-Viewport prüfen
- [x] Vitest-Test für die Anzeige und Nichtanzeige des Sale-Störers ergänzen
- [x] Sale-Störer auf der Startseite im Browser auf Desktop und Mobil sichtbar prüfen und visuellen Befund dokumentieren
- [x] Rendering-Test für MusicalCard ergänzen: Sale-Störer wird bei aktivem sale angezeigt und ohne oder abgelaufenem sale nicht angezeigt
- [x] Familientage-Sale-Störer schmaler gestalten und erklärende Subline ausblenden
- [x] Größeres, auffälligeres Preisschild-Icon mit Prozentzeichen als Aktionsicon einsetzen
- [x] Sicherheitsabstand zum Top-Musical-Badge auf Desktop und Mobil prüfen
- [x] Aktionsname „Aktion Familientage“ auf Desktop und Mobil vollständig lesbar darstellen und per echten Browser-Layouttest absichern
- [x] Schwarze Störerfläche durch einen transparenten Bordeaux-Hintergrund ersetzen
- [x] Ecken des Sale-Störers passend zum Top-Musical-Badge abrunden, Abstand erneut prüfen und per echten Browser-Layouttest absichern
- [x] Rendering-Test für ausgeschriebenen Aktionsnamen, Bordeaux-Stil, fehlende sichtbare Subline und reservierten Badge-Abstand ergänzen
- [x] Responsive Abstandskonstanten für Desktop- und Mobilkarten als getestete Layout-Hilfsfunktion definieren
- [x] Browser-Layouttest mit realen Bounding-Rects für Sale-Störer und Top-Musical-Badge auf Desktop und Mobil ergänzen
- [x] Hintergrund des Familientage-Sale-Störers auf das exakte Logo-Rot #EF4444 umstellen
- [x] Kontrast, Textlesbarkeit und Badge-Abstand der Logo-Rot-Variante auf Desktop und Mobil prüfen
- [x] Zusätzliche Umrandung des bisherigen Preisschild-Icons entfernen
- [x] Randloses Prozentzeichen in doppelter Größe darstellen
- [x] Kompaktheit, Lesbarkeit und Abstand zum Top-Musical-Badge nach der Vergrößerung des Prozentzeichens prüfen
- [x] Großes Preisschild-Icon mit Prozentzeichen im Sale-Störer wiederherstellen
- [x] Weißen Rand am Preisschild entfernen und eine dunklere Rotfläche zur Absetzung vom Logo-Rot verwenden
- [x] Finale dunklerote Preisschild-Variante mit konkretem Desktop- und Mobilnachweis für Lesbarkeit und Badge-Abstand validieren
- [x] Schriftfarbe der Aktionszeile auf ein dunkleres Rot umstellen
- [x] Aktionszeile leicht vergrößern und auf Desktop sowie Mobil auf Lesbarkeit prüfen
- [x] Sale-Aktionsname auf „FAMILIENTAGE“ reduzieren (durch finale Kurzfassung ersetzt)
- [x] Rabattzeile auf „BIS ZU 15 % SPAREN“ umstellen (durch finale Kurzfassung ersetzt)
- [x] Sale-Aktionsname auf „FAMILIEN:“ und Rabattzeile auf „BIS 15 %“ reduzieren
- [x] Wort „sparen“ vollständig aus dem sichtbaren Sale-Störer entfernen und Darstellung prüfen
- [x] Familienzeile „FAMILIEN:“ wieder in Weiß darstellen
- [x] Familienzeile leicht vergrößern und auf Desktop sowie Mobil auf Lesbarkeit und Badge-Abstand prüfen
- [x] Sale-Störer nach rechts auf eine kompaktere feste Breite reduzieren
- [x] Zusätzlichen Freiraum zum Top-Musical-Badge nach der Breitenreduktion auf Desktop und Mobil prüfen
- [x] Finale weiße und schmalere Sale-Störer-Variante im Desktop-Viewport mit Messwerten für Textlesbarkeit und Badge-Abstand validieren
- [x] Familienzeile „FAMILIEN:“ auf dieselbe Schriftgröße wie „BIS 15 %“ setzen
- [x] Gleich große Sale-Zeilen auf Desktop und Mobil auf Lesbarkeit und Badge-Abstand prüfen
- [x] Berechnete Schriftgrößen der Familien- und Rabattzeile auf Desktop und Mobil gleichheitsgenau messen

## Startseiten-Teaser – Anbieterzeile
- [x] Anbieterzeile „via Eventim“, „via Stage Entertainment“ und „via ATG Tickets“ aus MusicalCard entfernen
- [x] Ticket-CTA, Ziel-URL und Affiliate-Tracking der Teaser nach dem Entfernen unverändert verifizieren
- [x] Teaser-Höhe und visuelle Ausgewogenheit auf Desktop und Mobil prüfen

## Ticketsektion – Stage-Entertainment-Logo
- [x] Bereitgestelltes weißes Stage-Entertainment-SVG als statisches Web-Asset bereitstellen
- [x] Fehlendes Stage-Entertainment-Logo in der mobilen Ticketsektion an der Anbieterlogo-Position integrieren
- [x] Größe, Kontrast und Ausrichtung zu Eventim- und ATG-Logos auf Desktop und Mobil prüfen
- [x] Browserfehler beim Rendern des bereitgestellten Stage-Entertainment-SVG beheben und eine zuverlässige PNG- oder WebP-Variante einbinden
- [x] Schwarze Wortmarke des bereitgestellten Logos für dunkle Ticketflächen kontraststark in Weiß überführen

## Anbieterlogos in Startseiten-Teasern
- [x] Kleines Stage-, Eventim- oder ATG-Tickets-Logo in der Teaser-CTA-Zeile anstelle der entfernten Anbietertexte darstellen
- [x] Logo-Auswahl für Stage-, ATG- und Eventim-Ticketziele zentral und testbar definieren
- [x] Teaser-CTA, Ticketziel und Tracking mit Anbieterlogo auf Desktop und Mobil prüfen
- [x] Anbieterlogos in der mobilen Teaser-CTA-Zeile deutlich vergrößern
- [x] Anbieterlogos auf Desktop maßvoll vergrößern und CTA-Ausrichtung per DOM-Messung bewahren
- [x] Vergrößerte Anbieterlogos auf Desktop und Mobil mit gemessener Kartenhöhe und sichtbarer Logo-Lesbarkeit prüfen
- [x] Logo- und Ticket-CTA-Position sowie Kartenhöhe im Desktop- und Mobil-Viewport reproduzierbar messen
- [x] Eventim-Logoasset mit transparentem Hintergrund für die dunklen Startseiten-Teaser bereitstellen
- [x] Stage-, Eventim- und ATG-Logos in den Teasern auf Desktop und Mobil weiter vergrößern
- [x] Mobile DOM-Messung für Teaserlogos, CTA-Ausrichtung und Kartenhöhe durchführen und die konkreten Werte dokumentieren
- [x] Desktop-DOM-Messung nach der finalen Logo-Vergrößerung um konkrete Kartenhöhe ergänzen und dokumentieren
- [x] Mobile DOM-Messung im expliziten Ziel-Viewport 375 × 812 durchführen und dokumentieren
- [x] Kontrast der transparenten Eventim-Wortmarke auf den dunklen Teaserflächen nachvollziehbar validieren und dokumentieren
- [x] Transparenz, Kontrast, CTA-Ausrichtung und Kartenhöhe im Desktop- und Mobil-Viewport verifizieren
- [x] Eventim-Logo in den Teasern separat auf eine ausgewogenere Breite begrenzen
- [x] Reduzierte Eventim-Breite sowie unveränderte Stage-/ATG-Größen und CTA-Ausrichtung auf Desktop und Mobil verifizieren

## Trade Doubler – Link Converter und Stage-Entertainment-Links
- [x] Trade-Doubler Link Converter mit Advertiser-ID 3492604 global im HTML-Head einbinden
- [x] Laden des Link Converters und Kompatibilität mit bestehendem Awin Publisher Master Tag prüfen
- [x] Trade-Doubler-Partnerlinks für Stage-Entertainment-Produktionen je Musical zuordnen und übernehmen
- [x] Alle betroffenen Ticket-CTAs, Keyvisuals und Tourtermine verifizieren
- [x] TypeScript-Check ausführen und Checkpoint speichern

## Trade Doubler – Link Converter Diagnose
- [x] Trade-Doubler-Skriptantwort, Initialisierungsreihenfolge und Laufzeitfehler prüfen
- [x] Zuverlässige Initialisierung des Link Converters implementieren
- [x] König der Löwen und Die Eiskönigin in der lokalen Vorschau validieren
- [x] König der Löwen und Die Eiskönigin nach dem Cloudflare-Build auf welovemusicals.com validieren
- [x] TypeScript-Check, Test und Checkpoint durchführen

## König der Löwen – Trade-Doubler Produktseite
- [x] Alle KDL Ticket- und CTA-Links auf die direkte Stage-Entertainment-Produktseite umstellen
- [x] Trade-Doubler Link Converter für die KDL-Produktseite im Browser validieren

## Stage Entertainment – Trade-Doubler Produktseiten
- [x] MJ, Die Eiskönigin, Tarzan, Zurück in die Zukunft, Der Teufel trägt Prada und WIR SIND AM LEBEN auf direkte Stage-Produktseiten umstellen
- [x] Tanz der Vampire, WE WILL ROCK YOU, & JULIA und SALON ROSIE auf direkte Stage-Produktseiten umstellen
- [x] DIE AMME aus ACTIVE_MUSICAL_IDS entfernen
- [x] Stage-Entertainment-Produktionen auf Teasern und Detailseiten als „via Stage Entertainment“ kennzeichnen
- [x] Alle Stage-Produktseitenlinks und die Deaktivierung per Test validieren
- [x] TypeScript-Check ausführen und Checkpoint speichern
- [x] Anbietererkennung auf Teasern und Detailseiten auf echte Stage-Entertainment-Produktionen begrenzen
- [x] Nicht-Stage-Shows in Übersicht und Detailseite erneut auf korrekte Anbieterkennzeichnung prüfen
- [x] Nicht-Stage-Detailseite im Browser auf Eventim-Kennzeichnung prüfen

## Fehlerbehebung – React Invalid Hook Call
- [x] React-, React-DOM- und tRPC-Abhängigkeitsauflösung sowie Vite-Deduplizierung analysieren
- [x] React-Laufzeitstabilität durch Provider-Integrationstest sowie Cold-Start- und HMR-Prüfung absichern
- [x] Startseite im Browser sowie Vitest, TypeScript und Produktionsbuild nach der reproduzierbaren Laufzeitprüfung verifizieren
- [x] React-Hook-Fehler in einem frischen Vite-Optimierungscache und nach einer HMR-Aktualisierung gezielt auf Nichtauftreten prüfen
- [x] tRPC- und React-Query-Provider als gemeinsame App-Hülle extrahieren und gegen Invalid-Hook-Calls testen
- [x] Sichtbare Abstände oberhalb und unterhalb der Hero-Schiebenavigation auf etwa 30 px setzen und auf Desktop sowie Mobil prüfen

## Offene Restarbeiten – technischer Audit
- [x] SEO-Folgearbeiten gegen den aktuellen Codebestand prüfen und umsetzen
- [x] Webflow-Importpaket auf Nutzerwunsch nicht erstellt; Umfang entsprechend angepasst
- [x] Restarbeiten mit Tests und Build verifizieren sowie Checkpoint und Auslieferungsunterlagen aktualisieren
- [x] Hero-Navigationstab „Alle Musicals“ in „Musicals“ umbenennen
- [x] Einzelne Musical-Buttons direkt auf die jeweilige Musical-Landingpage verlinken statt auf Startseitenanker
- [x] Direkte Musical-URLs, Städte-Anker und Navigation auf Desktop sowie Mobil verifizieren

## Stage-Logo – rein weiße Variante
- [x] Vom Nutzer bereitgestelltes rein weißes Stage-Logo als aktive Quelle für Teaser und Ticketbereich integrieren
- [x] Transparenz, Kontrast, Größe und Ausrichtung der weißen Stage-Variante in Teasern und Ticketbereich auf Desktop sowie Mobil verifizieren
- [x] Kleine weiße Links-/Rechtspfeile ausschließlich in der Desktop-Hero-Schiebenavigation integrieren
- [x] Desktop-Pfeilsteuerung, mobile Wischbedienung und linke/rechte Randzustände verifizieren
- [x] Desktop-Pfeile außerhalb der äußersten Tabs platzieren, damit sie keine Tabbeschriftungen überlagern
- [x] Webflow-Importpaket auf Nutzerwunsch aus dem aktuellen Arbeitsumfang herausnehmen und als nicht erforderlich dokumentieren
- [x] Umfassende finale Sichtprüfung der aktuellen Start-, Musical-, Stadt-, Impressum- und Datenschutzseiten dokumentieren (Desktop und Mobil)
- [x] Schema.org für Musical-Detailseiten mit korrektem addressCountry je Tourstadt (DE/AT/CH) absichern und testen
- [x] Abschließende Ergebniszusammenfassung an den Nutzer senden: umgesetzte SEO-Änderungen, Sitemap-/Schema-/Canonical-Anpassungen, Test-/TypeScript-/Build-Status und finale visuelle Prüfung dokumentiert darstellen
- [x] Ersetzt durch die präzisierte obere Landingpage-Anforderung; keine Änderung an den späteren Städte-/Ticketsektionen vorgenommen
- [x] Auf Nutzerkorrektur hin verworfen; die Hero-Schiebenavigation der Startseite bleibt unverändert
- [x] Durch die präzisierte obere Landingpage-Anforderung ersetzt
- [x] Obere Musical-Landingpage mobil verdichtet: Stadt/Venue bzw. Mehrstadtzeile → erster CTA und CTA → folgende Headline reduziert; Desktop unverändert
- [x] Mehrstadt- und Tourneestadt-Header am Beispiel Drei Haselnüsse für Aschenbrödel mobil geprüft
- [x] Rapunzel: Berlin vom 14.05. bis 06.06.2027 im BlueMax Theater an allen relevanten Stellen ergänzt und verifiziert (Datenquelle, aktive Stadtseite, Tourdaten, SEO, FAQ, Awin-Eventim-Link, Tests, Build und mobile Sichtprüfung)
- [x] Durch die finale responsive Hero-Lösung ersetzt: Mobil und Desktop 56 px oben, 48 px unten
- [x] Hero-Schiebenavigation auf Mobil und Desktop mit etwas mehr Abstand oben als unten umgesetzt und responsive verifiziert (56 px oben, 48 px unten)
- [x] Hero-Schiebenavigation: alle vom Nutzer vorgegebenen gekürzten Musicaltitel statt Versalien/Langversionen eingepflegt; Reihenfolge und Direktlinks unverändert geprüft
- [x] Hero-Schiebenavigation: frühere Unter-U-Sortierung verworfen; „& Julia“ bleibt sichtbar an dritter Stelle mit unverändertem Direktlink
- [x] Hero-Schiebenavigation: „& Julia“ sichtbar an dritter Stelle direkt nach „Musicals“ und „Städte“ belassen; Direktlink unverändert geprüft
- [x] Hero-Schiebenavigation: nach dem festen dritten Button „& Julia“ alle weiteren Kurzlabels alphabetisch nach sichtbarer Bezeichnung sortiert

- [x] Berlin-Städteheader um den Satz „Berlin lockt mit dem Theater des Westens und dem BlueMax Theater“ ergänzt und geprüft
- [x] Graz-Link aus der Startseiten-Städte-Sektion korrigiert: Die Graz-Landingpage startet zuverlässig am Seitenanfang

- [x] Reproduzierten Graz-Scrollfehler beim Klick aus der tief gescrollten Startseiten-Städte-Sektion analysiert und mit synchronem Karten-Klick-Reset sowie globaler Routen-Scrollhilfe behoben

- [x] Alle Städte-Links aus der Startseiten-Städte-Sektion zentral gegen den Scrollfehler abgesichert: Stadtseiten starten am Hero, mit synchronem Zielseiten-Reset, Frame-/Layout-Nachkorrektur und deaktiviertem Scroll-Anchoring

- [x] Hotelbereiche der Startseite zu einer kompakten, kuratierten und partnerneutralen Tickets-und-Hotel-Sektion verdichtet
- [x] Auf Stadtdetailseiten eine kontextbezogene Section „Tickets & Hotel“ konzipiert und umgesetzt
- [x] Travelcircus als potenziellen Hotel- und Erlebnispartner mit Status „pending“ in der zentralen Linkkonfiguration vorbereitet
- [x] Startseite: lange Hotelkartenliste durch eine kuratierte Tickets-und-Hotel-Sektion für Berlin, Hamburg und Stuttgart ersetzt
- [x] Stadtdetailseiten: kombinierten Tickets-und-Hotel-Bereich mit Programm-Anker und aktivem städtischen Hotel-Link ergänzt
- [x] Partnerlogik für einen späteren Travelcircus-Paketlink vorbereitet, ohne vorliegende HRS-Links zu verändern

- [x] Tickets-und-Hotel-Sektion auf der Startseite vorerst vollständig ausgeblendet und den Hotel-Navigationseintrag entfernt
- [x] Stadtdetailseiten: kombinierten Tickets-und-Hotel-Bereich auf einen schlanken HRS-Hotelbereich ohne gelben „Musicals & Tickets“-Button reduziert

- [x] Hero-Schiebenavigation auf Desktop vollständig ausgeblendet und auf Mobil unverändert als Wisch-Navigation erhalten

- [x] Tanz der Vampire: doppelte Veranstalter-Sektion entfernt und die verbleibende Anbieterkennzeichnung geprüft
- [x] Tanz der Vampire: bereitgestelltes Aovo-Reisen-Banner nach „Hotels in der Nähe“ responsiv mit TradeDoubler-Ziellink eingebunden

- [x] Aovo-Reisen-TradeDoubler-Banner für Moulin Rouge!, Salon Rosie, Der Teufel trägt Prada, Die Eiskönigin, König der Löwen und MJ mit den bereitgestellten Kampagnenparametern integriert
- [x] Die sechs Banner jeweils nach „Hotels in der Nähe“ sichtbar und responsiv eingebunden sowie Impression- und Klicktracking kampagnenspezifisch geprüft
- [x] Alle betroffenen Aovo-Kampagnenmotive als direkt auslieferbare Website-Assets bereitgestellt und sichtbare Banner von externen Bildblockern entkoppelt

- [x] Aovo-Reisen-Banner für Zurück in die Zukunft, Tarzan, Starlight Express und Wir sind am Leben mit den bereitgestellten Trackingparametern integriert
- [x] &-Julia-Stage-Banner direkt vor „Warum & Julia ein Erlebnis der Extraklasse ist“ eingebunden
- [x] Moulin Rouge!: Köln aus den Hotelvorschlägen entfernt und nur Hamburg im Hotelbereich angezeigt
- [x] Alle neuen Bannerpositionen, Kampagnenlinks und den Moulin-Rouge-Hotelbereich auf Mobil und Desktop geprüft
- [x] Sichtbare Aovo-Banner von Affiliate-Anchor-Filterung entkoppelt, damit externe Filter die Motive nicht ausblenden und die Click-Weiterleitung erhalten bleibt

- [x] &-Julia-Landingpage nach der Rücksetzung lokal und live geprüft: vollständige Darstellung ohne blaue Fehleransicht oder Laufzeitfehler bestätigt; keine Codeänderung erforderlich

- [x] Mobilen Fehler beim Wechsel zu & Julia über die Hero-Schiebenavigation reproduziert und behoben: Musicalbuttons nutzen nun relative Wouter-In-App-Routen; direkte Route und übrige Navigationseinträge geprüft

- [x] &-Julia-Banner auf Desktop auf die native kampagnengerechte Breite begrenzt und mobil geprüft
- [x] Tarzan-Aovo-Banner auf native 300-×-250-Darstellung begrenzt und auf Mobil sowie Desktop auf ausreichende Schärfe geprüft
- [x] Wir sind am Leben: Ticketsektion mit Berlin, Stage Theater des Westens, Spielzeit 01.07.2026–28.02.2027 und Stage-Logo rechts ergänzt
- [x] &-Julia-Banner innerhalb des Story-Fließtexts direkt vor „Erlebe eine unbeschwerte, romantische Feel-Good-Show …“ eingefügt und bisherige Position entfernt

- [x] &-Julia: Abstand oberhalb der Passage „Erlebe eine unbeschwerte, romantische Feel-Good-Show …“ passend zur Bannerintegration vergrößert und angeglichen
- [x] Alle Aovo-Kampagnenbanner auf native Bildgröße, Schärfe und responsive Auslieferung geprüft; Eiskönigin- und Tarzan-Motiv ohne rahmenbedingte Skalierung auf nativen 300 × 250 px abgesichert
- [x] Technischen Awin-Audit für Eventim- und ATG-Links inklusive Publisher-ID, Zielweiterleitung und nachvollziehbarer Trackingparameter durchgeführt
- [x] Cookie- und Drittanbieter-Audit für YouTube, Awin, TradeDoubler, Analytics und externe Assets durchgeführt sowie Consent-Architektur festgelegt
- [x] Externe Inhalte nach Freigabe erst nach Interaktion bzw. Zustimmung geladen und kompakten Cookie-Consent mit Ablehnungsoption implementiert
- [x] Kompakten Consent-Banner mit „Alle akzeptieren“, „Nur notwendige“ und „Einstellungen“ im Theatrical-Noir-Stil implementiert
- [x] Optionale Dienste (Umami, Awin MasterTag, TradeDoubler-Converter, Aovo-Impressions und YouTube) bis zur aktiven Zustimmung blockiert
- [x] Datenschutz-Einstellungen über Footer erreichbar gemacht und die Datenschutzerklärung auf die Consent-Kategorien aktualisiert

- [x] Affiliate-Zuordnung für Eventim/Awin, ATG/Awin und Stage/TradeDoubler technisch vollständig auditiert und für zustimmende Besucher maximal sauber optimiert
- [x] Consent-Banner vor Veröffentlichung gegen die optimierten Partner- und Conversionpfade geprüft und die Attributionseffekte dokumentiert

- [x] Doppelte manuelle UTM-/sv-Parameter aus allen ATG-Ticketlinks bereinigt und die dynamische Awin-Bounceless-Attribution danach geprüft

- [x] Anbieterlogos aus allen Karten unter „Spielorte & Termine“ entfernt und Ticketinformationen unverändert geprüft
- [x] Fack ju Göhte im Startseiten-Teaser mit einem Sale-Störer analog König der Löwen und der sichtbaren Beschriftung „30 % Back to School Sale“ versehen
- [x] Fack-ju-Göhte-Landingpage: bereitgestelltes Eventim-Awin-Banner nach der Einleitung sichtbar, responsiv und als gesponserte Ticketoption eingebunden
- [x] Fack-ju-Göhte-Sale-Störer: „Back to School Sale“ innerhalb des roten Badges ohne Icon-, Text- oder Top-Musical-Überlappung dargestellt und auf Desktop sowie Mobil geprüft
- [x] Fack-ju-Göhte-Sale-Störer: Back-to-School-Text deutlich kompakter gesetzt, damit die Badge-Höhe der Familien-Variante entspricht
- [x] HRS-Hotelbereiche auf allen Musical-Landingpages vorerst einheitlich ausgeblendet, ohne bestehende Ticketabschnitte oder Kampagnenbanner zu verändern
- [x] Fack-ju-Göhte-Eventim-Awin-Banner durch Kampagne 4568827 ersetzen: Nach mehreren fehlgeschlagenen Vorschauvarianten auf ausdrücklichen Wunsch nicht weiterverfolgt und durch die zuvor bewährte Kampagne ersetzt
- [x] Fack-ju-Göhte-Eventim-Awin-Banner auf die zuvor verwendete Kampagne 4568823 mit dem bewährten sichtbaren Motiv und zugehörigem Klick- sowie Impression-Tracking zurückgestellt und auf Desktop sowie Mobil geprüft
- [x] Fack-ju-Göhte-Sale-Störer: mobilen Überlauf am Kartenrand verhindert und Abstand zu weiteren Teaser-Badges auf 375 px Breite geprüft
- [x] Video-Vorschau auf Musical-Landingpages auf die zuvor bevorzugte, zurückhaltende Darstellung zurückgestellt, ohne die YouTube-Consent-Sperre zu umgehen
- [x] Video-Vorschau auf Musical-Landingpages: je Trailer das passende echte Thumbnail statt der abstrakten Platzhalterfläche angezeigt; YouTube selbst weiter erst nach Zustimmung und Klick laden
- [x] Für alle hinterlegten Trailer-IDs echte, lokal auslieferbare YouTube-Thumbnails erfasst und als emotionale Vorschaubilder ohne Vorabkontakt zu YouTube eingebunden
- [x] Bestätigte Umsetzung: Die aktuellen Video-Platzhalter auf allen Musical-Landingpages durch die zugehörigen lokalen Trailer-Thumbnails ersetzt, ohne die YouTube-Consent-Sperre zu verändern
- [x] Mobile Video-Vorschau: lokale echte Trailer-Thumbnails sichtbar ausgeliefert; funktionierende Desktop-Darstellung unverändert gelassen
- [x] Desktop-Regression der Trailer-Vorschau nach mobiler Vorladeanpassung zurückgenommen und die fehlerfreie Desktop-Anzeige wiederhergestellt
- [x] Trailer-Thumbnails: fehlerhaft dargestellte lokale Grafikquelle auf Desktop und Mobil durch stabil dekodierbare Vorschaubilder ersetzt
- [x] Trailer-Thumbnails mit doppeltem Artwork oder Key Visual bei Fack ju Göhte, Glöckner von Notre-Dame, Tarzan, Tanz der Vampire und Sister Act durch lebendigere passende Szenenbilder ersetzt; Das Phantom der Oper bleibt auf Wunsch beim bisherigen Vorschaubild. Die YouTube-Consent-Sperre bleibt unverändert
- [x] Standard für künftige Trailer festgehalten: immer ein lebendiges, klar erkennbares Bühnen- oder Szenenbild verwenden und Artwork nur einsetzen, wenn kein passendes Szenenmotiv verfügbar ist
- [x] Das bisherige Trailer-Thumbnail von Das Phantom der Oper wiederhergestellt und das neue, checkpoint-blockierende Phantom-Szenenbild aus den lokalen Webassets entfernt
- [x] Fack-ju-Göhte-Sale-Störer in Breite und Höhe an König der Löwen angeglichen und für künftige Rabattbuttons ein einheitliches, auf Mobilgeräten randfestes Format mit ausreichendem Textinnenabstand definiert
- [x] Hero-Schiebenavi: Browser-Zurück-Navigation nach „Musicals“ und „Städte“ zur Startseite am Hero zurückgeführt statt fälschlich zum Impressum
- [x] Fack-ju-Göhte-Sale-Störer: „Back to School Sale“ kontrolliert umgebrochen, damit der Text auf Desktop und Mobil vollständig innerhalb des einheitlichen Buttons bleibt
- [x] Fack-ju-Göhte-Sale-Störer: Rabattzeile „SALE · 30 %“ deutlich größer gestaltet, ohne die einheitliche Badge-Geometrie oder mobile Randabstände zu beeinträchtigen
- [x] Startseiten-Highlights auf neun Top-Musicals gesetzt: König der Löwen, Eiskönigin, Tarzan; Moulin Rouge, Glöckner von Notre-Dame, MJ; Zurück in die Zukunft, Tanz der Vampire, Starlight Express. & Julia, Dracula und Drei Haselnüsse für Aschenbrödel nur unter „Alle Musicals“ geführt
- [x] Fack-ju-Göhte-Sale-Störer: „BACK TO SCHOOL“ und „SALE · 30 %“ ausschließlich auf Mobilgeräten vergrößert; Desktopgröße und rechter Textinnenabstand bleiben unverändert
- [x] Eventim- und ATG-Awin-Links auf fehlende Webkassierer-/Werbemittelparameter geprüft, mit Merchant-Vorgaben abgeglichen und nur eindeutig verifizierte Trackinganpassungen umgesetzt
- [x] ATG-Awin-Banner `s=4882591`, `v=111888`, `q=614186` und `r=2865727` technisch eingeordnet und mit den derzeitigen ATG-Links verglichen
- [x] Awin-Textlink-Werbemittel für Moulin Rouge (`gid=597568`, `linkid=4845203`), Starlight Express (`gid=508544`, `linkid=3861476`) und Fack ju Göhte (`gid=492097`, `linkid=4568988`) mit eindeutigen Clickrefs in die Ticketpfade integriert
- [x] Vollständigen Audit aller ShowSlot/Eventim- und ATG-Ticketpfade erstellt: Werbemittel-IDs, Convert-a-Link-Abdeckung nach Einwilligung sowie fehlende Merchant-Textlinks je Show dokumentiert
- [x] Konkrete Awin-Textlink-Anforderungsliste je Eventim- und ATG-Show erstellt, damit fehlende Werbemittel gezielt aus Awin kopiert werden können
- [x] Die zwei vorhandenen ATG-Textlinks für Moulin Rouge und Starlight Express integriert; bei Phantom der Oper und Glöckner von Notre-Dame die direkten ATG-Ziele mit Convert-a-Link-Fallback nach Einwilligung beibehalten
- [x] Awin-Textlinks nur an verifizierten Haupt-CTAs eingesetzt; stadtbezogene Tourtermin-Deep-Links mit eigenen Clickrefs beibehalten und getrennt geprüft
- [x] Eventim-Textlinks für Die Schöne und das Biest (`gid=492097`, `linkid=3737237`) und Dracula (`gid=492097`, `linkid=3889201`) an den jeweiligen Haupt-CTAs integriert; Sister Act deaktiviert, Drei Haselnüsse und Rapunzel beim Deep-Link-Fallback belassen
- [x] Ursachenanalyse für Stage/TradeDoubler-Transaktionen gegenüber bislang ausbleibenden Eventim-/ATG-Awin-Transaktionen erstellt: Klickvolumen, Linkformat, Consent, Checkout- und Attributionspfade getrennt bewertet
- [x] Sister Act wegen des Endes der Berliner Spielzeit aus allen öffentlichen Musical-Listen, Navigationen und Routen deaktiviert, ohne den historischen Datensatz zu löschen
- [x] Hero-Schiebenavigation aus Nutzer- und Conversion-Sicht bewertet: Orientierungstabs getrennt, neun kuratierte Top-Musicals priorisiert und vollständige A–Z-Auswahl als separaten Einstieg empfohlen
- [x] Hero-Schiebenavigation nach Variante A umgesetzt: separate Orientierungstabs „Alle Musicals“ und „Städte & Termine“, neun Top-Musicals in Highlight-Reihenfolge sowie ein Tab „Weitere Musicals A–Z“ zur vollständigen Übersicht
- [x] Hero-Navigation verfeinert: Orientierungstabs in Gold und in derselben Größe wie Musicalbuttons gestaltet, Musicalbuttons weiß belassen und das vorhandene König-der-Löwen-Sonnenmotiv als kontraststarken Hero-Hintergrund eingesetzt
- [x] Hero-Navigation: den Tab „Weitere Musicals A–Z“ ebenfalls als goldenen Orientierungstab gestaltet, während individuelle Musicalbuttons weiß bleiben
- [x] Zurück in die Zukunft um die kleinere Versalien-Subline „DAS MUSICAL“ im Stil der übrigen Musicaltitel ergänzt
- [x] Mobile Hero-Schiebenavigation auf eine kontextabhängige Sticky- und Active-State-Variante bewertet: beim Zurückscrollen sichtbar, beim Herunterscrollen zurückhaltend und mit goldener Hervorhebung des sichtbaren Musicals empfohlen
- [x] Mobile Hero-Navigation: Abstand oberhalb der Orientierungstabs und unterhalb der abschließenden Musicalbutton-Gruppe gezielt reduziert, Gruppenabstände beibehalten
- [x] Mobile Hero-Navigation: moderne, unaufdringliche Wischbarkeits-Signalisierung ohne Pfeile oder Autoscroll bewertet und eine empfohlene Variante festgelegt
- [x] Breadcrumb-Navigation einheitlich auf „Alle Musicals“ und „Städte & Termine“ umgestellt
- [x] Mobile Hero-Navigation: angeschnittene nächste Tabkante und dynamischen Goldverlauf am rechten Überlauf ergänzt; Verlauf am Listenende ausblenden
- [x] König-der-Löwen-Hero gegen Bühnenbild, ruhigen Video-Loop und reduzierten bzw. textfreien Hero bewertet; statisches Rafiki-Motiv mit verkürzter Textebene als bevorzugte Variante definiert
- [x] Goldenen Schatten am Tab „Weitere Musicals A–Z“ entfernt und die mobilen Burger-Menüeinträge auf „Alle Musicals“ sowie „Städte & Termine“ vereinheitlicht
- [x] Goldenen Verlauf an der rechten Kante der mobilen Hero-Schiebenavigation entfernt; die natürliche angeschnittene nächste Tabkante bleibt als dezenter Wisch-Hinweis erhalten
- [x] Sichtbare nächste Tabkante der mobilen Hero-Schiebenavigation durch behutsam reduzierte Tab-Innenabstände vergrößert und Hero-Teasertext um „und Shows“ ergänzt
- [x] Desktop-Hero bei breiten Fenstern in Höhe und Bildposition so optimiert, dass Sonne und Rafiki rechts deutlich sichtbar bleiben
- [x] Durch Folgeanforderung ersetzt: Desktop-Navigation nicht isoliert umbenennen
- [x] Hauptnavigation auf Desktop und im mobilen Burger-Menü einheitlich auf „Alle Musicals & Shows“ umbenannt
- [x] Desktop-Abstand zwischen dem vergrößerten Hero und der Highlights-Sektion spürbar reduziert, ohne die mobile Ansicht zu verändern
- [x] Desktop-Abstand zwischen Hero und Highlights-Sektion nochmals leicht reduziert, ohne die mobile Ansicht zu verändern
- [x] Startseite als doppelfreie redaktionelle Übersicht strukturiert: neun Highlights zuerst, darunter „Weitere Musicals & Shows“ ohne wiederholte Highlights; Filter klar auf diese zweite Liste bezogen und Hauptnavigation sowie Hero-Orientierung an den redaktionellen Einstieg verlinkt
- [x] Hauptnavigation und mobile Hero-Orientierung zentral von „Städte & Termine“ auf „Musical-Städte“ umbenannt
- [x] „Städte & Termine“ in sämtlichen Desktop-, Burger- und mobilen Hero-Navigationen konsistent durch „Musical-Städte“ ersetzt
- [x] Hauptnavigation und Hero-Tab „Alle Musicals & Shows“ auf den Highlights-Einstieg verlinkt sowie den Tab „Weitere Musicals & Shows“ auf die untere gleichnamige Liste ausgerichtet
- [x] Bestätigte Ankerlogik umgesetzt: Desktop-Hauptnavigation „Alle Musicals & Shows“ führt zu den Highlights; mobiler Hero-Tab „Weitere Musicals & Shows“ führt zur unteren gleichnamigen Section
- [x] Desktop-Abstand zwischen Hero und Highlights-Sektion auf ein nahezu direktes, aber noch klar gegliedertes Maß reduziert; mobile Ansicht unverändert gelassen
- [x] Desktop-Abstand zwischen Hero und Highlights auf den kleinsten klar gegliederten Wert reduziert; mobile Ansicht unverändert gelassen
- [x] Hauptnavigation und mobile Hero-Navigation auf „Musicals & Shows“ sowie „Städte“ vereinheitlicht und die zugehörigen Breadcrumb-Bezeichnungen angepasst
- [x] Beschreibungstext unter „Weitere Musicals & Shows“ auf die vorherige Fassung zurückgestellt; ausschließlich die Headline wurde geändert
- [x] Filterbeschriftung auf „Alle Musicals & Shows filtern“ gesetzt und aktive Filter auch auf die neun Highlights angewendet
- [x] Filteroberfläche und mobile Filtersteuerung mit der abgerundeten Formensprache der Hero-Schiebe-Buttons vereinheitlicht
- [x] Im mobilen Startseiten-Hero einen Zeilenumbruch direkt vor „Licht aus, Magie an!“ gesetzt; Desktop unverändert gelassen
- [x] Footer um dynamische Links zu den aktuellen Top-Musicals und zu wichtigen Musical-Städten im DACH-Raum erweitert
- [x] Startseiten-Sale-Störer neben dem Preisschild-Icon auf die einheitliche Bezeichnung „SALE“ vereinfacht und Rabattwerte beibehalten
- [x] Startseiten-Teaser-CTA von „Tickets sichern“ auf „Infos & Tickets“ umbenannt, weil sie auf die jeweilige Detailseite führt
- [x] Startseiten-Sale-Störer mittig als Einzeile mit Trennpunkt dargestellt: „SALE · BIS 15 %“ bei variablen und „SALE · 30 %“ bei festen Rabatten
- [x] Newsletter-Abo-Funktion als Folgeanforderung vorgemerkt; Umsetzung beginnt nach Wahl eines Newsletter-Partners und eines gewünschten Erinnerungszeitpunkts
- [x] Überschrift der Geo-Suche auf „Musicals & Shows in deiner Nähe“ aktualisiert und auf Desktop sowie Mobil geprüft
- [x] Sale-Störer „SALE · BIS 15 %“ so angepasst, dass das Prozentzeichen auf Desktop und Mobil vollständig sichtbar bleibt
- [x] Alle Sale-Störer auf dieselbe ausreichend breite Geometrie vereinheitlicht und den Sicherheitsabstand zum Top-Musical-Badge beibehalten
- [x] Sale-Störer auf Desktop und Mobil typografisch kompakter gestaltet und für „SALE · BIS 15 %“ einen verlässlichen rechten Innenabstand sichergestellt
- [x] Startseiten-Sale-Störer auf inhaltsbasierte Breiten umgestellt und mobile Innenabstände sichtbar verdichtet
- [x] Flexible Sale-Vorteiltexte „2 FÜR 1“ und „2. TICKET 35 €“ für die Zuordnung zu konkreten Musicals vorbereitet
- [x] Technischen Format-Hinweis „5-stellig DE · 4-stellig AT/CH“ aus der Geo-Suche entfernt
- [x] Stadt- und Terminteaser auf Desktop mit einem dezenten goldenen Hover- und Fokusrahmen versehen; Mobil unverändert gelassen
- [x] Footer-Linkgruppen in „TOP MUSICALS & SHOWS“ und „TOP MUSICAL STÄDTE“ umbenannt
- [x] Footer-Link „Kontakt“ aus dem Bereich „Information“ entfernt; Impressum als Kontaktangabe beibehalten
- [x] Bestehende Eventim-/Awin-Deep-Links und neue ShowSlot-Textlinks geprüft; nutzerfreundliche Einbindung für Haupt-CTAs, Tourtermine und Stadtteaser festgelegt
- [x] Bestehenden Awin-Deep-Link für Fack Ju Göhte in Berlin technisch geprüft und seinen Aufbau dokumentiert, ohne Website-Links zu ändern
- [x] Geografischen Zusatz „in Deutschland, Österreich und der Schweiz“ aus dem Startseiten-Hero-Teaser entfernt
- [x] Hero-Navigation: „Weitere Musicals A–Z“ in Breite und Höhe exakt an die weißen individuellen Musicalbuttons angeglichen, Goldkontur und Goldschrift beibehalten
- [x] Hero-Navigation: Alle Musicals, Städte & Termine und Weitere Musicals A–Z kleiner sowie transparent mit goldener Kontur und goldener Schrift gestaltet; individuelle Musicalbuttons weiß belassen
- [x] Hero-Hintergrund auf das vorhandene König-der-Löwen-Sonnenmotiv mit der Person rechts umgestellt und die Textlesbarkeit auf Desktop sowie Mobil geprüft
- [x] Allgemeinen „Script error.“ auf der Impressumsseite auf externe Affiliate-Skripte eingegrenzt und durch deren Ausschluss auf Rechtsseiten sicher behoben
- [x] Footer-Stadtliste um Bremen, Bochum, Duisburg, Köln und Frankfurt erweitert und alle Stadtlinks geprüft
- [x] Footer-Stadtlinks alphabetisch sortiert und die sichtbare Reihenfolge auf Desktop sowie Mobil geprüft
- [x] Im Impressum einen transparenten Affiliate-Hinweis für Stage-Entertainment-Links über TradeDoubler mit Publisher-ID 2475512 ergänzt
- [x] Bereitgestellte ATG-Awin-Textlinks für Phantom, Moulin Rouge, Starlight Express und alle Glöckner-von-Notre-Dame-Termine (München, Düsseldorf, Frankfurt, Leipzig, Bremen, Duisburg, Berlin) mit eindeutigen Clickrefs integriert; Romeo-&-Julia-Link-IDs für spätere Termine vorgemerkt
- [x] Hamburger Moulin-Rouge-Termin-Teaser auf den bereitgestellten Awin-Textlink mit eigenem Clickref umgestellt
- [x] MJ-TradeDoubler-Banner Creative 26180466 consent-konform auf der Detailseite integriert
- [x] MJ-Startseiten-Sale-Störer auf „SALE · AB 35 €“ aktualisiert
- [x] Mobile Sichtbarkeit des MJ-Sale-Störers und des MJ-Stage-300×250-Banners geprüft und korrigiert
- [x] Sichtbarkeit des MJ-Stage-300×250-Banners auf Desktop und Mobil reproduziert und ohne Umgehung der Affiliate-Einwilligung korrigiert
- [x] Bereitgestellte MJ-Stage-Originalgrafik als 300×250-Projekt-Asset ausgeliefert und sichtbar geprüft
- [x] MJ-Originalgrafiken statt über die fehleranfällige Projekt-Proxyroute über direkte dauerhafte Projekt-Asset-Adressen ausgeliefert und auf Desktop sowie Mobil sichtbar geprüft
- [x] MJ-Stage-Banner 728×90 im oberen Fließtext vor den Spielorten integriert und das 300×250-Banner nach „Tickets sichern“ belassen
- [x] Einheitliche Detailseiten-Hierarchie für die integrierten Kampagnen umgesetzt: schmale Banner im oberen Fließtext, große Banner nach dem Ticketbereich und Hotel-/Reisebanner am Seitenende
- [x] MJ-Stage-Banner 728×90 in die Mitte des oberen Fließtexts verschoben, ohne Spielorte oder Ticketkasten zu unterbrechen
- [x] MJ-Stage-Banner 728×90 nach dem Fließtext unter der zweiten Zwischenüberschrift „Die Geschichte hinter dem Genie“ angezeigt
- [x] Mobil das MJ-Stage-Banner 728×90 nach dem Keyvisual der zweiten Zwischenüberschrift angezeigt
- [x] MJ-Originalgrafiken über direkte dauerhafte Projekt-Asset-Adressen aus dem externen Assetbereich ausgeliefert, damit sie auf der Custom-Domain sichtbar laden
- [x] Bereitgestellte König-der-Löwen-Stage-Banner 728×90 und 300×250 nach der Bannerhierarchie integriert
- [x] Bereitgestelltes MJ-Aovo-Reisebanner 750×200 getrennt nach den FAQ eingebunden
- [x] KDL- und MJ-Aovo-Originalgrafiken als lesbare öffentliche Produktionsassets ausgeliefert und auf Desktop sowie Mobil geprüft
- [x] Zwischengespeicherte fehlerhafte 728×90-MJ-Bildantwort durch direkte Projekt-Asset-Adresse zuverlässig umgangen und anschließend auf Desktop sowie Mobil abgenommen
- [x] HTML-App-Shell ohne Langzeit-Cache ausgeliefert, damit neue Detailseiten- und Bannerstände unmittelbar nach Veröffentlichung laden
- [x] Große Kampagnenbanner auf allen Detailseiten direkt nach der Bildergalerie und vor „Alles, was du wissen musst“ platziert sowie auf Desktop und Mobil geprüft
- [x] Allgemeinen „Script error.“ auf der Startseite reproduziert, auf externen Awin-Mastertag in der Webdev-Vorschau eingegrenzt und sicher behoben
- [x] Oberen Abstand des MJ-Aovo-Reisebanners am Seitenende deutlich reduziert, auf Mobil um rund 45 %, und auf Desktop sowie Mobil geprüft
- [x] Alle MJ-Ticket-CTAs außerhalb von Banneranzeigen sicher auf die neue Stage-/TradeDoubler-Textlink-Kampagne 26149402 umgestellt und Bannerziele unverändert gelassen
- [x] Zweites MJ-Aovo-Angebot 26068476 im Format 300×250 am Seitenende nach dem bestehenden breiten Aovo-Banner eingebunden und auf Desktop sowie Mobil geprüft
- [x] Quadratisches MJ-Aovo-Banner 26068476 vom Seitenende entfernt und das bereitgestellte KDL-Aovo-Banner 26068528 im Format 750×200 nach den FAQ integriert sowie auf Desktop und Mobil geprüft
- [x] Oberen Abstand der Aovo-Endseitenbanner nochmals deutlich auf Mobil und Desktop reduziert sowie die engere Einbindung geprüft
- [x] Trennlinien bei allen Kampagnenbannern entfernt und die Kennzeichnung ausschließlich über „Anzeige“ auf Desktop sowie Mobil geprüft
- [x] Eiskönigin-Teaser mit dem Sale-Störer „SALE · BIS 15 %“ analog zu König der Löwen ergänzt und auf Desktop sowie Mobil geprüft
- [x] Auf ausdrücklichen Nutzerwunsch zurückgestellt: Stadtseiten für Hamburg, Stuttgart, Berlin, Köln, München, Bochum und Düsseldorf als eigenständige Musical-Money-Pages bewerten und ein umsetzbares SEO-, Content- und Conversion-Konzept ausarbeiten
- [x] Auf allen Stadtseiten die Programmüberschrift auf „AKTUELL IN [STADTNAME]“ und die Subline auf „Musicals & Shows 2026/2027“ umgestellt sowie diese Formulierung als künftigen Stadtseitenstandard dokumentiert
- [x] Einstiegspreise für Die Eiskönigin, König der Löwen, Tarzan, MJ, Zurück in die Zukunft, Tanz der Vampire, Starlight Express, & Julia, Der Teufel trägt Prada und Salon Rosie gemäß Vorgabe zentral aktualisiert
- [x] Tarzan mit „SALE · BIS 15 %“ und Salon Rosie mit „SALE · 2 FÜR 1“ als kompakte Startseiten-Sale-Störer ergänzt und geprüft
- [x] Salon-Rosie-Detailseite nach Klick von der Startseite zuverlässig oben am Seitenbeginn geöffnet und Scroll-/Ankerverhalten auf Desktop sowie Mobil geprüft
- [x] Geschützte Preis- und Sale-Verwaltung mit dauerhafter Datenbankspeicherung und Browser-Redaktionsansicht für den Projektinhaber eingerichtet
- [x] Entfällt auf ausdrücklichen Nutzerwunsch: keine weitere OAuth-/Manus-Preisverwaltungsarbeit unter /verwaltung/preise
- [x] Entfällt auf ausdrücklichen Nutzerwunsch: kein OAuth-Rücksprung für die verworfene Preisverwaltung erforderlich
- [x] Entfällt auf ausdrücklichen Nutzerwunsch: keine Custom-Domain-Weiterleitung für die verworfene Preisverwaltung erforderlich
- [x] Entfällt auf ausdrücklichen Nutzerwunsch: kein OAuth-Callback für die verworfene Preisverwaltung erforderlich
- [x] Entfällt auf ausdrücklichen Nutzerwunsch: kein Anmeldebutton für die verworfene Preisverwaltung erforderlich
- [x] Extern gepflegte Google-Sheets-Preis- und Sale-Quelle mit automatischer, ausfallsicherer Übernahme in die öffentliche Website einrichten
- [x] Entfällt: begrenzter veröffentlichter Website-Export wurde als datensparsame Alternative zur privaten Service-Account-Synchronisation gewählt
- [x] Freigegebenen Google-Sheets-Website-Export als CSV-Quelle auslesen, validieren und ausfallsicher in die öffentliche Preis- und Sale-Anzeige übernehmen
- [x] Eiskönigin-Stage-Banner 26185658 (729×90 oben) und 26185656 (300×250 nach der Bildergalerie) mit bereitgestellten Motiven sicher integriert und die nativen Größen geprüft
- [x] Eiskönigin-Sale auf „SALE · BIS 40 %“ mit Laufzeit 14.–21.09.2026 aktualisiert und alle Ticket-CTAs außerhalb der Banner auf die TradeDoubler-Textlink-Kampagne 26149418 umgestellt
- [x] Eiskönigin-Sale ausschließlich vom 14. bis einschließlich 21.09.2026 aktiv anzeigen lassen

## Runde Icon-Steuerung
- [x] Rechteckige Header-Werkzeuge durch kompakte runde Icon-Buttons im Stil der Referenz ersetzen und auf Desktop sowie Mobil prüfen

## Teaser-CTA-Icon
- [x] Das viereckige External-Link-Piktogramm neben „Infos & Tickets“ in allen Startseiten-Teasern durch ein rundes Pfeil-Icon ersetzen und prüfen

## Header-Icon-Zustand
- [x] Aktiven Zustand der Standortsuche an die Suche angleichen, damit beide runden Icons beim Öffnen identisch reagieren

## Erlebnisfilter und Teaser-Kategorien
- [x] Alle aktiven Musicals einer eindeutigen redaktionellen Erlebniswelt zuordnen und diese statt beliebiger Tags in den Teasern zeigen
- [x] Starre Kategorie-, Länder- und Sortier-Dropdowns durch responsive Erlebnis- und Länderbuttons ersetzen; Sortierung entfernen
- [x] Stadtfilter als moderne Ortssuche mit Schnellauswahl, vollständiger Suche und Umkreissuche umsetzen und auf Desktop sowie Mobil prüfen

## Phantom-Kategorie
- [x] Das Phantom der Oper von „Blockbuster & Spektakel“ in „Kult & Klassiker“ einordnen und die Filterzuordnung prüfen

## Mobile Teaser-Badges
- [x] Top-Musical- und Erlebnis-Kategorie-Badges mobil vergrößern sowie Kategorie-Badges deckend gestalten und prüfen

## Teaser-Badges ohne Goldglanz
- [x] Kategorie-Badge dem transparenten Top-Musical-Stil angleichen und beide Teaser-Badges auf Desktop vergrößern

## Erlebnis-Kategorie auf Detailseiten
- [x] Erlebnis-Kategorie auf Musical-Detailseiten sichtbar ergänzen und die Filterreihenfolge nach Conversion-Priorität ausrichten

## Detailseiten ohne Zusatz-Tags
- [x] Bisherige Detailseiten-Tags wie Familie, Disney und Romantik entfernen; nur die Erlebnis-Kategorie beibehalten und prüfen

## Kategorie-Einstiege und Empfehlungen
- [x] Erlebnis-Kategorien als Hero-Einstieg ergänzen, verwandte Shows danach priorisieren und die Pflichtkategorie für neue Musicals dokumentieren

## Kategorie-Optimierung für Desktop und Analytics
- [x] Erlebnis-Kategorie-Einstiege auf Desktop ergänzen, Empfehlungstexte emotionalisieren und consent-konformes Kategorie-Tracking einführen

## Einheitliche Familien-Kategorie
- [x] „Familie, Märchen & Magie“ in allen Kategorie-Einstiegen, Filtern, Teasern und Detailseiten vereinheitlichen

## Konsistente Musicalübersicht
- [x] Ohne Auswahl nur weitere Shows zeigen; bei „Alle Shows“ oder einer aktiven Auswahl vollständige Ergebnisse mit passenden Top-Musicals zuerst ausgeben

## Drittanbieter-Skripte stabilisieren
- [x] TradeDoubler-Link-Converter nur einmal initialisieren, spätere DOM-Änderungen über den sicheren Fallback verarbeiten und Startseite prüfen

## Footer-Kontrast
- [x] Copyright, Informationslinks und „Gemacht mit …“-Text im Footer in weißer Schrift ausgeben und prüfen

## Theaterlicht für aktive Erlebniswelten
- [x] Aktive Erlebniswelt mit einem einmaligen, dezenten Lichtreflex hervorheben und die Bewegungsreduktion berücksichtigen

## Mobile Überlaufkorrektur für Theaterlicht
- [x] Theaterlicht lokal am Erlebniswelt-Button verankern und horizontalen Mobile-Überlauf nach Auswahl prüfen

## Sichtbares Theaterlicht nach Hero-Auswahl
- [x] Lichtreflex am sichtbaren aktiven Filterbutton auslösen, sobald der Auswahlkasten nach Hero-Auswahl im Bildschirm ankommt

## Umlaufender Theaterlicht-Rand
- [x] Flächenreflex durch einen einmal umlaufenden Lichtpunkt am Rand des aktiven Erlebniswelt-Buttons ersetzen und auf Mobil prüfen

## Deutlicher umlaufender Lichtpunkt
- [x] Theaterlicht als klar sichtbaren weißen Lichtpunkt mit Goldglühen um den aktiven Erlebniswelt-Button ausführen und mobil prüfen

## Flache Länder- und Ortsfilter
- [x] Länder- und Ortsfilter ohne transparente Farbflächen gestalten; Auswahl nur über Kontur und Schrift hervorheben

## Ruhige aktive Erlebniswelt
- [x] Theaterlicht-Animation entfernen und die aktive Erlebniswelt ohne Effekt klar markieren

## Aktive Erlebniswelt als Goldkontur
- [x] Aktive Erlebniswelt testweise ohne Goldfläche, nur mit verstärkter Goldkontur und Goldschrift darstellen

## Ruhigere Goldhierarchie in Startseiten-Teasern
- [x] Top-Musical-Badge und Ticket-CTA in den Teasern reduzieren; Kategorie- und SALE-Badges unverändert beibehalten

## Konsistente Startseiten-Farbpalette
- [x] Startseitenelemente auf die Rollenpalette Anthrazit, Creme, Gold und SALE-Rot abstimmen; keine zusätzliche Akzentfarbe einführen

## Seitenübergreifend konsistente Farbpalette
- [x] Header, Footer, Detail- und Stadtseiten, Consent, Filter und Karten auf die Rollenpalette Anthrazit, Creme, Gold sowie Conversion-Rot für SALE und Tickets angleichen

## Kürzerer Cookie-Hinweis
- [x] Cookie-Banner und Einstellungsdialog kürzer, verständlicher und vertrauensbildend formulieren; Optionen unverändert beibehalten

## Rote obere Mobile-Ticket-CTA
- [x] Obere Detailseiten-Ticket-CTA mit Preisangabe als rote Conversion-CTA an die übrigen Ticketaktionen angleichen

## Dynamische Ticket-CTA-Texte
- [x] Aktive Show-Angebote und Preise zentral in den Ticket-CTA-Texten von Detailseite, Ticketbox, Sticky-CTA und Terminen ausgeben

## Hervorgehobener Ergebnis-Hinweis
- [x] Dynamischen Hinweis zu passenden Show-Tipps als ruhige goldene Ergebniszeile unter dem Einleitungstext hervorheben

## Cremeweiße Ergebniszeile
- [x] Dynamischen Ergebnis-Hinweis in Cremeweiß wie den Fließtext ausgeben; Orientierungspfeil dezent gold belassen

## Redaktionell geschärfte Erlebniswelten
- [x] Texte der fünf Erlebniswelten für Auswahl, Einführung und Empfehlungen emotionaler sowie konkreter formulieren

## Lesbare Empfehlungs-Subline
- [x] Empfehlungseinleitung auf Detailseiten von Grau auf kontrastreiches Cremeweiß umstellen und prüfen

## Einheitliche Stadt-Ticket-CTAs
- [x] Termin- und Stadt-CTAs auf Detailseiten wieder mit „Tickets sichern“ beschriften; Sale nur an zentralen Angebots-CTAs zeigen

## Mobile Ticketlogo-Anordnung
- [x] Partnerlogo auf Detailseiten mobil unter der roten Ticket-CTA ausgeben; Desktop-Anordnung daneben beibehalten

## Zentrierte mobile Ticketlogos
- [x] Partnerlogos unter mobilen Ticket-CTAs in einer eigenen zentrierten Zeile ausrichten

## Ticketlogos wieder neben der CTA
- [x] Partnerlogos auf Mobilgeräten wieder rechts neben den roten Ticket-CTAs anordnen

## Direkter Ergebnisanker ohne Rücksprung
- [x] Runden Übersichts-Rücksprung entfernen und den dynamischen Hinweis als klickbaren Anker zu den passenden Shows gestalten

## Nutzerwege für Such- und Ortsfilter
- [x] Erlebniswelt, Alle Shows, Länderwahl, Ortssuche und Rücksetzen im Browser als Besucherfluss prüfen

## Kontextgerechter Ergebnis-Hinweis
- [x] Ergebnis-Hinweis ohne aktive Auswahl neutral als weitere Shows formulieren; bei „Alle Shows“ und aktiven Filtern eindeutig unterscheiden

## Redaktionelle Prüfung nach Show-Updates
- [x] Verbindliche Prüfschritte für Erlebniswelten und kontextgerechte Ergebnis-Texte nach Änderungen am Musicalkatalog dokumentieren

## Redaktionelle Freigabe-Checkliste
- [x] Kompakte Pflicht-Checkliste für neue oder aktualisierte Musicaleinträge ergänzen und dokumentarisch prüfen

## Monatlicher Katalog- und Preischeck
- [x] Wiederkehrenden Qualitätscheck für aktive Musicals mit Preisen, Aktionen, Ticketpfaden und redaktioneller Konsistenz definieren und einrichten

## Dynamische Erlebniswelt-Headlines
- [x] Ergebnis-Headline je aktiver Erlebniswelt individuell formulieren und die allgemeine Headline ohne Auswahl beibehalten

## Kompakte und größere mobile Erlebniswelt-Buttons
- [x] Längere Hero-Erlebniswelt-Texte auf maximal zwei Begriffe kürzen, „Familie & Märchen“ sowie „Drama & Komödie“ verwenden und die mobilen Buttons lesbarer vergrößern

## Abgrenzender Drama-und-Emotion-Button
- [x] Kurzen Hero-Button „Geschichten“ durch „Drama & Emotion“ ersetzen; ausführliche Kategorie „Besondere Geschichten“ beibehalten

## Präziser Drama-und-Komödie-Button
- [x] Kurzen Hero-Button „Drama & Emotion“ durch „Drama & Komödie“ ersetzen; ausführliche Kategorie unverändert beibehalten

## Passende Drama-Komödie-Headline
- [x] Ergebnis-Headline der Erlebniswelt „Besondere Geschichten“ passend zu Drama und Komödie formulieren

## Ergebniszahl im Markenherz
- [x] Dynamische Ergebniszahl als kleine rote Herz-Kontur mit goldener Zahl in den klickbaren Ergebnisanker integrieren
## Einheitliche Erlebniswelt-Buttonlabels
- [x] Erlebniswelt-Buttons im unteren Filterkasten mit den kompakten Hero-Begriffen synchronisieren; ausführliche Kategorien in Inhaltskontexten beibehalten
## Familie vor Pop, Rock & Film
- [x] Erlebniswelt „Familie & Märchen“ vor „Pop, Rock & Film“ in Hero- und Filter-Navigation auf Desktop und Mobil sortieren

## Ergebniszahl im ungefüllten Logoherz
- [x] Ergebniszahl in einem vergrößerten, ungefüllten roten Logoherz mit weißer Zahl darstellen

## Goldene Ergebniszahl im Fließtext
- [x] Herzsymbol aus dem Ergebnisanker entfernen und die dynamische Zahl responsiv inline in Gold hervorheben

## Natürlicher Umbruch des Ergebnisankers
- [x] Ergebnisanker als zusammenhängenden Textfluss mit festem Pfeil links gestalten, damit Mobilumbrüche natürlich erfolgen

## Beschriftungsfreie Erlebnis-Buttons
- [x] Zusatzüberschriften zu den Erlebnis-Buttons im Hero und Filterkasten entfernen; Buttonauswahl kompakt beibehalten

## Preis- und Kampagnenupdate September
- [x] Website-Export des Google Sheets prüfen und den MJ-Preis über die zentrale Preisquelle bestätigen
- [x] Neue native MJ-, Fack-Ju-Göhte- und Wir-sind-am-Leben-Creatives dimensionsgerecht und consent-konform einbinden
- [x] Wir sind am Leben bis einschließlich 30.09.2026 mit „2 FÜR 1“ kennzeichnen – öffentlicher Website-Export mit `Sale aktiv=Ja`, `Sale-Text=2 FÜR 1` und `Gültig bis=30.09.2026` abgeglichen und in Vorschau sichtbar bestätigt
- [x] We Will Rock You aus dem aktiven Katalog entfernen und öffentliche Seiten als NotFound prüfen

## Robuster deutscher Preis-CSV-Import
- [x] Unquoted deutsche Dezimalpreise aus dem Google-Website-Export serverseitig sicher rekonstruieren und MJ- sowie Sale-Zeilen validieren

## Live-Sheet-Synchronisierung
- [x] Google-Sheets-Preis- und Sale-Adapter als Cloudflare-Pages-Funktion für die öffentliche Domain bereitstellen – browser- und edge-cache-sicher mit maximal 60 Sekunden Website-Cache
- [x] Fack Ju Göhte, Wir sind am Leben und weitere aktuelle Preise/Sales auf der öffentlichen Domain abgleichen – FJG ohne 30-%-Sale, WSAL mit 2 FÜR 1 bis 30.09., MJ 56,99 € bestätigt

## Erweiterte Sheet-Pflege
- [x] Ticketlink-Spalte aus Google Sheets bewusst vollständig ignorieren; CTA-, Stadt-, Banner- und Trackinglinks ausschließlich kontrolliert im Portal pflegen
- [x] Preis- und Sale-Änderungen binnen einer Minute auf Website-Ebene automatisch abrufen
- [x] Regelmäßigen Katalogcheck um bevorstehende und abgelaufene Sale-Zeiträume ergänzen
- [x] Vollständigen Sheet- und Live-Abgleich dokumentieren – 22 von 22 Website-Export-Zeilen stimmen mit der Produktion überein

## Einheitliche Kategorie-Bezeichnungen
- [x] Kurzlabels aus Hero und Filter auch in Teaser- und Detailseiten-Badges verwenden – insbesondere „Drama & Komödie“ statt „Besondere Geschichten“

## Startseiten-SEO
- [x] Google-Snippet der Startseite auf „Musicals 2026/2027: Shows, Termine & Tickets“ sowie einen nutzenorientierten Beschreibungstext mit Terminen, Spielorten und Tickets umstellen

## Google-Bild- und Crawling-Signale
- [x] Startseitenbild für Google und Social Media auf das repräsentative König-der-Löwen-Motiv mit Rafiki ausrichten; Bild-Metadaten, primäres Seitenbild und große Bildvorschau ergänzen
- [x] We Will Rock You nach Saisonende aus der öffentlichen Sitemap entfernen und gegen Rückkehr absichern

## Organisches Wachstum und Affiliate-Qualität
- [x] Stadtseiten mit eindeutigen Titeln, Beschreibungen, CollectionPage-Daten und aktuellen Sitemap-Signalen ausstatten
- [x] Stadt- und Musicalseiten beim ersten HTTP-Abruf mit statischen Canonicals, Metadaten, Social-Informationen und JSON-LD ausliefern
- [~] Extern abhängig: Google-Search-Console-Daten nach Suchpotenzial, CTR, Indexierungsfehlern und Chancen für zwei Pilot-Städte auswerten; erst fortsetzen, wenn ein autorisierter lesender Search-Console-Zugriff bereitsteht.
- [x] Hamburg und Berlin als redaktionell eigenständige Musical-Hubs ausbauen – mit Quellen- und Qualitätsfreigabe, Planungsleitfaden, offiziellen Besucherhinweisen und interner Showverlinkung
- [x] Consent-konforme, datensparsame Messung qualifizierter Ticketklicks nach Musical, Partner und CTA-Platzierung einführen
- [~] Extern abhängig: Partnerreporting für validierte Provisionen und Stornos mit periodischen Awin- und TradeDoubler-Exporten aufsetzen; erfordert freigegebene Exportzugänge oder bereitgestellte CSV-Dateien.

## Fack Ju Göhte Back-to-School-Sale
- [x] Google-Sheets-Sale mit `Ja` und `30%` für Fack Ju Göhte live abgleichen
- [x] Schmale AWIN-Campaign `4568827` im zweiten Fließtextabschnitt und quadratische AWIN-Campaign `4568823` nach der Galerie einbinden
- [x] Den gelieferten AWIN-Textlink `4568988` für allgemeine Detailseiten-CTAs bestätigen; stadtbezogene Ticketbuttons unverändert belassen

## SEO-Routenauslieferung
- [x] Kanonische Stadt- und Musicalrouten als echte HTML-Dokumente mit `text/html` ausliefern; Cloudflare-Rewrites auf die statischen `index.html`-Dateien und lokale Serverprüfung ergänzen

## Direkte Performance-Optimierung
- [x] Nicht für die Startseite benötigte Stadt-, Musical-, Recht- und Verwaltungsseiten per Lazy Loading aus dem initialen JavaScript auslagern; Start-Bundle von rund 1,50 MB auf rund 1,15 MB reduzieren

## Saisonbereinigung Stuttgart
- [x] Veraltete We-Will-Rock-You-Nennung aus Stadtbeschreibung und öffentlicher Preisantwort entfernt; aktiven 7-Show-Katalog geprüft

## Startseiten-Snippet
- [x] Google-, Open-Graph-, Twitter- und Schema.org-Beschreibung der Startseite auf „Die besten Musicals & Shows: Termine, Städte, Spielpläne und Tickets für König der Löwen, Moulin Rouge, Starlight Express, Phantom der Oper, Eiskönigin, Mamma Mia! und mehr.“ vereinheitlichen

## TINA – Das Tina Turner Musical
- [x] TINA als aktive Hamburg-Produktion ab April 2027 mit bestätigtem Einstiegspreis, Stage-Textlink, Trailer, Quellenbasis und Bildcredit anlegen
- [x] Native TINA-Creatives consent-konform einbinden: 728×90 (Campaign 26204070) im oberen Fließtext und 300×250 (Campaign 26204068) nach der Galerie
- [x] TINA-URL in statischer und dynamischer Sitemap aufnehmen sowie die wiederverwendbare Material-Checkliste für neue Shows ergänzen

## DRACULA – Das Musical
- [x] Native Eventim/Awin-Creatives eingebunden: 728×90 (Campaign 3889113) im oberen Fließtext und 300×250 (Campaign 3889111) nach der Galerie; Click-URLs direkt, Impressionen nur nach Affiliate-Consent

## Detailseiten-Medienreihenfolge
- [x] Quadratische Keyvisuals auf Desktop wieder links neben dem Beschreibungstext anzeigen
- [x] Trailer auf Desktop wieder nach dem oberen Beschreibungsteil und vor Spielorten platzieren
- [x] Mobile Trailer wieder nach dem definierten ersten Fließtextabsatz anzeigen; Keyvisuals bleiben danach im etablierten Absatzfluss
- [x] TINA-Keyvisual auf das gelieferte quadratische Originalmotiv umstellen
- [x] Fragile Keyvisual-Einblendanimation entfernt, damit alle Detailseiten bei einem harten Reload wieder zuverlässig ihre Medienreihenfolge behalten
- [x] TINA-Keyvisual auf die aktuell gelieferte Originaldatei aktualisiert und die mobile Position nach der Einleitungsüberschrift per Regression abgesichert
- [x] TINA-Keyvisual als browserkompatibles WebP (1024 × 1024) ausliefern, um mobile AVIF-Ausfälle auszuschließen

## KDL – 25-Jahre-Angebot
- [x] Stage-Creatives der Kampagnen 26180470 (728 × 90) und 26180460 (300 × 250) auf das aktuelle Angebot „Jedes zweite Ticket ab 25 €“ aktualisieren
- [x] Editorial-Fallback auf „2. TICKET AB 25 €“ aktualisieren; Google Sheet bleibt für den Live-Sale maßgeblich
- [x] Privaten Website-Export geprüft: KDL-Sale steht bereits korrekt auf „2. TICKET AB 25 €“
- [~] Extern abhängig: TINA-Preis im privaten Google Sheet anlegen; die Preisquelle bleibt ausschließlich vom Projektinhaber bearbeitbar.

## Stage-Angebotsupdate
- [x] Tarzan-Creatives der Kampagnen 26185546 (728 × 90) und 26185544 (300 × 250) nativ einbinden; Querformat im oberen Fließtext, Quadrat nach der Galerie
- [x] ZURÜCK IN DIE ZUKUNFT-Creatives der Kampagnen 26185502 (728 × 90) und 26185500 (300 × 250) nativ einbinden; Querformat im oberen Fließtext, Quadrat nach der Galerie
- [x] Eiskönigin-Creatives der Kampagnen 26185658 (729 × 90) und 26185656 (300 × 250) aktualisieren
- [x] Editorial-Fallbacks auf Tarzan „BIS 40 %“ und Eiskönigin „BIS 15 %“ aktualisieren
- [~] Extern abhängig: Tarzan-Sale im privaten Google Sheet von „BIS 15 % / Familien-Tickets“ auf „BIS 40 %“ ändern; die Preisquelle bleibt ausschließlich vom Projektinhaber bearbeitbar.

## Bannerrunde September 2026 – Abschluss
- [x] Keyvisual-Ausfall nach Desktop-Refresh behoben: Einblendanimation entfernt, etablierte Desktop-/Mobilreihenfolge gesichert
- [x] Salon Rosie: Stage 728 × 90 (26185722) im oberen Fließtext und 300 × 250 (26185720) nach Galerie
- [x] Tanz der Vampire: Stage 728 × 90 (26185674) im oberen Fließtext und 300 × 250 (26185672) nach Galerie; alte untere Sonderanzeige ersetzt
- [x] & Julia: Stage 728 × 90 (26185666) aktualisiert und 300 × 250 (26185664) nach Galerie ergänzt
- [x] Der Teufel trägt Prada: Stage 728 × 90 (26185640) und 300 × 250 (26185638) aktualisiert
- [x] Die Eiskönigin: Stage 729 × 90 (26185658) und 300 × 250 (26185656) aktualisiert
- [x] Drei Haselnüsse für Aschenbrödel: Eventim/AWIN 728 × 90 (3980776) und 300 × 250 (3980773) integriert
- [x] Disney Der Glöckner von Notre-Dame: ATG/AWIN 728 × 90 (4882557) und 300 × 250 (4882583) integriert
- [x] Das Phantom der Oper: ATG/AWIN 728 × 90 (4804894) und Original-Hochformat (4804889, 320 × 480) integriert

## Redaktionelle Bannerplatzierung
- [x] Querbanner künftig je Detailseite im natürlichen oberen Lesefluss nach einem thematisch abgeschlossenen, conversion-starken Abschnitt platzieren – nie reflexartig direkt unter Headline oder Keyvisual
- [x] Eiskönigin-Querbanner 26185658 hinter dem vollständigen Abschnitt „Spektakel für alle Sinne“ platziert; das 300 × 250-Format bleibt nach der Galerie
- [x] Große Formate grundsätzlich nach der Galerie und vor „Alles, was du wissen musst“ belassen, sofern keine begründete kampagnenspezifische Ausnahme vorliegt
- [x] Mobile Placement-Prüfung für alle aktuellen Querbanner durchgeführt: Salon Rosie, TINA, Drei Haselnüsse, Glöckner, Phantom und Dracula bereits sinnvoll im Lesefluss belassen
- [x] Querbanner im mobilen Lesefluss hinter vollständige Textabschnitte verschoben: Der Teufel trägt Prada, König der Löwen, MJ, Zurück in die Zukunft, Tarzan (nach „Oscar-prämierte Musik von Phil Collins“), Tanz der Vampire, Wir sind am Leben, & Julia und Fack Ju Göhte

## Neue Awin-/ATG-Banner September 2026
- [x] Moulin Rouge: ATG/AWIN 728 × 90 (4782564) nach dem Theater-Abschnitt und Original-600 × 600 (4782560) nach der Galerie eingebunden; alte unplatzierte TradeDoubler-Anzeige entfernt
- [x] Starlight Express: ATG/AWIN 728 × 90 (4785482) nach dem Rollschuh-Action-Abschnitt und Original-Hochformat 320 × 480 (4785481) nach der Galerie eingebunden; alte unplatzierte TradeDoubler-Anzeige entfernt
- [x] Die Schöne und das Biest: Eventim/AWIN 728 × 90 (3736769) nach dem Familienabschnitt und 300 × 250 (3736775) nach der Galerie eingebunden
- [x] Rapunzel: Eventim/AWIN 728 × 90 (4573325) nach dem Märchen- und Musikabschnitt und 300 × 250 (4573313) nach der Galerie eingebunden
- [x] Alle acht gelieferten Creatives im CDN gehostet, in Originalmaßen geprüft und so angebunden, dass Impressionen ausschließlich nach Affiliate-Einwilligung geladen werden
- [x] Awin-/ATG-Creatives ohne Lazy Loading und mit synchronem Bilddecodieren rendern, damit sie auch auf langen mobilen Detailseiten zuverlässig sichtbar bleiben
- [x] Kompletter Sicht- und Asset-Abgleich auf Mobil und Desktop für TINA, Moulin Rouge, Starlight Express, Rapunzel sowie Die Schöne und das Biest; alle neun aktualisierten Bilddateien liefern HTTP 200
- [x] Tatsächlichen mobilen Bildfehler behoben: Projektinterne `/manus-storage`-Pfade lieferten im Seiten-DOM natürliche Bildmaße 0 × 0; TINA-Keyvisual und alle neuen Awin-/ATG-Creatives sind deshalb auf direkt ladbare CDN-URLs umgestellt und anschließend in mobilen sowie Desktop-Screenshots verifiziert

## Rapunzel-Artworks September 2026
- [x] Neues Querformat als unbeschnittenes Headerbild der Detailseite eingebunden
- [x] Neues quadratisches Originalmotiv für Karten, Desktop-Keyvisual links und das mobile Keyvisual im Fließtext eingebunden

## Mobile Navigation und Lesefluss September 2026
- [x] Erlebniswelt-Buttons auf Mobil an die Orientierung „Musicals & Shows“ und „Städte“ angeglichen: gleiche 40-Pixel-Höhe, horizontale Polsterung, weiße Kontur und Schrift, Schriftgewicht, Laufweite und Interaktionsstil; aktive Auswahl bleibt Gold
- [x] Mobile Querbanner im Fließtext direkt an den vorangehenden, inhaltlich abgeschlossenen Absatz angebunden; auf Desktop bleibt der großzügigere Lesefluss bestehen und große Formate nach der Galerie behalten ihren Abstand

## Stage-Textlinks September 2026
- [x] Gelieferte Stage-Textlinks als direkte, sichere `click`-URLs ohne Ausführung der bereitgestellten `document.write`-Skripte für König der Löwen, MJ, Zurück in die Zukunft, TINA, & Julia, Tarzan, Der Teufel trägt Prada, Eiskönigin, Tanz der Vampire, Wir sind am Leben und Salon Rosie hinterlegt
- [x] Je Show alle Ticketpfade vereinheitlicht: Haupt-CTA, Hero-CTA, Sticky-CTA, Angebotskasten, Keyvisual und zugehöriger Terminbutton verwenden jeweils dieselbe gelieferte Tracking-Kampagne
- [x] Jedes aktive Detailseiten-Keyvisual als klickbaren, neuen Tab öffnenden Ticket-Deeplink abgesichert; Regression verlangt für alle 20 aktiven Shows ein Keyvisual mit HTTPS-Partnerlink
- [x] Neue Stage-Shop-Deeplinks für alle 11 gelieferten Shows übernommen: Die bisherigen allgemeinen Stage-Ziele wurden durch die aktuellen TradeDoubler-`click`-Kampagnen ersetzt; jede neue Ziel-URL liefert HTTP 200
- [x] Stage-Linkstrategie getrennt: Keyvisuals der 11 Stage-Shows führen über die zuvor gelieferten TradeDoubler-Links auf die jeweilige offizielle Show-Landingpage; Ticket-, Angebots- und Sticky-CTAs sowie Terminbuttons behalten die neuen direkten Shop-Deeplinks. Beide Linksets liefern HTTP 200.

## Manus-Vorschau und Partnertracking September 2026
- [x] Wiederkehrende, nicht zuordenbare Manus-Meldung „Script error.“ auf globale Partner-Fremdskripte eingegrenzt; der Awin-MasterTag und fremde document.write-Werbemittelsnippets bleiben entfernt
- [x] Direkte Affiliate-Click-URLs und native, einwilligungsbasierte Impressionpixel bleiben erhalten; der TradeDoubler Link Converter wurde nach seiner zwischenzeitlichen Entfernung wiederhergestellt und ergänzt ausschließlich rohe Stage-Ziele

## Erlebniswelten-Kontrast September 2026
- [x] Erlebniswelt-Buttons sowie die mobilen Hero-Orientierungen „Musicals & Shows“ und „Städte“ auf reinen weißen Rahmen und weiße Schrift ohne Hintergrundfüllung umgestellt; die aktive Erlebniswelt bleibt zur klaren Zustandsanzeige Gold
- [x] Inaktive Länderbuttons „Deutschland“, „Österreich“ und „Schweiz“ an dieselbe weiße Kontrastvariante angepasst; die aktive Länderauswahl bleibt Gold

## Mobiler Hero-Viewport September 2026
- [x] Headerfließtext auf Mobil mit engerer Zeilenhöhe und reduzierten Abständen verdichtet; Überschrift, Statistikzeile und Erlebniswelt-Navigation sind enger gruppiert, damit alle fünf Erlebniswelt-Buttons nach der Cookie-Auswahl bei kleiner iPhone-Browserhöhe ohne Scrollen sichtbar bleiben

## Erlebniswelt-Navigation September 2026
- [x] Den Städte-Button aus der Erlebniswelt entfernt: Der Hero führt nun klar zur Musical-Auswahl, während die Städtenavigation weiterhin über Header und Stadtbereich erreichbar bleibt
- [x] Den Hero-Einstieg in „Alle Musicals & Shows“ präzisiert: Das macht den Gesamtüberblick gegenüber den thematischen Erlebniswelten eindeutig, ohne die bewährte Begriffslogik von Header, SEO und Katalog zu verändern
- [x] Den Filter-Gesamtbutton auf „Alle Musicals & Shows“ vereinheitlicht: Hero und Filter verwenden nun für die vollständige Übersicht dieselbe klare Bezeichnung

## Bildnachweise September 2026
- [x] Impressum gegen alle 20 aktiven Musical-Produktionen geprüft und um den fehlenden TINA-Bildnachweis ergänzt
- [x] Neue Rapunzel-Header- und Keyvisual-Artworks ausdrücklich den Bildnachweisen von ShowSlot Touring GmbH zugeordnet
- [x] Regression ergänzt: Jeder künftige aktive Musicaleintrag benötigt einen zugeordneten Bildnachweis im Impressum

## Affiliate-Attribution und Produktionsaudit September 2026
- [x] Produktionsdomain, aktuelle GitHub-Revision und Cloudflare-Pages-Deployment abgeglichen: `welovemusicals.com` läuft auf GitHub-Commit `49ad43c8`; Cloudflare meldet erfolgreichen Produktionsdeploy.
- [x] Produktionszugriffe der letzten Woche per Cloudflare geprüft: kein Traffic-Einbruch (täglich 158–243 eindeutige Besucher vom 19.–25.09.; Werte enthalten Edge-/Bot-Traffic und sind keine Buchungskennzahl).
- [x] Cookie-Einwilligung technisch abgegrenzt: Ticket-CTAs und Keyvisuals nutzen ihre direkten Affiliate-Click-URLs unabhängig von `affiliateTracking`; ausschließlich Banner-Impressions bleiben einwilligungsbasiert.
- [x] Referrer-Unterdrückung an Affiliate-CTAs, Keyvisuals, Tourterminen und Kampagnenbannern entfernt. `noopener` bleibt als Sicherheitsmaßnahme erhalten; Standardlinks tragen zusätzlich `sponsored`, damit Stage/TradeDoubler, Awin und ATG die Herkunftsseite erhalten.
- [x] Stage-Impressionendpoint separat geprüft: Server liefert einen 302 auf das Creative; der Audit-Browser blockt den Bildpixel. Das betrifft Impressions, nicht die direkten Buchungslinks; externe Tracking-Blocker können die Pixelzählung verhindern.
- [x] Starken Impressionrückgang auf die produktive Umstellung vom 24.09. zurückgeführt: Pixel warteten zuvor auf Scroll-Sichtbarkeit. Sie laden nun nach Affiliate-Einwilligung für das tatsächlich gerenderte Responsive-Banner sofort, ohne verdeckte Desktop-/Mobil-Duplikate mitzuzählen.
- [~] Extern abhängig: TradeDoubler-Klick- und Salesreport im Publisher-Backend abgleichen; ohne autorisierten TradeDoubler-Zugang nicht automatisiert prüfbar. Bei Bedarf einen Export bereitstellen.
- [x] Umami-Aufgabe durch Microsoft Clarity ersetzt: Clarity ist nach Statistik-Einwilligung integriert und erlaubt eine eigenständige, datenschutzkonforme Klickanalyse; ein Umami-Skript wird nicht mehr benötigt.

## TradeDoubler Link Converter – Wiederherstellung September 2026
- [x] Den am 24.09. eigeninitiativ entfernten TradeDoubler Link Converter wiederhergestellt. Er startet ausschließlich nach Affiliate-Einwilligung und nur außerhalb von Impressum/Datenschutz.
- [x] Converter-Initialisierung an das in der TradeDoubler-Oberfläche für „We Love Musicals – 3492604“ bereitgestellte Muster angeglichen: offizielles `tdlc-jssdk`-Skript plus `tdlcAsyncInit` → `TDLinkConverter.init({})`.
- [x] Direkte bereitgestellte `visit.stage-entertainment.de/click`-Ziele bleiben unverändert; nur noch rohe `stage-entertainment.de`-Links werden vom Converter bzw. lokalen Fallback ergänzt und nie doppelt umgewandelt.
- [x] Awin MasterTag bleibt entfernt; fremde `document.write`-Werbemittelsnippets werden weiterhin nicht ausgeführt.
- [x] Datenschutzhinweis und Regressionen an die zustimmungsbasierte Converter-Nutzung angepasst.
- [x] Umsatzauswirkende Trackingänderungen benötigen künftig vor Umsetzung eine ausdrückliche Freigabe des Projektinhabers; die verbindliche Projektanweisung liegt in `AGENTS.md`.

## Kanonische SEO-Routen September 2026
- [x] Öffentliche XML-Sitemap wird nun bei jedem Build aus dem aktiven Katalog erzeugt und enthält ausschließlich 20 kanonische Musical-URLs
- [x] Stale Sitemap-Einträge und Soft-404-Quellen bereinigt: frühere Eiskönigin-, MJ-, Tarzan-, Prada- und ZIZ-Aliasse erhalten 301 auf die jeweilige kanonische Seite; Sister Act und We Will Rock You erhalten 410
- [x] Entwicklungs- und Produktions-Sitemap teilen denselben Katalog; Regressionen sichern aktive kanonische URLs, Redirects und entfernte Shows

## Tarzan-Textlinks Oktober 2026
- [x] Auf ausdrückliche Freigabe führen alle Tarzan-Text- und Ticketpfade einschließlich Hamburg-Termin über die getrackte Stage-Produktseite `g=26149406`; das Keyvisual verwendete diese Produktseite bereits. Der Shop-Deeplink `g=26149408` ist für Tarzan nicht mehr im aktiven Katalog verknüpft.

## König der Löwen – Creatives und Produktseitenlinks Oktober 2026
- [x] Neue native KDL-Creatives für Campaign `26180470` (728 × 90) und `26180460` (300 × 250) als unveränderte Originalformate ins CDN übernommen; Positionen bleiben im oberen Fließtext beziehungsweise nach der Galerie.
- [x] Auf ausdrückliche Freigabe führen KDL-Text- und Ticketpfade einschließlich Hamburg-Termin über die getrackte Stage-Produktseite `g=26149398`; der Shop-Deeplink `g=26149400` ist für KDL nicht mehr im aktiven Katalog verknüpft.

## MJ – Produktseitenlink Oktober 2026
- [x] Gelieferten Code geprüft: Die doppelte Angabe beschreibt unverändert das quadratische 300 × 250-Creative `26180466`; das bereits aktive 728 × 90-Creative `26180462` bleibt unverändert. Native Creatives, Kampagnenklicks und consent-gesteuerte Impressionen bleiben unverändert.
- [x] Auf ausdrückliche Freigabe führen MJ-Keyvisual, sämtliche Text-/Ticket-CTAs und der Hamburg-Termin über die getrackte Stage-Produktseite `g=26149402`; der frühere MJ-Shop-Deeplink `g=26149404` ist im aktiven Katalog nicht mehr verknüpft.

## ZIZ – Produktseitenlink Oktober 2026
- [x] Gelieferte Banner-Kennungen geprüft: 728 × 90 nutzt unverändert `26185502`, 300 × 250 unverändert `26185500`; beide nativen Creatives und ihre consent-gesteuerten Impressionpfade bleiben unverändert.
- [x] Auf ausdrückliche Freigabe führen ZIZ-Keyvisual, alle Text-/Ticket-CTAs und der Hamburg-Termin über die getrackte Stage-Produktseite `g=26149410`; der frühere ZIZ-Shop-Deeplink `g=26149412` ist im aktiven Katalog nicht mehr verknüpft.

## Tanz der Vampire – Produktseitenlink Oktober 2026
- [x] Gelieferte Banner-Kennungen geprüft: 728 × 90 nutzt unverändert `26185674`, 300 × 250 unverändert `26185672`; beide nativen Creatives und ihre consent-gesteuerten Impressionpfade bleiben unverändert.
- [x] Auf ausdrückliche Freigabe führen Tanz-der-Vampire-Keyvisual, alle Text-/Ticket-CTAs und der Stuttgart-Termin über die getrackte Stage-Produktseite `g=26149426`; der frühere TDV-Shop-Deeplink `g=26149428` ist im aktiven Katalog nicht mehr verknüpft.

## & JULIA, Salon Rosie und Eiskönigin – Produktseitenlinks Oktober 2026
- [x] Gelieferte Banner-Kennungen geprüft und unverändert belassen: & JULIA `26185666` / `26185664`, Salon Rosie `26185722` / `26185720`, Eiskönigin `26185658` / `26185656`. Native Creatives, Kampagnenklicks und consent-gesteuerte Impressionen bleiben unverändert.
- [x] Auf ausdrückliche Freigabe führen Keyvisual, alle Text-/Ticket-CTAs sowie die Stuttgart-/Berlin-/Hamburg-Termine über die Stage-Produktseiten: & JULIA `g=26149394`, Salon Rosie `g=26149438`, Eiskönigin `g=26149418`. Die bisherigen Shop-Deeplinks `g=26149396`, `g=26149440` und `g=26149420` sind im aktiven Katalog nicht mehr verknüpft.
- [x] Salon Rosies Preis ist in der veröffentlichten Google-Sheets-Preisquelle mit `65,99 €` hinterlegt; Ticketlink-Spalten bleiben für die Website ignoriert.

## Wir sind am Leben – Creatives, Produktseite und Preis Oktober 2026
- [x] Neue Original-Creatives gesichert und als öffentliche CDN-Dateien eingebunden: 728 × 90 für Campaign `26185700` sowie 300 × 250 für Campaign `26185698`. Platzierungen bleiben bewusst nach abgeschlossenem Textabschnitt beziehungsweise nach der Galerie. Keine externen Werbe- oder `document.write`-Skripte werden ausgeführt.
- [x] Auf ausdrückliche Freigabe führen WSAL-Keyvisual, alle Text-/Ticket-CTAs und der Berlin-Termin über die getrackte Stage-Produktseite `g=26149434`; der frühere Shop-Deeplink `g=26149436` ist im aktiven Katalog nicht mehr verknüpft. Banner-Klickziele, Impressionen und Affiliate-Consent bleiben unverändert.
- [x] Google Sheets liefert für WSAL `29,99 €`, `Sale aktiv: Nein` und keine Sale-Texte. Die lokale Preis-API bestätigt die Deaktivierung der Rabattaktion.

## Microsoft Clarity – Oktober 2026
- [x] Projektkennung `yrei35xhu5` vom Projektinhaber erhalten und ausschließlich in die Produktionseinbindung aufgenommen.
- [x] Clarity wird nur nach Statistik-Einwilligung auf `welovemusicals.com` geladen; `consentv2` meldet `analytics_storage: granted` und dauerhaft `ad_storage: denied`. Vorschau, lokale Entwicklung und „Nur notwendige“ bleiben vollständig Clarity-frei.
- [x] Widerruf löscht Clarity-Cookies vor dem vorhandenen Consent-Reload. Partner-/Affiliate-Tracking, Deeplinks, Impressionen und deren Zustimmung bleiben unverändert.

## Search Console – Soft-404-Bereinigung Oktober 2026
- [x] Gleichwertige frühere Musical-Slugs werden per 301 mit Pfad- und Query-Erhalt auf die aktuelle kanonische Detailseite geleitet: `mj-michael-jackson`, `and-julia`, `drei-haselnuesse`, `zurueck-in-die-zukunft` und `der-teufel-traegt-prada`.
- [x] Für endgültig entfallene Shows liefert die Cloudflare-Funktion jetzt explizit HTTP 410 statt des bisherigen Startseiten-HTML mit HTTP 200: Aladin, Bibi & Tina, Da Vinci Code, Die Amme, Dschungelbuch, Elisabeth, Fitzek Einladung, Greatest Show, Hans Zimmer, Harry Potter, Kinky Boots, Mrs. Doubtfire, Pretty Woman, Romeo & Julia, Schneekönigin und Weihnachtsbäckerei.
- [x] Bereits korrekte Regeln bleiben bewusst bestehen: `tarzan`, `eiskoenigin`, `teufel-traegt-prada`, `ziz` und `mj-musical` führen auf ihre aktuellen Seiten; das beendete `we-will-rock-you` bleibt 410. Die aktive Detailseite `wir-sind-am-leben` bleibt unverändert erreichbar.

## Search Console – Gecrawlt, zurzeit nicht indexiert Oktober 2026
- [x] `phantom-der-oper-trinity` wird als historischer Platzhalter per 301 auf die aktuelle, kanonische Detailseite `phantom-der-oper` geleitet.
- [x] Die endgültig entfernten früheren Shows `cher-show` und `grease` liefern jetzt HTTP 410 statt einer indexierbaren Startseitenantwort.
- [x] Der frühere technische Pfad `/umami` liefert jetzt HTTP 404 mit `X-Robots-Tag: noindex`. Er fällt nicht mehr auf die SPA-Startseite zurück und wird nicht mehr als weich-fehlerhafte Inhaltsseite gecrawlt. Die heutige Statistikmessung nutzt Microsoft Clarity nach Einwilligung; ein selbstgehostetes Umami-Script ist nicht konfiguriert.

## Interne Linkintegrität – Oktober 2026
- [x] Die gesamte öffentliche Navigation geprüft: Startseitenkarten, Suche, Header, Hero, Footer, Detailseiten-Empfehlungen, Stadtseiten, strukturierte Daten, Sitemap und alle statisch gerenderten HTML-Seiten erzeugen Musicalziele ausschließlich aus dem aktiven Katalog.
- [x] Kein interner Link verweist auf einen der 301- oder 410-Slugs. Der Build-Audit hat 194 interne Musicallinks über 20 kanonische Ziele geprüft; Ergebnis: 0 Ziele über Weiterleitung oder Gone-Status.
- [x] Dauerhafte Regression ergänzt: Katalog-/Stadt-/Empfehlungslisten und Hero-Navigation dürfen keine inaktive, umgeleitete oder entfernte Musicalseite ausgeben. Die statische SEO-Buildprüfung prüft alle erzeugten HTML-Dateien ebenfalls gegen die zentrale 301-/410-Liste.

## Lighthouse- und technischer SEO-Audit Oktober 2026
- [x] Öffentliche Produktionsseiten mit Lighthouse geprüft: Startseite Desktop 91/91/100/100, KDL mobil 72/87/100/100, Hamburg mobil 68/90/100/100 (Performance/Accessibility/Best Practices/SEO). CLS liegt in allen bewertbaren Läufen bei 0; Third-Party-Code blockierte den Main Thread nicht.
- [x] 44 Sitemap-URLs im Live-Crawl geprüft: alle HTTP 200 und mit Meta-Description. Befund bei Impressum/Datenschutz behoben: eigene statische SEO-Dokumente mit korrektem Canonical, H1 und Schema werden über Cloudflare-Pages-Funktionen ausgeliefert.
- [x] Mobile Zoom-Sperre (`maximum-scale=1`) entfernt und gegen Wiedereinführung getestet.
- [x] Größter verbleibender Hebel dokumentiert: responsive, komprimierte Bildvarianten für Karten und Stadtseiten; erst danach Bundle-/DOM-Optimierungen priorisieren. Affiliate-Tracking, Deeplinks, Consent und Impressionen wurden nicht geändert.

## Affiliate-Integritätsgate – Oktober 2026
- [x] Neuer Befehl `pnpm run test:affiliate-integrity`: prüft alle aktiven Ticket-/Keyvisual-/Terminziele gegen die direkten Stage-Click-Parameter (`p=394206`, `a=3492604`, `g=`) und Awin-Publisherkennung (`2865727`), verhindert doppelt konvertierte Stage-URLs und unterdrückte Referrer.
- [x] Prüft die sichtbaren Desktop-/Mobile-CTA-, Keyvisual- und Terminpfade gegen eine Koppelung an `affiliateTracking`; sie bleiben damit ohne Einwilligung erreichbar.
- [x] Prüft, dass Converter und sämtliche Banner-Impressionen nur bei `affiliateTracking` aktiviert werden und keine fremden `document.write`-Werbemittel ausgeführt werden.
- [x] Der Gate ist der erste Schritt von `pnpm build`; ein Cloudflare-Deployment wird bei einer Abweichung vor dem Produktionsbundle abgebrochen. Aktueller Lauf: 77 direkte Stage-Links, 220 direkte Awin-Links und 14 weitere Partnerziele erfolgreich geprüft.

## Sicherer Affiliate-Link-Fallback – Oktober 2026
- [x] Lokaler Link-Wächter ergänzt: prüft vor dem Rendern oder Öffnen HTTPS, Partnerdomain und die erforderlichen Stage-, TradeDoubler- und Awin-Parameter. Er ruft keine Partnerendpunkte automatisch auf und erzeugt damit keine künstlichen Klicks, Pixel oder Drittanbieterprotokolle.
- [x] Bei einer ungültigen oder manipulierten URL wird ausschließlich für diesen Klick temporär eine sichere, offizielle HTTPS-Anbieterseite verwendet – bevorzugt ein bereits valider, show-spezifischer Primärlink; sonst die passende Stage-, ATG-, Eventim-, oeticket-, Ticketcorner- oder Deutsches-Theater-Startseite.
- [x] Abgesichert für Ticket-CTAs (Desktop/Mobil/Sticky), Keyvisuals, Tourtermine und alle nativen Stage-, TradeDoubler-, Awin- und Eventim-Kampagnenbuttons. Korrekte Direktlinks bleiben bytegleich erhalten.

## First-Party-Logging für Affiliate-Link-Fallbacks – Oktober 2026
- [x] Bei einem tatsächlich aktivierten sicheren Fallback meldet das Frontend einmalig pro Browserseite einen technischen Minimaldatensatz an eine eigene Cloudflare-Pages-Route. In Vorschau, lokaler Entwicklung und bei korrekten Links erfolgt kein Request.
- [x] Der Datensatz enthält ausschließlich Fehlergrund, Musicalkennung, CTA-Platzierung und Partnerkategorie. Ursprungs- und Fallback-URL, Query-Parameter, Cookies, Consent-Status, Besucher-/Gerätekennungen, Buchungsdaten und Affiliate-Pixel sind ausgeschlossen; Requests senden keine Browser-Credentials.
- [x] Die Route akzeptiert nur Same-Origin-POSTs, exakt die vier erlaubten Felder und höchstens 512 Byte. Sie schreibt den strukturierten technischen Warnhinweis `affiliate_link_fallback` in die Cloudflare-Observability; dies dient ausschließlich späterer Fehleranalyse und verändert weder Links noch Tracking-Consent.
- [x] Datenschutztext und Deployment-Gate erweitert. Alle CTA-, Keyvisual-, Termin- sowie nativen Kampagnenpfade sind mit dem Fallback-Logger verbunden; erfolgreiche Gesamtprüfung: 87 Testdateien / 310 Tests, TypeScript, Produktionsbuild und Diff-Prüfung.

## Geschützte Affiliate-Link-Auswertung – Oktober 2026
- [x] EU-D1-Datenbank `welovemusicals-affiliate-events` angelegt, ohne Replikation und ausschließlich für die vier freigegebenen technischen Fallback-Felder plus Plattformzeitstempel.
- [x] Fallback-Route speichert nur nach erfolgreicher Validierung und Same-Origin-Prüfung; Speicherfehler beeinflussen weder Ticketlink noch Nutzerfluss.
- [x] Geschützte Verwaltungsansicht unter `/verwaltung/affiliate-links` ergänzt: Zeitraum 7/30/90 Tage, Kennzahlen, Partneraufschlüsselung und aggregierte Fehlergruppen – ohne URLs oder personenbezogene Daten.
- [x] Cloudflare Access schützt die Verwaltungsseite und ihre API getrennt, ausschließlich für `guidoi@web.de`; öffentliche Musicalseiten bleiben HTTP 200. Verwaltungsroute ist zusätzlich von Sitemap und Crawlern ausgeschlossen.
- [x] 91 Testdateien / 318 Tests, TypeScript, Build und Affiliate-Integritätsgate erfolgreich; Desktop- und Mobilansicht geprüft.

## CSV-Export der Affiliate-Link-Fallbacks – Oktober 2026
- [x] CSV-Export in der geschützten Auswertung ergänzt; er übernimmt stets den ausgewählten Zeitraum von 7, 30 oder 90 Tagen.
- [x] Die Datei enthält nur Musicalkennung, Partnerkategorie, Platzierung, Fehlergrund, Anzahl und letzten technischen Zeitstempel. URLs, Query-Parameter, Besucher-, Cookie-, Consent- und Buchungsdaten bleiben ausgeschlossen.
- [x] UTF-8 mit BOM und Semikolontrennung für Excel ergänzt; Formelzeichen werden defensiv neutralisiert. Die Antwort ist nicht cachebar und trägt einen eindeutigen Dateinamen.
- [x] Backend, Adminoberfläche und Desktop-/Mobilansicht geprüft; Gesamtsuite, TypeScript, Produktionsbuild, Affiliate-Integritätsgate und Diff-Prüfung erfolgreich.

## Bestätigung nach CSV-Export – Oktober 2026
- [x] Der CSV-Download wird nun aktiv über die geschützte API angefordert; die Erfolgsmeldung erscheint nur nach dem Empfang einer gültigen, nicht leeren CSV-Datei.
- [x] Sonner-Pop-up bestätigt den Download mit Dateinamen. Bei einer fehlenden Berechtigung, einer fehlerhaften Antwort oder einer leeren Datei erscheint stattdessen ein Fehlerhinweis; der Download-Button zeigt währenddessen „CSV wird erstellt …“.
- [x] Erfolgs- und Fehlerpfad unit-getestet; die echte Browserprüfung mit einer kontrollierten CSV-Antwort bestätigt den sichtbaren Erfolgshinweis. Gesamtsuite, TypeScript, Build, Diff-Prüfung und Affiliate-Integritätsgate erfolgreich.

## Suche und Filter in der Affiliate-Link-Auswertung – Oktober 2026
- [x] Lokale Suche für die bereits geladenen, aggregierten Fehlergruppen ergänzt; sie durchsucht Musicalkennung, Netzwerk, Platzierung und Fehlergrund ohne Groß-/Kleinschreibungsabhängigkeit und erkennt deutsche Umlaute (z. B. „König“ für `koenig-der-loewen`).
- [x] Netzwerk-Dropdown sowie Datumsgrenzen „zuletzt erfasst ab/bis“ (UTC) ergänzt. Die Ansicht zeigt transparent, wie viele der geladenen Gruppen den aktuellen Kriterien entsprechen, und bietet „Filter zurücksetzen“.
- [x] Kein zusätzlicher Browser-, Tracking- oder Datenbankabruf: Die Filter laufen ausschließlich im geschützten Browserbereich auf den bereits datensparsam aggregierten D1-Daten. CSV-Export und Affiliatepfade bleiben unverändert.
- [x] Unit- und Browserprüfung für Textsuche, Netzwerk- und Datumsfilter erfolgreich; Gesamtsuite, TypeScript, Produktionsbuild, Diff-Prüfung und Affiliate-Integritätsgate erfolgreich.

## Paginierung der Affiliate-Link-Auswertung – Oktober 2026
- [x] Die Tabelle zeigt bei mehr als zehn gefilterten Fehlergruppen nun zehn Gruppen pro Seite mit Zurück-/Weiter-Navigation, nummerierten Seiten und sichtbarem Bereichszähler.
- [x] Filter- oder Zeitraumwechsel startet zuverlässig wieder auf Seite 1; eine verkleinerte Ergebnismenge begrenzt die aktuelle Seite automatisch. Die Navigation hat eindeutige Labels und `aria-current` für die aktive Seite.
- [x] Paginierung arbeitet ausschließlich auf bereits geladenen, geschützten Aggregaten. Browserprüfung mit 23 Gruppen bestätigt Seite 1 (1–10), Seite 2 (11–20) und die letzte Seite (21–23); Gesamtsuite, TypeScript, Build, Diff-Prüfung und Affiliate-Integritätsgate erfolgreich.

## Schnelleditierung von Affiliate-Zielen – Oktober 2026
- [x] In der geschützten Fehlerübersicht können Ziel-URLs jetzt pro aggregierter Fehlergruppe (Musical, Netzwerk, Platzierung) direkt bearbeitet werden. Der aktuelle Override wird als aktiv markiert; „Katalogziel“ entfernt nur diesen Override und reaktiviert sofort den geprüften Wert aus dem Katalog.
- [x] Die Servervalidierung akzeptiert ausschließlich direkte HTTPS-Partnerlinks mit den vorhandenen Kennungen: Stage `p=394206/a=3492604/g`, TradeDoubler `p=377032/a=3492604/g`, Awin/Eventim/ATG mit Publisher `2865727` sowie passender Merchantkennung. Ungetrackte, fremde, doppelt konvertierte oder Script-URLs werden abgelehnt.
- [x] D1-Tabelle `affiliate_link_target_overrides` in EU angelegt, initial leer. Sie enthält nur Musicalkennung, Netzwerk, Platzierung, Ziel-URL und Änderungszeitpunkt – ohne Besucher-, Consent-, Cookie-, Buchungs- oder Ereignisdaten.
- [x] Öffentliche Seiten laden ausschließlich valide Overrides aus einer getrennten, nicht protokollierenden Konfigurationsroute und prüfen sie vor Verwendung erneut durch das bestehende Sicherheitsnetz. Wenn kein Override verfügbar oder valide ist, bleibt die Katalog-URL aktiv.
- [x] Der schreibende Endpunkt ist mit einer neuen Cloudflare-Access-Anwendung ausschließlich für `guidoi@web.de` geschützt; der anonyme Check liefert 302 zu Cloudflare Access. 100 Testdateien / 340 Tests, TypeScript, Produktionsbuild, Linkintegritätsgate und Diff-Prüfung erfolgreich; UI-Simulation bestätigt Speichern und Wiederherstellen.

## Sicherer Katalogvorschlag für Affiliate-Ziele – Oktober 2026
- [x] Der neue Button „Katalogvorschlag“ befüllt das Ziel-URL-Feld ausschließlich aus einer bereits aktiven, show-spezifischen und lokal validen Katalog-URL derselben Partnerkategorie.
- [x] Für Stage wird beispielsweise der vorhandene getrackte Show-/Ticketpfad mit `p=394206`, `a=3492604` und vorhandener `g`-Kennung übernommen; Awin/Eventim/ATG behalten die vorhandene Publisherkennung `2865727`.
- [x] Es werden keine Partnerseiten abgerufen, keine Klicks oder Impressionen ausgelöst und keine Kampagnen-, Banner- oder Städtekodierungen erfunden. Für Termin- und Kampagnenbannergruppen ohne eindeutiges Katalogziel wird bewusst kein Vorschlag erstellt.
- [x] Nach dem Einfügen ist die URL weiterhin manuell prüf- und editierbar; beim Speichern schützt die bestehende Servervalidierung unverändert. Browserprüfung bestätigt das Einfügen der Tarzan-Stage-URL; 101 Testdateien / 343 Tests, TypeScript, Build, Diff-Prüfung und Affiliate-Integritätsgate erfolgreich.

## Redaktionelle Bildoptimierung und WebP-Standard – Oktober 2026
- [x] 69 aktive redaktionelle JPG-/PNG-Quellen – Karten, Detailhero, Keyvisuals, Galerien und Stadtbilder – ohne Beschnitt als WebP aufbereitet und über das öffentliche CDN eingebunden. Originale bleiben unverändert außerhalb des Projekts unter `/home/ubuntu/webdev-static-assets/editorial-webp-2026-10/` gesichert.
- [x] Gemessene Gesamtgröße von 19,8 MB auf 8,4 MB reduziert (57,5 % Ersparnis). Alle 69 CDN-Dateien liefern HTTP 200 mit `image/webp`; Stichproben von Karte, Keyvisual und Galerie wurden visuell geprüft.
- [x] Bestehende Unsplash-Stadtbilder fordern nun mit `auto=format` ein modernes Browserformat an. Native Affiliate-Banner bleiben bewusst unangetastet, damit die exakt gelieferten Creatives, Formate, Abmessungen und Kampagnenplatzierungen unverändert bleiben.
- [x] Karten, Keyvisuals, Galerie und Hero verwenden asynchrones Bilddecoding; Karten und Keyvisuals erhalten passende `sizes`-Hinweise. 15 repräsentative Seiten mit aktualisierten Assets wurden jeweils als Desktop- und Mobilansicht geprüft.
- [x] Dauerhafter Standard ergänzt: `scripts/prepare-web-image.py` erzeugt neue WebP-Assets rollenbezogen, `pnpm run test:image-standard` sperrt alte Bildformate im aktiven Katalog und läuft automatisch im Produktionsbuild. Vollständige Test-/Typ-/Build-/Diff-Prüfung erfolgreich.

## Drei Haselnüsse für Aschenbrödel – Tour und SEO Oktober 2026
- [x] Detailtexte, SEO-Titel, Meta-Beschreibung, Fakten und FAQs auf Basis der gelieferten Presseinformationen zur Nikolaus- und Rosalie-Tour überarbeitet. Die Seite kommuniziert jetzt nachvollziehbar beide Ensembles, mehr als 70 Städte sowie den bestätigten Zeitraum 15. Oktober 2026 bis 24. Februar 2027.
- [x] Die Tour- und Städteübersicht enthält 85 bestätigte Spieltage in 71 Städten. Ergänzt bzw. korrigiert sind unter anderem Hamburg (27.–28. Januar 2027), Mannheim (25.–26. November 2026), Würzburg, Zweibrücken, Weiden, Halle, Leipzig, Stuttgart, Wien, Zwickau und Hameln (korrekt 14. November 2026).
- [x] Alle Haupt- und Stadt-CTAs bleiben direkte Awin/Eventim-Links mit Publisher-Kennung `2865727`, individuellen `clickref`-Werten und Eventim-Zieladresse. Keine Trackinglogik, Partnerkennung oder Consent-Gating wurde geändert.
- [x] Google Sheets und die lokale Preis-API bestätigen für `dreihaselnuesse` `40,49 €`, ohne Sale. Statische SEO-Ausgabe enthält 85 MusicEvent-Objekte, 71 Spielorte, korrekten ShowSlot-Organisator und den Preis `40.49`.

## Drei Haselnüsse für Aschenbrödel – Tourerweiterung bis 2028
- [x] Die vom Projektinhaber gelieferten Termine vollständig eingepflegt bzw. korrigiert: neue Stopps u. a. in Berlin (BlueMax Theater), Bielefeld, Chemnitz, Deggendorf, Hannover, Karlsruhe, Kempten, Münster, Passau und Trier; Mannheim entfernt. Korrigierte Zeiträume/Spielstätten u. a. für Aschaffenburg, Bremerhaven, Donaueschingen, Fulda (Esperantohalle), Gütersloh, Halle (Saale), Husum, Koblenz, Landau, Neuss, Nürnberg, Offenburg, Paderborn, Ravensburg, Wetzlar, Wien und Würzburg.
- [x] Der Datensatz umfasst nun 80 Tourstädte von 15.10.2026 bis 13.01.2028. Detailtext, SEO-Titel/-Beschreibung, Fakten und FAQ sind auf diesen Zeitraum abgestimmt.
- [x] Jede neue oder geänderte Stadtzeile nutzt einen direkten, show- und stadtbezogenen Awin/Eventim-CTA mit `awinmid=11388`, `awinaffid=2865727` und eigenem `clickref`. Es wurden keine Banner, Pixel, Converter oder Consent-Regeln verändert.
- [x] Berlin, Hamburg und Hannover nehmen Aschenbrödel aufgrund der zukünftigen Tourtermine automatisch in Stadtseite, Stadtfilter, Kartenanzahl, Sitemap und statische SEO-Ausgabe auf. Desktop- und Mobilansichten für Detailseite sowie Berlin/Hamburg geprüft.
- [x] Gesamtsuite: 102 Testdateien / 348 Tests; TypeScript, Produktionsbuild, Sitemap/SEO-Output, Affiliate-Integritätsgate und Diff-Prüfung erfolgreich.

## Fack Ju Göhte – Preis und beendete 30%-Aktion – Oktober 2026
- [x] Die veröffentlichte Preisquelle bestätigt `fackjugoehte`: **40,49 €**, `Sale aktiv = Nein`, leere Sale-Felder. Die Produktions-API liefert nach dem Cacheablauf ebenfalls `priceFrom: 40,49` und `saleEnabled: false`.
- [x] Redaktioneller Preis-/SEO-/FAQ-Fallback auf 40,49 € angeglichen und der abgelaufene Back-to-School-Sale-Fallback entfernt.
- [x] Beide beendeten nativen 30%-FJG-Creatives einschließlich ihrer Komponenten, Consent-Pixelpfade und Regressionen vollständig aus dem Auslieferungsweg entfernt. Desktop- und Mobilprüfung zeigen keine Sale-Creatives; Ticket- und Städte-CTAs mit den bestehenden direkten Awin-Links bleiben erhalten.

## Drei Haselnüsse für Aschenbrödel – Veranstalter-FAQ – Oktober 2026
- [x] Neue FAQ ergänzt: **ShowSlot** veranstaltet die Nikolaus-Tour, **Bavaria Live Promotion** die Rosalie-Tour. Die Zuordnung ist regression-getestet und wird in FAQ-Schema sowie statischer SEO-Ausgabe geführt.

## TINA und Der Teufel trägt Prada – Affiliate-Codeprüfung Oktober 2026
- [x] Die gelieferten TINA-Kampagnen sind bereits exakt aktiv: 728 × 90 `g=26204070`, 300 × 250 `g=26204068`, Produktseitenlink `g=26204074`. Native CDN-Creatives, bewusst gewählte Platzierungen und consent-gesteuerte Impressionen bleiben unverändert.
- [x] Die gelieferten Prada-Kampagnen sind ebenfalls bereits exakt aktiv: 728 × 90 `g=26185640`, 300 × 250 `g=26185638`. Die Text-/Ticketpfade einschließlich Hamburg-Termin führen nun ebenfalls über die ausdrücklich gelieferte Stage-Produktseite `g=26149414`; der bisherige Shop-Pfad `g=26149416` ist nicht mehr im aktiven Katalog verknüpft.
- [x] Regressionen decken Bannergruppen, Formate, Produktseiten-Keyvisuals und sämtliche Text-/Ticket-/Terminpfade ab. 101 Testdateien / 348 Tests, TypeScript, Produktionsbuild, statische SEO-Ausgabe, Affiliate-Integritätsgate und Diff-Prüfung erfolgreich; beide Seiten auf Desktop und Mobil ohne Cropping oder Platzierungsfehler geprüft.

## Drei Haselnüsse für Aschenbrödel – Korrektur der Tourdaten Oktober 2026
- [x] Präzisierung umgesetzt: Die zuletzt gelieferten HNA-Termine werden grundsätzlich als **Ergänzungen** geführt. Vorhandene, nicht ausdrücklich entfernte Termine bleiben aktiv; nur Mannheim sowie Würzburg am 11.12.2026 bleiben wie explizit angewiesen entfernt.
- [x] Wiederhergestellt: Aschaffenburg (14.12.2026), Bremerhaven (29.10.2026), Donaueschingen (15.12.2026), Halle (Saale) (03.–04.12.2026), Husum (30.10.2026), Koblenz (30.11.2026), Neuss (22.10.2026), Offenburg (26.10.2026), Paderborn (20.10.2026), Ravensburg (16.12.2026) und Wetzlar (29.11.2026).
- [x] Die aktualisierten, nicht überschneidenden Zukunftstermine bleiben zusätzlich erhalten; die längere neue Wien-Spieldauer (06.–17.01.2027) ersetzt weiterhin den darin vollständig enthaltenen früheren Zeitraum. Bestand: **106 Termine in 80 Städten**, alle mit bestehenden stadtbezogenen Awin-CTAs.
- [x] Regression schützt die vollständige Ergänzung sowie die beiden ausdrücklich entfernten Stopps. 101 Testdateien / 349 Tests, TypeScript, Produktionsbuild, Sitemap-/SEO-Ausgabe, Affiliate-Integritätsgate und Diff-Prüfung erfolgreich; Detailseite auf Desktop und Mobil geprüft.

## Der Glöckner von Notre-Dame – Preisfallback Oktober 2026
- [x] Redaktions- und SEO-Fallback auf **49,99 €** aktualisiert: Katalogpreis, Ticket-Fakt, FAQ-Antwort sowie statisches Event-/FAQ-Schema stimmen überein.
- [x] Die öffentliche Preis-API liefert bereits 49,99 € ohne Sale. Der direkte veröffentlichte CSV-Abruf gab parallel noch 54,99 € zurück; der öffentlich sichtbare Produktionspreis und der neue robuste Katalogfallback bleiben daher bei der vom Projektinhaber bestätigten Angabe 49,99 €.
- [x] Keine Ticket-URLs, Awin-/ATG-Kennungen, Banner, Pixel oder Consent-Regeln geändert. 101 Testdateien / 349 Tests, TypeScript, Produktionsbuild, statische Preisprüfung, Affiliate-Integritätsgate und Diff-Prüfung erfolgreich.

## Fack Ju Göhte – neue Pressefotos in WebP Oktober 2026
- [x] Alle **21** gelieferten Pressefotos (`FACKJUGÖHTE-2026-01` bis `-20` einschließlich des zweiten Motivs zu `-13`) unverändert als Originale außerhalb des Projekts gesichert und als WebP ins öffentliche CDN hochgeladen.
- [x] Neue WebP-Kartenvariante und breites Headermotiv aus der gelieferten Bildreihe erstellt und eingebunden; das bereits freigegebene FJG-Keyvisual bleibt bewusst unverändert.
- [x] Die vollständige neue Fotoserie ersetzt die bisherige FJG-Galerie. Die Galerie begrenzt Bildreihen nicht länger auf sechs Fotos; bei mehr als zehn Fotos bleiben die Pfeilsteuerung und Lazy-Loading aktiv, die optisch überladene Punktnavigation wird ausgeblendet.
- [x] Alle 23 neuen CDN-Bilder liefern HTTP 200 mit `image/webp`. Browserprüfung bestätigt 21 Galerieelemente, das erste und letzte neue Motiv sowie das Nachladen bis zum letzten Bild. Bildnachweis im Impressum (`© Nico Moser`) war bereits korrekt hinterlegt.
- [x] 103 Testdateien / 353 Tests, TypeScript, Produktionsbuild, Bildstandard, Affiliate-Integritätsgate und Diff-Prüfung erfolgreich; FJG-Detailseite auf Desktop und Mobil geprüft.

## Der Kleine Lord – neues Musical in Berlin Oktober 2026
- [x] **DER KLEINE LORD – DAS MUSICAL** als aktiven Berliner Eintrag angelegt: Weltpremiere im BlueMax Theater am Potsdamer Platz vom **13.11. bis 30.12.2026**, Tickets ab **59,99 €**, Familien-/Weihnachts-Erlebniswelt, vollständige SEO-, FAQ-, Event- und Breadcrumb-Daten.
- [x] Alle Haupt-CTAs, Keyvisual und Berlin-Termin verwenden einen direkten Awin/Eventim-Link zur offiziellen Showseite; mangels eines separaten Textlink-Werbemittels wird der vorhandene, direkte Awin-Wrapper verwendet. Keine Awin-, Banner-, Pixel- oder Consent-Logik außerhalb des neuen Showeintrags geändert.
- [x] Geliefertes quadratisches Keyvisual sowie das breite Headermotiv verlustfrei als WebP ins öffentliche CDN integriert. Das Uwe-Kröger-Pressefoto ist als „Live-Moment“ an geeigneter Stelle in der Detailgalerie eingebunden. Bildmaterial wird im Impressum als über ShowSlot Touring GmbH bereitgestelltes Pressematerial ausgewiesen.
- [x] Native Eventim-Creatives eingebunden: `s=3663000` (728 × 90) nach dem abgeschlossenen ersten Erzählabschnitt und `s=3662990` (300 × 250) nach der Galerie vor den Wissensdaten. Impressions bleiben ausschließlich nach Affiliate-Einwilligung aktiv.
- [x] Berlin-Stadtseite, Stadtfilter, Teaserzählung, Sitemap und statische Ausgabe enthalten die neue Show automatisch. Desktop- und Mobilprüfung zeigt alle Medien, Banner und die Berliner Kachel korrekt.
- [~] Extern abhängig: In der privaten Google-Preisquelle die Zeile mit dem Kürzel **`der-kleine-lord`** sowie Preis **59,99** (Sale: Nein) ergänzen. Der Katalogfallback zeigt bis dahin bereits 59,99 €.

## Der Kleine Lord – Awin-Textlink Oktober 2026
- [x] Das gelieferte Awin-Textlink-Werbemittel `gid=492097`, `mid=11388`, `awinaffid=2865727`, `linkid=3666159` ist an allen allgemeinen DKL-Pfaden aktiv: Keyvisual, Ticket-CTA, Hero-, Sticky- und Box-CTA sowie allgemeiner Eventim-Link.
- [x] Jeder allgemeine Pfad erhält einen separaten `clickref` (`dkl-keyvisual`, `dkl-cta`, `dkl-hero`, `dkl-sticky`, `dkl-box`, `dkl-ticket`). Der vorhandene Berliner Termin-Deep-Link bleibt bewusst unverändert als direkter Awin-Zielpfad ohne allgemeines Textlink-Werbemittel.
- [x] 104 Testdateien / 360 Tests, TypeScript, Produktionsbuild, statische SEO-Ausgabe, Affiliate-Integritätsgate und Diff-Prüfung erfolgreich. Es wurden keine Pixel-, Banner- oder Consent-Regeln verändert.


## Der Kleine Lord – logo-freies Karten- und Headermotiv Oktober 2026
- [x] Das gelieferte logo-freie Quadratmotiv außerhalb des Repos im DKL-Assetarchiv gesichert, verlustarm als 1280 × 1280 WebP aufbereitet und per öffentlicher CDN-URL eingebunden.
- [x] DKL-Karte (`image`) und Detailseiten-Header (`heroImage`) verwenden nun dieselbe neue CDN-Quelle; das bisherige markenführende quadratische Keyvisual bleibt unverändert im Seitenfluss und verlinkt weiterhin über den bestehenden Awin-Textlink.
- [x] CDN-Prüfung bestätigt HTTP 200 und `image/webp`; Desktop- und Mobilprüfung bestätigt das neue Motiv in Karte und Header. Keine Affiliate-, Pixel-, Consent- oder sonstigen Ticketpfade verändert.


## Fack Ju Göhte – native Awin-Creatives Oktober 2026
- [x] Die gelieferten FJG-Awin-Creatives `4568825` (320 × 50) und `4568821` (180 × 150) unverändert außerhalb des Repos gesichert und als native Werbemittel über öffentliche CDN-Quellen eingebunden.
- [x] Das schmale Creative erscheint nach dem Abschnitt „Chaos, Lachen und jede Menge Musik“, das 180 × 150-Creative nach der Galerie. Klickziele und Impressionpfade verwenden `v=11388`, `q=492097`, `r=2865727` sowie jeweils die gelieferte Creative-ID.
- [x] Browserprüfung bestätigt beide Motive auf Desktop und Mobil; ohne Affiliate-Einwilligung bleiben ihre Awin-Impression-Pixel ohne `src`. Bestehende FJG-Textlinks, Stadt-Deep-Links, Sale-Logik und Consent-Regeln bleiben unverändert.


## Der Kleine Lord – Uwe-Kröger-Pressefoto Oktober 2026
- [x] Das bereits eingebundene Uwe-Kröger-Pressefoto ist nach dem Abschnitt „Uwe Kröger als Graf von Dorincourt“ direkt in den oberen DKL-Fließtext verschoben.
- [x] Die DKL-Galerie ist vorerst deaktiviert; die Detailseite zeigt dadurch keinen Bereich „Live-Momente“ mehr. Das separate markenführende Keyvisual, Header, Ticketpfade und Awin-Creatives bleiben unverändert.
- [x] Desktop- und Mobilprüfung bestätigt das Foto im gewünschten Textkontext sowie das Ausblenden der Galerie.


## Die Schöne und das Biest – Berlin Januar 2027
- [x] Der bestätigte Berlin-Stopp für **Die Schöne und das Biest – Das neue Musical** ist vom 06. bis 23. Januar 2027 im BlueMax Theater ergänzt. Der bestehende Awin/Eventim-Textlink bleibt dabei unverändert.
- [x] Berlin ist als Tour- und Headerstadt hinterlegt; die aktive Berliner Stadtseite, der Familien-&-Märchen-Filter sowie die Katalogzählung listen die Produktion jetzt mit insgesamt sieben aktiven Shows.
- [x] Desktop- und Mobilprüfung bestätigen den Termin auf der Detailseite und die sichtbare Karte auf der Berlin-Stadtseite.


## Fack Ju Göhte und Starlight Express – Oktober 2026
- [x] **Fack Ju Göhte** läuft in Berlin im BlueMax Theater bis 31.10.2026. Dadurch ist die Show wieder in der Berliner Stadtseite und in Ortsfiltern aktiv; der bestehende Berliner Awin/Eventim-Deep-Link bleibt unverändert.
- [x] Das native FJG-Querbanner bleibt als Partner-Creative und consent-gesteuerte Impression erhalten, erscheint aber erst nach dem vollständigen oberen Fließtext und damit unterhalb des Keyvisual-Kontexts.
- [x] **STARLIGHT EXPRESS** ist in „Preise & Aktionen“ sowie im veröffentlichten „Website-Export“ auf 59,99 € aktualisiert. Katalogfallback, SEO, Fakten, FAQ und Ticket-CTAs verwenden ebenfalls 59,99 €; die Preis-API liefert den Wert nach Neuladen.
- [x] Desktop- und Mobilprüfung bestätigen FJG-Position und Berlin-Karte; STEX-Ticket-CTA und Faktbox zeigen 59,99 €.


## Google Analytics 4 – Oktober 2026
- [x] GA4 mit der Mess-ID `G-V5YZXQEB04` ist consent-gesteuert integriert. Das Google-Tag lädt ausschließlich nach Auswahl „Reichweitenmessung“ und nur auf `welovemusicals.com` bzw. `www.welovemusicals.com`.
- [x] Die Single-Page-App sendet nach Einwilligung einen initialen sowie bei internen Routenwechseln weitere Seitenaufrufe. Werbe-, Personalisierungs- und Anzeigen-Datenspeicher bleiben explizit deaktiviert; bei Widerruf wird die Messung gestoppt und die Seite neu geladen.
- [x] Manus- und lokale Vorschauen bleiben von GA4 und Clarity ausgeschlossen. Datenschutzhinweis und Regressionen sind ergänzt.


## Mobile Ticket-CTA – 08.10.2026

Die roten Ticket-CTAs auf allen Musical-Detailseiten verwenden bei regulären Preisen nun die kompakte Beschriftung `ab XX,XX €`; die Abschnittsüberschrift „Tickets sichern“ erklärt die Aktion bereits. Aktive Sale-Labels bleiben unverändert. Die mobilen CTAs verhindern Zeilenumbrüche, nutzen kleinere seitliche Abstände und lassen das Partnerlogo bei knappem Platz sauber in eine neue Zeile fließen. Ticketziele, Affiliate-Kennungen, Clickrefs, Consent und Tracking bleiben unverändert. DKL wurde auf Mobil geprüft; die Preis-CTA `ab 59,99 €` ist einzeilig. Alle 20 aktiven CTA-Beschriftungen wurden auf Länge geprüft (maximal 24 Zeichen).


## Google Analytics 4 – Startreihenfolge, 08.10.2026

Die GA4-Initialisierung wurde nach einer Echtzeit-Rückmeldung gehärtet: Der erste manuelle `page_view` wird jetzt erst nach dem erfolgreichen `load`-Ereignis des Google-Tags gesendet. Bei weiteren Routenwechseln folgt jeweils genau ein weiterer Seitenaufruf. Der Tag bleibt strikt auf die Produktionsdomains begrenzt und startet weiterhin ausschließlich nach Statistik-Einwilligung; Werbespeicher, Werbungspersonalisierung und Affiliate-Tracking bleiben davon getrennt und unverändert. Regressionen, TypeScript, Produktionsbuild, Affiliate-Integritäts- und Bildstandardtest sind erfolgreich.


## Die Eiskönigin – neue Stage-Creatives, 09.10.2026

Die vom Projektinhaber gelieferten nativen Stage-Creatives sind unverändert aktualisiert: `26185658` (728 × 90) erscheint im oberen Fließtext nach dem Abschnitt „Spektakel für alle Sinne“, `26185656` (300 × 250) nach der Galerie vor „Alles, was du wissen musst“. Beide Originale sind außerhalb des Repos gesichert; die öffentlichen CDN-Dateien liefern 200 `image/jpeg` und die korrekten Dimensionen. Direkte Stage-Klickziele bleiben exakt `p=394206`, `a=3492604` und die jeweilige Gruppen-ID; Impressionen bleiben ausschließlich nach Affiliate-Einwilligung aktiv. Desktop, Mobil, direkte Klick-/Impressionspfade und die Sperre ohne Einwilligung sind geprüft.


## &JULIA – neue Stage-Creatives, 09.10.2026

Die vom Projektinhaber gelieferten nativen Stage-Creatives sind aktualisiert: `26185666` (728 × 90) erscheint passend im oberen Fließtext nach „Aus dem tragischen Ende wird ein euphorischer Neuanfang“, `26185664` (300 × 250) nach der Galerie vor „Alles, was du wissen musst“. Die Originaldateien sind außerhalb des Repos gesichert; die neuen öffentlichen CDN-Dateien liefern HTTP 200 `image/jpeg` in den korrekten Dimensionen. Direkte Stage-Klickziele verwenden unverändert `p=394206`, `a=3492604` und die jeweilige Gruppen-ID; Impressionen bleiben ausschließlich mit Affiliate-Einwilligung aktiv. Desktop, Mobil, direkte Klick-/Impressionspfade sowie die Sperre ohne Einwilligung sind geprüft.


## ZURÜCK IN DIE ZUKUNFT und Tarzan – Stage-Aktualisierung, 09.10.2026

Die gelieferten ZIZ-„Bye Bye Tickets“-Creatives sind aktualisiert: `26185502` (728 × 90) erscheint im oberen Fließtext nach „Bühneneffekte der Extraklasse“, `26185500` (300 × 250) nach der Galerie vor „Alles, was du wissen musst“. Beide Originale sind außerhalb des Repos gesichert; die neuen öffentlichen CDN-Dateien liefern HTTP 200 `image/jpeg` in der korrekten Größe. Die ZIZ-Preisquelle liefert 44,99 € und `Sale aktiv: Nein`; deshalb bleibt die globale Sale-Kennzeichnung korrekt deaktiviert, obwohl die neuen Motive „bis zu 40 %“ bewerben. Die gelieferte Tarzan-Produktseite `26149408` ersetzt `26149406` einheitlich an Keyvisual, allgemeinen Ticket-CTAs, Terminen, Zielvorschlag und Testdaten. Eiskönigin (`26149418`), &JULIA (`26149394`) und ZIZ (`26149410`) waren bereits korrekt. Klickziele, Consent-Gating, Pixel und übrige Trackingpfade bleiben unverändert; Desktop, Mobil, Preisquelle, direkte Pfade und die Sperre ohne Einwilligung sind geprüft.


## Salon Rosie, Wir sind am Leben, König der Löwen und ZIZ – Stage-Aktualisierung, 09.10.2026

Die sechs neu gelieferten nativen Stage-Creatives sind aktualisiert: Salon Rosie `26185722` (728 × 90) und `26185720` (300 × 250), Wir sind am Leben `26185700` (728 × 90) und `26185698` (300 × 250) sowie König der Löwen `26180470` (728 × 90) und `26180460` (300 × 250). Die Querformate erscheinen im mittleren oberen Fließtext, die großen Formate nach der Galerie vor „Alles, was du wissen musst“. Originale liegen außerhalb des Repos; alle sechs CDN-Dateien liefern HTTP 200 `image/jpeg` in den vorgesehenen Dimensionen. Direkte Stage-Klickziele, Affiliate-Einwilligung und Impressiongating bleiben unverändert. Der veröffentlichte ZIZ-Export wird mit 44,99 €, `Sale aktiv: Ja` und `BIS 40%` korrekt gelesen und in der Vorschau als Sale-CTA gezeigt. Der gelieferte Salon-Rosie-Deeplink `26149434` wurde bewusst **nicht** gesetzt, da er bereits der WSAL-Produktseitenpfad ist; Salon Rosie bleibt bis zur Bestätigung auf seinem vorhandenen getrennten Pfad `26149438`.


### Deeplink-Bestätigung

Der Projektinhaber bestätigte die getrennten produktseitigen Stage-Ziele: Wir sind am Leben `26149434`, Salon Rosie `26149438`. Beide waren bereits aktiv und werden nun zusätzlich mit einer expliziten Regression gegen eine Verwechslung abgesichert.


## TINA, Der Teufel trägt Prada, MJ und Tanz der Vampire – neue Stage-Creatives, 09.10.2026

Die acht vom Projektinhaber gelieferten nativen Stage-Creatives sind aktualisiert: TINA `26204070` (728 × 90) / `26204068` (300 × 250), Der Teufel trägt Prada `26185640` / `26185638`, MJ `26180462` / `26180466` und Tanz der Vampire `26185674` / `26185672`. Die Querformate sind im mittleren oberen Fließtext platziert, die 300 × 250-Creatives nach der Galerie vor „Alles, was du wissen musst“. Alle Originale liegen außerhalb des Repos; die acht neuen CDN-Dateien liefern HTTP 200 `image/jpeg` mit den vorgegebenen Dimensionen. Die bestehenden Produktseiten bleiben exakt unverändert: TINA `26204074`, Prada `26149414`, MJ `26149402`, TDV `26149426`. Desktop- und Mobilansichten, direkte Stage-Ziele, Bilddimensionen sowie die Sperre von Stage-Impressions ohne Affiliate-Einwilligung wurden geprüft.


## Tanz der Vampire – Artwork für Karte und Detailheader, 09.10.2026

Das gelieferte 2048 × 1274-Querformat wurde ohne Beschnitt als zwei WebP-Varianten vorbereitet und über das CDN eingebunden: 1920 × 1194 für den Detailheader sowie 1200 × 746 für die Startseiten-/Kartenansichten. Das bisherige Theaterfoto ist damit an beiden gewünschten Stellen ersetzt. Das separate quadratische Keyvisual und die Galerie bleiben bewusst unverändert. Original und aufbereitete Varianten liegen außerhalb des Repos; beide CDN-Dateien liefern HTTP 200 `image/webp`. Desktop- und Mobilprüfung bestätigen das zentral ausgerichtete Motiv ohne ungewollte Leerfläche oder störenden Anschnitt.


## Startseite und befristete Aktionen – 09.10.2026

**STARLIGHT EXPRESS** steht in den neun Top-Empfehlungen jetzt an vierter Stelle direkt vor **Moulin Rouge** (Desktop: zweite Reihe, erste Karte; Mobil: direkt nach Tarzan). Die Reihung ist durch die Highlight-Regression geschützt. Für befristete Aktionen sind die vorhandenen Spalten **„Gültig ab“** und **„Gültig bis“** in beiden Google-Sheets-Blättern mit eindeutigen Kopfzeilen-Hinweisen dokumentiert: akzeptiert werden `TT.MM.JJJJ` oder `JJJJ-MM-TT`; ein leerer Start bedeutet sofort, ein Enddatum läuft am gleichen Tag um 23:59 Uhr aus. Die Website respektiert den Zeitraum bereits automatisch; ungültige oder umgekehrte Daten deaktivieren den Sale sicher. Bestehende Salezeilen und Preise bleiben unverändert.


## Tanz der Vampire – Galerie und Stimmen vorerst ausgeblendet, 09.10.2026

Da aktuell keine freigegebenen Live- oder Pressefotos vorliegen, ist der Abschnitt **„Live-Momente“** auf der TDV-Detailseite vorerst ausgeblendet. Ebenso sind die bisherigen allgemeinen Stimmen zur Show ausgeblendet, bis belastbare Rezensionen zur Neuproduktion vorliegen. Header-Artwork, separates Keyvisual, Trailer, Fakten, FAQ, Tourtermin, Ticket-CTA sowie sämtliche Affiliate- und Consentpfade bleiben unverändert. Desktop und Mobil bestätigen, dass beide Abschnitte nicht mehr erscheinen; je eine Regression schützt die Ausblendung.


## Stimmen zur Show – Bereinigung nicht verifizierter Zitate, 09.10.2026

Die Bereiche **„Stimmen zur Show“** sind bei **TANZ DER VAMPIRE**, **DER KLEINE LORD**, **DISNEYS DIE EISKÖNIGIN**, **MJ – DAS MICHAEL JACKSON MUSICAL**, **SALON ROSIE** und **WIR SIND AM LEBEN** ausgeblendet. DER KLEINE LORD und TANZ DER VAMPIRE hatten bereits keine aktive Zitatliste; bei den übrigen Seiten wurden Produktions-, Partner- und allgemeine Publikumsaussagen entfernt, bis belastbare Quellen vorliegen. Bei **DISNEYS MUSICAL TARZAN** wurde ausschließlich die Stage-Entertainment-Stimme entfernt; die redaktionellen Zitate von *Freundin* und *ZDF* bleiben sichtbar. Eine zentrale Regression prüft die sechs ausgeblendeten Bereiche sowie die zwei verbliebenen Tarzan-Stimmen. Bildmaterial, Texte, Ticketziele, Affiliate-IDs, Banner und Consent-Logik bleiben unverändert.


## Stimmen zur Show – vollständiger Katalogaudit, 09.10.2026

Der vollständige Katalogaudit fand nach der ersten Bereinigung noch **zwölf** aktive Zitatbereiche: Dracula, Moulin Rouge, Sister Act, Fack Ju Göhte, Starlight Express, Der König der Löwen, Tarzan, ZURÜCK IN DIE ZUKUNFT, Der Teufel trägt Prada, Die Amme, WE WILL ROCK YOU und & JULIA. Da im Katalog keine nachprüfbaren Fundstellen hinterlegt waren, sind diese Bereiche auf ausdrücklichen Wunsch ebenfalls ausgeblendet. Damit erscheint aktuell auf **keiner** Detailseite ein Bereich „Stimmen zur Show“. Die zentrale Regression prüft katalogweit, dass keine aktive Zitatliste verbleibt. Sobald belastbare Quellen vorliegen, können Zitate gezielt mit konkreter Fundstelle wieder ergänzt werden.


### Korrektur: bekannte Medienzitate wiederhergestellt

Nach Präzisierung durch den Projektinhaber sind die Zitate bekannter Print-, Nachrichten- und etablierter Kulturmedien wieder aktiv. Sichtbar bleiben ausschließlich Quellen wie **Süddeutsche Zeitung**, **Kölner Stadtanzeiger**, **ntv**, **WAZ**, **Münchner Merkur**, **dpa**, **Stern**, **ZDF**, **Vogue** sowie etablierte Musicalmedien. Ausgeblendet bleiben weiterhin sämtliche Produktions-, Partner-, Pressemappe-, Marken-, Personen- und allgemeinen Publikumsaussagen (z. B. Stage Entertainment, Disney, Guinness, Anna Wintour oder Donatella Versace). Die zentrale Regression prüft die exakte, katalogweite Quellenliste, sodass keine ausgeblendete Quelle zurückkehrt.
