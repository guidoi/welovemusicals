# Affiliate-Attribution-Audit

Stand: 2. September 2026

> Diese Dokumentation bewertet die technische Ausgestaltung der Partnerlinks. Sie kann keine Transaktions- oder Umsatzzuordnung garantieren, weil Partnerfreigaben, Browser- und Cookie-Einstellungen, der tatsächliche Kaufabschluss, Gerätewechsel und Stornos außerhalb der Website liegen.

## Geprüfte Pfade

| Partnerpfad | Aktueller Stand | Umgesetzte Optimierung |
|---|---|---|
| Eventim / Awin | Direkte `cread.php`-Links mit Merchant-ID `11388` und Publisher-ID `2865727` | Alle direkt hinterlegten Awin-Links werden durch automatisierte Tests auf IDs und Eventim-Ziel geprüft. |
| ATG / Awin | Direkte ATG-Links mit `utm_source=awin`, `utm_medium=affiliate` und `sv_campaign_id=2865727` | Prüfung auf alle `*.atgtickets.de`-Subdomains erweitert; veraltete statische `awc`-Click-ID bei Starlight Express entfernt. |
| Stage / TradeDoubler | Direkte Stage-Zielseiten mit TradeDoubler-Converter für zugestimmte Besucher | Sofortige Fallback-Konvertierung nach Zustimmung ergänzt und Domainprüfung auf Stage-Subdomains erweitert. |
| Aovo-Kampagnen | Kampagnenspezifische Klicklinks und Impression-Pixel | Sichtbares Banner lokal; Impression-Pixel erst nach Zustimmung zur Partner- und Affiliate-Messung. |

## Consent und Attribution

Die Zustimmungskategorie **„Partner- und Affiliate-Messung“** lädt den Awin Publisher MasterTag und den TradeDoubler Link Converter. Damit stehen zugestimmten Besuchern die vom Partner vorgesehenen Optimierungen wie Convert-a-Link und Bounceless Tracking zur Verfügung.

Direkte Awin-Links behalten ihren Affiliate-Redirect beim bewussten Klick bei. Ohne Zustimmung wird jedoch weder der MasterTag noch der TradeDoubler Converter automatisch geladen; dadurch können zustimmungsgebundene Zusatzoptimierungen nicht greifen.

## Weitere Prüfungen außerhalb des Codes

1. Im Awin-Partnerbereich Programmfreigabe und aktive Plugins für Eventim sowie ATG prüfen.
2. In den Click-References-Berichten prüfen, ob die konfigurierten Werte (`hero`, `sticky`, `box`, `dates`) eingehen.
3. Im TradeDoubler-Reporting die Programme `394206` (Stage) und `377032` (Aovo) sowie die Site-ID `3492604` prüfen.
4. Transaktionen erst nach der vom Advertiser vorgesehenen Validierungszeit beurteilen.

## Quellen

1. Awin, „Using the Publisher MasterTag“: https://success.awin.com/s/article/what-is-publisher-mastertag
2. Awin, „Convert-a-Link Troubleshooting Guide“: https://success.awin.com/s/article/What-is-Convert-a-Link
3. Awin, „Tracking Optimisation (Bounceless Tracking)“: https://success.awin.com/s/article/What-is-the-Tracking-Optimisation-Bounceless-Tracking-plugin
