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
