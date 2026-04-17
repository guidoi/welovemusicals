/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Impressum: Rechtliche Informationen und Kontaktdaten
 */
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const HEADER_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/hero-stage-LExvJcmcPP3dpbDQunFpAD.webp";

export default function Impressum() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Header Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={HEADER_IMAGE}
            alt="Impressum Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center tracking-wider">
              Impressum
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Link href="/" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Zurück zur Startseite</span>
            </Link>

            {/* Impressum Content */}
            <div className="space-y-8 text-foreground">
              {/* Anbieter */}
              <section>
                <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Diensteanbieter</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Guido Illigen<br />
                  Im Laukenstein 16<br />
                  55270 Jugenheim in Rheinhessen
                </p>
              </section>

              {/* Kontakt */}
              <section>
                <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Kontakt</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Telefon: +49 (0) 160 7488576<br />
                  E-Mail: info(at)welovemusicals.com<br />
                  Website: www.welovemusicals.com
                </p>
              </section>

              {/* Umsatzsteuer-ID */}
              <section>
                <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Umsatzsteuer-ID</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                  DE323392768
                </p>
              </section>

              {/* Redaktionell verantwortlich */}
              <section>
                <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Redaktionell verantwortlich</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Guido Illigen<br />
                  Im Laukenstein 16<br />
                  55270 Jugenheim in Rheinhessen
                </p>
              </section>

              {/* Verbraucherstreitbeilegung */}
              <section>
                <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Verbraucherstreitbeilegung</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>

              {/* Affiliate-Links und Monetarisierung */}
              <section>
                <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Affiliate-Links und Monetarisierung</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Diese Website enthält Affiliate-Links zu Ticketanbietern, Veranstaltern und anderen Partnern. Wenn Sie über diese Links einen Kauf tätigen oder eine Buchung vornehmen, erhalten wir eine Provision. Dies hat keine Auswirkungen auf den Preis für Sie – Sie zahlen denselben Preis wie beim direkten Besuch der Partner-Website. Wir kennzeichnen Affiliate-Links entsprechend den geltenden Richtlinien und Gesetzen. Unsere Empfehlungen basieren auf der Qualität und Relevanz der Angebote für unsere Besucher.
                </p>
              </section>

              {/* Urheberrecht */}
              <section>
                <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Urheberrecht</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                  <p>
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>
              </section>

              {/* Bildnachweise und Lizenzen */}
              <section>
                <h3 className="text-xl font-bold text-gold mb-4 tracking-wide">Bildnachweise und Lizenzen</h3>
                <div className="space-y-6 text-muted-foreground leading-relaxed">

                  {/* Eigene Produktionsfotos */}
                  <div>
                    <h4 className="font-semibold text-gold mb-2">DRACULA – DAS MUSICAL</h4>
                    <ul className="space-y-2 ml-4">
                      <li><strong>Pressefotos:</strong> © Nico Moser – alle Rechte vorbehalten. Verwendung nur mit ausdrücklicher Genehmigung.</li>
                      <li><strong>Keyvisual & Grafiken:</strong> © ShowSlot Touring GmbH – alle Rechte vorbehalten. Verwendung nur mit ausdrücklicher Genehmigung.</li>
                      <li><strong>YouTube Video:</strong> © ShowSlot Touring GmbH – alle Rechte vorbehalten.</li>
                    </ul>
                  </div>

                  {/* Fack Ju Göhte */}
                  <div>
                    <h4 className="font-semibold text-gold mb-2">FACK JU GÖHTE – DAS MUSICAL</h4>
                    <ul className="space-y-2 ml-4">
                      <li><strong>Pressefotos:</strong> © Nico Moser – alle Rechte vorbehalten. Verwendung nur mit ausdrücklicher Genehmigung.</li>
                      <li><strong>Keyvisual & Grafiken:</strong> © ShowSlot Touring GmbH – alle Rechte vorbehalten. Verwendung nur mit ausdrücklicher Genehmigung.</li>
                    </ul>
                  </div>

                  {/* Unsplash */}
                  <div>
                    <h4 className="font-semibold text-gold mb-2">Städtefotos & Atmosphärebilder</h4>
                    <p>
                      Verschiedene Städtefotos sowie das Bühnenatmosphäre-Bild stammen von{" "}
                      <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">Unsplash</a>.
                      Diese Bilder sind unter der{" "}
                      <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">Unsplash-Lizenz</a>{" "}
                      kostenlos für kommerzielle und nicht-kommerzielle Zwecke nutzbar. Eine Namensnennung ist nach der Lizenz nicht verpflichtend, wird jedoch von den Fotografen begrüßt.
                    </p>

                  </div>

                  {/* Hero-Bild */}
                  <div>
                    <h4 className="font-semibold text-gold mb-2">Header- und Hintergrundbild</h4>
                    <p>
                      Das Bühnen-Headerbild wurde für diese Website erstellt und liegt im Eigentum des Seitenbetreibers.
                    </p>
                  </div>

                </div>
              </section>

              {/* Quelle */}
              <section className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground/70">
                  Quelle: <a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">https://www.e-recht24.de</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
