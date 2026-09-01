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
