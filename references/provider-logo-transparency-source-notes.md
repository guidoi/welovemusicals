# Anbieterlogo-Quellen – Transparenzprüfung

- Das vorhandene **Eventim**-PNG ist 1001 × 380 Pixel groß und enthält eine sichtbare, vollflächige schwarze Hintergrundfläche hinter der weißen Wortmarke und dem Sternsymbol.
- Das vorhandene **ATG Tickets**-PNG ist 618 × 388 Pixel groß und enthält ebenfalls eine sichtbare, vollflächige schwarze Hintergrundfläche hinter der weißen Wortmarke.
- Für die Startseiten-Teaser werden daher neue, echte PNG-Assets mit Alphakanal benötigt. Die weißen Wortmarken und jeweiligen Markensymbole sollen unverändert bleiben; nur die schwarze Fläche wird entfernt.

Für die umgesetzte Fassung wurde ausschließlich das Eventim-Asset ausgetauscht. Die Startseite wurde nach der Anpassung als vollständige Ansicht bei 1280 × 1600 Pixeln und 375 × 812 Pixeln aufgenommen; die Teaser bleiben innerhalb ihrer jeweiligen Kartenbreite. Die ergänzende DOM-Prüfung erfasst die konkreten Logo-, CTA- und Kartenmaße.

Die Desktop-DOM-Prüfung bei einer Kartenbreite von rund 386,7 Pixeln bestätigt für alle Anbieter geladene Assets und eine CTA-Rechtskante mit 0 Pixeln Abweichung. Die Logos werden auf 28 Pixel Höhe gerendert: Stage etwa 31,5 × 28 Pixel, Eventim etwa 95,8 × 28 Pixel und ATG etwa 44,6 × 28 Pixel. Die CTA-Zeile ist ebenfalls 28 Pixel hoch; zwischen Logo und Ticket-CTA bleibt je nach Wortmarkenbreite ein positiver Freiraum von mindestens 135 Pixeln.

Die separate mobile DOM-Prüfung innerhalb des mobilen CSS-Breakpoints bestätigt geladene und vollständig in den Karten enthaltene Logos bei einer Kartenbreite von 460 Pixeln. Die Zeilenhöhe beträgt 32 Pixel; Stage misst rund 36,0 × 32 Pixel, Eventim rund 109,6 × 32 Pixel und ATG rund 51,0 × 32 Pixel. Die CTA ist jeweils vertikal exakt zentriert (0 Pixel Mittendifferenz) und rechtsbündig (0 Pixel Rechtskantenabweichung). Der kleinste freie Abstand zwischen Wortmarke und CTA beträgt rund 194,8 Pixel.

Die nachfolgende Messung im expliziten Ziel-Viewport 375 × 812 Pixel bestätigt denselben mobilen Stil: Bei einer Kartenbreite von 335 Pixeln messen Stage 36,0 × 32 Pixel, Eventim 109,6 × 32 Pixel und ATG 51,0 × 32 Pixel. Alle Assets sind geladen und vollständig in ihren Karten enthalten. Die Kartenhöhen liegen bei rund 403,6 Pixeln (Stage/Eventim) beziehungsweise 423,6 Pixeln (ATG); die CTA bleibt vertikal mittig und rechtsbündig, jeweils mit 0 Pixeln Abweichung. Der kleinste freie Abstand beträgt 69,8 Pixel beim breiteren Eventim-Logo.

Die wiederholte Desktop-DOM-Prüfung erfasst nach der finalen Änderung außerdem Kartenhöhen von 431,9 Pixeln (Stage/Eventim) beziehungsweise 451,9 Pixeln (ATG), bei weiterhin 0 Pixeln für die vertikale Mittendifferenz und die CTA-Rechtskantenabweichung. Das transparente Eventim-Asset liefert auf den dunklen Teaserflächen die berechnete Hintergrundfarbe `rgba(0, 0, 0, 0)`; sein PNG besitzt einen Alphakanal von 0 bis 255. Damit wird keine schwarze Hintergrundfläche mitgerendert.

Die sichtbaren Pixel der gerenderten Eventim-Wortmarke wurden aus dem geladenen PNG ausgelesen und ergeben im Mittel reines Weiß (`RGB 255, 255, 255`). Gegen die tatsächlich berechnete Kartenfläche `oklch(0.16 0.005 260)` beträgt der Kontrast 8,37 : 1. Die Wortmarke bleibt damit klar von der dunklen Teaserkarte getrennt, während der Hintergrund des Bildassets transparent bleibt.

Nach dem folgenden Korrekturwunsch wurde ausschließlich die Eventim-Breite begrenzt. Die Desktop-DOM-Messung zeigt Eventim jetzt mit 72 × 28 Pixeln statt 95,8 × 28 Pixeln. Die Stage- und ATG-Logos bleiben unverändert bei etwa 31,5 × 28 beziehungsweise 44,6 × 28 Pixeln. Alle drei Assets laden, die CTA-Zeile bleibt 28 Pixel hoch und die Ticket-CTA ist weiterhin sowohl rechtsbündig als auch vertikal zentriert (je 0 Pixel Abweichung).

Im Ziel-Viewport 375 × 812 Pixel ist Eventim nun auf 80 × 32 Pixel begrenzt; zuvor waren es 109,6 × 32 Pixel. Stage und ATG bleiben bei 36,0 × 32 beziehungsweise 51,0 × 32 Pixeln. Die Wortmarken sind vollständig innerhalb der jeweils 335 Pixel breiten Karten, und die Ticket-CTA bleibt mit 0 Pixeln Rechtskanten- und Mittendifferenz ausgerichtet. Der freie Raum zwischen dem reduzierten Eventim-Logo und der CTA beträgt 99,3 Pixel.
