/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * CityDetail: Detailseite für eine Musical-Stadt mit Musicals und Hotels
 */
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Hotel,
  ExternalLink,
  Music,
  Ticket,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicalCard from "@/components/MusicalCard";
import { getCityBySlug, getMusicalsByCity, cities } from "@/lib/data";

export default function CityDetail() {
  const params = useParams<{ slug: string }>();
  const city = getCityBySlug(params.slug || "");

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Stadt nicht gefunden
            </h1>
            <Link href="/" className="text-gold hover:text-gold-light transition-colors">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cityMusicals = getMusicalsByCity(city.name);
  const otherCities = cities.filter((c) => c.slug !== city.slug).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
        </div>

        <div className="relative z-10 container pb-10 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Zurück zur Übersicht</span>
            </Link>

            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="text-sm text-gold uppercase tracking-wider">Musical-Stadt</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
              Musicals in {city.name}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              {city.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-gold" />
                <span className="text-white/80 text-sm">
                  {cityMusicals.length} {cityMusicals.length === 1 ? "Musical" : "Musicals"}
                </span>
              </div>
              <a
                href={city.hotelSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
              >
                <Hotel className="w-4 h-4" />
                <span className="text-sm">Hotels finden</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Musicals in this City */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Programm</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            Aktuelle Musicals in {city.name}
          </h2>

          {cityMusicals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityMusicals.map((musical, i) => (
                <MusicalCard key={musical.id} musical={musical} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border/50 rounded-sm p-8 text-center">
              <Music className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aktuell sind keine Musicals in {city.name} gelistet. Schau bald wieder vorbei!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Hotel Section */}
      <section className="py-12 md:py-16 bg-card/50">
        <div className="container">
          <div className="gold-line mb-10" />
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Übernachtung</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Hotels in {city.name}
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-8">
            Mach deinen Musical-Besuch in {city.name} zum perfekten Kurzurlaub. Finde passende Hotels in der Nähe der Theater.
          </p>

          <a
            href={city.hotelSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-background font-bold rounded-sm hover:bg-gold-light transition-colors"
          >
            <Hotel className="w-4 h-4" />
            Hotels in {city.name} suchen
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">
            Weitere Musical-Städte
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {otherCities.map((otherCity) => (
              <Link
                key={otherCity.slug}
                href={`/stadt/${otherCity.slug}`}
                className="group relative aspect-[4/3] rounded-sm overflow-hidden border border-border/30 hover:border-gold/30 transition-all"
              >
                <img
                  src={otherCity.image}
                  alt={otherCity.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-display text-sm font-semibold text-white group-hover:text-gold transition-colors">
                    {otherCity.name}
                  </h3>
                  <p className="text-xs text-white/60">
                    {otherCity.musicalCount} Musicals
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
