/**
 * TourDates-Komponente
 * Zeigt alphabetisch sortierte Tourneestädte mit Spielort, Venue, Zeitraum und Tickets-Button
 */

import { MusicalTourDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TourDatesProps {
  tourDates: MusicalTourDate[];
}

export default function TourDates({ tourDates }: TourDatesProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  if (!tourDates || tourDates.length === 0) return null;

  // Alphabetisch sortieren nach Stadt
  const sortedDates = [...tourDates].sort((a, b) =>
    a.city.localeCompare(b.city)
  );

  // Unique Städte für Filter
  const cities = Array.from(new Set(sortedDates.map((d) => d.city)));

  // Filtern wenn eine Stadt ausgewählt ist
  const filteredDates = selectedCity
    ? sortedDates.filter((d) => d.city === selectedCity)
    : sortedDates;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-foreground">
          Spielorte und Termine
        </h2>

        {/* City Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedCity === null ? "default" : "outline"}
            onClick={() => setSelectedCity(null)}
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

        {/* Tour Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDates.map((date, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-card-foreground mb-1">
                  {date.city}
                </h3>
                <p className="text-sm text-card-foreground/70">
                  {date.venue}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-card-foreground/60 mb-1">
                  {formatDate(date.startDate)} – {formatDate(date.endDate)}
                </p>
              </div>

              {/* Tickets Button */}
              <a
                href={date.eventimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block px-4 py-2 font-semibold rounded-sm text-center transition-colors"
                style={{ backgroundColor: 'rgb(239, 68, 68)', color: 'white' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(220, 38, 38)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(239, 68, 68)')}
              >
                Tickets kaufen
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
      </div>
    </section>
  );
}
