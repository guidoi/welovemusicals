import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const filterSource = readFileSync(new URL("../components/MusicalFilters.tsx", import.meta.url), "utf8");

describe("Startseiten-Erlebnisfilter", () => {
  it("nutzt durchgehend sichtbare Erlebniswelten statt technischer Kategorie-Dropdowns", () => {
    expect(homeSource).toContain('rounded-2xl border border-gold/20 bg-card/60');
    expect(homeSource).toContain('const dynamicDiscoveryHeadline = selectedExperienceCategory?.discoveryHeadline ?? "Welche Show passt zu dir?";');
    expect(homeSource).toContain("const dynamicDiscoveryIntro = selectedExperienceCategory");
    expect(homeSource).toContain('import { getDiscoveryResultHint } from "@/lib/discovery-result-hint";');
    expect(homeSource).toContain("const dynamicResultHint = getDiscoveryResultHint({");
    expect(filterSource).toContain("Erlebniswelt");
    expect(filterSource).not.toContain('data-testid="filter-result-count"');
    expect(filterSource).not.toContain('uppercase tracking-[0.14em] text-muted-foreground">Erlebniswelt</p>');
    expect(filterSource).toContain("EXPERIENCE_CATEGORIES");
    expect(filterSource).toContain("category.label");
    expect(filterSource).not.toContain("Alle Kategorien");
  });

  it("setzt Länder als Buttons um und entfernt die Sortierung", () => {
    expect(filterSource).toContain("COUNTRY_FILTERS");
    expect(filterSource).toContain("country.label");
    expect(filterSource).not.toContain("Sortierung");
    expect(homeSource).not.toContain("sortOption");
    expect(homeSource).not.toContain("setSortOption");
  });

  it("stellt eine moderne Ortsauswahl mit Suche, Schnellwahl und Umkreissuche bereit", () => {
    expect(filterSource).toContain("Ort finden");
    expect(filterSource).toContain("Stadt eingeben");
    expect(filterSource).toContain("Beliebte Musical-Städte");
    expect(filterSource).toContain("In meiner Nähe");
    expect(filterSource).toContain('data-testid="city-finder-panel"');
  });

  it("unterscheidet eine doppelfreie Fortsetzung von einer vollständigen Ergebnisansicht", () => {
    expect(homeSource).toContain("const [showCompleteCatalog, setShowCompleteCatalog] = useState(false);");
    expect(homeSource).toContain("const includeHighlightsInOverview = showCompleteCatalog || hasNarrowingFilter;");
    expect(homeSource).toContain("getEditorialOverviewMusicals(includeHighlightsInOverview, managedMusicals)");
    expect(homeSource).toContain("{dynamicDiscoveryHeadline}");
    expect(homeSource).toContain("onFiltersReset={resetToAdditionalOverview}");
    expect(homeSource).toContain("const resetToAdditionalOverview = useCallback(() => {");
  });

  it("stellt aus einer geteilten Erlebniswelt-URL die vollständige Übersicht wieder her", () => {
    expect(homeSource).toContain("getExperienceCategoryFromSearch(window.location.search)");
    expect(homeSource).toContain("createExperienceCategoryHref(category)");
    expect(homeSource).not.toContain('data-testid="overview-reset-button"');
    expect(homeSource).not.toContain('aria-label="Zurück zur Übersicht"');
    expect(homeSource).not.toContain("<ArrowLeft");
  });

  it("macht den dynamischen Ergebnis-Hinweis zum klickbaren Anker", () => {
    expect(homeSource).toContain('data-testid="result-anchor-link"');
    expect(homeSource).toContain("onClick={scrollToUpdatedResults}");
    expect(homeSource).toContain('aria-label={dynamicResultHint.ariaLabel}');
    expect(homeSource).toContain("group-hover:translate-y-0.5");
    expect(homeSource).toContain('includeHighlightsInOverview ? "mb-6" : "mb-10"');
  });

  it("führt die Ergebnisse mit einer dynamischen, nutzenorientierten Einleitung", () => {
    expect(homeSource).toContain("const dynamicDiscoveryHeadline = selectedExperienceCategory?.discoveryHeadline");
    expect(homeSource).toContain("selectedExperienceCategory.description");
    expect(homeSource).toContain("Entdecke Musicals und Shows in deiner Nähe");
    expect(homeSource).toContain("Entdecke Musicals und Shows, die zu deinem Geschmack passen");
  });

  it("führt Filterklicks nach der Aktualisierung sanft zum Ergebnisbereich", () => {
    expect(homeSource).toContain("const scrollToUpdatedResults = useCallback(() => {");
    expect(homeSource).toContain("window.setTimeout(scrollToFirstResult, 80);");
    expect(homeSource).toContain("const stickyFilterAllowance = 48;");
    expect(homeSource).toContain("const safetyGap = isDesktop ? 16 : 26;");
    expect(homeSource).toContain("- headerHeight - stickyFilterAllowance - safetyGap");
    expect(homeSource).toContain("scrollToUpdatedResults();");
    expect(homeSource).toContain("const dynamicDiscoveryIntro = selectedExperienceCategory");
  });

  it("hält eine kompakte Filterleiste unter dem Header erreichbar", () => {
    expect(homeSource).toContain('data-testid="sticky-filter-bar"');
    expect(homeSource).toContain("const scrollToFilterPanel = useCallback(() => {");
    expect(homeSource).toContain("Array.from(resultGrid.children).filter(");
    expect(homeSource).toContain('child.id.startsWith("musical-")');
    expect(homeSource).toContain("const secondRowCard = resultCards.find((card) => (");
    expect(homeSource).toContain("const secondRowRevealOffset = headerHeight + 24;");
    expect(homeSource).toContain("secondRowCard.getBoundingClientRect().top <= secondRowRevealOffset");
    expect(homeSource).toContain("Filter anpassen");
    expect(homeSource).toContain('aria-label="Filter zurücksetzen"');
  });

  it("unterscheidet im Ergebnis-Hinweis zwischen weiteren, allen und passenden Shows", () => {
    expect(homeSource).toContain("const dynamicResultHint = getDiscoveryResultHint({");
    expect(homeSource).toContain("hasNarrowingFilter,");
    expect(homeSource).toContain("showCompleteCatalog,");
    expect(homeSource).toContain("{dynamicResultHint.text}");
    expect(homeSource).not.toContain('data-testid="results-count-label"');
    expect(filterSource).not.toContain('resultCount');
  });

  it("führt mit einem cremeweißen, klickbaren Ergebnisanker und einem goldenen Pfeil", () => {
    expect(homeSource).toContain('data-testid="result-anchor-link"');
    expect(homeSource).toContain('inline-flex items-center gap-2 text-left text-sm font-semibold text-cream/90');
    expect(homeSource).toContain('<ArrowDown className="h-4 w-4 shrink-0 text-gold');
  });

  it("blendet aktualisierte Teaser dezent und mit reduzierter Bewegungsoption ein", () => {
    expect(homeSource).toContain("const [resultAnimationKey, setResultAnimationKey] = useState(0);");
    expect(homeSource).toContain("const animateUpdatedResults = useCallback(() => {");
    expect(homeSource).toContain("filterAnimationKey={resultAnimationKey || undefined}");
    expect(homeSource).toContain("useReducedMotion");
  });

  it("markiert die aktive Erlebniswelt ruhig und klar", () => {
    expect(filterSource).toContain('"border-2 border-gold bg-transparent text-gold shadow-[0_0_0_1px_rgba(184,148,74,0.35)]"');
    expect(filterSource).not.toContain("theater-light-shine");
    expect(filterSource).not.toContain("shineTrigger");
  });

  it("hält Länder- und Ortsfilter ohne farbige Füllflächen", () => {
    expect(filterSource).toContain('"border-gold text-gold"');
    expect(filterSource).toContain('"border-border/70 text-muted-foreground');
    expect(filterSource).toContain('border border-gold/45 bg-transparent px-4');
    expect(filterSource).toContain('rounded-xl border border-gold/20 bg-transparent');
  });

});
