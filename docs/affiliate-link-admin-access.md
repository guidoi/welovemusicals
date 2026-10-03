# Geschützte Auswertung technischer Affiliate-Link-Fallbacks

Die Auswertung liegt unter `https://welovemusicals.com/verwaltung/affiliate-links`. Sie darf **nicht** ohne Cloudflare Access veröffentlicht werden, da sie interne technische Qualitätsdaten enthält. Die beiden unten genannten Anwendungen sind am 3. Oktober 2026 eingerichtet und lassen ausschließlich `guidoi@web.de` zu.

## Eingerichtete Cloudflare-Access-Anwendungen

| Anwendung | Typ | Ziel | Richtlinie |
|---|---|---|---|
| We Love Musicals – Affiliate-Link-Auswertung | Self-hosted | `welovemusicals.com/verwaltung/affiliate-links*` | Allow: ausschließlich `guidoi@web.de` |
| We Love Musicals – Affiliate-Link-Auswertungs-API | Self-hosted | `welovemusicals.com/api/admin/affiliate-link-fallback-events*` | Allow: ausschließlich `guidoi@web.de` |

Die beiden Anwendungen verwenden denselben Cloudflare-Access-Login. Der Browser kann dadurch die geschützte Seite und die gleichfalls geschützte First-Party-API auf derselben Domain aufrufen, ohne dass ein Passwort oder ein API-Schlüssel im Frontend hinterlegt wird.

## Gespeicherte Daten

D1-Datenbank: `welovemusicals-affiliate-events` (EU-Jurisdiktion, keine Replikation)

| Spalte | Zweck |
|---|---|
| `occurred_at` | Plattformseitiger technischer Zeitstempel |
| `musical_id` | betroffene Musicalkennung |
| `partner` | Partnerkategorie |
| `placement` | CTA- oder Bannerplatzierung |
| `reason` | technischer Fallback-Grund |

Es werden ausdrücklich keine URLs, Query-Parameter, Cookies, Consent-Informationen, Geräte- oder Besucherkennungen, IP-Adressen im Anwendungspayload oder Buchungsdaten gespeichert.
