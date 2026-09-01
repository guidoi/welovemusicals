# Finale visuelle Prüfung

**Prüfdatum:** 01.09.2026

Die aktuelle Vorschau wurde auf fünf repräsentativen Routen im Desktop-Viewport 1280 × 720 und im mobilen Viewport 375 × 812 als vollständige Seiten geprüft:

| Route | Desktop | Mobil | Befund |
|---|---:|---:|---|
| `/` | geprüft | geprüft | Theatrical-Noir-Hero, weiße Stage-Navigation, Sale-Störer, Musical- und Städtebereiche sichtbar; mobile Karten bleiben lesbar und stapeln sich korrekt. |
| `/musical/dracula` | geprüft | geprüft | Hero, individuelles Musical-Layout, Trailer, Spielorte, Ticketbereich, Schema-relevanter Inhalt und Footer sichtbar; mobile Darstellung ohne horizontales Überlaufen. |
| `/stadt/hamburg` | geprüft | geprüft | Stadt-Hero, Musical-Karten, Hotel-CTA, weitere Städte und Footer sichtbar; Karten und Anbieterlogos bleiben im mobilen Layout innerhalb des Viewports. |
| `/impressum` | geprüft | geprüft | Rechtlicher Inhalt, Bildnachweise, Affiliate-Hinweis und Footer vollständig erreichbar; lange Textblöcke umbrechen korrekt. |
| `/datenschutz` | geprüft | geprüft | Datenschutzabschnitte, Hosting-/Analyse-/Affiliate-Hinweise und Footer vollständig erreichbar; keine sichtbaren Layoutbrüche. |

Zusätzliche technische Prüfung: 31 Vitest-Tests bestanden, TypeScript-Prüfung ohne Fehler und Produktionsbuild erfolgreich. Die Prüfungen sind visuelle Smoke-Tests der genannten Zustände; sie ersetzen keine externe Suchmaschinenvalidierung nach dem nächsten Crawl.
