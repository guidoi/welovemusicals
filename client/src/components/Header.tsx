/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Header: Dunkler, eleganter Header mit goldenem Logo, Art-Deco-Akzenten und Suchfunktion
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveMusicals, type Musical } from "@/lib/data";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Musical[]>([]);
  const [location, navigate] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsNavigating(false);
  }, [location]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [searchOpen]);

  // Close search on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search logic
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const allMusicals = getActiveMusicals();
    const results = allMusicals.filter((m) => {
      if (m.title.toLowerCase().includes(q)) return true;
      if (m.subtitle?.toLowerCase().includes(q)) return true;
      if (m.city?.toLowerCase().includes(q)) return true;
      if (m.cities?.some((c) => c.toLowerCase().includes(q))) return true;
      if (m.tourDates?.some((t) => t.city.toLowerCase().includes(q))) return true;
      if (m.categories?.some((c) => c.toLowerCase().includes(q))) return true;
      if (m.tags?.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
    setSearchResults(results);
  }, []);

  const handleResultClick = (musical: Musical) => {
    setSearchOpen(false);
    navigate(`/musical/${musical.slug || musical.id}`);
  };

  const navItems = [
    { label: "Musicals", href: "/#musicals" },
    { label: "Städte", href: "/#staedte" },
    { label: "Hotels", href: "/#hotels" },
  ];

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const anchor = href.split('#')[1];
    if (location === '/') {
      const element = document.getElementById(anchor);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsNavigating(true);
      window.location.href = href;
    }
  };

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
          {/* Search Icon Desktop */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted-foreground hover:text-gold transition-colors p-1"
            aria-label="Suche öffnen"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <a
            href="/#musicals"
            className="px-5 py-2 bg-gold text-background font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors tracking-wide"
          >
            Tickets finden
          </a>
        </nav>

        {/* Mobile Right: Search + Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); }}
            className="text-muted-foreground hover:text-gold transition-colors p-2"
            aria-label="Suche"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <button
            onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false); }}
            className="text-foreground p-2"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-gold/20 shadow-2xl"
          >
            <div className="container py-4">
              {/* Search Input */}
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gold/60 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Musical, Stadt oder Kategorie suchen..."
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-gold/20 rounded-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSearchResults([]); searchInputRef.current?.focus(); }}
                    className="absolute right-4 text-muted-foreground hover:text-gold transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-2"
                  >
                    {searchResults.map((musical) => (
                      <button
                        key={musical.id}
                        onClick={() => handleResultClick(musical)}
                        className="flex items-center gap-3 p-3 rounded-sm bg-white/5 hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all text-left group"
                      >
                        <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={musical.image}
                            alt={musical.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground group-hover:text-gold transition-colors truncate">
                            {musical.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {musical.city || (musical.cities && musical.cities.slice(0, 2).join(", ")) || (musical.tourDates && musical.tourDates[0]?.city) || ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
                {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm text-muted-foreground py-2"
                  >
                    Keine Musicals für „{searchQuery}" gefunden.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
