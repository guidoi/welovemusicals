/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalDetail: Detailseite für einzelnes Musical mit erweiterten Komponenten
 */
import { useParams, Link } from "wouter";
import { useEffect, useRef, useState } from "react";
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
import { getMusicalBySlug, musicals, cities, createAwinLink, providers } from "@/lib/data";

export default function MusicalDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const musical = getMusicalBySlug(slug);

  // Force re-render when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Sticky CTA: ausblenden wenn Tourtermine sichtbar
  const tourDatesRef = useRef<HTMLDivElement>(null);
  const topCtaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Einblenden erst wenn oberer Button aus dem Viewport gescrollt ist
      const topCtaGone = topCtaRef.current
        ? topCtaRef.current.getBoundingClientRect().bottom < 0
        : true;
      // Ausblenden wenn Tourtermine-Sektion sichtbar ist
      const tourDatesVisible = tourDatesRef.current
        ? tourDatesRef.current.getBoundingClientRect().top <= window.innerHeight &&
          tourDatesRef.current.getBoundingClientRect().bottom > 0
        : false;
      setShowSticky(topCtaGone && !tourDatesVisible);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Get provider info
  const providerInfo = providers.find((p) => p.name === musical.provider);

  const ticketLink = createAwinLink(musical.eventimUrl);
  const keyvisualTicketLink = musical.keyvisualLink ?? ticketLink;
  const ctaTicketLink = musical.ticketCtaUrl ?? ticketLink;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={musical.image}
            alt={musical.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="relative z-10 container pb-10 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-6 text-primary hover:text-primary/80">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Zurück zur Übersicht</span>
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {musical.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-sm bg-secondary text-secondary-foreground"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
              {musical.title}
            </h1>
            {musical.subtitle && (
              <p className="text-lg italic mb-4 text-primary/80">{musical.subtitle}</p>
            )}

            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-4 h-4 text-primary" />
              {musical.city ? (
                <span>{musical.city} – {musical.venue}</span>
              ) : (
                <span>{musical.cities?.join(", ")}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>



      {/* Mobile CTA – direkt nach Hero für alle Musicals */}
      {ctaTicketLink && (
        <div ref={topCtaRef} className="lg:hidden bg-background px-4 pt-6 pb-2">
          <a
            href={ctaTicketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 rounded-sm py-3 text-sm font-semibold tracking-wide"
          >
            <Ticket className="w-4 h-4" />
            Tickets buchen{musical.priceFrom && <span className="font-normal opacity-75 ml-1">– ab {musical.priceFrom} €</span>}
          </a>
        </div>
      )}

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Keyvisual - Desktop Right Only */}
            <div className="hidden lg:block lg:col-span-1 order-1 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MusicalKeyVisual image={musical.keyvisual || musical.image} title={musical.title} ticketLink={keyvisualTicketLink} />
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 order-2 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {musical.detailHeadline || "Über das Musical"}
                </h2>
                {musical.detailDescription ? (
                  <div className="text-white leading-relaxed text-lg mb-8 space-y-4 md:space-y-6">
                    {musical.detailDescription.split('\n\n').map((paragraph, i) => (
                      <div key={i}>
                        <p>{paragraph}</p>
                        {/* Mobile Keyvisual: nach Absatz 0 bei Drei Haselnüsse, nach Absatz 2 bei FJG, sonst nach Absatz 1 */}
                        {(musical.id === 'dreihaselnuesse' ? i === 0 : musical.id === 'fackjugoehte' ? i === 2 : i === 1) && (
                          <div className="lg:hidden my-8">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              <MusicalKeyVisual image={musical.keyvisual || musical.image} title={musical.title} ticketLink={keyvisualTicketLink} />
                            </motion.div>
                          </div>
                        )}
                        {/* Mobile Video: nach Absatz 0 bei Sister Act & Dracula, nach Absatz 1 bei FJG */}
                        {((i === 0 && (musical.id === 'sisteract' || musical.id === 'dracula')) || (i === 1 && musical.id === 'fackjugoehte')) && musical.youtubeTrailerId && (
                          <div className="lg:hidden my-8">
                            <YouTubeEmbed videoId={musical.youtubeTrailerId} title={`${musical.title} Tourtrailer`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white leading-relaxed text-lg mb-8">
                    {musical.description}
                  </p>
                )}

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


              </motion.div>
            </div>

          </div>
        </div>
      </section>



      {/* YouTube Video */}
      {musical.youtubeTrailerId && (
        <section className="hidden lg:block py-12 md:py-16 bg-background">
          <div className="container max-w-4xl">
            <YouTubeEmbed videoId={musical.youtubeTrailerId} title={`${musical.title} Tourtrailer`} />
          </div>
        </section>
      )}

      {/* Tour Dates */}
      <div ref={tourDatesRef}>
        {musical.tourDates && musical.tourDates.length > 0 && (
          <TourDates tourDates={musical.tourDates} forceDropdown={musical.id === "dreihaselnuesse"} />
        )}
      </div>

      {/* Story */}
      {musical.storyHeadline && musical.storyText && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                {musical.storyHeadline}
              </h2>
              <div className="prose prose-invert max-w-none">
                {musical.storyText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-white/80 leading-relaxed mb-4 text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Ticket CTA – nach Tourtermine & Story, vor Pressequotes */}
      <section className="py-8 md:py-10 bg-background">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-sm p-8"
            style={{ border: '1px solid rgb(239, 68, 68)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="w-6 h-6" style={{ color: 'rgb(239, 68, 68)' }} />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Tickets sichern
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Sichere dir jetzt deine Tickets für {musical.title} – bequem und sicher über Eventim.
            </p>
            <a
              href={ctaTicketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-sm transition-colors text-lg text-white"
              style={{ backgroundColor: 'rgb(239, 68, 68)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(220, 38, 38)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(239, 68, 68)')}
            >
              Tickets
              <ExternalLink className="w-5 h-5" />
            </a>
            <p className="text-xs text-muted-foreground/50 mt-4">
              Weiterleitung zu eventim.de – Affiliate-Link
            </p>
          </motion.div>
        </div>
      </section>

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
        <MusicalShowFacts facts={musical.showFacts} provider={musical.provider} />
      )}

      {/* FAQ */}
      {musical.faqItems && musical.faqItems.length > 0 && (
        <MusicalFAQSection items={musical.faqItems} />
      )}

      {/* Hotels Section */}
      {relevantCities.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Hotels in der Nähe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relevantCities.map((city) => (
                <a
                  key={city.slug}
                  href={city.hotelSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card border border-border/50 rounded-sm p-6 hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {city.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold">
                    <Hotel className="w-4 h-4" />
                    Hotels durchsuchen
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Musicals - Hidden until final release */}
      {false && related.length > 0 && (
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

      {/* Sticky CTA – Mobile only, mit Fade-Transition */}
      {ctaTicketLink && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 shadow-lg transition-all duration-300"
          style={{ opacity: showSticky ? 1 : 0, pointerEvents: showSticky ? 'auto' : 'none', transform: showSticky ? 'translateY(0)' : 'translateY(8px)' }}
        >
          <a
            href={ctaTicketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-sm py-3 text-sm font-bold tracking-wide text-white transition-colors duration-200"
            style={{ backgroundColor: 'rgb(239, 68, 68)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(220, 38, 38)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(239, 68, 68)')}
          >
            <Ticket className="w-4 h-4" />
            Tickets buchen{musical.priceFrom && <span className="font-normal opacity-80 ml-1">– ab {musical.priceFrom} €</span>}
          </a>
        </div>
      )}

      <Footer />
    </div>
  );
}
