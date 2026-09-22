/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalDetail: Detailseite für einzelnes Musical mit erweiterten Komponenten
 */
import { useParams, Link } from "wouter";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Ticket,
  ExternalLink,
  Hotel,
  Tag,
  Building2,
  Music,
  Music2,
  Sparkles,
  Heart,
  Gift,
  Crown,
  Globe,
  Star,
  CalendarDays,
  Skull,
  Users,
  Laugh,
  GraduationCap,
  Snowflake,
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
import { ACTIVE_MUSICAL_IDS, cities, createAwinLink, getActiveMusicals, providers } from "@/lib/data";
import { useManagedMusicals } from "@/contexts/PricingContext";
import { useSEO } from "@/hooks/useSEO";
import SchemaOrg from "@/components/SchemaOrg";
import AovoTanzDerVampireBanner from "@/components/AovoTanzDerVampireBanner";
import AovoCampaignBanner, { getAovoCampaign, getAovoCampaigns } from "@/components/AovoCampaignBanner";
import EventimDraculaBanner from "@/components/EventimDraculaBanner";
import EventimFackJuGoehteBanner from "@/components/EventimFackJuGoehteBanner";
import { getTicketProviderBrand, isAtgTicketMusical } from "@/lib/ticket-provider-brand";
import { SHOW_MUSICAL_HOTEL_SECTIONS } from "@/lib/hotel-experience";
import { scheduleScrollToTop } from "@/lib/route-scroll";
import { getExperienceCategory } from "@/lib/experience-categories";
import { getMusicalSeo } from "@/lib/musical-seo";
import { getRelatedMusicals } from "@/lib/related-musicals";
import { getTicketCta } from "@/lib/ticket-cta";
import { useConsent } from "@/contexts/ConsentContext";
import { trackAffiliateTicketClick, type AffiliateClickPlacement } from "@/lib/category-analytics";

function getAffiliatePartner(ticketUrl: string): "eventim" | "atg" | "stage" {
  if (ticketUrl.includes("stage-entertainment.de")) return "stage";
  if (ticketUrl.includes("atgtickets.de")) return "atg";
  return "eventim";
}

export default function MusicalDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { musicals: managedMusicals } = useManagedMusicals();
  const { consent } = useConsent();
  const musical = getActiveMusicals(managedMusicals).find((candidate) => candidate.slug === slug);

  // Reset after route, frame and layout restoration so cards from a scrolled overview always open at the page start.
  useLayoutEffect(() => {
    return scheduleScrollToTop(
      (options) => window.scrollTo(options),
      {
        requestFrame: (callback) => requestAnimationFrame(callback),
        cancelFrame: (frameId) => cancelAnimationFrame(frameId),
        setDelay: (callback, delay) => window.setTimeout(callback, delay),
        clearDelay: (timeoutId) => window.clearTimeout(timeoutId),
      },
    );
  }, [slug]);

  // Dynamische SEO-Meta-Tags – individuelle Felder aus data.ts haben Vorrang
  const musicalSeo = musical ? getMusicalSeo(musical) : null;
  const seoTitle = musicalSeo?.title ?? "Musical nicht gefunden | We Love Musicals";
  const seoDescription = musicalSeo?.description ?? "";
  const canonicalUrl = musicalSeo?.canonicalUrl;
  useSEO({
    title: seoTitle,
    description: seoDescription,
    image: musical?.image,
    url: canonicalUrl,
  });

  // Sticky CTA: ausblenden wenn Tourtermine oder roter Ticket-Kasten sichtbar
  const tourDatesRef = useRef<HTMLDivElement>(null);
  const topCtaRef = useRef<HTMLDivElement>(null);
  const ticketBoxRef = useRef<HTMLDivElement>(null);
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
      // Ausblenden wenn roter Ticket-Kasten sichtbar ist
      const ticketBoxVisible = ticketBoxRef.current
        ? ticketBoxRef.current.getBoundingClientRect().top <= window.innerHeight &&
          ticketBoxRef.current.getBoundingClientRect().bottom > 0
        : false;
      setShowSticky(topCtaGone && !tourDatesVisible && !ticketBoxVisible);
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
            <Link href="/" className="text-gold hover:text-gold-light transition-colors">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const experienceCategory = getExperienceCategory(musical.experienceCategory);

  // Shows from the same Erlebniswelt come first; provider and production type fill remaining slots.
  const related = getRelatedMusicals(
    managedMusicals.filter((candidate) => ACTIVE_MUSICAL_IDS.includes(candidate.id)),
    musical,
  );

  const relevantCities = musical.city
    ? cities.filter((city) => city.name === musical.city || musical.cities?.includes(city.name))
    : cities.filter((city) => musical.cities?.includes(city.name));
  const hotelCities = musical.id === "moulinrouge"
    ? relevantCities.filter((city) => city.name === "Hamburg")
    : relevantCities;

  // Get provider info
  const providerInfo = providers.find((p) => p.name === musical.provider);

  const ticketLink = createAwinLink(musical.eventimUrl);
  const keyvisualTicketLink = musical.keyvisualLink ?? ticketLink;
  const ctaTicketLink = musical.ticketCtaUrl ?? ticketLink;
  // Awin-spezifische Links für die drei CTA-Positionen (mit clickref)
  const heroTicketLink = musical.awinHeroUrl ?? ctaTicketLink;
  const stickyTicketLink = musical.awinStickyUrl ?? ctaTicketLink;
  const boxTicketLink = musical.awinBoxUrl ?? ctaTicketLink;
  const usesAtgTickets = isAtgTicketMusical(musical.slug);
  const usesStageProductPage = musical.eventimUrl.includes("stage-entertainment.de");
  const ticketProviderName = usesStageProductPage ? "Stage Entertainment" : usesAtgTickets ? "ATG Tickets" : "Eventim";
  const ticketProviderDomain = usesStageProductPage ? "stage-entertainment.de" : usesAtgTickets ? "atgtickets.de" : "eventim.de";
  const ticketProviderBrand = getTicketProviderBrand(musical.slug, musical.eventimUrl);
  const ticketCta = getTicketCta(musical);
  const trackDetailTicketClick = (placement: AffiliateClickPlacement, ticketUrl: string) => {
    trackAffiliateTicketClick({
      musicalId: musical.id,
      partner: getAffiliatePartner(ticketUrl),
      placement,
      analyticsConsent: consent?.analytics === true,
    });
  };
  const aovoCampaign = getAovoCampaign(musical.id);
  const aovoCampaigns = getAovoCampaigns(musical.id);
  const inlineDescriptionCampaign = getAovoCampaigns(musical.id).find(
    (campaign) => campaign.placement === "within-detail-description"
  );
  const afterGalleryCampaigns = aovoCampaigns.filter(
    (campaign) => campaign.placement === "after-gallery"
  );
  const afterFaqCampaigns = aovoCampaigns.filter(
    (campaign) => campaign.placement === "after-faq"
  );
  const hasCompactAfterFaqCampaign = afterFaqCampaigns.some(
    (campaign) => campaign.compactTopSpacing
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SchemaOrg musical={musical} />
      <Header />

      {/* Floating Back Button */}
      <Link
        href="/"
        className="fixed top-20 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gold/35 bg-black/60 text-gold backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-black/80 hover:text-gold-light"
        aria-label="Zurück zur Übersicht"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      {/* Hero */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={musical.heroImage || musical.image}
            alt={musical.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="relative z-10 container pb-6 md:pb-10 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              {experienceCategory && (
                <span
                  data-testid="detail-experience-category"
                  className="inline-flex items-center gap-2 rounded-full border border-gold bg-transparent px-3 py-1.5 text-sm font-medium text-gold"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {experienceCategory.shortLabel}
                </span>
              )}
            </div>

            {/* H1 Headline-Effekt: sanftes Fade-in mit Y-Offset – alle Musical-Seiten */}
            <motion.h1
              className="font-display text-3xl md:text-5xl font-bold text-white mb-2 leading-tight"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
            >
              {musical.title}
            </motion.h1>
            {musical.subtitle && (
              <p className="mb-4 hidden text-lg italic text-gold/80 lg:block">{musical.subtitle}</p>
            )}

            <div className="flex items-center gap-2 text-cream/70">
              <MapPin className="w-4 h-4 text-gold" />
              {musical.city && musical.venuePerCity ? (
                <span>
                  {musical.cities?.map((c, i) => (
                    <span key={c}>{i > 0 && <span className="text-gold"> &amp; </span>}{c} ({musical.venuePerCity![c]})</span>
                  ))}
                </span>
              ) : musical.city && musical.venue && !musical.venuePerCity && (!musical.cities || musical.cities.length === 1) ? (
                <span>{musical.city} ({musical.venue})</span>
              ) : musical.id === 'gloeckner-von-notre-dame' && musical.cities ? (
                <span>{musical.cities.join(", ")}</span>
              ) : musical.headerCities && musical.cities ? (
                <span>{musical.headerCities.join(", ")} <span className="text-gold">und {musical.cities.length - musical.headerCities.length} weitere Tourneestädte</span></span>
              ) : (
                <span>{musical.cities?.join(", ")}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>



      {/* Mobile CTA – direkt nach Hero für alle Musicals */}
      {heroTicketLink && (
        <div ref={topCtaRef} className="lg:hidden bg-background px-4 pt-2 md:pt-6 pb-2">
          <a
            href={heroTicketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-red bg-red py-3 text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-red-dark"
            onClick={() => trackDetailTicketClick("mobile-hero", heroTicketLink)}
          >
            <Ticket className="w-4 h-4" />
            {ticketCta.label}
          </a>
        </div>
      )}

      {/* Content */}
      <section className="pt-6 md:pt-16 pb-12 md:pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Keyvisual – Desktop linke Spalte für alle Musicals.
                Der Trailer bleibt bewusst weiter unten im Seitenfluss. */}
            <div className="hidden lg:block lg:col-span-1 order-1 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MusicalKeyVisual image={musical.keyvisual || musical.image} title={musical.title} ticketLink={keyvisualTicketLink} landscape={musical.keyvisualLandscape || musical.id === 'moulinrouge' || musical.id === 'phantom-der-oper' || musical.id === 'gloeckner-von-notre-dame' || musical.id === 'starlight-express'} ticketProvider={ticketProviderName} onTicketClick={() => trackDetailTicketClick("keyvisual", keyvisualTicketLink)} />
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
                  <div className="mb-8 space-y-4 text-lg leading-relaxed text-cream/90 md:space-y-6">
                    {musical.detailDescription.split('\n\n').map((paragraph, i) => {
                      // Absätze, die nur aus **Text** bestehen, als Zwischenheadline rendern
                      const headlineMatch = paragraph.match(/^\*\*(.+)\*\*$/);
                      return (
                      <div key={i}>
                        {headlineMatch ? (
                          <h3 className="mt-6 mb-2 font-display text-xl font-bold tracking-wide text-gold">
                            {headlineMatch[1]}
                          </h3>
                        ) : (
                          <p>{paragraph}</p>
                        )}
                        {inlineDescriptionCampaign?.placement === "within-detail-description" &&
                          i === inlineDescriptionCampaign.detailParagraphIndex && (
                            <div className="my-8 hidden lg:block" data-testid="within-detail-description-campaign">
                              <AovoCampaignBanner campaign={inlineDescriptionCampaign} />
                            </div>
                          )}
                        {/* Mobile Video:
                             - Moulin Rouge!: nach i=0 (Ende "...Hansestadt.")
                             - Sister Act & Dracula: nach i=0
                             - FJG: nach i=1
                             - Starlight Express: nach i=0 (vor "Rollschuh-Action" bei i=1)
                             - Eiskönigin: nach i=0 (nach "...Herzen der Menschen berührt.")
                             - TINA: nach dem ersten Einleitungsabsatz */}
                        {((i === 0 && (musical.id === 'sisteract' || musical.id === 'dracula' || musical.id === 'moulinrouge' || musical.id === 'phantom-der-oper' || musical.id === 'starlight-express' || musical.id === 'eiskoenigin' || musical.id === 'koenig-der-loewen' || musical.id === 'mj-musical' || musical.id === 'tarzan' || musical.id === 'ziz' || musical.id === 'teufel-traegt-prada' || musical.id === 'die-amme' || musical.id === 'wir-sind-am-leben' || musical.id === 'tanz-der-vampire' || musical.id === 'we-will-rock-you' || musical.id === 'salon-rosie' || musical.id === 'und-julia' || musical.id === 'tina-das-musical')) || (i === 1 && musical.id === 'fackjugoehte') || (i === 0 && musical.id === 'gloeckner-von-notre-dame')) && musical.youtubeTrailerId && (
                          <div className="lg:hidden my-8" data-testid="mobile-inline-trailer">
                            <YouTubeEmbed videoId={musical.youtubeTrailerId} title={`${musical.title} Trailer`} eagerThumbnail />
                          </div>
                        )}
                        {musical.id === "fackjugoehte" && i === 1 && (
                          <EventimFackJuGoehteBanner format="wide" />
                        )}
                        {musical.id === "dracula" && i === 5 && (
                          <EventimDraculaBanner format="wide" />
                        )}
                        {/* Mobile Keyvisual:
                             - Moulin Rouge!: nach i=2 (nach "Von Offenbach...", vor "Das Theater...")
                             - Drei Haseelnüsse: nach i=0
                             - FJG: nach i=3 (vor "Ausgezeichnet" bei i=4)
                             - Dracula: nach i=3 (vor "Atmosphäre und Inszenierung" bei i=4)
                             - Starlight Express: nach i=4 (vor "Weltklasse-Technik" bei i=5)
                             - Eiskönigin: nach i=2 (nach "...unvergeßlicher Musik.", vor Headline "Spektakel für alle Sinne" bei i=3)
                             - alle anderen: nach i=1 */}
                        {(musical.id === 'moulinrouge' ? i === 2 : musical.id === 'dreihaselnuesse' ? i === 0 : musical.id === 'fackjugoehte' ? i === 3 : musical.id === 'phantom-der-oper' ? i === 2 : musical.id === 'gloeckner-von-notre-dame' ? i === 2 : musical.id === 'dracula' ? i === 3 : musical.id === 'starlight-express' ? i === 4 : musical.id === 'eiskoenigin' ? i === 2 : musical.id === 'mj-musical' ? i === 2 : musical.id === 'koenig-der-loewen' ? i === 2 : musical.id === 'tarzan' ? i === 2 : musical.id === 'ziz' ? i === 2 : musical.id === 'teufel-traegt-prada' ? i === 2 : musical.id === 'die-amme' ? i === 2 : musical.id === 'wir-sind-am-leben' ? i === 2 : musical.id === 'tanz-der-vampire' ? i === 2 : musical.id === 'we-will-rock-you' ? i === 2 : musical.id === 'salon-rosie' ? i === 2 : musical.id === 'und-julia' ? i === 2 : i === 1) && (
                          <div className="lg:hidden my-8">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              <MusicalKeyVisual image={musical.keyvisual || musical.image} title={musical.title} ticketLink={keyvisualTicketLink} landscape={musical.keyvisualLandscape || musical.id === 'moulinrouge' || musical.id === 'phantom-der-oper' || musical.id === 'gloeckner-von-notre-dame' || musical.id === 'starlight-express'} ticketProvider={ticketProviderName} onTicketClick={() => trackDetailTicketClick("keyvisual", keyvisualTicketLink)} />

                            </motion.div>
                          </div>
                        )}
                        {inlineDescriptionCampaign?.placement === "within-detail-description" &&
                          i === inlineDescriptionCampaign.detailParagraphIndex && (
                            <div className="my-8 lg:hidden" data-testid="within-detail-description-campaign-mobile">
                              <AovoCampaignBanner campaign={inlineDescriptionCampaign} />
                            </div>
                          )}
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mb-8 text-lg leading-relaxed text-cream/90">
                    {musical.description}
                  </p>
                )}

              </motion.div>
            </div>

          </div>
        </div>
      </section>



      {/* YouTube Video – auf Desktop nach dem oberen Beschreibungsteil. */}
      {musical.youtubeTrailerId && (
        <section className="hidden lg:block py-12 md:py-16 bg-background" data-testid="desktop-trailer-section">
          <div className="container max-w-4xl">
            <YouTubeEmbed videoId={musical.youtubeTrailerId} title={`${musical.title} Trailer`} />
          </div>
        </section>
      )}

      {/* Tour Dates */}
      <div ref={tourDatesRef}>
        {musical.tourDates && musical.tourDates.length > 0 && (
          <TourDates tourDates={musical.tourDates} forceDropdown={musical.id === "dreihaselnuesse" || musical.id === "schoene-und-das-biest"} musicalSlug={musical.slug} onTicketClick={(ticketUrl) => trackDetailTicketClick("city-date", ticketUrl)} />
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
                  <Fragment key={index}>
                    {aovoCampaign?.placement === "before-story-paragraph" &&
                      index === aovoCampaign.storyParagraphIndex && (
                        <AovoCampaignBanner campaign={aovoCampaign} />
                      )}
                    <p
                      className={`mb-4 text-lg leading-relaxed text-cream/80 ${
                        aovoCampaign?.placement === "before-story-paragraph" &&
                        index === aovoCampaign.storyParagraphIndex
                          ? "mt-12"
                          : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  </Fragment>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* USP-Box – generisch für alle Musicals mit uspItems */}
      {musical.uspItems && musical.uspItems.length > 0 && (() => {
        const iconMap: Record<string, React.ReactNode> = {
          Crown: <Crown className="w-5 h-5" />,
          Globe: <Globe className="w-5 h-5" />,
          Star: <Star className="w-5 h-5" />,
          CalendarDays: <CalendarDays className="w-5 h-5" />,
          Music: <Music className="w-5 h-5" />,
          Music2: <Music2 className="w-5 h-5" />,
          Sparkles: <Sparkles className="w-5 h-5" />,
          Heart: <Heart className="w-5 h-5" />,
          Gift: <Gift className="w-5 h-5" />,
          MapPin: <MapPin className="w-5 h-5" />,
          Skull: <Skull className="w-5 h-5" />,
          Users: <Users className="w-5 h-5" />,
          Laugh: <Laugh className="w-5 h-5" />,
          GraduationCap: <GraduationCap className="w-5 h-5" />,
          Snowflake: <Snowflake className="w-5 h-5" />,
        };
        return (
          <>
          <section className="py-8 md:py-10 bg-background">
            <div className="container max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-sm border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent"
              >
                <div className="border-b border-gold/20 px-6 pt-6 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">Das erwartet dich</p>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-1">Warum {musical.title} ein Erlebnis der Extraklasse ist</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                  {musical.uspItems.map((usp, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 px-6 py-5"
                      style={{
                        borderRight: i % 2 === 0 ? '1px solid oklch(0.78 0.12 85 / 0.15)' : 'none',
                        borderBottom: i < musical.uspItems!.length - 2 ? '1px solid oklch(0.78 0.12 85 / 0.15)' : 'none',
                      }}
                    >
                      <div
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold/15 text-gold"
                      >
                        {iconMap[usp.icon] ?? <Star className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm leading-snug mb-0.5">{usp.title}</p>
                        <p className="text-sm leading-relaxed text-cream/60">{usp.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
          </>
        );
      })()}

      {/* Ticket CTA – nach Tourtermine & Story, vor Pressequotes */}
      <section className="py-8 md:py-10 bg-background">
        <div className="container max-w-4xl">
          <motion.div
            ref={ticketBoxRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-sm border border-red p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="w-6 h-6 text-red" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                {ticketCta.kind === "offer" ? "Angebot sichern" : "Tickets sichern"}
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {ticketCta.kind === "offer"
                ? `Aktuell: ${ticketCta.label} – direkt bei ${ticketProviderName}.`
                : `Sichere dir jetzt deine Tickets für ${musical.title} – bequem und sicher über ${ticketProviderName}.`}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={boxTicketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-red px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-red-dark"
                onClick={() => trackDetailTicketClick("ticket-box", boxTicketLink)}
              >
                {ticketCta.label}
                <ExternalLink className="w-5 h-5" />
              </a>
              <img
                data-testid="ticket-provider-logo"
                src={ticketProviderBrand.logoSrc}
                alt={ticketProviderBrand.name}
                className="ml-3 h-7 max-w-36 w-auto object-contain object-left opacity-90"
              />
            </div>
            <p className="text-xs text-muted-foreground/50 mt-4">
              Weiterleitung zu {ticketProviderDomain} – Affiliate-Link
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

      {(afterGalleryCampaigns.length > 0 || musical.id === "fackjugoehte" || musical.id === "dracula") && (
        <section className="bg-background pb-12 md:pb-16" data-testid="after-gallery-campaign-section">
          <div className="container max-w-4xl">
            {afterGalleryCampaigns.map((campaign) => (
              <AovoCampaignBanner key={campaign.groupId} campaign={campaign} />
            ))}
            {musical.id === "fackjugoehte" && <EventimFackJuGoehteBanner format="square" />}
            {musical.id === "dracula" && <EventimDraculaBanner format="square" />}
          </div>
        </section>
      )}

      {/* Show Facts + FAQ */}
      {((musical.showFacts?.length ?? 0) > 0 || (musical.faqItems?.length ?? 0) > 0) && (
        <MusicalShowFacts facts={musical.showFacts ?? []} provider={musical.provider} faqItems={musical.faqItems} />
      )}

      {/* HRS-Hotelbereich – bis zur neuen Reise- oder Hotelpartnerschaft vorerst ausgeblendet. */}
      {SHOW_MUSICAL_HOTEL_SECTIONS && hotelCities.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Hotels in der Nähe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotelCities.map((city) => (
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
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                    <Hotel className="w-4 h-4" />
                    Hotels durchsuchen
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {afterFaqCampaigns.length > 0 && (
        <section
          className={hasCompactAfterFaqCampaign ? "bg-background pt-2 pb-10 md:pt-3 md:pb-12" : "py-12 md:py-16 bg-background"}
          data-testid="after-faq-campaign-section"
        >
          <div className="container max-w-4xl">
            {afterFaqCampaigns.map((campaign) => (
              <AovoCampaignBanner key={campaign.groupId} campaign={campaign} />
            ))}
          </div>
        </section>
      )}

      {/* Kampagnenanzeigen bleiben unabhängig vom vorübergehend deaktivierten HRS-Bereich sichtbar. */}
      {(musical.id === "tanz-der-vampire" || (aovoCampaign && !aovoCampaign.placement)) && (
        <section className="py-12 md:py-16 bg-background" data-testid="musical-campaign-section">
          <div className="container max-w-4xl">
            {musical.id === "tanz-der-vampire" && <AovoTanzDerVampireBanner />}
            {!aovoCampaign?.placement && aovoCampaign && <AovoCampaignBanner campaign={aovoCampaign} />}
          </div>
        </section>
      )}

      {/* Related Musicals – available on every active musical detail page. */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 bg-card/50">
          <div className="container">
            <div className="border-t border-border mb-10" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              {experienceCategory?.recommendationHeadline ?? "Ähnliche Musicals"}
            </h2>
            {experienceCategory && (
              <p className="-mt-5 mb-6 text-sm text-cream/90">
                <span className="font-medium text-gold">{experienceCategory.shortLabel}</span> · {experienceCategory.recommendationIntro}
              </p>
            )}
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
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-300"
          style={{ opacity: showSticky ? 1 : 0, pointerEvents: showSticky ? 'auto' : 'none', transform: showSticky ? 'translateY(0)' : 'translateY(8px)' }}
        >
          <div className="flex items-center gap-3">
            <a
              href={stickyTicketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-red py-3 text-sm font-bold tracking-wide text-white transition-colors duration-200 hover:bg-red-dark"
              onClick={() => trackDetailTicketClick("sticky", stickyTicketLink)}
            >
              <Ticket className="w-4 h-4" />
              {ticketCta.label}
            </a>
            <img
              data-testid="sticky-ticket-provider-logo"
              src={ticketProviderBrand.logoSrc}
              alt={ticketProviderBrand.name}
              className="h-5 max-w-[5.5rem] w-auto shrink-0 object-contain object-right opacity-90"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
