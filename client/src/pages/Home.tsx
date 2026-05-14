/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Home: Startseite mit Hero, Featured Musicals, alle Musicals mit erweiterten Filtern, Städte, Anbieter
 */
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Star,
  MapPin,
  ChevronDown,
  ExternalLink,
  Music,
  Building2,
  Users,
  Hotel,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicalCard from "@/components/MusicalCard";
import CityCard from "@/components/CityCard";
import MusicalFilters, { type FilterCategory, type SortOption, type CountryFilter } from "@/components/MusicalFilters";
import PlzSearch, { musicalInRadius, type PlzSearchState } from "@/components/PlzSearch";
import {
  musicals,
  cities,
  ACTIVE_MUSICAL_IDS,
  getFeaturedMusicals,
  getActiveMusicalCountByCity,
  createAwinLink,
  type Musical,
} from "@/lib/data";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/hero-stage-LExvJcmcPP3dpbDQunFpAD.webp";
const ATMOSPHERE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/musical-atmosphere-4CsbZ3XqCMsoLK2mN9oi9f.webp";

// Österreichische Städte (für Länderfilter)
const AT_CITIES = new Set(["Graz", "Wien", "Innsbruck", "Linz", "Bad Ischl", "Dornbirn", "Ried im Innkreis", "Vöcklabruck", "Puch bei Salzburg", "Feldkirch", "Salzburg"]);
// Schweizer Städte
const CH_CITIES = new Set(["Zürich", "Basel", "Bern", "Genève", "Lausanne", "Luzern", "St. Gallen"]);

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("alle");
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("alle");
  const [cityFilter, setCityFilter] = useState<string>("alle");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [plzSearch, setPlzSearch] = useState<PlzSearchState>({
    active: false,
    plz: "",    radius: 50,
    originCoords: null,
  });

  const [showAllMusicals, setShowAllMusicals] = useState(false);
  const [showMorePulsed, setShowMorePulsed] = useState(false); // Puls-Effekt einmalig für "Alle anzeigen"-Button
  const [showFilters, setShowFilters] = useState(false); // Mobile: zugeklappt
  const [filterPulsed, setFilterPulsed] = useState(false); // Puls-Effekt einmalig
  const firstResultRef = useRef<HTMLDivElement>(null);

  const scrollToFirstResult = useCallback(() => {
    requestAnimationFrame(() => {
      const el = firstResultRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }, []);

  const handlePlzSearch = useCallback((state: PlzSearchState) => {
    setPlzSearch(state);
    if (state.active) {
      // Kurz warten bis filteredMusicals neu berechnet wurde
      setTimeout(scrollToFirstResult, 80);
    }
  }, [scrollToFirstResult]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  // PLZ-Suche aus Header-Overlay empfangen und zu erstem Ergebnis scrollen
  useEffect(() => {
    const handlePlzEvent = (e: Event) => {
      const state = (e as CustomEvent<PlzSearchState>).detail;
      setPlzSearch(state);
      if (state.active) {
        setTimeout(() => {
          const el = firstResultRef.current;
          if (!el) return;
          const top = el.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 250);
      }
    };
    window.addEventListener('plz-search-update', handlePlzEvent);
    return () => window.removeEventListener('plz-search-update', handlePlzEvent);
  }, []);

  const featured = useMemo(() => getFeaturedMusicals(), []);

  const filteredMusicals = useMemo(() => {
    let result = musicals;

    // Nur fertig eingerichtete Musicals anzeigen (gesteuert über ACTIVE_MUSICAL_IDS in data.ts)
    result = result.filter((m) => ACTIVE_MUSICAL_IDS.includes(m.id) || ACTIVE_MUSICAL_IDS.includes(m.slug));

    // Filter nach Kategorie
    if (categoryFilter !== "alle") {
      result = result.filter((m) => {
        // Neue categories-Array-Logik
        if (m.categories && m.categories.length > 0) {
          return m.categories.includes(categoryFilter as any);
        }
        // Fallback auf altes category-Feld
        if (categoryFilter === "fester-standort") return m.category === "ensuite";
        if (categoryFilter === "kinder") return m.category === "kinder";
        if (categoryFilter === "tournee") return m.category === "tournee";
        return false;
      });
    }

    // Filter nach Land
    if (countryFilter !== "alle") {
      result = result.filter((m) => {
        const allCities: string[] = [
          ...(m.city ? [m.city] : []),
          ...(m.cities || []),
          ...(m.tourDates?.map((t) => t.city) || []),
        ];
        if (countryFilter === "at") return allCities.some((c) => AT_CITIES.has(c));
        if (countryFilter === "ch") return allCities.some((c) => CH_CITIES.has(c));
        if (countryFilter === "de") return allCities.some((c) => !AT_CITIES.has(c) && !CH_CITIES.has(c));
        return true;
      });
    }

    // Filter nach Stadt
    if (cityFilter !== "alle") {
      result = result.filter((m) => {
        // Prüfe m.city (einzelne Stadt)
        if (m.city === cityFilter) return true;
        // Prüfe m.cities (Array)
        if (m.cities && m.cities.includes(cityFilter)) return true;
        // Prüfe tourDates
        if (m.tourDates && m.tourDates.some((t) => t.city === cityFilter)) return true;
        return false;
      });
    }

    // Sortierung
    if (sortOption === "name") {
      result = result.sort((a, b) => a.title.localeCompare(b.title, "de"));
    } else if (sortOption === "date") {
      // Früheste Vorstellung zuerst (aus tourDates oder startDate)
      result = result.sort((a, b) => {
        const getEarliestDate = (m: Musical): string => {
          if (m.tourDates && m.tourDates.length > 0) {
            return m.tourDates.map((t) => t.startDate).sort()[0];
          }
          return "9999-12-31";
        };
        return getEarliestDate(a).localeCompare(getEarliestDate(b));
      });
    } else if (sortOption === "featured") {
      // Featured musicals first, then by name
      result = result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title, "de");
      });
    }

    // Filter nach PLZ-Umkreis
    if (plzSearch.active && plzSearch.originCoords) {
      result = result.filter((m) =>
        musicalInRadius(m, plzSearch.originCoords!, plzSearch.radius)
      );
    }

    return result;
  }, [categoryFilter, countryFilter, cityFilter, sortOption, plzSearch]);

  const displayedMusicals = showAllMusicals ? filteredMusicals : filteredMusicals.slice(0, 9);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Theaterbühne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-px bg-gold/50" />
              <Star className="w-4 h-4 text-gold" />
              <div className="w-16 h-px bg-gold/50" />
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              Dein Portal für{" "}
              <span className="gold-gradient">Musical-Erlebnisse</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed font-body">
              Entdecke die besten Musicals in Deutschland, Österreich und der Schweiz – ob legendäre Dauerbrenner in den großen Metropolen, spektakuläre Tourneen direkt in deiner Nähe bis hin zum ersten Musical-Erlebnis für die kleinsten Fans. <span className="text-gold font-semibold">Licht aus, Magie an!</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-gold" />
                <span className="text-white/80 text-sm">{ACTIVE_MUSICAL_IDS.length} Musicals</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <span className="text-white/80 text-sm">{(() => { const s = new Set<string>(); musicals.filter(m => ACTIVE_MUSICAL_IDS.includes(m.id) || ACTIVE_MUSICAL_IDS.includes(m.slug)).forEach(m => { if (m.city) s.add(m.city); if (m.cities) m.cities.forEach(c => s.add(c)); if (m.tourDates) m.tourDates.forEach(t => s.add(t.city)); }); return s.size; })()} Städte</span>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#musicals"
                className="px-8 py-3.5 bg-gold text-background font-semibold rounded-sm hover:bg-gold-light transition-colors tracking-wide inline-flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                Alle Musicals entdecken
              </a>
              <a
                href="#staedte"
                className="px-8 py-3.5 border border-gold/40 text-gold font-semibold rounded-sm hover:bg-gold/10 transition-colors tracking-wide inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Musical-Städte
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => {
            const element = document.getElementById('musicals');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ChevronDown className="w-6 h-6 text-gold/50 hover:text-gold transition-colors" />
        </motion.div>
      </section>

      {/* ===== FEATURED MUSICALS ===== */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Highlights</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
            Top Musical-Empfehlungen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((musical, i) => (
              <MusicalCard key={musical.id} musical={musical} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="container"><div className="gold-line" /></div>

      {/* ===== ALL MUSICALS ===== */}
      <section id="musicals" className="py-16 md:py-24 scroll-mt-24">
        <div className="container">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">VORHANG AUF</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Alle Musicals und Shows – wo Träume lebendig werden
          </h2>
          <p className="text-white max-w-2xl mb-10">
            Spürst du es auch? Das leise Prickeln im Bauch, wenn das Licht im Saal langsam erlischt und der erste Ton erklingt? Willkommen in der magischen Welt der Musicals! Finde das Musical, dass dein Herz höher schlagen lässt.
          </p>

          {/* Advanced Filters – Mobile Akkordeon, Desktop immer sichtbar */}
          <div className="mb-10">
            {/* Mobile Toggle Button */}
            {(() => {
              const activeCount = [
                categoryFilter !== "alle",
                countryFilter !== "alle",
                cityFilter !== "alle",
                sortOption !== "featured",
                plzSearch.active,
              ].filter(Boolean).length;
              return (
                <button
                  className={`md:hidden w-full flex items-center justify-between px-4 py-3.5 bg-card rounded-sm mb-0 transition-all duration-300 ${
                    showFilters
                      ? "border-2 border-gold/70 shadow-[0_0_14px_rgba(184,148,74,0.30)]"
                      : filterPulsed
                        ? "border border-gold/40"
                        : "border-2 border-gold/60 shadow-[0_0_18px_rgba(184,148,74,0.40)] animate-pulse-once"
                  }`}
                  onClick={() => { setShowFilters((v) => !v); setFilterPulsed(true); }}
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-gold">
                    <SlidersHorizontal className="w-4 h-4" />
                    Musicals filtern & sortieren
                    {activeCount > 0 && (
                      <span className="text-xs bg-gold text-black px-2 py-0.5 rounded-full font-bold">
                        {activeCount} aktiv
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="text-gold font-semibold">{filteredMusicals.length}</span> Ergebnisse
                    <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
                  </span>
                </button>
              );
            })()}

            {/* Filter Panel: auf Mobile nur wenn showFilters, auf Desktop immer */}
            <div className={`p-6 bg-card border border-gold/10 rounded-sm ${
              showFilters ? "block" : "hidden md:block"
            } ${showFilters ? "rounded-t-none border-t-0" : ""}`}>
              <MusicalFilters
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                countryFilter={countryFilter}
                setCountryFilter={setCountryFilter}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                sortOption={sortOption}
                setSortOption={setSortOption}
                plzSearch={plzSearch}
                setPlzSearch={handlePlzSearch}
                resultCount={filteredMusicals.length}
              />
            </div>
          </div>

          {/* Musical Grid – Scroll-Anker direkt nach Filter-Section */}
          <div ref={firstResultRef} className="scroll-mt-6" />
          {filteredMusicals.length === 0 ? (
            <div className="text-center py-16 px-6 border border-gold/10 rounded-sm bg-card/30">
              {plzSearch.active ? (
                <>
                  <MapPin className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Kein Musical in deiner Nähe
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Im Umkreis von <span className="text-gold font-semibold">{plzSearch.radius} km</span> um PLZ <span className="text-gold font-semibold">{plzSearch.plz}</span> wurde kein Musical gefunden.
                    Versuche einen größeren Radius oder entferne andere Filter.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[100, 150].filter(r => r > plzSearch.radius).map(r => (
                      <button
                        key={r}
                        onClick={() => setPlzSearch({ ...plzSearch, radius: r })}
                        className="px-4 py-2 text-sm rounded-sm border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                      >
                        Radius auf {r} km erhöhen
                      </button>
                    ))}
                    <button
                      onClick={() => setPlzSearch({ active: false, plz: '', radius: 50, originCoords: null })}
                      className="px-4 py-2 text-sm rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      Umkreissuche aufheben
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Music className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Keine Musicals gefunden
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Für diese Filterkombination gibt es aktuell keine Ergebnisse.
                  </p>
                  <button
                    onClick={() => {
                      setCategoryFilter('alle');
                      setCountryFilter('alle');
                      setCityFilter('alle');
                    }}
                    className="px-4 py-2 text-sm rounded-sm border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                  >
                    Filter zurücksetzen
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMusicals.map((musical, i) => (
                <MusicalCard key={musical.id} musical={musical} index={i} />
              ))}
            </div>
          )}

          {/* Show More */}
          {!showAllMusicals && filteredMusicals.length > 9 && (
            <div className="text-center mt-10">
              <button
                onClick={() => { setShowAllMusicals(true); setShowMorePulsed(true); }}
                className={`px-8 py-3 font-semibold rounded-sm transition-all duration-300 inline-flex items-center gap-2 text-gold ${
                  showMorePulsed
                    ? "border border-gold/40 hover:bg-gold/10"
                    : "border-2 border-gold/60 shadow-[0_0_18px_rgba(184,148,74,0.40)] animate-pulse-once hover:bg-gold/10"
                }`}
              >
                Alle {filteredMusicals.length} Musicals anzeigen
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="container"><div className="gold-line" /></div>

      {/* ===== TOURNEESTÄDTE ===== */}
      <section id="staedte" className="py-16 md:py-24 scroll-mt-24">
        <div className="container">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Destinationen</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Musical-Städte in Deutschland, Österreich und der Schweiz
          </h2>
          <p className="text-white max-w-2xl mb-10">
            Vom Hamburger Hafen bis zu den Prachtboulevards von Wien – entdecke die schönsten Musical-Metropolen und mach deine Reise mit dem perfekten Hotel zu einem Erlebnis, das du nie vergisst!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[...cities].sort((a, b) => a.name.localeCompare(b.name, "de")).map((city, i) => (
              <CityCard key={city.slug} city={city} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOTELS SECTION ===== */}
      <section id="hotels" className="py-16 md:py-24 scroll-mt-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ATMOSPHERE_IMAGE}
            alt="Theater-Atmosphäre"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>

        <div className="container relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Übernachtung</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hotels in Musical-Städten
          </h2>
          <p className="text-white max-w-2xl mb-10">
            Mach deinen Musical-Besuch zum perfekten Kurzurlaub. Finde passende Hotels in der Nähe der Theater.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...cities]
              .filter((city) => getActiveMusicalCountByCity(city.name) > 0)
              .sort((a, b) => a.name.localeCompare(b.name, "de"))
              .map((city, i) => (
              <motion.a
                key={city.slug}
                href={city.hotelSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card border border-gold/10 rounded-sm p-6 hover:border-gold/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getActiveMusicalCountByCity(city.name)} {getActiveMusicalCountByCity(city.name) === 1 ? "Musical" : "Musicals"}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gold/50 group-hover:text-gold transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Entdecke Hotels in {city.name} und buche deine Übernachtung für das Musical-Wochenende.
                </p>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href={`https://www.awin1.com/cread.php?awinmid=15152&awinpid=2865727&clickref=hotel-alle&ued=${encodeURIComponent('https://www.hrs.de/web3/search.do?searchterm=Deutschland&adults=2&rooms=1')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-gold/40 text-gold font-semibold rounded-sm hover:bg-gold/10 transition-colors"
            >
              Alle Hotels bei HRS durchsuchen
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>



      {/* Gold Divider */}
      <div className="container"><div className="gold-line" /></div>

      <Footer />
    </div>
  );
}
