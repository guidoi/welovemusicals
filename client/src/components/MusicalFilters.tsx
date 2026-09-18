/*
 * Experience-led discovery controls for the musical catalogue.
 */
import { useMemo, useState } from "react";
import { Check, ChevronDown, MapPin, Search, X } from "lucide-react";
import { ACTIVE_MUSICAL_IDS, musicals } from "@/lib/data";
import {
  COUNTRY_FILTERS,
  EXPERIENCE_CATEGORIES,
  QUICK_CITY_NAMES,
  type CountryFilter,
  type ExperienceFilterId,
} from "@/lib/experience-categories";
import PlzSearch, { type PlzSearchState } from "@/components/PlzSearch";

const AT_CITIES = new Set(["Graz", "Wien", "Innsbruck", "Linz", "Bad Ischl", "Dornbirn", "Ried im Innkreis", "Vöcklabruck", "Puch bei Salzburg", "Feldkirch", "Salzburg"]);
const CH_CITIES = new Set(["Zürich", "Basel", "Bern", "Genève", "Lausanne", "Luzern", "St. Gallen"]);

function getCityCountry(city: string): Exclude<CountryFilter, "alle"> {
  if (AT_CITIES.has(city)) return "at";
  if (CH_CITIES.has(city)) return "ch";
  return "de";
}

const allFilterCities = (() => {
  const citySet = new Set<string>();
  musicals
    .filter((musical) => ACTIVE_MUSICAL_IDS.includes(musical.id))
    .forEach((musical) => {
      if (musical.city) citySet.add(musical.city);
      musical.cities?.forEach((city) => citySet.add(city));
      musical.tourDates?.forEach((tourDate) => citySet.add(tourDate.city));
    });
  return Array.from(citySet).sort((a, b) => a.localeCompare(b, "de"));
})();

interface MusicalFiltersProps {
  categoryFilter: ExperienceFilterId;
  setCategoryFilter: (category: ExperienceFilterId) => void;
  countryFilter: CountryFilter;
  setCountryFilter: (country: CountryFilter) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  plzSearch: PlzSearchState;
  setPlzSearch: (state: PlzSearchState) => void;
  onFiltersReset?: () => void;
}

const basePillClass = "rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]";

export default function MusicalFilters({
  categoryFilter,
  setCategoryFilter,
  countryFilter,
  setCountryFilter,
  cityFilter,
  setCityFilter,
  plzSearch,
  setPlzSearch,
  onFiltersReset,
}: MusicalFiltersProps) {
  const [cityPanelOpen, setCityPanelOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [plzPanelOpen, setPlzPanelOpen] = useState(false);
  const filteredCities = useMemo(() => {
    const normalizedQuery = cityQuery.trim().toLocaleLowerCase("de");
    return allFilterCities.filter((city) => {
      const countryMatches = countryFilter === "alle" || getCityCountry(city) === countryFilter;
      return countryMatches && (!normalizedQuery || city.toLocaleLowerCase("de").includes(normalizedQuery));
    });
  }, [cityQuery, countryFilter]);

  const selectCity = (city: string) => {
    setCityFilter(city);
    setCityPanelOpen(false);
    setCityQuery("");
  };

  const handleCountryChange = (country: CountryFilter) => {
    setCountryFilter(country);
    if (cityFilter !== "alle" && country !== "alle" && getCityCountry(cityFilter) !== country) {
      setCityFilter("alle");
    }
  };

  const resetFilters = () => {
    setCategoryFilter("alle");
    setCountryFilter("alle");
    setCityFilter("alle");
    setPlzSearch({ active: false, plz: "", radius: 50, originCoords: null });
    setCityQuery("");
    onFiltersReset?.();
  };

  const hasActiveFilter = categoryFilter !== "alle" || countryFilter !== "alle" || cityFilter !== "alle" || plzSearch.active;
  const visibleQuickCities = QUICK_CITY_NAMES.filter((city) => countryFilter === "alle" || getCityCountry(city) === countryFilter);

  return (
    <section aria-labelledby="discover-filter-heading" className="space-y-5" data-testid="experience-filters">
      <div>
        <h3 id="discover-filter-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          Erlebniswelt
        </h3>
      </div>

      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Musical-Kategorie">
          <button
            type="button"
            onClick={() => setCategoryFilter("alle")}
            className={`${basePillClass} ${categoryFilter === "alle" ? "border-2 border-gold bg-transparent text-gold shadow-[0_0_0_1px_rgba(184,148,74,0.35)]" : "border-gold/45 bg-card/60 text-gold hover:border-gold hover:bg-gold/10"}`}
            aria-pressed={categoryFilter === "alle"}
          >
            Alle Shows
          </button>
          {EXPERIENCE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryFilter(category.id)}
              title={category.description}
              className={`${basePillClass} ${categoryFilter === category.id ? "border-2 border-gold bg-transparent text-gold shadow-[0_0_0_1px_rgba(184,148,74,0.35)]" : "border-gold/45 bg-card/60 text-gold hover:border-gold hover:bg-gold/10"}`}
              aria-pressed={categoryFilter === category.id}
            >
              <span className="sm:hidden">{category.shortLabel}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 border-t border-gold/15 pt-5 lg:grid-cols-[auto,minmax(0,1fr)] lg:items-start">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Land</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Land auswählen">
            {COUNTRY_FILTERS.map((country) => (
              <button
                key={country.id}
                type="button"
                onClick={() => handleCountryChange(country.id)}
                className={`${basePillClass} bg-transparent px-3 py-1.5 text-xs ${countryFilter === country.id ? "border-gold text-gold" : "border-border/70 text-muted-foreground hover:border-gold/50 hover:text-gold"}`}
                aria-pressed={countryFilter === country.id}
              >
                {country.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative lg:justify-self-end">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Ort</p>
          <button
            type="button"
            onClick={() => setCityPanelOpen((open) => !open)}
            className="inline-flex min-h-10 w-full items-center justify-between gap-3 rounded-full border border-gold/45 bg-transparent px-4 text-sm text-foreground transition-all duration-150 hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:min-w-72 lg:w-80"
            aria-expanded={cityPanelOpen}
            aria-controls="city-finder-panel"
          >
            <span className="flex min-w-0 items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="truncate">{cityFilter === "alle" ? "Ort finden" : cityFilter}</span>
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-gold transition-transform duration-150 ${cityPanelOpen ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>

          {cityPanelOpen && (
            <div id="city-finder-panel" className="absolute right-0 z-50 mt-2 w-full min-w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-gold/35 bg-card p-4 shadow-2xl shadow-black/45 sm:w-[26rem]" data-testid="city-finder-panel">
              <label className="sr-only" htmlFor="city-finder-search">Stadt eingeben</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 focus-within:border-gold">
                <Search className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <input
                  id="city-finder-search"
                  autoFocus
                  value={cityQuery}
                  onChange={(event) => setCityQuery(event.target.value)}
                  placeholder="Stadt eingeben"
                  className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                {cityQuery && (
                  <button type="button" onClick={() => setCityQuery("")} aria-label="Stadtsuche leeren" className="text-muted-foreground hover:text-gold">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {!cityQuery && (
                <>
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Beliebte Musical-Städte</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {visibleQuickCities.map((city) => (
                      <button key={city} type="button" onClick={() => selectCity(city)} className="rounded-full border border-gold/35 bg-transparent px-3 py-1.5 text-xs font-medium text-gold transition-colors hover:border-gold hover:text-gold-light">
                        {city}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-4 max-h-48 overflow-y-auto border-t border-border/60 pt-2" role="listbox" aria-label="Gefundene Städte">
                <button type="button" onClick={() => selectCity("alle")} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground transition-colors hover:text-gold">
                  {cityFilter === "alle" ? <Check className="h-4 w-4 text-gold" /> : <span className="h-4 w-4" />}
                  Alle Städte
                </button>
                {filteredCities.map((city) => (
                  <button key={city} type="button" onClick={() => selectCity(city)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground transition-colors hover:text-gold" role="option" aria-selected={cityFilter === city}>
                    {cityFilter === city ? <Check className="h-4 w-4 text-gold" /> : <MapPin className="h-4 w-4 text-gold/70" />}
                    {city}
                  </button>
                ))}
                {filteredCities.length === 0 && <p className="px-2 py-3 text-sm text-muted-foreground">Keine Stadt gefunden.</p>}
              </div>

              <div className="mt-4 rounded-xl border border-gold/20 bg-transparent">
                <button type="button" onClick={() => setPlzPanelOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-gold">
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{plzSearch.active ? `Im Umkreis von ${plzSearch.radius} km` : "In meiner Nähe"}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${plzPanelOpen ? "rotate-180" : ""}`} />
                </button>
                {plzPanelOpen && <div className="border-t border-gold/20 p-3"><PlzSearch state={plzSearch} onChange={setPlzSearch} compact /></div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {hasActiveFilter && (
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <p className="text-sm text-muted-foreground">Deine Auswahl ist aktiv.</p>
          <button type="button" onClick={resetFilters} className="text-sm font-medium text-gold underline-offset-4 transition-colors hover:text-gold-light hover:underline">
            Filter zurücksetzen
          </button>
        </div>
      )}
    </section>
  );
}
