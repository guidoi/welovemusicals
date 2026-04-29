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
  Music2,
  Sparkles,
  Heart,
  Gift,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicalCard from "@/components/MusicalCard";
import MusicalKeyVisual from "@/components/MusicalKeyVisual";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import MusicalQuotes from "@/components/MusicalQuotes";
import MusicalGallery from "@/components/MusicalGallery";
import MusicalShowFacts from "@/components/MusicalShowFacts";
import TourDates from "@/components/TourDates";
import { getMusicalBySlug, musicals, cities, createAwinLink, providers } from "@/lib/data";
import { useSEO } from "@/hooks/useSEO";
import SchemaOrg from "@/components/SchemaOrg";

export default function MusicalDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const musical = getMusicalBySlug(slug);

  // Force re-render when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Dynamische SEO-Meta-Tags
  const seoTitle = musical
    ? `${musical.title} – Tickets & Termine | We Love Musicals`
    : "Musical nicht gefunden | We Love Musicals";
  const seoDescription = musical
    ? musical.description.length > 155
      ? musical.description.slice(0, 152) + "..."
      : musical.description
    : "";
  useSEO({
    title: seoTitle,
    description: seoDescription,
    image: musical?.image,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

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
  // Awin-spezifische Links für die drei CTA-Positionen (mit clickref)
  const heroTicketLink = musical.awinHeroUrl ?? ctaTicketLink;
  const stickyTicketLink = musical.awinStickyUrl ?? ctaTicketLink;
  const boxTicketLink = musical.awinBoxUrl ?? ctaTicketLink;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SchemaOrg musical={musical} />
      <Header />

      {/* Floating Back Button */}
      <Link
        href="/"
        className="fixed top-20 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 shadow-lg" style={{color: '#b8944a'}} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor='rgba(0,0,0,0.7)')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor='rgba(0,0,0,0.5)')}
        aria-label="Zurück zur Übersicht"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

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
              <p className="text-lg italic mb-4" style={{color: 'rgba(184,148,74,0.8)'}}>{musical.subtitle}</p>
            )}

            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-4 h-4" style={{color: '#b8944a'}} />
              {musical.city ? (
                <span>{musical.city} – {musical.venue}</span>
              ) : musical.headerCities && musical.cities ? (
                <span>{musical.headerCities.join(", ")} <span style={{color: '#b8944a'}}>und {musical.cities.length - musical.headerCities.length} weitere Tourneestädte</span></span>
              ) : (
                <span>{musical.cities?.join(", ")}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>



      {/* Mobile CTA – direkt nach Hero für alle Musicals */}
      {heroTicketLink && (
        <div ref={topCtaRef} className="lg:hidden bg-background px-4 pt-6 pb-2">
          <a
            href={heroTicketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border transition-colors duration-200 rounded-sm py-3 text-sm font-semibold tracking-wide" style={{borderColor: '#b8944a', color: '#b8944a'}} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor='#b8944a'; e.currentTarget.style.color='#1a1a1a'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='#b8944a'; }}
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
            {/* Keyvisual - Desktop linke Spalte für alle Musicals */}
            <div className="hidden lg:block lg:col-span-1 order-1 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MusicalKeyVisual image={musical.keyvisual || musical.image} title={musical.title} ticketLink={keyvisualTicketLink} landscape={musical.id === 'moulinrouge'} />
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
                    {musical.detailDescription.split('\n\n').map((paragraph, i) => {
                      // Absätze, die nur aus **Text** bestehen, als Zwischenheadline rendern
                      const headlineMatch = paragraph.match(/^\*\*(.+)\*\*$/);
                      return (
                      <div key={i}>
                        {headlineMatch ? (
                          <h3 className="font-display text-xl font-bold mt-6 mb-2 tracking-wide" style={{color: '#b8944a'}}>
                            {headlineMatch[1]}
                          </h3>
                        ) : (
                          <p>{paragraph}</p>
                        )}
                        {/* Mobile Video:
                             - Moulin Rouge!: nach i=0 (Ende "...Hansestadt.")
                             - Sister Act & Dracula: nach i=0
                             - FJG: nach i=1 */}
                        {((i === 0 && (musical.id === 'sisteract' || musical.id === 'dracula' || musical.id === 'moulinrouge')) || (i === 1 && musical.id === 'fackjugoehte')) && musical.youtubeTrailerId && (
                          <div className="lg:hidden my-8">
                            <YouTubeEmbed videoId={musical.youtubeTrailerId} title={`${musical.title} Tourtrailer`} />
                          </div>
                        )}
                        {/* Mobile Keyvisual:
                             - Moulin Rouge!: nach i=2 (nach "Von Offenbach...", vor "Das Theater...")
                             - Drei Haseelnüsse: nach i=0
                             - FJG: nach i=2
                             - alle anderen: nach i=1 */}
                        {(musical.id === 'moulinrouge' ? i === 2 : musical.id === 'dreihaselnuesse' ? i === 0 : musical.id === 'fackjugoehte' ? i === 2 : i === 1) && (
                          <div className="lg:hidden my-8">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              <MusicalKeyVisual image={musical.keyvisual || musical.image} title={musical.title} ticketLink={keyvisualTicketLink} landscape={musical.id === 'moulinrouge'} />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      );
                    })}
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
          <TourDates tourDates={musical.tourDates} forceDropdown={musical.id === "dreihaselnuesse"} musicalSlug={musical.slug} />
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

      {/* USP-Box – nur für Moulin Rouge! */}
      {musical.id === "moulinrouge" && (
        <section className="py-8 md:py-10 bg-background">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-sm overflow-hidden"
              style={{ border: '1px solid rgba(212,175,55,0.4)', background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(0,0,0,0) 60%)' }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>Das erwartet dich</p>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-1">Warum Moulin Rouge! ein Erlebnis der Extraklasse ist</h3>
              </div>

              {/* USP Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {[
                  {
                    icon: <Music2 className="w-5 h-5" />,
                    title: "Über 70 Welthits",
                    text: "u.a. von Adele, Lady Gaga, Elton John & Beyoncé",
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    title: "Atemberaubende Ausstattung",
                    text: "Kulissen, Kostüme & Choreografien auf Broadway-Niveau",
                  },
                  {
                    icon: <Heart className="w-5 h-5" />,
                    title: "Gänsehautgarantie",
                    text: "Emotionales Entertainment, das unter die Haut geht",
                  },
                  {
                    icon: <Gift className="w-5 h-5" />,
                    title: "Perfektes Geschenk",
                    text: "Das Highlight für einen unvergesslichen Abend in Hamburg",
                  },
                ].map((usp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 px-6 py-5"
                    style={{
                      borderRight: i % 2 === 0 ? '1px solid rgba(212,175,55,0.15)' : 'none',
                      borderBottom: i < 2 ? '1px solid rgba(212,175,55,0.15)' : 'none',
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center mt-0.5"
                      style={{ background: 'rgba(212,175,55,0.12)', color: 'rgb(212,175,55)' }}
                    >
                      {usp.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm leading-snug mb-0.5">{usp.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{usp.text}</p>
                    </div>
                  </div>
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
              href={boxTicketLink}
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
              {musical.slug === 'moulin-rouge'
                ? 'Weiterleitung zu atgtickets.de – Affiliate-Link'
                : 'Weiterleitung zu eventim.de – Affiliate-Link'
              }
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

      {/* Show Facts + FAQ */}
      {((musical.showFacts?.length ?? 0) > 0 || (musical.faqItems?.length ?? 0) > 0) && (
        <MusicalShowFacts facts={musical.showFacts ?? []} provider={musical.provider} faqItems={musical.faqItems} />
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
                    <h3 className="font-display text-lg font-bold text-foreground transition-colors">
                      {city.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {city.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{color: '#b8944a'}}>
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
            href={stickyTicketLink}
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
