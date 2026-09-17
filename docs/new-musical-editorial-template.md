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
