/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Header: Dunkler, eleganter Header mit goldenem Logo, Art-Deco-Akzenten,
 *         Musical-Suche (Lupe) und PLZ-Umkreissuche (MapPin)
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart, Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveMusicals, type Musical } from "@/lib/data";
import { searchByPlz, RADIUS_OPTIONS, type PlzSearchState } from "@/components/PlzSearch";

// Globaler PLZ-State – wird von Home.tsx über Context oder Props gesteuert.
// Da Header keinen direkten Zugriff auf Home-State hat, verwenden wir ein
// Custom Event um den PLZ-State nach unten zu propagieren.
function dispatchPlzEvent(state: PlzSearchState) {
  window.dispatchEvent(new CustomEvent("plz-search-update", { detail: state }));
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [plzOpen, setPlzOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Musical[]>([]);
  const [location, navigate] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const plzInputRef = useRef<HTMLInputElement>(null);

  // PLZ-State lokal im Header (wird per Event an Home.tsx weitergegeben)
  const [plzInput, setPlzInput] = useState("");
  const [plzRadius, setPlzRadius] = useState(50);
  const [plzLoading, setPlzLoading] = useState(false);
  const [plzError, setPlzError] = useState<string | null>(null);
  const [plzActive, setPlzActive] = useState(false);
  const [plzLabel, setPlzLabel] = useState<string | null>(null);

  useEffect(() => {
    setIsNavigating(false);
  }, [location]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setPlzOpen(false);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [searchOpen]);

  // Focus PLZ input when PLZ overlay opens
  useEffect(() => {
    if (plzOpen) {
      setTimeout(() => plzInputRef.current?.focus(), 50);
      setSearchOpen(false);
    }
  }, [plzOpen]);

  // Close overlays on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setPlzOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Musical-Suche
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

  // PLZ-Suche
  const handlePlzSearch = useCallback(() => {
    searchByPlz(
      plzInput,
      plzRadius,
      (state) => {
        setPlzActive(state.active);
        setPlzLabel(state.active ? `${state.radius} km · PLZ ${state.plz}${state.country ? ` (${state.country})` : ""}` : null);
        dispatchPlzEvent(state);
        if (state.active) {
          setPlzOpen(false);
          // Scrollen wird von Home.tsx via plz-search-update Event übernommen
        }
      },
      setPlzLoading,
      setPlzError
    );
  }, [plzInput, plzRadius]);

  const handlePlzClear = () => {
    setPlzInput("");
    setPlzError(null);
    setPlzActive(false);
    setPlzLabel(null);
    dispatchPlzEvent({ active: false, plz: "", radius: plzRadius, originCoords: null });
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setPlzError("Standortfreigabe nicht möglich – bitte PLZ manuell eingeben");
      return;
    }
    setPlzLoading(true);
    setPlzError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Lazy-load DE-PLZ-Datenbank und nächste PLZ finden
        const res = await fetch("/plz_de.json");
        const db: Record<string, [number, number]> = await res.json();
        const { latitude, longitude } = pos.coords;
        let nearestPlz = "";
        let nearestDist = Infinity;
        for (const [plz, coords] of Object.entries(db)) {
          const dLat = latitude - coords[0];
          const dLon = longitude - coords[1];
          const d = Math.sqrt(dLat * dLat + dLon * dLon);
          if (d < nearestDist) { nearestDist = d; nearestPlz = plz; }
        }
        setPlzInput(nearestPlz);
        searchByPlz(
          nearestPlz,
          plzRadius,
          (state) => {
            setPlzActive(state.active);
            setPlzLabel(state.active ? `${state.radius} km · PLZ ${state.plz}${state.country ? ` (${state.country})` : ""}` : null);
            dispatchPlzEvent(state);
            if (state.active) {
              setPlzOpen(false);
              // Scrollen wird von Home.tsx via plz-search-update Event übernommen
            }
          },
          setPlzLoading,
          setPlzError
        );
      },
      () => {
        setPlzError("Standort nicht verfügbar – bitte Standortfreigabe im Browser erlauben oder PLZ manuell eingeben");
        setPlzLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const navItems = [
    { label: "Musicals", href: "/#musicals" },
    { label: "Städte", href: "/#staedte" },
    { label: "Hotels", href: "/#hotels" },
  ];

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const anchor = href.split("#")[1];
    if (location === "/") {
      const element = document.getElementById(anchor);
      element?.scrollIntoView({ behavior: "smooth" });
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
          element?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gold/10">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl font-extrabold tracking-[0.15em] flex items-center gap-1 uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <span className="text-gold">We</span>
            <Heart
              className="w-6 h-6 md:w-7 md:h-7 transition-colors mr-1"
              style={{ fill: "none", stroke: "rgb(239, 68, 68)", strokeWidth: 2.5 }}
              onMouseEnter={(e) => (e.currentTarget.style.stroke = "rgb(248, 113, 113)")}
              onMouseLeave={(e) => (e.currentTarget.style.stroke = "rgb(239, 68, 68)")}
            />
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

          {/* PLZ-Suche Icon Desktop */}
          <button
            onClick={() => setPlzOpen(!plzOpen)}
            className={`relative transition-colors p-1 ${plzActive ? "text-gold" : "text-muted-foreground hover:text-gold"}`}
            aria-label="Umkreissuche öffnen"
            title="Musicals in meiner Nähe"
          >
            <MapPin className="w-5 h-5" />
            {plzActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold" />
            )}
          </button>

          {/* Musical-Suche Icon Desktop */}
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

        {/* Mobile Right: PLZ + Search + Hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={() => { setPlzOpen(!plzOpen); setSearchOpen(false); setMobileOpen(false); }}
            className={`relative transition-colors p-2 ${plzActive ? "text-gold" : "text-muted-foreground hover:text-gold"}`}
            aria-label="Umkreissuche"
          >
            <MapPin className="w-5 h-5" />
            {plzActive && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold" />
            )}
          </button>
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); setPlzOpen(false); }}
            className="text-muted-foreground hover:text-gold transition-colors p-2"
            aria-label="Suche"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <button
            onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false); setPlzOpen(false); }}
            className="text-foreground p-2"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* PLZ-Overlay */}
      <AnimatePresence>
        {plzOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-gold/20 shadow-2xl"
          >
            <div className="container py-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Musicals in deiner Nähe</p>
                  <p className="text-xs text-muted-foreground">PLZ eingeben (5-stellig DE · 4-stellig AT/CH) oder Standort verwenden</p>
                </div>
                <button
                  onClick={() => setPlzOpen(false)}
                  className="ml-auto text-muted-foreground hover:text-gold transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Input Row */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50 pointer-events-none" />
                  <input
                    ref={plzInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={plzInput}
                    onChange={(e) => {
                      setPlzInput(e.target.value.replace(/\D/g, "").slice(0, 5));
                      setPlzError(null);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") handlePlzSearch(); }}
                    placeholder="z.B. 20095 (Hamburg), 1010 (Wien), 8001 (Zürich)…"
                    className="w-full pl-11 pr-10 py-3 bg-white/5 border border-gold/20 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/50 text-sm"
                  />
                  {plzInput && (
                    <button
                      onClick={() => { setPlzInput(""); setPlzError(null); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handlePlzSearch}
                  disabled={plzLoading || plzInput.length < 4}
                  className="px-5 py-3 rounded-sm text-sm font-semibold transition-all disabled:opacity-40 flex items-center gap-2 bg-gold text-background hover:bg-gold-light"
                >
                  {plzLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="hidden sm:inline">Suchen</span>
                </button>
                <button
                  onClick={handleGeolocate}
                  disabled={plzLoading}
                  title="Meinen Standort verwenden"
                  className="px-3 py-3 rounded-sm text-sm transition-all disabled:opacity-40 border border-gold/20 text-gold/70 hover:text-gold hover:border-gold/40 bg-white/5"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>

              {/* Radius-Chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-xs text-muted-foreground/90 self-center mr-1">Umkreis:</span>
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setPlzRadius(r)}
                    className="px-2.5 py-1 text-xs rounded-sm border transition-all"
                    style={
                      plzRadius === r
                        ? { backgroundColor: 'rgba(184,148,74,0.28)', color: '#d4a85a', borderColor: 'rgba(184,148,74,0.70)' }
                        : { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.28)' }
                    }
                  >
                    {r} km
                  </button>
                ))}
              </div>

              {/* Error */}
              {plzError && <p className="text-xs text-red-400 mb-2">{plzError}</p>}

              {/* Aktive Suche anzeigen */}
              {plzActive && plzLabel && (
                <div className="flex items-center gap-2 text-xs text-gold/80 bg-gold/5 border border-gold/15 rounded-sm px-3 py-2">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>Aktiv: {plzLabel}</span>
                  <button
                    onClick={handlePlzClear}
                    className="ml-auto text-muted-foreground hover:text-gold transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Musical-Suche Overlay */}
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
