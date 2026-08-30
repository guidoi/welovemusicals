# Live-Verifikation der Hero-Navigation

## Prüfstand

Die Live-Startseite `https://welovemusicals.com/` wurde nach der Umstellung geprüft. Die ersten Navigationseinträge werden als `Musicals` und `Städte` ausgeliefert. `Musicals` zeigt weiterhin auf `/#musicals`, `Städte` auf `/#staedte`.

## Direkte Musicalziele

Die einzelnen Musical-Buttons werden im Live-DOM mit direkten Pfaden unter `/musical/{slug}` ausgeliefert. Die alphabetische Liste umfasst die aktiven Musicaltitel. Exemplarisch wurde der Button `& JULIA` aktiviert; er öffnete direkt `https://3000-igvuyd8zq1q26mjjxk43a-3c9419b9.us2.manus.computer/musical/und-julia` und lud die Detailseite `& JULIA – Das Pop-Musical Stuttgart 2026`.

Die Live-Navigation enthält außerdem die gekürzten Beschriftungen `DISNEYS TARZAN` und `ZURÜCK IN DIE ZUKUNFT`, jeweils mit eigenem direkten Musicalpfad. Die interne Click-Logik behandelt weiterhin nur Hash-Ziele; direkte Musicalpfade werden nicht mehr abgefangen.
