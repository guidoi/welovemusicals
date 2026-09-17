import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const filterSource = readFileSync(new URL("../components/MusicalFilters.tsx", import.meta.url), "utf8");

describe("Startseiten-Erlebnisfilter", () => {
  it("nutzt durchgehend sichtbare Erlebniswelten statt technischer Kategorie-Dropdowns", () => {
    expect(homeSource).toContain('rounded-2xl border border-gold/20 bg-card/60');
    expect(filterSource).toContain("Welche Show passt zu dir?");
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
    expect(homeSource).toContain('"Alle Musicals & Shows"');
    expect(homeSource).toContain('"Weitere Musicals & Shows"');
    expect(homeSource).toContain("onFiltersReset={resetToAdditionalOverview}");
    expect(homeSource).toContain("const resetToAdditionalOverview = useCallback(() => {");
  });

  it("stellt aus einer geteilten Erlebniswelt-URL die vollständige Übersicht wieder her", () => {
    expect(homeSource).toContain("getExperienceCategoryFromSearch(window.location.search)");
    expect(homeSource).toContain("createExperienceCategoryHref(category)");
    expect(homeSource).toContain('data-testid="overview-reset-button"');
    expect(homeSource).toContain('aria-label="Zurück zur Übersicht"');
    expect(homeSource).toContain("<ArrowLeft");
  });

  it("ordnet das Rücksprung-Icon unter der Ergebnis-Subline an", () => {
    const sublinePosition = homeSource.indexOf('"Deine passenden Shows – Highlights zuerst."');
    const resetIconPosition = homeSource.indexOf('data-testid="overview-reset-button"');

    expect(resetIconPosition).toBeGreaterThan(sublinePosition);
    expect(homeSource).toContain('includeHighlightsInOverview ? "mb-3" : "mb-10"');
  });

  it("gibt dem Rücksprung-Icon eine dezente Hover-Rückmeldung", () => {
    expect(homeSource).toContain("group-hover:-translate-x-0.5");
    expect(homeSource).toContain("hover:shadow-[0_0_14px_rgba(184,148,74,0.28)]");
    expect(homeSource).toContain("hover:bg-gold/15");
  });

  it("gibt auf Touch-Geräten eine kurze Rückmeldung und vereinheitlicht das Filter-Reset-Icon", () => {
    expect(homeSource).toContain("const triggerResetTouchFeedback = useCallback((pointerType: string) => {");
    expect(homeSource).toContain('if (pointerType !== "touch") return;');
    expect(homeSource).toContain("}, 220);");
    expect(homeSource).toContain("const delay = lastResetInteractionWasTouchRef.current ? 120 : 0;");
    expect(homeSource).toContain("onClick={resetToAdditionalOverviewWithFeedback}");
    expect(homeSource).toContain("onPointerDown={(event) => triggerResetTouchFeedback(event.pointerType)}");
    expect(homeSource).toContain('aria-label="Filter zurücksetzen"');
    expect(homeSource).toContain("group-hover:-translate-x-0.5");
  });

  it("zeigt bei einer aktiven Erlebniswelt nur den Kategorienamen als Überschrift", () => {
    expect(homeSource).toContain("? selectedExperienceCategory.label");
    expect(homeSource).not.toContain("? `Musicals & Shows: ${selectedExperienceCategory.label}`");
  });

  it("führt Filterklicks nach der Aktualisierung sanft zum Ergebnisbereich", () => {
    expect(homeSource).toContain("const scrollToUpdatedResults = useCallback(() => {");
    expect(homeSource).toContain("window.setTimeout(scrollToFirstResult, 80);");
    expect(homeSource).toContain("scrollToUpdatedResults();");
    expect(homeSource).toContain('"Deine passenden Shows – Highlights zuerst."');
  });

  it("hält eine kompakte Filterleiste unter dem Header erreichbar", () => {
    expect(homeSource).toContain('data-testid="sticky-filter-bar"');
    expect(homeSource).toContain("const scrollToFilterPanel = useCallback(() => {");
    expect(homeSource).toContain("setShowStickyFilterBar(panel.getBoundingClientRect().bottom <= headerHeight);");
    expect(homeSource).toContain("Filter anpassen");
    expect(homeSource).toContain('aria-label="Filter zurücksetzen"');
  });

  it("blendet aktualisierte Teaser dezent und mit reduzierter Bewegungsoption ein", () => {
    expect(homeSource).toContain("const [resultAnimationKey, setResultAnimationKey] = useState(0);");
    expect(homeSource).toContain("const animateUpdatedResults = useCallback(() => {");
    expect(homeSource).toContain("filterAnimationKey={resultAnimationKey || undefined}");
    expect(homeSource).toContain("useReducedMotion");
  });
});
