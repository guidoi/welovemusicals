/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Home: Startseite mit Hero, Featured Musicals, alle Musicals mit erweiterten Filtern, Städte, Anbieter
 */
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  SlidersHorizontal,
  Star,
  MapPin,
  ChevronDown,
  X,
  Music,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroAnchorNavigation from "@/components/HeroAnchorNavigation";
import MusicalCard from "@/components/MusicalCard";
import CityCard from "@/components/CityCard";
import MusicalFilters from "@/components/MusicalFilters";
import PlzSearch, { musicalInRadius, type PlzSearchState } from "@/components/PlzSearch";
import {
  musicals,
  cities,
  ACTIVE_MUSICAL_IDS,
  FEATURED_MUSICAL_IDS,
  getAdditionalMusicals,
  getEditorialOverviewMusicals,
  getFeaturedMusicals,
  getActiveMusicalCountByCity,
} from "@/lib/data";
import { useManagedMusicals } from "@/contexts/PricingContext";
import { useConsent } from "@/contexts/ConsentContext";
import { getExperienceCategory, type CountryFilter, type ExperienceFilterId } from "@/lib/experience-categories";
import { getHeroNavigationItems, type HeroNavigationItem } from "@/lib/hero-navigation";
import { trackExperienceCategorySelection } from "@/lib/category-analytics";
import { HOME_HERO_ALT, HOME_HERO_IMAGE, HOME_HERO_TEASER } from "@/lib/home-hero";
import {
  DESKTOP_HERO_HIGHLIGHTS_TOP_CLASS,
  DESKTOP_HERO_IMAGE_POSITION_CLASS,
  DESKTOP_HERO_SECTION_CLASS,
  MOBILE_HERO_NAVIGATION_BOTTOM_CLASS,
  MOBILE_HERO_NAVIGATION_TOP_CLASS,
} from "@/lib/home-hero-layout";
import {
  createHeroAnchorHistoryState,
  getHeroAnchorHistoryAction,
  getHomeHeroScrollOptions,
  shouldRestoreHomeHero,
} from "@/lib/hero-anchor-history";
import {
  createExperienceCategoryHref,
  createMusicalOverviewHref,
  getExperienceCategoryFromSearch,
} from "@/lib/experience-category-url";

const ATMOSPHERE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/musical-atmosphere-4CsbZ3XqCMsoLK2mN9oi9f.webp";

// Österreichische Städte (für Länderfilter)
const AT_CITIES = new Set(["Graz", "Wien", "Innsbruck", "Linz", "Bad Ischl", "Dornbirn", "Ried im Innkreis", "Vöcklabruck", "Puch bei Salzburg", "Feldkirch", "Salzburg"]);
// Schweizer Städte
const CH_CITIES = new Set(["Zürich", "Basel", "Bern", "Genève", "Lausanne", "Luzern", "St. Gallen"]);

export default function Home() {
  const { musicals: managedMusicals } = useManagedMusicals();
  const { consent } = useConsent();
  const [categoryFilter, setCategoryFilter] = useState<ExperienceFilterId>("alle");
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("alle");
  const [cityFilter, setCityFilter] = useState<string>("alle");
  const [plzSearch, setPlzSearch] = useState<PlzSearchState>({
    active: false,
    plz: "",    radius: 50,
    originCoords: null,
  });

  const [showAllMusicals, setShowAllMusicals] = useState(false);
  const [showCompleteCatalog, setShowCompleteCatalog] = useState(false);
  const [showMorePulsed, setShowMorePulsed] = useState(false); // Puls-Effekt einmalig für "Alle anzeigen"-Button
  const [resultAnimationKey, setResultAnimationKey] = useState(0);
  const [showStickyFilterBar, setShowStickyFilterBar] = useState(false);
  const [heroCategoryShineKey, setHeroCategoryShineKey] = useState(0);
  const [filterCategoryShineKey, setFilterCategoryShineKey] = useState(0);
  const [pendingCategoryFilterShine, setPendingCategoryFilterShine] = useState(false);
  const [isResetTouchFeedbackActive, setIsResetTouchFeedbackActive] = useState(false);
  const firstResultRef = useRef<HTMLDivElement>(null);
  const resultGridRef = useRef<HTMLDivElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const resetTouchFeedbackTimeoutRef = useRef<number | undefined>(undefined);
  const lastResetInteractionWasTouchRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const scrollToFirstResult = useCallback(() => {
    requestAnimationFrame(() => {
      const el = firstResultRef.current;
      if (!el) return;

      // Das erste Ergebnis bleibt vollständig unter Header und kompakter Filterleiste sichtbar.
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const headerHeight = isDesktop ? 80 : 64;
      const stickyFilterAllowance = 48;
      const safetyGap = isDesktop ? 16 : 26;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - stickyFilterAllowance - safetyGap;
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
    if (!pendingCategoryFilterShine) return;

    const filterPanel = filterPanelRef.current;
    if (!filterPanel || typeof IntersectionObserver === "undefined") {
      setFilterCategoryShineKey((currentKey) => currentKey + 1);
      setPendingCategoryFilterShine(false);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setFilterCategoryShineKey((currentKey) => currentKey + 1);
      setPendingCategoryFilterShine(false);
      observer.disconnect();
    }, { threshold: 0.25 });

    observer.observe(filterPanel);
    return () => observer.disconnect();
  }, [pendingCategoryFilterShine]);

  const scrollToUpdatedResults = useCallback(() => {
    window.setTimeout(scrollToFirstResult, 80);
  }, [scrollToFirstResult]);

  const animateUpdatedResults = useCallback(() => {
    setResultAnimationKey((currentKey) => currentKey + 1);
    scrollToUpdatedResults();
  }, [scrollToUpdatedResults]);

  const scrollToFilterPanel = useCallback(() => {
    const panel = filterPanelRef.current;
    if (!panel) return;

    const headerOffset = window.matchMedia("(min-width: 768px)").matches ? 104 : 88;
    const top = panel.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const triggerResetTouchFeedback = useCallback((pointerType: string) => {
    lastResetInteractionWasTouchRef.current = pointerType === "touch";
    if (pointerType !== "touch") return;

    if (resetTouchFeedbackTimeoutRef.current !== undefined) {
      window.clearTimeout(resetTouchFeedbackTimeoutRef.current);
    }
    setIsResetTouchFeedbackActive(true);
    resetTouchFeedbackTimeoutRef.current = window.setTimeout(() => {
      setIsResetTouchFeedbackActive(false);
      resetTouchFeedbackTimeoutRef.current = undefined;
    }, 220);
  }, []);

  const resetToAdditionalOverview = useCallback(() => {
    setCategoryFilter("alle");
    setCountryFilter("alle");
    setCityFilter("alle");
    setPlzSearch({ active: false, plz: "", radius: 50, originCoords: null });
    setShowCompleteCatalog(false);
    setShowAllMusicals(false);
    window.history.replaceState(window.history.state, "", createMusicalOverviewHref());
  }, []);

  const resetToAdditionalOverviewWithFeedback = useCallback(() => {
    const delay = lastResetInteractionWasTouchRef.current ? 120 : 0;
    window.setTimeout(() => {
      resetToAdditionalOverview();
      lastResetInteractionWasTouchRef.current = false;
    }, delay);
  }, [resetToAdditionalOverview]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const restoreCategoryFromSharedUrl = () => {
      const categoryFromUrl = getExperienceCategoryFromSearch(window.location.search);

      if (categoryFromUrl) {
        setCategoryFilter(categoryFromUrl);
        setCountryFilter("alle");
        setCityFilter("alle");
        setPlzSearch({ active: false, plz: "", radius: 50, originCoords: null });
        setShowCompleteCatalog(true);
        setShowAllMusicals(true);
        return;
      }

      if (window.location.pathname === "/" && window.location.hash === "#more-musicals") {
        setCategoryFilter("alle");
      }
    };

    restoreCategoryFromSharedUrl();
    window.addEventListener("popstate", restoreCategoryFromSharedUrl);
    return () => window.removeEventListener("popstate", restoreCategoryFromSharedUrl);
  }, []);

  useEffect(() => {
    const updateStickyFilterVisibility = () => {
      const resultGrid = resultGridRef.current;
      if (!resultGrid) {
        setShowStickyFilterBar(false);
        return;
      }

      const headerHeight = window.matchMedia("(min-width: 768px)").matches ? 80 : 64;
      const resultCards = Array.from(resultGrid.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement && child.id.startsWith("musical-"),
      );
      const firstResultTop = resultCards[0]?.getBoundingClientRect().top;
      const secondRowCard = resultCards.find((card) => (
        firstResultTop !== undefined && card.getBoundingClientRect().top > firstResultTop + 4
      ));
      const secondRowRevealOffset = headerHeight + 24;

      setShowStickyFilterBar(Boolean(secondRowCard && secondRowCard.getBoundingClientRect().top <= secondRowRevealOffset));
    };

    updateStickyFilterVisibility();
    window.addEventListener("scroll", updateStickyFilterVisibility, { passive: true });
    window.addEventListener("resize", updateStickyFilterVisibility);
    return () => {
      window.removeEventListener("scroll", updateStickyFilterVisibility);
      window.removeEventListener("resize", updateStickyFilterVisibility);
    };
  }, []);

  useEffect(() => () => {
    if (resetTouchFeedbackTimeoutRef.current !== undefined) {
      window.clearTimeout(resetTouchFeedbackTimeoutRef.current);
    }
  }, []);

  // PLZ-Suche aus Header-Overlay empfangen und zu erstem Ergebnis scrollen
  useEffect(() => {
    const handlePlzEvent = (e: Event) => {
      const state = (e as CustomEvent<PlzSearchState>).detail;
      setPlzSearch(state);
      if (state.active) {
        setResultAnimationKey((currentKey) => currentKey + 1);
        setTimeout(scrollToFirstResult, 250);
      }
    };
    window.addEventListener('plz-search-update', handlePlzEvent);
    return () => window.removeEventListener('plz-search-update', handlePlzEvent);
  }, [scrollToFirstResult]);

  const featured = useMemo(() => getFeaturedMusicals(managedMusicals), [managedMusicals]);
  const heroNavigationItems = useMemo(
    () => getHeroNavigationItems(managedMusicals, ACTIVE_MUSICAL_IDS, FEATURED_MUSICAL_IDS),
    [managedMusicals],
  );

  const handleHeroNavigation = useCallback((item: HeroNavigationItem, placement: "hero-mobile" | "hero-desktop") => {
    const { href, kind } = item;
    if (kind === "musical") return;

    if (kind === "overview" && item.id === "all-musicals") {
      setCategoryFilter("alle");
      setCountryFilter("alle");
      setCityFilter("alle");
      setPlzSearch({ active: false, plz: "", radius: 50, originCoords: null });
      setShowCompleteCatalog(true);
      setShowAllMusicals(true);
    }

    if (kind === "category" && item.categoryId) {
      trackExperienceCategorySelection({
        categoryId: item.categoryId,
        placement,
        analyticsConsent: consent?.analytics === true,
      });
      setCategoryFilter(item.categoryId);
      setCountryFilter("alle");
      setCityFilter("alle");
      setPlzSearch({ active: false, plz: "", radius: 50, originCoords: null });
      setShowCompleteCatalog(true);
      setShowAllMusicals(true);
      setHeroCategoryShineKey((currentKey) => currentKey + 1);
      setPendingCategoryFilterShine(true);
    }

    const targetHash = new URL(href, window.location.origin).hash.slice(1);
    const target = targetHash ? document.getElementById(targetHash) : null;
    const nextHistoryState = createHeroAnchorHistoryState(window.history.state, href);
    if (getHeroAnchorHistoryAction(window.history.state) === "replace") {
      window.history.replaceState(nextHistoryState, "", href);
    } else {
      window.history.pushState(nextHistoryState, "", href);
    }
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [consent?.analytics]);

  useEffect(() => {
    const restoreHomeHeroAfterBack = () => {
      if (!shouldRestoreHomeHero(window.location.pathname, window.location.hash)) return;

      requestAnimationFrame(() => {
        window.scrollTo(getHomeHeroScrollOptions());
      });
    };

    window.addEventListener("popstate", restoreHomeHeroAfterBack);
    return () => window.removeEventListener("popstate", restoreHomeHeroAfterBack);
  }, []);

  const hasNarrowingFilter =
    categoryFilter !== "alle" ||
    countryFilter !== "alle" ||
    cityFilter !== "alle" ||
    plzSearch.active;
  const includeHighlightsInOverview = showCompleteCatalog || hasNarrowingFilter;
  const selectedExperienceCategory = getExperienceCategory(categoryFilter === "alle" ? undefined : categoryFilter);
  const stickyFilterSummary = [
    selectedExperienceCategory?.shortLabel,
    countryFilter === "de" ? "Deutschland" : countryFilter === "at" ? "Österreich" : countryFilter === "ch" ? "Schweiz" : undefined,
    cityFilter !== "alle" ? cityFilter : undefined,
    plzSearch.active ? `${plzSearch.radius} km` : undefined,
  ].filter(Boolean).join(" · ") || "Alle Shows";
  const selectedCountryLabel = countryFilter === "de"
    ? "Deutschland"
    : countryFilter === "at"
      ? "Österreich"
      : countryFilter === "ch"
        ? "der Schweiz"
        : undefined;
  const filteredMusicals = useMemo(() => {
    // Ohne Auswahl bleibt die Übersicht doppelfrei. Sobald gefiltert wird,
    // durchsucht sie das komplette aktive Angebot einschließlich der Highlights.
    let result = getEditorialOverviewMusicals(includeHighlightsInOverview, managedMusicals);

    // Redaktionelle Erlebniswelten statt technischer Datenkategorien.
    if (categoryFilter !== "alle") {
      result = result.filter((musical) => musical.experienceCategory === categoryFilter);
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

    // Filter nach PLZ-Umkreis
    if (plzSearch.active && plzSearch.originCoords) {
      result = result.filter((m) =>
        musicalInRadius(m, plzSearch.originCoords!, plzSearch.radius)
      );
    }

    return result;
  }, [categoryFilter, countryFilter, cityFilter, plzSearch, managedMusicals, includeHighlightsInOverview]);

  const dynamicDiscoveryIntro = selectedExperienceCategory
    ? `${selectedExperienceCategory.description} ${cityFilter !== "alle" ? `Entdecke deine Auswahl in ${cityFilter} und finde deinen nächsten besonderen Musicalabend.` : selectedCountryLabel ? `Entdecke deine Auswahl in ${selectedCountryLabel} und finde deinen nächsten besonderen Musicalabend.` : "Finde die Show, die deinen nächsten Musicalabend unvergesslich macht."}`
    : plzSearch.active
      ? "Entdecke Musicals und Shows in deiner Nähe – finde den nächsten besonderen Musicalabend ganz in deiner Umgebung."
      : cityFilter !== "alle"
        ? `Entdecke Musicals und Shows in ${cityFilter}, die zu deinem Geschmack passen – und finde deinen nächsten besonderen Abend.`
        : selectedCountryLabel
          ? `Entdecke Musicals und Shows in ${selectedCountryLabel}, die zu deinem Geschmack passen – für deinen nächsten unvergesslichen Musicalabend.`
          : "Entdecke Musicals und Shows, die zu deinem Geschmack passen – von großen Bühnenbildern bis zu Geschichten, die dich noch lange begleiten.";
  const dynamicResultHint = filteredMusicals.length === 1
    ? "Weiter unten findest du deinen passenden Show-Tipp."
    : `Weiter unten findest du deine ${filteredMusicals.length} passenden Show-Tipps.`;

  const displayedMusicals = showAllMusicals ? filteredMusicals : filteredMusicals.slice(0, 16);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <AnimatePresence>
        {showStickyFilterBar && (
          <motion.div
            data-testid="sticky-filter-bar"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 border-b border-gold/20 bg-background/95 shadow-lg shadow-black/20 backdrop-blur-xl md:top-20"
          >
            <div className="container flex min-h-12 items-center justify-between gap-2 py-2">
              <button
                type="button"
                onClick={scrollToFilterPanel}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/45 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sm:hidden">Filter</span>
                <span className="hidden sm:inline">Filter anpassen</span>
              </button>
              <p className="min-w-0 truncate text-xs text-white/80" aria-live="polite">
                <span className="font-semibold text-gold">{stickyFilterSummary}</span>
                <span className="hidden sm:inline"> · {filteredMusicals.length} {filteredMusicals.length === 1 ? "Show" : "Shows"}</span>
              </p>
              {hasNarrowingFilter && (
                <button
                  type="button"
                  onClick={resetToAdditionalOverview}
                  aria-label="Filter zurücksetzen"
                  title="Filter zurücksetzen"
                  className="group inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/35 text-gold transition-all duration-150 hover:-translate-x-0.5 hover:border-gold hover:bg-gold/15 hover:shadow-[0_0_14px_rgba(184,148,74,0.28)] active:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <X className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO SECTION ===== */}
      <section className={`relative flex items-center justify-center overflow-hidden ${DESKTOP_HERO_SECTION_CLASS}`}>
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HOME_HERO_IMAGE}
            alt={HOME_HERO_ALT}
            className={`w-full h-full object-cover ${DESKTOP_HERO_IMAGE_POSITION_CLASS}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-background" />
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
              {HOME_HERO_TEASER}{" "}
              <span className="block md:inline text-gold font-semibold">Licht aus, Magie an!</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-gold" />
                <span className="text-white/80 text-sm">{ACTIVE_MUSICAL_IDS.length} Musicals</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <span className="text-white/80 text-sm">{(() => { const s = new Set<string>(); managedMusicals.filter(m => ACTIVE_MUSICAL_IDS.includes(m.id) || ACTIVE_MUSICAL_IDS.includes(m.slug)).forEach(m => { if (m.city) s.add(m.city); if (m.cities) m.cities.forEach(c => s.add(c)); if (m.tourDates) m.tourDates.forEach(t => s.add(t.city)); }); return s.size; })()} Städte</span>
              </div>

            </div>

            <div className={`${MOBILE_HERO_NAVIGATION_TOP_CLASS} md:hidden`}>
              <HeroAnchorNavigation
                items={heroNavigationItems}
                onNavigate={handleHeroNavigation}
                placement="hero-mobile"
                activeCategoryId={categoryFilter === "alle" ? undefined : categoryFilter}
                theaterLightKey={heroCategoryShineKey}
              />
            </div>

            <div className="mt-7 hidden md:block">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Entdecke nach Erlebniswelt</p>
              <HeroAnchorNavigation
                items={heroNavigationItems}
                onNavigate={handleHeroNavigation}
                placement="hero-desktop"
                variant="categories"
                activeCategoryId={categoryFilter === "alle" ? undefined : categoryFilter}
                theaterLightKey={heroCategoryShineKey}
              />
            </div>

          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED MUSICALS ===== */}
      <section id="musicals" className={`${MOBILE_HERO_NAVIGATION_BOTTOM_CLASS} ${DESKTOP_HERO_HIGHLIGHTS_TOP_CLASS} pb-16 md:pb-24 scroll-mt-24`}>
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
              <MusicalCard key={musical.id} musical={musical} index={i} anchorId={`musical-${musical.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="container"><div className="gold-line" /></div>

      {/* ===== ALL MUSICALS ===== */}
      <section id="more-musicals" className="py-16 md:py-24 scroll-mt-24">
        <div className="container">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">DEIN MUSICAL-MOMENT</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welche Show passt zu dir?
          </h2>
          <p className={`max-w-2xl text-white ${includeHighlightsInOverview ? "mb-3" : "mb-10"}`}>
            {dynamicDiscoveryIntro} <span className="font-medium text-gold-light">{dynamicResultHint}</span>
          </p>
          {includeHighlightsInOverview && (
            <button
              type="button"
              data-testid="overview-reset-button"
              onClick={resetToAdditionalOverviewWithFeedback}
              aria-label="Zurück zur Übersicht"
              title="Zurück zur Übersicht"
              onPointerDown={(event) => triggerResetTouchFeedback(event.pointerType)}
              className={`group mb-8 inline-flex h-9 w-9 items-center justify-center rounded-full border text-gold transition-all duration-150 hover:-translate-x-0.5 hover:border-gold hover:bg-gold/15 hover:shadow-[0_0_14px_rgba(184,148,74,0.28)] active:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${isResetTouchFeedbackActive ? "-translate-x-0.5 border-gold bg-gold/20 shadow-[0_0_14px_rgba(184,148,74,0.32)]" : "border-gold/50"}`}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden="true" />
            </button>
          )}

          <div ref={filterPanelRef} className="mb-10 rounded-2xl border border-gold/20 bg-card/60 p-4 shadow-[0_16px_42px_rgba(0,0,0,0.18)] sm:p-6">
            <MusicalFilters
              categoryFilter={categoryFilter}
              setCategoryFilter={(category) => {
                setCategoryFilter(category);
                setShowCompleteCatalog(true);
                setShowAllMusicals(true);
                animateUpdatedResults();
                const href = category === "alle"
                  ? createMusicalOverviewHref()
                  : createExperienceCategoryHref(category);
                window.history.replaceState(window.history.state, "", href);
              }}
              countryFilter={countryFilter}
              setCountryFilter={(country) => {
                setCountryFilter(country);
                setShowCompleteCatalog(true);
                setShowAllMusicals(true);
                animateUpdatedResults();
              }}
              cityFilter={cityFilter}
              setCityFilter={(city) => {
                setCityFilter(city);
                setShowCompleteCatalog(true);
                setShowAllMusicals(true);
                animateUpdatedResults();
              }}
              plzSearch={plzSearch}
              setPlzSearch={(state) => {
                handlePlzSearch(state);
                if (state.active) {
                  setShowCompleteCatalog(true);
                  setShowAllMusicals(true);
                  setResultAnimationKey((currentKey) => currentKey + 1);
                }
              }}
              onFiltersReset={resetToAdditionalOverview}
              shineTrigger={filterCategoryShineKey}
            />
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
                      setShowCompleteCatalog(false);
                      setShowAllMusicals(false);
                    }}
                    className="px-4 py-2 text-sm rounded-sm border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                  >
                    Filter zurücksetzen
                  </button>
                </>
              )}
            </div>
          ) : (
              <div ref={resultGridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedMusicals.map((musical, i) => (
                <MusicalCard
                  key={musical.id}
                  musical={musical}
                  index={i}
                  anchorId={`musical-${musical.slug}`}
                  filterAnimationKey={resultAnimationKey || undefined}
                />
              ))}
              </div>
          )}

          {/* Show More / Show Less */}
          {filteredMusicals.length > 16 && (
            <div className="text-center mt-10">
              {!showAllMusicals ? (
                <button
                  onClick={() => { setShowAllMusicals(true); setShowMorePulsed(true); }}
                  className={`px-8 py-3 font-semibold rounded-sm transition-all duration-300 inline-flex items-center gap-2 text-gold ${
                    showMorePulsed
                      ? "border-2 border-gold/60 shadow-[0_0_18px_rgba(184,148,74,0.40)] hover:bg-gold/10"
                      : "border-2 border-gold/60 shadow-[0_0_18px_rgba(184,148,74,0.40)] animate-pulse-once hover:bg-gold/10"
                  }`}
                >
                  Alle {filteredMusicals.length} weiteren Musicals anzeigen
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAllMusicals(false);
                    setTimeout(() => {
                      document.getElementById('more-musicals')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  className="px-8 py-3 font-semibold rounded-sm border border-gold/40 text-gold hover:bg-gold/10 transition-all duration-300 inline-flex items-center gap-2"
                >
                  Weniger anzeigen
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </button>
              )}
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

      {/* Gold Divider */}
      <div className="container"><div className="gold-line" /></div>

      <Footer />
    </div>
  );
}
