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
