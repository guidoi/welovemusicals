/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Header: Dunkler, eleganter Header mit goldenem Logo und Art-Deco-Akzenten
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [location]);

  const navItems = [
    { label: "Musicals", href: "/#musicals" },
    { label: "Städte", href: "/#staedte" },
    { label: "Hotels", href: "/#hotels" },
  ];

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const anchor = href.split('#')[1];
    if (location === '/') {
      // Already on home page, scroll to anchor
      const element = document.getElementById(anchor);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Not on home page, navigate to home first
      setIsNavigating(true);
      window.location.href = href;
    }
  };

  // Listen for hash changes and scroll to anchor
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gold/10">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl font-extrabold tracking-[0.15em] flex items-center gap-1 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="text-gold">We</span>
            <Heart className="w-6 h-6 md:w-7 md:h-7 transition-colors mr-1" style={{ fill: 'none', stroke: 'rgb(239, 68, 68)', strokeWidth: 2.5 }} onMouseEnter={(e) => (e.currentTarget.style.stroke = 'rgb(248, 113, 113)')} onMouseLeave={(e) => (e.currentTarget.style.stroke = 'rgb(239, 68, 68)')} />
            <span className="text-foreground">Musicals</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
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
                  onClick={(e) => {
                    handleAnchorClick(e, item.href);
                    setMobileOpen(false);
                  }}
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
