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
              <Ticket className="w-5 h-5 text-gold" />
              <span className="font-display text-lg font-bold text-gold">
                We Love<span className="text-foreground">Musicals</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dein Portal für die besten Musical-Produktionen in Deutschland. Tickets, Hotels und mehr.
            </p>
          </div>

          {/* Musicals */}
          <div>
            <h4 className="font-display text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Top Musicals
            </h4>
            <ul className="space-y-2">
              {["König der Löwen", "Die Eiskönigin", "Pretty Woman", "Harry Potter", "MJ Musical"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-gold transition-colors cursor-default">
                    {item}
                  </span>
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
              {["Hamburg", "Stuttgart", "Berlin", "München", "Köln"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-gold transition-colors cursor-default">
                    {item}
                  </span>
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
            Gemacht mit <Heart className="w-3 h-3 text-burgundy" /> für Musical-Fans
          </p>
        </div>
      </div>
    </footer>
  );
}
