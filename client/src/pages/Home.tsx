/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Home: Startseite mit Hero, Featured Musicals, alle Musicals mit erweiterten Filtern, Städte, Anbieter
 */
import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicalCard from "@/components/MusicalCard";
import CityCard from "@/components/CityCard";
import MusicalFilters, { type FilterCategory, type SortOption } from "@/components/MusicalFilters";
import {
  musicals,
  cities,
  ACTIVE_MUSICAL_IDS,
  getFeaturedMusicals,
  getActiveMusicalCountByCity,
  createAwinLink,
  type Musical,
} from "@/lib/data";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/aschenbroedel-hero-notxt_8f57ea95.png";
const ATMOSPHERE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/musical-atmosphere-4CsbZ3XqCMsoLK2mN9oi9f.webp";

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("alle");
  const [cityFilter, setCityFilter] = useState<string>("alle");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [showAllMusicals, setShowAllMusicals] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const featured = useMemo(() => getFeaturedMusicals(), []);

  const filteredMusicals = useMemo(() => {
    let result = musicals;

    // Nur fertig eingerichtete Musicals anzeigen (gesteuert über ACTIVE_MUSICAL_IDS in data.ts)
    result = result.filter((m) => ACTIVE_MUSICAL_IDS.includes(m.id) || ACTIVE_MUSICAL_IDS.includes(m.slug));

    // Filter nach Kategorie
    if (categoryFilter !== "alle") {
      result = result.filter((m) => m.category === categoryFilter);
    }

    // Filter nach Stadt
    if (cityFilter !== "alle") {
      const selectedCityName = cities.find((c) => c.slug === cityFilter)?.name;
      result = result.filter((m) => {
        // Prüfe sowohl m.city (einzelne Stadt) als auch m.cities (Array)
        if (m.city === selectedCityName) return true;
        if (m.cities && m.cities.includes(selectedCityName || "")) return true;
        return false;
      });
    }

    // Sortierung
    if (sortOption === "name") {
      result = result.sort((a, b) => a.title.localeCompare(b.title, "de"));
    } else if (sortOption === "city") {
      result = result.sort((a, b) => {
        const cityA = a.city || "";
        const cityB = b.city || "";
        return cityA.localeCompare(cityB, "de");
      });
    } else if (sortOption === "featured") {
      // Featured musicals first, then by name
      result = result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title, "de");
      });
    }

    return result;
  }, [categoryFilter, cityFilter, sortOption]);

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
                <span className="text-white/80 text-sm">{cities.filter(c => getActiveMusicalCountByCity(c.name) > 0).length} Städte</span>
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
            Alle Musicals & Shows – wo Träume lebendig werden
          </h2>
          <p className="text-white max-w-2xl mb-10">
            Spürst du es auch? Das leise Prickeln im Bauch, wenn das Licht im Saal langsam erlischt und der erste Ton erklingt? Willkommen in der magischen Welt der Musicals! Finde das Musical, dass dein Herz höher schlagen lässt.
          </p>

          {/* Advanced Filters */}
          <div className="mb-10 p-6 bg-card border border-gold/10 rounded-sm">
            <MusicalFilters
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              sortOption={sortOption}
              setSortOption={setSortOption}
              resultCount={filteredMusicals.length}
            />
          </div>

          {/* Musical Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMusicals.map((musical, i) => (
              <MusicalCard key={musical.id} musical={musical} index={i} />
            ))}
          </div>

          {/* Show More */}
          {!showAllMusicals && filteredMusicals.length > 9 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllMusicals(true)}
                className="px-8 py-3 border border-gold/40 text-gold font-semibold rounded-sm hover:bg-gold/10 transition-colors inline-flex items-center gap-2"
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
            Musical-Städte in Deutschland, Österreich & der Schweiz
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
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city.name)}&checkin_month=&checkin_monthday=&checkin_year=&checkout_month=&checkout_monthday=&checkout_year=&group_adults=2&no_rooms=1&group_children=0`}
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
              href="https://www.booking.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-gold/40 text-gold font-semibold rounded-sm hover:bg-gold/10 transition-colors"
            >
              Alle Hotels durchsuchen
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
