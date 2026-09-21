/**
 * TourDates-Komponente
 * - forceDropdown=true  → Dropdown-Select (für Aschenbrödel mit 64 Städten)
 * - forceDropdown=false → Button-Reihe (für Dracula, FJG)
 * Städte mit mehreren Terminen werden in einer einzigen Box zusammengefasst.
 * Alle Termine einer Stadt werden chronologisch untereinander angezeigt.
 * Abgelaufene Termine (endDate < heute) werden automatisch ausgeblendet.
 */
import { MusicalTourDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

interface TourDatesProps {
  tourDates: MusicalTourDate[];
  forceDropdown?: boolean;
  musicalSlug?: string;
  onTicketClick?: (ticketUrl: string) => void;
}

/** Gibt true zurück, wenn das endDate heute oder in der Zukunft liegt.
 * Wenn kein endDate gesetzt ist (z.B. En-suite ohne Enddatum), gilt der Termin immer als zukünftig. */
function isUpcoming(endDate: string | undefined): boolean {
  if (!endDate) return true; // kein Enddatum = dauerhaft gültig
  // Vergleich auf Tagesebene: Termin gilt noch am Veranstaltungstag selbst als gültig
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate + "T00:00:00");
  return end >= today;
}

/** Gruppiert Tourdaten nach Stadt und sortiert Termine innerhalb jeder Stadt chronologisch. */
function groupByCity(tourDates: MusicalTourDate[]): Record<string, MusicalTourDate[]> {
  const result: Record<string, MusicalTourDate[]> = {};
  for (const date of tourDates) {
    if (!result[date.city]) {
      result[date.city] = [];
    }
    result[date.city].push(date);
  }
  // Termine innerhalb jeder Stadt chronologisch sortieren
  for (const city of Object.keys(result)) {
    result[city].sort((a: MusicalTourDate, b: MusicalTourDate) => a.startDate.localeCompare(b.startDate));
  }
  return result;
}
export default function TourDates({
  tourDates,
  forceDropdown = false,
  musicalSlug,
  onTicketClick,
}: TourDatesProps) {
  const [selectedCity, setSelectedCity] = useState<string>("alle");

  if (!tourDates || tourDates.length === 0) return null;

  // Abgelaufene Termine herausfiltern
  const upcomingDates = tourDates.filter((d) => isUpcoming(d.endDate));

  const usesStageProductPage = upcomingDates.some((date) => date.eventimUrl.includes("stage-entertainment.de"));
  const usesAtgTickets = upcomingDates.some((date) => date.eventimUrl.includes("atgtickets.de"));
  const ticketProviderDomain = usesStageProductPage
    ? "stage-entertainment.de"
    : usesAtgTickets
      ? "atgtickets.de"
      : "eventim.de";

  // Wenn alle Termine abgelaufen sind, Abschnitt komplett ausblenden
  if (upcomingDates.length === 0) return null;

  // Städte alphabetisch sortieren (nur noch aus zukünftigen Terminen)
  const allCities = Array.from(
    new Set(upcomingDates.map((d) => d.city))
  ).sort((a, b) => a.localeCompare(b, "de"));

  // Gefilterte Daten nach Stadtauswahl
  const filteredDates =
    selectedCity === "alle"
      ? upcomingDates
      : upcomingDates.filter((d) => d.city === selectedCity);

  // Nach Stadt gruppieren (alphabetisch nach Stadtname sortiert)
  const grouped = groupByCity(filteredDates);
  const sortedCityEntries = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b, "de")
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateRange = (start: string, end?: string) => {
    if (!end) return `Ab ${formatDate(start)}`;
    if (start === end) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <section className="pt-4 md:pt-16 pb-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-foreground">
          Spielorte & Termine
        </h2>

        {/* Stadtfilter – nur bei mehr als einer Stadt anzeigen */}
        {allCities.length > 1 && <div className="mb-8">
          {forceDropdown ? (
            <div className="flex items-center gap-4 flex-wrap">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-64 bg-card border-border text-foreground">
                  <SelectValue placeholder="Stadt auswählen…" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-80 overflow-y-auto">
                  <SelectItem value="alle">
                    Alle Städte ({allCities.length})
                  </SelectItem>
                  {allCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCity !== "alle" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCity("alle")}
                  className="border border-gold/40 text-gold hover:bg-gold/10"
                >
                  Filter zurücksetzen
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCity === "alle" ? "default" : "outline"}
                onClick={() => setSelectedCity("alle")}
                size="sm"
              >
                Alle Städte ({allCities.length})
              </Button>
              {allCities.map((city) => (
                <Button
                  key={city}
                  variant={selectedCity === city ? "default" : "outline"}
                  onClick={() => setSelectedCity(city)}
                  size="sm"
                >
                  {city}
                </Button>
              ))}
            </div>
          )}
        </div>}

        {/* Stadtboxen – eine Box pro Stadt, mehrere Termine untereinander */}
        <div className={forceDropdown ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4 max-w-2xl mx-auto"}>
          {sortedCityEntries.map(([city, dates]) => {
            const firstDate = dates[0];
            return (
              <div
                key={city}
                className="bg-card border border-border rounded-lg p-5 transition-all duration-300 md:hover:border-gold md:hover:shadow-[0_0_0_1px_rgba(218,185,99,0.3)] focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/40"
              >
                {/* Stadtname + optionales Badge */}
                <div className="mb-1 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-card-foreground uppercase tracking-widest font-heading">
                      {city}
                    </h3>
                    {firstDate.badge && (
                      <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                        {firstDate.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Premiere-Badge wenn vorhanden */}
                {firstDate.premiereDate && (
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
                    <Star className="w-3 h-3 fill-gold" />
                    Premiere am {new Date(firstDate.premiereDate + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                )}

                {/* Venue (aus erstem Eintrag – bei gleicher Stadt i.d.R. identisch) */}
                <p className="mb-3 text-sm font-medium leading-snug text-cream/80">
                  {firstDate.venue}
                </p>

                {/* Alle Termine dieser Stadt */}
                <div className="flex flex-col gap-2">
                  {dates.map((date, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <p className="text-sm font-semibold text-gold">
                        {date.displayLabel || formatDateRange(date.startDate, date.endDate)}
                      </p>
                      <a
                        href={date.eventimUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-sm bg-red px-5 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-red-dark"
                        onClick={() => onTicketClick?.(date.eventimUrl)}
                      >
                        Tickets sichern
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {sortedCityEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              Keine Termine für diese Stadt verfügbar.
            </p>
          </div>
        )}

        <div className="mt-8">
          <p className="text-sm text-foreground/60 text-center">
            Weiterleitung zu {ticketProviderDomain} – Affiliate-Links
          </p>
        </div>
      </div>
    </section>
  );
}
