# Technischer Awin-Audit – Eventim und ATG

Stand: 2. September 2026

## Prüfungsumfang

Dieser Audit prüft ausschließlich die im Projekt hinterlegte Linkstruktur. Er bestätigt weder einen Kaufabschluss noch eine nachgelagerte Transaktionszuordnung im Awin-Reporting.

## Eventim

Alle direkt im Projekt hinterlegten Awin-Eventim-Links werden automatisiert auf die folgenden Parameter geprüft:

| Parameter | Erwarteter Wert |
|---|---|
| Linkhost | `www.awin1.com` |
| Linkpfad | `/cread.php` |
| Merchant-ID | `awinmid=11388` |
| Publisher-ID | `awinaffid=2865727` |
| Zielseite | `ued` enthält eine Eventim-URL |

Stadt- und positionsspezifische Links enthalten zusätzlich `clickref`-Werte, beispielsweise für Tourtermine.

## ATG Tickets

Alle direkt verlinkten ATG-Ticketseiten werden automatisiert auf die Awin-Tracking-Optimisation geprüft:

| Parameter | Erwarteter Wert |
|---|---|
| Zielhost | `www.atgtickets.de` |
| Quelle | `utm_source=awin` |
| Medium | `utm_medium=affiliate` |
| Publisher-Kennung | `sv_campaign_id=2865727` |

Zusätzlich lädt die Website den Awin Publisher MasterTag `pub.2865727.min.js`. Damit kann Awin Convert-a-Link bzw. Bounceless Tracking reguläre ATG-Links verarbeiten, sofern Programmstatus und Advertiser-Tracking im Awin-Konto aktiv sind.

## Ergebnis und Grenzen

Die Linkparameter und die Website-Einbindung sind technisch konsistent. Ausbleibende Transaktionen sind dadurch jedoch nicht abschließend erklärbar. Nach Awin hängt eine Zuordnung insbesondere vom aktiven Programmstatus, den Cookie-Einwilligungen auf Publisher- und Advertiser-Seite, dem verwendeten Browser bzw. Werbeblockern sowie der tatsächlichen Bestellung und deren Freigabe ab.

Für eine belastbare Transaktionsprüfung sind ein kontrollierter Testkauf gemäß den Vorgaben des jeweiligen Advertisers oder die Prüfung von Klickreferenzen und Transaktionen im Awin-Reporting erforderlich.

## Quellen

- [Awin: How are transactions tracked and correctly allocated to Publishers?](https://success.awin.com/s/article/how-are-transactions-tracked-and-correctly-allocated-to-publishers)
- [Awin: How can I ensure my affiliate sales are tracked correctly?](https://success.awin.com/s/article/How-can-I-ensure-my-affiliate-sales-are-tracked-correctly)
- [Awin: Convert-a-Link Troubleshooting Guide](https://success.awin.com/s/article/What-is-Convert-a-Link)
