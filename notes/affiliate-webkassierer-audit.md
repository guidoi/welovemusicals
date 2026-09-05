# Awin-Webkassierer-Prüfung

Stand: 05.09.2026

## Verifizierte Befunde

| Bereich | Befund | Quelle |
|---|---|---|
| Eventim | Die produktiven Eventim-Links verwenden Awin-Redirects mit Merchant-ID `11388`, Publisher-ID `2865727`, `clickref` und kodiertem Ziel in `ued`. | `client/src/lib/data.ts` |
| ATG | Die aktuellen ATG-Ziele sind direkte `atgtickets.de`- bzw. `shop.atgtickets.de`-URLs. Die zustimmungsabhängige Awin-MasterTag-Integration wird separat geladen. | `client/src/lib/data.ts`, `client/src/components/OptionalConsentServices.tsx` |
| Eventim-Programm | Das öffentlich einsehbare Awin-Programmprofil nennt sessionbasiertes Sales-Tracking; es nennt keinen öffentlich dokumentierten Parameter namens „Webkassierer“. | https://ui.awin.com/merchant-profile/11388 |
| Eventim-Bedingungen | Die öffentlich einsehbaren Programmbedingungen enthalten Vermarktungs- und Compliance-Regeln, aber keine technische Spezifikation für einen „Webkassierer“-Parameter oder ein zwingendes URL-Schema. | https://ui.awin.com/merchant-profile-terms/11388 |

## Offener Klärungspunkt

Die Bezeichnung „Webkassierer“ ist im öffentlichen Eventim-Awin-Profil und im aktuellen Projekt nicht spezifiziert. Bevor URLs verändert werden, wird die exakte Werbemittel- oder Linkvorlage von Deep Media beziehungsweise dem jeweiligen Merchant benötigt. Ein Parameter darf nicht geraten oder manuell erfunden werden, weil das Tracking dadurch beeinträchtigt werden kann.

## Einordnung des bereitgestellten ATG-Werbemittels

Der bereitgestellte Klicklink `cread.php?s=4882591&v=111888&q=614186&r=2865727` ist ein Awin-Bannerlink. Nach der Awin-Dokumentation steht `v` für die Advertiser-ID, `r` für die Publisher-ID, `s` für die optionale Creative-ID und `q` für die Creative-Group-ID. Die Werte `s` und `q` fehlen erwartungsgemäß bei den aktuell verwendeten generischen Deep Links; diese nutzen stattdessen `awinmid`, `awinaffid` und `ued`.

Die Kennungen `s=4882591` und `q=614186` identifizieren somit das konkrete ATG-Werbemittel. Sie sind nicht als ein im Code ausgeschriebener „Webkassierer“-Parameter erkennbar. Awin dokumentiert eine Creative-ID ausdrücklich als optional für die Clickzuordnung. Ob Deep Media mit „Webkassierer“ eine merchant-spezifische Checkout- oder Werbemittelvorgabe meint, kann nur anhand eines exakten ATG-Textlink-/Deep-Link-Werbemittels für die jeweiligen Produktionen bestätigt werden.

Quellen: https://success.awin.com/s/article/What-does-an-affiliate-link-look-like ; https://ui.awin.com/merchant-profile/111888

## Convert-a-Link-Abgleich

Die Awin-Dokumentation bestätigt: Das Publisher MasterTag stellt Plugins bereit, aktiviert Convert-a-Link aber nicht selbstständig. Convert-a-Link muss im Awin-Portal separat aktiviert werden und konvertiert anschließend normale Website-Links zu Affiliate-Links. Die aktuelle Website lädt das Publisher MasterTag nach Affiliate-Einwilligung. Die tatsächliche Convert-a-Link-Aktivierung im Awin-Konto und die daraus erzeugte Ziel-URL müssen mit dem vorgesehenen Awin-Testlink beziehungsweise dem im Awin-Portal bereitgestellten Skript geprüft werden.

Quellen: https://success.awin.com/s/article/what-is-publisher-mastertag ; https://success.awin.com/s/article/how-can-i-automate-affiliate-links-creation ; https://success.awin.com/s/article/How-do-I-install-convert-a-link

## Aktuelle Ticketpfad-Inventur

| Merchant-Gruppe | Shows | Aktueller Pfad | Schlussfolgerung |
|---|---:|---|---|
| ShowSlot / Eventim | 4 aktiv | Fack ju Göhte, Dracula sowie Die Schöne und das Biest nutzen an Haupt-CTAs bereitgestellte Awin-Textlinks. Drei Haselnüsse für Aschenbrödel und Rapunzel nutzen weiterhin Awin-Deep-Links. Sister Act ist nach Ende der Berliner Spielzeit nicht mehr öffentlich aktiv. | Textlink-Haupt-CTAs besitzen eine konkrete Creative-ID; Stadttermine behalten ihre präzisen Deep-Links. |
| ATG | 4 | Moulin Rouge und Starlight Express nutzen an Haupt-CTAs bereitgestellte Awin-Textlinks. Das Phantom der Oper und Glöckner von Notre-Dame verweisen weiter direkt auf ATG-Zielseiten. | Die zwei verbleibenden direkten ATG-Pfade setzen das aktivierte Convert-a-Link-Plugin nach Affiliate-Einwilligung voraus. |

Bereitgestellte Awin-Textlink-Werbemittel liegen derzeit für Moulin Rouge (`linkid=4845203`), Starlight Express (`linkid=3861476`), Fack ju Göhte (`linkid=4568988`), Die Schöne und das Biest (`linkid=3737237`) und Dracula (`linkid=3889201`) vor. Für Drei Haselnüsse für Aschenbrödel und Rapunzel sind bislang keine eigenen Textlinks bereitgestellt; ihre Awin-Deep-Links bleiben aktiv.

## Empfohlene Linkrollen

| Position | Empfohlenes Format | Zweck |
|---|---|---|
| Haupt-CTA einer Show-Landingpage | Bereitgestellter Awin-Textlink, sofern vorhanden | Verknüpft die prominente Buchungsaufforderung mit der konkreten Merchant-Creative-ID. |
| Hero-, Sticky- und Ticketbox-CTA | Derselbe verifizierte Textlink mit positionsspezifischem `clickref` | Macht den CTA-Ursprung im Awin-Reporting unterscheidbar. |
| Tourtermine nach Stadt | Bestehender Eventim-Deep-Link mit stadtbezogenem `clickref` beziehungsweise direkte ATG-Produktseite mit Convert-a-Link | Erhält das genaue Ziel der jeweiligen Stadt bzw. Produktion. |

Textlinks werden daher nicht für jede einzelne Tourtermin-Karte benötigt. Die fehlenden Eventim-Textlinks sind nur dann erforderlich, wenn auch die Haupt-CTAs der jeweiligen Show eine konkrete Awin-Creative-ID verwenden sollen.

## Einordnung der abweichenden Transaktionsergebnisse

| Faktor | Stage / TradeDoubler | Eventim / Awin | ATG / Awin |
|---|---|---|---|
| Primärer Linkpfad | Direkte TradeDoubler-Klicklinks sind auf den Stage-CTAs hinterlegt. | Awin-Textlinks sind jetzt für drei bereitgestellte ShowSlot-Produktionen an Haupt-CTAs hinterlegt; übrige ShowSlot-CTAs bleiben Awin-Deep-Links. | Zwei Haupt-CTAs nutzen Awin-Textlinks; zwei Shows sind weiter vom Convert-a-Link nach Einwilligung abhängig. |
| Zustimmungseinfluss | Der direkte TradeDoubler-Klicklink kann auch ohne optionales Link-Converter-Skript aufgerufen werden. | Die direkte Awin-Weiterleitung läuft beim bewussten CTA-Klick; MasterTag-Optimierungen bleiben zustimmungsabhängig. | Direkte ATG-Produktlinks werden erst nach Affiliate-Einwilligung durch Convert-a-Link umgewandelt. |
| Wahrscheinlichste Erklärung bei wenigen Klicks | Nicht allein aus der unterschiedlichen Zahl gemessener Transaktionen ableitbar. | Ein tägliches Klickvolumen von 1–5 ist zu klein, um aus fehlenden Käufen eine belastbare technische Ursache abzuleiten. | Consent-Verweigerung, Blocker oder ein Kauf in einer späteren Session können die durch Convert-a-Link erfassbare Menge zusätzlich verringern. |
| Nachweis im Reporting | TradeDoubler-Reports zeigen die bereits gemeldeten Transaktionen. | Awin-ClickRef- und Transaktionsberichte zeigen je CTA und Show die Klicks, Pending- und Approved-Transaktionen. | Awin-ClickRef-Berichte sollten Convert-a-Link-Klicks als solche kennzeichnen; der Awin-Testlink kann die Konvertierung nach Einwilligung prüfen. |

Die technische Optimierung verbessert die Chancen auf saubere Attribution, kann aber keine Transaktion garantieren. Awin führt erzeugte Verkäufe zunächst als `Pending`; erst nach Merchant-Validierung erscheinen sie als `Approved`.

Quellen: https://success.awin.com/s/article/How-do-I-install-convert-a-link ; https://success.awin.com/s/article/what-is-publisher-mastertag ; https://success.awin.com/s/article/What-is-click-reference-and-what-can-I-use-this-for ; https://success.awin.com/s/article/Publisher-Transaction-Report
