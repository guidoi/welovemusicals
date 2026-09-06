# Mobile Sticky- und Active-State-Navigation – UX-Befund

## Relevante externe Befunde

- Nielsen Norman Group empfiehlt Sticky-Header nur dann, wenn sie klein, kontrastreich und unaufdringlich bleiben. Teilweise persistente Header können auf Mobilgeräten beim Scrollen nach oben wieder erscheinen, sollten aber erst nach wenigen Pixeln und mit einer kurzen, natürlichen Animation ausgelöst werden, damit sie nicht ablenken.
  Quelle: https://www.nngroup.com/articles/sticky-headers/
- Mobile Navigation soll sichtbar und erreichbar sein, gleichzeitig aber möglichst wenig Platz beanspruchen. Tab- und Navigationsleisten eignen sich für wenige Hauptoptionen; bei vielen Optionen steigt das Risiko, dass Horizontal-Scroll-Inhalte nicht entdeckt werden.
  Quelle: https://www.nngroup.com/articles/mobile-navigation-patterns/
- Die Intersection Observer API beobachtet Sichtbarkeitsänderungen asynchron und eignet sich für eine performante Bestimmung des aktuell sichtbaren Bereichs. Für einen Active-State muss die Anwendung Scrollrichtung selbst zusätzlich verfolgen.
  Quelle: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
