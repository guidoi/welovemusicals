/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Home: Startseite mit Hero, Featured Musicals, alle Musicals, Städte, Anbieter
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Star,
  MapPin,
  Filter,
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
import {
  musicals,
  cities,
  providers,
  getFeaturedMusicals,
  createAwinLink,
  type Musical,
} from "@/lib/data";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/hero-stage-LExvJcmcPP3dpbDQunFpAD.webp";
const ATMOSPHERE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/musical-atmosphere-4CsbZ3XqCMsoLK2mN9oi9f.webp";

type FilterCategory = "alle" | "standort" | "tournee" | "familie";
type FilterProvider = "alle" | string;

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("alle");
  const [providerFilter, setProviderFilter] = useState<FilterProvider>("alle");
  const [showAllMusicals, setShowAllMusicals] = useState(false);

  const featured = useMemo(() => getFeaturedMusicals(), []);

  const filteredMusicals = useMemo(() => {
    let result = musicals;
    if (categoryFilter !== "alle") {
      result = result.filter((m) => m.category === categoryFilter);
    }
    if (providerFilter !== "alle") {
      result = result.filter((m) => m.provider === providerFilter);
    }
    return result;
  }, [categoryFilter, providerFilter]);

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
              Entdecke die besten Musicals in Deutschland. Tickets sichern, Hotels buchen
              und unvergessliche Abende erleben.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-gold" />
                <span className="text-white/80 text-sm">{musicals.length} Musicals</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <span className="text-white/80 text-sm">{cities.length} Städte</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gold" />
                <span className="text-white/80 text-sm">{providers.length} Anbieter</span>
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
                Tourneestädte
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gold/50" />
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
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Programm</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Alle Musicals & Shows
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-8">
            Entdecke alle aktuellen Musical-Produktionen in Deutschland – von Standort-Musicals über Tourneen bis hin zu Familienmusicals.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {(["alle", "standort", "tournee", "familie"] as FilterCategory[]).map((cat) => {
                const labels: Record<FilterCategory, string> = {
                  alle: "Alle",
                  standort: "Standort",
                  tournee: "Tournee",
                  familie: "Familie",
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 text-sm rounded-sm border transition-all ${
                      categoryFilter === cat
                        ? "bg-gold text-background border-gold font-semibold"
                        : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                    }`}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>

            {/* Provider Filter */}
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="px-4 py-2 text-sm rounded-sm border border-border bg-card text-foreground focus:border-gold outline-none"
            >
              <option value="alle">Alle Anbieter</option>
              {providers.map((p) => (
                <option key={p.slug} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredMusicals.length} {filteredMusicals.length === 1 ? "Ergebnis" : "Ergebnisse"}
          </p>

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
            Musical-Städte in Deutschland
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Von Hamburg bis München – entdecke die wichtigsten Musical-Standorte und finde passende Hotels für deinen Musical-Trip.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {cities.map((city, i) => (
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
          <p className="text-muted-foreground max-w-2xl mb-10">
            Mach deinen Musical-Besuch zum perfekten Kurzurlaub. Finde passende Hotels in der Nähe der Theater.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.slice(0, 6).map((city, i) => (
              <motion.a
                key={city.slug}
                href={city.hotelSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-card border border-border/50 rounded-sm p-5 hover:border-gold/30 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                    Hotels in {city.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {city.musicalCount} {city.musicalCount === 1 ? "Musical" : "Musicals"} in der Stadt
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Hotel className="w-5 h-5 text-gold/50 group-hover:text-gold transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="container"><div className="gold-line" /></div>

      {/* ===== ANBIETER ===== */}
      <section id="anbieter" className="py-16 md:py-24 scroll-mt-24">
        <div className="container">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Partner</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Unsere Musical-Anbieter
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Wir arbeiten mit den führenden Musical-Produzenten und Veranstaltern Deutschlands zusammen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider, i) => (
              <motion.div
                key={provider.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-sm p-6 hover:border-gold/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                    {provider.name}
                  </h3>
                  <Building2 className="w-5 h-5 text-gold/30 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {provider.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">
                    {musicals.filter((m) => m.provider === provider.name).length} Produktionen
                  </span>
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1"
                  >
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AFFILIATE CTA ===== */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold/50" />
            <Ticket className="w-5 h-5 text-gold" />
            <div className="w-12 h-px bg-gold/50" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bereit für dein Musical-Erlebnis?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Sichere dir jetzt Tickets für die besten Musicals in Deutschland – bequem und sicher über Eventim.
          </p>
          <a
            href={createAwinLink("https://www.eventim.de/events/musical-show-4/")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-background font-bold rounded-sm hover:bg-gold-light transition-colors text-lg tracking-wide"
          >
            Jetzt Tickets bei Eventim sichern
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-xs text-muted-foreground/50 mt-4">
            Weiterleitung zu eventim.de – Affiliate-Link
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
