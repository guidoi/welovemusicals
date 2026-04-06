/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Header: Dunkler, eleganter Header mit goldenem Logo und Art-Deco-Akzenten
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Musicals", href: "/#musicals" },
    { label: "Tourneestädte", href: "/#staedte" },
    { label: "Anbieter", href: "/#anbieter" },
    { label: "Hotels", href: "/#hotels" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gold/10">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl md:text-2xl font-bold text-gold tracking-widest flex items-center gap-2 uppercase" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, letterSpacing: '0.12em' }}>
            We
            <Heart className="w-7 h-7 text-red-500 group-hover:text-red-400 transition-colors" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 }} />
            <span className="text-foreground">Musicals</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors tracking-wide uppercase"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#musicals"
            className="px-5 py-2 bg-gold text-background font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors tracking-wide"
          >
            Tickets finden
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Menü"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-gold/10 overflow-hidden"
          >
            <nav className="container py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-display text-foreground hover:text-gold transition-colors py-2 border-b border-border/30"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/#musicals"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-5 py-3 bg-gold text-background font-semibold text-center rounded-sm"
              >
                Tickets finden
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
