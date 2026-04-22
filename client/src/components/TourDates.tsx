/**
 * TourDates-Komponente
 * - forceDropdown=true  → Dropdown-Select (für Aschenbrödel mit 64 Städten)
 * - forceDropdown=false → Button-Reihe (für Dracula, FJG)
 * Alle gefilterten Termine werden immer untereinander gelistet (keine Grid-Spalten).
 */
import { MusicalTourDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface TourDatesProps {
  tourDates: MusicalTourDate[];
  forceDropdown?: boolean;
}

export default function TourDates({ tourDates, forceDropdown = false }: TourDatesProps) {
  const [selectedCity, setSelectedCity] = useState<string>("alle");

  if (!tourDates || tourDates.length === 0) return null;

  const sortedDates = [...tourDates].sort((a, b) =>
    a.city.localeCompare(b.city, "de")
  );

  const cities = Array.from(new Set(sortedDates.map((d) => d.city)));

  const filteredDates =
    selectedCity === "alle"
      ? sortedDates
      : sortedDates.filter((d) => d.city === selectedCity);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateRange = (start: string, end: string) => {
    if (start === end) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-foreground">
          Spielorte und Termine
        </h2>

        <div className="mb-8">
          {forceDropdown ? (
            <div className="flex items-center gap-4 flex-wrap">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-64 bg-card border-border text-foreground">
                  <SelectValue placeholder="Stadt auswählen…" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-80 overflow-y-auto">
                  <SelectItem value="alle">
                    Alle Städte ({cities.length})
                  </SelectItem>
                  {cities.map((city) => (
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
                  className="text-gold border-gold/40 hover:bg-gold/10"
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
                Alle Städte ({cities.length})
              </Button>
              {cities.map((city) => (
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
        </div>

        <div className={forceDropdown ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4 max-w-2xl mx-auto"}>
          {filteredDates.map((date, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-card-foreground mb-1 uppercase tracking-widest font-heading">
                  {date.city}
                </h3>
                <p className="text-sm text-white/80 font-medium leading-snug">
                  {date.venue}
                </p>
                <p className="text-sm text-gold font-semibold mt-1">
                  {formatDateRange(date.startDate, date.endDate)}
                </p>
              </div>
              <a
                href={date.eventimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-5 py-2 font-semibold rounded-sm text-center transition-colors text-white text-sm"
                style={{ backgroundColor: "rgb(239, 68, 68)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(220, 38, 38)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(239, 68, 68)")
                }
              >
                Tickets sichern
              </a>
            </div>
          ))}
        </div>

        {filteredDates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              Keine Termine für diese Stadt verfügbar.
            </p>
          </div>
        )}

        <div className="mt-8">
          <p className="text-sm text-foreground/60 text-center">
            Weiterleitung zu eventim.de – Affiliate-Links
          </p>
        </div>
      </div>
    </section>
  );
}
