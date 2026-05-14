/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalFilters: Erweiterte Filter-Komponente für Musicals nach Land, Kategorie, Stadt und Sortierung
 */
import { useState, useMemo } from "react";
import { ChevronDown, MapPin, Calendar, Filter, Globe } from "lucide-react";
import { musicals, ACTIVE_MUSICAL_IDS } from "@/lib/data";
import PlzSearch, { type PlzSearchState } from "@/components/PlzSearch";

// Österreichische Städte
const AT_CITIES = new Set(["Graz", "Wien", "Innsbruck", "Linz", "Bad Ischl", "Dornbirn", "Ried im Innkreis", "Vöcklabruck", "Puch bei Salzburg", "Feldkirch", "Salzburg"]);
// Schweizer Städte
const CH_CITIES = new Set(["Zürich", "Basel", "Bern", "Genève", "Lausanne", "Luzern", "St. Gallen"]);

function getCityCountry(city: string): "at" | "ch" | "de" {
  if (AT_CITIES.has(city)) return "at";
  if (CH_CITIES.has(city)) return "ch";
  return "de";
}

// Alle Städte aus aktiven Musicals (m.city + tourDates), alphabetisch sortiert
const allFilterCities = (() => {
  const activeMusicals = musicals.filter((m) => ACTIVE_MUSICAL_IDS.includes(m.id));
  const citySet = new Set<string>();
  activeMusicals.forEach((m) => {
    if (m.city) citySet.add(m.city);
    if (m.cities) m.cities.forEach((c) => citySet.add(c));
    if (m.tourDates) m.tourDates.forEach((t) => citySet.add(t.city));
  });
  return Array.from(citySet).sort((a, b) => a.localeCompare(b, "de"));
})();

export type FilterCategory = "alle" | "fester-standort" | "tournee" | "erwachsene" | "familie" | "kinder";
export type SortOption = "name" | "featured" | "date";
export type CountryFilter = "alle" | "de" | "at" | "ch";

interface MusicalFiltersProps {
  categoryFilter: FilterCategory;
  setCategoryFilter: (cat: FilterCategory) => void;
  countryFilter: CountryFilter;
  setCountryFilter: (country: CountryFilter) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  plzSearch: PlzSearchState;
  setPlzSearch: (state: PlzSearchState) => void;
  resultCount: number;
}

export default function MusicalFilters({
  categoryFilter,
  setCategoryFilter,
  countryFilter,
  setCountryFilter,
  cityFilter,
  setCityFilter,
  sortOption,
  setSortOption,
  plzSearch,
  setPlzSearch,
  resultCount,
}: MusicalFiltersProps) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showPlzAccordion, setShowPlzAccordion] = useState(false);

  // Städte nach gewähltem Land filtern
  const filteredCities = useMemo(() => {
    if (countryFilter === "alle") return allFilterCities;
    return allFilterCities.filter((city) => getCityCountry(city) === countryFilter);
  }, [countryFilter]);

  // Wenn das gewählte Land wechselt und die aktuelle Stadt nicht mehr passt → zurücksetzen
  const handleCountryChange = (newCountry: CountryFilter) => {
    setCountryFilter(newCountry);
    if (cityFilter !== "alle" && newCountry !== "alle") {
      const cityCountry = getCityCountry(cityFilter);
      if (cityCountry !== newCountry) {
        setCityFilter("alle");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gold" />
        <h3 className="font-display text-lg font-semibold text-foreground">Filter & Sortierung</h3>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Country Filter */}
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
            <Globe className="w-3 h-3 inline mr-1" />
            Land
          </label>
          <select
            value={countryFilter}
            onChange={(e) => handleCountryChange(e.target.value as CountryFilter)}
            className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-card text-foreground focus:border-gold outline-none transition-colors"
          >
            <option value="alle">Alle Länder</option>
            <option value="de">🇩🇪 Deutschland</option>
            <option value="at">🇦🇹 Österreich</option>
            <option value="ch">🇨🇭 Schweiz</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Kategorie
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)}
            className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-card text-foreground focus:border-gold outline-none transition-colors"
          >
            <option value="alle">Alle Kategorien</option>
            <option value="fester-standort">Fester Standort</option>
            <option value="tournee">Tournee</option>
            <option value="erwachsene">Erwachsene</option>
            <option value="familie">Familie</option>
            <option value="kinder">Kinder</option>
          </select>
        </div>

        {/* City Filter + PLZ-Umkreissuche */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
            <MapPin className="w-3 h-3 inline mr-1" />
            Stadt / Umkreis
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-card text-foreground hover:border-gold/40 transition-colors flex items-center justify-between"
            >
              <span className="truncate">
                {cityFilter === "alle" ? "Alle Städte" : cityFilter}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showCityDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showCityDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-sm shadow-lg z-50 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setCityFilter("alle");
                    setShowCityDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-border/50 transition-colors ${cityFilter === "alle" ? "font-semibold" : "text-foreground"}`}
                  style={cityFilter === "alle" ? {backgroundColor: 'rgba(184,148,74,0.12)', color: '#b8944a'} : {}}
                >
                  Alle Städte {countryFilter !== "alle" && <span className="text-xs opacity-60">({filteredCities.length})</span>}
                </button>
                {filteredCities.map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => {
                      setCityFilter(cityName);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-border/50 transition-colors flex items-center gap-2 ${cityFilter === cityName ? "font-semibold" : "text-foreground"}`}
                    style={cityFilter === cityName ? {backgroundColor: 'rgba(184,148,74,0.12)', color: '#b8944a'} : {}}
                  >
                    <MapPin className="w-3 h-3" />
                    {cityName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PLZ-Umkreissuche – Akkordeon direkt unter Stadt */}
          <div className="mt-2 border border-border/50 rounded-sm overflow-hidden">
            <button
              onClick={() => setShowPlzAccordion(!showPlzAccordion)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                plzSearch.active
                  ? "bg-gold/10 text-gold border-b border-gold/20"
                  : "bg-card text-gold/70 hover:text-gold hover:bg-gold/5"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                <span className="font-medium">
                  {plzSearch.active
                    ? `Umkreis ${plzSearch.radius} km um ${plzSearch.plz}`
                    : "oder per Umkreis suchen"}
                </span>
                {plzSearch.active && (
                  <span className="text-xs bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">aktiv</span>
                )}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showPlzAccordion ? "rotate-180" : ""
                }`}
              />
            </button>
            {showPlzAccordion && (
              <div className="p-3 bg-card/50 border-t border-border/30">
                <PlzSearch state={plzSearch} onChange={setPlzSearch} compact />
              </div>
            )}
          </div>
        </div>

        {/* Sort Option */}
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
            <Calendar className="w-3 h-3 inline mr-1" />
            Sortierung
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-card text-foreground focus:border-gold outline-none transition-colors"
          >
            <option value="featured">Empfehlungen zuerst</option>
            <option value="name">Nach Name (A–Z)</option>
            <option value="date">Nach Datum (früheste Vorstellung)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <p className="text-sm text-muted-foreground">
          <span className="text-gold font-semibold">{resultCount}</span>{" "}
          {resultCount === 1 ? "Ergebnis" : "Ergebnisse"}
        </p>
        {(categoryFilter !== "alle" ||
          countryFilter !== "alle" ||
          cityFilter !== "alle" ||
          sortOption !== "featured" ||
          plzSearch.active) && (
          <button
            onClick={() => {
              setCategoryFilter("alle");
              setCountryFilter("alle");
              setCityFilter("alle");
              setSortOption("featured");
              setPlzSearch({ active: false, plz: "", radius: 50, originCoords: null });
            }}
            className="text-xs text-gold hover:text-gold-light transition-colors underline"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
