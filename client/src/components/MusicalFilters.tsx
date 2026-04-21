/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalFilters: Erweiterte Filter-Komponente für Musicals nach Kategorie, Anbieter, Stadt und Sortierung
 */
import { useState } from "react";
import { ChevronDown, MapPin, Calendar, Filter } from "lucide-react";
import { musicals, ACTIVE_MUSICAL_IDS, providers, type Musical } from "@/lib/data";

// Alle Städte aus aktiven Musicals (m.city + tourDates), alphabetisch sortiert
const allFilterCities = (() => {
  const activeMusicals = musicals.filter((m) => ACTIVE_MUSICAL_IDS.includes(m.id));
  const citySet = new Set<string>();
  activeMusicals.forEach((m) => {
    if (m.city) citySet.add(m.city);
    if (m.tourDates) m.tourDates.forEach((t) => citySet.add(t.city));
  });
  return Array.from(citySet).sort((a, b) => a.localeCompare(b, "de"));
})();

export type FilterCategory = "alle" | "fester-standort" | "tournee" | "erwachsene" | "familie" | "kinder";
export type SortOption = "name" | "featured" | "date";

interface MusicalFiltersProps {
  categoryFilter: FilterCategory;
  setCategoryFilter: (cat: FilterCategory) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  resultCount: number;
}

export default function MusicalFilters({
  categoryFilter,
  setCategoryFilter,
  cityFilter,
  setCityFilter,
  sortOption,
  setSortOption,
  resultCount,
}: MusicalFiltersProps) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const categoryLabels: Record<FilterCategory, string> = {
    alle: "Alle Kategorien",
    "fester-standort": "Fester Standort",
    tournee: "Tournee",
    erwachsene: "Erwachsene",
    familie: "Familie",
    kinder: "Kinder",
  };

  const sortLabels: Record<SortOption, string> = {
    name: "Nach Name",
    featured: "Empfehlungen zuerst",
    date: "Nach Datum",
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gold" />
        <h3 className="font-display text-lg font-semibold text-foreground">Filter & Sortierung</h3>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* City Filter */}
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
            <MapPin className="w-3 h-3 inline mr-1" />
            Städte
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
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-border/50 transition-colors ${
                    cityFilter === "alle" ? "bg-gold/10 text-gold font-semibold" : "text-foreground"
                  }`}
                >
                  Alle Städte
                </button>
                {allFilterCities.map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => {
                      setCityFilter(cityName);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-border/50 transition-colors flex items-center gap-2 ${
                      cityFilter === cityName
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {cityName}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          cityFilter !== "alle" ||
          sortOption !== "featured") && (
          <button
            onClick={() => {
              setCategoryFilter("alle");
              setCityFilter("alle");
              setSortOption("featured");
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
