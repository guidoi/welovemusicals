/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Datenschutzerklärung: Rechtliche Datenschutzinformationen
 */
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const HEADER_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/hero-stage-LExvJcmcPP3dpbDQunFpAD.webp";

export default function Datenschutz() {
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
            alt="Datenschutzerklärung Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
              Datenschutzerklärung
            </h1>
          </div>
        </div>

        {/* Datenschutz Content */}
        <div className="container py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-8 text-foreground">
            {/* Allgemeine Hinweise */}
            <section>
              <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Allgemeine Hinweise</h2>
              <p className="text-muted-foreground leading-relaxed">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
              </p>
            </section>

            {/* Datenerfassung auf unserer Website */}
            <section>
              <h3 className="text-xl font-bold text-gold mb-4 tracking-wide">Datenerfassung auf unserer Website</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Wie erfassen wir Ihre Daten?</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.<br /><br />
                    Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Wofür nutzen wir Ihre Daten?</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.<br /><br />
                    Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt. Teilweise können auch Cookies von Drittunternehmen auf Ihrem Endgerät gespeichert werden, wenn Sie unsere Seite betreten (Third-Party-Cookies).<br /><br />
                Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch notwendig, da bestimmte Websitefunktionen ohne diese nicht funktionieren würden (z. B. die Warenkorbfunktion oder die Anzeige von Videos). Andere Cookies dienen dazu, das Nutzerverhalten auszuwerten oder Werbung anzuzeigen.
              </p>
            </section>

            {/* Hosting */}
            <section>
              <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Hosting</h2>
              <p className="text-muted-foreground leading-relaxed">
                Diese Website wird auf der Manus-Plattform gehostet, die eine sichere und zuverlässige Infrastruktur für Webanwendungen bereitstellt. Der Quellcode des Projekts wird auf GitHub verwaltet und versioniert. Die Website wird über Cloudflare bereitgestellt, das zusätzliche Sicherheits- und Performance-Optimierungen wie DDoS-Schutz, SSL/TLS-Verschlüsselung und globale Content Delivery bietet. Diese Kombination aus Manus (Hosting), GitHub (Versionskontrolle) und Cloudflare (Edge-Sicherheit) gewährleistet eine sichere, schnelle und zuverlässige Verfügbarkeit unserer Website.
              </p>
            </section>

            {/* Allgemeine Hinweise und Pflichtinformationen */}
            <section>
              <h2 className="text-2xl font-bold text-gold mb-4 tracking-wide">Allgemeine Hinweise und Pflichtinformationen</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Datenschutz</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.<br /><br />
                    Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.<br /><br />
                    Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Hinweis zur verantwortlichen Stelle</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
                    Guido Illigen<br />
                    Im Laukenstein 16<br />
                    55270 Jugenheim in Rheinhessen<br />
                    E-Mail: info(at)welovemusicals.com<br /><br />
                    Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Speicherdauer</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">SSL- bzw. TLS-Verschlüsselung</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.<br /><br />
                    Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Auskunft, Sperrung, Löschung und Berichtigung</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Recht auf Einschränkung der Verarbeitung</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Das Recht auf Einschränkung der Verarbeitung besteht in folgenden Fällen:<br /><br />
                    • Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.<br /><br />
                    • Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie statt der Löschung die Einschränkung der Datenverarbeitung verlangen.<br /><br />
                    • Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der Löschung die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.<br /><br />
                    • Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen überwiegen, haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Recht auf Datenübertragbarkeit</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.
                  </p>
                </div>
              </div>
            </section>

            {/* Back to Home */}
            <div className="mt-12 pt-8 border-t border-border/30">
              <Link href="/" onClick={() => window.scrollTo(0, 0)} className="text-gold hover:text-gold-light transition-colors font-semibold">
                ← Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
