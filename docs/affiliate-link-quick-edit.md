# Schnelleditierung für Affiliate-Link-Ziele

Die Funktion befindet sich in der geschützten Auswertung unter `/verwaltung/affiliate-links`. Sie ist über Cloudflare Access ausschließlich für `guidoi@web.de` erreichbar. Der zusätzliche Schreibendpunkt `/api/admin/affiliate-link-target-overrides*` besitzt denselben Access-Schutz.

## Zweck und Umfang

Eine Fehlergruppe besteht aus **Musicalkennung**, **Partnerkategorie** und **Platzierung**. Für genau diese Kombination kann eine neue, direkt vom Partner gelieferte Ziel-URL hinterlegt werden. Das Ziel wird bei der nächsten öffentlichen Seitenauslieferung geladen und vor der Verwendung erneut durch die lokale Sicherheitsprüfung validiert. Ungültige, nicht erreichbare oder nicht geladene Overrides verdrängen niemals den statischen Kataloglink.

Der Button **„Katalogvorschlag“** befüllt das Feld ausschließlich mit einer bereits aktiven, show-spezifischen und lokal validen Katalog-URL derselben Partnerkategorie. Er ruft keine Partnerseite auf, erzeugt keine Kennungen und versucht insbesondere nicht, City- oder Creative-spezifische Links zu erraten. Für Termin- und Kampagnenbannergruppen ohne eindeutigen Kataloggegenwert bleibt das Feld bewusst leer; dort muss die vom Partner bereitgestellte URL eingefügt werden.

## Zulässige URLs

| Partner | Voraussetzung |
|---|---|
| Stage | `https://visit.stage-entertainment.de/click` mit `p=394206`, `a=3492604` und einer `g`-Kennung |
| TradeDoubler | `https://clk.tradedoubler.com/click` mit `p=377032`, `a=3492604` und einer `g`-Kennung |
| Awin/Eventim | direkte Awin-URL mit Publisherkennung `2865727`; für Eventim Merchant `11388` |
| Awin/ATG | direkte Awin-URL mit Publisherkennung `2865727`; für ATG Merchant `111888` |

Die API lehnt ungetrackte Anbieterziele, HTTP-URLs, `javascript:`-URLs, fremde Netzwerke und abweichende Partnerkennungen ab. **Katalogziel wiederherstellen** löscht ausschließlich den Override und reaktiviert die geprüfte URL aus `data.ts`.

## Datenschutz und Attribution

Die Override-Tabelle enthält nur Musicalkennung, Partner, Platzierung, Ziel-URL und Änderungszeitpunkt. Sie wird nicht mit Fallback-Ereignissen, Cookies, Consentwerten, Besucherkennungen, IP-Adressen oder Buchungsdaten verbunden. Die Änderung lädt keine Impressionpixel, sendet keine künstlichen Partnerklicks und verändert weder `affiliateTracking` noch Analyse-Consent oder Link Converter.
