/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * CityDetail: Detailseite für eine Musical-Stadt mit Musicals und Hotels
 */
import { useParams, Link } from "wouter";
import { useLayoutEffect } from "react";
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
import { getCityBySlug, getMusicalsByCity, getActiveMusicalsByCity, getActiveMusicalCountByCity, cities } from "@/lib/data";
import { useSEO } from "@/hooks/useSEO";
import SchemaOrgCity from "@/components/SchemaOrgCity";
import { scheduleScrollToTop } from "@/lib/route-scroll";
import TicketsAndHotel from "@/components/TicketsAndHotel";
import { CITY_PROGRAM_SUBLINE, getCityProgramHeading } from "@/lib/city-program-heading";
import { getCitySeo } from "@/lib/city-seo";
import { SHOW_CITY_HOTEL_SECTIONS } from "@/lib/hotel-experience";
import { useManagedMusicals } from "@/contexts/PricingContext";

export default function CityDetail() {
  const params = useParams<{ slug: string }>();
  const { musicals: managedMusicals } = useManagedMusicals();
  const city = getCityBySlug(params.slug || "");

  useLayoutEffect(() => {
    // Repeat after the first frame and image/layout restoration to defeat scroll restoration from a deep home-page link.
    return scheduleScrollToTop(
      (options) => window.scrollTo(options),
      {
        requestFrame: (callback) => requestAnimationFrame(callback),
        cancelFrame: (frameId) => cancelAnimationFrame(frameId),
        setDelay: (callback, delay) => window.setTimeout(callback, delay),
        clearDelay: (timeoutId) => window.clearTimeout(timeoutId),
      },
    );
  }, [params.slug]);

  // Dynamische SEO-Meta-Tags
  const musicalCount = city ? getActiveMusicalCountByCity(city.name, managedMusicals) : 0;
  const citySeo = city ? getCitySeo(city, musicalCount) : null;
  const seoTitle = citySeo?.title ?? "Stadt nicht gefunden | We Love Musicals";
  const seoDescription = citySeo?.description ?? "";
  const canonicalUrl = city
    ? `https://welovemusicals.com/stadt/${params.slug}`
    : undefined;
  useSEO({
    title: seoTitle,
    description: seoDescription,
    image: city?.image,
    url: canonicalUrl,
  });

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

  const cityMusicals = getActiveMusicalsByCity(city.name, managedMusicals);
  const otherCities = [...cities].sort((a, b) => a.name.localeCompare(b.name, "de")).filter((c) => c.slug !== city.slug).slice(0, 5);

  return (
    <>
      <SchemaOrgCity city={city} musicals={cityMusicals} />
      <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Anker für Scroll-to-Top */}
      <div id="city-top" />

      {/* Floating Back Button */}
      <Link
        href="/"
        className="fixed top-20 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-gold/35 bg-black/60 text-gold backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:text-gold-light shadow-lg"
        aria-label="Zurück zur Übersicht"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      {/* Hero */}
      <section id="city-hero" className="relative min-h-[45vh] flex items-end overflow-hidden pt-20">
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
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="text-sm text-gold uppercase tracking-wider">Musical-Stadt</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
              {citySeo?.heading}
            </h1>
            <p className="text-lg text-cream/75 max-w-2xl">
              {city.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-gold" />
                <span className="text-cream/80 text-sm">
                  {getActiveMusicalCountByCity(city.name)} {getActiveMusicalCountByCity(city.name) === 1 ? "Musical" : "Musicals"}
                </span>
              </div>
              {SHOW_CITY_HOTEL_SECTIONS && (
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
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Musicals in this City */}
      <section id="programm" className="py-12 md:py-16 scroll-mt-24">
        <div className="container">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-foreground">
              {getCityProgramHeading(city.name)}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-gold">
              {CITY_PROGRAM_SUBLINE}
            </p>
          </div>

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

      {SHOW_CITY_HOTEL_SECTIONS && <TicketsAndHotel city={city} />}

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
                className="group relative aspect-[4/3] rounded-sm overflow-hidden border border-border/30 transition-all md:hover:border-gold md:hover:shadow-[0_0_0_1px_rgba(218,185,99,0.3)] focus-visible:outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                <img
                  src={otherCity.image}
                  alt={otherCity.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-display text-sm font-semibold text-cream group-hover:text-gold transition-colors">
                    {otherCity.name}
                  </h3>
                  <p className="text-xs text-cream/60">
                    {getActiveMusicalCountByCity(otherCity.name)} {getActiveMusicalCountByCity(otherCity.name) === 1 ? "Musical" : "Musicals"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
}
