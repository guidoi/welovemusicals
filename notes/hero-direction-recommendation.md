# Hero-Richtung: Bild, Video und Text

## Empfehlung

Der aktuelle Hero mit dem **König-der-Löwen-Rafiki-Motiv** ist gegenüber dem abstrakten Bühnenbild die bessere kurzfristige Wahl: Er vermittelt unmittelbar Figur, Emotion und Live-Erlebnis. Ein dauerhaftes Video sollte erst eingesetzt werden, wenn ein ausdrücklich freigegebener, eigenständig auslieferbarer Bühnenclip vorliegt.

Die bestehende Einleitung sollte nicht vollständig entfallen. Für eine conversion-orientierte Startseite wird sie jedoch auf eine klare Headline und eine kurze Nutzenzeile reduziert. So bleibt der Kontext für Tickets, Shows und Termine verständlich, ohne das Motiv oder die mobile Navigation zu überlagern.

## Empfohlenes Zielbild

| Element | Kurzfristig | Spätere Video-Variante |
|---|---|---|
| Hintergrund | Rafiki-Sonnenmotiv als statisches, lokales Bild | Lizenzierter 6–8-Sekunden-Bühnenloop ohne Ton, mit statischem Rafiki-Poster als Fallback |
| Text | Headline plus eine kurze Nutzenzeile | Identisch, damit Video und Text nicht miteinander konkurrieren |
| Navigation | Mobile Tabs als primäre nächste Aktion | Unverändert über dem sicheren Kontrastverlauf |
| Datenschutz | Keine externe Medienanfrage | Lokale Videoauslieferung; kein YouTube-Embed im Hero |

## Umsetzungsvoraussetzungen für Video

Ein künftiger Hintergrundclip muss stumm, `playsinline`, mit `poster` und mit einer Präferenz für reduzierte Bewegung umgesetzt werden. Er darf nur genutzt werden, wenn die Rechte für eine Web-Hero-Auslieferung ausdrücklich vorliegen. Das Video benötigt einen statischen Bildfallback und darf die Ladepriorität des sichtbaren Hero-Inhalts nicht beeinträchtigen.

## Quellen

1. [MDN: Autoplay guide for media and Web Audio APIs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
2. [web.dev: Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
3. [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
