/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Footer: Eleganter Footer mit goldenen Akzenten und Affiliate-Hinweis
 */
import { Ticket, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-gold/10 mt-auto">
      {/* Gold Divider */}
      <div className="gold-line" />

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-lg font-bold uppercase tracking-wide flex items-center gap-2" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, letterSpacing: '0.12em' }}>
                <span className="text-gold">We</span>
                <Heart className="w-5 h-5" style={{ color: 'rgb(239, 68, 68)', fill: 'rgb(239, 68, 68)' }} />
                <span className="text-foreground">Musicals</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dein Portal für die besten Musical-Produktionen im deutschsprachigen Raum. Tickets, Hotels und mehr.
            </p>
          </div>

          {/* Musicals */}
          <div>
            <h4 className="font-display text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Top Musicals
            </h4>
            <ul className="space-y-2">
              {[
                { label: "König der Löwen", slug: "koenig-der-loewen" },
                { label: "Die Eiskönigin", slug: "die-eiskoenigin" },
                { label: "Pretty Woman", slug: "pretty-woman" },
                { label: "Harry Potter", slug: "harry-potter" },
                { label: "MJ Musical", slug: "mj-michael-jackson" },
              ].map((item) => (
                <li key={item.slug}>
                  <Link href={`/musical/${item.slug}`} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Städte */}
          <div>
            <h4 className="font-display text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Musical-Städte
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Hamburg", slug: "hamburg" },
                { label: "Stuttgart", slug: "stuttgart" },
                { label: "Berlin", slug: "berlin" },
                { label: "München", slug: "muenchen" },
                { label: "Köln", slug: "koeln" },
              ].map((item) => (
                <li key={item.slug}>
                  <Link href={`/#staedte`} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Information
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Über uns", href: "#" },
                { label: "Datenschutz", href: "#" },
                { label: "Impressum", href: "#" },
                { label: "Kontakt", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <span className="text-sm text-muted-foreground hover:text-gold transition-colors cursor-default">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-10 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-3xl">
            <strong className="text-muted-foreground">Affiliate-Hinweis:</strong> Diese Website enthält Affiliate-Links zu Eventim (AWIN Merchant ID 11388). 
            Wenn Sie über unsere Links Tickets kaufen, erhalten wir eine kleine Provision – für Sie entstehen keine zusätzlichen Kosten. 
            Die Ticket-Preise entsprechen den regulären Preisen des Anbieters.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} We Love Musicals – Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-muted-foreground/50 flex items-center gap-1">
            Gemacht mit <Heart className="w-3 h-3" style={{ color: 'rgb(239, 68, 68)', fill: 'rgb(239, 68, 68)' }} /> für Musical-Fans
          </p>
        </div>
      </div>
    </footer>
  );
}
