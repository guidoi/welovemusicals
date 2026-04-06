/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalDetail: Detailseite für einzelnes Musical mit erweiterten Komponenten
 */
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Ticket,
  ExternalLink,
  Hotel,
  Tag,
  Building2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicalCard from "@/components/MusicalCard";
import MusicalKeyVisual from "@/components/MusicalKeyVisual";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import MusicalQuotes from "@/components/MusicalQuotes";
import MusicalGallery from "@/components/MusicalGallery";
import MusicalShowFacts from "@/components/MusicalShowFacts";
import MusicalFAQSection from "@/components/MusicalFAQ";
import TourDates from "@/components/TourDates";
import { getMusicalBySlug, musicals, cities, createAwinLink } from "@/lib/data";

export default function MusicalDetail() {
  const params = useParams<{ slug: string }>();
  const musical = getMusicalBySlug(params.slug || "");

  if (!musical) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Musical nicht gefunden
            </h1>
            <Link href="/" className="text-accent hover:text-accent/80 transition-colors">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get related musicals (same provider or category, excluding current)
  const related = musicals
    .filter((m) => m.id !== musical.id && (m.provider === musical.provider || m.category === musical.category))
    .slice(0, 3);

  // Get relevant cities
  const relevantCities = musical.city
    ? cities.filter((c) => c.name === musical.city)
    : cities.filter((c) => musical.cities?.includes(c.name));

  const ticketLink = createAwinLink(musical.eventimUrl);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={musical.image}
            alt={musical.title}
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
            <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Zurück zur Übersicht</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-sm bg-accent/20 text-accent">
                {musical.category === "standort" ? "Standort-Musical" : musical.category === "tournee" ? "Tournee" : "Familienmusical"}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-sm bg-secondary text-secondary-foreground">
                {musical.provider}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
              {musical.title}
            </h1>
            {musical.subtitle && (
              <p className="text-lg text-accent/80 italic mb-4">{musical.subtitle}</p>
            )}

            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-4 h-4 text-accent" />
              {musical.city ? (
                <span>{musical.city} – {musical.venue}</span>
              ) : (
                <span>{musical.cities?.join(", ")}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Über das Musical
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                  {musical.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {musical.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm bg-secondary text-secondary-foreground"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Provider Info */}
                <div className="bg-card border border-border/50 rounded-sm p-6 mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-accent" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {musical.provider}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dieses Musical wird produziert und veranstaltet von {musical.provider}.
                    Tickets sind über Eventim erhältlich.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="sticky top-24 space-y-6"
              >
                {/* Ticket CTA */}
                <div className="bg-card border border-accent/20 rounded-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Ticket className="w-5 h-5 text-accent" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Tickets sichern
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Sichere dir jetzt deine Tickets für {musical.title} – bequem und sicher über Eventim.
                  </p>
                  <a
                    href={ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-accent-foreground font-bold rounded-sm hover:bg-accent/90 transition-colors"
                  >
                    Jetzt Tickets kaufen
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-muted-foreground/50 mt-3 text-center">
                    Weiterleitung zu eventim.de – Affiliate-Link
                  </p>
                </div>

                {/* Hotel CTA */}
                {relevantCities.length > 0 && (
                  <div className="bg-card border border-border/50 rounded-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Hotel className="w-5 h-5 text-accent" />
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        Hotels in der Nähe
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {relevantCities.slice(0, 4).map((city) => (
                        <a
                          key={city.slug}
                          href={city.hotelSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-secondary rounded-sm hover:bg-secondary/80 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-accent/50" />
                            <span className="text-sm text-foreground">Hotels in {city.name}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Keyvisual */}
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="container">
          <MusicalKeyVisual image={musical.image} title={musical.title} />
        </div>
      </section>

      {/* YouTube Video */}
      {musical.youtubeTrailerId && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Tourtrailer</h2>
            <YouTubeEmbed videoId={musical.youtubeTrailerId} title={`${musical.title} Tourtrailer`} />
          </div>
        </section>
      )}

      {/* Tour Dates */}
      {musical.tourDates && musical.tourDates.length > 0 && (
        <TourDates tourDates={musical.tourDates} />
      )}

      {/* Pressequotes */}
      {musical.quotes && musical.quotes.length > 0 && (
        <MusicalQuotes quotes={musical.quotes} />
      )}

      {/* Gallery */}
      {musical.gallery && musical.gallery.length > 0 && (
        <MusicalGallery images={musical.gallery} />
      )}

      {/* Show Facts */}
      {musical.showFacts && musical.showFacts.length > 0 && (
        <MusicalShowFacts facts={musical.showFacts} />
      )}

      {/* FAQ */}
      {musical.faqItems && musical.faqItems.length > 0 && (
        <MusicalFAQSection items={musical.faqItems} />
      )}

      {/* Related Musicals */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 bg-card/50">
          <div className="container">
            <div className="border-t border-border mb-10" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Ähnliche Musicals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((m, i) => (
                <MusicalCard key={m.id} musical={m} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
