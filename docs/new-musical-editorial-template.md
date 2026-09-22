# Redaktionsvorlage für neue Musicals

Jede neue Show erhält bei der Anlage in `client/src/lib/data.ts` **verbindlich genau eine Erlebnis-Kategorie**. Sie steuert die Startseitenfilter, die Kennzeichnung auf Teaser- und Detailseiten sowie die Priorisierung unter „Ähnliche Musicals“.

| Erlebnis-Kategorie | Geeignet für | Beispiele |
|---|---|---|
| `blockbuster-spektakel` | Große Produktionen mit imposanter Inszenierung, bekannten Marken oder starkem visuellen Ereignischarakter. | König der Löwen, Tarzan, Moulin Rouge! |
| `kult-klassiker` | Langjährig bekannte, generationenübergreifende Musical-Klassiker. | Das Phantom der Oper, Starlight Express, Tanz der Vampire, Dracula |
| `pop-rock-filmhits` | Pop-, Rock- oder filmbezogene Produktionen, deren Songs oder Vorlage direkt wiedererkannt werden. | MJ, & Julia, We Will Rock You, Fack ju Göhte |
| `familie-maerchen-magie` | Familienangebote, Märchenstoffe und magisch-fantastische Geschichten. | Die Eiskönigin, Rapunzel, Die Schöne und das Biest |
| `besondere-geschichten` | Charakterstarke neue Stoffe, ungewöhnliche Perspektiven oder anspruchsvollere Erzählformen. | Der Teufel trägt Prada, Wir sind am Leben, Salon Rosie |

## Pflichtfeld im Datensatz

Direkt nach `id` wird die Kategorie notiert. Die Kategorie darf nicht leer bleiben und wird vor dem Veröffentlichen gegen die fünf erlaubten Werte geprüft.

```ts
{
  id: "beispiel-musical",
  experienceCategory: "blockbuster-spektakel",
  slug: "beispiel-musical",
  title: "BEISPIEL MUSICAL",
  // weitere redaktionelle Angaben
}
```

Wenn eine Show zwischen zwei Kategorien liegt, entscheidet die **primäre Buchungsmotivation**: visuelles Großereignis, etablierter Klassiker, Musik-/Filmbezug, Familienerlebnis oder besondere Erzählung. Nur bei einer deutlichen Änderung des Produktionsprofils wird die Kategorie später angepasst.

## Pflichtprüfung nach jeder Katalogänderung

Nach dem Hinzufügen, Deaktivieren oder wesentlichen Umkategorisieren einer Show wird die Startseitenführung mitgeprüft. Damit bleiben Formulierung und Anzahl der gezeigten Shows inhaltlich korrekt, auch wenn sich der Katalog verändert.

| Besucherzustand | Erwartete Ergebniszeile | Prüfung |
|---|---|---|
| Keine Auswahl | „Weiter unten findest du **X weitere Musicals & Shows**.“ | Die Übersicht führt lediglich die Shows unterhalb der Highlights fort; „passend“ darf hier nicht erscheinen. |
| Einstieg „Alle Shows“ | „Weiter unten findest du **alle X Musicals & Shows**.“ | Die vollständige Übersicht einschließlich Highlights ist aktiv. |
| Erlebniswelt, Land, Ort oder Umkreis gewählt | „Weiter unten findest du deine **X passenden Show-Tipps**.“ | „Passend“ ist nur nach einer bewussten Auswahl zulässig. |

Die Textlogik liegt zentral in `client/src/lib/discovery-result-hint.ts` und wird durch `discovery-result-hint.test.ts` abgesichert. Vor einem Checkpoint immer `pnpm test && pnpm exec tsc --noEmit && pnpm build` ausführen und die drei Zustände einmal im Browser kontrollieren.

## Material-Checkliste für neue Shows

Für eine vollständige Anlage kann vorhandenes, offizielles Material von Stage, Eventim, dem Veranstalter und dessen Pressebereich recherchiert werden. Am schnellsten und rechtssichersten gelingt die Veröffentlichung jedoch, wenn die folgenden Angaben gesammelt ankommen. Fehlende Punkte werden vor dem Livegang anhand offizieller Quellen ergänzt oder klar als offen markiert.

| Bereich | Benötigtes Material |
|---|---|
| **Grunddaten** | Offizieller Titel, Stadt, Theater, Spielzeit oder Startdatum, Einstiegspreis und offizielle Produktseite. |
| **Ticketlink** | Der fertige Awin- oder TradeDoubler-**Textlink** für alle allgemeinen Ticket-CTAs. Stadttermin-Links werden nur mitgeliefert, wenn sie tatsächlich abweichen. |
| **Creatives** | Keyvisual oder Szenenbild inklusive Bildcredit sowie – falls vorhanden – 728×90 und 300×250 als Dateien. Zu jedem Banner gehört die separate Click-/Campaign-ID; keine `document.write`-Skripte einfügen. |
| **Inhalt** | Presseinformation, offizieller Beschreibungstext oder Medienlink; optional Trailer-Link, Besonderheiten, Altersfreigabe, Spielzeit und Hinweise zu Licht-/Soundeffekten. |
| **Aktion** | Bei Aktionen: exakter Wortlaut, Preis oder Vorteil, Start- und Enddatum sowie der dazugehörige Partnerlink. Preise und Sales gehören anschließend in die Google-Sheets-Spalten; Ticketlinks und Banner verbleiben in der redaktionellen Affiliate-Pflege. |

> **Copy & Paste für neue Shows:** Titel · Stadt/Theater · Beginn/Ende · Tickets ab · offizieller Link · Textlink · 728×90-ID + Datei · 300×250-ID + Datei · Keyvisual + Credit · Trailer · Presseinformation · Aktion mit Laufzeit.

## Redaktionelle Freigabe-Checkliste

Diese kurze Liste wird für jede neue, reaktivierte oder wesentlich aktualisierte Show vor der Veröffentlichung einmal vollständig abgehakt. Sie verhindert, dass unvollständige Daten, veraltete Angebote oder nicht stimmige Startseitenführung in die öffentliche Ansicht gelangen.

| Bereich | Vor der Freigabe prüfen |
|---|---|
| **Grunddaten** | Titel, URL-Slug, Spielort, Städte, Spielzeit, Einstiegspreis und Veranstalter stimmen mit der aktuellen Quelle überein. |
| **Erlebniswelt** | Genau eine der fünf Erlebniswelten ist gesetzt und entspricht der primären Buchungsmotivation der Show. |
| **Ticketpfad** | Haupt-CTA, mobile CTA und Tourtermine führen zum richtigen Partnerziel; Stadt-CTAs heißen weiterhin „Tickets sichern“. |
| **Aktion & Preis** | Sale ist nur mit gültigem Text und korrektem Laufzeitfenster aktiv; abgelaufene Aktionen und Preise sind entfernt oder angepasst. |
| **Startseite** | Entscheidung über Highlights oder weitere Shows ist bewusst getroffen; Teaser, Reihenfolge und Erlebniswelt-Badge sind stimmig. |
| **Detailseite** | Keyvisual, Einstiegstext, Fakten, Termine, FAQ, Anbieterlogo sowie Bildnachweise sind vollständig und widerspruchsfrei. |
| **SEO & Medien** | Seitentitel, Beschreibung, Social-Motiv, Bild-Alttexte und Schema-Daten passen zur neuen Show; ein Trailer erhält ein lebendiges Szenenbild statt eines doppelten Artworks. |
| **Freigabe** | Die drei Ergebniszustände („weitere“, „alle“, „passende“ Shows) sowie die relevante Start- und Detailseite in Desktop und Mobil prüfen; danach Tests, TypeScript und Build ausführen. |
