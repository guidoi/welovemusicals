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
- [ ] Letzte visuelle Optimierungen prüfen

## Phase 5 – Webflow-Import-Paket
- [ ] Statisches HTML/CSS der gesamten Seite generieren (ohne React)
- [ ] Webflow CMS Collection-Struktur dokumentieren
- [ ] Alle Design-Tokens und Klassen-Mapping dokumentieren
- [ ] Asset-Liste mit allen Bild-URLs erstellen
- [ ] Webflow-Bauanleitung als Markdown erstellen
- [ ] Alles als ZIP-Paket bündeln

## Phase 6 – Auslieferung
- [ ] Checkpoint erstellen
- [ ] Ergebnisse dem Nutzer präsentieren

## Bugfixes – Weiße/schwarze Seite beim Laden
- [x] Fix: sonner.tsx importiert useTheme von next-themes statt eigenem ThemeContext
- [x] Fix: Inline-CSS auf body für sofortigen dunklen Hintergrund vor CSS-Laden
- [x] Fix: Cache-Control HTTP-Header auf Server-Ebene für HTML-Responses
- [x] Dracula Detailseite: Headline und Beschreibungstext aktualisieren
- [x] Header auf Detailseite vergrößern und Bildausschnitt anpassen (Personen nicht abschneiden)

## Drei Haselnüsse für Aschenbrödel
- [ ] Keyvisual hochladen und Musical-Eintrag in data.ts anlegen
- [ ] Dropdown-Komponente für Tourtermine integrieren
- [ ] Musical aktivieren (ACTIVE_MUSICAL_IDS) und Impressum ergänzen

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
