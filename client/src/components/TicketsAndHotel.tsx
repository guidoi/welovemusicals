import { ExternalLink, Hotel } from "lucide-react";
import type { City } from "@/lib/data";
import { HOTEL_EXPERIENCE_PARTNERS } from "@/lib/hotel-experience";

interface TicketsAndHotelProps {
  city: City;
}

export default function TicketsAndHotel({ city }: TicketsAndHotelProps) {
  return (
    <section className="py-12 md:py-16 bg-card/50">
      <div className="container">
        <div className="gold-line mb-10" />
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Übernachtung</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Hotels in {city.name}
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Mach deinen Musical-Besuch in {city.name} zum perfekten Kurzurlaub. Finde passende Hotels in der Nähe der Theater.
        </p>

        <a
          href={city.hotelSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm bg-gold px-8 py-3.5 font-bold text-background transition-colors hover:bg-gold-light"
        >
          <Hotel className="w-4 h-4" />
          Hotels in {city.name} suchen
          <ExternalLink className="w-4 h-4" />
        </a>
        <p className="mt-3 text-xs text-muted-foreground">Über {HOTEL_EXPERIENCE_PARTNERS.accommodation.name} buchen</p>
      </div>
    </section>
  );
}
