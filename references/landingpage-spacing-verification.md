# Landingpage-Spacing-Verifikation

**Prüfdatum:** 01.09.2026

Auf den Musical-Detailseiten wurde der obere Inhaltsübergang auf einen kompakteren mobilen Rhythmus gesetzt. Die Anpassung gilt unabhängig davon, ob der Header eine einzelne Stadt mit Venue oder mehrere Städte bzw. weitere Tourneestädte nennt.

| Übergang | Mobil vorheriger Wert | Neuer mobiler Wert | Desktop |
|---|---:|---:|---:|
| Hero/Headerblock bis CTA | `pb-8` + `pt-4` | `pb-6` + `pt-2` | unverändert: `pb-10` + `pt-6` ab `md` |
| CTA bis folgende Inhaltsheadline | `pb-2` + `pt-10` | `pb-2` + `pt-6` | unverändert: `pb-2` + `pt-16` ab `md` |

Geprüfte mobile Routen im Viewport 375 × 812: `/musical/koenig-der-loewen` mit „Hamburg (Stage Theater im Hafen)“ sowie `/musical/drei-haselnuesse-fuer-aschenbroedel` mit mehreren Städten und „58 weitere Tourneestädte“. Beide zeigen den CTA und die folgende Headline kompakter, ohne Überlauf oder abgeschnittene Inhalte. Die Desktop-Routen wurden im Viewport 1280 × 720 geprüft; die Desktop-Klassen bleiben unverändert. Die Startseiten-Hero-Schiebenavigation wurde nicht verändert.
