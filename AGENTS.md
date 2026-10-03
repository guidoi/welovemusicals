# We Love Musicals – Projektanweisungen

## Affiliate-Tracking und Umsatzpfade

Änderungen an Affiliate-Tracking, Partner-IDs, Click-/Deeplinks, Link-Convertern, Impressionpixeln, Consent-Gating oder externen Affiliate-Skripten sind **umsatzkritisch**.

- Ohne eine vorherige, ausdrücklich dokumentierte Freigabe des Projektinhabers niemals entfernen, deaktivieren, ersetzen oder in der Wirkung einschränken.
- Vor jeder ausdrücklich freigegebenen Änderung die betroffenen Partnerpfade, Kennungen, Consent-Auswirkungen und den Rollback-Weg konkret benennen.
- Nach einer freigegebenen Änderung mindestens direkte Click-URLs, Consent-Verhalten, Produktionsauslieferung und die passende Regression prüfen.
- Native Banner-Creatives und direkte Affiliate-Click-URLs bleiben weiterhin der Standard; fremde `document.write`-Werbemittelsnippets werden nicht ausgeführt.

## Redaktionelle Bildassets

- Neue redaktionelle Bilder für Karten, Header, Keyvisuals, Galerien, Städte und Trailer-Standbilder werden vor der Einbindung über `scripts/prepare-web-image.py` verlustarm als WebP aufbereitet, in `/home/ubuntu/webdev-static-assets/` mit Original gesichert und per CDN-URL eingebunden.
- Keine großen redaktionellen Bilddateien in `client/public/` oder `client/src/assets/` ablegen. Der Produktionsbuild prüft aktive Musical- und Stadtbilder über `pnpm run test:image-standard` auf WebP/AVIF.
- Native Affiliate-Creatives sind ausdrücklich ausgenommen: Ihre vom Partner gelieferten Originalformate, Dimensionen, Motive und CDN-Quellen dürfen nicht durch diese Pipeline ersetzt werden.
